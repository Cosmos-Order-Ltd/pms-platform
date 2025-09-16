# 👥 PMS Staff Mobile App

Progressive Web Application (PWA) for hotel staff operations including housekeeping, maintenance, task management, and operational workflows. Optimized for mobile devices with offline capabilities.

## 🚀 Service Overview

**Port**: 3012
**Type**: Frontend PWA Application (Next.js 15)
**Target Users**: Hotel staff, housekeeping, maintenance, front desk
**Authentication**: Role-based staff authentication via pms-core
**Platform**: Mobile-first PWA with offline support

## 🏗️ Architecture

This is the staff operational interface for the PMS platform:

```
┌─────────────────────────────────────────────────────────────┐
│                PMS Staff Mobile App (3012)                  │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│    Task     │ Housekeeping│ Maintenance │   Time & Schedule│
│ Management  │  Workflows  │  Requests   │   Management     │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│               PWA Features & Offline Support               │
│         API Gateway (8080) → Backend Services              │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Services
- **pms-core** (3000): Staff authentication and role management
- **pms-backend** (5000): Task data, room status, staff schedules
- **api-gateway** (8080): Unified API access point
- **pms-admin** (3010): Task assignment and staff management integration

## 📋 Features

### Core Staff Features
- **Task Management**: View, accept, complete assigned tasks
- **Room Status Management**: Update room cleaning status and availability
- **Housekeeping Workflows**: Step-by-step cleaning procedures
- **Maintenance Requests**: Create, update, track maintenance issues
- **Time Tracking**: Clock in/out, break tracking, shift management
- **Staff Communication**: Team messaging, announcements, notifications

### Housekeeping Features
- **Room Inspection**: Digital inspection checklists
- **Inventory Management**: Supplies tracking, restocking alerts
- **Guest Requests**: Handle special requests and amenities
- **Quality Control**: Photo documentation, issue reporting
- **Cleaning Protocols**: COVID-safe procedures, compliance tracking
- **Lost & Found**: Item logging and tracking system

### Maintenance Features
- **Work Orders**: Create, prioritize, track maintenance tasks
- **Asset Management**: Equipment tracking, maintenance schedules
- **Preventive Maintenance**: Scheduled inspections and services
- **Emergency Response**: Priority alerts, emergency procedures
- **Parts Inventory**: Track parts usage, ordering system
- **Safety Compliance**: Safety checks, incident reporting

### Mobile & PWA Features
- **Offline Operation**: Full functionality without internet
- **Push Notifications**: Task assignments, urgent alerts
- **Camera Integration**: Photo documentation, QR code scanning
- **GPS Tracking**: Location verification for mobile staff
- **Voice Notes**: Quick audio updates and reminders
- **Barcode Scanning**: Equipment and inventory tracking

## 🛠️ Tech Stack

### PWA Framework
- **Next.js 15**: React framework with PWA capabilities
- **TypeScript**: Type safety for complex workflows
- **Tailwind CSS v4**: Mobile-first responsive design
- **Radix UI**: Accessible touch-friendly components
- **Next PWA**: Service worker and PWA configuration

### Mobile-Specific Libraries
- **React Hook Form**: Touch-optimized form handling
- **React Query**: Offline-first data synchronization
- **Zustand**: Lightweight state management
- **React Camera**: Camera integration for documentation
- **React QR Reader**: QR code scanning capabilities
- **React Voice Recorder**: Audio note functionality

### PWA & Offline Features
- **Service Workers**: Background sync, caching strategies
- **IndexedDB**: Offline data storage
- **Web Push API**: Push notification support
- **Background Sync**: Sync data when connection returns
- **Cache API**: Strategic resource caching

## 📁 Project Structure

```
pms-staff/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── dashboard/   # Staff dashboard
│   │   ├── tasks/       # Task management
│   │   ├── housekeeping/# Housekeeping workflows
│   │   ├── maintenance/ # Maintenance requests
│   │   ├── schedule/    # Time & schedule management
│   │   ├── profile/     # Staff profile & settings
│   │   └── layout.tsx   # Mobile-optimized layout
│   ├── components/      # Reusable components
│   │   ├── ui/         # Touch-optimized UI components
│   │   ├── tasks/      # Task-related components
│   │   ├── housekeeping/ # Housekeeping components
│   │   ├── maintenance/ # Maintenance components
│   │   ├── camera/     # Camera integration
│   │   └── offline/    # Offline status components
│   ├── lib/            # Utility functions
│   │   ├── pwa.ts      # PWA utilities
│   │   ├── offline.ts  # Offline data management
│   │   ├── sync.ts     # Background synchronization
│   │   └── camera.ts   # Camera utilities
│   ├── hooks/          # Custom React hooks
│   │   ├── useTasks.ts     # Task management
│   │   ├── useOffline.ts   # Offline state
│   │   ├── useSync.ts      # Data synchronization
│   │   └── useCamera.ts    # Camera functionality
│   ├── store/          # Zustand stores
│   │   ├── tasks.ts    # Task state
│   │   ├── staff.ts    # Staff profile state
│   │   └── offline.ts  # Offline data queue
│   ├── workers/        # Service workers
│   │   ├── sw.ts       # Main service worker
│   │   ├── sync.ts     # Background sync worker
│   │   └── cache.ts    # Caching strategies
│   └── types/          # TypeScript definitions
├── public/             # PWA assets (icons, manifest)
├── e2e/               # Playwright E2E tests
└── docs/              # Staff app documentation
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 10.0.0+
- Mobile device or browser dev tools for testing
- Running backend services (pms-core, pms-backend, api-gateway)

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/charilaouc/pms-staff.git
   cd pms-staff
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

