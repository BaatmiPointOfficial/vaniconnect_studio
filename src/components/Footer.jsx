import React from 'react';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() {
  // mt-auto pushes the footer to the absolute bottom of the screen
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          
          {/* Footer Logo */}
          <div className="flex justify-center md:justify-start items-center gap-2 mb-4 md:mb-0">
            <Layers className="text-blue-600" size={24} />
            <span className="text-xl font-bold text-gray-900">VaniConnect AI</span>
          </div>
          
          {/* Copyright & Links */}
          <div className="text-center md:text-right text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} VaniConnect AI Studio. All rights reserved.
            <div className="mt-2 space-x-4">
              <div className="mt-2 space-x-4">
           <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
           <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
           <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
           <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
         </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}