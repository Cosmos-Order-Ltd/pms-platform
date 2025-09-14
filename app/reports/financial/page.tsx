'use client'

import { useState } from 'react'

interface FinancialMetric {
  category: string
  current: number
  previous: number
  budget: number
  variance: number
  percentChange: number
}

interface DailyRevenue {
  date: string
  roomRevenue: number
  serviceRevenue: number
  otherRevenue: number
  totalRevenue: number
  occupancy: number
}

interface PaymentMethod {
  method: string
  amount: number
  percentage: number
  transactions: number
  avgTransaction: number
}

export default function FinancialReportsPage() {
  const [selectedReport, setSelectedReport] = useState<'summary' | 'daily' | 'monthly' | 'payments' | 'tax'>('summary')
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [selectedProperty, setSelectedProperty] = useState('all')

  // Mock data
  const financialMetrics: FinancialMetric[] = [
    {
      category: 'Room Revenue',
      current: 187450,
      previous: 175230,
      budget: 190000,
      variance: -2550,
      percentChange: 6.97
    },
    {
      category: 'Food & Beverage',
      current: 89340,
      previous: 82150,
      budget: 85000,
      variance: 4340,
      percentChange: 8.75
    },
    {
      category: 'Spa & Wellness',
      current: 34560,
      previous: 31200,
      budget: 32000,
      variance: 2560,
      percentChange: 10.77
    },
    {
      category: 'Other Services',
      current: 12890,
      previous: 11340,
      budget: 13000,
      variance: -110,
      percentChange: 13.66
    },
    {
      category: 'Total Operating Expenses',
      current: -95670,
      previous: -89340,
      budget: -92000,
      variance: -3670,
      percentChange: 7.08
    },
    {
      category: 'Net Operating Income',
      current: 228570,
      previous: 210580,
      budget: 238000,
      variance: -9430,
      percentChange: 8.54
    }
  ]

  const dailyRevenue: DailyRevenue[] = [
    { date: '2025-09-01', roomRevenue: 8950, serviceRevenue: 3420, otherRevenue: 670, totalRevenue: 13040, occupancy: 87 },
    { date: '2025-09-02', roomRevenue: 9200, serviceRevenue: 3650, otherRevenue: 720, totalRevenue: 13570, occupancy: 89 },
    { date: '2025-09-03', roomRevenue: 8750, serviceRevenue: 3280, otherRevenue: 580, totalRevenue: 12610, occupancy: 85 },
    { date: '2025-09-04', roomRevenue: 9480, serviceRevenue: 3890, otherRevenue: 780, totalRevenue: 14150, occupancy: 92 },
    { date: '2025-09-05', roomRevenue: 9850, serviceRevenue: 4120, otherRevenue: 830, totalRevenue: 14800, occupancy: 95 },
    { date: '2025-09-06', roomRevenue: 9650, serviceRevenue: 3980, otherRevenue: 750, totalRevenue: 14380, occupancy: 94 },
    { date: '2025-09-07', roomRevenue: 8920, serviceRevenue: 3380, otherRevenue: 640, totalRevenue: 12940, occupancy: 86 }
  ]

  const paymentMethods: PaymentMethod[] = [
    { method: 'Credit Card', amount: 198450, percentage: 65.4, transactions: 1247, avgTransaction: 159.20 },
    { method: 'Cash', amount: 47230, percentage: 15.6, transactions: 894, avgTransaction: 52.84 },
    { method: 'Bank Transfer', amount: 38670, percentage: 12.7, transactions: 156, avgTransaction: 247.95 },
    { method: 'Corporate Account', amount: 18950, percentage: 6.3, transactions: 78, avgTransaction: 242.95 }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600">Comprehensive financial analysis and reporting</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="current-month">Current Month</option>
                <option value="last-month">Last Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="current-year">Current Year</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                📊 Export to Excel
              </button>
              <button className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                📄 Generate PDF
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
              { id: 'summary', label: 'P&L Summary', icon: '💰' },
              { id: 'daily', label: 'Daily Revenue', icon: '📅' },
              { id: 'monthly', label: 'Monthly Trends', icon: '📈' },
              { id: 'payments', label: 'Payment Analysis', icon: '💳' },
              { id: 'tax', label: 'Tax Reports', icon: '🏛️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id as any)}
                className={`flex items-center space-x-2 border-b-2 py-4 text-sm font-medium ${
                  selectedReport === tab.id
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
        {selectedReport === 'summary' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">💰</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(324240)}</p>
                    <p className="text-sm text-green-600">+8.2% vs last month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Net Income</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(228570)}</p>
                    <p className="text-sm text-green-600">+8.5% vs last month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📈</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Profit Margin</p>
                    <p className="text-2xl font-semibold text-gray-900">70.5%</p>
                    <p className="text-sm text-green-600">+0.3% vs last month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">🎯</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Budget Variance</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(-9430)}</p>
                    <p className="text-sm text-red-600">-3.9% vs budget</p>
                  </div>
                </div>
              </div>
            </div>

            {/* P&L Table */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Statement</h3>
                <p className="text-sm text-gray-600">September 2025 - Current Month</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Current
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Previous
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Variance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        % Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {financialMetrics.map((metric, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{metric.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`font-medium ${metric.current < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatCurrency(Math.abs(metric.current))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-gray-600">{formatCurrency(Math.abs(metric.previous))}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-gray-600">{formatCurrency(Math.abs(metric.budget))}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`font-medium ${getVarianceColor(metric.variance)}`}>
                            {formatCurrency(metric.variance)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`font-medium ${getChangeColor(metric.percentChange)}`}>
                            {formatPercentage(metric.percentChange)}
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

        {selectedReport === 'daily' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Daily Revenue Breakdown</h3>
                <div className="flex items-center space-x-2">
                  <input type="date" className="rounded border border-gray-300 px-3 py-1 text-sm" />
                  <span className="text-gray-500">to</span>
                  <input type="date" className="rounded border border-gray-300 px-3 py-1 text-sm" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Room Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Service Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Other Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Occupancy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dailyRevenue.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(day.roomRevenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-gray-600">{formatCurrency(day.serviceRevenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-gray-600">{formatCurrency(day.otherRevenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="font-bold text-gray-900">{formatCurrency(day.totalRevenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            day.occupancy >= 90
                              ? 'bg-green-100 text-green-800'
                              : day.occupancy >= 80
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {day.occupancy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(dailyRevenue.reduce((sum, day) => sum + day.roomRevenue, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(dailyRevenue.reduce((sum, day) => sum + day.serviceRevenue, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(dailyRevenue.reduce((sum, day) => sum + day.otherRevenue, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(dailyRevenue.reduce((sum, day) => sum + day.totalRevenue, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {Math.round(dailyRevenue.reduce((sum, day) => sum + day.occupancy, 0) / dailyRevenue.length)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'payments' && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods Distribution</h3>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatCurrency(method.amount)}</div>
                        <div className="text-sm text-gray-500">{method.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Method</th>
                        <th className="py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Transactions</th>
                        <th className="py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Avg Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentMethods.map((method, index) => (
                        <tr key={index}>
                          <td className="py-3 text-sm font-medium text-gray-900">{method.method}</td>
                          <td className="py-3 text-right text-sm text-gray-600">{method.transactions}</td>
                          <td className="py-3 text-right text-sm font-medium text-gray-900">
                            {formatCurrency(method.avgTransaction)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'tax' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cyprus VAT Report</h3>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">VAT Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Gross Sales</span>
                      <span className="font-medium text-gray-900">{formatCurrency(324240)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">VAT Exempt Sales</span>
                      <span className="font-medium text-gray-900">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Taxable Sales (19%)</span>
                      <span className="font-medium text-gray-900">{formatCurrency(272336)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">VAT Collected</span>
                      <span className="font-bold text-green-600">{formatCurrency(51744)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Tourism Tax</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Guest Nights</span>
                      <span className="font-medium text-gray-900">1,247</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tax Rate</span>
                      <span className="font-medium text-gray-900">€1.50 per night</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Total Tourism Tax</span>
                      <span className="font-bold text-blue-600">{formatCurrency(1870.50)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 mr-4">
                  📄 Generate VAT Return
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  📊 Export to Accountant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}