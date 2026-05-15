import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Youtube, Eraser, CreditCard, Mail, Info, Image as ImageIcon, Sparkles, Film, Scissors, Layers, Stamp } from 'lucide-react';
import Footer from './Footer';
import TopBar from './TopBar';

export default function Layout({ children }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  // Track if mobile menu is open
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f8f9ff] via-[#eef2fa] to-[#e6ebf8] p-4 md:p-6 font-sans overflow-hidden relative">

      {/* 🌟 Dark Overlay background when menu is open on mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* 🌟 Responsive Sliding Sidebar */}
      <aside className={`fixed md:relative z-50 w-[260px] h-[calc(100%-2rem)] md:h-full bg-white/40 backdrop-blur-3xl flex flex-col rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] pointer-events-auto overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'}`}>
        
        {/* VaniConnect Logo */}
        <div className="p-8 mb-2">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMobileOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-rose-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-105">
              V
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              Vani<span className="text-purple-600">Connect.</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 px-4 flex flex-col gap-8 pb-8">
          
          {/* 1. OVERVIEW */}
          <div className="pt-6 mb-8">
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 ml-3">Overview</p>
            <nav className="space-y-2">
              <Link onClick={() => setIsMobileOpen(false)} to="/" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/') ? "bg-white text-purple-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Home size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/') ? "text-purple-600" : "text-slate-400"}`} /> Dashboard
              </Link>
            </nav>
          </div>

          {/* 2. STUDIO ENGINE */}
          <div className="mb-8">
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 ml-3">Studio Engine</p>
            <nav className="space-y-2">
             {/*  <Link onClick={() => setIsMobileOpen(false)} to="/studio/youtube-downloader" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/youtube-downloader') ? "bg-white text-purple-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Youtube size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/youtube-downloader') ? "text-purple-600" : "text-slate-400"}`} /> Downloader
              </Link>*/} 
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/video-watermark" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/video-watermark') ? "bg-white text-purple-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Eraser size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/video-watermark') ? "text-purple-600" : "text-slate-400"}`} /> Video Watermark
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/photo-watermark" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/photo-watermark') ? "bg-white text-blue-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <ImageIcon size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/photo-watermark') ? "text-blue-600" : "text-slate-400"}`} /> Photo Watermark
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/photo-enhancer" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/photo-enhancer') ? "bg-white text-emerald-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Sparkles size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/photo-enhancer') ? "text-emerald-600" : "text-slate-400"}`} /> Photo Enhancer
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/video-enhancer" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/video-enhancer') ? "bg-white text-amber-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Film size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/video-enhancer') ? "text-amber-600" : "text-slate-400"}`} /> Video Enhancer
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/clip-cut-pro" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/clip-cut-pro') ? "bg-white text-indigo-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Scissors size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/clip-cut-pro') ? "text-indigo-600" : "text-slate-400"}`} /> Clip Cut Pro
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/bg-remover" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/bg-remover') ? "bg-white text-pink-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Layers size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/bg-remover') ? "text-pink-600" : "text-slate-400"}`} /> BG Remover
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/studio/add-logo" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/studio/add-logo') ? "bg-white text-fuchsia-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Stamp size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/studio/add-logo') ? "text-fuchsia-600" : "text-slate-400"}`} /> Add Logo
              </Link>
            </nav>
          </div>

          {/* 3. COMPANY */}
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 ml-3">Company</p>
            <nav className="space-y-2">
              <Link onClick={() => setIsMobileOpen(false)} to="/about" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/about') ? "bg-white text-purple-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Info size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/about') ? "text-purple-600" : "text-slate-400"}`} /> About Us
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/subscription" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/subscription') ? "bg-white text-purple-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <CreditCard size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/subscription') ? "text-purple-600" : "text-slate-400"}`} /> Subscription
              </Link>
              <Link onClick={() => setIsMobileOpen(false)} to="/contact" className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${isActive('/contact') ? "bg-white text-purple-700 shadow-md border border-white" : "hover:bg-white/60 hover:text-slate-900 text-slate-600"}`}>
                <Mail size={18} strokeWidth={2.5} className={`mr-3 ${isActive('/contact') ? "text-purple-600" : "text-slate-400"}`} /> Contact
              </Link>
            </nav>
          </div>
        </div>
      </aside>

     {/* 🌟 MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 bg-transparent pt-6 pr-6 pb-6 pl-2 md:pl-6 no-scrollbar">
        <div className="min-h-full rounded-[2.5rem] flex flex-col">
          
          {/* 🌟 THIS IS THE LINE YOU ACCIDENTALLY DELETED! ADD IT BACK: */}
          <TopBar onMenuClick={() => setIsMobileOpen(true)} />
          
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </main>

    </div>
  );
}