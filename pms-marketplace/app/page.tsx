'use client'

import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HeartIcon,
  ShareIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  HomeIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { StarIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Mock data for marketplace properties
const properties = [
  {
    id: 1,
    title: 'Luxury Beachfront Villa',
    type: 'sale',
    propertyType: 'villa',
    price: 850000,
    location: 'Paphos, Cyprus',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    description: 'Stunning beachfront villa with private pool and direct beach access',
    features: ['Pool', 'Beach Access', 'Parking', 'Garden', 'Sea View'],
    images: ['/api/placeholder/400/300'],
    rating: 4.9,
    reviews: 47,
    agent: 'Cyprus Real Estate Ltd.',
    yearBuilt: 2020,
    isFeatured: true,
    isLiked: false
  },
  {
    id: 2,
    title: 'Modern City Apartment',
    type: 'rent',
    propertyType: 'apartment',
    price: 1200,
    priceUnit: 'month',
    location: 'Nicosia, Cyprus',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    description: 'Contemporary apartment in the heart of the city with all amenities',
    features: ['Gym', 'Parking', 'Balcony', 'AC', 'Furnished'],
    images: ['/api/placeholder/400/300'],
    rating: 4.7,
    reviews: 23,
    agent: 'Urban Properties',
    yearBuilt: 2018,
    isFeatured: false,
    isLiked: true
  },
  {
    id: 3,
    title: 'Investment Hotel Opportunity',
    type: 'sale',
    propertyType: 'commercial',
    price: 2500000,
    location: 'Limassol, Cyprus',
    bedrooms: 24,
    bathrooms: 26,
    area: 1200,
    description: 'Established boutique hotel with excellent ROI potential',
    features: ['Restaurant', 'Pool', 'Parking', 'Reception', 'Conference Room'],
    images: ['/api/placeholder/400/300'],
    rating: 4.5,
    reviews: 156,
    agent: 'Commercial Investments Cyprus',
    yearBuilt: 2015,
    isFeatured: true,
    isLiked: false
  }
]

const propertyTypes = [
  { id: 'all', name: 'All Types', icon: BuildingOfficeIcon },
  { id: 'apartment', name: 'Apartment', icon: BuildingOfficeIcon },
  { id: 'villa', name: 'Villa', icon: HomeIcon },
  { id: 'commercial', name: 'Commercial', icon: BuildingStorefrontIcon }
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [listingType, setListingType] = useState('all') // all, sale, rent
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [showFilters, setShowFilters] = useState(false)
  const [likedProperties, setLikedProperties] = useState<number[]>([2])

  const handleLike = (propertyId: number) => {
    setLikedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
    toast.success('Property saved to favorites')
  }

  const handleShare = (property: any) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href + `/property/${property.id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.href + `/property/${property.id}`)
      toast.success('Link copied to clipboard')
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || property.propertyType === selectedType
    const matchesListingType = listingType === 'all' || property.type === listingType
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]

    return matchesSearch && matchesType && matchesListingType && matchesPrice
  })

  const formatPrice = (price: number, type: string, unit?: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })

    if (type === 'rent') {
      return `${formatter.format(price)}/${unit || 'month'}`
    }
    return formatter.format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">PMS Marketplace</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-purple-600">Browse</Link>
              <Link href="/sell" className="text-gray-500 hover:text-purple-600">Sell Property</Link>
              <Link href="/agents" className="text-gray-500 hover:text-purple-600">Find Agents</Link>
              <Link href="/insights" className="text-gray-500 hover:text-purple-600">Market Insights</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/favorites" className="text-gray-500 hover:text-purple-600">
                <HeartIcon className="h-6 w-6" />
              </Link>
              <Link href="/auth/signin" className="text-gray-500 hover:text-purple-600">
                Sign In
              </Link>
              <Link href="/list-property" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                List Property
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location or property name..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Listing Type Filter */}
            <div className="flex bg-gray-100 rounded-md p-1">
              {['all', 'sale', 'rent'].map((type) => (
                <button
                  key={type}
                  onClick={() => setListingType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    listingType === type
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'sale' ? 'For Sale' : 'For Rent'}
                </button>
              ))}
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Property Type Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {propertyTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.name}
                </button>
              )
            })}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (EUR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={priceRange[0] || ''}
                      onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={priceRange[1] || ''}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 5000000])}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Any</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Most Recent</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProperties.length} Properties Found
          </h2>
          <span className="text-sm text-gray-500">
            Showing results for Cyprus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              {/* Property Image */}
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(property.price, property.type, property.priceUnit)}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                    property.type === 'sale'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    For {property.type === 'sale' ? 'Sale' : 'Rent'}
                  </span>
                </div>

                {/* Featured Badge */}
                {property.isFeatured && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleLike(property.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    {likedProperties.includes(property.id) ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleShare(property)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {property.title}
                  </h3>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{property.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {property.location}
                </p>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {property.description}
                </p>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="ml-1">Beds</span>
                  </div>
                  <div>
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="ml-1">Baths</span>
                  </div>
                  <div>
                    <span className="font-medium">{property.area}</span>
                    <span className="ml-1">m²</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {property.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {property.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{property.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Agent Info */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{property.agent}</span>
                  <Link
                    href={`/property/${property.id}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-md font-medium hover:bg-purple-700 transition duration-200">
            Load More Properties
          </button>
        </div>
      </section>
    </div>
  )
}