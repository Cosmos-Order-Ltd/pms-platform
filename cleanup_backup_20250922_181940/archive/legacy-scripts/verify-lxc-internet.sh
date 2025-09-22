#!/bin/bash

# LXC Internet Connectivity Verification Script
# Comprehensive testing and verification of LXC internet connectivity

set -euo pipefail

# Configuration
PROXMOX_HOST="192.168.30.205"
PROXMOX_USER="root"
PROXMOX_PASSWORD='$erb!234'
LXC_ID="${1:-101}"
VERBOSE="${VERBOSE:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test results tracking
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_test() { echo -e "${CYAN}[TEST]${NC} $1"; }

# Function to execute SSH commands
ssh_exec() {
    local command="$1"
    local description="${2:-}"

    if [[ "$VERBOSE" == "true" && -n "$description" ]]; then
        log_info "$description"
    fi

    sshpass -p "$PROXMOX_PASSWORD" ssh -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$PROXMOX_USER@$PROXMOX_HOST" \
        "$command" 2>/dev/null
}

# Function to execute commands inside LXC container
lxc_exec() {
    local command="$1"
    local description="${2:-}"

    if [[ "$VERBOSE" == "true" && -n "$description" ]]; then
        log_info "$description"
    fi

    ssh_exec "pct exec $LXC_ID -- bash -c '$command'" "$description"
}

# Test runner function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="${3:-0}"
    local is_lxc_command="${4:-false}"

    ((TESTS_TOTAL++))
    log_test "Running: $test_name"

    local result=0
    local output=""

    if [[ "$is_lxc_command" == "true" ]]; then
        output=$(lxc_exec "$test_command" "" 2>&1) || result=$?
    else
        output=$(ssh_exec "$test_command" "" 2>&1) || result=$?
    fi

    if [[ $result -eq $expected_result ]]; then
        ((TESTS_PASSED++))
        log_success "✓ $test_name"
        if [[ "$VERBOSE" == "true" && -n "$output" ]]; then
            echo "   Output: $output"
        fi
        return 0
    else
        ((TESTS_FAILED++))
        FAILED_TESTS+=("$test_name")
        log_error "✗ $test_name"
        if [[ -n "$output" ]]; then
            echo "   Error: $output"
        fi
        return 1
    fi
}

# Connectivity tests
test_ssh_connectivity() {
    echo "=== SSH Connectivity Tests ==="
    echo

    run_test "SSH connection to Proxmox" "echo 'SSH OK'"
    run_test "Proxmox version check" "pveversion"
}

# LXC Container tests
test_lxc_container() {
    echo "=== LXC Container Tests ==="
    echo

    run_test "Container exists" "pct config $LXC_ID >/dev/null"
    run_test "Container is running" "pct status $LXC_ID | grep -q running"
    run_test "Container shell access" "echo 'Container access OK'" "" true
}

# Host network tests
test_host_network() {
    echo "=== Host Network Tests ==="
    echo

    run_test "Host IP forwarding enabled" "test \$(cat /proc/sys/net/ipv4/ip_forward) -eq 1"
    run_test "Host has default route" "ip route show default | grep -q default"
    run_test "Host DNS resolution" "nslookup google.com >/dev/null"
    run_test "Host internet connectivity" "ping -c 1 8.8.8.8 >/dev/null"
    run_test "Host NAT/masquerading" "iptables -t nat -L POSTROUTING | grep -q MASQUERADE"
}

# Container network interface tests
test_container_interfaces() {
    echo "=== Container Network Interface Tests ==="
    echo

    run_test "Container has network interface" "ip link show eth0" "" true
    run_test "Container interface is up" "ip link show eth0 | grep -q 'state UP'" "" true
    run_test "Container has IP address" "ip addr show eth0 | grep -q 'inet '" "" true
    run_test "Container has loopback interface" "ip addr show lo | grep -q 'inet 127.0.0.1'" "" true
}

# Container routing tests
test_container_routing() {
    echo "=== Container Routing Tests ==="
    echo

    run_test "Container has default route" "ip route show default | grep -q default" "" true
    run_test "Container routing table accessible" "ip route show | wc -l | grep -q '[1-9]'" "" true

    # Get container and host IPs for advanced tests
    local container_ip=""
    local host_ip=""

    container_ip=$(lxc_exec "ip addr show eth0 | grep 'inet ' | awk '{print \$2}' | cut -d'/' -f1" "" 2>/dev/null || echo "")
    host_ip=$(ssh_exec "ip addr show vmbr0 | grep 'inet ' | awk '{print \$2}' | cut -d'/' -f1" "" 2>/dev/null || echo "")

    if [[ -n "$container_ip" && -n "$host_ip" ]]; then
        run_test "Container can reach host" "ping -c 1 $host_ip >/dev/null" "" true
        if [[ "$VERBOSE" == "true" ]]; then
            echo "   Container IP: $container_ip"
            echo "   Host IP: $host_ip"
        fi
    fi
}

