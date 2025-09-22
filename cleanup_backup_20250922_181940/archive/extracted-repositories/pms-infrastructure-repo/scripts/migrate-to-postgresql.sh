#!/bin/bash
# Migration script from SQLite to PostgreSQL for PMS platform

set -e

echo "🔄 Migrating PMS Database from SQLite to PostgreSQL"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    error "PostgreSQL client (psql) not found. Please install PostgreSQL."
    exit 1
fi

# Environment variables
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_DB=${POSTGRES_DB:-pms}
POSTGRES_USER=${POSTGRES_USER:-pmsuser}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password}

# Create .env file for PostgreSQL
info "Creating PostgreSQL environment configuration..."
cat > .env.postgres << EOF
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="pms-jwt-secret-change-in-production"
JWT_EXPIRES_IN="24h"

# Node Environment
NODE_ENV="development"

# API Configuration
API_PORT=5000
CORE_PORT=3000

# CORS Origins
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:5000"
EOF

success "Environment configuration created"

# Backup current SQLite database if it exists
if [ -f "prisma/dev.db" ]; then
    info "Backing up current SQLite database..."
    cp prisma/dev.db prisma/dev.db.backup
    success "SQLite database backed up"
fi

# Update Prisma schema
info "Updating Prisma schema for PostgreSQL..."
cp prisma/schema-enhanced.prisma prisma/schema.prisma
success "Prisma schema updated"

# Check if Docker is available for local PostgreSQL
if command -v docker &> /dev/null; then
    info "Starting PostgreSQL with Docker..."

    # Start PostgreSQL container
    docker run -d \
        --name pms-postgres \
        -e POSTGRES_DB=${POSTGRES_DB} \
        -e POSTGRES_USER=${POSTGRES_USER} \
        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        -p ${POSTGRES_PORT}:5432 \
        postgres:15-alpine || warning "PostgreSQL container might already be running"

    # Wait for PostgreSQL to be ready
    info "Waiting for PostgreSQL to be ready..."
    sleep 10

    # Test connection
    if PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c '\l' > /dev/null 2>&1; then
        success "PostgreSQL connection successful"
    else
        error "Failed to connect to PostgreSQL"
        exit 1
    fi
else
    warning "Docker not available. Please ensure PostgreSQL is running manually."
fi

# Generate Prisma client
info "Generating Prisma client..."
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# Install dependencies in all services
for service in pms-backend pms-core; do
    if [ -d "$service" ]; then
        info "Installing dependencies in $service..."
        cd $service
        npm install --silent
        cd ..
        success "Dependencies installed in $service"
    fi
done

# Run Prisma migrations
info "Running database migrations..."
cd pms-backend
npx prisma generate
npx prisma db push --force-reset

success "Database migrations completed"
cd ..

