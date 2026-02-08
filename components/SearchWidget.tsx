
import React from 'react';
import { useApp } from '../store/AppContext';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import { useNavigate } from 'react-router-dom';

const SearchWidget: React.FC = () => {
  const { searchParams, setSearchParams } = useApp();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/search');
  };

  const isTrain = searchParams.category === 'Trains';
  const isHotel = searchParams.category === 'Hotels';

  return (
    <div className="relative z-10 -mt-24 mx-4 md:mx-20">
      <div className="bg-[#0a0a0a] rounded-t-3xl flex justify-center items-center border-b border-[#1f1f1f] overflow-x-auto no-scrollbar px-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            onClick={() => setSearchParams({ ...searchParams, category: cat.name as Category })}
            className={`flex flex-col items-center py-6 px-6 cursor-pointer border-b-4 transition-all ${
              searchParams.category === cat.name ? 'border-outskill-lime text-outskill-lime' : 'border-transparent text-gray-600 hover:text-gray-400'
            }`}
          >
            <span className="text-2xl mb-2 grayscale opacity-70 group-hover:grayscale-0">{cat.icon}</span>
            <span className="text-[10px] font-black whitespace-nowrap uppercase tracking-[0.2em]">{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] p-10 rounded-b-3xl shadow-2xl border border-[#1f1f1f]">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
            {!isHotel && (
              <>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="trip" defaultChecked className="w-5 h-5 accent-outskill-lime bg-black border-gray-800" />
                  <span className="group-hover:text-outskill-lime transition-colors">One Way</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="trip" className="w-5 h-5 accent-outskill-lime bg-black border-gray-800" />
                  <span className="group-hover:text-outskill-lime transition-colors">Round Trip</span>
                </label>
              </>
            )}
            {isHotel && <span className="font-black text-white tracking-widest">Find Premium Accommodations</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 border border-[#1f1f1f] rounded-3xl overflow-hidden bg-black shadow-inner">
            <div className="p-8 border-r border-[#1f1f1f] hover:bg-[#111111] cursor-pointer transition-all group">
              <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">{isHotel ? 'Location' : 'From'}</p>
              <h3 className="text-2xl font-black text-white group-hover:translate-x-1 transition-transform">{searchParams.from}</h3>
              <p className="text-[10px] text-gray-500 font-bold truncate mt-1 uppercase tracking-tighter">{isTrain ? 'CBE, Junction' : 'CJB, Coimbatore Intl'}</p>
            </div>
            <div className="p-8 border-r border-[#1f1f1f] hover:bg-[#111111] cursor-pointer relative transition-all group">
              {!isHotel && (
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 bg-[#0a0a0a] rounded-full p-2.5 shadow-xl border border-[#1f1f1f] z-10 text-outskill-lime group-hover:rotate-180 transition-transform duration-500">
                  ⇄
                </div>
              )}
              <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">{isHotel ? 'Check-In' : 'To'}</p>
              <h3 className="text-2xl font-black text-white group-hover:translate-x-1 transition-transform">{isHotel ? '24 Jun' : searchParams.to}</h3>
              <p className="text-[10px] text-gray-500 font-bold truncate mt-1 uppercase tracking-tighter">{isHotel ? 'Monday' : (isTrain ? 'BGM, Belgaum Station' : 'IXG, Belgaum Airport')}</p>
            </div>
            <div className="p-8 border-r border-[#1f1f1f] hover:bg-[#111111] cursor-pointer transition-all">
              <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">{isHotel ? 'Check-Out' : 'Departure'}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{isHotel ? '25' : '24'}</span>
                <span className="text-lg font-bold text-gray-400">Jun'24</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">{isHotel ? 'Tuesday' : 'Monday'}</p>
            </div>
            <div className="p-8 border-r border-[#1f1f1f] hover:bg-[#111111] cursor-pointer transition-all">
              <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">{isHotel ? 'Guests' : 'Return'}</p>
              {isHotel ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">1</span>
                  <span className="text-lg font-bold text-gray-400">Room</span>
                </div>
              ) : (
                <p className="text-[10px] text-gray-700 font-black italic mt-2 uppercase tracking-widest">Optional</p>
              )}
            </div>
            <div className="p-8 hover:bg-[#111111] cursor-pointer transition-all">
              <p className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.2em] mb-2">Class</p>
              <h3 className="text-2xl font-black text-white">{isTrain ? 'All' : 'Economy'}</h3>
              <p className="text-[10px] text-gray-500 font-bold truncate mt-1 uppercase tracking-tighter">Premium Selection</p>
            </div>
          </div>

          <div className="flex justify-center -mb-18 mt-4">
            <button 
              onClick={handleSearch}
              className="outskill-btn px-28 py-5 rounded-full text-2xl font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(184,239,67,0.15)]"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;
