// Base types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  propertyName?: string;
  propertyType?: string;
  createdAt?: string;
  lastLogin?: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'MANAGER'
  | 'FRONT_DESK'
  | 'HOUSEKEEPING'
  | 'MAINTENANCE'
  | 'ACCOUNTANT'
  | 'GUEST';

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  currency: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: Date;
  passportNumber?: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'out-of-order';
  rate: number;
  capacity: number;
  amenities: string[];
}

export interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'apartment' | 'villa' | 'hostel';
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string;
  starRating?: number;
}

export interface Staff {
  id: string;
  userId: string;
  employeeId: string;
  department: string;
  position: string;
  hireDate: Date;
  salary?: number;
  propertyId: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  redirectTo?: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  propertyName?: string;
  propertyType?: string;
}

// Service Request types
export type ServiceRequestType =
  | 'room_service'
  | 'housekeeping'
  | 'concierge'
  | 'maintenance'
  | 'transportation'
  | 'spa_wellness'
  | 'restaurant'
  | 'activity_booking'
  | 'special_request'
  | 'other';

export type ServiceRequestStatus =
  | 'requested'
  | 'acknowledged'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  id: string;
  type: ServiceRequestType;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  guestId: string;
  propertyId?: string;
  roomId?: string;
  assignedToId?: string;
  requestedAt: string;
  completedAt?: string;
  estimatedCost?: number;
  actualCost?: number;
}

// Task types
export type TaskType =
  | 'housekeeping'
  | 'maintenance'
  | 'front_desk'
  | 'admin'
  | 'other';

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId?: string;
  createdById: string;
  propertyId?: string;
  roomId?: string;
  dueDate?: Date;
  scheduledFor?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // in minutes
}