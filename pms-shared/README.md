# 📦 PMS Shared Library

Shared TypeScript library containing common types, utilities, constants, and validation schemas used across all PMS (Property Management System) microservices. Provides consistency and reduces code duplication across the platform.

## 🚀 Library Overview

**Package Name**: `@pms/shared`
**Type**: NPM Package / Shared Library
**Language**: TypeScript
**Target**: All PMS microservices and applications
**Distribution**: Private NPM registry or Git submodule

## 🏗️ Architecture

This library serves as the foundation for type consistency across the PMS platform:

```
┌─────────────────────────────────────────────────────────────┐
│                 @pms/shared Library                         │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│    Types    │ Validation  │ Utilities   │   Constants     │
│ Definitions │  Schemas    │ Functions   │  & Enums        │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│                 Used by All Services                       │
│  Backend Services    │    Frontend Apps    │ Infrastructure │
└─────────────────────────────────────────────────────────────┘
```

### Used by Services
- **Backend Services**: pms-core, pms-backend, api-gateway, monitoring
- **Frontend Apps**: pms-admin, pms-guest, pms-staff, pms-marketplace
- **Infrastructure**: Deployment scripts, testing utilities

## 📋 Features

### Type Definitions
- **Core Entities**: User, Property, Room, Booking, Guest, Staff
- **API Interfaces**: Request/Response types, error structures
- **Database Models**: Prisma-compatible type definitions
- **Authentication**: JWT payload, user roles, permissions
- **Configuration**: Environment variables, service configs

### Validation Schemas
- **Zod Schemas**: Runtime type validation for all entities
- **Form Validation**: Reusable form validation schemas
- **API Validation**: Request/response validation schemas
- **Business Rules**: Complex validation with custom rules

### Utility Functions
- **Date Utilities**: Booking date calculations, timezone handling
- **Currency Utilities**: Price formatting, currency conversion
- **Validation Utilities**: Email, phone, credit card validation
- **String Utilities**: Formatting, sanitization, slug generation
- **Array Utilities**: Sorting, filtering, grouping helpers

### Constants & Enums
- **Business Constants**: Room types, amenities, booking statuses
- **Configuration Constants**: Default values, limits, timeouts
- **Error Codes**: Standardized error codes across services
- **Status Enums**: Booking, payment, task status definitions

## 🛠️ Tech Stack

### Core Technologies
- **TypeScript**: Strict type definitions
- **Zod**: Runtime type validation
- **Date-fns**: Date manipulation utilities
- **Lodash**: Utility functions (selective imports)

### Build Tools
- **TypeScript Compiler**: Type checking and compilation
- **Rollup/Webpack**: Module bundling
- **Jest**: Unit testing framework
- **ESLint + Prettier**: Code quality and formatting

### Distribution
- **NPM**: Package distribution
- **GitHub Packages**: Private registry option
- **Semantic Versioning**: Automated versioning
- **TypeScript Declarations**: Full type support

## 📁 Project Structure

```
pms-shared/
├── src/
│   ├── types/           # TypeScript type definitions
│   │   ├── core/       # Core entity types
│   │   │   ├── user.ts
│   │   │   ├── property.ts
│   │   │   ├── booking.ts
│   │   │   ├── room.ts
│   │   │   └── guest.ts
│   │   ├── api/        # API-related types
│   │   │   ├── requests.ts
│   │   │   ├── responses.ts
│   │   │   └── errors.ts
│   │   ├── auth/       # Authentication types
│   │   │   ├── jwt.ts
│   │   │   ├── roles.ts
│   │   │   └── permissions.ts
│   │   └── index.ts    # Type exports
│   ├── schemas/        # Zod validation schemas
│   │   ├── booking.ts
│   │   ├── user.ts
│   │   ├── property.ts
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   ├── validation.ts
│   │   ├── format.ts
│   │   └── index.ts
│   ├── constants/      # Constants and enums
│   │   ├── booking.ts
│   │   ├── property.ts
│   │   ├── errors.ts
│   │   └── index.ts
│   └── index.ts        # Main export file
├── dist/               # Compiled JavaScript
├── types/              # TypeScript declarations
├── tests/              # Unit tests
├── docs/               # API documentation
└── package.json
```

## 🏃‍♂️ Quick Start

### Installation

```bash
# Install from NPM (if published)
npm install @pms/shared

# Or install from GitHub
npm install git+https://github.com/charilaouc/pms-shared.git

# For development
git clone https://github.com/charilaouc/pms-shared.git
cd pms-shared
npm install
```

### Basic Usage

