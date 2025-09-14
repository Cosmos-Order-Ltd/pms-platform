"use client"

import { useState } from "react"
import { Metadata } from "next"

interface StaffMember {
  id: string
  employeeId: string
  name: string
  department: 'front_desk' | 'housekeeping' | 'maintenance' | 'management' | 'security' | 'food_beverage'
  position: string
  phone: string
  email: string
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave'
  shift: 'morning' | 'afternoon' | 'evening' | 'night'
  avatar?: string
}

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  department: string
  staffCount: number
  maxCapacity: number
}

interface Schedule {
  date: string
  staffId: string
  shiftId: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'absent' | 'late'
  clockIn?: string
  clockOut?: string
  notes?: string
}

const mockStaff: StaffMember[] = [
  {
    id: "STF-001",
    employeeId: "EMP-2023-001",
    name: "Maria Ioannou",
    department: "housekeeping",
    position: "Head Housekeeper",
    phone: "+357 99 123456",
    email: "maria.i@cypruspms.com",
    hireDate: "2023-03-15",
    status: "active",
    shift: "morning"
  },
  {
    id: "STF-002",
    employeeId: "EMP-2023-002",
    name: "Andreas Michaelidis",
    department: "maintenance",
    position: "Senior Technician",
    phone: "+357 99 234567",
    email: "andreas.m@cypruspms.com",
    hireDate: "2023-01-20",
    status: "active",
    shift: "morning"
  },
  {
    id: "STF-003",
    employeeId: "EMP-2023-003",
    name: "Elena Constantinou",
    department: "front_desk",
    position: "Front Desk Manager",
    phone: "+357 99 345678",
    email: "elena.c@cypruspms.com",
    hireDate: "2022-11-10",
    status: "active",
    shift: "afternoon"
  },
  {
    id: "STF-004",
    employeeId: "EMP-2024-001",
    name: "Costas Dimitriou",
    department: "maintenance",
    position: "Electrician",
    phone: "+357 99 456789",
    email: "costas.d@cypruspms.com",
    hireDate: "2024-01-08",
    status: "active",
    shift: "morning"
  },
  {
    id: "STF-005",
    employeeId: "EMP-2023-005",
    name: "Sophia Georgiou",
    department: "housekeeping",
    position: "Room Attendant",
    phone: "+357 99 567890",
    email: "sophia.g@cypruspms.com",
    hireDate: "2023-06-01",
    status: "on_leave",
    shift: "afternoon"
  }
]

const mockShifts: Shift[] = [
  {
    id: "SHF-001",
    name: "Morning Shift",
    startTime: "07:00",
    endTime: "15:00",
    department: "all",
    staffCount: 8,
    maxCapacity: 12
  },
  {
    id: "SHF-002",
    name: "Afternoon Shift",
    startTime: "15:00",
    endTime: "23:00",
    department: "all",
    staffCount: 6,
    maxCapacity: 10
  },
  {
    id: "SHF-003",
    name: "Night Shift",
    startTime: "23:00",
    endTime: "07:00",
    department: "security",
    staffCount: 2,
    maxCapacity: 3
  }
]

