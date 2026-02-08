import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - User input string
 * @returns Sanitized string safe for display
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') {
        return '';
    }

    // Remove HTML and scripts
    const clean = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // No HTML tags allowed
        ALLOWED_ATTR: [] // No attributes allowed
    });

    // Trim and limit length
    return clean.trim().slice(0, 200);
}

/**
 * Sanitizes location name input
 * Allows alphanumeric, spaces, hyphens, and common punctuation
 */
export function sanitizeLocationName(input: string): string {
    const sanitized = sanitizeString(input);

    // Allow only: letters, numbers, spaces, hyphens, commas, parentheses, apostrophes
    return sanitized.replace(/[^a-zA-Z0-9\s\-,()'.]/g, '');
}

/**
 * Sanitizes notes/activities input
 * Allows basic punctuation but no HTML
 */
export function sanitizeNotes(input: string): string {
    const sanitized = sanitizeString(input);

    // Allow letters, numbers, spaces, and common punctuation
    return sanitized.replace(/[^a-zA-Z0-9\s\-,.()'":!?]/g, '').slice(0, 500);
}

/**
 * Validates and sanitizes numeric input
 * @param input - Numeric input
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Validated number or undefined if invalid
 */
export function sanitizeNumber(input: any, min: number, max: number): number | undefined {
    const num = Number(input);

    if (isNaN(num) || !isFinite(num)) {
        return undefined;
    }

    if (num < min || num > max) {
        return undefined;
    }

    return Math.floor(num); // Integer only
}

/**
 * Validates email format (basic check)
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number (Indian format)
 */
export function isValidIndianPhone(phone: string): boolean {
    // Remove spaces and hyphens
    const cleaned = phone.replace(/[\s\-]/g, '');

    // Check if it matches Indian phone patterns
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(cleaned);
}

/**
 * Sanitizes object by sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = { ...obj };

    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeString(sanitized[key]) as any;
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeObject(sanitized[key]);
        }
    }

    return sanitized;
}

/**
 * Rate limiting helper - tracks request counts per IP
 */
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetTime) {
        // New window
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + windowMs
        };
        rateLimitMap.set(identifier, newEntry);

        return {
            allowed: true,
            remaining: maxRequests - 1,
            resetTime: newEntry.resetTime
        };
    }

    // Within existing window
    if (entry.count >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime
        };
    }

    entry.count++;

    return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetTime: entry.resetTime
    };
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
    const now = Date.now();

    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}

// Run cleanup every 5 minutes in Node.js environment
// This file is backend-only, so we can safely use setInterval
setInterval(cleanupRateLimits, 5 * 60 * 1000);
