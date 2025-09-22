#!/bin/bash

# 🚀 Deploy Real PMS Applications to CT101
# This script replaces demo containers with actual Next.js applications

set -e

CT101_HOST="192.168.30.98"

echo "🚀 Deploying Real PMS Applications to CT101"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Step 1: Stop and remove demo containers
echo -e "\n${BLUE}Step 1: Stopping Demo Containers${NC}"
echo "--------------------------------"

print_info "Stopping demo containers on CT101..."

ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "
    echo 'Stopping PMS demo containers...'
    docker stop pms-admin-demo pms-guest-demo pms-staff-demo pms-marketplace-demo pms-backend-service 2>/dev/null || true
    docker rm pms-admin-demo pms-guest-demo pms-staff-demo pms-marketplace-demo pms-backend-service 2>/dev/null || true
"

print_status "Demo containers stopped and removed"

# Step 2: Create deployment directory structure
echo -e "\n${BLUE}Step 2: Setting Up Deployment Structure${NC}"
echo "---------------------------------------"

ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "
    mkdir -p /opt/pms-platform/{pms-admin,pms-guest,pms-staff,pms-marketplace,pms-backend}
    echo 'Deployment directories created'
"

print_status "Deployment directories created"

# Step 3: Copy application source code
echo -e "\n${BLUE}Step 3: Copying Application Source${NC}"
echo "----------------------------------"

