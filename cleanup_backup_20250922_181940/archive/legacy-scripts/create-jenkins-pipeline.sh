#!/bin/bash

# 🔧 Create Jenkins Pipeline for PMS Platform

set -e

JENKINS_URL="http://192.168.30.98:8090"
JENKINS_USER="admin"
JENKINS_PASS="pms-platform-admin"

echo "🔧 Creating Jenkins Pipeline for PMS Platform"
echo "=============================================="

# Get Jenkins crumb for CSRF protection
echo "Getting Jenkins crumb..."
CRUMB=$(curl -s -u "${JENKINS_USER}:${JENKINS_PASS}" "${JENKINS_URL}/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)")

if [ -z "$CRUMB" ]; then
    echo "Warning: Could not get Jenkins crumb, proceeding without CSRF protection"
    CRUMB_HEADER=""
else
    echo "Got Jenkins crumb: $CRUMB"
    CRUMB_HEADER="-H $CRUMB"
fi

# Create pipeline configuration
cat > pipeline-config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job">
  <actions/>
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
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps">
    <scm class="hudson.plugins.git.GitSCM" plugin="git">
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
      <submoduleCfg class="empty-list"/>
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
echo "Creating Jenkins pipeline..."

RESPONSE=$(curl -s -w "%{http_code}" -X POST \
  -u "${JENKINS_USER}:${JENKINS_PASS}" \
  $CRUMB_HEADER \
  -H "Content-Type: application/xml" \
  --data-binary @pipeline-config.xml \
  "${JENKINS_URL}/createItem?name=PMS-Platform-Pipeline")

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Jenkins pipeline 'PMS-Platform-Pipeline' created successfully!"
elif [ "$HTTP_CODE" == "400" ]; then
    echo "⚠️  Jenkins pipeline might already exist or there's a configuration error"
    echo "Response: $BODY"
else
    echo "❌ Failed to create Jenkins pipeline (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

# Clean up
rm -f pipeline-config.xml

# Try to trigger the first build
echo
echo "Triggering initial build..."

BUILD_RESPONSE=$(curl -s -w "%{http_code}" -X POST \
  -u "${JENKINS_USER}:${JENKINS_PASS}" \
  $CRUMB_HEADER \
  "${JENKINS_URL}/job/PMS-Platform-Pipeline/build")

BUILD_HTTP_CODE="${BUILD_RESPONSE: -3}"

if [ "$BUILD_HTTP_CODE" == "201" ]; then
    echo "✅ Initial build triggered successfully!"
    echo "🌐 View pipeline at: ${JENKINS_URL}/job/PMS-Platform-Pipeline/"
elif [ "$BUILD_HTTP_CODE" == "404" ]; then
    echo "⚠️  Pipeline not found - it may not have been created"
else
    echo "⚠️  Build trigger response: HTTP $BUILD_HTTP_CODE"
fi

echo
echo "🎯 Next Steps:"
echo "1. Visit Jenkins: ${JENKINS_URL}"
echo "2. Login with: admin / pms-platform-admin"
echo "3. Check the 'PMS-Platform-Pipeline' job"
echo "4. Monitor the build progress"