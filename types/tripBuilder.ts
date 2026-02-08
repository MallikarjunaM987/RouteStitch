
export type TransportMode =
    | 'train'
    | 'bus'
    | 'flight'
    | 'metro'
    | 'taxi'
    | 'auto'
    | 'walk';

export type RoutePreference = 'fastest' | 'cheapest' | 'balanced';

export interface Location {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
    type?: 'city' | 'station' | 'airport' | 'bus_stand' | 'address';
    displayName?: string;
}

export interface TripStop {
    id: string;
    location: Location;
    duration: number; // in minutes
    arrivalTime?: string;
    departureTime?: string;
    activities?: string[];
    notes?: string;
}

export interface TripInput {
    origin: Location;
    destination: Location;
    date: string; // ISO 8601 format
    time?: string; // HH:mm format
    passengers: number;
    preference: RoutePreference;
    stops?: TripStop[];
}

export interface RouteLeg {
    id: string;
    mode: TransportMode;
    operator?: string;
    operatorLogo?: string;
    from: Location;
    to: Location;
    departureTime: string;
    arrivalTime: string;
    duration: number; // in minutes
    distance?: number; // in kilometers
    cost: number; // in rupees
    details?: {
        trainNumber?: string;
        trainName?: string;
        busType?: string;
        flightNumber?: string;
        seatClass?: string;
        seatsAvailable?: number;
        bookingUrl?: string;
    };
}

export interface Route {
    id: string;
    type: string; // e.g., 'train_only', 'flight_local', 'train_metro'
    legs: RouteLeg[];
    totalCost: number;
    totalDuration: number; // in minutes
    totalDistance?: number; // in kilometers
    reliability?: number; // 0-100 score
    comfortScore?: number; // 0-100 score
    finalScore?: number; // 0-100 overall score
    category?: 'Fastest' | 'Cheapest' | 'Best Value' | 'Most Reliable';
    bufferTimes?: {
        legIndex: number;
        buffer: number; // in minutes
        status: 'safe' | 'moderate' | 'risky';
    }[];
}

export interface BookingPlatform {
    platform: string;
    url: string;
    logo: string;
    price?: number;
    note?: string;
    recommended?: boolean;
    cashback?: number;
}

export interface SearchResult {
    success: boolean;
    routes: Route[];
    totalResults: number;
    searchParams: TripInput;
    timestamp: string;
    error?: string;
}

export interface City {
    id: string;
    name: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
    population?: number;
    airports?: string[];
    railwayStations?: string[];
    busStands?: string[];
}

// Form validation types
export interface TripBuilderFormData {
    origin: string;
    destination: string;
    date: Date;
    time: string;
    passengers: number;
    preference: RoutePreference;
    stops: {
        location: string;
        duration: number;
    }[];
}

// Geolocation types
export interface GeolocationResult {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    error?: string;
}
