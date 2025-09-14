'use client';

import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast'

interface Room {
  id: string
  number: string
  type: 'STANDARD' | 'DELUXE' | 'SUITE' | 'FAMILY'
  floor: number
  status: 'available' | 'occupied' | 'maintenance' | 'dirty' | 'blocked'
  guestName?: string
  checkIn?: string
  checkOut?: string
  rate: number
  amenities: string[]
  lastCleaned?: string
  notes?: string
}

const mockRooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "STANDARD",
    floor: 1,
    status: "available",
    rate: 80,
    amenities: ["WiFi", "AC", "TV", "Bathroom"],
    lastCleaned: "2024-01-14T10:00:00Z"
  },
  {
    id: "2",
    number: "102",
    type: "STANDARD",
    floor: 1,
    status: "occupied",
    guestName: "Maria Georgiou",
    checkIn: "2024-01-14",
    checkOut: "2024-01-16",
    rate: 80,
    amenities: ["WiFi", "AC", "TV", "Bathroom"],
    lastCleaned: "2024-01-14T09:00:00Z"
  },
  {
    id: "3",
    number: "201",
    type: "DELUXE",
    floor: 2,
    status: "dirty",
    rate: 120,
    amenities: ["WiFi", "AC", "TV", "Balcony", "Mini Bar"],
    lastCleaned: "2024-01-13T14:00:00Z",
    notes: "Guest checked out, needs housekeeping"
  },
  {
    id: "4",
    number: "205",
    type: "DELUXE",
    floor: 2,
    status: "occupied",
    guestName: "John Smith",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    rate: 120,
    amenities: ["WiFi", "AC", "TV", "Balcony", "Mini Bar"],
    lastCleaned: "2024-01-15T11:00:00Z"
  },
  {
    id: "5",
    number: "301",
    type: "SUITE",
    floor: 3,
    status: "maintenance",
    rate: 200,
    amenities: ["WiFi", "AC", "TV", "Kitchenette", "Living Area", "Balcony"],
    lastCleaned: "2024-01-12T16:00:00Z",
    notes: "AC unit repair scheduled"
  },
  {
    id: "6",
    number: "310",
    type: "FAMILY",
    floor: 3,
    status: "available",
    rate: 150,
    amenities: ["WiFi", "AC", "TV", "Two Bedrooms", "Living Area"],
    lastCleaned: "2024-01-14T13:00:00Z"
  },
]

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const updateRoomStatus = (roomId: string, newStatus: Room['status'], guestName?: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, status: newStatus, guestName, lastCleaned: new Date().toISOString() }
        : room
    ))
    toast.success('Room status updated successfully!')
  }

  const refreshRoomStatus = async () => {
    setIsLoading(true)
    toast.loading('Refreshing room status...', { id: 'refresh' })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Room status refreshed!', { id: 'refresh' })
    setIsLoading(false)
  }

  const handleFloorFilter = (floor: string) => {
    setSelectedFloor(floor)
    toast.success(floor === 'all' ? 'Showing all floors' : `Showing floor ${floor}`)
  }

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'dirty':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'maintenance':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'blocked':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return '✅'
      case 'occupied':
        return '👤'
      case 'dirty':
        return '🧹'
      case 'maintenance':
        return '🔧'
      case 'blocked':
        return '🚫'
      default:
        return '🏠'
    }
  }

  const getRoomTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'STANDARD':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'DELUXE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'SUITE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'FAMILY':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const filteredRooms = selectedFloor === 'all' ? rooms : rooms.filter(room => room.floor.toString() === selectedFloor)
  const availableRooms = filteredRooms.filter(room => room.status === 'available').length
  const occupiedRooms = filteredRooms.filter(room => room.status === 'occupied').length
  const maintenanceRooms = filteredRooms.filter(room => room.status === 'maintenance').length
  const dirtyRooms = filteredRooms.filter(room => room.status === 'dirty').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor room status and availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedFloor}
                onChange={(e) => handleFloorFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Floors</option>
                <option value="1">Floor 1</option>
                <option value="2">Floor 2</option>
                <option value="3">Floor 3</option>
              </select>
              <button
                onClick={refreshRoomStatus}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Status'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Room Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{availableRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900">
                <span className="text-blue-600 dark:text-blue-400 text-xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{occupiedRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">🧹</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs Cleaning</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dirtyRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900">
                <span className="text-red-600 dark:text-red-400 text-xl">🔧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{maintenanceRooms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Rooms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Room Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStatusIcon(room.status)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Room {room.number}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Floor {room.floor}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(room.type)}`}>
                    {room.type}
                  </span>
                </div>

                {/* Room Status */}
                <div className="mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>

                {/* Guest Information */}
                {room.status === 'occupied' && room.guestName && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Guest: {room.guestName}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {new Date(room.checkIn!).toLocaleDateString()} - {new Date(room.checkOut!).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {room.notes && (
                  <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      📝 {room.notes}
                    </p>
                  </div>
                )}

                {/* Room Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                    <span className="font-medium text-gray-900 dark:text-white">€{room.rate}/night</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={`${room.id}-amenity-${index}`}
                          className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {room.lastCleaned && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last cleaned:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(room.lastCleaned).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {room.status === 'dirty' && (
                      <button
                        onClick={() => updateRoomStatus(room.id, 'available')}
                        className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                      >
                        Mark Clean
                      </button>
                    )}
                    {room.status === 'maintenance' && (
                      <button
                        onClick={() => updateRoomStatus(room.id, 'available')}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                      >
                        Fixed
                      </button>
                    )}
                    {room.status === 'available' && (
                      <button
                        onClick={() => updateRoomStatus(room.id, 'occupied', 'New Guest')}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Assign Guest
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => toast.success(`Room ${room.number} details: ${room.type} room with ${room.amenities.length} amenities`)}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                const dirtyRoomIds = rooms.filter(r => r.status === 'dirty').map(r => r.id)
                dirtyRoomIds.forEach(id => updateRoomStatus(id, 'available'))
                toast.success(`Marked ${dirtyRoomIds.length} rooms as clean!`)
              }}
              className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl mb-2">🧹</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Mark All Clean</span>
            </button>

            <button
              onClick={() => toast.success('Maintenance Report: 1 room needs AC repair, 2 rooms need bathroom fixtures')}
              className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl mb-2">🔧</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Report</span>
            </button>

            <button
              onClick={() => toast.success(`Occupancy Report: ${occupiedRooms}/${rooms.length} rooms occupied (${Math.round(occupiedRooms/rooms.length * 100)}%)`)}
              className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Occupancy Report</span>
            </button>

            <button
              onClick={() => {
                const availableRoomIds = rooms.filter(r => r.status === 'available').slice(0, 2).map(r => r.id)
                availableRoomIds.forEach(id => updateRoomStatus(id, 'blocked'))
                toast.success(`Blocked ${availableRoomIds.length} rooms for maintenance`)
              }}
              className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl mb-2">🚫</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Block Rooms</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}