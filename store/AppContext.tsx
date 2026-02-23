
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, SearchParams, BookingDetails, Flight, Train } from '../types';

interface AppState {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  booking: BookingDetails;
  setBooking: (booking: BookingDetails) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  selectedTrain: Train | null;
  setSelectedTrain: (train: Train | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    category: 'TripBuilder',
    from: '',
    to: '',
    departureDate: new Date().toISOString().split('T')[0],
    travellers: '1 Traveller, Economy'
  });

  const [booking, setBooking] = useState<BookingDetails>({
    travellers: [],
    selectedSeats: [],
    contact: { email: '', phone: '' }
  });

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

  return (
    <AppContext.Provider value={{
      searchParams,
      setSearchParams,
      booking,
      setBooking,
      selectedFlight,
      setSelectedFlight,
      selectedTrain,
      setSelectedTrain
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
