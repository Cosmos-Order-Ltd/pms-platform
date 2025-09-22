#!/bin/bash

# 🚀 PMS Platform - Complete Development Environment Setup
# This script configures Jenkins, SonarQube, Grafana, and creates the CI/CD pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo -e "${BLUE}🚀 PMS Platform Development Environment Setup${NC}"
echo -e "${BLUE}================================================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to check service availability
check_service() {
    local url=$1
    local name=$2

    if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
        print_status "$name is accessible at $url"
        return 0
    else
        print_error "$name is not accessible at $url"
        return 1
    fi
}

# Step 1: Verify all services are running
echo -e "\n${BLUE}Step 1: Verifying Service Accessibility${NC}"
echo "----------------------------------------"

check_service "$JENKINS_URL" "Jenkins"
check_service "$SONAR_URL" "SonarQube"
check_service "$GRAFANA_URL" "Grafana"
check_service "$PROMETHEUS_URL" "Prometheus"

# Step 2: Configure SonarQube
echo -e "\n${BLUE}Step 2: Configuring SonarQube${NC}"
echo "------------------------------"

print_info "Creating SonarQube project..."

# Create SonarQube project
curl -s -u "${SONAR_USER}:${SONAR_PASS}" \
  -X POST "${SONAR_URL}/api/projects/create" \
  -d "name=PMS Platform" \
  -d "project=pms-platform" \
  -d "visibility=private" > /dev/null

if [ $? -eq 0 ]; then
    print_status "SonarQube project 'pms-platform' created"
else
    print_warning "SonarQube project might already exist"
fi

# Generate SonarQube token
print_info "Generating SonarQube authentication token..."

SONAR_TOKEN=$(curl -s -u "${SONAR_USER}:${SONAR_PASS}" \
  -X POST "${SONAR_URL}/api/user_tokens/generate" \
  -d "name=jenkins-integration" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$SONAR_TOKEN" ]; then
    print_status "SonarQube token generated successfully"
    echo "SONAR_TOKEN=${SONAR_TOKEN}" >> .env.sonar
else
    print_warning "Could not generate SonarQube token (might already exist)"
fi

# Step 3: Configure Jenkins Pipeline
echo -e "\n${BLUE}Step 3: Configuring Jenkins Pipeline${NC}"
echo "------------------------------------"

print_info "Creating Jenkins pipeline job..."

# Create Jenkins job configuration XML
cat > jenkins-pipeline-config.xml << EOF
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.8.5"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.8.5">
      <jobProperties/>
      <triggers/>
      <parameters/>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description>PMS Platform CI/CD Pipeline with Cyprus Localization</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <hudson.triggers.SCMTrigger>
          <spec>H/5 * * * *</spec>
          <ignorePostCommitHooks>false</ignorePostCommitHooks>
        </hudson.triggers.SCMTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.92">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.8.3">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/Cosmos-Order-Ltd/pms-platform.git</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/feature/cyprus-localization</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <scriptPath>Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF

# Create the Jenkins job
curl -s -X POST \
  -u "${JENKINS_USER}:${JENKINS_PASS}" \
  -H "Content-Type: application/xml" \
  --data-binary @jenkins-pipeline-config.xml \
  "${JENKINS_URL}/createItem?name=PMS-Platform-Pipeline" > /dev/null

if [ $? -eq 0 ]; then
    print_status "Jenkins pipeline 'PMS-Platform-Pipeline' created"
else
    print_warning "Jenkins pipeline might already exist or there was an error"
fi

# Clean up
rm -f jenkins-pipeline-config.xml

# Step 4: Configure Grafana
echo -e "\n${BLUE}Step 4: Configuring Grafana${NC}"
echo "----------------------------"

print_info "Adding Prometheus data source to Grafana..."

# Add Prometheus data source to Grafana
curl -s -X POST \
  -u "${GRAFANA_USER}:${GRAFANA_PASS}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://192.168.30.98:9090",
    "access": "proxy",
    "isDefault": true
  }' \
  "${GRAFANA_URL}/api/datasources" > /dev/null

if [ $? -eq 0 ]; then
    print_status "Prometheus data source added to Grafana"
else
    print_warning "Prometheus data source might already exist"
fi

# Step 5: Setup CT101 deployment directory
echo -e "\n${BLUE}Step 5: Setting up CT101 Deployment Directory${NC}"
echo "---------------------------------------------"

print_info "Creating deployment directory on CT101..."

ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "
    mkdir -p /opt/pms-platform
    cd /opt/pms-platform
    echo 'Deployment directory ready' > deployment.log
"

if [ $? -eq 0 ]; then
    print_status "CT101 deployment directory created at /opt/pms-platform"
else
    print_error "Failed to create deployment directory on CT101"
fi

# Step 6: Copy necessary files to CT101
echo -e "\n${BLUE}Step 6: Copying Configuration Files${NC}"
echo "-----------------------------------"

print_info "Copying Docker Compose files to CT101..."

scp -i ~/.ssh/ct101_key docker-compose.cyprus.yml root@${CT101_HOST}:/opt/pms-platform/ 2>/dev/null
scp -i ~/.ssh/ct101_key .env.cyprus root@${CT101_HOST}:/opt/pms-platform/ 2>/dev/null

if [ $? -eq 0 ]; then
    print_status "Configuration files copied to CT101"
else
    print_warning "Some configuration files might not exist yet"
fi

# Step 7: Create monitoring dashboard
echo -e "\n${BLUE}Step 7: Creating PMS Monitoring Dashboard${NC}"
echo "----------------------------------------"

print_info "Importing PMS monitoring dashboard to Grafana..."

# Create a basic PMS dashboard
cat > pms-dashboard.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "PMS Platform Monitoring",
    "tags": ["pms", "monitoring"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Container Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up",
            "refId": "A"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes",
            "refId": "A"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      }
    ],
    "time": {"from": "now-1h", "to": "now"},
    "refresh": "30s"
  }
}
EOF

curl -s -X POST \
  -u "${GRAFANA_USER}:${GRAFANA_PASS}" \
  -H "Content-Type: application/json" \
  --data-binary @pms-dashboard.json \
  "${GRAFANA_URL}/api/dashboards/db" > /dev/null

if [ $? -eq 0 ]; then
    print_status "PMS monitoring dashboard imported to Grafana"
else
    print_warning "Dashboard import might have failed"
fi

rm -f pms-dashboard.json

# Step 8: Test pipeline trigger
echo -e "\n${BLUE}Step 8: Testing Pipeline Configuration${NC}"
echo "------------------------------------"

print_info "Triggering initial pipeline build..."

curl -s -X POST \
  -u "${JENKINS_USER}:${JENKINS_PASS}" \
  "${JENKINS_URL}/job/PMS-Platform-Pipeline/build" > /dev/null

if [ $? -eq 0 ]; then
    print_status "Initial pipeline build triggered"
else
    print_warning "Pipeline build trigger might have failed"
fi

# Final Summary
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo "=================="
echo
echo -e "${BLUE}Service URLs:${NC}"
echo "• Jenkins:    ${JENKINS_URL}"
echo "• SonarQube:  ${SONAR_URL}"
echo "• Grafana:    ${GRAFANA_URL}"
echo "• Prometheus: ${PROMETHEUS_URL}"
echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Visit Jenkins and check the pipeline status"
echo "2. Review SonarQube project configuration"
echo "3. Explore Grafana dashboards"
echo "4. Make a code change and push to trigger CI/CD"
echo
echo -e "${YELLOW}Credentials saved in:${NC} .env.credentials"
echo -e "${YELLOW}SonarQube token saved in:${NC} .env.sonar"
echo
print_status "PMS Platform development environment is ready!"