
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

const Booking: React.FC = () => {
  const { selectedFlight, booking, setBooking } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male'
  });

  if (!selectedFlight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center bg-[#0a0a0a] p-16 rounded-[48px] shadow-2xl border border-[#1f1f1f]">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Session Timeout</h2>
          <button onClick={() => navigate('/')} className="mt-10 outskill-btn px-12 py-4 rounded-full text-xs uppercase tracking-widest">Back to Grid</button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step < 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Verify all input fields before proceeding.");
        return;
      }
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      alert('Transaction Verified. Electronic ticket issued.');
      navigate('/dashboard');
    }
  };

  const totalPrice = (selectedFlight.price - 200) + (booking.selectedSeats.length * 499);

  return (
    <div className="bg-black min-h-screen pb-32">
      <div className="bg-[#000000] h-64 pt-20 px-4 md:px-20 relative overflow-hidden border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white relative z-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Terminal <span className="text-outskill-lime italic">Payment</span></h1>
          <div className="flex gap-8 items-center">
            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-lg border-2 ${step >= 1 ? 'bg-outskill-lime border-outskill-lime text-black' : 'border-[#1f1f1f] text-gray-700'}`}>01</div>
            <div className="h-[2px] w-20 bg-[#1f1f1f]"></div>
            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-lg border-2 ${step >= 2 ? 'bg-outskill-lime border-outskill-lime text-black' : 'border-[#1f1f1f] text-gray-700'}`}>02</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-20 -mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-20">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-[#0a0a0a] rounded-[48px] shadow-sm overflow-hidden border border-[#1f1f1f]">
            <div className="bg-[#111111] p-8 border-b border-[#1f1f1f] flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Flight_Config_Log</h3>
              <span className="text-[11px] font-black text-outskill-lime bg-black px-5 py-2 rounded-2xl border border-outskill-lime/20 uppercase">Units: {booking.selectedSeats.join(', ') || 'N/A'}</span>
            </div>
            <div className="p-12">
               <div className="flex items-center gap-16">
                 <img src={selectedFlight.logo} className="w-20 h-20 object-contain opacity-80" />
                 <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-4xl font-black text-white tracking-tighter">{selectedFlight.departureTime}</p>
                      <p className="text-[11px] font-black text-outskill-lime uppercase tracking-[0.2em] mt-2">{selectedFlight.origin}</p>
                    </div>
                    <div className="flex-1 px-16 text-center text-[10px] font-black text-gray-700">
                       {selectedFlight.duration}
                       <div className="h-[1px] bg-[#1f1f1f] w-full my-3 relative">
                         <div className="absolute inset-0 bg-outskill-lime w-1/2"></div>
                       </div>
                       {selectedFlight.type}
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-white tracking-tighter">{selectedFlight.arrivalTime}</p>
                      <p className="text-[11px] font-black text-outskill-lime uppercase tracking-[0.2em] mt-2">{selectedFlight.destination}</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className={`bg-[#0a0a0a] rounded-[48px] shadow-sm p-12 ${step > 1 ? 'opacity-30 pointer-events-none' : ''} border border-[#1f1f1f]`}>
            <h3 className="text-2xl font-black text-white mb-12 uppercase tracking-tighter flex items-center gap-4">
              <span className="text-outskill-lime">👤</span>
              Entity Details
            </h3>
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Full Name (First)</label>
                  <input 
                    type="text" 
                    className="border-b-2 border-[#1f1f1f] p-4 text-base font-black uppercase outline-none focus:border-outskill-lime transition-all bg-black text-white rounded-t-2xl" 
                    placeholder="E.G. BRUCE"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Sur Name (Last)</label>
                  <input 
                    type="text" 
                    className="border-b-2 border-[#1f1f1f] p-4 text-base font-black uppercase outline-none focus:border-outskill-lime transition-all bg-black text-white rounded-t-2xl" 
                    placeholder="E.G. WAYNE"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Interface Email</label>
                  <input 
                    type="email" 
                    placeholder="CONTACT@OUTSKILL.SYS" 
                    className="border-b-2 border-[#1f1f1f] p-4 text-base font-black outline-none focus:border-outskill-lime transition-all bg-black text-white rounded-t-2xl"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Terminal Comms (Phone)</label>
                  <input 
                    type="tel" 
                    placeholder="+91-000-000" 
                    className="border-b-2 border-[#1f1f1f] p-4 text-base font-black outline-none focus:border-outskill-lime transition-all bg-black text-white rounded-t-2xl"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-[#0a0a0a] rounded-[48px] shadow-sm overflow-hidden ${step < 2 ? 'hidden' : 'block animate-pulse'} border border-[#1f1f1f]`}>
            <div className="p-12 border-b border-[#1f1f1f] bg-[#111111]">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Auth Gateway</h3>
            </div>
            <div className="p-12">
              <div className="border-2 border-outskill-lime p-8 rounded-[32px] bg-black flex items-center gap-8 shadow-[0_0_40px_rgba(184,239,67,0.1)]">
                <div className="w-8 h-8 rounded-full border-4 border-outskill-lime flex items-center justify-center">
                  <div className="w-3 h-3 bg-outskill-lime rounded-full"></div>
                </div>
                <div className="flex-1">
                   <p className="font-black text-lg uppercase text-white tracking-tight">Encrypted Global Checkout</p>
                   <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mt-2">Verified • Secure • Fast</p>
                </div>
                <span className="text-4xl opacity-50">⚡</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="w-full outskill-btn py-7 rounded-full text-lg shadow-2xl uppercase tracking-[0.3em] mb-20"
          >
            {step === 1 ? 'Verify & Continue' : 'Authorize Credit'}
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#0a0a0a] rounded-[40px] shadow-2xl sticky top-32 border border-[#1f1f1f] overflow-hidden">
            <h3 className="bg-[#111111] p-8 border-b border-[#1f1f1f] text-xs font-black text-white uppercase tracking-[0.4em]">Accounting_Log</h3>
            <div className="p-10 space-y-6">
              <div className="flex justify-between text-[11px] font-black text-gray-600 uppercase tracking-widest">
                <span>Core Rate</span>
                <span className="text-white">₹{(selectedFlight.price - 940).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black text-gray-600 uppercase tracking-widest">
                <span>System Fees</span>
                <span className="text-white">₹940</span>
              </div>
              {booking.selectedSeats.length > 0 && (
                <div className="flex justify-between text-[11px] font-black text-outskill-lime uppercase tracking-widest">
                  <span>Slot Mod ({booking.selectedSeats.length})</span>
                  <span>₹{(booking.selectedSeats.length * 499).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] font-black text-green-500 uppercase tracking-widest bg-green-500/5 p-4 rounded-2xl border border-green-500/20">
                <span>LOYALTY_APPLIED</span>
                <span>- ₹200</span>
              </div>
              <div className="pt-8 flex justify-between items-center border-t border-[#1f1f1f]">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">Balance</span>
                <span className="text-4xl font-black text-white tracking-tighter">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-outskill-lime p-5 text-center">
               <p className="text-[10px] text-black font-black uppercase tracking-[0.3em]">Protection Protocol Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
