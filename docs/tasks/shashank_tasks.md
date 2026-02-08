# Shashank's Tasks - RouteStitch Development
## Full Stack, AI/Algorithms, Hardcore Work

**Date:** February 8, 2026  
**Focus:** Backend infrastructure, AI/ML algorithms, complex integrations

---

## 🔥 TODAY'S PRIORITY TASKS (Finish by EOD)

### 1. Database Setup & Schema Implementation ⭐ CRITICAL
**Time:** 2-3 hours  
**Difficulty:** Hardcore

**Tasks:**
- [ ] Setup Neon PostgreSQL database (FREE tier)
  - Sign up at https://neon.tech
  - Create new project
  - Copy connection string
- [ ] Initialize Prisma in the project
  ```bash
  cd d:\ShanksWay\shanksway
  npm install prisma @prisma/client
  npx prisma init
  ```
- [ ] Copy the complete schema from `docs/BACKEND_SCHEMA.md` to `prisma/schema.prisma`
- [ ] Update `.env` with DATABASE_URL
- [ ] Run migrations
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```
- [ ] Test connection with Prisma Studio
  ```bash
  npx prisma studio
  ```

**Success Criteria:**
✅ Prisma Studio opens and shows all tables  
✅ Can create a test user in database  
✅ No migration errors

---

### 2. Route Ranking Algorithm Implementation ⭐ CRITICAL
**Time:** 3-4 hours  
**Difficulty:** Hardcore (AI/ML)

**Tasks:**
- [ ] Create `lib/services/routeRanking.ts`
- [ ] Implement multi-criteria optimization algorithm
  ```typescript
  interface RouteScore {
    time: number;      // Normalized 0-1
    cost: number;      // Normalized 0-1
    reliability: number; // Based on mode reliability
  }
  
  function rankRoutes(routes: Route[], preference: Preference) {
    // 1. Normalize all scores (0-1 scale)
    // 2. Apply weighted scoring based on preference
    // 3. Sort by composite score
    // 4. Return top 5
  }
  ```
- [ ] Implement reliability scoring per transport mode
  ```typescript
  const RELIABILITY_SCORES = {
    metro: 0.95,  // 95% on-time
    flight: 0.85,
    train: 0.70,  // Indian Railways avg
    bus: 0.65,
    taxi: 0.80
  };
  ```
- [ ] Add buffer time multiplier for peak hours
- [ ] Write unit tests for ranking algorithm
  ```bash
  npm install -D vitest @testing-library/react
  ```

**Success Criteria:**
✅ Algorithm returns different top routes for "Fastest" vs "Cheapest"  
✅ Unit tests pass for all edge cases  
✅ Performance < 100ms for 50 routes

---

### 3. NextAuth.js Google OAuth Setup
**Time:** 2 hours  
**Difficulty:** Medium-Hard

**Tasks:**
- [ ] Install NextAuth.js
  ```bash
  npm install next-auth @auth/prisma-adapter
  ```
- [ ] Setup Google OAuth credentials
  - Go to https://console.cloud.google.com
  - Create OAuth 2.0 Client ID
  - Add authorized redirect: `http://localhost:3000/api/auth/callback/google`
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Configure Prisma adapter
- [ ] Add sign-in/sign-out buttons to Navbar
- [ ] Test login flow

**Success Criteria:**
✅ User can sign in with Google  
✅ User data saved to PostgreSQL  
✅ Session persists across page refreshes

---

## 📋 SECONDARY TASKS (If Time Permits)

### 4. Buffer Time Calculator (Connection Guarantee)
**Time:** 2 hours  
**Difficulty:** Medium (Algorithm)

- [ ] Create `lib/services/bufferCalculator.ts`
- [ ] Implement dynamic buffer calculation
  ```typescript
  function calculateBuffer(leg1: Leg, leg2: Leg): number {
    const baseBuffer = 30; // minutes
    const peakMultiplier = isPeakHour(leg1.arrivalTime) ? 1.5 : 1.0;
    const modeMultiplier = getModeReliability(leg1.mode);
    return Math.max(15, baseBuffer * peakMultiplier * modeMultiplier);
  }
  ```
- [ ] Add peak hour detection (6-10 AM, 5-9 PM)
- [ ] Return risk indicator (Safe/Moderate/Risky)

---

### 5. Redis Cache Setup (Upstash)
**Time:** 1 hour  
**Difficulty:** Medium

- [ ] Sign up for Upstash Redis (FREE tier)
- [ ] Install Redis client
  ```bash
  npm install @upstash/redis
  ```
- [ ] Create `lib/redis.ts` wrapper
- [ ] Implement cache for geocoded addresses (24hr TTL)
- [ ] Implement cache for route results (15min TTL)

---

## 🎯 THIS WEEK'S GOALS

- [x] Setup PostgreSQL + Prisma (TODAY)
- [x] Implement route ranking algorithm (TODAY)
- [x] Setup authentication (TODAY)
- [ ] Buffer calculator (TODAY/Tomorrow)
- [ ] Redis caching (Tomorrow)
- [ ] MOTIS Docker setup (Next 2 days)

---

## 📊 Success Metrics for Today

**By End of Day:**
- ✅ Database is live and accessible
- ✅ Route ranking algorithm working with tests
- ✅ Google OAuth login functional
- ✅ No TypeScript errors
- ✅ Code pushed to GitHub

---

## 🔍 Resources

**Documentation:**
- [PRD.md](file:///d:/ShanksWay/shanksway/docs/PRD.md) - Requirements
- [BACKEND_SCHEMA.md](file:///d:/ShanksWay/shanksway/docs/BACKEND_SCHEMA.md) - Database design
- [TECH_STACK.md](file:///d:/ShanksWay/shanksway/docs/TECH_STACK.md) - Technologies
- [IMPLEMENTATION_PLAN.md](file:///d:/ShanksWay/shanksway/docs/IMPLEMENTATION_PLAN.md) - Roadmap

**External:**
- Neon DB: https://neon.tech
- Prisma Docs: https://www.prisma.io/docs
- NextAuth.js: https://next-auth.js.org
- Upstash Redis: https://upstash.com

---

## 💬 Coordination

**Dependencies:**
- Varshitha needs LocationInput component finalized → Tell her expected API format
- Mallikarjuna will integrate your ranking algorithm → Ensure it's well-documented

**Blockers:**
- If OAuth setup stuck, use email/password auth temporarily
- If MOTIS takes too long, use mock route data for now

---

**Let's build something amazing! 🚀**
