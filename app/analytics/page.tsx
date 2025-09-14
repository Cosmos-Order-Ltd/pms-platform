'use client'

import { useState } from 'react'

interface KPI {
  name: string
  value: string | number
  previousValue: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'stable'
  unit: string
  icon: string
  target?: number
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

interface ChartData {
  name: string
  current: number
  previous: number
  target?: number
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')

  // Mock data based on selected period
  const kpis: KPI[] = [
    {
      name: 'Total Revenue',
      value: '€247,350',
      previousValue: '€231,200',
      change: 6.98,
      changeType: 'increase',
      unit: '€',
      icon: '💰',
      target: 250000,
      color: 'green'
    },
    {
      name: 'Occupancy Rate',
      value: '87.4%',
      previousValue: '83.2%',
      change: 5.05,
      changeType: 'increase',
      unit: '%',
      icon: '🏨',
      target: 90,
      color: 'blue'
    },
    {
      name: 'ADR (Avg Daily Rate)',
      value: '€185.50',
      previousValue: '€178.30',
      change: 4.04,
      changeType: 'increase',
      unit: '€',
      icon: '📊',
      target: 195,
      color: 'purple'
    },
    {
      name: 'RevPAR',
      value: '€162.13',
      previousValue: '€148.35',
      change: 9.29,
      changeType: 'increase',
      unit: '€',
      icon: '🎯',
      target: 175,
      color: 'green'
    },
    {
      name: 'Guest Satisfaction',
      value: '4.8/5',
      previousValue: '4.6/5',
      change: 4.35,
      changeType: 'increase',
      unit: '/5',
      icon: '😊',
      target: 4.9,
      color: 'yellow'
    },
    {
      name: 'Service Response Time',
      value: '12.3 min',
      previousValue: '15.7 min',
      change: -21.66,
      changeType: 'decrease',
      unit: 'min',
      icon: '⚡',
      target: 10,
      color: 'blue'
    }
  ]

  const revenueData: ChartData[] = [
    { name: 'Jan', current: 198000, previous: 185000, target: 200000 },
    { name: 'Feb', current: 220000, previous: 205000, target: 210000 },
    { name: 'Mar', current: 247000, previous: 231000, target: 240000 },
    { name: 'Apr', current: 265000, previous: 248000, target: 260000 },
    { name: 'May', current: 289000, previous: 272000, target: 280000 },
    { name: 'Jun', current: 312000, previous: 295000, target: 300000 }
  ]

  const occupancyData: ChartData[] = [
    { name: 'Mon', current: 85, previous: 78, target: 90 },
    { name: 'Tue', current: 82, previous: 75, target: 90 },
    { name: 'Wed', current: 88, previous: 83, target: 90 },
    { name: 'Thu', current: 91, previous: 87, target: 90 },
    { name: 'Fri', current: 96, previous: 92, target: 90 },
    { name: 'Sat', current: 98, previous: 95, target: 90 },
    { name: 'Sun', current: 89, previous: 85, target: 90 }
  ]

