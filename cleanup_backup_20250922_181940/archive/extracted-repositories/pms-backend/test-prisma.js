const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Available models:', Object.keys(prisma))
    console.log('Testing connection...')

    // Try to query users table
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()