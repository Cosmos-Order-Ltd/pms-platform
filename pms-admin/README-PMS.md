# 🏢 PMS Admin Dashboard

Administrative dashboard for the Property Management System (PMS) platform. Provides comprehensive management interface for properties, bookings, staff, guests, and system operations with advanced analytics and reporting capabilities.

## 🚀 Service Overview

**Port**: 3010
**Type**: Frontend Application (Next.js 15)
**Target Users**: Property managers, administrators, system operators
**Authentication**: JWT-based via pms-core service

## 🏗️ Architecture

This is the primary administrative interface for the PMS platform:

```
┌─────────────────────────────────────────────────────────────┐
│                PMS Admin Dashboard (3010)                   │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Property   │  Booking    │   Staff     │   Analytics     │
│ Management  │ Management  │ Management  │ & Reports       │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│                API Communication                           │
│         API Gateway (8080) → Backend Services              │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Services
- **pms-core** (3000): User authentication and authorization
- **pms-backend** (5000): Core business data and operations
- **api-gateway** (8080): Unified API access point
- **monitoring** (9090): System health and performance metrics

## 📋 Features

### Core Admin Features
- **Property Management**: Create, edit, manage multiple properties
- **Room Management**: Room types, pricing, availability, amenities
- **Booking Management**: Reservation oversight, modifications, cancellations
- **Guest Management**: Guest profiles, preferences, history
- **Staff Management**: Employee profiles, roles, scheduling, tasks
- **Financial Management**: Revenue tracking, payment processing, invoicing

### Advanced Features
- **Analytics Dashboard**: Real-time business insights and KPIs
- **Reporting System**: Comprehensive reports with export capabilities
- **Task Management**: Housekeeping and maintenance task oversight
- **Inventory Management**: Amenities, supplies, equipment tracking
- **Multi-Property Support**: Manage multiple properties from single interface
- **Role-Based Access Control**: Granular permissions for different admin levels

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Updates**: Live data synchronization with WebSocket
- **Dark/Light Theme**: User preference-based theme switching
- **Data Export**: CSV, PDF, Excel report generation
- **Advanced Filtering**: Complex search and filter capabilities
- **Bulk Operations**: Multi-selection and batch processing

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Strict type checking for reliability
- **Tailwind CSS v4**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled component library
- **CVA**: Class Variance Authority for consistent design system

### State Management & Data
- **Zustand**: Lightweight state management
- **React Query/TanStack Query**: Server state management
- **Zod**: Runtime type validation
- **React Hook Form**: Form handling and validation

### UI/UX Libraries
- **Heroicons**: Beautiful hand-crafted SVG icons
- **React Hot Toast**: Elegant notifications
- **Framer Motion**: Smooth animations and transitions
- **Chart.js/Recharts**: Data visualization and charts

### Development Tools
- **ESLint 9 + Prettier**: Code quality and formatting
- **Storybook**: Component development and documentation
- **Playwright**: End-to-end testing
- **Vitest**: Unit and integration testing
- **Bundle Analyzer**: Performance optimization

## 📁 Project Structure

```
pms-admin/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── dashboard/   # Main dashboard pages
│   │   ├── properties/  # Property management
│   │   ├── bookings/    # Booking management
│   │   ├── guests/      # Guest management
│   │   ├── staff/       # Staff management
│   │   ├── analytics/   # Analytics and reports
│   │   ├── settings/    # System settings
│   │   └── layout.tsx   # Root layout
│   ├── components/      # Reusable components
│   │   ├── ui/         # Basic UI components
│   │   ├── forms/      # Form components
│   │   ├── charts/     # Chart components
│   │   ├── tables/     # Data table components
│   │   └── layout/     # Layout components
│   ├── lib/            # Utility functions
│   │   ├── api.ts      # API client setup
│   │   ├── auth.ts     # Authentication utilities
│   │   ├── utils.ts    # General utilities
│   │   └── validations.ts # Form validation schemas
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand stores
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles and themes
├── public/             # Static assets
├── e2e/               # Playwright E2E tests
├── stories/           # Storybook stories
└── docs/              # Component documentation
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 10.0.0+
- Running backend services (pms-core, pms-backend, api-gateway)

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/charilaouc/pms-admin.git
   cd pms-admin
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

The application will be available at `http://localhost:3010`

## ⚙️ Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_WS_URL="ws://localhost:8080/ws"

# Authentication
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3010"
NEXTAUTH_SECRET="your-nextauth-secret"

# App Configuration
NEXT_PUBLIC_APP_NAME="PMS Admin Dashboard"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# External Services
NEXT_PUBLIC_UPLOAD_URL="http://localhost:5000/upload"
NEXT_PUBLIC_EXPORT_URL="http://localhost:5000/export"

# Development
NODE_ENV="development"
ANALYZE="false"
```

### Theme Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a'
        }
      }
    }
  }
};
```

## 🖥️ Admin Interface

### Dashboard Overview
- **Key Performance Indicators**: Occupancy rate, revenue, booking trends
- **Real-time Metrics**: Active bookings, check-ins/check-outs, staff tasks
- **Quick Actions**: New booking, guest check-in, task assignment
- **Recent Activities**: Latest bookings, payments, guest interactions

### Property Management
```typescript
interface PropertyDashboard {
  properties: Property[];
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
  revenueToday: number;
  upcomingCheckIns: Booking[];
  upcomingCheckOuts: Booking[];
}
```

### Booking Management Interface
```typescript
interface BookingManagement {
  bookings: Booking[];
  filters: {
    status: BookingStatus[];
    dateRange: DateRange;
    property: string;
    guestName: string;
  };
  bulkActions: {
    confirm: () => void;
    cancel: () => void;
    modify: () => void;
  };
  exportOptions: ExportFormat[];
}
```

### Staff Management Dashboard
```typescript
interface StaffDashboard {
  staff: StaffMember[];
  activeShifts: Shift[];
  pendingTasks: Task[];
  performanceMetrics: {
    taskCompletion: number;
    averageRating: number;
    hoursWorked: number;
  };
  scheduleView: 'daily' | 'weekly' | 'monthly';
}
```

## 📊 Analytics & Reporting

### Available Reports
- **Occupancy Reports**: Daily, weekly, monthly occupancy trends
- **Revenue Reports**: Revenue breakdown by property, room type, date
- **Guest Reports**: Guest demographics, preferences, repeat visitors
- **Staff Reports**: Performance, productivity, schedule analysis
- **Financial Reports**: P&L, cash flow, payment method analysis

### Real-time Analytics
```typescript
interface AnalyticsDashboard {
  realTimeMetrics: {
    currentOccupancy: number;
    todaysRevenue: number;
    pendingCheckIns: number;
    activeTasks: number;
  };
  charts: {
    occupancyTrend: ChartData;
    revenueTrend: ChartData;
    bookingsBySource: ChartData;
    guestSatisfaction: ChartData;
  };
  alerts: SystemAlert[];
}
```

## 🔐 Authentication & Authorization

### User Roles & Permissions
```typescript
enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  PROPERTY_MANAGER = 'property_manager',
  FRONT_DESK = 'front_desk',
  HOUSEKEEPING_SUPERVISOR = 'housekeeping_supervisor',
  MAINTENANCE_SUPERVISOR = 'maintenance_supervisor'
}

interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'manage')[];
}
```

### Authentication Flow
```typescript
// Login component
const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const login = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    const { token, user } = await response.json();

    // Store token and user info
    setAuthToken(token);
    setUser(user);

    // Redirect to dashboard
    router.push('/dashboard');
  };
};
```

## 🧪 Testing

### Test Categories
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run e2e

# E2E tests with UI
npm run e2e:ui

# Component tests (Storybook)
npm run test-storybook
```

### Testing Structure
```
tests/
├── __tests__/          # Unit tests
│   ├── components/     # Component tests
│   ├── hooks/         # Custom hook tests
│   ├── utils/         # Utility function tests
│   └── pages/         # Page component tests
├── e2e/               # Playwright E2E tests
│   ├── auth.spec.ts   # Authentication tests
│   ├── dashboard.spec.ts # Dashboard functionality
│   ├── bookings.spec.ts  # Booking management tests
│   └── properties.spec.ts # Property management tests
└── fixtures/          # Test data and mocks
```

### E2E Test Example
```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@pms.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display key metrics', async ({ page }) => {
    await expect(page.locator('[data-testid="occupancy-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="daily-revenue"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-bookings"]')).toBeVisible();
  });

  test('should navigate to bookings management', async ({ page }) => {
    await page.click('[data-testid="bookings-nav"]');
    await expect(page).toHaveURL('/bookings');
    await expect(page.locator('h1')).toContainText('Bookings Management');
  });
});
```

## 🎨 Component Library

### Storybook Stories
```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Test stories
npm run test-storybook
```

### Example Component Story
```typescript
// stories/BookingCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { BookingCard } from '../components/BookingCard';

const meta: Meta<typeof BookingCard> = {
  title: 'Components/BookingCard',
  component: BookingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    booking: {
      id: '1',
      guestName: 'John Doe',
      roomNumber: '101',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'confirmed'
    }
  }
};
```

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3010
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  pms-admin:
    build: .
    ports:
      - "3010:3010"
    environment:
      - NEXT_PUBLIC_API_URL=http://api-gateway:8080
      - NEXT_PUBLIC_AUTH_URL=http://pms-core:3000
    depends_on:
      - api-gateway
      - pms-core
```

## 📈 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Generate bundle report
ANALYZE=true npm run build
```

### Performance Features
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Static Generation**: ISG for frequently accessed pages
- **Caching**: API response caching with React Query
- **Compression**: Gzip/Brotli compression for assets

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🤖 Claude AI Development

### Key Development Areas:

1. **Page Components**:
   - `src/app/` - Next.js App Router pages
   - Add new admin interfaces and functionality

2. **UI Components**:
   - `src/components/ui/` - Reusable UI components
   - `src/components/forms/` - Form components
   - `src/components/charts/` - Data visualization

3. **State Management**:
   - `src/store/` - Zustand stores for global state
   - `src/hooks/` - Custom React hooks

4. **API Integration**:
   - `src/lib/api.ts` - API client configuration
   - Add new API endpoints and data fetching

### Development Workflow:

1. **Component Development**:
   ```bash
   npm run storybook  # Develop components in isolation
   npm run test       # Run unit tests
   npm run e2e        # Run E2E tests
   ```

2. **API Integration**:
   ```typescript
   // Add new API endpoint
   export const bookingApi = {
     getBookings: (params: BookingFilters) =>
       api.get('/api/bookings', { params }),

     createBooking: (data: CreateBookingData) =>
       api.post('/api/bookings', data),
   };
   ```

3. **Form Handling**:
   ```typescript
   const bookingSchema = z.object({
     guestName: z.string().min(2),
     roomId: z.string(),
     checkIn: z.date(),
     checkOut: z.date()
   });

   const BookingForm = () => {
     const form = useForm<z.infer<typeof bookingSchema>>({
       resolver: zodResolver(bookingSchema)
     });
   };
   ```

## 🔗 Related Services

- **[pms-core](https://github.com/charilaouc/pms-core)** - Authentication service
- **[pms-backend](https://github.com/charilaouc/pms-backend)** - Core API service
- **[api-gateway](https://github.com/charilaouc/api-gateway)** - API Gateway
- **[pms-shared](https://github.com/charilaouc/pms-shared)** - Shared types
- **[pms-infrastructure](https://github.com/charilaouc/pms-infrastructure)** - Deployment configs

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/charilaouc/pms-admin/issues)
- **Documentation**: [PMS Docs](https://github.com/charilaouc/pms-docs)
- **Storybook**: `http://localhost:6006` (when running)
- **Admin Panel**: `http://localhost:3010` (when running)

---

**PMS Admin Dashboard** 🏢 | Comprehensive property management interface