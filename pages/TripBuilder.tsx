'use client';

import React, { useState } from 'react';
import TripBuilderInput from '../components/TripBuilder/TripBuilderInput';
import RouteResults from '../components/TripBuilder/RouteResults';
import { TripInput, SearchResult } from '../types/tripBuilder';
import { searchRoutes } from '../lib/services/searchRoutesService';
import { useApp } from '../store/AppContext';

export default function TripBuilderPage() {
    const { searchParams } = useApp();
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (tripData: TripInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await searchRoutes(tripData);

            if (!response.success) {
                throw new Error(response.error || 'Failed to search routes');
            }

            setSearchResults(response.data!);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewSearch = () => {
        setSearchResults(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Plan Your <span className="text-outskill-lime italic">Perfect Journey</span>
                    </h1>
                    <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
                        India's first unified multi-modal travel planner. Find the best routes combining trains, buses, flights, and local transport.
                    </p>
                </div>

                {/* TripBuilderInput */}
                <TripBuilderInput
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    initialValues={{ from: searchParams.from, to: searchParams.to }}
                />

                {/* Error Message */}
                {error && (
                    <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">⚠️</span>
                            <div>
                                <h3 className="text-lg font-black text-red-500 mb-1">Search Failed</h3>
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Route Results */}
                {searchResults && searchResults.routes.length > 0 && (
                    <RouteResults
                        routes={searchResults.routes}
                        origin={searchResults.searchParams.origin.name}
                        destination={searchResults.searchParams.destination.name}
                        onNewSearch={handleNewSearch}
                    />
                )}

                {/* Features Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '🛡️',
                            title: 'Connection Guarantee',
                            description: 'Auto-rebooking if you miss a connection due to delays'
                        },
                        {
                            icon: '📍',
                            title: 'Real-Time Tracking',
                            description: 'Live GPS tracking and predictive delay alerts'
                        },
                        {
                            icon: '💰',
                            title: 'Best Price Promise',
                            description: 'Compare prices across all platforms instantly'
                        }
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="p-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl hover:border-outskill-lime transition-colors group"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
