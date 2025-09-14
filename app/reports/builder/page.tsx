'use client'

import React, { useState } from 'react'

interface DataSource {
  id: string
  name: string
  type: 'table' | 'view' | 'api'
  description: string
  fields: {
    name: string
    type: 'string' | 'number' | 'date' | 'boolean'
    description: string
  }[]
}

interface ReportTemplate {
  id: string
  name: string
  category: string
  description: string
  isPublic: boolean
  lastUsed: string
  useCount: number
  author: string
  config: {
    dataSource: string
    filters: FilterConfig[]
    groupBy: string[]
    metrics: string[]
    chartType: string
  }
}

interface FilterConfig {
  field: string
  operator: string
  value: string | number | boolean | Date
  type: 'string' | 'number' | 'date' | 'boolean'
}

export default function ReportBuilderPage() {
  const [currentStep, setCurrentStep] = useState('datasource')
  const [selectedDataSource, setSelectedDataSource] = useState('')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [groupBy, setGroupBy] = useState<string[]>([])
  const [_metrics, _setMetrics] = useState<string[]>([])
  const [chartType, setChartType] = useState('table')
  const [reportName, setReportName] = useState('')
  const [reportCategory, setReportCategory] = useState('custom')

  const dataSources: DataSource[] = [
    {
      id: 'reservations',
      name: 'Reservations',
      type: 'table',
      description: 'Booking data including guest information, dates, and pricing',
      fields: [
        { name: 'id', type: 'string', description: 'Reservation ID' },
        { name: 'guestName', type: 'string', description: 'Guest name' },
        { name: 'checkIn', type: 'date', description: 'Check-in date' },
        { name: 'checkOut', type: 'date', description: 'Check-out date' },
        { name: 'totalAmount', type: 'number', description: 'Total booking amount' },
        { name: 'roomType', type: 'string', description: 'Type of room booked' },
        { name: 'status', type: 'string', description: 'Booking status' },
        { name: 'source', type: 'string', description: 'Booking source' },
        { name: 'guests', type: 'number', description: 'Number of guests' }
      ]
    },
    {
      id: 'revenue',
      name: 'Revenue Analytics',
      type: 'view',
      description: 'Daily revenue breakdown by department and service',
      fields: [
        { name: 'date', type: 'date', description: 'Transaction date' },
        { name: 'department', type: 'string', description: 'Revenue department' },
        { name: 'amount', type: 'number', description: 'Revenue amount' },
        { name: 'roomRevenue', type: 'number', description: 'Room revenue only' },
        { name: 'serviceRevenue', type: 'number', description: 'Service revenue only' },
        { name: 'occupancyRate', type: 'number', description: 'Daily occupancy rate' },
        { name: 'adr', type: 'number', description: 'Average daily rate' },
        { name: 'revpar', type: 'number', description: 'Revenue per available room' }
      ]
    },
    {
      id: 'guests',
      name: 'Guest Analytics',
      type: 'table',
      description: 'Guest profiles, preferences, and satisfaction data',
      fields: [
        { name: 'guestId', type: 'string', description: 'Guest ID' },
        { name: 'name', type: 'string', description: 'Guest name' },
        { name: 'nationality', type: 'string', description: 'Guest nationality' },
        { name: 'visits', type: 'number', description: 'Total number of visits' },
        { name: 'totalSpent', type: 'number', description: 'Lifetime spending' },
        { name: 'avgRating', type: 'number', description: 'Average satisfaction rating' },
        { name: 'loyaltyTier', type: 'string', description: 'Loyalty program tier' },
        { name: 'lastVisit', type: 'date', description: 'Date of last visit' }
      ]
    },
    {
      id: 'operations',
      name: 'Operations Data',
      type: 'table',
      description: 'Staff productivity, service requests, and operational metrics',
      fields: [
        { name: 'date', type: 'date', description: 'Operation date' },
        { name: 'department', type: 'string', description: 'Department name' },
        { name: 'staffCount', type: 'number', description: 'Staff on duty' },
        { name: 'tasksCompleted', type: 'number', description: 'Tasks completed' },
        { name: 'serviceRequests', type: 'number', description: 'Service requests received' },
        { name: 'avgResponseTime', type: 'number', description: 'Average response time in minutes' },
        { name: 'guestSatisfaction', type: 'number', description: 'Guest satisfaction score' }
      ]
    }
  ]

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'daily-revenue',
      name: 'Daily Revenue Report',
      category: 'Financial',
      description: 'Daily breakdown of revenue by department and service type',
      isPublic: true,
      lastUsed: '2024-12-29',
      useCount: 156,
      author: 'System',
      config: {
        dataSource: 'revenue',
        filters: [],
        groupBy: ['date', 'department'],
        metrics: ['amount', 'roomRevenue', 'serviceRevenue'],
        chartType: 'line'
      }
    },
    {
      id: 'guest-satisfaction',
      name: 'Guest Satisfaction Analysis',
      category: 'Guest Services',
      description: 'Comprehensive guest satisfaction metrics and trends',
      isPublic: true,
      lastUsed: '2024-12-28',
      useCount: 89,
      author: 'Maria Constantinou',
      config: {
        dataSource: 'guests',
        filters: [],
        groupBy: ['loyaltyTier', 'nationality'],
        metrics: ['avgRating', 'visits', 'totalSpent'],
        chartType: 'bar'
      }
    },
    {
      id: 'occupancy-trends',
      name: 'Occupancy Trends',
      category: 'Operations',
      description: 'Monthly and seasonal occupancy rate analysis',
      isPublic: false,
      lastUsed: '2024-12-30',
      useCount: 234,
      author: 'Andreas Georgiou',
      config: {
        dataSource: 'revenue',
        filters: [{ field: 'date', operator: '>=', value: '2024-01-01', type: 'date' }],
        groupBy: ['date'],
        metrics: ['occupancyRate', 'adr', 'revpar'],
        chartType: 'area'
      }
    },
    {
      id: 'booking-sources',
      name: 'Booking Source Performance',
      category: 'Marketing',
      description: 'Analysis of booking sources and their conversion rates',
      isPublic: true,
      lastUsed: '2024-12-25',
      useCount: 67,
      author: 'Elena Papadopoulos',
      config: {
        dataSource: 'reservations',
        filters: [],
        groupBy: ['source', 'status'],
        metrics: ['totalAmount', 'guests'],
        chartType: 'pie'
      }
    }
  ]

  const operators = {
    string: ['equals', 'contains', 'starts_with', 'ends_with', 'not_equals'],
    number: ['equals', 'greater_than', 'less_than', 'between', 'not_equals'],
    date: ['equals', 'after', 'before', 'between', 'in_last', 'in_next'],
    boolean: ['equals', 'not_equals']
  }

  const chartTypes = [
    { id: 'table', name: 'Table', icon: '📋' },
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'pie', name: 'Pie Chart', icon: '🥧' },
    { id: 'area', name: 'Area Chart', icon: '📉' },
    { id: 'scatter', name: 'Scatter Plot', icon: '⚪' }
  ]

  const steps = [
    { id: 'datasource', name: 'Data Source', icon: '🗃️' },
    { id: 'fields', name: 'Select Fields', icon: '✅' },
    { id: 'filters', name: 'Add Filters', icon: '🔍' },
    { id: 'grouping', name: 'Grouping', icon: '📂' },
    { id: 'visualization', name: 'Visualization', icon: '📊' },
    { id: 'preview', name: 'Preview', icon: '👀' },
    { id: 'save', name: 'Save Report', icon: '💾' }
  ]

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: '', value: '', type: 'string' }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    const newFilters = [...filters]
    newFilters[index] = {
      ...newFilters[index],
      ...Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined))
    } as FilterConfig
    setFilters(newFilters)
  }

  const getStepStatus = (stepId: string): 'completed' | 'current' | 'upcoming' => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    const stepIndex = steps.findIndex(s => s.id === stepId)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  const getCurrentDataSource = () => {
    return dataSources.find(ds => ds.id === selectedDataSource)
  }

  const getFieldType = (fieldName: string): string => {
    const dataSource = getCurrentDataSource()
    const field = dataSource?.fields.find(f => f.name === fieldName)
    return field?.type || 'string'
  }

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 'datasource': return selectedDataSource !== ''
      case 'fields': return selectedFields.length > 0
      case 'filters': return true
      case 'grouping': return true
      case 'visualization': return chartType !== ''
      case 'preview': return true
      case 'save': return reportName.trim() !== ''
      default: return false
    }
  }

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    const nextStepItem = steps[currentIndex + 1]
    if (currentIndex < steps.length - 1 && nextStepItem) {
      setCurrentStep(nextStepItem.id)
    }
  }

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    const prevStepItem = steps[currentIndex - 1]
    if (currentIndex > 0 && prevStepItem) {
      setCurrentStep(prevStepItem.id)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Custom Report Builder</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
            📁 Load Template
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            💾 Save as Template
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                getStepStatus(step.id) === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : getStepStatus(step.id) === 'current'
                  ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {getStepStatus(step.id) === 'completed' ? '✓' : step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  getStepStatus(step.id) === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Step {steps.findIndex(s => s.id === currentStep) + 1}: {steps.find(s => s.id === currentStep)?.name}
          </h2>
        </div>

        {currentStep === 'datasource' && (
          <div className="space-y-4">
            <p className="text-gray-600">Select a data source to build your report from:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedDataSource === source.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDataSource(source.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {source.type === 'table' ? '🗂️' : source.type === 'view' ? '👁️' : '🔗'}
                    </span>
                    <h3 className="font-medium">{source.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {source.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                  <div className="text-xs text-gray-500">
                    {source.fields.length} fields available
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'fields' && selectedDataSource && (
          <div className="space-y-4">
            <p className="text-gray-600">Select the fields you want to include in your report:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getCurrentDataSource()?.fields.map((field) => (
                <div
                  key={field.name}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedFields.includes(field.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (selectedFields.includes(field.name)) {
                      setSelectedFields(selectedFields.filter(f => f !== field.name))
                    } else {
                      setSelectedFields([...selectedFields, field.name])
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{field.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      field.type === 'string' ? 'bg-blue-100 text-blue-800' :
                      field.type === 'number' ? 'bg-green-100 text-green-800' :
                      field.type === 'date' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {field.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{field.description}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Selected: {selectedFields.length} fields
            </p>
          </div>
        )}

        {currentStep === 'filters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Add filters to your report data:</p>
              <button
                onClick={addFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Filter
              </button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No filters added yet. Click "Add Filter" to create your first filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <select
                        value={filter.field}
                        onChange={(e) => {
                          const fieldType = getFieldType(e.target.value)
                          updateFilter(index, { field: e.target.value, type: fieldType as 'string' | 'number' | 'date' | 'boolean' })
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select field...</option>
                        {getCurrentDataSource()?.fields.map(field => (
                          <option key={field.name} value={field.name}>{field.name}</option>
                        ))}
                      </select>

                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, { operator: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select operator...</option>
                        {operators[filter.type]?.map(op => (
                          <option key={op} value={op}>{op.replace('_', ' ')}</option>
                        ))}
                      </select>

                      <input
                        type={filter.type === 'date' ? 'date' : filter.type === 'number' ? 'number' : 'text'}
                        value={String(filter.value)}
                        onChange={(e) => updateFilter(index, { value: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter value..."
                      />

                      <button
                        onClick={() => removeFilter(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 'grouping' && (
          <div className="space-y-4">
            <p className="text-gray-600">Group your data by one or more fields:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedFields.map((fieldName) => (
                <div
                  key={fieldName}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    groupBy.includes(fieldName)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (groupBy.includes(fieldName)) {
                      setGroupBy(groupBy.filter(f => f !== fieldName))
                    } else {
                      setGroupBy([...groupBy, fieldName])
                    }
                  }}
                >
                  <span className="text-sm font-medium">{fieldName}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Grouped by: {groupBy.length > 0 ? groupBy.join(', ') : 'None'}
            </p>
          </div>
        )}

        {currentStep === 'visualization' && (
          <div className="space-y-4">
            <p className="text-gray-600">Choose how to display your report:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {chartTypes.map((chart) => (
                <div
                  key={chart.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-colors ${
                    chartType === chart.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setChartType(chart.id)}
                >
                  <div className="text-3xl mb-2">{chart.icon}</div>
                  <div className="text-sm font-medium">{chart.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="space-y-4">
            <p className="text-gray-600">Preview your report configuration:</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Report Summary</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Data Source:</span> {getCurrentDataSource()?.name}</div>
                <div><span className="font-medium">Fields:</span> {selectedFields.join(', ')}</div>
                <div><span className="font-medium">Filters:</span> {filters.length} applied</div>
                <div><span className="font-medium">Grouping:</span> {groupBy.length > 0 ? groupBy.join(', ') : 'None'}</div>
                <div><span className="font-medium">Visualization:</span> {chartTypes.find(c => c.id === chartType)?.name}</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Sample Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      {selectedFields.slice(0, 5).map(field => (
                        <th key={field} className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      {selectedFields.slice(0, 5).map(field => (
                        <td key={field} className="py-2 px-4 text-sm text-gray-600">
                          Sample data
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'save' && (
          <div className="space-y-4">
            <p className="text-gray-600">Save your report as a template:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter report name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="custom">Custom</option>
                  <option value="financial">Financial</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                  <option value="guest-services">Guest Services</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="public" className="rounded border-gray-300" />
              <label htmlFor="public" className="text-sm text-gray-700">
                Make this report template available to other users
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 'datasource'}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep === 'save' ? (
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                💾 Save Template
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                ▶️ Run Report
              </button>
            </div>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Saved Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{template.name}</h3>
                <div className="flex gap-1">
                  {template.isPublic && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Public
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="space-y-1 text-xs text-gray-500 mb-3">
                <div>Category: {template.category}</div>
                <div>Author: {template.author}</div>
                <div>Used: {template.useCount} times</div>
                <div>Last used: {template.lastUsed}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                  Load
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                  Run
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}