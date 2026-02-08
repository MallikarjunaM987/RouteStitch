'use client';

import React from 'react';

interface DateTimeSelectorProps {
    date: Date;
    time: string;
    onDateChange: (date: Date) => void;
    onTimeChange: (time: string) => void;
    dateError?: string;
    timeError?: string;
}

export default function DateTimeSelector({
    date,
    time,
    onDateChange,
    onTimeChange,
    dateError,
    timeError
}: DateTimeSelectorProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        onDateChange(newDate);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onTimeChange(e.target.value);
    };

    // Quick date selectors
    const quickDates = [
        { label: 'Today', days: 0 },
        { label: 'Tomorrow', days: 1 },
        { label: 'Next Week', days: 7 }
    ];

    const setQuickDate = (days: number) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        onDateChange(newDate);
    };

    return (
        <div className="w-full space-y-6">
            {/* Date Selection */}
            <div>
                <label className="block text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">
                    📅 Travel Date
                </label>

                <input
                    type="date"
                    value={formatDateForInput(date)}
                    onChange={handleDateChange}
                    min={formatDateForInput(today)}
                    max={formatDateForInput(maxDate)}
                    className={`w-full bg-black border ${dateError ? 'border-red-500' : 'border-[#1f1f1f]'
                        } rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-outskill-lime transition-colors`}
                />

                {dateError && (
                    <p className="text-xs text-red-500 font-bold mt-2">{dateError}</p>
                )}

                {/* Quick Date Buttons */}
                <div className="flex gap-3 mt-3">
                    {quickDates.map((quick) => (
                        <button
                            key={quick.label}
                            type="button"
                            onClick={() => setQuickDate(quick.days)}
                            className="px-4 py-2 text-xs font-black text-gray-400 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl hover:border-outskill-lime hover:text-outskill-lime transition-colors uppercase tracking-wider"
                        >
                            {quick.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            <div>
                <label className="block text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">
                    ⏰ Departure Time (Optional)
                </label>

                <div className="flex gap-3">
                    <input
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className={`flex-1 bg-black border ${timeError ? 'border-red-500' : 'border-[#1f1f1f]'
                            } rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-outskill-lime transition-colors`}
                    />

                    <button
                        type="button"
                        onClick={() => onTimeChange('')}
                        className="px-6 py-4 text-xs font-black text-gray-400 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl hover:border-red-500 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                        Anytime
                    </button>
                </div>

                {timeError && (
                    <p className="text-xs text-red-500 font-bold mt-2">{timeError}</p>
                )}

                <p className="text-xs text-gray-500 font-medium mt-2">
                    Leave empty to search for all available times
                </p>
            </div>
        </div>
    );
}
