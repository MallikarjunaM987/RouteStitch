# App Flow - RouteStitch Website User Journey
## Production-Level User Flow Documentation

**Version:** 1.0  
**Last Updated:** February 8, 2026  
**Purpose:** Complete website flow for developers and AI to follow

---

## 1. Overall Site Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ROUTESTITCH WEBSITE                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PUBLIC PAGES (No Auth Required)                            │
│  ├─ Home (/)                                                 │
│  ├─ TripBuilder (/plan)                                      │
│  ├─ Search Results (/search)                                 │
│  ├─ How It Works (/how-it-works)                            │
│  ├─ About (/about)                                           │
│  └─ Pricing (/pricing)                                       │
│                                                               │
│  PROTECTED PAGES (Auth Required)                             │
│  ├─ My Trips (/dashboard)                                    │
│  ├─ Profile (/profile)                                       │
│  ├─ Saved Routes (/saved)                                    │
│  └─ Settings (/settings)                                     │
│                                                               │
│  BUSINESS PAGES                                              │
│  └─ For Business (/business)                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed User Flows

### 2.1 First-Time Visitor Journey

```mermaid
flowchart TD
    A[User lands on Home Page] --> B{What's their goal?}
    B -->|Quick Search| C[Enter origin/destination in hero search]
    B -->|Learn More| D[Scroll to Features section]
    B -->|Complex Trip| E[Click "Plan Multi-Stop Trip"]
    
    C --> F[Redirects to TripBuilder with prefilled data]
    D --> G[Reads about features]
    G --> H[Clicks "Start Planning" CTA]
    H --> F
    
    E --> F[TripBuilder Page]
    F --> I[Fill journey details]
    I --> J{Added custom stops?}
    J -->|Yes| K[Configure each stop duration]
    J -->|No| L[Single origin-destination]
    
    K --> M[Click "Find Routes"]
    L --> M
    
    M --> N[Loading... Route Calculation]
    N --> O[Search Results Page]
    
    O --> P[Browse 5+ route options]
    P --> Q{Found suitable route?}
    Q -->|Yes| R[Click "Book via Platform"]
    Q -->|No| S[Refine search parameters]
    S --> M
    
    R --> T[Opens booking platform in new tab]
    T --> U[Optional: User marks as booked]
    U --> V{Has account?}
    V -->|No| W[Prompt to sign up: "Save this trip?"]
    V -->|Yes| X[Auto-save to My Trips]
    
    W --> Y{User signs up?}
    Y -->|Yes| X
    Y -->|No| Z[End - Can still use platform]
```

---

### 2.2 TripBuilder Detailed Flow

**Page: `/plan` (TripBuilder)**

#### UI Layout:

