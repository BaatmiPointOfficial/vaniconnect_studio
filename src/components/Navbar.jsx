import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Zap, Phone, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* 👈 NEW: Grouped Mobile Menu and Logo together on the left */}
          <div className="flex items-center gap-4">
            
            {/* 📱 Mobile Menu Button (Hamburger) - NOW ON THE LEFT */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
              >
                {isOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <Layers color="white" size={28} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                VaniConnect <span className="text-blue-600">AI</span>
              </span>
            </Link>

          </div>

          {/* 💻 Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-bold text-lg transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Home</Link>
            <Link to="/studio" className={`font-bold text-lg flex items-center gap-1 transition-colors ${location.pathname === '/studio' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
              <Zap size={20} className={location.pathname === '/studio' ? 'text-yellow-500' : ''} /> AI Studio
            </Link>
            <Link to="/pricing" className={`font-bold text-lg transition-colors ${location.pathname === '/pricing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Pricing</Link>
            <Link to="/contact" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2">
              <Phone size={18} /> Contact Us
            </Link>
          </div>
          
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all">Home</Link>
            
            <Link to="/studio" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2">
              <Zap size={20} className="text-yellow-500"/> AI Studio
            </Link>
            
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all">Pricing</Link>
            
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 mt-4 rounded-xl text-lg font-bold bg-gray-900 text-white text-center shadow-md">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}