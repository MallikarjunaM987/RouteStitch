import React from 'react';
import RouteCard from './RouteCard';
import { Route } from '../../types/route';

interface RouteResultsProps {
    routes: Route[];
    origin: string;
    destination: string;
    onNewSearch?: () => void;
}

export default function RouteResults({ routes, origin, destination, onNewSearch }: RouteResultsProps) {
    const totalRoutes = routes.length;
    const cheapestRoute = routes.reduce((min, route) => route.totalCost < min.totalCost ? route : min, routes[0]);
    const fastestRoute = routes.reduce((min, route) => route.totalDurationMinutes < min.totalDurationMinutes ? route : min, routes[0]);

    return (
        <div className="mt-12">
            {/* Results Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                            Found <span className="text-outskill-lime">{totalRoutes}</span> Routes
                        </h2>
                        <p className="text-gray-400 font-medium">
                            From <span className="text-white font-bold">{origin}</span> to <span className="text-white font-bold">{destination}</span>
                        </p>
                    </div>

                    {onNewSearch && (
                        <button
                            onClick={onNewSearch}
                            className="px-6 py-3 bg-[#0a0a0a] border border-[#1f1f1f] text-white font-black rounded-xl hover:border-outskill-lime hover:bg-outskill-lime/5 transition-all"
                        >
                            New Search
                        </button>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl">
                        <div className="text-xs font-black text-green-400 uppercase tracking-wider mb-1">
                            Cheapest Option
                        </div>
                        <div className="text-2xl font-black text-white">
                            ₹{cheapestRoute.totalCost.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 font-medium mt-1">
                            {cheapestRoute.totalDuration}
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl">
                        <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">
                            Fastest Option
                        </div>
                        <div className="text-2xl font-black text-white">
                            {fastestRoute.totalDuration}
                        </div>
                        <div className="text-xs text-gray-400 font-medium mt-1">
                            ₹{fastestRoute.totalCost.toLocaleString()}
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-outskill-lime/10 to-transparent border border-outskill-lime/30 rounded-xl">
                        <div className="text-xs font-black text-outskill-lime uppercase tracking-wider mb-1">
                            Total Options
                        </div>
                        <div className="text-2xl font-black text-white">
                            {totalRoutes} Routes
                        </div>
                        <div className="text-xs text-gray-400 font-medium mt-1">
                            All transport modes
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs (Static for now) */}
            <div className="mb-6 flex flex-wrap gap-2">
                {['All Routes', 'Trains', 'Flights', 'Buses', 'Fastest First', 'Cheapest First'].map((filter, i) => (
                    <button
                        key={filter}
                        className={`px-4 py-2 text-sm font-black rounded-lg border transition-all ${i === 0
                                ? 'bg-outskill-lime/10 text-outskill-lime border-outskill-lime/30'
                                : 'bg-[#0a0a0a] text-gray-400 border-[#1f1f1f] hover:border-outskill-lime/50 hover:text-white'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Route Cards */}
            <div className="space-y-6">
                {routes.map((route, index) => (
                    <RouteCard
                        key={route.id}
                        route={route}
                        rank={index + 1}
                    />
                ))}
            </div>

            {/* No Results Message */}
            {totalRoutes === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">😔</div>
                    <h3 className="text-2xl font-black text-white mb-2">
                        No Routes Found
                    </h3>
                    <p className="text-gray-400 font-medium">
                        Try adjusting your search parameters
                    </p>
                </div>
            )}
        </div>
    );
}
