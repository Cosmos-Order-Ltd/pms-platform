#!/bin/bash

# Backup Setup Script for Proxmox PMS Platform
# Configures automated backups for database, volumes, and configurations

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-/opt/pms-backups}"
NAMESPACE="${NAMESPACE:-pms-platform}"
BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 2 * * *}"  # Daily at 2 AM
RETENTION_DAYS="${RETENTION_DAYS:-7}"
POSTGRES_DB="${POSTGRES_DB:-pms}"
POSTGRES_USER="${POSTGRES_USER:-pms}"
S3_BUCKET="${S3_BUCKET:-}"  # Optional S3 backup

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

# Create backup directories
create_backup_dirs() {
    log_info "Creating backup directories..."

    sudo mkdir -p "${BACKUP_DIR}"/{database,volumes,configs,scripts}
    sudo chown -R $(id -u):$(id -g) "${BACKUP_DIR}"

    log_success "Backup directories created at ${BACKUP_DIR}"
}

# Install backup tools
install_backup_tools() {
    log_info "Installing backup tools..."

    # Install required packages
    sudo apt-get update
    sudo apt-get install -y \
        postgresql-client \
        redis-tools \
        awscli \
        rclone \
        restic \
        jq

    log_success "Backup tools installed"
}

# Create database backup script
create_db_backup_script() {
    log_info "Creating database backup script..."

    cat > "${BACKUP_DIR}/scripts/backup-database.sh" << 'EOF'
#!/bin/bash

set -euo pipefail

# Configuration
NAMESPACE="${NAMESPACE:-pms-platform}"
BACKUP_DIR="${BACKUP_DIR:-/opt/pms-backups}"
POSTGRES_DB="${POSTGRES_DB:-pms}"
POSTGRES_USER="${POSTGRES_USER:-pms}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${RED}[ERROR]${NC} $1"
}

# Backup PostgreSQL database
backup_postgres() {
    log_info "Starting PostgreSQL backup..."

    local backup_file="${BACKUP_DIR}/database/postgres_${TIMESTAMP}.sql"

    # Get postgres pod name
    local postgres_pod=$(kubectl get pods -n "${NAMESPACE}" -l app=postgres -o jsonpath='{.items[0].metadata.name}')

    if [[ -z "$postgres_pod" ]]; then
        log_error "PostgreSQL pod not found"
        return 1
    fi

    # Create backup
    kubectl exec -n "${NAMESPACE}" "$postgres_pod" -- pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "$backup_file"

    # Compress backup
    gzip "$backup_file"

    log_success "PostgreSQL backup created: ${backup_file}.gz"
    echo "${backup_file}.gz"
}

# Backup Redis data
backup_redis() {
    log_info "Starting Redis backup..."

    local backup_file="${BACKUP_DIR}/database/redis_${TIMESTAMP}.rdb"

    # Get redis pod name
    local redis_pod=$(kubectl get pods -n "${NAMESPACE}" -l app=redis -o jsonpath='{.items[0].metadata.name}')

    if [[ -z "$redis_pod" ]]; then
        log_error "Redis pod not found"
        return 1
    fi

    # Create backup
    kubectl exec -n "${NAMESPACE}" "$redis_pod" -- redis-cli BGSAVE
    sleep 5  # Wait for background save to complete
    kubectl cp "${NAMESPACE}/${redis_pod}:/data/dump.rdb" "$backup_file"

    # Compress backup
    gzip "$backup_file"

    log_success "Redis backup created: ${backup_file}.gz"
    echo "${backup_file}.gz"
}

# Backup Kubernetes configurations
backup_k8s_configs() {
    log_info "Starting Kubernetes configurations backup..."

    local backup_file="${BACKUP_DIR}/configs/k8s_configs_${TIMESTAMP}.yaml"

    # Backup all resources in the namespace
    kubectl get all,pvc,configmap,secret,ingressroute -n "${NAMESPACE}" -o yaml > "$backup_file"

    # Compress backup
    gzip "$backup_file"

    log_success "Kubernetes configurations backup created: ${backup_file}.gz"
    echo "${backup_file}.gz"
}

