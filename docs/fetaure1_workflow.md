# TripBuilder Workflow - Production-Ready & Zero-Budget Version

---

## 🎯 **WORKFLOW OVERVIEW**

```
User Input → Data Collection → Route Generation → Display Options → Booking
```

---

## 📋 **DETAILED WORKFLOW (Step-by-Step)**

### **STEP 1: User Input**

**What user sees:**

```
┌─────────────────────────────────────────────────────┐
│  🗺️ TripBuilder - Plan Your Journey                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📍 From:  [Current Location ▼]                     │
│            [Use my location] 📍                      │
│                                                      │
│  📍 To:    [Destination ▼]                          │
│                                                      │
│  📅 Date:  [Select Date]  ⏰ Time: [Anytime ▼]      │
│                                                      │
│  👥 Passengers: [1 ▼]                               │
│                                                      │
│  ⚙️ Preferences:                                    │
│     ○ Fastest    ○ Cheapest    ● Balanced           │
│                                                      │
│  [+ Add Stops (Optional)]                           │
│                                                      │
│         [🔍 Find Best Routes]                       │
└─────────────────────────────────────────────────────┘
```

**Backend Process (Zero Budget):**

1. **Location Input Handling:**
   - Use **Browser Geolocation API** (FREE) for "Current Location"
   - Reverse geocode using **Nominatim API** (FREE, OpenStreetMap)
     - Limitation: 1 request/second
     - Solution: Cache city coordinates in your database
   
2. **City Auto-complete:**
   - Pre-loaded list of top 100 Indian cities in JSON
   - No API needed, instant search
   - File: `src/data/cities.json`

---

### **STEP 2: Data Collection (Zero Budget Strategy)**

**Challenge:** Can't use paid APIs (IRCTC, MakeMyTrip, RedBus)

**Solution: Web Scraping + Static Data + Free APIs**

#### **2.1 Train Data Collection**

**Option A: Static GTFS Data (Recommended for MVP)**
```
Source: Your Python scripts (already have)
- convert_to_gtfs.py (converts CSV to GTFS)
- Data: IRCTC timetables (manually collected once)
- Update frequency: Monthly (manual update)
```

**What you do:**
1. Scrape IRCTC website for train schedules (one-time)
2. Convert to GTFS format using your script
3. Load into MOTIS routing engine
4. MOTIS provides routes via API (FREE)

**Option B: RailYatri API (Semi-Free)**
```
- Unofficial API (community reverse-engineered)
- No official cost, but not reliable long-term
- Use as backup, not primary
```

**Option C: Confirmtkt Public Data**
```
- They show availability publicly
- Can scrape search results page
- Rate limit: 10 requests/min (polite scraping)
```

#### **2.2 Bus Data Collection**

**RedBus Scraping (Zero Cost):**
```python
# Pseudo-code for bus data collection

import requests
from bs4 import BeautifulSoup

def scrape_redbus(origin, destination, date):
    # RedBus shows results without login
    url = f"https://www.redbus.in/bus-tickets/{origin}-to-{destination}"
    
    response = requests.get(url, params={'date': date})
    soup = BeautifulSoup(response.content, 'html.parser')
    
    buses = []
    for bus_card in soup.find_all('div', class_='bus-item'):
        buses.append({
            'operator': bus_card.find('div', class_='travels').text,
            'departure': bus_card.find('div', class_='dp-time').text,
            'arrival': bus_card.find('div', class_='bp-time').text,
            'duration': bus_card.find('div', class_='dur').text,
            'price': bus_card.find('span', class_='fare').text,
            'type': bus_card.find('div', class_='bus-type').text,
            'seats_available': bus_card.find('div', class_='seat-left').text,
            'booking_url': bus_card.find('a')['href']  # Direct booking link
        })
    
    return buses
```

**Alternative: State RTC Websites (FREE)**
```
- MSRTC, KSRTC, UPSRTC have public APIs
- Register for developer access (FREE)
- Limited but sufficient for MVP
```

#### **2.3 Flight Data**

**Option A: Google Flights Scraping**
```
- Google Flights shows prices publicly
- Use Puppeteer to scrape (headless browser)
- Warning: Google may block, use proxies
```

