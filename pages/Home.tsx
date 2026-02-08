
import React from 'react';
import SearchWidget from '../components/SearchWidget';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="h-[480px] pt-24 relative overflow-hidden bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 md:px-20 text-center relative z-10">
           <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
             Level Up Your <br/><span className="text-outskill-lime italic">Travel Game.</span>
           </h1>
           <p className="text-gray-500 text-xs md:text-sm font-black uppercase tracking-[0.4em]">Premium Bookings • Exclusive Destinations • Smart Fares</p>
        </div>
        {/* Decorative Grid or Shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#B8EF43 0.5px, transparent 0.5px)', backgroundSize: '24px 24px'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-outskill-lime/5 rounded-full blur-[120px]"></div>
      </div>

      <SearchWidget />

      {/* Offers Section */}
      <div className="mt-32 max-w-7xl mx-auto px-4 md:px-20 pb-40">
        <div className="bg-[#0a0a0a] rounded-[48px] p-12 shadow-2xl border border-[#1f1f1f]">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
             <div className="text-left">
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">Unlocked Deals</h2>
               <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">Your loyalty points have unlocked these exclusive rates.</p>
             </div>
             <div className="flex gap-10 overflow-x-auto no-scrollbar w-full md:w-auto border-b border-[#1f1f1f]">
              {['ALL', 'FLIGHTS', 'HOTELS', 'TRAINS'].map((tab, idx) => (
                <span key={tab} className={`text-[10px] font-black cursor-pointer uppercase tracking-[0.2em] pb-5 transition-all border-b-4 ${idx === 1 ? 'text-outskill-lime border-outskill-lime' : 'text-gray-700 border-transparent hover:text-gray-500'}`}>
                  {tab}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-col md:flex-row border border-[#1f1f1f] rounded-[40px] overflow-hidden hover:border-outskill-lime/30 transition-all cursor-pointer group bg-black">
                <div className="relative w-full md:w-64 shrink-0 h-56 md:h-auto overflow-hidden">
                  <img src={`https://picsum.photos/seed/dark${i}/600/600`} alt="Offer" className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-outskill-lime text-[10px] font-black uppercase tracking-widest bg-black/60 px-3 py-1 rounded">OFFER_{i}</div>
                </div>
                <div className="p-10 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] text-outskill-lime font-black uppercase tracking-[0.3em]">Special Fare</span>
                    <h3 className="text-2xl font-black text-white leading-tight my-4 uppercase tracking-tighter">
                      {i === 1 ? 'Coimbatore to Belgaum 20% OFF' : 'Zero Convenience Fee for Outskill Pro Members'}
                    </h3>
                  </div>
                  <div className="mt-10 flex items-center justify-between">
                     <div className="px-5 py-2 bg-[#111111] rounded-2xl text-[11px] font-black text-white border border-[#1f1f1f]">CODE: <span className="text-outskill-lime">SKILLUP</span></div>
                     <button className="text-outskill-lime font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">Redeem Now →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 px-8">
          {[
            { icon: '💎', title: 'Elite Status', desc: 'Join the Outskill travel elite for automated upgrades.' },
            { icon: '⚡', title: 'Flash Booking', desc: 'Confirm your ticket in under 3 clicks with stored data.' },
            { icon: '📡', title: 'Real-time Sync', desc: 'Live updates directly to your terminal or dashboard.' },
            { icon: '🎨', title: 'Visual Twins', desc: 'Pixel-perfect UI designed for high-performance usage.' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
               <div className="w-24 h-24 bg-[#0a0a0a] rounded-[32px] flex items-center justify-center text-5xl shadow-2xl mb-10 group-hover:scale-110 group-hover:shadow-outskill-lime/5 transition-all border border-[#1f1f1f]">
                 {item.icon}
               </div>
               <h4 className="font-black text-white uppercase tracking-[0.2em] text-xs mb-4">{item.title}</h4>
               <p className="text-xs text-gray-500 font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
