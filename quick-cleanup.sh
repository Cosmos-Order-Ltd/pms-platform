#!/bin/bash

# Quick Repository Cleanup Script
# Removes build artifacts and compares with Gitea repositories

set -euo pipefail

# Configuration
GITEA_TOKEN="1577fc065c77a41c297e3473e15138b8b3e896eb"
LOG_FILE="./cleanup.log"
REPORT_FILE="./cleanup_report.md"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Initialize
echo "Quick Repository Cleanup - $(date)" > "$LOG_FILE"
print_status "Starting Quick Repository Cleanup"

# Phase 1: Remove build artifacts
print_status "=== Phase 1: Removing Build Artifacts ==="

# Remove node_modules
NODE_MODULES_COUNT=0
print_status "Removing node_modules directories..."
find . -name "node_modules" -type d 2>/dev/null | while read dir; do
    print_status "Removing: $dir"
    rm -rf "$dir"
    NODE_MODULES_COUNT=$((NODE_MODULES_COUNT + 1))
done

# Remove build directories
BUILD_COUNT=0
for pattern in ".next" "dist" "build" ".turbo" "coverage" ".nyc_output"; do
    find . -name "$pattern" -type d 2>/dev/null | while read dir; do
        print_status "Removing: $dir"
        rm -rf "$dir"
        BUILD_COUNT=$((BUILD_COUNT + 1))
    done
done

# Remove log files
find . -name "*.log" -type f ! -name "cleanup.log" 2>/dev/null | while read file; do
    print_status "Removing: $file"
    rm -f "$file"
done

print_success "Build artifacts removal completed"

# Phase 2: Fetch Gitea repository list
print_status "=== Phase 2: Fetching Gitea Repository List ==="

REPOS_FILE="./gitea_repos.txt"
curl -s -H "Authorization: token $GITEA_TOKEN" \
    "http://192.168.30.98:3000/api/v1/user/repos" | \
    grep -o '"name":"[^"]*"' | cut -d'"' -f4 > "$REPOS_FILE"

REPO_COUNT=$(wc -l < "$REPOS_FILE")
print_status "Found $REPO_COUNT repositories in Gitea"

# Phase 3: Compare and clean duplicates
print_status "=== Phase 3: Removing Duplicate Repositories ==="

REMOVED_COUNT=0
KEPT_COUNT=0

# Process extracted repositories
if [ -d "archive/extracted-repositories" ]; then
    for repo_dir in archive/extracted-repositories/*/; do
        if [ -d "$repo_dir" ]; then
            repo_name=$(basename "$repo_dir")
            if grep -q "^$repo_name$" "$REPOS_FILE"; then
                print_status "Removing duplicate: $repo_dir (exists in Gitea)"
                rm -rf "$repo_dir"
                REMOVED_COUNT=$((REMOVED_COUNT + 1))
            else
                print_warning "Keeping local-only: $repo_name"
                KEPT_COUNT=$((KEPT_COUNT + 1))
            fi
        fi
    done
fi

# Process separated repositories
if [ -d "archive/separated-repos" ]; then
    for repo_dir in archive/separated-repos/*/; do
        if [ -d "$repo_dir" ]; then
            repo_name=$(basename "$repo_dir")
            if grep -q "^$repo_name$" "$REPOS_FILE"; then
                print_status "Removing duplicate: $repo_dir (exists in Gitea)"
                rm -rf "$repo_dir"
                REMOVED_COUNT=$((REMOVED_COUNT + 1))
            else
                print_warning "Keeping local-only: $repo_name"
                KEPT_COUNT=$((KEPT_COUNT + 1))
            fi
        fi
    done
fi

print_success "Repository deduplication completed"

# Phase 4: Generate report
print_status "=== Phase 4: Generating Report ==="

cat > "$REPORT_FILE" << EOF
# Repository Cleanup Report

**Generated:** $(date)
**Script:** Quick Cleanup

## Cleanup Results

### Build Artifacts Removed
- All \`node_modules\` directories removed
- All build directories removed (\`.next\`, \`dist\`, \`build\`, etc.)
- Log files cleaned up

### Repository Deduplication
- **Duplicate repositories removed:** $REMOVED_COUNT
- **Local-only repositories preserved:** $KEPT_COUNT
- **Total Gitea repositories:** $REPO_COUNT

## Gitea Repository List

The following $REPO_COUNT repositories are available in Gitea:

EOF

# Add repository list
while read repo; do
    echo "- $repo" >> "$REPORT_FILE"
done < "$REPOS_FILE"

cat >> "$REPORT_FILE" << EOF

## Summary

### What was removed:
1. All \`node_modules\` directories (build dependencies)
2. All Next.js cache and build directories
3. All duplicate local repositories that exist in Gitea

### What was preserved:
1. All unique local-only repositories
2. Core platform source code
3. Configuration files and documentation

### Source of Truth:
- **Gitea repositories** serve as the authoritative source
- **Local duplicates** have been removed to eliminate redundancy
- **Unique local content** has been preserved

## Next Steps

1. **Repository Access:** All repositories are available at \`http://192.168.30.98:3000/charilaouc/\`
2. **Development:** Clone repositories from Gitea for development work
3. **Build Process:** Run \`npm install\` as needed for development
4. **Maintenance:** Consider automated cleanup scripts for regular maintenance

---

*Cleanup completed successfully. Repository is now optimized and deduplicated.*
EOF

# Cleanup temporary files
rm -f "$REPOS_FILE"

print_success "Cleanup completed successfully!"
print_status "Report generated: $REPORT_FILE"
print_status "Log available: $LOG_FILE"

# Show final summary
echo ""
echo "=== CLEANUP SUMMARY ==="
echo "Duplicate repositories removed: $REMOVED_COUNT"
echo "Local-only repositories kept: $KEPT_COUNT"
echo "Gitea repositories available: $REPO_COUNT"
echo "Report: $REPORT_FILE"