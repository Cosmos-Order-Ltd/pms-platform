#!/bin/bash
# Setup PostgreSQL with Docker for PMS platform

set -e

echo "🔄 Setting up PostgreSQL with Docker for PMS"
echo "=============================================="

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

# Environment variables
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=pms
POSTGRES_USER=pmsuser
POSTGRES_PASSWORD=password

# Create .env file for PostgreSQL
info "Creating PostgreSQL environment configuration..."
cat > .env.postgres << EOF
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="pms-jwt-secret-change-in-production"
JWT_EXPIRES_IN="24h"

# Node Environment
NODE_ENV="development"

# API Configuration
API_PORT=5000
CORE_PORT=3000

# CORS Origins
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:5000"
EOF

success "Environment configuration created"

# Stop and remove existing container if it exists
info "Cleaning up existing PostgreSQL container..."
docker stop pms-postgres 2>/dev/null || true
docker rm pms-postgres 2>/dev/null || true

# Start PostgreSQL container
info "Starting PostgreSQL with Docker..."
docker run -d \
    --name pms-postgres \
    -e POSTGRES_DB=${POSTGRES_DB} \
    -e POSTGRES_USER=${POSTGRES_USER} \
    -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
    -p ${POSTGRES_PORT}:5432 \
    postgres:15-alpine

# Wait for PostgreSQL to be ready
info "Waiting for PostgreSQL to be ready..."
sleep 15

# Test connection using docker exec
info "Testing PostgreSQL connection..."
if docker exec pms-postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c '\l' > /dev/null 2>&1; then
    success "PostgreSQL connection successful"
else
    error "Failed to connect to PostgreSQL"
    exit 1
fi

# Update Prisma schema
info "Updating Prisma schema for PostgreSQL..."
cp prisma/schema-enhanced.prisma prisma/schema.prisma
success "Prisma schema updated"

# Copy environment to all services
info "Updating service configurations..."
cp .env.postgres pms-backend/.env
cp .env.postgres pms-core/.env
cp .env.postgres pms-admin/.env
cp .env.postgres pms-guest/.env
cp .env.postgres pms-staff/.env
cp .env.postgres pms-marketplace/.env

success "All service configurations updated"

echo ""
echo "🎉 PostgreSQL Setup Complete!"
echo "✅ PostgreSQL database running on localhost:5432"
echo "✅ Database: ${POSTGRES_DB}"
echo "✅ User: ${POSTGRES_USER}"
echo "✅ All services configured"
echo ""
echo "🚀 Next steps:"
echo "1. Run 'cd pms-backend && npm run db:migrate' to apply migrations"
echo "2. Run 'cd pms-backend && npm run db:seed' to create sample data"
echo "3. Start services with 'make dev-all'"