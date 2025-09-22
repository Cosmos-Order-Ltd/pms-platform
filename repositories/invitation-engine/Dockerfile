# Cyprus Access Control (CAC) - Container #31
# Geofenced Invitation Orchestration Service
# Multi-stage Docker build for production deployment

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S invitation && \
    adduser -S invitation -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create required directories with proper permissions
RUN mkdir -p logs uploads && \
    chown -R invitation:invitation /app

# Switch to non-root user
USER invitation

# Expose ports
EXPOSE 3019 3020

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3019/health || exit 1

# Environment variables with defaults
ENV NODE_ENV=production \
    PORT=3019 \
    ADMIN_PORT=3020 \
    LOG_LEVEL=info

# Start the application
CMD ["node", "dist/index.js"]

# Labels for Container #31
LABEL maintainer="Cyprus Business Empire <invitations@cypruspms.com>" \
      description="Geofenced Invitation Orchestration Service" \
      version="1.0.0" \
      container.number="31" \
      service.name="cyprus-access-control" \
      business.scope="Universal Access Control for Cyprus Business Empire" \
      invitation.types="CYH,CYR,CYC" \
      geographic.scope="Cyprus" \
      security.level="High" \
      compliance.ready="true"