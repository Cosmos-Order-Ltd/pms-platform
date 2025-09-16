# 🔐 PMS Core Authentication Service

Authentication and authorization service for the Property Management System (PMS) platform. Handles user management, JWT token generation/validation, role-based access control, and session management.

## 🚀 Service Overview

**Port**: 3000
**Type**: Authentication & Authorization Service
**Database**: PostgreSQL (production) / SQLite (development)
**Primary Role**: User authentication, JWT management, RBAC

## 🏗️ Architecture

This service is the authentication hub for the PMS microservices:
- **pms-core** (Port 3000): Authentication service (this service)
- **pms-backend** (Port 5000): Validates tokens issued by this service
- **api-gateway** (Port 8080): Routes auth requests here
- **Frontend apps** (3010-3013): Use this service for login/logout

## 📋 Features

### Authentication
- **JWT-based authentication**: Secure token generation and validation
- **Refresh token system**: Automatic token renewal
- **Multi-factor authentication**: Optional 2FA support
- **Password management**: Secure hashing, reset functionality
- **Session management**: Active session tracking

### Authorization
- **Role-Based Access Control (RBAC)**: Hierarchical permission system
- **Permission management**: Granular access control
- **Multi-tenant support**: Property-based user isolation
- **API key management**: Service-to-service authentication

### User Management
- **User registration/login**: Complete user lifecycle
- **Profile management**: User data and preferences
- **Account verification**: Email/phone verification
- **Account recovery**: Password reset and account recovery

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Email**: Nodemailer (optional)
- **Testing**: Jest + Supertest

## 📁 Project Structure

```
pms-core/
├── src/
│   ├── controllers/     # Auth request handlers
│   │   ├── auth.ts     # Login, register, refresh
│   │   ├── users.ts    # User management
│   │   └── roles.ts    # Role and permission management
│   ├── middleware/     # Auth middleware
│   │   ├── auth.ts     # JWT validation
│   │   ├── rbac.ts     # Role-based access control
│   │   └── validate.ts # Input validation
│   ├── services/       # Business logic
│   │   ├── auth.ts     # Authentication logic
│   │   ├── jwt.ts      # Token management
│   │   └── email.ts    # Email services
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── index.ts        # Entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Database migrations
│   └── seed.ts         # Initial data seeding
└── tests/              # Test files
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 10.0.0+
- PostgreSQL (production) or SQLite (development)

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/charilaouc/pms-core.git
   cd pms-core
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Apply schema (development)
   npx prisma db push

   # Seed initial data (admin user, roles)
   npx prisma db seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The service will be available at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pms_auth"
# Or for development:
# DATABASE_URL="file:./prisma/auth.db"

# Server
NODE_ENV="development"
PORT=3000

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Password Security
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8

# CORS
CORS_ORIGINS="http://localhost:3010,http://localhost:3011,http://localhost:3012,http://localhost:3013,http://localhost:8080"

# Email Service (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="PMS System <noreply@pms.com>"

# Redis (for session management)
REDIS_URL="redis://localhost:6379"

# Security
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# External Services
PMS_BACKEND_URL="http://localhost:5000"
API_GATEWAY_URL="http://localhost:8080"
```

## 📚 API Endpoints

### Authentication
```
POST   /auth/register           # User registration
POST   /auth/login              # User login
POST   /auth/refresh            # Refresh access token
POST   /auth/logout             # User logout
POST   /auth/logout-all         # Logout from all devices
GET    /auth/me                 # Get current user info
```

### Password Management
```
POST   /auth/forgot-password    # Request password reset
POST   /auth/reset-password     # Reset password with token
POST   /auth/change-password    # Change password (authenticated)
```

### User Management
```
GET    /users                   # List users (admin only)
GET    /users/:id               # Get user details
POST   /users                   # Create user (admin)
PUT    /users/:id               # Update user
DELETE /users/:id               # Delete user (admin)
PUT    /users/:id/role          # Change user role (admin)
PUT    /users/:id/status        # Activate/deactivate user
```

### Roles & Permissions
```
GET    /roles                   # List all roles
GET    /roles/:id               # Get role details
POST   /roles                   # Create role (admin)
PUT    /roles/:id               # Update role (admin)
DELETE /roles/:id               # Delete role (admin)
GET    /permissions             # List permissions
```

### Token Validation (Internal)
```
POST   /auth/validate           # Validate JWT token (service-to-service)
POST   /auth/verify             # Verify user permissions
```

### Health Checks
```
GET    /health                  # Health check
GET    /health/ready            # Readiness probe
GET    /health/live             # Liveness probe
```

## 🔐 Authentication Flow

### Registration
```mermaid
sequenceDiagram
    Client->>PMS Core: POST /auth/register
    PMS Core->>PMS Core: Validate input
    PMS Core->>Database: Create user
    PMS Core->>Client: User created
    Note over Client,PMS Core: Email verification (optional)
```

### Login
```mermaid
sequenceDiagram
    Client->>PMS Core: POST /auth/login
    PMS Core->>Database: Verify credentials
    PMS Core->>PMS Core: Generate JWT tokens
    PMS Core->>Redis: Store refresh token
    PMS Core->>Client: Access + Refresh tokens
```

### Token Validation
```mermaid
sequenceDiagram
    Client->>API Gateway: API Request + JWT
    API Gateway->>PMS Core: POST /auth/validate
    PMS Core->>PMS Core: Verify JWT signature
    PMS Core->>API Gateway: Token valid + user info
    API Gateway->>PMS Backend: Forward request
```

## 👥 User Roles & Permissions

