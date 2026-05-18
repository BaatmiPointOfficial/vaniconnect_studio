import React, { useState } from 'react';
import { Clock, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you will eventually connect to your FastAPI backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="w-full min-h-full animate-in fade-in duration-700 pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* 🌟 Header Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">help you?</span>
        </h1>
        <p className="text-xl text-slate-600 font-medium leading-relaxed">
          Have a question about our local AI tools or need agency pricing? Our engineering team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        {/* 🌟 Left Column: Glass Contact Form (Takes up more space: col-span-3) */}
        <div className="lg:col-span-3 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">Send us a message</h2>
          
          {submitted ? (
            <div className="p-6 bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-700 rounded-2xl font-bold flex items-center animate-in zoom-in duration-500">
              <CheckCircle2 className="mr-3" size={24} />
              Message sent successfully! Our team will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/80 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-slate-800 placeholder-slate-400 shadow-sm backdrop-blur-sm font-medium" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/80 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-slate-800 placeholder-slate-400 shadow-sm backdrop-blur-sm font-medium" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                  className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/80 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-slate-800 shadow-sm backdrop-blur-sm font-medium appearance-none"
                >
                  <option value="" className="text-slate-500">Select a topic...</option>
                  <option value="support" className="text-slate-800">Technical Support / Bug Report</option>
                  <option value="billing" className="text-slate-800">Billing & Subscriptions</option>
                  <option value="agency" className="text-slate-800">Agency / Custom Partnership</option>
                  <option value="other" className="text-slate-800">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea required rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/80 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-slate-800 placeholder-slate-400 shadow-sm backdrop-blur-sm font-medium resize-none" 
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-rose-500 hover:opacity-90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center">
                Send Message <Send size={18} className="ml-2" />
              </button>
            </form>
          )}
        </div>

        {/* 🌟 Right Column: Info & FAQs (col-span-2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Support Hours Glass Card */}
          <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Support Hours</h3>
            <p className="text-slate-600 font-medium mb-6">Our technical team is available Monday through Friday to assist you.</p>
            
            <div className="space-y-4">
              <div className="flex items-center text-slate-700 font-bold bg-white/50 rounded-xl p-4 border border-white/80 shadow-sm">
                <Clock className="text-purple-600 mr-3" size={24} /> 9:00 AM - 6:00 PM (IST)
              </div>
              <div className="flex items-center text-slate-700 font-bold bg-white/50 rounded-xl p-4 border border-white/80 shadow-sm">
                <Mail className="text-rose-500 mr-3" size={24} /> support@vaniconnect.in
              </div>
              
            </div>
          </div>

          {/* FAQ Glass Card */}
          <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
            <div className="flex items-center mb-6">
              <MessageCircle className="text-purple-600 mr-3" size={28} />
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Quick FAQs</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Are my uploaded files secure?</h4>
                <p className="text-slate-600 font-medium mt-2 leading-relaxed">Yes. All media is processed locally on your machine. We do not upload your files to our servers.</p>
              </div>
              <div className="h-px bg-white/60 w-full"></div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">How do I cancel my Pro subscription?</h4>
                <p className="text-slate-600 font-medium mt-2 leading-relaxed">You can cancel anytime directly from your billing dashboard. You will retain Pro access until the end of your cycle.</p>
              </div>
              <div className="h-px bg-white/60 w-full"></div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Do you offer custom API access?</h4>
                <p className="text-slate-600 font-medium mt-2 leading-relaxed">Yes! If you are an agency, select "Agency / Custom Partnership" in the form and we will set up a custom plan.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}