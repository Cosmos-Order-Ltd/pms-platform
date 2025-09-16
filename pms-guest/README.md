# 🏨 PMS Guest Portal

Guest-facing portal for the Property Management System (PMS) platform. Provides comprehensive booking interface, guest services, and self-service capabilities for hotel guests and customers.

## 🚀 Service Overview

**Port**: 3011
**Type**: Frontend Application (Next.js 15)
**Target Users**: Hotel guests, customers, travelers
**Authentication**: JWT-based guest authentication via pms-core

## 🏗️ Architecture

This is the primary guest-facing interface for the PMS platform:

```
┌─────────────────────────────────────────────────────────────┐
│                 PMS Guest Portal (3011)                     │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│   Property  │   Booking   │   Guest     │   Services      │
│   Search    │   System    │   Profile   │   & Support     │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│                API Communication                           │
│         API Gateway (8080) → Backend Services              │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Services
- **pms-core** (3000): Guest authentication and profile management
- **pms-backend** (5000): Booking data, property info, guest services
- **api-gateway** (8080): Unified API access point
- **pms-marketplace** (3013): Property discovery integration

## 📋 Features

### Core Guest Features
- **Property Search**: Advanced search with filters, maps, availability
- **Room Booking**: Complete booking flow with real-time availability
- **Guest Registration**: Account creation with email verification
- **Profile Management**: Personal info, preferences, booking history
- **Check-in/Check-out**: Digital check-in and express checkout
- **Payment Processing**: Secure payment with multiple options

### Guest Services
- **Room Service**: Order food, amenities, housekeeping
- **Concierge Services**: Local recommendations, reservations, support
- **Maintenance Requests**: Report issues, track resolution status
- **Guest Communications**: Direct messaging with front desk
- **Special Requests**: Dietary requirements, accessibility needs
- **Loyalty Program**: Points tracking, rewards, member benefits

### Mobile-First Features
- **Responsive Design**: Optimized for mobile, tablet, desktop
- **Offline Capability**: Basic functionality without internet
- **Push Notifications**: Booking confirmations, check-in reminders
- **Location Services**: Property directions, nearby amenities
- **QR Code Integration**: Quick access to services and info
- **Mobile Wallet**: Save payment methods, digital receipts

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Strict type checking for reliability
- **Tailwind CSS v4**: Mobile-first responsive design
- **Radix UI**: Accessible, unstyled component library
- **Framer Motion**: Smooth animations and micro-interactions

### Guest Experience Libraries
- **React Hook Form**: Form handling with validation
- **React Query**: Server state management and caching
- **Zustand**: Lightweight client state management
- **React Calendar**: Date selection for bookings
- **React Map**: Interactive property maps
- **React Popover**: Contextual information overlays

### Mobile & PWA Features
- **PWA Support**: Installable web app experience
- **Service Workers**: Offline functionality and caching
- **Web Push API**: Push notifications support
- **Geolocation API**: Location-based services
- **Web Share API**: Share bookings and properties

## 📁 Project Structure

```
pms-guest/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── search/      # Property search interface
│   │   ├── booking/     # Booking flow pages
│   │   ├── profile/     # Guest profile management
│   │   ├── services/    # Guest services
│   │   ├── check-in/    # Digital check-in process
│   │   └── layout.tsx   # Root layout with guest navigation
│   ├── components/      # Reusable components
│   │   ├── ui/         # Basic UI components
│   │   ├── booking/    # Booking-specific components
│   │   ├── search/     # Search and filter components
│   │   ├── services/   # Service request components
│   │   └── profile/    # Profile management components
│   ├── lib/            # Utility functions
│   │   ├── api.ts      # API client for guest services
│   │   ├── auth.ts     # Guest authentication
│   │   ├── booking.ts  # Booking logic and validation
│   │   └── payments.ts # Payment processing utilities
│   ├── hooks/          # Custom React hooks
│   │   ├── useBooking.ts   # Booking state management
│   │   ├── useGuest.ts     # Guest profile management
│   │   └── useServices.ts  # Service requests
│   ├── store/          # Zustand stores
│   │   ├── booking.ts  # Booking state
│   │   ├── guest.ts    # Guest profile state
│   │   └── search.ts   # Search filters state
│   └── types/          # TypeScript definitions
├── public/             # Static assets
├── e2e/               # Playwright E2E tests
└── docs/              # Guest portal documentation
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 10.0.0+
- Running backend services (pms-core, pms-backend, api-gateway)

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/charilaouc/pms-guest.git
   cd pms-guest
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3011`

## ⚙️ Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_WS_URL="ws://localhost:8080/ws"

# Authentication
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3011"
NEXTAUTH_SECRET="your-nextauth-secret"

# Guest Portal Configuration
NEXT_PUBLIC_APP_NAME="PMS Guest Portal"
NEXT_PUBLIC_DEFAULT_CURRENCY="USD"
NEXT_PUBLIC_DEFAULT_LOCALE="en-US"

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
NEXT_PUBLIC_PAYMENT_METHODS="card,paypal,applepay,googlepay"

# Maps & Location
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_key"
NEXT_PUBLIC_ENABLE_LOCATION_SERVICES=true

# PWA Configuration
NEXT_PUBLIC_PWA_ENABLED=true
NEXT_PUBLIC_PUSH_NOTIFICATIONS=true

# Feature Flags
NEXT_PUBLIC_ENABLE_LOYALTY_PROGRAM=true
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true
NEXT_PUBLIC_ENABLE_GUEST_REVIEWS=true

# External Services
NEXT_PUBLIC_SUPPORT_CHAT_URL="https://chat.pms.com"
NEXT_PUBLIC_SUPPORT_PHONE="+1-800-PMS-HELP"
```

## 🎨 Guest Interface

### Property Search Interface
```typescript
interface SearchFilters {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  priceRange: [number, number];
  amenities: string[];
  propertyType: string[];
  rating: number;
}

interface SearchResults {
  properties: Property[];
  total: number;
  filters: SearchFilters;
  sorting: 'price' | 'rating' | 'distance' | 'popularity';
}
```

### Booking Flow Components
```typescript
// Step 1: Room Selection
const RoomSelection = ({ property, checkIn, checkOut }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const availableRooms = useAvailableRooms(property.id, checkIn, checkOut);

  return (
    <div className="room-selection">
      {availableRooms.map(room => (
        <RoomCard
          key={room.id}
          room={room}
          selected={selectedRoom?.id === room.id}
          onSelect={setSelectedRoom}
        />
      ))}
    </div>
  );
};

// Step 2: Guest Information
const GuestInformation = ({ onSubmit }) => {
  const form = useForm<GuestInfo>({
    resolver: zodResolver(guestInfoSchema)
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('firstName')} placeholder="First Name" />
      <Input {...form.register('lastName')} placeholder="Last Name" />
      <Input {...form.register('email')} type="email" placeholder="Email" />
      <Input {...form.register('phone')} placeholder="Phone Number" />
    </form>
  );
};

// Step 3: Payment Processing
const PaymentForm = ({ booking, onPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

    if (!error) {
      await onPayment(paymentMethod);
    }
  };
};
```

### Guest Profile Dashboard
```typescript
interface GuestDashboard {
  profile: GuestProfile;
  activeBookings: Booking[];
  bookingHistory: Booking[];
  loyaltyPoints: number;
  preferences: GuestPreferences;
  serviceRequests: ServiceRequest[];
}

const GuestDashboard = () => {
  const { guest, bookings, services } = useGuestData();

  return (
    <div className="guest-dashboard">
      <ProfileSummary guest={guest} />
      <ActiveBookings bookings={bookings.active} />
      <QuickServices onServiceRequest={handleServiceRequest} />
      <BookingHistory bookings={bookings.history} />
      <LoyaltyStatus points={guest.loyaltyPoints} />
    </div>
  );
};
```

## 📱 Mobile Experience

### PWA Configuration
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // Next.js config
});
```

### Push Notifications
```typescript
const usePushNotifications = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const subscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      setSubscription(subscription);

      // Send subscription to server
      await api.post('/api/push/subscribe', {
        subscription: subscription.toJSON()
      });
    }
  };

  return { subscription, subscribeToPush };
};
```

### Offline Functionality
```typescript
// Service Worker for offline caching
const CACHE_NAME = 'pms-guest-v1';
const urlsToCache = [
  '/',
  '/search',
  '/profile',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      }
    )
  );
});
```

## 🔐 Guest Authentication

### Authentication Flow
```typescript
const GuestAuth = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'guest'>('login');

  const handleGuestLogin = async (email: string, password: string) => {
    const response = await fetch('/api/auth/guest/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const { token, guest } = await response.json();

    // Store authentication
    localStorage.setItem('guestToken', token);
    setGuestUser(guest);
  };

  const handleGuestRegistration = async (guestData: GuestRegistration) => {
    const response = await fetch('/api/auth/guest/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guestData)
    });

    if (response.ok) {
      // Send verification email
      await sendVerificationEmail(guestData.email);
    }
  };

  const handleGuestCheckout = async () => {
    // Allow booking without account creation
    const guestBooking = {
      ...bookingData,
      guest: guestInfo,
      createAccount: false
    };

    return await createBooking(guestBooking);
  };
};
```

### Social Authentication
```typescript
const SocialLogin = () => {
  const handleGoogleLogin = async () => {
    const response = await signIn('google', {
      callbackUrl: '/profile',
      redirect: false
    });

    if (response?.ok) {
      router.push('/profile');
    }
  };

  return (
    <div className="social-login">
      <button onClick={handleGoogleLogin}>
        <GoogleIcon /> Continue with Google
      </button>
      <button onClick={() => signIn('facebook')}>
        <FacebookIcon /> Continue with Facebook
      </button>
    </div>
  );
};
```

## 🧪 Testing

### E2E Test Examples
```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Guest Booking Flow', () => {
  test('complete booking as new guest', async ({ page }) => {
    // Search for properties
    await page.goto('/search');
    await page.fill('[data-testid="location-input"]', 'New York');
    await page.fill('[data-testid="checkin-date"]', '2024-06-01');
    await page.fill('[data-testid="checkout-date"]', '2024-06-03');
    await page.click('[data-testid="search-button"]');

    // Select property and room
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible();
    await page.click('[data-testid="property-card"]').first();
    await page.click('[data-testid="select-room-button"]').first();

    // Fill guest information
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john.doe@example.com');
    await page.fill('[name="phone"]', '+1234567890');

    // Complete payment (test mode)
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    await page.click('[data-testid="complete-booking"]');

    // Verify booking confirmation
    await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-number"]')).toContainText(/BK-\d+/);
  });

  test('guest check-in process', async ({ page, context }) => {
    // Mock existing booking
    await context.addCookies([{
      name: 'guestToken',
      value: 'mock-guest-token',
      domain: 'localhost',
      path: '/'
    }]);

    await page.goto('/check-in');

    // Enter booking details
    await page.fill('[data-testid="booking-number"]', 'BK-123456');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.click('[data-testid="find-booking"]');

    // Complete check-in
    await expect(page.locator('[data-testid="booking-details"]')).toBeVisible();
    await page.click('[data-testid="confirm-checkin"]');

    // Verify check-in success
    await expect(page.locator('[data-testid="checkin-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="room-key-info"]')).toBeVisible();
  });
});
```

### Component Testing
```typescript
// __tests__/components/BookingCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BookingCard } from '@/components/booking/BookingCard';

