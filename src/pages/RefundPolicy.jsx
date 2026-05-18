import React from 'react';
import { Gift, CalendarDays, AlertTriangle, Mail } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="w-full min-h-full animate-in fade-in duration-700 pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* 🌟 Header Section (Matches Privacy Design) */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">Refund</span> Policy
        </h1>
        <p className="text-xl text-slate-600 font-medium leading-relaxed">
          Clipeto AI Studio<br />
          <span className="opacity-70 text-base">Last Updated: May 18, 2026</span>
        </p>
      </div>

      {/* 🌟 Central Glass Card (Matches Privacy Design) */}
      <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 shadow-inner">
        
        <div className="space-y-12">
          
          {/* Section 1: Digital Products */}
          <div className="relative pl-20">
            {/* Number and Icon with Gradient Line */}
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-rose-500 opacity-20">
                1
              </div>
              <Gift className="absolute top-8 text-purple-600" size={32} />
              <div className="w-px h-full bg-gradient-to-b from-purple-600/50 to-transparent mt-4"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Digital Products & Usage</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Clipeto provides digital software-as-a-service (SaaS) and AI processing credits. Due to the immediate access and computing resources required to process digital media, all sales are final outside of our grace period.
            </p>
          </div>

          {/* Section 2: 7-Day Guarantee */}
          <div className="relative pl-20">
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-rose-500 opacity-20">
                2
              </div>
              <CalendarDays className="absolute top-8 text-rose-500" size={32} />
              <div className="w-px h-full bg-gradient-to-b from-rose-500/50 to-transparent mt-4"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">7-Day Refund Guarantee</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              If you are not completely satisfied with our Pro services, you may request a full refund within **7 days** of your initial purchase. After 7 days, all purchases are considered final and non-refundable.
            </p>
          </div>

          {/* Section 3: Technical Issues */}
          <div className="relative pl-20">
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-rose-500 opacity-20">
                3
              </div>
              <AlertTriangle className="absolute top-8 text-amber-500" size={32} />
              <div className="w-px h-full bg-gradient-to-b from-amber-500/50 to-transparent mt-4"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Failed Processings or Technical Issues</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              If a critical technical failure occurs where the AI engine fails to process your media and consumes your quota, please contact us within 3 days. We will review server logs and, at our discretion, credit your account with lost usage. We do not provide cash refunds for technical errors.
            </p>
          </div>

          {/* Section 4: Contact Us */}
          <div className="relative pl-20">
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-rose-500 opacity-20">
                4
              </div>
              <Mail className="absolute top-8 text-indigo-500" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Contact Us for Billing</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              If you have any questions regarding your billing or subscription, or to request a refund within your 7-day window, please contact our support team.
            </p>
            {/* Contact Card (Matches style from Contact Page Info) */}
            <div className="flex items-center text-slate-700 font-bold bg-white/50 rounded-xl p-4 border border-white/80 shadow-sm inline-block">
              <Mail className="text-rose-500 mr-3" size={24} /> 
              <span>support@clipeto.com</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}