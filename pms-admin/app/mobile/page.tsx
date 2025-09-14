'use client'

import React, { useState } from 'react'

interface MobileFeature {
  id: string
  name: string
  description: string
  icon: string
  category: 'tasks' | 'communication' | 'operations' | 'reporting'
  isAvailable: boolean
  usageCount: number
}

interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  isOnline: boolean
  location: string
  currentTasks: number
  completedToday: number
  lastSeen: string
  deviceInfo: {
    type: 'ios' | 'android'
    version: string
    appVersion: string
  }
}

interface MobileTask {
  id: string
  title: string
  type: 'housekeeping' | 'maintenance' | 'front_desk' | 'guest_service'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  location: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  estimatedTime: number
  createdAt: string
  dueAt: string
}

interface Notification {
  id: string
  type: 'task' | 'alert' | 'message' | 'system'
  title: string
  message: string
  recipientRole: string
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  createdAt: string
}

interface OfflineSync {
  lastSync: string
  pendingUploads: number
  conflictsFound: number
  dataSize: string
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline'
}

export default function MobileStaffAppPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [taskFilter, setTaskFilter] = useState('all')

  const mobileFeatures: MobileFeature[] = [
    {
      id: 'tasks',
      name: 'Task Management',
      description: 'View, update and complete assigned tasks on the go',
      icon: '✅',
      category: 'tasks',
      isAvailable: true,
      usageCount: 1250
    },
    {
      id: 'messaging',
      name: 'Team Messaging',
      description: 'Instant communication with team members and supervisors',
      icon: '💬',
      category: 'communication',
      isAvailable: true,
      usageCount: 890
    },
    {
      id: 'room_status',
      name: 'Room Status Updates',
      description: 'Real-time room status changes and housekeeping updates',
      icon: '🏨',
      category: 'operations',
      isAvailable: true,
      usageCount: 2340
    },
    {
      id: 'maintenance_reports',
      name: 'Maintenance Reporting',
      description: 'Report and track maintenance issues with photo attachments',
      icon: '🔧',
      category: 'operations',
      isAvailable: true,
      usageCount: 456
    },
    {
      id: 'guest_requests',
      name: 'Guest Service Requests',
      description: 'Handle guest requests and service calls efficiently',
      icon: '🛎️',
      category: 'tasks',
      isAvailable: true,
      usageCount: 678
    },
    {
      id: 'shift_management',
      name: 'Shift & Time Tracking',
      description: 'Clock in/out and manage work schedules',
      icon: '⏰',
      category: 'operations',
      isAvailable: true,
      usageCount: 1560
    },
    {
      id: 'inventory',
      name: 'Inventory Management',
      description: 'Check stock levels and request supplies',
      icon: '📦',
      category: 'operations',
      isAvailable: true,
      usageCount: 234
    },
    {
      id: 'reports',
      name: 'Daily Reports',
      description: 'Submit daily reports and performance metrics',
      icon: '📊',
      category: 'reporting',
      isAvailable: true,
      usageCount: 345
    },
    {
      id: 'emergency',
      name: 'Emergency Alerts',
      description: 'Receive and respond to emergency notifications',
      icon: '🚨',
      category: 'communication',
      isAvailable: true,
      usageCount: 23
    },
    {
      id: 'navigation',
      name: 'Indoor Navigation',
      description: 'Find locations within the property using maps',
      icon: '🗺️',
      category: 'operations',
      isAvailable: false,
      usageCount: 0
    }
  ]

  const staffMembers: StaffMember[] = [
    {
      id: 'staff-001',
      name: 'Maria Constantinou',
      role: 'Housekeeping Supervisor',
      department: 'Housekeeping',
      isOnline: true,
      location: 'Floor 3',
      currentTasks: 3,
      completedToday: 12,
      lastSeen: '2024-12-30 16:45',
      deviceInfo: {
        type: 'ios',
        version: '17.2',
        appVersion: '2.1.4'
      }
    },
    {
      id: 'staff-002',
      name: 'Andreas Georgiou',
      role: 'Front Desk Agent',
      department: 'Front Office',
      isOnline: true,
      location: 'Reception',
      currentTasks: 1,
      completedToday: 8,
      lastSeen: '2024-12-30 16:42',
      deviceInfo: {
        type: 'android',
        version: '14.0',
        appVersion: '2.1.4'
      }
    },
    {
      id: 'staff-003',
      name: 'Elena Papadopoulos',
      role: 'Maintenance Technician',
      department: 'Maintenance',
      isOnline: false,
      location: 'Pool Area',
      currentTasks: 2,
      completedToday: 5,
      lastSeen: '2024-12-30 15:30',
      deviceInfo: {
        type: 'android',
        version: '13.0',
        appVersion: '2.1.3'
      }
    },
    {
      id: 'staff-004',
      name: 'Dimitris Ioannou',
      role: 'Security Guard',
      department: 'Security',
      isOnline: true,
      location: 'Patrol',
      currentTasks: 0,
      completedToday: 15,
      lastSeen: '2024-12-30 16:40',
      deviceInfo: {
        type: 'ios',
        version: '17.1',
        appVersion: '2.1.4'
      }
    },
    {
      id: 'staff-005',
      name: 'Sophia Christou',
      role: 'Guest Relations',
      department: 'Guest Services',
      isOnline: true,
      location: 'Concierge Desk',
      currentTasks: 2,
      completedToday: 9,
      lastSeen: '2024-12-30 16:43',
      deviceInfo: {
        type: 'ios',
        version: '17.2',
        appVersion: '2.1.4'
      }
    },
    {
      id: 'staff-006',
      name: 'Nikos Constantinou',
      role: 'Housekeeping Staff',
      department: 'Housekeeping',
      isOnline: false,
      location: 'Floor 2',
      currentTasks: 4,
      completedToday: 6,
      lastSeen: '2024-12-30 14:20',
      deviceInfo: {
        type: 'android',
        version: '12.0',
        appVersion: '2.0.8'
      }
    }
  ]

  const mobileTasks: MobileTask[] = [
    {
      id: 'task-001',
      title: 'Clean Room 305 - Checkout',
      type: 'housekeeping',
      priority: 'high',
      assignedTo: 'Maria Constantinou',
      location: 'Room 305, Floor 3',
      status: 'in_progress',
      estimatedTime: 45,
      createdAt: '2024-12-30 15:30',
      dueAt: '2024-12-30 17:00'
    },
    {
      id: 'task-002',
      title: 'Fix Air Conditioning Unit',
      type: 'maintenance',
      priority: 'urgent',
      assignedTo: 'Elena Papadopoulos',
      location: 'Room 218, Floor 2',
      status: 'pending',
      estimatedTime: 90,
      createdAt: '2024-12-30 16:00',
      dueAt: '2024-12-30 18:00'
    },
    {
      id: 'task-003',
      title: 'Guest Luggage Assistance',
      type: 'guest_service',
      priority: 'medium',
      assignedTo: 'Sophia Christou',
      location: 'Main Entrance',
      status: 'completed',
      estimatedTime: 15,
      createdAt: '2024-12-30 16:15',
      dueAt: '2024-12-30 16:30'
    },
    {
      id: 'task-004',
      title: 'Process Check-in for VIP Guest',
      type: 'front_desk',
      priority: 'high',
      assignedTo: 'Andreas Georgiou',
      location: 'Reception Desk',
      status: 'in_progress',
      estimatedTime: 30,
      createdAt: '2024-12-30 16:20',
      dueAt: '2024-12-30 17:00'
    },
    {
      id: 'task-005',
      title: 'Inspect Pool Equipment',
      type: 'maintenance',
      priority: 'low',
      assignedTo: 'Dimitris Ioannou',
      location: 'Pool Area',
      status: 'pending',
      estimatedTime: 60,
      createdAt: '2024-12-30 16:30',
      dueAt: '2024-12-31 10:00'
    },
    {
      id: 'task-006',
      title: 'Restock Minibar - Floor 4',
      type: 'housekeeping',
      priority: 'medium',
      assignedTo: 'Nikos Constantinou',
      location: 'Floor 4 Service Room',
      status: 'blocked',
      estimatedTime: 30,
      createdAt: '2024-12-30 14:00',
      dueAt: '2024-12-30 16:00'
    }
  ]

  const notifications: Notification[] = [
    {
      id: 'notif-001',
      type: 'alert',
      title: 'Urgent Maintenance Request',
      message: 'Air conditioning failure reported in Room 218',
      recipientRole: 'Maintenance',
      priority: 'high',
      isRead: false,
      createdAt: '2024-12-30 16:00'
    },
    {
      id: 'notif-002',
      type: 'task',
      title: 'New Task Assigned',
      message: 'VIP guest check-in scheduled for 17:00',
      recipientRole: 'Front Desk',
      priority: 'medium',
      isRead: true,
      createdAt: '2024-12-30 15:45'
    },
    {
      id: 'notif-003',
      type: 'message',
      title: 'Team Update',
      message: 'Shift change at 18:00 - please complete handover',
      recipientRole: 'All Staff',
      priority: 'low',
      isRead: false,
      createdAt: '2024-12-30 15:30'
    },
    {
      id: 'notif-004',
      type: 'system',
      title: 'App Update Available',
      message: 'Version 2.1.5 is available with bug fixes',
      recipientRole: 'All Staff',
      priority: 'low',
      isRead: true,
      createdAt: '2024-12-30 14:00'
    }
  ]

  const offlineSync: OfflineSync = {
    lastSync: '2024-12-30 16:45',
    pendingUploads: 3,
    conflictsFound: 0,
    dataSize: '2.4 MB',
    syncStatus: 'synced'
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'blocked': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTaskTypeIcon = (type: string): string => {
    switch (type) {
      case 'housekeeping': return '🧹'
      case 'maintenance': return '🔧'
      case 'front_desk': return '🏨'
      case 'guest_service': return '🛎️'
      default: return '📋'
    }
  }

  const getDeviceIcon = (type: string): string => {
    return type === 'ios' ? '📱' : '🤖'
  }

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'tasks': return '✅'
      case 'communication': return '💬'
      case 'operations': return '⚙️'
      case 'reporting': return '📊'
      default: return '📱'
    }
  }

  const getSyncStatusColor = (status: string): string => {
    switch (status) {
      case 'synced': return 'text-green-600'
      case 'syncing': return 'text-blue-600'
      case 'error': return 'text-red-600'
      case 'offline': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const filteredTasks = mobileTasks.filter(task => {
    if (taskFilter === 'all') return true
    return task.status === taskFilter
  })

  const onlineStaff = staffMembers.filter(staff => staff.isOnline).length
  const totalTasks = mobileTasks.length
  const completedTasks = mobileTasks.filter(task => task.status === 'completed').length
  const unreadNotifications = notifications.filter(notif => !notif.isRead).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mobile Staff App</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            📱 Download App
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            🔔 Send Notification
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            ⚙️ App Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">👥</div>
            <div>
              <p className="text-sm text-gray-600">Staff Online</p>
              <p className="text-2xl font-bold text-gray-900">{onlineStaff}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <p className="text-sm text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks - completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{((completedTasks / totalTasks) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔔</div>
            <div>
              <p className="text-sm text-gray-600">Unread Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'staff', 'tasks', 'notifications', 'features'].map((tab) => (
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
              <h2 className="text-lg font-semibold">Mobile App Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">App Usage Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Daily Active Users:</span>
                      <span className="font-bold text-blue-600">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tasks Completed:</span>
                      <span className="font-bold text-green-600">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Messages Sent:</span>
                      <span className="font-bold text-purple-600">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Session:</span>
                      <span className="font-bold text-orange-600">2.5h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Device Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span>📱</span>
                        <span className="text-gray-600">iOS Devices</span>
                      </div>
                      <span className="font-bold">15 (62.5%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span>🤖</span>
                        <span className="text-gray-600">Android Devices</span>
                      </div>
                      <span className="font-bold">9 (37.5%)</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Latest App Version:</span>
                        <span className="font-bold text-green-600">v2.1.4</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Update Compliance:</span>
                        <span className="font-bold text-blue-600">91.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Offline Synchronization Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <span className="text-gray-600">Last Sync:</span>
                    <div className="font-bold">{offlineSync.lastSync}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Pending Uploads:</span>
                    <div className={`font-bold ${offlineSync.pendingUploads > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {offlineSync.pendingUploads}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sync Conflicts:</span>
                    <div className={`font-bold ${offlineSync.conflictsFound > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {offlineSync.conflictsFound}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className={`font-bold ${getSyncStatusColor(offlineSync.syncStatus)}`}>
                      {offlineSync.syncStatus.charAt(0).toUpperCase() + offlineSync.syncStatus.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-gray-600">App Uptime</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-gray-600">Avg Load Time</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">12 MB</div>
                  <div className="text-sm text-gray-600">App Size</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Staff Activity</h2>
                <div className="flex gap-2">
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Staff</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${staff.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <h3 className="font-semibold">{staff.name}</h3>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                          <p className="text-xs text-gray-500">{staff.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <span>{getDeviceIcon(staff.deviceInfo.type)}</span>
                          <span className="text-gray-600">{staff.deviceInfo.type.toUpperCase()}</span>
                        </div>
                        <div className="text-xs text-gray-500">v{staff.deviceInfo.appVersion}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-orange-600">{staff.currentTasks}</div>
                        <div className="text-xs text-gray-600">Current Tasks</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{staff.completedToday}</div>
                        <div className="text-xs text-gray-600">Completed Today</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {staff.completedToday > 0 ? ((staff.completedToday / (staff.completedToday + staff.currentTasks)) * 100).toFixed(0) : 0}%
                        </div>
                        <div className="text-xs text-gray-600">Efficiency</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{staff.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Seen:</span>
                        <span className="font-medium">{staff.lastSeen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device OS:</span>
                        <span className="font-medium">{staff.deviceInfo.type} {staff.deviceInfo.version}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        💬 Message
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        ✅ Assign Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Mobile Task Management</h2>
                <div className="flex gap-2">
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    ➕ Create Task
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getTaskTypeIcon(task.type)}</span>
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.location}</p>
                          <p className="text-xs text-gray-500">Assigned to: {task.assignedTo}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <div className="font-medium">{task.createdAt}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Due:</span>
                        <div className="font-medium">{task.dueAt}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Time:</span>
                        <div className="font-medium">{task.estimatedTime}min</div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        👁️ View
                      </button>
                      {task.status === 'pending' && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                          ▶️ Start
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                          ✅ Complete
                        </button>
                      )}
                      <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Push Notifications</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    🔔 Send Broadcast
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    ⚙️ Settings
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`border rounded-lg p-4 ${
                    notification.isRead ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${notification.isRead ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                        <h3 className="font-medium">{notification.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{notification.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{notification.message}</p>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">Type: {notification.type}</span>
                        <span className="text-gray-600">Recipient: {notification.recipientRole}</span>
                      </div>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                            ✓ Mark Read
                          </button>
                        )}
                        <button className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                          🔄 Resend
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Notification Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{notifications.length}</div>
                    <div className="text-gray-600">Total Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {notifications.filter(n => n.isRead).length}
                    </div>
                    <div className="text-gray-600">Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{unreadNotifications}</div>
                    <div className="text-gray-600">Unread</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {((notifications.filter(n => n.isRead).length / notifications.length) * 100).toFixed(0)}%
                    </div>
                    <div className="text-gray-600">Read Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">App Features</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Request Feature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mobileFeatures.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h3 className="font-medium">{feature.name}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feature.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.isAvailable ? '✅ Available' : '🚧 Coming Soon'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <span>{getCategoryIcon(feature.category)}</span>
                        <span className="text-gray-600 capitalize">{feature.category}</span>
                      </div>
                      {feature.isAvailable && (
                        <span className="font-medium text-blue-600">
                          {feature.usageCount.toLocaleString()} uses
                        </span>
                      )}
                    </div>

                    {feature.isAvailable ? (
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          📊 Analytics
                        </button>
                        <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                          ⚙️ Configure
                        </button>
                      </div>
                    ) : (
                      <button className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm">
                        🔔 Notify When Ready
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">📱 Mobile App Roadmap</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• ✅ Offline task management (Completed)</li>
                  <li>• ✅ Push notifications (Completed)</li>
                  <li>• ✅ Photo attachments for reports (Completed)</li>
                  <li>• 🚧 Indoor navigation (In Development)</li>
                  <li>• 📋 Voice notes and transcription (Planned)</li>
                  <li>• 📋 Augmented reality room inspection (Planned)</li>
                  <li>• 📋 Smart watch integration (Planned)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}