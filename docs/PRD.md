# Product Requirements Document (PRD)
## RouteStitch - India's First Unified Multi-Modal Travel Platform

**Version:** 1.0  
**Last Updated:** February 8, 2026  
**Document Owner:** Product Team  
**Status:** Active - Production Development

---

## 1. Executive Summary

### 1.1 Product Vision
RouteStitch is India's first unified multi-modal travel platform that seamlessly combines trains, buses, flights, and local transport into a single, intelligently optimized journey planning and booking experience.

### 1.2 Problem Statement
- **50M+ daily intercity travelers** face fragmented booking across multiple platforms
- **86% trains sold out within 10 days** - poor planning leads to missed opportunities
- **40% higher costs** due to uncoordinated transport modes
- **25% travelers miss connections** due to lack of real-time coordination
- No national-level solution exists (only city-level: Tummoc, Chennai-One)

### 1.3 Solution Overview
A production-level web platform that:
- Aggregates all transport modes in one search
- Provides AI-powered route optimization
- Guarantees connections with automatic rebooking
- Offers door-to-door journey planning
- Enables transparent pricing and unified booking flow

---

## 2. Target Users

### 2.1 Primary Personas

#### Persona 1: Young Professional Commuter
- **Age:** 25-35
- **Income:** ₹6-15 LPA  
- **Pain Point:** Wastes 45+ minutes planning intercity trips across 5 apps
- **Goal:** Fast, reliable booking in under 5 minutes

#### Persona 2: Budget-Conscious Student
- **Age:** 18-25
- **Income:** Limited (₹10-20K stipend)
- **Pain Point:** Misses student discounts, can't compare prices effectively
- **Goal:** Cheapest options with student-specific optimizations

#### Persona 3: Family Traveler
- **Age:** 30-50
- **Income:** ₹10-25 LPA
- **Pain Point:** Coordinating group bookings across platforms
- **Goal:** Simple group booking with guaranteed adjacent seats

#### Persona 4: Business Traveler
- **Age:** 28-45
- **Income:** ₹15-40 LPA
- **Pain Point:** Needs fastest routes with minimal uncertainty
- **Goal:** Premium reliability, time optimization

---

## 3. Core Features (MVP - Phase 1)

### 3.1 TripBuilder - Multi-Stop Journey Planner ⭐

**Priority:** P0 (Killer Feature)

**Description:**  
Allow users to plan complex journeys with unlimited custom stops, adjustable durations, and activity suggestions at each location.

**User Story:**
```
As a traveler planning Delhi → Jaipur → Udaipur → Bangalore,
I want to add custom stops with flexible durations,
So that I can explore cities along the way without booking hassle.
```

**Acceptance Criteria:**
- [ ] User can add unlimited stops between origin and destination
- [ ] Each stop allows duration input (15 min - 72 hours)
- [ ] System suggests activities/hotels for stops > 4 hours
- [ ] Real-time recalculation of total journey time and cost
- [ ] Visual timeline showing the complete journey
- [ ] Buffer time adjustment with risk indicators (🟢 Safe, 🟡 Moderate, 🔴 Risky)

**Technical Requirements:**
- Form validation using Zod schema
- Real-time route optimization using MOTIS + custom algorithms
- Google Places API integration for activity suggestions (FREE tier)
- Responsive UI supporting mobile, tablet, desktop

---

### 3.2 Intelligent Route Search

**Priority:** P0

**Description:**  
Search and compare all possible route combinations across train, bus, flight, metro, taxi, auto, walking.

**User Story:**
```
As a user searching Delhi to Mumbai,
I want to see 5+ ranked route options mixing all transport modes,
So that I can choose based on my preference (fastest/cheapest/balanced).
```

**Acceptance Criteria:**
- [ ] Single search returns minimum 5 diverse route combinations
- [ ] Routes ranked by user-selected preference (Fastest/Cheapest/Balanced)
- [ ] Display total cost, total duration, reliability score per route
- [ ] Show connection buffer times with safety indicators
- [ ] Include first-mile (home → station) and last-mile (station → destination)
- [ ] Search completes in < 3 seconds for 80% of queries

**Technical Requirements:**
- MOTIS routing engine for GTFS-based route planning
- Web scraping for bus/flight data (RedBus, Google Flights fallback)
- Caching layer (Redis/in-memory) for frequently searched routes
- Algorithm: Multi-criteria optimization (time, cost, reliability, comfort)

---

### 3.3 Connection Guarantee System

**Priority:** P1

**Description:**  
Automatically calculate safe buffer times between connections and guarantee rebooking if connections are missed due to delays.