**Option B: Kiwi.com Affiliate API (FREE)**
```
- Free tier: 100 searches/day
- Sufficient for MVP testing
- Upgrade later when revenue comes
```

**Option C: Skyscanner Rapid API (FREE Tier)**
```
- Free: 500 calls/month
- Use only for flight segments
```

#### **2.4 Local Transport (Taxi/Auto/Metro)**

**Uber/Ola (No Official Free API):**
```
Solution: Static Pricing Model
- Pre-calculate average prices for common routes
- Formula: Base fare + (Distance × Per KM rate)
- Example: Uber Delhi Airport → Connaught Place
  - Distance: 15 km
  - Base: ₹150, Per km: ₹12
  - Total: ₹150 + (15 × 12) = ₹330
- Store in database, update quarterly
```

**Metro Data (FREE):**
```
- Delhi Metro: Public API available (FREE)
- Bangalore Metro: GTFS data available (FREE)
- Mumbai Metro: Scrape official website
```

---

### **STEP 3: Route Generation (MOTIS + Custom Logic)**

**How it works:**

#### **3.1 Feed Data to MOTIS**

```javascript
// Your Next.js API route
// File: /app/api/search-routes/route.ts

export async function POST(request) {
  const { origin, destination, date, time, preferences } = await request.json();
  
  // Step 1: Get MOTIS routes (train + bus + metro + walk)
  const motisRoutes = await fetch('http://your-motis-server/api/v1/plan', {
    method: 'POST',
    body: JSON.stringify({
      from: { lat: origin.lat, lng: origin.lng },
      to: { lat: destination.lat, lng: destination.lng },
      date: date,
      time: time,
      modes: ['WALK', 'TRANSIT']  // MOTIS handles this
    })
  });
  
  const transitOptions = await motisRoutes.json();
  
  // Step 2: Add flight options (from your scraped data or API)
  const flightOptions = await getFlights(origin.city, destination.city, date);
  
  // Step 3: Add local transport (first-mile/last-mile)
  const enrichedRoutes = await addLocalTransport(transitOptions, flightOptions);
  
  // Step 4: Calculate all combinations
  const allCombinations = generateCombinations(enrichedRoutes);
  
  // Step 5: Score and rank
  const rankedRoutes = rankRoutes(allCombinations, preferences);
  
  return Response.json({ routes: rankedRoutes.slice(0, 5) });
}
```

#### **3.2 Generate Combinations**

```javascript
function generateCombinations(data) {
  const combinations = [];
  
  // Pure Train
  data.trains.forEach(train => {
    combinations.push({
      type: 'train_only',
      legs: [
        { mode: 'taxi', from: 'Home', to: train.origin_station, cost: 350, duration: 30 },
        { mode: 'train', ...train },
        { mode: 'taxi', from: train.destination_station, to: 'Final Destination', cost: 400, duration: 40 }
      ],
      totalCost: 350 + train.cost + 400,
      totalDuration: 30 + train.duration + 40
    });
  });
  
  // Pure Bus
  data.buses.forEach(bus => {
    combinations.push({
      type: 'bus_only',
      legs: [
        { mode: 'auto', from: 'Home', to: bus.origin_station, cost: 150, duration: 20 },
        { mode: 'bus', ...bus },
        { mode: 'auto', from: bus.destination_station, to: 'Final Destination', cost: 200, duration: 25 }
      ],
      totalCost: 150 + bus.cost + 200,
      totalDuration: 20 + bus.duration + 25
    });
  });
  
  // Train + Metro (if destination has metro)
  if (data.metros.length > 0) {
    data.trains.forEach(train => {
      data.metros.forEach(metro => {
        if (canConnect(train.arrival_station, metro.origin_station)) {
          combinations.push({
            type: 'train_metro',
            legs: [
              { mode: 'taxi', from: 'Home', to: train.origin_station, cost: 350, duration: 30 },
              { mode: 'train', ...train },
              { mode: 'walk', from: train.arrival_station, to: metro.origin_station, cost: 0, duration: 15 },
              { mode: 'metro', ...metro },
              { mode: 'auto', from: metro.destination_station, to: 'Final Destination', cost: 150, duration: 20 }
            ],
            totalCost: 350 + train.cost + 0 + metro.cost + 150,
            totalDuration: 30 + train.duration + 15 + metro.duration + 20
          });
        }
      });
    });
  }
  
  // Flight + Local
  data.flights.forEach(flight => {
    combinations.push({
      type: 'flight_local',
      legs: [
        { mode: 'metro', from: 'Home', to: 'Airport', cost: 60, duration: 45 },
        { mode: 'flight', ...flight },
        { mode: 'taxi', from: 'Destination Airport', to: 'Final Destination', cost: 500, duration: 60 }
      ],
      totalCost: 60 + flight.cost + 500,
      totalDuration: 45 + flight.duration + 60
    });
  });
  
  // Bus + Train (for long journeys)
  // ... add more combinations
  
  return combinations;
}
```

