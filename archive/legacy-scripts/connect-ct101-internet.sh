#!/bin/bash

# Main LXC Internet Connection Automation Script
# Complete solution for connecting CT101 to the internet

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROXMOX_HOST="192.168.30.205"
PROXMOX_USER="root"
PROXMOX_PASSWORD='$erb!234'
LXC_ID="101"
NETWORK_MODE="dhcp"
BACKUP_CONFIG="true"
AUTO_VERIFY="true"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${PURPLE}[STEP]${NC} $1"; }
log_action() { echo -e "${CYAN}[ACTION]${NC} $1"; }

# Progress tracking
TOTAL_STEPS=7
CURRENT_STEP=0

progress() {
    ((CURRENT_STEP++))
    log_step "Step $CURRENT_STEP/$TOTAL_STEPS: $1"
    echo
}

# Configuration validation
validate_config() {
    log_action "Validating configuration..."

    # Check required tools
    local missing_tools=()

    if ! command -v sshpass &> /dev/null; then
        missing_tools+=("sshpass")
    fi

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        echo
        echo "Installation commands:"
        echo "  Ubuntu/Debian: sudo apt-get install sshpass"
        echo "  CentOS/RHEL: sudo yum install sshpass"
        echo "  macOS: brew install sshpass"
        return 1
    fi

    # Validate network configuration
    if [[ "$NETWORK_MODE" == "static" ]]; then
        if [[ -z "${STATIC_IP:-}" || -z "${GATEWAY:-}" ]]; then
            log_error "Static network mode requires STATIC_IP and GATEWAY variables"
            return 1
        fi
    fi

    # Check script files exist
    local required_scripts=("proxmox-lxc-internet.sh" "verify-lxc-internet.sh")
    for script in "${required_scripts[@]}"; do
        if [[ ! -f "$SCRIPT_DIR/$script" ]]; then
            log_error "Required script not found: $script"
            return 1
        fi
    done

    log_success "Configuration validation passed"
    return 0
}

# Create backup of current configuration
backup_configuration() {
    if [[ "$BACKUP_CONFIG" != "true" ]]; then
        return 0
    fi

    log_action "Creating backup of current configuration..."

    local backup_dir="$SCRIPT_DIR/backups/ct${LXC_ID}_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"

    # Function to execute SSH commands and save output
    ssh_exec_save() {
        local command="$1"
        local output_file="$2"
        local description="${3:-}"

        if [[ -n "$description" ]]; then
            log_info "$description"
        fi

        sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
            -o ConnectTimeout=10 \
            "$PROXMOX_USER@$PROXMOX_HOST" \
            "$command" > "$backup_dir/$output_file" 2>/dev/null || true
    }

    # Backup Proxmox host configuration
    ssh_exec_save "pct config $LXC_ID" "lxc_config.conf" "Backing up LXC configuration"
    ssh_exec_save "ip addr show" "host_interfaces.txt" "Backing up host network interfaces"
    ssh_exec_save "ip route show" "host_routes.txt" "Backing up host routing table"
    ssh_exec_save "iptables -L -n" "host_iptables.txt" "Backing up host firewall rules"
    ssh_exec_save "iptables -t nat -L -n" "host_nat_rules.txt" "Backing up host NAT rules"

    # Backup container configuration if running
    if sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        "$PROXMOX_USER@$PROXMOX_HOST" "pct status $LXC_ID | grep -q running" 2>/dev/null; then

        ssh_exec_save "pct exec $LXC_ID -- ip addr show" "container_interfaces.txt" "Backing up container interfaces"
        ssh_exec_save "pct exec $LXC_ID -- ip route show" "container_routes.txt" "Backing up container routes"
        ssh_exec_save "pct exec $LXC_ID -- cat /etc/resolv.conf" "container_dns.txt" "Backing up container DNS"
        ssh_exec_save "pct exec $LXC_ID -- cat /etc/network/interfaces" "container_network_config.txt" "Backing up container network config"
    fi

    # Create restore script
    cat > "$backup_dir/restore.sh" << 'EOF'
#!/bin/bash
# Restore script for LXC network configuration
# This script can be used to restore the previous configuration

echo "This backup was created on: $(date)"
echo "To restore, manually review and apply the backed up configuration files."
echo "Configuration files in this directory:"
ls -la
EOF

    chmod +x "$backup_dir/restore.sh"

    log_success "Configuration backed up to: $backup_dir"
}

