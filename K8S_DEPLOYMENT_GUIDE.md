# 🚀 PMS Kubernetes Deployment Guide

## Overview

This guide covers the complete setup and deployment of the PMS (Property Management System) microservices architecture using k3s for both local development and production environments.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Local Development                         │
├─────────────────────────────────────────────────────────────┤
│  k3s Cluster with Traefik Ingress                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ pms-backend │  │ pms-admin   │  │ pms-marketplace │    │
│  │ (Express)   │  │ (Next.js)   │  │ (Next.js)       │    │
│  │ Port: 5000  │  │ Port: 3000  │  │ Port: 3003      │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ PostgreSQL  │  │ Redis       │                          │
│  │ Port: 5432  │  │ Port: 6379  │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### Required Software
- **Docker Desktop** (latest version)
- **Node.js** (v20 or higher)
- **Git** (for repository management)

### Optional but Recommended
- **k9s** (Kubernetes cluster management)
- **stern** (log aggregation)
- **Helm** (package management)

## 🚀 Quick Start

### 1. Setup k3s Cluster

**On Windows (PowerShell as Administrator):**
```powershell
# Run the PowerShell setup script
powershell -ExecutionPolicy Bypass -File setup-k3s-local.ps1
```

**On Linux/macOS/WSL:**
```bash
# Make script executable and run
chmod +x setup-k3s-local.sh
./setup-k3s-local.sh
```

### 2. Deploy Everything

```bash
# Build and deploy all services
make deploy-local
```

### 3. Access Services

Add these entries to your hosts file:
- **Windows:** `C:\Windows\System32\drivers\etc\hosts`
- **Linux/macOS:** `/etc/hosts`

```
127.0.0.1 auth.pms.local
127.0.0.1 api.pms.local
127.0.0.1 admin.pms.local
127.0.0.1 guest.pms.local
127.0.0.1 staff.pms.local
127.0.0.1 marketplace.pms.local
```

Then access:
- 🏢 **Admin Dashboard:** http://admin.pms.local
- 🔗 **Backend API:** http://api.pms.local
- 🏪 **Marketplace:** http://marketplace.pms.local

## 🔧 Detailed Setup

### Manual k3s Installation

If the setup script doesn't work, install manually:

```bash
# Install k3d (k3s in Docker)
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Create cluster with registry
k3d cluster create pms-local \
    --api-port 6550 \
    --servers 1 \
    --agents 2 \
    --port "80:80@loadbalancer" \
    --port "443:443@loadbalancer" \
    --registry-create pms-registry:0.0.0.0:5000

# Verify cluster
kubectl cluster-info
```

### Install Additional Tools

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install k9s (optional but recommended)
# On macOS
brew install k9s

# On Linux
curl -sS https://webinstall.dev/k9s | bash

# Install stern for log aggregation
# On macOS
brew install stern

# On Linux
curl -sL https://github.com/wercker/stern/releases/download/1.21.0/stern_1.21.0_linux_amd64.tar.gz | tar -xz stern
sudo mv stern /usr/local/bin/
```

## 🏗️ Build and Deploy

### Building Services

```bash
# Build all Docker images
make build-all

# Build individual services
cd pms-backend && docker build -t localhost:5000/pms-backend:latest .
cd pms-admin && docker build -t localhost:5000/pms-admin:latest .
cd pms-marketplace && docker build -t localhost:5000/pms-marketplace:latest .
```

### Deploy Infrastructure

```bash
# Deploy databases and infrastructure
make deploy-infra

# Or manually:
kubectl apply -f k8s/namespaces/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/infrastructure/
```

### Deploy Services

```bash
# Deploy services using Helm
make deploy-services

# Or manually deploy specific services:
helm upgrade --install pms-backend ./helm/pms-backend \
    -f ./helm/pms-backend/values.dev.yaml \
    -n pms-backend --create-namespace
```

## 🔍 Monitoring and Debugging

### Check Cluster Status

```bash
# Overall status
make status

# Detailed pod information
kubectl get pods --all-namespaces -o wide

# Check specific namespace
kubectl get all -n pms-backend
```

### View Logs

```bash
# All logs from PMS services
make logs

# Logs from specific service
kubectl logs -f deployment/pms-backend -n pms-backend

# Using stern (if installed)
stern pms-backend -n pms-backend
```

### Debug Services

```bash
# Execute into a pod
kubectl exec -it deployment/pms-backend -n pms-backend -- /bin/sh

# Port forward for direct access
kubectl port-forward svc/pms-backend 5000:5000 -n pms-backend

# Describe resources
kubectl describe deployment pms-backend -n pms-backend
```

### Using k9s (Interactive Dashboard)

```bash
# Start k9s
k9s

