import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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
      organizationId: organization.id
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
        propertyId: property.id
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@pms.com')
  console.log('🏨 Test property: Oceanview Resort Cyprus')
  console.log('🛏️  Sample rooms: 101, 102, 207')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })