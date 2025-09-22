# PowerShell Script to Connect CT101 LXC to Internet
# Compatible with Windows systems

param(
    [string]$ProxmoxHost = "192.168.30.205",
    [string]$ProxmoxUser = "root",
    [string]$ProxmoxPassword = '$erb!234',
    [int]$LXC_ID = 101
)

# Function to execute SSH commands
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description = ""
    )

    if ($Description) {
        Write-Host "[INFO] $Description" -ForegroundColor Blue
    }

    Write-Host "Executing: $Command" -ForegroundColor Gray

    # Create SSH connection string
    $sshCommand = "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 $ProxmoxUser@$ProxmoxHost `"$Command`""

    try {
        # Execute SSH command
        $result = cmd /c "echo $ProxmoxPassword | $sshCommand"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Command executed successfully" -ForegroundColor Green
            return $result
        } else {
            Write-Host "[ERROR] Command failed with exit code $LASTEXITCODE" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "[ERROR] Failed to execute SSH command: $_" -ForegroundColor Red
        return $null
    }
}

# Function to execute commands in LXC container
function Invoke-LXCCommand {
    param(
        [string]$Command,
        [string]$Description = ""
    )

    $lxcCommand = "pct exec $LXC_ID -- bash -c '$Command'"
    return Invoke-SSHCommand -Command $lxcCommand -Description $Description
}

# Main setup function
function Setup-CT101Internet {
    Write-Host "=== CT101 Internet Connection Setup ===" -ForegroundColor Magenta
    Write-Host ""

    # Step 1: Test SSH connection
    Write-Host "Step 1: Testing SSH connection..." -ForegroundColor Yellow
    $testResult = Invoke-SSHCommand -Command "echo 'SSH connection successful'" -Description "Testing SSH connectivity"
    if (-not $testResult) {
        Write-Host "SSH connection failed. Please check credentials and network connectivity." -ForegroundColor Red
        return
    }
    Write-Host ""

    # Step 2: Check container status
    Write-Host "Step 2: Checking container status..." -ForegroundColor Yellow
    $status = Invoke-SSHCommand -Command "pct status $LXC_ID" -Description "Getting container status"

    if ($status -like "*stopped*") {
        Write-Host "Starting container CT$LXC_ID..." -ForegroundColor Yellow
        Invoke-SSHCommand -Command "pct start $LXC_ID" -Description "Starting container"
        Start-Sleep -Seconds 10
    }
    Write-Host ""

    # Step 3: Enable IP forwarding
    Write-Host "Step 3: Configuring host networking..." -ForegroundColor Yellow
    Invoke-SSHCommand -Command "echo 1 > /proc/sys/net/ipv4/ip_forward" -Description "Enabling IP forwarding"
    Invoke-SSHCommand -Command "echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf" -Description "Making IP forwarding persistent"
    Write-Host ""

    # Step 4: Configure NAT
    Write-Host "Step 4: Setting up NAT..." -ForegroundColor Yellow
    $mainInterface = Invoke-SSHCommand -Command "ip route | grep default | awk '{print `$5}' | head -1" -Description "Getting main interface"
    if ($mainInterface) {
        Write-Host "Main interface: $mainInterface" -ForegroundColor Cyan
        Invoke-SSHCommand -Command "iptables -t nat -A POSTROUTING -o $mainInterface -j MASQUERADE" -Description "Adding NAT rule"
        Invoke-SSHCommand -Command "iptables-save > /etc/iptables/rules.v4 2>/dev/null || true" -Description "Saving iptables rules"
    }
    Write-Host ""

    # Step 5: Configure container network
    Write-Host "Step 5: Configuring container network..." -ForegroundColor Yellow

    # Get host bridge IP
    $hostIP = Invoke-SSHCommand -Command "ip addr show vmbr0 | grep 'inet ' | awk '{print `$2}' | cut -d'/' -f1" -Description "Getting host bridge IP"
    if ($hostIP) {
        Write-Host "Host bridge IP: $hostIP" -ForegroundColor Cyan
    }

    # Configure container networking
    Invoke-LXCCommand -Command "dhclient eth0" -Description "Configuring DHCP"
    Start-Sleep -Seconds 5

    # Configure DNS
    Invoke-LXCCommand -Command "echo 'nameserver 8.8.8.8' > /etc/resolv.conf" -Description "Setting primary DNS"
    Invoke-LXCCommand -Command "echo 'nameserver 1.1.1.1' >> /etc/resolv.conf" -Description "Setting secondary DNS"
    if ($hostIP) {
        Invoke-LXCCommand -Command "echo 'nameserver $hostIP' >> /etc/resolv.conf" -Description "Setting local DNS"
    }
    Write-Host ""

    # Step 6: Test connectivity
    Write-Host "Step 6: Testing internet connectivity..." -ForegroundColor Yellow

    $pingResult = Invoke-LXCCommand -Command "ping -c 3 8.8.8.8" -Description "Testing ping to Google DNS"
    if ($pingResult) {
        Write-Host "[SUCCESS] Ping test passed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Ping test failed" -ForegroundColor Red
    }

    $dnsResult = Invoke-LXCCommand -Command "nslookup google.com" -Description "Testing DNS resolution"
    if ($dnsResult) {
        Write-Host "[SUCCESS] DNS resolution passed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] DNS resolution failed" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "=== Setup Complete ===" -ForegroundColor Green
    Write-Host "Your CT101 container should now have internet access!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To verify manually:" -ForegroundColor Cyan
    Write-Host "1. SSH to Proxmox: ssh root@$ProxmoxHost" -ForegroundColor White
    Write-Host "2. Enter container: pct enter $LXC_ID" -ForegroundColor White
    Write-Host "3. Test internet: ping google.com" -ForegroundColor White
}

