"use client"

import { useState } from "react"
import { Metadata } from "next"

// This would typically come from your actual email service
const demoEmailService = {
  async sendReservationConfirmation(reservation: any, guest: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`📧 Confirmation email sent to ${guest.email}`)
    return true
  },
  async sendCheckInReminder(reservation: any, guest: any) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`📧 Check-in reminder sent to ${guest.email}`)
    return true
  },
  async sendWelcomeEmail(guest: any) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`📧 Welcome email sent to ${guest.email}`)
    return true
  }
}

export default function EmailDemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailLogs, setEmailLogs] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('confirmation')

  const mockReservation = {
    id: "RSV-DEMO-001",
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    roomType: "DELUXE",
    roomNumber: "205",
    adults: 2,
    children: 0,
    totalAmount: 450.00,
    specialRequests: "Sea view room preferred, late check-in"
  }

  const mockGuest = {
    firstName: "Elena",
    lastName: "Papadakis",
    email: "elena.papadakis@email.com",
    phone: "+357 99 123456",
    nationality: "CY",
    isNewGuest: true
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEmailLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const sendTestEmail = async (template: string) => {
    setIsLoading(true)
    addLog(`Sending ${template} email...`)

    try {
      switch (template) {
        case 'confirmation':
          await demoEmailService.sendReservationConfirmation(mockReservation, mockGuest)
          addLog(`✅ Reservation confirmation email sent to ${mockGuest.email}`)
          break
        case 'reminder':
          await demoEmailService.sendCheckInReminder(mockReservation, mockGuest)
          addLog(`✅ Check-in reminder email sent to ${mockGuest.email}`)
          break
        case 'welcome':
          await demoEmailService.sendWelcomeEmail(mockGuest)
          addLog(`✅ Welcome email sent to ${mockGuest.email}`)
          break
      }
    } catch (error) {
      addLog(`❌ Failed to send ${template} email: ${error}`)
    }

    setIsLoading(false)
  }

  const triggerAutomation = async () => {
    setIsLoading(true)
    addLog('🤖 Starting automated email sequence...')

    // Simulate reservation creation workflow
    addLog('📝 New reservation created')
    await sendTestEmail('confirmation')

    await new Promise(resolve => setTimeout(resolve, 500))

    if (mockGuest.isNewGuest) {
      addLog('👋 New guest detected, sending welcome email')
      await sendTestEmail('welcome')
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    addLog('📅 Scheduling pre-arrival reminder for 24h before check-in')
    addLog('⏰ Pre-arrival reminder scheduled successfully')

    setIsLoading(false)
    addLog('✅ Email automation sequence completed!')
  }

  const clearLogs = () => {
    setEmailLogs([])
  }

  const emailTemplates = [
    { id: 'confirmation', name: 'Reservation Confirmation', icon: '📋' },
    { id: 'reminder', name: 'Check-in Reminder', icon: '⏰' },
    { id: 'welcome', name: 'Welcome Email', icon: '👋' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Automation Demo</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Test automated email system for Cyprus PMS</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={clearLogs}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Clear Logs
              </button>
              <button
                onClick={triggerAutomation}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium"
              >
                {isLoading ? '⏳ Running...' : '🤖 Run Automation'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demo Data */}
          <div className="space-y-6">
            {/* Mock Reservation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Demo Reservation</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Confirmation:</span>
                  <span className="text-gray-900 dark:text-white">{mockReservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                  <span className="text-gray-900 dark:text-white">{new Date(mockReservation.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Check-out:</span>
                  <span className="text-gray-900 dark:text-white">{new Date(mockReservation.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room:</span>
                  <span className="text-gray-900 dark:text-white">{mockReservation.roomType} - Room {mockReservation.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Guests:</span>
                  <span className="text-gray-900 dark:text-white">{mockReservation.adults} Adults, {mockReservation.children} Children</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="text-gray-900 dark:text-white">€{mockReservation.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Mock Guest */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👤 Demo Guest</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="text-gray-900 dark:text-white">{mockGuest.firstName} {mockGuest.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="text-gray-900 dark:text-white">{mockGuest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="text-gray-900 dark:text-white">{mockGuest.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nationality:</span>
                  <span className="text-gray-900 dark:text-white">🇨🇾 Cyprus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {mockGuest.isNewGuest ? '🆕 New Guest' : '🔄 Returning Guest'}
                  </span>
                </div>
              </div>
            </div>

            {/* Email Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📧 Email Templates</h2>
              <div className="space-y-3">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => sendTestEmail(template.id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{template.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Send Test</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email Logs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📝 Email Activity Log</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {emailLogs.length} events
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {emailLogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-600 text-4xl mb-2">📬</div>
                  <p className="text-gray-500 dark:text-gray-400">No email activity yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Send a test email or run automation to see logs</p>
                </div>
              ) : (
                emailLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm font-mono"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Email Features Overview */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🌟 Cyprus PMS Email Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-medium text-gray-900 dark:text-white">Instant Confirmations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automatic confirmation emails sent immediately upon booking
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-medium text-gray-900 dark:text-white">Smart Reminders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automated pre-arrival and check-out reminders
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🇨🇾</div>
              <h3 className="font-medium text-gray-900 dark:text-white">Multi-Language</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Emails in English, Greek, Turkish, and Russian
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track email delivery rates and guest engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}