
@echo off
echo 🌌 Cosmos Order Protocol - DNS Configuration
echo Adding cosmic domains to Windows hosts file...
echo.

REM Backup existing hosts file
copy C:\Windows\System32\drivers\etc\hosts C:\Windows\System32\drivers\etc\hosts.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%

REM Add Cosmos domains (requires admin privileges)
echo.
echo # COSMOS ORDER PROTOCOL - START >> C:\Windows\System32\drivers\etc\hosts
type cosmos-hosts.txt >> C:\Windows\System32\drivers\etc\hosts
echo # COSMOS ORDER PROTOCOL - END >> C:\Windows\System32\drivers\etc\hosts

echo.
echo ✅ Cosmic domains added to hosts file
echo 🚀 Access the cosmic empire at: http://gateway.platform.cosmos:3034
echo 💎 Test with: ping gateway.platform.cosmos
echo.
pause
