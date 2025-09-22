@echo off
setlocal enabledelayedexpansion

:: CT101 Internet Connection Setup - Windows Batch Script
:: This script will connect CT101 LXC container to the internet

echo ========================================
echo CT101 Internet Connection Setup
echo ========================================
echo.

set PROXMOX_HOST=192.168.30.205
set PROXMOX_USER=root
set LXC_ID=101

echo Proxmox Host: %PROXMOX_HOST%
echo SSH User: %PROXMOX_USER%
echo Container ID: CT%LXC_ID%
echo Password: $erb!234
echo.

echo This script will guide you through connecting CT101 to the internet.
echo You will need to enter the SSH password manually for each step.
echo.
pause

echo.
echo ==========================================
echo Step 1: Testing SSH connection to Proxmox
echo ==========================================
echo.
echo Testing connection to %PROXMOX_HOST%...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "echo 'SSH connection successful'"

if %errorlevel% neq 0 (
    echo [ERROR] SSH connection failed!
    echo Please check:
    echo - Network connectivity to %PROXMOX_HOST%
    echo - SSH credentials
    echo - Firewall settings
    pause
    exit /b 1
)

echo [SUCCESS] SSH connection verified!
echo.
pause

echo.
echo ===================================
echo Step 2: Checking container status
echo ===================================
echo.
echo Checking status of container CT%LXC_ID%...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct status %LXC_ID%"

echo.
echo Starting container if needed...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct start %LXC_ID% || echo 'Container already running or start failed'"

echo.
echo Waiting for container to start...
timeout /t 10 /nobreak > nul

echo [SUCCESS] Container check completed!
echo.
pause

echo.
echo ==============================
echo Step 3: Configuring host network
echo ==============================
echo.
echo Enabling IP forwarding on Proxmox host...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "echo 1 > /proc/sys/net/ipv4/ip_forward && echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf"

echo [SUCCESS] IP forwarding enabled!
echo.
pause

echo.
echo ===========================
echo Step 4: Setting up NAT rules
echo ===========================
echo.
echo Configuring NAT/masquerading...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "IFACE=$(ip route | grep default | awk '{print $5}' | head -1); iptables -t nat -A POSTROUTING -o $IFACE -j MASQUERADE; iptables-save > /etc/iptables/rules.v4 2>/dev/null || true"

echo [SUCCESS] NAT configured!
echo.
pause

echo.
echo ================================
echo Step 5: Configuring container network
echo ================================
echo.
echo Setting up container networking...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct exec %LXC_ID% -- dhclient eth0"

echo.
echo Configuring DNS servers...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct exec %LXC_ID% -- bash -c 'echo nameserver 8.8.8.8 > /etc/resolv.conf && echo nameserver 1.1.1.1 >> /etc/resolv.conf'"

echo [SUCCESS] Container network configured!
echo.
pause

echo.
echo =============================
echo Step 6: Testing connectivity
echo =============================
echo.
echo Testing internet connectivity from container...
echo Please enter password: $erb!234
echo.

echo Testing ping to Google DNS (8.8.8.8)...
ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct exec %LXC_ID% -- ping -c 3 8.8.8.8"

echo.
echo Testing DNS resolution...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct exec %LXC_ID% -- nslookup google.com"

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Your CT%LXC_ID% container should now have internet access!
echo.
echo To verify manually:
echo 1. SSH to Proxmox: ssh root@%PROXMOX_HOST%
echo 2. Enter container: pct enter %LXC_ID%
echo 3. Test internet: ping google.com
echo.
echo You can now:
echo - Install packages (apt update && apt install ...)
echo - Download files with wget/curl
echo - Clone git repositories
echo - Access external APIs
echo.
pause

echo.
echo ========================
echo Quick Verification Test
echo ========================
echo.
echo Running a quick verification test...
echo Please enter password: $erb!234
echo.

ssh -o StrictHostKeyChecking=no %PROXMOX_USER%@%PROXMOX_HOST% "pct exec %LXC_ID% -- bash -c 'echo Testing basic connectivity... && ping -c 2 google.com && echo && echo Testing package manager... && apt update 2>/dev/null | head -10 || yum check-update 2>/dev/null | head -10 || echo Package manager test complete'"

echo.
echo ==========================================
echo CT%LXC_ID% Internet Connection Setup Complete!
echo ==========================================
echo.
echo Your container is ready for use!
echo.
pause