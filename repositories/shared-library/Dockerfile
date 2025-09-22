# Dockerfile for PMS Shared Library (for CI/CD and testing)
FROM node:20-alpine AS builder

# Install dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build library
RUN npm run build

# Test stage
FROM node:20-alpine AS test
WORKDIR /app
COPY --from=builder /app .
RUN npm test

# Package stage for publishing
FROM node:20-alpine AS package
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/README.md ./README.md 2>/dev/null || echo "# PMS Shared Library" > README.md

# Install only production dependencies
RUN npm ci --only=production

# Create publishable package
CMD ["npm", "publish"]