#!/bin/bash

# Cyprus Access Control (CAC) - Container #31 Deployment Script
# Geofenced Invitation Orchestration Service

set -e

echo "🎯 Deploying Container #31 - Cyprus Access Control (CAC)"
echo "Geofenced Invitation Orchestration Service"
echo "=================================================="

# Configuration
CONTAINER_NAME="pms-invitation-engine"
IMAGE_NAME="cyprus-access-control"
TAG="latest"
NETWORK_NAME="pms-network"
API_PORT="3019"
ADMIN_PORT="3020"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running"
    exit 1
fi

print_success "Docker is available and running"

# Check if environment file exists
if [ ! -f ".env" ]; then
    print_warning "No .env file found, copying from .env.example"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Please edit .env file with your configuration"
    else
        print_error ".env.example not found"
        exit 1
    fi
fi

# Check network existence
print_status "Checking PMS network..."
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    print_warning "PMS network not found, creating..."
    docker network create "$NETWORK_NAME" --driver bridge
    print_success "Created PMS network"
else
    print_success "PMS network exists"
fi

# Stop existing container if running
print_status "Checking for existing container..."
if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    print_warning "Stopping existing container..."
    docker stop "$CONTAINER_NAME"
fi

if docker ps -a -q -f name="$CONTAINER_NAME" | grep -q .; then
    print_warning "Removing existing container..."
    docker rm "$CONTAINER_NAME"
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t "$IMAGE_NAME:$TAG" .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Create required directories
print_status "Creating required directories..."
mkdir -p ./logs ./uploads
chmod 755 ./logs ./uploads

# Deploy the container
print_status "Deploying Container #31..."

docker run -d \
    --name "$CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -p "$API_PORT:$API_PORT" \
    -p "$ADMIN_PORT:$ADMIN_PORT" \
    --env-file .env \
    -v "$(pwd)/logs:/app/logs" \
    -v "$(pwd)/uploads:/app/uploads" \
    --restart unless-stopped \
    --health-cmd="curl -f http://localhost:$API_PORT/health || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-start-period=60s \
    --health-retries=3 \
    "$IMAGE_NAME:$TAG"

if [ $? -eq 0 ]; then
    print_success "Container #31 deployed successfully"
else
    print_error "Failed to deploy container"
    exit 1
fi

# Wait for container to be healthy
print_status "Waiting for container to be healthy..."
sleep 10

CONTAINER_ID=$(docker ps -q -f name="$CONTAINER_NAME")
if [ -n "$CONTAINER_ID" ]; then
    # Wait up to 60 seconds for health check
    for i in {1..12}; do
        HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_ID" 2>/dev/null || echo "starting")

        if [ "$HEALTH_STATUS" = "healthy" ]; then
            print_success "Container #31 is healthy!"
            break
        elif [ "$HEALTH_STATUS" = "unhealthy" ]; then
            print_error "Container #31 failed health check"
            docker logs "$CONTAINER_NAME" --tail 20
            exit 1
        else
            print_status "Health check status: $HEALTH_STATUS (attempt $i/12)"
            sleep 5
        fi
    done
else
    print_error "Container not found after deployment"
    exit 1
fi

# Test API endpoints
print_status "Testing API endpoints..."

# Test main API health
if curl -f -s "http://localhost:$API_PORT/health" > /dev/null; then
    print_success "Main API (port $API_PORT) is responding"
else
    print_warning "Main API health check failed"
fi

# Test admin interface
if curl -f -s "http://localhost:$ADMIN_PORT/" > /dev/null; then
    print_success "Admin interface (port $ADMIN_PORT) is responding"
else
    print_warning "Admin interface health check failed"
fi

# Display deployment information
echo ""
echo "=================================================="
echo "🎊 Container #31 Deployment Complete!"
echo "=================================================="
echo ""
echo "📊 Service Information:"
echo "   Container Name: $CONTAINER_NAME"
echo "   Image: $IMAGE_NAME:$TAG"
echo "   Network: $NETWORK_NAME"
echo ""
echo "🌐 Access URLs:"
echo "   Main API: http://192.168.30.98:$API_PORT"
echo "   Admin Dashboard: http://192.168.30.98:$ADMIN_PORT"
echo "   Health Check: http://192.168.30.98:$API_PORT/health"
echo "   Service Info: http://192.168.30.98:$API_PORT/"
echo ""
echo "🎯 Invitation Endpoints:"
echo "   Create Invitation: POST http://192.168.30.98:$API_PORT/api/invitations"
echo "   Location Validation: POST http://192.168.30.98:$API_PORT/api/location/validate"
echo "   QR Code Landing: GET http://192.168.30.98:$API_PORT/qr/{invitationNumber}"
echo "   Courier Webhooks: POST http://192.168.30.98:$API_PORT/webhook/courier/{provider}"
echo ""
echo "👑 Admin Features:"
echo "   Live Dashboard: http://192.168.30.98:$ADMIN_PORT/api/dashboard"
echo "   Analytics: http://192.168.30.98:$ADMIN_PORT/api/analytics"
echo "   Invitation Map: http://192.168.30.98:$ADMIN_PORT/api/geofencing"
echo ""
echo "🎫 Invitation Series Ready:"
echo "   CYH-### (Cyprus Hotels)"
echo "   CYR-### (Cyprus Real Estate)"
echo "   CYC-### (Cyprus Companies)"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker logs $CONTAINER_NAME"
echo "   Follow logs: docker logs -f $CONTAINER_NAME"
echo "   Restart: docker restart $CONTAINER_NAME"
echo "   Stop: docker stop $CONTAINER_NAME"
echo "   Container stats: docker stats $CONTAINER_NAME"
echo ""
echo "🗄️ Database Setup:"
print_status "To set up the database schema, run:"
echo "   docker exec -i postgres psql -U postgres -d invitations < src/database/schema.sql"
echo ""
echo "🎉 Container #31 is now operational and ready to control access to your Cyprus business empire!"
echo "Ready to generate and track geofenced invitations for hotels, real estate, and companies."
echo ""

# Show container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter name="$CONTAINER_NAME"

print_success "Deployment script completed successfully!"

# Optional: Open admin dashboard
if command -v xdg-open &> /dev/null; then
    print_status "Opening admin dashboard..."
    xdg-open "http://localhost:$ADMIN_PORT" 2>/dev/null &
elif command -v open &> /dev/null; then
    print_status "Opening admin dashboard..."
    open "http://localhost:$ADMIN_PORT" 2>/dev/null &
fi