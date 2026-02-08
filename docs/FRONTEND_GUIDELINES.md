# Frontend Guidelines - RouteStitch Development Standards
## Production-Level Frontend Development Rules

**Version:** 1.0  
**Last Updated:** February 8, 2026  
**Mandatory for ALL Developers & AI**

---

## ⚠️ CRITICAL RULES - NEVER VIOLATE

### 1. **Performance is NON-NEGOTIABLE**

✅ **DO:**
- Keep bundle size < 200KB initial load
- Lazy-load pages with `next/dynamic`
- Use `<Image>` component from Next.js (automatic optimization)
- Code-split large components
- Measure performance with Lighthouse (target: 90+

 score)

❌ **DON'T:**
- Import entire libraries (`import _ from 'lodash'` → use `import { debounce } from 'lodash-es'`)
- Load heavy components on initial render
- Use large images without optimization
- Skip memoization for expensive calculations

---

### 2. **TypeScript is MANDATORY**

✅ **DO:**
- Define interfaces for ALL props
- Use Zod for runtime validation + type inference
- Enable `strict` mode in tsconfig.json
- Export types from separate `.types.ts` files

❌ **DON'T:**
- Use `any` type (use `unknown` if truly unknown, then narrow)
- Skip prop types
- Ignore TypeScript errors ("// @ts-ignore" is forbidden)

**Example:**
```typescript
// ✅ CORRECT
interface TripBuilderProps {
  onSearch: (data: TripInput) => Promise<void>;
  isLoading: boolean;
  defaultOrigin?: Location;
}

export default function TripBuilder({ onSearch, isLoading, defaultOrigin }: TripBuilderProps) {
  // ...
}

// ❌ WRONG
export default function TripBuilder(props: any) {
  // ...
}
```

---

### 3. **Component Structure**

**File Naming:**
- Components: PascalCase (`TripBuilder.tsx`, `LocationInput.tsx`)
- Utils/Hooks: camelCase (`useSearch.ts`, `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ROUTES.ts`, `COLORS.ts`)

**Folder Structure:**
```
app/
├── (pages)/
│   ├── page.tsx              # Home page
│   ├── plan/
│   │   └── page.tsx          # TripBuilder page
│   └── dashboard/
│       └── page.tsx          # My Trips
├── api/
│   └── search-routes/
│       └── route.ts          # API endpoint
components/
├── TripBuilder/
│   ├── TripBuilderInput.tsx
│   ├── LocationInput.tsx
│   └── DateTimeSelector.tsx
├── SearchResults/
│   └── RouteCard.tsx
└── shared/
    ├── Button.tsx
    ├── Input.tsx
    └── Navbar.tsx
lib/
├── validation/
│   └── tripInput.ts          # Zod schemas
├── utils/
│   ├── formatDate.ts
│   └── calculateBuffer.ts
└── services/
    └── searchRoutesService.ts
```

---

### 4. **Component Design Patterns**

**4.1 Keep Components Small (< 200 lines)**

If a component exceeds 200 lines, extract sub-components.

**Example:**
```typescript
// ❌ WRONG: 500-line monolithic component
export default function TripBuilder() {
  // ... 500 lines of complex logic
}

// ✅ CORRECT: Split into smaller components
export default function TripBuilder() {
  return (
    <>
      <TripBuilderHeader />
      <TripBuilderForm onSubmit={handleSubmit} />
      <TripBuilderResults routes={routes} />
    </>
  );
}
```

---

**4.2 Single Responsibility Principle**

Each component should do ONE thing.

**Example:**
```typescript
// ❌ WRONG: LocationInput does search + display + validation
function LocationInput() {
  const [results, setResults] = useState([]);
  const handleSearch = async () => { /* ... */ };
  const validateLocation = () => { /* ... */ };
  return (/* mixed concerns */);
}

// ✅ CORRECT: Separate concerns
function LocationInput({ value, onChange, error }: Props) {
  return <input value={value} onChange={onChange} />;
}

function LocationAutocomplete() {
  const { results, search } = useLocationSearch();
  return <LocationInput {...} />;
}
```

---

### 5. **State Management Rules**

**5.1 Use the Right Tool**

| Scope | Tool | When to Use |
|-------|------|-------------|
| Local Component | `useState` | Form inputs, toggles, modals |
| Cross-Component (same page) | Props drilling OR `useContext` | Shared state between 2-3 components |
| Global App State | Zustand | User auth, search params, cart |
| Server Data | SWR/React Query | API responses, cached data |

**5.2 Avoid Prop Drilling (> 2 levels)**

```typescript
// ❌ WRONG: Passing props through 4 levels
<Page user={user}>
  <Header user={user}>
    <Navbar user={user}>
      <UserMenu user={user} />
    </Navbar>
  </Header>
</Page>

// ✅ CORRECT: Use Zustand or Context
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

function UserMenu() {
  const user = useUserStore((state) => state.user);
  return <div>{user.name}</div>;
}
```

