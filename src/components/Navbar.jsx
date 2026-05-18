import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Zap, Phone, Menu, X, Crown, ChevronDown, LogOut } from 'lucide-react';
import { auth } from '../firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // 🌟 SaaS BUSINESS LOGIC STATE
  const [user, setUser] = useState(null);
  const [isProUser, setIsProUser] = useState(false);
  const [credits, setCredits] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async (currentUser) => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setIsProUser(data.isProUser || false);
        if (!data.isProUser) {
          setCredits(data.dailyCredits !== undefined ? data.dailyCredits : 5);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchUserData(currentUser);
    });
    return () => unsubscribe();
  }, [db]);

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 👈 LEFT SIDE: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* 📱 Mobile Menu Button */}
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
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 hidden sm:block">
                Clipeto <span className="text-blue-600">AI</span>
              </span>
            </Link>
          </div>

          {/* 👉 RIGHT SIDE: Desktop Links + SaaS Credit Badge */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* 💻 Desktop Navigation (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`font-bold text-base transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Home</Link>
              <Link to="/studio" className={`font-bold text-base flex items-center gap-1 transition-colors ${location.pathname === '/studio' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <Zap size={18} className={location.pathname === '/studio' ? 'text-yellow-500' : ''} /> AI Studio
              </Link>
              <Link to="/pricing" className={`font-bold text-base transition-colors ${location.pathname === '/pricing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Pricing</Link>
            </div>

            {/* 🌟 SAAS CREDIT BADGE (Visible on ALL screens if logged in) */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all border-2 
                    ${isProUser 
                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 text-amber-900 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  {isProUser ? (
                    <>
                      <Crown size={14} className="text-amber-600 sm:w-4 sm:h-4" />
                      <span>Pro</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} className={`sm:w-4 sm:h-4 ${credits > 0 ? "text-amber-500 fill-current" : "text-rose-500"}`} />
                      <span className={credits === 0 ? "text-rose-600" : ""}>{credits} / 5 <span className="hidden sm:inline">Credits</span></span>
                    </>
                  )}
                  <ChevronDown size={12} className="opacity-50" />
                </button>

                {/* 🌟 CREDIT DROPDOWN MENU */}
                {showDropdown && !isProUser && (
                  <div className="absolute top-full right-0 mt-3 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 animate-in slide-in-from-top-2">
                    <h4 className="font-extrabold text-slate-800 mb-1">Daily Usage Limits</h4>
                    <p className="text-xs font-medium text-slate-500 mb-4 pb-4 border-b border-slate-100">
                      You have <strong className="text-slate-800">{credits} free credits</strong> remaining today. Credits reset every 24 hours.
                    </p>
                    
                    <div className="space-y-3 mb-5 text-sm font-bold text-slate-600">
                      <div className="flex justify-between items-center">
                        <span>Standard Tools</span>
                        <span className="text-amber-600 px-2 py-0.5 bg-amber-50 rounded text-[10px] sm:text-xs">1 Credit</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Heavy AI (4K, Auto)</span>
                        <span className="text-amber-600 px-2 py-0.5 bg-amber-50 rounded text-[10px] sm:text-xs">2 Credits</span>
                      </div>
                    </div>

                    <Link to="/pricing" onClick={() => setShowDropdown(false)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <Crown size={16} /> Upgrade to Pro
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile / Sign Out (Hidden on mobile, goes in hamburger) */}
            {user && (
              <button onClick={handleSignOut} className="hidden md:flex w-10 h-10 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <LogOut size={16} />
              </button>
            )}
            
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

            {user && (
              <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="block w-full px-4 py-3 mt-2 rounded-xl text-lg font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all text-center flex justify-center items-center gap-2">
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}