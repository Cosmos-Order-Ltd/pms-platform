#!/bin/bash

# Proxmox VM Setup Script for PMS Platform
# Creates and configures VM for Kubernetes deployment

set -euo pipefail

# Configuration
VM_ID=${VM_ID:-200}
VM_NAME=${VM_NAME:-"pms-k8s"}
VM_MEMORY=${VM_MEMORY:-24576}  # 24GB
VM_CORES=${VM_CORES:-16}
VM_DISK_SIZE=${VM_DISK_SIZE:-300}  # 300GB
VM_STORAGE=${VM_STORAGE:-"local-lvm"}
VM_BRIDGE=${VM_BRIDGE:-"vmbr0"}
VM_IP=${VM_IP:-"192.168.1.100"}
VM_GATEWAY=${VM_GATEWAY:-"192.168.1.1"}
VM_DNS=${VM_DNS:-"8.8.8.8,1.1.1.1"}
ISO_PATH=${ISO_PATH:-"local:iso/ubuntu-22.04.3-live-server-amd64.iso"}
SSH_KEY_FILE=${SSH_KEY_FILE:-"~/.ssh/id_rsa.pub"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Proxmox
check_proxmox() {
    if ! command -v qm &> /dev/null; then
        log_error "This script must be run on a Proxmox server"
        exit 1
    fi
}

# Check if VM ID already exists
check_vm_exists() {
    if qm list | grep -q "^${VM_ID}"; then
        log_error "VM ID ${VM_ID} already exists"
        log_info "Use 'qm destroy ${VM_ID}' to remove existing VM"
        exit 1
    fi
}

# Download Ubuntu ISO if not exists
download_iso() {
    local iso_name=$(basename "$ISO_PATH")
    local storage=$(echo "$ISO_PATH" | cut -d: -f1)

    log_info "Checking for Ubuntu ISO..."

    if ! pvesm list "$storage" --content iso | grep -q "$iso_name"; then
        log_info "Downloading Ubuntu 22.04 ISO..."
        wget -P /var/lib/vz/template/iso/ \
            https://releases.ubuntu.com/22.04/ubuntu-22.04.3-live-server-amd64.iso
        log_success "ISO downloaded successfully"
    else
        log_info "Ubuntu ISO already exists"
    fi
}

# Create VM
create_vm() {
    log_info "Creating VM ${VM_ID} (${VM_NAME})..."

    qm create ${VM_ID} \
        --name "${VM_NAME}" \
        --memory ${VM_MEMORY} \
        --cores ${VM_CORES} \
        --sockets 1 \
        --cpu host \
        --kvm 1 \
        --machine q35 \
        --bios ovmf \
        --boot order=scsi0 \
        --scsi0 ${VM_STORAGE}:${VM_DISK_SIZE},format=qcow2,ssd=1,iothread=1 \
        --scsihw virtio-scsi-pci \
        --net0 virtio,bridge=${VM_BRIDGE},firewall=1 \
        --ide2 ${ISO_PATH},media=cdrom \
        --agent enabled=1,fstrim_cloned_disks=1 \
        --tablet 0 \
        --vga serial0 \
        --serial0 socket,server=1

    log_success "VM ${VM_ID} created successfully"
}

# Configure VM for nested virtualization (required for Docker)
configure_nested_virt() {
    log_info "Enabling nested virtualization..."

    qm set ${VM_ID} --cpu host,flags=+aes

    log_success "Nested virtualization enabled"
}

# Create cloud-init configuration
create_cloud_init() {
    log_info "Creating cloud-init configuration..."

    # Read SSH public key
    if [[ -f "$SSH_KEY_FILE" ]]; then
        SSH_KEY=$(cat "$SSH_KEY_FILE")
    else
        log_error "SSH key file not found: $SSH_KEY_FILE"
        log_info "Generate SSH key with: ssh-keygen -t rsa -b 4096"
        exit 1
    fi

    # Create cloud-init configuration
    cat > /tmp/user-data-${VM_ID} << EOF
#cloud-config
hostname: ${VM_NAME}
manage_etc_hosts: true

users:
  - name: pms
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - ${SSH_KEY}
    groups: sudo,docker

packages:
  - curl
  - wget
  - git
  - htop
  - vim
  - unzip
  - apt-transport-https
  - ca-certificates
  - gnupg
  - lsb-release

runcmd:
  # Update system
  - apt-get update && apt-get upgrade -y

  # Install Docker
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  - echo "deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  - apt-get update
  - apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  - usermod -aG docker pms
  - systemctl enable docker
  - systemctl start docker

  # Configure system for Kubernetes
  - echo 'net.bridge.bridge-nf-call-iptables = 1' >> /etc/sysctl.conf
  - echo 'net.bridge.bridge-nf-call-ip6tables = 1' >> /etc/sysctl.conf
  - echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
  - sysctl -p

  # Disable swap
  - swapoff -a
  - sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

  # Install kubectl
  - curl -LO "https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  - install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

  # Install Helm
  - curl https://get.helm.sh/helm-v3.13.0-linux-amd64.tar.gz | tar xz
  - mv linux-amd64/helm /usr/local/bin/

  # Set up firewall
  - ufw allow 22/tcp
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - ufw allow 6443/tcp
  - ufw allow 2379:2380/tcp
  - ufw allow 10250:10252/tcp
  - ufw allow 30000:32767/tcp
  - ufw --force enable

  # Reboot to apply all changes
  - reboot

power_state:
  delay: "+1"
  mode: reboot
  message: "Rebooting after cloud-init setup"
EOF

    # Apply cloud-init configuration
    qm set ${VM_ID} --cicustom "user=local:snippets/user-data-${VM_ID}"

    # Copy user-data to snippets directory
    cp /tmp/user-data-${VM_ID} /var/lib/vz/snippets/

    log_success "Cloud-init configuration created"
}

# Configure network
configure_network() {
    log_info "Configuring network..."

    qm set ${VM_ID} \
        --ipconfig0 ip=${VM_IP}/24,gw=${VM_GATEWAY} \
        --nameserver ${VM_DNS}

    log_success "Network configuration applied"
}

# Display VM information
display_vm_info() {
    log_success "VM ${VM_ID} (${VM_NAME}) setup completed!"
    echo
    echo "VM Configuration:"
    echo "  - VM ID: ${VM_ID}"
    echo "  - Name: ${VM_NAME}"
    echo "  - Memory: ${VM_MEMORY} MB"
    echo "  - Cores: ${VM_CORES}"
    echo "  - Disk: ${VM_DISK_SIZE} GB"
    echo "  - IP: ${VM_IP}"
    echo "  - Gateway: ${VM_GATEWAY}"
    echo
    echo "Next steps:"
    echo "  1. Start the VM: qm start ${VM_ID}"
    echo "  2. Connect via SSH: ssh pms@${VM_IP}"
    echo "  3. Run the k3s installation script"
    echo
    echo "Useful commands:"
    echo "  - View VM status: qm status ${VM_ID}"
    echo "  - Stop VM: qm stop ${VM_ID}"
    echo "  - Start VM: qm start ${VM_ID}"
    echo "  - Connect to console: qm terminal ${VM_ID}"
}

# Alternative: Create LXC container instead of VM
create_lxc() {
    log_info "Creating LXC container ${VM_ID} (${VM_NAME})..."

    # Download Ubuntu template if needed
    if ! pveam list local | grep -q "ubuntu-22.04"; then
        log_info "Downloading Ubuntu 22.04 LXC template..."
        pveam download local ubuntu-22.04-standard_22.04-1_amd64.tar.zst
    fi

    # Create LXC container
    pct create ${VM_ID} local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
        --hostname ${VM_NAME} \
        --memory ${VM_MEMORY} \
        --cores ${VM_CORES} \
        --rootfs ${VM_STORAGE}:${VM_DISK_SIZE} \
        --net0 name=eth0,bridge=${VM_BRIDGE},ip=${VM_IP}/24,gw=${VM_GATEWAY} \
        --nameserver ${VM_DNS} \
        --features nesting=1,keyctl=1 \
        --unprivileged 1 \
        --ssh-public-keys ${SSH_KEY_FILE}

    log_success "LXC container ${VM_ID} created successfully"
}

# Main execution
main() {
    log_info "Starting Proxmox VM setup for PMS Platform"

    check_proxmox
    check_vm_exists

    if [[ "${1:-}" == "--lxc" ]]; then
        create_lxc
    else
        download_iso
        create_vm
        configure_nested_virt
        create_cloud_init
        configure_network
    fi

    display_vm_info
}

# Help function
show_help() {
    cat << EOF
Proxmox VM Setup Script for PMS Platform

Usage: $0 [OPTIONS]

Options:
    --lxc                   Create LXC container instead of VM (more efficient)
    -h, --help             Show this help message

Environment Variables:
    VM_ID                  VM/Container ID (default: 200)
    VM_NAME                VM/Container name (default: pms-k8s)
    VM_MEMORY              Memory in MB (default: 24576)
    VM_CORES               CPU cores (default: 16)
    VM_DISK_SIZE           Disk size in GB (default: 300)
    VM_STORAGE             Storage pool (default: local-lvm)
    VM_BRIDGE              Network bridge (default: vmbr0)
    VM_IP                  Static IP address (default: 192.168.1.100)
    VM_GATEWAY             Gateway IP (default: 192.168.1.1)
    VM_DNS                 DNS servers (default: 8.8.8.8,1.1.1.1)
    SSH_KEY_FILE           SSH public key file (default: ~/.ssh/id_rsa.pub)

Examples:
    # Create VM with default settings
    ./proxmox-vm-setup.sh

    # Create LXC container
    ./proxmox-vm-setup.sh --lxc

    # Create VM with custom settings
    VM_ID=201 VM_IP=192.168.1.101 ./proxmox-vm-setup.sh

EOF
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac