# Varshitha's Tasks - RouteStitch Development
## Frontend Development, UI/UX, Intermediate Work

**Date:** February 8, 2026  
**Focus:** User interface components, forms, responsive design

---

## 🔥 TODAY'S PRIORITY TASKS (Finish by EOD)

### 1. Complete TripBuilder Form Components ⭐ CRITICAL
**Time:** 3-4 hours  
**Difficulty:** Intermediate

**Current Status:**
- ✅ TripBuilderInput component exists (needs polishing)
- ✅ LocationInput component exists (needs integration)
- ⚠️ DateTimeSelector needs work
- ❌ PreferenceSelector incomplete
- ❌ PassengerSelector incomplete

**Tasks:**
- [ ] **Fix and polish LocationInput.tsx**
  - Ensure it uses Mallikarjuna's geocoding API (once ready)
  - Add loading spinner while fetching suggestions
  - Add "Use My Location" button (browser geolocation)
  - Style autocomplete dropdown properly
  ```tsx
  // components/TripBuilder/LocationInput.tsx
  // Should show:
  // - Search icon
  // - Input field with placeholder "Search city or address..."
  // - Dropdown with max 5 suggestions
  // - Loading state
  // - Error state ("No results found")
  ```

- [ ] **Complete DateTimeSelector.tsx**
  - Use shadcn/ui Calendar component OR React-Datepicker
  - Date: Min = Today, Max = Today + 365 days
  - Time: Optional, HH:MM format (24-hour)
  - Add clear visual design
  ```tsx
  // components/TripBuilder/DateTimeSelector.tsx
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label>Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </div>
    <div>
      <label>Time (Optional)</label>
      <Input type="time" value={time} onChange={...} />
    </div>
  </div>
  ```

- [ ] **Complete PreferenceSelector.tsx**
  - Radio buttons: Fastest / Cheapest / Balanced
  - Add icons (⚡ Fastest, 💰 Cheapest, ⚖️ Balanced)
  - Visual highlight when selected
  - Default: Balanced
  ```tsx
  // components/TripBuilder/PreferenceSelector.tsx
  <div className="flex gap-4">
    <PreferenceCard 
      icon={<Zap />} 
      label="Fastest" 
      selected={preference === 'fastest'}
      onClick={() => setPreference('fastest')}
    />
    {/* Similar for others */}
  </div>
  ```

- [ ] **Complete PassengerSelector.tsx**
  - Simple dropdown: 1-10 passengers
  - Show passenger icon
  ```tsx
  // components/TripBuilder/PassengerSelector.tsx
  <Select value={passengers} onValueChange={setPassengers}>
    <SelectTrigger>
      <Users className="mr-2" />
      {passengers} passenger{passengers > 1 ? 's' : ''}
    </SelectTrigger>
    <SelectContent>
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <SelectItem key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  ```

**Success Criteria:**
✅ TripBuilder form looks polished and professional  
✅ All form fields have proper validation errors  
✅ Mobile responsive (test on phone screen size)

---

### 2. Route Card Component for Search Results ⭐ CRITICAL
**Time:** 2-3 hours  
**Difficulty:** Easy-Medium

**Tasks:**
- [ ] Create `components/SearchResults/RouteCard.tsx`
- [ ] Design route card layout
  ```tsx
  // Visual design:
  ┌─────────────────────────────────────────────────┐
  │ 🏆 BEST VALUE - Train + Metro        [Details]  │
  │ ₹3,450 • 17h 30min • 95% Reliable               │
  │                                                  │
  │ 🚕 Uber (30m) → 🚂 Train (15h) → 🚇 Metro (30m)│
  │                                                  │
  │ Connection Buffers: 40 min 🟢 | 15 min 🟢       │
  │                                                  │
  │ [VIEW DETAILS] [BOOK NOW]                       │
  └─────────────────────────────────────────────────┘
  ```
- [ ] Add route category badge (🏆 BEST VALUE, ⚡ FASTEST, 💰 CHEAPEST)
- [ ] Show transport mode icons (🚂🚌✈️🚇🚕)
- [ ] Add expand/collapse functionality
- [ ] Style with Tailwind CSS using brand colors
- [ ] Add hover effects and transitions

**Expanded View:**
```tsx
// When user clicks "VIEW DETAILS", show:
- Leg-by-leg breakdown
- Departure/arrival times per leg
- Platform booking options with prices
- Connection buffer times with risk indicators
```

**Success Criteria:**
✅ Card looks professional and easy to scan  
✅ Expand/collapse works smoothly  
✅ Mobile responsive (cards stack vertically)

---

### 3. Search Results Page Layout
**Time:** 1-2 hours  
**Difficulty:** Easy

**Tasks:**
- [ ] Create `app/search/page.tsx` (or update existing)
- [ ] Add search summary bar at top
  ```tsx
  // Search summary:
  Delhi → Bangalore | 15 Mar 2026 | 1 passenger | Balanced
  [Edit Search Button]
  ```
- [ ] Display "Found X routes • Showing top 5"
- [ ] Render list of RouteCard components
- [ ] Add loading state (skeleton cards)
- [ ] Add empty state ("No routes found")
- [ ] Add error state (connection error)

