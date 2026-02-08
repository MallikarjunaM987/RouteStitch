
export type Category = 'TripBuilder' | 'Smart Search' | 'Track Live' | 'Safe Connect' | 'Group Travel' | 'For Business' | 'My Trips' | 'How It Works';

export interface Flight {
  id: string;
  airline: string;
  logo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  price: number;
  stops: number;
  type: string;
  cabinClass: string;
  fareType: string;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  origin: string;
  destination: string;
  classes: string[];
  price: number;
}

export interface SearchParams {
  category: Category;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travellers: string;
}

export interface BookingDetails {
  flight?: Flight;
  train?: Train;
  selectedSeats: string[];
  travellers: Array<{ name: string; age: number; gender: string }>;
  contact: { email: string; phone: string };
}
