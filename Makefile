.PHONY: help setup build-all deploy-local clean logs status

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)PMS Kubernetes Development Environment$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Setup local k3s cluster and development environment
	@echo "$(YELLOW)Setting up k3s local development environment...$(NC)"
	@chmod +x setup-k3s-local.sh
	@./setup-k3s-local.sh
	@echo "$(GREEN)✅ Setup complete!$(NC)"

build-all: ## Build all Docker images and push to local registry
	@echo "$(YELLOW)Building all services...$(NC)"
	@for service in pms-backend pms-admin pms-marketplace; do \
		echo "$(BLUE)Building $$service...$(NC)"; \
		if [ -d "$$service" ]; then \
			cd $$service && \
			if [ -f "package.json" ]; then \
				npm run build 2>/dev/null || echo "No build script for $$service"; \
			fi && \
			docker build -t localhost:5000/$$service:latest . && \
			docker push localhost:5000/$$service:latest && \
			cd ..; \
		else \
			echo "$(RED)Directory $$service not found$(NC)"; \
		fi; \
	done
	@echo "$(GREEN)✅ All services built and pushed$(NC)"

deploy-infra: ## Deploy infrastructure (database, redis, secrets)
	@echo "$(YELLOW)Deploying infrastructure...$(NC)"
	kubectl apply -f k8s/namespaces/
	kubectl apply -f k8s/secrets/
	kubectl apply -f k8s/infrastructure/
	@echo "$(GREEN)✅ Infrastructure deployed$(NC)"

deploy-services: ## Deploy application services using Helm
	@echo "$(YELLOW)Deploying services...$(NC)"
	@if command -v helm >/dev/null 2>&1; then \
		for service in pms-backend; do \
			if [ -d "helm/$$service" ]; then \
				echo "$(BLUE)Deploying $$service...$(NC)"; \
				namespace=$$(echo $$service | cut -d- -f2); \
				helm upgrade --install $$service ./helm/$$service \
					-f ./helm/$$service/values.dev.yaml \
					-n pms-$$namespace --create-namespace; \
			fi; \
		done; \
	else \
		echo "$(RED)Helm not found. Installing...$(NC)"; \
		curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash; \
		$(MAKE) deploy-services; \
	fi
	@echo "$(GREEN)✅ Services deployed$(NC)"

deploy-local: build-all deploy-infra deploy-services ## Build and deploy everything locally
	@echo "$(GREEN)✅ Local deployment complete!$(NC)"
	@echo "$(BLUE)Services available at:$(NC)"
	@echo "  - Admin: http://admin.pms.local"
	@echo "  - API: http://api.pms.local"
	@echo "  - Marketplace: http://marketplace.pms.local"

status: ## Show cluster and service status
	@echo "$(BLUE)Cluster Status:$(NC)"
	kubectl cluster-info
	@echo ""
	@echo "$(BLUE)Namespace Status:$(NC)"
	kubectl get namespaces -l app.kubernetes.io/part-of=pms
	@echo ""
	@echo "$(BLUE)Pod Status:$(NC)"
	kubectl get pods --all-namespaces -l app.kubernetes.io/part-of=pms
	@echo ""
	@echo "$(BLUE)Service Status:$(NC)"
	kubectl get services --all-namespaces -l app.kubernetes.io/part-of=pms

logs: ## Show logs from all PMS services
	@echo "$(BLUE)Recent logs from all PMS services:$(NC)"
	@if command -v stern >/dev/null 2>&1; then \
		stern --all-namespaces --since 5m -l app.kubernetes.io/part-of=pms; \
	else \
		echo "$(YELLOW)Stern not found. Showing kubectl logs...$(NC)"; \
		kubectl logs -l app.kubernetes.io/part-of=pms --all-namespaces --tail=100; \
	fi

clean: ## Clean up all PMS resources
	@echo "$(YELLOW)Cleaning up PMS resources...$(NC)"
	@for ns in pms-core pms-backend pms-frontend pms-marketplace pms-infra; do \
		kubectl delete namespace $$ns --ignore-not-found=true; \
	done
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

reset: clean setup ## Reset entire environment (clean + setup)
	@echo "$(GREEN)✅ Environment reset complete$(NC)"

dev-backend: ## Start backend in development mode (outside k8s)
	@if [ -d "pms-backend" ]; then \
		cd pms-backend && npm run dev; \
	else \
		echo "$(RED)pms-backend directory not found$(NC)"; \
	fi

dev-admin: ## Start admin dashboard in development mode (outside k8s)
	@if [ -d "pms-admin" ]; then \
		cd pms-admin && npm run dev; \
	else \
		echo "$(RED)pms-admin directory not found$(NC)"; \
	fi

install-tools: ## Install required development tools
	@echo "$(YELLOW)Installing development tools...$(NC)"
	@if command -v brew >/dev/null 2>&1; then \
		brew install helm kubectl k9s stern; \
	elif command -v apt-get >/dev/null 2>&1; then \
		curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 && \
		chmod 700 get_helm.sh && ./get_helm.sh && rm get_helm.sh; \
		curl -LO "https://dl.k8s.io/release/$$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
		chmod +x kubectl && sudo mv kubectl /usr/local/bin/; \
	else \
		echo "$(RED)Package manager not found. Please install tools manually.$(NC)"; \
	fi
	@echo "$(GREEN)✅ Tools installation complete$(NC)"