# DNS tests
test_container_dns() {
    echo "=== Container DNS Tests ==="
    echo

    run_test "Container has DNS configuration" "test -f /etc/resolv.conf && test -s /etc/resolv.conf" "" true
    run_test "Container DNS servers configured" "grep -q nameserver /etc/resolv.conf" "" true
    run_test "Container can resolve localhost" "nslookup localhost >/dev/null" "" true
    run_test "Container can resolve external domain" "nslookup google.com >/dev/null" "" true
    run_test "Container can resolve IP to hostname" "nslookup 8.8.8.8 >/dev/null" "" true
}

# Internet connectivity tests
test_container_internet() {
    echo "=== Container Internet Connectivity Tests ==="
    echo

    # Basic connectivity tests
    run_test "Container can ping Google DNS" "ping -c 3 8.8.8.8 >/dev/null" "" true
    run_test "Container can ping Cloudflare DNS" "ping -c 3 1.1.1.1 >/dev/null" "" true
    run_test "Container can ping external host" "ping -c 2 google.com >/dev/null" "" true

    # Protocol-specific tests
    run_test "Container HTTP connectivity" "timeout 10 nc -z google.com 80" "" true
    run_test "Container HTTPS connectivity" "timeout 10 nc -z google.com 443" "" true

    # Application-level tests (if tools are available)
    if lxc_exec "which curl >/dev/null 2>&1" "" 2>/dev/null; then
        run_test "Container HTTP request with curl" "curl -s --connect-timeout 10 --max-time 15 http://google.com >/dev/null" "" true
        run_test "Container HTTPS request with curl" "curl -s --connect-timeout 10 --max-time 15 https://google.com >/dev/null" "" true
    fi

    if lxc_exec "which wget >/dev/null 2>&1" "" 2>/dev/null; then
        run_test "Container HTTP request with wget" "wget -q --timeout=10 --tries=1 http://google.com -O /dev/null" "" true
        run_test "Container HTTPS request with wget" "wget -q --timeout=10 --tries=1 https://google.com -O /dev/null" "" true
    fi
}

# Performance tests
test_network_performance() {
    echo "=== Network Performance Tests ==="
    echo

    # Bandwidth test (simple)
    if lxc_exec "which curl >/dev/null 2>&1" "" 2>/dev/null; then
        run_test "Download speed test (1MB)" "timeout 30 curl -s --max-time 25 http://speedtest-fra.netcologne.de/test_1mb.bin -o /dev/null" "" true
    fi

    # Latency tests
    run_test "Low latency to Google (< 200ms)" "ping -c 5 google.com | tail -1 | awk -F'/' '{print \$5}' | awk '{if(\$1 < 200) exit 0; else exit 1}'" "" true
    run_test "Consistent latency (jitter < 50ms)" "ping -c 10 8.8.8.8 | grep 'mdev' | awk -F'/' '{if(\$6 < 50) exit 0; else exit 1}'" "" true
}

# Security tests
test_network_security() {
    echo "=== Network Security Tests ==="
    echo

    # Check for common security configurations
    run_test "Host firewall rules exist" "iptables -L | wc -l | awk '{if(\$1 > 10) exit 0; else exit 1}'"
    run_test "Container cannot access host SSH" "timeout 5 nc -z \$(ip route | grep default | awk '{print \$3}') 22; test \$? -ne 0" "" true
}

# Advanced diagnostic tests
test_advanced_diagnostics() {
    echo "=== Advanced Diagnostic Tests ==="
    echo

    # MTU tests
    run_test "Container MTU configuration" "ip link show eth0 | grep -q 'mtu 1500'" "" true
    run_test "Path MTU discovery" "ping -c 1 -M do -s 1472 google.com >/dev/null" "" true

    # Route tracing (if traceroute is available)
    if lxc_exec "which traceroute >/dev/null 2>&1" "" 2>/dev/null; then
        run_test "Route tracing to external host" "timeout 30 traceroute -m 10 google.com | grep -q 'google.com'" "" true
    fi

    # Network statistics
    run_test "Network interface statistics" "cat /proc/net/dev | grep eth0 | awk '{if(\$3 > 0) exit 0; else exit 1}'" "" true
}