**User Story:**
```
As a user booking Train → Metro connection,
I want assurance that if my train is delayed,
So that I won't lose money or miss my journey.
```

**Acceptance Criteria:**
- [ ] Dynamic buffer calculation based on historical delay data
- [ ] Visual indicators: Safe (🟢 ≥ recommended buffer), Risky (🔴 < recommended)
- [ ] Guarantee policy clearly displayed during booking
- [ ] Auto-rebooking notification if connection missed (email + SMS + app notification)
- [ ] Compensation: Up to 150% of ticket cost + ₹500 inconvenience fee

**Technical Requirements:**
- Machine learning model for delay prediction (Phase 2 - use static data for MVP)
- Real-time tracking integration (GPS APIs from transport operators)
- Automated rebooking workflow via operator APIs OR manual follow-up for MVP

---

### 3.4 Door-to-Door Route Planning

**Priority:** P0

**Description:**  
Include exact home address → exact destination address routing, not just city-to-city.

**User Story:**
```
As a user living in Noida sector 15,
I want the route to start from my home, not just "Delhi",
So that I know the complete door-to-door journey cost and time.
```

**Acceptance Criteria:**
- [ ] Address autocomplete powered by free geocoding API (Nominatim/OpenStreetMap)
- [ ] Browser geolocation for "Use my current location"
- [ ] First-mile options: Taxi, Auto, Metro, Bus (whichever applicable)
- [ ] Last-mile options calculated based on destination coordinates
- [ ] Total cost includes ALL legs (no hidden costs)

**Technical Requirements:**
- Nominatim API (FREE, 1 req/sec limit - cache heavily)
- Static pricing model for local transport (Uber/Ola estimates without API)
- Pre-calculated average fares for top 100 city routes

---

### 3.5 Platform Marketplace (Affiliate Booking)

**Priority:** P0

**Description:**  
Show booking options across multiple platforms with price comparison and direct deep links.

**User Story:**
```
As a user selecting a train route,
I want to see booking options on IRCTC, ConfirmTkt, RailYatri,
So that I can book on my preferred platform.
```

**Acceptance Criteria:**
- [ ] Display minimum 2-3 platform options per transport mode
- [ ] Price comparison table (if prices vary)
- [ ] Deep links with pre-filled search parameters
- [ ] "Recommended" badge based on reliability/price
- [ ] Affiliate tracking for revenue (commission earning)

**Technical Requirements:**
- Deep link generation for IRCTC, RedBus, MakeMyTrip, Goibibo, etc.
- Affiliate program integration (RedBus, MakeMyTrip partners)
- Track click conversions for analytics

---

### 3.6 Profession-Based Discounts

**Priority:** P1

**Description:**  
Auto-apply discounts based on verified user profession (Student, Defense, Senior Citizen, Medical).

**User Story:**
```
As a student,
I want the platform to highlight trains/buses with student quota,
So that I don't miss saving ₹500-800 on my ticket.
```

**Acceptance Criteria:**
- [ ] User profile includes profession selection with verification
- [ ] Auto-highlight routes with applicable quotas (Student, Defense, Ladies, Senior Citizen)
- [ ] Display savings amount per route
- [ ] One-click enable discount filter

**Technical Requirements:**
- User authentication with profile management
- Database schema for user profession + verification status
- Filter logic in route search algorithm

---

## 4. Non-Functional Requirements

### 4.1 Performance

**CRITICAL:** Production must be **FAST**

- **Page Load:** < 2 seconds (First Contentful Paint)
- **Search Results:** < 3 seconds for 90% of queries
- **Route Calculation:** < 1 second for simple routes, < 5 seconds for complex 5+ stop routes
- **API Response Time:** < 500ms average for all backend APIs
- **Concurrent Users:** Support 1000+ simultaneous users (scale to 10K+ with load balancing)

**Technical approach:**
- **Frontend:** React 18+ with code splitting, lazy loading
- **Backend:** Node.js with clustering, horizontal scaling (AWS Auto-Scaling)
- **Database:** PostgreSQL with read replicas, query optimization (indexes, connection pooling)
- **Caching:** Redis for frequently searched routes (TTL: 15 minutes)
- **CDN:** Cloudflare/Vercel for static assets

---

### 4.2 Scalability

**CRITICAL:** Must scale to **2M users by Year 3**

- **Horizontal Scaling:** Microservices architecture (separate services for search, booking, user management)
- **Database:** PostgreSQL with vertical + horizontal scaling (sharding by user ID or city)
- **Message Queue:** RabbitMQ/AWS SQS for async tasks (email, SMS, analytics)
- **Load Balancer:** Nginx/AWS ALB for distribution
- **Auto-scaling:** AWS EC2 Auto Scaling Groups (min: 2 instances, max: 20 instances)

