# Tech Stack - RouteStitch Production Architecture
## Complete Technology Stack for Fast, Scalable, Secure Development

**Version:** 1.0  
**Last Updated:** February 8, 2026  
**Principle:** FREE resources for MVP → Scale with revenue

---

## 1. Frontend Stack

### 1.1 Core Framework
```
React 18.2+ with Next.js 14 (App Router)
```

**Why:**
- ✅ Server-side rendering (SSR) for SEO + fast initial load
- ✅ Automatic code splitting → faster page loads
- ✅ API routes built-in (no separate backend needed for MVP)
- ✅ Vercel deployment (FREE hosting)
- ✅ TypeScript support out of the box

**Installation:**
```bash
npx create-next-app@latest routestitch --typescript --tailwind --app --use-npm
cd routestitch
npm install
```

---

### 1.2 Styling & UI

**TailwindCSS 3.4+**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Production Config (`tailwind.config.ts`):**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'routestitch-primary': '#00D9FF',    // Brand blue
        'routestitch-secondary': '#FFB800',  // Brand yellow
      },
    },
  },
  plugins: [],
}
export default config
```

**UI Component Libraries (Optional):**
```bash
# shadcn/ui (Headless components + TailwindCSS)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog
```

**Icons:**
```bash
npm install lucide-react  # Modern icon library
```

---

### 1.3 Forms & Validation

**React Hook Form + Zod**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Example Usage:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripBuilderFormSchema } from '@/lib/validation/tripInput';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(tripBuilderFormSchema),
});
```

**Why:**
- ✅ Type-safe validation (Zod generates TypeScript types)
- ✅ Performance: Only re-renders changed fields
- ✅ Production-ready error handling

---

### 1.4 State Management

**Zustand (Lightweight Alternative to Redux)**
```bash
npm install zustand
```

**Example Store:**
```typescript
// lib/store/searchStore.ts
import { create } from 'zustand';

interface SearchState {
  origin: Location | null;
  destination: Location | null;
  setOrigin: (location: Location) => void;
  setDestination: (location: Location) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  origin: null,
  destination: null,
  setOrigin: (location) => set({ origin: location }),
  setDestination: (location) => set({ destination: location }),
}));
```

**Why Zustand over Redux:**
- ✅ 10x smaller bundle size (1KB vs 10KB)
- ✅ No boilerplate (no actions, reducers, providers)
- ✅ Same API as React hooks

---

### 1.5 Maps & Location

**Leaflet.js (FREE Alternative to Google Maps)**
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

**Why:**
- ✅ FREE unlimited usage (OpenStreetMap tiles)
- ✅ Lightweight (38KB gzipped vs Google Maps 200KB+)
- ✅ No API key required

**Geocoding:**
```bash
# Use Nominatim API (FREE, no key needed)
# Rate limit: 1 request/second
```

**Implementation:**
```typescript
async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  return data[0]; // { lat, lon, display_name }
}
```

---

### 1.6 Date/Time Handling

**date-fns (Modern Alternative to Moment.js)**
```bash
npm install date-fns
```

**Why:**
- ✅ Tree-shakeable (only import what you use)
- ✅ Immutable (no bugs from mutating dates)
- ✅ TypeScript-first

**Example:**
```typescript
import { format, addDays, parseISO } from 'date-fns';

const today = new Date();
const tomorrow = addDays(today, 1);
const formatted = format(tomorrow, 'yyyy-MM-dd'); // "2026-03-16"
```

---

### 1.7 HTTP Client

**Native Fetch API + SWR (Data Fetching Hooks)**
```bash
npm install swr
```

**Why SWR:**
- ✅ Auto-caching, revalidation, deduplication
- ✅ Optimistic UI updates
- ✅ Built by Vercel (Next.js team)

**Example:**
```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useRoutes(from: string, to: string) {
  const { data, error, isLoading } = useSWR(
    `/api/search-routes?from=${from}&to=${to}`,
    fetcher,
    { revalidateOnFocus: false } // Don't refetch when tab focused
  );

  return { routes: data, error, isLoading };
}
```

---

## 2. Backend Stack

### 2.1 Runtime & Framework

**Node.js 20+ (LTS) with Next.js API Routes**

**Why Next.js API Routes (Instead of Separate Express Server):**
- ✅ Simplified deployment (single codebase)
- ✅ Built-in TypeScript support
- ✅ Automatic API route handling

**Example API Route:**
```typescript
// app/api/search-routes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tripInputSchema } from '@/lib/validation/tripInput';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  const validation = tripInputSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error },
      { status: 400 }
    );
  }

  // Process route search
  const routes = await searchRoutes(validation.data);
  
  return NextResponse.json({ routes }, { status: 200 });
}
```

---

### 2.2 Database

**PostgreSQL 15+ (Production Database)**

**Free Options for MVP:**
1. **Supabase** (FREE tier: 500MB database, 2GB bandwidth/month)
2. **Railway** (FREE $5/month credit)
3. **Neon** (FREE serverless Postgres, 3GB storage)

**Production (Paid, Post-Revenue):**
- AWS RDS PostgreSQL (t3.micro: $15/month, scales to $500+/month)