```typescript
// Import types
import { User, Booking, Property } from '@pms/shared/types';

// Import validation schemas
import { bookingSchema, userSchema } from '@pms/shared/schemas';

// Import utilities
import { formatCurrency, calculateNights } from '@pms/shared/utils';

// Import constants
import { BOOKING_STATUS, ROOM_TYPES } from '@pms/shared/constants';

// Example usage
const booking: Booking = {
  id: 'bk_123',
  guestId: 'guest_456',
  roomId: 'room_789',
  checkIn: new Date('2024-06-01'),
  checkOut: new Date('2024-06-03'),
  status: BOOKING_STATUS.CONFIRMED,
  totalAmount: 450.00,
  currency: 'USD'
};

// Validate booking
const validationResult = bookingSchema.safeParse(booking);
if (validationResult.success) {
  console.log('Booking is valid');
} else {
  console.error('Validation errors:', validationResult.error.issues);
}

// Use utilities
const nights = calculateNights(booking.checkIn, booking.checkOut);
const formattedPrice = formatCurrency(booking.totalAmount, booking.currency);
```

## 🏗️ Core Types

### User & Authentication Types
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  profile?: UserProfile;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PROPERTY_MANAGER = 'property_manager',
  FRONT_DESK = 'front_desk',
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
  GUEST = 'guest'
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}
```

### Property & Room Types
```typescript
export interface Property {
  id: string;
  name: string;
  description: string;
  address: Address;
  coordinates: Coordinates;
  amenities: Amenity[];
  images: PropertyImage[];
  policies: PropertyPolicies;
  rating: number;
  reviewCount: number;
  rooms: Room[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  propertyId: string;
  number: string;
  type: RoomType;
  capacity: number;
  basePrice: number;
  currency: string;
  amenities: RoomAmenity[];
  images: RoomImage[];
  isAvailable: boolean;
  status: RoomStatus;
}

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  TWIN = 'twin',
  SUITE = 'suite',
  DELUXE = 'deluxe',
  PRESIDENTIAL = 'presidential'
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  OUT_OF_ORDER = 'out_of_order',
  MAINTENANCE = 'maintenance',
  HOUSEKEEPING = 'housekeeping'
}
```

### Booking Types
```typescript
export interface Booking {
  id: string;
  propertyId: string;
  roomId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}
```

### Task & Staff Types
```typescript
export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  roomId?: string;
  propertyId: string;
  estimatedDuration: number; // minutes
  dueDate: Date;
  completedAt?: Date;
  notes?: string;
  photos?: TaskPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskType {
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  DEEP_CLEAN = 'deep_clean',
  GUEST_REQUEST = 'guest_request'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}
```

## ✅ Validation Schemas

### Zod Schema Examples
```typescript
import { z } from 'zod';
import { BookingStatus, PaymentStatus } from '../types';

export const bookingSchema = z.object({
  id: z.string().min(1),
  propertyId: z.string().uuid(),
  roomId: z.string().uuid(),
  guestId: z.string().uuid(),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.object({
    adults: z.number().min(1).max(10),
    children: z.number().min(0).max(6)
  }),
  status: z.nativeEnum(BookingStatus),
  totalAmount: z.number().positive(),
  currency: z.string().length(3),
  paymentStatus: z.nativeEnum(PaymentStatus),
  specialRequests: z.string().optional()
}).refine(
  (data) => data.checkOut > data.checkIn,
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"]
  }
);

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  dateOfBirth: z.date().optional()
}).refine(
  (data) => {
    // Password strength validation
    const hasUppercase = /[A-Z]/.test(data.password);
    const hasLowercase = /[a-z]/.test(data.password);
    const hasNumbers = /\d/.test(data.password);
    return hasUppercase && hasLowercase && hasNumbers;
  },
  {
    message: "Password must contain uppercase, lowercase, and numbers",
    path: ["password"]
  }
);

export const propertySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().min(1),
    display: z.string().min(1)
  }),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }),
  amenities: z.array(z.string()),
  policies: z.object({
    checkInTime: z.string().regex(/^\d{2}:\d{2}$/),
    checkOutTime: z.string().regex(/^\d{2}:\d{2}$/),
    cancellationPolicy: z.string(),
    petPolicy: z.string().optional(),
    smokingPolicy: z.string()
  })
});
```

## 🛠️ Utility Functions

### Date Utilities
```typescript
import { addDays, differenceInDays, format, parseISO } from 'date-fns';

export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  return Math.max(0, differenceInDays(checkOut, checkIn));
};

export const calculateTotalPrice = (
  basePrice: number,
  nights: number,
  taxes = 0,
  fees = 0
): number => {
  const subtotal = basePrice * nights;
  return subtotal + taxes + fees;
};