# Main backup function
main() {
    log_info "Starting database backup process..."

    local backup_files=()

    # Backup PostgreSQL
    if postgres_file=$(backup_postgres); then
        backup_files+=("$postgres_file")
    fi

    # Backup Redis
    if redis_file=$(backup_redis); then
        backup_files+=("$redis_file")
    fi

    # Backup Kubernetes configs
    if k8s_file=$(backup_k8s_configs); then
        backup_files+=("$k8s_file")
    fi

    # Create backup manifest
    local manifest_file="${BACKUP_DIR}/backup_manifest_${TIMESTAMP}.json"
    jq -n \
        --arg timestamp "$TIMESTAMP" \
        --argjson files "$(printf '%s\n' "${backup_files[@]}" | jq -R . | jq -s .)" \
        '{timestamp: $timestamp, files: $files}' > "$manifest_file"

    log_success "Backup completed. Manifest: $manifest_file"

    # Cleanup old backups
    cleanup_old_backups

    # Upload to S3 if configured
    if [[ -n "${S3_BUCKET:-}" ]]; then
        upload_to_s3 "${backup_files[@]}"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (older than ${RETENTION_DAYS} days)..."

    find "${BACKUP_DIR}" -name "*.gz" -type f -mtime +${RETENTION_DAYS} -delete
    find "${BACKUP_DIR}" -name "*.json" -type f -mtime +${RETENTION_DAYS} -delete

    log_success "Old backups cleaned up"
}

# Upload to S3
upload_to_s3() {
    local files=("$@")
    log_info "Uploading backups to S3 bucket: ${S3_BUCKET}"

    for file in "${files[@]}"; do
        aws s3 cp "$file" "s3://${S3_BUCKET}/pms-backups/$(basename "$file")"
    done

    log_success "Backups uploaded to S3"
}

# Execute main function
main "$@"
EOF

    chmod +x "${BACKUP_DIR}/scripts/backup-database.sh"

    log_success "Database backup script created"
}

# Create volume backup script
create_volume_backup_script() {
    log_info "Creating volume backup script..."

    cat > "${BACKUP_DIR}/scripts/backup-volumes.sh" << 'EOF'
#!/bin/bash

set -euo pipefail

# Configuration
NAMESPACE="${NAMESPACE:-pms-platform}"
BACKUP_DIR="${BACKUP_DIR:-/opt/pms-backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${RED}[ERROR]${NC} $1"
}

# Backup persistent volumes
backup_persistent_volumes() {
    log_info "Starting persistent volumes backup..."

    # Get all PVCs in namespace
    local pvcs=$(kubectl get pvc -n "${NAMESPACE}" -o jsonpath='{.items[*].metadata.name}')

    for pvc in $pvcs; do
        log_info "Backing up PVC: $pvc"

        local backup_file="${BACKUP_DIR}/volumes/${pvc}_${TIMESTAMP}.tar.gz"

        # Create a temporary pod to access the volume
        kubectl run backup-temp-${pvc} \
            --image=ubuntu:20.04 \
            --rm -i --restart=Never \
            --overrides='{
                "apiVersion": "v1",
                "spec": {
                    "containers": [{
                        "name": "backup-temp-'${pvc}'",
                        "image": "ubuntu:20.04",
                        "command": ["sleep", "3600"],
                        "volumeMounts": [{
                            "name": "volume",
                            "mountPath": "/data"
                        }]
                    }],
                    "volumes": [{
                        "name": "volume",
                        "persistentVolumeClaim": {
                            "claimName": "'${pvc}'"
                        }
                    }]
                }
            }' \
            --namespace="${NAMESPACE}" &

        # Wait for pod to be ready
        sleep 10

        # Create backup
        kubectl exec -n "${NAMESPACE}" "backup-temp-${pvc}" -- tar czf - -C /data . > "$backup_file"

        # Delete temporary pod
        kubectl delete pod "backup-temp-${pvc}" -n "${NAMESPACE}" --ignore-not-found=true

        log_success "PVC backup created: $backup_file"
    done
}

