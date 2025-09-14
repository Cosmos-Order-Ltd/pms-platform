'use client'

import React, { useState } from 'react'

interface AutomationRule {
  id: string
  name: string
  description: string
  category: 'communication' | 'pricing' | 'operations' | 'marketing' | 'maintenance'
  trigger: {
    event: string
    conditions: {
      field: string
      operator: string
      value: any
    }[]
  }
  actions: {
    type: string
    config: any
  }[]
  isActive: boolean
  priority: number
  lastExecuted?: string
  executionCount: number
  successRate: number
  createdAt: string
}

interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  trigger: any
  actions: any[]
  popularity: number
}

interface AutomationLog {
  id: string
  ruleId: string
  ruleName: string
  trigger: string
  actions: string[]
  status: 'success' | 'failed' | 'partial'
  executedAt: string
  details: string
  affectedRecords: number
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('rules')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const automationRules: AutomationRule[] = [
    {
      id: 'auto-001',
      name: 'Welcome Email for New Reservations',
      description: 'Automatically send welcome email with check-in information when reservation is confirmed',
      category: 'communication',
      trigger: {
        event: 'reservation.confirmed',
        conditions: [
          { field: 'status', operator: 'equals', value: 'confirmed' },
          { field: 'guest.email', operator: 'not_empty', value: null }
        ]
      },
      actions: [
        {
          type: 'send_email',
          config: {
            template: 'welcome_confirmation',
            recipient: 'guest.email',
            variables: ['guest.name', 'reservation.id', 'checkin_date', 'room_number']
          }
        },
        {
          type: 'create_task',
          config: {
            title: 'Prepare welcome package',
            assignee: 'front_desk',
            due_date: 'checkin_date - 1 day'
          }
        }
      ],
      isActive: true,
      priority: 1,
      lastExecuted: '2024-12-30 14:30',
      executionCount: 156,
      successRate: 98.7,
      createdAt: '2024-11-15'
    },
    {
      id: 'auto-002',
      name: 'Dynamic Pricing Adjustment',
      description: 'Adjust room rates based on occupancy levels and demand patterns',
      category: 'pricing',
      trigger: {
        event: 'daily.scheduled',
        conditions: [
          { field: 'occupancy_rate', operator: 'greater_than', value: 85 },
          { field: 'booking_pace', operator: 'greater_than', value: 'average' }
        ]
      },
      actions: [
        {
          type: 'adjust_rates',
          config: {
            room_types: 'all',
            adjustment: '+15%',
            max_increase: '25%',
            apply_to: 'next_7_days'
          }
        },
        {
          type: 'send_notification',
          config: {
            recipient: 'revenue_manager',
            message: 'Rates automatically increased due to high demand'
          }
        }
      ],
      isActive: true,
      priority: 2,
      lastExecuted: '2024-12-30 06:00',
      executionCount: 45,
      successRate: 95.6,
      createdAt: '2024-11-20'
    },
    {
      id: 'auto-003',
      name: 'Pre-Arrival Check-in Reminder',
      description: 'Send check-in reminders and collect additional information 24h before arrival',
      category: 'communication',
      trigger: {
        event: 'time_based',
        conditions: [
          { field: 'checkin_date', operator: 'equals', value: 'tomorrow' },
          { field: 'status', operator: 'equals', value: 'confirmed' }
        ]
      },
      actions: [
        {
          type: 'send_sms',
          config: {
            template: 'pre_arrival_reminder',
            recipient: 'guest.phone',
            variables: ['guest.name', 'checkin_time', 'room_type']
          }
        },
        {
          type: 'send_email',
          config: {
            template: 'online_checkin_link',
            recipient: 'guest.email',
            variables: ['checkin_link', 'reservation.id']
          }
        }
      ],
      isActive: true,
      priority: 1,
      lastExecuted: '2024-12-29 18:00',
      executionCount: 89,
      successRate: 92.1,
      createdAt: '2024-11-18'
    },
    {
      id: 'auto-004',
      name: 'Maintenance Request Auto-Assignment',
      description: 'Automatically assign maintenance requests to available technicians based on expertise',
      category: 'operations',
      trigger: {
        event: 'maintenance.created',
        conditions: [
          { field: 'priority', operator: 'greater_than_equals', value: 'medium' },
          { field: 'category', operator: 'in', value: ['hvac', 'plumbing', 'electrical'] }
        ]
      },
      actions: [
        {
          type: 'assign_task',
          config: {
            assignment_logic: 'expertise_workload',
            notify_assignee: true,
            escalation_time: '2 hours'
          }
        },
        {
          type: 'update_room_status',
          config: {
            status: 'maintenance_required',
            block_bookings: true
          }
        }
      ],
      isActive: true,
      priority: 3,
      lastExecuted: '2024-12-30 12:15',
      executionCount: 34,
      successRate: 97.1,
      createdAt: '2024-11-22'
    },
    {
      id: 'auto-005',
      name: 'Review Request Follow-up',
      description: 'Send review request emails to guests 2 days after checkout',
      category: 'marketing',
      trigger: {
        event: 'checkout.completed',
        conditions: [
          { field: 'days_since_checkout', operator: 'equals', value: 2 },
          { field: 'satisfaction_score', operator: 'greater_than', value: 4 }
        ]
      },
      actions: [
        {
          type: 'send_email',
          config: {
            template: 'review_request',
            recipient: 'guest.email',
            variables: ['guest.name', 'property.name', 'review_links']
          }
        },
        {
          type: 'create_followup',
          config: {
            type: 'review_reminder',
            delay: '5 days',
            max_attempts: 2
          }
        }
      ],
      isActive: true,
      priority: 2,
      lastExecuted: '2024-12-28 10:00',
      executionCount: 67,
      successRate: 89.6,
      createdAt: '2024-11-25'
    },
    {
      id: 'auto-006',
      name: 'Loyalty Points Calculation',
      description: 'Automatically calculate and award loyalty points after successful stays',
      category: 'marketing',
      trigger: {
        event: 'checkout.completed',
        conditions: [
          { field: 'payment_status', operator: 'equals', value: 'paid' },
          { field: 'guest.loyalty_member', operator: 'equals', value: true }
        ]
      },
      actions: [
        {
          type: 'award_points',
          config: {
            calculation: 'spend_based',
            rate: '1_point_per_euro',
            bonus_multiplier: 'tier_based'
          }
        },
        {
          type: 'send_notification',
          config: {
            recipient: 'guest.email',
            template: 'points_awarded',
            variables: ['points_earned', 'total_points', 'next_tier_progress']
          }
        }
      ],
      isActive: true,
      priority: 2,
      lastExecuted: '2024-12-30 11:45',
      executionCount: 123,
      successRate: 99.2,
      createdAt: '2024-11-28'
    }
  ]

