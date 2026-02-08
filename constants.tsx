
import React from 'react';

export const CATEGORIES = [
  { name: 'TripBuilder', icon: '🗺️' },
  { name: 'Smart Search', icon: '⚡' },
  { name: 'Track Live', icon: '📍' },
  { name: 'Safe Connect', icon: '🛡️' },
  { name: 'Group Travel', icon: '👥' },
  { name: 'For Business', icon: '💼' },
  { name: 'My Trips', icon: '🎫' },
  { name: 'How It Works', icon: '📚' },
];

export const MOCK_FLIGHTS: any[] = [
  {
    id: 'cjb-ixg-1',
    airline: 'IndiGo',
    logo: 'https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=18',
    departureTime: '10:15',
    arrivalTime: '14:45',
    duration: '4h 30m',
    origin: 'CJB',
    originName: 'Coimbatore',
    destination: 'IXG',
    destinationName: 'Belgaum',
    price: 4890,
    stops: 1,
    type: '1 Stop via Bengaluru',
    cabinClass: 'Economy',
    fareType: 'Saver'
  },
  {
    id: 'cjb-ixg-2',
    airline: 'Star Air',
    logo: 'https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/S5.png?v=18',
    departureTime: '13:20',
    arrivalTime: '16:10',
    duration: '2h 50m',
    origin: 'CJB',
    originName: 'Coimbatore',
    destination: 'IXG',
    destinationName: 'Belgaum',
    price: 3200,
    stops: 0,
    type: 'Non Stop',
    cabinClass: 'Economy',
    fareType: 'Limited Deal'
  }
];

export const MOCK_TRAINS: any[] = [
  {
    id: 'tr-1',
    name: 'CBE IXG SPL',
    number: '06571',
    departureTime: '21:00',
    arrivalTime: '09:30',
    duration: '12h 30m',
    origin: 'CBE',
    destination: 'BGM',
    classes: ['2A', '3A', 'SL'],
    price: 850
  }
];

export const SEAT_MAP = [
  ['A1', 'A2', '', 'A3', 'A4'],
  ['B1', 'B2', '', 'B3', 'B4'],
  ['C1', 'C2', '', 'C3', 'C4'],
  ['D1', 'D2', '', 'D3', 'D4'],
  ['E1', 'E2', '', 'E3', 'E4'],
  ['F1', 'F2', '', 'F3', 'F4'],
  ['G1', 'G2', '', 'G3', 'G4'],
  ['H1', 'H2', '', 'H3', 'H4'],
];
