#!/bin/bash

# PMS Repository Deployment - EXECUTE NOW
# Run this script after creating repositories on GitHub

echo "🚀 Starting PMS Repository Deployment..."
echo "======================================="

# Array of repositories with their GitHub names
declare -A repos=(
    ["pms-backend"]="pms-backend"
    ["pms-core"]="pms-core"
    ["api-gateway"]="pms-gateway"
    ["monitoring"]="pms-monitoring"
    ["pms-admin"]="pms-admin"
    ["pms-guest"]="pms-guest"
    ["pms-staff"]="pms-staff"
    ["pms-marketplace"]="pms-marketplace"
)

# Function to deploy a repository
deploy_repo() {
    local local_dir=$1
    local github_name=$2

    echo ""
    echo "📦 Deploying $local_dir to cosmosorder/$github_name"
    echo "================================================"

    if [ ! -d "$local_dir" ]; then
        echo "❌ Directory $local_dir not found"
        return 1
    fi

    cd "$local_dir"

    # Check if git repo exists
    if [ ! -d ".git" ]; then
        echo "❌ No git repository found in $local_dir"
        cd ..
        return 1
    fi

    # Add remote if not exists
    if ! git remote get-url origin > /dev/null 2>&1; then
        echo "🔗 Adding remote origin..."
        git remote add origin "https://github.com/cosmosorder/$github_name.git"
    else
        echo "🔗 Updating remote origin..."
        git remote set-url origin "https://github.com/cosmosorder/$github_name.git"
    fi

    # Push to GitHub
    echo "⬆️  Pushing to GitHub..."
    if git push -u origin master; then
        echo "✅ Successfully deployed $local_dir to cosmosorder/$github_name"
    else
        echo "❌ Failed to deploy $local_dir"
        cd ..
        return 1
    fi

    cd ..
    return 0
}

# Deploy all repositories
success_count=0
total_count=${#repos[@]}

for local_dir in "${!repos[@]}"; do
    github_name="${repos[$local_dir]}"
    if deploy_repo "$local_dir" "$github_name"; then
        ((success_count++))
    fi
done

echo ""
echo "======================================="
echo "🎉 Deployment Summary"
echo "======================================="
echo "✅ Successfully deployed: $success_count/$total_count repositories"

if [ $success_count -eq $total_count ]; then
    echo ""
    echo "🎊 ALL REPOSITORIES DEPLOYED SUCCESSFULLY!"
    echo ""
    echo "Your repositories are now available at:"
    for local_dir in "${!repos[@]}"; do
        github_name="${repos[$local_dir]}"
        echo "   🔗 https://github.com/cosmosorder/$github_name"
    done
    echo ""
    echo "Next steps:"
    echo "1. Set up GitHub Actions workflows"
    echo "2. Configure environment variables"
    echo "3. Deploy to production using k8s manifests"
else
    echo ""
    echo "⚠️  Some repositories failed to deploy."
    echo "Please check the error messages above and try again."
fi

echo ""
echo "🚀 PMS Microservices Deployment Complete!"