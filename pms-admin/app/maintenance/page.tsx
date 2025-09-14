import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maintenance - Cyprus PMS",
  description: "Track and manage property maintenance requests and work orders",
}

interface MaintenanceRequest {
  id: string
  requestNumber: string
  type: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'furniture' | 'safety' | 'cleaning_equipment' | 'general' | 'emergency'
  status: 'submitted' | 'acknowledged' | 'assigned' | 'in_progress' | 'parts_ordered' | 'completed' | 'verified' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency'
  room: string
  issue: string
  description?: string
  reportedBy: string
  assignedTo?: string
  technician?: string
  vendor?: {
    name: string
    contact: string
    estimatedCost: number
  }
  reportedAt: string
  acknowledgedAt?: string
  startedAt?: string
  completedAt?: string
  estimatedCompletionTime?: number // hours
  actualTimeSpent?: number // hours
  resolution?: string
  workPerformed?: string
  images?: string[]
  partsRequired?: { name: string; quantity: number; cost: number }[]
  partsOrdered: boolean
  partsReceived: boolean
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "MNT-001",
    requestNumber: "WO-2024-0015",
    type: "plumbing",
    status: "in_progress",
    priority: "critical",
    room: "205",
    issue: "Water leak in bathroom ceiling",
    description: "Guest reported water dripping from bathroom ceiling. Appears to be coming from room above.",
    reportedBy: "Front Desk",
    assignedTo: "Maintenance Team",
    technician: "Andreas Michaelidis",
    reportedAt: "2024-01-15T09:15:00Z",
    acknowledgedAt: "2024-01-15T09:30:00Z",
    startedAt: "2024-01-15T10:00:00Z",
    estimatedCompletionTime: 4,
    partsRequired: [
      { name: "Pipe Joint Seal", quantity: 2, cost: 15.00 },
      { name: "Bathroom Ceiling Tile", quantity: 1, cost: 25.00 }
    ],
    partsOrdered: true,
    partsReceived: false
  },
  {
    id: "MNT-002",
    requestNumber: "WO-2024-0016",
    type: "electrical",
    status: "completed",
    priority: "medium",
    room: "312",
    issue: "Bedside lamp not working",
    description: "Left bedside lamp not turning on. Bulb has been replaced but still not working.",
    reportedBy: "Housekeeping",
    assignedTo: "Maintenance Team",
    technician: "Costas Dimitriou",
    reportedAt: "2024-01-14T14:20:00Z",
    acknowledgedAt: "2024-01-14T14:45:00Z",
    startedAt: "2024-01-14T16:00:00Z",
    completedAt: "2024-01-14T16:30:00Z",
    actualTimeSpent: 0.5,
    resolution: "Faulty wiring in lamp socket. Replaced entire lamp fixture.",
    workPerformed: "Disconnected old lamp, installed new bedside lamp, tested electrical connection",
    partsRequired: [
      { name: "Bedside Lamp with USB", quantity: 1, cost: 45.00 }
    ],
    partsOrdered: true,
    partsReceived: true
  },
  {
    id: "MNT-003",
    requestNumber: "WO-2024-0017",
    type: "hvac",
    status: "parts_ordered",
    priority: "high",
    room: "101",
    issue: "Air conditioning not cooling",
    description: "Room temperature not decreasing despite AC running. Filter was cleaned but issue persists.",
    reportedBy: "Guest",
    assignedTo: "External Vendor",
    vendor: {
      name: "Cyprus HVAC Services",
      contact: "+357 22 345678",
      estimatedCost: 180.00
    },
    reportedAt: "2024-01-15T11:30:00Z",
    acknowledgedAt: "2024-01-15T12:00:00Z",
    estimatedCompletionTime: 6,
    partsRequired: [
      { name: "AC Compressor Unit", quantity: 1, cost: 150.00 }
    ],
    partsOrdered: true,
    partsReceived: false
  },
  {
    id: "MNT-004",
    requestNumber: "WO-2024-0018",
    type: "emergency",
    status: "submitted",
    priority: "emergency",
    room: "Lobby",
    issue: "Main entrance automatic door malfunction",
    description: "Main entrance door is stuck half-open, creating security and climate control issues.",
    reportedBy: "Security",
    reportedAt: "2024-01-15T13:45:00Z",
    partsOrdered: false,
    partsReceived: false
  }
]

