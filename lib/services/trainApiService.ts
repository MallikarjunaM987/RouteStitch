/**
 * Train API Service using Rappid API
 * API: https://rappid.in/apis/train.php?train_no={train_number}
 * 
 * This service fetches real-time train route data including:
 * - Station names and distances
 * - Scheduled and actual timings
 * - Delays and running status
 * - Platform numbers
 */

export interface TrainStation {
    is_current_station: boolean;
    station_name: string;
    distance: string;
    timing: string;
    delay: string;
    platform: string;
    halt: string;
}

export interface TrainRouteResponse {
    success: boolean;
    train_name: string;
    message: string;
    updated_time: string;
    data: TrainStation[];
}

export interface TrainInfo {
    trainNumber: string;
    trainName: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: number;  // minutes
    distance: number;  // km
    delay: string;
    stations: TrainStation[];
}

// Popular train numbers for major routes
export const POPULAR_TRAINS: Record<string, { number: string; name: string; route: string }> = {
    'delhi-mumbai': {
        number: '12951',
        name: 'Rajdhani Express',
        route: 'New Delhi → Mumbai Central'
    },
    'mumbai-delhi': {
        number: '12952',
        name: 'Mumbai Rajdhani',
        route: 'Mumbai Central → New Delhi'
    },
    'bangalore-delhi': {
        number: '12627',
        name: 'Karnataka Express',
        route: 'Bangalore → New Delhi'
    },
    'delhi-bangalore': {
        number: '12628',
        name: 'Karnataka Express',
        route: 'New Delhi → Bangalore'
    },
    'bangalore-hyderabad': {
        number: '12785',
        name: 'Kacheguda Express',
        route: 'Bangalore → Hyderabad'
    },
    'chennai-bangalore': {
        number: '12007',
        name: 'Shatabdi Express',
        route: 'Chennai → Bangalore'
    },
    'pune-mumbai': {
        number: '12123',
        name: 'Deccan Queen',
        route: 'Pune → Mumbai'
    }
};

/**
 * Fetch train route data from Rappid API
 */
export async function fetchTrainRoute(trainNumber: string): Promise<TrainInfo | null> {
    try {
        const response = await fetch(`https://rappid.in/apis/train.php?train_no=${trainNumber}`);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: TrainRouteResponse = await response.json();

        if (!data.success || !data.data || data.data.length === 0) {
            console.error('Invalid train data received:', data);
            return null;
        }

        // Extract source and destination
        const source = data.data[0];
        const destination = data.data[data.data.length - 1];

        // Parse departure time (format: "17:0717:00" - actual vs scheduled)
        const departureTime = source.timing.length > 5
            ? source.timing.substring(0, 5)  // Actual time
            : source.timing;

        // Parse arrival time
        const arrivalTime = destination.timing === 'Destination'
            ? destination.timing
            : (destination.timing.length > 5 ? destination.timing.substring(0, 5) : destination.timing);

        // Calculate total distance
        const lastStationDistance = destination.distance !== '-'
            ? parseInt(destination.distance.replace(' km', ''))
            : 0;

        // Calculate duration (rough estimate from timings)
        const duration = calculateDuration(departureTime, arrivalTime);

        return {
            trainNumber,
            trainName: data.train_name.replace(' Running Status', ''),
            from: source.station_name,
            to: destination.station_name,
            departure: departureTime,
            arrival: arrivalTime === 'Destination' ? 'N/A' : arrivalTime,
            duration,
            distance: lastStationDistance,
            delay: source.delay || 'On Time',
            stations: data.data
        };

    } catch (error) {
        console.error(`Failed to fetch train ${trainNumber}:`, error);
        return null;
    }
}

/**
 * Get trains between two cities
 */
export async function getTrainsBetweenCities(
    origin: string,
    destination: string
): Promise<TrainInfo[]> {
    const routeKey = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
    const trains: TrainInfo[] = [];

    // Check if we have a popular train for this route
    if (POPULAR_TRAINS[routeKey]) {
        const trainData = await fetchTrainRoute(POPULAR_TRAINS[routeKey].number);
        if (trainData) {
            trains.push(trainData);
        }
    }

    // Try to find more trains (you could expand this with a database of train numbers)
    // For now, return what we found
    return trains;
}

/**
 * Search trains by origin and destination city names
 * Returns list of available trains with their details
 */
export async function searchTrains(
    origin: string,
    destination: string
): Promise<TrainInfo[]> {
    // Normalize city names
    const normalizedOrigin = origin.toLowerCase().trim();
    const normalizedDest = destination.toLowerCase().trim();

    // Get trains for this route
    const trains = await getTrainsBetweenCities(normalizedOrigin, normalizedDest);

    return trains;
}

/**
 * Calculate duration in minutes between two times
 * Format: "HH:MM"
 */
function calculateDuration(departure: string, arrival: string): number {
    if (arrival === 'Destination' || arrival === 'N/A') {
        return 0;
    }

    const [depHour, depMin] = departure.split(':').map(Number);
    const [arrHour, arrMin] = arrival.split(':').map(Number);

    let durationMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);

    // Handle overnight journeys
    if (durationMinutes < 0) {
        durationMinutes += 24 * 60;
    }

    return durationMinutes;
}

/**
 * Get estimated train fare (rough calculation based on distance and class)
 */
export function estimateTrainFare(distance: number, seatClass: '3A' | '2A' | 'SL' | 'CC' = '3A'): number {
    const baseRates: Record<string, number> = {
        'SL': 1.5,   // Sleeper
        '3A': 3.0,   // 3rd AC
        '2A': 4.5,   // 2nd AC
        'CC': 2.0    // Chair Car
    };

    return Math.round(distance * baseRates[seatClass]);
}

/**
 * Format train data for display in RouteStitch
 */
export function formatTrainForRoute(train: TrainInfo, seatClass: '3A' | '2A' | 'SL' | 'CC' = '3A') {
    const fare = estimateTrainFare(train.distance, seatClass);

    return {
        mode: 'train' as const,
        from: train.from,
        to: train.to,
        departure: train.departure,
        arrival: train.arrival,
        duration: `${Math.floor(train.duration / 60)}h ${train.duration % 60}m`,
        durationMinutes: train.duration,
        cost: fare,
        operator: train.trainName,
        trainNumber: train.trainNumber,
        bookingPlatforms: [
            {
                name: 'IRCTC',
                url: 'https://www.irctc.co.in/nget/train-search',
                recommended: true,
                note: 'Official railway booking'
            },
            {
                name: 'ConfirmTkt',
                url: `https://www.confirmtkt.com/train-tickets/${train.trainNumber}`,
                note: 'Tatkal booking assistance'
            }
        ]
    };
}
