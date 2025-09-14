'use client'

import { useState } from 'react'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Mock data for staff tasks
const todayTasks = [
  {
    id: 1,
    type: 'housekeeping',
    title: 'Clean Room 205',
    description: 'Standard checkout cleaning',
    priority: 'high',
    estimated: '45 min',
    status: 'pending'
  },
  {
    id: 2,
    type: 'maintenance',
    title: 'Fix AC in Room 312',
    description: 'Guest reported AC not working',
    priority: 'urgent',
    estimated: '30 min',
    status: 'pending'
  },
  {
    id: 3,
    type: 'housekeeping',
    title: 'Restock Amenities Floor 2',
    description: 'Restock all amenities for floor 2',
    priority: 'medium',
    estimated: '20 min',
    status: 'in_progress'
  },
  {
    id: 4,
    type: 'maintenance',
    title: 'Check Pool Chemicals',
    description: 'Daily pool maintenance check',
    priority: 'medium',
    estimated: '15 min',
    status: 'completed'
  }
]

const quickActions = [
  { name: 'Clock In/Out', icon: ClockIcon, href: '/timesheet', color: 'bg-blue-500' },
  { name: 'Report Issue', icon: ExclamationTriangleIcon, href: '/issues', color: 'bg-red-500' },
  { name: 'Room Status', icon: HomeIcon, href: '/rooms', color: 'bg-green-500' },
  { name: 'Messages', icon: ChatBubbleLeftRightIcon, href: '/messages', color: 'bg-purple-500' }
]

export default function StaffDashboard() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null)

  const handleTaskAction = (taskId: number, action: 'start' | 'complete' | 'report') => {
    const task = todayTasks.find(t => t.id === taskId)
    if (!task) return

    switch (action) {
      case 'start':
        toast.success(`Started task: ${task.title}`)
        break
      case 'complete':
        toast.success(`Completed task: ${task.title}`)
        break
      case 'report':
        toast.info(`Reported issue for: ${task.title}`)
        break
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'housekeeping': return ClipboardDocumentListIcon
      case 'maintenance': return WrenchScrewdriverIcon
      default: return ClipboardDocumentListIcon
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Staff Portal</h1>
              <p className="text-sm text-gray-500">Welcome back, Maria</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2">
                <BellIcon className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </span>
              </button>
              <Link href="/profile">
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                href={action.href}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${action.color} p-3 rounded-full mb-2`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Today's Tasks */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
          <span className="text-sm text-gray-500">
            {todayTasks.filter(t => t.status === 'completed').length} of {todayTasks.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {todayTasks.map((task) => {
            const TypeIcon = getTypeIcon(task.type)
            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg border p-4 ${
                  selectedTask === task.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${task.type === 'housekeeping' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      <TypeIcon className={`h-5 w-5 ${task.type === 'housekeeping' ? 'text-blue-600' : 'text-orange-600'}`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {task.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">~{task.estimated}</span>
                      </div>

                      {task.status === 'completed' && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    {/* Task Actions */}
                    {selectedTask === task.id && task.status !== 'completed' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex space-x-2">
                          {task.status === 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTaskAction(task.id, 'start')
                              }}
                              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                              Start Task
                            </button>
                          )}
                          {task.status === 'in_progress' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTaskAction(task.id, 'complete')
                              }}
                              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTaskAction(task.id, 'report')
                            }}
                            className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-700"
                          >
                            Report Issue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4">
          <Link href="/" className="flex flex-col items-center py-3 text-blue-600">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/tasks" className="flex flex-col items-center py-3 text-gray-500">
            <ClipboardDocumentListIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Tasks</span>
          </Link>
          <Link href="/rooms" className="flex flex-col items-center py-3 text-gray-500">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Rooms</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-3 text-gray-500">
            <UserCircleIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  )
}