import { SearchRoutesInput, Route, Leg, BookingPlatform } from '../../types/route';
import { validateSearchInput } from '../validation/searchRoutes';
import { searchTrains, formatTrainForRoute } from './trainApiService';

/**
 * Mock Route Service
 * Generates realistic route combinations for testing and development
 * 
 * TODO: Replace with real API calls to:
 * - MOTIS routing engine
 * - RedBus scraper
 * - Skyscanner API
 * - Train data sources
 */

// Helper: Format duration from minutes to human-readable
function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

// Helper: Add minutes to time string
function addMinutes(timeStr: string, minutesToAdd: number): string {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + minutesToAdd);
    return date.toTimeString().slice(0, 5);
}

// Helper: Generate booking platforms for a leg
function getBookingPlatforms(mode: string, from: string, to: string): BookingPlatform[] {
    const platforms: BookingPlatform[] = [];

    if (mode === 'train') {
        platforms.push(
            {
                name: 'IRCTC',
                url: `https://www.irctc.co.in/nget/train-search`,
                recommended: true,
                note: 'Official railway booking'
            },
            {
                name: 'ConfirmTkt',
                url: `https://www.confirmtkt.com/trains/${from}-to-${to}`,
                note: 'Tatkal booking assistance'
            },
            {
                name: 'RailYatri',
                url: `https://www.railyatri.in/`,
                note: 'Real-time train tracking'
            }
        );
    }

    if (mode === 'bus') {
        platforms.push(
            {
                name: 'RedBus',
                url: `https://www.redbus.in/bus-tickets/${from}-to-${to}`,
                recommended: true,
                note: 'Largest bus network'
            },
            {
                name: 'AbhiBus',
                url: `https://www.abhibus.com/${from}-to-${to}-bus`,
                note: 'Often has better prices'
            }
        );
    }

    if (mode === 'flight') {
        platforms.push(
            {
                name: 'MakeMyTrip',
                url: `https://www.makemytrip.com/flight/search`,
                note: 'Cashback offers available'
            },
            {
                name: 'Goibibo',
                url: `https://www.goibibo.com/flights/`,
                recommended: true,
                note: 'Best price comparison'
            },
            {
                name: 'Skyscanner',
                url: `https://www.skyscanner.co.in/`,
                note: 'International price comparison'
            }
        );
    }

    return platforms;
}

// Mock route templates for major corridors
const routeTemplates: Record<string, any> = {
    'delhi-mumbai': {
        distance: 1400,
        trainRoutes: [
            {
                name: 'Rajdhani Express',
                number: '12951',
                duration: 940,
                cost: 2800,
                departure: '16:55',
                class: '3A'
            },
            {
                name: 'August Kranti Rajdhani',
                number: '12953',
                duration: 925,
                cost: 3200,
                departure: '16:35',
                class: '2A'
            },
            {
                name: 'Mumbai Rajdhani',
                number: '12955',
                duration: 960,
                cost: 2650,
                departure: '16:00',
                class: '3A'
            }
        ],
        busRoutes: [
            {
                operator: 'VRL Travels',
                duration: 1260,
                cost: 1600,
                type: 'AC Sleeper',
                departure: '18:00'
            },
            {
                operator: 'Sharma Travels',
                duration: 1320,
                cost: 1400,
                type: 'Non-AC Sleeper',
                departure: '19:30'
            }
        ],
        flightRoutes: [
            {
                airline: 'IndiGo',
                number: '6E2343',
                duration: 135,
                cost: 4500,
                departure: '08:00'
            },
            {
                airline: 'Air India',
                number: 'AI660',
                duration: 140,
                cost: 5200,
                departure: '10:30'
            },
            {
                airline: 'Vistara',
                number: 'UK995',
                duration: 135,
                cost: 6500,
                departure: '14:00'
            }
        ]
    },
    'bangalore-hyderabad': {
        distance: 570,
        trainRoutes: [
            {
                name: 'Kacheguda Express',
                number: '12785',
                duration: 660,
                cost: 850,
                departure: '21:15',
                class: 'Sleeper'
            }
        ],
        busRoutes: [
            {
                operator: 'KSRTC Airavat',
                duration: 600,
                cost: 900,
                type: 'AC Sleeper',
                departure: '22:00'
            },
            {
                operator: 'Orange Travels',
                duration: 630,
                cost: 750,
                type: 'AC Semi-Sleeper',
                departure: '23:30'
            }
        ],
        flightRoutes: [
            {
                airline: 'IndiGo',
                number: '6E6251',
                duration: 60,
                cost: 3200,
                departure: '07:30'
            }
        ]
    },
    'delhi-bangalore': {
        distance: 2150,
        trainRoutes: [
            {
                name: 'Karnataka Express',
                number: '12627',
                duration: 2040,
                cost: 2200,
                departure: '19:30',
                class: '3A'
            }
        ],
        flightRoutes: [
            {
                airline: 'IndiGo',
                number: '6E6115',
                duration: 165,
                cost: 5500,
                departure: '06:00'
            },
            {
                airline: 'Air India',
                number: 'AI804',
                duration: 170,
                cost: 6200,
                departure: '09:15'
            }
        ]
    },
    'chennai-bangalore': {
        distance: 350,
        trainRoutes: [
            {
                name: 'Shatabdi Express',
                number: '12007',
                duration: 300,
                cost: 680,
                departure: '06:00',
                class: 'CC'
            }
        ],
        busRoutes: [
            {
                operator: 'KSRTC Airavat',
                duration: 420,
                cost: 550,
                type: 'AC Sleeper',
                departure: '23:00'
            }
        ]
    },
    'pune-mumbai': {
        distance: 150,
        trainRoutes: [
            {
                name: 'Deccan Queen',
                number: '12123',
                duration: 210,
                cost: 250,
                departure: '07:15',
                class: '2S'
            }
        ],
        busRoutes: [
            {
                operator: 'MSRTC Shivneri',
                duration: 180,
                cost: 350,
                type: 'AC',
                departure: '06:30'
            }
        ]
    }
};

