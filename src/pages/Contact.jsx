import React, { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How can we help you?</h1>
          <p className="text-lg text-gray-500 font-medium">Have a question about our AI tools or need agency pricing? We are here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
            {submitted ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl font-medium">
                ✅ Message sent successfully! Our team will get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                    <option value="">Select a topic...</option>
                    <option value="support">Technical Support / Bug Report</option>
                    <option value="billing">Billing & Subscriptions</option>
                    <option value="agency">Agency / Custom Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="How can we help you today?"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Info & FAQs */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Support Hours</h3>
              <p className="text-gray-600 mb-2">Our technical team is available Monday through Friday to assist you.</p>
              <div className="flex items-center text-blue-600 font-semibold mt-4">
                <span className="text-2xl mr-2">🕒</span> 9:00 AM - 6:00 PM (IST)
              </div>
              <div className="flex items-center text-blue-600 font-semibold mt-2">
                <span className="text-2xl mr-2">✉️</span> support@yourdomain.com
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900">Are my uploaded files secure?</h4>
                  <p className="text-sm text-gray-600 mt-1">Yes. All media is processed with enterprise-grade encryption and automatically deleted from our servers after 24 hours.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">How do I cancel my Pro subscription?</h4>
                  <p className="text-sm text-gray-600 mt-1">You can cancel anytime directly from your billing dashboard. You will retain Pro access until the end of your billing cycle.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Do you offer custom API access for agencies?</h4>
                  <p className="text-sm text-gray-600 mt-1">Yes! If you are processing thousands of videos, select "Agency / Custom Partnership" in the form above and we will set up a custom plan.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}