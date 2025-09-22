// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.pms.com'
  : 'http://localhost:5000';

export const API_VERSION = 'v1';

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  FRONT_DESK: 'FRONT_DESK',
  HOUSEKEEPING: 'HOUSEKEEPING',
  MAINTENANCE: 'MAINTENANCE',
  ACCOUNTANT: 'ACCOUNTANT',
  GUEST: 'GUEST'
} as const;

// Reservation Status
export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked-in',
  CHECKED_OUT: 'checked-out',
  CANCELLED: 'cancelled'
} as const;

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  OUT_OF_ORDER: 'out-of-order'
} as const;

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue'
} as const;

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
  URGENT: 'urgent'
} as const;

// Property Types
export const PROPERTY_TYPES = {
  HOTEL: 'hotel',
  RESORT: 'resort',
  APARTMENT: 'apartment',
  VILLA: 'villa',
  HOSTEL: 'hostel'
} as const;

// Cyprus-specific constants
export const CYPRUS_CONFIG = {
  CURRENCY: 'EUR',
  TIMEZONE: 'Europe/Nicosia',
  VAT_RATE: 0.19, // 19% VAT
  TOURISM_TAX: 1.5, // €1.50 per person per night
  COUNTRY: 'Cyprus',
  DEFAULT_LANGUAGE: 'en'
} as const;