#!/bin/bash
# Setup local development environment with SQLite and enhanced schema

set -e

echo "🔄 Setting up Local Development Environment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create .env file for local development
info "Creating local development environment configuration..."
cat > .env.local << EOF
# SQLite Database Configuration (Local Development)
DATABASE_URL="file:./dev.db"

# Redis Configuration (Optional for local dev)
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="pms-jwt-secret-local-development"
JWT_EXPIRES_IN="24h"

# Node Environment
NODE_ENV="development"

# API Configuration
API_PORT=5000
CORE_PORT=3000

# Service Ports
PMS_ADMIN_PORT=3001
PMS_GUEST_PORT=3002
PMS_STAFF_PORT=3003
PMS_MARKETPLACE_PORT=3004

# CORS Origins
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:5000"

# Service URLs
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_CORE_URL="http://localhost:3000"
EOF

success "Environment configuration created"

# Backup current SQLite database if it exists
if [ -f "prisma/dev.db" ]; then
    info "Backing up current SQLite database..."
    cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)
    success "SQLite database backed up"
fi

# Update Prisma schema
info "Updating Prisma schema with enhanced features..."
cp prisma/schema-enhanced.prisma prisma/schema.prisma
success "Prisma schema updated"

# Copy environment to all services
info "Updating service configurations..."
for service in pms-backend pms-core pms-admin pms-guest pms-staff pms-marketplace; do
    if [ -d "$service" ]; then
        cp .env.local "$service/.env"
        success "Environment updated for $service"
    fi
done

# Install dependencies for all services
info "Installing dependencies for all services..."
for service in pms-backend pms-core pms-admin pms-guest pms-staff pms-marketplace; do
    if [ -d "$service" ] && [ -f "$service/package.json" ]; then
        info "Installing dependencies in $service..."
        cd "$service"
        npm install --silent
        cd ..
        success "Dependencies installed in $service"
    fi
done

# Generate Prisma client and run migrations
info "Setting up database..."
cd pms-backend

# Generate Prisma client
info "Generating Prisma client..."
npx prisma generate

# Push database schema
info "Applying database schema..."
npx prisma db push

success "Database setup completed"
cd ..

echo ""
echo "🎉 Local Development Environment Ready!"
echo "✅ Enhanced SQLite database configured"
echo "✅ All services configured with environment variables"
echo "✅ Dependencies installed"
echo "✅ Database schema applied"
echo ""
echo "🚀 Start development:"
echo "1. Backend: cd pms-backend && npm run dev"
echo "2. Core: cd pms-core && npm run dev"
echo "3. Admin: cd pms-admin && npm run dev"
echo "4. Guest: cd pms-guest && npm run dev"
echo "5. Staff: cd pms-staff && npm run dev"
echo "6. Marketplace: cd pms-marketplace && npm run dev"
echo ""
echo "Or use: make dev-all"