# Main function
main() {
    log_info "Starting volume backup process..."
    backup_persistent_volumes
    log_success "Volume backup completed"
}

main "$@"
EOF

    chmod +x "${BACKUP_DIR}/scripts/backup-volumes.sh"

    log_success "Volume backup script created"
}

# Create restore script
create_restore_script() {
    log_info "Creating restore script..."

    cat > "${BACKUP_DIR}/scripts/restore.sh" << 'EOF'
#!/bin/bash

set -euo pipefail

# Configuration
NAMESPACE="${NAMESPACE:-pms-platform}"
BACKUP_DIR="${BACKUP_DIR:-/opt/pms-backups}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${RED}[ERROR]${NC} $1"
}

# List available backups
list_backups() {
    echo "Available backups:"
    echo
    echo "Database backups:"
    ls -la "${BACKUP_DIR}/database/" | grep -E "postgres_|redis_" || echo "  No database backups found"
    echo
    echo "Volume backups:"
    ls -la "${BACKUP_DIR}/volumes/" || echo "  No volume backups found"
    echo
    echo "Configuration backups:"
    ls -la "${BACKUP_DIR}/configs/" || echo "  No configuration backups found"
}

# Restore PostgreSQL database
restore_postgres() {
    local backup_file="$1"

    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi

    log_info "Restoring PostgreSQL from: $backup_file"

    # Get postgres pod name
    local postgres_pod=$(kubectl get pods -n "${NAMESPACE}" -l app=postgres -o jsonpath='{.items[0].metadata.name}')

    if [[ -z "$postgres_pod" ]]; then
        log_error "PostgreSQL pod not found"
        return 1
    fi

    # Decompress and restore
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | kubectl exec -i -n "${NAMESPACE}" "$postgres_pod" -- psql -U "${POSTGRES_USER:-pms}" -d "${POSTGRES_DB:-pms}"
    else
        kubectl exec -i -n "${NAMESPACE}" "$postgres_pod" -- psql -U "${POSTGRES_USER:-pms}" -d "${POSTGRES_DB:-pms}" < "$backup_file"
    fi

    log_success "PostgreSQL restore completed"
}

# Restore Redis data
restore_redis() {
    local backup_file="$1"

    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi

    log_info "Restoring Redis from: $backup_file"

    # Get redis pod name
    local redis_pod=$(kubectl get pods -n "${NAMESPACE}" -l app=redis -o jsonpath='{.items[0].metadata.name}')

    if [[ -z "$redis_pod" ]]; then
        log_error "Redis pod not found"
        return 1
    fi

    # Stop Redis, restore data, start Redis
    kubectl exec -n "${NAMESPACE}" "$redis_pod" -- redis-cli SHUTDOWN NOSAVE || true
    sleep 5

    # Copy backup file
    local temp_file="/tmp/dump.rdb"
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" > "$temp_file"
    else
        cp "$backup_file" "$temp_file"
    fi

    kubectl cp "$temp_file" "${NAMESPACE}/${redis_pod}:/data/dump.rdb"
    rm -f "$temp_file"

    # Restart redis pod
    kubectl delete pod "$redis_pod" -n "${NAMESPACE}"
    kubectl wait --for=condition=Ready pods -l app=redis -n "${NAMESPACE}" --timeout=300s

    log_success "Redis restore completed"
}

# Show help
show_help() {
    cat << HELP
Restore Script for PMS Platform

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    list                List available backups
    postgres FILE       Restore PostgreSQL from backup file
    redis FILE          Restore Redis from backup file
    full TIMESTAMP      Restore complete backup set from timestamp

Examples:
    # List available backups
    $0 list

    # Restore PostgreSQL
    $0 postgres /opt/pms-backups/database/postgres_20231215_020000.sql.gz

    # Restore Redis
    $0 redis /opt/pms-backups/database/redis_20231215_020000.rdb.gz

    # Full restore
    $0 full 20231215_020000

HELP
}

