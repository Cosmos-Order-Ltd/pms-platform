# PMS Infrastructure

Infrastructure as Code (IaC) for the PMS Platform, providing Kubernetes manifests, Docker configurations, CI/CD pipelines, and monitoring setup.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                            │
│                   (Traefik/HAProxy)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                  Kubernetes Cluster                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ PMS Admin   │  │ PMS Guest   │  │ PMS Staff   │         │
│  │ (Port 3010) │  │ (Port 3011) │  │ (Port 3012) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │PMS Backend  │  │Cyprus Local │  │Access Ctrl  │         │
│  │ (Port 5000) │  │ (Port 3017) │  │ (Port 3018) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ PostgreSQL  │  │    Redis    │  │  Monitoring │         │
│  │ (Port 5432) │  │ (Port 6379) │  │   Stack     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
kubectl >= 1.25.0
helm >= 3.10.0
docker >= 20.10.0
```

### Environment Setup

```bash
# Clone infrastructure repository
git clone http://192.168.30.98:3000/charilaouc/pms-infrastructure.git
cd pms-infrastructure

# Validate environment
npm run validate

# Deploy to development
npm run deploy:dev
```

## 📁 Directory Structure

```
pms-infrastructure/
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml      # Namespace definitions
│   ├── database.yaml       # PostgreSQL & Redis
│   ├── backend.yaml        # PMS Backend API
│   ├── frontend.yaml       # Frontend applications
│   ├── cyprus.yaml         # Cyprus localization
│   ├── monitoring.yaml     # Prometheus & Grafana
│   └── ingress.yaml        # Traefik ingress
├── helm/                   # Helm charts
│   ├── pms-platform/       # Main application chart
│   ├── monitoring/         # Monitoring stack
│   └── cyprus-services/    # Cyprus-specific services
├── docker/                 # Docker configurations
│   ├── Dockerfile.*        # Service Dockerfiles
│   ├── docker-compose.yml  # Local development
│   └── .dockerignore       # Docker ignore patterns
├── scripts/                # Deployment scripts
│   ├── deploy-*.sh         # Environment deployments
│   ├── backup-*.sh         # Backup scripts
│   ├── monitoring-*.sh     # Monitoring setup
│   └── security-*.sh       # Security tools
├── monitoring/             # Monitoring configurations
│   ├── prometheus/         # Prometheus config
│   ├── grafana/           # Grafana dashboards
│   ├── alertmanager/      # Alert rules
│   └── loki/              # Log aggregation
└── ci-cd/                 # CI/CD pipeline configs
    ├── jenkins/           # Jenkins pipelines
    ├── github-actions/    # GitHub Actions
    └── gitlab-ci/         # GitLab CI
```

## 🔧 Deployment Environments

### Development
```bash
# Deploy to development namespace
npm run deploy:dev

# Port forward for local access
kubectl port-forward -n pms-platform-dev svc/pms-admin 3010:3010
kubectl port-forward -n pms-platform-dev svc/pms-guest 3011:3011
```

### Staging
```bash
# Deploy to staging
npm run deploy:staging

# Run integration tests
npm run test:infra
```

### Production
```bash
# Deploy to production (requires approval)
npm run deploy:prod

# Monitor deployment
kubectl get pods -n pms-platform -w
```

## 🐳 Docker Configuration

### Multi-Stage Builds

```dockerfile
# Example: pms-admin Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3010
CMD ["npm", "start"]
```

### Docker Compose (Development)

```bash
# Start all services locally
docker-compose up -d

# View logs
docker-compose logs -f pms-backend

# Scale services
docker-compose up -d --scale pms-backend=3
```

## ☸️ Kubernetes Resources

### Namespaces
- `pms-platform` - Production environment
- `pms-platform-staging` - Staging environment
- `pms-platform-dev` - Development environment

### Core Services
```yaml
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get all -n pms-platform
```

### Scaling
```bash
# Scale backend horizontally
kubectl scale deployment pms-backend --replicas=5 -n pms-platform

