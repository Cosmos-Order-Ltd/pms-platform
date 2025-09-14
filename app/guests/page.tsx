import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Guests - Cyprus PMS",
  description: "Manage guest profiles and information",
}

interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  nationality?: string
  dateOfBirth?: string
  passportNumber?: string
  address?: {
    street: string
    city: string
    country: string
    postalCode: string
  }
  preferences: {
    roomType?: string
    floorPreference?: string
    amenities: string[]
    dietaryRestrictions?: string[]
    specialRequests?: string
  }
  visitHistory: {
    reservationId: string
    checkIn: string
    checkOut: string
    roomNumber: string
    status: 'completed' | 'cancelled' | 'upcoming'
    totalSpent: number
  }[]
  loyaltyStatus: 'bronze' | 'silver' | 'gold' | 'platinum'
  totalSpent: number
  visits: number
  createdAt: string
  notes?: string
}

const mockGuests: Guest[] = [
  {
    id: "GST-001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+44 7700 123456",
    nationality: "GB",
    dateOfBirth: "1985-03-15",
    passportNumber: "123456789",
    address: {
      street: "123 Main Street",
      city: "London",
      country: "United Kingdom",
      postalCode: "SW1A 1AA"
    },
    preferences: {
      roomType: "DELUXE",
      floorPreference: "high",
      amenities: ["Sea View", "Balcony", "Mini Bar"],
      dietaryRestrictions: ["Vegetarian"],
      specialRequests: "Late checkout preferred"
    },
    visitHistory: [
      {
        reservationId: "RSV-001",
        checkIn: "2024-01-15",
        checkOut: "2024-01-18",
        roomNumber: "205",
        status: "upcoming",
        totalSpent: 450.00
      },
      {
        reservationId: "RSV-015",
        checkIn: "2023-08-20",
        checkOut: "2023-08-25",
        roomNumber: "302",
        status: "completed",
        totalSpent: 800.00
      }
    ],
    loyaltyStatus: "gold",
    totalSpent: 1250.00,
    visits: 2,
    createdAt: "2023-08-15T10:00:00Z",
    notes: "VIP guest, prefers early check-in"
  },
  {
    id: "GST-002",
    firstName: "Maria",
    lastName: "Georgiou",
    email: "maria.georgiou@email.com",
    phone: "+357 99 123456",
    nationality: "CY",
    dateOfBirth: "1992-07-22",
    address: {
      street: "456 Cyprus Avenue",
      city: "Nicosia",
      country: "Cyprus",
      postalCode: "1234"
    },
    preferences: {
      roomType: "STANDARD",
      floorPreference: "low",
      amenities: ["Ground Floor", "WiFi"],
      specialRequests: "Quiet room away from elevator"
    },
    visitHistory: [
      {
        reservationId: "RSV-002",
        checkIn: "2024-01-14",
        checkOut: "2024-01-16",
        roomNumber: "101",
        status: "upcoming",
        totalSpent: 320.00
      }
    ],
    loyaltyStatus: "silver",
    totalSpent: 320.00,
    visits: 1,
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "GST-003",
    firstName: "Andreas",
    lastName: "Papadopoulos",
    email: "andreas.p@email.com",
    phone: "+30 210 123456",
    nationality: "GR",
    dateOfBirth: "1978-11-08",
    address: {
      street: "789 Athens Street",
      city: "Athens",
      country: "Greece",
      postalCode: "10431"
    },
    preferences: {
      roomType: "SUITE",
      amenities: ["Business Center", "Late Checkout"],
      specialRequests: "Business amenities required"
    },
    visitHistory: [
      {
        reservationId: "RSV-003",
        checkIn: "2024-01-12",
        checkOut: "2024-01-15",
        roomNumber: "408",
        status: "completed",
        totalSpent: 540.00
      }
    ],
    loyaltyStatus: "platinum",
    totalSpent: 2150.00,
    visits: 4,
    createdAt: "2023-05-20T09:15:00Z",
    notes: "Frequent business traveler, invoice required"
  }
]

export default function GuestsPage() {
  const getLoyaltyColor = (status: Guest['loyaltyStatus']) => {
    switch (status) {
      case 'bronze':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'platinum':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getLoyaltyIcon = (status: Guest['loyaltyStatus']) => {
    switch (status) {
      case 'bronze':
        return '🥉'
      case 'silver':
        return '🥈'
      case 'gold':
        return '🥇'
      case 'platinum':
        return '💎'
      default:
        return '👤'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage guest profiles and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search guests..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                New Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Guest Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Guests</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">847</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Returning Guests</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">65%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900">
                <span className="text-purple-600 dark:text-purple-400 text-xl">💎</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Members</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">128</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Guest Profiles</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Loyalty Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {guest.firstName[0]}{guest.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {guest.firstName} {guest.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {guest.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {guest.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {guest.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getLoyaltyIcon(guest.loyaltyStatus)}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyColor(guest.loyaltyStatus)}`}>
                          {guest.loyaltyStatus.charAt(0).toUpperCase() + guest.loyaltyStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {guest.visits} visits
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        €{guest.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {guest.visitHistory.length > 0 && guest.visitHistory[0]
                          ? new Date(guest.visitHistory[0].checkIn).toLocaleDateString()
                          : 'Never'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          Book
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          Edit
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">847</span> guests
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  2
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  3
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Nationalities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Guest Nationalities</h3>
            <div className="space-y-3">
              {[
                { country: "United Kingdom", flag: "🇬🇧", percentage: 35 },
                { country: "Cyprus", flag: "🇨🇾", percentage: 25 },
                { country: "Greece", flag: "🇬🇷", percentage: 15 },
                { country: "Germany", flag: "🇩🇪", percentage: 12 },
                { country: "Russia", flag: "🇷🇺", percentage: 8 },
                { country: "Others", flag: "🌍", percentage: 5 }
              ].map((item) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{item.flag}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.country}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Loyalty Program Distribution</h3>
            <div className="space-y-3">
              {[
                { level: "Bronze", icon: "🥉", count: 520, color: "bg-orange-500" },
                { level: "Silver", icon: "🥈", count: 195, color: "bg-gray-500" },
                { level: "Gold", icon: "🥇", count: 104, color: "bg-yellow-500" },
                { level: "Platinum", icon: "💎", count: 28, color: "bg-purple-500" }
              ].map((tier) => (
                <div key={tier.level} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{tier.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{tier.level}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div
                        className={`${tier.color} h-2 rounded-full`}
                        style={{ width: `${(tier.count / 847) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tier.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}