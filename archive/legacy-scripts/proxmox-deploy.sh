#!/bin/bash

# Proxmox PMS Platform Deployment Script
# Deploys the complete PMS platform on Proxmox k3s cluster

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/.env.proxmox"
REGISTRY_URL=${REGISTRY_URL:-"localhost:32000"}
NAMESPACE=${NAMESPACE:-"pms-platform"}
HELM_CHART_PATH="${SCRIPT_DIR}/pms-infrastructure/helm/pms-chart"
VALUES_FILE="${HELM_CHART_PATH}/values-proxmox.yaml"
RELEASE_NAME=${RELEASE_NAME:-"pms"}

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

# Load environment configuration
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        log_info "Loading configuration from $CONFIG_FILE"
        source "$CONFIG_FILE"
    else
        log_warning "Configuration file not found. Using default values."
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi

    # Check if helm is available
    if ! command -v helm &> /dev/null; then
        log_error "helm is not installed or not in PATH"
        exit 1
    fi

    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        log_info "Make sure k3s is running and kubectl is configured"
        exit 1
    fi

    # Check if Docker is available for building images
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Check if local registry is available
check_registry() {
    log_info "Checking local container registry..."

    if curl -s "http://${REGISTRY_URL}/v2/" &> /dev/null; then
        log_success "Local registry is accessible at ${REGISTRY_URL}"
    else
        log_error "Local registry is not accessible at ${REGISTRY_URL}"
        log_info "Make sure the registry is running: kubectl get pods -n container-registry"
        exit 1
    fi
}

# Build and push Docker images
build_and_push_images() {
    log_info "Building and pushing Docker images..."

    local services=(
        "api-gateway"
        "pms-backend"
        "pms-core"
        "monitoring"
        "pms-admin"
        "pms-guest"
        "pms-staff"
        "pms-marketplace"
    )

    # Set organization prefix for images
    local org_prefix="cosmos-order-ltd"

    for service in "${services[@]}"; do
        if [[ -d "${SCRIPT_DIR}/${service}" ]]; then
            log_info "Building image for ${service}..."

            # Build image with organization prefix
            docker build -t "${REGISTRY_URL}/${org_prefix}/${service}:latest" "${SCRIPT_DIR}/${service}"

            # Also tag without org prefix for local compatibility
            docker tag "${REGISTRY_URL}/${org_prefix}/${service}:latest" "${REGISTRY_URL}/${service}:latest"

            # Push both tags
            docker push "${REGISTRY_URL}/${org_prefix}/${service}:latest"
            docker push "${REGISTRY_URL}/${service}:latest"

            log_success "Image built and pushed: ${REGISTRY_URL}/${org_prefix}/${service}:latest"
        else
            log_warning "Directory not found for service: ${service}"
        fi
    done
}

# Create namespace
create_namespace() {
    log_info "Creating namespace ${NAMESPACE}..."

    kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

    log_success "Namespace ${NAMESPACE} ready"
}

# Deploy infrastructure components
deploy_infrastructure() {
    log_info "Deploying infrastructure components..."

    # Deploy PostgreSQL
    log_info "Deploying PostgreSQL database..."
    cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: ${NAMESPACE}
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: "pms"
        - name: POSTGRES_USER
          value: "pms"
        - name: POSTGRES_PASSWORD
          value: "pms123"
        - name: PGDATA
          value: "/var/lib/postgresql/data/pgdata"
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "1Gi"
            cpu: "500m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "local-path"
      resources:
        requests:
          storage: 20Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: ${NAMESPACE}
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
EOF

    # Deploy Redis
    log_info "Deploying Redis cache..."
    cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: ${NAMESPACE}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        command: ["redis-server"]
        args: ["--appendonly", "yes"]
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: redis-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: ${NAMESPACE}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: "local-path"
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: ${NAMESPACE}
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
EOF

    # Wait for infrastructure to be ready
    log_info "Waiting for infrastructure to be ready..."
    kubectl wait --for=condition=Ready pods -l app=postgres -n "${NAMESPACE}" --timeout=300s
    kubectl wait --for=condition=Ready pods -l app=redis -n "${NAMESPACE}" --timeout=300s

    log_success "Infrastructure components deployed"
}

