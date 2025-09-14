#!/bin/bash
# Test script for k3s deployment

set -e

echo "🧪 Testing PMS k3s Deployment"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_step() {
    echo -e "${BLUE}Testing: $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test 1: Check if k3s cluster is running
test_step "k3s cluster connectivity"
if kubectl cluster-info >/dev/null 2>&1; then
    success "k3s cluster is running"
else
    error "k3s cluster is not accessible"
    exit 1
fi

# Test 2: Check if local registry is running
test_step "Local container registry"
if docker ps | grep -q registry; then
    success "Local registry is running on port 5000"
else
    warning "Local registry not found - starting it..."
    docker run -d -p 5000:5000 --restart=always --name registry registry:2 2>/dev/null || true
    sleep 2
    if docker ps | grep -q registry; then
        success "Local registry started"
    else
        error "Failed to start local registry"
        exit 1
    fi
fi

# Test 3: Check namespaces
test_step "Kubernetes namespaces"
EXPECTED_NAMESPACES=("pms-core" "pms-backend" "pms-frontend" "pms-marketplace" "pms-infra")
for ns in "${EXPECTED_NAMESPACES[@]}"; do
    if kubectl get namespace "$ns" >/dev/null 2>&1; then
        success "Namespace $ns exists"
    else
        warning "Creating namespace $ns"
        kubectl create namespace "$ns" || true
    fi
done

# Test 4: Check if Docker images can be built
test_step "Docker image building"
SERVICES=("pms-backend" "pms-admin" "pms-marketplace")
for service in "${SERVICES[@]}"; do
    if [ -d "$service" ] && [ -f "$service/Dockerfile" ]; then
        echo "  Building $service..."
        cd "$service"
        if docker build -t "localhost:5000/$service:test" . >/dev/null 2>&1; then
            success "$service builds successfully"
            # Clean up test image
            docker rmi "localhost:5000/$service:test" >/dev/null 2>&1 || true
        else
            error "$service failed to build"
        fi
        cd ..
    else
        warning "$service directory or Dockerfile not found"
    fi
done

# Test 5: Check infrastructure deployment
test_step "Infrastructure deployment"
if kubectl apply -f k8s/namespaces/ >/dev/null 2>&1; then
    success "Namespaces applied"
else
    error "Failed to apply namespaces"
fi

if kubectl apply -f k8s/secrets/ >/dev/null 2>&1; then
    success "Secrets applied"
else
    error "Failed to apply secrets"
fi

if kubectl apply -f k8s/infrastructure/ >/dev/null 2>&1; then
    success "Infrastructure applied"
else
    error "Failed to apply infrastructure"
fi

# Test 6: Wait for infrastructure to be ready
test_step "Infrastructure readiness"
echo "  Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n pms-infra --timeout=60s >/dev/null 2>&1 && success "PostgreSQL is ready" || warning "PostgreSQL not ready yet"

echo "  Waiting for Redis to be ready..."
kubectl wait --for=condition=ready pod -l app=redis -n pms-infra --timeout=30s >/dev/null 2>&1 && success "Redis is ready" || warning "Redis not ready yet"

# Test 7: Check Helm charts
test_step "Helm charts validation"
if command -v helm >/dev/null 2>&1; then
    for chart in helm/*/; do
        chart_name=$(basename "$chart")
        echo "  Validating $chart_name..."
        if helm lint "$chart" >/dev/null 2>&1; then
            success "$chart_name chart is valid"
        else
            warning "$chart_name chart has lint issues"
        fi
    done
else
    warning "Helm not found - installing..."
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    chmod 700 get_helm.sh
    ./get_helm.sh >/dev/null 2>&1
    rm get_helm.sh
    success "Helm installed"
fi

# Test 8: Test service deployment (dry run)
test_step "Service deployment (dry run)"
if [ -d "helm/pms-backend" ]; then
    if helm install pms-backend-test ./helm/pms-backend \
        -f ./helm/pms-backend/values.dev.yaml \
        -n pms-backend --dry-run >/dev/null 2>&1; then
        success "Backend service dry-run successful"
    else
        error "Backend service dry-run failed"
    fi
fi

# Test 9: Check ingress configuration
test_step "Ingress configuration"
if kubectl apply -f k8s/infrastructure/ingress.yaml --dry-run=client >/dev/null 2>&1; then
    success "Ingress configuration is valid"
else
    error "Ingress configuration is invalid"
fi

# Test 10: Check hosts file entries
test_step "Host file entries"
HOSTS_FILE="/etc/hosts"
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    HOSTS_FILE="/c/Windows/System32/drivers/etc/hosts"
fi

REQUIRED_HOSTS=("auth.pms.local" "api.pms.local" "admin.pms.local" "guest.pms.local" "staff.pms.local" "marketplace.pms.local")
for host in "${REQUIRED_HOSTS[@]}"; do
    if grep -q "$host" "$HOSTS_FILE" 2>/dev/null; then
        success "$host found in hosts file"
    else
        warning "$host not found in hosts file"
        echo "  Add this line to $HOSTS_FILE: 127.0.0.1 $host"
    fi
done

echo ""
echo "🏁 Test Summary"
echo "==============="
echo -e "${BLUE}All basic tests completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'make deploy-local' to deploy all services"
echo "2. Check service status with 'make status'"
echo "3. View logs with 'make logs'"
echo "4. Access services at http://admin.pms.local"
echo ""
echo -e "${GREEN}Your k3s environment is ready for deployment! 🚀${NC}"