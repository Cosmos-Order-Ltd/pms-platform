#!/bin/bash
# COSMOS ORDER REAL ESTATE PLATFORM DEPLOYMENT
# Container #43 - "From land to keys, fully automated"

echo "=================================================="
echo "DEPLOYING COSMOS ORDER REAL ESTATE PLATFORM"
echo "Container #43 - Real Estate Development Platform"
echo "=================================================="

# Configuration
CONTAINER_NAME="cosmos-real-estate-platform"
IMAGE_NAME="cosmos/real-estate-platform"
VERSION="1.0.0"
PORT=3030
NETWORK="cosmos-network"

echo "🏗️ Container: $CONTAINER_NAME"
echo "📦 Image: $IMAGE_NAME:$VERSION"
echo "🌐 Port: $PORT"
echo ""

# Function to check if running as root (for Docker operations)
check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker daemon is not running or you don't have permission."
        echo "   Try: sudo usermod -aG docker $USER"
        echo "   Then log out and back in."
        exit 1
    fi

    echo "✅ Docker is available"
}

# Function to check if environment file exists
check_environment() {
    if [[ ! -f .env ]]; then
        echo "⚠️ .env file not found. Creating from example..."

        if [[ -f .env.example ]]; then
            cp .env.example .env
            echo "📋 Please edit .env file with your actual configuration"
            echo "   Required: DATABASE_URL, REDIS_URL, JWT_SECRET, etc."
            read -p "Press Enter after editing .env file to continue..."
        else
            echo "❌ .env.example file not found. Cannot proceed."
            exit 1
        fi
    fi

    echo "✅ Environment configuration found"
}

# Function to create network if it doesn't exist
setup_network() {
    echo "🌐 Setting up Docker network..."

    if ! docker network ls | grep -q $NETWORK; then
        docker network create $NETWORK
        echo "✅ Created Docker network: $NETWORK"
    else
        echo "✅ Docker network exists: $NETWORK"
    fi
}

# Function to build the Docker image
build_image() {
    echo "🔨 Building Docker image..."

    # Build the image
    if docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest .; then
        echo "✅ Docker image built successfully"
    else
        echo "❌ Failed to build Docker image"
        exit 1
    fi
}

# Function to stop and remove existing container
cleanup_existing() {
    echo "🧹 Cleaning up existing container..."

    if docker ps -a | grep -q $CONTAINER_NAME; then
        echo "📦 Stopping existing container..."
        docker stop $CONTAINER_NAME 2>/dev/null

        echo "🗑️ Removing existing container..."
        docker rm $CONTAINER_NAME 2>/dev/null

        echo "✅ Existing container cleaned up"
    else
        echo "✅ No existing container to clean up"
    fi
}

# Function to create necessary directories
setup_directories() {
    echo "📁 Setting up directories..."

    mkdir -p logs
    mkdir -p uploads
    mkdir -p temp
    mkdir -p database

    # Set permissions
    chmod 755 logs uploads temp

    echo "✅ Directories created"
}

# Function to deploy the container
deploy_container() {
    echo "🚀 Deploying container..."

    # Run the container
    docker run -d \
        --name $CONTAINER_NAME \
        --network $NETWORK \
        -p $PORT:3030 \
        --env-file .env \
        -v $(pwd)/logs:/app/logs \
        -v $(pwd)/uploads:/app/uploads \
        -v $(pwd)/temp:/app/temp \
        --restart unless-stopped \
        $IMAGE_NAME:latest

    if [[ $? -eq 0 ]]; then
        echo "✅ Container deployed successfully"
    else
        echo "❌ Failed to deploy container"
        exit 1
    fi
}

# Function to wait for container to be ready
wait_for_ready() {
    echo "⏳ Waiting for container to be ready..."

    for i in {1..30}; do
        if curl -s http://localhost:$PORT/health >/dev/null 2>&1; then
            echo "✅ Container is ready and responding"
            return 0
        fi

        echo "   Attempt $i/30... waiting 5 seconds"
        sleep 5
    done

    echo "⚠️ Container may not be fully ready yet"
    echo "   Check logs: docker logs $CONTAINER_NAME"
}

