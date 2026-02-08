import { z } from 'zod';

// Location validation schema
export const locationSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(100),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    country: z.string().default('India'),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    type: z.enum(['city', 'station', 'airport', 'bus_stand', 'address']).optional(),
    displayName: z.string().max(200).optional()
});

// Trip stop validation schema
export const tripStopSchema = z.object({
    id: z.string().min(1),
    location: locationSchema,
    duration: z.number().min(15).max(4320), // 15 minutes to 3 days
    arrivalTime: z.string().optional(),
    departureTime: z.string().optional(),
    activities: z.array(z.string().max(200)).optional(),
    notes: z.string().max(500).optional()
});

// Trip input validation schema
export const tripInputSchema = z.object({
    origin: locationSchema,
    destination: locationSchema,
    date: z.string().refine((date) => {
        const parsedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 365);

        return parsedDate >= today && parsedDate <= maxDate;
    }, {
        message: 'Date must be today or within the next 365 days'
    }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Time must be in HH:mm format'
    }).optional(),
    passengers: z.number().int().min(1).max(50, {
        message: 'Passengers must be between 1 and 50'
    }),
    preference: z.enum(['fastest', 'cheapest', 'balanced']),
    stops: z.array(tripStopSchema).max(10, {
        message: 'Maximum 10 stops allowed'
    }).optional()
}).refine((data) => {
    // Ensure origin and destination are different
    return data.origin.city !== data.destination.city ||
        data.origin.name !== data.destination.name;
}, {
    message: 'Origin and destination must be different',
    path: ['destination']
});

// Form data validation schema (for React Hook Form)
export const tripBuilderFormSchema = z.object({
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required'),
    date: z.date().refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }, {
        message: 'Date must be today or in the future'
    }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).or(z.literal('')),
    passengers: z.number().int().min(1).max(50),
    preference: z.enum(['fastest', 'cheapest', 'balanced']),
    stops: z.array(z.object({
        location: z.string().min(1),
        duration: z.number().min(15).max(4320)
    })).optional()
});

// Type inference from Zod schemas
export type LocationInput = z.infer<typeof locationSchema>;
export type TripStopInput = z.infer<typeof tripStopSchema>;
export type TripInputData = z.infer<typeof tripInputSchema>;
export type TripBuilderFormData = z.infer<typeof tripBuilderFormSchema>;
