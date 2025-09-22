#!/bin/bash

# k3s Installation Script for Proxmox PMS Platform
# Installs and configures k3s Kubernetes for PMS deployment

set -euo pipefail

# Configuration
K3S_VERSION=${K3S_VERSION:-"v1.28.5+k3s1"}
CLUSTER_NAME=${CLUSTER_NAME:-"pms-cluster"}
NODE_IP=${NODE_IP:-$(hostname -I | awk '{print $1}')}
TRAEFIK_ENABLED=${TRAEFIK_ENABLED:-"true"}
INSTALL_REGISTRY=${INSTALL_REGISTRY:-"true"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        log_info "Run as regular user with sudo privileges"
        exit 1
    fi
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."

    # Check Ubuntu version
    if ! grep -q "Ubuntu 22.04" /etc/os-release; then
        log_warning "This script is optimized for Ubuntu 22.04"
    fi

    # Check available memory
    local memory_gb=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $memory_gb -lt 8 ]]; then
        log_error "Minimum 8GB RAM required, found ${memory_gb}GB"
        exit 1
    fi

    # Check available disk space
    local disk_gb=$(df / | awk 'NR==2{printf "%.0f", $4/1024/1024}')
    if [[ $disk_gb -lt 50 ]]; then
        log_error "Minimum 50GB free disk space required, found ${disk_gb}GB"
        exit 1
    fi

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    log_success "System requirements check passed"
}

# Prepare system for k3s
prepare_system() {
    log_info "Preparing system for k3s installation..."

    # Update system
    sudo apt-get update

    # Install required packages
    sudo apt-get install -y \
        curl \
        jq \
        git \
        htop \
        iptables \
        iptables-persistent

    # Configure kernel modules
    sudo modprobe br_netfilter
    sudo modprobe overlay

    # Make modules persistent
    cat << EOF | sudo tee /etc/modules-load.d/k3s.conf
br_netfilter
overlay
EOF

    # Configure sysctl parameters
    cat << EOF | sudo tee /etc/sysctl.d/k3s.conf
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
EOF

    # Apply sysctl settings
    sudo sysctl --system

    # Ensure swap is disabled
    sudo swapoff -a
    sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

    log_success "System preparation completed"
}

# Install k3s
install_k3s() {
    log_info "Installing k3s ${K3S_VERSION}..."

    # Create k3s configuration directory
    sudo mkdir -p /etc/rancher/k3s

    # Create k3s configuration
    cat << EOF | sudo tee /etc/rancher/k3s/config.yaml
cluster-init: true
token: $(openssl rand -hex 32)
node-ip: ${NODE_IP}
cluster-cidr: 10.42.0.0/16
service-cidr: 10.43.0.0/16
disable:
  - local-storage
$(if [[ "$TRAEFIK_ENABLED" != "true" ]]; then echo "  - traefik"; fi)
write-kubeconfig-mode: 644
kube-apiserver-arg:
  - "service-node-port-range=30000-32767"
kubelet-arg:
  - "max-pods=250"
EOF

    # Install k3s
    curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=${K3S_VERSION} sh -s - server

    # Wait for k3s to be ready
    log_info "Waiting for k3s to be ready..."
    until sudo k3s kubectl get nodes | grep -q "Ready"; do
        sleep 5
        echo -n "."
    done
    echo

    # Configure kubectl for current user
    mkdir -p ~/.kube
    sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
    sudo chown $(id -u):$(id -g) ~/.kube/config
    chmod 600 ~/.kube/config

    # Add kubectl alias to bashrc
    if ! grep -q "alias k=" ~/.bashrc; then
        echo "alias k=kubectl" >> ~/.bashrc
        echo "source <(kubectl completion bash)" >> ~/.bashrc
        echo "complete -F __start_kubectl k" >> ~/.bashrc
    fi

    log_success "k3s installation completed"
}

# Install Helm
install_helm() {
    log_info "Installing Helm..."

    # Download and install Helm
    curl https://get.helm.sh/helm-v3.13.0-linux-amd64.tar.gz | tar xz
    sudo mv linux-amd64/helm /usr/local/bin/
    rm -rf linux-amd64

    # Add Helm completion
    if ! grep -q "helm completion bash" ~/.bashrc; then
        echo "source <(helm completion bash)" >> ~/.bashrc
    fi

    log_success "Helm installation completed"
}

# Install cert-manager
install_cert_manager() {
    log_info "Installing cert-manager..."

    # Add cert-manager repository
    helm repo add jetstack https://charts.jetstack.io
    helm repo update

    # Create cert-manager namespace
    kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

    # Install cert-manager
    helm upgrade --install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --version v1.13.2 \
        --set installCRDs=true \
        --set global.leaderElection.namespace=cert-manager

    # Wait for cert-manager to be ready
    kubectl wait --for=condition=Ready pods --all -n cert-manager --timeout=300s

    log_success "cert-manager installation completed"
}