# Navigate with:
# - :pods (view all pods)
# - :svc (view services)
# - :deployments (view deployments)
# - :logs (view logs)
```

## 🐛 Common Issues and Solutions

### Issue: Pods stuck in ImagePullBackOff

**Solution:**
```bash
# Check if local registry is running
docker ps | grep registry

# Restart local registry
docker restart registry

# Rebuild and push images
make build-all
```

### Issue: Services not accessible via local domains

**Solution:**
1. Verify hosts file entries
2. Check ingress controller:
```bash
kubectl get ingress
kubectl describe ingress pms-ingress
```

### Issue: Database connection errors

**Solution:**
```bash
# Check PostgreSQL pod status
kubectl get pods -n pms-infra

# Check logs
kubectl logs deployment/postgres -n pms-infra

# Verify secrets
kubectl get secrets -n pms-backend
kubectl describe secret pms-secrets -n pms-backend
```

### Issue: Build failures

**Solution:**
```bash
# Check TypeScript compilation
cd pms-backend && npm run build

# Check Docker build
cd pms-backend && docker build --no-cache -t localhost:5000/pms-backend:latest .
```

## 🔄 Development Workflow

### 1. Code Changes

```bash
# Make code changes
# Rebuild specific service
cd pms-backend
npm run build
docker build -t localhost:5000/pms-backend:latest .
docker push localhost:5000/pms-backend:latest

# Restart deployment
kubectl rollout restart deployment/pms-backend -n pms-backend
```

### 2. Update Helm Charts

```bash
# After modifying helm charts
helm upgrade pms-backend ./helm/pms-backend \
    -f ./helm/pms-backend/values.dev.yaml \
    -n pms-backend
```

### 3. Database Migrations

```bash
# Connect to database
kubectl exec -it deployment/postgres -n pms-infra -- psql -U pmsuser -d pms

# Run migrations (example)
kubectl exec -it deployment/pms-backend -n pms-backend -- npm run migrate
```

## 🌐 Production Deployment

### Environment Differences

| Component | Development | Production |
|-----------|-------------|------------|
| Replicas | 1-2 | 3-5 |
| Resources | Minimal | Production-ready |
| Ingress | Local domains | Real domains |
| Database | Local PostgreSQL | Managed DB |
| Registry | Local | Cloud registry |

### Production Setup

```bash
# Use production values
helm upgrade --install pms-backend ./helm/pms-backend \
    -f ./helm/pms-backend/values.prod.yaml \
    -n pms-backend

# Configure production ingress with real domains
# Update k8s/infrastructure/ingress.yaml with real domains
```

## 📊 Performance Optimization

### Resource Monitoring

```bash
# Check resource usage
kubectl top nodes
kubectl top pods --all-namespaces

# Describe resource limits
kubectl describe deployment pms-backend -n pms-backend
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment pms-backend --replicas=3 -n pms-backend

# Enable auto-scaling
kubectl autoscale deployment pms-backend --cpu-percent=70 --min=2 --max=10 -n pms-backend
```

## 🧹 Cleanup

```bash
# Clean up everything
make clean

# Or manually
kubectl delete namespace pms-core pms-backend pms-frontend pms-marketplace pms-infra

# Remove k3s cluster completely
k3d cluster delete pms-local
```

## 📞 Support

### Useful Commands Reference

```bash
# Makefile commands
make help          # Show all available commands
make setup         # Setup k3s cluster
make build-all     # Build all services
make deploy-local  # Deploy everything locally
make status        # Show cluster status
make logs          # Show service logs
make clean         # Clean up resources

# kubectl commands
kubectl get pods --all-namespaces
kubectl logs -f deployment/SERVICE_NAME -n NAMESPACE
kubectl exec -it deployment/SERVICE_NAME -n NAMESPACE -- /bin/sh
kubectl port-forward svc/SERVICE_NAME PORT:PORT -n NAMESPACE

# helm commands
helm list --all-namespaces
helm upgrade --install RELEASE_NAME ./helm/CHART_NAME -f values.yaml -n NAMESPACE
helm uninstall RELEASE_NAME -n NAMESPACE
```

### Troubleshooting Checklist

- [ ] Docker Desktop is running
- [ ] k3s cluster is running (`kubectl cluster-info`)
- [ ] Local registry is accessible (`docker ps | grep registry`)
- [ ] Images are built and pushed (`docker images | grep localhost:5000`)
- [ ] Secrets are created (`kubectl get secrets --all-namespaces`)
- [ ] Hosts file entries are correct
- [ ] Ingress controller is running (`kubectl get pods -n kube-system`)

---

**Happy deploying! 🚀**

For questions or issues, please check the troubleshooting section or create an issue in the repository.