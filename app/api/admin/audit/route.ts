import { NextRequest, NextResponse } from 'next/server'

// Mock audit logs data
const auditLogs = [
  {
    id: 'audit-001',
    timestamp: '2024-12-30 16:45:23',
    userId: 'user-001',
    userName: 'Andreas Georgiou',
    action: 'USER_LOGIN',
    resource: 'Authentication',
    details: 'Successful login from admin panel',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true
  },
  {
    id: 'audit-002',
    timestamp: '2024-12-30 16:30:15',
    userId: 'user-002',
    userName: 'Maria Constantinou',
    action: 'RESERVATION_CREATE',
    resource: 'Reservations',
    details: 'Created reservation RSV-12351 for John Smith',
    ipAddress: '192.168.1.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true
  },
  {
    id: 'audit-003',
    timestamp: '2024-12-30 15:45:31',
    userId: 'user-999',
    userName: 'Unknown User',
    action: 'LOGIN_FAILED',
    resource: 'Authentication',
    details: 'Failed login attempt with invalid credentials',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    success: false
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || '24h'
  const action = searchParams.get('action') || 'all'

  // Filter logs based on parameters
  let filteredLogs = auditLogs

  if (action !== 'all') {
    filteredLogs = filteredLogs.filter(log =>
      log.action.toLowerCase().includes(action.toLowerCase())
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      logs: filteredLogs,
      totalCount: filteredLogs.length,
      timeRange,
      generatedAt: new Date().toISOString()
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { action?: string; format?: string; timeRange?: string }
    const { action = 'export', format = 'csv', timeRange = '24h' } = body

    if (action === 'export') {
      const exportData = {
        filename: `audit-logs-${timeRange}-${Date.now()}.${format}`,
        format,
        timeRange,
        totalRecords: auditLogs.length,
        downloadUrl: `/downloads/audit-logs-${timeRange}-${Date.now()}.${format}`,
        generatedAt: new Date().toISOString(),
        size: '2.3 MB'
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        message: 'Audit logs exported successfully',
        data: exportData
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Audit export error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to export audit logs' },
      { status: 500 }
    )
  }
}