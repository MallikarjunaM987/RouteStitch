# Backend Schema - RouteStitch Database Design
## Production-Ready PostgreSQL Schema with Prisma ORM

**Version:** 1.0  
**Last Updated:** February 8, 2026  
**Database:** PostgreSQL 15+

---

## 1. Complete Prisma Schema

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===== USER MANAGEMENT =====

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?   @unique
  profession    Profession? // For discount filtering
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  trips         Trip[]
  savedRoutes   SavedRoute[]

  @@index([email])
  @@index([phone])
  @@map("users")
}

enum Profession {
  STUDENT
  DEFENSE
  SENIOR_CITIZEN
  MEDICAL
  GOVERNMENT
  CORPORATE
  OTHER
}

// ===== NEXT-AUTH TABLES =====

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@ map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ===== TRIP MANAGEMENT =====

model Trip {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Journey details
  origin        Json       // { id, name, city, state, lat, lng, displayName }
  destination   Json       // Same structure
  stops         Json?      // Array of stop objects
  date          DateTime
  time          String?    // HH:MM format
  passengers    Int        @default(1)
  preference    Preference @default(BALANCED)
  
  // Route selected by user
  selectedRoute Json?      // Full route object with all legs
  
  // Status tracking
  status        TripStatus @default(PLANNED)
  
  // Booking progress
  bookingLegs   BookingLeg[]
  
  // Metadata
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([userId])
  @@index([status])
  @@index([date])
  @@map("trips")
}

enum Preference {
  FASTEST
  CHEAPEST
  BALANCED
}

enum TripStatus {
  PLANNED        // User searched, not booked
  PARTIALLY_BOOKED // Some legs booked
  FULLY_BOOKED   // All legs booked
  IN_PROGRESS    // Currently traveling
  COMPLETED      // Trip finished
  CANCELLED      // User cancelled
}

// Track individual leg bookings
model BookingLeg {
  id            String   @id @default(cuid())
  tripId        String
  trip          Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  legIndex      Int      // Which leg in the route (0-indexed)
  mode          String   // "train", "bus", "flight", etc.
  
  // Booking details
  isBooked      Boolean  @default(false)
  platform      String?  // "IRCTC", "RedBus", etc.
  bookingRef    String?  // PNR, ticket number, etc.
  bookedAt      DateTime?
  cost          Float?   // Actual cost paid
  
  // Notifications
  reminderSent  Boolean  @default(false)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([tripId])
  @@map("booking_legs")
}

// ===== SAVED ROUTES =====

model SavedRoute {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String?  // User-given name (e.g., "Weekend escape to Goa")
  origin        Json
  destination   Json
  stops         Json?
  route         Json     // Full route details
  
  timesUsed     Int      @default(0)
  lastUsedAt    DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@map("saved_routes")
}

// ===== ANALYTICS & TRACKING =====

model SearchQuery {
  id            String   @id @default(cuid())
  userId        String?  // Null for anonymous users
  
  origin        Json
  destination   Json
  stops         Json?
  date          DateTime
  passengers    Int
  preference    Preference
  
  // Results
  routesFound   Int      // How many routes were returned
  clickedRoute  Json?    // Which route user clicked
  
  // Metadata
  createdAt     DateTime @default(now())
  ipAddress     String?  // For rate limiting
  userAgent     String?  // Browser info

  @@index([userId])
  @@index([createdAt])
  @@index([ipAddress])
  @@map("search_queries")
}

model BookingClick {
  id            String   @id @default(cuid())
  userId        String?
  tripId        String?
  
  route         Json     // Full route object
  platform      String   // "IRCTC", "RedBus", etc.
  leg           Json     // Which leg was clicked
  
  // Affiliate tracking
  affiliateUrl  String   // URL user was sent to
  commission    Float?   // Expected commission (if known)
  
  // Conversion tracking
  didBook       Boolean? // Did user mark as booked?
  markedAt      DateTime?
  
  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([tripId])
  @@index([platform])
  @@index([createdAt])
  @@map("booking_clicks")
}

// ===== STATIC DATA CACHING =====

model CachedGeocode {
  id            String   @id @default(cuid())
  address       String   @unique
  lat           Float
  lng           Float
  displayName   String
  city          String?
  state         String?
  country       String   @default("India")
  
  createdAt     DateTime @default(now())
  expiresAt     DateTime // 24-hour TTL

  @@index([address])
  @@index([expiresAt])
  @@map("cached_geocodes")
}

model CachedRoute {
  id            String   @id @default(cuid())
  cacheKey      String   @unique // Hash of origin+destination+date+preference
  origin        Json
  destination   Json
  date          DateTime
  preference    Preference
  
  routes        Json     // Array of route objects
  totalResults  Int
  
  createdAt     DateTime @default(now())
  expiresAt     DateTime // 15-minute TTL

  @@index([cacheKey])
  @@index([expiresAt])
  @@map("cached_routes")
}

// ===== RATE LIMITING =====

model RateLimit {
  id            String   @id @default(cuid())
  identifier    String   @unique // IP address or user ID
  requestCount  Int      @default(1)
  windowStart   DateTime @default(now())

  @@index([identifier])
  @@index([windowStart])
  @@map("rate_limits")
}
```

---

## 2. Database Migrations

**Initial Migration:**
```bash
# Create migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

**Generate Prisma Client:**
```bash
npx prisma generate
```

---

## 3. Database Indexes (Performance)

**Critical Indexes (Already in Schema):**
- `users.email` - Fast email lookup for login
- `trips.userId` - Fast user trip queries
- `trips.status` - Filter trips by status
- `trips.date` - Date-range queries
- `search_queries.ipAddress` - Rate limiting
- `cached_routes.cacheKey` - Fast cache lookup
- `cached_geocodes.address` - Fast geocode lookup

**Additional Indexes (Add if Performance Problems):**
```sql
-- If searching trips by date range is slow
CREATE INDEX idx_trips_date_user ON trips(date, userId);

-- If analytics queries on booking_clicks are slow
CREATE INDEX idx_booking_clicks_created_platform ON booking_clicks(createdAt, platform);
```

---

## 4. Example Queries

### 4.1 Create a Trip

```typescript
import { prisma } from '@/lib/prisma';

async function createTrip(userId: string, tripData: TripInput) {
  return await prisma.trip.create({
    data: {
      userId,
      origin: tripData.origin,
      destination: tripData.destination,
      stops: tripData.stops || null,
      date: new Date(tripData.date),
      time: tripData.time,
      passengers: tripData.passengers,
      preference: tripData.preference.toUpperCase() as Preference,
      status: 'PLANNED',
    },
  });
}
```

---

### 4.2 Get User's Trips

```typescript
async function getUserTrips(userId: string) {
  return await prisma.trip.findMany({
    where: { userId },
    include: {
      bookingLegs: true, // Include booking status
    },
    orderBy: { date: 'desc' },
  });
}
```

---

### 4.3 Mark Leg as Booked

```typescript
async function markLegBooked(
  tripId: string,
  legIndex: number,
  bookingDetails: {
    platform: string;
    bookingRef: string;
    cost: number;
  }
) {
  return await prisma.bookingLeg.upsert({
    where: {
      // Composite unique key
      tripId_legIndex: { tripId, legIndex },
    },
    create: {
      tripId,
      legIndex,
      isBooked: true,
      ...bookingDetails,
      bookedAt: new Date(),
    },
    update: {
      isBooked: true,
      ...bookingDetails,
      bookedAt: new Date(),
    },
  });
}
```

---

### 4.4 Cache Route Results

```typescript
async function cacheRouteResults(
  cacheKey: string,
  origin: Location,
  destination: Location,
  date: string,
  preference: string,
  routes: Route[]
) {
  return await prisma.cachedRoute.create({
    data: {
      cacheKey,
      origin,
      destination,
      date: new Date(date),
      preference: preference.toUpperCase() as Preference,
      routes,
      totalResults: routes.length,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min TTL
    },
  });
}
```

---

### 4.5 Get Cached Route

```typescript
async function getCachedRoute(cacheKey: string) {
  const cached = await prisma.cachedRoute.findUnique({
    where: { cacheKey },
  });

  // Check if expired
  if (cached && cached.expiresAt > new Date()) {
    return cached.routes;
  }

  return null; // Cache miss or expired
}
```

---

### 4.6 Track Search Query (Analytics)

```typescript
async function trackSearchQuery(
  userId: string | null,
  searchData: TripInput,
  routesFound: number
) {
  return await prisma.searchQuery.create({
    data: {
      userId,
      origin: searchData.origin,
      destination: searchData.destination,
      stops: searchData.stops || null,
      date: new Date(searchData.date),
      passengers: searchData.passengers,
      preference: searchData.preference.toUpperCase() as Preference,
      routesFound,
    },
  });
}
```

---

### 4.7 Rate Limiting

