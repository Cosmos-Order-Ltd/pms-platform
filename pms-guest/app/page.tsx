'use client'

import { useState } from 'react'
import { CalendarIcon, MapPinIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Mock data for properties
const featuredProperties = [
  {
    id: 1,
    name: 'Oceanview Resort',
    location: 'Ayia Napa, Cyprus',
    price: 150,
    rating: 4.8,
    reviews: 324,
    image: '/api/placeholder/400/300',
    amenities: ['Pool', 'WiFi', 'Breakfast', 'Spa']
  },
  {
    id: 2,
    name: 'Mountain Lodge',
    location: 'Troodos, Cyprus',
    price: 95,
    rating: 4.6,
    reviews: 189,
    image: '/api/placeholder/400/300',
    amenities: ['Fireplace', 'WiFi', 'Parking', 'Kitchen']
  },
  {
    id: 3,
    name: 'City Center Hotel',
    location: 'Nicosia, Cyprus',
    price: 120,
    rating: 4.4,
    reviews: 256,
    image: '/api/placeholder/400/300',
    amenities: ['Gym', 'WiFi', 'Restaurant', 'Bar']
  }
]

export default function HomePage() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [location, setLocation] = useState('')

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    const searchParams = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
      location
    })

    window.location.href = `/search?${searchParams}`
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PMS Guest Portal</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/properties" className="text-gray-500 hover:text-blue-600">Properties</Link>
              <Link href="/bookings" className="text-gray-500 hover:text-blue-600">My Bookings</Link>
              <Link href="/profile" className="text-gray-500 hover:text-blue-600">Profile</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-500 hover:text-blue-600">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Stay
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              Discover amazing properties and book your next adventure
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Where to?
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search Properties
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h3>
            <p className="text-lg text-gray-600">Discover our most popular destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md">
                    <span className="text-sm font-semibold text-gray-900">€{property.price}/night</span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{property.name}</h4>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(property.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {property.rating} ({property.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/properties/${property.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">PMS Guest Portal</h5>
              <p className="text-gray-400">
                Your gateway to amazing stays and unforgettable experiences.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Quick Links</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
                <li><Link href="/bookings" className="hover:text-white">My Bookings</Link></li>
                <li><Link href="/profile" className="hover:text-white">Profile</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Contact</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@pms.com</li>
                <li>Phone: +357 12 345 678</li>
                <li>Address: Nicosia, Cyprus</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Follow Us</h6>
              <div className="flex space-x-4 text-gray-400">
                <a href="#" className="hover:text-white">Facebook</a>
                <a href="#" className="hover:text-white">Twitter</a>
                <a href="#" className="hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PMS Guest Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}