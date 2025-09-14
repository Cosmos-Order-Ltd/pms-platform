'use client'

import React, { useState } from 'react'

interface PaymentMethodConfig {
  apiKey?: string
  secretKey?: string
  webhookUrl?: string
  merchantId?: string
  sandboxMode?: boolean
  customSettings?: Record<string, unknown>
}

interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'bank_transfer' | 'cash' | 'digital_wallet' | 'crypto'
  provider: string
  isActive: boolean
  processingFee: number
  currencies: string[]
  icon: string
  config: PaymentMethodConfig
}

interface Transaction {
  id: string
  reservationId: string
  guestName: string
  amount: number
  currency: string
  method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed'
  type: 'payment' | 'refund' | 'chargeback'
  processedAt: string
  fees: number
  gatewayReference: string
}

interface PaymentSettings {
  defaultCurrency: string
  acceptedCurrencies: string[]
  autoCapture: boolean
  refundPolicy: string
  chargebackNotifications: boolean
  fraudDetection: boolean
  pciCompliance: boolean
}

interface PaymentAnalytics {
  totalVolume: number
  successRate: number
  avgTransactionValue: number
  totalFees: number
  chargebackRate: number
  refundRate: number
  byMethod: {
    method: string
    volume: number
    count: number
    successRate: number
  }[]
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('transactions')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe-cards',
      name: 'Credit/Debit Cards',
      type: 'card',
      provider: 'Stripe',
      isActive: true,
      processingFee: 2.9,
      currencies: ['EUR', 'USD', 'GBP'],
      icon: '💳',
      config: {
        publicKey: 'pk_live_...',
        webhookEndpoint: 'https://pms.cyprus-hotels.com/webhooks/stripe'
      }
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'digital_wallet',
      provider: 'PayPal',
      isActive: true,
      processingFee: 3.4,
      currencies: ['EUR', 'USD'],
      icon: '💙',
      config: {
        clientId: 'AX_PayPal_Client_ID',
        merchantId: 'cyprus-hotels-merchant'
      }
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      provider: 'Local Banks',
      isActive: true,
      processingFee: 0.5,
      currencies: ['EUR'],
      icon: '🏦',
      config: {
        iban: 'CY17002001950000357001234567',
        bic: 'BCYPCY2N',
        bankName: 'Bank of Cyprus'
      }
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      type: 'cash',
      provider: 'Front Desk',
      isActive: true,
      processingFee: 0.0,
      currencies: ['EUR', 'USD', 'GBP'],
      icon: '💵',
      config: {
        acceptedDenominations: [5, 10, 20, 50, 100, 200, 500]
      }
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      type: 'digital_wallet',
      provider: 'Apple',
      isActive: false,
      processingFee: 2.9,
      currencies: ['EUR', 'USD'],
      icon: '🍎',
      config: {
        merchantId: 'merchant.com.cyprus-hotels.pms'
      }
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      type: 'crypto',
      provider: 'BitPay',
      isActive: false,
      processingFee: 1.0,
      currencies: ['BTC'],
      icon: '₿',
      config: {
        walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      }
    }
  ]

  const transactions: Transaction[] = [
    {
      id: 'txn-001',
      reservationId: 'RSV-12345',
      guestName: 'Dimitrios Papadakis',
      amount: 450.00,
      currency: 'EUR',
      method: 'Stripe Card',
      status: 'completed',
      type: 'payment',
      processedAt: '2024-12-30 14:30',
      fees: 13.05,
      gatewayReference: 'pi_1234567890'
    },
    {
      id: 'txn-002',
      reservationId: 'RSV-12346',
      guestName: 'Sarah Johnson',
      amount: 285.00,
      currency: 'EUR',
      method: 'PayPal',
      status: 'completed',
      type: 'payment',
      processedAt: '2024-12-30 13:15',
      fees: 9.69,
      gatewayReference: 'PAYID-M234567'
    },
    {
      id: 'txn-003',
      reservationId: 'RSV-12347',
      guestName: 'Hans Mueller',
      amount: 620.00,
      currency: 'EUR',
      method: 'Bank Transfer',
      status: 'pending',
      type: 'payment',
      processedAt: '2024-12-30 12:00',
      fees: 3.10,
      gatewayReference: 'TRF-789012'
    },
    {
      id: 'txn-004',
      reservationId: 'RSV-12348',
      guestName: 'Maria Rossi',
      amount: 150.00,
      currency: 'EUR',
      method: 'Cash',
      status: 'completed',
      type: 'payment',
      processedAt: '2024-12-30 11:45',
      fees: 0.00,
      gatewayReference: 'CSH-456789'
    },
    {
      id: 'txn-005',
      reservationId: 'RSV-12349',
      guestName: 'Jean Dubois',
      amount: 75.00,
      currency: 'EUR',
      method: 'Stripe Card',
      status: 'refunded',
      type: 'refund',
      processedAt: '2024-12-30 10:20',
      fees: -2.18,
      gatewayReference: 're_1234567890'
    },
    {
      id: 'txn-006',
      reservationId: 'RSV-12350',
      guestName: 'Andreas Georgiou',
      amount: 340.00,
      currency: 'EUR',
      method: 'Stripe Card',
      status: 'failed',
      type: 'payment',
      processedAt: '2024-12-30 09:30',
      fees: 0.00,
      gatewayReference: 'pi_failed_12345'
    }
  ]

  const paymentSettings: PaymentSettings = {
    defaultCurrency: 'EUR',
    acceptedCurrencies: ['EUR', 'USD', 'GBP'],
    autoCapture: true,
    refundPolicy: 'flexible',
    chargebackNotifications: true,
    fraudDetection: true,
    pciCompliance: true
  }

  const analytics: PaymentAnalytics = {
    totalVolume: 8450.00,
    successRate: 94.2,
    avgTransactionValue: 285.50,
    totalFees: 142.30,
    chargebackRate: 0.8,
    refundRate: 2.3,
    byMethod: [
      { method: 'Credit Cards', volume: 4250.00, count: 18, successRate: 96.1 },
      { method: 'PayPal', volume: 1890.00, count: 8, successRate: 92.5 },
      { method: 'Bank Transfer', volume: 1580.00, count: 4, successRate: 87.5 },
      { method: 'Cash', volume: 730.00, count: 12, successRate: 100.0 }
    ]
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      case 'refunded': return 'text-blue-600'
      case 'disputed': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100'
      case 'pending': return 'bg-yellow-100'
      case 'failed': return 'bg-red-100'
      case 'refunded': return 'bg-blue-100'
      case 'disputed': return 'bg-purple-100'
      default: return 'bg-gray-100'
    }
  }

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'payment': return '💳'
      case 'refund': return '↩️'
      case 'chargeback': return '⚠️'
      default: return '💰'
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filterStatus === 'all') return true
    return transaction.status === filterStatus
  })

  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF']

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Processing</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            💳 Process Payment
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            📊 Export Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">€{analytics.totalVolume.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📈</div>
            <div>
              <p className="text-sm text-gray-600">Avg Transaction</p>
              <p className="text-2xl font-bold text-gray-900">€{analytics.avgTransactionValue.toFixed(0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💸</div>
            <div>
              <p className="text-sm text-gray-600">Processing Fees</p>
              <p className="text-2xl font-bold text-gray-900">€{analytics.totalFees.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['transactions', 'methods', 'analytics', 'settings'].map((tab) => (
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
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <div className="flex gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1d">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Transaction</th>
                      <th className="text-left py-3 px-4 font-medium">Guest</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Method</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Fees</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{getTypeIcon(transaction.type)}</span>
                            <div>
                              <div className="font-medium">{transaction.id}</div>
                              <div className="text-sm text-gray-600">{transaction.reservationId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{transaction.guestName}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {transaction.currency} {transaction.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-3 px-4">{transaction.method}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBg(transaction.status)} ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={transaction.fees >= 0 ? 'text-red-600' : 'text-green-600'}>
                            {transaction.fees >= 0 ? '-' : '+'}€{Math.abs(transaction.fees).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{transaction.processedAt}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                              View
                            </button>
                            {transaction.status === 'completed' && (
                              <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'methods' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Payment Methods</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Add Method
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.provider}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.isActive ? '✅ Active' : '⏸️ Inactive'}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Fee:</span>
                        <span className="font-medium">{method.processingFee}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{method.type.replace('_', ' ')}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Currencies:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {method.currencies.map((currency) => (
                            <span key={currency} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {currency}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        ⚙️ Configure
                      </button>
                      <button className={`flex-1 px-3 py-2 rounded-md text-sm ${
                        method.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {method.isActive ? '⏸️ Disable' : '▶️ Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Payment Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Volume by Payment Method</h3>
                  <div className="space-y-3">
                    {analytics.byMethod.map((method) => (
                      <div key={method.method} className="flex justify-between items-center">
                        <span className="text-sm">{method.method}</span>
                        <div className="text-right">
                          <div className="font-medium">€{method.volume.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{method.count} transactions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Success Rates by Method</h3>
                  <div className="space-y-3">
                    {analytics.byMethod.map((method) => (
                      <div key={method.method} className="flex justify-between items-center">
                        <span className="text-sm">{method.method}</span>
                        <div className="text-right">
                          <div className={`font-medium ${method.successRate >= 95 ? 'text-green-600' : method.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {method.successRate}%
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full ${method.successRate >= 95 ? 'bg-green-500' : method.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${method.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.successRate}%</div>
                  <div className="text-sm text-gray-600">Overall Success Rate</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{analytics.chargebackRate}%</div>
                  <div className="text-sm text-gray-600">Chargeback Rate</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.refundRate}%</div>
                  <div className="text-sm text-gray-600">Refund Rate</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">€{analytics.totalFees.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Total Fees</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Payment Settings</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                    <select
                      value={paymentSettings.defaultCurrency}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Currencies</label>
                    <div className="grid grid-cols-3 gap-2">
                      {currencies.map(currency => (
                        <label key={currency} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={paymentSettings.acceptedCurrencies.includes(currency)}
                            className="rounded border-gray-300 mr-2"
                          />
                          <span className="text-sm">{currency}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                    <select
                      value={paymentSettings.refundPolicy}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="strict">Strict (24h cancellation)</option>
                      <option value="moderate">Moderate (48h cancellation)</option>
                      <option value="flexible">Flexible (7 days cancellation)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Security & Compliance</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.autoCapture}
                          className="rounded border-gray-300 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium">Auto Capture Payments</div>
                          <div className="text-xs text-gray-600">Automatically capture authorized payments</div>
                        </div>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.fraudDetection}
                          className="rounded border-gray-300 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium">Fraud Detection</div>
                          <div className="text-xs text-gray-600">Enable advanced fraud protection</div>
                        </div>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.chargebackNotifications}
                          className="rounded border-gray-300 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium">Chargeback Notifications</div>
                          <div className="text-xs text-gray-600">Email alerts for chargebacks</div>
                        </div>
                      </label>

                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">PCI DSS Compliant</div>
                          <div className="text-xs text-gray-600">Level 1 PCI DSS certified</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Recommendations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Enable 3D Secure for EU customers</li>
                      <li>• Consider adding Apple Pay and Google Pay</li>
                      <li>• Set up automatic reconciliation</li>
                      <li>• Review chargeback prevention rules</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}