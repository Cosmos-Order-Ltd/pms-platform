# 🏨 PMS Backend API Service

Core API service for the Property Management System (PMS) platform. Handles business logic, data management, and core PMS functionality including properties, rooms, bookings, guests, staff, and tasks.

## 🚀 Service Overview

**Port**: 5000
**Type**: Backend API Service
**Database**: PostgreSQL (production) / SQLite (development)
**Authentication**: JWT via pms-core service

## 🏗️ Architecture

This service is part of a microservices architecture:
- **pms-core** (Port 3000): Handles authentication
- **pms-backend** (Port 5000): Core business logic (this service)
- **api-gateway** (Port 8080): Routes requests to appropriate services
- **monitoring** (Port 9090): Health checks and metrics

## 📋 Features

### Core Functionality
- **Property Management**: Create, update, manage properties
- **Room Management**: Room types, availability, pricing
- **Booking System**: Reservation lifecycle management
- **Guest Management**: Guest profiles and preferences
- **Staff Management**: Staff profiles, roles, scheduling
- **Task Management**: Housekeeping and maintenance tasks

### API Features
- RESTful API design
- JSON request/response format
- JWT-based authentication
- Input validation with Zod
- Error handling middleware
- Request logging
- CORS support
- Rate limiting

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT (via pms-core)
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
pms-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models (Prisma)
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Database migrations
│   └── seed.ts         # Database seeding
├── tests/              # Test files
├── docs/               # API documentation
└── package.json
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 10.0.0+
- PostgreSQL (production) or SQLite (development)

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/charilaouc/pms-backend.git
   cd pms-backend
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

   # Apply database schema (development)
   npx prisma db push

   # Or run migrations (production)
   npx prisma migrate deploy

   # Seed database with sample data
   npx prisma db seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The service will be available at `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

Required environment variables (`.env` file):

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pms"
# Or for development:
# DATABASE_URL="file:./dev.db"

# Server
NODE_ENV="development"
PORT=5000

# Authentication (JWT verification)
JWT_SECRET="your-jwt-secret"

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:3010,http://localhost:3011,http://localhost:3012,http://localhost:3013,http://localhost:8080"

# External Services
PMS_CORE_URL="http://localhost:3000"
API_GATEWAY_URL="http://localhost:8080"

# Redis (optional - for caching)
REDIS_URL="redis://localhost:6379"

# File Storage (optional)
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10MB"
```

### Database Configuration

#### Development (SQLite)
```bash
DATABASE_URL="file:./prisma/dev.db"
```

#### Production (PostgreSQL)
```bash
DATABASE_URL="postgresql://pms_user:password@localhost:5432/pms_prod"
```

## 📚 API Endpoints

### Properties
```
GET    /api/properties           # List all properties
GET    /api/properties/:id       # Get property details
POST   /api/properties           # Create new property
PUT    /api/properties/:id       # Update property
DELETE /api/properties/:id       # Delete property
```

### Rooms
```
GET    /api/rooms                # List all rooms
GET    /api/rooms/:id            # Get room details
POST   /api/rooms                # Create new room
PUT    /api/rooms/:id            # Update room
DELETE /api/rooms/:id            # Delete room
GET    /api/properties/:id/rooms # Get rooms for property
```

### Bookings
```
GET    /api/bookings             # List bookings
GET    /api/bookings/:id         # Get booking details
POST   /api/bookings             # Create booking
PUT    /api/bookings/:id         # Update booking
DELETE /api/bookings/:id         # Cancel booking
POST   /api/bookings/:id/check-in    # Check in guest
POST   /api/bookings/:id/check-out   # Check out guest
```

### Guests
```
GET    /api/guests               # List guests
GET    /api/guests/:id           # Get guest profile
POST   /api/guests               # Create guest
PUT    /api/guests/:id           # Update guest
DELETE /api/guests/:id           # Delete guest
GET    /api/guests/:id/bookings  # Guest booking history
```

### Staff
```
GET    /api/staff                # List staff members
GET    /api/staff/:id            # Get staff details
POST   /api/staff                # Add staff member
PUT    /api/staff/:id            # Update staff
DELETE /api/staff/:id            # Remove staff
GET    /api/staff/:id/tasks      # Staff assigned tasks
```