  const templates: AutomationTemplate[] = [
    {
      id: 'tpl-001',
      name: 'Birthday Special Offer',
      description: 'Send personalized birthday offers to guests',
      category: 'marketing',
      trigger: { event: 'guest.birthday' },
      actions: [
        { type: 'send_email', config: { template: 'birthday_offer' } },
        { type: 'create_discount', config: { percentage: 20, valid_days: 30 } }
      ],
      popularity: 85
    },
    {
      id: 'tpl-002',
      name: 'Late Checkout Alert',
      description: 'Alert housekeeping when checkout is delayed',
      category: 'operations',
      trigger: { event: 'checkout.overdue' },
      actions: [
        { type: 'send_notification', config: { recipient: 'housekeeping' } },
        { type: 'update_room_status', config: { status: 'checkout_delayed' } }
      ],
      popularity: 92
    },
    {
      id: 'tpl-003',
      name: 'VIP Guest Arrival',
      description: 'Special preparations for VIP guest arrivals',
      category: 'operations',
      trigger: { event: 'reservation.confirmed', conditions: [{ field: 'guest.vip', operator: 'equals', value: true }] },
      actions: [
        { type: 'create_task', config: { title: 'Prepare VIP amenities' } },
        { type: 'assign_premium_room', config: { upgrade: 'best_available' } },
        { type: 'notify_management', config: { message: 'VIP guest arriving' } }
      ],
      popularity: 78
    },
    {
      id: 'tpl-004',
      name: 'Equipment Maintenance Schedule',
      description: 'Schedule preventive maintenance based on usage',
      category: 'maintenance',
      trigger: { event: 'equipment.usage_threshold' },
      actions: [
        { type: 'create_maintenance_task', config: { type: 'preventive' } },
        { type: 'schedule_downtime', config: { optimal_time: true } }
      ],
      popularity: 67
    }
  ]

  const executionLogs: AutomationLog[] = [
    {
      id: 'log-001',
      ruleId: 'auto-001',
      ruleName: 'Welcome Email for New Reservations',
      trigger: 'reservation.confirmed',
      actions: ['send_email', 'create_task'],
      status: 'success',
      executedAt: '2024-12-30 14:30',
      details: 'Welcome email sent to dimitrios@email.com, Welcome package task created',
      affectedRecords: 1
    },
    {
      id: 'log-002',
      ruleId: 'auto-002',
      ruleName: 'Dynamic Pricing Adjustment',
      trigger: 'daily.scheduled',
      actions: ['adjust_rates', 'send_notification'],
      status: 'success',
      executedAt: '2024-12-30 06:00',
      details: 'Rates increased by 15% for next 7 days, Revenue manager notified',
      affectedRecords: 24
    },
    {
      id: 'log-003',
      ruleId: 'auto-003',
      ruleName: 'Pre-Arrival Check-in Reminder',
      trigger: 'time_based',
      actions: ['send_sms', 'send_email'],
      status: 'partial',
      executedAt: '2024-12-29 18:00',
      details: 'Email sent successfully, SMS failed (invalid phone number)',
      affectedRecords: 1
    },
    {
      id: 'log-004',
      ruleId: 'auto-004',
      ruleName: 'Maintenance Request Auto-Assignment',
      trigger: 'maintenance.created',
      actions: ['assign_task', 'update_room_status'],
      status: 'success',
      executedAt: '2024-12-30 12:15',
      details: 'HVAC issue assigned to Dimitris Ioannou, Room 305 blocked',
      affectedRecords: 2
    },
    {
      id: 'log-005',
      ruleId: 'auto-005',
      ruleName: 'Review Request Follow-up',
      trigger: 'checkout.completed',
      actions: ['send_email'],
      status: 'failed',
      executedAt: '2024-12-28 10:00',
      details: 'Email template not found: review_request',
      affectedRecords: 0
    }
  ]

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'partial': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'success': return 'bg-green-100'
      case 'failed': return 'bg-red-100'
      case 'partial': return 'bg-yellow-100'
      default: return 'bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'communication': return '💬'
      case 'pricing': return '💰'
      case 'operations': return '⚙️'
      case 'marketing': return '📢'
      case 'maintenance': return '🔧'
      default: return '📋'
    }
  }

  const getPriorityColor = (priority: number): string => {
    if (priority === 1) return 'text-red-600'
    if (priority === 2) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getPriorityLabel = (priority: number): string => {
    if (priority === 1) return 'High'
    if (priority === 2) return 'Medium'
    return 'Low'
  }

  const filteredRules = automationRules.filter(rule => {
    if (selectedCategory === 'all') return true
    return rule.category === selectedCategory
  })

  const totalExecutions = automationRules.reduce((sum, rule) => sum + rule.executionCount, 0)
  const avgSuccessRate = automationRules.reduce((sum, rule) => sum + rule.successRate, 0) / automationRules.length
  const activeRules = automationRules.filter(rule => rule.isActive).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Automation Rules Engine</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            ➕ Create Rule
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            📋 Templates
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <div>
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">{activeRules}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">{totalExecutions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⏰</div>
            <div>
              <p className="text-sm text-gray-600">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900">142h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['rules', 'templates', 'logs', 'analytics'].map((tab) => (
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
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Automation Rules</h2>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="communication">Communication</option>
                  <option value="pricing">Pricing</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredRules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getCategoryIcon(rule.category)}</span>
                        <div>
                          <h3 className="font-semibold">{rule.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(rule.priority)} bg-opacity-20`}
                              style={{ backgroundColor: `${getPriorityColor(rule.priority).replace('text-', '')}20` }}>
                          {getPriorityLabel(rule.priority)} Priority
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.isActive ? '✅ Active' : '⏸️ Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger</h4>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{rule.trigger.event}</div>
                          {rule.trigger.conditions.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {rule.trigger.conditions.map((condition, index) => (
                                <div key={index} className="text-xs">
                                  {condition.field} {condition.operator} {condition.value || 'null'}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Actions ({rule.actions.length})</h4>
                        <div className="space-y-1">
                          {rule.actions.map((action, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              • {action.type.replace('_', ' ')}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Executions: <span className="font-medium">{rule.executionCount}</span></div>
                          <div>Success Rate: <span className={`font-medium ${rule.successRate >= 95 ? 'text-green-600' : rule.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {rule.successRate}%
                          </span></div>
                          {rule.lastExecuted && (
                            <div>Last Run: <span className="font-medium">{rule.lastExecuted}</span></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        📊 Analytics
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        ✏️ Edit
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        ▶️ Test
                      </button>
                      <button className={`px-3 py-1 rounded text-sm ${
                        rule.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {rule.isActive ? '⏸️ Disable' : '▶️ Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Rule Templates</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Create Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{getCategoryIcon(template.category)}</span>
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Popularity</span>
                        <span className="font-medium">{template.popularity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${template.popularity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <div>Trigger: <span className="font-medium">{template.trigger.event}</span></div>
                      <div>Actions: <span className="font-medium">{template.actions.length}</span></div>
                      <div>Category: <span className="font-medium capitalize">{template.category}</span></div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        👁️ Preview
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                        ➕ Use Template
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
                <h2 className="text-lg font-semibold">Execution Logs</h2>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="partial">Partial</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    📋 Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Rule</th>
                      <th className="text-left py-3 px-4 font-medium">Trigger</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Records</th>
                      <th className="text-left py-3 px-4 font-medium">Executed</th>
                      <th className="text-left py-3 px-4 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executionLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{log.ruleName}</div>
                          <div className="text-sm text-gray-600">{log.ruleId}</div>
                        </td>
                        <td className="py-3 px-4 text-sm">{log.trigger}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {log.actions.map((action, index) => (
                              <div key={index}>• {action.replace('_', ' ')}</div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBg(log.status)} ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{log.affectedRecords}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{log.executedAt}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Automation Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Executions by Category</h3>
                  <div className="space-y-3">
                    {['communication', 'pricing', 'operations', 'marketing', 'maintenance'].map((category) => {
                      const categoryRules = automationRules.filter(r => r.category === category)
                      const categoryExecutions = categoryRules.reduce((sum, r) => sum + r.executionCount, 0)
                      const percentage = (categoryExecutions / totalExecutions) * 100

                      return (
                        <div key={category} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>{getCategoryIcon(category)}</span>
                            <span className="text-sm capitalize">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{categoryExecutions}</div>
                            <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Success Rates by Rule</h3>
                  <div className="space-y-3">
                    {automationRules.slice(0, 6).map((rule) => (
                      <div key={rule.id} className="flex justify-between items-center">
                        <span className="text-sm truncate max-w-xs">{rule.name}</span>
                        <div className="text-right">
                          <div className={`font-medium ${rule.successRate >= 95 ? 'text-green-600' : rule.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {rule.successRate}%
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full ${rule.successRate >= 95 ? 'bg-green-500' : rule.successRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${rule.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalExecutions.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Executions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{avgSuccessRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Avg Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">142h</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">€12,450</div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}