---

### 4.3 Security

**CRITICAL:** Must be **SECURE** (handles user data + payment info)

- **Authentication:** JWT-based auth with httpOnly cookies, refresh token rotation
- **Authorization:** Role-based access control (User, Admin, Partner)
- **Data Encryption:**
  - In transit: HTTPS (TLS 1.3)
  - At rest: Database encryption (PostgreSQL pgcrypto)
- **Input Validation:** Zod schema validation on frontend + backend
- **XSS/CSRF Protection:** Content Security Policy headers, CSRF tokens
- **Rate Limiting:** 100 requests/min per IP for search API (prevent abuse)
- **Secrets Management:** AWS Secrets Manager / Environment variables (never commit to Git)
- **Payment Security:** Razorpay integration (PCI-DSS compliant, no card data stored)

---

### 4.4 Reliability & Availability

- **Uptime:** 99.9% SLA (max 43 minutes downtime/month)
- **Error Handling:** Graceful degradation (if MOTIS fails, fallback to static routes)
- **Monitoring:** AWS CloudWatch, Sentry for error tracking
- **Logging:** Centralized logging (Winston + CloudWatch Logs)
- **Backup:** Daily PostgreSQL backups (7-day retention), automated restore testing
- **Disaster Recovery:** Multi-AZ deployment (AWS), automated failover

---

## 5. Tech Stack (Free/Low-Cost for MVP)

### 5.1 Frontend
- **Framework:** React 18+ with Next.js 14 (App Router)
- **Styling:** TailwindCSS (production build with purge)
- **Forms:** React Hook Form + Zod validation
- **State Management:** React Context / Zustand (lightweight)
- **Maps:** Leaflet.js (FREE, OpenStreetMap)
- **Charts:** Recharts (for analytics dashboard)

### 5.2 Backend
- **Runtime:** Node.js 20+ (LTS)
- **Framework:** Express.js (API routes) OR Next.js API routes
- **Database:** PostgreSQL 15+ (FREE on Railway/Supabase for MVP, AWS RDS for production)
- **ORM:** Prisma (type-safe, auto-migrations)
- **Caching:** Redis (FREE on Upstash for MVP)
- **Job Queue:** BullMQ + Redis (for async tasks)

### 5.3 Routing Engine
- **MOTIS:** Open-source multi-modal routing (GTFS-based)
- **Hosting:** Docker container on AWS ECS/Fargate
- **Data:** GTFS feeds from Indian Railways, state RTCs (manually collected initially)

### 5.4 APIs (Free Tier)
- **Geocoding:** Nominatim (OpenStreetMap, FREE 1 req/sec)
- **Flight Data:** Skyscanner Rapid API (500 calls/month FREE) OR web scraping
- **Bus Data:** Web scraping (RedBus public search results)
- **Train Data:** Static GTFS + ConfirmTkt scraping
- **SMS:** Twilio FREE trial (100 SMS/day) → switch to MSG91 (₹0.10/SMS)
- **Email:** Resend.com (3,000 emails/month FREE)

### 5.5 Deployment
- **Hosting:** Vercel (FREE for frontend) + Railway (FREE $5/month for backend)
- **Production:** AWS EC2 (t3.micro free tier for 12 months) → upgrade to t3.medium
- **CI/CD:** GitHub Actions (FREE 2,000 mins/month)
- **Monitoring:** AWS CloudWatch FREE tier + Sentry (FREE 5K errors/month)
- **Analytics:** Plausible Analytics (privacy-focused, open-source self-hosted)

---

## 6. User Flow & Screens

### 6.1 Home Page
- Hero section with single search bar (origin → destination)
- "Add Stops" prominent button
- Top 10 corridor quick links (Delhi-Mumbai, etc.)
- Feature highlights (Connection Guarantee, Multi-Stop, Door-to-Door)

### 6.2 TripBuilder Page
- **Input Section:**
  - Origin (autocomplete, geolocation)
  - Destination (autocomplete)
  - Date/Time picker
  - Passengers selector
  - Preference (Fastest/Cheapest/Balanced radio buttons)
  - "+ Add Stops" expandable section
- **Results Section:**
  - Top 5 routes displayed as cards
  - Each card: Visual timeline, cost, duration, reliability score
  - "Book via Platforms" dropdown per leg
  - "View Full Details" expands to leg-by-leg breakdown

### 6.3 My Trips Dashboard
- Active trips with live tracking
- Past trips history
- Saved routes (favorites)
- Booking progress tracker (which legs booked, which pending)

