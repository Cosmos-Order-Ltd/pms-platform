# COSMOS ORDER REAL ESTATE PLATFORM - CONTAINER #43
# Multi-stage Docker build for production-ready deployment

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S cosmosapp -u 1001

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy additional required files
COPY --chown=cosmosapp:nodejs . .

# Create necessary directories
RUN mkdir -p logs && chown -R cosmosapp:nodejs logs
RUN mkdir -p uploads && chown -R cosmosapp:nodejs uploads
RUN mkdir -p temp && chown -R cosmosapp:nodejs temp

# Set user to non-root
USER cosmosapp

# Expose port
EXPOSE 3030

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "
        const http = require('http');
        const options = {
            host: 'localhost',
            port: 3030,
            path: '/health',
            timeout: 2000
        };
        const request = http.request(options, (res) => {
            if (res.statusCode === 200) {
                process.exit(0);
            } else {
                process.exit(1);
            }
        });
        request.on('error', () => process.exit(1));
        request.on('timeout', () => process.exit(1));
        request.end();
    "

# Environment variables
ENV NODE_ENV=production
ENV PORT=3030

# Labels
LABEL maintainer="Cosmos Order <admin@cosmosorder.com>"
LABEL version="1.0.0"
LABEL description="Cosmos Order Real Estate Development Platform"
LABEL container="container-43"
LABEL service="real-estate-platform"

# Start command
CMD ["node", "dist/index.js"]