'use client';

import React from 'react';

interface PassengerSelectorProps {
    value: number;
    onChange: (count: number) => void;
    error?: string;
}

export default function PassengerSelector({
    value,
    onChange,
    error
}: PassengerSelectorProps) {
    const increment = () => {
        if (value < 50) {
            onChange(value + 1);
        }
    };

    const decrement = () => {
        if (value > 1) {
            onChange(value - 1);
        }
    };

    const quickCounts = [1, 2, 4, 6];

    return (
        <div className="w-full">
            <label className="block text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">
                👥 Passengers
            </label>

            <div className="flex items-center gap-4">
                {/* Manual Counter */}
                <div className="flex items-center bg-black border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <button
                        type="button"
                        onClick={decrement}
                        disabled={value <= 1}
                        className="px-6 py-4 text-white font-black text-xl hover:bg-[#111111] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        −
                    </button>

                    <div className="px-8 py-4 text-white font-black text-2xl min-w-[80px] text-center">
                        {value}
                    </div>

                    <button
                        type="button"
                        onClick={increment}
                        disabled={value >= 50}
                        className="px-6 py-4 text-white font-black text-xl hover:bg-[#111111] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        +
                    </button>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {quickCounts.map((count) => (
                        <button
                            key={count}
                            type="button"
                            onClick={() => onChange(count)}
                            className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${value === count
                                    ? 'bg-outskill-lime text-black'
                                    : 'bg-[#0a0a0a] text-gray-400 border border-[#1f1f1f] hover:border-outskill-lime hover:text-outskill-lime'
                                } uppercase tracking-wider`}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500 font-bold mt-2">{error}</p>
            )}

            {value >= 5 && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-xs text-blue-400 font-bold">
                        💡 Group Travel: {value >= 5 ? 'Bulk discounts may apply!' : ''}
                    </p>
                </div>
            )}
        </div>
    );
}