function getRouteKey(origin: string, destination: string): string {
    const key1 = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
    const key2 = `${destination.toLowerCase()}-${origin.toLowerCase()}`;

    // Check both directions
    if (routeTemplates[key1]) return key1;
    if (routeTemplates[key2]) return key2;

    return '';
}

/**
 * Generate mock routes based on search input
 * NOW WITH REAL TRAIN DATA from Rappid API!
 */
export async function generateMockRoutes(input: SearchRoutesInput): Promise<Route[]> {
    const routes: Route[] = [];
    const routeKey = getRouteKey(input.origin, input.destination);
    const startTime = input.time || '08:00';

    // If no template exists for this route, return generic route
    if (!routeKey) {
        return generateGenericRoute(input, startTime);
    }

    const template = routeTemplates[routeKey];
    let routeId = 1;

    // ===== REAL TRAIN DATA from Rappid API =====
    try {
        console.log(`🚂 Fetching real train data for ${input.origin} → ${input.destination}...`);
        const realTrains = await searchTrains(input.origin, input.destination);

        if (realTrains && realTrains.length > 0) {
            console.log(`✅ Found ${realTrains.length} real train(s)!`);

            realTrains.forEach(train => {
                // Format train data for our route structure
                const trainLeg = formatTrainForRoute(train, '3A');

                const legs: Leg[] = [
                    // First mile: Taxi to station
                    {
                        mode: 'taxi',
                        from: input.origin,
                        to: `${train.from}`,
                        departure: startTime,
                        arrival: addMinutes(startTime, 30),
                        duration: '30m',
                        durationMinutes: 30,
                        cost: 350,
                        operator: 'Uber/Ola'
                    },
                    // Main train leg (REAL DATA!)
                    trainLeg,
                    // Last mile: Taxi from station
                    {
                        mode: 'taxi',
                        from: `${train.to}`,
                        to: input.destination,
                        departure: train.arrival !== 'N/A' ? train.arrival : addMinutes(train.departure, train.duration),
                        arrival: train.arrival !== 'N/A' ? addMinutes(train.arrival, 40) : addMinutes(train.departure, train.duration + 40),
                        duration: '40m',
                        durationMinutes: 40,
                        cost: 400,
                        operator: 'Uber/Ola'
                    }
                ];

                const totalCost = legs.reduce((sum, leg) => sum + leg.cost, 0);
                const totalDurationMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);

                routes.push({
                    id: `route-real-train-${train.trainNumber}`,
                    totalCost,
                    totalDuration: formatDuration(totalDurationMinutes),
                    totalDurationMinutes,
                    reliability: 90,
                    category: 'Train',
                    legs
                });
            });
        } else {
            console.log('⚠️ No real train data found, using mock data...');
            // Fallback to mock train data if API returns nothing
            if (template.trainRoutes) {
                template.trainRoutes.forEach((train: any) => {
                    const legs: Leg[] = [
                        {
                            mode: 'taxi',
                            from: input.origin,
                            to: `${input.origin} Railway Station`,
                            departure: startTime,
                            arrival: addMinutes(startTime, 30),
                            duration: '30m',
                            durationMinutes: 30,
                            cost: 350,
                            operator: 'Uber/Ola'
                        },
                        {
                            mode: 'train',
                            from: input.origin,
                            to: input.destination,
                            departure: train.departure,
                            arrival: addMinutes(train.departure, train.duration),
                            duration: formatDuration(train.duration),
                            durationMinutes: train.duration,
                            cost: train.cost,
                            operator: train.name,
                            trainNumber: train.number,
                            bookingPlatforms: getBookingPlatforms('train', input.origin, input.destination)
                        },
                        {
                            mode: 'taxi',
                            from: `${input.destination} Railway Station`,
                            to: input.destination,
                            departure: addMinutes(train.departure, train.duration),
                            arrival: addMinutes(train.departure, train.duration + 40),
                            duration: '40m',
                            durationMinutes: 40,
                            cost: 400,
                            operator: 'Uber/Ola'
                        }
                    ];

                    const totalCost = legs.reduce((sum, leg) => sum + leg.cost, 0);
                    const totalDurationMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);

                    routes.push({
                        id: `route-${routeId++}`,
                        totalCost,
                        totalDuration: formatDuration(totalDurationMinutes),
                        totalDurationMinutes,
                        reliability: 90,
                        legs
                    });
                });
            }
        }
    } catch (error) {
        console.error('❌ Error fetching real train data:', error);
        // Fallback to mock train data on error
        if (template.trainRoutes) {
            template.trainRoutes.forEach((train: any) => {
                const legs: Leg[] = [
                    {
                        mode: 'taxi',
                        from: input.origin,
                        to: `${input.origin} Railway Station`,
                        departure: startTime,
                        arrival: addMinutes(startTime, 30),
                        duration: '30m',
                        durationMinutes: 30,
                        cost: 350,
                        operator: 'Uber/Ola'
                    },
                    {
                        mode: 'train',
                        from: input.origin,
                        to: input.destination,
                        departure: train.departure,
                        arrival: addMinutes(train.departure, train.duration),
                        duration: formatDuration(train.duration),
                        durationMinutes: train.duration,
                        cost: train.cost,
                        operator: train.name,
                        trainNumber: train.number,
                        bookingPlatforms: getBookingPlatforms('train', input.origin, input.destination)
                    },
                    {
                        mode: 'taxi',
                        from: `${input.destination} Railway Station`,
                        to: input.destination,
                        departure: addMinutes(train.departure, train.duration),
                        arrival: addMinutes(train.departure, train.duration + 40),
                        duration: '40m',
                        durationMinutes: 40,
                        cost: 400,
                        operator: 'Uber/Ola'
                    }
                ];

                const totalCost = legs.reduce((sum, leg) => sum + leg.cost, 0);
                const totalDurationMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);

                routes.push({
                    id: `route-${routeId++}`,
                    totalCost,
                    totalDuration: formatDuration(totalDurationMinutes),
                    totalDurationMinutes,
                    reliability: 90,
                    legs
                });
            });
        }
    }

    // Generate flight-based routes
    if (template.flightRoutes) {
        template.flightRoutes.forEach((flight: any) => {
            const legs: Leg[] = [
                // First mile: Metro/Taxi to airport
                {
                    mode: 'metro',
                    from: input.origin,
                    to: `${input.origin} Airport`,
                    departure: startTime,
                    arrival: addMinutes(startTime, 45),
                    duration: '45m',
                    durationMinutes: 45,
                    cost: 60,
                    operator: `${input.origin} Metro`
                },
                // Main flight leg
                {
                    mode: 'flight',
                    from: input.origin,
                    to: input.destination,
                    departure: flight.departure,
                    arrival: addMinutes(flight.departure, flight.duration),
                    duration: formatDuration(flight.duration),
                    durationMinutes: flight.duration,
                    cost: flight.cost,
                    operator: flight.airline,
                    flightNumber: flight.number,
                    bookingPlatforms: getBookingPlatforms('flight', input.origin, input.destination)
                },
                // Last mile: Taxi from airport
                {
                    mode: 'taxi',
                    from: `${input.destination} Airport`,
                    to: input.destination,
                    departure: addMinutes(flight.departure, flight.duration),
                    arrival: addMinutes(flight.departure, flight.duration + 60),
                    duration: '1h',
                    durationMinutes: 60,
                    cost: 900,
                    operator: 'Airport Taxi'
                }
            ];

            const totalCost = legs.reduce((sum, leg) => sum + leg.cost, 0);
            const totalDurationMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);

            routes.push({
                id: `route-${routeId++}`,
                totalCost,
                totalDuration: formatDuration(totalDurationMinutes),
                totalDurationMinutes,
                reliability: 85,
                legs
            });
        });
    }

    // Generate bus-based routes
    if (template.busRoutes) {
        template.busRoutes.forEach((bus: any) => {
            const legs: Leg[] = [
                // First mile: Auto to bus stand
                {
                    mode: 'auto',
                    from: input.origin,
                    to: `${input.origin} Bus Stand`,
                    departure: startTime,
                    arrival: addMinutes(startTime, 20),
                    duration: '20m',
                    durationMinutes: 20,
                    cost: 150,
                    operator: 'Auto Rickshaw'
                },
                // Main bus leg
                {
                    mode: 'bus',
                    from: input.origin,
                    to: input.destination,
                    departure: bus.departure,
                    arrival: addMinutes(bus.departure, bus.duration),
                    duration: formatDuration(bus.duration),
                    durationMinutes: bus.duration,
                    cost: bus.cost,
                    operator: bus.operator,
                    busType: bus.type,
                    bookingPlatforms: getBookingPlatforms('bus', input.origin, input.destination)
                },
                // Last mile: Auto from bus stand
                {
                    mode: 'auto',
                    from: `${input.destination} Bus Stand`,
                    to: input.destination,
                    departure: addMinutes(bus.departure, bus.duration),
                    arrival: addMinutes(bus.departure, bus.duration + 30),
                    duration: '30m',
                    durationMinutes: 30,
                    cost: 200,
                    operator: 'Auto Rickshaw'
                }
            ];

            const totalCost = legs.reduce((sum, leg) => sum + leg.cost, 0);
            const totalDurationMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);

            routes.push({
                id: `route-${routeId++}`,
                totalCost,
                totalDuration: formatDuration(totalDurationMinutes),
                totalDurationMinutes,
                reliability: 70,
                legs
            });
        });
    }

    // Rank routes based on preference
    return rankRoutes(routes, input.preference);
}

function generateGenericRoute(input: SearchRoutesInput, startTime: string): Route[] {
    // Fallback for unsupported routes
    return [{
        id: 'route-generic',
        totalCost: 2500,
        totalDuration: '12h',
        totalDurationMinutes: 720,
        reliability: 75,
        category: 'Recommended',
        legs: [{
            mode: 'train',
            from: input.origin,
            to: input.destination,
            departure: startTime,
            arrival: addMinutes(startTime, 720),
            duration: '12h',
            durationMinutes: 720,
            cost: 2500,
            operator: 'Indian Railways'
        }]
    }];
}

/**
 * Rank routes based on user preference
 */
function rankRoutes(routes: Route[], preference: string): Route[] {
    const weights = {
        fastest: { time: 0.7, cost: 0.2, reliability: 0.1 },
        cheapest: { time: 0.2, cost: 0.7, reliability: 0.1 },
        balanced: { time: 0.4, cost: 0.4, reliability: 0.2 }
    };

    const w = weights[preference as keyof typeof weights];

    // Normalize scores
    const minCost = Math.min(...routes.map(r => r.totalCost));
    const maxCost = Math.max(...routes.map(r => r.totalCost));
    const minTime = Math.min(...routes.map(r => r.totalDurationMinutes));
    const maxTime = Math.max(...routes.map(r => r.totalDurationMinutes));

    routes.forEach(route => {
        const costScore = maxCost === minCost ? 100 : 100 * (1 - (route.totalCost - minCost) / (maxCost - minCost));
        const timeScore = maxTime === minTime ? 100 : 100 * (1 - (route.totalDurationMinutes - minTime) / (maxTime - minTime));
        const reliabilityScore = route.reliability;

        route.score = (timeScore * w.time) + (costScore * w.cost) + (reliabilityScore * w.reliability);

        // Assign categories
        if (route.totalDurationMinutes === minTime) route.category = 'Fastest';
        if (route.totalCost === minCost) route.category = 'Cheapest';
        if (route.score && route.score > 80) route.category = 'Best Value';
    });

    // Sort by score
    return routes.sort((a, b) => (b.score || 0) - (a.score || 0));
}

/**
 * Main function to search routes with validation
 */
export async function searchRoutes(input: unknown): Promise<Route[]> {
    // Validate input
    const validation = validateSearchInput(input);

    if (!validation.success) {
        throw new Error(`Invalid search input: ${validation.error?.message}`);
    }

    // Generate mock routes
    const routes = generateMockRoutes(validation.data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return routes;
}
