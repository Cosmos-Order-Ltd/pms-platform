'use client';

import Link from "next/link"
import { useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast';

// Note: Metadata export removed due to 'use client' directive
// Title and meta tags will be handled by the layout or head.tsx if needed

export default function NewReservationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    checkIn: '',
    checkOut: '',
    adults: '2',
    children: '0',
    roomType: '',
    selectedRoom: '',
    specialRequests: '',
    preferences: [] as string[]
  });

  const [nights, setNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate nights when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
  }, [formData.checkIn, formData.checkOut]);

  // Calculate total amount
  useEffect(() => {
    if (nights > 0 && formData.roomType) {
      const roomRates = {
        'STANDARD': 80,
        'DELUXE': 120,
        'SUITE': 200,
        'FAMILY': 150
      };

      const baseRate = roomRates[formData.roomType as keyof typeof roomRates] || 0;
      const roomTotal = baseRate * nights;
      const tourismTax = 1.50 * parseInt(formData.adults) * nights;
      const vat = (roomTotal + tourismTax) * 0.19;
      const total = roomTotal + tourismTax + vat;

      setTotalAmount(total);
    }
  }, [nights, formData.roomType, formData.adults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const _handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, value]
        : prev.preferences.filter(pref => pref !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json() as { success?: boolean; message?: string; error?: string; reservation?: unknown };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reservation');
      }

      toast.success(data.message || 'Reservation created successfully!');

      // Optionally reset form or redirect
      // You could redirect to a confirmation page or reset the form here

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const _availableRooms = [
    { number: "101", type: "STANDARD", status: "available", rate: 80 },
    { number: "205", type: "DELUXE", status: "available", rate: 120 },
    { number: "310", type: "SUITE", status: "occupied", rate: 200 },
    { number: "207", type: "FAMILY", status: "available", rate: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Reservation</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Create a new guest reservation</p>
            </div>
            <Link href="/reservations" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium">
              ← Back to Reservations
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Guest Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Guest Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="guest@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+357 99 123456"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nationality
                  </label>
                  <select
                    id="nationality"
                    name="nationality"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select nationality</option>
                    <option value="CY">Cyprus</option>
                    <option value="GR">Greece</option>
                    <option value="TR">Turkey</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="RU">Russia</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reservation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="nights" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nights
                  </label>
                  <input
                    type="number"
                    id="nights"
                    name="nights"
                    value={nights || ''}
                    min="1"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adults *
                  </label>
                  <select
                    id="adults"
                    name="adults"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Children
                  </label>
                  <select
                    id="children"
                    name="children"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="0">No children</option>
                    <option value="1">1 Child</option>
                    <option value="2">2 Children</option>
                    <option value="3">3 Children</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room Type *
                  </label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select room type</option>
                    <option value="STANDARD">Standard Room - €80/night</option>
                    <option value="DELUXE">Deluxe Room - €120/night</option>
                    <option value="SUITE">Suite - €200/night</option>
                    <option value="FAMILY">Family Room - €150/night</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room Selection */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { number: "101", type: "Standard", status: "available", rate: 80 },
                  { number: "205", type: "Deluxe", status: "available", rate: 120 },
                  { number: "310", type: "Suite", status: "occupied", rate: 200 },
                  { number: "207", type: "Family", status: "available", rate: 150 },
                ].map((room) => (
                  <div
                    key={room.number}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      room.status === "available"
                        ? "border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Room {room.number}</span>
                      <input
                        type="radio"
                        name="selectedRoom"
                        value={room.number}
                        disabled={room.status !== "available"}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{room.type}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">€{room.rate}/night</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                        room.status === "available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {room.status === "available" ? "Available" : "Occupied"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Special Requests</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Any special requests or notes for this reservation..."
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences"
                      value="early-checkin"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Early Check-in</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences"
                      value="late-checkout"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Late Check-out</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences"
                      value="airport-transfer"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Airport Transfer</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences"
                      value="ground-floor"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ground Floor</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing Summary</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-2">
                  {nights > 0 && formData.roomType && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Room Rate ({nights} nights × €{formData.roomType === 'STANDARD' ? 80 : formData.roomType === 'DELUXE' ? 120 : formData.roomType === 'SUITE' ? 200 : 150})
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          €{((formData.roomType === 'STANDARD' ? 80 : formData.roomType === 'DELUXE' ? 120 : formData.roomType === 'SUITE' ? 200 : 150) * nights).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tourism Tax (€1.50 per person/night)</span>
                        <span className="text-gray-900 dark:text-white">€{(1.50 * parseInt(formData.adults) * nights).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">VAT (19%)</span>
                        <span className="text-gray-900 dark:text-white">€{(totalAmount * 0.19).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900 dark:text-white">Total Amount</span>
                          <span className="text-gray-900 dark:text-white">€{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {(!nights || !formData.roomType) && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Select dates and room type to see pricing
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Reservation'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}