export default function MaintenancePage() {
  const getTypeIcon = (type: MaintenanceRequest['type']) => {
    switch (type) {
      case 'plumbing':
        return '🚰'
      case 'electrical':
        return '⚡'
      case 'hvac':
        return '❄️'
      case 'appliance':
        return '📺'
      case 'furniture':
        return '🪑'
      case 'safety':
        return '🛡️'
      case 'cleaning_equipment':
        return '🧹'
      case 'emergency':
        return '🚨'
      default:
        return '🔧'
    }
  }

  const getStatusColor = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'assigned':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'parts_ordered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'verified':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      case 'closed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'emergency':
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

  const emergencyRequests = mockMaintenanceRequests.filter(req => req.priority === 'emergency').length
  const criticalRequests = mockMaintenanceRequests.filter(req => req.priority === 'critical').length
  const inProgressRequests = mockMaintenanceRequests.filter(req => req.status === 'in_progress').length
  const pendingParts = mockMaintenanceRequests.filter(req => req.partsOrdered && !req.partsReceived).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage maintenance requests and work orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <option value="all">All Types</option>
                <option value="emergency">Emergency</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC</option>
                <option value="appliance">Appliance</option>
              </select>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium">
                Emergency Request
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                New Request
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
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Emergency</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{emergencyRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-orange-100 dark:bg-orange-900">
                <span className="text-orange-600 dark:text-orange-400 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{criticalRequests}</p>
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
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inProgressRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900">
                <span className="text-purple-600 dark:text-purple-400 text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Parts</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingParts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Requests</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockMaintenanceRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                {/* Request Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-1 h-12 rounded-full ${getPriorityColor(request.priority)}`}></div>
                    <div className="text-2xl">{getTypeIcon(request.type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.requestNumber}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.type.charAt(0).toUpperCase() + request.type.replace('_', ' ').slice(1)} • Room {request.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ').split(' ').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}
                          title={request.priority}></span>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{request.issue}</h4>
                  {request.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{request.description}</p>
                  )}
                </div>

                {/* Assignment and Timing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reported by:</p>
                    <p className="font-medium text-gray-900 dark:text-white">{request.reportedBy}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.technician || request.assignedTo || 'Unassigned'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reported:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(request.reportedAt).toLocaleDateString()} {new Date(request.reportedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.actualTimeSpent ? 'Time Spent:' : 'Est. Time:'}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.actualTimeSpent || request.estimatedCompletionTime || 'TBD'}h
                    </p>
                  </div>
                </div>

                {/* Vendor Information */}
                {request.vendor && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">External Vendor:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {request.vendor.name} • {request.vendor.contact} • Est: €{request.vendor.estimatedCost}
                    </p>
                  </div>
                )}

                {/* Parts Required */}
                {request.partsRequired && request.partsRequired.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Parts Required:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.partsRequired.map((part, index) => (
                        <span key={index} className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          request.partsReceived ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          request.partsOrdered ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {part.name} ({part.quantity}) - €{part.cost}
                          {request.partsReceived ? ' ✅' : request.partsOrdered ? ' 📦' : ' ❌'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution */}
                {request.resolution && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-md">
                    <p className="text-sm font-medium text-green-900 dark:text-green-200 mb-1">Resolution:</p>
                    <p className="text-sm text-green-800 dark:text-green-300">{request.resolution}</p>
                    {request.workPerformed && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-green-900 dark:text-green-200">Work Performed:</p>
                        <p className="text-sm text-green-800 dark:text-green-300">{request.workPerformed}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    {request.acknowledgedAt && (
                      <span>Ack: {new Date(request.acknowledgedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                    {request.startedAt && (
                      <span>• Started: {new Date(request.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                    {request.completedAt && (
                      <span>• Completed: {new Date(request.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {request.status === 'submitted' && (
                      <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                        Acknowledge
                      </button>
                    )}
                    {request.status === 'acknowledged' && (
                      <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
                        Assign
                      </button>
                    )}
                    {request.status === 'assigned' && (
                      <button className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded">
                        Start Work
                      </button>
                    )}
                    {request.status === 'in_progress' && (
                      <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                        Mark Complete
                      </button>
                    )}
                    {(request.status === 'completed' || request.status === 'verified') && (
                      <button className="text-xs bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded">
                        Close Request
                      </button>
                    )}
                    <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      Details
                    </button>
                    <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}