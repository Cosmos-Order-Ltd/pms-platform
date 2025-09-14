import { NextRequest, NextResponse } from 'next/server'

// Mock user data store
const users = [
  {
    id: 'user-001',
    name: 'Andreas Georgiou',
    email: 'andreas.georgiou@cyprus-hotels.com',
    role: 'System Administrator',
    department: 'IT',
    isActive: true,
    lastLogin: '2024-12-30 16:45',
    createdAt: '2024-11-01',
    permissions: ['system:admin', 'users:manage', 'properties:manage', 'analytics:view'],
    properties: ['all']
  },
  {
    id: 'user-002',
    name: 'Maria Constantinou',
    email: 'maria.constantinou@cyprus-hotels.com',
    role: 'Front Desk Manager',
    department: 'Front Office',
    isActive: true,
    lastLogin: '2024-12-30 15:20',
    createdAt: '2024-11-05',
    permissions: ['reservations:manage', 'guests:manage', 'rooms:manage'],
    properties: ['prop-001']
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: users
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name: string; email: string; role: string; department: string; permissions: string[]; properties: string[] }
    const { name, email, role, department, permissions = [], properties = [] } = body

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      department,
      isActive: true,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0] || new Date().toDateString(),
      permissions,
      properties
    }

    users.push(newUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser
    })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as { id?: string; action?: string; name?: string; email?: string; role?: string; department?: string; permissions?: string[]; properties?: string[] }
    const { id, action, ...updateData } = body

    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    if (action === 'toggle-status') {
      const user = users[userIndex]
      if (user) {
        user.isActive = !user.isActive
        return NextResponse.json({
          success: true,
          message: `User ${user.isActive ? 'enabled' : 'disabled'} successfully`,
          data: user
        })
      }
    }

    // Update user data
    const existingUser = users[userIndex]
    if (existingUser) {
      users[userIndex] = { ...existingUser, ...updateData }

      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        data: users[userIndex]
      })
    }

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
}