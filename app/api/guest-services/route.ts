import { NextRequest, NextResponse } from 'next/server'

// Mock service requests data store
let serviceRequests = [
  {
    id: 'SR-001',
    type: 'Housekeeping',
    title: 'Extra towels request',
    status: 'completed',
    requestedAt: '2024-12-30 14:30',
    completedAt: '2024-12-30 15:15',
    guestId: 'guest-001',
    roomNumber: '205'
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const guestId = searchParams.get('guestId')

  let filteredRequests = serviceRequests
  if (guestId) {
    filteredRequests = serviceRequests.filter(req => req.guestId === guestId)
  }

  return NextResponse.json({
    success: true,
    data: filteredRequests
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, action, guestId = 'guest-001', roomNumber = '205', details } = body

    if (action === 'request-service') {
      const newRequest = {
        id: `SR-${Date.now()}`,
        type,
        title: `${type} request`,
        status: 'requested',
        requestedAt: new Date().toISOString().split('T').join(' ').slice(0, 16),
        guestId,
        roomNumber,
        details
      }

      serviceRequests.push(newRequest)

      return NextResponse.json({
        success: true,
        message: `${type} request submitted successfully`,
        data: newRequest
      })
    }

    if (action === 'digital-key') {
      return NextResponse.json({
        success: true,
        message: 'Digital key activated! Check your mobile app.',
        data: {
          keyId: `KEY-${Date.now()}`,
          roomNumber,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          activatedAt: new Date().toISOString()
        }
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Guest service error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process guest service request' },
      { status: 500 }
    )
  }
}