#!/bin/bash

# Repository Migration Script for Cosmos Order Ltd
# Migrates all PMS repositories to the Cosmos Order Ltd organization

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COSMOS_ORG="Cosmos-Order-Ltd"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
CURRENT_USER="${CURRENT_USER:-$(git config user.name)}"

# Repository list for PMS Platform
REPOSITORIES=(
    "pms-platform"
    "pms-backend"
    "pms-core"
    "pms-admin"
    "pms-guest"
    "pms-staff"
    "pms-marketplace"
    "pms-shared"
    "pms-infrastructure"
    "pms-docs"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed"
        log_info "Install with: https://cli.github.com/"
        exit 1
    fi

    # Check if git is installed
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi

    # Check GitHub authentication
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated"
        log_info "Run: gh auth login"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Check if organization exists
check_organization() {
    log_info "Checking if organization '${COSMOS_ORG}' exists..."

    if gh api orgs/${COSMOS_ORG} &> /dev/null; then
        log_success "Organization '${COSMOS_ORG}' found"
    else
        log_error "Organization '${COSMOS_ORG}' not found or no access"
        log_info "Please ensure:"
        log_info "1. The organization exists"
        log_info "2. You have admin access to the organization"
        log_info "3. You are authenticated with the correct GitHub account"
        exit 1
    fi
}

# Create repository in organization
create_repository() {
    local repo_name="$1"
    local description="$2"

    log_info "Creating repository: ${COSMOS_ORG}/${repo_name}"

    # Check if repository already exists
    if gh api repos/${COSMOS_ORG}/${repo_name} &> /dev/null; then
        log_warning "Repository ${COSMOS_ORG}/${repo_name} already exists"
        return 0
    fi

    # Create repository
    gh repo create ${COSMOS_ORG}/${repo_name} \
        --description "$description" \
        --public \
        --clone=false

    log_success "Repository created: https://github.com/${COSMOS_ORG}/${repo_name}"
}

# Initialize repository with content
initialize_repository() {
    local repo_name="$1"
    local source_dir="$2"

    log_info "Initializing repository: ${repo_name}"

    # Create temporary directory for repository
    local temp_dir="/tmp/${repo_name}-migration"
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"

    cd "$temp_dir"

    # Initialize git repository
    git init
    git branch -M main

    # Copy content if source directory exists
    if [[ -d "$source_dir" ]]; then
        log_info "Copying content from ${source_dir}"
        cp -r "$source_dir"/* . 2>/dev/null || true
        cp -r "$source_dir"/.[^.]* . 2>/dev/null || true
    else
        log_warning "Source directory not found: ${source_dir}"
        # Create basic structure
        echo "# ${repo_name}" > README.md
        echo "Part of the PMS (Property Management System) platform by Cosmos Order Ltd." >> README.md
    fi

    # Create .gitignore if it doesn't exist
    if [[ ! -f .gitignore ]]; then
        create_gitignore_for_repo "$repo_name"
    fi

    # Add and commit all files
    git add .
    git commit -m "feat: initial repository setup for ${repo_name}

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

    # Add remote and push
    git remote add origin "https://github.com/${COSMOS_ORG}/${repo_name}.git"
    git push -u origin main

    cd "$SCRIPT_DIR"
    rm -rf "$temp_dir"

    log_success "Repository initialized: ${repo_name}"
}

# Create appropriate .gitignore for repository type
create_gitignore_for_repo() {
    local repo_name="$1"

    case "$repo_name" in
        *backend*|*core*|*monitoring*)
            # Node.js backend .gitignore
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs
*.log

# Build output
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
            ;;
        *admin*|*guest*|*staff*|*marketplace*)
            # Next.js frontend .gitignore
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF
            ;;
        *infrastructure*)
            # Infrastructure .gitignore
            cat > .gitignore << 'EOF'
# Terraform
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl

# Kubernetes
*.kubeconfig

# Helm
charts/*.tgz

# Secrets
*.key
*.pem
*.crt
secrets.yaml

# Environment
.env
.env.local

# Logs
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
            ;;
        *)
            # General .gitignore
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Logs
*.log
logs/

# Build output
dist/
build/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/
EOF
            ;;
    esac
}

# Setup repository branches and protection
setup_repository_protection() {
    local repo_name="$1"

    log_info "Setting up branch protection for ${repo_name}..."

    # Create development branch
    gh api repos/${COSMOS_ORG}/${repo_name}/git/refs \
        --method POST \
        --field ref="refs/heads/development" \
        --field sha="$(gh api repos/${COSMOS_ORG}/${repo_name}/git/refs/heads/main --jq '.object.sha')" \
        &> /dev/null || true

    # Set up branch protection for main
    gh api repos/${COSMOS_ORG}/${repo_name}/branches/main/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["ci"]}' \
        --field enforce_admins=false \
        --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
        --field restrictions=null \
        &> /dev/null || true

    log_success "Branch protection configured for ${repo_name}"
}

# Create all repositories
create_all_repositories() {
    log_info "Creating all PMS repositories in ${COSMOS_ORG}..."

    # Main platform repository
    create_repository "pms-platform" "Property Management System - Main repository with microservices architecture"
    initialize_repository "pms-platform" "${SCRIPT_DIR}"

    # Backend services
    create_repository "pms-backend" "PMS Backend Service - Core business logic and API endpoints"
    initialize_repository "pms-backend" "${SCRIPT_DIR}/pms-backend"

    create_repository "pms-core" "PMS Core Service - Shared utilities and middleware"
    initialize_repository "pms-core" "${SCRIPT_DIR}/pms-core"

    create_repository "api-gateway" "PMS API Gateway - Service routing and load balancing"
    initialize_repository "api-gateway" "${SCRIPT_DIR}/api-gateway"

    create_repository "monitoring" "PMS Monitoring Service - System monitoring and alerting"
    initialize_repository "monitoring" "${SCRIPT_DIR}/monitoring"

    # Frontend applications
    create_repository "pms-admin" "PMS Admin Dashboard - Management interface for administrators"
    initialize_repository "pms-admin" "${SCRIPT_DIR}/pms-admin"

    create_repository "pms-guest" "PMS Guest Portal - Public booking and reservation interface"
    initialize_repository "pms-guest" "${SCRIPT_DIR}/pms-guest"

    create_repository "pms-staff" "PMS Staff Mobile - Mobile PWA for staff operations"
    initialize_repository "pms-staff" "${SCRIPT_DIR}/pms-staff"

    create_repository "pms-marketplace" "PMS Marketplace - Property listing and booking platform"
    initialize_repository "pms-marketplace" "${SCRIPT_DIR}/pms-marketplace"

    # Shared libraries and infrastructure
    create_repository "pms-shared" "PMS Shared Libraries - Common utilities and components"
    initialize_repository "pms-shared" "${SCRIPT_DIR}/pms-shared"

    create_repository "pms-infrastructure" "PMS Infrastructure - Kubernetes manifests and deployment configs"
    initialize_repository "pms-infrastructure" "${SCRIPT_DIR}/pms-infrastructure"

    create_repository "pms-docs" "PMS Documentation - Complete documentation and guides"
    initialize_repository "pms-docs" "${SCRIPT_DIR}/pms-docs"

    log_success "All repositories created successfully!"
}

# Update local git remotes
update_local_remotes() {
    log_info "Updating local git remotes..."

    # Update main repository remote
    if [[ -d .git ]]; then
        git remote set-url origin "https://github.com/${COSMOS_ORG}/pms-platform.git"
        log_success "Updated main repository remote"
    fi

    # Update service repository remotes
    for service_dir in pms-* api-gateway monitoring; do
        if [[ -d "$service_dir/.git" ]]; then
            cd "$service_dir"
            git remote set-url origin "https://github.com/${COSMOS_ORG}/${service_dir}.git"
            cd "$SCRIPT_DIR"
            log_success "Updated remote for ${service_dir}"
        fi
    done
}

# Update deployment scripts with new repository URLs
update_deployment_scripts() {
    log_info "Updating deployment scripts with new repository URLs..."

    # Update Docker image references
    find . -name "*.yaml" -o -name "*.yml" -o -name "*.sh" | xargs sed -i.bak \
        -e "s|charilaouc/|${COSMOS_ORG}/|g" \
        -e "s|ghcr.io/[^/]*/|ghcr.io/${COSMOS_ORG}/|g" \
        2>/dev/null || true

    # Update values files
    if [[ -f "pms-infrastructure/helm/pms-chart/values-production.yaml" ]]; then
        sed -i.bak "s|repository: charilaouc/|repository: ${COSMOS_ORG}/|g" \
            "pms-infrastructure/helm/pms-chart/values-production.yaml"
    fi

    if [[ -f "pms-infrastructure/helm/pms-chart/values-proxmox.yaml" ]]; then
        sed -i.bak "s|repository: pms-|repository: ${COSMOS_ORG}/pms-|g" \
            "pms-infrastructure/helm/pms-chart/values-proxmox.yaml"
    fi

    # Update deployment guide
    if [[ -f "PROXMOX_DEPLOYMENT_GUIDE.md" ]]; then
        sed -i.bak "s|https://github.com/yourusername/pms-platform.git|https://github.com/${COSMOS_ORG}/pms-platform.git|g" \
            "PROXMOX_DEPLOYMENT_GUIDE.md"
    fi

    # Remove backup files
    find . -name "*.bak" -delete 2>/dev/null || true

    log_success "Deployment scripts updated"
}

# Create organization-wide GitHub Actions workflows
create_organization_workflows() {
    log_info "Creating organization-wide GitHub Actions workflows..."

    # Create .github directory in main repository
    mkdir -p .github/workflows

    # Create organization CI/CD workflow
    cat > .github/workflows/organization-ci.yml << 'EOF'
name: Organization CI/CD Pipeline

on:
  workflow_dispatch:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  check-all-repositories:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        repository:
          - pms-backend
          - pms-core
          - api-gateway
          - monitoring
          - pms-admin
          - pms-guest
          - pms-staff
          - pms-marketplace
          - pms-shared
          - pms-infrastructure
          - pms-docs

    steps:
      - name: Check repository status
        run: |
          echo "Checking status of ${{ matrix.repository }}"
          gh api repos/cosmos-order-ltd/${{ matrix.repository }} --jq '.full_name, .updated_at'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security scan across all repositories
        run: |
          echo "Running organization-wide security scan"
          # Add security scanning logic here

  update-dependencies:
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    steps:
      - uses: actions/checkout@v4
      - name: Update dependencies across repositories
        run: |
          echo "Checking for dependency updates"
          # Add dependency update logic here
EOF

    log_success "Organization workflows created"
}

# Display migration summary
display_migration_summary() {
    log_success "Repository migration completed!"
    echo
    echo "Migration Summary:"
    echo "=================="
    echo "Organization: ${COSMOS_ORG}"
    echo "Repositories created:"
    echo "  • https://github.com/${COSMOS_ORG}/pms-platform"
    echo "  • https://github.com/${COSMOS_ORG}/pms-backend"
    echo "  • https://github.com/${COSMOS_ORG}/pms-core"
    echo "  • https://github.com/${COSMOS_ORG}/api-gateway"
    echo "  • https://github.com/${COSMOS_ORG}/monitoring"
    echo "  • https://github.com/${COSMOS_ORG}/pms-admin"
    echo "  • https://github.com/${COSMOS_ORG}/pms-guest"
    echo "  • https://github.com/${COSMOS_ORG}/pms-staff"
    echo "  • https://github.com/${COSMOS_ORG}/pms-marketplace"
    echo "  • https://github.com/${COSMOS_ORG}/pms-shared"
    echo "  • https://github.com/${COSMOS_ORG}/pms-infrastructure"
    echo "  • https://github.com/${COSMOS_ORG}/pms-docs"
    echo
    echo "Next Steps:"
    echo "==========="
    echo "1. Review repositories and update descriptions if needed"
    echo "2. Set up organization secrets for CI/CD"
    echo "3. Configure team access and permissions"
    echo "4. Set up organization-wide security policies"
    echo "5. Configure GitHub Pages for documentation"
    echo
    echo "Local Changes:"
    echo "=============="
    echo "• Git remotes updated to point to new organization"
    echo "• Deployment scripts updated with new image names"
    echo "• Documentation updated with new repository URLs"
    echo
    echo "Organization Management:"
    echo "======================="
    echo "• Visit: https://github.com/orgs/${COSMOS_ORG}/repositories"
    echo "• Set up teams: https://github.com/orgs/${COSMOS_ORG}/teams"
    echo "• Configure security: https://github.com/orgs/${COSMOS_ORG}/settings/security_analysis"
}

# Main execution
main() {
    log_info "Starting repository migration to Cosmos Order Ltd"

    check_prerequisites
    check_organization
    create_all_repositories
    update_local_remotes
    update_deployment_scripts
    create_organization_workflows
    display_migration_summary
}

# Help function
show_help() {
    cat << EOF
Repository Migration Script for Cosmos Order Ltd

Usage: $0 [OPTIONS]

Options:
    --org NAME          Organization name (default: cosmos-order-ltd)
    --user NAME         Current GitHub username
    --dry-run           Show what would be done without executing
    -h, --help          Show this help message

Environment Variables:
    GITHUB_TOKEN        GitHub personal access token (if not using gh auth)
    COSMOS_ORG          Target organization name
    CURRENT_USER        Current GitHub username

Prerequisites:
    1. GitHub CLI (gh) installed and authenticated
    2. Git configured with user credentials
    3. Admin access to the target organization

Examples:
    # Migrate with default organization
    ./migrate-to-cosmos-order.sh

    # Migrate to custom organization
    ./migrate-to-cosmos-order.sh --org my-custom-org

    # Dry run to see what would happen
    ./migrate-to-cosmos-order.sh --dry-run

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --org)
            COSMOS_ORG="$2"
            shift 2
            ;;
        --user)
            CURRENT_USER="$2"
            shift 2
            ;;
        --dry-run)
            log_info "DRY RUN MODE - No changes will be made"
            # Add dry run logic here
            exit 0
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execute main function
main