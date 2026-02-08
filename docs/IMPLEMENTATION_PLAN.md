# Implementation Plan - RouteStitch MVP Development
## 90-Day Production Rollout Plan

**Version:** 1.0  
**Last Updated:** February 8, 2026  
**Timeline:** 90 days (3 months)  
**Team Size:** 1-2 developers + AI assistance

---

## Phase 1: Foundation (Days 1-30)

### Week 1-2: Project Setup & Infrastructure

**Deliverables:**
- [ ] Next.js 14 project initialized
- [ ] PostgreSQL database setup (Neon)
- [ ] Prisma schema defined and migrated
- [ ] Authentication (NextAuth.js + Google OAuth)
- [ ] CI/CD pipeline (GitHub Actions → Vercel)
- [ ] Environment variables configured
- [ ] Error tracking (Sentry) integrated

**Tasks:**
```bash
# Day 1-2: Init Project
npx create-next-app@latest routestitch --typescript --tailwind --app
cd routestitch
npm install prisma @prisma/client next-auth swr zustand zod

# Day 3-4: Database Setup
npx prisma init
# Copy schema from BACKEND_SCHEMA.md
npx prisma migrate dev --name init
npx prisma generate

# Day 5-7: Auth Setup
npm install next-auth @auth/prisma-adapter
# Configure NextAuth with Google OAuth
# Create login/signup pages

# Day 8-10: Deploy Infrastructure
# Setup Vercel project
# Configure production environment variables
# Setup Sentry error tracking
```

**Success Criteria:**
- ✅ App deploys to Vercel successfully
- ✅ Database accessible and migrations working
- ✅ User can sign up/login with Google
- ✅ No errors in Sentry

---

### Week 3-4: Core UI Components

**Deliverables:**
- [ ] Navbar component
- [ ] Reusable Button, Input, Card components
- [ ] TripBuilder form UI (without logic)
- [ ] Loading states and skeletons
- [ ] Error boundary and 404/500 pages  

**Tasks:**
```typescript
// components/shared/Button.tsx
// components/shared/Input.tsx
// components/shared/Card.tsx
// components/Navbar.tsx
// components/TripBuilder/TripBuilderInput.tsx
// components/TripBuilder/LocationInput.tsx
// components/TripBuilder/DateTimeSelector.tsx
```

**Design System:**
- Colors: `#00D9FF` (primary), `#FFB800` (accent)
- Font: Inter (Google Fonts)
- Spacing: 4px base unit (0.25rem)
- Breakpoints: 640px, 768px, 1024px, 1280px

**Success Criteria:**
- ✅ All reusable components documented in Storybook (optional)
- ✅ Mobile-responsive (tested on Chrome DevTools)
- ✅ Accessible (keyboard navigation works)

---

## Phase 2: Core Features (Days 31-60)

### Week 5-6: TripBuilder Functionality

**Deliverables:**
- [ ] Location autocomplete (Nominatim API)
- [ ] Form validation (React Hook Form + Zod)
- [ ] Date/time picker
- [ ] Custom stops feature (add/remove stops)
- [ ] Search API endpoint

**Implementation:**
```typescript
// lib/validation/tripInput.ts - Zod schemas
// lib/services/searchRoutesService.ts - API logic
// app/api/search-routes/route.ts - Next.js API route
```

**Key Features:**
1. **Location Autocomplete:**
   - Debounce 300ms
   - Cache top 100 cities (pre-loaded JSON)
   - Fallback to Nominatim for addresses

2. **Custom Stops:**
   - Unlimited stops
   - Duration input (15 min - 72 hours)
   - Visual timeline preview

3. **Form Validation:**
   - Real-time error messages
   - Disabled submit button if invalid

**Success Criteria:**
- ✅ User can search Delhi → Bangalore
- ✅ Form prevents invalid submissions
- ✅ Autocomplete works within 1 second

---

### Week 7-8: Route Search & Display

