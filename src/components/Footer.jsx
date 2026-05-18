
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // mt-auto pushes it to the bottom, border-t gives a subtle separation line
    <footer className="w-full mt-auto px-4 py-6 md:py-8 border-t border-white/50">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* Left Side: Copyright & Brand */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <Zap size={14} className="text-purple-500 fill-purple-500 hidden sm:block" />
          <p className="text-[11px] md:text-xs font-bold text-slate-500">
            © {currentYear} Clipeto Studio. <span className="opacity-70">A Clipeto AI brand.</span>
          </p>
        </div>

        {/* Right Side: Legal Links */}
        <div className="flex items-center gap-6">
          <Link 
            to="/terms" 
            className="text-[11px] md:text-xs font-extrabold text-slate-500 hover:text-purple-600 transition-colors uppercase tracking-wider"
          >
            Terms
          </Link>
          <Link 
            to="/privacy" 
            className="text-[11px] md:text-xs font-extrabold text-slate-500 hover:text-purple-600 transition-colors uppercase tracking-wider"
          >
            Privacy
          </Link>
        </div>

      </div>
    </footer>
  );
}