export default function StaffPage() {
  const [selectedView, setSelectedView] = useState<'directory' | 'schedule' | 'attendance'>('directory')
  const [selectedWeek, setSelectedWeek] = useState(new Date())

  const getDepartmentIcon = (department: StaffMember['department']) => {
    switch (department) {
      case 'front_desk':
        return '🏨'
      case 'housekeeping':
        return '🧹'
      case 'maintenance':
        return '🔧'
      case 'management':
        return '👔'
      case 'security':
        return '🛡️'
      case 'food_beverage':
        return '🍽️'
      default:
        return '👤'
    }
  }

  const getDepartmentColor = (department: StaffMember['department']) => {
    switch (department) {
      case 'front_desk':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'housekeeping':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'management':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'food_beverage':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // Generate week dates
  const getWeekDates = (startDate: Date) => {
    const dates = []
    const start = new Date(startDate)
    start.setDate(start.getDate() - start.getDay() + 1) // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(selectedWeek)

  const activeStaff = mockStaff.filter(s => s.status === 'active').length
  const onLeaveStaff = mockStaff.filter(s => s.status === 'on_leave').length
  const totalDepartments = new Set(mockStaff.map(s => s.department)).size

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage staff schedules and workforce</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('directory')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === 'directory'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Directory
                </button>
                <button
                  onClick={() => setSelectedView('schedule')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === 'schedule'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setSelectedView('attendance')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === 'attendance'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Attendance
                </button>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                Add Staff Member
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
                <span className="text-blue-600 dark:text-blue-400 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{mockStaff.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeStaff}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">🏖️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Leave</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{onLeaveStaff}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900">
                <span className="text-purple-600 dark:text-purple-400 text-xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalDepartments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Directory View */}
        {selectedView === 'directory' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Staff Directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Shift
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {staff.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {staff.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {staff.employeeId} • {staff.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getDepartmentIcon(staff.department)}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(staff.department)}`}>
                            {staff.department.replace('_', ' ').split(' ').map(word =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {staff.phone}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {staff.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {staff.shift.charAt(0).toUpperCase() + staff.shift.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                          {staff.status.replace('_', ' ').split(' ').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Schedule
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
          </div>
        )}

        {/* Schedule View */}
        {selectedView === 'schedule' && (
          <div className="space-y-6">
            {/* Week Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Schedule</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ← Previous Week
                  </button>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Next Week →
                  </button>
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700">
                        Staff
                      </th>
                      {weekDates.map((date) => (
                        <th key={date.toISOString()} className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="text-sm font-normal">{date.getDate()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockStaff.filter(s => s.status === 'active').map((staff) => (
                      <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-3 border-r border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getDepartmentIcon(staff.department)}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{staff.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{staff.department.replace('_', ' ')}</div>
                            </div>
                          </div>
                        </td>
                        {weekDates.map((date, index) => {
                          // Mock schedule data
                          const hasShift = Math.random() > 0.2
                          const shiftType = hasShift ? ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)] : null
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6

                          return (
                            <td key={index} className="px-2 py-3 text-center">
                              {hasShift ? (
                                <div className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                                  shiftType === 'morning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  shiftType === 'afternoon' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                }`}>
                                  {shiftType === 'morning' ? '7-15' :
                                   shiftType === 'afternoon' ? '15-23' : '23-7'}
                                </div>
                              ) : (
                                <div className={`px-2 py-1 text-xs text-gray-400 dark:text-gray-600 ${
                                  isWeekend ? 'italic' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                }`}>
                                  {isWeekend ? 'Off' : '—'}
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockShifts.map((shift) => (
                <div key={shift.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shift.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Staffed</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {shift.staffCount} / {shift.maxCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(shift.staffCount / shift.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance View */}
        {selectedView === 'attendance' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Attendance</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="space-y-4">
              {mockStaff.filter(s => s.status === 'active').map((staff) => {
                // Mock attendance data
                const clockedIn = Math.random() > 0.1
                const isLate = clockedIn && Math.random() > 0.7
                const clockInTime = clockedIn ? `${7 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null

                return (
                  <div key={staff.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{staff.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {staff.department.replace('_', ' ')} • {staff.shift} shift
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {clockedIn ? (
                        <>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              isLate ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                            }`}>
                              Clocked In
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {clockInTime} {isLate && '(Late)'}
                            </div>
                          </div>
                          <span className={`w-3 h-3 rounded-full ${
                            isLate ? 'bg-red-500' : 'bg-green-500'
                          }`} />
                        </>
                      ) : (
                        <>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-400 dark:text-gray-500">
                              Not Clocked In
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Expected: 7:00 AM
                            </div>
                          </div>
                          <span className="w-3 h-3 rounded-full bg-gray-400" />
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}