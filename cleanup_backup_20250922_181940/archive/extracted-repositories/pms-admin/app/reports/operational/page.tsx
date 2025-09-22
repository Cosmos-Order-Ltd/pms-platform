'use client'

import React, { useState } from 'react'

interface StaffProductivityMetric {
  staffId: string
  name: string
  department: string
  hoursWorked: number
  tasksCompleted: number
  avgTaskTime: number
  productivity: number
  rating: number
}

interface ServiceMetric {
  category: string
  total: number
  completed: number
  pending: number
  avgResponseTime: number
  satisfaction: number
}

interface HousekeepingMetric {
  metric: string
  value: number
  unit: string
  target: number
  variance: number
  trend: 'up' | 'down' | 'stable'
}

interface MaintenanceMetric {
  type: string
  requests: number
  completed: number
  avgCost: number
  totalCost: number
  preventiveMaintenance: number
}

export default function OperationalReportsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [department, setDepartment] = useState('all')

  const staffProductivity: StaffProductivityMetric[] = [
    {
      staffId: 'ST001',
      name: 'Maria Constantinou',
      department: 'Housekeeping',
      hoursWorked: 40,
      tasksCompleted: 156,
      avgTaskTime: 15.4,
      productivity: 92.5,
      rating: 4.8
    },
    {
      staffId: 'ST002',
      name: 'Andreas Georgiou',
      department: 'Front Desk',
      hoursWorked: 38,
      tasksCompleted: 89,
      avgTaskTime: 25.6,
      productivity: 88.2,
      rating: 4.6
    },
    {
      staffId: 'ST003',
      name: 'Elena Papadopoulos',
      department: 'Restaurant',
      hoursWorked: 42,
      tasksCompleted: 124,
      avgTaskTime: 20.3,
      productivity: 95.1,
      rating: 4.9
    },
    {
      staffId: 'ST004',
      name: 'Dimitris Ioannou',
      department: 'Maintenance',
      hoursWorked: 40,
      tasksCompleted: 67,
      avgTaskTime: 35.8,
      productivity: 87.4,
      rating: 4.5
    },
    {
      staffId: 'ST005',
      name: 'Sophia Christou',
      department: 'Concierge',
      hoursWorked: 35,
      tasksCompleted: 145,
      avgTaskTime: 14.5,
      productivity: 96.8,
      rating: 4.9
    }
  ]

  const serviceMetrics: ServiceMetric[] = [
    {
      category: 'Room Service',
      total: 234,
      completed: 228,
      pending: 6,
      avgResponseTime: 18.5,
      satisfaction: 4.7
    },
    {
      category: 'Housekeeping',
      total: 456,
      completed: 451,
      pending: 5,
      avgResponseTime: 12.3,
      satisfaction: 4.8
    },
    {
      category: 'Maintenance',
      total: 89,
      completed: 82,
      pending: 7,
      avgResponseTime: 45.6,
      satisfaction: 4.2
    },
    {
      category: 'Concierge',
      total: 312,
      completed: 309,
      pending: 3,
      avgResponseTime: 8.7,
      satisfaction: 4.9
    },
    {
      category: 'IT Support',
      total: 67,
      completed: 64,
      pending: 3,
      avgResponseTime: 25.4,
      satisfaction: 4.4
    }
  ]

  const housekeepingMetrics: HousekeepingMetric[] = [
    {
      metric: 'Rooms Cleaned/Hour',
      value: 3.2,
      unit: 'rooms',
      target: 3.0,
      variance: 6.7,
      trend: 'up'
    },
    {
      metric: 'Quality Score',
      value: 4.8,
      unit: '/5',
      target: 4.5,
      variance: 6.7,
      trend: 'up'
    },
    {
      metric: 'Supply Cost/Room',
      value: 8.50,
      unit: '€',
      target: 9.00,
      variance: -5.6,
      trend: 'down'
    },
    {
      metric: 'Task Completion Rate',
      value: 98.9,
      unit: '%',
      target: 95.0,
      variance: 4.1,
      trend: 'stable'
    },
    {
      metric: 'Guest Complaints',
      value: 2,
      unit: 'count',
      target: 5,
      variance: -60.0,
      trend: 'down'
    }
  ]

  const maintenanceMetrics: MaintenanceMetric[] = [
    {
      type: 'HVAC',
      requests: 23,
      completed: 21,
      avgCost: 145.50,
      totalCost: 3055.50,
      preventiveMaintenance: 15
    },
    {
      type: 'Plumbing',
      requests: 34,
      completed: 32,
      avgCost: 89.25,
      totalCost: 2856.00,
      preventiveMaintenance: 8
    },
    {
      type: 'Electrical',
      requests: 18,
      completed: 17,
      avgCost: 125.75,
      totalCost: 2137.75,
      preventiveMaintenance: 12
    },
    {
      type: 'Furniture',
      requests: 29,
      completed: 27,
      avgCost: 67.50,
      totalCost: 1822.50,
      preventiveMaintenance: 5
    },
    {
      type: 'General',
      requests: 45,
      completed: 42,
      avgCost: 52.25,
      totalCost: 2194.50,
      preventiveMaintenance: 18
    }
  ]

  const getProductivityColor = (productivity: number): string => {
    if (productivity >= 90) return 'text-green-600'
    if (productivity >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getVarianceColor = (variance: number, metric: string): string => {
    const isGoodPositive = !['Guest Complaints', 'Supply Cost/Room'].includes(metric)
    if (isGoodPositive) {
      return variance > 0 ? 'text-green-600' : 'text-red-600'
    } else {
      return variance < 0 ? 'text-green-600' : 'text-red-600'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Operational Analytics</h1>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="front-desk">Front Desk</option>
            <option value="restaurant">Restaurant</option>
            <option value="maintenance">Maintenance</option>
            <option value="concierge">Concierge</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Staff Productivity</h2>
          <div className="space-y-4">
            {staffProductivity.map((staff) => (
              <div key={staff.staffId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{staff.name}</h3>
                    <p className="text-sm text-gray-600">{staff.department}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getProductivityColor(staff.productivity)}`}>
                      {staff.productivity}%
                    </div>
                    <div className="text-sm text-gray-500">
                      ⭐ {staff.rating}/5.0
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Hours:</span>
                    <span className="ml-1 font-medium">{staff.hoursWorked}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tasks:</span>
                    <span className="ml-1 font-medium">{staff.tasksCompleted}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Time:</span>
                    <span className="ml-1 font-medium">{staff.avgTaskTime}min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Service Request Analytics</h2>
          <div className="space-y-4">
            {serviceMetrics.map((service) => (
              <div key={service.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{service.category}</h3>
                  <div className="text-sm text-gray-500">
                    ⭐ {service.satisfaction}/5.0
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{service.completed}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{service.pending}</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completion Rate:</span>
                  <span className="font-medium">
                    {((service.completed / service.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg Response:</span>
                  <span className="font-medium">{service.avgResponseTime}min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Housekeeping Efficiency</h2>
          <div className="space-y-4">
            {housekeepingMetrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <div className="font-medium">{metric.metric}</div>
                  <div className="text-sm text-gray-500">
                    Target: {metric.target} {metric.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {metric.value} {metric.unit}
                    </span>
                    <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                  </div>
                  <div className={`text-sm ${getVarianceColor(metric.variance, metric.metric)}`}>
                    {metric.variance > 0 ? '+' : ''}{metric.variance.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Cost Analysis</h2>
          <div className="space-y-4">
            {maintenanceMetrics.map((maintenance) => (
              <div key={maintenance.type} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{maintenance.type}</h3>
                  <div className="text-lg font-bold text-blue-600">
                    €{maintenance.totalCost.toFixed(2)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Requests:</span>
                    <span className="ml-1 font-medium">{maintenance.requests}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <span className="ml-1 font-medium">{maintenance.completed}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Cost:</span>
                    <span className="ml-1 font-medium">€{maintenance.avgCost}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Preventive:</span>
                    <span className="ml-1 font-medium">{maintenance.preventiveMaintenance}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Completion Rate:</span>
                    <span className="font-medium">
                      {((maintenance.completed / maintenance.requests) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-500">Overall Efficiency</div>
            <div className="text-xs text-green-600 mt-1">↗️ +2.3% from last week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">16.8min</div>
            <div className="text-sm text-gray-500">Avg Response Time</div>
            <div className="text-xs text-green-600 mt-1">↗️ -1.2min from last week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">4.7/5</div>
            <div className="text-sm text-gray-500">Service Quality</div>
            <div className="text-xs text-green-600 mt-1">↗️ +0.1 from last week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">€12,066</div>
            <div className="text-sm text-gray-500">Weekly Op. Costs</div>
            <div className="text-xs text-red-600 mt-1">↗️ +€156 from last week</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Export operational data:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              📊 Excel
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
              📄 PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              📈 Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}