---

### 6. **Form Handling**

**ALWAYS use React Hook Form + Zod**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripBuilderFormSchema } from '@/lib/validation/tripInput';

export default function TripBuilderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripBuilderFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      date: new Date(),
      passengers: 1,
      preference: 'balanced',
    },
  });

  const onSubmit = (data) => {
    console.log(data); // Type-safe, validated data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('origin')} />
      {errors.origin && <span>{errors.origin.message}</span>}
      {/* ... */}
    </form>
  );
}
```

**Why:**
- ✅ Performance: Only re-renders changed fields
- ✅ Type Safety: Zod generates TypeScript types
- ✅ Validation: Client + backend use same schema

---

### 7. **Error Handling**

**7.1 Always Display User-Friendly Errors**

```typescript
// ❌ WRONG: Generic error
catch (error) {
  alert('Error');
}

// ✅ CORRECT: Specific, actionable error
catch (error) {
  if (error.code === 'NO_ROUTES_FOUND') {
    setError('No routes found for your search. Try a different date or remove custom stops.');
  } else if (error.code === 'NETWORK_ERROR') {
    setError('Connection error. Please check your internet and try again.');
  } else {
    setError('Something went wrong. Please try again later.');
    Sentry.captureException(error); // Log to monitoring
  }
}
```

**7.2 Error Boundaries for Component Errors**

```typescript
'use client';

import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Log to Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap components that may fail
<ErrorBoundary>
  <SearchResults />
</ErrorBoundary>
```

---

### 8. **Performance Optimization**

**8.1 Memoization**

Use `useMemo` for expensive calculations:

```typescript
import { useMemo } from 'react';

function RouteCard({ route }) {
  // ✅ Memoize expensive calculation
  const totalCost = useMemo(() => {
    return route.legs.reduce((sum, leg) => sum + leg.cost, 0);
  }, [route.legs]);

  return <div>{totalCost}</div>;
}
```

Use `useCallback` for callbacks passed to child components:

```typescript
import { useCallback } from 'react';

function TripBuilder() {
  const handleSearch = useCallback((data) => {
    // This function reference stays stable across re-renders
    searchRoutes(data);
  }, []);

  return <TripBuilderForm onSearch={handleSearch} />;
}
```

Use `React.memo` for components that render often with same props:

```typescript
import { memo } from 'react';

const RouteCard = memo(({ route }) => {
  return <div>{route.name}</div>;
});
```

---

**8.2 Code Splitting**

```typescript
import dynamic from 'next/dynamic';

// ✅ Lazy-load heavy components
const MapView = dynamic(() => import('@/components/MapView'), {
  loading: () => <p>Loading map...</p>,
  ssr: false, // Don't render on server (map needs browser APIs)
});

export default function SearchResults() {
  return (
    <>
      <RouteList />
      <MapView routes={routes} />
    </>
  );
}
```

---

**8.3 Image Optimization**

```typescript
import Image from 'next/image';

// ✅ Always use Next.js Image component
<Image
  src="/hero-image.jpg"
  alt="RouteStitch travel planning"
  width={1200}
  height={600}
  priority  // Load immediately (above fold)
  placeholder="blur"  // Blur-up while loading
/>

// ❌ WRONG: Raw img tag
<img src="/hero-image.jpg" alt="..." />
```

---

### 9. **Styling Guidelines**

**9.1 Use TailwindCSS Utility Classes**

```tsx
// ✅ CORRECT: Utility-first
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">RouteStitch</h2>
</div>

// ❌ WRONG: Inline styles
<div style={{ display: 'flex', padding: '24px', background: 'white' }}>
  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>RouteStitch</h2>
</div>
```

**9.2 Extract Repeated Classes**

```tsx
// ❌ WRONG: Repeated classes
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Search
</button>
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Save
</button>

// ✅ CORRECT: Reusable component
function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {children}
    </button>
  );
}
```

---

### 10. **Accessibility (a11y)**

**10.1 Semantic HTML**

```tsx
// ✅ CORRECT: Semantic tags
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <section>
    <h1>Plan Your Trip</h1>
    <form>...</form>
  </section>
</main>

// ❌ WRONG: Divs everywhere
<div className="nav">
  <div className="nav-item"><div onClick={...}>Home</div></div>
</div>
```

**10.2 ARIA Labels**

```tsx
// ✅ Add labels for screen readers
<button aria-label="Close modal" onClick={closeModal}>
  ×
</button>

<input
  type="text"
  id="origin"
  aria-describedby="origin-hint"
  {...register('origin')}
/>
<p id="origin-hint">Enter your departure city or address</p>
```

**10.3 Keyboard Navigation**

```tsx
// ✅ Ensure all interactive elements are keyboard-accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

---

### 11. **API Calls**

