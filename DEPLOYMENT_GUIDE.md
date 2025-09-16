# 🚀 PMS Platform Deployment Guide

Complete guide for deploying the PMS microservices platform to Kubernetes (k3s/k8s).

## 📋 Prerequisites

### Required Tools
```bash
# Docker
docker --version  # >= 20.10.0

# Kubectl
kubectl version --client  # >= 1.25.0

# Helm
helm version  # >= 3.10.0

# k3s (for local deployment)
curl -sfL https://get.k3s.io | sh -
```

### System Requirements
- **RAM**: 8GB minimum (16GB recommended)
- **CPU**: 4 cores minimum
- **Storage**: 50GB available space
- **Network**: Internet access for image pulls

## 🏠 Option 1: Local k3s Deployment (Recommended Start)

### Step 1: Install k3s
```bash
# Install k3s (Linux/WSL)
curl -sfL https://get.k3s.io | sh -

# For Windows users with WSL2
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

# Copy kubeconfig
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER ~/.kube/config

# Verify installation
kubectl get nodes
```

### Step 2: Clone Infrastructure Repository
```bash
git clone https://github.com/charilaouc/pms-infrastructure.git
cd pms-infrastructure
```

### Step 3: Configure Environment
```bash
# Create namespace
kubectl create namespace pms-platform

# Create secrets
kubectl create secret generic pms-secrets \
  --from-literal=jwt-secret=your-super-secure-jwt-secret \
  --from-literal=database-url=postgresql://pms:password@postgres:5432/pms \
  --from-literal=redis-url=redis://redis:6379 \
  -n pms-platform
```

### Step 4: Deploy with Helm
```bash
# Install/upgrade the PMS platform
helm upgrade --install pms ./helm/pms-chart \
  --namespace pms-platform \
  --create-namespace \
  --values ./helm/pms-chart/values-local.yaml
```

### Step 5: Verify Deployment
```bash
# Check pod status
kubectl get pods -n pms-platform

# Check services
kubectl get services -n pms-platform

# Check ingress
kubectl get ingress -n pms-platform

# View logs
kubectl logs -l app=pms-backend -n pms-platform
```

### Step 6: Access Applications
```bash
# Port forward to access services
kubectl port-forward -n pms-platform service/pms-admin 3010:3010 &
kubectl port-forward -n pms-platform service/pms-guest 3011:3011 &
kubectl port-forward -n pms-platform service/pms-staff 3012:3012 &
kubectl port-forward -n pms-platform service/pms-marketplace 3013:3013 &
kubectl port-forward -n pms-platform service/api-gateway 8080:8080 &

# Access applications
echo "Admin Dashboard: http://localhost:3010"
echo "Guest Portal: http://localhost:3011"
echo "Staff App: http://localhost:3012"
echo "Marketplace: http://localhost:3013"
echo "API Gateway: http://localhost:8080"
```

## ☁️ Option 2: Cloud Kubernetes Deployment

### AWS EKS Deployment

#### Prerequisites
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Configure AWS credentials
aws configure
```

#### Create EKS Cluster
```bash
# Create cluster (this takes 15-20 minutes)
eksctl create cluster \
  --name pms-platform \
  --region us-west-2 \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 5 \
  --managed

# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name pms-platform
```

#### Deploy to EKS
```bash
# Create namespace
kubectl create namespace pms-platform

# Create secrets (use AWS Secrets Manager in production)
kubectl create secret generic pms-secrets \
  --from-literal=jwt-secret=your-production-jwt-secret \
  --from-literal=database-url=postgresql://username:password@rds-endpoint:5432/pms \
  --from-literal=redis-url=redis://elasticache-endpoint:6379 \
  -n pms-platform

# Deploy with production values
helm upgrade --install pms ./helm/pms-chart \
  --namespace pms-platform \
  --values ./helm/pms-chart/values-production.yaml \
  --set global.environment=production \
  --set ingress.enabled=true \
  --set autoscaling.enabled=true
```

### Google GKE Deployment

#### Prerequisites
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install GKE auth plugin
gcloud components install gke-gcloud-auth-plugin
```

