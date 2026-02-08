'use client';

import React, { useState } from 'react';
import TripBuilderInput from '../components/TripBuilder/TripBuilderInput';
import { TripInput, SearchResult } from '../types/tripBuilder';
import { searchRoutes } from '../lib/services/searchRoutesService';

export default function TripBuilderPage() {
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

                {/* TripBuilder Input */}
                <TripBuilderInput onSearch={handleSearch} isLoading={isLoading} />

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

                {/* Placeholder for Search Results */}
                {searchResults && (
                    <div className="mt-12 p-8 bg-gradient-to-br from-[#0a0a0a] to-black border border-[#1f1f1f] rounded-3xl">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white mb-4">
                                🎉 Search Successful!
                            </h2>
                            <p className="text-gray-400 font-medium mb-6">
                                Found {searchResults.totalResults} routes from {searchResults.searchParams.origin.name} to {searchResults.searchParams.destination.name}
                            </p>

                            <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                <p className="text-sm text-blue-400 font-bold">
                                    🚧 Route display component coming soon! For now, you can see the search worked.
                                </p>
                            </div>

                            {/* Debug Info */}
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm font-black text-gray-500 hover:text-outskill-lime transition-colors uppercase tracking-wider">
                                    View Raw Data (Debug)
                                </summary>
                                <pre className="mt-4 p-4 bg-black border border-[#1f1f1f] rounded-xl text-xs text-gray-400 overflow-auto max-h-96">
                                    {JSON.stringify(searchResults, null, 2)}
                                </pre>
                            </details>
                        </div>
                    </div>
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
