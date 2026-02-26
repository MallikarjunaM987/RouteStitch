import React, { useState, useEffect } from 'react';
import { Route, Leg } from '../../types/route';
import { getLiveTrainSummary, LiveTrainSummary } from '../../lib/services/liveTrainService';

interface RouteCardProps {
    route: Route;
    rank: number;
}

export default function RouteCard({ route, rank }: RouteCardProps) {
    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'Fastest': return 'border-purple-500/30 bg-purple-500/5';
            case 'Cheapest': return 'border-green-500/30 bg-green-500/5';
            case 'Best Value': return 'border-outskill-lime/30 bg-outskill-lime/5';
            default: return 'border-[#1f1f1f] bg-[#0a0a0a]';
        }
    };

    const getCategoryBadgeColor = (category?: string) => {
        switch (category) {
            case 'Fastest': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Cheapest': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Best Value': return 'bg-outskill-lime/20 text-outskill-lime border-outskill-lime/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getModeIcon = (mode: string) => {
        const icons: Record<string, string> = {
            train: '🚂',
            bus: '🚌',
            flight: '✈️',
            metro: '🚇',
            taxi: '🚕',
            auto: '🛺',
            walk: '🚶'
        };
        return icons[mode] || '🚗';
    };

    const getModeColor = (mode: string) => {
        const colors: Record<string, string> = {
            train: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            bus: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
            flight: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            metro: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
            taxi: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            auto: 'bg-green-500/10 text-green-400 border-green-500/30',
            walk: 'bg-gray-500/10 text-gray-400 border-gray-500/30'
        };
        return colors[mode] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    };

    const [liveData, setLiveData] = useState<Record<string, LiveTrainSummary | null>>({});

    useEffect(() => {
        // Fetch live train data for any train legs that have a train number
        const fetchLiveData = async () => {
            const trainLegs = route.legs.filter(leg => leg.mode === 'train' && leg.trainNumber);
            for (const leg of trainLegs) {
                if (leg.trainNumber && !liveData[leg.trainNumber]) {
                    const data = await getLiveTrainSummary(leg.trainNumber);
                    if (data) {
                        setLiveData(prev => ({ ...prev, [leg.trainNumber as string]: data }));
                    }
                }
            }
        };
        fetchLiveData();
    }, [route.legs]);

    return (
        <div className={`p-6 border rounded-2xl hover:border-outskill-lime/50 transition-all group ${getCategoryColor(route.category)}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-gray-500">#{rank}</div>
                    {route.category && (
                        <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${getCategoryBadgeColor(route.category)}`}>
                            {route.category}
                        </span>
                    )}
                </div>

                <div className="text-right">
                    <div className="text-3xl font-black text-white mb-1">
                        ₹{route.totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        {route.totalDuration}
                    </div>
                </div>
            </div>

            {/* Route Legs */}
            <div className="space-y-4">
                {route.legs.map((leg, index) => (
                    <div key={index} className="relative">
                        {/* Connector Line */}
                        {index < route.legs.length - 1 && (
                            <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-outskill-lime/30 to-transparent" />
                        )}

                        <div className="flex items-start gap-4 p-4 bg-black/50 rounded-xl border border-[#1f1f1f] hover:border-outskill-lime/30 transition-colors">
                            {/* Mode Icon */}
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl border ${getModeColor(leg.mode)}`}>
                                <span className="text-2xl">{getModeIcon(leg.mode)}</span>
                            </div>

                            {/* Leg Details */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                                            {leg.mode}
                                        </div>
                                        <div className="text-sm font-bold text-white">
                                            {leg.from} → {leg.to}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-outskill-lime">
                                            ₹{leg.cost}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            {leg.duration}
                                        </div>
                                    </div>
                                </div>

                                {/* Operator Info */}
                                {leg.operator && (
                                    <div className="text-xs text-gray-400 font-medium mb-2">
                                        {leg.operator}
                                        {leg.trainNumber && ` • Train #${leg.trainNumber}`}
                                        {leg.flightNumber && ` • Flight ${leg.flightNumber}`}
                                        {leg.busType && ` • ${leg.busType}`}
                                    </div>
                                )}

                                {/* Timing */}
                                <div className="text-xs text-gray-500 font-medium">
                                    Departs: {leg.departure} • Arrives: {leg.arrival}
                                </div>

                                {/* Booking Platforms */}
                                {leg.bookingPlatforms && leg.bookingPlatforms.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {leg.bookingPlatforms.map((platform, i) => (
                                            <a
                                                key={i}
                                                href={platform.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all hover:scale-105 ${platform.recommended
                                                    ? 'bg-outskill-lime/10 text-outskill-lime border-outskill-lime/30 hover:bg-outskill-lime/20'
                                                    : 'bg-gray-500/5 text-gray-400 border-gray-500/20 hover:bg-gray-500/10'
                                                    }`}
                                            >
                                                Book on {platform.name}
                                                {platform.recommended && ' ⭐'}
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Live Train Info Injection */}
                                {leg.mode === 'train' && leg.trainNumber && liveData[leg.trainNumber] && (
                                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Live Running Status</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-sm text-gray-300">
                                            <div>
                                                <span className="text-gray-500">Currently at:</span> <span className="font-semibold text-white">{liveData[leg.trainNumber]?.currentStation || 'Unknown'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Status:</span> <span className={`font-semibold ${liveData[leg.trainNumber]?.delayStatus === 'On Time' ? 'text-green-400' : 'text-orange-400'}`}>{liveData[leg.trainNumber]?.delayStatus}</span>
                                            </div>
                                            {liveData[leg.trainNumber]?.upcomingStations && liveData[leg.trainNumber]!.upcomingStations.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Next: {liveData[leg.trainNumber]?.upcomingStations.map(s => s.station_name).join(' → ')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-gray-600 mt-2 text-right">
                                            {liveData[leg.trainNumber]?.lastUpdated}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reliability Score */}
            <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        Reliability Score
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-outskill-lime to-green-400 rounded-full transition-all"
                                style={{ width: `${route.reliability}%` }}
                            />
                        </div>
                        <span className="text-sm font-black text-outskill-lime">
                            {route.reliability}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
