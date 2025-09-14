"use client"

import { useState } from "react"

interface DashboardMetrics {
  rooms: {
    available: number
    occupied: number
    dirty: number
    maintenance: number
    outOfOrder: number
  }
  tasks: {
    pending: number
    inProgress: number
    overdue: number
    completed: number
  }
  maintenance: {
    submitted: number
    inProgress: number
    critical: number
    partsOrdered: number
  }
  staff: {
    onDuty: number
    total: number
    absent: number
    late: number
  }
  inventory: {
    criticalStock: number
    lowStock: number
    reorderNeeded: number
    totalValue: number
  }
}

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: 'maintenance' | 'housekeeping' | 'inventory' | 'staff' | 'guest' | 'system'
  title: string
  message: string
  room?: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  createdAt: string
  acknowledged: boolean
}

const mockMetrics: DashboardMetrics = {
  rooms: {
    available: 18,
    occupied: 25,
    dirty: 6,
    maintenance: 2,
    outOfOrder: 1
  },
  tasks: {
    pending: 12,
    inProgress: 8,
    overdue: 3,
    completed: 24
  },
  maintenance: {
    submitted: 4,
    inProgress: 2,
    critical: 1,
    partsOrdered: 1
  },
  staff: {
    onDuty: 18,
    total: 24,
    absent: 2,
    late: 1
  },
  inventory: {
    criticalStock: 3,
    lowStock: 7,
    reorderNeeded: 5,
    totalValue: 25430
  }
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "critical",
    category: "maintenance",
    title: "Water leak in lobby",
    message: "Main entrance automatic door malfunction creating security issues",
    priority: "urgent",
    createdAt: "2024-01-15T13:45:00Z",
    acknowledged: false
  },
  {
    id: "ALT-002",
    type: "warning",
    category: "inventory",
    title: "Shampoo stock critically low",
    message: "Only 15 bottles remaining - below reorder point of 50",
    priority: "high",
    createdAt: "2024-01-15T12:30:00Z",
    acknowledged: false
  },
  {
    id: "ALT-003",
    type: "critical",
    category: "maintenance",
    title: "HVAC system failure",
    room: "205",
    message: "Guest reported room is too hot, AC not responding",
    priority: "urgent",
    createdAt: "2024-01-15T11:15:00Z",
    acknowledged: true
  },
  {
    id: "ALT-004",
    type: "warning",
    category: "housekeeping",
    title: "Delayed room turnover",
    room: "312",
    message: "Room cleaning delayed, next guest checking in at 3 PM",
    priority: "high",
    createdAt: "2024-01-15T10:45:00Z",
    acknowledged: false
  },
  {
    id: "ALT-005",
    type: "info",
    category: "guest",
    title: "VIP guest arriving",
    room: "401",
    message: "Presidential suite needs special preparation for VIP arrival",
    priority: "medium",
    createdAt: "2024-01-15T09:30:00Z",
    acknowledged: true
  }
]

export default function OperationsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today')
  const [showOnlyUnacknowledged, setShowOnlyUnacknowledged] = useState(true)

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return '🚨'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700'
    }
  }

  const getCategoryIcon = (category: Alert['category']) => {
    switch (category) {
      case 'maintenance':
        return '🔧'
      case 'housekeeping':
        return '🧹'
      case 'inventory':
        return '📦'
      case 'staff':
        return '👥'
      case 'guest':
        return '🏨'
      case 'system':
        return '⚙️'
      default:
        return '📋'
    }
  }

  const filteredAlerts = showOnlyUnacknowledged ?
    mockAlerts.filter(alert => !alert.acknowledged) :
    mockAlerts

  const unacknowledgedAlerts = mockAlerts.filter(alert => !alert.acknowledged).length
  const criticalAlerts = mockAlerts.filter(alert => alert.type === 'critical' && !alert.acknowledged).length
  const occupancyRate = Math.round((mockMetrics.rooms.occupied / (mockMetrics.rooms.occupied + mockMetrics.rooms.available)) * 100)
  const taskCompletionRate = Math.round((mockMetrics.tasks.completed / (mockMetrics.tasks.completed + mockMetrics.tasks.pending + mockMetrics.tasks.inProgress)) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Operations Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Unified overview • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setSelectedTimeframe('today')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === 'today'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedTimeframe('week')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === 'week'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedTimeframe('month')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === 'month'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Month
                </button>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Critical Alerts Banner */}
        {criticalAlerts > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">🚨</div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''} Require Immediate Attention
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Review and acknowledge all critical operational issues.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🏠</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{occupancyRate}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{mockMetrics.rooms.occupied} of {mockMetrics.rooms.occupied + mockMetrics.rooms.available} rooms</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Task Completion</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{taskCompletionRate}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{mockMetrics.tasks.completed} completed today</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Staff On Duty</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{mockMetrics.staff.onDuty}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{mockMetrics.staff.absent} absent, {mockMetrics.staff.late} late</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{unacknowledgedAlerts}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{criticalAlerts} critical</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Status */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Room Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.rooms.available}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Occupied</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.rooms.occupied}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Dirty</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.rooms.dirty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.rooms.maintenance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Out of Order</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.rooms.outOfOrder}</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">New Requests</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.maintenance.submitted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">In Progress</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.maintenance.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Critical</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.maintenance.critical}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Parts Ordered</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mockMetrics.maintenance.partsOrdered}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mockMetrics.tasks.pending}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mockMetrics.tasks.inProgress}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{mockMetrics.tasks.overdue}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mockMetrics.tasks.completed}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showOnlyUnacknowledged}
                      onChange={(e) => setShowOnlyUnacknowledged(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Unacknowledged only</span>
                  </label>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-600 text-3xl mb-2">✅</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No active alerts</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAlerts.map((alert) => (
                      <div key={alert.id} className={`p-4 border-l-4 ${getAlertColor(alert.type)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getAlertIcon(alert.type)}</span>
                            <span className="text-lg">{getCategoryIcon(alert.category)}</span>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium truncate">
                                {alert.title}
                                {alert.room && <span className="ml-1 text-xs">• Room {alert.room}</span>}
                              </h4>
                            </div>
                          </div>
                          {!alert.acknowledged && (
                            <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                              Ack
                            </button>
                          )}
                        </div>
                        <p className="text-sm mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(alert.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            alert.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl mb-2">🧹</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Housekeeping</span>
            </button>

            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl mb-2">🔧</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Maintenance</span>
            </button>

            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl mb-2">👥</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Staff</span>
            </button>

            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl mb-2">📦</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Inventory</span>
            </button>

            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Tasks</span>
            </button>

            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}