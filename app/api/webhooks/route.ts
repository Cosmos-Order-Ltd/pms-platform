import { NextRequest, NextResponse } from 'next/server'

interface RetryPolicy {
  maxRetries: number
  backoffStrategy: string
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  isActive: boolean
  secret: string
  retryPolicy: RetryPolicy
  lastTriggered: string
  successRate: number
  totalDeliveries: number
}

interface CreateWebhookRequest {
  name?: string
  url?: string
  events?: string[]
  retryPolicy?: RetryPolicy
}

interface UpdateWebhookRequest {
  id?: string
  action?: string
  name?: string
  url?: string
  events?: string[]
  retryPolicy?: RetryPolicy
}

// Mock webhooks data store
const webhooks: Webhook[] = [
  {
    id: 'wh-001',
    name: 'Payment Notifications',
    url: 'https://pms.cyprus-hotels.com/webhooks/payments',
    events: ['payment.completed', 'payment.failed', 'refund.processed'],
    isActive: true,
    secret: 'whsec_abc123def456',
    retryPolicy: { maxRetries: 3, backoffStrategy: 'exponential' },
    lastTriggered: '2024-12-30 15:45',
    successRate: 98.7,
    totalDeliveries: 2340
  },
  {
    id: 'wh-002',
    name: 'Reservation Updates',
    url: 'https://channel-manager.booking.com/webhook',
    events: ['reservation.created', 'reservation.modified', 'reservation.cancelled'],
    isActive: true,
    secret: 'whsec_def789ghi012',
    retryPolicy: { maxRetries: 5, backoffStrategy: 'linear' },
    lastTriggered: '2024-12-30 14:30',
    successRate: 95.2,
    totalDeliveries: 1890
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: webhooks
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateWebhookRequest
    const { name, url, events = [], retryPolicy = { maxRetries: 3, backoffStrategy: 'exponential' } } = body

    // Generate webhook secret
    const secret = `whsec_${Math.random().toString(36).substring(2, 18)}`

    const newWebhook = {
      id: `wh-${Date.now()}`,
      name: name || 'Unnamed Webhook',
      url: url || '',
      events,
      isActive: true,
      secret,
      retryPolicy,
      lastTriggered: '',
      successRate: 0,
      totalDeliveries: 0
    }

    webhooks.push(newWebhook)

    return NextResponse.json({
      success: true,
      message: 'Webhook created successfully',
      data: newWebhook
    })

  } catch (error) {
    console.error('Webhook creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create webhook' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as UpdateWebhookRequest
    const { id, action, ...updateData } = body

    const webhookIndex = webhooks.findIndex(webhook => webhook.id === id)
    if (webhookIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Webhook not found' },
        { status: 404 }
      )
    }

    if (action === 'toggle-status') {
      const webhook = webhooks[webhookIndex]
      if (webhook) {
        webhook.isActive = !webhook.isActive
        return NextResponse.json({
          success: true,
          message: `Webhook ${webhook.isActive ? 'enabled' : 'disabled'} successfully`,
          data: webhook
        })
      }
    }

    if (action === 'test') {
      const webhook = webhooks[webhookIndex]
      if (webhook) {
        // Simulate webhook test
        await new Promise(resolve => setTimeout(resolve, 2000))

        webhook.lastTriggered = new Date().toISOString().split('T').join(' ').slice(0, 16)

        return NextResponse.json({
          success: true,
          message: 'Webhook test completed successfully',
          data: {
            testResult: {
              status: 'success',
              responseTime: '245ms',
              statusCode: 200,
              timestamp: webhook.lastTriggered
            }
          }
        })
      }
    }

    // Update webhook data
    const webhook = webhooks[webhookIndex]
    if (webhook) {
      webhooks[webhookIndex] = { ...webhook, ...updateData }

      return NextResponse.json({
        success: true,
        message: 'Webhook updated successfully',
        data: webhooks[webhookIndex]
      })
    }

  } catch (error) {
    console.error('Webhook update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update webhook' },
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
        { success: false, message: 'Webhook ID is required' },
        { status: 400 }
      )
    }

    const webhookIndex = webhooks.findIndex(webhook => webhook.id === id)
    if (webhookIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Webhook not found' },
        { status: 404 }
      )
    }

    webhooks.splice(webhookIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully'
    })

  } catch (error) {
    console.error('Webhook deletion error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete webhook' },
      { status: 500 }
    )
  }
}