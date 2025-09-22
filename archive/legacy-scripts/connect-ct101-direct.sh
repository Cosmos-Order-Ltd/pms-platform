#!/bin/bash

# Direct SSH Connection to CT101
# Connects directly to CT101 container at 192.168.30.98

CT101_IP="192.168.30.98"
CT101_USER="${1:-root}"
CT101_PASSWORD="root123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "======================================"
echo "Direct SSH Connection to CT101"
echo "======================================"
echo
echo "Container IP: $CT101_IP"
echo "Username: $CT101_USER"
echo "Password: $CT101_PASSWORD"
echo

# Test connectivity first
log_info "Testing network connectivity to CT101..."
if powershell.exe "Test-NetConnection -ComputerName $CT101_IP -Port 22 -InformationLevel Quiet" > /dev/null 2>&1; then
    log_success "Network connectivity to CT101:22 confirmed"
else
    log_error "Cannot connect to CT101:22"
    exit 1
fi

# Try SSH connection
log_info "Attempting SSH connection..."
echo "Note: You will be prompted for password: $CT101_PASSWORD"
echo

ssh -o StrictHostKeyChecking=no "$CT101_USER@$CT101_IP"