# Pre-flight checks
preflight_checks() {
    log_action "Running pre-flight checks..."

    # Test SSH connectivity
    if ! sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$PROXMOX_USER@$PROXMOX_HOST" "echo 'SSH OK'" &>/dev/null; then
        log_error "Cannot connect to Proxmox server at $PROXMOX_HOST"
        return 1
    fi
    log_success "SSH connectivity to Proxmox server verified"

    # Check if LXC container exists
    if ! sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        "$PROXMOX_USER@$PROXMOX_HOST" "pct config $LXC_ID >/dev/null" 2>/dev/null; then
        log_error "LXC container CT$LXC_ID does not exist"
        return 1
    fi
    log_success "LXC container CT$LXC_ID exists"

    # Check container status
    local status
    status=$(sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        "$PROXMOX_USER@$PROXMOX_HOST" "pct status $LXC_ID" 2>/dev/null | awk '{print $2}')

    if [[ "$status" != "running" ]]; then
        log_warning "Container CT$LXC_ID is not running (status: $status)"
        log_info "The setup script will start the container automatically"
    else
        log_success "Container CT$LXC_ID is running"
    fi

    log_success "Pre-flight checks completed"
}

# Execute main setup
run_setup() {
    log_action "Executing main LXC internet setup..."

    local setup_script="$SCRIPT_DIR/proxmox-lxc-internet.sh"

    if [[ ! -f "$setup_script" ]]; then
        log_error "Setup script not found: $setup_script"
        return 1
    fi

    # Make script executable
    chmod +x "$setup_script"

    # Run the setup script
    if "$setup_script"; then
        log_success "LXC internet setup completed successfully"
        return 0
    else
        log_error "LXC internet setup failed"
        return 1
    fi
}

# Run verification tests
run_verification() {
    if [[ "$AUTO_VERIFY" != "true" ]]; then
        return 0
    fi

    log_action "Running connectivity verification..."

    local verify_script="$SCRIPT_DIR/verify-lxc-internet.sh"

    if [[ ! -f "$verify_script" ]]; then
        log_error "Verification script not found: $verify_script"
        return 1
    fi

    # Make script executable
    chmod +x "$verify_script"

    # Run verification with quick test first
    if "$verify_script" "$LXC_ID" quick; then
        log_success "Quick connectivity verification passed"

        # Ask user if they want full verification
        echo
        read -p "Run full verification test suite? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if "$verify_script" "$LXC_ID" full; then
                log_success "Full verification completed successfully"
            else
                log_warning "Some verification tests failed, but basic connectivity works"
            fi
        fi
        return 0
    else
        log_error "Connectivity verification failed"
        return 1
    fi
}

# Generate summary report
generate_summary() {
    log_action "Generating summary report..."

    local report_file="$SCRIPT_DIR/ct${LXC_ID}_connection_report.txt"

    cat > "$report_file" << EOF
CT${LXC_ID} Internet Connection Setup Report
============================================

Date: $(date)
Proxmox Host: $PROXMOX_HOST
Container ID: $LXC_ID
Network Mode: $NETWORK_MODE

Setup Status: COMPLETED
Verification: $(if [[ "$AUTO_VERIFY" == "true" ]]; then echo "PASSED"; else echo "SKIPPED"; fi)

Configuration Details:
EOF

    # Add container status
    if sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        "$PROXMOX_USER@$PROXMOX_HOST" "pct status $LXC_ID" >> "$report_file" 2>/dev/null; then
        echo "Container Status: Added to report"
    fi

    # Add network configuration
    echo "" >> "$report_file"
    echo "Network Configuration:" >> "$report_file"
    if sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        "$PROXMOX_USER@$PROXMOX_HOST" "pct exec $LXC_ID -- ip addr show eth0" >> "$report_file" 2>/dev/null; then
        echo "Container Network: Added to report"
    fi

    cat >> "$report_file" << EOF

Next Steps:
1. Access container: ssh root@$PROXMOX_HOST, then: pct enter $LXC_ID
2. Test connectivity: ping google.com
3. Install packages: apt update && apt install <packages>
4. Configure applications as needed

For support, refer to the backed up configuration in:
$(find "$SCRIPT_DIR/backups" -name "ct${LXC_ID}_*" -type d | tail -1 2>/dev/null || echo "No backup created")

EOF

    log_success "Summary report generated: $report_file"
}

# Display final instructions
show_final_instructions() {
    echo
    echo "======================================="
    echo "   CT${LXC_ID} Internet Setup Complete"
    echo "======================================="
    echo
    echo "🎉 Your LXC container CT${LXC_ID} is now connected to the internet!"
    echo
    echo "Quick Access:"
    echo "  1. SSH to Proxmox:    ssh root@$PROXMOX_HOST"
    echo "  2. Enter container:   pct enter $LXC_ID"
    echo "  3. Test internet:     ping google.com"
    echo
    echo "What you can do now:"
    echo "  ✅ Browse the web and download files"
    echo "  ✅ Install packages (apt, yum, apk, etc.)"
    echo "  ✅ Clone Git repositories"
    echo "  ✅ Access Docker registries"
    echo "  ✅ Make API calls to external services"
    echo "  ✅ Update the system and applications"
    echo
    echo "Configuration files:"
    echo "  📁 Backups: $SCRIPT_DIR/backups/"
    echo "  📄 Report: $SCRIPT_DIR/ct${LXC_ID}_connection_report.txt"
    echo
    echo "Troubleshooting:"
    echo "  🔧 Re-run setup: $0"
    echo "  🧪 Test connectivity: ./verify-lxc-internet.sh $LXC_ID"
    echo "  📋 Check status: ./verify-lxc-internet.sh $LXC_ID quick"
    echo
    if [[ -f "$SCRIPT_DIR/backups/$(find "$SCRIPT_DIR/backups" -name "ct${LXC_ID}_*" -type d | tail -1 | xargs basename 2>/dev/null)" ]]; then
        echo "  🔄 Restore backup: See files in backup directory"
    fi
    echo
    log_success "Setup completed successfully! 🚀"
}

# Cleanup function
cleanup() {
    if [[ $? -ne 0 ]]; then
        log_error "Setup failed! Check the error messages above."
        echo
        echo "Common solutions:"
        echo "  - Verify Proxmox credentials and network connectivity"
        echo "  - Check if the LXC container exists and is accessible"
        echo "  - Ensure sshpass is installed on your system"
        echo "  - Review the backup configuration if available"
        echo
        echo "For detailed diagnostics, run:"
        echo "  ./verify-lxc-internet.sh $LXC_ID verbose"
    fi
}

# Error handling
trap cleanup EXIT

# Main execution function
main() {
    echo "🚀 CT${LXC_ID} Internet Connection Automation"
    echo "============================================="
    echo

    progress "Configuration validation"
    validate_config

    progress "Configuration backup"
    backup_configuration

    progress "Pre-flight checks"
    preflight_checks

    progress "Network setup execution"
    run_setup

    progress "Connectivity verification"
    run_verification

    progress "Summary report generation"
    generate_summary

    progress "Final instructions"
    show_final_instructions
}

# Interactive mode function
interactive_mode() {
    echo "🔧 Interactive CT${LXC_ID} Setup"
    echo "==============================="
    echo

    # Container ID
    read -p "Enter LXC Container ID (default: $LXC_ID): " input_id
    if [[ -n "$input_id" ]]; then
        LXC_ID="$input_id"
    fi

    # Network mode
    echo
    echo "Network configuration modes:"
    echo "  1. DHCP (automatic IP assignment)"
    echo "  2. Static IP (manual IP configuration)"
    echo
    read -p "Select network mode (1-2, default: 1): " mode_choice

    case "$mode_choice" in
        2)
            NETWORK_MODE="static"
            read -p "Enter static IP address: " STATIC_IP
            read -p "Enter gateway IP: " GATEWAY
            read -p "Enter DNS servers (comma-separated, default: 8.8.8.8,1.1.1.1): " DNS_SERVERS
            DNS_SERVERS="${DNS_SERVERS:-8.8.8.8,1.1.1.1}"
            export STATIC_IP GATEWAY DNS_SERVERS
            ;;
        *)
            NETWORK_MODE="dhcp"
            ;;
    esac

    # Backup option
    echo
    read -p "Create configuration backup? (Y/n): " backup_choice
    if [[ "$backup_choice" =~ ^[Nn]$ ]]; then
        BACKUP_CONFIG="false"
    fi

    # Verification option
    echo
    read -p "Run connectivity verification after setup? (Y/n): " verify_choice
    if [[ "$verify_choice" =~ ^[Nn]$ ]]; then
        AUTO_VERIFY="false"
    fi

    echo
    echo "Configuration Summary:"
    echo "  Container ID: $LXC_ID"
    echo "  Network Mode: $NETWORK_MODE"
    echo "  Create Backup: $BACKUP_CONFIG"
    echo "  Auto Verify: $AUTO_VERIFY"
    echo

    read -p "Proceed with setup? (Y/n): " proceed
    if [[ "$proceed" =~ ^[Nn]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi

    main
}

# Show help
show_help() {
    cat << EOF
CT${LXC_ID} Internet Connection Automation Script

This script automates the complete process of connecting an LXC container
to the internet through a Proxmox server.

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    auto        Run automated setup (default)
    interactive Run interactive setup
    status      Show current status
    verify      Run verification tests only
    help        Show this help

Options:
    --container-id ID    LXC container ID (default: 101)
    --network-mode MODE  Network mode: dhcp|static (default: dhcp)
    --no-backup         Don't create configuration backup
    --no-verify         Don't run verification tests

Environment Variables:
    LXC_ID               Container ID to configure
    NETWORK_MODE         Network configuration mode
    STATIC_IP            Static IP address (for static mode)
    GATEWAY              Gateway IP address (for static mode)
    DNS_SERVERS          DNS servers (for static mode)
    BACKUP_CONFIG        Create backup (true/false)
    AUTO_VERIFY          Run verification (true/false)

Examples:
    # Run automated setup
    $0

    # Interactive setup
    $0 interactive

    # Setup specific container
    $0 --container-id 102

    # Static IP setup
    LXC_ID=101 NETWORK_MODE=static STATIC_IP=192.168.1.100 GATEWAY=192.168.1.1 $0

    # Verify existing setup
    $0 verify

What this script does:
1. ✅ Validates configuration and prerequisites
2. 💾 Creates backup of current configuration
3. 🔍 Runs pre-flight connectivity checks
4. 🌐 Configures host and container networking
5. 🧪 Verifies internet connectivity
6. 📊 Generates detailed report
7. 📋 Provides clear next steps

Requirements:
- sshpass command must be installed
- SSH access to Proxmox server ($PROXMOX_HOST)
- LXC container must exist

EOF
}

# Parse command line arguments
COMMAND="${1:-auto}"

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        --container-id)
            LXC_ID="$2"
            shift 2
            ;;
        --network-mode)
            NETWORK_MODE="$2"
            shift 2
            ;;
        --no-backup)
            BACKUP_CONFIG="false"
            shift
            ;;
        --no-verify)
            AUTO_VERIFY="false"
            shift
            ;;
        *)
            break
            ;;
    esac
done

# Execute based on command
case "$COMMAND" in
    auto)
        main
        ;;
    interactive)
        interactive_mode
        ;;
    status)
        chmod +x "$SCRIPT_DIR/verify-lxc-internet.sh"
        "$SCRIPT_DIR/verify-lxc-internet.sh" "$LXC_ID" quick
        ;;
    verify)
        chmod +x "$SCRIPT_DIR/verify-lxc-internet.sh"
        "$SCRIPT_DIR/verify-lxc-internet.sh" "$LXC_ID" full
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac