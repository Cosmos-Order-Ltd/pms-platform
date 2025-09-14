'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface GuestPortalProps {}

interface ServiceRequest {
  id: string
  type: string
  title: string
  status: string
  requestedAt: string
}

interface Reservation {
  id: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: string
  totalAmount: number
}

export default function GuestPortalPage({}: GuestPortalProps) {
  // Mock data
  const currentReservation: Reservation = {
    id: 'RES-001',
    roomNumber: '205',
    checkIn: '2025-09-15',
    checkOut: '2025-09-22',
    status: 'confirmed',
    totalAmount: 1850.00
  }

  const recentServices: ServiceRequest[] = [
    { id: 'SR-001', type: 'Room Service', title: 'Breakfast delivery', status: 'completed', requestedAt: '2025-09-14 08:30' },
    { id: 'SR-002', type: 'Housekeeping', title: 'Extra towels', status: 'in_progress', requestedAt: '2025-09-14 10:15' },
    { id: 'SR-003', type: 'Concierge', title: 'Restaurant reservation', status: 'requested', requestedAt: '2025-09-14 12:45' }
  ]

  const quickServices = [
    { icon: '🍽️', title: 'Room Service', description: 'Order food and drinks' },
    { icon: '🧹', title: 'Housekeeping', description: 'Extra towels, cleaning' },
    { icon: '🛎️', title: 'Concierge', description: 'Tours, restaurants, activities' },
    { icon: '🚗', title: 'Transportation', description: 'Airport transfer, taxi' },
    { icon: '💆', title: 'Spa & Wellness', description: 'Massage, treatments' },
    { icon: '🏊', title: 'Pool & Beach', description: 'Towel service, umbrellas' }
  ]

  const loyaltyInfo = {
    tier: 'Gold',
    points: 2340,
    nextTier: 'Platinum',
    pointsToNext: 660
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'billing' | 'profile'>('overview')
  const [serviceRequests, setServiceRequests] = useState(recentServices)

  const handleDigitalKey = async () => {
    const toastId = toast.loading('Activating digital key...')
    try {
      const response = await fetch('/api/guest-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'digital-key'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message, { id: toastId })
      } else {
        toast.error('Failed to activate digital key', { id: toastId })
      }
    } catch (error) {
      toast.error('Error activating digital key', { id: toastId })
    }
  }

  const handleQuickAction = (action: string) => {
    toast.loading(`Processing ${action} request...`)
    setTimeout(() => {
      toast.success(`${action} request submitted successfully!`)
    }, 1500)
  }

  const handleServiceRequest = async (serviceType: string) => {
    const toastId = toast.loading(`Submitting ${serviceType} request...`)
    try {
      const response = await fetch('/api/guest-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-service',
          type: serviceType
        })
      })

      const data = await response.json()
      if (data.success) {
        const newRequest: ServiceRequest = {
          id: data.data.id,
          type: serviceType,
          title: `${serviceType} request`,
          status: 'requested',
          requestedAt: data.data.requestedAt
        }
        setServiceRequests([newRequest, ...serviceRequests])
        toast.success(data.message, { id: toastId })
      } else {
        toast.error(`Failed to submit ${serviceType} request`, { id: toastId })
      }
    } catch (error) {
      toast.error(`Error submitting ${serviceType} request`, { id: toastId })
    }
  }

  const handlePayBill = () => {
    toast.success('Redirecting to secure payment portal...')
    // In real app: redirect to payment processor
  }

  const handleUpdateProfile = () => {
    toast.success('Profile updated successfully!')
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Guest Portal</h1>
              <p className="text-gray-600">Welcome to Cyprus Luxury Resort</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Room {currentReservation.roomNumber}</p>
                <p className="text-sm font-medium text-gray-900">{currentReservation.checkIn} - {currentReservation.checkOut}</p>
              </div>
              <button
                onClick={handleDigitalKey}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <span>📱</span>
                <span>Digital Key</span>
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
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'services', label: 'Services', icon: '🛎️' },
              { id: 'billing', label: 'Billing', icon: '💳' },
              { id: 'profile', label: 'Profile', icon: '👤' }
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Current Stay */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Current Stay</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-900">Check-in</h4>
                    <p className="text-2xl font-bold text-blue-600">{currentReservation.checkIn}</p>
                    <p className="text-sm text-blue-600">3:00 PM</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <h4 className="font-medium text-green-900">Check-out</h4>
                    <p className="text-2xl font-bold text-green-600">{currentReservation.checkOut}</p>
                    <p className="text-sm text-green-600">11:00 AM</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-3 font-medium text-gray-900">Quick Actions</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <button
                      onClick={() => handleQuickAction('Late Checkout')}
                      className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <span>⏰</span>
                      <span className="text-sm">Late Checkout</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Luggage Storage')}
                      className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <span>🧳</span>
                      <span className="text-sm">Luggage Storage</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Valet Parking')}
                      className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <span>🚗</span>
                      <span className="text-sm">Valet Parking</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Services */}
              <div className="mt-6 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Services</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quickServices.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceRequest(service.title)}
                      className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-blue-50 hover:border-blue-200"
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <h4 className="font-medium text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Loyalty Status */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Loyalty Status</h3>
                <div className="text-center">
                  <div className="mb-2 text-3xl">🏆</div>
                  <p className="text-lg font-bold text-yellow-600">{loyaltyInfo.tier} Member</p>
                  <p className="text-2xl font-bold text-gray-900">{loyaltyInfo.points.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">points</p>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Progress to {loyaltyInfo.nextTier}</span>
                      <span>{loyaltyInfo.pointsToNext} points to go</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(loyaltyInfo.points / (loyaltyInfo.points + loyaltyInfo.pointsToNext)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Services */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Services</h3>
                <div className="space-y-3">
                  {recentServices.map((service) => (
                    <div key={service.id} className="border-l-4 border-blue-200 pl-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-900">{service.title}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : service.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {service.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{service.type}</p>
                      <p className="text-xs text-gray-500">{service.requestedAt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather & Local Info */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Today in Cyprus</h3>
                <div className="text-center">
                  <div className="text-4xl mb-2">☀️</div>
                  <p className="text-2xl font-bold text-gray-900">28°C</p>
                  <p className="text-sm text-gray-600">Sunny and warm</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Beach conditions:</span>
                      <span className="text-green-600">Perfect</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Pool temperature:</span>
                      <span className="text-blue-600">26°C</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request New Service</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quickServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => handleServiceRequest(service.title)}
                    className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-blue-50 hover:border-blue-200"
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <h4 className="font-medium text-gray-900">{service.title}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Service Requests</h3>
              <div className="space-y-3">
                {serviceRequests.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{service.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {service.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{service.requestedAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Bill</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Room Rate (7 nights)</span>
                  <span>€1,400.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charges</span>
                  <span>€150.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tourism Tax</span>
                  <span>€21.00</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (19%)</span>
                  <span>€298.39</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>€{currentReservation.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePayBill}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  💳 Pay Now
                </button>
                <button
                  onClick={() => toast.info('Receipt sent to your email!')}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  📧 Email Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue="Maria"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Georgiou"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="maria@example.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+357 99 123456"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">SMS notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Marketing communications</span>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleUpdateProfile}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                  💾 Update Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  )
}