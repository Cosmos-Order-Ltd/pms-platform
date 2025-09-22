#!/bin/bash

# CT101 Direct Access Script
# Provides direct SSH access to CT101 container at 192.168.30.98

# Configuration
CT101_IP="192.168.30.98"
SSH_KEY="C:/Users/user/.ssh/ct101_key"
CT101_USER="root"

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
log_header() { echo -e "${PURPLE}[CT101]${NC} $1"; }

# Header
echo "=========================================="
echo "🚀 CT101 Direct Access Manager"
echo "=========================================="
echo
echo "Container IP: $CT101_IP"
echo "SSH Key: $SSH_KEY"
echo "User: $CT101_USER"
echo

# Function to test connectivity
test_connectivity() {
    log_info "Testing network connectivity to CT101..."

    if powershell.exe "Test-NetConnection -ComputerName $CT101_IP -Port 22 -InformationLevel Quiet" > /dev/null 2>&1; then
        log_success "✓ Network connectivity confirmed"
        return 0
    else
        log_error "✗ Cannot reach CT101:22"
        return 1
    fi
}

# Function for direct SSH connection
connect_ssh() {
    local command="$1"

    if [[ ! -f "$SSH_KEY" ]]; then
        log_error "SSH key not found: $SSH_KEY"
        log_info "Run setup first to generate SSH keys"
        return 1
    fi

    if [[ -n "$command" ]]; then
        log_info "Executing command: $command"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$CT101_USER@$CT101_IP" "$command"
    else
        log_info "Starting interactive SSH session..."
        echo "Type 'exit' to return to local shell"
        echo
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$CT101_USER@$CT101_IP"
    fi
}

# Function to show container status
show_status() {
    log_header "Container Status Information"
    echo

    if ! test_connectivity; then
        log_error "Cannot connect to CT101"
        return 1
    fi

    echo "=== System Information ==="
    connect_ssh "echo 'Hostname:' && hostname && echo 'Uptime:' && uptime && echo 'Date:' && date"

    echo -e "\n=== Network Configuration ==="
    connect_ssh "ip addr show eth0 | grep inet"

    echo -e "\n=== Service Status ==="
    connect_ssh "systemctl is-active ssh docker 2>/dev/null || echo 'Some services may not be running'"

    echo -e "\n=== Resource Usage ==="
    connect_ssh "free -h && echo && df -h /"

    echo -e "\n=== Docker Status ==="
    connect_ssh "docker version --format 'Version: {{.Server.Version}}' 2>/dev/null || echo 'Docker not available'"
}

# Function to install Coolify
install_coolify() {
    log_header "Installing Coolify on CT101"
    echo

    if ! test_connectivity; then
        log_error "Cannot connect to CT101"
        return 1
    fi

    log_info "Cloning Coolify repository..."
    connect_ssh "cd /opt && git clone https://github.com/coollabsio/coolify.git"

    log_info "Setting up Coolify..."
    connect_ssh "cd /opt/coolify && cp .env.production.example .env"

    log_info "Starting Coolify services..."
    connect_ssh "cd /opt/coolify && docker compose -f docker-compose.prod.yml up -d"

    log_success "Coolify installation completed!"
    echo
    echo "Access Coolify at: http://$CT101_IP:3000"
}

# Function to manage services
manage_service() {
    local service="$1"
    local action="$2"

    if [[ -z "$service" || -z "$action" ]]; then
        echo "Usage: manage_service <service> <start|stop|restart|status>"
        return 1
    fi

    log_info "Managing service: $service ($action)"
    connect_ssh "systemctl $action $service"
}

# Function to copy files to/from container
copy_files() {
    local direction="$1"
    local source="$2"
    local destination="$3"

    if [[ "$direction" == "to" ]]; then
        log_info "Copying file TO container: $source -> $destination"
        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$source" "$CT101_USER@$CT101_IP:$destination"
    elif [[ "$direction" == "from" ]]; then
        log_info "Copying file FROM container: $source -> $destination"
        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$CT101_USER@$CT101_IP:$source" "$destination"
    else
        echo "Usage: copy_files <to|from> <source> <destination>"
        return 1
    fi
}

# Function to show logs
show_logs() {
    local service="${1:-ssh}"

    log_info "Showing logs for: $service"
    connect_ssh "journalctl -u $service -n 20 --no-pager"
}

# Function to update system
update_system() {
    log_header "Updating CT101 System"
    echo

    log_info "Updating package lists..."
    connect_ssh "apt update"

    log_info "Upgrading packages..."
    connect_ssh "apt upgrade -y"

    log_info "Cleaning up..."
    connect_ssh "apt autoremove -y && apt autoclean"

    log_success "System update completed!"
}

# Function to show help
show_help() {
    cat << EOF
CT101 Direct Access Manager

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    connect [command]    Connect to CT101 (interactive if no command)
    status              Show container status and information
    coolify             Install Coolify application platform
    service <name> <action>  Manage systemd services (start/stop/restart/status)
    copy to <src> <dst>     Copy file to container
    copy from <src> <dst>   Copy file from container
    logs [service]          Show service logs (default: ssh)
    update              Update system packages
    test                Test connectivity only
    help                Show this help

Examples:
    # Connect interactively
    $0 connect

    # Run a command
    $0 connect "docker ps"

    # Check status
    $0 status

    # Install Coolify
    $0 coolify

    # Manage Docker service
    $0 service docker restart

    # Copy file to container
    $0 copy to ./myfile.txt /opt/myfile.txt

    # View Docker logs
    $0 logs docker

    # Update system
    $0 update

Network Information:
    Container IP: $CT101_IP
    SSH Port: 22
    Access: SSH key authentication

Services Available:
    - SSH (port 22)
    - Docker (for containerized applications)
    - Coolify (port 3000, when installed)

EOF
}

# Function to setup SSH access (if needed)
setup_access() {
    log_header "Setting up SSH access to CT101"

    if [[ -f "$SSH_KEY" ]]; then
        log_success "SSH key already exists: $SSH_KEY"
    else
        log_info "Generating SSH key pair..."
        ssh-keygen -t ed25519 -f "$SSH_KEY" -N "" -C "ct101-direct-access"
        log_success "SSH key generated: $SSH_KEY"
    fi

    log_info "Testing connectivity..."
    if test_connectivity; then
        log_success "CT101 is reachable!"
    else
        log_error "CT101 is not reachable. Check network configuration."
    fi
}

# Main execution
case "${1:-help}" in
    connect)
        shift
        test_connectivity && connect_ssh "$*"
        ;;
    status)
        show_status
        ;;
    coolify)
        install_coolify
        ;;
    service)
        if [[ $# -lt 3 ]]; then
            echo "Usage: $0 service <service_name> <action>"
            exit 1
        fi
        manage_service "$2" "$3"
        ;;
    copy)
        if [[ $# -lt 4 ]]; then
            echo "Usage: $0 copy <to|from> <source> <destination>"
            exit 1
        fi
        copy_files "$2" "$3" "$4"
        ;;
    logs)
        show_logs "$2"
        ;;
    update)
        update_system
        ;;
    test)
        test_connectivity
        ;;
    setup)
        setup_access
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac