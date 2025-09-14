'use client';

import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast'

interface Reservation {
  id: string
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out'
  totalAmount: number
  adults: number
  children: number
  specialRequests?: string
}

const mockReservations: Reservation[] = [
  {
    id: "RSV-001",
    guestName: "John Smith",
    roomNumber: "207",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    status: "confirmed",
    totalAmount: 450.00,
    adults: 2,
    children: 0,
  },
  {
    id: "RSV-002",
    guestName: "Maria Georgiou",
    roomNumber: "101",
    checkIn: "2024-01-14",
    checkOut: "2024-01-16",
    status: "checked-in",
    totalAmount: 320.00,
    adults: 1,
    children: 1,
    specialRequests: "Ground floor room, early check-in"
  },
  {
    id: "RSV-003",
    guestName: "Andreas Papadopoulos",
    roomNumber: "408",
    checkIn: "2024-01-12",
    checkOut: "2024-01-15",
    status: "checked-out",
    totalAmount: 540.00,
    adults: 2,
    children: 0,
  },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const router = useRouter()

  const handleEdit = (reservationId: string) => {
    toast.success(`Editing reservation ${reservationId}`)
    // Navigate to edit page when implemented
  }

  const handleCheckIn = (reservationId: string) => {
    setReservations(prev => prev.map(res =>
      res.id === reservationId ? { ...res, status: 'checked-in' as const } : res
    ))
    toast.success('Guest checked in successfully!')
  }

  const handleMore = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId)
    toast.success(`${reservation?.guestName} - Room ${reservation?.roomNumber} - ${(reservation?.adults || 0) + (reservation?.children || 0)} guests`)
  }

  const navigateToNewReservation = () => {
    router.push('/reservations/new')
  }

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'checked-in':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'checked-out':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return '📋'
      case 'pending':
        return '⏳'
      case 'cancelled':
        return '❌'
      case 'checked-in':
        return '✅'
      case 'checked-out':
        return '🚪'
      default:
        return '📋'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservations</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage bookings and guest reservations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  showFilter
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Filter {showFilter ? '✕' : '⚙️'}
              </button>
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

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reservations</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">127</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">89</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900">
                <span className="text-purple-600 dark:text-purple-400 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue (Month)</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">€25,430</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reservations</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reservation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getStatusIcon(reservation.status)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {reservation.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reservation.adults} adult{reservation.adults > 1 ? 's' : ''}{reservation.children > 0 ? `, ${reservation.children} child${reservation.children > 1 ? 'ren' : ''}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.guestName}
                      </div>
                      {reservation.specialRequests && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Special requests
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Room {reservation.roomNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div>{new Date(reservation.checkIn).toLocaleDateString()}</div>
                        <div className="text-gray-500 dark:text-gray-400">to {new Date(reservation.checkOut).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        €{reservation.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(reservation.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCheckIn(reservation.id)}
                          disabled={reservation.status !== 'confirmed'}
                          className={`${
                            reservation.status === 'confirmed'
                              ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Check-in
                        </button>
                        <button
                          onClick={() => handleMore(reservation.id)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          More
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">127</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1)
                      toast.success(`Page ${currentPage - 1}`)
                    }
                  }}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm ${
                    currentPage === 1
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(2)
                    toast.success('Page 2')
                  }}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === 2
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(3)
                    toast.success('Page 3')
                  }}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === 3
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  3
                </button>
                <button
                  onClick={() => {
                    if (currentPage < 3) {
                      setCurrentPage(currentPage + 1)
                      toast.success(`Page ${currentPage + 1}`)
                    }
                  }}
                  disabled={currentPage === 3}
                  className={`px-3 py-1 text-sm ${
                    currentPage === 3
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}