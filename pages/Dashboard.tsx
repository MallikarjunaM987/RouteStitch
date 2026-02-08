
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-20 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#0a0a0a] rounded-[48px] shadow-sm overflow-hidden border border-[#1f1f1f]">
            <div className="p-10 text-center relative overflow-hidden bg-black border-b border-[#1f1f1f]">
              <div className="w-28 h-28 bg-[#0a0a0a] rounded-[40px] mx-auto mb-6 flex items-center justify-center text-5xl font-black text-outskill-lime shadow-2xl border border-[#1f1f1f]">JD</div>
              <h2 className="text-white text-2xl font-black tracking-tighter">John Doe</h2>
              <p className="text-outskill-lime text-[10px] font-black uppercase tracking-[0.4em] mt-2">Level_04 Explorer</p>
            </div>
            <div className="p-6 space-y-2">
              {['Config', 'Missions (Trips)', 'Terminal Credits', 'Vault', 'Disconnect'].map((item) => (
                <div key={item} className={`px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer rounded-3xl transition-all ${item === 'Missions (Trips)' ? 'bg-[#111111] text-outskill-lime border border-outskill-lime/20' : 'text-gray-600 hover:text-white hover:bg-[#111111]'}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-[#0a0a0a] rounded-[48px] shadow-sm p-12 border border-[#1f1f1f]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Mission Log</h1>
              <div className="flex gap-10 border-b border-[#1f1f1f] w-full md:w-auto">
                <span className="text-[10px] font-black text-outskill-lime cursor-pointer border-b-4 border-outskill-lime pb-5 uppercase tracking-[0.2em]">Active</span>
                <span className="text-[10px] font-black text-gray-700 cursor-pointer pb-5 uppercase tracking-[0.2em] hover:text-gray-500">History</span>
                <span className="text-[10px] font-black text-gray-700 cursor-pointer pb-5 uppercase tracking-[0.2em] hover:text-gray-500">Vaulted</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-32 border-4 border-dashed border-[#111111] rounded-[64px] bg-black">
              <span className="text-8xl mb-8 opacity-20 filter grayscale">🛸</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Orbit Empty</h3>
              <p className="text-sm text-gray-700 font-bold mt-3 uppercase tracking-widest text-center max-w-xs">Initialize a new mission from the terminal.</p>
              <button className="mt-12 outskill-btn px-16 py-5 rounded-full text-xs uppercase tracking-[0.3em]">
                New Mission
              </button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-[48px] shadow-sm p-12 border border-[#1f1f1f]">
             <h2 className="text-xl font-black text-white mb-10 uppercase tracking-[0.2em] flex items-center gap-4">
               <span className="text-outskill-lime">✨</span>
               Outskill Credits
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-10 bg-black border border-[#1f1f1f] rounded-[48px] shadow-2xl group hover:border-outskill-lime transition-colors">
                  <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] mb-3">Available_Fuel</p>
                  <p className="text-6xl font-black text-white tracking-tighter">₹0</p>
                  <div className="mt-10 h-1 bg-[#111111] rounded-full overflow-hidden">
                    <div className="h-full bg-outskill-lime w-0 group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
                <div className="p-10 bg-[#111111] border border-[#1f1f1f] rounded-[48px] flex flex-col justify-between group">
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-3">Xp Points</p>
                    <p className="text-6xl font-black text-outskill-lime tracking-tighter">540</p>
                  </div>
                  <button className="text-[11px] text-white font-black uppercase tracking-[0.2em] bg-black border border-[#1f1f1f] py-4 rounded-[24px] mt-10 hover:bg-outskill-lime hover:text-black hover:border-outskill-lime transition-all">
                    Upgrade Status
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
