import React from 'react';
import { Scale, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="w-full min-h-full animate-in fade-in duration-700 pt-16 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      
      <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
        
        {/* 🌟 Premium Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/60 pb-8 mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm">
              <Scale size={32} className="text-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
              <p className="text-slate-500 font-medium mt-2">Clipeto AI Studio</p>
            </div>
          </div>
          <div className="bg-white/50 px-5 py-2.5 rounded-xl border border-white/60 shadow-sm text-sm font-bold text-slate-600">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* 🌟 Legal Content */}
        <div className="prose prose-lg max-w-none text-slate-600 font-medium leading-relaxed space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-sm">1</span>
              Acceptance of Terms
            </h2>
            <p className="pl-11">
              By accessing and using Clipeto AI Studio, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-sm">2</span>
              User Responsibilities & Content
            </h2>
            <p className="pl-11">
              You are solely responsible for the media you upload. You agree <strong className="text-slate-900">not</strong> to use our services to process illegal, highly explicit, or copyrighted material that you do not have the rights to use. Clipeto AI reserves the right to terminate accounts that violate these terms.
            </p>
          </section>

          {/* 🚨 HIGHLIGHTED SECTION FOR TOOL RULES 🚨 */}
          <section className="bg-rose-50/50 backdrop-blur-md p-8 rounded-3xl border border-rose-200/60 shadow-sm my-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-400"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <AlertCircle className="text-rose-500" size={28} strokeWidth={2} />
              3. Acceptable Use of Specific Tools
            </h2>
            <ul className="space-y-6 text-slate-700">
              <li className="flex gap-4">
                <div className="min-w-2 mt-2 w-2 h-2 rounded-full bg-rose-400"></div>
                <p>
                  <strong className="text-slate-900 block mb-1">YouTube Downloader:</strong> 
                  Our video downloading functionality is provided exclusively for downloading videos that possess a <strong className="text-slate-900">Creative Commons license</strong>. You are strictly prohibited from downloading, distributing, or modifying copyrighted content without explicit permission from the original owner.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="min-w-2 mt-2 w-2 h-2 rounded-full bg-rose-400"></div>
                <p>
                  <strong className="text-slate-900 block mb-1">Watermark & Logo Remover:</strong> 
                  This tool is designed strictly for altering your own original media. You may use it to remove your own logos or watermarks in order to apply new ones. <strong className="text-rose-700">You are explicitly forbidden from using this tool to remove, alter, or obscure watermarks, logos, or copyright notices belonging to any third party.</strong>
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-sm">4</span>
              Service Availability
            </h2>
            <p className="pl-11">
              While we strive for 99.9% uptime, Clipeto AI is provided "as is". We are not liable for any temporary interruptions in service or loss of data (as all data is auto-deleted within 24 hours anyway).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-sm">5</span>
              Payments and Refunds
            </h2>
            <p className="pl-11">
              Paid subscriptions are billed in advance. If you are not satisfied with our Pro services, you may request a refund within 7 days of your initial purchase, subject to our review.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}