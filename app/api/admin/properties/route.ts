import { NextRequest, NextResponse } from 'next/server'

// Mock properties data store
let properties = [
  {
    id: 'prop-001',
    name: 'Cyprus Grand Resort',
    type: 'resort',
    location: 'Limassol, Cyprus',
    rooms: 120,
    isActive: true,
    managedBy: 'Maria Constantinou',
    settings: {
      timezone: 'Europe/Nicosia',
      currency: 'EUR',
      language: 'en',
      checkInTime: '15:00',
      checkOutTime: '11:00'
    }
  },
  {
    id: 'prop-002',
    name: 'Mediterranean Palace',
    type: 'hotel',
    location: 'Paphos, Cyprus',
    rooms: 80,
    isActive: true,
    managedBy: 'Andreas Georgiou',
    settings: {
      timezone: 'Europe/Nicosia',
      currency: 'EUR',
      language: 'en',
      checkInTime: '14:00',
      checkOutTime: '12:00'
    }
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: properties
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, location, rooms, managedBy, settings = {} } = body

    const newProperty = {
      id: `prop-${Date.now()}`,
      name,
      type,
      location,
      rooms: parseInt(rooms),
      isActive: true,
      managedBy,
      settings: {
        timezone: 'Europe/Nicosia',
        currency: 'EUR',
        language: 'en',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        ...settings
      }
    }

    properties.push(newProperty)

    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      data: newProperty
    })

  } catch (error) {
    console.error('Property creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create property' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    const propertyIndex = properties.findIndex(prop => prop.id === id)
    if (propertyIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 }
      )
    }

    if (action === 'toggle-status') {
      properties[propertyIndex].isActive = !properties[propertyIndex].isActive
      return NextResponse.json({
        success: true,
        message: `Property ${properties[propertyIndex].isActive ? 'enabled' : 'disabled'} successfully`,
        data: properties[propertyIndex]
      })
    }

    // Update property data
    properties[propertyIndex] = { ...properties[propertyIndex], ...updateData }

    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      data: properties[propertyIndex]
    })

  } catch (error) {
    console.error('Property update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update property' },
      { status: 500 }
    )
  }
}