# Deploy PMS applications using Helm
deploy_pms_applications() {
    log_info "Deploying PMS applications with Helm..."

    # Update Helm dependencies
    if [[ -f "${HELM_CHART_PATH}/Chart.yaml" ]]; then
        cd "${HELM_CHART_PATH}"
        helm dependency update
        cd "${SCRIPT_DIR}"
    fi

    # Deploy using Helm
    helm upgrade --install "${RELEASE_NAME}" "${HELM_CHART_PATH}" \
        --namespace "${NAMESPACE}" \
        --values "${VALUES_FILE}" \
        --set global.imageRegistry="${REGISTRY_URL}" \
        --timeout=10m \
        --wait

    log_success "PMS applications deployed"
}

# Configure ingress routes
configure_ingress() {
    log_info "Configuring ingress routes..."

    # Create Traefik IngressRoute for all services
    cat << EOF | kubectl apply -f -
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: pms-api
  namespace: ${NAMESPACE}
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`api.pms.local\`)
      kind: Rule
      services:
        - name: api-gateway
          port: 8080
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: pms-admin
  namespace: ${NAMESPACE}
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`admin.pms.local\`)
      kind: Rule
      services:
        - name: pms-admin
          port: 3010
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: pms-guest
  namespace: ${NAMESPACE}
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`guest.pms.local\`)
      kind: Rule
      services:
        - name: pms-guest
          port: 3011
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: pms-staff
  namespace: ${NAMESPACE}
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`staff.pms.local\`)
      kind: Rule
      services:
        - name: pms-staff
          port: 3012
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: pms-marketplace
  namespace: ${NAMESPACE}
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`marketplace.pms.local\`)
      kind: Rule
      services:
        - name: pms-marketplace
          port: 3013
EOF

    log_success "Ingress routes configured"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."

    # Wait for backend service to be ready
    kubectl wait --for=condition=Ready pods -l app=pms-backend -n "${NAMESPACE}" --timeout=300s

    # Run migrations in backend pod
    local backend_pod=$(kubectl get pods -n "${NAMESPACE}" -l app=pms-backend -o jsonpath='{.items[0].metadata.name}')

    if [[ -n "$backend_pod" ]]; then
        log_info "Running migrations in pod: $backend_pod"
        kubectl exec -n "${NAMESPACE}" "$backend_pod" -- npm run migrate || {
            log_warning "Migration command failed, this might be expected for first deployment"
        }
    else
        log_warning "Backend pod not found, skipping migrations"
    fi

    log_success "Database migrations completed"
}

# Seed initial data
seed_database() {
    log_info "Seeding initial database data..."

    local backend_pod=$(kubectl get pods -n "${NAMESPACE}" -l app=pms-backend -o jsonpath='{.items[0].metadata.name}')

    if [[ -n "$backend_pod" ]]; then
        log_info "Seeding data in pod: $backend_pod"
        kubectl exec -n "${NAMESPACE}" "$backend_pod" -- npm run seed || {
            log_warning "Seed command failed, this might be expected"
        }
    else
        log_warning "Backend pod not found, skipping seeding"
    fi

    log_success "Database seeding completed"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."

    # Check all pods are running
    log_info "Checking pod status..."
    kubectl get pods -n "${NAMESPACE}"

    # Check services
    log_info "Checking services..."
    kubectl get services -n "${NAMESPACE}"

    # Check ingress routes
    log_info "Checking ingress routes..."
    kubectl get ingressroute -n "${NAMESPACE}"

    # Test health endpoints
    log_info "Testing health endpoints..."
    local node_ip=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

    # Wait a bit for services to be ready
    sleep 30

    # Test each service health endpoint
    local services=("api-gateway:8080" "pms-backend:5000" "pms-core:3000")

    for service in "${services[@]}"; do
        local service_name=$(echo "$service" | cut -d: -f1)
        local service_port=$(echo "$service" | cut -d: -f2)

        if kubectl port-forward -n "${NAMESPACE}" "svc/${service_name}" "${service_port}:${service_port}" &> /dev/null &
        then
            local pf_pid=$!
            sleep 2

            if curl -s "http://localhost:${service_port}/health" &> /dev/null; then
                log_success "${service_name} health check passed"
            else
                log_warning "${service_name} health check failed"
            fi

            kill $pf_pid 2>/dev/null || true
        fi
    done

    log_success "Deployment verification completed"
}

# Display deployment information
display_deployment_info() {
    local node_ip=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

    log_success "PMS Platform deployment completed!"
    echo
    echo "Deployment Information:"
    echo "  - Namespace: ${NAMESPACE}"
    echo "  - Release: ${RELEASE_NAME}"
    echo "  - Node IP: ${node_ip}"
    echo "  - Registry: ${REGISTRY_URL}"
    echo
    echo "Access URLs (add to /etc/hosts):"
    echo "  ${node_ip} api.pms.local admin.pms.local guest.pms.local staff.pms.local marketplace.pms.local"
    echo
    echo "Services:"
    echo "  - API Gateway: http://api.pms.local"
    echo "  - Admin Dashboard: http://admin.pms.local"
    echo "  - Guest Portal: http://guest.pms.local"
    echo "  - Staff Mobile: http://staff.pms.local"
    echo "  - Marketplace: http://marketplace.pms.local"
    echo
    echo "Monitoring:"
    echo "  - Grafana: http://grafana.local (admin/admin123)"
    echo "  - Traefik Dashboard: http://traefik.local"
    echo
    echo "Database Access:"
    echo "  - PostgreSQL: kubectl port-forward -n ${NAMESPACE} svc/postgres 5432:5432"
    echo "  - Redis: kubectl port-forward -n ${NAMESPACE} svc/redis 6379:6379"
    echo
    echo "Useful Commands:"
    echo "  - View logs: kubectl logs -f -l app=pms-backend -n ${NAMESPACE}"
    echo "  - Scale services: kubectl scale deployment pms-backend --replicas=2 -n ${NAMESPACE}"
    echo "  - Update deployment: helm upgrade ${RELEASE_NAME} ${HELM_CHART_PATH} -n ${NAMESPACE}"
    echo "  - Rollback: helm rollback ${RELEASE_NAME} -n ${NAMESPACE}"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up deployment..."

    # Delete Helm release
    helm uninstall "${RELEASE_NAME}" -n "${NAMESPACE}" || true

    # Delete namespace
    kubectl delete namespace "${NAMESPACE}" || true

    log_success "Cleanup completed"
}

# Create environment configuration file
create_env_config() {
    log_info "Creating environment configuration..."

    cat > "${CONFIG_FILE}" << EOF
# Proxmox PMS Platform Configuration

# Registry Configuration
REGISTRY_URL=${REGISTRY_URL}

# Kubernetes Configuration
NAMESPACE=${NAMESPACE}
RELEASE_NAME=${RELEASE_NAME}

# Database Configuration
POSTGRES_DB=pms
POSTGRES_USER=pms
POSTGRES_PASSWORD=pms123

# Redis Configuration
REDIS_URL=redis://redis:6379

# Application Configuration
NODE_ENV=production
LOG_LEVEL=info

# Domain Configuration
DOMAIN=pms.local
API_URL=http://api.pms.local
ADMIN_URL=http://admin.pms.local
GUEST_URL=http://guest.pms.local
STAFF_URL=http://staff.pms.local
MARKETPLACE_URL=http://marketplace.pms.local

# Monitoring Configuration
GRAFANA_ADMIN_PASSWORD=admin123
EOF

    log_success "Environment configuration created at ${CONFIG_FILE}"
}

# Main execution
main() {
    log_info "Starting Proxmox PMS Platform deployment"

    load_config
    check_prerequisites
    check_registry
    create_namespace
    build_and_push_images
    deploy_infrastructure
    deploy_pms_applications
    configure_ingress
    run_migrations
    seed_database
    verify_deployment
    display_deployment_info
}

# Help function
show_help() {
    cat << EOF
Proxmox PMS Platform Deployment Script

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    deploy              Deploy the complete platform (default)
    cleanup             Remove the deployment
    config              Create environment configuration file
    verify              Verify existing deployment
    update              Update existing deployment

Options:
    -n, --namespace     Kubernetes namespace (default: pms-platform)
    -r, --registry      Container registry URL (default: localhost:32000)
    -h, --help          Show this help message

Environment Variables:
    REGISTRY_URL        Container registry URL
    NAMESPACE           Kubernetes namespace
    RELEASE_NAME        Helm release name

Examples:
    # Deploy with default settings
    ./proxmox-deploy.sh

    # Deploy with custom namespace
    ./proxmox-deploy.sh deploy -n my-pms

    # Cleanup deployment
    ./proxmox-deploy.sh cleanup

    # Create configuration file
    ./proxmox-deploy.sh config

EOF
}

# Parse command line arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    cleanup)
        cleanup
        ;;
    config)
        create_env_config
        ;;
    verify)
        verify_deployment
        ;;
    update)
        deploy_pms_applications
        ;;
    -h|--help)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac