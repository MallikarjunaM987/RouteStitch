import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import TripBuilder from './pages/TripBuilder';
import SearchResults from './pages/SearchResults';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import SeatSelection from './pages/SeatSelection';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tripbuilder" element={<TripBuilder />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/seats" element={<SeatSelection />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
