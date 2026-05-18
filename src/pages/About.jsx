import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, Shield, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full min-h-full animate-in fade-in duration-700 pt-16 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      
      {/* 🌟 Hero Section (Glassmorphism & Gradients) */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.05]">
          Democratizing <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">Pro-Level Media Editing</span>
        </h1>
        <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          We believe creating high-quality content shouldn't require an expensive PC or months of learning complex software. Clipeto AI puts the power of an entire production studio right in your browser.
        </p>
      </div>

      {/* 🌟 Our Story Section (Frosted Glass Panel) */}
      <div className="mb-20">
        <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 tracking-tight">Our Story</h2>
          <div className="prose prose-lg text-slate-600 max-w-none space-y-6 font-medium leading-relaxed">
            <p>
              Clipeto AI was born out of frustration. As creators and engineers, we saw how much time was wasted on repetitive tasks like removing watermarks, enhancing blurry photos, and cutting videos. 
            </p>
            <p>
              We realized that Artificial Intelligence could completely automate these tedious workflows. Our goal was simple: build a centralized "AI Studio" where anyone—from local news agencies to solo YouTubers—could process their media files in seconds, securely and automatically.
            </p>
            <p>
              Today, we are proud to offer an enterprise-grade suite of powerful tools that save our users thousands of hours every single month.
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 Core Values Section (Floating Glass Cards) */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
            <div className="bg-white/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500">
              <Zap className="text-purple-600" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Blazing Fast Speed</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Time is money. Our custom AI architecture ensures your files are processed and ready to download in seconds, not hours.</p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
            <div className="bg-white/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500">
              <Shield className="text-rose-500" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Uncompromising Privacy</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Your data belongs to you. We employ 256-bit encryption and guarantee auto-deletion of all processed files within 24 hours.</p>
          </div>

          <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
            <div className="bg-white/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500">
              <Target className="text-blue-500" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Pixel-Perfect Accuracy</h3>
            <p className="text-slate-500 font-medium leading-relaxed">We don't settle for "good enough". Whether it's background removal or 4K upscaling, our models deliver flawless results every time.</p>
          </div>
        </div>
      </div>

      {/* 🌟 CTA Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">Ready to transform your media?</h2>
        <Link to="/studio/youtube-downloader" className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
          Open AI Studio Free <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>

    </div>
  );
}