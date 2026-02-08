
import React from 'react';
import { useApp } from '../store/AppContext';
import { MOCK_FLIGHTS, MOCK_TRAINS } from '../constants';
import { useNavigate } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const { searchParams, setSelectedFlight, setSelectedTrain } = useApp();
  const navigate = useNavigate();

  const handleSelectFlight = (flight: any) => {
    setSelectedFlight(flight);
    navigate('/seats');
  };

  const isMultiStop = searchParams.category === 'TripBuilder';
  const dataList = isMultiStop ? MOCK_TRAINS : MOCK_FLIGHTS;

  return (
    <div className="bg-black min-h-screen">
      <div className="bg-[#0a0a0a] py-6 shadow-2xl sticky top-[75px] z-40 border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 md:px-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] text-outskill-lime font-black uppercase tracking-widest mb-1">Origin</span>
              <span className="text-2xl font-black tracking-tighter">{searchParams.from}</span>
            </div>
            <span className="text-white/20 text-3xl font-light">⇄</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-outskill-lime font-black uppercase tracking-widest mb-1">Destination</span>
              <span className="text-2xl font-black tracking-tighter">{searchParams.to}</span>
            </div>
            <div className="h-12 w-px bg-[#1f1f1f] hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Schedule</span>
              <span className="text-2xl font-black tracking-tighter">Mon, 24 Jun</span>
            </div>
          </div>
          <button className="bg-white/5 hover:bg-white/10 border border-[#1f1f1f] px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            Filter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="hidden lg:block">
          <div className="bg-[#0a0a0a] rounded-3xl p-8 sticky top-[210px] border border-[#1f1f1f]">
            <h3 className="font-black text-white mb-8 uppercase text-xs tracking-widest">Global Filters</h3>
            <div className="space-y-5">
              {['Multi-Stop Route', 'Morning Departure', 'Priority Options', 'Express Journey'].map((f) => (
                <label key={f} className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-outskill-lime bg-black border-gray-800 rounded" />
                  <span className="text-[11px] font-black text-gray-500 group-hover:text-outskill-lime transition-colors uppercase tracking-tight">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#0a0a0a] p-8 rounded-3xl flex items-center justify-between border-b-2 border-outskill-lime">
            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Available {searchParams.category}</h2>
            <div className="flex gap-8 items-center">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Priority Sort:</span>
              <span className="text-[11px] font-black text-outskill-lime cursor-pointer uppercase tracking-widest">Price (Lowest First)</span>
            </div>
          </div>

          {dataList.map((item: any) => (
            <div key={item.id} className="bg-[#0a0a0a] rounded-[40px] shadow-sm hover:shadow-outskill-lime/5 transition-all overflow-hidden border border-[#1f1f1f] group">
              <div className="p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="flex items-center gap-8 w-60">
                    {item.logo ? (
                      <img src={item.logo} alt={item.airline} className="w-16 h-16 object-contain grayscale group-hover:grayscale-0 transition-all opacity-80" />
                    ) : (
                      <div className="w-16 h-16 bg-[#111111] text-outskill-lime flex items-center justify-center rounded-3xl text-3xl font-black border border-[#1f1f1f]">🚆</div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-white leading-none tracking-tighter">{item.airline || item.name}</span>
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">{item.cabinClass || item.number}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center justify-between w-full px-4 text-center">
                    <div>
                      <p className="text-4xl font-black text-white tracking-tighter">{item.departureTime}</p>
                      <p className="text-[11px] text-outskill-lime font-black uppercase tracking-widest mt-2">{item.origin}</p>
                    </div>

                    <div className="flex-1 px-10 relative">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2 block">{item.duration}</span>
                      <div className="w-full h-[1px] bg-[#1f1f1f] my-2 relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-gray-800 bg-black group-hover:border-outskill-lime transition-all"></div>
                      </div>
                      <span className="text-[10px] text-gray-600 font-black uppercase mt-2 block">{item.type || 'Express'}</span>
                    </div>

                    <div>
                      <p className="text-4xl font-black text-white tracking-tighter">{item.arrivalTime}</p>
                      <p className="text-[11px] text-outskill-lime font-black uppercase tracking-widest mt-2">{item.destination}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 w-52 border-l border-dashed border-[#1f1f1f] pl-12">
                    <p className="text-4xl font-black text-white tracking-tighter">₹{item.price.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-4">Total Price</p>
                    <button
                      onClick={() => handleSelectFlight(item)}
                      className="outskill-btn px-10 py-4 rounded-full text-xs uppercase tracking-widest w-full"
                    >
                      {isMultiStop ? 'SELECT' : 'BOOK NOW'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
