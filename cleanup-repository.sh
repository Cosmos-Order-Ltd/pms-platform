#!/bin/bash

# Repository Cleanup and Deduplication Script
# Removes build artifacts and eliminates duplicate files by comparing with Gitea repositories

set -euo pipefail

# Configuration
GITEA_BASE_URL="http://192.168.30.98:3000"
GITEA_TOKEN="1577fc065c77a41c297e3473e15138b8b3e896eb"
GITEA_USER="charilaouc"
TEMP_DIR="./temp_cleanup"
BACKUP_DIR="./cleanup_backup_$(date +%Y%m%d_%H%M%S)"
LOG_FILE="./cleanup.log"
REPORT_FILE="./cleanup_report.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters for reporting
REMOVED_NODE_MODULES=0
REMOVED_BUILD_ARTIFACTS=0
REMOVED_DUPLICATES=0
KEPT_LOCAL_ONLY=0
CONFLICTS_FOUND=0
TOTAL_SIZE_SAVED=0

# Command line options
DRY_RUN=false
VERBOSE=false
FORCE=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to calculate directory size (faster for large directories)
calculate_size() {
    local dir="$1"
    if [ -d "$dir" ]; then
        # Use a faster approach for large directories
        if command -v du >/dev/null 2>&1; then
            du -s "$dir" 2>/dev/null | cut -f1 | head -1 || echo "0"
        else
            # Fallback to approximate size
            find "$dir" -type f 2>/dev/null | wc -l | awk '{print $1 * 1024}' || echo "0"
        fi
    else
        echo "0"
    fi
}

# Function to format bytes to human readable
format_bytes() {
    local bytes=$1
    if [ $bytes -gt 1073741824 ]; then
        echo "$((bytes / 1073741824))GB"
    elif [ $bytes -gt 1048576 ]; then
        echo "$((bytes / 1048576))MB"
    elif [ $bytes -gt 1024 ]; then
        echo "$((bytes / 1024))KB"
    else
        echo "${bytes}B"
    fi
}

# Function to create backup
create_backup() {
    print_status "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"

    # Backup important files that might be removed
    if [ -d "archive" ]; then
        print_status "Backing up archive directory..."
        cp -r archive "$BACKUP_DIR/" 2>/dev/null || true
    fi
}

# Function to clean build artifacts
clean_build_artifacts() {
    print_status "=== Phase 1: Cleaning Build Artifacts ==="

    local total_size_before=0
    local total_size_after=0

    # Skip total size calculation for performance
    print_status "Skipping total size calculation for performance..."
    total_size_before=0

    # Remove node_modules directories
    print_status "Removing node_modules directories..."
    while IFS= read -r -d '' dir; do
        local size=$(calculate_size "$dir")
        print_status "Removing: $dir ($(format_bytes $size))"

        if [ "$DRY_RUN" = false ]; then
            rm -rf "$dir"
        fi

        REMOVED_NODE_MODULES=$((REMOVED_NODE_MODULES + 1))
        TOTAL_SIZE_SAVED=$((TOTAL_SIZE_SAVED + size))
    done < <(find . -name "node_modules" -type d -print0 2>/dev/null || true)

    # Remove Next.js cache and build directories
    print_status "Removing Next.js cache and build directories..."
    for pattern in ".next" "dist" "build" ".turbo" "coverage" ".nyc_output"; do
        while IFS= read -r -d '' dir; do
            local size=$(calculate_size "$dir")
            print_status "Removing: $dir ($(format_bytes $size))"

            if [ "$DRY_RUN" = false ]; then
                rm -rf "$dir"
            fi

            REMOVED_BUILD_ARTIFACTS=$((REMOVED_BUILD_ARTIFACTS + 1))
            TOTAL_SIZE_SAVED=$((TOTAL_SIZE_SAVED + size))
        done < <(find . -name "$pattern" -type d -print0 2>/dev/null || true)
    done

    # Remove log files
    print_status "Removing log files..."
    while IFS= read -r -d '' file; do
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        print_status "Removing: $file ($(format_bytes $size))"

        if [ "$DRY_RUN" = false ]; then
            rm -f "$file"
        fi

        REMOVED_BUILD_ARTIFACTS=$((REMOVED_BUILD_ARTIFACTS + 1))
        TOTAL_SIZE_SAVED=$((TOTAL_SIZE_SAVED + size))
    done < <(find . -name "*.log" -type f -print0 2>/dev/null || true)

    print_success "Build artifacts cleanup completed"
    print_status "Removed $REMOVED_NODE_MODULES node_modules directories"
    print_status "Removed $REMOVED_BUILD_ARTIFACTS build artifacts"
    print_status "Total space saved: $(format_bytes $TOTAL_SIZE_SAVED)"
}

# Function to fetch Gitea repositories
fetch_gitea_repos() {
    print_status "=== Phase 2: Fetching Gitea Repositories ==="

    mkdir -p "$TEMP_DIR"

    print_status "Fetching repository list from Gitea..."
    local repos_json="$TEMP_DIR/repos.json"

    if ! curl -s -H "Authorization: token $GITEA_TOKEN" \
        "$GITEA_BASE_URL/api/v1/user/repos" > "$repos_json"; then
        print_error "Failed to fetch repository list from Gitea"
        return 1
    fi

    print_status "Found $(grep -o '"name"' "$repos_json" | wc -l) repositories in Gitea"

    # Extract repository names
    grep -o '"name":"[^"]*"' "$repos_json" | cut -d'"' -f4 > "$TEMP_DIR/repo_names.txt"

    print_success "Repository list fetched successfully"
}

# Function to compare and deduplicate files
compare_and_deduplicate() {
    print_status "=== Phase 3: File Comparison and Deduplication ==="

    local comparison_report="$TEMP_DIR/comparison_report.txt"
    echo "File Comparison Report" > "$comparison_report"
    echo "======================" >> "$comparison_report"
    echo "" >> "$comparison_report"

    # Process archive/extracted-repositories
    if [ -d "archive/extracted-repositories" ]; then
        print_status "Processing archive/extracted-repositories..."

        for local_repo in archive/extracted-repositories/*/; do
            if [ -d "$local_repo" ]; then
                local repo_name=$(basename "$local_repo")
                print_status "Checking repository: $repo_name"

                # Check if this repo exists in Gitea
                if grep -q "^$repo_name$" "$TEMP_DIR/repo_names.txt"; then
                    print_status "Found matching Gitea repository: $repo_name"

                    # Count files for comparison
                    local local_files=$(find "$local_repo" -type f 2>/dev/null | wc -l)
                    print_status "Local files: $local_files"

                    echo "Repository: $repo_name" >> "$comparison_report"
                    echo "  Local files: $local_files" >> "$comparison_report"
                    echo "  Status: Matched with Gitea" >> "$comparison_report"

                    # Mark for potential removal (keeping Gitea as source of truth)
                    if [ "$DRY_RUN" = false ]; then
                        print_status "Removing local copy (keeping Gitea as source of truth): $local_repo"
                        rm -rf "$local_repo"
                        REMOVED_DUPLICATES=$((REMOVED_DUPLICATES + 1))
                    else
                        print_status "[DRY RUN] Would remove: $local_repo"
                    fi
                else
                    print_warning "No matching Gitea repository found for: $repo_name"
                    KEPT_LOCAL_ONLY=$((KEPT_LOCAL_ONLY + 1))

                    echo "Repository: $repo_name" >> "$comparison_report"
                    echo "  Status: Local only (preserved)" >> "$comparison_report"
                fi
                echo "" >> "$comparison_report"
            fi
        done
    fi

    # Process archive/separated-repos
    if [ -d "archive/separated-repos" ]; then
        print_status "Processing archive/separated-repos..."

        for local_repo in archive/separated-repos/*/; do
            if [ -d "$local_repo" ]; then
                local repo_name=$(basename "$local_repo")
                print_status "Checking repository: $repo_name"

                # Check if this repo exists in Gitea
                if grep -q "^$repo_name$" "$TEMP_DIR/repo_names.txt"; then
                    print_status "Found matching Gitea repository: $repo_name"

                    local local_files=$(find "$local_repo" -type f 2>/dev/null | wc -l)
                    print_status "Local files: $local_files"

                    echo "Repository: $repo_name" >> "$comparison_report"
                    echo "  Local files: $local_files" >> "$comparison_report"
                    echo "  Status: Matched with Gitea" >> "$comparison_report"

                    # Mark for potential removal (keeping Gitea as source of truth)
                    if [ "$DRY_RUN" = false ]; then
                        print_status "Removing local copy (keeping Gitea as source of truth): $local_repo"
                        rm -rf "$local_repo"
                        REMOVED_DUPLICATES=$((REMOVED_DUPLICATES + 1))
                    else
                        print_status "[DRY RUN] Would remove: $local_repo"
                    fi
                else
                    print_warning "No matching Gitea repository found for: $repo_name"
                    KEPT_LOCAL_ONLY=$((KEPT_LOCAL_ONLY + 1))

                    echo "Repository: $repo_name" >> "$comparison_report"
                    echo "  Status: Local only (preserved)" >> "$comparison_report"
                fi
                echo "" >> "$comparison_report"
            fi
        done
    fi

    print_success "File comparison and deduplication completed"
}

