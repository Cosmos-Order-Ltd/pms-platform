#!/bin/bash

# Helper script to create and push individual service repositories

create_service_repo() {
    local service_name="$1"
    local description="$2"
    local service_type="$3"  # backend, frontend, or infrastructure

    echo "Creating repository for $service_name..."

    cd "/c/Users/User/Desktop/pms/$service_name" || {
        echo "Directory $service_name not found, creating basic structure..."
        mkdir -p "/c/Users/User/Desktop/pms/$service_name"
        cd "/c/Users/User/Desktop/pms/$service_name"
    }

    # Create .gitignore based on service type
    case "$service_type" in
        "backend")
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3
dev.db

# Logs
logs
*.log

# Build output
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
EOF
            ;;
        "frontend")
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF
            ;;
        "infrastructure")
            cat > .gitignore << 'EOF'
# Terraform
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl

# Kubernetes
*.kubeconfig

# Helm
charts/*.tgz

# Secrets
*.key
*.pem
*.crt
secrets.yaml

# Environment
.env
.env.local

# Logs
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
            ;;
    esac

    # Create README.md
    cat > README.md << EOF
# $service_name

$description

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
\`\`\`

## Part of PMS Platform

This service is part of the complete Property Management System by Cosmos Order Ltd.

- **Main Repository**: [pms-platform](https://github.com/Cosmos-Order-Ltd/pms-platform)
- **Documentation**: [pms-docs](https://github.com/Cosmos-Order-Ltd/pms-docs)
- **Infrastructure**: [pms-infrastructure](https://github.com/Cosmos-Order-Ltd/pms-infrastructure)
EOF

    # Initialize git repository and push
    rm -rf .git
    git init
    git add .
    git commit -m "feat: initial $service_name setup

$description

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    git branch -M main
    git remote add origin "https://github.com/Cosmos-Order-Ltd/$service_name.git"
    git push -u origin main

    echo "✅ $service_name repository created and pushed"
}

# Create all service repositories
create_service_repo "pms-core" "PMS Core Service - Shared utilities and middleware" "backend"
create_service_repo "api-gateway" "PMS API Gateway - Service routing and load balancing" "backend"
create_service_repo "monitoring" "PMS Monitoring Service - System monitoring and alerting" "backend"
create_service_repo "pms-admin" "PMS Admin Dashboard - Management interface for administrators" "frontend"
create_service_repo "pms-guest" "PMS Guest Portal - Public booking and reservation interface" "frontend"
create_service_repo "pms-staff" "PMS Staff Mobile - Mobile PWA for staff operations" "frontend"
create_service_repo "pms-marketplace" "PMS Marketplace - Property listing and booking platform" "frontend"
create_service_repo "pms-shared" "PMS Shared Libraries - Common utilities and components" "backend"
create_service_repo "pms-infrastructure" "PMS Infrastructure - Kubernetes manifests and deployment configs" "infrastructure"
create_service_repo "pms-docs" "PMS Documentation - Complete documentation and guides" "infrastructure"

echo "🎉 All service repositories created and pushed!"