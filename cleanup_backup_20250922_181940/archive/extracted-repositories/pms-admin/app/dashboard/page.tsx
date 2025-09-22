'use client';

import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  const navigateToNewReservation = () => {
    router.push('/reservations/new')
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome to your property management dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateToNewReservation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                New Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Arrivals</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-2xl">🏠</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">89%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">€2,850</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-2xl">🚪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Departures</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reservation Calendar</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  <div className="py-2">Mon</div>
                  <div className="py-2">Tue</div>
                  <div className="py-2">Wed</div>
                  <div className="py-2">Thu</div>
                  <div className="py-2">Fri</div>
                  <div className="py-2">Sat</div>
                  <div className="py-2">Sun</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6 + new Date().getDate()
                    const isToday = day === new Date().getDate()
                    const hasBooking = Math.random() > 0.7

                    return (
                      <div
                        key={i}
                        className={`
                          h-12 flex items-center justify-center cursor-pointer rounded-md
                          ${day < 1 || day > 31 ? 'text-gray-300 dark:text-gray-600' : ''}
                          ${isToday ? 'bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900 dark:text-blue-400' : ''}
                          ${hasBooking && day > 0 && day <= 31 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                          ${!hasBooking && day > 0 && day <= 31 && !isToday ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                        `}
                      >
                        {day > 0 && day <= 31 ? day : ''}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">📝</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New reservation created</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room 205 • John Smith • 2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Check-in completed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room 101 • Maria Georgiou • 15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm">🛏️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Room status updated</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room 312 • Ready for arrival • 30 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm">🚪</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Check-out processed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room 408 • Andreas Papadopoulos • 1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-2xl mb-2">➕</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">New Reservation</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-2xl mb-2">✅</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Check In Guest</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-2xl mb-2">🚪</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Check Out Guest</span>
                </button>

                <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-2xl mb-2">🛏️</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Room Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}