#### **3.3 Scoring Algorithm**

```javascript
function rankRoutes(routes, preferences) {
  routes.forEach(route => {
    // Normalize scores (0-100)
    const minCost = Math.min(...routes.map(r => r.totalCost));
    const maxCost = Math.max(...routes.map(r => r.totalCost));
    const minTime = Math.min(...routes.map(r => r.totalDuration));
    const maxTime = Math.max(...routes.map(r => r.totalDuration));
    
    const costScore = 100 * (1 - (route.totalCost - minCost) / (maxCost - minCost));
    const timeScore = 100 * (1 - (route.totalDuration - minTime) / (maxTime - minTime));
    
    // Reliability score (train > flight > bus)
    const reliabilityScore = route.legs.map(leg => {
      if (leg.mode === 'train') return 90;
      if (leg.mode === 'flight') return 85;
      if (leg.mode === 'bus') return 70;
      if (leg.mode === 'metro') return 95;
      return 80;
    }).reduce((a, b) => a + b, 0) / route.legs.length;
    
    // Comfort score (fewer transfers = better)
    const comfortScore = 100 - (route.legs.length * 10);
    
    // Apply user preference weights
    const weights = {
      fastest: { time: 0.7, cost: 0.2, reliability: 0.1 },
      cheapest: { time: 0.2, cost: 0.7, reliability: 0.1 },
      balanced: { time: 0.4, cost: 0.4, reliability: 0.2 }
    };
    
    const w = weights[preferences];
    route.finalScore = (timeScore * w.time) + (costScore * w.cost) + (reliabilityScore * w.reliability);
    
    // Categorize route
    if (route.totalDuration === minTime) route.category = 'Fastest';
    if (route.totalCost === minCost) route.category = 'Cheapest';
    if (route.finalScore > 80) route.category = 'Best Value';
  });
  
  return routes.sort((a, b) => b.finalScore - a.finalScore);
}
```

---

### **STEP 4: Display Results**