# Main function
main() {
    case "${1:-list}" in
        list)
            list_backups
            ;;
        postgres)
            if [[ -z "${2:-}" ]]; then
                log_error "Backup file required"
                show_help
                exit 1
            fi
            restore_postgres "$2"
            ;;
        redis)
            if [[ -z "${2:-}" ]]; then
                log_error "Backup file required"
                show_help
                exit 1
            fi
            restore_redis "$2"
            ;;
        full)
            if [[ -z "${2:-}" ]]; then
                log_error "Timestamp required"
                show_help
                exit 1
            fi
            local timestamp="$2"
            restore_postgres "${BACKUP_DIR}/database/postgres_${timestamp}.sql.gz"
            restore_redis "${BACKUP_DIR}/database/redis_${timestamp}.rdb.gz"
            ;;
        -h|--help)
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
EOF

    chmod +x "${BACKUP_DIR}/scripts/restore.sh"

    log_success "Restore script created"
}

# Setup cron jobs
setup_cron_jobs() {
    log_info "Setting up cron jobs..."

    # Create cron job for database backups
    (crontab -l 2>/dev/null; echo "${BACKUP_SCHEDULE} ${BACKUP_DIR}/scripts/backup-database.sh >> ${BACKUP_DIR}/backup.log 2>&1") | crontab -

    # Create cron job for volume backups (weekly)
    (crontab -l 2>/dev/null; echo "0 3 * * 0 ${BACKUP_DIR}/scripts/backup-volumes.sh >> ${BACKUP_DIR}/backup.log 2>&1") | crontab -

    log_success "Cron jobs configured"
    echo "Database backup: ${BACKUP_SCHEDULE}"
    echo "Volume backup: Weekly on Sunday at 3 AM"
}

# Create monitoring script
create_monitoring_script() {
    log_info "Creating backup monitoring script..."

    cat > "${BACKUP_DIR}/scripts/monitor-backups.sh" << 'EOF'
#!/bin/bash

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/opt/pms-backups}"
ALERT_EMAIL="${ALERT_EMAIL:-}"
WEBHOOK_URL="${WEBHOOK_URL:-}"

# Check if backup was successful today
check_daily_backup() {
    local today=$(date +"%Y%m%d")
    local backup_found=false

    # Check for today's database backup
    if ls "${BACKUP_DIR}/database/"postgres_${today}_*.sql.gz &>/dev/null; then
        backup_found=true
    fi

    if [[ "$backup_found" == "true" ]]; then
        echo "✅ Backup found for today: $today"
        return 0
    else
        echo "❌ No backup found for today: $today"
        return 1
    fi
}

# Send alert
send_alert() {
    local message="$1"

    # Send email if configured
    if [[ -n "$ALERT_EMAIL" ]]; then
        echo "$message" | mail -s "PMS Backup Alert" "$ALERT_EMAIL"
    fi

    # Send webhook if configured
    if [[ -n "$WEBHOOK_URL" ]]; then
        curl -X POST -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\"}" \
            "$WEBHOOK_URL"
    fi

    echo "$message"
}

# Main monitoring function
main() {
    if ! check_daily_backup; then
        send_alert "PMS Platform backup failed or missing for $(date +%Y-%m-%d)"
        exit 1
    fi
}

main "$@"
EOF

    chmod +x "${BACKUP_DIR}/scripts/monitor-backups.sh"

    # Add monitoring to cron (check daily at 6 AM)
    (crontab -l 2>/dev/null; echo "0 6 * * * ${BACKUP_DIR}/scripts/monitor-backups.sh >> ${BACKUP_DIR}/monitor.log 2>&1") | crontab -

    log_success "Backup monitoring script created"
}

