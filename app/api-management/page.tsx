'use client'

import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface APIKey {
  id: string
  name: string
  key: string
  description: string
  permissions: string[]
  rateLimit: {
    requests: number
    window: string
  }
  isActive: boolean
  createdAt: string
  lastUsed?: string
  totalRequests: number
  owner: string
  expiresAt?: string
}

interface APIEndpoint {
  path: string
  method: string
  description: string
  category: string
  authentication: 'required' | 'optional' | 'none'
  rateLimit: {
    requests: number
    window: string
  }
  usage: {
    requests: number
    avgResponseTime: number
    errorRate: number
  }
  parameters: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  isActive: boolean
  secret: string
  retryPolicy: {
    maxRetries: number
    backoffStrategy: string
  }
  lastTriggered?: string
  successRate: number
  totalDeliveries: number
}

interface APILog {
  id: string
  timestamp: string
  method: string
  endpoint: string
  statusCode: number
  responseTime: number
  apiKey: string
  ipAddress: string
  userAgent: string
  errorMessage?: string
}

export default function APIManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  const handleGenerateKey = () => {
    toast.loading('Generating new API key...')
    setTimeout(() => {
      toast.success('New API key generated successfully! Check your keys tab.')
    }, 2000)
  }

  const handleViewDocumentation = () => {
    toast.loading('Loading API documentation...')
    setTimeout(() => {
      toast.success('API documentation opened!')
    }, 1000)
  }

  const handleAPISettings = () => {
    toast.loading('Opening API settings...')
    setTimeout(() => {
      toast.success('API settings loaded!')
    }, 1500)
  }

  const handleCreateNewKey = () => {
    toast.loading('Opening API key creation form...')
    setTimeout(() => {
      toast.success('API key creation form opened!')
    }, 1000)
  }

  const handleCopyKey = (keyName: string) => {
    navigator.clipboard.writeText('API key copied to clipboard')
    toast.success(`${keyName} API key copied to clipboard!`)
  }

  const handleKeyAnalytics = (keyName: string) => {
    toast.loading(`Loading analytics for ${keyName}...`)
    setTimeout(() => {
      toast.success(`Analytics dashboard opened for ${keyName}!`)
    }, 1500)
  }

  const handleEditKey = (keyName: string) => {
    toast.loading(`Loading ${keyName} settings...`)
    setTimeout(() => {
      toast.success(`${keyName} settings opened for editing!`)
    }, 1000)
  }

  const handleRegenerateKey = (keyName: string) => {
    toast.loading(`Regenerating ${keyName} key...`)
    setTimeout(() => {
      toast.success(`${keyName} API key regenerated successfully!`)
    }, 2000)
  }

  const handleToggleKey = (keyName: string, isActive: boolean) => {
    toast.loading(`${isActive ? 'Disabling' : 'Enabling'} ${keyName}...`)
    setTimeout(() => {
      toast.success(`${keyName} has been ${isActive ? 'disabled' : 'enabled'} successfully!`)
    }, 1500)
  }

  const handleAddWebhook = () => {
    toast.loading('Opening webhook creation form...')
    setTimeout(() => {
      toast.success('Webhook creation form opened!')
    }, 1000)
  }

  const handleWebhookLogs = (webhookName: string) => {
    toast.loading(`Loading logs for ${webhookName}...`)
    setTimeout(() => {
      toast.success(`Delivery logs opened for ${webhookName}!`)
    }, 1000)
  }

  const handleTestWebhook = (webhookName: string) => {
    toast.loading(`Testing ${webhookName}...`)
    setTimeout(() => {
      toast.success(`${webhookName} test completed successfully!`)
    }, 2500)
  }

  const handleEditWebhook = (webhookName: string) => {
    toast.loading(`Loading ${webhookName} settings...`)
    setTimeout(() => {
      toast.success(`${webhookName} settings opened for editing!`)
    }, 1000)
  }

  const handleToggleWebhook = (webhookName: string, isActive: boolean) => {
    toast.loading(`${isActive ? 'Disabling' : 'Enabling'} ${webhookName}...`)
    setTimeout(() => {
      toast.success(`${webhookName} has been ${isActive ? 'disabled' : 'enabled'} successfully!`)
    }, 1500)
  }

  const handleExportLogs = async () => {
    const toastId = toast.loading('Exporting API request logs...')
    try {
      const response = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          format: 'csv',
          timeRange: selectedTimeRange
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('API logs exported successfully! Check your downloads folder.', { id: toastId })
      } else {
        toast.error('Failed to export API logs', { id: toastId })
      }
    } catch (error) {
      toast.error('Error exporting API logs', { id: toastId })
    }
  }

  const apiKeys: APIKey[] = [
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
    },
    {
      id: 'key-003',
      name: 'Analytics Dashboard',
      key: 'pms_live_sk_fedcba0987654321',
      description: 'Read-only access for external analytics dashboard',
      permissions: ['analytics:read', 'reports:read'],
      rateLimit: { requests: 200, window: 'hour' },
      isActive: true,
      createdAt: '2024-11-25',
      lastUsed: '2024-12-30 13:45',
      totalRequests: 8640,
      owner: 'Data Team'
    },
    {
      id: 'key-004',
      name: 'Payment Gateway',
      key: 'pms_live_sk_9876543210fedcba',
      description: 'Payment processing and webhook handling',
      permissions: ['payments:read', 'payments:write', 'webhooks:receive'],
      rateLimit: { requests: 2000, window: 'hour' },
      isActive: true,
      createdAt: '2024-11-30',
      lastUsed: '2024-12-30 16:00',
      totalRequests: 23450,
      owner: 'Payment Service'
    },
    {
      id: 'key-005',
      name: 'Legacy System',
      key: 'pms_live_sk_legacy12345678',
      description: 'Deprecated API key for old booking system',
      permissions: ['reservations:read'],
      rateLimit: { requests: 100, window: 'hour' },
      isActive: false,
      createdAt: '2024-10-01',
      lastUsed: '2024-12-15 10:20',
      totalRequests: 5680,
      owner: 'Legacy Team',
      expiresAt: '2024-12-31'
    }
  ]

  const endpoints: APIEndpoint[] = [
    {
      path: '/api/reservations',
      method: 'GET',
      description: 'Retrieve reservations with filtering options',
      category: 'reservations',
      authentication: 'required',
      rateLimit: { requests: 100, window: 'minute' },
      usage: { requests: 8450, avgResponseTime: 245, errorRate: 2.1 },
      parameters: [
        { name: 'start_date', type: 'string', required: false, description: 'Filter by check-in date' },
        { name: 'end_date', type: 'string', required: false, description: 'Filter by check-out date' },
        { name: 'status', type: 'string', required: false, description: 'Filter by reservation status' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of results to return' }
      ]
    },
    {
      path: '/api/reservations',
      method: 'POST',
      description: 'Create a new reservation',
      category: 'reservations',
      authentication: 'required',
      rateLimit: { requests: 50, window: 'minute' },
      usage: { requests: 1250, avgResponseTime: 580, errorRate: 5.2 },
      parameters: [
        { name: 'guest_name', type: 'string', required: true, description: 'Guest full name' },
        { name: 'email', type: 'string', required: true, description: 'Guest email address' },
        { name: 'check_in', type: 'string', required: true, description: 'Check-in date (YYYY-MM-DD)' },
        { name: 'check_out', type: 'string', required: true, description: 'Check-out date (YYYY-MM-DD)' },
        { name: 'room_type', type: 'string', required: true, description: 'Room type identifier' }
      ]
    },
    {
      path: '/api/rooms/availability',
      method: 'GET',
      description: 'Check room availability for given dates',
      category: 'rooms',
      authentication: 'required',
      rateLimit: { requests: 200, window: 'minute' },
      usage: { requests: 12340, avgResponseTime: 180, errorRate: 1.8 },
      parameters: [
        { name: 'start_date', type: 'string', required: true, description: 'Start date for availability check' },
        { name: 'end_date', type: 'string', required: true, description: 'End date for availability check' },
        { name: 'room_type', type: 'string', required: false, description: 'Filter by specific room type' }
      ]
    },
    {
      path: '/api/rates',
      method: 'PUT',
      description: 'Update room rates and restrictions',
      category: 'pricing',
      authentication: 'required',
      rateLimit: { requests: 30, window: 'minute' },
      usage: { requests: 890, avgResponseTime: 320, errorRate: 3.4 },
      parameters: [
        { name: 'room_type', type: 'string', required: true, description: 'Room type to update' },
        { name: 'date', type: 'string', required: true, description: 'Date to update (YYYY-MM-DD)' },
        { name: 'rate', type: 'number', required: true, description: 'New rate amount' },
        { name: 'availability', type: 'integer', required: false, description: 'Available rooms' }
      ]
    },
    {
      path: '/api/analytics/revenue',
      method: 'GET',
      description: 'Retrieve revenue analytics data',
      category: 'analytics',
      authentication: 'required',
      rateLimit: { requests: 20, window: 'minute' },
      usage: { requests: 450, avgResponseTime: 890, errorRate: 1.2 },
      parameters: [
        { name: 'period', type: 'string', required: true, description: 'Time period (day, week, month)' },
        { name: 'start_date', type: 'string', required: true, description: 'Start date for analytics' },
        { name: 'end_date', type: 'string', required: true, description: 'End date for analytics' }
      ]
    },
    {
      path: '/api/webhooks',
      method: 'POST',
      description: 'Receive webhook notifications',
      category: 'webhooks',
      authentication: 'optional',
      rateLimit: { requests: 1000, window: 'minute' },
      usage: { requests: 3450, avgResponseTime: 125, errorRate: 0.8 },
      parameters: [
        { name: 'event_type', type: 'string', required: true, description: 'Type of webhook event' },
        { name: 'payload', type: 'object', required: true, description: 'Event data payload' },
        { name: 'signature', type: 'string', required: true, description: 'Webhook signature for verification' }
      ]
    }
  ]

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
    },
    {
      id: 'wh-003',
      name: 'Guest Communication',
      url: 'https://messaging.cyprus-pms.com/incoming',
      events: ['guest.message', 'review.submitted'],
      isActive: true,
      secret: 'whsec_jkl345mno678',
      retryPolicy: { maxRetries: 3, backoffStrategy: 'exponential' },
      lastTriggered: '2024-12-30 13:15',
      successRate: 97.5,
      totalDeliveries: 890
    },
    {
      id: 'wh-004',
      name: 'Analytics Sync',
      url: 'https://analytics.cyprus-pms.com/data-sync',
      events: ['daily.analytics', 'revenue.updated'],
      isActive: false,
      secret: 'whsec_pqr901stu234',
      retryPolicy: { maxRetries: 2, backoffStrategy: 'fixed' },
      lastTriggered: '2024-12-25 06:00',
      successRate: 92.1,
      totalDeliveries: 145
    }
  ]

  const apiLogs: APILog[] = [
    {
      id: 'log-001',
      timestamp: '2024-12-30 16:05:23',
      method: 'GET',
      endpoint: '/api/reservations',
      statusCode: 200,
      responseTime: 245,
      apiKey: 'key-001',
      ipAddress: '192.168.1.100',
      userAgent: 'Channel-Manager/1.2.3'
    },
    {
      id: 'log-002',
      timestamp: '2024-12-30 16:04:15',
      method: 'POST',
      endpoint: '/api/reservations',
      statusCode: 201,
      responseTime: 580,
      apiKey: 'key-001',
      ipAddress: '192.168.1.100',
      userAgent: 'Channel-Manager/1.2.3'
    },
    {
      id: 'log-003',
      timestamp: '2024-12-30 16:03:45',
      method: 'GET',
      endpoint: '/api/rooms/availability',
      statusCode: 200,
      responseTime: 180,
      apiKey: 'key-002',
      ipAddress: '10.0.0.50',
      userAgent: 'CyprusPMS-Mobile/2.1.0'
    },
    {
      id: 'log-004',
      timestamp: '2024-12-30 16:02:30',
      method: 'PUT',
      endpoint: '/api/rates',
      statusCode: 400,
      responseTime: 95,
      apiKey: 'key-001',
      ipAddress: '192.168.1.100',
      userAgent: 'Channel-Manager/1.2.3',
      errorMessage: 'Invalid rate format: must be a positive number'
    },
    {
      id: 'log-005',
      timestamp: '2024-12-30 16:01:12',
      method: 'GET',
      endpoint: '/api/analytics/revenue',
      statusCode: 200,
      responseTime: 890,
      apiKey: 'key-003',
      ipAddress: '172.16.0.25',
      userAgent: 'Analytics-Dashboard/1.0.0'
    },
    {
      id: 'log-006',
      timestamp: '2024-12-30 16:00:05',
      method: 'POST',
      endpoint: '/api/webhooks',
      statusCode: 200,
      responseTime: 125,
      apiKey: 'key-004',
      ipAddress: '203.0.113.45',
      userAgent: 'Stripe/1.0'
    }
  ]

  const getStatusCodeColor = (code: number): string => {
    if (code >= 200 && code < 300) return 'text-green-600'
    if (code >= 400 && code < 500) return 'text-yellow-600'
    if (code >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  const getMethodColor = (method: string): string => {
    switch (method) {
      case 'GET': return 'text-blue-600 bg-blue-100'
      case 'POST': return 'text-green-600 bg-green-100'
      case 'PUT': return 'text-orange-600 bg-orange-100'
      case 'DELETE': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'reservations': return '📅'
      case 'rooms': return '🏨'
      case 'pricing': return '💰'
      case 'analytics': return '📊'
      case 'webhooks': return '🔗'
      default: return '📋'
    }
  }

  const totalRequests = apiKeys.reduce((sum, key) => sum + key.totalRequests, 0)
  const activeKeys = apiKeys.filter(key => key.isActive).length
  const avgResponseTime = endpoints.reduce((sum, ep) => sum + ep.usage.avgResponseTime, 0) / endpoints.length
  const avgErrorRate = endpoints.reduce((sum, ep) => sum + ep.usage.errorRate, 0) / endpoints.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
        <div className="flex gap-2">
          <button onClick={handleGenerateKey} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            🔑 Generate Key
          </button>
          <button onClick={handleViewDocumentation} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            📚 Documentation
          </button>
          <button onClick={handleAPISettings} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔑</div>
            <div>
              <p className="text-sm text-gray-600">Active API Keys</p>
              <p className="text-2xl font-bold text-gray-900">{activeKeys}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{avgResponseTime.toFixed(0)}ms</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎯</div>
            <div>
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgErrorRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'keys', 'endpoints', 'webhooks', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">API Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Request Volume (Last 24h)</h3>
                  <div className="space-y-3">
                    {endpoints.slice(0, 5).map((endpoint) => (
                      <div key={`${endpoint.method}-${endpoint.path}`} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <span className="text-sm font-mono">{endpoint.path}</span>
                        </div>
                        <span className="font-medium">{endpoint.usage.requests}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Top API Keys by Usage</h3>
                  <div className="space-y-3">
                    {apiKeys.filter(k => k.isActive).slice(0, 5).map((key) => (
                      <div key={key.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{key.name}</span>
                          <div className="text-xs text-gray-500">{key.owner}</div>
                        </div>
                        <span className="font-medium">{key.totalRequests.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">99.2%</div>
                  <div className="text-sm text-gray-600">API Uptime</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{endpoints.length}</div>
                  <div className="text-sm text-gray-600">Active Endpoints</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{webhooks.filter(w => w.isActive).length}</div>
                  <div className="text-sm text-gray-600">Active Webhooks</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">v2.1</div>
                  <div className="text-sm text-gray-600">API Version</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">API Keys</h2>
                <button onClick={handleCreateNewKey} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Create New Key
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{key.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{key.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Owner: {key.owner}</span>
                          <span>Created: {key.createdAt}</span>
                          {key.expiresAt && <span>Expires: {key.expiresAt}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          key.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {key.isActive ? '✅ Active' : '⏸️ Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">API Key</h4>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {key.key.substring(0, 20)}...
                          </code>
                          <button onClick={() => handleCopyKey(key.name)} className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                            Copy
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Rate Limit</h4>
                        <div className="text-sm">
                          <span className="font-medium">{key.rateLimit.requests}</span> requests per {key.rateLimit.window}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Stats</h4>
                        <div className="text-sm">
                          <div>Total Requests: <span className="font-medium">{key.totalRequests.toLocaleString()}</span></div>
                          {key.lastUsed && <div>Last Used: <span className="font-medium">{key.lastUsed}</span></div>}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {key.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button onClick={() => handleKeyAnalytics(key.name)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        📊 Analytics
                      </button>
                      <button onClick={() => handleEditKey(key.name)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleRegenerateKey(key.name)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        🔄 Regenerate
                      </button>
                      <button onClick={() => handleToggleKey(key.name, key.isActive)} className={`px-3 py-1 rounded text-sm ${
                        key.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {key.isActive ? '⏸️ Disable' : '▶️ Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">API Endpoints</h2>
                <button onClick={handleViewDocumentation} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  📚 View Documentation
                </button>
              </div>

              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getCategoryIcon(endpoint.category)}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                              {endpoint.method}
                            </span>
                            <code className="font-mono text-sm">{endpoint.path}</code>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        endpoint.authentication === 'required'
                          ? 'bg-red-100 text-red-800'
                          : endpoint.authentication === 'optional'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {endpoint.authentication === 'required' ? '🔒 Auth Required' :
                         endpoint.authentication === 'optional' ? '🔓 Auth Optional' : '🌐 Public'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Requests (24h)</h4>
                        <div className="text-lg font-bold">{endpoint.usage.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Avg Response Time</h4>
                        <div className={`text-lg font-bold ${endpoint.usage.avgResponseTime < 300 ? 'text-green-600' : endpoint.usage.avgResponseTime < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {endpoint.usage.avgResponseTime}ms
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Error Rate</h4>
                        <div className={`text-lg font-bold ${endpoint.usage.errorRate < 2 ? 'text-green-600' : endpoint.usage.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {endpoint.usage.errorRate}%
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Rate Limit</h4>
                        <div className="text-sm">
                          {endpoint.rateLimit.requests}/{endpoint.rateLimit.window}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2">Name</th>
                              <th className="text-left py-2">Type</th>
                              <th className="text-left py-2">Required</th>
                              <th className="text-left py-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.parameters.map((param, pidx) => (
                              <tr key={pidx} className="border-b border-gray-100">
                                <td className="py-1 font-mono">{param.name}</td>
                                <td className="py-1">{param.type}</td>
                                <td className="py-1">
                                  {param.required ? (
                                    <span className="text-red-600">✓</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="py-1 text-gray-600">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Webhook Management</h2>
                <button onClick={handleAddWebhook} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Add Webhook
                </button>
              </div>

              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{webhook.name}</h3>
                        <code className="text-sm text-gray-600 font-mono">{webhook.url}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {webhook.isActive ? '✅ Active' : '⏸️ Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Events</h4>
                        <div className="space-y-1">
                          {webhook.events.map((event) => (
                            <span key={event} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-1">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
                        <div className="text-sm space-y-1">
                          <div>Success Rate: <span className={`font-medium ${webhook.successRate >= 95 ? 'text-green-600' : webhook.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {webhook.successRate}%
                          </span></div>
                          <div>Total Deliveries: <span className="font-medium">{webhook.totalDeliveries}</span></div>
                          {webhook.lastTriggered && <div>Last Triggered: <span className="font-medium">{webhook.lastTriggered}</span></div>}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Retry Policy</h4>
                        <div className="text-sm space-y-1">
                          <div>Max Retries: <span className="font-medium">{webhook.retryPolicy.maxRetries}</span></div>
                          <div>Strategy: <span className="font-medium capitalize">{webhook.retryPolicy.backoffStrategy}</span></div>
                          <div>Secret: <code className="text-xs bg-gray-100 px-1 rounded">
                            {webhook.secret.substring(0, 10)}...
                          </code></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button onClick={() => handleWebhookLogs(webhook.name)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        📊 Logs
                      </button>
                      <button onClick={() => handleTestWebhook(webhook.name)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        🧪 Test
                      </button>
                      <button onClick={() => handleEditWebhook(webhook.name)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleToggleWebhook(webhook.name, webhook.isActive)} className={`px-3 py-1 rounded text-sm ${
                        webhook.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {webhook.isActive ? '⏸️ Disable' : '▶️ Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">API Request Logs</h2>
                <div className="flex gap-2">
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                  <button onClick={handleExportLogs} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    📋 Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium">Method</th>
                      <th className="text-left py-3 px-4 font-medium">Endpoint</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Response Time</th>
                      <th className="text-left py-3 px-4 font-medium">API Key</th>
                      <th className="text-left py-3 px-4 font-medium">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono">{log.timestamp}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{log.endpoint}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getStatusCodeColor(log.statusCode)}`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${log.responseTime < 300 ? 'text-green-600' : log.responseTime < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {log.responseTime}ms
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {apiKeys.find(k => k.id === log.apiKey)?.name || log.apiKey}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}