**What user sees:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Found 12 routes from Delhi to Mumbai                            │
│  Showing top 5 options                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║ 🏆 BEST VALUE - Train + Metro                           ║ │
│  ║ ₹3,450  •  17h 30min  •  95% On-time                       ║ │
│  ╠════════════════════════════════════════════════════════════╣ │
│  ║                                                              ║ │
│  ║ 🚕 Uber (30 min) ₹350 → 🚂 Rajdhani (15h 40m) ₹2,800      ║ │
│  ║       → 🚇 Metro (30 min) ₹40 → 🚕 Ola (20 min) ₹260      ║ │
│  ║                                                              ║ │
│  ║ Connection Buffers: 40 min (Safe ✅), 15 min (Safe ✅)      ║ │
│  ║                                                              ║ │
│  ║ [View Full Details]  [Book via Platforms ▼]                ║ │
│  ║                                                              ║ │
│  ║ Book via:                                                    ║ │
│  ║ • IRCTC [Book Train →]                                      ║ │
│  ║ • Uber [Pre-book Ride →]                                    ║ │
│  ║ • Delhi Metro [Buy QR Pass →]                               ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                   │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║ ⚡ FASTEST - Flight + Taxi                                 ║ │
│  ║ ₹5,560  •  4h 15min  •  85% On-time                        ║ │
│  ╠════════════════════════════════════════════════════════════╣ │
│  ║                                                              ║ │
│  ║ 🚇 Metro (45 min) ₹60 → ✈️ IndiGo (2h 15m) ₹4,500         ║ │
│  ║       → 🚕 Uber (1h 15m) ₹1,000                            ║ │
│  ║                                                              ║ │
│  ║ [View Details]  [Book via Platforms ▼]                     ║ │
│  ║                                                              ║ │
│  ║ Book via:                                                    ║ │
│  ║ • MakeMyTrip [Book Flight →]                                ║ │
│  ║ • Goibibo [₹200 cheaper →]                                  ║ │
│  ║ • Uber [Pre-book Airport Ride →]                            ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                   │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║ 💰 CHEAPEST - Bus Only                                     ║ │
│  ║ ₹1,890  •  22h 15min  •  70% On-time                       ║ │
│  ╠════════════════════════════════════════════════════════════╣ │
│  ║                                                              ║ │
│  ║ 🛺 Auto (20 min) ₹150 → 🚌 VRL Sleeper (20h 30m) ₹1,600  ║ │
│  ║       → 🛺 Auto (45 min) ₹290                              ║ │
│  ║                                                              ║ │
│  ║ [View Details]  [Book via Platforms ▼]                     ║ │
│  ║                                                              ║ │
│  ║ Book via:                                                    ║ │
│  ║ • RedBus [₹1,600 →]                                         ║ │
│  ║ • AbhiBus [₹1,550 - Offer! →]                              ║ │
│  ║ • ConfirmTkt [Compare Prices →]                             ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                   │
│  [Show 9 More Routes]                                            │
└──────────────────────────────────────────────────────────────────┘
```

---

### **STEP 5: Platform Availability Check (Zero Budget)**

**How to show "Book via MakeMyTrip, RedBus, etc." without APIs:**

#### **Option 1: Deep Linking (Best for MVP)**

```javascript
// Generate booking URLs dynamically

function generateBookingLinks(route) {
  const links = [];
  
  route.legs.forEach(leg => {
    if (leg.mode === 'train') {
      // IRCTC Deep Link
      links.push({
        platform: 'IRCTC',
        url: `https://www.irctc.co.in/nget/train-search?trainNo=${leg.trainNumber}&fromStation=${leg.origin}&toStation=${leg.destination}&journeyDate=${leg.date}`,
        logo: '/logos/irctc.png',
        note: 'Login required on IRCTC'
      });
      
      // ConfirmTkt Alternative
      links.push({
        platform: 'ConfirmTkt',
        url: `https://www.confirmtkt.com/trains/${leg.origin}-to-${leg.destination}?date=${leg.date}`,
        logo: '/logos/confirmtkt.png',
        note: 'May have Tatkal booking available'
      });
    }
    
    if (leg.mode === 'bus') {
      // RedBus Deep Link
      links.push({
        platform: 'RedBus',
        url: `https://www.redbus.in/bus-tickets/${leg.origin}-to-${leg.destination}?doj=${leg.date}&busType=${leg.busType}`,
        logo: '/logos/redbus.png'
      });
      
      // AbhiBus
      links.push({
        platform: 'AbhiBus',
        url: `https://www.abhibus.com/${leg.origin}-to-${leg.destination}-bus?date=${leg.date}`,
        logo: '/logos/abhibus.png',
        note: 'Often has better prices'
      });
    }
    
    if (leg.mode === 'flight') {
      // MakeMyTrip
      links.push({
        platform: 'MakeMyTrip',
        url: `https://www.makemytrip.com/flight/search?from=${leg.origin}&to=${leg.destination}&date=${leg.date}&class=E`,
        logo: '/logos/mmt.png'
      });
      
      // Goibibo
      links.push({
        platform: 'Goibibo',
        url: `https://www.goibibo.com/flights/${leg.origin}-${leg.destination}-air-tickets?date=${leg.date}`,
        logo: '/logos/goibibo.png',
        note: 'Check for cashback offers'
      });
      
      // Skyscanner
      links.push({
        platform: 'Skyscanner',
        url: `https://www.skyscanner.co.in/transport/flights/${leg.origin}/${leg.destination}/${leg.date}/`,
        logo: '/logos/skyscanner.png',
        note: 'Best for price comparison'
      });
    }
    
    if (leg.mode === 'taxi') {
      // Uber (doesn't support deep link for future bookings, show web link)
      links.push({
        platform: 'Uber',
        url: `https://m.uber.com/`,
        logo: '/logos/uber.png',
        note: 'Book on the day of travel',
        action: 'Set Reminder'  // Add calendar reminder feature
      });
      
      // Ola
      links.push({
        platform: 'Ola',
        url: `https://book.olacabs.com/`,
        logo: '/logos/ola.png',
        note: 'Book on the day of travel'
      });
    }
  });
  
  return links;
}
```

#### **Option 2: Affiliate Links (Zero Cost, Earns Revenue)**

```javascript
// Sign up for affiliate programs (FREE)
// Earn 2-5% commission on each booking

