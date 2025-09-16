# 🏪 PMS Marketplace

Property marketplace and booking platform for the Property Management System (PMS). Enables property discovery, comparison, and booking across multiple properties with advanced search capabilities and integrated booking system.

## 🚀 Service Overview

**Port**: 3013
**Type**: Frontend Application (Next.js 15)
**Target Users**: Travelers, booking agents, property seekers
**Authentication**: Optional guest authentication for enhanced features
**Integration**: Connects with multiple PMS backend instances

## 🏗️ Architecture

This is the marketplace interface for property discovery and booking:

```
┌─────────────────────────────────────────────────────────────┐
│               PMS Marketplace Platform (3013)               │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Property   │   Advanced  │   Booking   │   Reviews &     │
│  Discovery  │   Search    │   System    │   Ratings       │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│              Multi-Property Integration                    │
│         API Gateway (8080) → Multiple PMS Instances        │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Services
- **pms-core** (3000): User authentication and preferences
- **pms-backend** (5000): Property data, availability, bookings
- **api-gateway** (8080): Unified API access across properties
- **pms-guest** (3011): Seamless booking flow integration

## 📋 Features

### Property Discovery
- **Advanced Search**: Location, dates, price, amenities, ratings
- **Interactive Maps**: Property locations with neighborhood info
- **Filter & Sort**: Comprehensive filtering with smart recommendations
- **Property Comparison**: Side-by-side comparison of properties
- **Virtual Tours**: 360° photos and video walkthroughs
- **Availability Calendar**: Real-time availability across properties

### Booking Platform
- **Multi-Property Booking**: Book across different property management systems
- **Best Price Guarantee**: Price comparison and matching
- **Flexible Booking**: Instant booking or request-to-book options
- **Group Bookings**: Handle large groups and events
- **Corporate Accounts**: Business travel management
- **Package Deals**: Combined offers with activities and services

### User Experience
- **Personalized Recommendations**: AI-powered property suggestions
- **Wishlist Management**: Save and organize favorite properties
- **Booking History**: Track all reservations across properties
- **Reviews & Ratings**: Verified guest reviews and photos
- **Price Alerts**: Notify when prices drop for saved properties
- **Mobile-Optimized**: Responsive design for all devices

### Advanced Features
- **Multi-Language Support**: Localized content and currency
- **Real-Time Chat**: Direct communication with properties
- **Social Sharing**: Share properties and trips
- **Loyalty Integration**: Cross-property loyalty programs
- **Travel Planning**: Integrated itinerary and trip management
- **Analytics Dashboard**: For property managers and partners

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15**: React framework with SSG/ISR optimization
- **TypeScript**: Type safety for complex data structures
- **Tailwind CSS v4**: Responsive, mobile-first design system
- **Radix UI**: Accessible component library
- **Framer Motion**: Smooth animations and transitions

### Search & Discovery
- **Algolia/ElasticSearch**: Fast, typo-tolerant search
- **Mapbox/Google Maps**: Interactive maps and geolocation
- **React Virtual**: Efficient list virtualization
- **React Intersection Observer**: Lazy loading and infinite scroll
- **Fuse.js**: Fuzzy search capabilities

### Data & State Management
- **React Query/TanStack Query**: Server state and caching
- **Zustand**: Client-side state management
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation
- **Date-fns**: Date manipulation and formatting

### UI/UX Libraries
- **React Image Gallery**: Property photo galleries
- **React Calendar**: Date selection and availability
- **React Select**: Advanced dropdown components
- **React Tooltip**: Interactive help and information
- **React Share**: Social media sharing integration

## 📁 Project Structure

```
pms-marketplace/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── search/      # Property search interface
│   │   ├── property/    # Property detail pages
│   │   ├── booking/     # Booking flow integration
│   │   ├── compare/     # Property comparison
│   │   ├── wishlist/    # Saved properties
│   │   ├── account/     # User account management
│   │   └── layout.tsx   # Marketplace layout
│   ├── components/      # Reusable components
│   │   ├── ui/         # Basic UI components
│   │   ├── search/     # Search and filter components
│   │   ├── property/   # Property display components
│   │   ├── booking/    # Booking-related components
│   │   ├── maps/       # Map integration components
│   │   └── reviews/    # Review and rating components
│   ├── lib/            # Utility functions
│   │   ├── search.ts   # Search functionality
│   │   ├── maps.ts     # Map utilities
│   │   ├── booking.ts  # Booking integration
│   │   ├── analytics.ts # Tracking and analytics
│   │   └── api.ts      # API client configuration
│   ├── hooks/          # Custom React hooks
│   │   ├── useSearch.ts    # Search state management
│   │   ├── useBooking.ts   # Booking flow hooks
│   │   ├── useWishlist.ts  # Wishlist management
│   │   └── useAnalytics.ts # Analytics tracking
│   ├── store/          # Zustand stores
│   │   ├── search.ts   # Search state
│   │   ├── user.ts     # User preferences
│   │   └── booking.ts  # Booking state
│   └── types/          # TypeScript definitions
├── public/             # Static assets
├── e2e/               # Playwright E2E tests
└── docs/              # Marketplace documentation
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 10.0.0+
- Running backend services (pms-core, pms-backend, api-gateway)