#### Create GKE Cluster
```bash
# Create cluster
gcloud container clusters create pms-platform \
  --zone=us-central1-a \
  --num-nodes=3 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=5 \
  --machine-type=e2-medium

# Get credentials
gcloud container clusters get-credentials pms-platform --zone=us-central1-a
```

## 🔧 Configuration Files

### Local Development Values (values-local.yaml)
```yaml
global:
  environment: development
  imageRegistry: "ghcr.io"

database:
  enabled: true
  type: "postgresql"
  # Local PostgreSQL configuration

ingress:
  enabled: false  # Use port-forward for local development

autoscaling:
  enabled: false

resources:
  # Reduced resources for local development
  backend:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "256Mi"
      cpu: "500m"
```

### Production Values (values-production.yaml)
```yaml
global:
  environment: production
  imageRegistry: "ghcr.io"

database:
  enabled: false  # Use managed database service
  external:
    host: "your-rds-endpoint"
    port: 5432
    database: "pms"

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: api.yourpms.com
      paths:
        - path: /
          pathType: Prefix
          service: api-gateway
    - host: admin.yourpms.com
      paths:
        - path: /
          pathType: Prefix
          service: pms-admin

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10

monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
```

## 🗄️ Database Setup

### Option 1: PostgreSQL in Kubernetes
```bash
# Add Bitnami Helm repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install PostgreSQL
helm install postgres bitnami/postgresql \
  --namespace pms-platform \
  --set auth.postgresPassword=yourpassword \
  --set auth.database=pms \
  --set primary.persistence.size=20Gi
```

### Option 2: External Managed Database
```bash
# AWS RDS
aws rds create-db-instance \
  --db-instance-identifier pms-database \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username pms \
  --master-user-password yourpassword \
  --allocated-storage 20 \
  --db-name pms

# Update Helm values to use external database
```

## 🔐 Security Configuration

### Secrets Management
```bash
# Create TLS certificates
kubectl create secret tls pms-tls-secret \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  -n pms-platform

# JWT secrets
kubectl create secret generic jwt-secrets \
  --from-literal=access-token-secret=your-access-secret \
  --from-literal=refresh-token-secret=your-refresh-secret \
  -n pms-platform

# Database credentials
kubectl create secret generic db-credentials \
  --from-literal=username=pms \
  --from-literal=password=securepassword \
  --from-literal=host=postgres.pms-platform.svc.cluster.local \
  -n pms-platform
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pms-network-policy
  namespace: pms-platform
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: pms-platform
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: pms-platform
```

## 📊 Monitoring Setup

### Prometheus and Grafana
```bash
# Add Prometheus Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin123

# Access Grafana
kubectl port-forward -n monitoring service/prometheus-grafana 3000:80
```

### Custom Dashboards
```bash
# Import PMS-specific Grafana dashboards
kubectl create configmap pms-dashboards \
  --from-file=./monitoring/grafana/dashboards/ \
  -n monitoring
```

## 🚀 Deployment Scripts

### Quick Deployment Script
```bash
#!/bin/bash
# deploy-pms.sh

set -e

echo "🚀 Deploying PMS Platform to Kubernetes"

# Check prerequisites
command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required but not installed. Aborting." >&2; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "helm is required but not installed. Aborting." >&2; exit 1; }

# Variables
NAMESPACE="pms-platform"
RELEASE_NAME="pms"
VALUES_FILE="${VALUES_FILE:-values-local.yaml}"

echo "📋 Creating namespace: $NAMESPACE"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

echo "🔐 Creating secrets..."
kubectl create secret generic pms-secrets \
  --from-literal=jwt-secret=${JWT_SECRET:-default-jwt-secret} \
  --from-literal=database-url=${DATABASE_URL:-postgresql://postgres:password@postgres:5432/pms} \
  --from-literal=redis-url=${REDIS_URL:-redis://redis:6379} \
  -n $NAMESPACE \
  --dry-run=client -o yaml | kubectl apply -f -

echo "📦 Deploying with Helm..."
helm upgrade --install $RELEASE_NAME ./helm/pms-chart \
  --namespace $NAMESPACE \
  --values ./helm/pms-chart/$VALUES_FILE \
  --wait \
  --timeout=10m

echo "✅ Deployment complete!"
echo "🔍 Checking pod status..."
kubectl get pods -n $NAMESPACE

echo "🌐 Setting up port forwarding..."
./scripts/port-forward.sh
```