const affiliateLinks = {
  redbus: {
    baseUrl: 'https://www.redbus.in',
    affiliateParam: '?affiliate_id=YOUR_ID',  // They give you this
    commission: '3%'
  },
  makemytrip: {
    baseUrl: 'https://www.makemytrip.com',
    affiliateParam: '?ref=YOUR_REF',
    commission: '2%'
  }
  // ... others
};

// When user clicks, you earn commission (no cost to you!)
```

---

### **STEP 6: Booking Flow**

#### **Scenario A: External Booking (Zero Budget MVP)**

```
User clicks "Book via RedBus"
  ↓
Opens RedBus in new tab with pre-filled search
  ↓
User completes booking on RedBus
  ↓
[Optional] User comes back and marks "Booked ✓"
  ↓
You track conversion (for analytics)
  ↓
You earn affiliate commission (if signed up)
```

**Implementation:**

```javascript
// Your component
<button
  onClick={() => {
    // Track click
    trackEvent('external_booking_click', {
      platform: 'RedBus',
      route_id: route.id,
      leg: 'bus'
    });
    
    // Open in new tab
    window.open(bookingLink.url, '_blank');
    
    // Show follow-up modal (optional)
    setTimeout(() => {
      showModal({
        title: 'Did you complete your booking?',
        actions: [
          { label: 'Yes, booked ✓', action: () => saveBooking(route) },
          { label: 'Not yet', action: () => {} }
        ]
      });
    }, 30000);  // Ask after 30 seconds
  }}
>
  Book on RedBus →
</button>
```

#### **Scenario B: Unified Booking (Future - When You Have Revenue)**

```
User clicks "Book All Legs in One Click"
  ↓
Your platform calls:
  - IRCTC API (₹50K + fees) for train
  - RedBus API (partner agreement) for bus
  - Razorpay for payment (2% fee, but you control UX)
  ↓
Single payment collected
  ↓
Distribute to respective platforms
  ↓
Send all tickets via email
```

**For now: DON'T BUILD THIS (too expensive)**

---

### **STEP 7: Availability Check (Zero Budget)**

**Challenge:** How to show "Confirmed" vs "Waitlist" without paid APIs?

**Solution: Scraping + Caching**

```javascript
// Check availability on-demand (when user clicks route)

async function checkAvailability(leg) {
  if (leg.mode === 'train') {
    // Option 1: Scrape IRCTC (risky, may get blocked)
    const availability = await scrapeIRCTC(leg.trainNumber, leg.date);
    
    // Option 2: Use ConfirmTkt public page
    const confirmTktData = await fetch(
      `https://www.confirmtkt.com/trains/${leg.trainNumber}/availability?date=${leg.date}`
    );
    
    return {
      status: availability.status,  // 'Available', 'RAC', 'Waitlist'
      seatsLeft: availability.count,
      lastChecked: new Date()
    };
  }
  
  if (leg.mode === 'bus') {
    // RedBus shows availability publicly
    const busAvailability = await scrapeRedBus(leg);
    return busAvailability;
  }
  
  // For flights, use Skyscanner free tier API
}

