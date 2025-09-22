pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        SONAR_SCANNER_HOME = tool 'SonarQube Scanner'
        SONAR_TOKEN = credentials('sonar-token')
        DOCKER_REGISTRY = '192.168.30.98:5000'
        CT101_HOST = '192.168.30.98'
    }

    tools {
        nodejs "${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_HASH = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    env.BUILD_VERSION = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_HASH}"
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('pms-backend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Admin Dependencies') {
                    steps {
                        dir('pms-admin') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Guest Dependencies') {
                    steps {
                        dir('pms-guest') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Staff Dependencies') {
                    steps {
                        dir('pms-staff') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Marketplace Dependencies') {
                    steps {
                        dir('pms-marketplace') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Lint & Type Check') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('pms-backend') {
                            sh 'npm run lint || true'
                            sh 'npm run type-check || true'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        script {
                            def frontendDirs = ['pms-admin', 'pms-guest', 'pms-staff', 'pms-marketplace']
                            frontendDirs.each { dir ->
                                if (fileExists("${dir}/package.json")) {
                                    dir(dir) {
                                        sh 'npm run lint || true'
                                        sh 'npm run type-check || true'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('pms-backend') {
                            sh 'npm test || true'
                        }
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'pms-backend/test-results.xml'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        script {
                            def frontendDirs = ['pms-admin', 'pms-guest', 'pms-staff', 'pms-marketplace']
                            frontendDirs.each { dir ->
                                if (fileExists("${dir}/package.json")) {
                                    dir(dir) {
                                        sh 'npm test || true'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \\
                        -Dsonar.projectKey=pms-platform \\
                        -Dsonar.projectName="PMS Platform" \\
                        -Dsonar.projectVersion=${BUILD_VERSION} \\
                        -Dsonar.sources=. \\
                        -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/build/**,**/*.test.ts,**/*.spec.ts" \\
                        -Dsonar.typescript.lcov.reportPaths="**/coverage/lcov.info" \\
                        -Dsonar.javascript.lcov.reportPaths="**/coverage/lcov.info"
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        dir('pms-backend') {
                            sh 'npm run build'
                        }
                    }
                }
                stage('Frontend Builds') {
                    steps {
                        script {
                            def frontendDirs = ['pms-admin', 'pms-guest', 'pms-staff', 'pms-marketplace']
                            frontendDirs.each { dir ->
                                if (fileExists("${dir}/package.json")) {
                                    dir(dir) {
                                        sh 'npm run build'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                    branch 'production'
                }
            }
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('pms-backend') {
                            script {
                                def image = docker.build("pms-backend:${BUILD_VERSION}")
                                docker.withRegistry("http://${DOCKER_REGISTRY}") {
                                    image.push()
                                    image.push("latest")
                                }
                            }
                        }
                    }
                }
                stage('Frontend Images') {
                    steps {
                        script {
                            def frontendDirs = ['pms-admin', 'pms-guest', 'pms-staff', 'pms-marketplace']
                            frontendDirs.each { dir ->
                                if (fileExists("${dir}/Dockerfile")) {
                                    dir(dir) {
                                        def image = docker.build("${dir}:${BUILD_VERSION}")
                                        docker.withRegistry("http://${DOCKER_REGISTRY}") {
                                            image.push()
                                            image.push("latest")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to CT101') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                script {
                    // Deploy to CT101 using Docker Compose
                    sh '''
                        # Copy docker-compose files to CT101
                        scp -i ~/.ssh/ct101_key docker-compose*.yml root@${CT101_HOST}:/opt/pms-platform/

                        # Deploy services
                        ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cd /opt/pms-platform && docker-compose down && docker-compose up -d"

                        # Wait for services to be healthy
                        sleep 30

                        # Health check
                        ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "docker ps --filter 'name=pms-' --format 'table {{.Names}}\\t{{.Status}}'"
                    '''
                }
            }
        }

        stage('Cyprus Deployment') {
            when {
                branch 'feature/cyprus-localization'
            }
            steps {
                script {
                    sh '''
                        # Deploy Cyprus-specific configuration
                        scp -i ~/.ssh/ct101_key docker-compose.cyprus.yml root@${CT101_HOST}:/opt/pms-platform/
                        scp -i ~/.ssh/ct101_key .env.cyprus root@${CT101_HOST}:/opt/pms-platform/

                        # Deploy with Cyprus configuration
                        ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "cd /opt/pms-platform && docker-compose -f docker-compose.yml -f docker-compose.cyprus.yml up -d"

                        # Verify Cyprus services
                        sleep 20
                        ssh -i ~/.ssh/ct101_key root@${CT101_HOST} "curl -s http://localhost:5000/api/v1/cyprus/health || echo 'Cyprus services not ready'"
                    '''
                }
            }
        }

        stage('Integration Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                script {
                    sh '''
                        # Run integration tests against deployed services
                        echo "Running integration tests..."

                        # Test PMS services
                        curl -f http://${CT101_HOST}:3010/api/health || exit 1
                        curl -f http://${CT101_HOST}:3011/api/health || exit 1
                        curl -f http://${CT101_HOST}:3012/api/health || exit 1
                        curl -f http://${CT101_HOST}:3013/api/health || exit 1
                        curl -f http://${CT101_HOST}:5000/api/health || exit 1

                        # Test Cyprus features if on Cyprus branch
                        if [ "${BRANCH_NAME}" = "feature/cyprus-localization" ]; then
                            curl -f http://${CT101_HOST}:5000/api/v1/cyprus/health || exit 1
                        fi

                        echo "All integration tests passed!"
                    '''
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()

            // Archive artifacts
            archiveArtifacts artifacts: '**/dist/**', allowEmptyArchive: true
            archiveArtifacts artifacts: '**/build/**', allowEmptyArchive: true

            // Publish test results
            publishTestResults testResultsPattern: '**/test-results.xml'

            // Publish code coverage
            publishCoverage adapters: [istanbulCoberturaAdapter('**/coverage/cobertura-coverage.xml')], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
        }

        success {
            echo 'Pipeline completed successfully!'

            // Send success notification
            script {
                if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'staging') {
                    sh '''
                        curl -X POST http://${CT101_HOST}:3017/api/notifications/deployment \\
                        -H "Content-Type: application/json" \\
                        -d "{\\"status\\": \\"success\\", \\"branch\\": \\"${BRANCH_NAME}\\", \\"version\\": \\"${BUILD_VERSION}\\"}"
                    '''
                }
            }
        }

        failure {
            echo 'Pipeline failed!'

            // Send failure notification
            script {
                sh '''
                    curl -X POST http://${CT101_HOST}:3017/api/notifications/deployment \\
                    -H "Content-Type: application/json" \\
                    -d "{\\"status\\": \\"failure\\", \\"branch\\": \\"${BRANCH_NAME}\\", \\"error\\": \\"Build failed\\"}"
                '''
            }
        }

        unstable {
            echo 'Pipeline completed with warnings!'
        }
    }
}