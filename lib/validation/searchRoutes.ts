import { z } from 'zod';

/**
 * Validation schema for route search input
 * Uses Zod for runtime type checking and validation
 */

export const stopSchema = z.object({
    location: z.string().min(2, 'Stop location must be at least 2 characters'),
    duration: z.number().int().min(15, 'Stop duration must be at least 15 minutes').max(4320, 'Stop duration cannot exceed 72 hours')
});

export const searchRoutesSchema = z.object({
    origin: z.string().min(2, 'Origin is required and must be at least 2 characters'),
    destination: z.string().min(2, 'Destination is required and must be at least 2 characters'),
    date: z.string().regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Date must be in YYYY-MM-DD format'
    ).refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, 'Date must be today or in the future'),
    time: z.string().regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Time must be in HH:MM format (24-hour)'
    ).optional(),
    passengers: z.number().int().min(1, 'At least 1 passenger required').max(9, 'Maximum 9 passengers allowed'),
    preference: z.enum(['fastest', 'cheapest', 'balanced'], {
        message: 'Preference must be fastest, cheapest, or balanced'
    }),
    stops: z.array(stopSchema).optional()
}).refine((data) => {
    // Ensure origin and destination are different
    return data.origin.toLowerCase() !== data.destination.toLowerCase();
}, {
    message: 'Origin and destination must be different',
    path: ['destination']
});

// Export inferred TypeScript type
export type SearchRoutesInput = z.infer<typeof searchRoutesSchema>;

/**
 * Validate search input and return typed result
 */
export function validateSearchInput(input: unknown): {
    success: boolean;
    data?: SearchRoutesInput;
    error?: z.ZodError;
} {
    const result = searchRoutesSchema.safeParse(input);

    if (result.success) {
        return { success: true, data: result.data };
    }

    return { success: false, error: result.error };
}
