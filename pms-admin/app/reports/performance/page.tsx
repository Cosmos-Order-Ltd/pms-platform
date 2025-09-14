'use client'

import React, { useState } from 'react'

interface PerformanceCard {
  id: string
  title: string
  department: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'average' | 'poor'
  metrics: {
    name: string
    value: number
    target: number
    unit: string
  }[]
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

interface KPIComparison {
  metric: string
  current: number
  target: number
  industry: number
  unit: string
  performance: 'above' | 'at' | 'below'
}

interface PropertyComparison {
  propertyName: string
  overallScore: number
  revenue: number
  occupancy: number
  satisfaction: number
  efficiency: number
}

export default function PerformanceScorecardsPage() {
  const [selectedProperty, setSelectedProperty] = useState('all')
  const [timeRange, setTimeRange] = useState('30d')
  const [scorecard, setScorecard] = useState('overall')

  const performanceCards: PerformanceCard[] = [
    {
      id: 'revenue',
      title: 'Revenue Performance',
      department: 'Finance',
      score: 87,
      maxScore: 100,
      status: 'good',
      metrics: [
        { name: 'Total Revenue', value: 247350, target: 250000, unit: '€' },
        { name: 'RevPAR', value: 89.50, target: 85.00, unit: '€' },
        { name: 'ADR', value: 142.75, target: 140.00, unit: '€' },
        { name: 'Revenue Growth', value: 6.8, target: 5.0, unit: '%' }
      ],
      trend: 'up',
      lastUpdated: '2024-12-30 14:30'
    },
    {
      id: 'operations',
      title: 'Operational Excellence',
      department: 'Operations',
      score: 94,
      maxScore: 100,
      status: 'excellent',
      metrics: [
        { name: 'Service Quality', value: 4.8, target: 4.5, unit: '/5' },
        { name: 'Response Time', value: 16.8, target: 20.0, unit: 'min' },
        { name: 'Task Completion', value: 98.9, target: 95.0, unit: '%' },
        { name: 'Staff Productivity', value: 94.2, target: 90.0, unit: '%' }
      ],
      trend: 'up',
      lastUpdated: '2024-12-30 15:15'
    },
    {
      id: 'guest',
      title: 'Guest Satisfaction',
      department: 'Guest Services',
      score: 91,
      maxScore: 100,
      status: 'excellent',
      metrics: [
        { name: 'Overall Rating', value: 4.7, target: 4.5, unit: '/5' },
        { name: 'Review Score', value: 4.6, target: 4.3, unit: '/5' },
        { name: 'Loyalty Rate', value: 78.5, target: 75.0, unit: '%' },
        { name: 'Complaint Resolution', value: 96.2, target: 90.0, unit: '%' }
      ],
      trend: 'stable',
      lastUpdated: '2024-12-30 13:45'
    },
    {
      id: 'financial',
      title: 'Financial Health',
      department: 'Finance',
      score: 82,
      maxScore: 100,
      status: 'good',
      metrics: [
        { name: 'Profit Margin', value: 23.5, target: 25.0, unit: '%' },
        { name: 'Cost Control', value: 89.2, target: 90.0, unit: '%' },
        { name: 'Cash Flow', value: 45000, target: 50000, unit: '€' },
        { name: 'Budget Variance', value: 2.3, target: 5.0, unit: '%' }
      ],
      trend: 'down',
      lastUpdated: '2024-12-30 16:00'
    },
    {
      id: 'marketing',
      title: 'Marketing Effectiveness',
      department: 'Marketing',
      score: 76,
      maxScore: 100,
      status: 'average',
      metrics: [
        { name: 'Lead Conversion', value: 18.5, target: 20.0, unit: '%' },
        { name: 'Customer Acquisition Cost', value: 89.50, target: 85.00, unit: '€' },
        { name: 'Brand Awareness', value: 67.0, target: 70.0, unit: '%' },
        { name: 'Digital Engagement', value: 8.2, target: 10.0, unit: '%' }
      ],
      trend: 'up',
      lastUpdated: '2024-12-30 12:20'
    },
    {
      id: 'sustainability',
      title: 'Sustainability Score',
      department: 'Environmental',
      score: 85,
      maxScore: 100,
      status: 'good',
      metrics: [
        { name: 'Energy Efficiency', value: 88.5, target: 85.0, unit: '%' },
        { name: 'Waste Reduction', value: 76.2, target: 75.0, unit: '%' },
        { name: 'Water Conservation', value: 82.0, target: 80.0, unit: '%' },
        { name: 'Carbon Footprint', value: 15.2, target: 18.0, unit: 'kg CO2/guest' }
      ],
      trend: 'up',
      lastUpdated: '2024-12-30 11:30'
    }
  ]

  const kpiComparisons: KPIComparison[] = [
    {
      metric: 'Occupancy Rate',
      current: 78.5,
      target: 75.0,
      industry: 72.3,
      unit: '%',
      performance: 'above'
    },
    {
      metric: 'ADR (Average Daily Rate)',
      current: 142.75,
      target: 140.00,
      industry: 135.50,
      unit: '€',
      performance: 'above'
    },
    {
      metric: 'Guest Satisfaction',
      current: 4.7,
      target: 4.5,
      industry: 4.4,
      unit: '/5',
      performance: 'above'
    },
    {
      metric: 'Staff Turnover',
      current: 12.5,
      target: 15.0,
      industry: 18.2,
      unit: '%',
      performance: 'above'
    },
    {
      metric: 'Revenue per Available Room',
      current: 89.50,
      target: 85.00,
      industry: 82.75,
      unit: '€',
      performance: 'above'
    },
    {
      metric: 'Cost per Occupied Room',
      current: 45.25,
      target: 42.00,
      industry: 47.80,
      unit: '€',
      performance: 'below'
    }
  ]

  const propertyComparisons: PropertyComparison[] = [
    {
      propertyName: 'Cyprus Grand Resort',
      overallScore: 89,
      revenue: 247350,
      occupancy: 78.5,
      satisfaction: 4.7,
      efficiency: 94.2
    },
    {
      propertyName: 'Mediterranean Palace',
      overallScore: 85,
      revenue: 198650,
      occupancy: 73.2,
      satisfaction: 4.5,
      efficiency: 91.8
    },
    {
      propertyName: 'Coastal Suites',
      overallScore: 82,
      revenue: 156780,
      occupancy: 69.8,
      satisfaction: 4.6,
      efficiency: 88.5
    },
    {
      propertyName: 'City Center Hotel',
      overallScore: 78,
      revenue: 134920,
      occupancy: 72.5,
      satisfaction: 4.3,
      efficiency: 85.2
    }
  ]

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (status: string): string => {
    switch (status) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'average': return 'bg-yellow-500'
      default: return 'bg-red-500'
    }
  }

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getPerformanceColor = (performance: string): string => {
    switch (performance) {
      case 'above': return 'text-green-600'
      case 'at': return 'text-blue-600'
      default: return 'text-red-600'
    }
  }

