@echo off
echo Setting up PMS domains in Windows hosts file...

echo.
echo Adding domains to C:\Windows\System32\drivers\etc\hosts
echo You may need to run this as Administrator if it fails.
echo.

:: Add domains pointing to localhost
echo 127.0.0.1    marketplace.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    admin.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    guest.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    staff.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    api.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    backend.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    core.pms.cosmmos >> C:\Windows\System32\drivers\etc\hosts

echo.
echo Domain setup complete! Access your applications at:
echo   🏪 Marketplace:    http://marketplace.pms.cosmmos:30080
echo   🎛️  Admin:          http://admin.pms.cosmmos:30080
echo   👥 Guest:          http://guest.pms.cosmmos:30080
echo   📱 Staff:          http://staff.pms.cosmmos:30080
echo   🌐 API Gateway:    http://api.pms.cosmmos:30080
echo   🔧 Backend:        http://backend.pms.cosmmos:30080
echo   ⚙️  Core:          http://core.pms.cosmmos:30080
echo.
pause