**Deliverables:**
- [ ] MOTIS routing engine integration
- [ ] Route ranking algorithm
- [ ] Search results page
- [ ] Route card components
- [ ] Platform marketplace (booking links)

**MOTIS Setup:**
```bash
# Run MOTIS via Docker
docker pull motis/motis:latest
docker run -d -p 8080:8080 -v $(pwd)/gtfs_data:/data motis/motis

# Manually collect GTFS data for:
# - Indian Railways (top 10 corridors)
# - KSRTC, MSRTC (state RTCs)
```

**Route Ranking Algorithm:**
```typescript
// lib/services/routeRanking.ts
function rankRoutes(routes: Route[], preference: Preference) {
  const weights = {
    fastest: { time: 0.7, cost: 0.2, reliability: 0.1 },
    cheapest: { time: 0.2, cost: 0.7, reliability: 0.1 },
    balanced: { time: 0.4, cost: 0.4, reliability: 0.2 },
  };
  
  // Normalize scores and apply weights
  // Return top 5 routes
}
```

**Success Criteria:**
- ✅ Search returns 5+ route options within 3 seconds
- ✅ Routes ranked correctly per preference
- ✅ Booking platform links work (deep links pre-filled)

---

## Phase 3: Enhanced Features (Days 61-90)

### Week 9-10: User Dashboard & Trip Tracking

**Deliverables:**
- [ ] My Trips dashboard
- [ ] Save trip functionality
- [ ] Booking progress tracker
- [ ] Mark legs as booked
- [ ] Saved routes feature

**Database Operations:**
```typescript
// Create trip when user searches
// Update trip when user marks leg as booked
// Display active/upcoming/past trips
```

**Success Criteria:**
- ✅ User can view all their trips
- ✅ Booking status persists across sessions
- ✅ Saved routes can be re-used for new searches

---

### Week 11: Connection Guarantee System

**Deliverables:**
- [ ] Buffer time calculator
- [ ] Risk indicators (🟢 Safe, 🟡 Moderate, 🔴 Risky)
- [ ] Guarantee policy display
- [ ] Email notification system

**Buffer Calculation:**
```typescript
// lib/services/bufferCalculator.ts
function calculateBuffer(leg1: Leg, leg2: Leg) {
  const baseBuffer = 30; // minutes
  
  // Adjust for peak hours
  const isPeakHour = checkPeakHour(leg1.arrivalTime);
  const peakMultiplier = isPeakHour ? 1.5 : 1.0;
  
  // Adjust for mode (train delays more than metro)
  const modeMultiplier = leg1.mode === 'train' ? 1.2 : 1.0;
  
  return Math.max(15, baseBuffer * peakMultiplier * modeMultiplier);
}
```

**Success Criteria:**
- ✅ Buffer times displayed for all connections
- ✅ Visual indicators shown
- ✅ Email sent when connection at risk (future: real-time tracking)

---

### Week 12: Polish & Testing

**Deliverables:**
- [ ] Performance optimization (Lighthouse 90+ score)
- [ ] SEO metadata (all pages)
- [ ] Error handling (all edge cases)
- [ ] Unit tests (critical functions)
- [ ] User acceptance testing (UAT)

**Performance Checklist:**
- [ ] Bundle size < 200KB
- [ ] Images optimized (WebP format)
- [ ] Code splitting enabled
- [ ] Caching headers configured

**SEO Checklist:**
- [ ] Meta titles/descriptions on all pages
- [ ] Open Graph images
- [ ] Sitemap.xml generated
- [ ] robots.txt configured

**Testing:**
```bash
# Unit tests
npm run test

# E2E tests (optional for MVP)
npx playwright test

# Performance audit
npm run build
npx lighthouse http://localhost:3000
```

**Success Criteria:**
- ✅ Lighthouse score: 90+ (all categories)
- ✅ No critical bugs
- ✅ 10 beta users can successfully search & book

---

## Deployment Strategy

