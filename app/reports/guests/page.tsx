'use client'

import React, { useState } from 'react'

interface GuestSegment {
  id: string
  name: string
  count: number
  percentage: number
  avgSpend: number
  avgStay: number
  satisfaction: number
  color: string
}

interface GuestMetric {
  metric: string
  current: number
  previous: number
  change: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

interface GuestProfile {
  id: string
  name: string
  nationality: string
  visits: number
  totalSpent: number
  avgRating: number
  lastVisit: string
  preferences: string[]
  loyaltyTier: string
}

interface ReviewAnalytics {
  platform: string
  totalReviews: number
  avgRating: number
  sentiment: number
  commonKeywords: string[]
  recentTrend: 'up' | 'down' | 'stable'
}

export default function GuestAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [guestType, setGuestType] = useState('all')

  const guestSegments: GuestSegment[] = [
    {
      id: 'leisure',
      name: 'Leisure Travelers',
      count: 1247,
      percentage: 62.4,
      avgSpend: 285.50,
      avgStay: 4.2,
      satisfaction: 4.8,
      color: 'bg-blue-500'
    },
    {
      id: 'business',
      name: 'Business Travelers',
      count: 534,
      percentage: 26.7,
      avgSpend: 195.75,
      avgStay: 2.1,
      satisfaction: 4.5,
      color: 'bg-green-500'
    },
    {
      id: 'groups',
      name: 'Group Bookings',
      count: 145,
      percentage: 7.3,
      avgSpend: 425.25,
      avgStay: 3.8,
      satisfaction: 4.6,
      color: 'bg-purple-500'
    },
    {
      id: 'vip',
      name: 'VIP Guests',
      count: 72,
      percentage: 3.6,
      avgSpend: 1250.00,
      avgStay: 6.5,
      satisfaction: 4.9,
      color: 'bg-yellow-500'
    }
  ]

  const guestMetrics: GuestMetric[] = [
    {
      metric: 'New Guests',
      current: 423,
      previous: 398,
      change: 6.3,
      unit: 'guests',
      trend: 'up'
    },
    {
      metric: 'Returning Guests',
      current: 1575,
      previous: 1634,
      change: -3.6,
      unit: 'guests',
      trend: 'down'
    },
    {
      metric: 'Loyalty Program',
      current: 892,
      previous: 856,
      change: 4.2,
      unit: 'members',
      trend: 'up'
    },
    {
      metric: 'Guest Satisfaction',
      current: 4.7,
      previous: 4.6,
      change: 2.2,
      unit: '/5',
      trend: 'up'
    },
    {
      metric: 'Avg Length of Stay',
      current: 3.8,
      previous: 4.1,
      change: -7.3,
      unit: 'nights',
      trend: 'down'
    },
    {
      metric: 'Revenue per Guest',
      current: 312.50,
      previous: 295.75,
      change: 5.7,
      unit: '€',
      trend: 'up'
    }
  ]

  const topGuests: GuestProfile[] = [
    {
      id: 'G001',
      name: 'Dimitrios Papadakis',
      nationality: '🇬🇷 Greece',
      visits: 12,
      totalSpent: 15240.50,
      avgRating: 4.9,
      lastVisit: '2024-12-28',
      preferences: ['Sea View', 'Late Checkout', 'Room Service'],
      loyaltyTier: 'Platinum'
    },
    {
      id: 'G002',
      name: 'Sarah Johnson',
      nationality: '🇬🇧 UK',
      visits: 8,
      totalSpent: 9850.25,
      avgRating: 4.8,
      lastVisit: '2024-12-15',
      preferences: ['Pool Access', 'Spa Services', 'Early Breakfast'],
      loyaltyTier: 'Gold'
    },
    {
      id: 'G003',
      name: 'Hans Mueller',
      nationality: '🇩🇪 Germany',
      visits: 15,
      totalSpent: 18750.00,
      avgRating: 4.7,
      lastVisit: '2024-12-22',
      preferences: ['Mountain View', 'Hiking Tours', 'Local Cuisine'],
      loyaltyTier: 'Platinum'
    },
    {
      id: 'G004',
      name: 'Maria Rossi',
      nationality: '🇮🇹 Italy',
      visits: 6,
      totalSpent: 7425.75,
      avgRating: 4.9,
      lastVisit: '2024-12-30',
      preferences: ['Balcony', 'Wine Tasting', 'Cultural Tours'],
      loyaltyTier: 'Gold'
    },
    {
      id: 'G005',
      name: 'Jean Dubois',
      nationality: '🇫🇷 France',
      visits: 9,
      totalSpent: 11650.00,
      avgRating: 4.6,
      lastVisit: '2024-12-18',
      preferences: ['Fine Dining', 'Concierge Service', 'Airport Transfer'],
      loyaltyTier: 'Gold'
    }
  ]