### 6.4 User Profile
- Personal info (name, email, phone)
- Profession selection (for discounts)
- Saved addresses (home, office)
- Payment methods (future)
- Notification preferences

---

## 7. Success Metrics (KPIs)

### Phase 1 (Months 0-6) - MVP Launch
- **Waitlist Signups:** 1,000 in 30 days
- **MAU (Monthly Active Users):** 50,000 by Month 6
- **Search-to-Click Conversion:** 30% (30% of searches result in booking platform click)
- **Avg. Time to Search:** < 2 minutes per search
- **User Retention:** 40% (users return within 30 days)

### Phase 2 (Months 6-12) - Growth
- **MAU:** 500,000
- **Monthly Revenue:** ₹10-15 Lakh (affiliate commissions + ads)
- **Search-to-Booking:** 15% (actual bookings completed)
- **NPS (Net Promoter Score):** 50+

### Phase 3 (Months 12-24) - Scale
- **MAU:** 2,000,000
- **Monthly Revenue:** ₹10+ Crore
- **Connection Success Rate:** 95% (guaranteed connections honored)
- **Platform Coverage:** 50+ cities, 100+ corridors

---

## 8. Out of Scope (Phase 1 MVP)

❌ **NOT included in MVP:**
- Unified booking (single payment for all legs) - too complex, requires partnerships
- Live GPS tracking - requires operator APIs (expensive)
- Hotel booking integration - focus on transport first
- Visa/insurance upsells - postpone to Phase 2
- Mobile apps (iOS/Android) - start with PWA (Progressive Web App)
- Payment gateway integration - affiliate model only for MVP

✅ **Included in MVP:**
- Route search & comparison
- Multi-stop journey planning
- Platform marketplace with deep links
- Connection buffer calculation (static data initially)
- Profession-based discount highlighting

---

## 9. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API rate limits (Nominatim 1 req/sec) | High | High | Heavy caching (15 min TTL), pre-cache top 100 cities |
| Web scraping blocked (RedBus, Google Flights) | High | Medium | Rotate proxies, polite scraping (delays), fallback to manual data updates |
| MOTIS routing accuracy | Medium | Medium | Manual data validation, user feedback loop, fallback to simple routes |
| No unified booking API access | Low | High | Acceptable for MVP - focus on discovery, not booking |
| Low user adoption | High | Medium | Aggressive marketing, solve real pain points, waitlist validation |

---

## 10. Timeline & Milestones

### Month 1-2: Foundation
- Week 1-2: Setup project structure, CI/CD, database schema
- Week 3-4: Build TripBuilder UI (input forms, validation)
- Week 5-6: Integrate MOTIS, build route search API
- Week 7-8: Platform marketplace deep links, result display

### Month 3-4: MVP Completion
- Week 9-10: Connection buffer calculation, profession filters
- Week 11-12: My Trips dashboard, user authentication
- Week 13-14: Testing, bug fixes, performance optimization
- Week 15-16: Beta launch to waitlist (100 users), gather feedback

### Month 5-6: Launch & Iterate
- Week 17-18: Public launch, marketing push
- Week 19-20: Monitor metrics, fix critical issues
- Week 21-22: Iterate based on user feedback
- Week 23-24: Scale infrastructure, plan Phase 2

---

## 11. Developer Guidelines

**This Product Requirements Document serves as the source of truth for all development work.**

### For AI/Developers building this:

✅ **DO:**
- Follow the tech stack exactly (React 18+, Next.js 14, PostgreSQL, Prisma)
- Prioritize performance (< 3s search results)
- Write production-ready code (error handling, logging, input validation)
- Use TypeScript for type safety
- Write unit tests for critical functions (route ranking, buffer calculation)
- Keep code DRY (Don't Repeat Yourself) - extract reusable components
- Comment complex algorithms (route optimization logic)
- Use environment variables for secrets (never hardcode API keys)

❌ **DON'T:**
- Add features not in this PRD without approval
- Compromise on security (always validate inputs, sanitize data)
- Skip error handling ("it works on my machine" is not production-ready)
- Hardcode values (cities, pricing, buffer times should be configurable)
- Make synchronous API calls that block the UI
- Use heavy libraries when lighter alternatives exist

---

## 12. Approval & Sign-off

**Document Status:** ✅ Approved for Development  
**Approved By:** Product Owner  
**Date:** February 8, 2026

**Next Steps:**
1. Review Tech Stack document
2. Review Frontend Guidelines
3. Review Backend Schema
4. Review Implementation Plan
5. Begin development

---

**END OF PRD**
