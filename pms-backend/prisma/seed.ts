import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log('Prisma client initialized:', !!prisma)

async function main() {
  console.log('🌱 Seeding database...')

  // Skip system settings for now (model not available in current schema)

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
  await prisma.room.createMany({
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
        id: 'room-207',
        number: '207',
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
  console.log('🛏️  Sample rooms: 101, 102, 207')
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