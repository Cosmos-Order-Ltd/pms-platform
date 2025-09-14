'use client'

import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  permissions: string[]
  properties: string[]
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystemRole: boolean
}

interface Property {
  id: string
  name: string
  type: 'hotel' | 'resort' | 'villa' | 'apartment'
  location: string
  rooms: number
  isActive: boolean
  managedBy: string
  settings: {
    timezone: string
    currency: string
    language: string
    checkInTime: string
    checkOutTime: string
  }
}

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  success: boolean
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: string
  cpu: number
  memory: number
  database: {
    status: 'connected' | 'disconnected'
    responseTime: number
    activeConnections: number
  }
  services: {
    name: string
    status: 'running' | 'stopped' | 'error'
    responseTime?: number
    lastCheck: string
  }[]
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [_selectedUser, _setSelectedUser] = useState<string | null>(null)
  const [_showCreateModal, _setShowCreateModal] = useState(false)

  const handleAddUser = () => {
    toast.loading('Opening user creation form...')
    setTimeout(() => {
      toast.success('User creation form opened!')
    }, 1000)
  }

  const handleAddProperty = () => {
    toast.loading('Opening property creation form...')
    setTimeout(() => {
      toast.success('Property creation form opened!')
    }, 1000)
  }

  const handleSystemSettings = () => {
    toast.loading('Loading system settings...')
    setTimeout(() => {
      toast.success('System settings loaded!')
    }, 1500)
  }

  const handleEditUser = (userName: string) => {
    toast.loading(`Opening ${userName}'s profile...`)
    setTimeout(() => {
      toast.success(`${userName}'s profile loaded for editing!`)
    }, 1000)
  }

  const handleUserPermissions = (userName: string) => {
    toast.loading(`Loading permissions for ${userName}...`)
    setTimeout(() => {
      toast.success(`Permission settings opened for ${userName}!`)
    }, 1000)
  }

  const handleToggleUserStatus = (userName: string, isActive: boolean) => {
    toast.loading(`${isActive ? 'Disabling' : 'Enabling'} ${userName}...`)
    setTimeout(() => {
      toast.success(`${userName} has been ${isActive ? 'disabled' : 'enabled'} successfully!`)
    }, 1500)
  }

  const handleCreateRole = () => {
    toast.loading('Opening role creation form...')
    setTimeout(() => {
      toast.success('Role creation form opened!')
    }, 1000)
  }

  const handleEditRole = (roleName: string) => {
    toast.loading(`Loading ${roleName} role settings...`)
    setTimeout(() => {
      toast.success(`${roleName} role settings opened for editing!`)
    }, 1000)
  }

  const handleRoleUsers = (roleName: string) => {
    toast.loading(`Loading users with ${roleName} role...`)
    setTimeout(() => {
      toast.success(`Users with ${roleName} role displayed!`)
    }, 1000)
  }

  const handleDeleteRole = (roleName: string) => {
    toast.loading(`Deleting ${roleName} role...`)
    setTimeout(() => {
      toast.success(`${roleName} role deleted successfully!`)
    }, 2000)
  }

  const handlePropertyAnalytics = (propertyName: string) => {
    toast.loading(`Loading analytics for ${propertyName}...`)
    setTimeout(() => {
      toast.success(`Analytics dashboard opened for ${propertyName}!`)
    }, 1500)
  }

  const handleEditProperty = (propertyName: string) => {
    toast.loading(`Loading ${propertyName} settings...`)
    setTimeout(() => {
      toast.success(`${propertyName} settings opened for editing!`)
    }, 1000)
  }

  const handlePropertySettings = (propertyName: string) => {
    toast.loading(`Loading configuration for ${propertyName}...`)
    setTimeout(() => {
      toast.success(`Configuration panel opened for ${propertyName}!`)
    }, 1000)
  }

  const handleToggleProperty = (propertyName: string, isActive: boolean) => {
    toast.loading(`${isActive ? 'Disabling' : 'Enabling'} ${propertyName}...`)
    setTimeout(() => {
      toast.success(`${propertyName} has been ${isActive ? 'disabled' : 'enabled'} successfully!`)
    }, 1500)
  }

  const handleExportAudit = async () => {
    const toastId = toast.loading('Generating audit log export...')
    try {
      const response = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          format: 'csv',
          timeRange: '24h'
        })
      })

      const data = await response.json() as { success: boolean; message?: string }
      if (data.success) {
        toast.success(data.message || "Success", { id: toastId })
      } else {
        toast.error('Failed to export audit logs', { id: toastId })
      }
    } catch {
      toast.error('Error exporting audit logs', { id: toastId })
    }
  }

  const handleRefreshHealth = async () => {
    const toastId = toast.loading('Refreshing system health data...')
    try {
      const response = await fetch('/api/system/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refresh'
        })
      })

      const data = await response.json() as { success: boolean; message?: string }
      if (data.success) {
        toast.success(data.message || "Success", { id: toastId })
      } else {
        toast.error('Failed to refresh system health', { id: toastId })
      }
    } catch {
      toast.error('Error refreshing system health', { id: toastId })
    }
  }

  const handleOpenMonitoring = () => {
    toast.loading('Opening system monitoring dashboard...')
    setTimeout(() => {
      toast.success('Monitoring dashboard opened!')
    }, 1500)
  }

  const users: User[] = [
    {
      id: 'user-001',
      name: 'Andreas Georgiou',
      email: 'andreas.georgiou@cyprus-hotels.com',
      role: 'System Administrator',
      department: 'IT',
      isActive: true,
      lastLogin: '2024-12-30 16:45',
      createdAt: '2024-11-01',
      permissions: ['system:admin', 'users:manage', 'properties:manage', 'analytics:view'],
      properties: ['all']
    },
    {
      id: 'user-002',
      name: 'Maria Constantinou',
      email: 'maria.constantinou@cyprus-hotels.com',
      role: 'Front Desk Manager',
      department: 'Front Office',
      isActive: true,
      lastLogin: '2024-12-30 15:20',
      createdAt: '2024-11-05',
      permissions: ['reservations:manage', 'guests:manage', 'rooms:manage'],
      properties: ['prop-001']
    },
    {
      id: 'user-003',
      name: 'Dimitris Ioannou',
      email: 'dimitris.ioannou@cyprus-hotels.com',
      role: 'Maintenance Supervisor',
      department: 'Maintenance',
      isActive: true,
      lastLogin: '2024-12-30 14:30',
      createdAt: '2024-11-08',
      permissions: ['maintenance:manage', 'inventory:manage'],
      properties: ['prop-001', 'prop-002']
    },
    {
      id: 'user-004',
      name: 'Elena Papadopoulos',
      email: 'elena.papadopoulos@cyprus-hotels.com',
      role: 'Revenue Manager',
      department: 'Revenue',
      isActive: true,
      lastLogin: '2024-12-30 13:45',
      createdAt: '2024-11-10',
      permissions: ['pricing:manage', 'analytics:view', 'reports:generate'],
      properties: ['all']
    },
    {
      id: 'user-005',
      name: 'Sophia Christou',
      email: 'sophia.christou@cyprus-hotels.com',
      role: 'Guest Relations',
      department: 'Guest Services',
      isActive: true,
      lastLogin: '2024-12-30 12:15',
      createdAt: '2024-11-12',
      permissions: ['guests:manage', 'communications:send', 'reviews:manage'],
      properties: ['prop-001']
    },
    {
      id: 'user-006',
      name: 'Nikos Constantinou',
      email: 'nikos.constantinou@cyprus-hotels.com',
      role: 'Former Employee',
      department: 'Housekeeping',
      isActive: false,
      lastLogin: '2024-12-15 09:30',
      createdAt: '2024-10-15',
      permissions: [],
      properties: []
    }
  ]

  const roles: Role[] = [
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
    },
    {
      id: 'role-004',
      name: 'Revenue Manager',
      description: 'Manage pricing, rates, and revenue optimization',
      permissions: ['pricing:manage', 'analytics:view', 'reports:generate', 'channels:manage'],
      userCount: 1,
      isSystemRole: false
    },
    {
      id: 'role-005',
      name: 'Maintenance Supervisor',
      description: 'Manage maintenance operations and inventory',
      permissions: ['maintenance:manage', 'inventory:manage', 'tasks:assign'],
      userCount: 2,
      isSystemRole: false
    },
    {
      id: 'role-006',
      name: 'Guest Relations',
      description: 'Manage guest communications and services',
      permissions: ['guests:manage', 'communications:send', 'reviews:manage', 'loyalty:manage'],
      userCount: 4,
      isSystemRole: false
    },
    {
      id: 'role-007',
      name: 'Housekeeping Staff',
      description: 'Basic housekeeping task management',
      permissions: ['tasks:view', 'rooms:update_status'],
      userCount: 8,
      isSystemRole: false
    }
  ]

  const properties: Property[] = [
    {
      id: 'prop-001',
      name: 'Cyprus Grand Resort',
      type: 'resort',
      location: 'Limassol, Cyprus',
      rooms: 120,
      isActive: true,
      managedBy: 'Maria Constantinou',
      settings: {
        timezone: 'Europe/Nicosia',
        currency: 'EUR',
        language: 'en',
        checkInTime: '15:00',
        checkOutTime: '11:00'
      }
    },
    {
      id: 'prop-002',
      name: 'Mediterranean Palace',
      type: 'hotel',
      location: 'Paphos, Cyprus',
      rooms: 80,
      isActive: true,
      managedBy: 'Andreas Georgiou',
      settings: {
        timezone: 'Europe/Nicosia',
        currency: 'EUR',
        language: 'en',
        checkInTime: '14:00',
        checkOutTime: '12:00'
      }
    },
    {
      id: 'prop-003',
      name: 'Coastal Villas',
      type: 'villa',
      location: 'Ayia Napa, Cyprus',
      rooms: 24,
      isActive: true,
      managedBy: 'Elena Papadopoulos',
      settings: {
        timezone: 'Europe/Nicosia',
        currency: 'EUR',
        language: 'en',
        checkInTime: '16:00',
        checkOutTime: '10:00'
      }
    },
    {
      id: 'prop-004',
      name: 'City Center Apartments',
      type: 'apartment',
      location: 'Nicosia, Cyprus',
      rooms: 45,
      isActive: false,
      managedBy: 'Dimitris Ioannou',
      settings: {
        timezone: 'Europe/Nicosia',
        currency: 'EUR',
        language: 'el',
        checkInTime: '15:00',
        checkOutTime: '11:00'
      }
    }
  ]

  const auditLogs: AuditLog[] = [
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
      timestamp: '2024-12-30 16:15:42',
      userId: 'user-004',
      userName: 'Elena Papadopoulos',
      action: 'RATE_UPDATE',
      resource: 'Pricing',
      details: 'Updated rates for Deluxe Room for 2025-01-01 to 2025-01-07',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      success: true
    },
    {
      id: 'audit-004',
      timestamp: '2024-12-30 16:00:08',
      userId: 'user-003',
      userName: 'Dimitris Ioannou',
      action: 'MAINTENANCE_ASSIGN',
      resource: 'Maintenance',
      details: 'Assigned maintenance task MAINT-789 to Technician Team A',
      ipAddress: '192.168.1.75',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      success: true
    },
    {
      id: 'audit-005',
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

  const systemHealth: SystemHealth = {
    status: 'healthy',
    uptime: '15 days 8 hours',
    cpu: 45.2,
    memory: 67.8,
    database: {
      status: 'connected',
      responseTime: 12,
      activeConnections: 25
    },
    services: [
      { name: 'Web Server', status: 'running', responseTime: 120, lastCheck: '2024-12-30 16:45' },
      { name: 'Database', status: 'running', responseTime: 12, lastCheck: '2024-12-30 16:45' },
      { name: 'Email Service', status: 'running', responseTime: 250, lastCheck: '2024-12-30 16:44' },
      { name: 'Payment Gateway', status: 'running', responseTime: 340, lastCheck: '2024-12-30 16:44' },
      { name: 'Channel Manager', status: 'running', responseTime: 180, lastCheck: '2024-12-30 16:43' },
      { name: 'Backup Service', status: 'running', lastCheck: '2024-12-30 06:00' },
      { name: 'Analytics Engine', status: 'running', responseTime: 890, lastCheck: '2024-12-30 16:42' }
    ]
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'connected': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical':
      case 'error':
      case 'stopped':
      case 'disconnected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'connected': return 'bg-green-100'
      case 'warning': return 'bg-yellow-100'
      case 'critical':
      case 'error':
      case 'stopped':
      case 'disconnected': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  const getRoleColor = (role: string): string => {
    if (role.includes('Administrator')) return 'text-red-600 bg-red-100'
    if (role.includes('Manager')) return 'text-blue-600 bg-blue-100'
    if (role.includes('Supervisor')) return 'text-purple-600 bg-purple-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getPropertyTypeIcon = (type: string): string => {
    switch (type) {
      case 'hotel': return '🏨'
      case 'resort': return '🏖️'
      case 'villa': return '🏡'
      case 'apartment': return '🏢'
      default: return '🏠'
    }
  }

  const activeUsers = users.filter(user => user.isActive).length
  const totalRoles = roles.length
  const activeProperties = properties.filter(prop => prop.isActive).length
  const totalRooms = properties.reduce((sum, prop) => sum + prop.rooms, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
        <div className="flex gap-2">
          <button onClick={handleAddUser} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            👥 Add User
          </button>
          <button onClick={handleAddProperty} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            🏨 Add Property
          </button>
          <button onClick={handleSystemSettings} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            ⚙️ System Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">👥</div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔐</div>
            <div>
              <p className="text-sm text-gray-600">User Roles</p>
              <p className="text-2xl font-bold text-gray-900">{totalRoles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏨</div>
            <div>
              <p className="text-sm text-gray-600">Active Properties</p>
              <p className="text-2xl font-bold text-gray-900">{activeProperties}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚪</div>
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['users', 'roles', 'properties', 'audit', 'health'].map((tab) => (
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
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">User Management</h2>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="inactive">Inactive Users</option>
                  </select>
                  <button onClick={handleAddUser} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    ➕ Add User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Department</th>
                      <th className="text-left py-3 px-4 font-medium">Properties</th>
                      <th className="text-left py-3 px-4 font-medium">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{user.department}</td>
                        <td className="py-3 px-4 text-sm">
                          {user.properties.includes('all') ? 'All Properties' : `${user.properties.length} properties`}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.lastLogin || 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isActive ? '✅ Active' : '⏸️ Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button onClick={() => handleEditUser(user.name)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                              Edit
                            </button>
                            <button onClick={() => handleUserPermissions(user.name)} className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                              Permissions
                            </button>
                            <button onClick={() => handleToggleUserStatus(user.name, user.isActive)} className={`px-2 py-1 rounded text-xs ${
                              user.isActive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}>
                              {user.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Role Management</h2>
                <button onClick={handleCreateRole} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Create Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      </div>
                      {role.isSystemRole && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          System
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-medium">{role.userCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Permissions:</span>
                        <span className="font-medium">{role.permissions.length}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Permissions</h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {permission.split(':')[0]}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleEditRole(role.name)} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleRoleUsers(role.name)} className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                        👥 Users
                      </button>
                      {!role.isSystemRole && (
                        <button onClick={() => handleDeleteRole(role.name)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Property Management</h2>
                <button onClick={handleAddProperty} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Add Property
                </button>
              </div>

              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getPropertyTypeIcon(property.type)}</span>
                        <div>
                          <h3 className="font-semibold">{property.name}</h3>
                          <p className="text-sm text-gray-600">{property.location}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Type: {property.type}</span>
                            <span>Rooms: {property.rooms}</span>
                            <span>Manager: {property.managedBy}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.isActive ? '✅ Active' : '⏸️ Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Timezone:</span>
                        <div className="font-medium">{property.settings.timezone}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Currency:</span>
                        <div className="font-medium">{property.settings.currency}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Language:</span>
                        <div className="font-medium">{property.settings.language.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-in:</span>
                        <div className="font-medium">{property.settings.checkInTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-out:</span>
                        <div className="font-medium">{property.settings.checkOutTime}</div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button onClick={() => handlePropertyAnalytics(property.name)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        📊 Analytics
                      </button>
                      <button onClick={() => handleEditProperty(property.name)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handlePropertySettings(property.name)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        ⚙️ Settings
                      </button>
                      <button onClick={() => handleToggleProperty(property.name, property.isActive)} className={`px-3 py-1 rounded text-sm ${
                        property.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {property.isActive ? '⏸️ Disable' : '▶️ Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Audit Logs</h2>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Actions</option>
                    <option value="login">Login Events</option>
                    <option value="create">Create Actions</option>
                    <option value="update">Update Actions</option>
                    <option value="delete">Delete Actions</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                  <button onClick={handleExportAudit} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    📋 Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Action</th>
                      <th className="text-left py-3 px-4 font-medium">Resource</th>
                      <th className="text-left py-3 px-4 font-medium">Details</th>
                      <th className="text-left py-3 px-4 font-medium">IP Address</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono">{log.timestamp}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-gray-600">{log.userId}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {log.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{log.resource}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono">{log.ipAddress}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.success ? '✅ Success' : '❌ Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">System Health</h2>
                <div className="flex gap-2">
                  <button onClick={handleRefreshHealth} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    🔄 Refresh
                  </button>
                  <button onClick={handleOpenMonitoring} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    📊 Monitoring
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">System Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">System Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(systemHealth.status)} ${getStatusColor(systemHealth.status)}`}>
                        {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium">{systemHealth.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">CPU Usage:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${systemHealth.cpu < 70 ? 'bg-green-500' : systemHealth.cpu < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${systemHealth.cpu}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{systemHealth.cpu}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Memory Usage:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${systemHealth.memory < 70 ? 'bg-green-500' : systemHealth.memory < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${systemHealth.memory}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{systemHealth.memory}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Database</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Connection Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(systemHealth.database.status)} ${getStatusColor(systemHealth.database.status)}`}>
                        {systemHealth.database.status.charAt(0).toUpperCase() + systemHealth.database.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Response Time:</span>
                      <span className={`font-medium ${systemHealth.database.responseTime < 50 ? 'text-green-600' : systemHealth.database.responseTime < 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {systemHealth.database.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Connections:</span>
                      <span className="font-medium">{systemHealth.database.activeConnections}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Service Status</h3>
                <div className="space-y-3">
                  {systemHealth.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${service.status === 'running' ? 'bg-green-500' : service.status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        {service.responseTime && (
                          <span className={`${service.responseTime < 500 ? 'text-green-600' : service.responseTime < 1000 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {service.responseTime}ms
                          </span>
                        )}
                        <span className="text-gray-600">{service.lastCheck}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBg(service.status)} ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">💡 System Recommendations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• System is running optimally</li>
                  <li>• Consider scheduling database maintenance during off-peak hours</li>
                  <li>• Monitor CPU usage trends for capacity planning</li>
                  <li>• All critical services are operational</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}