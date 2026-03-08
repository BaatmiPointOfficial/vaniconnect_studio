import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using VaniConnect AI Studio, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. User Responsibilities & Content</h2>
          <p>You are solely responsible for the media you upload. You agree <strong>not</strong> to use our services to process illegal, highly explicit, or copyrighted material that you do not have the rights to use. VaniConnect AI reserves the right to terminate accounts that violate these terms.</p>

          {/* 🚨 NEWLY ADDED SECTION FOR TOOL RULES 🚨 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Acceptable Use of Specific Tools</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>YouTube Downloader:</strong> Our video downloading functionality is provided exclusively for downloading videos that possess a <strong>Creative Commons license</strong>. You are strictly prohibited from downloading, distributing, or modifying copyrighted content without explicit permission from the original owner.</li>
            <li><strong>Watermark & Logo Remover:</strong> This tool is designed strictly for altering your own original media. You may use it to remove your own logos or watermarks in order to apply new ones. <strong>You are explicitly forbidden from using this tool to remove, alter, or obscure watermarks, logos, or copyright notices belonging to any third party.</strong></li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Service Availability</h2>
          <p>While we strive for 99.9% uptime, VaniConnect AI is provided "as is". We are not liable for any temporary interruptions in service or loss of data (as all data is auto-deleted within 24 hours anyway).</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Payments and Refunds</h2>
          <p>Paid subscriptions are billed in advance. If you are not satisfied with our Pro services, you may request a refund within 7 days of your initial purchase, subject to our review.</p>
        </div>
      </div>
    </div>
  );
}