# Create backup configuration
create_backup_config() {
    log_info "Creating backup configuration..."

    cat > "${BACKUP_DIR}/backup.conf" << EOF
# PMS Platform Backup Configuration

# Directories
BACKUP_DIR=${BACKUP_DIR}
SCRIPT_DIR=${BACKUP_DIR}/scripts

# Kubernetes
NAMESPACE=${NAMESPACE}

# Database
POSTGRES_DB=${POSTGRES_DB}
POSTGRES_USER=${POSTGRES_USER}

# Schedule
BACKUP_SCHEDULE=${BACKUP_SCHEDULE}
RETENTION_DAYS=${RETENTION_DAYS}

# Optional: S3 Configuration
S3_BUCKET=${S3_BUCKET}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-}

# Optional: Alert Configuration
ALERT_EMAIL=${ALERT_EMAIL:-}
WEBHOOK_URL=${WEBHOOK_URL:-}
EOF

    log_success "Backup configuration created at ${BACKUP_DIR}/backup.conf"
}

# Display backup information
display_backup_info() {
    log_success "Backup setup completed!"
    echo
    echo "Backup Configuration:"
    echo "  - Backup Directory: ${BACKUP_DIR}"
    echo "  - Namespace: ${NAMESPACE}"
    echo "  - Schedule: ${BACKUP_SCHEDULE}"
    echo "  - Retention: ${RETENTION_DAYS} days"
    echo
    echo "Backup Scripts:"
    echo "  - Database: ${BACKUP_DIR}/scripts/backup-database.sh"
    echo "  - Volumes: ${BACKUP_DIR}/scripts/backup-volumes.sh"
    echo "  - Restore: ${BACKUP_DIR}/scripts/restore.sh"
    echo "  - Monitor: ${BACKUP_DIR}/scripts/monitor-backups.sh"
    echo
    echo "Manual Commands:"
    echo "  - Run backup: ${BACKUP_DIR}/scripts/backup-database.sh"
    echo "  - List backups: ${BACKUP_DIR}/scripts/restore.sh list"
    echo "  - View logs: tail -f ${BACKUP_DIR}/backup.log"
    echo "  - Check cron: crontab -l"
    echo
    echo "Logs:"
    echo "  - Backup log: ${BACKUP_DIR}/backup.log"
    echo "  - Monitor log: ${BACKUP_DIR}/monitor.log"
}

# Main execution
main() {
    log_info "Starting backup setup for PMS Platform"

    create_backup_dirs
    install_backup_tools
    create_db_backup_script
    create_volume_backup_script
    create_restore_script
    create_monitoring_script
    setup_cron_jobs
    create_backup_config
    display_backup_info
}

# Help function
show_help() {
    cat << EOF
Backup Setup Script for PMS Platform

Usage: $0 [OPTIONS]

Options:
    --backup-dir DIR    Backup directory (default: /opt/pms-backups)
    --namespace NS      Kubernetes namespace (default: pms-platform)
    --schedule CRON     Backup schedule (default: 0 2 * * *)
    --retention DAYS    Backup retention days (default: 7)
    --s3-bucket BUCKET  S3 bucket for remote backups
    -h, --help          Show this help message

Environment Variables:
    BACKUP_DIR          Backup directory
    NAMESPACE           Kubernetes namespace
    BACKUP_SCHEDULE     Cron schedule for backups
    RETENTION_DAYS      Number of days to keep backups
    S3_BUCKET           S3 bucket for remote storage
    ALERT_EMAIL         Email for backup alerts
    WEBHOOK_URL         Webhook URL for notifications

Examples:
    # Setup with defaults
    ./backup-setup.sh

    # Setup with custom directory
    ./backup-setup.sh --backup-dir /data/backups

    # Setup with S3 backup
    S3_BUCKET=my-backup-bucket ./backup-setup.sh

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        --schedule)
            BACKUP_SCHEDULE="$2"
            shift 2
            ;;
        --retention)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --s3-bucket)
            S3_BUCKET="$2"
            shift 2
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