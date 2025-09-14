'use client'

import { useState } from 'react'

interface Message {
  id: string
  guestName: string
  roomNumber: string
  type: 'SMS' | 'WhatsApp' | 'In-App' | 'Email'
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'pending'
  isFromGuest: boolean
  staffMember?: string
}

interface MessageTemplate {
  id: string
  name: string
  category: string
  subject?: string
  content: string
  language: string
  isAutomated: boolean
}

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'automation' | 'analytics'>('messages')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  // Mock data
  const conversations = [
    {
      id: 'conv-1',
      guestName: 'John Smith',
      roomNumber: '205',
      lastMessage: 'Thank you for the extra towels!',
      lastMessageTime: '2 mins ago',
      unreadCount: 0,
      status: 'online'
    },
    {
      id: 'conv-2',
      guestName: 'Maria Rodriguez',
      roomNumber: '312',
      lastMessage: 'Can you recommend a good restaurant?',
      lastMessageTime: '5 mins ago',
      unreadCount: 1,
      status: 'offline'
    },
    {
      id: 'conv-3',
      guestName: 'David Chen',
      roomNumber: '408',
      lastMessage: 'Room service was excellent!',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      status: 'online'
    }
  ]

  const messages: Message[] = [
    {
      id: 'msg-1',
      guestName: 'John Smith',
      roomNumber: '205',
      type: 'WhatsApp',
      content: 'Hi, could I get some extra towels please?',
      timestamp: '2025-09-14 10:30',
      status: 'read',
      isFromGuest: true
    },
    {
      id: 'msg-2',
      guestName: 'John Smith',
      roomNumber: '205',
      type: 'WhatsApp',
      content: 'Of course! I\'ll send housekeeping to your room right away.',
      timestamp: '2025-09-14 10:32',
      status: 'delivered',
      isFromGuest: false,
      staffMember: 'Sarah Johnson'
    },
    {
      id: 'msg-3',
      guestName: 'John Smith',
      roomNumber: '205',
      type: 'WhatsApp',
      content: 'Thank you for the extra towels!',
      timestamp: '2025-09-14 11:15',
      status: 'read',
      isFromGuest: true
    }
  ]

  const templates: MessageTemplate[] = [
    {
      id: 'tpl-1',
      name: 'Welcome Message',
      category: 'Pre-Arrival',
      subject: 'Welcome to Cyprus Luxury Resort',
      content: 'Dear {guest_name}, welcome to Cyprus Luxury Resort! Your room {room_number} is ready. Check-in starts at 3:00 PM.',
      language: 'en',
      isAutomated: true
    },
    {
      id: 'tpl-2',
      name: 'Thank You - Post Stay',
      category: 'Post-Departure',
      subject: 'Thank you for staying with us',
      content: 'Dear {guest_name}, thank you for choosing Cyprus Luxury Resort. We hope you enjoyed your stay!',
      language: 'en',
      isAutomated: true
    },
    {
      id: 'tpl-3',
      name: 'Room Service Confirmation',
      category: 'Service',
      content: 'Your room service order has been confirmed and will be delivered to room {room_number} in approximately {delivery_time} minutes.',
      language: 'en',
      isAutomated: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-600'
      case 'delivered': return 'text-green-600'
      case 'read': return 'text-green-700'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'WhatsApp': return '💬'
      case 'SMS': return '📱'
      case 'Email': return '📧'
      case 'In-App': return '🔔'
      default: return '💬'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Communications Hub</h1>
          <p className="text-gray-600">Manage guest communications across all channels</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'messages', label: 'Messages', icon: '💬' },
              { id: 'templates', label: 'Templates', icon: '📝' },
              { id: 'automation', label: 'Automation', icon: '⚙️' },
              { id: 'analytics', label: 'Analytics', icon: '📊' }
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
        {activeTab === 'messages' && (
          <div className="grid h-[calc(100vh-300px)] grid-cols-12 gap-6">
            {/* Conversations List */}
            <div className="col-span-4 rounded-lg bg-white shadow">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Conversations</h3>
                  <button className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                    New Chat
                  </button>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="divide-y overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 ${
                      selectedConversation === conv.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{conv.guestName}</p>
                          <span className="text-sm text-gray-500">Room {conv.roomNumber}</span>
                          <div className={`h-2 w-2 rounded-full ${
                            conv.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                        </div>
                        <p className="truncate text-sm text-gray-600">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-500">{conv.lastMessageTime}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-8 flex flex-col rounded-lg bg-white shadow">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">John Smith</h3>
                        <p className="text-sm text-gray-600">Room 205 • Online</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                          📞 Call
                        </button>
                        <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                          ℹ️ Info
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromGuest ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.isFromGuest ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.isFromGuest
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`mt-1 flex items-center space-x-1 text-xs ${
                            message.isFromGuest ? 'justify-start' : 'justify-end'
                          }`}>
                            <span className="text-gray-500">{message.timestamp}</span>
                            <span className={getTypeIcon(message.type)}></span>
                            {!message.isFromGuest && (
                              <span className={`font-medium ${getStatusColor(message.status)}`}>
                                {message.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                        <option>WhatsApp</option>
                        <option>SMS</option>
                        <option>Email</option>
                        <option>In-App</option>
                      </select>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // Handle send message
                            setNewMessage('')
                          }
                        }}
                      />
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p>Choose a guest conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Create Template
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {templates.map((template) => (
                <div key={template.id} className="rounded-lg bg-white p-6 shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        {template.isAutomated && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            ⚙️ Auto
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{template.category}</p>
                      {template.subject && (
                        <p className="mt-2 text-sm font-medium text-gray-900">Subject: {template.subject}</p>
                      )}
                      <p className="mt-2 text-sm text-gray-700">{template.content}</p>
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        <span>🌐 {template.language.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        ✏️
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Message Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Pre-Arrival Welcome</h4>
                    <p className="text-sm text-gray-600">Send welcome message 24 hours before check-in</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Check-in Reminder</h4>
                    <p className="text-sm text-gray-600">Remind guests about check-in procedure</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Post-Stay Thank You</h4>
                    <p className="text-sm text-gray-600">Send thank you message after checkout</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Messages</p>
                    <p className="text-2xl font-semibold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+12% from last week</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⚡</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                    <p className="text-2xl font-semibold text-gray-900">4m 32s</p>
                    <p className="text-sm text-green-600">-30s from yesterday</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">😊</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Satisfaction Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">94%</p>
                    <p className="text-sm text-green-600">+2% from last month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">🤖</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Automated Messages</p>
                    <p className="text-2xl font-semibold text-gray-900">65%</p>
                    <p className="text-sm text-blue-600">832 messages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}