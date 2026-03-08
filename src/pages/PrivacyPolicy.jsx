import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Data Security & Auto-Deletion</h2>
          <p>At VaniConnect AI, your privacy is our highest priority. All media files uploaded to our servers are processed securely using 256-bit encryption. <strong>All uploaded files and processed results are automatically and permanently deleted from our servers within 24 hours.</strong></p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. AI Training</h2>
          <p>We absolutely <strong>do not</strong> use your private photos, videos, or audio files to train our artificial intelligence models. Your data belongs to you.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Information We Collect</h2>
          <p>We only collect the minimum information necessary to provide our services, such as your email address for account creation and payment processing details via our secure third-party payment gateways (e.g., Razorpay/Stripe).</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
          <p>We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
        </div>
      </div>
    </div>
  );
}