# Function to run health check
health_check() {
    echo "🏥 Performing health check..."

    # Check container status
    if docker ps | grep -q $CONTAINER_NAME; then
        echo "✅ Container is running"
    else
        echo "❌ Container is not running"
        echo "   Check logs: docker logs $CONTAINER_NAME"
        return 1
    fi

    # Check HTTP response
    if curl -s http://localhost:$PORT/health | grep -q "operational"; then
        echo "✅ Health endpoint responding correctly"
    else
        echo "❌ Health endpoint not responding correctly"
        return 1
    fi

    # Check service info
    if curl -s http://localhost:$PORT/ | grep -q "Real Estate Development Platform"; then
        echo "✅ Service info endpoint responding correctly"
    else
        echo "❌ Service info endpoint not responding correctly"
        return 1
    fi

    return 0
}

# Function to display connection info
show_connection_info() {
    echo ""
    echo "=================================================="
    echo "✅ CONTAINER #43 DEPLOYMENT COMPLETE"
    echo "=================================================="
    echo ""
    echo "🏗️ Real Estate Platform Information:"
    echo "   • Container Name: $CONTAINER_NAME"
    echo "   • Image: $IMAGE_NAME:$VERSION"
    echo "   • Status: Running"
    echo ""
    echo "🌐 Access URLs:"
    echo "   • Health Check: http://localhost:$PORT/health"
    echo "   • Service Info: http://localhost:$PORT/"
    echo "   • API Base: http://localhost:$PORT/api"
    echo "   • WebSocket: ws://localhost:$PORT"
    echo ""
    echo "🎫 Invitation Access:"
    echo "   • Series: CYR (Cyprus Real Estate)"
    echo "   • CYR-001: Your Wife - Co-Founder Access"
    echo "   • CYR-002: Your Best Friend - Investor Access"
    echo ""
    echo "🔧 Management Commands:"
    echo "   • View logs: docker logs $CONTAINER_NAME"
    echo "   • Follow logs: docker logs -f $CONTAINER_NAME"
    echo "   • Restart: docker restart $CONTAINER_NAME"
    echo "   • Stop: docker stop $CONTAINER_NAME"
    echo "   • Shell access: docker exec -it $CONTAINER_NAME /bin/sh"
    echo ""
    echo "📊 Features Available:"
    echo "   ✅ Land Acquisition Analysis"
    echo "   ✅ Project Development Management"
    echo "   ✅ Construction Progress Tracking"
    echo "   ✅ Sales & Marketing Automation"
    echo "   ✅ Investor Relations Management"
    echo "   ✅ Cyprus Compliance Engine"
    echo "   ✅ Financial Analytics & Reporting"
    echo "   ✅ Real-time WebSocket Updates"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Send CYR-001 invitation to your wife"
    echo "   2. Send CYR-002 invitation to your best friend"
    echo "   3. Create your first real estate project"
    echo "   4. Begin land acquisition analysis"
    echo ""
    echo "📈 Integration Points:"
    echo "   • Main PMS Platform: http://192.168.30.98:5000"
    echo "   • Invitation System: http://192.168.30.98:3031"
    echo "   • Billing Engine: http://192.168.30.98:3018"
    echo ""
    echo "🏗️ Your real estate empire automation is ready!"
    echo "=================================================="
}

# Function to run quick tests
run_tests() {
    echo "🧪 Running quick integration tests..."

    # Test health endpoint
    echo "   Testing health endpoint..."
    if curl -s http://localhost:$PORT/health | jq -e '.status == "operational"' >/dev/null 2>&1; then
        echo "   ✅ Health check passed"
    else
        echo "   ⚠️ Health check response unexpected"
    fi

    # Test service info
    echo "   Testing service info..."
    if curl -s http://localhost:$PORT/ | jq -e '.platform' >/dev/null 2>&1; then
        echo "   ✅ Service info available"
    else
        echo "   ⚠️ Service info response unexpected"
    fi

    # Test WebSocket (basic check)
    echo "   Testing WebSocket availability..."
    if netstat -tuln | grep -q ":$PORT "; then
        echo "   ✅ WebSocket port listening"
    else
        echo "   ⚠️ WebSocket port may not be available"
    fi

    echo "✅ Basic tests completed"
}

# Function to setup monitoring
setup_monitoring() {
    echo "📊 Setting up monitoring..."

    # Create monitoring script
    cat > monitor-container-43.sh << 'MONITOR'
#!/bin/bash
# Real Estate Platform Monitoring Script

CONTAINER_NAME="cosmos-real-estate-platform"
PORT=3030

echo "📊 Container #43 Monitoring Report"
echo "=================================="
echo "Timestamp: $(date)"
echo ""

# Container status
echo "Container Status:"
if docker ps | grep -q $CONTAINER_NAME; then
    echo "  ✅ Container is running"

    # Get container stats
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" $CONTAINER_NAME
else
    echo "  ❌ Container is not running"
fi

echo ""

# Health check
echo "Service Health:"
if curl -s http://localhost:$PORT/health | grep -q "operational"; then
    echo "  ✅ Service responding correctly"
else
    echo "  ❌ Service not responding"
fi

echo ""

# Recent logs
echo "Recent Logs (last 10 lines):"
docker logs --tail 10 $CONTAINER_NAME

echo ""
echo "=================================="
MONITOR

    chmod +x monitor-container-43.sh
    echo "✅ Monitoring script created: ./monitor-container-43.sh"
}

# Function to setup backup
setup_backup() {
    echo "💾 Setting up backup script..."

    cat > backup-container-43.sh << 'BACKUP'
#!/bin/bash
# Real Estate Platform Backup Script

CONTAINER_NAME="cosmos-real-estate-platform"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "💾 Backing up Container #43..."

# Backup application data
echo "📁 Backing up application files..."
tar -czf "$BACKUP_DIR/real-estate-app_$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='logs' \
    --exclude='temp' \
    .

# Backup logs
echo "📋 Backing up logs..."
tar -czf "$BACKUP_DIR/real-estate-logs_$TIMESTAMP.tar.gz" logs/

# Backup uploads
if [[ -d uploads && $(ls -A uploads) ]]; then
    echo "📎 Backing up uploads..."
    tar -czf "$BACKUP_DIR/real-estate-uploads_$TIMESTAMP.tar.gz" uploads/
fi

# Database backup (if accessible)
echo "🗄️ Attempting database backup..."
if docker exec $CONTAINER_NAME pg_dump real_estate_db > "$BACKUP_DIR/real-estate-db_$TIMESTAMP.sql" 2>/dev/null; then
    echo "✅ Database backup completed"
else
    echo "⚠️ Database backup skipped (not accessible)"
fi

echo "✅ Backup completed: $BACKUP_DIR/real-estate-*_$TIMESTAMP.*"

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "real-estate-*" -mtime +7 -delete 2>/dev/null

echo "📁 Old backups cleaned up"
BACKUP

    chmod +x backup-container-43.sh
    echo "✅ Backup script created: ./backup-container-43.sh"
}

# Main deployment function
main() {
    echo "🚀 Starting Real Estate Platform Deployment"
    echo ""

    # Pre-flight checks
    check_docker
    check_environment

    # Setup
    setup_network
    setup_directories

    # Build and deploy
    build_image
    cleanup_existing
    deploy_container

    # Post-deployment
    wait_for_ready

    if health_check; then
        run_tests
        setup_monitoring
        setup_backup
        show_connection_info
    else
        echo ""
        echo "❌ Deployment completed but health checks failed"
        echo "📋 Check container logs: docker logs $CONTAINER_NAME"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "health")
        health_check
        ;;
    "logs")
        docker logs -f $CONTAINER_NAME
        ;;
    "stop")
        docker stop $CONTAINER_NAME
        echo "🛑 Container stopped"
        ;;
    "start")
        docker start $CONTAINER_NAME
        echo "▶️ Container started"
        ;;
    "restart")
        docker restart $CONTAINER_NAME
        echo "🔄 Container restarted"
        ;;
    "remove")
        docker stop $CONTAINER_NAME 2>/dev/null
        docker rm $CONTAINER_NAME 2>/dev/null
        echo "🗑️ Container removed"
        ;;
    "shell")
        docker exec -it $CONTAINER_NAME /bin/sh
        ;;
    *)
        echo "Usage: $0 [deploy|health|logs|stop|start|restart|remove|shell]"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the container (default)"
        echo "  health  - Check container health"
        echo "  logs    - View container logs"
        echo "  stop    - Stop the container"
        echo "  start   - Start the container"
        echo "  restart - Restart the container"
        echo "  remove  - Remove the container"
        echo "  shell   - Access container shell"
        ;;
esac