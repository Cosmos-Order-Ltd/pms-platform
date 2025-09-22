#!/bin/bash
# Local development environment without k3s
# For development when Docker Desktop is not available

set -e

echo "🚀 Starting Local PMS Development Environment"
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    error "Node.js not found. Please install Node.js v20 or higher"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js version $NODE_VERSION is too old. Please install Node.js v18 or higher"
    exit 1
fi

success "Node.js $(node --version) found"

# Check available services
info "Checking available services..."

SERVICES=()

# Check pms-backend
if [ -d "pms-backend" ] && [ -f "pms-backend/package.json" ]; then
    SERVICES+=("pms-backend:5000")
    success "pms-backend service available"
else
    warning "pms-backend service not found or incomplete"
fi

# Check pms-admin
if [ -d "pms-admin" ] && [ -f "pms-admin/package.json" ]; then
    SERVICES+=("pms-admin:3000")
    success "pms-admin service available"
else
    warning "pms-admin service not found or incomplete"
fi

# Check pms-shared
if [ -d "pms-shared" ] && [ -f "pms-shared/package.json" ]; then
    success "pms-shared library available"
else
    warning "pms-shared library not found or incomplete"
fi

if [ ${#SERVICES[@]} -eq 0 ]; then
    error "No services found to run"
    exit 1
fi

echo ""
info "Available services to run:"
for service in "${SERVICES[@]}"; do
    name=$(echo "$service" | cut -d':' -f1)
    port=$(echo "$service" | cut -d':' -f2)
    echo "  - $name (http://localhost:$port)"
done

echo ""
echo "🔧 Development Commands:"
echo "========================"
echo ""
echo "Run individual services:"
for service in "${SERVICES[@]}"; do
    name=$(echo "$service" | cut -d':' -f1)
    port=$(echo "$service" | cut -d':' -f2)
    echo "  make dev-${name#pms-}    # Start $name on port $port"
done

echo ""
echo "Build and test:"
echo "  make build-all      # Build all services"
echo "  make test-all       # Run tests for all services"
echo "  make lint-all       # Lint all services"
echo ""

echo "Docker-based deployment:"
echo "  ./setup-k3s-local.sh   # Setup k3s cluster (requires Docker)"
echo "  make deploy-local      # Deploy to k3s (requires Docker)"
echo ""

echo "📚 Documentation:"
echo "  cat K8S_DEPLOYMENT_GUIDE.md    # Full k3s deployment guide"
echo "  cat DEPLOYMENT_SUMMARY.md      # Architecture overview"
echo ""

success "Local development environment ready!"
echo ""
echo "🎯 Quick Start:"
echo "1. Install dependencies: cd pms-backend && npm install"
echo "2. Start service: make dev-backend"
echo "3. Open another terminal and start admin: make dev-admin"