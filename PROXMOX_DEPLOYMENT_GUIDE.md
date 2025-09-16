# 🚀 Proxmox PMS Platform Deployment Guide

Complete guide for deploying the PMS (Property Management System) platform on Proxmox VE using Kubernetes.

## 📋 Prerequisites

### Proxmox Server Requirements

**Minimum Hardware:**
- **CPU**: 8+ cores (Intel VT-x/AMD-V support required)
- **RAM**: 32GB minimum (64GB recommended)
- **Storage**: 500GB SSD minimum (1TB+ recommended)
- **Network**: 1Gbps connection with static IP

**Proxmox VE:**
- Version 7.0+ or 8.0+
- Nested virtualization enabled
- Internet connectivity for downloads

### Local Workstation Requirements

- SSH client (PuTTY, OpenSSH, etc.)
- Git for cloning repositories
- Web browser for accessing services

## 🔧 Step 1: Proxmox VM Setup

### 1.1 Clone Repository

```bash
git clone https://github.com/cosmos-order-ltd/pms-platform.git
cd pms-platform
```

### 1.2 Create VM on Proxmox

**Option A: Automated VM Creation (Recommended)**

```bash
# On Proxmox host, copy and run the VM setup script
scp proxmox-vm-setup.sh root@your-proxmox-host:/root/
ssh root@your-proxmox-host

# Run with default settings (creates VM 200)
./proxmox-vm-setup.sh

# Or with custom settings
VM_ID=201 VM_IP=192.168.1.101 VM_MEMORY=32768 ./proxmox-vm-setup.sh

# For LXC container (more efficient)
./proxmox-vm-setup.sh --lxc
```

**Option B: Manual VM Creation**

1. **Create VM in Proxmox Web UI:**
   - VM ID: 200
   - Name: pms-k8s
   - OS: Ubuntu 22.04 Server
   - Memory: 24GB
   - CPU: 16 cores
   - Disk: 300GB
   - Network: Bridge to vmbr0

2. **Enable Nested Virtualization:**
   ```bash
   qm set 200 --cpu host,flags=+aes
   ```

### 1.3 Start VM and Initial Setup

```bash
# Start the VM
qm start 200

# Connect to VM
ssh pms@192.168.1.100  # Use the IP you configured
```

## 🐳 Step 2: Kubernetes Installation

### 2.1 Install k3s

```bash
# On the VM, run the k3s installation script
./k3s-install.sh

# Or with custom settings
K3S_VERSION=v1.28.5+k3s1 TRAEFIK_ENABLED=true ./k3s-install.sh
```

### 2.2 Verify Installation

```bash
# Check cluster status
kubectl get nodes

# Check system pods
kubectl get pods --all-namespaces

# Check services
kubectl get services --all-namespaces
```

## 🏗️ Step 3: PMS Platform Deployment

### 3.1 Build and Deploy

```bash
# Deploy the complete platform
./proxmox-deploy.sh

# Or with custom settings
NAMESPACE=my-pms REGISTRY_URL=localhost:32000 ./proxmox-deploy.sh
```

### 3.2 Monitor Deployment

```bash
# Watch pods starting
kubectl get pods -n pms-platform -w

# Check deployment status
kubectl get all -n pms-platform

# View logs
kubectl logs -f deployment/pms-backend -n pms-platform
```

## 🌐 Step 4: Network Configuration

### 4.1 Configure DNS/Hosts

**On your local machine:**

```bash
# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
192.168.1.100 api.pms.local
192.168.1.100 admin.pms.local
192.168.1.100 guest.pms.local
192.168.1.100 staff.pms.local
192.168.1.100 marketplace.pms.local
192.168.1.100 grafana.local
192.168.1.100 traefik.local
```

### 4.2 Test Connectivity

```bash
# Test each service
curl http://api.pms.local/health
curl http://admin.pms.local
curl http://grafana.local
```

## 🔒 Step 5: Security Setup

### 5.1 Configure Security Policies

```bash
# Run security setup
./security-setup.sh

# Or with custom settings
./security-setup.sh --namespace pms-platform
```

### 5.2 Verify Security

```bash
# Run security scan
/usr/local/bin/pms-security-scan

# Check network policies
kubectl get networkpolicies -n pms-platform

# Check RBAC
kubectl get roles,rolebindings -n pms-platform
```

## 💾 Step 6: Backup Configuration

### 6.1 Setup Automated Backups

```bash
# Configure backup system
./backup-setup.sh

# Or with custom settings
./backup-setup.sh --backup-dir /data/backups --retention 14
```

### 6.2 Test Backup

```bash
# Run manual backup
/opt/pms-backups/scripts/backup-database.sh

# List backups
/opt/pms-backups/scripts/restore.sh list

# View backup logs
tail -f /opt/pms-backups/backup.log
```

## 📊 Step 7: Monitoring Setup

### 7.1 Access Monitoring Dashboards