  const departmentPerformance = [
    { name: 'Front Desk', efficiency: 94, satisfaction: 4.9, revenue: 45200, target: 95 },
    { name: 'Housekeeping', efficiency: 87, satisfaction: 4.7, revenue: 12300, target: 90 },
    { name: 'Room Service', efficiency: 78, satisfaction: 4.5, revenue: 89400, target: 85 },
    { name: 'Concierge', efficiency: 91, satisfaction: 4.8, revenue: 23100, target: 90 },
    { name: 'Spa & Wellness', efficiency: 89, satisfaction: 4.9, revenue: 67800, target: 90 },
    { name: 'Maintenance', efficiency: 82, satisfaction: 4.4, revenue: 8900, target: 85 }
  ]

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600'
      case 'decrease': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return '↗️'
      case 'decrease': return '↘️'
      default: return '→'
    }
  }

  const getKpiColor = (color: string) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50',
      green: 'border-green-500 bg-green-50',
      red: 'border-red-500 bg-red-50',
      yellow: 'border-yellow-500 bg-yellow-50',
      purple: 'border-purple-500 bg-purple-50'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getProgressPercentage = (current: number | string, target?: number) => {
    if (!target) return 0
    const numCurrent = typeof current === 'string' ? parseFloat(current.replace(/[^0-9.]/g, '')) : current
    return Math.min((numCurrent / target) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Executive Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month' | 'quarter' | 'year')}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="all">All Properties</option>
                <option value="main">Main Resort</option>
                <option value="spa">Spa Villas</option>
                <option value="beach">Beach Suites</option>
              </select>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                📊 Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* KPI Grid */}
        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi, index) => (
            <div key={index} className={`rounded-lg border-l-4 bg-white p-6 shadow ${getKpiColor(kpi.color)}`}>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{kpi.icon}</div>
                <div className={`text-sm font-medium ${getChangeColor(kpi.changeType)}`}>
                  {getChangeIcon(kpi.changeType)} {Math.abs(kpi.change).toFixed(1)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>vs {kpi.previousValue}</span>
                  {kpi.target && (
                    <span>Target: {kpi.target}{kpi.unit === '€' ? '€' : kpi.unit}</span>
                  )}
                </div>
                {kpi.target && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(kpi.value, kpi.target)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <select className="rounded border border-gray-300 px-3 py-1 text-sm">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>YTD</option>
              </select>
            </div>
            <div className="h-80 flex items-end justify-between space-x-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex justify-center space-x-1 mb-2">
                    {/* Current Bar */}
                    <div className="relative w-4">
                      <div
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${(item.current / Math.max(...revenueData.map(d => d.current))) * 200}px` }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-900">
                        €{(item.current / 1000).toFixed(0)}k
                      </div>
                    </div>
                    {/* Previous Bar */}
                    <div className="relative w-4">
                      <div
                        className="bg-gray-300 rounded-t"
                        style={{ height: `${(item.previous / Math.max(...revenueData.map(d => d.current))) * 200}px` }}
                      ></div>
                    </div>
                    {/* Target Line */}
                    {item.target && (
                      <div className="absolute w-full border-t-2 border-dashed border-red-400"
                        style={{ bottom: `${(item.target / Math.max(...revenueData.map(d => d.current))) * 200}px` }}
                      ></div>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Previous</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-0 border-t-2 border-dashed border-red-400"></div>
                <span>Target</span>
              </div>
            </div>
          </div>

          {/* Occupancy Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Occupancy</h3>
              <select className="rounded border border-gray-300 px-3 py-1 text-sm">
                <option>This Week</option>
                <option>Last Week</option>
                <option>Last 4 Weeks</option>
              </select>
            </div>
            <div className="h-80 flex items-end justify-between space-x-2">
              {occupancyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex justify-center space-x-1 mb-2">
                    {/* Current Bar */}
                    <div className="relative w-6">
                      <div
                        className="bg-green-500 rounded-t"
                        style={{ height: `${(item.current / 100) * 200}px` }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-900">
                        {item.current}%
                      </div>
                    </div>
                    {/* Previous Bar */}
                    <div className="relative w-6">
                      <div
                        className="bg-gray-300 rounded-t"
                        style={{ height: `${(item.previous / 100) * 200}px` }}
                      ></div>
                    </div>
                  </div>
                  {/* Target Line */}
                  <div className="absolute w-full border-t-2 border-dashed border-red-400"
                    style={{ bottom: `${(item.target! / 100) * 200 + 40}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Previous</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-0 border-t-2 border-dashed border-red-400"></div>
                <span>Target (90%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="rounded border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="all">All Departments</option>
                <option value="front-desk">Front Desk</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="food-beverage">Food & Beverage</option>
                <option value="spa">Spa & Wellness</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Efficiency</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Satisfaction</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Revenue</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">vs Target</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departmentPerformance.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div className="font-medium text-gray-900">{dept.name}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{dept.efficiency}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              dept.efficiency >= dept.target ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${dept.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-medium text-gray-900">{dept.satisfaction}/5</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-medium text-gray-900">€{dept.revenue.toLocaleString()}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        {dept.efficiency >= dept.target ? (
                          <>
                            <span className="text-green-600">↗️</span>
                            <span className="text-green-600 font-medium">
                              +{((dept.efficiency / dept.target - 1) * 100).toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-red-600">↘️</span>
                            <span className="text-red-600 font-medium">
                              -{((1 - dept.efficiency / dept.target) * 100).toFixed(1)}%
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dept.efficiency >= dept.target
                          ? 'bg-green-100 text-green-800'
                          : dept.efficiency >= dept.target * 0.9
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {dept.efficiency >= dept.target
                          ? 'Exceeding'
                          : dept.efficiency >= dept.target * 0.9
                          ? 'On Track'
                          : 'Below Target'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-600 hover:border-blue-400 hover:text-blue-600">
            <span className="text-2xl">📊</span>
            <span className="font-medium">Create Custom Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-600 hover:border-green-400 hover:text-green-600">
            <span className="text-2xl">📈</span>
            <span className="font-medium">View Forecasting</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-600 hover:border-purple-400 hover:text-purple-600">
            <span className="text-2xl">🎯</span>
            <span className="font-medium">Performance Goals</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-600 hover:border-yellow-400 hover:text-yellow-600">
            <span className="text-2xl">📋</span>
            <span className="font-medium">Scheduled Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}