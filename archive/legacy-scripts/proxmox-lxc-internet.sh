#!/bin/bash

# Proxmox LXC Internet Connection Script
# Connects CT101 LXC container to the internet via SSH

set -euo pipefail

# Configuration
PROXMOX_HOST="192.168.30.205"
PROXMOX_PORT="22"
PROXMOX_USER="root"
PROXMOX_PASSWORD='$erb!234'
LXC_ID="101"

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

# Function to execute SSH commands
ssh_exec() {
    local command="$1"
    local description="${2:-Executing command}"

    log_info "$description"

    sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$PROXMOX_USER@$PROXMOX_HOST" \
        "$command"
}

# Function to execute commands inside LXC container
lxc_exec() {
    local command="$1"
    local description="${2:-Executing LXC command}"

    log_info "$description"

    ssh_exec "pct exec $LXC_ID -- $command" "$description"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if sshpass is available
    if ! command -v sshpass &> /dev/null; then
        log_error "sshpass is not installed. Please install it first:"
        echo "  Ubuntu/Debian: sudo apt-get install sshpass"
        echo "  CentOS/RHEL: sudo yum install sshpass"
        echo "  macOS: brew install sshpass"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Test SSH connection to Proxmox
test_ssh_connection() {
    log_info "Testing SSH connection to Proxmox server..."

    if ssh_exec "echo 'SSH connection successful'" "Testing SSH connection"; then
        log_success "SSH connection to Proxmox server established"
    else
        log_error "Failed to connect to Proxmox server"
        log_error "Please check:"
        log_error "  - Server IP: $PROXMOX_HOST"
        log_error "  - SSH port: $PROXMOX_PORT"
        log_error "  - Username: $PROXMOX_USER"
        log_error "  - Password: [HIDDEN]"
        exit 1
    fi
}

# Check LXC container status
check_lxc_status() {
    log_info "Checking LXC container CT$LXC_ID status..."

    local status
    status=$(ssh_exec "pct status $LXC_ID" "Getting LXC status" | awk '{print $2}')

    echo "Container CT$LXC_ID status: $status"

    if [[ "$status" != "running" ]]; then
        log_warning "Container CT$LXC_ID is not running. Starting container..."
        ssh_exec "pct start $LXC_ID" "Starting LXC container"

        # Wait for container to start
        log_info "Waiting for container to start..."
        sleep 10

        # Verify container is now running
        status=$(ssh_exec "pct status $LXC_ID" "Rechecking LXC status" | awk '{print $2}')
        if [[ "$status" == "running" ]]; then
            log_success "Container CT$LXC_ID is now running"
        else
            log_error "Failed to start container CT$LXC_ID"
            exit 1
        fi
    else
        log_success "Container CT$LXC_ID is already running"
    fi
}

# Get LXC container configuration
get_lxc_config() {
    log_info "Getting LXC container configuration..."

    ssh_exec "pct config $LXC_ID" "Getting LXC configuration"
}

# Check Proxmox host network configuration
check_host_network() {
    log_info "Checking Proxmox host network configuration..."

    echo "=== Network Interfaces ==="
    ssh_exec "ip addr show" "Getting network interfaces"

    echo -e "\n=== Routing Table ==="
    ssh_exec "ip route show" "Getting routing table"

    echo -e "\n=== Bridge Information ==="
    ssh_exec "brctl show 2>/dev/null || bridge link show" "Getting bridge information"

    echo -e "\n=== IP Forwarding Status ==="
    ssh_exec "cat /proc/sys/net/ipv4/ip_forward" "Checking IP forwarding"
}

# Enable IP forwarding if needed
enable_ip_forwarding() {
    log_info "Checking and enabling IP forwarding..."

    local forwarding
    forwarding=$(ssh_exec "cat /proc/sys/net/ipv4/ip_forward" "Checking IP forwarding status")

    if [[ "$forwarding" == "1" ]]; then
        log_success "IP forwarding is already enabled"
    else
        log_warning "IP forwarding is disabled. Enabling it..."
        ssh_exec "echo 1 > /proc/sys/net/ipv4/ip_forward" "Enabling IP forwarding"
        ssh_exec "echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf" "Making IP forwarding persistent"
        log_success "IP forwarding enabled"
    fi
}

# Configure NAT/masquerading
configure_nat() {
    log_info "Configuring NAT/masquerading..."

    # Get the main network interface (usually the one with default route)
    local main_iface
    main_iface=$(ssh_exec "ip route | grep default | awk '{print \$5}' | head -1" "Getting main network interface")

    log_info "Main network interface: $main_iface"

    # Check if masquerading rule already exists
    local masq_exists
    masq_exists=$(ssh_exec "iptables -t nat -L POSTROUTING | grep MASQUERADE | wc -l" "Checking existing masquerading rules")

    if [[ "$masq_exists" -gt 0 ]]; then
        log_success "NAT masquerading rules already exist"
    else
        log_info "Adding NAT masquerading rule..."
        ssh_exec "iptables -t nat -A POSTROUTING -o $main_iface -j MASQUERADE" "Adding masquerading rule"

        # Make it persistent (Debian/Ubuntu style)
        ssh_exec "iptables-save > /etc/iptables/rules.v4 2>/dev/null || echo 'Could not save iptables rules permanently'" "Saving iptables rules"

        log_success "NAT masquerading configured"
    fi
}

# Check LXC container network configuration
check_lxc_network() {
    log_info "Checking LXC container network configuration..."

    echo "=== Container Network Interfaces ==="
    lxc_exec "ip addr show" "Getting container network interfaces"

    echo -e "\n=== Container Routing Table ==="
    lxc_exec "ip route show" "Getting container routing table"

    echo -e "\n=== Container DNS Configuration ==="
    lxc_exec "cat /etc/resolv.conf" "Getting container DNS configuration"
}

# Configure LXC container network
configure_lxc_network() {
    log_info "Configuring LXC container network..."

    # Get the container's network interface name
    local container_iface
    container_iface=$(lxc_exec "ip route | grep default | awk '{print \$5}' | head -1" "Getting container network interface" || echo "eth0")

    if [[ -z "$container_iface" ]]; then
        container_iface="eth0"
        log_warning "Could not detect container interface, using default: $container_iface"
    fi

    log_info "Container network interface: $container_iface"

    # Get Proxmox host IP on the bridge network
    local host_bridge_ip
    host_bridge_ip=$(ssh_exec "ip addr show vmbr0 | grep 'inet ' | awk '{print \$2}' | cut -d'/' -f1" "Getting host bridge IP")

    if [[ -z "$host_bridge_ip" ]]; then
        log_error "Could not determine host bridge IP"
        exit 1
    fi

    log_info "Host bridge IP: $host_bridge_ip"

    # Configure container IP if not already configured
    local container_ip
    container_ip=$(lxc_exec "ip addr show $container_iface | grep 'inet ' | awk '{print \$2}' | cut -d'/' -f1" "Getting container IP" || echo "")

    if [[ -z "$container_ip" ]]; then
        log_warning "Container has no IP address. Configuring DHCP..."
        lxc_exec "dhclient $container_iface" "Configuring DHCP on container interface"
        sleep 5
        container_ip=$(lxc_exec "ip addr show $container_iface | grep 'inet ' | awk '{print \$2}' | cut -d'/' -f1" "Getting container IP after DHCP" || echo "")
    fi

    if [[ -n "$container_ip" ]]; then
        log_success "Container IP address: $container_ip"
    else
        log_error "Failed to configure container IP address"
        exit 1
    fi

    # Configure default route if not present
    local has_default_route
    has_default_route=$(lxc_exec "ip route | grep default | wc -l" "Checking for default route")

    if [[ "$has_default_route" -eq 0 ]]; then
        log_info "Adding default route via $host_bridge_ip"
        lxc_exec "ip route add default via $host_bridge_ip" "Adding default route"
    else
        log_success "Default route already configured"
    fi

    # Configure DNS servers
    log_info "Configuring DNS servers..."
    lxc_exec "echo 'nameserver 8.8.8.8' > /etc/resolv.conf" "Setting primary DNS"
    lxc_exec "echo 'nameserver 1.1.1.1' >> /etc/resolv.conf" "Setting secondary DNS"
    lxc_exec "echo 'nameserver $host_bridge_ip' >> /etc/resolv.conf" "Setting local DNS (host)"

    log_success "Container network configuration completed"
}

# Test internet connectivity
test_internet_connectivity() {
    log_info "Testing internet connectivity from container..."

    # Test ping to Google DNS
    if lxc_exec "ping -c 3 8.8.8.8" "Testing ping to 8.8.8.8"; then
        log_success "Ping test to 8.8.8.8 successful"
    else
        log_error "Ping test to 8.8.8.8 failed"
        return 1
    fi

    # Test DNS resolution
    if lxc_exec "nslookup google.com" "Testing DNS resolution"; then
        log_success "DNS resolution test successful"
    else
        log_error "DNS resolution test failed"
        return 1
    fi

    # Test HTTP connectivity
    if lxc_exec "curl -s --connect-timeout 10 http://google.com >/dev/null" "Testing HTTP connectivity"; then
        log_success "HTTP connectivity test successful"
    else
        log_warning "HTTP connectivity test failed (curl might not be installed)"
    fi

    # Test HTTPS connectivity
    if lxc_exec "wget -q --timeout=10 --tries=1 https://google.com -O /dev/null" "Testing HTTPS connectivity"; then
        log_success "HTTPS connectivity test successful"
    else
        log_warning "HTTPS connectivity test failed (wget might not be installed)"
    fi

    log_success "Internet connectivity tests completed"
}

# Install basic network tools in container if needed
install_network_tools() {
    log_info "Installing basic network tools in container..."

    # Detect package manager and install tools
    if lxc_exec "which apt-get >/dev/null 2>&1" "Checking for apt-get"; then
        lxc_exec "apt-get update && apt-get install -y curl wget net-tools iputils-ping dnsutils" "Installing network tools (apt)"
    elif lxc_exec "which yum >/dev/null 2>&1" "Checking for yum"; then
        lxc_exec "yum install -y curl wget net-tools iputils bind-utils" "Installing network tools (yum)"
    elif lxc_exec "which apk >/dev/null 2>&1" "Checking for apk"; then
        lxc_exec "apk add curl wget net-tools iputils bind-tools" "Installing network tools (apk)"
    else
        log_warning "Could not detect package manager. Network tools might not be available."
    fi

    log_success "Network tools installation completed"
}

# Display final configuration
display_final_config() {
    log_success "LXC Container CT$LXC_ID Internet Connection Setup Completed!"
    echo
    echo "=== Final Configuration ==="
    echo

    echo "Container Information:"
    ssh_exec "pct status $LXC_ID" "Getting final container status"

    echo -e "\nContainer Network Configuration:"
    lxc_exec "ip addr show | grep -E '(inet|UP)'" "Getting container network summary"

    echo -e "\nContainer Routing:"
    lxc_exec "ip route show" "Getting container routing summary"

    echo -e "\nContainer DNS:"
    lxc_exec "cat /etc/resolv.conf" "Getting container DNS summary"

    echo -e "\nHost NAT Configuration:"
    ssh_exec "iptables -t nat -L POSTROUTING | grep MASQUERADE" "Getting NAT rules summary"

    echo
    log_success "Container CT$LXC_ID should now have internet access!"
    echo
    echo "To verify connectivity, you can:"
    echo "  1. SSH to Proxmox: ssh root@$PROXMOX_HOST"
    echo "  2. Enter container: pct enter $LXC_ID"
    echo "  3. Test connectivity: ping google.com"
    echo
}

# Cleanup function for error handling
cleanup() {
    log_info "Cleaning up..."
    # Add any cleanup operations here if needed
}

# Error handling
trap cleanup ERR

# Main execution function
main() {
    log_info "Starting LXC Internet Connection Setup for CT$LXC_ID"
    echo

    check_prerequisites
    test_ssh_connection
    check_lxc_status
    get_lxc_config
    check_host_network
    enable_ip_forwarding
    configure_nat
    check_lxc_network
    install_network_tools
    configure_lxc_network
    test_internet_connectivity
    display_final_config

    log_success "Setup completed successfully!"
}

# Help function
show_help() {
    cat << EOF
Proxmox LXC Internet Connection Script

This script connects LXC container CT$LXC_ID to the internet via SSH.

Usage: $0 [COMMAND]

Commands:
    setup       Setup internet connection (default)
    test        Test connectivity only
    status      Show current status
    help        Show this help message

Configuration:
    Proxmox Host: $PROXMOX_HOST
    LXC ID: $LXC_ID
    SSH User: $PROXMOX_USER

The script will:
1. Connect to Proxmox server via SSH
2. Check and start LXC container if needed
3. Configure host network (IP forwarding, NAT)
4. Configure container network settings
5. Test internet connectivity
6. Display final configuration

Prerequisites:
- sshpass command must be installed
- SSH access to Proxmox server
- LXC container CT$LXC_ID must exist

EOF
}

# Parse command line arguments
case "${1:-setup}" in
    setup)
        main
        ;;
    test)
        test_ssh_connection
        check_lxc_status
        test_internet_connectivity
        ;;
    status)
        test_ssh_connection
        check_lxc_status
        get_lxc_config
        check_lxc_network
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