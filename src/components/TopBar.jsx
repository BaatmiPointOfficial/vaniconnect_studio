import React, { useState, useEffect } from 'react';
import { Zap, Bell, Menu, Crown, ChevronDown, LogOut } from 'lucide-react';
import PaywallModal from './PaywallModal';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { auth, provider, db } from '../firebase.js';

export default function TopBar({ onMenuClick }) {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  // 🌟 SAAS STATE: Tracks if user is logged in and their credits
  const [user, setUser] = useState(null);
  const [isProUser, setIsProUser] = useState(false);
  const [credits, setCredits] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🌟 MAGIC LISTENER 1: Opens the paywall from anywhere
  useEffect(() => {
    const handleOpenPaywall = () => setIsPaywallOpen(true); 
    window.addEventListener('openPaywall', handleOpenPaywall);
    return () => window.removeEventListener('openPaywall', handleOpenPaywall);
  }, []);

  // 🌟 MAGIC LISTENER 2: Watches Firebase to see if you are logged in!
  useEffect(() => {
    const fetchUserData = async (currentUser) => {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setIsProUser(data.isProUser || false);
        // Matches your database field "free_credits"
        setCredits(data.free_credits !== undefined ? data.free_credits : 5); 
      }
    };

    // This runs automatically when the page loads to check if they are already logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ THE SMART LOGIN: Checks the database & awards credits
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      console.log("🔥 Authenticated:", currentUser.displayName);

      const userProfileRef = doc(db, "users", currentUser.uid);
      const profileSnapshot = await getDoc(userProfileRef);

      if (!profileSnapshot.exists()) {
        // IF THEY ARE NEW: Create profile and deposit 5 credits
        await setDoc(userProfileRef, {
          name: currentUser.displayName,
          email: currentUser.email,
          free_credits: 5,
          isProUser: false,
          joinedAt: new Date()
        });
        console.log("🎉 Brand new user! 5 Free Credits deposited.");
        setCredits(5);
        setIsProUser(false);
      } else {
        // IF THEY ARE RETURNING: Update UI with their saved data
        const data = profileSnapshot.data();
        setCredits(data.free_credits !== undefined ? data.free_credits : 5);
        setIsProUser(data.isProUser || false);
        console.log("👋 Welcome back! You have", data.free_credits, "credits left.");
      }
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setShowDropdown(false);
  };

  return (
    <>
      {/* STICKY HEADER */}
      <header className="sticky top-0 w-full flex items-center justify-between px-2 pt-4 pb-4 md:justify-end md:px-8 md:pt-6 md:pb-6 z-[60]">
        
        {/* 📱 1. THE THREE LINES (Hamburger Menu) */}
        <button 
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center w-11 h-11 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl text-slate-700 shadow-sm hover:bg-white transition-all"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {/* 💻 Right Side Control Panel */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 📱 2. MOBILE-ONLY UPGRADE BUTTON (Tiny & sleek) */}
          <button 
            onClick={() => setIsPaywallOpen(true)}
            className="md:hidden flex items-center gap-1 bg-gradient-to-r from-purple-600 to-rose-500 text-white px-3 py-2 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <Zap size={14} fill="currentColor" /> Pro
          </button>

          {/* 💻 DESKTOP-ONLY UPGRADE BUTTON (Full text) */}
          <button 
            onClick={() => setIsPaywallOpen(true)}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5"
          >
            <Zap size={16} fill="currentColor" /> Upgrade to Pro
          </button>

          {/* 🔔 Notifications Icon */}
          <button className="hidden sm:flex relative items-center justify-center w-11 h-11 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl text-slate-500 shadow-sm hover:bg-white transition-all">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>

          {/* 🌟 CONDITIONAL RENDERING: Sign In OR Credits Badge */}
          {!user ? (
            /* IF LOGGED OUT: Show Google Sign In */
            <div className="flex items-center shadow-sm rounded-xl overflow-hidden ml-1">
               <button 
                 onClick={handleLogin} 
                 className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
               >
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                 <span className="hidden sm:block">Sign In</span>
               </button>
            </div>
          ) : (
            /* IF LOGGED IN: Show Credit Tracker & Logout */
            <div className="flex items-center gap-2 ml-1 relative">
              
              {/* The Credit Badge */}
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border-2 
                  ${isProUser 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 text-amber-900 shadow-sm hover:shadow-md' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                {isProUser ? (
                  <>
                    <Crown size={16} className="text-amber-600" />
                    <span className="hidden sm:block">Pro Plan</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className={credits > 0 ? "text-amber-500 fill-current" : "text-rose-500"} />
                    <span className={credits === 0 ? "text-rose-600" : ""}>{credits} / 5</span>
                  </>
                )}
                <ChevronDown size={14} className="opacity-50" />
              </button>

              {/* The Dropdown Menu for Credits */}
              {showDropdown && !isProUser && (
                <div className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 animate-in slide-in-from-top-2">
                  <h4 className="font-extrabold text-slate-800 mb-1">Daily Usage Limits</h4>
                  <p className="text-xs font-medium text-slate-500 mb-4 pb-4 border-b border-slate-100">
                    You have <strong className="text-slate-800">{credits} free credits</strong> remaining today.
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

                  <button onClick={() => { setShowDropdown(false); setIsPaywallOpen(true); }} className="w-full py-3 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <Crown size={16} /> Upgrade to Pro
                  </button>
                </div>
              )}

              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white/70 backdrop-blur-xl border border-rose-100 rounded-xl text-rose-500 shadow-sm hover:bg-rose-50 hover:border-rose-200 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} strokeWidth={2.5} className="ml-1" />
              </button>
            </div>
          )}

        </div> 
      </header>

      {/* The Paywall Popup we built! */}
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
    </>
  );
}