print_info "Copying PMS Admin application..."
scp -r -i ~/.ssh/ct101_key pms-admin/* root@${CT101_HOST}:/opt/pms-platform/pms-admin/

print_info "Copying PMS Guest application..."
scp -r -i ~/.ssh/ct101_key pms-guest/* root@${CT101_HOST}:/opt/pms-platform/pms-guest/

print_info "Copying PMS Staff application..."
scp -r -i ~/.ssh/ct101_key pms-staff/* root@${CT101_HOST}:/opt/pms-platform/pms-staff/

print_info "Copying PMS Marketplace application..."
scp -r -i ~/.ssh/ct101_key pms-marketplace/* root@${CT101_HOST}:/opt/pms-platform/pms-marketplace/

print_info "Copying PMS Backend application..."
scp -r -i ~/.ssh/ct101_key pms-backend/* root@${CT101_HOST}:/opt/pms-platform/pms-backend/

print_status "All application source code copied"

# Step 4: Create Dockerfiles for each application
echo -e "\n${BLUE}Step 4: Creating Production Dockerfiles${NC}"
echo "---------------------------------------"

# Create Admin Dockerfile
ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cat > /opt/pms-platform/pms-admin/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD [\"npm\", \"start\"]
EOF"

# Create Guest Dockerfile
ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cat > /opt/pms-platform/pms-guest/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD [\"npm\", \"start\"]
EOF"

# Create Staff Dockerfile
ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cat > /opt/pms-platform/pms-staff/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD [\"npm\", \"start\"]
EOF"

# Create Marketplace Dockerfile
ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cat > /opt/pms-platform/pms-marketplace/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD [\"npm\", \"start\"]
EOF"

# Create Backend Dockerfile
ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cat > /opt/pms-platform/pms-backend/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD [\"npm\", \"start\"]
EOF"

print_status "Dockerfiles created for all applications"

# Step 5: Build and run containers
echo -e "\n${BLUE}Step 5: Building and Running Applications${NC}"
echo "----------------------------------------"

ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "
    cd /opt/pms-platform

    echo 'Building PMS Backend...'
    cd pms-backend
    docker build -t pms-backend:latest .
    docker run -d --name pms-backend-new -p 5000:5000 \
        -e NODE_ENV=production \
        -e PORT=5000 \
        --restart unless-stopped \
        pms-backend:latest

    echo 'Building PMS Admin...'
    cd ../pms-admin
    docker build -t pms-admin:latest .
    docker run -d --name pms-admin-new -p 3010:3000 \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_API_URL=http://192.168.30.98:5000 \
        --restart unless-stopped \
        pms-admin:latest

    echo 'Building PMS Guest...'
    cd ../pms-guest
    docker build -t pms-guest:latest .
    docker run -d --name pms-guest-new -p 3011:3000 \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_API_URL=http://192.168.30.98:5000 \
        --restart unless-stopped \
        pms-guest:latest

    echo 'Building PMS Staff...'
    cd ../pms-staff
    docker build -t pms-staff:latest .
    docker run -d --name pms-staff-new -p 3012:3000 \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_API_URL=http://192.168.30.98:5000 \
        --restart unless-stopped \
        pms-staff:latest

    echo 'Building PMS Marketplace...'
    cd ../pms-marketplace
    docker build -t pms-marketplace:latest .
    docker run -d --name pms-marketplace-new -p 3013:3000 \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_API_URL=http://192.168.30.98:5000 \
        --restart unless-stopped \
        pms-marketplace:latest
"

print_status "All applications built and deployed"

# Step 6: Health checks
echo -e "\n${BLUE}Step 6: Performing Health Checks${NC}"
echo "---------------------------------"

print_info "Waiting for services to start..."
sleep 30

print_info "Checking application health..."

# Test each application
BACKEND_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://${CT101_HOST}:5000/health || echo "000")
ADMIN_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://${CT101_HOST}:3010 || echo "000")
GUEST_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://${CT101_HOST}:3011 || echo "000")
STAFF_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://${CT101_HOST}:3012 || echo "000")
MARKETPLACE_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://${CT101_HOST}:3013 || echo "000")

echo
echo "🏥 Health Check Results:"
echo "======================="

if [ "$BACKEND_STATUS" == "200" ]; then
    print_status "Backend API (Port 5000): HEALTHY"
else
    print_warning "Backend API (Port 5000): UNHEALTHY (HTTP $BACKEND_STATUS)"
fi

if [ "$ADMIN_STATUS" == "200" ]; then
    print_status "Admin Dashboard (Port 3010): HEALTHY"
else
    print_warning "Admin Dashboard (Port 3010): UNHEALTHY (HTTP $ADMIN_STATUS)"
fi

if [ "$GUEST_STATUS" == "200" ]; then
    print_status "Guest Portal (Port 3011): HEALTHY"
else
    print_warning "Guest Portal (Port 3011): UNHEALTHY (HTTP $GUEST_STATUS)"
fi

if [ "$STAFF_STATUS" == "200" ]; then
    print_status "Staff App (Port 3012): HEALTHY"
else
    print_warning "Staff App (Port 3012): UNHEALTHY (HTTP $STAFF_STATUS)"
fi

if [ "$MARKETPLACE_STATUS" == "200" ]; then
    print_status "Marketplace (Port 3013): HEALTHY"
else
    print_warning "Marketplace (Port 3013): UNHEALTHY (HTTP $MARKETPLACE_STATUS)"
fi

# Test Cyprus routes
echo
print_info "Testing Cyprus-specific endpoints..."

CYPRUS_CONFIG=$(curl -s http://${CT101_HOST}:5000/api/v1/cyprus/config | grep -o '"success":true' || echo "failed")
if [ "$CYPRUS_CONFIG" == "\"success\":true" ]; then
    print_status "Cyprus Config Endpoint: WORKING"
else
    print_warning "Cyprus Config Endpoint: NOT WORKING"
fi

# Final summary
echo
echo "🎉 Deployment Summary"
echo "===================="
echo "• Backend API: http://${CT101_HOST}:5000"
echo "• Admin Dashboard: http://${CT101_HOST}:3010"
echo "• Guest Portal: http://${CT101_HOST}:3011"
echo "• Staff App: http://${CT101_HOST}:3012"
echo "• Marketplace: http://${CT101_HOST}:3013"
echo
echo "• Cyprus Config: http://${CT101_HOST}:5000/api/v1/cyprus/config"
echo "• Cyprus VAT: http://${CT101_HOST}:5000/api/v1/cyprus/vat"
echo "• Cyprus Police: http://${CT101_HOST}:5000/api/v1/cyprus/police"
echo

if [ "$BACKEND_STATUS" == "200" ] && [ "$ADMIN_STATUS" == "200" ]; then
    print_status "🎯 Real PMS applications are now running!"
    echo -e "${GREEN}You can now test the actual PMS functionality!${NC}"
else
    print_warning "Some applications may need additional time to start or troubleshooting"
fi

echo
echo "Next steps:"
echo "1. Test the applications in your browser"
echo "2. Verify Cyprus features are working"
echo "3. Test booking workflows end-to-end"