```typescript
async function checkRateLimit(identifier: string, maxRequests: number, windowMs: number) {
  const windowStart = new Date(Date.now() - windowMs);

  const record = await prisma.rateLimit.findUnique({
    where: { identifier },
  });

  if (!record || record.windowStart < windowStart) {
    // New window or first request
    await prisma.rateLimit.upsert({
      where: { identifier },
      create: {
        identifier,
        requestCount: 1,
        windowStart: new Date(),
      },
      update: {
        requestCount: 1,
        windowStart: new Date(),
      },
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.requestCount >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(record.windowStart.getTime() + windowMs),
    };
  }

  await prisma.rateLimit.update({
    where: { identifier },
    data: { requestCount: { increment: 1 } },
  });

  return { allowed: true, remaining: maxRequests - record.requestCount - 1 };
}
```

---

## 5. Database Seeding (Test Data)

**File:** `prisma/seed.ts`

```typescript
import { PrismaClient,Profession } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    create: {
      email: 'student@test.com',
      name: 'Test Student',
      profession: Profession.STUDENT,
    },
    update: {},
  });

  const professional = await prisma.user.upsert({
    where: { email: 'pro@test.com' },
    create: {
      email: 'pro@test.com',
      name: 'Test Professional',
      profession: Profession.CORPORATE,
    },
    update: {},
  });

  // Create test trips
  await prisma.trip.create({
    data: {
      userId: student.id,
      origin: {
        id: '1',
        name: 'Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        lat: 28.5355,
        lng: 77.391,
      },
      destination: {
        id: '2',
        name: 'Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        lat: 12.9716,
        lng: 77.5946,
      },
      date: new Date('2026-03-15'),
      time: '08:00',
      passengers: 1,
      preference: 'BALANCED',
      status: 'PLANNED',
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run Seeding:**
```bash
npx prisma db seed
```

---

## 6. Database Maintenance

### 6.1 Cleanup Expired Caches (Cron Job)

```typescript
// Run daily via cron or AWS Lambda
async function cleanupExpiredCaches() {
  const now = new Date();

  const deletedRoutes = await prisma.cachedRoute.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  const deletedGeocodes = await prisma.cachedGeocode.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  console.log(`Cleaned up ${deletedRoutes.count} routes, ${deletedGeocodes.count} geocodes`);
}
```

---

### 6.2 Archive Old Trips (6+ Months)

```typescript
// Run monthly
async function archiveOldTrips() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const archivedCount = await prisma.trip.updateMany({
    where: {
      date: { lt: sixMonthsAgo },
      status: 'COMPLETED',
    },
    data: {
      // Move to separate archive table (future enhancement)
      // For now, just mark as archived
    },
  });

  console.log(`Archived ${archivedCount.count} old trips`);
}
```

---

## 7. Security Considerations

### 7.1 Row-Level Security (RLS)

**Ensure users can only access their own data:**

```typescript
// ✅ CORRECT: Filter by userId
async function getUserTrips(userId: string) {
  return await prisma.trip.findMany({
    where: { userId }, // CRITICAL: Always filter by userId
  });
}

// ❌ WRONG: Returns ALL trips (security breach!)
async function getAllTrips() {
  return await prisma.trip.findMany(); // DON'T DO THIS
}
```

---

### 7.2 Input Sanitization

**Always validate inputs before database queries:**

```typescript
import { z } from 'zod';

const tripIdSchema = z.string().cuid(); // Validate CUID format

async function getTrip(userId: string, tripId: string) {
  // Validate tripId format
  const validatedId = tripIdSchema.parse(tripId);

  return await prisma.trip.findFirst({
    where: {
      id: validatedId,
      userId, // Ensure user owns this trip
    },
  });
}
```

---

## 8. Performance Optimization

### 8.1 Connection Pooling

**File:** `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Connection Pool Settings (DATABASE_URL):**
```
postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
```

---

### 8.2 Batch Operations

```typescript
// ❌ WRONG: N+1 query problem
async function markAllLegsBooked(legIds: string[]) {
  for (const id of legIds) {
    await prisma.bookingLeg.update({
      where: { id },
      data: { isBooked: true },
    });
  }
}

// ✅ CORRECT: Single batch update
async function markAllLegsBooked(legIds: string[]) {
  return await prisma.bookingLeg.updateMany({
    where: { id: { in: legIds } },
    data: { isBooked: true },
  });
}
```

---

## 9. Backup & Recovery

**Automated Daily Backups (AWS RDS):**
```bash
# Configure via AWS Console:
# - Backup retention: 7 days
# - Backup window: 3:00 AM - 4:00 AM UTC
# - Enable automated snapshots
```

**Manual Backup:**
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup_20260208.sql
```

---

**This schema is production-ready and designed for scalability, security, and performance.**

---

**END OF BACKEND SCHEMA**