  const reviewAnalytics: ReviewAnalytics[] = [
    {
      platform: 'Booking.com',
      totalReviews: 1247,
      avgRating: 4.7,
      sentiment: 85.2,
      commonKeywords: ['friendly staff', 'great location', 'clean rooms', 'excellent breakfast'],
      recentTrend: 'up'
    },
    {
      platform: 'TripAdvisor',
      totalReviews: 856,
      avgRating: 4.6,
      sentiment: 82.7,
      commonKeywords: ['beautiful view', 'comfortable beds', 'good service', 'pool area'],
      recentTrend: 'stable'
    },
    {
      platform: 'Google Reviews',
      totalReviews: 634,
      avgRating: 4.8,
      sentiment: 89.1,
      commonKeywords: ['amazing staff', 'perfect location', 'spotless', 'highly recommend'],
      recentTrend: 'up'
    },
    {
      platform: 'Hotels.com',
      totalReviews: 423,
      avgRating: 4.5,
      sentiment: 78.9,
      commonKeywords: ['good value', 'nice amenities', 'helpful reception', 'quiet rooms'],
      recentTrend: 'down'
    }
  ]

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (change: number): string => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getLoyaltyTierColor = (tier: string): string => {
    switch (tier) {
      case 'Platinum': return 'bg-gray-800 text-white'
      case 'Gold': return 'bg-yellow-500 text-white'
      case 'Silver': return 'bg-gray-400 text-white'
      default: return 'bg-blue-500 text-white'
    }
  }

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 85) return 'text-green-600'
    if (sentiment >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Guest Analytics & Insights</h1>
        <div className="flex gap-4">
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
            value={guestType}
            onChange={(e) => setGuestType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Guests</option>
            <option value="new">New Guests</option>
            <option value="returning">Returning Guests</option>
            <option value="vip">VIP Guests</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guestMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.unit === '€' ? '€' : ''}{metric.current}{metric.unit !== '€' ? ` ${metric.unit}` : ''}
                </p>
              </div>
              <span className="text-2xl">{getTrendIcon(metric.trend)}</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${getTrendColor(metric.change)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}% from last period
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Guest Segments</h2>
          <div className="space-y-4">
            {guestSegments.map((segment) => (
              <div key={segment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${segment.color}`}></div>
                    <h3 className="font-medium">{segment.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{segment.count}</div>
                    <div className="text-sm text-gray-500">{segment.percentage}%</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Avg Spend:</span>
                    <div className="font-medium">€{segment.avgSpend}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Stay:</span>
                    <div className="font-medium">{segment.avgStay} nights</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Satisfaction:</span>
                    <div className="font-medium">⭐ {segment.satisfaction}/5</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Valuable Guests</h2>
          <div className="space-y-4">
            {topGuests.map((guest) => (
              <div key={guest.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{guest.name}</h3>
                    <p className="text-sm text-gray-600">{guest.nationality}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLoyaltyTierColor(guest.loyaltyTier)}`}>
                      {guest.loyaltyTier}
                    </span>
                    <span className="text-sm text-gray-500">⭐ {guest.avgRating}/5</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Visits:</span>
                    <span className="ml-1 font-medium">{guest.visits}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Spent:</span>
                    <span className="ml-1 font-medium">€{guest.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Preferences:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {guest.preferences.map((pref, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Review Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewAnalytics.map((review, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{review.platform}</h3>
                <span className="text-lg">{getTrendIcon(review.recentTrend)}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-2xl font-bold">⭐ {review.avgRating}</span>
                  <span className="text-sm text-gray-500 ml-2">({review.totalReviews} reviews)</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Sentiment: </span>
                  <span className={`font-medium ${getSentimentColor(review.sentiment)}`}>
                    {review.sentiment}%
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Common Keywords:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {review.commonKeywords.map((keyword, kidx) => (
                    <span key={kidx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Guest Demographics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>🇬🇷 Greece</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium">35%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>🇬🇧 UK</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
                <span className="text-sm font-medium">22%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>🇩🇪 Germany</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>🇮🇹 Italy</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>🇫🇷 France</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>🌍 Others</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Loyalty Program</h2>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600">892</div>
              <div className="text-sm text-gray-500">Active Members</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-800 rounded"></div>
                  Platinum
                </span>
                <span className="font-medium">47 members</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  Gold
                </span>
                <span className="font-medium">168 members</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  Silver
                </span>
                <span className="font-medium">234 members</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  Bronze
                </span>
                <span className="font-medium">443 members</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Guest Insights</h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800">💡 Insight</div>
              <div className="text-sm text-blue-700 mt-1">
                VIP guests show 43% higher satisfaction rates and spend 4.2x more than average guests.
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">📈 Trend</div>
              <div className="text-sm text-green-700 mt-1">
                Returning guest rate increased by 8.5% after implementing personalized service preferences.
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="font-medium text-yellow-800">⚠️ Alert</div>
              <div className="text-sm text-yellow-700 mt-1">
                Average length of stay decreased by 7.3%. Consider promoting longer stay packages.
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-800">🎯 Opportunity</div>
              <div className="text-sm text-purple-700 mt-1">
                German guests show highest loyalty potential. Consider targeted marketing campaigns.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Export guest analytics:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              📊 Excel
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
              📄 PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              📱 CRM Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}