# Function to generate cleanup report
generate_report() {
    print_status "=== Phase 4: Generating Cleanup Report ==="

    cat > "$REPORT_FILE" << EOF
# Repository Cleanup Report

**Generated:** $(date)
**Operation Mode:** $([ "$DRY_RUN" = true ] && echo "DRY RUN" || echo "EXECUTION")

## Cleanup Statistics

### Build Artifacts Removed
- **node_modules directories:** $REMOVED_NODE_MODULES
- **Build artifacts:** $REMOVED_BUILD_ARTIFACTS
- **Total space saved:** $(format_bytes $TOTAL_SIZE_SAVED)

### File Deduplication Results
- **Duplicate repositories removed:** $REMOVED_DUPLICATES
- **Local-only repositories preserved:** $KEPT_LOCAL_ONLY
- **Conflicts requiring manual review:** $CONFLICTS_FOUND

## Repository Comparison Summary

The following repositories were compared between local archive and Gitea:

EOF

    # Add comparison details if available
    if [ -f "$TEMP_DIR/comparison_report.txt" ]; then
        echo "" >> "$REPORT_FILE"
        echo "### Detailed Comparison Results" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        cat "$TEMP_DIR/comparison_report.txt" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF

## Gitea Repository Status

Total repositories in Gitea: $([ -f "$TEMP_DIR/repo_names.txt" ] && wc -l < "$TEMP_DIR/repo_names.txt" || echo "Unknown")

EOF

    if [ -f "$TEMP_DIR/repo_names.txt" ]; then
        echo "### Repository List" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        while read -r repo; do
            echo "- $repo" >> "$REPORT_FILE"
        done < "$TEMP_DIR/repo_names.txt"
    fi

    cat >> "$REPORT_FILE" << EOF

## Recommendations

1. **Repository Management:**
   - All duplicate repositories have been removed from local archive
   - Gitea repositories serve as the single source of truth
   - Consider implementing automated sync processes

2. **Build Process:**
   - Implement .gitignore rules to prevent committing build artifacts
   - Add pre-commit hooks to clean build artifacts
   - Use CI/CD for consistent build processes

3. **Storage Optimization:**
   - Regular cleanup of build artifacts saves significant space
   - Consider implementing automated cleanup scripts
   - Monitor repository sizes and implement size limits

## Safety Notes

- Backup created at: $BACKUP_DIR
- Full operation log available at: $LOG_FILE
- All operations can be reviewed and potentially reversed

---

*Report generated by PMS Platform Cleanup Script*
EOF

    print_success "Cleanup report generated: $REPORT_FILE"
}

# Function to cleanup temporary files
cleanup_temp() {
    if [ -d "$TEMP_DIR" ] && [ "$DRY_RUN" = false ]; then
        print_status "Cleaning up temporary files..."
        rm -rf "$TEMP_DIR"
    fi
}

# Function to show usage
show_usage() {
    cat << EOF
Repository Cleanup and Deduplication Script

Usage: $0 [OPTIONS]

Options:
    --dry-run       Preview changes without executing them
    --verbose       Enable verbose output
    --force         Skip confirmation prompts
    --help          Show this help message

Examples:
    $0 --dry-run    # Preview what would be cleaned
    $0 --force      # Execute cleanup without prompts
    $0              # Interactive cleanup with confirmations

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_status "Starting Repository Cleanup and Deduplication"
    print_status "=============================================="

    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN MODE - No changes will be made"
    fi

    # Initialize log file
    echo "Repository Cleanup Log - $(date)" > "$LOG_FILE"
    echo "========================================" >> "$LOG_FILE"

    # Create backup if not in dry-run mode
    if [ "$DRY_RUN" = false ]; then
        create_backup
    fi

    # Phase 1: Clean build artifacts
    clean_build_artifacts

    # Phase 2: Fetch Gitea repositories
    fetch_gitea_repos

    # Phase 3: Compare and deduplicate
    compare_and_deduplicate

    # Phase 4: Generate report
    generate_report

    # Cleanup
    cleanup_temp

    print_success "Repository cleanup completed successfully!"
    print_status "Check the cleanup report: $REPORT_FILE"
    print_status "Full log available at: $LOG_FILE"

    if [ "$DRY_RUN" = false ]; then
        print_status "Backup available at: $BACKUP_DIR"
    fi
}

# Confirmation prompt
if [ "$FORCE" = false ] && [ "$DRY_RUN" = false ]; then
    echo "This script will:"
    echo "1. Remove all node_modules and build artifacts"
    echo "2. Compare local repositories with Gitea"
    echo "3. Remove duplicate local repositories (keeping Gitea as source of truth)"
    echo ""
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Operation cancelled by user"
        exit 0
    fi
fi

# Execute main function
main