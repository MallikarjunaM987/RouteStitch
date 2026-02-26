import { Request, Response } from 'express';
import { z } from 'zod';

// Input Validation Schema matching the API Contract
const tripInputSchema = z.object({
    origin: z.string().min(2, "Origin must be at least 2 characters"),
    destination: z.string().min(2, "Destination must be at least 2 characters"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    time: z.string().optional(),
    passengers: z.number().int().min(1).max(9).default(1),
    preference: z.enum(['fastest', 'cheapest', 'balanced']).default('balanced'),
    stops: z.array(z.object({
        location: z.string(),
        duration: z.number()
    })).optional()
});

// A simple in-memory rate limiter based on IP directly in the controller
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;
const ipRequestCounts = new Map<string, { count: number, resetTime: number }>();

export const searchRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Rate Limiting Middleware imitation (100 req/min per IP)
        const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const requestData = ipRequestCounts.get(clientIp);

        if (requestData && now < requestData.resetTime) {
            if (requestData.count >= MAX_REQUESTS) {
                res.status(429).json({
                    success: false,
                    error: `Too many requests. Please try again later.`
                });
                return;
            }
            requestData.count++;
        } else {
            ipRequestCounts.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        }

        // 2. Validate input with Zod
        const validation = tripInputSchema.safeParse(req.body);
        if (!validation.success) {
            const errorMessages = validation.error.issues.map(i => i.message).join(', ');
            res.status(400).json({ success: false, error: `Invalid input: ${errorMessages}` });
            return;
        }

        const input = validation.data;

        // 3. Search routes (Currently Mock Data for API Contract testing)
        // TODO: Later hook this up to MOTIS and real Shashank Ranking algorithm
        const mockRoutes = [
            {
                id: 'route-1',
                totalCost: 3190,
                totalDuration: "15h 30m",
                legs: [
                    {
                        mode: 'taxi',
                        from: input.origin,
                        to: `${input.origin} Railway Station`,
                        departure: '08:00',
                        arrival: '08:30',
                        cost: 350
                    },
                    {
                        mode: 'train',
                        operator: 'Indian Railways',
                        trainNumber: '12951',
                        from: `${input.origin} Railway Station`,
                        to: `${input.destination} Railway Station`,
                        departure: '09:00',
                        arrival: '23:30',
                        cost: 2800
                    },
                    {
                        mode: 'metro',
                        from: `${input.destination} Railway Station`,
                        to: input.destination,
                        departure: '23:45',
                        arrival: '00:15',
                        cost: 40
                    }
                ]
            },
            {
                id: 'route-2',
                totalCost: 5560,
                totalDuration: "4h 15m",
                legs: [
                    {
                        mode: 'metro',
                        from: input.origin,
                        to: `${input.origin} Airport`,
                        departure: '08:00',
                        arrival: '08:45',
                        cost: 60
                    },
                    {
                        mode: 'flight',
                        operator: 'IndiGo',
                        flightNumber: '6E-505',
                        from: `${input.origin} Airport`,
                        to: `${input.destination} Airport`,
                        departure: '11:00',
                        arrival: '13:15',
                        cost: 4500
                    },
                    {
                        mode: 'taxi',
                        from: `${input.destination} Airport`,
                        to: input.destination,
                        departure: '13:30',
                        arrival: '14:45',
                        cost: 1000
                    }
                ]
            }
        ];

        // 4. Return top 5 (currently we just return the 2 mocks)
        res.status(200).json({ success: true, routes: mockRoutes });

    } catch (error) {
        console.error('Search routes error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again later.'
        });
    }
};
