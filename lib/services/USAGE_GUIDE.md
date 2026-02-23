# Search Routes Mock Service - Usage Guide

## Overview

The mock route service provides realistic travel route data for testing and development. It supports 5 major Indian travel corridors with train, bus, and flight options.

## Supported Routes

1. **Delhi ↔ Mumbai** (1,400 km)
   - 3 train options (Rajdhani Express variants)
   - 2 bus options (VRL, Sharma Travels)
   - 3 flight options (IndiGo, Air India, Vistara)

2. **Bangalore ↔ Hyderabad** (570 km)
   - 1 train option (Kacheguda Express)
   - 2 bus options (KSRTC Airavat, Orange Travels)
   - 1 flight option (IndiGo)

3. **Delhi ↔ Bangalore** (2,150 km)
   - 1 train option (Karnataka Express)
   - 2 flight options (IndiGo, Air India)

4. **Chennai ↔ Bangalore** (350 km)
   - 1 train option (Shatabdi Express)
   - 1 bus option (KSRTC Airavat)

5. **Pune ↔ Mumbai** (150 km)
   - 1 train option (Deccan Queen)
   - 1 bus option (MSRTC Shivneri)

---

## Basic Usage

### 1. Import the Service

```typescript
import { searchRoutes } from '@/lib/services/mockRouteService';
```

### 2. Call the Search Function

```typescript
const routes = await searchRoutes({
  origin: 'Delhi',
  destination: 'Mumbai',
  date: '2026-03-15',
  passengers: 2,
  preference: 'balanced'
});

console.log(`Found ${routes.length} routes`);
routes.forEach(route => {
  console.log(`${route.category}: ₹${route.totalCost} - ${route.totalDuration}`);
});
```

### 3. Display in UI

```typescript
import { searchRoutes } from '@/lib/services/mockRouteService';
import { useState } from 'react';

function SearchResults() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const results = await searchRoutes(searchParams);
      setRoutes(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Searching routes...</p>}
      
      {routes.map(route => (
        <div key={route.id} className="route-card">
          <h3>{route.category}</h3>
          <p>Cost: ₹{route.totalCost}</p>
          <p>Duration: {route.totalDuration}</p>
          <p>Reliability: {route.reliability}%</p>
          
          <div className="legs">
            {route.legs.map((leg, i) => (
              <div key={i} className="leg">
                <span>{leg.mode.toUpperCase()}</span>
                <span>{leg.from} → {leg.to}</span>
                <span>₹{leg.cost}</span>
                <span>{leg.duration}</span>
                
                {leg.bookingPlatforms && (
                  <div className="platforms">
                    {leg.bookingPlatforms.map(platform => (
                      <a 
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book on {platform.name}
                        {platform.recommended && ' ⭐'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Input Validation

The service automatically validates input using Zod:

```typescript
// ✅ Valid input
const result1 = await searchRoutes({
  origin: 'Delhi',
  destination: 'Mumbai',
  date: '2026-03-15',
  passengers: 2,
  preference: 'fastest'
});

// ✅ With optional time
const result2 = await searchRoutes({
  origin: 'Bangalore',
  destination: 'Hyderabad',
  date: '2026-04-01',
  time: '08:00',
  passengers: 1,
  preference: 'cheapest'
});

// ✅ With stops
const result3 = await searchRoutes({
  origin: 'Delhi',
  destination: 'Bangalore',
  date: '2026-05-10',
  passengers: 3,
  preference: 'balanced',
  stops: [
    { location: 'Jaipur', duration: 120 },  // 2 hour stop
    { location: 'Udaipur', duration: 240 }  // 4 hour stop
  ]
});

