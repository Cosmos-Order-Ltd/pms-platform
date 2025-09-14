'use client'

import { useState } from 'react'

interface Review {
  id: string
  platform: 'Booking.com' | 'TripAdvisor' | 'Google' | 'Airbnb' | 'Expedia' | 'Direct'
  guestName: string
  rating: number
  title: string
  content: string
  date: string
  stayDate?: string
  roomNumber?: string
  verified: boolean
  sentiment: 'positive' | 'neutral' | 'negative'
  hasResponse: boolean
  response?: string
  respondedBy?: string
  respondedAt?: string
  keywords: string[]
  categories: {
    cleanliness: number
    service: number
    location: number
    value: number
  }
}

interface ReputationMetrics {
  overallRating: number
  totalReviews: number
  responseRate: number
  avgResponseTime: number
  platformRatings: {
    platform: string
    rating: number
    reviews: number
    change: number
  }[]
  sentimentBreakdown: {
    positive: number
    neutral: number
    negative: number
  }
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'responses' | 'analytics' | 'insights'>('reviews')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all')
  const [showResponseModal, setShowResponseModal] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  // Mock data
  const reviews: Review[] = [
    {
      id: 'REV-001',
      platform: 'Booking.com',
      guestName: 'Elena M.',
      rating: 9.2,
      title: 'Exceptional stay with stunning views',
      content: 'Absolutely loved our stay at Cyprus Luxury Resort! The room was spotless, staff was incredibly friendly and helpful. The sea view from our balcony was breathtaking. Will definitely return!',
      date: '2025-09-12',
      stayDate: '2025-09-05',
      roomNumber: '312',
      verified: true,
      sentiment: 'positive',
      hasResponse: true,
      response: 'Dear Elena, thank you so much for your wonderful review! We\'re thrilled that you enjoyed your stay and our sea views. We look forward to welcoming you back soon!',
      respondedBy: 'Maria Santos',
      respondedAt: '2025-09-13',
      keywords: ['clean', 'friendly staff', 'sea view', 'excellent'],
      categories: {
        cleanliness: 10,
        service: 9,
        location: 10,
        value: 9
      }
    },
    {
      id: 'REV-002',
      platform: 'TripAdvisor',
      guestName: 'John_Traveler_2024',
      rating: 4.0,
      title: 'Good hotel but room service was slow',
      content: 'Nice hotel with great facilities. Room was comfortable and clean. However, room service took over an hour to deliver breakfast. Staff could be more attentive.',
      date: '2025-09-11',
      stayDate: '2025-09-08',
      roomNumber: '205',
      verified: true,
      sentiment: 'neutral',
      hasResponse: false,
      keywords: ['comfortable', 'clean', 'slow service', 'facilities'],
      categories: {
        cleanliness: 8,
        service: 6,
        location: 8,
        value: 7
      }
    },
    {
      id: 'REV-003',
      platform: 'Google',
      guestName: 'Sarah W.',
      rating: 5.0,
      title: 'Perfect for couples getaway',
      content: 'My partner and I had the most romantic weekend here. The spa was amazing, dinner at the restaurant was exquisite, and the sunset views are unmatched. Highly recommend!',
      date: '2025-09-10',
      stayDate: '2025-09-06',
      verified: true,
      sentiment: 'positive',
      hasResponse: true,
      response: 'Thank you Sarah! We\'re so happy we could provide the perfect romantic getaway for you both. Your feedback means the world to us!',
      respondedBy: 'Andreas Dimitriou',
      respondedAt: '2025-09-11',
      keywords: ['romantic', 'spa', 'restaurant', 'sunset views'],
      categories: {
        cleanliness: 9,
        service: 10,
        location: 10,
        value: 9
      }
    },
    {
      id: 'REV-004',
      platform: 'Airbnb',
      guestName: 'David C.',
      rating: 7.5,
      title: 'Mixed experience - good and bad',
      content: 'The location and views are fantastic, but we had some issues with the air conditioning that took two days to fix. Once resolved, the stay was much better.',
      date: '2025-09-09',
      stayDate: '2025-09-01',
      roomNumber: '408',
      verified: true,
      sentiment: 'neutral',
      hasResponse: false,
      keywords: ['location', 'views', 'air conditioning', 'maintenance'],
      categories: {
        cleanliness: 8,
        service: 6,
        location: 9,
        value: 7
      }
    }
  ]

  const metrics: ReputationMetrics = {
    overallRating: 8.4,
    totalReviews: 1247,
    responseRate: 87,
    avgResponseTime: 4.2,
    platformRatings: [
      { platform: 'Booking.com', rating: 9.1, reviews: 456, change: +0.2 },
      { platform: 'TripAdvisor', rating: 4.2, reviews: 338, change: +0.1 },
      { platform: 'Google', rating: 4.8, reviews: 289, change: +0.3 },
      { platform: 'Airbnb', rating: 4.6, reviews: 164, change: -0.1 }
    ],
    sentimentBreakdown: {
      positive: 73,
      neutral: 19,
      negative: 8
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600'
    if (rating >= 8) return 'text-yellow-600'
    if (rating >= 7) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'neutral': return 'bg-yellow-100 text-yellow-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Booking.com': return '🏨'
      case 'TripAdvisor': return '🦉'
      case 'Google': return '🔍'
      case 'Airbnb': return '🏠'
      case 'Expedia': return '✈️'
      default: return '⭐'
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (selectedPlatform !== 'all' && review.platform !== selectedPlatform) return false
    if (selectedSentiment !== 'all' && review.sentiment !== selectedSentiment) return false
    return true
  })

  const renderStars = (rating: number, platform: string) => {
    if (platform === 'Booking.com') {
      // Booking.com uses 10-point scale
      const stars = Math.round(rating / 2)
      return '⭐'.repeat(stars) + ` ${rating}/10`
    } else {
      // Others use 5-point scale
      const fullStars = Math.floor(rating)
      const hasHalf = rating % 1 >= 0.5
      return '⭐'.repeat(fullStars) + (hasHalf ? '½' : '') + ` ${rating}/5`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reviews & Reputation Management</h1>
              <p className="text-gray-600">Monitor and manage guest reviews across all platforms</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.overallRating}</div>
                <div className="text-xs text-gray-500">Overall Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.totalReviews}</div>
                <div className="text-xs text-gray-500">Total Reviews</div>
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Request Review
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
              { id: 'reviews', label: 'Reviews', icon: '⭐' },
              { id: 'responses', label: 'Response Templates', icon: '💬' },
              { id: 'analytics', label: 'Analytics', icon: '📊' },
              { id: 'insights', label: 'Insights', icon: '🔍' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All Platforms</option>
                <option value="Booking.com">Booking.com</option>
                <option value="TripAdvisor">TripAdvisor</option>
                <option value="Google">Google</option>
                <option value="Airbnb">Airbnb</option>
                <option value="Expedia">Expedia</option>
              </select>
              <select
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
              <input
                type="text"
                placeholder="Search reviews..."
                className="rounded-lg border border-gray-300 px-4 py-2"
              />
              <button className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                <span>📅</span>
                <span>Date Range</span>
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-white p-6 shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xl">{getPlatformIcon(review.platform)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                            {review.verified && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                ✓ Verified
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                              {review.sentiment}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{review.platform}</span>
                            <span>{renderStars(review.rating, review.platform)}</span>
                            <span>{review.date}</span>
                            {review.roomNumber && <span>Room {review.roomNumber}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                        <p className="text-gray-700">{review.content}</p>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>

                      {/* Category Ratings */}
                      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Cleanliness:</span>
                          <span className={`ml-1 font-medium ${getRatingColor(review.categories.cleanliness)}`}>
                            {review.categories.cleanliness}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Service:</span>
                          <span className={`ml-1 font-medium ${getRatingColor(review.categories.service)}`}>
                            {review.categories.service}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className={`ml-1 font-medium ${getRatingColor(review.categories.location)}`}>
                            {review.categories.location}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <span className={`ml-1 font-medium ${getRatingColor(review.categories.value)}`}>
                            {review.categories.value}/10
                          </span>
                        </div>
                      </div>

                      {/* Response */}
                      {review.hasResponse && review.response && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-blue-900">Management Response</span>
                            <span className="text-xs text-blue-600">
                              by {review.respondedBy} on {review.respondedAt}
                            </span>
                          </div>
                          <p className="text-blue-800">{review.response}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      {!review.hasResponse && (
                        <button
                          onClick={() => setShowResponseModal(review.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Respond
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        View Full
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        Flag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                    <div className="text-2xl">⭐</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Overall Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.overallRating}/10</p>
                    <p className="text-sm text-green-600">+0.3 this month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">💬</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Response Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.responseRate}%</p>
                    <p className="text-sm text-green-600">+5% this week</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⏱️</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.avgResponseTime}h</p>
                    <p className="text-sm text-green-600">-1.2h from last month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">😊</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Positive Reviews</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.sentimentBreakdown.positive}%</p>
                    <p className="text-sm text-green-600">+2% this month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Performance */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
              <div className="space-y-4">
                {metrics.platformRatings.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getPlatformIcon(platform.platform)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                        <p className="text-sm text-gray-500">{platform.reviews} reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getRatingColor(platform.rating * 2)}`}>
                          {platform.rating}/5
                        </p>
                        <p className={`text-sm ${platform.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {platform.change > 0 ? '+' : ''}{platform.change} this month
                        </p>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(platform.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl text-green-600 mb-2">😊</div>
                  <p className="text-2xl font-bold text-green-600">{metrics.sentimentBreakdown.positive}%</p>
                  <p className="text-sm text-green-700">Positive</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl text-yellow-600 mb-2">😐</div>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.sentimentBreakdown.neutral}%</p>
                  <p className="text-sm text-yellow-700">Neutral</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl text-red-600 mb-2">😞</div>
                  <p className="text-2xl font-bold text-red-600">{metrics.sentimentBreakdown.negative}%</p>
                  <p className="text-sm text-red-700">Negative</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Response Templates</h3>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Create Template
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  name: 'Positive Review - Thank You',
                  category: 'Positive Response',
                  template: 'Dear {guest_name}, thank you so much for your wonderful {rating}-star review! We\'re thrilled that you enjoyed your stay at Cyprus Luxury Resort. We look forward to welcoming you back soon!',
                  usage: 156
                },
                {
                  name: 'Service Issue - Apologetic',
                  category: 'Negative Response',
                  template: 'Dear {guest_name}, we sincerely apologize for the service issues during your stay. We take your feedback seriously and have already implemented improvements. We would love the opportunity to make it right - please contact us directly.',
                  usage: 23
                },
                {
                  name: 'Neutral Review - Appreciation',
                  category: 'Neutral Response',
                  template: 'Dear {guest_name}, thank you for taking the time to review your stay with us. We appreciate your feedback about {specific_mention} and will continue working to improve our services.',
                  usage: 89
                },
                {
                  name: 'Maintenance Issue Response',
                  category: 'Issue Resolution',
                  template: 'Dear {guest_name}, we apologize for the maintenance issue you experienced. We have addressed this with our facilities team to prevent future occurrences. Your comfort is our priority.',
                  usage: 34
                }
              ].map((template, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.category}</p>
                      <p className="text-xs text-gray-500 mt-1">Used {template.usage} times</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-600">
                        ✏️
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{template.template}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights & Trends</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl">📈</div>
                  <div>
                    <h4 className="font-medium text-green-900">Positive Trend</h4>
                    <p className="text-sm text-green-700">
                      "Sea view" and "sunset" are frequently mentioned in 5-star reviews. Consider highlighting these features in marketing materials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h4 className="font-medium text-yellow-900">Areas for Improvement</h4>
                    <p className="text-sm text-yellow-700">
                      "Room service" speed mentioned in 15% of neutral/negative reviews. Consider reviewing delivery processes and staffing levels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-medium text-blue-900">Opportunity</h4>
                    <p className="text-sm text-blue-700">
                      Guests consistently praise the spa services. Consider creating spa packages or expanding wellness offerings to increase revenue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl">🚨</div>
                  <div>
                    <h4 className="font-medium text-red-900">Urgent Action Needed</h4>
                    <p className="text-sm text-red-700">
                      Air conditioning issues mentioned in 3 recent reviews from different room types. Schedule comprehensive HVAC inspection immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Word Cloud Placeholder */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Mentioned Keywords</h3>
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-center space-x-4 text-lg">
                    <span className="text-green-600 font-bold">EXCELLENT</span>
                    <span className="text-blue-600">beautiful</span>
                    <span className="text-green-500 text-2xl font-bold">CLEAN</span>
                    <span className="text-purple-600">comfortable</span>
                  </div>
                  <div className="flex justify-center space-x-6 text-base">
                    <span className="text-yellow-600 font-semibold">friendly staff</span>
                    <span className="text-green-600 text-xl font-bold">SEA VIEW</span>
                    <span className="text-blue-500">location</span>
                  </div>
                  <div className="flex justify-center space-x-3 text-sm">
                    <span className="text-gray-600">breakfast</span>
                    <span className="text-red-500">slow service</span>
                    <span className="text-green-600 font-semibold">romantic</span>
                    <span className="text-blue-600">sunset</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">Word cloud visualization - Size indicates frequency</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Respond to Review</h3>
                <button
                  onClick={() => setShowResponseModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Template
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option>Select a template...</option>
                  <option>Positive Review - Thank You</option>
                  <option>Service Issue - Apologetic</option>
                  <option>Neutral Review - Appreciation</option>
                  <option>Custom Response</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Type your response here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Response will be posted publicly on the review platform
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowResponseModal(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Post Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}