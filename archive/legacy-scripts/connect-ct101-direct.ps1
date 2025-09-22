# PowerShell Script for Direct SSH Connection to CT101
# Connects directly to CT101 container at 192.168.30.98

param(
    [string]$Username = "root",
    [string]$Command = "",
    [switch]$Test
)

# Configuration
$CT101_IP = "192.168.30.98"
$CT101_PASSWORD = "root123"

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-Info($message) { Write-Host "${Blue}[INFO]${Reset} $message" }
function Write-Success($message) { Write-Host "${Green}[SUCCESS]${Reset} $message" }
function Write-Warning($message) { Write-Host "${Yellow}[WARNING]${Reset} $message" }
function Write-Error($message) { Write-Host "${Red}[ERROR]${Reset} $message" }

Write-Host "======================================"
Write-Host "Direct SSH Connection to CT101"
Write-Host "======================================"
Write-Host ""
Write-Host "Container IP: $CT101_IP"
Write-Host "Username: $Username"
Write-Host "Password: $CT101_PASSWORD"
Write-Host ""

# Test network connectivity
Write-Info "Testing network connectivity to CT101..."
try {
    $testResult = Test-NetConnection -ComputerName $CT101_IP -Port 22 -InformationLevel Quiet
    if ($testResult.TcpTestSucceeded) {
        Write-Success "Network connectivity to CT101:22 confirmed"
    } else {
        Write-Error "Cannot connect to CT101:22"
        exit 1
    }
} catch {
    Write-Error "Network test failed: $_"
    exit 1
}

# Function to execute SSH command
function Invoke-SSH {
    param(
        [string]$SSHCommand = ""
    )

    Write-Info "Connecting to CT101 via SSH..."

    if ($SSHCommand) {
        Write-Host "Executing command: $SSHCommand"
        Write-Host "You will be prompted for password: $CT101_PASSWORD"
        Write-Host ""

        $sshArgs = @(
            "-o", "StrictHostKeyChecking=no"
            "-o", "ConnectTimeout=10"
            "$Username@$CT101_IP"
            $SSHCommand
        )

        & ssh $sshArgs
    } else {
        Write-Host "Starting interactive SSH session..."
        Write-Host "You will be prompted for password: $CT101_PASSWORD"
        Write-Host ""

        $sshArgs = @(
            "-o", "StrictHostKeyChecking=no"
            "$Username@$CT101_IP"
        )

        & ssh $sshArgs
    }
}

# Test mode - run basic connectivity tests
if ($Test) {
    Write-Info "Running connectivity tests..."

    # Test basic SSH connection
    Write-Info "Testing SSH authentication..."
    $testCommand = "echo 'SSH connection successful!' && hostname && whoami && date"
    Invoke-SSH -SSHCommand $testCommand

    if ($LASTEXITCODE -eq 0) {
        Write-Success "SSH connection test passed!"
    } else {
        Write-Error "SSH connection test failed!"
    }

    exit $LASTEXITCODE
}

# Execute specific command or start interactive session
if ($Command) {
    Invoke-SSH -SSHCommand $Command
} else {
    Invoke-SSH
}

Write-Host ""
Write-Success "SSH session completed"