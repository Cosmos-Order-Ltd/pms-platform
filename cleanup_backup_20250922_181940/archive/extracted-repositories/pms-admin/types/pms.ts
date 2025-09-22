export interface Reservation {
  id: string
  guestId: string
  roomId: string
  checkIn: Date
  checkOut: Date
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  totalAmount: number
  currency: string
}

export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  nationality?: string
  dateOfBirth?: Date
  passportNumber?: string
}

export interface Room {
  id: string
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance' | 'out-of-order'
  rate: number
  capacity: number
  amenities: string[]
}