**11.1 Use SWR for GET Requests**

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SearchResults({ from, to, date }: Props) {
  const { data, error, isLoading } = useSWR(
    `/api/search-routes?from=${from}&to=${to}&date=${date}`,
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when window gains focus
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  
  return <RouteList routes={data.routes} />;
}
```

**11.2 Use fetch() for POST Requests**

```typescript
async function handleSubmit(data: TripInput) {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/search-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    setRoutes(result.routes);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setIsLoading(false);
  }
}
```

---

### 12. **Testing Guidelines**

**12.1 Write Tests for Critical Logic**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateBuffer } from '@/lib/utils/calculateBuffer';

describe('Buffer Calculator', () => {
  it('adds 50% buffer during peak hours', () => {
    const buffer = calculateBuffer({
      baseTime: 30,
      isPeakHour: true,
    });
    expect(buffer).toBe(45); // 30 * 1.5
  });

  it('returns minimum 15 min buffer', () => {
    const buffer = calculateBuffer({ baseTime: 5 });
    expect(buffer).toBe(15); // Minimum enforced
  });
});
```

**12.2 Test Components with Testing Library**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LocationInput from '@/components/TripBuilder/LocationInput';

describe('LocationInput', () => {
  it('renders autocomplete suggestions', async () => {
    render(<LocationInput value="" onChange={() => {}} />);
    
    const input = screen.getByPlaceholderText('Enter city...');
    fireEvent.change(input, { target: { value: 'Delhi' } });

    expect(await screen.findByText('New Delhi')).toBeInTheDocument();
    expect(await screen.findByText('Delhi NCR')).toBeInTheDocument();
  });
});
```

---

### 13. **Security Best Practices**

**13.1 NEVER Store Sensitive Data in LocalStorage**

```typescript
// ❌ WRONG: Auth tokens in localStorage (vulnerable to XSS)
localStorage.setItem('authToken', token);

// ✅ CORRECT: Use httpOnly cookies (set by backend)
// Frontend just sends cookies automatically
```

**13.2 Sanitize User Input**

```typescript
import DOMPurify from 'dompurify';

// ✅ Sanitize before rendering HTML
function ReviewCard({ review }: Props) {
  const cleanHTML = DOMPurify.sanitize(review.content);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
}
```

**13.3 Validate All Inputs (Even on Frontend)**

```typescript
// ✅ Use Zod for client-side validation
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const result = schema.safeParse(formData);
if (!result.success) {
  // Show validation errors
}
```

---

### 14. **Code Comments**

**14.1 When to Comment**

✅ **DO Comment:**
- Complex algorithms (buffer calculation, route ranking)
- Non-obvious business logic
- Workarounds for browser bugs
- TODOs (with issue number)

❌ **DON'T Comment:**
- Obvious code (`i++; // increment i`)
- What code does (code should be self-explanatory)

**Example:**
```typescript
// ✅ GOOD: Explains WHY
// We add 50% buffer during peak hours (6-10 AM, 5-9 PM) because
// historical data shows trains are delayed 40% more during these times
const peakHourMultiplier = isPeakHour(time) ? 1.5 : 1.0;

// ❌ BAD: Explains WHAT (obvious from code)
// Multiply by 1.5 if peak hour
const peakHourMultiplier = isPeakHour(time) ? 1.5 : 1.0;
```

---

### 15. **Git Commit Guidelines**

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Formatting, missing semicolons, etc.
- `test`: Adding tests
- `docs`: Documentation only
- `chore`: grunt tasks, dependencies, etc.

**Examples:**
```
feat(tripbuilder): add custom stops feature

- Allow users to add unlimited stops
- Calculate adjusted buffer times per stop
- Add stop duration input (15 min - 72 hours)

Closes #45

fix(search): prevent duplicate API calls

Debounce autocomplete queries to 300ms to avoid
hitting rate limits on Nominatim API.

Fixes #67
```

---

### 16. **Browser Compatibility**

**Target Browsers:**
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+
- Mobile: iOS Safari 15+, Chrome Android 100+

**Use Polyfills When Needed:**
```bash
# Core-js for older browser support (if needed)
npm install core-js
```

**Check Compatibility:**
- Use [caniuse.com](https://caniuse.com) before using new APIs
- Test on BrowserStack (free for open-source)

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All TypeScript errors resolved (`npm run build` passes)
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] No console.log() statements (use proper logging library)
- [ ] All environment variables in `.env.production`
- [ ] Error tracking (Sentry) configured
- [ ] Meta tags (title, description, OG images) on all pages
- [ ] Favicon and app icons added
- [ ] 404 and 500 error pages styled
- [ ] Loading states for all async operations
- [ ] Mobile responsiveness tested (Chrome DevTools + real devices)

---

**This document is the law for frontend development. Follow it strictly for production-grade code.**

---

**END OF FRONTEND GUIDELINES**