**Success Criteria:**
✅ Page loads route results from API  
✅ Shows loading state while fetching  
✅ Handles errors gracefully

---

## 📋 SECONDARY TASKS (If Time Permits)

### 4. Navbar Component Polish
**Time:** 1 hour  
**Difficulty:** Easy

- [ ] Update `components/Navbar.tsx`
- [ ] Add logo (create simple text logo or use icon)
- [ ] Navigation links: Home | TripBuilder | My Trips | About
- [ ] Add Sign In button (if not logged in)
- [ ] Add user avatar dropdown (if logged in)
- [ ] Make responsive (hamburger menu on mobile)
- [ ] Sticky navbar on scroll

---

### 5. Home Page Hero Section
**Time:** 1-2 hours  
**Difficulty:** Easy

- [ ] Create/update `app/page.tsx` (Home page)
- [ ] Add hero section
  ```tsx
  <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
    <h1 className="text-5xl font-bold">
      Plan Your Perfect Journey Across India
    </h1>
    <p className="text-xl mt-4">
      Compare trains, buses, flights & local transport in one search
    </p>
    <Link href="/plan">
      <Button size="lg" className="mt-8">
        Start Planning Now →
      </Button>
    </Link>
  </section>
  ```
- [ ] Add quick search bar (simplified TripBuilder)
- [ ] Add feature highlights section
  - Multi-stop planning
  - Connection guarantee
  - Platform comparison

---

## 🎯 THIS WEEK'S GOALS

- [x] TripBuilder form components (TODAY)
- [x] Route card component (TODAY)
- [x] Search results page (TODAY)
- [ ] Navbar polish (TODAY/Tomorrow)
- [ ] Home page hero (Tomorrow)
- [ ] Footer component (Next 2 days)
- [ ] My Trips dashboard UI (Next week)

---

## 📊 Success Metrics for Today

**By End of Day:**
- ✅ TripBuilder form is complete and polished
- ✅ Route card component designed and working
- ✅ Search results page displays routes
- ✅ No console errors or warnings
- ✅ Mobile responsive (tested in Chrome DevTools)
- ✅ Code pushed to GitHub

---

## 🎨 Design Guidelines

**Colors (from PRD):**
- Primary: `#00D9FF` (bright cyan)
- Secondary: `#FFB800` (golden yellow)
- Use Tailwind's `bg-blue-500`, `text-cyan-400` etc. as close matches

**Typography:**
- Font: Inter (Google Fonts) - already in project
- Headings: font-bold, text-2xl to text-5xl
- Body: text-base, font-normal

**Spacing:**
- Use Tailwind's spacing scale (p-4, m-6, gap-2, etc.)
- Keep consistent padding/margins

**Components to Use:**
- shadcn/ui components (Button, Input, Card, Select, Calendar, Popover)
- Already installed, just import and use

**Responsive Design:**
- Mobile first approach
- Test at: 320px (mobile), 768px (tablet), 1024px (desktop)
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`

---

## 🔍 Resources

**Documentation:**
- [APP_FLOW.md](file:///d:/ShanksWay/shanksway/docs/APP_FLOW.md) - UI layouts and user flows
- [FRONTEND_GUIDELINES.md](file:///d:/ShanksWay/shanksway/docs/FRONTEND_GUIDELINES.md) - Coding standards
- [PRD.md](file:///d:/ShanksWay/shanksway/docs/PRD.md) - Feature requirements

**External:**
- shadcn/ui: https://ui.shadcn.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/icons

**Existing Components (Reference):**
- `components/TripBuilder/TripBuilderInput.tsx` - Main form
- `components/TripBuilder/LocationInput.tsx` - Location search
- Use these as starting points

---

## 💬 Coordination

**Dependencies:**
- Mallikarjuna is building the search API → He'll share the API endpoint format with you
- Shashank is handling backend → Focus on frontend, use mock data if API not ready

**API Format (Expected):**
```typescript
// When calling /api/search-routes:
// You send:
{
  origin: "Delhi",
  destination: "Bangalore",
  date: "2026-03-15",
  passengers: 1,
  preference: "balanced"
}

// You receive:
{
  routes: [
    {
      id: "route-1",
      totalCost: 3450,
      totalDuration: "17h 30min",
      category: "BEST_VALUE", // or "FASTEST", "CHEAPEST"
      legs: [
        {
          mode: "taxi",
          from: "Home, Noida",
          to: "New Delhi Railway Station",
          departure: "07:30",
          arrival: "08:00",
          duration: "30min",
          cost: 350
        },
        // ... more legs
      ]
    }
  ]
}
```

**Mock Data (Use Until API Ready):**
- Create `lib/mockData/routes.json` with sample routes
- Import and use in components

---

## 🧪 Testing Checklist

Before pushing code:
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No console errors/warnings
- [ ] Tested on Chrome Desktop
- [ ] Tested on Chrome Mobile view (DevTools)
- [ ] All form validations work
- [ ] Loading states show properly
- [ ] Error states show helpful messages

---

**Build beautiful UIs! 🎨**
