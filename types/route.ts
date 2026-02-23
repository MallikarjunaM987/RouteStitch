/**
 * Route Types for RouteStitch Search API
 * 
 * Defines the structure for multi-modal travel routes
 */

export type TransportMode = 'train' | 'bus' | 'flight' | 'metro' | 'taxi' | 'auto' | 'walk';
export type Preference = 'fastest' | 'cheapest' | 'balanced';
export type RouteCategory = 'Fastest' | 'Cheapest' | 'Best Value' | 'Recommended';

/**
 * User's search input for finding routes
 */
export interface SearchRoutesInput {
    origin: string;
    destination: string;
    date: string;          // YYYY-MM-DD
    time?: string;         // HH:MM (24-hour format)
    passengers: number;
    preference: Preference;
    stops?: Stop[];
}

/**
 * Intermediate stop on the journey
 */
export interface Stop {
    location: string;
    duration: number;      // Duration in minutes
}

/**
 * Complete route from origin to destination
 */
export interface Route {
    id: string;
    totalCost: number;
    totalDuration: string;        // Human-readable (e.g., "14h 30m")
    totalDurationMinutes: number;
    reliability: number;          // 0-100 score
    category?: RouteCategory;
    legs: Leg[];
    score?: number;               // Internal ranking score
}

/**
 * Individual leg/segment of a route
 */
export interface Leg {
    mode: TransportMode;
    from: string;
    to: string;
    departure: string;      // ISO timestamp or time string
    arrival: string;
    duration: string;       // Human-readable (e.g., "2h 30m")
    durationMinutes: number;
    cost: number;
    operator?: string;      // e.g., "Rajdhani Express", "IndiGo", "RedBus"
    trainNumber?: string;   // For trains
    flightNumber?: string;  // For flights
    busType?: string;       // For buses (Sleeper, AC, etc.)
    bookingPlatforms?: BookingPlatform[];
}

/**
 * Platform information for booking a leg
 */
export interface BookingPlatform {
    name: string;
    url: string;
    logo?: string;
    price?: number;
    note?: string;          // e.g., "Best price", "Student discount available"
    recommended?: boolean;
}

/**
 * API Response structure
 */
export interface SearchRoutesResponse {
    routes: Route[];
    searchParams: SearchRoutesInput;
    timestamp: string;
}
