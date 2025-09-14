# PowerShell script to setup k3s locally on Windows
# Run this with: powershell -ExecutionPolicy Bypass -File setup-k3s-local.ps1

Write-Host "Setting up k3s local development environment..." -ForegroundColor Green

# Check if Docker is running
$dockerStatus = docker info 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Create k3s using Docker (k3d)
Write-Host "Installing k3d (k3s in Docker)..." -ForegroundColor Yellow
if (!(Get-Command k3d -ErrorAction SilentlyContinue)) {
    # Install k3d using PowerShell
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/k3d-io/k3d/main/install.ps1" -OutFile "install-k3d.ps1"
    powershell -ExecutionPolicy Bypass -File install-k3d.ps1
    Remove-Item install-k3d.ps1
}

# Create k3s cluster with registry
Write-Host "Creating k3s cluster with local registry..." -ForegroundColor Yellow
k3d cluster create pms-local --api-port 6550 --servers 1 --agents 2 --port "80:80@loadbalancer" --port "443:443@loadbalancer" --registry-create pms-registry:0.0.0.0:5000

# Wait for cluster to be ready
Write-Host "Waiting for cluster to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready nodes --all --timeout=300s

# Install Helm if not present
if (!(Get-Command helm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Helm..." -ForegroundColor Yellow
    choco install kubernetes-helm -y
}

# Add Helm repositories
Write-Host "Adding Helm repositories..." -ForegroundColor Yellow
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Create namespaces
Write-Host "Creating Kubernetes namespaces..." -ForegroundColor Yellow
kubectl create namespace pms-core --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-backend --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-frontend --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-marketplace --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-infra --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# Add local DNS entries to hosts file (requires admin privileges)
$hostsFile = "C:\Windows\System32\drivers\etc\hosts"
$entries = @(
    "127.0.0.1 auth.pms.local"
    "127.0.0.1 api.pms.local"
    "127.0.0.1 admin.pms.local"
    "127.0.0.1 guest.pms.local"
    "127.0.0.1 staff.pms.local"
    "127.0.0.1 marketplace.pms.local"
)

Write-Host "Adding local DNS entries to hosts file..." -ForegroundColor Yellow
foreach ($entry in $entries) {
    $exists = Select-String -Path $hostsFile -Pattern $entry -Quiet
    if (-not $exists) {
        Add-Content -Path $hostsFile -Value $entry -Force
    }
}

Write-Host "k3s local development environment setup complete!" -ForegroundColor Green
Write-Host "Cluster info:" -ForegroundColor Cyan
kubectl cluster-info
Write-Host "Registry is available at: localhost:5000" -ForegroundColor Cyan