```
┌────────────────────────────────────────────────────────────┐
│  Navbar: [Logo] [Home] [My Trips] [Business] [Login]       │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  🗺️ TRIPBUILDER                                            │
│  Plan your perfect multi-modal journey across India         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📍 FROM                                               │  │
│  │ [Autocomplete Input: City/Address]                   │  │
│  │ [📍 Use My Location]                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕️ Swap                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🎯 TO                                                 │  │
│  │ [Autocomplete Input: City/Address]                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────┬──────────────────┬──────────────────┐│
│  │ 📅 DATE         │ ⏰ TIME         │ 👥 PASSENGERS    ││
│  │ [Datepicker]    │ [HH:MM]         │ [1 ▼]           ││
│  └──────────────────┴──────────────────┴──────────────────┘│
│                                                              │
│  ⚙️ PREFERENCE                                              │
│  ○ Fastest    ○ Cheapest    ● Balanced                      │
│                                                              │
│  ➕ ADD STOPS (Optional)                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [+ Click to add custom stops along the way]          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [🔍 FIND BEST ROUTES]                                      │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

#### User Interaction Steps:

**Step 1:** Enter Origin
- User types "Noida" or clicks "Use My Location"
- Autocomplete shows matching cities/areas
- Selects "Sector 15, Noida, Uttar Pradesh"

**Step 2:** Enter Destination
- User types "Bangalore"
- Selects "Whitefield, Bangalore, Karnataka"

**Step 3:** Select Date/Time
- Opens date picker (default: today)
- Selects "March 15, 2026"
- Time: "08:00" (optional, defaults to "Anytime")

**Step 4:** Choose Passengers
- Dropdown: 1-10 passengers (default: 1)

**Step 5:** Select Preference
- Radio buttons: Fastest / Cheapest / Balanced (default: Balanced)

**Step 6 (Optional):** Add Custom Stops
- Clicks "+ Add Stops"
- **Expands to:**
  ```
  ┌────────────────────────────────────────────┐
  │ Stop 1:                                     │
  │ [Search Location: e.g. Jaipur]             │
  │ Duration: [4 hours ▼] (15min - 72 hours)   │
  │                                             │
  │ [+ Add Another Stop]  [Remove Stop]        │
  └────────────────────────────────────────────┘
  ```
- Adds "Jaipur Railway Station" - Duration: 4 hours
- Adds "Udaipur City Palace" - Duration: 12 hours (overnight)

**Step 7:** Click "Find Best Routes"
- **Backend Process:**
  1. Validate inputs (Zod schema)
  2. Geocode addresses to lat/lng
  3. Call MOTIS API for route options
  4. Scrape/query bus, flight data
  5. Generate all combinations
  6. Rank by preference algorithm
  7. Return top 5 routes
- **Loading state:** Shows skeleton cards with "Searching routes..." (max 5 sec)

**Step 8:** Redirect to Search Results Page

---

### 2.3 Search Results Flow

**Page: `/search?from=...&to=...&date=...` (or `/search/:tripId`)**

#### UI Layout:

```
┌─────────────────────────────────────────────────────────────┐
│  Navbar + Search Summary Bar                                 │
│  [Noida → Jaipur → Udaipur → Bangalore] [15 Mar] [Edit]     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Found 12 routes • Showing top 5                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🏆 BEST VALUE - Train + Metro              [Details ▼]  ││
│  │ ₹3,450  •  17h 30min  •  95% Reliable                   ││
│  │                                                           ││
│  │ 🚕 Uber (30m) → 🚂 Rajdhani (15h 40m) → 🚇 Metro (30m) ││
│  │         → 🚕 Ola (20m)                                   ││
│  │                                                           ││
│  │ Connection Buffers: 40 min 🟢  |  15 min 🟢              ││
│  │                                                           ││
│  │ [VIEW FULL DETAILS] [BOOK VIA PLATFORMS ▼]              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ⚡ FASTEST - Flight + Taxi                 [Details ▼]  ││
│  │ ₹5,560  •  4h 15min  •  85% Reliable                    ││
│  │ ...                                                       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  [Show 7 More Routes]                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### User Interaction:

