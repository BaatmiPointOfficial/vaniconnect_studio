import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { CheckCircle2, Zap, Crown, Lock } from 'lucide-react';
import { auth } from '../firebase'; // Adjust path if needed
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function Pricing() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const checkProStatus = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().isProUser) {
          setIsProUser(true);
        }
      }
    };
    checkProStatus();
  }, []);

  const handleCheckout = async () => {
    const currentUser = auth.currentUser; 
    if (!currentUser) return alert("Please sign in to upgrade!");
    setIsProcessingPayment(true);

    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for script

      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.uid })
      });
      const orderData = await orderResponse.json();

      const options = {

        key: "rzp_test_SfizNz9HbWwVaK", // 🚨 PASTE YOUR REAL TEST KEY ID HERE!
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VaniConnect Studio",
        description: "Studio Pro Upgrade",
        order_id: orderData.order_id,
        handler: async function (response) {
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, user_id: currentUser.uid })
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.status === "success") {
            alert("🎉 Payment Successful! Welcome to VaniConnect Pro!");
            window.location.href = "/"; // Redirect to dashboard
          }
        },
        prefill: { name: currentUser.displayName, email: currentUser.email },
        theme: { color: "#8b5cf6" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert("Checkout failed to load.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const proFeatures = [
    "Unlimited 4K Video Downloads",
    "Batch Watermark & Background Removal",
    "AI Video Frame Interpolation (60 FPS)",
    "8x Photo Resolution Upscaling",
    "Priority Local GPU Processing Speed",
    "No Daily File Limits or Restrictions",
    "Commercial Use License",
    "24/7 Priority Support"
  ];

  return (
    <>
      <SEO title="Pricing | VaniConnect Studio Pro" />
      <div className="min-h-screen pt-20 pb-24 px-6 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">pricing.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              Stop paying for multiple expensive AI tools. Get the ultimate creator suite for one low monthly price.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-lg flex flex-col">
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Free Starter</h3>
              <p className="text-slate-500 mb-6 font-medium text-sm">Perfect to test the waters.</p>
              <div className="text-4xl font-black text-slate-900 mb-8">₹0 <span className="text-lg text-slate-400 font-medium">/ forever</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {["720p Media Downloads", "Basic Watermark Removal", "2x Photo Upscaling", "5 Files Per Day Limit"].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm font-bold text-slate-600">
                    <CheckCircle2 size={18} className="text-slate-400 mr-3 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              
              <button disabled className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                Current Plan
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-violet-600 to-indigo-700 rounded-[2.5rem] p-1 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-widest">
                <Crown size={14} /> Launch Special
              </div>
              
              <div className="bg-white rounded-[2.3rem] p-8 h-full flex flex-col relative overflow-hidden">
                <h3 className="text-2xl font-extrabold text-violet-900 mb-2">Studio Pro</h3>
                <p className="text-violet-600/80 mb-6 font-medium text-sm">Unlimited power for serious creators.</p>
                
                <div className="flex items-end gap-2 mb-8">
                  <div className="text-4xl font-black text-slate-900">₹299</div>
                  <div className="text-lg text-slate-400 font-medium line-through mb-1">₹299</div>
                  <div className="text-lg text-slate-500 font-medium mb-1">/ mo</div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {proFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm font-bold text-slate-800">
                      <CheckCircle2 size={18} className="text-violet-500 mr-3 shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>

                {isProUser ? (
                  <button disabled className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-black rounded-xl shadow-lg flex justify-center items-center gap-2">
                    <CheckCircle2 size={20} /> Pro Activated
                  </button>
                ) : (
                  <button 
                    onClick={handleCheckout} disabled={isProcessingPayment}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-lg rounded-xl shadow-xl shadow-indigo-500/30 hover:-translate-y-1 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    <Zap size={20} className="fill-current" />
                    {isProcessingPayment ? "Loading..." : "Upgrade to Pro"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}