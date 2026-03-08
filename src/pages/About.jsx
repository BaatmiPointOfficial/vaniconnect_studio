import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, Shield, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pro-Level Media Editing</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            We believe that creating high-quality content shouldn't require an expensive PC or months of learning complex software. VaniConnect AI puts the power of an entire production studio right in your browser.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              VaniConnect AI was born out of frustration. As creators and engineers, we saw how much time was wasted on repetitive tasks like removing watermarks, enhancing blurry photos, and cutting videos. 
            </p>
            <p>
              We realized that Artificial Intelligence could completely automate these tedious workflows. Our goal was simple: build a centralized "AI Studio" where anyone—from local news agencies to solo YouTubers—could process their media files in seconds, securely and automatically.
            </p>
            <p>
              Today, we are proud to offer an enterprise-grade suite of 8 powerful tools that save our users thousands of hours every single month.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:-translate-y-1 transition-transform">
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Blazing Fast Speed</h3>
            <p className="text-gray-600">Time is money. Our custom AI architecture ensures your files are processed and ready to download in seconds, not hours.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:-translate-y-1 transition-transform">
            <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Privacy</h3>
            <p className="text-gray-600">Your data belongs to you. We employ 256-bit encryption and guarantee auto-deletion of all processed files within 24 hours.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:-translate-y-1 transition-transform">
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Target className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pixel-Perfect Accuracy</h3>
            <p className="text-gray-600">We don't settle for "good enough". Whether it's background removal or 4K upscaling, our models deliver flawless results every time.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to transform your media?</h2>
        <Link to="/studio" className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Open AI Studio Free
        </Link>
      </div>

    </div>
  );
}