# Vertical scaling (update resources in YAML)
kubectl apply -f k8s/backend.yaml
```

## 📊 Monitoring Stack

### Prometheus Metrics
- Application metrics (response time, error rate)
- Infrastructure metrics (CPU, memory, disk)
- Business metrics (bookings, revenue)
- Cyprus compliance metrics (VAT submissions, police registrations)

### Grafana Dashboards
- **Overview** - System health and key metrics
- **Applications** - Per-service performance
- **Infrastructure** - Kubernetes cluster status
- **Business** - Revenue, bookings, occupancy
- **Cyprus** - Compliance and localization metrics

### Alerting Rules
```yaml
# High error rate alert
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High error rate detected"
```

## 🔒 Security Configuration

### Network Policies
```yaml
# Restrict database access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgresql-policy
spec:
  podSelector:
    matchLabels:
      app: postgresql
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: pms-backend
```

### RBAC
```bash
# Create service account for PMS services
kubectl create serviceaccount pms-service-account -n pms-platform

# Apply RBAC policies
kubectl apply -f k8s/rbac.yaml
```

### Secrets Management
```bash
# Create TLS secrets
kubectl create secret tls pms-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  -n pms-platform

# Database credentials
kubectl create secret generic postgresql-secret \
  --from-literal=username=postgres \
  --from-literal=password=secure-password \
  -n pms-platform
```

## 🔄 CI/CD Pipeline

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t pms-backend .'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
                sh 'npm run security:audit'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/'
                sh 'kubectl rollout status deployment/pms-backend -n pms-platform'
            }
        }
    }
}
```

### GitOps Workflow
1. **Commit** - Developer pushes code changes
2. **Build** - CI pipeline builds and tests application
3. **Image** - Docker image tagged and pushed to registry
4. **Deploy** - ArgoCD syncs manifests and updates cluster
5. **Monitor** - Grafana dashboards show deployment status

## 💾 Backup & Recovery

### Database Backups
```bash
# Create backup
npm run backup:create

# Restore from backup
npm run backup:restore -- backup-2024-09-22.sql

# Automated daily backups
0 2 * * * /path/to/backup-databases.sh
```

### Disaster Recovery
```bash
# Full cluster backup
velero backup create pms-platform-backup \
  --include-namespaces pms-platform

# Restore cluster
velero restore create --from-backup pms-platform-backup
```

## 🔧 Maintenance Scripts

### Health Checks
```bash
# Check all services
./scripts/health-check.sh

# Validate certificates
./scripts/check-ssl-certificates.sh

# Security audit
npm run security:audit
```

### Updates
```bash
# Update container images
./scripts/update-images.sh

# Apply security patches
./scripts/security-patches.sh

# Renew SSL certificates
npm run ssl:renew
```

## 📝 Configuration Management

### Environment Variables
```bash
# Development
export ENVIRONMENT=development
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pms_dev

# Production
export ENVIRONMENT=production
export DATABASE_URL=postgresql://postgres:secure@postgresql:5432/pms_platform
```

### ConfigMaps
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pms-config
  namespace: pms-platform
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  REDIS_URL: "redis://redis:6379"
```

## 🌍 Multi-Environment Support

### Environment Promotion
```bash
# Promote from dev to staging
./scripts/promote-to-staging.sh

# Promote from staging to production
./scripts/promote-to-production.sh
```

### Feature Flags
```yaml
# Feature toggles
apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-flags
data:
  CYPRUS_LOCALIZATION_ENABLED: "true"
  JCC_PAYMENTS_ENABLED: "true"
  POLICE_REGISTRATION_ENABLED: "true"
```

## 🆘 Troubleshooting

### Common Issues

1. **Pod Not Starting**
   ```bash
   kubectl describe pod <pod-name> -n pms-platform
   kubectl logs <pod-name> -n pms-platform
   ```

2. **Database Connection Issues**
   ```bash
   kubectl exec -it postgresql-0 -n pms-platform -- psql -U postgres
   ```

3. **Ingress Not Working**
   ```bash
   kubectl get ingress -n pms-platform
   kubectl describe ingress pms-ingress -n pms-platform
   ```

### Performance Tuning
```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n pms-platform

# Optimize PostgreSQL
kubectl exec -it postgresql-0 -n pms-platform -- psql -U postgres -c "ANALYZE;"
```

## 📄 License

ISC License - See LICENSE file for details.

## 🆘 Support

- **Infrastructure Issues**: DevOps Team
- **Monitoring**: [Grafana Dashboard](http://192.168.30.98:3001)
- **Logs**: [Loki/Grafana](http://192.168.30.98:3001)
- **Alerts**: [AlertManager](http://192.168.30.98:9093)