### Installation

1. **Clone and install**:
   ```bash
   git clone https://github.com/charilaouc/pms-marketplace.git
   cd pms-marketplace
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

The application will be available at `http://localhost:3013`

## ⚙️ Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_MARKETPLACE_API="http://localhost:8080/marketplace"

# Search & Discovery
NEXT_PUBLIC_ALGOLIA_APP_ID="your_algolia_app_id"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY="your_algolia_search_key"
NEXT_PUBLIC_ELASTICSEARCH_URL="http://localhost:9200"

# Maps Integration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_key"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your_mapbox_token"

# Authentication (Optional)
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3013"
NEXTAUTH_SECRET="your-nextauth-secret"

# Marketplace Configuration
NEXT_PUBLIC_APP_NAME="PMS Marketplace"
NEXT_PUBLIC_DEFAULT_CURRENCY="USD"
NEXT_PUBLIC_SUPPORTED_CURRENCIES="USD,EUR,GBP,CAD"
NEXT_PUBLIC_DEFAULT_LOCALE="en-US"

# Booking Integration
NEXT_PUBLIC_BOOKING_PROVIDER="internal"  # internal, booking.com, expedia
NEXT_PUBLIC_COMMISSION_RATE="0.15"

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
NEXT_PUBLIC_PAYMENT_METHODS="card,paypal,applepay,googlepay"

# Analytics & Tracking
NEXT_PUBLIC_GA_TRACKING_ID="GA-XXXXXXXXX"
NEXT_PUBLIC_HOTJAR_ID="your_hotjar_id"
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Feature Flags
NEXT_PUBLIC_ENABLE_PROPERTY_COMPARISON=true
NEXT_PUBLIC_ENABLE_VIRTUAL_TOURS=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=true

# External Services
NEXT_PUBLIC_REVIEW_API_URL="https://reviews.pms.com"
NEXT_PUBLIC_CHAT_SERVICE_URL="https://chat.pms.com"
```

## 🔍 Search & Discovery

### Advanced Search Interface
```typescript
interface SearchFilters {
  location: {
    query: string;
    coordinates?: [number, number];
    radius?: number;
  };
  dates: {
    checkIn: Date;
    checkOut: Date;
    flexible?: boolean;
  };
  occupancy: {
    adults: number;
    children: number;
    rooms: number;
  };
  price: {
    min: number;
    max: number;
    currency: string;
  };
  amenities: string[];
  propertyTypes: string[];
  ratings: {
    min: number;
    verified?: boolean;
  };
  accessibility: string[];
  policies: {
    petFriendly?: boolean;
    smokingAllowed?: boolean;
    childFriendly?: boolean;
  };
}

