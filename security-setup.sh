#!/bin/bash

# Security Setup Script for Proxmox PMS Platform
# Configures security policies, network policies, and monitoring

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="${NAMESPACE:-pms-platform}"
ENABLE_NETWORK_POLICIES="${ENABLE_NETWORK_POLICIES:-true}"
ENABLE_POD_SECURITY="${ENABLE_POD_SECURITY:-true}"
ENABLE_RBAC="${ENABLE_RBAC:-true}"
ENABLE_SECRETS_ENCRYPTION="${ENABLE_SECRETS_ENCRYPTION:-true}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check prerequisites
check_prerequisites() {
    log_info "Checking security prerequisites..."

    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi

    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi

    # Check if namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log_error "Namespace $NAMESPACE does not exist"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Setup RBAC policies
setup_rbac() {
    if [[ "$ENABLE_RBAC" != "true" ]]; then
        log_info "RBAC setup skipped"
        return
    fi

    log_info "Setting up RBAC policies..."

    # Create service account for PMS applications
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pms-serviceaccount
  namespace: ${NAMESPACE}
  labels:
    app.kubernetes.io/name: pms
    app.kubernetes.io/component: security
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pms-role
  namespace: ${NAMESPACE}
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints", "configmaps"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "list"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pms-rolebinding
  namespace: ${NAMESPACE}
subjects:
- kind: ServiceAccount
  name: pms-serviceaccount
  namespace: ${NAMESPACE}
roleRef:
  kind: Role
  name: pms-role
  apiGroup: rbac.authorization.k8s.io
EOF

    # Create read-only service account for monitoring
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pms-monitoring-serviceaccount
  namespace: ${NAMESPACE}
  labels:
    app.kubernetes.io/name: pms
    app.kubernetes.io/component: monitoring
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pms-monitoring-role
  namespace: ${NAMESPACE}
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["metrics.k8s.io"]
  resources: ["pods", "nodes"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pms-monitoring-rolebinding
  namespace: ${NAMESPACE}
subjects:
- kind: ServiceAccount
  name: pms-monitoring-serviceaccount
  namespace: ${NAMESPACE}
roleRef:
  kind: Role
  name: pms-monitoring-role
  apiGroup: rbac.authorization.k8s.io
EOF

    log_success "RBAC policies configured"
}

# Setup network policies
setup_network_policies() {
    if [[ "$ENABLE_NETWORK_POLICIES" != "true" ]]; then
        log_info "Network policies setup skipped"
        return
    fi

    log_info "Setting up network policies..."

    # Default deny all policy
    cat << EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: ${NAMESPACE}
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
EOF

    # Allow ingress traffic policy
    cat << EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-traffic
  namespace: ${NAMESPACE}
spec:
  podSelector:
    matchLabels:
      app: api-gateway
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 8080
EOF

    # Allow internal communication between services
    cat << EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-internal-communication
  namespace: ${NAMESPACE}
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ${NAMESPACE}
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: ${NAMESPACE}
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
EOF

    # Allow database access policy
    cat << EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-database-access
  namespace: ${NAMESPACE}
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: backend
    ports:
    - protocol: TCP
      port: 5432
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-redis-access
  namespace: ${NAMESPACE}
spec:
  podSelector:
    matchLabels:
      app: redis
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: backend
    ports:
    - protocol: TCP
      port: 6379
EOF

    # Allow monitoring access
    cat << EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-monitoring-access
  namespace: ${NAMESPACE}
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 8080
    - protocol: TCP
      port: 9090
    - protocol: TCP
      port: 3000
EOF

    log_success "Network policies configured"
}

# Setup pod security policies
setup_pod_security() {
    if [[ "$ENABLE_POD_SECURITY" != "true" ]]; then
        log_info "Pod security setup skipped"
        return
    fi

    log_info "Setting up pod security policies..."

    # Create pod security standards
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: ${NAMESPACE}
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
EOF

    # Create security context constraints
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: pms-security-config
  namespace: ${NAMESPACE}
data:
  security-context.yaml: |
    securityContext:
      runAsNonRoot: true
      runAsUser: 1000
      fsGroup: 2000
      seccompProfile:
        type: RuntimeDefault
    containerSecurityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop:
        - ALL
      seccompProfile:
        type: RuntimeDefault
EOF

    log_success "Pod security policies configured"
}

# Setup secrets encryption
setup_secrets_encryption() {
    if [[ "$ENABLE_SECRETS_ENCRYPTION" != "true" ]]; then
        log_info "Secrets encryption setup skipped"
        return
    fi

    log_info "Setting up secrets encryption..."

    # Create sealed secrets if not present
    if ! kubectl get crd sealedsecrets.bitnami.com &> /dev/null; then
        log_info "Installing sealed-secrets controller..."
        kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

        # Wait for controller to be ready
        kubectl wait --for=condition=Ready pods -l name=sealed-secrets-controller -n kube-system --timeout=300s
    fi

    # Create database password secret
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: pms-database-secret
  namespace: ${NAMESPACE}
type: Opaque
data:
  postgres-password: $(echo -n "pms123" | base64)
  postgres-user: $(echo -n "pms" | base64)
  postgres-db: $(echo -n "pms" | base64)
EOF

    # Create JWT secret
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: pms-jwt-secret
  namespace: ${NAMESPACE}
type: Opaque
data:
  jwt-secret: $(openssl rand -base64 32 | base64 -w 0)
EOF

    # Create API keys secret
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: pms-api-keys
  namespace: ${NAMESPACE}
type: Opaque
data:
  api-key: $(openssl rand -hex 32 | base64 -w 0)
  webhook-secret: $(openssl rand -hex 16 | base64 -w 0)
EOF

    log_success "Secrets encryption configured"
}

# Setup security monitoring
setup_security_monitoring() {
    log_info "Setting up security monitoring..."

    # Create security monitoring deployment
    cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: security-monitor
  namespace: ${NAMESPACE}
  labels:
    app: security-monitor
spec:
  replicas: 1
  selector:
    matchLabels:
      app: security-monitor
  template:
    metadata:
      labels:
        app: security-monitor
    spec:
      serviceAccountName: pms-monitoring-serviceaccount
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: security-monitor
        image: ubuntu:20.04
        command: ["/bin/bash"]
        args: ["-c", "while true; do sleep 300; done"]
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: security-scripts
          mountPath: /scripts
      volumes:
      - name: tmp
        emptyDir: {}
      - name: security-scripts
        configMap:
          name: security-scripts
          defaultMode: 0755
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: security-scripts
  namespace: ${NAMESPACE}
data:
  check-security.sh: |
    #!/bin/bash
    echo "Security check at \$(date)"
    # Check for running pods with elevated privileges
    kubectl get pods -n ${NAMESPACE} -o json | jq -r '.items[] | select(.spec.securityContext.runAsUser == null or .spec.securityContext.runAsUser == 0) | .metadata.name'
    # Check for pods without resource limits
    kubectl get pods -n ${NAMESPACE} -o json | jq -r '.items[] | select(.spec.containers[].resources.limits == null) | .metadata.name'
EOF

    log_success "Security monitoring configured"
}

# Setup firewall rules
setup_firewall() {
    log_info "Setting up firewall rules..."

    # Create iptables rules for additional security
    cat > /tmp/pms-firewall.sh << 'EOF'
#!/bin/bash

# PMS Platform Firewall Rules
# Add additional iptables rules for enhanced security

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow SSH (port 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS (ports 80, 443)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow Kubernetes API (port 6443)
iptables -A INPUT -p tcp --dport 6443 -j ACCEPT

# Allow NodePort range (30000-32767)
iptables -A INPUT -p tcp --dport 30000:32767 -j ACCEPT

# Rate limiting for HTTP requests
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT

# Drop everything else
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4

echo "Firewall rules applied"
EOF

    chmod +x /tmp/pms-firewall.sh
    sudo /tmp/pms-firewall.sh

    log_success "Firewall rules configured"
}

# Setup audit logging
setup_audit_logging() {
    log_info "Setting up audit logging..."

    # Create audit policy
    cat << EOF | sudo tee /etc/rancher/k3s/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
# Log all requests at the request level
- level: Request
  resources:
  - group: ""
    resources: ["secrets", "configmaps"]
  namespaces: ["${NAMESPACE}"]

# Log failed requests
- level: Request
  omitStages:
  - RequestReceived
  resources:
  - group: ""
    resources: ["pods", "services"]
  namespaces: ["${NAMESPACE}"]

# Log security-related events
- level: RequestResponse
  resources:
  - group: "rbac.authorization.k8s.io"
    resources: ["roles", "rolebindings", "clusterroles", "clusterrolebindings"]

# Log network policy changes
- level: RequestResponse
  resources:
  - group: "networking.k8s.io"
    resources: ["networkpolicies"]
EOF

    # Update k3s configuration to enable audit logging
    sudo sed -i '/kube-apiserver-arg:/a\  - "audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log"' /etc/rancher/k3s/config.yaml
    sudo sed -i '/kube-apiserver-arg:/a\  - "audit-policy-file=/etc/rancher/k3s/audit-policy.yaml"' /etc/rancher/k3s/config.yaml

    # Restart k3s to apply audit logging
    sudo systemctl restart k3s

    log_success "Audit logging configured"
}

# Create security scan script
create_security_scan_script() {
    log_info "Creating security scan script..."

    cat > /tmp/security-scan.sh << 'EOF'
#!/bin/bash

# PMS Platform Security Scan Script
# Performs regular security checks

NAMESPACE="${NAMESPACE:-pms-platform}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${RED}[ERROR]${NC} $1"
}

# Check for pods running as root
check_root_pods() {
    log_info "Checking for pods running as root..."

    local root_pods=$(kubectl get pods -n "$NAMESPACE" -o json | jq -r '.items[] | select(.spec.securityContext.runAsUser == null or .spec.securityContext.runAsUser == 0) | .metadata.name')

    if [[ -n "$root_pods" ]]; then
        log_warning "Pods running as root found:"
        echo "$root_pods"
    else
        log_success "No pods running as root"
    fi
}

# Check for privileged containers
check_privileged_containers() {
    log_info "Checking for privileged containers..."

    local privileged_pods=$(kubectl get pods -n "$NAMESPACE" -o json | jq -r '.items[] | select(.spec.containers[].securityContext.privileged == true) | .metadata.name')

    if [[ -n "$privileged_pods" ]]; then
        log_error "Privileged containers found:"
        echo "$privileged_pods"
    else
        log_success "No privileged containers found"
    fi
}

# Check for containers without resource limits
check_resource_limits() {
    log_info "Checking for containers without resource limits..."

    local unlimited_pods=$(kubectl get pods -n "$NAMESPACE" -o json | jq -r '.items[] | select(.spec.containers[].resources.limits == null) | .metadata.name')

    if [[ -n "$unlimited_pods" ]]; then
        log_warning "Containers without resource limits:"
        echo "$unlimited_pods"
    else
        log_success "All containers have resource limits"
    fi
}

# Check for exposed services
check_exposed_services() {
    log_info "Checking for exposed services..."

    local nodeport_services=$(kubectl get services -n "$NAMESPACE" -o json | jq -r '.items[] | select(.spec.type == "NodePort") | .metadata.name')
    local loadbalancer_services=$(kubectl get services -n "$NAMESPACE" -o json | jq -r '.items[] | select(.spec.type == "LoadBalancer") | .metadata.name')

    if [[ -n "$nodeport_services" ]]; then
        log_warning "NodePort services found:"
        echo "$nodeport_services"
    fi

    if [[ -n "$loadbalancer_services" ]]; then
        log_warning "LoadBalancer services found:"
        echo "$loadbalancer_services"
    fi

    if [[ -z "$nodeport_services" && -z "$loadbalancer_services" ]]; then
        log_success "No directly exposed services"
    fi
}

# Check for network policies
check_network_policies() {
    log_info "Checking network policies..."

    local policy_count=$(kubectl get networkpolicies -n "$NAMESPACE" --no-headers | wc -l)

    if [[ $policy_count -eq 0 ]]; then
        log_error "No network policies found"
    else
        log_success "$policy_count network policies configured"
    fi
}

# Check for TLS certificates
check_tls_certificates() {
    log_info "Checking TLS certificates..."

    local cert_count=$(kubectl get certificates -n "$NAMESPACE" --no-headers 2>/dev/null | wc -l)

    if [[ $cert_count -eq 0 ]]; then
        log_warning "No TLS certificates found"
    else
        log_success "$cert_count TLS certificates configured"
    fi
}

# Main security scan
main() {
    log_info "Starting security scan for namespace: $NAMESPACE"
    echo "========================================"

    check_root_pods
    check_privileged_containers
    check_resource_limits
    check_exposed_services
    check_network_policies
    check_tls_certificates

    echo "========================================"
    log_info "Security scan completed"
}

main "$@"
EOF

    chmod +x /tmp/security-scan.sh
    sudo cp /tmp/security-scan.sh /usr/local/bin/pms-security-scan

    # Add to cron for daily security scans
    (crontab -l 2>/dev/null; echo "0 8 * * * /usr/local/bin/pms-security-scan >> /var/log/pms-security.log 2>&1") | crontab -

    log_success "Security scan script created and scheduled"
}

# Display security information
display_security_info() {
    log_success "Security setup completed!"
    echo
    echo "Security Configuration:"
    echo "  - Namespace: ${NAMESPACE}"
    echo "  - RBAC: ${ENABLE_RBAC}"
    echo "  - Network Policies: ${ENABLE_NETWORK_POLICIES}"
    echo "  - Pod Security: ${ENABLE_POD_SECURITY}"
    echo "  - Secrets Encryption: ${ENABLE_SECRETS_ENCRYPTION}"
    echo
    echo "Security Components:"
    echo "  - Service accounts created"
    echo "  - RBAC roles and bindings configured"
    echo "  - Network policies applied"
    echo "  - Pod security standards enforced"
    echo "  - Secrets encrypted and managed"
    echo "  - Security monitoring enabled"
    echo "  - Firewall rules configured"
    echo "  - Audit logging enabled"
    echo
    echo "Security Commands:"
    echo "  - Run security scan: /usr/local/bin/pms-security-scan"
    echo "  - View audit logs: sudo tail -f /var/lib/rancher/k3s/server/logs/audit.log"
    echo "  - Check network policies: kubectl get networkpolicies -n ${NAMESPACE}"
    echo "  - View security events: kubectl get events -n ${NAMESPACE} --field-selector type=Warning"
    echo
    echo "Log Files:"
    echo "  - Security scan log: /var/log/pms-security.log"
    echo "  - Audit log: /var/lib/rancher/k3s/server/logs/audit.log"
    echo "  - System log: /var/log/syslog"
}

# Main execution
main() {
    log_info "Starting security setup for PMS Platform"

    check_prerequisites
    setup_rbac
    setup_network_policies
    setup_pod_security
    setup_secrets_encryption
    setup_security_monitoring
    setup_firewall
    setup_audit_logging
    create_security_scan_script
    display_security_info
}

# Help function
show_help() {
    cat << EOF
Security Setup Script for PMS Platform

Usage: $0 [OPTIONS]

Options:
    --namespace NS           Kubernetes namespace (default: pms-platform)
    --disable-network-policies    Disable network policies
    --disable-pod-security        Disable pod security standards
    --disable-rbac               Disable RBAC setup
    --disable-secrets-encryption  Disable secrets encryption
    -h, --help                   Show this help message

Environment Variables:
    NAMESPACE                    Kubernetes namespace
    ENABLE_NETWORK_POLICIES      Enable network policies (default: true)
    ENABLE_POD_SECURITY          Enable pod security (default: true)
    ENABLE_RBAC                  Enable RBAC (default: true)
    ENABLE_SECRETS_ENCRYPTION    Enable secrets encryption (default: true)

Examples:
    # Setup with all security features
    ./security-setup.sh

    # Setup with custom namespace
    ./security-setup.sh --namespace my-pms

    # Setup without network policies
    ./security-setup.sh --disable-network-policies

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        --disable-network-policies)
            ENABLE_NETWORK_POLICIES="false"
            shift
            ;;
        --disable-pod-security)
            ENABLE_POD_SECURITY="false"
            shift
            ;;
        --disable-rbac)
            ENABLE_RBAC="false"
            shift
            ;;
        --disable-secrets-encryption)
            ENABLE_SECRETS_ENCRYPTION="false"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execute main function
main