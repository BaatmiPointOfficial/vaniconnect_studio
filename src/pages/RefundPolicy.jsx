import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="w-full min-h-full animate-in fade-in duration-700 pt-16 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
      
      {/* 🌟 Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Cancellation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">Refund Policy</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Last Updated: May 18, 2026
        </p>
      </div>

      {/* 🌟 Content Glass Card */}
      <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 space-y-10">
        
        <div className="text-slate-700 leading-relaxed space-y-4">
          <p className="text-lg font-medium mb-8">
            Thank you for subscribing to Clipeto. We strive to ensure our AI media processing tools meet your expectations. Please read this policy carefully before purchasing a Pro subscription.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">1. Digital Products & Usage</h2>
          <p>
            Clipeto provides digital software-as-a-service (SaaS) and AI processing credits. Due to the immediate access and computing resources required to process digital media, all sales are final. We do not offer refunds for any subscription payments or one-time purchases once the 7-day grace period has passed.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">2. 7-Day Refund Guarantee</h2>
          <p>
            If you are not completely satisfied with our Pro services, you may request a full refund within <strong>7 days</strong> of your initial purchase. To request a refund, please contact our support team. After 7 days, all purchases are final and non-refundable.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">3. Subscription Cancellations</h2>
          <p>
            You may cancel your Clipeto Pro subscription at any time through your account billing dashboard.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Effect of Cancellation:</strong> Your cancellation will take effect at the end of your current paid billing cycle.</li>
            <li><strong>Continued Access:</strong> You will continue to have full access to all Pro features until the end of your current billing period.</li>
            <li><strong>No Prorated Refunds:</strong> We do not provide prorated refunds or credits for partially used billing periods.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">4. Failed Processings or Technical Issues</h2>
          <p>
            If you experience a critical technical failure where the AI engine fails to process your media and consumes your quota, please contact our support team within 3 days of the incident. We will review the server logs and, at our sole discretion, may credit your account with the lost usage limits. We do not provide cash refunds for technical errors.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">5. Contact Us</h2>
          <p>
            If you have any questions regarding your billing, subscription, or to request a refund within your 7-day window, please contact us at:
          </p>
          <div className="bg-white/50 rounded-xl p-4 mt-4 border border-white/80 inline-block">
            <p className="font-bold text-purple-600">support@clipeto.com</p>
          </div>
        </div>

      </div>
    </div>
  );
}