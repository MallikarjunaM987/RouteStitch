
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-black px-4 md:px-20 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-[#1f1f1f]">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-white">make<span className="text-outskill-lime italic">my</span>trip</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {['Super Offers', 'myBiz', 'My Trips'].map((item, idx) => (
            <div key={item} className="flex items-center gap-2 text-[11px] font-black text-gray-400 cursor-pointer hover:text-outskill-lime transition-colors uppercase tracking-widest">
              <span className="text-lg opacity-80">{idx === 0 ? '🎁' : idx === 1 ? '🏢' : '💼'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 border border-[#1f1f1f] px-4 py-2 rounded-full cursor-pointer hover:bg-[#1a1a1a]">
          <span>IN | EN | INR</span>
        </div>
        <button className="outskill-btn px-8 py-2.5 rounded-full text-xs uppercase tracking-widest">
          Login / Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