// Cache results for 15 minutes to avoid repeated scraping
```

**Display:**

```
┌────────────────────────────────────────────┐
│ 🚂 Rajdhani Express #12951                 │
│                                             │
│ 3A Class: ✅ Available (42 seats)         │
│ 2A Class: 🟡 RAC (3 left)                 │
│ 1A Class: ❌ Waitlist/15                  │
│                                             │
│ Last checked: 2 minutes ago                │
│ [Check Live Availability →]                │
└────────────────────────────────────────────┘
```

---

## 🎯 **ENHANCED FEATURES (Production-Grade)**

### **Feature 1: Smart Platform Recommendations**

```javascript
// Based on historical data, recommend best platform

const platformScores = {
  train: {
    'IRCTC': { price: 10, speed: 8, reliability: 10, userRating: 7 },
    'ConfirmTkt': { price: 9, speed: 9, reliability: 8, userRating: 8 },
    'RailYatri': { price: 10, speed: 7, reliability: 7, userRating: 6 }
  },
  bus: {
    'RedBus': { price: 8, speed: 9, reliability: 9, userRating: 9 },
    'AbhiBus': { price: 9, speed: 8, reliability: 8, userRating: 7 },
    'MakeMyTrip': { price: 7, speed: 8, reliability: 9, userRating: 8 }
  }
};

// Display recommendation badge
```

**UI:**

```
Book via:
• RedBus [₹1,600] ⭐ Recommended
• AbhiBus [₹1,550] 💰 Best Price
• MakeMyTrip [₹1,700]
```

---

### **Feature 2: Price Comparison Table**

```
┌────────────────────────────────────────────────┐
│ Compare Prices Across Platforms               │
├────────────────────────────────────────────────┤
│                                                 │
│ Platform      Price    Cashback    Final       │
│ RedBus        ₹1,600   -           ₹1,600      │
│ AbhiBus       ₹1,550   ₹50         ₹1,500 ✅   │
│ MakeMyTrip    ₹1,700   ₹100        ₹1,600      │
│ ConfirmTkt    ₹1,580   -           ₹1,580      │
│                                                 │
│ [Book Cheapest →]                              │
└────────────────────────────────────────────────┘
```

---

### **Feature 3: One-Click Multi-Platform Booking**

**For users who want to book everything fast:**

```javascript
// Open all booking links in separate tabs simultaneously

function bookAllLegs(route) {
  route.legs.forEach((leg, index) => {
    setTimeout(() => {
      window.open(leg.bookingLinks[0].url, `_blank_${index}`);
    }, index * 2000);  // Open each tab 2 seconds apart
  });
  
  // Show instructions
  showModal({
    title: '3 tabs opened - book each leg:',
    steps: [
      '1. Tab 1: Book train on IRCTC',
      '2. Tab 2: Book metro pass',
      '3. Tab 3: Pre-book Uber'
    ],
    note: 'Save all confirmation numbers in RouteStitch for tracking'
  });
}
```

---

### **Feature 4: Booking Reminder System**

```javascript
// For legs that can't be pre-booked (like Uber)

function setBookingReminder(leg) {
  const reminderTime = new Date(leg.departureTime);
  reminderTime.setHours(reminderTime.getHours() - 2);  // 2 hours before
  
  // Browser notification API (FREE)
  if ('Notification' in window && Notification.permission === 'granted') {
    scheduleNotification(reminderTime, {
      title: 'Book your Uber now!',
      body: `Your train arrives at ${leg.arrivalTime}. Book Uber for pickup.`,
      actions: [
        { action: 'book', title: 'Open Uber App' },
        { action: 'snooze', title: 'Remind in 30 min' }
      ]
    });
  }
  
  // Also add to Google Calendar (if user connected)
  addToCalendar({
    title: 'Book Uber for Mumbai trip',
    time: reminderTime,
    link: leg.bookingUrl
  });
}
```

---

### **Feature 5: Booking Progress Tracker**

```
My Trip: Delhi → Mumbai (Oct 15, 2025)

┌────────────────────────────────────────┐
│ Booking Status:                        │
│                                         │
│ ✅ Train booked (PNR: 1234567890)     │
│ ✅ Metro pass bought (QR saved)       │
│ ⏳ Uber - Book 2 hours before         │
│ ❌ Return journey - Not booked yet    │
│                                         │
│ [View All Tickets]                     │
└────────────────────────────────────────┘
```

---

## 💡 **PRACTICAL ENHANCEMENTS**

### **Enhancement 1: