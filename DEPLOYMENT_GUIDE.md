# 🚀 PMS Platform Deployment Guide

Complete guide for deploying the PMS microservices platform.

## 📋 Quick Start

### Local Development
```bash
# Backend development
cd pms-backend
npm install
npm run dev  # Port 5000

# Admin development
cd pms-admin
npm install
npm run dev  # Port 3000
```

### Services Access
| Service | URL | Credentials |
|---------|-----|-------------|
| Jenkins | `http://192.168.30.98:8090` | admin / pms-platform-admin |
| Gitea | `http://192.168.30.98:3000` | charilaouc / aaBB!!22cc |
| SonarQube | `http://192.168.30.98:9000` | admin / aaBB!!22ccdd |
| Grafana | `http://192.168.30.98:3001` | admin / aaBB!!22ccdd |

## 🏗️ Architecture

The platform consists of separated repositories:
- **pms-backend** - Core API service
- **pms-admin** - Admin dashboard
- **pms-guest** - Guest portal
- **pms-staff** - Staff mobile app
- **pms-marketplace** - Marketplace application

See `REPOSITORY_SEPARATION_COMPLETE.md` for complete repository structure.

## 🐳 Docker Deployment

```bash
# Build and run backend
cd pms-backend
docker build -t pms-backend .
docker run -p 5000:5000 pms-backend

# For full k8s deployment, see k8s/ directory
```

## 🔧 Development Setup

1. Clone repositories from Gitea
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run tests: `npm test`
5. Start development: `npm run dev`

For detailed setup, see individual repository README files.