# Configure Traefik (if enabled)
configure_traefik() {
    if [[ "$TRAEFIK_ENABLED" == "true" ]]; then
        log_info "Configuring Traefik..."

        # Create Traefik dashboard IngressRoute
        cat << EOF | kubectl apply -f -
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: traefik-dashboard
  namespace: kube-system
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`traefik.local\`)
      kind: Rule
      services:
        - name: api@internal
          kind: TraefikService
EOF

        log_success "Traefik configuration completed"
    fi
}

# Install local container registry (if enabled)
install_registry() {
    if [[ "$INSTALL_REGISTRY" == "true" ]]; then
        log_info "Installing local container registry..."

        # Create registry namespace
        kubectl create namespace container-registry --dry-run=client -o yaml | kubectl apply -f -

        # Create registry deployment
        cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registry
  namespace: container-registry
spec:
  replicas: 1
  selector:
    matchLabels:
      app: registry
  template:
    metadata:
      labels:
        app: registry
    spec:
      containers:
      - name: registry
        image: registry:2
        ports:
        - containerPort: 5000
        env:
        - name: REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY
          value: /var/lib/registry
        volumeMounts:
        - name: registry-storage
          mountPath: /var/lib/registry
      volumes:
      - name: registry-storage
        hostPath:
          path: /opt/registry
          type: DirectoryOrCreate
---
apiVersion: v1
kind: Service
metadata:
  name: registry
  namespace: container-registry
spec:
  selector:
    app: registry
  ports:
  - port: 5000
    targetPort: 5000
    nodePort: 32000
  type: NodePort
EOF

        # Configure Docker to use insecure registry
        sudo mkdir -p /etc/docker
        cat << EOF | sudo tee /etc/docker/daemon.json
{
  "insecure-registries": ["${NODE_IP}:32000", "localhost:32000"]
}
EOF

        # Restart Docker
        sudo systemctl restart docker

        # Configure k3s to use insecure registry
        cat << EOF | sudo tee /etc/rancher/k3s/registries.yaml
mirrors:
  "${NODE_IP}:32000":
    endpoint:
      - "http://${NODE_IP}:32000"
configs:
  "${NODE_IP}:32000":
    tls:
      insecure_skip_verify: true
EOF

        # Restart k3s
        sudo systemctl restart k3s

        log_success "Local container registry installed at ${NODE_IP}:32000"
    fi
}

# Create storage class
create_storage_class() {
    log_info "Creating storage classes..."

    # Create local-path storage class (default)
    cat << EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: rancher.io/local-path
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
EOF

    # Create fast SSD storage class
    cat << EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: rancher.io/local-path
parameters:
  nodePath: /opt/local-path-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
EOF

    log_success "Storage classes created"
}

# Install monitoring stack
install_monitoring() {
    log_info "Installing monitoring stack..."

    # Add Prometheus community repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    # Create monitoring namespace
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

    # Install kube-prometheus-stack
    helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --set prometheus.prometheusSpec.retention=15d \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --set grafana.adminPassword=admin123 \
        --set grafana.persistence.enabled=true \
        --set grafana.persistence.size=10Gi

    # Create Grafana ingress
    cat << EOF | kubectl apply -f -
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: grafana
  namespace: monitoring
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`grafana.local\`)
      kind: Rule
      services:
        - name: kube-prometheus-stack-grafana
          port: 80
EOF

    log_success "Monitoring stack installed"
}

# Display cluster information
display_cluster_info() {
    log_success "k3s cluster setup completed!"
    echo
    echo "Cluster Information:"
    echo "  - Cluster Name: ${CLUSTER_NAME}"
    echo "  - Node IP: ${NODE_IP}"
    echo "  - Kubernetes Version: $(kubectl version --short | grep 'Server Version' | awk '{print $3}')"
    echo "  - kubectl config: ~/.kube/config"
    echo
    echo "Installed Components:"
    echo "  - k3s Kubernetes"
    echo "  - Helm package manager"
    echo "  - cert-manager for SSL certificates"
    if [[ "$TRAEFIK_ENABLED" == "true" ]]; then
        echo "  - Traefik ingress controller"
        echo "    Dashboard: http://traefik.local (add to /etc/hosts)"
    fi
    if [[ "$INSTALL_REGISTRY" == "true" ]]; then
        echo "  - Local container registry: ${NODE_IP}:32000"
    fi
    echo "  - Prometheus + Grafana monitoring"
    echo "    Grafana: http://grafana.local (admin/admin123)"
    echo
    echo "Useful Commands:"
    echo "  - Check cluster status: kubectl get nodes"
    echo "  - View all pods: kubectl get pods --all-namespaces"
    echo "  - Access Grafana: kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80"
    echo "  - Get cluster token: sudo cat /var/lib/rancher/k3s/server/node-token"
    echo
    echo "Add to /etc/hosts:"
    echo "  ${NODE_IP} traefik.local grafana.local"
    echo
    echo "Next steps:"
    echo "  1. Configure your domain DNS to point to ${NODE_IP}"
    echo "  2. Run the PMS deployment script: ./proxmox-deploy.sh"
}

# Main execution
main() {
    log_info "Starting k3s installation for PMS Platform"

    check_root
    check_requirements
    prepare_system
    install_k3s
    install_helm
    install_cert_manager
    configure_traefik
    install_registry
    create_storage_class
    install_monitoring

    display_cluster_info
}

# Help function
show_help() {
    cat << EOF
k3s Installation Script for PMS Platform

Usage: $0 [OPTIONS]

Options:
    -h, --help             Show this help message

Environment Variables:
    K3S_VERSION            k3s version to install (default: v1.28.5+k3s1)
    CLUSTER_NAME           Cluster name (default: pms-cluster)
    NODE_IP                Node IP address (default: auto-detected)
    TRAEFIK_ENABLED        Enable Traefik ingress (default: true)
    INSTALL_REGISTRY       Install local registry (default: true)

Examples:
    # Install with default settings
    ./k3s-install.sh

    # Install specific version
    K3S_VERSION=v1.29.0+k3s1 ./k3s-install.sh

    # Install without Traefik
    TRAEFIK_ENABLED=false ./k3s-install.sh

EOF
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac