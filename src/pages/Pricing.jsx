import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-500">Start for free, upgrade when you need more power.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Free Tier */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Starter</h2>
          <p className="text-gray-500 mb-6">Perfect for testing the waters.</p>
          <div className="text-5xl font-extrabold text-gray-900 mb-8">₹0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> 5 Watermark Removals / day</li>
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> Standard Video Downloads</li>
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> 720p Enhancements</li>
          </ul>
          <Link to="/studio" className="w-full py-4 rounded-xl font-bold text-center border-2 border-gray-200 text-gray-900 hover:border-gray-300 transition-colors">
            Get Started
          </Link>
        </div>

        {/* Pro Tier (Highlighted) */}
        <div className="bg-gray-900 rounded-3xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4 border border-gray-800">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
            MOST POPULAR
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
          <p className="text-gray-400 mb-6">For serious content creators.</p>
          <div className="text-5xl font-extrabold text-white mb-8">₹999<span className="text-lg text-gray-400 font-medium">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300"><Check className="text-blue-400" size={20} /> Unlimited Watermark Removals</li>
            <li className="flex items-center gap-3 text-gray-300"><Check className="text-blue-400" size={20} /> 4K Video Downloads</li>
            <li className="flex items-center gap-3 text-gray-300"><Check className="text-blue-400" size={20} /> 1080p AI Enhancements</li>
            <li className="flex items-center gap-3 text-gray-300"><Check className="text-blue-400" size={20} /> Priority GPU Processing</li>
          </ul>
          <button className="w-full py-4 rounded-xl font-bold text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            Upgrade to Pro
          </button>
        </div>

        {/* Agency Tier */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency</h2>
          <p className="text-gray-500 mb-6">For high-volume processing.</p>
          <div className="text-5xl font-extrabold text-gray-900 mb-8">₹2999<span className="text-lg text-gray-500 font-medium">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> Everything in Pro</li>
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> API Access</li>
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> Custom Brand Overlays</li>
            <li className="flex items-center gap-3 text-gray-700"><Check className="text-green-500" size={20} /> 24/7 Dedicated Support</li>
          </ul>
          <Link to="/contact" className="w-full py-4 rounded-xl font-bold text-center border-2 border-gray-200 text-gray-900 hover:border-gray-300 transition-colors">
            Contact Sales
          </Link>
        </div>

      </div>
    </div>
  );
}