### Port Forwarding Script
```bash
#!/bin/bash
# scripts/port-forward.sh

NAMESPACE="pms-platform"

echo "🌐 Setting up port forwarding for PMS services..."

# Function to start port forward in background
port_forward() {
  local service=$1
  local port=$2

  echo "Forwarding $service on port $port..."
  kubectl port-forward -n $NAMESPACE service/$service $port:$port &

  # Store PID for cleanup
  echo $! >> /tmp/pms-port-forwards.pid
}

# Cleanup existing port forwards
if [ -f /tmp/pms-port-forwards.pid ]; then
  echo "🧹 Cleaning up existing port forwards..."
  xargs kill < /tmp/pms-port-forwards.pid 2>/dev/null || true
  rm /tmp/pms-port-forwards.pid
fi

# Start port forwards
port_forward "api-gateway" 8080
port_forward "pms-admin" 3010
port_forward "pms-guest" 3011
port_forward "pms-staff" 3012
port_forward "pms-marketplace" 3013

echo "✅ Port forwarding active!"
echo "📱 Access your applications:"
echo "   Admin Dashboard: http://localhost:3010"
echo "   Guest Portal: http://localhost:3011"
echo "   Staff App: http://localhost:3012"
echo "   Marketplace: http://localhost:3013"
echo "   API Gateway: http://localhost:8080"
echo ""
echo "🛑 To stop port forwarding: kill \$(cat /tmp/pms-port-forwards.pid)"
```

## 🔄 CI/CD Integration

### GitHub Actions Deployment
```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v1
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to k8s
        run: |
          helm upgrade --install pms ./helm/pms-chart \
            --namespace pms-platform \
            --values ./helm/pms-chart/values-production.yaml \
            --set image.tag=${{ github.sha }}
```

## 🛠️ Troubleshooting

### Common Issues

#### Pods in CrashLoopBackOff
```bash
# Check logs
kubectl logs <pod-name> -n pms-platform

# Common fixes:
# 1. Check secrets are created
kubectl get secrets -n pms-platform

# 2. Check database connectivity
kubectl exec -it <backend-pod> -n pms-platform -- nc -zv postgres 5432

# 3. Verify environment variables
kubectl exec -it <pod-name> -n pms-platform -- env
```

#### Services Not Accessible
```bash
# Check service endpoints
kubectl get endpoints -n pms-platform

# Check ingress configuration
kubectl describe ingress -n pms-platform

# Test internal connectivity
kubectl exec -it <pod-name> -n pms-platform -- curl http://pms-backend:5000/health
```

#### Database Connection Issues
```bash
# Check database pod
kubectl get pods -l app=postgresql -n pms-platform

# Test database connection
kubectl exec -it postgres-pod -n pms-platform -- psql -U postgres -d pms -c "SELECT 1"

# Check database URL in secrets
kubectl get secret pms-secrets -n pms-platform -o yaml
```

## 📈 Scaling and Performance

### Horizontal Pod Autoscaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pms-backend-hpa
  namespace: pms-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pms-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Resource Monitoring
```bash
# Monitor resource usage
kubectl top pods -n pms-platform
kubectl top nodes

# Check HPA status
kubectl get hpa -n pms-platform
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup job
kubectl create job --from=cronjob/postgres-backup manual-backup -n pms-platform

# Restore from backup
kubectl exec -it postgres-pod -n pms-platform -- pg_restore -U postgres -d pms /backups/backup.sql
```

---

**Next Steps:**
1. Choose your deployment option (k3s recommended for start)
2. Run the deployment script
3. Verify all services are running
4. Configure monitoring and alerting
5. Set up backup procedures
6. Plan for production scaling

Would you like me to help you get started with any specific deployment option?