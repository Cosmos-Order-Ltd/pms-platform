#!/bin/bash
# Setup k3s local development environment for Git Bash/WSL

set -e

echo "🚀 Setting up k3s local development environment..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Install k3d if not present
if ! command -v k3d &> /dev/null; then
    echo "📦 Installing k3d..."
    curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
fi

# Create k3s cluster with registry
echo "🏗️ Creating k3s cluster with local registry..."
k3d cluster create pms-local \
    --api-port 6550 \
    --servers 1 \
    --agents 2 \
    --port "80:80@loadbalancer" \
    --port "443:443@loadbalancer" \
    --registry-create pms-registry:0.0.0.0:5000

# Wait for cluster to be ready
echo "⏳ Waiting for cluster to be ready..."
kubectl wait --for=condition=ready nodes --all --timeout=300s

# Install kubectl if not present (for WSL/Git Bash)
if ! command -v kubectl &> /dev/null; then
    echo "📦 Installing kubectl..."
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    sudo mv kubectl /usr/local/bin/
fi

# Install Helm if not present
if ! command -v helm &> /dev/null; then
    echo "📦 Installing Helm..."
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi

# Add Helm repositories
echo "📋 Adding Helm repositories..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Create namespaces
echo "🏷️ Creating Kubernetes namespaces..."
kubectl create namespace pms-core --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-backend --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-frontend --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-marketplace --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace pms-infra --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

echo "✅ k3s local development environment setup complete!"
echo "🔍 Cluster info:"
kubectl cluster-info
echo "📦 Registry is available at: localhost:5000"
echo ""
echo "🌐 Add these entries to your /etc/hosts file (or C:/Windows/System32/drivers/etc/hosts on Windows):"
echo "127.0.0.1 auth.pms.local"
echo "127.0.0.1 api.pms.local"
echo "127.0.0.1 admin.pms.local"
echo "127.0.0.1 guest.pms.local"
echo "127.0.0.1 staff.pms.local"
echo "127.0.0.1 marketplace.pms.local"