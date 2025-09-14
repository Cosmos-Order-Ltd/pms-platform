import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Simulate system health check
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: '15 days 8 hours',
    version: '2.1.0',
    environment: 'production',
    metrics: {
      cpu: Math.random() * 30 + 40, // Random between 40-70%
      memory: Math.random() * 20 + 60, // Random between 60-80%
      diskSpace: Math.random() * 15 + 75, // Random between 75-90%
      activeUsers: Math.floor(Math.random() * 50) + 100,
      apiRequestsPerMinute: Math.floor(Math.random() * 500) + 200
    },
    database: {
      status: 'connected',
      responseTime: Math.floor(Math.random() * 20) + 10, // 10-30ms
      activeConnections: Math.floor(Math.random() * 15) + 20,
      lastBackup: '2024-12-30 06:00:00'
    },
    services: [
      {
        name: 'Web Server',
        status: 'running',
        responseTime: Math.floor(Math.random() * 100) + 100,
        lastCheck: new Date().toISOString().split('T').join(' ').slice(0, 16)
      },
      {
        name: 'Database',
        status: 'running',
        responseTime: Math.floor(Math.random() * 20) + 10,
        lastCheck: new Date().toISOString().split('T').join(' ').slice(0, 16)
      },
      {
        name: 'Email Service',
        status: 'running',
        responseTime: Math.floor(Math.random() * 200) + 200,
        lastCheck: new Date().toISOString().split('T').join(' ').slice(0, 16)
      },
      {
        name: 'Payment Gateway',
        status: 'running',
        responseTime: Math.floor(Math.random() * 200) + 300,
        lastCheck: new Date().toISOString().split('T').join(' ').slice(0, 16)
      },
      {
        name: 'Channel Manager',
        status: 'running',
        responseTime: Math.floor(Math.random() * 100) + 150,
        lastCheck: new Date().toISOString().split('T').join(' ').slice(0, 16)
      }
    ]
  }

  return NextResponse.json({
    success: true,
    data: healthData
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { action?: string }
    const { action } = body

    if (action === 'refresh') {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      return NextResponse.json({
        success: true,
        message: 'System health data refreshed successfully',
        refreshedAt: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('System health error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process health check' },
      { status: 500 }
    )
  }
}