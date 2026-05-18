import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="w-full min-h-full animate-in fade-in duration-700 pt-16 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      
      <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
        
        {/* 🌟 Premium Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/60 pb-8 mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm">
              <ShieldCheck size={32} className="text-purple-600" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
              <p className="text-slate-500 font-medium mt-2">Clipeto AI Studio</p>
            </div>
          </div>
          <div className="bg-white/50 px-5 py-2.5 rounded-xl border border-white/60 shadow-sm text-sm font-bold text-slate-600">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* 🌟 Legal Content (Styled beautifully) */}
        <div className="prose prose-lg max-w-none text-slate-600 font-medium leading-relaxed space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm shadow-sm">1</span>
              Data Security & Auto-Deletion
            </h2>
            {/* Highlighted box for the most important point */}
            <p className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
              At Clipeto AI, your privacy is our highest priority. All media files uploaded to our servers are processed securely using 256-bit encryption. <strong className="text-slate-900">All uploaded files and processed results are automatically and permanently deleted from our servers within 24 hours.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-sm shadow-sm">2</span>
              AI Training
            </h2>
            <p className="pl-11">
              We absolutely <strong className="text-slate-900">do not</strong> use your private photos, videos, or audio files to train our artificial intelligence models. Your data belongs to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm shadow-sm">3</span>
              Information We Collect
            </h2>
            <p className="pl-11">
              We only collect the minimum information necessary to provide our services, such as your email address for account creation and payment processing details via our secure third-party payment gateways (e.g., Razorpay/Stripe).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-sm shadow-sm">4</span>
              Third-Party Services
            </h2>
            <p className="pl-11">
              We do not sell, rent, or share your personal information with third parties for their marketing purposes.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}