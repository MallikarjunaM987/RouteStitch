
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { SEAT_MAP } from '../constants';

const SeatSelection: React.FC = () => {
  const { selectedFlight, booking, setBooking } = useApp();
  const [localSeats, setLocalSeats] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleSeat = (id: string) => {
    if (!id) return;
    setLocalSeats(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    setBooking({ ...booking, selectedSeats: localSeats });
    navigate('/booking');
  };

  return (
    <div className="bg-black min-h-screen pb-40">
      <div className="bg-[#0a0a0a] p-8 sticky top-[75px] z-40 border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate(-1)} className="text-outskill-lime text-3xl hover:scale-125 transition-transform">←</button>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">Choose Seats: {selectedFlight?.airline}</h1>
          </div>
          <div className="flex gap-10">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-outskill-lime rounded-lg shadow-[0_0_15px_rgba(184,239,67,0.3)]"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#111111] rounded-lg border border-[#1f1f1f]"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-800 rounded-lg opacity-40"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occupied</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 flex flex-col items-center">
        <div className="bg-[#0a0a0a] p-16 rounded-t-[140px] border-x-8 border-t-8 border-[#1a1a1a] w-[420px] shadow-2xl relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl drop-shadow-[0_0_30px_rgba(184,239,67,0.2)]">✈️</div>
          <h3 className="text-center font-black text-gray-800 text-[9px] uppercase mb-16 tracking-[1em]">Cockpit Ahead</h3>
          
          <div className="grid grid-cols-5 gap-6">
            {SEAT_MAP.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                {row.map((seat, sIdx) => (
                  seat === '' ? <div key={`${rIdx}-${sIdx}`} className="w-12"></div> : (
                    <div
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className={`w-12 h-12 rounded-2xl text-[11px] font-black flex items-center justify-center cursor-pointer transition-all border-2 ${
                        localSeats.includes(seat) 
                          ? 'bg-outskill-lime text-black border-outskill-lime shadow-[0_0_20px_rgba(184,239,67,0.4)] scale-110' 
                          : 'bg-black text-gray-600 border-[#1f1f1f] hover:border-outskill-lime hover:text-outskill-lime'
                      }`}
                    >
                      {seat}
                    </div>
                  )
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 w-full bg-[#0a0a0a] border-t border-[#1f1f1f] p-10 flex justify-between items-center z-50">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 md:px-20">
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">Assignment Count ({localSeats.length})</p>
              <p className="text-2xl font-black text-outskill-lime tracking-tighter uppercase">{localSeats.join(', ') || 'Pending Selection'}</p>
            </div>
            <div className="flex gap-16 items-center">
               <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">Checkout Value</p>
                  <p className="text-4xl font-black text-white tracking-tighter">₹{((selectedFlight?.price || 0) + localSeats.length * 499).toLocaleString()}</p>
               </div>
               <button 
                 onClick={handleConfirm}
                 className="outskill-btn px-20 py-5 rounded-full text-sm uppercase tracking-[0.2em]"
               >
                 Confirm Assignment
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