- **Grafana**: http://grafana.local (admin/admin123)
- **Traefik Dashboard**: http://traefik.local
- **Prometheus**: kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090

### 7.2 Configure Alerts

```bash
# Edit Grafana alert rules
kubectl edit configmap -n monitoring kube-prometheus-stack-grafana

# View current alerts
kubectl get prometheusrules -n monitoring
```

## 🌍 Step 8: Domain and SSL Setup (Production)

### 8.1 Configure Real Domain

```bash
# Update values file with your domain
vim pms-infrastructure/helm/pms-chart/values-proxmox.yaml

# Update hosts section:
hosts:
  - host: api.yourdomain.com
  - host: admin.yourdomain.com
  # ... etc
```

### 8.2 Enable SSL Certificates

```bash
# Install cert-manager issuer
cat << EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@yourdomain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik
EOF

# Update ingress with TLS
kubectl patch ingressroute pms-api -n pms-platform --patch '{"spec":{"tls":{"secretName":"pms-tls"}}}'
```

## 🚀 Step 9: Access Your Platform

### 9.1 Service URLs

- **API Gateway**: http://api.pms.local
- **Admin Dashboard**: http://admin.pms.local
- **Guest Portal**: http://guest.pms.local
- **Staff Mobile**: http://staff.pms.local
- **Marketplace**: http://marketplace.pms.local

### 9.2 Default Credentials

- **Database**: pms/pms123
- **Grafana**: admin/admin123
- **Default API Key**: Check kubectl get secret pms-api-keys -n pms-platform -o yaml

## 🔧 Troubleshooting

### Common Issues

**1. Pods Stuck in Pending State**
```bash
# Check node resources
kubectl describe nodes

# Check PVC status
kubectl get pvc -n pms-platform

# Check events
kubectl get events -n pms-platform --sort-by='.lastTimestamp'
```

**2. Services Not Accessible**
```bash
# Check ingress routes
kubectl get ingressroute -n pms-platform

# Check Traefik logs
kubectl logs -n kube-system deployment/traefik

# Test port forwarding
kubectl port-forward -n pms-platform svc/api-gateway 8080:8080
```

**3. Database Connection Issues**
```bash
# Check PostgreSQL status
kubectl get pods -l app=postgres -n pms-platform

# Check database logs
kubectl logs -l app=postgres -n pms-platform

# Test database connection
kubectl exec -it deployment/postgres -n pms-platform -- psql -U pms -d pms
```

**4. Image Pull Errors**
```bash
# Check local registry
kubectl get pods -n container-registry

# Test registry connectivity
curl http://localhost:32000/v2/

# Rebuild and push images
./proxmox-deploy.sh update
```

### Performance Optimization

**1. Resource Allocation**
```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n pms-platform

# Scale services if needed
kubectl scale deployment pms-backend --replicas=2 -n pms-platform
```

**2. Storage Optimization**
```bash
# Check disk usage
df -h
kubectl get pv

# Clean up old images
docker system prune -a
```

## 📚 Useful Commands

### Daily Operations

```bash
# Check platform status
kubectl get pods -n pms-platform

# View application logs
kubectl logs -f deployment/pms-backend -n pms-platform

# Update application
helm upgrade pms pms-infrastructure/helm/pms-chart -n pms-platform

# Backup database manually
/opt/pms-backups/scripts/backup-database.sh

# Security scan
/usr/local/bin/pms-security-scan
```

### Maintenance

```bash
# Update k3s
curl -sfL https://get.k3s.io | sh -s - server

# Update applications
./proxmox-deploy.sh update

# Restart services
kubectl rollout restart deployment/pms-backend -n pms-platform

# Clean up resources
kubectl delete pods --field-selector=status.phase=Succeeded -n pms-platform
```

## 📞 Support

### Log Locations

- **Application Logs**: `kubectl logs -n pms-platform`
- **System Logs**: `/var/log/syslog`
- **k3s Logs**: `journalctl -u k3s`
- **Backup Logs**: `/opt/pms-backups/backup.log`
- **Security Logs**: `/var/log/pms-security.log`

### Monitoring

- **Grafana**: http://grafana.local (admin/admin123)
- **Prometheus**: kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
- **Traefik**: http://traefik.local

### Getting Help

- Check logs first: `kubectl logs -n pms-platform deployment/pms-backend`
- Review events: `kubectl get events -n pms-platform --sort-by='.lastTimestamp'`
- Run security scan: `/usr/local/bin/pms-security-scan`
- Check resource usage: `kubectl top nodes && kubectl top pods -n pms-platform`

## 🎉 Success!

Your PMS platform is now deployed on Proxmox with:

✅ **High Availability**: k3s cluster with monitoring
✅ **Security**: RBAC, network policies, encrypted secrets
✅ **Backups**: Automated daily backups with retention
✅ **Monitoring**: Grafana dashboards and alerts
✅ **Scalability**: Ready for production workloads

The platform is production-ready and can handle real-world property management operations!