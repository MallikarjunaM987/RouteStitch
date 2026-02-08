'use client';

import React from 'react';
import { RoutePreference } from '../../types/tripBuilder';

interface PreferenceSelectorProps {
    value: RoutePreference;
    onChange: (preference: RoutePreference) => void;
}

const preferences: Array<{
    value: RoutePreference;
    icon: string;
    label: string;
    description: string;
    color: string;
}> = [
        {
            value: 'fastest',
            icon: '⚡',
            label: 'Fastest',
            description: 'Minimize travel time',
            color: 'from-yellow-500/20 to-orange-500/20 hover:border-yellow-500'
        },
        {
            value: 'cheapest',
            icon: '💰',
            label: 'Cheapest',
            description: 'Lowest total cost',
            color: 'from-green-500/20 to-emerald-500/20 hover:border-green-500'
        },
        {
            value: 'balanced',
            icon: '⚖️',
            label: 'Balanced',
            description: 'Optimal mix of time & cost',
            color: 'from-blue-500/20 to-cyan-500/20 hover:border-blue-500'
        }
    ];

export default function PreferenceSelector({
    value,
    onChange
}: PreferenceSelectorProps) {
    return (
        <div className="w-full">
            <label className="block text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-4">
                ⚙️ Preferences
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {preferences.map((pref) => (
                    <button
                        key={pref.value}
                        type="button"
                        onClick={() => onChange(pref.value)}
                        className={`
              relative p-6 rounded-2xl border-2 transition-all duration-300
              ${value === pref.value
                                ? `border-outskill-lime bg-gradient-to-br ${pref.color}`
                                : `border-[#1f1f1f] bg-black ${pref.color}`
                            }
              hover:scale-105 hover:shadow-xl group
            `}
                    >
                        {/* Selection Indicator */}
                        {value === pref.value && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-outskill-lime rounded-full flex items-center justify-center">
                                <span className="text-black text-sm">✓</span>
                            </div>
                        )}

                        {/* Icon */}
                        <div className="text-5xl mb-3 transition-transform group-hover:scale-110">
                            {pref.icon}
                        </div>

                        {/* Label */}
                        <h3
                            className={`text-lg font-black uppercase tracking-tight mb-2 ${value === pref.value ? 'text-outskill-lime' : 'text-white'
                                }`}
                        >
                            {pref.label}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-400 font-medium">
                            {pref.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
