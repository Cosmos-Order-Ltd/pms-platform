import { NextRequest, NextResponse } from 'next/server'

// Mock roles data store
const roles = [
  {
    id: 'role-001',
    name: 'System Administrator',
    description: 'Full system access and management capabilities',
    permissions: ['system:admin', 'users:manage', 'properties:manage', 'analytics:view', 'audit:view'],
    userCount: 1,
    isSystemRole: true
  },
  {
    id: 'role-002',
    name: 'Property Manager',
    description: 'Manage property operations and staff',
    permissions: ['reservations:manage', 'staff:manage', 'operations:manage', 'analytics:view'],
    userCount: 2,
    isSystemRole: false
  },
  {
    id: 'role-003',
    name: 'Front Desk Manager',
    description: 'Manage front desk operations and guest services',
    permissions: ['reservations:manage', 'guests:manage', 'rooms:manage', 'payments:process'],
    userCount: 3,
    isSystemRole: false
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: roles
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions = [] } = body

    const newRole = {
      id: `role-${Date.now()}`,
      name,
      description,
      permissions,
      userCount: 0,
      isSystemRole: false
    }

    roles.push(newRole)

    return NextResponse.json({
      success: true,
      message: 'Role created successfully',
      data: newRole
    })

  } catch (error) {
    console.error('Role creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create role' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const roleIndex = roles.findIndex(role => role.id === id)
    if (roleIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      )
    }

    if (roles[roleIndex].isSystemRole) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify system roles' },
        { status: 403 }
      )
    }

    roles[roleIndex] = { ...roles[roleIndex], ...updateData }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
      data: roles[roleIndex]
    })

  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update role' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Role ID is required' },
        { status: 400 }
      )
    }

    const roleIndex = roles.findIndex(role => role.id === id)
    if (roleIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      )
    }

    if (roles[roleIndex].isSystemRole) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete system roles' },
        { status: 403 }
      )
    }

    if (roles[roleIndex].userCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete role with assigned users' },
        { status: 409 }
      )
    }

    roles.splice(roleIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    })

  } catch (error) {
    console.error('Role deletion error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete role' },
      { status: 500 }
    )
  }
}