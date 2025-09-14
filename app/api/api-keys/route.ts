import { NextRequest, NextResponse } from 'next/server'

interface RateLimit {
  requests: number
  window: string
}

interface ApiKey {
  id: string
  name: string
  key: string
  description: string
  permissions: string[]
  rateLimit: RateLimit
  isActive: boolean
  createdAt: string
  lastUsed: string
  totalRequests: number
  owner: string
  expiresAt: string
}

interface CreateApiKeyRequest {
  name: string
  description: string
  permissions?: string[]
  owner: string
  expiresAt: string
}

interface UpdateApiKeyRequest {
  id: string
  action?: string
  name?: string
  description?: string
  permissions?: string[]
  owner?: string
  expiresAt?: string
}

// Mock API keys data store
const apiKeys: ApiKey[] = [
  {
    id: 'key-001',
    name: 'Channel Manager Integration',
    key: 'pms_live_sk_1234567890abcdef',
    description: 'Key for Booking.com channel manager integration',
    permissions: ['reservations:read', 'reservations:write', 'rooms:read', 'rates:write'],
    rateLimit: { requests: 1000, window: 'hour' },
    isActive: true,
    createdAt: '2024-11-15',
    lastUsed: '2024-12-30 14:30',
    totalRequests: 45230,
    owner: 'Channel Manager Service',
    expiresAt: '2025-11-15'
  },
  {
    id: 'key-002',
    name: 'Mobile App API',
    key: 'pms_live_sk_abcdef1234567890',
    description: 'API key for mobile staff application',
    permissions: ['tasks:read', 'tasks:write', 'housekeeping:read', 'maintenance:write'],
    rateLimit: { requests: 500, window: 'hour' },
    isActive: true,
    createdAt: '2024-11-20',
    lastUsed: '2024-12-30 15:15',
    totalRequests: 12850,
    owner: 'Mobile Team',
    expiresAt: '2025-11-20'
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: apiKeys.map(key => ({
      ...key,
      key: key.key.substring(0, 20) + '...' // Mask the actual key
    }))
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateApiKeyRequest
    const { name, description, permissions = [], owner, expiresAt } = body

    // Generate a new API key
    const newKey = `pms_live_sk_${Math.random().toString(36).substring(2, 18)}${Date.now().toString(36)}`

    const newApiKey = {
      id: `key-${Date.now()}`,
      name,
      key: newKey,
      description,
      permissions,
      rateLimit: { requests: 100, window: 'hour' },
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0] || new Date().toDateString(),
      lastUsed: 'Never',
      totalRequests: 0,
      owner,
      expiresAt
    }

    apiKeys.push(newApiKey)

    return NextResponse.json({
      success: true,
      message: 'API key created successfully',
      data: newApiKey
    })

  } catch (error) {
    console.error('API key creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as UpdateApiKeyRequest
    const { id, action, ...updateData } = body

    const keyIndex = apiKeys.findIndex(key => key.id === id)
    if (keyIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'API key not found' },
        { status: 404 }
      )
    }

    if (action === 'toggle-status') {
      const apiKey = apiKeys[keyIndex]
      if (apiKey) {
        apiKey.isActive = !apiKey.isActive
        return NextResponse.json({
          success: true,
          message: `API key ${apiKey.isActive ? 'enabled' : 'disabled'} successfully`,
          data: apiKey
        })
      }
    }

    if (action === 'regenerate') {
      const apiKey = apiKeys[keyIndex]
      if (apiKey) {
        const newKey = `pms_live_sk_${Math.random().toString(36).substring(2, 18)}${Date.now().toString(36)}`
        apiKey.key = newKey
        apiKey.totalRequests = 0
        apiKey.lastUsed = 'Never'

        return NextResponse.json({
          success: true,
          message: 'API key regenerated successfully',
          data: apiKey
        })
      }
    }

    // Update API key data
    const apiKey = apiKeys[keyIndex]
    if (apiKey) {
      apiKeys[keyIndex] = { ...apiKey, ...updateData }

      return NextResponse.json({
        success: true,
        message: 'API key updated successfully',
        data: apiKeys[keyIndex]
      })
    }

  } catch (error) {
    console.error('API key update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update API key' },
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
        { success: false, message: 'API key ID is required' },
        { status: 400 }
      )
    }

    const keyIndex = apiKeys.findIndex(key => key.id === id)
    if (keyIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'API key not found' },
        { status: 404 }
      )
    }

    apiKeys.splice(keyIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })

  } catch (error) {
    console.error('API key deletion error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}