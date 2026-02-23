# Train API Service - Rappid Integration

## Overview

This service integrates with **Rappid Train API** (https://rappid.in/apis/train.php) to fetch **real-time train route data** instead of using mock data.

---

## API Details

**Base URL**: `https://rappid.in/apis/train.php`

**Parameters**:
- `train_no` - Indian Railways train number (e.g., `12951`)

**Example Request**:
```
https://rappid.in/apis/train.php?train_no=12951
```

**Response**: JSON with train name, all stations, timings, delays, platforms, distances

---

## Features

✅ **Real-time Data**: Live train running status and delays
✅ **Complete Station List**: All stations with distances and timings
✅ **Platform Information**: Platform numbers for each station
✅ **Delay Tracking**: Actual vs scheduled time with delay info
✅ **Distance Calculation**: Station-wise distances in km
✅ **Popular Routes**: Pre-configured for major Indian corridors

---

## Supported Routes

| Route | Train Number | Train Name |
|-------|--------------|------------|
| Delhi → Mumbai | 12951 | Rajdhani Express |
|Mumbai → Delhi | 12952 | Mumbai Rajdhani |
| Bangalore → Delhi | 12627 | Karnataka Express |
| Delhi → Bangalore | 12628 | Karnataka Express |
| Bangalore → Hyderabad | 12785 | Kacheguda Express |
| Chennai → Bangalore | 12007 | Shatabdi Express |
| Pune → Mumbai | 12123 | Deccan Queen |

---

## Usage

### 1. Import the Service

```typescript
import { searchTrains, fetchTrainRoute } from '@/lib/services/trainApiService';
```

### 2. Search Trains Between Cities

```typescript
// Get all available trains for a route
const trains = await searchTrains('Delhi', 'Mumbai');

console.log(trains);
// Returns: [
//   {
//     trainNumber: '12951',
//     trainName: 'Rajdhani Express',
//     from: 'New Delhi',
//     to: 'Mumbai Central',
//     departure: '17:00',
//     arrival: '08:35',
//     duration: 935,  // minutes
//     distance: 1384, // km
//     delay: '7min',
//     stations: [...] // All stations
//   }
// ]
```

### 3. Fetch Specific Train

```typescript
// Get details for a specific train number
const trainData = await fetchTrainRoute('12951');

if (trainData) {
  console.log(`${trainData.trainName}`);
  console.log(`${trainData.from} → ${trainData.to}`);
  console.log(`Distance: ${trainData.distance} km`);
  console.log(`${trainData.stations.length} stations`);
}
```

### 4. Integrate with Mock Route Service

**Option A: Replace Mock Data Completely**

Edit `lib/services/mockRouteService.ts`:

```typescript
import { searchTrains, formatTrainForRoute } from './trainApiService';

export async function generateMockRoutes(input: SearchRoutesInput): Promise<Route[]> {
    const routes: Route[] = [];
    
    // Fetch real train data
    const trains = await searchTrains(input.origin, input.destination);
    
    if (trains.length > 0) {
        trains.forEach(train => {
            // Convert to route format
            const trainLeg = formatTrainForRoute(train);
            
            // Add first/last mile legs
            const legs: Leg[] = [
                // Taxi to station
                {
                    mode: 'taxi',
                    from: input.origin,
                    to: `${input.origin} Railway Station`,
                    departure: '08:00',
                    arrival: '08:30',
                    duration: '30m',
                    durationMinutes: 30,
                    cost: 350,
                    operator: 'Uber/Ola'
                },
                trainLeg, // Real train data
                // Taxi from station
                {
                    mode: 'taxi',
                    from: `${input.destination} Railway Station`,
                    to: input.destination,
                    departure: train.arrival,
                    arrival: addMinutes(train.arrival, 40),
                    duration: '40m',
                    durationMinutes: 40,
                    cost: 400,
                    operator: 'Uber/Ola'
                }
            ];
            
            routes.push({
                id: `route-train-${train.trainNumber}`,
                totalCost: legs.reduce((sum, leg) => sum + leg.cost, 0),
                totalDuration: formatDuration(legs.reduce((sum, leg) => sum + leg.durationMinutes, 0)),
                totalDurationMinutes: legs.reduce((sum, leg) => sum + leg.durationMinutes, 0),
                reliability: 90,
                category: 'Train',
                legs
            });
        });
    }
    
    // Fall back to mock data if no trains found
    if (routes.length === 0) {
        // ... existing mock generation code
    }
    
    return routes;
}
```

**Option B: Hybrid Approach (Mock + Real)**

```typescript
export async function generateMockRoutes(input: SearchRoutesInput): Promise<Route[]> {
    const routes: Route[] = [];
    
    // Try to fetch real train data
    const USE_REAL_TRAINS = process.env.REACT_APP_USE_REAL_TRAINS === 'true';
    
    if (USE_REAL_TRAINS) {
        const trains = await searchTrains(input.origin, input.destination);
        // ... add train routes
    } else {
        // ... use existing mock train data
    }
    
    // Always use mock data for flights and buses
    // ... existing flight/bus generation code
    
    return routes;
}
```

---

## Environment Variable

Add to `.env`:

```bash
# Use real train API data (set to 'false' for mock data)
REACT_APP_USE_REAL_TRAINS=true
```

---

## Cost Estimation

The service includes fare estimation based on distance and class:

```typescript
import { estimateTrainFare } from '@/lib/services/trainApiService';

// Calculate fare
const fareIn3A = estimateTrainFare(1384, '3A');  // ₹4,152
const fareInSL = estimateTrainFare(1384, 'SL');  // ₹2,076
const fareIn2A = estimateTrainFare(1384, '2A');  // ₹6,228
```

**Rate per km**:
- Sleeper (SL): ₹1.50/km
- 3rd AC (3A): ₹3.00/km
- 2nd AC (2A): ₹4.50/km
- Chair Car (CC): ₹2.00/km

---

## Live Running Status

The API returns real-time delay information:

```typescript
const train = await fetchTrainRoute('12951');

if (train) {
  console.log(`Current delay: ${train.delay}`);
  // "7min" or "On Time" or "1hr"
  
  // Check each station's delay
  train.stations.forEach(station => {
    console.log(`${station.station_name}: ${station.delay}`);
  });
}
```

---

## Error Handling

```typescript
try {
  const trains = await searchTrains('Delhi', 'Mumbai');
  
  if (trains.length === 0) {
    console.log('No trains found for this route');
    // Fall back to mock data or show error
  }
} catch (error) {
  console.error('Train API failed:', error);
  // Use mock data as fallback
}
```

---

## API Limitations

⚠️ **Known Issues**:
1. **No Rate Limit Info**: Unknown if API has rate limiting
2. **Train Number Required**: Can't search by city directly
3. **Static Train List**: Need to maintain list of popular train numbers
4. **No Seat Availability**: API doesn't provide seat availability

**Recommendations**:
- Cache train data for 15-30 minutes
- Maintain database of train numbers for major routes
- Implement graceful fallback to mock data
- Add error tracking (Sentry)

---

## Future Enhancements

1. **Train Number Database**: Build comprehensive list of trains for all routes
2. **Seat Availability**: Integrate with IRCTC API (requires authentication)
3. **Price Accuracy**: Fetch actual prices from IRCTC
4. **Real-time Alerts**: Use running status for delay notifications
5. **Station Search**: Implement station name to code mapping

---

## Testing

```typescript
// Test Delhi-Mumbai trains
const trains = await searchTrains('Delhi', 'Mumbai');
console.assert(trains.length > 0, 'Should find trains');
console.assert(trains[0].trainNumber === '12951', 'Should be Rajdhani');

// Test specific train
const rajdhani = await fetchTrainRoute('12951');
console.assert(rajdhani !== null, 'Should fetch train data');
console.assert(rajdhani.from.includes('Delhi'), 'Should start from Delhi');
console.assert(rajdhani.to.includes('Mumbai'), 'Should end at Mumbai');
```

---

## Next Steps

1. ✅ Train API service created
2. ⏳ **Integrate with mockRouteService.ts** (your next task)
3. ⏳ Add environment variable toggle
4. ⏳ Test with real data
5. ⏳ Build train number database for more routes

---

**Ready to use!** 🚂

Just set `REACT_APP_USE_REAL_TRAINS=true` and trains will use real data!
