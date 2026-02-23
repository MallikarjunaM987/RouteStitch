'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripBuilderFormSchema, TripBuilderFormData } from '../../lib/validation/tripInput';
import { Location, TripInput } from '../../types/tripBuilder';
import LocationInput from './LocationInput';
import DateTimeSelector from './DateTimeSelector';
import PassengerSelector from './PassengerSelector';
import PreferenceSelector from './PreferenceSelector';

interface TripBuilderInputProps {
    onSearch: (tripData: TripInput) => void;
    isLoading?: boolean;
    initialValues?: { from?: string; to?: string };
}

export default function TripBuilderInput({
    onSearch,
    isLoading = false,
    initialValues
}: TripBuilderInputProps) {
    const [originLocation, setOriginLocation] = useState<Location | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<TripBuilderFormData>({
        resolver: zodResolver(tripBuilderFormSchema),
        defaultValues: {
            origin: initialValues?.from || '',
            destination: initialValues?.to || '',
            date: new Date(),
            time: '',
            passengers: 1,
            preference: 'balanced'
        }
    });

    const watchedDate = watch('date');
    const watchedTime = watch('time');
    const watchedPassengers = watch('passengers');
    const watchedPreference = watch('preference');

    const handleOriginChange = (location: Location | null) => {
        setOriginLocation(location);
        setValue('origin', location?.displayName || location?.name || '');
    };

    const handleDestinationChange = (location: Location | null) => {
        setDestinationLocation(location);
        setValue('destination', location?.displayName || location?.name || '');
    };

    const onSubmit = (data: TripBuilderFormData) => {
        if (!originLocation || !destinationLocation) {
            alert('Please select both origin and destination');
            return;
        }

        const tripInput: TripInput = {
            origin: originLocation,
            destination: destinationLocation,
            date: data.date.toISOString().split('T')[0],
            time: data.time || undefined,
            passengers: data.passengers,
            preference: data.preference
            // Don't include stops if empty - it's optional in schema
        };

        onSearch(tripInput);
    };

    const swapLocations = () => {
        const tempLocation = originLocation;
        const tempValue = watch('origin');

        setOriginLocation(destinationLocation);
        setDestinationLocation(tempLocation);

        setValue('origin', watch('destination'));
        setValue('destination', tempValue);
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-[#0a0a0a] to-black border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">🗺️</span>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        TripBuilder
                    </h2>
                </div>
                <p className="text-sm text-gray-400 font-medium">
                    Plan your perfect multi-modal journey across India
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Origin & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                    <Controller
                        name="origin"
                        control={control}
                        render={() => (
                            <LocationInput
                                label="From"
                                value={originLocation}
                                onChange={handleOriginChange}
                                placeholder="Enter origin city..."
                                icon="📍"
                                allowCurrentLocation={true}
                                error={errors.origin?.message}
                            />
                        )}
                    />

                    {/* Swap Button */}
                    <div className="flex items-end pb-2 md:pb-0 md:items-center md:h-full">
                        <button
                            type="button"
                            onClick={swapLocations}
                            className="w-12 h-12 bg-black border border-[#1f1f1f] rounded-full flex items-center justify-center hover:border-outskill-lime hover:scale-110 transition-all"
                            title="Swap locations"
                        >
                            <span className="text-xl">⇄</span>
                        </button>
                    </div>

                    <Controller
                        name="destination"
                        control={control}
                        render={() => (
                            <LocationInput
                                label="To"
                                value={destinationLocation}
                                onChange={handleDestinationChange}
                                placeholder="Enter destination city..."
                                icon="🎯"
                                error={errors.destination?.message}
                            />
                        )}
                    />
                </div>

                {/* Date, Time, Passengers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <DateTimeSelector
                                date={field.value}
                                time={watchedTime}
                                onDateChange={field.onChange}
                                onTimeChange={(time) => setValue('time', time)}
                                dateError={errors.date?.message}
                                timeError={errors.time?.message}
                            />
                        )}
                    />

                    <Controller
                        name="passengers"
                        control={control}
                        render={({ field }) => (
                            <PassengerSelector
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.passengers?.message}
                            />
                        )}
                    />
                </div>

                {/* Preferences */}
                <Controller
                    name="preference"
                    control={control}
                    render={({ field }) => (
                        <PreferenceSelector
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                {/* Future: Add Stops Section */}
                <div className="p-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">➕</span>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">
                            Add Stops (Coming Soon)
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                        Add unlimited custom stops to your journey with flexible durations and activity suggestions
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !originLocation || !destinationLocation}
                    className={`w-full py-6 rounded-2xl font-black text-lg uppercase tracking-wider transition-all ${isLoading || !originLocation || !destinationLocation
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-outskill-lime text-black hover:scale-105 hover:shadow-2xl hover:shadow-outskill-lime/20'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="animate-spin">⏳</span>
                            Searching Routes...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-3">
                            <span>🔍</span>
                            Find Best Routes
                        </span>
                    )}
                </button>
            </form>

            {/* Info Banner */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-xs text-blue-400 font-bold text-center">
                    💡 We'll show you the fastest, cheapest, and best-value routes combining trains, buses, flights, and local transport
                </p>
            </div>
        </div>
    );
}