# Display detailed network information
show_network_details() {
    if [[ "$VERBOSE" != "true" ]]; then
        return
    fi

    echo
    echo "=== Detailed Network Information ==="
    echo

    echo "--- Host Network Configuration ---"
    echo "Interfaces:"
    ssh_exec "ip addr show" "" 2>/dev/null || echo "Could not get host interfaces"

    echo -e "\nRouting:"
    ssh_exec "ip route show" "" 2>/dev/null || echo "Could not get host routing"

    echo -e "\nFirewall (NAT):"
    ssh_exec "iptables -t nat -L POSTROUTING" "" 2>/dev/null || echo "Could not get NAT rules"

    echo -e "\n--- Container Network Configuration ---"
    echo "Interfaces:"
    lxc_exec "ip addr show" "" 2>/dev/null || echo "Could not get container interfaces"

    echo -e "\nRouting:"
    lxc_exec "ip route show" "" 2>/dev/null || echo "Could not get container routing"

    echo -e "\nDNS:"
    lxc_exec "cat /etc/resolv.conf" "" 2>/dev/null || echo "Could not get DNS configuration"

    echo -e "\nNetwork Statistics:"
    lxc_exec "cat /proc/net/dev" "" 2>/dev/null || echo "Could not get network statistics"
}

# Generate test report
generate_report() {
    echo
    echo "======================================="
    echo "    LXC Internet Connectivity Report"
    echo "======================================="
    echo
    echo "Container: CT$LXC_ID"
    echo "Proxmox Host: $PROXMOX_HOST"
    echo "Test Date: $(date)"
    echo
    echo "Test Results:"
    echo "  Total Tests: $TESTS_TOTAL"
    echo "  Passed: $TESTS_PASSED"
    echo "  Failed: $TESTS_FAILED"
    echo "  Success Rate: $(( TESTS_PASSED * 100 / TESTS_TOTAL ))%"
    echo

    if [[ $TESTS_FAILED -gt 0 ]]; then
        echo "Failed Tests:"
        for test in "${FAILED_TESTS[@]}"; do
            echo "  - $test"
        done
        echo
    fi

    if [[ $TESTS_FAILED -eq 0 ]]; then
        log_success "All tests passed! Container CT$LXC_ID has full internet connectivity."
        echo
        echo "The container is ready for:"
        echo "  ✓ Web browsing and HTTP/HTTPS requests"
        echo "  ✓ DNS resolution and domain lookups"
        echo "  ✓ Package manager operations (apt, yum, etc.)"
        echo "  ✓ Git operations and repository cloning"
        echo "  ✓ Docker registry access"
        echo "  ✓ API calls to external services"
    else
        log_warning "Some tests failed. Check the configuration and try again."
        echo
        echo "Common solutions:"
        echo "  - Run the setup script: ./proxmox-lxc-internet.sh"
        echo "  - Check Proxmox host firewall settings"
        echo "  - Verify network bridge configuration"
        echo "  - Ensure IP forwarding is enabled on host"
        echo "  - Check DNS configuration in container"
    fi
}

# Main test execution
main() {
    echo "Starting comprehensive internet connectivity tests for CT$LXC_ID"
    echo

    # Prerequisites check
    if ! command -v sshpass &> /dev/null; then
        log_error "sshpass is not installed. Please install it first."
        exit 1
    fi

    # Run all test suites
    test_ssh_connectivity
    echo

    test_lxc_container
    echo

    test_host_network
    echo

    test_container_interfaces
    echo

    test_container_routing
    echo

    test_container_dns
    echo

    test_container_internet
    echo

    test_network_performance
    echo

    test_network_security
    echo

    test_advanced_diagnostics
    echo

    show_network_details

    generate_report
}

# Quick test function (basic connectivity only)
quick_test() {
    echo "Running quick connectivity test for CT$LXC_ID"
    echo

    test_ssh_connectivity
    test_lxc_container
    run_test "Container internet connectivity" "ping -c 2 google.com >/dev/null" "" true

    generate_report
}

# Show help
show_help() {
    cat << EOF
LXC Internet Connectivity Verification Script

Usage: $0 [LXC_ID] [COMMAND]

Parameters:
    LXC_ID      - LXC container ID (default: 101)

Commands:
    full        - Run full test suite (default)
    quick       - Run quick connectivity test
    verbose     - Run full test suite with verbose output
    help        - Show this help

Environment Variables:
    VERBOSE=true     - Enable verbose output

Examples:
    # Run full test suite
    $0 101

    # Run quick test
    $0 101 quick

    # Run with verbose output
    VERBOSE=true $0 101
    # or
    $0 101 verbose

    # Test different container
    $0 102

EOF
}

# Parse command line arguments
COMMAND="${2:-full}"

case "$COMMAND" in
    full)
        main
        ;;
    quick)
        quick_test
        ;;
    verbose)
        VERBOSE=true
        main
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

# Exit with appropriate code
if [[ $TESTS_FAILED -eq 0 ]]; then
    exit 0
else
    exit 1
fi