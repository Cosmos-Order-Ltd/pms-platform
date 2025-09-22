#!/bin/bash

# 🔍 PMS Platform - Development Environment Validation
# This script validates all services and provides a comprehensive status report

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
CT101_HOST="192.168.30.98"
JENKINS_URL="http://${CT101_HOST}:8090"
SONAR_URL="http://${CT101_HOST}:9000"
GRAFANA_URL="http://${CT101_HOST}:3001"
PROMETHEUS_URL="http://${CT101_HOST}:9090"

# Credentials
JENKINS_USER="admin"
JENKINS_PASS="pms-platform-admin"
SONAR_USER="admin"
SONAR_PASS="aaBB!!22ccdd"
GRAFANA_USER="admin"
GRAFANA_PASS="aaBB!!22ccdd"

echo -e "${CYAN}🔍 PMS Platform Environment Validation${NC}"
echo -e "${CYAN}======================================${NC}"
echo

# Function to print status
print_check() {
    local status=$1
    local message=$2
    if [ "$status" == "OK" ]; then
        echo -e "${GREEN}[✓]${NC} $message"
    elif [ "$status" == "WARNING" ]; then
        echo -e "${YELLOW}[!]${NC} $message"
    else
        echo -e "${RED}[✗]${NC} $message"
    fi
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_section() {
    echo -e "\n${PURPLE}$1${NC}"
    echo -e "${PURPLE}$(echo "$1" | sed 's/./=/g')${NC}"
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local expected_code=${2:-200}

    local response_code=$(curl -s -w "%{http_code}" -o /dev/null --max-time 10 "$url" 2>/dev/null || echo "000")

    if [ "$response_code" == "$expected_code" ] || [ "$response_code" == "200" ] || [ "$response_code" == "302" ]; then
        return 0
    else
        return 1
    fi
}

# Function to test authenticated endpoint
test_auth_endpoint() {
    local url=$1
    local user=$2
    local pass=$3

    local response_code=$(curl -s -w "%{http_code}" -o /dev/null --max-time 10 -u "$user:$pass" "$url" 2>/dev/null || echo "000")

    if [ "$response_code" == "200" ]; then
        return 0
    else
        return 1
    fi
}

# Section 1: Infrastructure Services
print_section "🏗️ Infrastructure Services"

# Jenkins
if test_endpoint "$JENKINS_URL"; then
    if test_auth_endpoint "$JENKINS_URL/api/json" "$JENKINS_USER" "$JENKINS_PASS"; then
        print_check "OK" "Jenkins - Accessible and authenticated [$JENKINS_URL]"
    else
        print_check "WARNING" "Jenkins - Accessible but authentication failed [$JENKINS_URL]"
    fi
else
    print_check "ERROR" "Jenkins - Not accessible [$JENKINS_URL]"
fi

# SonarQube
if test_endpoint "$SONAR_URL"; then
    if test_auth_endpoint "$SONAR_URL/api/projects/search" "$SONAR_USER" "$SONAR_PASS"; then
        print_check "OK" "SonarQube - Accessible and authenticated [$SONAR_URL]"

        # Check if project exists
        local project_exists=$(curl -s -u "$SONAR_USER:$SONAR_PASS" "$SONAR_URL/api/projects/search" | grep -o '"key":"pms-platform"' || echo "")
        if [ ! -z "$project_exists" ]; then
            print_check "OK" "SonarQube - Project 'pms-platform' exists"
        else
            print_check "WARNING" "SonarQube - Project 'pms-platform' not found"
        fi
    else
        print_check "WARNING" "SonarQube - Accessible but authentication failed [$SONAR_URL]"
    fi
else
    print_check "ERROR" "SonarQube - Not accessible [$SONAR_URL]"
fi

# Grafana
if test_endpoint "$GRAFANA_URL"; then
    if test_auth_endpoint "$GRAFANA_URL/api/health" "$GRAFANA_USER" "$GRAFANA_PASS"; then
        print_check "OK" "Grafana - Accessible and authenticated [$GRAFANA_URL]"
    else
        print_check "WARNING" "Grafana - Accessible but authentication failed [$GRAFANA_URL]"
    fi
else
    print_check "ERROR" "Grafana - Not accessible [$GRAFANA_URL]"
fi

# Prometheus
if test_endpoint "$PROMETHEUS_URL"; then
    print_check "OK" "Prometheus - Accessible [$PROMETHEUS_URL]"
else
    print_check "ERROR" "Prometheus - Not accessible [$PROMETHEUS_URL]"
fi

# Section 2: PMS Applications
print_section "🏨 PMS Applications"

PMS_SERVICES=(
    "3010:Admin Dashboard:admin.pms.local"
    "3011:Guest Portal:guest.pms.local"
    "3012:Staff Mobile:staff.pms.local"
    "3013:Marketplace:market.pms.local"
    "5000:Backend API:api.pms.local"
)

for service in "${PMS_SERVICES[@]}"; do
    IFS=':' read -r port name domain <<< "$service"
    local url="http://${CT101_HOST}:${port}"

    if test_endpoint "$url"; then
        print_check "OK" "$name - Running [$url]"
    else
        print_check "WARNING" "$name - Not accessible [$url]"
    fi
done

# Section 3: Database Services
print_section "🗄️ Database Services"

# Test database connectivity
DB_SERVICES=(
    "5432:PostgreSQL"
    "6379:Redis"
    "9200:Elasticsearch"
    "27017:MongoDB"
)

for service in "${DB_SERVICES[@]}"; do
    IFS=':' read -r port name <<< "$service"

    if nc -z "$CT101_HOST" "$port" 2>/dev/null; then
        print_check "OK" "$name - Port $port accessible"
    else
        print_check "WARNING" "$name - Port $port not accessible"
    fi
done

# Section 4: Cyprus Services
print_section "🇨🇾 Cyprus Localization"

# Check Cyprus PMS service
if test_endpoint "http://${CT101_HOST}:3017"; then
    print_check "OK" "Cyprus PMS Service - Running [http://${CT101_HOST}:3017]"
else
    print_check "WARNING" "Cyprus PMS Service - Not accessible [http://${CT101_HOST}:3017]"
fi

# Check if Cyprus backend integration is available
if test_endpoint "http://${CT101_HOST}:5000/api/v1/cyprus/health"; then
    print_check "OK" "Cyprus Backend Integration - Health endpoint accessible"
else
    print_check "WARNING" "Cyprus Backend Integration - Health endpoint not accessible"
fi

# Section 5: Container Status
print_section "🐳 Container Infrastructure"

print_info "Checking CT101 container status..."

# SSH to CT101 and check Docker containers
CONTAINER_STATUS=$(ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -E '(pms-|jenkins|sonar|grafana|prometheus)' | wc -l" 2>/dev/null || echo "0")

if [ "$CONTAINER_STATUS" -gt "10" ]; then
    print_check "OK" "CT101 - Multiple containers running ($CONTAINER_STATUS containers)"
else
    print_check "WARNING" "CT101 - Limited containers running ($CONTAINER_STATUS containers)"
fi

# Check total system resources
MEMORY_INFO=$(ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "free -h | grep '^Mem:' | awk '{print \$2, \$3}'" 2>/dev/null || echo "Unknown")
print_info "CT101 Memory: $MEMORY_INFO"

# Section 6: Development Workflow
print_section "🔄 Development Workflow"

# Check Git repository status
if [ -d ".git" ]; then
    local current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    local remote_url=$(git remote get-url origin 2>/dev/null || echo "unknown")

    print_check "OK" "Git Repository - Branch: $current_branch"
    print_info "Remote URL: $remote_url"
else
    print_check "WARNING" "Git Repository - Not a git repository"
fi

# Check if Jenkinsfile exists
if [ -f "Jenkinsfile" ]; then
    print_check "OK" "Jenkinsfile - Present"
else
    print_check "ERROR" "Jenkinsfile - Missing"
fi

# Check credentials files
if [ -f ".env.credentials" ]; then
    print_check "OK" "Credentials File - Present (.env.credentials)"
else
    print_check "WARNING" "Credentials File - Missing (.env.credentials)"
fi

if [ -f ".env.sonar" ]; then
    print_check "OK" "SonarQube Token - Present (.env.sonar)"
else
    print_check "WARNING" "SonarQube Token - Missing (.env.sonar)"
fi

# Section 7: Configuration Files
print_section "📄 Configuration Files"

CONFIG_FILES=(
    "docker-compose.cyprus.yml:Cyprus Docker Compose"
    ".env.cyprus:Cyprus Environment"
    "k8s-manifests/cyprus-config.yaml:Cyprus K8s Config"
    "deployment-map.html:Deployment Map"
    "enhanced-deployment-map.html:Enhanced Deployment Map"
    "DEVELOPMENT_SETUP.md:Setup Documentation"
)

for config in "${CONFIG_FILES[@]}"; do
    IFS=':' read -r file description <<< "$config"

    if [ -f "$file" ]; then
        print_check "OK" "$description - Present"
    else
        print_check "WARNING" "$description - Missing"
    fi
done

# Section 8: Network Connectivity
print_section "🌐 Network Connectivity"

# Test network connectivity to CT101
if ping -c 1 "$CT101_HOST" >/dev/null 2>&1; then
    print_check "OK" "Network - CT101 host reachable"
else
    print_check "ERROR" "Network - CT101 host unreachable"
fi

# Test SSH connectivity
if ssh -i ~/.ssh/ct101_key -o ConnectTimeout=5 root@${CT101_HOST} "echo 'SSH test'" >/dev/null 2>&1; then
    print_check "OK" "SSH - CT101 accessible with key"
else
    print_check "ERROR" "SSH - CT101 not accessible"
fi

# Final Summary
print_section "📊 Environment Status Summary"

echo -e "${BLUE}🎯 Quick Access URLs:${NC}"
echo "   • Jenkins:    $JENKINS_URL"
echo "   • SonarQube:  $SONAR_URL"
echo "   • Grafana:    $GRAFANA_URL"
echo "   • Prometheus: $PROMETHEUS_URL"
echo

echo -e "${BLUE}🏨 PMS Applications:${NC}"
echo "   • Admin:      http://${CT101_HOST}:3010"
echo "   • Guest:      http://${CT101_HOST}:3011"
echo "   • Staff:      http://${CT101_HOST}:3012"
echo "   • Market:     http://${CT101_HOST}:3013"
echo "   • API:        http://${CT101_HOST}:5000"
echo

echo -e "${BLUE}🇨🇾 Cyprus Services:${NC}"
echo "   • Cyprus PMS: http://${CT101_HOST}:3017"
echo "   • VAT API:    http://${CT101_HOST}:5000/api/v1/cyprus/vat"
echo "   • Police API: http://${CT101_HOST}:5000/api/v1/cyprus/police"
echo

echo -e "${GREEN}✅ Validation Complete!${NC}"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Visit Jenkins and manually create the pipeline if needed"
echo "2. Test the development workflow by making a code change"
echo "3. Monitor services through Grafana dashboards"
echo "4. Review SonarQube quality gates and metrics"
echo
echo -e "${CYAN}For detailed setup instructions, see: DEVELOPMENT_SETUP.md${NC}"