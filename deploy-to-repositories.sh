#!/bin/bash

# PMS Repository Deployment Script
# Deploys each microservice to its own private repository under cosmosorder organization

set -e

echo "🚀 PMS Repository Deployment Script"
echo "===================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# GitHub organization
ORG="cosmosorder"

# Service directories and repository names
declare -A services=(
    ["pms-backend"]="PMS Backend API Service"
    ["pms-core"]="PMS Authentication Service"
    ["api-gateway"]="PMS API Gateway"
    ["monitoring"]="PMS Monitoring Dashboard"
    ["pms-admin"]="PMS Admin Dashboard"
    ["pms-guest"]="PMS Guest Portal"
    ["pms-staff"]="PMS Staff Mobile App"
    ["pms-marketplace"]="PMS Property Marketplace"
)

# Step 1: Check GitHub CLI authentication
echo "📝 Step 1: Checking GitHub CLI authentication..."
if ! gh auth status > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  GitHub CLI not authenticated. Please run: gh auth login${NC}"
    echo "After authentication, run this script again."
    exit 1
fi
echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
echo ""

# Step 2: Create repositories
echo "📝 Step 2: Creating repositories under $ORG organization..."
for service in "${!services[@]}"; do
    description="${services[$service]}"
    repo_name="$service"

    # Replace 'api-gateway' with 'pms-gateway' and 'monitoring' with 'pms-monitoring'
    if [ "$service" = "api-gateway" ]; then
        repo_name="pms-gateway"
    elif [ "$service" = "monitoring" ]; then
        repo_name="pms-monitoring"
    fi

    echo -n "Creating $ORG/$repo_name... "

    if gh repo view "$ORG/$repo_name" > /dev/null 2>&1; then
        echo -e "${YELLOW}Already exists${NC}"
    else
        if gh repo create "$ORG/$repo_name" --private --description "$description" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Created${NC}"
        else
            echo -e "${RED}❌ Failed${NC}"
        fi
    fi
done
echo ""

# Step 3: Initialize and push each service
echo "📝 Step 3: Initializing and pushing services..."
for service in "${!services[@]}"; do
    repo_name="$service"

    # Replace 'api-gateway' with 'pms-gateway' and 'monitoring' with 'pms-monitoring'
    if [ "$service" = "api-gateway" ]; then
        repo_name="pms-gateway"
    elif [ "$service" = "monitoring" ]; then
        repo_name="pms-monitoring"
    fi

    echo ""
    echo "Processing $service..."

    if [ ! -d "$service" ]; then
        echo -e "${RED}❌ Directory $service not found${NC}"
        continue
    fi

    cd "$service"

    # Check if already a git repository
    if [ -d ".git" ]; then
        echo "  Removing existing .git directory..."
        rm -rf .git
    fi

    # Initialize new repository
    echo "  Initializing git repository..."
    git init --quiet

    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        echo "  Creating .gitignore..."
        cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.production
dist/
build/
.next/
*.log
.DS_Store
coverage/
.vscode/
.idea/
*.swp
*.swo
EOF
    fi

    # Create service-specific README if it doesn't exist
    if [ ! -f "README.md" ]; then
        echo "  Creating README.md..."
        cat > README.md << EOF
# $repo_name

${services[$service]}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📋 Environment Variables

See \`.env.example\` for required environment variables.

## 🏗️ Architecture

Part of the PMS microservices ecosystem.

## 📝 License

Private repository - All rights reserved
EOF
    fi

    # Add all files
    echo "  Adding files to git..."
    git add .

    # Commit
    echo "  Creating initial commit..."
    git commit -m "Initial commit: $service microservice" --quiet

    # Add remote
    echo "  Adding remote origin..."
    git remote add origin "https://github.com/$ORG/$repo_name.git"

    # Push to main branch
    echo "  Pushing to GitHub..."
    if git push -u origin main --force > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Successfully pushed $service to $ORG/$repo_name${NC}"
    else
        echo -e "  ${RED}❌ Failed to push $service${NC}"
    fi

    cd ..
done

echo ""
echo "===================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Repositories created:"
for service in "${!services[@]}"; do
    repo_name="$service"
    if [ "$service" = "api-gateway" ]; then
        repo_name="pms-gateway"
    elif [ "$service" = "monitoring" ]; then
        repo_name="pms-monitoring"
    fi
    echo "  • https://github.com/$ORG/$repo_name"
done
echo ""
echo "Next steps:"
echo "  1. Configure secrets in each repository settings"
echo "  2. Set up GitHub Actions workflows"
echo "  3. Configure deployment environments"
echo "  4. Update team access permissions"