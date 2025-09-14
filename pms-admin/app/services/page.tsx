'use client'

import { useState } from 'react'

interface ServiceRequest {
  id: string
  guestName: string
  roomNumber: string
  type: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'requested' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled'
  requestedAt: string
  estimatedTime?: string
  assignedTo?: string
  cost?: number
  guestRating?: number
}

interface ServiceMenu {
  category: string
  icon: string
  services: {
    name: string
    description: string
    price?: number
    estimatedTime: string
  }[]
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'menu' | 'staff' | 'analytics'>('requests')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [_showNewRequest, setShowNewRequest] = useState(false)

  // Mock data
  const serviceRequests: ServiceRequest[] = [
    {
      id: 'SR-001',
      guestName: 'John Smith',
      roomNumber: '205',
      type: 'Room Service',
      title: 'Breakfast Order',
      description: 'Continental breakfast for 2, orange juice, coffee',
      priority: 'medium',
      status: 'in_progress',
      requestedAt: '2025-09-14 08:30',
      estimatedTime: '30 mins',
      assignedTo: 'Maria Santos',
      cost: 45.00,
      guestRating: 5
    },
    {
      id: 'SR-002',
      guestName: 'Elena Papadopoulos',
      roomNumber: '312',
      type: 'Concierge',
      title: 'Restaurant Reservation',
      description: 'Table for 4 at Poseidon Restaurant, 7:30 PM tonight',
      priority: 'high',
      status: 'completed',
      requestedAt: '2025-09-14 09:15',
      assignedTo: 'Andreas Dimitriou',
      guestRating: 5
    },
    {
      id: 'SR-003',
      guestName: 'David Chen',
      roomNumber: '408',
      type: 'Transportation',
      title: 'Airport Transfer',
      description: 'Pickup for 3 passengers at 2:00 PM tomorrow',
      priority: 'medium',
      status: 'acknowledged',
      requestedAt: '2025-09-14 10:45',
      cost: 85.00,
      assignedTo: 'Kostas Georgiou'
    },
    {
      id: 'SR-004',
      guestName: 'Sarah Wilson',
      roomNumber: '156',
      type: 'Spa & Wellness',
      title: 'Couples Massage',
      description: 'Swedish massage for 2, 90 minutes, tomorrow 3:00 PM',
      priority: 'medium',
      status: 'requested',
      requestedAt: '2025-09-14 11:20',
      cost: 220.00
    }
  ]

