#!/bin/bash

# Windows-Compatible CT101 Internet Connection Script
# Uses SSH without sshpass for Windows environments

set -euo pipefail

# Configuration
PROXMOX_HOST="192.168.30.205"
PROXMOX_USER="root"
LXC_ID="101"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${PURPLE}[STEP]${NC} $1"; }

# Function to execute SSH commands (will prompt for password)
ssh_exec() {
    local command="$1"
    local description="${2:-Executing command}"

    log_info "$description"
    echo "SSH Command: $command"
    echo "You will be prompted for the root password: \$erb!234"

    ssh -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$PROXMOX_USER@$PROXMOX_HOST" \
        "$command"
}

# Function to execute commands inside LXC container
lxc_exec() {
    local command="$1"
    local description="${2:-Executing LXC command}"

    log_info "$description"
    echo "LXC Command: $command"
    echo "You will be prompted for the root password: \$erb!234"

    ssh -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$PROXMOX_USER@$PROXMOX_HOST" \
        "pct exec $LXC_ID -- bash -c '$command'"
}

# Main setup function
setup_ct101_internet() {
    log_step "Starting CT101 Internet Connection Setup"
    echo

    log_info "This script will guide you through connecting CT101 to the internet."
    log_info "You will be prompted for the SSH password multiple times: \$erb!234"
    echo

    read -p "Press Enter to continue or Ctrl+C to cancel..."
    echo

    # Step 1: Test SSH connection
    log_step "Step 1: Testing SSH connection to Proxmox"
    if ssh_exec "echo 'SSH connection successful'" "Testing SSH connection"; then
        log_success "SSH connection verified"
    else
        log_error "SSH connection failed"
        return 1
    fi
    echo

    # Step 2: Check container status
    log_step "Step 2: Checking LXC container CT$LXC_ID"
    local status
    status=$(ssh_exec "pct status $LXC_ID" "Getting container status" | awk '{print $2}')

    echo "Container status: $status"

    if [[ "$status" != "running" ]]; then
        log_warning "Starting container CT$LXC_ID..."
        ssh_exec "pct start $LXC_ID" "Starting container"
        sleep 10
        log_success "Container started"
    else
        log_success "Container is already running"
    fi
    echo

    # Step 3: Enable IP forwarding
    log_step "Step 3: Configuring host networking"
    ssh_exec "echo 1 > /proc/sys/net/ipv4/ip_forward" "Enabling IP forwarding"
    ssh_exec "echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf" "Making IP forwarding persistent"
    log_success "IP forwarding enabled"
    echo

    # Step 4: Configure NAT
    log_step "Step 4: Setting up NAT/masquerading"
    local main_iface
    main_iface=$(ssh_exec "ip route | grep default | awk '{print \$5}' | head -1" "Getting main interface")
    log_info "Main interface: $main_iface"

    ssh_exec "iptables -t nat -A POSTROUTING -o $main_iface -j MASQUERADE" "Adding NAT rule"
    ssh_exec "iptables-save > /etc/iptables/rules.v4 2>/dev/null || true" "Saving iptables rules"
    log_success "NAT configured"
    echo

    # Step 5: Configure container network
    log_step "Step 5: Configuring container network"

    # Get host bridge IP
    local host_ip
    host_ip=$(ssh_exec "ip addr show vmbr0 | grep 'inet ' | awk '{print \$2}' | cut -d'/' -f1" "Getting host bridge IP")
    log_info "Host bridge IP: $host_ip"

    # Configure container networking
    lxc_exec "dhclient eth0" "Configuring DHCP"
    sleep 5

    # Configure DNS
    lxc_exec "echo 'nameserver 8.8.8.8' > /etc/resolv.conf" "Setting primary DNS"
    lxc_exec "echo 'nameserver 1.1.1.1' >> /etc/resolv.conf" "Setting secondary DNS"
    lxc_exec "echo 'nameserver $host_ip' >> /etc/resolv.conf" "Setting local DNS"

    log_success "Container network configured"
    echo

    # Step 6: Test connectivity
    log_step "Step 6: Testing internet connectivity"

    if lxc_exec "ping -c 3 8.8.8.8" "Testing ping to Google DNS"; then
        log_success "Ping test successful"
    else
        log_error "Ping test failed"
    fi

    if lxc_exec "nslookup google.com" "Testing DNS resolution"; then
        log_success "DNS resolution successful"
    else
        log_error "DNS resolution failed"
    fi

    echo
    log_success "CT101 Internet Connection Setup Completed!"
    echo
    echo "Your container should now have internet access."
    echo "To verify:"
    echo "  1. SSH to Proxmox: ssh root@$PROXMOX_HOST"
    echo "  2. Enter container: pct enter $LXC_ID"
    echo "  3. Test internet: ping google.com"
}

# Show current status
show_status() {
    log_step "CT101 Current Status"
    echo

    echo "=== Container Status ==="
    ssh_exec "pct status $LXC_ID" "Getting container status"

    echo -e "\n=== Container Configuration ==="
    ssh_exec "pct config $LXC_ID" "Getting container config"

    echo -e "\n=== Container Network ==="
    if ssh_exec "pct status $LXC_ID | grep -q running" "Checking if running"; then
        lxc_exec "ip addr show" "Getting container network interfaces"
        echo
        lxc_exec "ip route show" "Getting container routing"
        echo
        lxc_exec "cat /etc/resolv.conf" "Getting container DNS"
    else
        echo "Container is not running"
    fi
}

# Test connectivity only
test_connectivity() {
    log_step "Testing CT101 Internet Connectivity"
    echo

    if ! ssh_exec "pct status $LXC_ID | grep -q running" "Checking container status"; then
        log_error "Container CT$LXC_ID is not running"
        return 1
    fi

    echo "=== Basic Connectivity Tests ==="

    if lxc_exec "ping -c 3 8.8.8.8" "Testing ping to Google DNS"; then
        log_success "✓ Ping test passed"
    else
        log_error "✗ Ping test failed"
    fi

    if lxc_exec "nslookup google.com" "Testing DNS resolution"; then
        log_success "✓ DNS resolution passed"
    else
        log_error "✗ DNS resolution failed"
    fi

    if lxc_exec "timeout 10 nc -z google.com 80 2>/dev/null" "Testing HTTP connectivity"; then
        log_success "✓ HTTP connectivity passed"
    else
        log_warning "⚠ HTTP connectivity test failed (nc might not be installed)"
    fi

    echo
    log_info "Connectivity tests completed"
}

# Show help
show_help() {
    cat << EOF
CT101 Internet Connection Script (Windows Compatible)

This script connects LXC container CT101 to the internet via SSH.
Note: You will be prompted for the SSH password multiple times.

Usage: $0 [COMMAND]

Commands:
    setup       Setup internet connection (default)
    status      Show current container status
    test        Test internet connectivity only
    help        Show this help

SSH Details:
    Host: $PROXMOX_HOST
    User: $PROXMOX_USER
    Password: \$erb!234

What this script does:
1. Tests SSH connection to Proxmox
2. Checks and starts CT101 if needed
3. Enables IP forwarding on host
4. Configures NAT/masquerading
5. Sets up container networking with DHCP
6. Configures DNS servers
7. Tests internet connectivity

Prerequisites:
- SSH client (available in Windows 10+)
- Network access to Proxmox server
- LXC container CT101 must exist

EOF
}

# Main execution
case "${1:-setup}" in
    setup)
        setup_ct101_internet
        ;;
    status)
        show_status
        ;;
    test)
        test_connectivity
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac