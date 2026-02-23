'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Location } from '../../types/tripBuilder';
import { searchCities, getCurrentLocation } from '../../lib/geocoding';
import { sanitizeLocationName } from '../../lib/utils/sanitize';

interface LocationInputProps {
    label: string;
    value: Location | null;
    onChange: (location: Location | null) => void;
    placeholder?: string;
    icon?: string;
    allowCurrentLocation?: boolean;
    error?: string;
}

export default function LocationInput({
    label,
    value,
    onChange,
    placeholder = 'Search city...',
    icon = '📍',
    allowCurrentLocation = false,
    error
}: LocationInputProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Sync query with value prop
    useEffect(() => {
        if (value) {
            setQuery(value.displayName || value.name || value.city);
        } else {
            setQuery('');
        }
    }, [value]);

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            const sanitizedQuery = sanitizeLocationName(query);
            const results = searchCities(sanitizedQuery, 8);
            setSuggestions(results);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setShowSuggestions(true);

        if (!newQuery) {
            onChange(null);
        }
    };

    const handleSelectSuggestion = (location: Location) => {
        setQuery(location.displayName || location.name);
        onChange(location);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleUseCurrentLocation = async () => {
        setLoadingCurrentLocation(true);
        try {
            const result = await getCurrentLocation();

            const currentLocation: Location = {
                id: 'current',
                name: result.city || 'Current Location',
                city: result.city || '',
                state: result.state || '',
                country: result.country || 'India',
                lat: result.lat,
                lng: result.lng,
                type: 'address',
                displayName: result.address || `${result.lat}, ${result.lng}`
            };

            setQuery(currentLocation.displayName || currentLocation.name);
            onChange(currentLocation);
        } catch (error) {
            console.error('Error getting current location:', error);
            alert('Unable to get current location. Please enable location services.');
        } finally {
            setLoadingCurrentLocation(false);
        }
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="relative w-full">
            <label className="block text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">
                {icon} {label}
            </label>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    className={`w-full bg-black border ${error ? 'border-red-500' : 'border-[#1f1f1f]'
                        } rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-outskill-lime transition-colors`}
                />

                {allowCurrentLocation && (
                    <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={loadingCurrentLocation}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500 hover:text-outskill-lime transition-colors uppercase tracking-wider"
                    >
                        {loadingCurrentLocation ? 'Getting...' : '📍 Use Current'}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-500 font-bold mt-2">{error}</p>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                >
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full px-6 py-4 text-left hover:bg-[#111111] transition-colors border-b border-[#1f1f1f] last:border-b-0 group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                                    🏙️
                                </span>
                                <div>
                                    <p className="text-white font-bold text-sm group-hover:text-outskill-lime transition-colors">
                                        {suggestion.name}
                                    </p>
                                    <p className="text-gray-500 font-medium text-xs mt-1">
                                        {suggestion.state}, {suggestion.country}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-2xl px-6 py-4">
                    <p className="text-gray-500 font-medium text-sm">
                        No cities found for "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}