**View Full Details (Expandable Card):**
```
┌──────────────────────────────────────────────────────────────┐
│  LEG-BY-LEG BREAKDOWN                                         │
│                                                                │
│  Leg 1: 🚕 Uber                                               │
│  From: Home, Sector 15, Noida                                 │
│  To: New Delhi Railway Station                                │
│  Depart: 07:30 AM  |  Arrive: 08:00 AM  |  Duration: 30 min  │
│  Cost: ₹350                                                   │
│  [Pre-book Uber →]                                            │
│                                                                │
│  --- Connection Buffer: 40 min 🟢 Safe ---                   │
│                                                                │
│  Leg 2: 🚂 Rajdhani Express #12951 (3A Class)                │
│  From: New Delhi (NDLS)                                       │
│  To: Mumbai Central                                           │
│  Depart: 08:40 AM  |  Arrive: 11:20 PM  |  Duration: 15h 40m │
│  Cost: ₹2,800                                                 │
│  Availability: ✅ 42 seats available                          │
│                                                                │
│  Book via:                                                    │
│  • IRCTC [₹2,800] [Book →]                                   │
│  • ConfirmTkt [₹2,850] [Book →]                              │
│  • RailYatri [₹2,900 - Includes insurance] [Book →]          │
│                                                                │
│  --- Connection Buffer: 15 min 🟢 Safe ---                   │
│                                                                │
│  Leg 3: 🚇 Mumbai Metro (Blue Line)                          │
│  From: Mumbai Central                                         │
│  To: Andheri                                                  │
│  Depart: 11:35 PM  |  Arrive: 12:05 AM  |  Duration: 30 min  │
│  Cost: ₹40                                                    │
│  [Buy Metro QR Pass →]                                        │
│                                                                │
│  Leg 4: 🚕 Ola Cab                                            │
│  From: Andheri Metro Station                                  │
│  To: Final Destination, Mumbai                                │
│  Depart: 12:10 AM  |  Arrive: 12:30 AM  |  Duration: 20 min  │
│  Cost: ₹260                                                   │
│  [Pre-book Ola →] [Set Reminder for Day-of Booking]          │
│                                                                │
│  TOTAL: ₹3,450  |  17h 30min                                  │
│                                                                │
│  [💾 Save This Route] [📩 Email Itinerary] [📱 Share]       │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

**Booking Flow (External Platform):**
1. User clicks "Book IRCTC →"
2. New tab opens with deep link:
   ```
   https://www.irctc.co.in/nget/train-search?
   trainNo=12951&fromStation=NDLS&toStation=BCT&
   journeyDate=2026-03-15
   ```
3. User completes booking on IRCTC
4. **Optional:** After 30 seconds, RouteStitch shows modal:
   ```
   ┌────────────────────────────────┐
   │ Did you complete your booking? │
   │ [Yes, booked ✓] [Not yet]     │
   └────────────────────────────────┘
   ```
5. If "Yes, booked":
   - **If logged in:** Auto-save to "My Trips" with status "Leg 1 Booked ✓"
   - **If not logged in:** Prompt "Create account to track your booking?"

---

### 2.4 My Trips Dashboard Flow

**Page: `/dashboard` (Protected - Requires Login)**

#### UI Layout:

```
┌──────────────────────────────────────────────────────────────┐
│  MY TRIPS DASHBOARD                                           │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  [Active Trips] [Upcoming] [Past Trips] [Saved Routes]       │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🎯 Noida → Bangalore (via Jaipur, Udaipur)            │  │
│  │ March 15, 2026  •  3 days from now                    │  │
│  │                                                          │  │
│  │ Booking Progress:                                       │  │
│  │ ✅ Train booked (PNR: 1234567890)                      │  │
│  │ ✅ Jaipur stop (Cloak room reserved)                   │  │
│  │ ❌ Udaipur hotel - Book now                            │  │
│  │ ⏳ Return Uber - Book on day of travel                 │  │
│  │                                                          │  │
│  │ [View Full Itinerary] [Track Live (available 24h before)]│ │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 📍 Delhi → Mumbai                                      │  │
│  │ Completed on Jan 10, 2026                              │  │
│  │ Total spent: ₹3,450  •  Connection success: 100% ✅   │  │
│  │ [Rebook Similar Trip]                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Component-Level Interactions

### 3.1 Location Autocomplete Component

**Component:** `<LocationInput />`

**Behavior:**
- User types minimum 2 characters
- Debounce 300ms
- Query pre-loaded city list (instant for top 100 cities)
- If not found, call Nominatim API (cached for 24h)
- Display up to 5 suggestions:
  ```
  [📍 Noida, Uttar Pradesh]
  [📍 Noida Sector 15, Uttar Pradesh]
  [📍 Noida City Center Metro Station]
  ```
- On select: Store full location object (lat/lng/displayName)

---

### 3.2 Date/Time Picker Component

**Component:** `<DateTimeSelector />`

**Constraints:**
- Min date: Today
- Max date: Today + 365 days
- Time: Optional (HH:MM format, 00:00 - 23:59)
- If date is today and time is in past: Show warning "Select future time"

