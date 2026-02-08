
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
        <div>
          <h4 className="font-bold mb-4">Features</h4>
          <ul className="text-xs text-gray-400 space-y-2">
            <li>TripBuilder</li>
            <li>Smart Search</li>
            <li>Track Live</li>
            <li>Safe Connect</li>
            <li>Group Travel</li>
            <li>For Business</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">RouteStitch</h4>
          <ul className="text-xs text-gray-400 space-y-2">
            <li>About Us</li>
            <li>How It Works</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="text-xs text-gray-400 space-y-2">
            <li>Customer Support</li>
            <li>User Agreement</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div className="col-span-2">
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-xs text-gray-400 mb-4">Get the latest travel news and deals delivered to your inbox.</p>
          <div className="flex">
            <input type="email" placeholder="Email ID" className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none text-xs" />
            <button className="bg-mmt-blue px-6 py-2 rounded-r-md text-xs font-bold">SUBSCRIBE</button>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-gray-800 pt-10 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="flex gap-6">
          <span>Twitter</span>
          <span>Facebook</span>
          <span>Instagram</span>
          <span>LinkedIn</span>
        </div>
        <div>
          © 2024 ROUTESTITCH PVT. LTD. Country: India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
