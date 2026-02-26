# Mallikarjuna's Tasks - RouteStitch Development
## APIs, Web Scrapers, Backend Services, Hardcore Work

**Date:** February 8, 2026  
**Focus:** External API integrations, web scraping, backend services

---

## 🔥 TODAY'S PRIORITY TASKS (Finish by EOD)

### 1. Nominatim Geocoding API Integration ⭐ CRITICAL
**Time:** 2-3 hours  
**Difficulty:** Medium-Hard

**Tasks:**
- [x] Create `lib/services/geocodingService.ts` (Implemented in `lib/geocoding.ts`)
- [x] Implement Nominatim API wrapper
  ```typescript
  interface Location {
    id: string;
    name: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    displayName: string;
  }

  export async function geocodeAddress(address: string): Promise<Location[]> {
    // Rate limit: 1 req/sec for Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=in&limit=5`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RouteStitch/1.0 (contact@routestitch.com)'
      }
    });
    
    // Parse and transform response
    // Cache results in database (CachedGeocode table)
  }
  ```
- [x] Add rate limiting (1 request/second)
- [x] Implement caching layer (save to PostgreSQL) (Used LRUCache for now)
- [x] Create pre-loaded city list JSON (top 100 Indian cities)
  ```typescript
  // lib/data/topCities.json
  [
    { name: "Delhi", lat: 28.6139, lng: 77.2090, ... },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777, ... },
    // ... 100 cities
  ]
  ```
- [x] Test autocomplete with debouncing

**Success Criteria:**
✅ Can search "Delhi" and get 5 location suggestions  
✅ Rate limit enforced (no API blocks)  
✅ Top 100 cities return instantly (no API call)

---

### 2. RedBus Web Scraper ⭐ CRITICAL
**Time:** 3-4 hours  
**Difficulty:** Hardcore (Web Scraping)

**Tasks:**
- [ ] Install scraping libraries
  ```bash
  npm install axios cheerio p-limit
  ```
- [ ] Create `lib/scrapers/redbusScra per.ts`
- [ ] Implement bus search scraper
  ```typescript
  interface BusResult {
    operator: string;
    departure: string;
    arrival: string;
    duration: string;
    price: number;
    seatsAvailable: number;
    bookingUrl: string;
  }

  export async function scrapeRedBus(
    from: string,
    to: string,
    date: string
  ): Promise<BusResult[]> {
    const url = `https://www.redbus.in/bus-tickets/${from}-to-${to}?doj=${date}`;
    
    // Add delays (1-2 seconds between requests)
    // Rotate User-Agent headers
    // Parse HTML with Cheerio
    // Extract bus details
  }
  ```
- [ ] Add error handling for:
  - Network failures
  - Rate limiting (429 errors)
  - Changed HTML structure
- [ ] Implement result caching (15 min TTL in Redis)
- [ ] Test with real route (Delhi → Jaipur)

**Success Criteria:**
✅ Can scrape 10+ bus options from RedBus  
✅ Handles rate limits gracefully  
✅ Returns structured data with prices

---

### 3. Search Routes API Endpoint
**Time:** 2 hours  
**Difficulty:** Medium

**Tasks:**
- [x] Create `app/api/search-routes/route.ts` (Next.js API route) *(Implemented as Express controller `trip.controller.ts`)*
- [ ] Implement POST handler
  ```typescript
  export async function POST(request: NextRequest) {
    const body = await request.json();
    
    // 1. Validate input with Zod
    const validation = tripInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    // 2. Geocode origin/destination
    const origin = await geocodeAddress(body.origin);
    const destination = await geocodeAddress(body.destination);
    
    // 3. Search routes (initially mock data, later MOTIS)
    const routes = await searchRoutes({
      origin,
      destination,
      date: body.date,
      preference: body.preference
    });
    
    // 4. Rank routes (call Shashank's algorithm)
    const rankedRoutes = rankRoutes(routes, body.preference);
    
    // 5. Return top 5
    return NextResponse.json({ routes: rankedRoutes.slice(0, 5) });
  }
  ```
- [x] Add rate limiting middleware (100 req/min per IP)
- [x] Add error logging (console.error → later Sentry)
- [x] Test with Postman/curl

**Success Criteria:**
✅ API returns 200 for valid input  
✅ Returns 400 for invalid input with clear error message  
✅ Response time < 3 seconds

---

## 📋 SECONDARY TASKS (If Time Permits)

### 4. Google Flights Scraper (Fallback)
**Time:** 2-3 hours  
**Difficulty:** Hardcore

- [ ] Create `lib/scrapers/flightScraper.ts`
- [ ] Scrape Google Flights search results page
- [ ] Extract flight options (airline, time, price)
- [ ] Handle dynamic content (may need Puppeteer for JavaScript rendering)
  ```bash
  npm install puppeteer
  ```
- [ ] Cache results aggressively (flights change slowly)

**Note:** Use Skyscanner Rapid API (500 calls/month FREE) as primary, scraping as backup

---

### 5. Static Route Data Collection
**Time:** 1-2 hours  
**Difficulty:** Easy

- [ ] Manually collect top 10 Indian train corridors data
  - Delhi → Mumbai (Rajdhani, Shatabdi, Duronto)
  - Delhi → Bangalore
  - Mumbai → Bangalore
  - Etc.
- [ ] Create JSON file with static route data
  ```typescript
  // lib/data/popularRoutes.json
  [
    {
      origin: "Delhi",
      destination: "Mumbai",
      modes: ["train", "flight"],
      avgDuration: "16h 30m",
      avgCost: 3500
    }
  ]
  ```
- [ ] Use as fallback when MOTIS unavailable

---

## 🎯 THIS WEEK'S GOALS

- [x] Search API endpoint with MOCK DATA (TODAY) ⭐ HIGHEST PRIORITY
- [x] Nominatim geocoding integration (TODAY/Tomorrow)
- [x] Create top 100 cities JSON file (Tomorrow)
- [ ] RedBus web scraper (Next 2-3 days)
- [ ] Google Flights scraper (Next week)
- [ ] GTFS data collection for MOTIS (Next 2 weeks - LOW PRIORITY)
- [ ] Train booking platform deep links (Next 2 weeks)

---

## 📊 Success Metrics for Today

**By End of Day:**
- ✅ Geocoding API working with caching
- ✅ RedBus scraper returning bus data
- ✅ Search API endpoint functional (even with mock data)
- ✅ No critical errors
- ✅ Code pushed to GitHub

---

## 🔍 Resources

**Documentation:**
- [PRD.md](file:///d:/ShanksWay/shanksway/docs/PRD.md) - Requirements
- [BACKEND_SCHEMA.md](file:///d:/ShanksWay/shanksway/docs/BACKEND_SCHEMA.md) - Database
- [TECH_STACK.md](file:///d:/ShanksWay/shanksway/docs/TECH_STACK.md) - Tech choices
- [fetaure1_workflow.md](file:///d:/ShanksWay/shanksway/docs/fetaure1_workflow.md) - Zero-budget strategy

**External APIs:**
- Nominatim: https://nominatim.org/release-docs/latest/api/Search/
- RedBus: https://www.redbus.in (scraping target)
- Skyscanner Rapid API: https://rapidapi.com/skyscanner/api/skyscanner-flight-search

**Tools:**
- Cheerio docs: https://cheerio.js.org/
- Axios docs: https://axios-http.com/
- Rate limiting: p-limit library

---

## 💬 Coordination

**Dependencies:**
- Shashank is building route ranking algorithm → You'll call it in search API
- Varshitha needs your API endpoint format → Document request/response schema

**API Contract (for Varshitha):**
```typescript
// POST /api/search-routes
// Request body:
{
  origin: string,
  destination: string,
  date: string, // YYYY-MM-DD
  time?: string, // HH:MM
  passengers: number,
  preference: "fastest" | "cheapest" | "balanced",
  stops?: Array<{ location: string, duration: number }>
}

// Response:
{
  routes: Array<{
    id: string,
    totalCost: number,
    totalDuration: string,
    legs: Array<{
      mode: string,
      from: string,
      to: string,
      departure: string,
      arrival: string,
      cost: number
    }>
  }>
}
```

**Blockers:**
- If RedBus blocks scraping, switch to manual data collection temporarily
- If rate limits too strict, add proxy rotation (later)

---

**Happy scraping! 🕷️**