**Installation (Neon Example):**
```bash
# 1. Sign up at https://neon.tech
# 2. Create project, get connection string
# 3. Add to .env.local:
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb"
```

**Why PostgreSQL:**
- ✅ ACID compliant (data integrity)
- ✅ Complex queries (JOINs for route data)
- ✅ JSON support (flexible route leg storage)
- ✅ Full-text search (search past trips)
- ✅ Battle-tested at scale (Instagram, Spotify use it)

---

### 2.3 ORM (Object-Relational Mapping)

**Prisma 5+**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Why Prisma:**
- ✅ TypeScript-first (auto-generated types from schema)
- ✅ Migration management (version control for database schema)
- ✅ Query builder (no raw SQL needed)
- ✅ Prisma Studio (visual database browser)

**Example Schema (`prisma/schema.prisma`):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  profession String?  // For discount filtering
  trips     Trip[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Trip {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  origin      Json     // { lat, lng, name }
  destination Json
  date        DateTime
  routes      Json     // Array of route objects
  status      String   // "planned", "booked", "completed"
  createdAt   DateTime @default(now())
}
```

**Generate Client:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Usage:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTrip(userId: string, tripData: any) {
  return await prisma.trip.create({
    data: {
      userId,
      origin: tripData.origin,
      destination: tripData.destination,
      date: new Date(tripData.date),
      routes: tripData.routes,
      status: 'planned',
    },
  });
}
```

---

### 2.4 Caching

**Redis (In-Memory Cache)**

**Free Options for MVP:**
- **Upstash Redis** (FREE tier: 10,000 commands/day)

**Installation:**
```bash
npm install @upstash/redis
```

**Setup:**
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

**Usage:**
```typescript
import { redis } from '@/lib/redis';

async function getCachedRoutes(cacheKey: string) {
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const routes = await fetchRoutesFromAPI();
  await redis.setex(cacheKey, 900, routes); // Cache for 15 minutes
  return routes;
}
```

**What to Cache:**
- ✅ Route search results (15 min TTL)
- ✅ Geocoded addresses (24 hour TTL)
- ✅ Popular city coordinates (1 week TTL)
- ✅ Train/bus static data (1 day TTL)

---

### 2.5 Authentication

**NextAuth.js (Auth for Next.js)**
```bash
npm install next-auth
```

**Setup:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Auth Methods:**
- Google OAuth (FREE, instant signup)
- Email/Password (later phase)
- Phone/OTP (future, requires SMS provider)

---

## 3. Routing Engine

### 3.1 MOTIS (Multi-Modal Transport Information System)

**What:**
- Open-source routing engine for GTFS data
- Supports trains, buses, metros, walking

**Setup:**
```bash
# Run via Docker
docker pull motis/motis:latest
docker run -p 8080:8080 -v $(pwd)/data:/data motis/motis
```

**Data Requirements:**
- GTFS feeds for Indian Railways (manually collected)
- GTFS feeds for state RTCs (KSRTC, MSRTC, etc.)

**API Example:**
```typescript
async function queryMOTIS(origin: Location, destination: Location, date: string) {
  const response = await fetch('http://localhost:8080/api/v1/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: { lat: origin.lat, lng: origin.lng },
      to: { lat: destination.lat, lng: destination.lng },
      date: date,
      time: '08:00',
      modes: ['WALK', 'TRANSIT'],
    }),
  });

  return await response.json();
}
```

**Fallback (If MOTIS Unavailable):**
- Use static route data from database
- Basic distance × cost estimation

---

## 4. External APIs & Data Sources

### 4.1 FREE APIs

| Service | API | Free Tier | Purpose |
|---------|-----|-----------|---------|
| **Geocoding** | Nominatim (OpenStreetMap) | 1 req/sec | Address → Lat/Lng |
| **Flights** | Skyscanner Rapid API | 500 calls/month | Flight price data |
| **SMS** | Twilio Free Trial | 100 SMS/day | OTP, booking confirmations |
| **Email** | Resend.com | 3,000 emails/month | Booking emails, alerts |
| **Maps** | OpenStreetMap (Leaflet) | Unlimited | Interactive maps |
| **Weather** | Open-Meteo | Unlimited | Delay predictions (future) |

---

### 4.2 Web Scraping (Zero-Cost Data Collection)

**RedBus (Bus Data):**
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeRedBus(from: string, to: string, date: string) {
  const url = `https://www.redbus.in/bus-tickets/${from}-to-${to}?doj=${date}`;
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RouteStitch/1.0)',
    },
  });

  const $ = cheerio.load(data);
  const buses: Bus[] = [];

  $('.bus-item').each((i, el) => {
    buses.push({
      operator: $(el).find('.travels').text().trim(),
      departure: $(el).find('.dp-time').text().trim(),
      arrival: $(el).find('.bp-time').text().trim(),
      price: parseInt($(el).find('.fare').text().replace(/[^0-9]/g, '')),
      seatsAvailable: parseInt($(el).find('.seat-left').text().match(/\d+/)?.[0] || '0'),
      bookingUrl: 'https://www.redbus.in' + $(el).find('a').attr('href'),
    });
  });

  return buses;
}
```

**Rate Limiting:**
```typescript
import pLimit from 'p-limit';