// ❌ Invalid - will throw error
try {
  await searchRoutes({
    origin: 'Delhi',
    destination: 'Delhi',  // Same as origin - ERROR
    date: '2026-03-15',
    passengers: 0  // Less than 1 - ERROR
  });
} catch (error) {
  console.error(error.message);
}
```

---

## Response Structure

```typescript
interface Route {
  id: string;                    // Unique route ID
  totalCost: number;              // Total cost in ₹
  totalDuration: string;          // e.g., "14h 30m"
  totalDurationMinutes: number;   // Duration in minutes
  reliability: number;            // 0-100 score
  category?: string;              // "Fastest", "Cheapest", "Best Value"
  score?: number;                 // Ranking score
  legs: Leg[];                    // Journey segments
}
```

### Each Leg Contains:

```typescript
{
  mode: 'train' | 'bus' | 'flight' | 'metro' | 'taxi' | 'auto' | 'walk',
  from: string,
  to: string,
  departure: string,              // "08:00" format
  arrival: string,
  duration: string,               // "2h 30m" format
  durationMinutes: number,
  cost: number,
  operator?: string,              // "IndiGo", "Rajdhani Express"
  trainNumber?: string,           // "12951"
  flightNumber?: string,          // "6E2343"
  busType?: string,               // "AC Sleeper"
  bookingPlatforms?: BookingPlatform[]
}
```

---

## Preference-Based Ranking

Routes are automatically ranked based on preference:

### Fastest (70% time, 20% cost, 10% reliability)
```typescript
const routes = await searchRoutes({
  ...params,
  preference: 'fastest'
});
// Returns flight options first, then trains, then buses
```

### Cheapest (20% time, 70% cost, 10% reliability)
```typescript
const routes = await searchRoutes({
  ...params,
  preference: 'cheapest'
});
// Returns bus options first, then trains, then flights
```

### Balanced (40% time, 40% cost, 20% reliability)
```typescript
const routes = await searchRoutes({
  ...params,
  preference: 'balanced'
});
// Returns best overall value routes
```

---

## Error Handling

```typescript
import { validateSearchInput } from '@/lib/validation/searchRoutes';

// Manual validation before calling service
const validation = validateSearchInput(userInput);

if (!validation.success) {
  validation.error?.errors.forEach(err => {
    console.error(`${err.path}: ${err.message}`);
  });
} else {
  const routes = await searchRoutes(validation.data);
}

// Or use try-catch
try {
  const routes = await searchRoutes(userInput);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

---

## Future Migration Path

When ready to switch to real data:

```typescript
// lib/services/routeService.ts
import { searchRoutes as mockSearch } from './mockRouteService';
import { searchRoutesReal } from './realRouteService';  // To be built

export async function searchRoutes(input: SearchRoutesInput) {
  // Toggle via environment variable
  if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
    return mockSearch(input);
  }
  
  // Call real APIs: MOTIS, RedBus scraper, Skyscanner
  return searchRoutesReal(input);
}
```

Then update imports:
```typescript
// Change from:
import { searchRoutes } from '@/lib/services/mockRouteService';

// To:
import { searchRoutes } from '@/lib/services/routeService';
```

---

## Testing Examples

```typescript
// Test fastest preference
const fastRoutes = await searchRoutes({
  origin: 'Delhi',
  destination: 'Mumbai',
  date: '2026-03-15',
  passengers: 1,
  preference: 'fastest'
});
console.assert(fastRoutes[0].legs.some(leg => leg.mode === 'flight'));

// Test cheapest preference
const cheapRoutes = await searchRoutes({
  origin: 'Delhi',
  destination: 'Mumbai',
  date: '2026-03-15',
  passengers: 1,
  preference: 'cheapest'
});
console.assert(cheapRoutes[0].totalCost < fastRoutes[0].totalCost);

// Test route categories
const balancedRoutes = await searchRoutes({
  origin: 'Delhi',
  destination: 'Mumbai',
  date: '2026-03-15',
  passengers: 1,
  preference: 'balanced'
});
console.log(balancedRoutes.map(r => r.category));
// Expected: ["Fastest", "Best Value", "Cheapest", ...]
```

---

## Integration with Existing Code

The service is compatible with your existing geocoding service:

```typescript
import { searchCities } from '@/lib/geocoding';
import { searchRoutes } from '@/lib/services/mockRouteService';

// User types city name
const cityResults = searchCities('Delhi', 10);

// User selects a city
const selectedCity = cityResults[0];

// Search routes
const routes = await searchRoutes({
  origin: selectedCity.name,    // "Delhi"
  destination: 'Mumbai',
  date: '2026-03-15',
  passengers: 2,
  preference: 'balanced'
});
```

---

## Performance Notes

- Mock service includes 500ms simulated delay (realistic UX)
- Returns 5-15 routes depending on corridor
- All calculations done in-memory (instant)
- No external API calls

---

**Next Steps:**
1. Integrate into your search UI component
2. Test with different city combinations
3. Style the route cards
4. Add booking platform click tracking
5. Prepare for real data migration (Task #2: RedBus scraper)