export const formatBookingDate = (date: Date, locale = 'en-US'): string => {
  return format(date, 'MMM dd, yyyy', { locale: getLocale(locale) });
};

export const isValidCheckInDate = (
  date: Date,
  minAdvanceHours = 24
): boolean => {
  const minDate = addDays(new Date(), minAdvanceHours / 24);
  return date >= minDate;
};

export const getSeasonMultiplier = (
  date: Date,
  seasonalRates: SeasonalRate[]
): number => {
  const season = seasonalRates.find(rate => {
    const startDate = parseISO(rate.startDate);
    const endDate = parseISO(rate.endDate);
    return date >= startDate && date <= endDate;
  });

  return season?.multiplier || 1.0;
};
```

### Currency Utilities
```typescript
export const formatCurrency = (
  amount: number,
  currency: string,
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  if (fromCurrency === toCurrency) return amount;

  // Implementation would call currency conversion API
  const rate = await getCurrencyRate(fromCurrency, toCurrency);
  return Math.round((amount * rate) * 100) / 100;
};

export const parseCurrencyAmount = (
  currencyString: string,
  currency: string
): number => {
  // Remove currency symbol and convert to number
  const cleanString = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleanString);
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'A$'
  };

  return symbols[currency.toUpperCase()] || currency;
};
```

### Validation Utilities
```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateCreditCard = (cardNumber: string): boolean => {
  // Luhn algorithm implementation
  const number = cardNumber.replace(/\D/g, '');

  if (number.length < 13 || number.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>&"']/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entities[match] || match;
    });
};
```

## 📊 Constants & Enums

### Business Constants
```typescript
export const BOOKING_CONSTANTS = {
  MIN_ADVANCE_HOURS: 24,
  MAX_ADVANCE_DAYS: 365,
  DEFAULT_CHECK_IN_TIME: '15:00',
  DEFAULT_CHECK_OUT_TIME: '11:00',
  MAX_GUESTS_PER_ROOM: 10,
  MAX_NIGHTS_PER_BOOKING: 30
} as const;

export const PRICING_CONSTANTS = {
  DEFAULT_CURRENCY: 'USD',
  TAX_RATE: 0.12,
  SERVICE_FEE_RATE: 0.05,
  CANCELLATION_FEE_RATE: 0.25,
  MIN_BOOKING_AMOUNT: 50
} as const;

export const ROOM_AMENITIES = {
  BASIC: ['wifi', 'tv', 'ac', 'heating'],
  PREMIUM: ['minibar', 'safe', 'balcony', 'city_view'],
  LUXURY: ['jacuzzi', 'fireplace', 'butler_service', 'champagne']
} as const;

export const PROPERTY_TYPES = {
  HOTEL: 'hotel',
  MOTEL: 'motel',
  RESORT: 'resort',
  APARTMENT: 'apartment',
  VILLA: 'villa',
  HOSTEL: 'hostel',
  BED_AND_BREAKFAST: 'bed_and_breakfast'
} as const;
```

### Error Constants
```typescript
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_003',

  // Booking errors
  BOOKING_ROOM_UNAVAILABLE: 'BOOK_001',
  BOOKING_INVALID_DATES: 'BOOK_002',
  BOOKING_CAPACITY_EXCEEDED: 'BOOK_003',

  // Payment errors
  PAYMENT_DECLINED: 'PAY_001',
  PAYMENT_INSUFFICIENT_FUNDS: 'PAY_002',
  PAYMENT_INVALID_CARD: 'PAY_003',

  // General errors
  VALIDATION_ERROR: 'VAL_001',
  RESOURCE_NOT_FOUND: 'RES_001',
  INTERNAL_SERVER_ERROR: 'SRV_001'
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.BOOKING_ROOM_UNAVAILABLE]: 'Selected room is no longer available',
  [ERROR_CODES.BOOKING_INVALID_DATES]: 'Check-out date must be after check-in date',
  [ERROR_CODES.PAYMENT_DECLINED]: 'Payment was declined. Please try another card.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again'
} as const;
```

## 🧪 Testing

### Test Examples
```typescript
// tests/utils/currency.test.ts
import { formatCurrency, convertCurrency, validateCreditCard } from '../src/utils/currency';

describe('Currency Utilities', () => {
  test('formats currency correctly', () => {
    expect(formatCurrency(123.45, 'USD')).toBe('$123.45');
    expect(formatCurrency(123.45, 'EUR', 'de-DE')).toBe('123,45 €');
  });

  test('validates credit card numbers', () => {
    expect(validateCreditCard('4242424242424242')).toBe(true); // Valid Visa test card
    expect(validateCreditCard('1234567890123456')).toBe(false); // Invalid
  });
});

