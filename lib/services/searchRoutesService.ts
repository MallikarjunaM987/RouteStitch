import { tripInputSchema } from '../../lib/validation/tripInput';
import { sanitizeObject, checkRateLimit } from '../../lib/utils/sanitize';
import { SearchResult, Route } from '../../types/tripBuilder';

// Rate limiting: 10 requests per minute per IP
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

export async function searchRoutes(body: any): Promise<{ success: boolean; data?: SearchResult; error?: string; status: number }> {
    try {
        // Get client IP for rate limiting (in browser, use a simple client-side identifier)
        const clientId = 'browser_client'; // In production, use user session or IP from server

        // Check rate limit
        const rateLimit = checkRateLimit(clientId, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);

        if (!rateLimit.allowed) {
            return {
                success: false,
                error: `Too many requests. Please try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds.`,
                status: 429
            };
        }

        // Sanitize input
        const sanitizedBody = sanitizeObject(body);

        // Validate with Zod schema
        const validationResult = tripInputSchema.safeParse(sanitizedBody);

        if (!validationResult.success) {
            return {
                success: false,
                error: 'Invalid input data: ' + validationResult.error.issues.map(i => i.message).join(', '),
                status: 400
            };
        }

        const tripInput = validationResult.data;

        // TODO: In future, this is where we'd call MOTIS or other routing engines
        // For now, return mock data to demonstrate the working input system

        const mockRoutes: Route[] = [
            {
                id: 'route-1',
                type: 'train_metro',
                legs: [
                    {
                        id: 'leg-1',
                        mode: 'taxi',
                        from: tripInput.origin,
                        to: {
                            ...tripInput.origin,
                            name: `${tripInput.origin.city} Railway Station`,
                            type: 'station'
                        },
                        departureTime: `${tripInput.date}T${tripInput.time || '08:00'}`,
                        arrivalTime: `${tripInput.date}T${tripInput.time || '08:30'}`,
                        duration: 30,
                        distance: 15,
                        cost: 350,
                        details: {
                            bookingUrl: 'https://uber.com'
                        }
                    },
                    {
                        id: 'leg-2',
                        mode: 'train',
                        operator: 'Indian Railways',
                        from: {
                            ...tripInput.origin,
                            name: `${tripInput.origin.city} Railway Station`,
                            type: 'station'
                        },
                        to: {
                            ...tripInput.destination,
                            name: `${tripInput.destination.city} Railway Station`,
                            type: 'station'
                        },
                        departureTime: `${tripInput.date}T09:00`,
                        arrivalTime: `${tripInput.date}T23:30`,
                        duration: 870, // 14.5 hours
                        distance: 850,
                        cost: 2800,
                        details: {
                            trainNumber: '12951',
                            trainName: 'Rajdhani Express',
                            seatClass: '3A',
                            seatsAvailable: 42,
                            bookingUrl: 'https://irctc.co.in'
                        }
                    },
                    {
                        id: 'leg-3',
                        mode: 'metro',
                        from: {
                            ...tripInput.destination,
                            name: `${tripInput.destination.city} Railway Station`,
                            type: 'station'
                        },
                        to: tripInput.destination,
                        departureTime: `${tripInput.date}T23:45`,
                        arrivalTime: `${tripInput.date}T00:15`,
                        duration: 30,
                        distance: 12,
                        cost: 40
                    }
                ],
                totalCost: 3190,
                totalDuration: 930, // 15.5 hours total
                totalDistance: 877,
                reliability: 95,
                comfortScore: 85,
                finalScore: 88,
                category: 'Best Value',
                bufferTimes: [
                    { legIndex: 1, buffer: 30, status: 'safe' },
                    { legIndex: 2, buffer: 15, status: 'safe' }
                ]
            },
            {
                id: 'route-2',
                type: 'flight_local',
                legs: [
                    {
                        id: 'leg-1',
                        mode: 'metro',
                        from: tripInput.origin,
                        to: {
                            ...tripInput.origin,
                            name: `${tripInput.origin.city} Airport`,
                            type: 'airport'
                        },
                        departureTime: `${tripInput.date}T${tripInput.time || '08:00'}`,
                        arrivalTime: `${tripInput.date}T${tripInput.time || '08:45'}`,
                        duration: 45,
                        cost: 60
                    },
                    {
                        id: 'leg-2',
                        mode: 'flight',
                        operator: 'IndiGo',
                        from: {
                            ...tripInput.origin,
                            name: `${tripInput.origin.city} Airport`,
                            type: 'airport'
                        },
                        to: {
                            ...tripInput.destination,
                            name: `${tripInput.destination.city} Airport`,
                            type: 'airport'
                        },
                        departureTime: `${tripInput.date}T11:00`,
                        arrivalTime: `${tripInput.date}T13:15`,
                        duration: 135,
                        distance: 850,
                        cost: 4500,
                        details: {
                            flightNumber: '6E-505',
                            bookingUrl: 'https://makemytrip.com'
                        }
                    },
                    {
                        id: 'leg-3',
                        mode: 'taxi',
                        from: {
                            ...tripInput.destination,
                            name: `${tripInput.destination.city} Airport`,
                            type: 'airport'
                        },
                        to: tripInput.destination,
                        departureTime: `${tripInput.date}T13:30`,
                        arrivalTime: `${tripInput.date}T14:45`,
                        duration: 75,
                        cost: 1000
                    }
                ],
                totalCost: 5560,
                totalDuration: 255, // 4 hours 15 min
                totalDistance: 850,
                reliability: 85,
                comfortScore: 90,
                finalScore: 85,
                category: 'Fastest'
            }
        ];

        const result: SearchResult = {
            success: true,
            routes: mockRoutes,
            totalResults: mockRoutes.length,
            searchParams: tripInput,
            timestamp: new Date().toISOString()
        };

        return {
            success: true,
            data: result,
            status: 200
        };

    } catch (error) {
        console.error('Search routes error:', error);

        return {
            success: false,
            error: 'Internal server error. Please try again later.',
            status: 500
        };
    }
}
