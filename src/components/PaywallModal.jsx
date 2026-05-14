import React, { useState } from 'react';
import { X, Zap, Crown, CheckCircle2 } from 'lucide-react';
import { auth } from "../firebase";

// 🚀 THE BULLETPROOF RENDER GATEWAY
const RENDER_API = "https://yt-microservice-o8lu.onrender.com";

export default function PaywallModal({ onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    const currentUser = auth.currentUser; 
    
    if (!currentUser) {
      alert("Please sign in to upgrade!");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // 1. Create the Order via Python Backend
      const orderResponse = await fetch(`${RENDER_API}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.uid })
      });
      const orderData = await orderResponse.json();

      if (!orderData.order_id) throw new Error("Server failed to create order.");

      // 2. Open Razorpay Window
      const options = {
        key: "rzp_test_SfizNz9HbWwVaK", // Test Key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VaniConnect Studio",
        description: "Studio Pro Upgrade",
        order_id: orderData.order_id,
        handler: async function (response) {
          // 3. Verify and Update Firebase via Python Backend
          const verifyResponse = await fetch(`${RENDER_API}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: currentUser.uid
            })
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.status === "success") {
            alert("🎉 Payment Successful! Welcome to VaniConnect Pro!");
            window.location.reload(); 
          }
        },
        prefill: {
          name: currentUser.displayName || "User",
          email: currentUser.email || "",
        },
        theme: { color: "#9333EA" } 
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong initializing the checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      
      {/* Dark Blur Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] transform transition-all overflow-hidden">
        
        <div className="overflow-y-auto no-scrollbar flex-1">
          
          {/* Header/Banner Area */}
          <div className="bg-gradient-to-br from-purple-600 to-rose-500 p-6 md:p-8 text-center relative flex-shrink-0">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-inner">
              <Crown size={28} className="text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-1 tracking-tight">Unlock Pro Power</h3>
            <p className="text-white/90 font-medium text-xs md:text-sm">Take your content creation to the next level!</p>
          </div>

          {/* Body Content */}
          <div className="p-5 md:p-8 flex-shrink-0 bg-white/40">
            <p className="text-slate-500 font-medium mb-5 md:mb-6 text-center text-xs md:text-sm leading-relaxed">
              Upgrade to Pro to unlock unlimited power, batch processing, and priority speed across all VaniConnect Studio tools.
            </p>

            <ul className="space-y-3 mb-6 md:mb-8">
              {[
                'Unlimited 4K Video Downloads', 
                'Batch Watermark & BG Removal', 
                'Priority Local GPU Processing', 
                'No Daily Restrictions'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={18} fill="currentColor" /> 
              {isProcessing ? "Loading Gateway..." : "Upgrade to Pro — ₹299/mo"}
            </button>
            
            <button 
              onClick={onClose}
              className="w-full mt-3 md:mt-4 text-slate-400 font-bold text-xs md:text-sm hover:text-slate-600 transition-colors pb-2"
            >
              Maybe later, I'll stick to free
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}