### Tasks
```
GET    /api/tasks                # List tasks
GET    /api/tasks/:id            # Get task details
POST   /api/tasks                # Create task
PUT    /api/tasks/:id            # Update task
DELETE /api/tasks/:id            # Delete task
POST   /api/tasks/:id/assign     # Assign task to staff
POST   /api/tasks/:id/complete   # Mark task complete
```

### Health & Monitoring
```
GET    /health                   # Health check
GET    /health/ready             # Readiness probe
GET    /health/live              # Liveness probe
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E API tests
npm run test:e2e
```

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end API tests
└── fixtures/      # Test data
```

## 🐳 Docker

### Build Image
```bash
docker build -t pms-backend .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_SECRET="your_jwt_secret" \
  pms-backend
```

### Docker Compose
```yaml
version: '3.8'
services:
  pms-backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://pms:password@db:5432/pms
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=pms
      - POSTGRES_USER=pms
      - POSTGRES_PASSWORD=password
```

## 📊 Database Schema

### Core Entities
```sql
-- Properties
Properties (id, name, address, description, amenities, settings)

-- Rooms
Rooms (id, property_id, number, type, capacity, price, amenities)

-- Bookings
Bookings (id, guest_id, room_id, check_in, check_out, status, total_amount)

-- Guests
Guests (id, user_id, first_name, last_name, email, phone, preferences)

-- Staff
Staff (id, user_id, role, department, schedule, contact_info)

-- Tasks
Tasks (id, type, title, description, status, assigned_to, room_id, due_date)
```

### Relationships
- Properties → Rooms (1:N)
- Rooms → Bookings (1:N)
- Guests → Bookings (1:N)
- Staff → Tasks (1:N)
- Rooms → Tasks (1:N)

## 🔐 Authentication & Authorization

### JWT Integration
This service validates JWT tokens issued by `pms-core`:

```javascript
// Middleware verifies JWT tokens
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Token validation with pms-core service
};
```

### Role-Based Access
- **Admin**: Full access to all endpoints
- **Manager**: Property and staff management
- **Front Desk**: Booking and guest management
- **Staff**: Task management and updates
- **Guest**: Limited read access to own data

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment-Specific Configs
- **Development**: Hot reloading, detailed logging
- **Staging**: Similar to production, test data
- **Production**: Optimized build, error tracking

## 📈 Monitoring & Health Checks

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/ready` - Database connectivity
- `GET /health/live` - Service responsiveness

### Metrics
- Request count and response times
- Database query performance
- Error rates and types
- Memory and CPU usage

### Logging
```javascript
// Structured logging with Winston
logger.info('Booking created', {
  bookingId: booking.id,
  guestId: booking.guestId,
  roomId: booking.roomId
});
```

## 🤖 Claude AI Development

### Working with this service:

1. **Understanding the codebase**:
   - Review `src/` directory structure
   - Check `prisma/schema.prisma` for data models
   - Look at `src/routes/` for API endpoints

2. **Making changes**:
   - Update controllers in `src/controllers/`
   - Modify database schema in `prisma/schema.prisma`
   - Add/update tests in `tests/`
   - Update API documentation

3. **Testing changes**:
   ```bash
   npm test                    # Unit tests
   npm run test:e2e           # API integration tests
   npm run lint               # Code quality
   npm run type-check         # TypeScript validation
   ```

4. **Database changes**:
   ```bash
   npx prisma db push         # Apply schema changes (dev)
   npx prisma migrate dev     # Create migration (dev)
   npx prisma generate        # Regenerate client
   ```

### Key Files for AI Context:
- `src/index.ts` - Application entry point
- `src/routes/` - API route definitions
- `src/controllers/` - Business logic
- `prisma/schema.prisma` - Database schema
- `package.json` - Dependencies and scripts
- `.env.example` - Environment configuration

## 🔗 Related Services

- **[pms-core](https://github.com/charilaouc/pms-core)** - Authentication service
- **[api-gateway](https://github.com/charilaouc/api-gateway)** - API Gateway
- **[monitoring](https://github.com/charilaouc/monitoring)** - Health monitoring
- **[pms-shared](https://github.com/charilaouc/pms-shared)** - Shared utilities
- **[pms-infrastructure](https://github.com/charilaouc/pms-infrastructure)** - Deployment configs

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/charilaouc/pms-backend/issues)
- **Documentation**: [PMS Docs](https://github.com/charilaouc/pms-docs)
- **API Docs**: `http://localhost:5000/docs` (when running)

---

**PMS Backend API Service** 🏨 | Core business logic for hospitality management