The application will be available at `http://localhost:3012`

## ⚙️ Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_WS_URL="ws://localhost:8080/ws"

# Authentication
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3012"
NEXTAUTH_SECRET="your-nextauth-secret"

# PWA Configuration
NEXT_PUBLIC_PWA_NAME="PMS Staff App"
NEXT_PUBLIC_PWA_SHORT_NAME="PMS Staff"
NEXT_PUBLIC_PWA_DESCRIPTION="Hotel staff operations mobile app"
NEXT_PUBLIC_PWA_THEME_COLOR="#3b82f6"
NEXT_PUBLIC_PWA_BACKGROUND_COLOR="#ffffff"

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true

# Offline Configuration
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_OFFLINE_CACHE_HOURS=24
NEXT_PUBLIC_BACKGROUND_SYNC_ENABLED=true

# Camera & Media
NEXT_PUBLIC_ENABLE_CAMERA=true
NEXT_PUBLIC_ENABLE_VOICE_NOTES=true
NEXT_PUBLIC_MAX_PHOTO_SIZE_MB=5

# Location Services
NEXT_PUBLIC_ENABLE_LOCATION_TRACKING=true
NEXT_PUBLIC_LOCATION_ACCURACY_METERS=10

# Feature Flags
NEXT_PUBLIC_ENABLE_QR_SCANNING=true
NEXT_PUBLIC_ENABLE_BARCODE_SCANNING=true
NEXT_PUBLIC_ENABLE_VOICE_COMMANDS=false
```

### PWA Manifest Configuration

```javascript
// public/manifest.json
{
  "name": "PMS Staff Mobile App",
  "short_name": "PMS Staff",
  "description": "Hotel staff operations and task management",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/dashboard",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

## 📱 Staff Interface

### Task Management Dashboard
```typescript
interface StaffDashboard {
  assignedTasks: Task[];
  inProgressTasks: Task[];
  completedToday: number;
  hoursWorked: number;
  currentShift: Shift;
  urgentAlerts: Alert[];
  teamMessages: Message[];
}

const StaffDashboard = () => {
  const { tasks, shift, alerts } = useStaffData();
  const { isOnline } = useOffline();

  return (
    <div className="staff-dashboard">
      {!isOnline && <OfflineIndicator />}
      <ShiftStatus shift={shift} />
      <UrgentAlerts alerts={alerts} />
      <TasksSummary tasks={tasks} />
      <QuickActions />
      <RecentActivity />
    </div>
  );
};
```

### Task Management Components
```typescript
// Task assignment and tracking
const TaskCard = ({ task }: { task: Task }) => {
  const [status, setStatus] = useState(task.status);
  const { updateTask } = useTasks();

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setStatus(newStatus);
    await updateTask(task.id, { status: newStatus });

    // Photo documentation for completed tasks
    if (newStatus === 'completed') {
      const photo = await capturePhoto();
      await updateTask(task.id, { completionPhoto: photo });
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <Priority level={task.priority} />
      </div>
      <div className="task-details">
        <Location room={task.roomNumber} />
        <EstimatedTime minutes={task.estimatedMinutes} />
      </div>
      <div className="task-actions">
        <StatusToggle
          status={status}
          onChange={handleStatusChange}
        />
        <PhotoButton onClick={() => captureTaskPhoto(task.id)} />
      </div>
    </div>
  );
};
```

### Housekeeping Workflow
```typescript
interface HousekeepingChecklist {
  roomId: string;
  checklistItems: ChecklistItem[];
  inspectionPhotos: Photo[];
  issuesFound: Issue[];
  completionTime: Date;
  staffNotes: string;
}

const HousekeepingWorkflow = ({ roomId }: { roomId: string }) => {
  const [checklist, setChecklist] = useState<HousekeepingChecklist>();
  const { checkInRoom, completeRoom } = useHousekeeping();

  const handleItemComplete = async (itemId: string, isComplete: boolean) => {
    const updatedChecklist = {
      ...checklist,
      checklistItems: checklist.checklistItems.map(item =>
        item.id === itemId ? { ...item, completed: isComplete } : item
      )
    };
    setChecklist(updatedChecklist);

    // Sync with server if online
    if (navigator.onLine) {
      await updateRoomStatus(roomId, updatedChecklist);
    }
  };

  const handleRoomCompletion = async () => {
    // Require photos for completion
    const photos = await captureCompletionPhotos();
    await completeRoom(roomId, {
      checklist,
      photos,
      completedBy: currentStaff.id,
      completedAt: new Date()
    });
  };

  return (
    <div className="housekeeping-workflow">
      <RoomHeader roomId={roomId} />
      <ChecklistProgress checklist={checklist} />
      <ChecklistItems
        items={checklist.checklistItems}
        onItemComplete={handleItemComplete}
      />
      <IssueReporting roomId={roomId} />
      <PhotoDocumentation />
      <CompletionButton
        onClick={handleRoomCompletion}
        disabled={!isChecklistComplete(checklist)}
      />
    </div>
  );
};
```

## 🔄 Offline Functionality

### Service Worker Configuration
```typescript
// workers/sw.ts
const CACHE_NAME = 'pms-staff-v1';
const OFFLINE_URLS = [
  '/',
  '/dashboard',
  '/tasks',
  '/housekeeping',
  '/maintenance',
  '/offline'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Background sync for task updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'task-sync') {
    event.waitUntil(syncTasks());
  }
});

const syncTasks = async () => {
  const db = await openDB();
  const pendingTasks = await db.getAll('pendingTasks');

  for (const task of pendingTasks) {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        body: JSON.stringify(task)
      });
      await db.delete('pendingTasks', task.id);
    } catch (error) {
      console.error('Sync failed for task:', task.id);
    }
  }
};
```

### Offline Data Management
```typescript
const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  const queueOfflineAction = async (action: OfflineAction) => {
    const db = await openDB();
    await db.add('offlineQueue', {
      ...action,
      timestamp: Date.now(),
      id: generateId()
    });

    setPendingSync(prev => prev + 1);

    // Register background sync
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('task-sync');
    }
  };

  const syncWhenOnline = useCallback(async () => {
    if (!isOnline) return;

    const db = await openDB();
    const queue = await db.getAll('offlineQueue');

    for (const action of queue) {
      try {
        await executeAction(action);
        await db.delete('offlineQueue', action.id);
        setPendingSync(prev => prev - 1);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }, [isOnline]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncWhenOnline();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncWhenOnline]);

  return { isOnline, pendingSync, queueOfflineAction };
};
```

## 📷 Camera & Photo Documentation

### Camera Integration
```typescript
const useCamera = () => {
  const [hasCamera, setHasCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    // Check camera availability
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const capturePhoto = async (): Promise<string> => {
    if (!hasCamera) throw new Error('Camera not available');

    setIsCapturing(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      return imageData;
    } finally {
      setIsCapturing(false);
    }
  };

  const captureWithMetadata = async (taskId: string) => {
    const imageData = await capturePhoto();
    const location = await getCurrentLocation();

    return {
      taskId,
      imageData,
      location,
      timestamp: new Date().toISOString(),
      capturedBy: currentStaff.id
    };
  };

  return { hasCamera, isCapturing, capturePhoto, captureWithMetadata };
};
```

### QR Code Scanning
```typescript
const useQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);

  const scanQRCode = async (): Promise<string> => {
    setIsScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      return new Promise((resolve, reject) => {
        const qrScanner = new QrScanner(
          stream,
          (result) => {
            qrScanner.stop();
            stream.getTracks().forEach(track => track.stop());
            setIsScanning(false);
            resolve(result.data);
          },
          {
            onDecodeError: (error) => {
              console.warn('QR scan error:', error);
            }
          }
        );

        qrScanner.start();

        // Timeout after 30 seconds
        setTimeout(() => {
          qrScanner.stop();
          stream.getTracks().forEach(track => track.stop());
          setIsScanning(false);
          reject(new Error('QR scan timeout'));
        }, 30000);
      });
    } catch (error) {
      setIsScanning(false);
      throw error;
    }
  };

  return { isScanning, scanQRCode };
};
```

## 🧪 Testing

### Mobile-Specific E2E Tests
```typescript
// e2e/mobile-workflow.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use(devices['Pixel 5']);

test.describe('Mobile Staff Workflow', () => {
  test('complete housekeeping task on mobile', async ({ page }) => {
    // Login as housekeeping staff
    await page.goto('/login');
    await page.fill('[name="email"]', 'housekeeper@pms.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to tasks
    await page.click('[data-testid="tasks-tab"]');
    await expect(page.locator('[data-testid="task-list"]')).toBeVisible();

    // Select and start task
    await page.click('[data-testid="task-card"]').first();
    await page.click('[data-testid="start-task"]');

    // Complete checklist items (mobile touch interactions)
    const checklistItems = page.locator('[data-testid="checklist-item"]');
    const count = await checklistItems.count();

    for (let i = 0; i < count; i++) {
      await checklistItems.nth(i).locator('input[type="checkbox"]').tap();
    }

    // Test photo capture (mock camera)
    await page.route('/api/camera/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ photoUrl: 'mock-photo.jpg' })
      });
    });

    await page.click('[data-testid="add-photo"]');
    await page.click('[data-testid="capture-button"]');

    // Complete task
    await page.click('[data-testid="complete-task"]');
    await expect(page.locator('[data-testid="task-completed"]')).toBeVisible();
  });

  test('offline functionality', async ({ page, context }) => {
    // Start online
    await page.goto('/dashboard');

    // Go offline
    await context.setOffline(true);
    await page.reload();

    // Should show offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();

    // Should still allow task updates (queued for sync)
    await page.click('[data-testid="task-card"]');
    await page.click('[data-testid="mark-complete"]');

    // Check offline queue indicator
    await expect(page.locator('[data-testid="pending-sync"]')).toContainText('1');

    // Go back online
    await context.setOffline(false);
    await page.reload();

    // Should sync and clear offline queue
    await expect(page.locator('[data-testid="pending-sync"]')).toContainText('0');
  });
});
```

### PWA Testing
```typescript
// __tests__/pwa.test.ts
import { test, expect } from '@playwright/test';

test.describe('PWA Functionality', () => {
  test('should install as PWA', async ({ page }) => {
    await page.goto('/');

    // Check PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');

    // Check service worker registration
    await page.waitForFunction(() => 'serviceWorker' in navigator);

    const swRegistered = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.active !== null;
    });

    expect(swRegistered).toBe(true);
  });

  test('should work offline', async ({ page, context }) => {
    await page.goto('/dashboard');

    // Wait for service worker to be ready
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Go offline
    await context.setOffline(true);

    // Navigate to cached page
    await page.click('[data-testid="tasks-link"]');
    await expect(page.locator('h1')).toContainText('Tasks');

    // Should show offline indicator
    await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();
  });
});
```

## 🤖 Claude AI Development

### Key Development Areas:

1. **Task Management**:
   - `src/app/tasks/` - Task assignment and completion flows
   - `src/components/tasks/` - Task-related components
   - `src/hooks/useTasks.ts` - Task state management

2. **Offline Functionality**:
   - `src/workers/` - Service worker implementation
   - `src/lib/offline.ts` - Offline data management
   - `src/hooks/useSync.ts` - Background synchronization

3. **Camera Integration**:
   - `src/components/camera/` - Camera components
   - `src/hooks/useCamera.ts` - Camera functionality
   - Photo documentation workflows

4. **Mobile Optimization**:
   - Touch-friendly UI components
   - PWA configuration and features
   - Mobile-specific user experience

### Common Development Tasks:

```bash
# Test mobile experience
npm run e2e -- --project="Mobile Chrome"

# Test PWA functionality
npm run test:pwa

# Build PWA for production
npm run build && npm run start

# Test offline capabilities
npm run test:offline

# Validate PWA lighthouse score
npm run lighthouse -- --preset=pwa
```

## 🔗 Related Services

- **[pms-core](https://github.com/charilaouc/pms-core)** - Staff authentication
- **[pms-backend](https://github.com/charilaouc/pms-backend)** - Task and staff data
- **[api-gateway](https://github.com/charilaouc/api-gateway)** - API routing
- **[pms-admin](https://github.com/charilaouc/pms-admin)** - Staff management
- **[pms-shared](https://github.com/charilaouc/pms-shared)** - Shared types

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/charilaouc/pms-staff/issues)
- **Documentation**: [PMS Docs](https://github.com/charilaouc/pms-docs)
- **Staff App**: `http://localhost:3012` (when running)
- **Mobile Support**: Available via in-app help system

---

**PMS Staff Mobile App** 👥 | Mobile-first PWA for hotel operations and task management