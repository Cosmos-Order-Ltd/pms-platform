# 🖥️ Local Development Guide

## Current Status

✅ **Architecture Complete**: Full k3s microservices setup ready
✅ **Dependencies Installed**: Backend and shared library ready
⚠️ **TypeScript Issues**: Some unused variables in strict mode
⚠️ **Admin Dependencies**: React 19 compatibility issues with some packages

## Quick Development Setup

### 1. Backend Development (Ready to Use)

```bash
# Navigate to backend
cd pms-backend

# Install dependencies (already done)
npm install

# Start development server
npm run dev
# Server will run on http://localhost:5000

# Test the API
curl http://localhost:5000/health
# Expected: {"status":"OK","timestamp":"...","version":"1.0.0"}
```

### 2. Shared Library (Ready to Use)

```bash
# Navigate to shared library
cd pms-shared

# Build in watch mode
npm run dev
# This will watch for changes and rebuild automatically
```

### 3. Admin Dashboard (Needs Dependency Fix)

```bash
# Navigate to admin
cd pms-admin

# Install with legacy peer deps (to fix React 19 compatibility)
npm install --legacy-peer-deps

# Start development server
npm run dev
# Server will run on http://localhost:3000
```

## Development Architecture

```
┌─────────────────────────────────────────────────────┐
│                Local Development                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ pms-backend │  │ pms-admin   │  │ pms-shared   │ │
│  │ Express.js  │  │ Next.js     │  │ TypeScript   │ │
│  │ Port: 5000  │  │ Port: 3000  │  │ Library      │ │
│  │             │  │             │  │              │ │
│  │ API Routes  │  │ Admin UI    │  │ Types &      │ │
│  │ Database    │  │ Components  │  │ Utils        │ │
│  │ Auth        │  │ Pages       │  │ Constants    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  Local SQLite Database (for development)           │
│  No Docker/k3s required for basic development      │
└─────────────────────────────────────────────────────┘
```

## Available Scripts

### Using Make (if available)
```bash
make help              # Show all available commands
make quick-start       # Install deps and build everything
make dev-backend       # Start backend in dev mode
make dev-admin         # Start admin in dev mode
make dev-shared        # Build shared lib in watch mode
make build-local       # Build all services locally
make test-all          # Run all tests
```

### Manual Commands
```bash
# Backend
cd pms-backend && npm run dev

# Admin
cd pms-admin && npm run dev

# Shared (build once)
cd pms-shared && npm run build

# Shared (watch mode)
cd pms-shared && npm run dev
```

## Development Workflow

### 1. Standard Development (No Docker)

```bash
# Terminal 1: Backend API
cd pms-backend
npm run dev

# Terminal 2: Admin Dashboard
cd pms-admin
npm run dev

# Terminal 3: Shared Library (if making changes)
cd pms-shared
npm run dev
```

**Access:**
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:3000
- API Health Check: http://localhost:5000/health

### 2. Full k3s Development (Requires Docker)

```bash
# Setup k3s cluster
./setup-k3s-local.sh

# Test deployment
./test-deployment.sh

# Deploy everything
make deploy-local

# Access services
# Admin: http://admin.pms.local
# API: http://api.pms.local
```

## Current Issues & Solutions

### 1. TypeScript Strict Mode Warnings
**Issue**: Unused variables in backend code
**Solution**:
```bash
# Temporary: Build with warnings
cd pms-backend && npm run build 2>/dev/null

# Permanent: Fix unused variables by prefixing with _
# Example: (req, res) => becomes (_req, res) =>
```

### 2. React 19 Compatibility
**Issue**: Radix UI components not compatible with React 19
**Solution**:
```bash
cd pms-admin
npm install --legacy-peer-deps
```

### 3. Docker Not Running
**Issue**: k3s setup requires Docker Desktop
**Solution**: Use local development mode instead
```bash
# Use this instead of k3s
./dev-local.sh
```

## API Endpoints Available

```bash
# Health Check
GET http://localhost:5000/health

# Authentication
POST http://localhost:5000/api/v1/auth/signin
POST http://localhost:5000/api/v1/auth/signup
POST http://localhost:5000/api/v1/auth/forgot-password

# Reservations
GET http://localhost:5000/api/v1/reservations
POST http://localhost:5000/api/v1/reservations

# Guests
GET http://localhost:5000/api/v1/guests
POST http://localhost:5000/api/v1/guests

# Properties
GET http://localhost:5000/api/v1/properties

# Rooms
GET http://localhost:5000/api/v1/rooms

# Staff
GET http://localhost:5000/api/v1/staff

# System
GET http://localhost:5000/api/v1/system/health
GET http://localhost:5000/api/v1/system/stats
```

## Testing Your Setup

### 1. Backend API Test
```bash
# Start backend
cd pms-backend && npm run dev

# In another terminal, test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2025-01-14T...","version":"1.0.0"}
```

### 2. Admin Dashboard Test
```bash
# Start admin (after fixing dependencies)
cd pms-admin && npm run dev

# Visit http://localhost:3000
# Should see the PMS admin dashboard
```

### 3. Shared Library Test
```bash
# Build shared library
cd pms-shared && npm run build

# Check dist folder created
ls pms-shared/dist/
# Should see index.js, index.d.ts, etc.
```

## Environment Variables

### Backend (.env)
```bash
# Copy example file
cd pms-backend
cp .env.example .env

# Edit with your settings
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here"
PORT=5000
NODE_ENV=development
```

### Admin (.env.local)
```bash
cd pms-admin
# Create .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000' > .env.local
```

## Next Steps

### Immediate (< 30 minutes)
1. Fix React compatibility: `cd pms-admin && npm install --legacy-peer-deps`
2. Start backend: `cd pms-backend && npm run dev`
3. Test API endpoints with curl or Postman
4. Start admin dashboard: `cd pms-admin && npm run dev`

### Short Term (< 2 hours)
1. Fix TypeScript warnings in backend
2. Set up database with proper migrations
3. Test all API endpoints
4. Complete admin dashboard functionality

### Medium Term (< 1 week)
1. Set up Docker Desktop
2. Deploy to k3s cluster: `./setup-k3s-local.sh`
3. Test full microservices deployment
4. Add marketplace service
5. Set up monitoring and logging

## Support

### Common Commands
```bash
# Show help
./dev-local.sh

# Check what's running
ps aux | grep node

# Kill all node processes
pkill -f node

# Check ports in use
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000
```

### Useful Development Tools
- **VS Code Extensions**: TypeScript, ESLint, Prettier
- **API Testing**: Postman, curl, Thunder Client
- **Database**: SQLite Browser, Prisma Studio
- **Process Management**: PM2 (for production-like local dev)

---

**Happy coding! 🚀**

Your PMS microservices architecture is ready for development. Start with local mode, then graduate to full k3s deployment when ready!