  const serviceMenu: ServiceMenu[] = [
    {
      category: 'Room Service',
      icon: '🍽️',
      services: [
        { name: 'Continental Breakfast', description: 'Fresh pastries, fruits, coffee/tea', price: 25, estimatedTime: '25 mins' },
        { name: 'Lunch Menu', description: 'Mediterranean cuisine selection', price: 35, estimatedTime: '35 mins' },
        { name: 'Dinner Menu', description: 'Fine dining experience', price: 55, estimatedTime: '45 mins' },
        { name: 'Late Night Snacks', description: 'Light bites and beverages', price: 18, estimatedTime: '20 mins' }
      ]
    },
    {
      category: 'Concierge Services',
      icon: '🛎️',
      services: [
        { name: 'Restaurant Reservations', description: 'Book tables at local restaurants', estimatedTime: '10 mins' },
        { name: 'Tour Bookings', description: 'Arrange local tours and excursions', estimatedTime: '15 mins' },
        { name: 'Event Tickets', description: 'Theatre, concerts, sports events', estimatedTime: '20 mins' },
        { name: 'Local Information', description: 'Recommendations and directions', estimatedTime: '5 mins' }
      ]
    },
    {
      category: 'Transportation',
      icon: '🚗',
      services: [
        { name: 'Airport Transfer', description: 'Luxury vehicle transfer', price: 85, estimatedTime: '45 mins' },
        { name: 'City Tours', description: 'Guided city tours', price: 120, estimatedTime: '4 hours' },
        { name: 'Taxi Service', description: 'Local transportation', price: 35, estimatedTime: '10 mins' },
        { name: 'Car Rental', description: 'Daily car rental service', price: 75, estimatedTime: '30 mins' }
      ]
    },
    {
      category: 'Spa & Wellness',
      icon: '💆',
      services: [
        { name: 'Swedish Massage', description: 'Relaxing full body massage', price: 90, estimatedTime: '60 mins' },
        { name: 'Couples Massage', description: 'Side-by-side massage experience', price: 220, estimatedTime: '90 mins' },
        { name: 'Facial Treatment', description: 'Rejuvenating facial therapy', price: 75, estimatedTime: '60 mins' },
        { name: 'Wellness Package', description: 'Full spa day experience', price: 180, estimatedTime: '4 hours' }
      ]
    },
    {
      category: 'Recreation',
      icon: '🏊',
      services: [
        { name: 'Pool Cabana Rental', description: 'Private poolside space', price: 65, estimatedTime: 'All day' },
        { name: 'Beach Equipment', description: 'Umbrellas, chairs, towels', price: 25, estimatedTime: '10 mins' },
        { name: 'Water Sports', description: 'Jet ski, parasailing, diving', price: 150, estimatedTime: '2 hours' },
        { name: 'Tennis Court', description: 'Private court booking', price: 45, estimatedTime: '1 hour' }
      ]
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800'
      case 'requested': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = selectedStatus === 'all'
    ? serviceRequests
    : serviceRequests.filter(req => req.status === selectedStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Guest Services Management</h1>
              <p className="text-gray-600">Coordinate all guest service requests and offerings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowNewRequest(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                New Service Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'requests', label: 'Service Requests', icon: '📋' },
              { id: 'menu', label: 'Service Menu', icon: '📖' },
              { id: 'staff', label: 'Staff Assignment', icon: '👥' },
              { id: 'analytics', label: 'Performance', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'requests' | 'menu' | 'staff' | 'analytics')}
                className={`flex items-center space-x-2 border-b-2 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="text"
                placeholder="Search by guest or room..."
                className="rounded-lg border border-gray-300 px-4 py-2"
              />
              <button className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">
                Export
              </button>
            </div>

            {/* Service Requests Table */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Request Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{request.title}</p>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {request.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{request.description}</p>
                            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                              <span>{request.requestedAt}</span>
                              {request.estimatedTime && <span>⏱️ {request.estimatedTime}</span>}
                              {request.guestRating && (
                                <span className="text-yellow-600">
                                  ⭐ {request.guestRating}/5
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{request.guestName}</p>
                            <p className="text-sm text-gray-600">Room {request.roomNumber}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {request.assignedTo ? (
                            <p className="text-sm text-gray-900">{request.assignedTo}</p>
                          ) : (
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              Assign Staff
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {request.cost && (
                            <p className="text-sm font-medium text-gray-900">
                              €{request.cost.toFixed(2)}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 text-sm">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Service Offerings</h3>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Add Service
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {serviceMenu.map((category, categoryIndex) => (
                <div key={categoryIndex} className="rounded-lg bg-white p-6 shadow">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="text-2xl">{category.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
                  </div>
                  <div className="space-y-3">
                    {category.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-start justify-between border-l-2 border-blue-200 pl-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900">{service.name}</h5>
                            {service.price && (
                              <span className="text-sm font-medium text-green-600">
                                €{service.price}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <p className="text-xs text-gray-500">⏱️ {service.estimatedTime}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-blue-600">
                            ✏️
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance & Availability</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Maria Santos', department: 'Room Service', active: 3, completed: 12, rating: 4.8, available: true },
                  { name: 'Andreas Dimitriou', department: 'Concierge', active: 1, completed: 8, rating: 4.9, available: true },
                  { name: 'Kostas Georgiou', department: 'Transportation', active: 2, completed: 6, rating: 4.7, available: false },
                  { name: 'Sofia Christou', department: 'Spa & Wellness', active: 0, completed: 15, rating: 5.0, available: true },
                  { name: 'Nikos Papadakis', department: 'Recreation', active: 1, completed: 9, rating: 4.6, available: true },
                  { name: 'Elena Stavrou', department: 'Room Service', active: 2, completed: 11, rating: 4.8, available: true }
                ].map((staff, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{staff.name}</h4>
                        <p className="text-sm text-gray-600">{staff.department}</p>
                      </div>
                      <div className={`h-3 w-3 rounded-full ${
                        staff.available ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Active Requests:</span>
                        <span className="font-medium">{staff.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed Today:</span>
                        <span className="font-medium">{staff.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-medium text-yellow-600">
                          ⭐ {staff.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📋</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Requests Today</p>
                    <p className="text-2xl font-semibold text-gray-900">47</p>
                    <p className="text-sm text-green-600">+8% from yesterday</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⚡</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                    <p className="text-2xl font-semibold text-gray-900">12m</p>
                    <p className="text-sm text-green-600">-3m from yesterday</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">😊</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Guest Satisfaction</p>
                    <p className="text-2xl font-semibold text-gray-900">4.8/5</p>
                    <p className="text-sm text-green-600">⭐ 92% excellent</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">💰</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Service Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">€2,347</p>
                    <p className="text-sm text-green-600">+15% this week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Category Performance */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Category Performance</h3>
              <div className="space-y-4">
                {[
                  { category: 'Room Service', requests: 18, revenue: 890, satisfaction: 4.9 },
                  { category: 'Concierge', requests: 12, revenue: 240, satisfaction: 4.8 },
                  { category: 'Transportation', requests: 8, revenue: 680, satisfaction: 4.7 },
                  { category: 'Spa & Wellness', requests: 6, revenue: 420, satisfaction: 5.0 },
                  { category: 'Recreation', requests: 3, revenue: 117, satisfaction: 4.6 }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{category.category}</h4>
                      <div className="flex items-center space-x-6 mt-1 text-sm text-gray-600">
                        <span>{category.requests} requests</span>
                        <span>€{category.revenue} revenue</span>
                        <span>⭐ {category.satisfaction}/5</span>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(category.requests / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}