### MVP Launch (Day 90)

**Pre-Launch Checklist:**
- [ ] All features tested on staging
- [ ] Database backed up
- [ ] Environment variables set in production
- [ ] Error tracking (Sentry) verified
- [ ] Analytics (Plausible) integrated
- [ ] Domain configured (routestitch.com)
- [ ] SSL certificate active

**Launch Steps:**
1. Merge `develop` → `main` branch
2. Vercel auto-deploys to production
3. Run smoke tests on production URL
4. Monitor Sentry for 24 hours
5. Announce launch to waitlist (1,000 users)

**Rollback Plan:**
If critical issues:
```bash
# Revert to previous deployment
vercel rollback
```

---

## Post-Launch (Month 4-6)

### Month 4: Iteration & Feedback

**Focus:**
- Gather user feedback (surveys, interviews)
- Fix bugs reported by users
- Optimize slow queries (if any)

**Metrics to Monitor:**
- Search success rate (% of searches returning routes)
- Search-to-click conversion (% clicks on booking platforms)
- User retention (% returning within 30 days)

### Month 5: Feature Enhancements

**Potential Additions:**
- Live train tracking (if API available)
- Hotel booking integration (OYO/Goibibo API)
- Group booking mode
- Email itinerary export

### Month 6: Scale & Marketing

**Infrastructure Scaling:**
- Upgrade database (if > 10K users)
- Add read replicas (if query latency > 500ms)
- Implement Redis caching (if not already)

**Marketing:**
- SEO content (blog posts on top routes)
- Social media campaigns
- Partnerships with travel influencers

---

## Resource Allocation

### Developer Time Breakdown

| Phase | Hours/Week | Total Hours |
|-------|------------|-------------|
| Week 1-2: Setup | 30 | 60 |
| Week 3-4: UI | 30 | 60 |
| Week 5-6: TripBuilder | 40 | 80 |
| Week 7-8: Search | 40 | 80 |
| Week 9-10: Dashboard | 30 | 60 |
| Week 11: Guarantee | 30 | 30 |
| Week 12: Polish | 40 | 40 |
| **Total** | | **410 hours** |

**Cost Estimate (If Hiring):**
- Developer @ $30/hour: 410hrs × $30 = $12,300
- OR Solo founder: 410 hours over 3 months (34 hrs/week)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| MOTIS setup fails | Use static route data as fallback |
| API rate limits hit | Aggressive caching, rotate proxies |
| Low user adoption | Pre-validate with 1,000 waitlist signups |
| Performance issues | Load testing before launch (k6.io) |
| Data privacy concerns | GDPR-compliant privacy policy, minimal data collection |

---

## Success Metrics (Day 90)

**Must-Have:**
- [ ] 1,000 waitlist signups converted to active users
- [ ] 50+ searches per day
- [ ] 10% search-to-click conversion
- [ ] < 1% error rate (Sentry)
- [ ] 90+ Lighthouse score

**Nice-to-Have:**
- [ ] Featured on ProductHunt
- [ ] 100+ email subscribers
- [ ] First affiliate commission earned

---

## Daily Standup Format (For Team Communication)

**Template:**
```
Date: [YYYY-MM-DD]
Developer: [Name]

Yesterday:
- Completed authentication flow
- Fixed bug in location autocomplete

Today:
- Implement route ranking algorithm
- Setup MOTIS Docker container

Blockers:
- Need GTFS data for Mumbai Metro (waiting on data source)
```

---

## Code Review Checklist

Before merging to `main`:
- [ ] Code follows Frontend/Backend guidelines
- [ ] TypeScript errors resolved (`npm run build` passes)
- [ ] Tests added for new features
- [ ] No console.log() statements
- [ ] Performance tested (no regressions)
- [ ] Security reviewed (input validation, auth checks)

---

**This plan ensures a production-ready MVP in 90 days with clear milestones and success criteria.**

---

**END OF IMPLEMENTATION PLAN**
