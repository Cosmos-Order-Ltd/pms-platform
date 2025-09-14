import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Housekeeping - Cyprus PMS",
  description: "Manage housekeeping tasks and room cleaning schedules",
}

interface HousekeepingTask {
  id: string
  roomNumber: string
  taskType: 'checkout' | 'maintenance' | 'deep' | 'inspection' | 'turnover' | 'preventive'
  status: 'scheduled' | 'in-progress' | 'completed' | 'quality-check' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  guestCheckout?: string
  nextCheckIn?: string
  estimatedDuration: number // minutes
  actualDuration?: number // minutes
  qualityScore?: number
  specialInstructions?: string
  createdAt: string
}

const mockHousekeepingTasks: HousekeepingTask[] = [
  {
    id: "HK-001",
    roomNumber: "205",
    taskType: "checkout",
    status: "scheduled",
    priority: "high",
    assignedTo: "Maria Ioannou",
    guestCheckout: "2024-01-15T11:00:00Z",
    nextCheckIn: "2024-01-15T15:00:00Z",
    estimatedDuration: 45,
    specialInstructions: "Guest reported broken lamp - check with maintenance",
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "HK-002",
    roomNumber: "101",
    taskType: "turnover",
    status: "in-progress",
    priority: "urgent",
    assignedTo: "Elena Constantinou",
    guestCheckout: "2024-01-15T10:30:00Z",
    nextCheckIn: "2024-01-15T14:00:00Z",
    estimatedDuration: 40,
    actualDuration: 25,
    createdAt: "2024-01-15T10:45:00Z"
  },
  {
    id: "HK-003",
    roomNumber: "312",
    taskType: "deep",
    status: "completed",
    priority: "medium",
    assignedTo: "Sophia Georgiou",
    estimatedDuration: 120,
    actualDuration: 110,
    qualityScore: 9,
    createdAt: "2024-01-14T08:00:00Z"
  },
  {
    id: "HK-004",
    roomNumber: "408",
    taskType: "maintenance",
    status: "quality-check",
    priority: "medium",
    assignedTo: "Anna Christou",
    estimatedDuration: 60,
    actualDuration: 55,
    specialInstructions: "Carpet cleaning required after maintenance work",
    createdAt: "2024-01-15T07:30:00Z"
  }
]

export default function HousekeepingPage() {
  const getTaskTypeIcon = (type: HousekeepingTask['taskType']) => {
    switch (type) {
      case 'checkout':
        return '🚪'
      case 'maintenance':
        return '🔧'
      case 'deep':
        return '✨'
      case 'inspection':
        return '🔍'
      case 'turnover':
        return '🔄'
      case 'preventive':
        return '🛡️'
      default:
        return '🧹'
    }
  }

  const getStatusColor = (status: HousekeepingTask['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'quality-check':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: HousekeepingTask['priority']) => {
    switch (priority) {
      case 'urgent':
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

  const scheduledTasks = mockHousekeepingTasks.filter(task => task.status === 'scheduled').length
  const inProgressTasks = mockHousekeepingTasks.filter(task => task.status === 'in-progress').length
  const completedToday = mockHousekeepingTasks.filter(task =>
    task.status === 'completed' || task.status === 'approved'
  ).length
  const qualityIssues = mockHousekeepingTasks.filter(task => task.status === 'rejected').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Housekeeping Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage room cleaning schedules and tasks</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <option value="all">All Staff</option>
                <option value="maria">Maria Ioannou</option>
                <option value="elena">Elena Constantinou</option>
                <option value="sophia">Sophia Georgiou</option>
                <option value="anna">Anna Christou</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled Tasks</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{scheduledTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inProgressTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quality Issues</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{qualityIssues}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockHousekeepingTasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/* Task Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-1 h-8 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <div className="text-2xl">{getTaskTypeIcon(task.taskType)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Room {task.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)} Cleaning
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').split(' ').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>

                    {/* Task Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to:</p>
                        <p className="font-medium text-gray-900 dark:text-white">{task.assignedTo}</p>
                      </div>

                      {task.guestCheckout && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Guest Checkout:</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(task.guestCheckout).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}

                      {task.nextCheckIn && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Next Check-in:</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(task.nextCheckIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Time and Quality */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <span className="mr-1">⏱️</span>
                          Est: {task.estimatedDuration}min
                          {task.actualDuration && ` | Actual: ${task.actualDuration}min`}
                        </div>
                        {task.qualityScore && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <span className="mr-1">⭐</span>
                            Quality: {task.qualityScore}/10
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {task.specialInstructions && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Special Instructions:</p>
                        <p className="text-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                          {task.specialInstructions}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {new Date(task.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.status === 'scheduled' && (
                          <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                            Start Task
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                            Mark Complete
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">
                            Quality Check
                          </button>
                        )}
                        <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Staff Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Performance</h3>
              <div className="space-y-4">
                {[
                  { name: "Maria Ioannou", completed: 8, avgTime: 42, score: 9.2 },
                  { name: "Elena Constantinou", completed: 6, avgTime: 38, score: 9.5 },
                  { name: "Sophia Georgiou", completed: 7, avgTime: 45, score: 8.8 },
                  { name: "Anna Christou", completed: 5, avgTime: 40, score: 9.0 }
                ].map((staff) => (
                  <div key={staff.name} className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{staff.name}</span>
                      <span className="text-sm text-green-600 dark:text-green-400">⭐ {staff.score}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {staff.completed} tasks • Avg {staff.avgTime}min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supply Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supply Status</h3>
              <div className="space-y-3">
                {[
                  { item: "Towels", level: 85, status: "good" },
                  { item: "Bed Sheets", level: 92, status: "good" },
                  { item: "Toilet Paper", level: 25, status: "low" },
                  { item: "Cleaning Supplies", level: 60, status: "medium" },
                  { item: "Toiletries", level: 15, status: "critical" }
                ].map((supply) => (
                  <div key={supply.item} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{supply.item}</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            supply.status === 'critical' ? 'bg-red-500' :
                            supply.status === 'low' ? 'bg-yellow-500' :
                            supply.status === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${supply.level}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{supply.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Status Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Status Summary</h3>
              <div className="space-y-2">
                {[
                  { status: "Clean & Ready", count: 18, color: "bg-green-500" },
                  { status: "Dirty", count: 6, color: "bg-yellow-500" },
                  { status: "In Progress", count: 3, color: "bg-blue-500" },
                  { status: "Maintenance", count: 2, color: "bg-red-500" },
                  { status: "Inspection", count: 1, color: "bg-purple-500" }
                ].map((room) => (
                  <div key={room.status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${room.color} mr-2`}></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{room.status}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{room.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}