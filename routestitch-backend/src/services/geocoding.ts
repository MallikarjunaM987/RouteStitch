import { GeolocationResult, Location } from '../types/tripBuilder';
import cities from '../data/cities.json';

// LRU Cache for geocoding results
class LRUCache<K, V> {
    private cache: Map<K, V>;
    private maxSize: number;

    constructor(maxSize: number = 100) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        if (!this.cache.has(key)) return undefined;

        // Move to end (most recently used)
        const value = this.cache.get(key)!;
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove oldest (first) item
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, value);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }
}

// Cache for geocoding results (100 most recent queries)
const geocodingCache = new LRUCache<string, GeolocationResult>(100);

/**
 * Get user's current location using browser Geolocation API
 */
export async function getCurrentLocation(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocode to get address
                    const address = await reverseGeocode(latitude, longitude);

                    resolve({
                        lat: latitude,
                        lng: longitude,
                        ...address
                    });
                } catch (error) {
                    // Return coordinates even if reverse geocoding fails
                    resolve({
                        lat: latitude,
                        lng: longitude
                    });
                }
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // Cache for 5 minutes
            }
        );
    });
}

/**
 * Reverse geocode coordinates to address using Nominatim API
 * Rate limited to 1 request per second
 */
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds to be safe

export async function reverseGeocode(
    lat: number,
    lng: number
): Promise<Pick<GeolocationResult, 'address' | 'city' | 'state' | 'country'>> {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;

    // Check cache first
    if (geocodingCache.has(cacheKey)) {
        const cached = geocodingCache.get(cacheKey)!;
        return {
            address: cached.address,
            city: cached.city,
            state: cached.state,
            country: cached.country
        };
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve =>
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
    }

    lastRequestTime = Date.now();

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
            `lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'RouteStitch/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();
        const result = {
            address: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            country: data.address?.country || 'India'
        };

        // Cache result
        geocodingCache.set(cacheKey, {
            lat,
            lng,
            ...result
        });

        return result;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return {
            address: `${lat}, ${lng}`,
            country: 'India'
        };
    }
}

/**
 * Search cities by name with fuzzy matching
 * @param query - Search query
 * @param limit - Maximum results to return
 */
export function searchCities(query: string, limit: number = 10): Location[] {
    if (!query || query.length < 2) {
        return [];
    }

    const lowerQuery = query.toLowerCase().trim();
    const results: Array<{ city: typeof cities.cities[0]; score: number }> = [];

    for (const city of cities.cities) {
        const cityName = city.name.toLowerCase();
        const stateName = city.state.toLowerCase();

        let score = 0;

        // Exact match
        if (cityName === lowerQuery) {
            score = 100;
        }
        // Starts with query
        else if (cityName.startsWith(lowerQuery)) {
            score = 80;
        }
        // Contains query
        else if (cityName.includes(lowerQuery)) {
            score = 60;
        }
        // State name match
        else if (stateName.includes(lowerQuery)) {
            score = 40;
        }
        // Fuzzy match (simple Levenshtein-like)
        else {
            const distance = getLevenshteinDistance(lowerQuery, cityName);
            if (distance <= 3) {
                score = 50 - (distance * 10);
            }
        }

        // Boost score for larger cities
        if (city.population) {
            score += Math.min(20, city.population / 500000);
        }

        if (score > 0) {
            results.push({ city, score });
        }
    }

    // Sort by score (descending) and return top results
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ city }) => ({
            id: city.id,
            name: city.name,
            city: city.name,
            state: city.state,
            country: city.country,
            lat: city.lat,
            lng: city.lng,
            type: 'city' as const,
            displayName: `${city.name}, ${city.state}`
        }));
}

/**
 * Get city by ID
 */
export function getCityById(id: string): Location | undefined {
    const city = cities.cities.find(c => c.id === id);

    if (!city) return undefined;

    return {
        id: city.id,
        name: city.name,
        city: city.name,
        state: city.state,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        type: 'city',
        displayName: `${city.name}, ${city.state}`
    };
}

/**
 * Simple Levenshtein distance calculation
 */
function getLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculate distance between two locations (Haversine formula)
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