# Test connectivity only
function Test-CT101Connectivity {
    Write-Host "=== Testing CT101 Internet Connectivity ===" -ForegroundColor Magenta
    Write-Host ""

    # Check if container is running
    $status = Invoke-SSHCommand -Command "pct status $LXC_ID" -Description "Checking container status"
    if ($status -like "*stopped*") {
        Write-Host "Container CT$LXC_ID is not running" -ForegroundColor Red
        return
    }

    Write-Host "Running connectivity tests..." -ForegroundColor Yellow

    # Test ping
    $pingResult = Invoke-LXCCommand -Command "ping -c 3 8.8.8.8" -Description "Testing ping to Google DNS"
    if ($pingResult) {
        Write-Host "✓ Ping test: PASSED" -ForegroundColor Green
    } else {
        Write-Host "✗ Ping test: FAILED" -ForegroundColor Red
    }

    # Test DNS
    $dnsResult = Invoke-LXCCommand -Command "nslookup google.com" -Description "Testing DNS resolution"
    if ($dnsResult) {
        Write-Host "✓ DNS test: PASSED" -ForegroundColor Green
    } else {
        Write-Host "✗ DNS test: FAILED" -ForegroundColor Red
    }

    # Test HTTP connectivity
    $httpResult = Invoke-LXCCommand -Command "timeout 10 nc -z google.com 80 2>/dev/null || curl -I --connect-timeout 5 http://google.com" -Description "Testing HTTP connectivity"
    if ($httpResult) {
        Write-Host "✓ HTTP test: PASSED" -ForegroundColor Green
    } else {
        Write-Host "⚠ HTTP test: INCONCLUSIVE (tools may not be installed)" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "Connectivity tests completed!" -ForegroundColor Cyan
}

# Show container status
function Show-CT101Status {
    Write-Host "=== CT101 Current Status ===" -ForegroundColor Magenta
    Write-Host ""

    Write-Host "Container Status:" -ForegroundColor Yellow
    Invoke-SSHCommand -Command "pct status $LXC_ID" -Description "Getting container status"

    Write-Host "`nContainer Configuration:" -ForegroundColor Yellow
    Invoke-SSHCommand -Command "pct config $LXC_ID | head -20" -Description "Getting container config (first 20 lines)"

    # Check if container is running for network info
    $status = Invoke-SSHCommand -Command "pct status $LXC_ID"
    if ($status -like "*running*") {
        Write-Host "`nNetwork Information:" -ForegroundColor Yellow
        Invoke-LXCCommand -Command "ip addr show eth0" -Description "Getting container network interface"
        Write-Host ""
        Invoke-LXCCommand -Command "ip route show" -Description "Getting container routing"
        Write-Host ""
        Invoke-LXCCommand -Command "cat /etc/resolv.conf" -Description "Getting container DNS configuration"
    } else {
        Write-Host "`nContainer is not running - cannot get network information" -ForegroundColor Yellow
    }
}

# Show help
function Show-Help {
    Write-Host @"
CT101 Internet Connection PowerShell Script

This script connects LXC container CT101 to the internet via SSH to Proxmox.

Usage: .\connect-ct101.ps1 [action]

Actions:
    setup    - Setup internet connection (default)
    test     - Test internet connectivity only
    status   - Show current container status
    help     - Show this help

Parameters:
    -ProxmoxHost     Proxmox server IP (default: 192.168.30.205)
    -ProxmoxUser     SSH username (default: root)
    -ProxmoxPassword SSH password (default: $erb!234)
    -LXC_ID          Container ID (default: 101)

Examples:
    .\connect-ct101.ps1 setup
    .\connect-ct101.ps1 test
    .\connect-ct101.ps1 status
    .\connect-ct101.ps1 -LXC_ID 102 setup

What this script does:
1. Tests SSH connection to Proxmox server
2. Checks and starts CT101 if needed
3. Enables IP forwarding on Proxmox host
4. Configures NAT/masquerading for internet access
5. Sets up container networking with DHCP
6. Configures DNS servers (8.8.8.8, 1.1.1.1)
7. Tests internet connectivity

Prerequisites:
- Windows PowerShell
- SSH client (Windows 10+ built-in)
- Network access to Proxmox server
- LXC container CT101 must exist on Proxmox

"@
}

# Main execution based on parameters
$action = $args[0]

switch ($action) {
    "setup" {
        Setup-CT101Internet
    }
    "test" {
        Test-CT101Connectivity
    }
    "status" {
        Show-CT101Status
    }
    "help" {
        Show-Help
    }
    default {
        if (-not $action) {
            Setup-CT101Internet
        } else {
            Write-Host "Unknown action: $action" -ForegroundColor Red
            Show-Help
        }
    }
}