---

### 3.3 Route Card Component

**Component:** `<RouteCard />`

**Props:**
- `route` (object): Contains all leg details
- `onBookClick` (function): Opens booking platform
- `onSave` (function): Save to user's account

**States:**
- **Collapsed:** Show summary only (cost, duration, category)
- **Expanded:** Show leg-by-leg details

**Actions:**
- "View Full Details" → Toggle expansion
- "Book via Platforms" → Dropdown of booking platforms
- "Save Route" → Add to favorites (requires login)
- "Share" → Copy link OR WhatsApp/Email share

---

## 4. Navigation & State Management

### 4.1 URL Structure & Query Params

**Search Query (Shareable URL):**
```
/search?
  from=28.6139,77.2090&fromName=Noida
  &to=12.9716,77.5946&toName=Bangalore
  &date=2026-03-15
  &time=08:00
  &passengers=1
  &preference=balanced
  &stops=jaipur:4h,udaipur:12h
```

**Saved Trip ID:**
```
/search/trip-abc123xyz
```

---

### 4.2 State Management Strategy

**Global State (React Context OR Zustand):**
- User authentication status
- User profile (name, profession, saved addresses)
- Search query params (shareable state)
- Saved routes (synced with DB)

**Local Component State:**
- Form inputs (origin, destination, date, etc.)
- Route search results (fetched from API, cached)
- UI states (loading, errors, modals)

**Persistent State (LocalStorage):**
- Recent searches (last 5)
- User preferences (theme, notification settings)
- Incomplete trips (for logged-out users)

---

## 5. Error States & Edge Cases

### 5.1 No Routes Found
```
┌────────────────────────────────────────────┐
│ 😔 No routes found for your search         │
│                                             │
│ Suggestions:                                │
│ • Try a different date (trains may be full)│
│ • Remove custom stops and try again        │
│ • Search nearby cities                     │
│                                             │
│ [Modify Search]                            │
└────────────────────────────────────────────┘
```

### 5.2 API Timeout (> 10 seconds)
```
┌────────────────────────────────────────────┐
│ ⏱️ Search taking longer than usual...      │
│                                             │
│ We're still searching for the best routes. │
│ Please wait or try:                        │
│ • [Refresh Search]                         │
│ • [Simplify Route] (remove stops)          │
└────────────────────────────────────────────┘
```

### 5.3 Invalid Input
- Origin = Destination: "Origin and destination cannot be the same"
- Date in past: "Please select a future date"
- Empty fields: Red border + "This field is required"

---

## 6. Mobile Responsive Behavior

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Stack form fields vertically (no grid)
- Full-width buttons
- Bottom sheet for "Book via Platforms" (instead of dropdown)
- Sticky search bar when scrolling results
- Swipeable route cards

---

## 7. Performance Considerations

### 7.1 Page Load Optimization
- **Code Splitting:** Each page lazy-loaded (Next.js automatic)
- **Critical CSS:** Inline above-the-fold styles
- **Image Optimization:** Use Next.js `<Image>` with blur placeholders
- **Font Loading:** Preload Google Fonts, FOUT prevention

### 7.2 Search Performance
- **Debounce:** Autocomplete queries (300ms)
- **Caching:** Route results cached in Redis (15 min TTL)
- **Pagination:** Show top 5 routes, load more on demand
- **Skeleton Loading:** Show placeholders during search

---

## 8. Analytics & Tracking

**Events to Track:**
- `search_initiated` (from, to, date, passengers, stops)
- `route_viewed` (route_id, category)
- `booking_platform_clicked` (platform, route_id, leg)
- `route_saved` (route_id)
- `trip_marked_booked` (route_id, leg)
- `error_occurred` (error_type, page)

**Tools:** Plausible Analytics (privacy-focused, GDPR-compliant)

---

**END OF APP FLOW DOCUMENT**

This flow serves as the blueprint for all frontend development. Follow this exactly for production-level user experience.