const SearchInterface = () => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const { properties, loading, error } = usePropertySearch(filters);

  const handleLocationChange = (location: LocationResult) => {
    setFilters(prev => ({
      ...prev,
      location: {
        query: location.name,
        coordinates: location.coordinates,
        radius: 25 // km
      }
    }));
  };

  return (
    <div className="search-interface">
      <SearchHeader>
        <LocationInput onChange={handleLocationChange} />
        <DatePicker
          checkIn={filters.dates.checkIn}
          checkOut={filters.dates.checkOut}
          onChange={(dates) => setFilters(prev => ({
            ...prev,
            dates
          }))}
        />
        <GuestSelector
          occupancy={filters.occupancy}
          onChange={(occupancy) => setFilters(prev => ({
            ...prev,
            occupancy
          }))}
        />
      </SearchHeader>

      <SearchFilters
        filters={filters}
        onChange={setFilters}
      />

      <SearchResults
        properties={properties}
        loading={loading}
        error={error}
      />
    </div>
  );
};
```

### Property Discovery Components
```typescript
const PropertyGrid = ({ properties }: { properties: Property[] }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  return (
    <div className="property-grid">
      <ResultsHeader
        count={properties.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {viewMode === 'map' ? (
        <MapView properties={properties} />
      ) : (
        <VirtualizedList
          items={properties}
          renderItem={({ item }) => (
            <PropertyCard
              key={item.id}
              property={item}
              viewMode={viewMode}
            />
          )}
        />
      )}
    </div>
  );
};

const PropertyCard = ({ property, viewMode }: PropertyCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      await removeFromWishlist(property.id);
    } else {
      await addToWishlist(property);
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className={`property-card ${viewMode}`}>
      <ImageGallery
        images={property.images}
        alt={property.name}
        lazy={true}
      />

      <PropertyInfo>
        <PropertyName>{property.name}</PropertyName>
        <Location>{property.address.display}</Location>
        <Rating rating={property.rating} reviews={property.reviewCount} />
        <Amenities amenities={property.topAmenities.slice(0, 3)} />
      </PropertyInfo>

      <PricingInfo>
        <Price
          amount={property.startingPrice}
          currency={property.currency}
          period="night"
        />
        <AvailabilityStatus status={property.availability} />
      </PricingInfo>

      <ActionButtons>
        <WishlistButton
          isWishlisted={isWishlisted}
          onClick={handleWishlistToggle}
        />
        <ViewDetailsButton
          href={`/property/${property.id}`}
        />
        <QuickBookButton
          property={property}
          dates={searchDates}
        />
      </ActionButtons>
    </div>
  );
};
```

## 🗺️ Interactive Maps

### Map Integration
```typescript
const MapView = ({ properties }: { properties: Property[] }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // NYC default
  const [mapZoom, setMapZoom] = useState(12);

  const propertyMarkers = properties.map(property => ({
    id: property.id,
    position: [property.coordinates.lat, property.coordinates.lng],
    price: property.startingPrice,
    currency: property.currency,
    availability: property.availability
  }));

  return (
    <div className="map-view">
      <Map
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '600px' }}
      >
        {propertyMarkers.map(marker => (
          <PropertyMarker
            key={marker.id}
            position={marker.position}
            price={marker.price}
            currency={marker.currency}
            selected={selectedProperty?.id === marker.id}
            onClick={() => {
              const property = properties.find(p => p.id === marker.id);
              setSelectedProperty(property || null);
            }}
          />
        ))}

        {selectedProperty && (
          <PropertyPopup
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </Map>

      <MapControls>
        <SearchThisAreaButton
          onSearch={() => searchInMapBounds(map.getBounds())}
        />
        <LayerControls />
        <ZoomControls />
      </MapControls>
    </div>
  );
};

const PropertyMarker = ({ position, price, currency, selected, onClick }) => {
  return (
    <Marker position={position} onClick={onClick}>
      <div className={`price-marker ${selected ? 'selected' : ''}`}>
        <span className="price">
          {formatCurrency(price, currency)}
        </span>
      </div>
    </Marker>
  );
};
```

## 🏨 Property Details & Booking

### Property Detail Page
```typescript
const PropertyDetailPage = ({ propertyId }: { propertyId: string }) => {
  const { property, loading, error } = useProperty(propertyId);
  const { availability, loadingAvailability } = useAvailability(
    propertyId,
    searchDates
  );

  if (loading) return <PropertySkeleton />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className="property-detail">
      <PropertyHeader>
        <PropertyGallery images={property.images} />
        <PropertyOverview
          name={property.name}
          location={property.address}
          rating={property.rating}
          reviews={property.reviews}
        />
      </PropertyHeader>

      <PropertyContent>
        <div className="main-content">
          <PropertyDescription description={property.description} />
          <AmenitiesList amenities={property.amenities} />
          <RoomTypes rooms={property.rooms} />
          <ReviewsSection
            reviews={property.reviews}
            averageRating={property.rating}
          />
          <LocationInfo
            address={property.address}
            nearbyAttractions={property.nearbyAttractions}
          />
        </div>

        <div className="booking-sidebar">
          <BookingWidget
            property={property}
            availability={availability}
            loading={loadingAvailability}
          />
          <ContactInfo property={property} />
          <ShareButtons property={property} />
        </div>
      </PropertyContent>
    </div>
  );
};

const BookingWidget = ({ property, availability, loading }) => {
  const [selectedDates, setSelectedDates] = useState(searchDates);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { createBooking } = useBooking();

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      const booking = await createBooking({
        propertyId: property.id,
        roomId: selectedRoom?.id,
        ...bookingData,
        dates: selectedDates
      });

      // Redirect to booking confirmation
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

  return (
    <div className="booking-widget">
      <PriceDisplay
        price={property.startingPrice}
        currency={property.currency}
        taxes={property.taxes}
      />

      <DateSelector
        dates={selectedDates}
        availability={availability}
        onChange={setSelectedDates}
      />

      <RoomSelector
        rooms={property.rooms}
        selected={selectedRoom}
        onSelect={setSelectedRoom}
        availability={availability}
      />

      <GuestSelector
        maxGuests={selectedRoom?.maxOccupancy || property.maxGuests}
        onChange={setGuestCount}
      />

      <BookingButton
        onBook={handleBookingSubmit}
        disabled={!selectedRoom || loading}
        loading={loading}
      />

      <PolicyInfo policies={property.policies} />
    </div>
  );
};
```

## 💝 Wishlist & Comparison

### Wishlist Management
```typescript
const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Property[]>([]);
  const { user } = useAuth();

  const addToWishlist = async (property: Property) => {
    const updatedWishlist = [...wishlist, property];
    setWishlist(updatedWishlist);

    if (user) {
      await api.post('/api/wishlist', { propertyId: property.id });
    } else {
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    }

    toast.success(`${property.name} added to wishlist`);
  };

  const removeFromWishlist = async (propertyId: string) => {
    const updatedWishlist = wishlist.filter(p => p.id !== propertyId);
    setWishlist(updatedWishlist);

    if (user) {
      await api.delete(`/api/wishlist/${propertyId}`);
    } else {
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    }

    toast.success('Removed from wishlist');
  };

  const isInWishlist = (propertyId: string) => {
    return wishlist.some(p => p.id === propertyId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};

const PropertyComparison = ({ propertyIds }: { propertyIds: string[] }) => {
  const { properties } = useProperties(propertyIds);

  const comparisonData = useMemo(() => {
    const features = [
      'rating', 'priceRange', 'location', 'amenities',
      'roomTypes', 'policies', 'reviews'
    ];

    return features.map(feature => ({
      feature,
      values: properties.map(property => ({
        propertyId: property.id,
        value: getFeatureValue(property, feature)
      }))
    }));
  }, [properties]);

  return (
    <div className="property-comparison">
      <ComparisonHeader properties={properties} />

      <ComparisonTable>
        {comparisonData.map(({ feature, values }) => (
          <ComparisonRow key={feature}>
            <FeatureLabel>{feature}</FeatureLabel>
            {values.map(({ propertyId, value }) => (
              <FeatureValue
                key={propertyId}
                value={value}
                highlight={isHighlightValue(feature, value, values)}
              />
            ))}
          </ComparisonRow>
        ))}
      </ComparisonTable>

      <ComparisonActions>
        <BookSelectedButton />
        <SaveComparisonButton />
        <ShareComparisonButton />
      </ComparisonActions>
    </div>
  );
};
```

## 🧪 Testing

### E2E Testing Examples
```typescript
// e2e/marketplace.spec.ts
import { test, expect } from '@playwright/test';

test.describe('PMS Marketplace', () => {
  test('property search and booking flow', async ({ page }) => {
    // Navigate to marketplace
    await page.goto('/');

    // Search for properties
    await page.fill('[data-testid="location-input"]', 'New York City');
    await page.fill('[data-testid="checkin-date"]', '2024-07-01');
    await page.fill('[data-testid="checkout-date"]', '2024-07-03');
    await page.click('[data-testid="search-button"]');

    // Verify search results
    await expect(page.locator('[data-testid="property-card"]')).toHaveCount({ min: 1 });

    // Filter by price
    await page.click('[data-testid="price-filter"]');
    await page.fill('[data-testid="max-price"]', '200');
    await page.click('[data-testid="apply-filter"]');

    // Select property
    await page.click('[data-testid="property-card"]').first();
    await expect(page).toHaveURL(/\/property\/[^\/]+/);

    // View property details
    await expect(page.locator('h1')).toContainText(/[A-Za-z]/); // Property name
    await expect(page.locator('[data-testid="property-rating"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-amenities"]')).toBeVisible();

    // Start booking process
    await page.click('[data-testid="book-now-button"]');
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
  });

  test('wishlist functionality', async ({ page }) => {
    await page.goto('/search?location=paris');

    // Add to wishlist
    await page.click('[data-testid="wishlist-button"]').first();
    await expect(page.locator('[data-testid="wishlist-added"]')).toBeVisible();

    // Navigate to wishlist
    await page.click('[data-testid="wishlist-nav"]');
    await expect(page).toHaveURL('/wishlist');
    await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount(1);
  });

  test('property comparison', async ({ page }) => {
    await page.goto('/search?location=london');

    // Select multiple properties for comparison
    await page.click('[data-testid="compare-checkbox"]').first();
    await page.click('[data-testid="compare-checkbox"]').nth(1);

    // Open comparison
    await page.click('[data-testid="compare-button"]');
    await expect(page).toHaveURL('/compare');

    // Verify comparison table
    await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-column"]')).toHaveCount(2);
  });
});
```

## 📊 Analytics & Tracking

### User Behavior Tracking
```typescript
const useMarketplaceAnalytics = () => {
  const trackPropertyView = (property: Property) => {
    analytics.track('Property Viewed', {
      propertyId: property.id,
      propertyName: property.name,
      location: property.address.city,
      price: property.startingPrice,
      rating: property.rating
    });
  };

  const trackSearchPerformed = (filters: SearchFilters, resultCount: number) => {
    analytics.track('Search Performed', {
      location: filters.location.query,
      checkIn: filters.dates.checkIn,
      checkOut: filters.dates.checkOut,
      priceRange: `${filters.price.min}-${filters.price.max}`,
      resultCount
    });
  };

  const trackBookingStarted = (property: Property, room: Room) => {
    analytics.track('Booking Started', {
      propertyId: property.id,
      roomId: room.id,
      price: room.price,
      source: 'marketplace'
    });
  };

  return {
    trackPropertyView,
    trackSearchPerformed,
    trackBookingStarted
  };
};
```

## 🤖 Claude AI Development

### Key Development Areas:

1. **Search & Discovery**:
   - `src/components/search/` - Search interface components
   - `src/hooks/useSearch.ts` - Search functionality
   - Advanced filtering and sorting features

2. **Property Display**:
   - `src/components/property/` - Property display components
   - `src/app/property/` - Property detail pages
   - Interactive galleries and maps

3. **Booking Integration**:
   - `src/components/booking/` - Booking workflow components
   - Integration with multiple PMS systems
   - Payment processing integration

4. **User Experience**:
   - Wishlist and comparison features
   - Personalization and recommendations
   - Mobile optimization

### Common Development Tasks:

```bash
# Test search functionality
npm run e2e -- --grep "search"

# Test booking flow
npm run e2e -- --grep "booking"

# Test map functionality
npm run e2e -- --grep "map"

# Performance testing
npm run lighthouse

# Bundle analysis
npm run analyze
```

## 🔗 Related Services

- **[pms-core](https://github.com/charilaouc/pms-core)** - User authentication
- **[pms-backend](https://github.com/charilaouc/pms-backend)** - Property data
- **[api-gateway](https://github.com/charilaouc/api-gateway)** - API routing
- **[pms-guest](https://github.com/charilaouc/pms-guest)** - Booking completion
- **[pms-shared](https://github.com/charilaouc/pms-shared)** - Shared types

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/charilaouc/pms-marketplace/issues)
- **Documentation**: [PMS Docs](https://github.com/charilaouc/pms-docs)
- **Marketplace**: `http://localhost:3013` (when running)
- **Partner Support**: Available for property integration

---

**PMS Marketplace** 🏪 | Property discovery and booking platform