// tests/schemas/booking.test.ts
import { bookingSchema } from '../src/schemas/booking';
import { BookingStatus, PaymentStatus } from '../src/types';

describe('Booking Schema', () => {
  test('validates correct booking data', () => {
    const validBooking = {
      id: 'bk_123',
      propertyId: '550e8400-e29b-41d4-a716-446655440000',
      roomId: '550e8400-e29b-41d4-a716-446655440001',
      guestId: '550e8400-e29b-41d4-a716-446655440002',
      checkIn: new Date('2024-06-01'),
      checkOut: new Date('2024-06-03'),
      guests: { adults: 2, children: 0 },
      status: BookingStatus.CONFIRMED,
      totalAmount: 450.00,
      currency: 'USD',
      paymentStatus: PaymentStatus.PAID
    };

    const result = bookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  test('rejects invalid dates', () => {
    const invalidBooking = {
      // ... other valid fields
      checkIn: new Date('2024-06-03'),
      checkOut: new Date('2024-06-01'), // Before check-in
    };

    const result = bookingSchema.safeParse(invalidBooking);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('checkOut');
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- booking.test.ts
```

## 📦 Building & Distribution

### Build Commands
```bash
# Clean build directory
npm run clean

# Build TypeScript to JavaScript
npm run build

# Build with watch mode
npm run build:watch

# Generate type declarations
npm run build:types

# Build for production
npm run build:prod
```

### Package Publishing
```bash
# Build and test before publishing
npm run prepublishOnly

# Publish to NPM registry
npm publish

# Publish beta version
npm publish --tag beta

# Update version (follows semantic versioning)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 🤖 Claude AI Development

### Key Development Areas:

1. **Type Definitions**:
   - `src/types/` - Core entity type definitions
   - Add new types as business requirements evolve
   - Maintain backward compatibility

2. **Validation Schemas**:
   - `src/schemas/` - Zod validation schemas
   - Keep schemas in sync with types
   - Add business rule validation

3. **Utility Functions**:
   - `src/utils/` - Common utility functions
   - Add reusable business logic
   - Maintain performance and reliability

4. **Constants Management**:
   - `src/constants/` - Business constants and enums
   - Centralize configuration values
   - Maintain consistency across services

### Development Workflow:

1. **Adding New Types**:
   ```typescript
   // 1. Define the type
   export interface NewEntity {
     id: string;
     name: string;
     // ... other properties
   }

   // 2. Create validation schema
   export const newEntitySchema = z.object({
     id: z.string().uuid(),
     name: z.string().min(1).max(100),
     // ... other validations
   });

   // 3. Add to exports
   export * from './types/newEntity';
   export * from './schemas/newEntity';
   ```

2. **Testing Changes**:
   ```bash
   # Test in isolation
   npm test

   # Test in dependent services
   cd ../pms-backend
   npm install @pms/shared@latest
   npm test
   ```

3. **Releasing Updates**:
   ```bash
   # Version bump and publish
   npm version patch
   npm run build
   npm publish

   # Update all dependent services
   ./update-dependencies.sh
   ```

## 🔗 Integration Guide

### Using in Backend Services
```typescript
// package.json
{
  "dependencies": {
    "@pms/shared": "^1.0.0"
  }
}

// In your service code
import { User, bookingSchema, formatCurrency } from '@pms/shared';

// Express route with validation
app.post('/bookings', (req, res) => {
  const validation = bookingSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.issues
    });
  }

  // Process valid booking data
  const booking = validation.data;
  // ...
});
```

### Using in Frontend Applications
```typescript
// Next.js component
import { Booking, formatCurrency, BOOKING_STATUS } from '@pms/shared';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const formattedPrice = formatCurrency(booking.totalAmount, booking.currency);
  const isConfirmed = booking.status === BOOKING_STATUS.CONFIRMED;

  return (
    <div className="booking-card">
      <h3>Booking #{booking.id}</h3>
      <p>Price: {formattedPrice}</p>
      <span className={`status ${booking.status}`}>
        {booking.status}
      </span>
    </div>
  );
};
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/charilaouc/pms-shared/issues)
- **Documentation**: [PMS Docs](https://github.com/charilaouc/pms-docs)
- **NPM Package**: `@pms/shared`
- **Type Documentation**: Auto-generated from TSDoc comments

---

**PMS Shared Library** 📦 | Common types, utilities, and validation for PMS platform