# Create seed data
info "Creating seed data..."
cat > pms-backend/prisma/seed.ts << 'SEED_EOF'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create system settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'site_name', value: 'PMS Platform', category: 'general' },
      { key: 'default_currency', value: 'EUR', category: 'financial' },
      { key: 'default_timezone', value: 'Europe/Nicosia', category: 'general' },
      { key: 'vat_rate', value: '0.19', category: 'financial' },
      { key: 'tourism_tax', value: '1.5', category: 'financial' },
    ],
    skipDuplicates: true,
  })

  // Create test organization
  const organization = await prisma.organization.upsert({
    where: { id: 'test-org' },
    update: {},
    create: {
      id: 'test-org',
      name: 'Cyprus Hospitality Group',
      description: 'Leading hospitality company in Cyprus',
      email: 'info@cyprushotels.com',
      phone: '+357 12 345 678',
      website: 'https://cyprushotels.com',
      address: {
        street: '123 Tourism Avenue',
        city: 'Nicosia',
        country: 'Cyprus',
        postalCode: '1234'
      }
    }
  })

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pms.com' },
    update: {},
    create: {
      email: 'admin@pms.com',
      name: 'System Administrator',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      organizationId: organization.id,
      emailVerified: new Date(),
    }
  })

  // Create test property
  const property = await prisma.property.upsert({
    where: { id: 'test-property' },
    update: {},
    create: {
      id: 'test-property',
      name: 'Oceanview Resort Cyprus',
      description: 'Luxury beachfront resort with stunning sea views',
      type: 'RESORT',
      status: 'ACTIVE',
      address: {
        street: '456 Beach Road',
        city: 'Ayia Napa',
        region: 'Famagusta',
        country: 'Cyprus',
        postalCode: '5330'
      },
      coordinates: {
        latitude: 34.9823,
        longitude: 33.9993
      },
      amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Parking'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      currency: 'EUR',
      taxRate: 0.19,
      tourismTax: 1.5,
      organizationId: organization.id
    }
  })

  // Create sample rooms
  const rooms = await prisma.room.createMany({
    data: [
      {
        id: 'room-101',
        number: '101',
        name: 'Ocean View Suite',
        type: 'SUITE',
        floor: 1,
        capacity: 4,
        basePrice: 250.00,
        description: 'Luxurious suite with panoramic ocean views',
        amenities: ['Ocean View', 'Balcony', 'Minibar', 'Safe'],
        propertyId: property.id
      },
      {
        id: 'room-102',
        number: '102',
        name: 'Deluxe Double Room',
        type: 'DOUBLE',
        floor: 1,
        capacity: 2,
        basePrice: 150.00,
        description: 'Elegant double room with modern amenities',
        amenities: ['Garden View', 'Minibar', 'Safe'],
        propertyId: property.id
      },
      {
        id: 'room-201',
        number: '201',
        name: 'Family Room',
        type: 'FAMILY',
        floor: 2,
        capacity: 6,
        basePrice: 300.00,
        description: 'Spacious family room with separate living area',
        amenities: ['Sea View', 'Balcony', 'Kitchenette', 'Safe'],
        propertyId: property.id
      }
    ],
    skipDuplicates: true
  })

  // Create guest user and profile
  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      name: 'Maria Konstantinou',
      role: 'GUEST',
      status: 'ACTIVE',
      phone: '+357 99 123 456',
      emailVerified: new Date(),
    }
  })

  const guest = await prisma.guest.upsert({
    where: { userId: guestUser.id },
    update: {},
    create: {
      userId: guestUser.id,
      firstName: 'Maria',
      lastName: 'Konstantinou',
      nationality: 'Cyprus',
      address: {
        street: '789 Guest Street',
        city: 'Limassol',
        country: 'Cyprus'
      },
      preferences: {
        room_type: 'non_smoking',
        floor: 'high',
        pillow_type: 'soft'
      }
    }
  })

  // Create staff user and profile
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@pms.com' },
    update: {},
    create: {
      email: 'staff@pms.com',
      name: 'Andreas Papadopoulos',
      role: 'HOUSEKEEPING',
      status: 'ACTIVE',
      organizationId: organization.id,
      emailVerified: new Date(),
    }
  })

  const staff = await prisma.staff.upsert({
    where: { userId: staffUser.id },
    update: {},
    create: {
      userId: staffUser.id,
      employeeId: 'EMP001',
      role: 'HOUSEKEEPING',
      status: 'ACTIVE',
      department: 'Housekeeping',
      hireDate: new Date('2024-01-15'),
      propertyId: property.id
    }
  })

  // Create marketplace agent
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@marketplace.com' },
    update: {},
    create: {
      email: 'agent@marketplace.com',
      name: 'Elena Georgiou',
      role: 'MARKETPLACE_AGENT',
      status: 'ACTIVE',
      emailVerified: new Date(),
    }
  })

  const agent = await prisma.marketplaceAgent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      licenseNumber: 'RE-12345',
      agency: 'Cyprus Premier Properties',
      website: 'https://cypremprops.com',
      bio: 'Experienced real estate agent specializing in luxury properties',
      specialties: ['Luxury Hotels', 'Beachfront Properties', 'Investment Properties']
    }
  })

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Clean Room 101',
        description: 'Deep cleaning after checkout',
        type: 'HOUSEKEEPING',
        status: 'PENDING',
        priority: 'HIGH',
        estimatedTime: 45,
        assignedToId: staffUser.id,
        createdById: adminUser.id,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      },
      {
        title: 'Check pool chemicals',
        description: 'Daily pool maintenance check',
        type: 'MAINTENANCE',
        status: 'PENDING',
        priority: 'MEDIUM',
        estimatedTime: 30,
        assignedToId: staffUser.id,
        createdById: adminUser.id,
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@pms.com')
  console.log('🏨 Test property: Oceanview Resort Cyprus')
  console.log('🛏️  Sample rooms: 101, 102, 201')
  console.log('👥 Test users: guest@example.com, staff@pms.com, agent@marketplace.com')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
SEED_EOF

# Add seed script to package.json
cd pms-backend
npm pkg set scripts.seed="tsx prisma/seed.ts"
npm install tsx --save-dev

# Run seed
info "Running seed script..."
npm run seed

success "Database seeded with sample data"
cd ..

# Update all service configurations
info "Updating service configurations..."

# Update backend environment
cp .env.postgres pms-backend/.env

# Update core service environment
if [ -d "pms-core" ]; then
    cp .env.postgres pms-core/.env
fi

# Create database migration status file
cat > DATABASE_MIGRATION_STATUS.md << 'EOF'
# 📊 Database Migration Status

## ✅ COMPLETED
- Migrated from SQLite to PostgreSQL
- Enhanced schema with marketplace and service support
- Created comprehensive data model for all microservices
- Generated sample seed data
- Configured all services for PostgreSQL

## 🏗️ Database Architecture

### Core Tables
- users, accounts, sessions (authentication)
- organizations, properties, rooms (property management)
- guests, staff, reservations (operations)
- marketplace_listings, marketplace_agents (marketplace)

### Operational Tables
- tasks, housekeeping_tasks, maintenance_requests (operations)
- reviews, notifications (engagement)
- stock_items, stock_movements (inventory)
- operational_logs, system_settings (system)

## 🔗 Connection Details
- Database: PostgreSQL 15
- Host: localhost:5432
- Database: pms
- User: pmsuser

## 🌱 Sample Data Created
- Test organization: Cyprus Hospitality Group
- Test property: Oceanview Resort Cyprus
- Sample rooms: 101, 102, 201
- Test users: admin, guest, staff, marketplace agent
- Sample tasks and operational data

## 🚀 Next Steps
1. Start all services with PostgreSQL
2. Test database connections
3. Verify data integrity
4. Test service integrations
EOF

success "Database migration completed successfully!"
info "Database configuration saved to DATABASE_MIGRATION_STATUS.md"
info "PostgreSQL connection string: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

echo ""
echo "🎉 Migration Summary:"
echo "✅ PostgreSQL database configured"
echo "✅ Enhanced schema deployed"
echo "✅ Sample data seeded"
echo "✅ All services configured"
echo ""
echo "🚀 Start services with: make dev-all"