const mockBooking = {
  id: 'BK-123',
  propertyName: 'Grand Hotel',
  roomNumber: '301',
  checkIn: '2024-06-01',
  checkOut: '2024-06-03',
  status: 'confirmed',
  totalAmount: 450.00
};

describe('BookingCard', () => {
  it('displays booking information correctly', () => {
    render(<BookingCard booking={mockBooking} />);

    expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
    expect(screen.getByText('Room 301')).toBeInTheDocument();
    expect(screen.getByText('$450.00')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });

  it('shows check-in button when applicable', () => {
    const today = new Date().toISOString().split('T')[0];
    const checkInTodayBooking = {
      ...mockBooking,
      checkIn: today,
      status: 'confirmed' as const
    };

    render(<BookingCard booking={checkInTodayBooking} />);

    expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
  });
});
```

## 📊 Analytics & Tracking

### Guest Behavior Tracking
```typescript
const useGuestAnalytics = () => {
  const trackSearchEvent = (searchParams: SearchFilters) => {
    analytics.track('Property Search', {
      location: searchParams.location,
      checkIn: searchParams.checkIn,
      guests: searchParams.guests,
      priceRange: searchParams.priceRange
    });
  };

  const trackBookingStep = (step: string, bookingData: Partial<Booking>) => {
    analytics.track('Booking Step', {
      step,
      propertyId: bookingData.propertyId,
      roomType: bookingData.roomType,
      totalAmount: bookingData.totalAmount
    });
  };

  const trackServiceRequest = (serviceType: string) => {
    analytics.track('Service Request', {
      type: serviceType,
      timestamp: new Date().toISOString()
    });
  };

  return { trackSearchEvent, trackBookingStep, trackServiceRequest };
};
```

## 🤖 Claude AI Development

### Key Development Areas:

1. **Booking Flow**:
   - `src/app/booking/` - Multi-step booking process
   - `src/components/booking/` - Booking-specific components
   - `src/hooks/useBooking.ts` - Booking state management

2. **Search & Discovery**:
   - `src/app/search/` - Property search interface
   - `src/components/search/` - Search and filter components
   - Implement advanced search features

3. **Guest Profile**:
   - `src/app/profile/` - Guest profile management
   - `src/components/profile/` - Profile components
   - Loyalty program integration

4. **Mobile Experience**:
   - PWA configuration and optimization
   - Push notification implementation
   - Offline functionality enhancement

### Common Development Tasks:

```bash
# Test booking flow
npm run e2e -- --grep "booking"

# Test mobile responsiveness
npm run e2e -- --project="Mobile Chrome"

# Component development
npm run storybook

# Performance testing
npm run lighthouse

# PWA validation
npm run pwa-check
```

## 🔗 Related Services

- **[pms-core](https://github.com/charilaouc/pms-core)** - Guest authentication
- **[pms-backend](https://github.com/charilaouc/pms-backend)** - Booking and guest data
- **[api-gateway](https://github.com/charilaouc/api-gateway)** - API routing
- **[pms-marketplace](https://github.com/charilaouc/pms-marketplace)** - Property discovery
- **[pms-shared](https://github.com/charilaouc/pms-shared)** - Shared types

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/charilaouc/pms-guest/issues)
- **Documentation**: [PMS Docs](https://github.com/charilaouc/pms-docs)
- **Guest Portal**: `http://localhost:3011` (when running)
- **Support**: Available 24/7 via in-app chat

---

**PMS Guest Portal** 🏨 | Complete booking and guest experience platform