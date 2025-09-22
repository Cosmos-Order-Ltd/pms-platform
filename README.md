# PMS Platform - Property Management System Hub

Modern, scalable property management platform that coordinates multiple microservices.

## 🏗️ Architecture

This is the main platform hub that provides a unified entry point for the PMS ecosystem. All business logic and functionality has been separated into focused microservice repositories.

## 🚀 Available Services

All services are maintained in individual repositories for focused development:

### Core Platform Services
- **pms-backend** - Core API service and business logic
- **pms-admin** - Administrative dashboard and management interface
- **pms-guest** - Guest portal and customer-facing features
- **pms-staff** - Staff mobile application and workflows
- **pms-marketplace** - Marketplace platform and vendor integration

### Infrastructure & Shared
- **database-schema** - Centralized database schemas and migrations
- **shared-library** - Common utilities, types, and shared components
- **pms-infrastructure** - Infrastructure as Code and deployment configs

### Specialized Services
- **cyprus-localization** - Cyprus-specific compliance and localization
- **invitation-engine** - Advanced invitation and trial management
- **cosmos-real-estate** - Real estate integration services

### Business Automation (22 services)
- AI Revenue Optimization
- Billing Engine
- Business Intelligence System
- Customer Acquisition
- Email Automation
- And 17+ more specialized services

## 📚 Development Workflow

### Single Repository Focus
This platform follows a microservices architecture where each service is developed independently:

1. **Clone specific service**: `git clone http://192.168.30.98:3000/charilaouc/[service-name]`
2. **Work on one service**: Focus on single responsibility and clear boundaries
3. **Independent deployment**: Each service can be deployed separately
4. **Isolated testing**: Service-specific test suites and CI/CD

### Repository Access
- **Gitea Server**: http://192.168.30.98:3000/charilaouc/
- **Total Repositories**: 30+ focused microservices
- **Development**: Clone individual repositories as needed

## 🛠️ This Repository

This hub repository contains:
- ✅ Minimal Next.js application for coordination
- ✅ Basic documentation and service overview
- ✅ Clean, focused structure without business logic
- ✅ Links to individual service repositories

For actual development work, use the individual service repositories.

## 📝 Quick Start

```bash
# Start the hub platform
npm install
npm run dev

# For service development, clone specific repositories:
git clone http://192.168.30.98:3000/charilaouc/pms-backend
git clone http://192.168.30.98:3000/charilaouc/pms-admin
# ... etc
```

## 🔧 Benefits of This Architecture

- **Focus**: Work on one service without distractions
- **Speed**: Faster builds, tests, and deployments per service
- **Clarity**: Clear boundaries and responsibilities
- **Scaling**: Each service scales independently
- **Maintenance**: Easier to update and maintain individual services

## 📝 License

Private - Cosmos Order Ltd.