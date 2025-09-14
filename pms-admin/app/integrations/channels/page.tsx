'use client'

import React, { useState } from 'react'

interface ChannelConnection {
  id: string
  name: string
  type: 'ota' | 'gds' | 'direct' | 'meta'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  logo: string
  lastSync: string
  bookingsToday: number
  revenue: number
  commission: number
  isActive: boolean
  config: {
    hotelId?: string
    username?: string
    endpoint?: string
    ratePlans: string[]
    roomTypes: string[]
  }
}

interface SyncStatus {
  channel: string
  lastSync: string
  status: 'success' | 'failed' | 'pending'
  recordsUpdated: number
  errors: string[]
}

interface RateMapping {
  channelId: string
  channelName: string
  localRoomType: string
  channelRoomType: string
  localRatePlan: string
  channelRatePlan: string
  baseRate: number
  currentRate: number
  lastUpdated: string
}

export default function ChannelManagerPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [_selectedChannel, _setSelectedChannel] = useState('')

  const channels: ChannelConnection[] = [
    {
      id: 'booking-com',
      name: 'Booking.com',
      type: 'ota',
      status: 'connected',
      logo: '🏨',
      lastSync: '2024-12-30 15:30',
      bookingsToday: 12,
      revenue: 3450.00,
      commission: 15.0,
      isActive: true,
      config: {
        hotelId: 'CYP-12345',
        username: 'cyprus_grand',
        endpoint: 'https://secure-supply-xml.booking.com',
        ratePlans: ['BAR', 'Corporate', 'Advance Purchase'],
        roomTypes: ['Deluxe Room', 'Suite', 'Villa']
      }
    },
    {
      id: 'expedia',
      name: 'Expedia Group',
      type: 'ota',
      status: 'connected',
      logo: '✈️',
      lastSync: '2024-12-30 15:25',
      bookingsToday: 8,
      revenue: 2280.00,
      commission: 18.0,
      isActive: true,
      config: {
        hotelId: 'EXP-78901',
        username: 'cyprus_grand_hotel',
        endpoint: 'https://services.expediapartnercentral.com',
        ratePlans: ['Standard', 'Flexible', 'Non-refundable'],
        roomTypes: ['Standard Room', 'Premium Room', 'Executive Suite']
      }
    },
    {
      id: 'hotels-com',
      name: 'Hotels.com',
      type: 'ota',
      status: 'syncing',
      logo: '🏩',
      lastSync: '2024-12-30 15:28',
      bookingsToday: 5,
      revenue: 1675.00,
      commission: 17.5,
      isActive: true,
      config: {
        hotelId: 'HTC-45678',
        username: 'cyprus_resort',
        endpoint: 'https://api.ean.com',
        ratePlans: ['Best Available', 'Member Rates'],
        roomTypes: ['Ocean View', 'Garden View', 'Penthouse']
      }
    },
    {
      id: 'airbnb',
      name: 'Airbnb',
      type: 'direct',
      status: 'error',
      logo: '🏠',
      lastSync: '2024-12-30 12:15',
      bookingsToday: 0,
      revenue: 0.00,
      commission: 3.0,
      isActive: false,
      config: {
        hotelId: 'AIR-99123',
        endpoint: 'https://api.airbnb.com/v2',
        ratePlans: ['Instant Book'],
        roomTypes: ['Entire Property']
      }
    },
    {
      id: 'agoda',
      name: 'Agoda',
      type: 'ota',
      status: 'connected',
      logo: '🌏',
      lastSync: '2024-12-30 15:20',
      bookingsToday: 3,
      revenue: 890.00,
      commission: 16.0,
      isActive: true,
      config: {
        hotelId: 'AGD-33456',
        username: 'cyprus_grand_ag',
        endpoint: 'https://xmlout.agoda.com',
        ratePlans: ['Agoda Special', 'Last Minute'],
        roomTypes: ['Classic Room', 'Superior Room']
      }
    },
    {
      id: 'tripadvisor',
      name: 'TripAdvisor',
      type: 'meta',
      status: 'disconnected',
      logo: '🦉',
      lastSync: '2024-12-28 09:45',
      bookingsToday: 0,
      revenue: 0.00,
      commission: 12.0,
      isActive: false,
      config: {
        hotelId: 'TA-67890',
        endpoint: 'https://api.tripadvisor.com/api/partner',
        ratePlans: ['TripAdvisor Exclusive'],
        roomTypes: ['Standard', 'Deluxe']
      }
    }
  ]

  const syncStatuses: SyncStatus[] = [
    {
      channel: 'Booking.com',
      lastSync: '2024-12-30 15:30',
      status: 'success',
      recordsUpdated: 156,
      errors: []
    },
    {
      channel: 'Expedia Group',
      lastSync: '2024-12-30 15:25',
      status: 'success',
      recordsUpdated: 142,
      errors: []
    },
    {
      channel: 'Hotels.com',
      lastSync: '2024-12-30 15:28',
      status: 'pending',
      recordsUpdated: 0,
      errors: []
    },
    {
      channel: 'Airbnb',
      lastSync: '2024-12-30 12:15',
      status: 'failed',
      recordsUpdated: 0,
      errors: ['Authentication failed', 'Invalid API credentials']
    }
  ]

  const rateMappings: RateMapping[] = [
    {
      channelId: 'booking-com',
      channelName: 'Booking.com',
      localRoomType: 'Deluxe Room',
      channelRoomType: 'Deluxe Sea View',
      localRatePlan: 'Best Available Rate',
      channelRatePlan: 'BAR',
      baseRate: 150.00,
      currentRate: 165.00,
      lastUpdated: '2024-12-30 15:30'
    },
    {
      channelId: 'expedia',
      channelName: 'Expedia Group',
      localRoomType: 'Deluxe Room',
      channelRoomType: 'Premium Ocean View',
      localRatePlan: 'Best Available Rate',
      channelRatePlan: 'Standard',
      baseRate: 150.00,
      currentRate: 162.00,
      lastUpdated: '2024-12-30 15:25'
    },
    {
      channelId: 'hotels-com',
      channelName: 'Hotels.com',
      localRoomType: 'Suite',
      channelRoomType: 'Executive Suite',
      localRatePlan: 'Best Available Rate',
      channelRatePlan: 'Best Available',
      baseRate: 220.00,
      currentRate: 238.00,
      lastUpdated: '2024-12-30 15:28'
    },
    {
      channelId: 'agoda',
      channelName: 'Agoda',
      localRoomType: 'Standard Room',
      channelRoomType: 'Classic Room',
      localRatePlan: 'Advance Purchase',
      channelRatePlan: 'Agoda Special',
      baseRate: 120.00,
      currentRate: 135.00,
      lastUpdated: '2024-12-30 15:20'
    }
  ]

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected': return 'text-green-600'
      case 'syncing': return 'text-blue-600'
      case 'error': return 'text-red-600'
      case 'disconnected': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'connected': return 'bg-green-100'
      case 'syncing': return 'bg-blue-100'
      case 'error': return 'bg-red-100'
      case 'disconnected': return 'bg-gray-100'
      default: return 'bg-gray-100'
    }
  }

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'connected': return '✅'
      case 'syncing': return '🔄'
      case 'error': return '❌'
      case 'disconnected': return '⏸️'
      default: return '❓'
    }
  }

  const _getSyncStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const totalBookings = channels.reduce((sum, channel) => sum + channel.bookingsToday, 0)
  const totalRevenue = channels.reduce((sum, channel) => sum + channel.revenue, 0)
  const activeChannels = channels.filter(channel => channel.isActive).length
  const avgCommission = channels.reduce((sum, channel) => sum + channel.commission, 0) / channels.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Channel Manager</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            🔄 Sync All
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            ➕ Add Channel
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏨</div>
            <div>
              <p className="text-sm text-gray-600">Active Channels</p>
              <p className="text-2xl font-bold text-gray-900">{activeChannels}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <p className="text-sm text-gray-600">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">€{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📈</div>
            <div>
              <p className="text-sm text-gray-600">Avg Commission</p>
              <p className="text-2xl font-bold text-gray-900">{avgCommission.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'sync', 'rates', 'analytics'].map((tab) => (
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Channel Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels.map((channel) => (
                  <div key={channel.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{channel.logo}</span>
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{channel.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBg(channel.status)} ${getStatusColor(channel.status)}`}>
                          {getStatusIcon(channel.status)} {channel.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Today's Bookings:</span>
                        <span className="font-medium">{channel.bookingsToday}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium">€{channel.revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission:</span>
                        <span className="font-medium">{channel.commission}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="font-medium">{channel.lastSync}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        🔄 Sync
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                        ⚙️ Config
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Synchronization Status</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  🔄 Force Sync All
                </button>
              </div>

              <div className="space-y-4">
                {syncStatuses.map((sync, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">{sync.channel}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sync.status === 'success' ? 'bg-green-100 text-green-800' :
                          sync.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sync.status === 'success' ? '✅' : sync.status === 'failed' ? '❌' : '⏳'} {sync.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Last Sync:</span>
                        <div className="font-medium">{sync.lastSync}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Records Updated:</span>
                        <div className="font-medium">{sync.recordsUpdated}</div>
                      </div>
                    </div>

                    {sync.errors.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Errors:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {sync.errors.map((error, errorIndex) => (
                            <li key={errorIndex}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Rate & Inventory Mapping</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  ➕ Add Mapping
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Channel</th>
                      <th className="text-left py-3 px-4 font-medium">Local Room</th>
                      <th className="text-left py-3 px-4 font-medium">Channel Room</th>
                      <th className="text-left py-3 px-4 font-medium">Rate Plan</th>
                      <th className="text-left py-3 px-4 font-medium">Base Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Current Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateMappings.map((mapping, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{mapping.channelName}</td>
                        <td className="py-3 px-4">{mapping.localRoomType}</td>
                        <td className="py-3 px-4">{mapping.channelRoomType}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div>{mapping.localRatePlan}</div>
                            <div className="text-gray-500">→ {mapping.channelRatePlan}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">€{mapping.baseRate.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            mapping.currentRate > mapping.baseRate ? 'text-green-600' :
                            mapping.currentRate < mapping.baseRate ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            €{mapping.currentRate.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{mapping.lastUpdated}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                              Edit
                            </button>
                            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                              Sync
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Channel Performance Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Revenue by Channel (Last 30 Days)</h3>
                  <div className="space-y-3">
                    {channels.filter(c => c.isActive).map((channel) => (
                      <div key={channel.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>{channel.logo}</span>
                          <span className="text-sm">{channel.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">€{(channel.revenue * 30).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{channel.commission}% commission</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Booking Volume Trends</h3>
                  <div className="space-y-3">
                    {channels.filter(c => c.isActive).map((channel) => (
                      <div key={channel.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>{channel.logo}</span>
                          <span className="text-sm">{channel.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{channel.bookingsToday * 30} bookings</div>
                          <div className="text-xs text-gray-500">
                            Avg: €{(channel.revenue / channel.bookingsToday || 0).toFixed(0)}/booking
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Channel Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">96.8%</div>
                    <div className="text-sm text-gray-600">Sync Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">€8,295</div>
                    <div className="text-sm text-gray-600">Daily Channel Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">28</div>
                    <div className="text-sm text-gray-600">Daily Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">15.2%</div>
                    <div className="text-sm text-gray-600">Avg Commission</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}