  const getPerformanceIcon = (performance: string): string => {
    switch (performance) {
      case 'above': return '⬆️'
      case 'at': return '➡️'
      default: return '⬇️'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Performance Scorecards</h1>
        <div className="flex gap-4">
          <select
            value={scorecard}
            onChange={(e) => setScorecard(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="overall">Overall Performance</option>
            <option value="department">By Department</option>
            <option value="property">Property Comparison</option>
            <option value="industry">Industry Benchmark</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Properties</option>
            <option value="prop1">Cyprus Grand Resort</option>
            <option value="prop2">Mediterranean Palace</option>
            <option value="prop3">Coastal Suites</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Overall Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">86.2</div>
            <div className="text-sm text-gray-500">Overall Score</div>
            <div className="text-xs text-green-600 mt-1">↗️ +3.2 from last month</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5/6</div>
            <div className="text-sm text-gray-500">Above Target</div>
            <div className="text-xs text-blue-600 mt-1">83% of KPIs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">#2</div>
            <div className="text-sm text-gray-500">Industry Rank</div>
            <div className="text-xs text-purple-600 mt-1">Top 5% in Cyprus</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">94%</div>
            <div className="text-sm text-gray-500">Target Achievement</div>
            <div className="text-xs text-orange-600 mt-1">Exceeding expectations</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {performanceCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.department}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(card.score)}`}>
                    {card.score}
                  </span>
                  <span className="text-lg">{getTrendIcon(card.trend)}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full text-white ${getScoreBgColor(card.status)}`}>
                  {card.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBgColor(card.status)}`}
                  style={{ width: `${(card.score / card.maxScore) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {card.metrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{metric.name}</span>
                  <div className="text-right">
                    <span className="font-medium">
                      {metric.unit === '€' ? '€' : ''}{metric.value}{metric.unit !== '€' ? ` ${metric.unit}` : ''}
                    </span>
                    <div className="text-xs text-gray-500">
                      Target: {metric.unit === '€' ? '€' : ''}{metric.target}{metric.unit !== '€' ? ` ${metric.unit}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Last updated: {card.lastUpdated}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Industry Benchmark Comparison</h2>
          <div className="space-y-4">
            {kpiComparisons.map((kpi, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{kpi.metric}</h3>
                  <div className="flex items-center gap-2">
                    <span className={getPerformanceColor(kpi.performance)}>
                      {getPerformanceIcon(kpi.performance)}
                    </span>
                    <span className={`text-sm font-medium ${getPerformanceColor(kpi.performance)}`}>
                      {kpi.performance.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Current</span>
                    <div className="font-bold text-blue-600">
                      {kpi.unit === '€' ? '€' : ''}{kpi.current}{kpi.unit !== '€' ? ` ${kpi.unit}` : ''}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Target</span>
                    <div className="font-medium">
                      {kpi.unit === '€' ? '€' : ''}{kpi.target}{kpi.unit !== '€' ? ` ${kpi.unit}` : ''}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Industry</span>
                    <div className="font-medium text-gray-700">
                      {kpi.unit === '€' ? '€' : ''}{kpi.industry}{kpi.unit !== '€' ? ` ${kpi.unit}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Property Performance Ranking</h2>
          <div className="space-y-4">
            {propertyComparisons.map((property, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                      #{index + 1}
                    </div>
                    <h3 className="font-medium">{property.propertyName}</h3>
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(property.overallScore)}`}>
                    {property.overallScore}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Revenue</span>
                    <div className="font-medium">€{property.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Occupancy</span>
                    <div className="font-medium">{property.occupancy}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Rating</span>
                    <div className="font-medium">⭐ {property.satisfaction}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Efficiency</span>
                    <div className="font-medium">{property.efficiency}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-green-800">Improving</div>
            <div className="text-sm text-green-600">4 metrics trending up</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-blue-800">On Target</div>
            <div className="text-sm text-blue-600">83% of KPIs achieved</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="font-semibold text-yellow-800">Attention Needed</div>
            <div className="text-sm text-yellow-600">2 metrics below target</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold text-purple-800">Excellence</div>
            <div className="text-sm text-purple-600">Top 5% performer</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Export performance data:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              📊 Excel Report
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
              📄 Executive PDF
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