const limit = pLimit(2); // Max 2 concurrent requests

const buses = await Promise.all(
  routes.map((route) => limit(() => scrapeRedBus(route.from, route.to, route.date)))
);
```

**IMPORTANT:**
- Respect robots.txt
- Add delays between requests (1-2 seconds)
- Rotate user agents
- Cache results aggressively

---

## 5. DevOps & Deployment

### 5.1 Hosting (FREE for MVP)

**Frontend + Backend:**
- **Vercel** (FREE tier: Unlimited sites, 100GB bandwidth/month)
  - Auto-deploys from GitHub
  - Built-in CDN
  - SSL certificates included

**Database:**
- **Neon PostgreSQL** (FREE tier: 3GB storage)

**Redis:**
- **Upstash Redis** (FREE tier: 10K commands/day)

**MOTIS Routing Engine:**
- **Railway** (FREE $5/month credit) OR
- **AWS EC2 t3.micro** (FREE tier for 12 months)

---

### 5.2 CI/CD Pipeline

**GitHub Actions (FREE for Public Repos)**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

### 5.3 Monitoring & Logging

**Sentry (Error Tracking - FREE tier: 5K errors/month)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**AWS CloudWatch (Logs & Metrics - FREE tier)**
- 5GB logs/month
- 10 custom metrics
- 1M API requests/month

**Plausible Analytics (Privacy-Focused Analytics)**
```bash
# Self-hosted (FREE) OR
# Cloud ($9/month for 10K pageviews, $19 for 100K)
```

---

## 6. Development Tools

### 6.1 Code Quality

**ESLint + Prettier**
```bash
npm install -D eslint prettier eslint-config-prettier
```

**TypeScript Strict Mode (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**Husky (Git Hooks - Prevent Bad Commits)**
```bash
npm install -D husky lint-staged
npx husky install
```

---

### 6.2 Testing

**Vitest (Modern Test Runner)**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example Test:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateBuffer } from '@/lib/utils/bufferCalculator';

describe('Buffer Calculator', () => {
  it('should calculate safe buffer  for peak hours', () => {
    const buffer = calculateBuffer({
      origin: 'Mumbai Central',
      destination: 'Andheri',
      time: '18:00', // Peak hour
      mode: 'metro',
    });
    expect(buffer).toBeGreaterThanOrEqual(30); // At least 30 min buffer
  });
});
```

---

## 7. Production Deployment Checklist

### Environment Variables (`.env.production`)
```bash
# Database
DATABASE_URL="postgresql://..."

# Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Auth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL="https://routestitch.com"
NEXTAUTH_SECRET="..." # Generate with: openssl rand -base64 32

# APIs
SKYSCANNER_API_KEY="..."
TWILIO_SID="..."
TWILIO_AUTH_TOKEN="..."

# Monitoring
SENTRY_DSN="..."
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="routestitch.com"
```

### Security Headers (`next.config.js`)
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

---

## 8. Cost Breakdown (MVP → Production)

### MVP (Month 0-6) - **$0/Month**
- Frontend: Vercel FREE
- Backend: Next.js API routes (same as frontend)
- Database: Neon PostgreSQL FREE
- Redis: Upstash FREE
- MOTIS: Railway FREE credit
- Email: Resend FREE
- Monitoring: Sentry FREE

### Production (Month 6-12) - **$100-200/Month**
- Vercel Pro: $20/month (better analytics)
- Neon PostgreSQL: $20/month (5GB → 50GB)
- Upstash Redis: $30/month (1M commands/day)
- AWS EC2 t3.small: $15/month (MOTIS)
- Twilio: $20/month (SMS)
- Monitoring: $15/month (Sentry paid tier)
- Total: ~$120/month

### Scale (Month 12+) - **$500-2000/Month**
- AWS RDS PostgreSQL Multi-AZ: $150/month
- AWS ElastiCache Redis: $100/month
- AWS EC2 Auto-Scaling (3-10 instances): $150-500/month
- CDN (CloudFront): $50/month
- Total: ~$450-800/month at 500K MAU

---

**FINAL STACK SUMMARY:**

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | React 18 + Next.js 14 + TypeScript | SSR, SEO, Fast |
| **Styling** | TailwindCSS | Rapid UI, Small bundle |
| **Forms** | React Hook Form + Zod | Type-safe, Fast |
| **State** | Zustand | Lightweight, Simple |
| **Database** | PostgreSQL + Prisma | Reliable, Type-safe |
| **Cache** | Redis (Upstash) | Fast reads |
| **Auth** | NextAuth.js | Easy OAuth |
| **Routing** | MOTIS | Multi-modal GTFS |
| **Maps** | Leaflet.js | FREE, No API key |
| **Deploy** | Vercel + Railway | Zero config, FREE |

**This stack is production-ready, scalable to 2M users, and starts at $0/month.**

---

**END OF TECH STACK DOCUMENT**