### Default Roles
```javascript
{
  "super_admin": {
    "description": "Full system access",
    "permissions": ["*"]
  },
  "property_manager": {
    "description": "Property management access",
    "permissions": [
      "read:properties", "write:properties",
      "read:staff", "write:staff",
      "read:bookings", "write:bookings",
      "read:reports"
    ]
  },
  "front_desk": {
    "description": "Front desk operations",
    "permissions": [
      "read:bookings", "write:bookings",
      "read:guests", "write:guests",
      "read:rooms"
    ]
  },
  "housekeeping": {
    "description": "Housekeeping staff",
    "permissions": [
      "read:tasks", "write:tasks",
      "read:rooms:status", "write:rooms:status"
    ]
  },
  "guest": {
    "description": "Hotel guest access",
    "permissions": [
      "read:own:bookings", "write:own:profile",
      "read:services"
    ]
  }
}
```

### Permission Format
- `read:resource` - Read access to resource
- `write:resource` - Write access to resource
- `delete:resource` - Delete access to resource
- `admin:resource` - Full admin access to resource
- `own:resource` - Access only to user's own data
- `*` - All permissions (super admin)

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Test Categories
```
tests/
├── unit/
│   ├── auth.test.ts        # Authentication logic
│   ├── jwt.test.ts         # Token management
│   └── rbac.test.ts        # Role-based access
├── integration/
│   ├── auth-flow.test.ts   # Complete auth flows
│   └── user-mgmt.test.ts   # User management
└── e2e/
    └── api.test.ts         # End-to-end API tests
```

## 🔒 Security Features

### JWT Security
- **Short-lived access tokens**: 15-minute expiry
- **Refresh token rotation**: New refresh token on each refresh
- **Secure token storage**: HttpOnly cookies (optional)
- **Token blacklisting**: Invalidate compromised tokens

### Password Security
- **bcrypt hashing**: Industry-standard password hashing
- **Salt rounds**: Configurable hash complexity
- **Password policies**: Minimum length, complexity requirements
- **Breach detection**: Check against common password lists

### Rate Limiting
- **Login attempts**: 5 attempts per 15 minutes per IP
- **Registration**: 3 registrations per hour per IP
- **Password reset**: 1 request per hour per email

### Additional Security
- **CORS configuration**: Restrict cross-origin requests
- **Input validation**: Comprehensive input sanitization
- **SQL injection prevention**: Prisma ORM protection
- **XSS protection**: Content security headers

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  pms-core:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://pms:password@auth-db:5432/pms_auth
      - JWT_SECRET=your-jwt-secret
      - REDIS_URL=redis://redis:6379
    depends_on:
      - auth-db
      - redis

  auth-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=pms_auth
      - POSTGRES_USER=pms
      - POSTGRES_PASSWORD=password

  redis:
    image: redis:7-alpine
```

## 📊 Database Schema

### Core Tables
```sql
-- Users table
Users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Roles table
Roles (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL,
  created_at TIMESTAMP
)

-- User roles (many-to-many)
UserRoles (
  user_id UUID REFERENCES Users(id),
  role_id UUID REFERENCES Roles(id),
  assigned_at TIMESTAMP,
  assigned_by UUID REFERENCES Users(id)
)

-- Refresh tokens
RefreshTokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users(id),
  token_hash VARCHAR NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP
)
```

## 📈 Monitoring & Metrics

### Health Checks
- Database connectivity
- Redis connectivity (if configured)
- Memory usage
- Response time metrics

### Metrics to Track
```javascript
// Authentication metrics
auth_login_attempts_total
auth_login_success_total
auth_login_failures_total
auth_token_validation_total
auth_active_sessions_gauge

// User metrics
users_registered_total
users_active_gauge
password_reset_requests_total
```

### Logging
```javascript
// Structured logging for security events
logger.info('User login successful', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

logger.warn('Failed login attempt', {
  email: loginData.email,
  ip: req.ip,
  reason: 'invalid_password'
});
```

## 🤖 Claude AI Development

### Key Development Areas:

1. **Authentication Logic**:
   - `src/services/auth.ts` - Core authentication functions
   - `src/controllers/auth.ts` - Auth endpoint handlers
   - `src/middleware/auth.ts` - JWT validation middleware

2. **User Management**:
   - `src/controllers/users.ts` - User CRUD operations
   - `src/services/email.ts` - Email notifications

3. **RBAC System**:
   - `src/middleware/rbac.ts` - Permission checking
   - `src/controllers/roles.ts` - Role management

4. **Database Schema**:
   - `prisma/schema.prisma` - Data model definitions

### Common Tasks:
```bash
# Add new role
npm run seed:roles

# Test authentication flow
npm run test:auth

# Generate JWT secret
npm run generate:secret

# Check token validation
npm run test:tokens
```

## 🔗 Integration with Other Services

### Service-to-Service Authentication
```javascript
// Example: pms-backend validating token
const validateToken = async (token) => {
  const response = await fetch('http://pms-core:3000/auth/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Frontend Integration
```javascript
// Login flow for frontend apps
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const { accessToken, refreshToken } = await response.json();
  // Store tokens securely
};
```

## 🔗 Related Services

- **[pms-backend](https://github.com/charilaouc/pms-backend)** - Uses this service for authentication
- **[api-gateway](https://github.com/charilaouc/api-gateway)** - Routes auth requests here
- **[pms-admin](https://github.com/charilaouc/pms-admin)** - Admin login interface
- **[pms-shared](https://github.com/charilaouc/pms-shared)** - Shared auth types
- **[pms-infrastructure](https://github.com/charilaouc/pms-infrastructure)** - Deployment configs

---

**PMS Core Authentication Service** 🔐 | Secure authentication hub for PMS platform