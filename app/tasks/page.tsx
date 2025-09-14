"use client"

import { useState } from "react"

interface Task {
  id: string
  title: string
  description?: string
  type: 'housekeeping' | 'maintenance' | 'front_desk' | 'admin' | 'other'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent'
  assignedTo?: string
  createdBy: string
  room?: string
  dueDate?: string
  scheduledFor?: string
  completedAt?: string
  estimatedDuration?: number // minutes
  actualDuration?: number // minutes
  createdAt: string
  tags?: string[]
}

const mockTasks: Task[] = [
  {
    id: "TSK-001",
    title: "Deep clean presidential suite",
    description: "VIP guest arriving tomorrow. Need thorough cleaning and amenity setup.",
    type: "housekeeping",
    status: "pending",
    priority: "urgent",
    assignedTo: "Maria Ioannou",
    createdBy: "Elena Constantinou",
    room: "401",
    dueDate: "2024-01-16T12:00:00Z",
    scheduledFor: "2024-01-16T08:00:00Z",
    estimatedDuration: 120,
    createdAt: "2024-01-15T09:30:00Z",
    tags: ["VIP", "Deep Clean", "Amenities"]
  },
  {
    id: "TSK-002",
    title: "Fix broken toilet handle",
    description: "Guest reported toilet handle is loose and not flushing properly.",
    type: "maintenance",
    status: "in_progress",
    priority: "high",
    assignedTo: "Andreas Michaelidis",
    createdBy: "Front Desk",
    room: "205",
    dueDate: "2024-01-15T16:00:00Z",
    scheduledFor: "2024-01-15T14:00:00Z",
    estimatedDuration: 30,
    createdAt: "2024-01-15T11:45:00Z",
    tags: ["Plumbing", "Guest Issue"]
  },
  {
    id: "TSK-003",
    title: "Update room rates in system",
    description: "Update winter season rates effective tomorrow.",
    type: "front_desk",
    status: "completed",
    priority: "medium",
    assignedTo: "Elena Constantinou",
    createdBy: "Hotel Manager",
    completedAt: "2024-01-15T10:15:00Z",
    estimatedDuration: 45,
    actualDuration: 35,
    createdAt: "2024-01-15T08:00:00Z",
    tags: ["Rates", "System Update"]
  },
  {
    id: "TSK-004",
    title: "Replace air fresheners in all bathrooms",
    description: "Monthly replacement of bathroom air fresheners across all guest rooms.",
    type: "housekeeping",
    status: "pending",
    priority: "low",
    assignedTo: "Sophia Georgiou",
    createdBy: "Head Housekeeper",
    dueDate: "2024-01-17T23:59:00Z",
    estimatedDuration: 90,
    createdAt: "2024-01-15T07:30:00Z",
    tags: ["Monthly", "Air Fresheners", "All Rooms"]
  },
  {
    id: "TSK-005",
    title: "Prepare monthly occupancy report",
    description: "Compile December occupancy statistics for management review.",
    type: "admin",
    status: "overdue",
    priority: "critical",
    assignedTo: "Front Office Manager",
    createdBy: "General Manager",
    dueDate: "2024-01-14T17:00:00Z",
    estimatedDuration: 120,
    createdAt: "2024-01-10T10:00:00Z",
    tags: ["Report", "Monthly", "Management"]
  }
]

export default function TasksPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'my_tasks' | 'pending' | 'in_progress' | 'overdue'>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'housekeeping':
        return '🧹'
      case 'maintenance':
        return '🔧'
      case 'front_desk':
        return '🏨'
      case 'admin':
        return '📋'
      default:
        return '📝'
    }
  }

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'housekeeping':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'front_desk':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600'
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return '🚨'
      case 'critical':
        return '⚠️'
      case 'high':
        return '🔴'
      case 'medium':
        return '🟡'
      case 'low':
        return '🟢'
      default:
        return '⚪'
    }
  }

  const filterTasks = () => {
    let filtered = mockTasks

    // Filter by status/category
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'my_tasks':
          // In a real app, this would filter by current user
          filtered = filtered.filter(task => task.assignedTo === 'Current User')
          break
        case 'pending':
          filtered = filtered.filter(task => task.status === 'pending')
          break
        case 'in_progress':
          filtered = filtered.filter(task => task.status === 'in_progress')
          break
        case 'overdue':
          filtered = filtered.filter(task => task.status === 'overdue' ||
            (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'))
          break
      }
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(task => task.type === selectedType)
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority)
    }

    return filtered
  }

  const filteredTasks = filterTasks()

  const pendingTasks = mockTasks.filter(task => task.status === 'pending').length
  const inProgressTasks = mockTasks.filter(task => task.status === 'in_progress').length
  const overdueTasks = mockTasks.filter(task =>
    task.status === 'overdue' ||
    (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed')
  ).length
  const completedTasks = mockTasks.filter(task => task.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Organize and track all operational tasks</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inProgressTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{overdueTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'my_tasks' | 'pending' | 'in_progress' | 'overdue')}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Tasks</option>
                <option value="my_tasks">My Tasks</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Types</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="maintenance">Maintenance</option>
                <option value="front_desk">Front Desk</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks ({filteredTasks.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 text-4xl mb-2">📝</div>
                <p className="text-gray-500 dark:text-gray-400">No tasks match the current filters</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-1 h-16 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`}></div>
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getTypeIcon(task.type)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg" title={task.priority}>
                        {getPriorityIcon(task.priority)}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').split(' ').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 ml-8">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Type & Room:</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(task.type)}`}>
                          {task.type.replace('_', ' ').split(' ').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                        {task.room && (
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Room {task.room}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {task.assignedTo || 'Unassigned'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {task.dueDate ? 'Due Date:' : 'Scheduled:'}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {task.dueDate ?
                          new Date(task.dueDate).toLocaleDateString() + ' ' + new Date(task.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
                          task.scheduledFor ?
                            new Date(task.scheduledFor).toLocaleDateString() + ' ' + new Date(task.scheduledFor).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
                            'Not scheduled'
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {task.actualDuration ? `${task.actualDuration}min (actual)` :
                         task.estimatedDuration ? `~${task.estimatedDuration}min` : 'TBD'}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="ml-8 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions and Metadata */}
                  <div className="flex items-center justify-between ml-8">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created by {task.createdBy} • {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      {task.completedAt && (
                        <span> • Completed {new Date(task.completedAt).toLocaleDateString()} {new Date(task.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {task.status === 'pending' && (
                        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                          Start Task
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                          Complete
                        </button>
                      )}
                      {task.status === 'overdue' && (
                        <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                          Escalate
                        </button>
                      )}
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        View Details
                      </button>
                      <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}