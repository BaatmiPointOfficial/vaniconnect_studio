import SEO from '../components/SEO';
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Wand2, AlertCircle, CheckCircle2, Download, SlidersHorizontal, Lock, Crown, Zap, X } from 'lucide-react';
import { auth } from '../firebase.js'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';

<SEO

  title="AI Photo Enhancer & Upscaler | Restore Blurry Images"

  description="Rescue blurry images instantly. Use local neural networks to upscale resolution, restore lost details, and sharpen faces."

  keywords="photo enhancer, upscale image, fix blurry photo, ai image resolution, 4k photo upscaler"

/>





export default function PhotoEnhancer() {
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultUrl, setResultUrl] = useState(null);
  
  const [upscaleFactor, setUpscaleFactor] = useState(2); 
  const [faceRestoration, setFaceRestoration] = useState(false); 
  const [colorCorrection, setColorCorrection] = useState(true);

  const [sliderPos, setSliderPos] = useState(50);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [isProUser, setIsProUser] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // 🌟 NEW STATE FOR RAZORPAY LOADING
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const db = getFirestore();

  useEffect(() => {
    const checkProStatus = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsProUser(userSnap.data().isProUser || false);
        }
      }
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) checkProStatus();
    });
    return () => unsubscribe();
  }, [db]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setErrorMsg('');
      setSliderPos(50); 
    }
  };

  const handleFactorSelect = (factor) => {
    if ((factor === 4 || factor === 8) && !isProUser) {
      setShowUpgradeModal(true);
      return;
    }
    setUpscaleFactor(factor);
  };

  const handleFaceToggle = () => {
    if (!isProUser) {
      setShowUpgradeModal(true);
      return;
    }
    setFaceRestoration(!faceRestoration);
  };

  // 🌟 RAZORPAY CHECKOUT LOGIC ADDED HERE
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

    setIsProcessingPayment(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessingPayment(false);
        return;
      }

      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.uid })
      });
      const orderData = await orderResponse.json();

      if (!orderData.order_id) throw new Error("Server failed to create order.");

      const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VaniConnect Studio",
        description: "Studio Pro Upgrade",
        order_id: orderData.order_id,
        handler: async function (response) {
          const verifyResponse = await fetch(`${import.meta.env.VITE_HF_API}/api/verify-payment`, {
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
        theme: { color: "#f59e0b" } // Amber-500 to match your tool's theme
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong initializing the checkout.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleEnhance = async () => {
    if (!imageFile) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultUrl(null);
    abortControllerRef.current = new AbortController();

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Auth Error: Please Sign In to use the AI tools!");

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("factor", upscaleFactor);
      formData.append("face_restoration", faceRestoration ? "true" : "false");
      formData.append("color_correction", colorCorrection ? "true" : "false");
      formData.append("user_id", currentUser.uid);

      const response = await fetch(`${import.meta.env.VITE_HF_API}/api/enhance-photo`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal 
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.detail || data.error || "Failed to enhance photo");
      }

      setResultUrl(`${import.meta.env.VITE_HF_API}/downloads/${data.file_name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg("Process canceled.");
      } else if (error.message.includes("PaywallTrigger")) {
        setShowUpgradeModal(true); 
      } else {
        console.error("Bridge Error:", error);
        setErrorMsg(error.message || "Could not connect to Python Engine.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForceDownload = async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = "VaniConnect_Enhanced.jpg"; 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Could not download the file automatically.");
    }
  };

  return (
    <>
      <SEO 
        title="AI Photo Enhancer & Upscaler | Restore Blurry Images"
        description="Rescue blurry images instantly. Use local neural networks to upscale resolution, restore lost details, and sharpen faces."
        keywords="photo enhancer, upscale image, fix blurry photo, ai image resolution, 4k photo upscaler"
      />
      <div className="pt-10 pb-24 px-6 md:px-12 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto no-scrollbar relative">
        
        {/* 🌟 THE BULLETPROOF & MOBILE-OPTIMIZED PREMIUM MODAL */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col">

              <button 
                type="button"
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  setShowUpgradeModal(false); 
                }} 
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[200] cursor-pointer text-white/80 hover:text-white transition-all bg-white/20 hover:bg-white/40 p-2 rounded-full pointer-events-auto"
              >
                <X size={20} />
              </button>

              {/* 🌟 UPDATED: Amber/Orange theme for the Photo Enhancer */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 pb-8 sm:p-8 sm:pb-10 flex flex-col items-center relative text-center pt-10 sm:pt-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-inner border border-white/30">
                  <Crown size={28} className="sm:w-8 sm:h-8" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5 sm:mb-2 tracking-tight">Unlock Pro Power</h2>
                
                {/* 🌟 UPDATED: Custom Subtitle */}
                <p className="text-white/90 font-medium text-xs sm:text-sm">
                  8x AI Upscaling is a Premium Tool!
                </p>
              </div>

              <div className="p-6 sm:p-8 pt-5 sm:pt-6 bg-white">
                
                {/* 🌟 UPDATED: Custom Description */}
                <p className="text-slate-600 text-center font-medium mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Upgrade to Pro to unlock 4x and 8x maximum resolution scaling, unsharp mask face restoration, and priority processing.
                </p>

                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Unlimited AI Usage",
                    "Max Quality 4K/8K Upscaling",
                    "Priority Local GPU Processing",
                    "No Daily Restrictions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center text-xs sm:text-sm font-bold text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-500 mr-2.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* 🌟 THE WIRED-UP RAZORPAY BUTTON WITH AMBER THEME */}
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-black text-base sm:text-lg shadow-lg shadow-amber-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} className="sm:w-5 sm:h-5 fill-current" /> 
                  {isProcessingPayment ? "Loading Gateway..." : "Upgrade to Pro — ₹299/mo"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowUpgradeModal(false)} 
                  className="w-full text-center mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Maybe later, I'll use 2x scale
                </button>

                <div className="mt-5 sm:mt-6 text-center border-t border-slate-100 pt-3 sm:pt-4">
                  <a href="/pricing" className="text-amber-600 hover:text-amber-700 text-[11px] sm:text-xs font-extrabold transition-colors">
                    View all 15+ Pro Features & Limits →
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-flex items-center space-x-2 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm mb-4">
            <Wand2 size={16} className="text-amber-600" />
            <span className="text-sm font-bold text-slate-600 tracking-wide">Studio Tool</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Enhancer</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl text-lg">
            Upscale resolution, correct colors, and sharpen details instantly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png,image/jpeg,image/webp" className="hidden" />

            {!originalUrl ? (
              <div 
                className={`flex-1 min-h-[400px] bg-white/30 backdrop-blur-2xl border-2 border-dashed ${dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-white/80'} rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center p-10 transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDrop={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-24 h-24 bg-white shadow-xl shadow-amber-200/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud size={40} className="text-amber-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Upload Blurry Photo</h3>
                <p className="text-slate-500 font-medium text-center">PNG, JPG, WEBP</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center relative bg-white/40 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
                
                <div className="relative rounded-xl overflow-hidden shadow-sm border-2 border-slate-200/50 w-full bg-slate-900 flex justify-center items-center min-h-[400px] select-none">
                  
                  <img src={originalUrl} className="absolute max-h-[500px] w-auto object-contain pointer-events-none" alt="Original" />

                  {resultUrl && (
                    <img 
                      src={resultUrl} 
                      className="absolute max-h-[500px] w-auto object-contain pointer-events-none" 
                      style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                      alt="Enhanced" 
                    />
                  )}

                  {resultUrl && (
                    <>
                      <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ left: `calc(${sliderPos}% - 2px)` }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-amber-500 font-black">
                          ⟷
                        </div>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={sliderPos} 
                        onChange={(e) => setSliderPos(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                      />
                      
                      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md pointer-events-none">AFTER</div>
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md pointer-events-none">BEFORE</div>
                    </>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                      <div className="w-14 h-14 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-white font-extrabold text-sm tracking-widest uppercase animate-pulse">Running AI Matrices...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex items-center gap-4">
                  <button onClick={() => fileInputRef.current.click()} disabled={isProcessing} className="font-bold text-sm text-slate-500 hover:text-amber-600 transition-colors">Change Photo</button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8">
              <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-amber-600" /> Enhance Settings
              </h3>
              
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Upscale Resolution</label>
                <div className="flex w-full gap-3 pt-3">
                  {[
                    { factor: 2, isPro: false }, 
                    { factor: 4, isPro: true }, 
                    { factor: 8, isPro: true }
                  ].map((opt) => (
                    <button 
                      key={opt.factor} 
                      type="button"
                      onClick={() => handleFactorSelect(opt.factor)}
                      className={`relative flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-1
                        ${upscaleFactor === opt.factor 
                          ? 'border-amber-400 bg-white text-slate-800 shadow-md scale-[1.02] z-10' 
                          : opt.isPro && !isProUser
                            ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300 text-amber-900 shadow-sm hover:shadow-md hover:border-amber-500' 
                            : 'border-white/40 bg-white/60 text-slate-500 hover:bg-white hover:border-slate-300 shadow-sm'
                        }
                      `}
                    >
                      {opt.isPro && !isProUser && (
                        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1">
                          PRO <Lock size={8} />
                        </div>
                      )}
                      {opt.factor}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5 mb-8 pt-2">
                <div 
                  onClick={handleFaceToggle}
                  className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all 
                    ${!isProUser 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-400 shadow-sm cursor-pointer hover:shadow-md'
                      : 'bg-white/60 border-slate-100 cursor-pointer hover:border-amber-200' 
                    }
                  `}
                >
                  {!isProUser && (
                    <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-20 flex items-center gap-1">
                      PRO <Lock size={10} />
                    </div>
                  )}
                  <div>
                    <span className={`font-bold text-sm block ${!isProUser ? 'text-amber-900' : 'text-slate-700'}`}>
                      Face Sharpener 
                    </span>
                    <span className={`text-xs ${!isProUser ? 'text-amber-700/80' : 'text-slate-500'}`}>Unsharp masking filter</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${faceRestoration ? 'bg-amber-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${faceRestoration ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>

                <label className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border-2 border-transparent hover:border-amber-200 cursor-pointer transition-all shadow-sm">
                  <div>
                    <span className="font-bold text-slate-700 block text-sm">Auto Color</span>
                    <span className="text-xs text-slate-500">CLAHE color balance</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${colorCorrection ? 'bg-amber-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${colorCorrection ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" checked={colorCorrection} onChange={() => setColorCorrection(!colorCorrection)} className="hidden" />
                </label>
              </div>

              <button 
                onClick={handleEnhance} disabled={!imageFile || isProcessing}
                className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${!imageFile ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30 hover:-translate-y-1'}`}
              >
                <Wand2 size={20} /> Enhance Photo
              </button>
            </div>
          </div>
        </div>

        {errorMsg && <div className="mt-8 p-4 bg-rose-50 text-rose-600 font-bold rounded-2xl flex items-center max-w-2xl mx-auto"><AlertCircle className="mr-2" /> {errorMsg}</div>}

        {resultUrl && (
          <div className="mt-10 pt-8 border-t border-slate-200 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full text-center">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center justify-center"><CheckCircle2 className="text-emerald-500 mr-2" /> Enhancement Complete!</h3>
            <button onClick={handleForceDownload} className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-slate-900/30 hover:bg-slate-800 transition-all inline-flex items-center">
              <Download size={20} className="mr-2" /> Download Enhanced Photo
            </button>
            <p className="text-xs text-slate-400 mt-4">Tip: Drag the slider above to see the exact changes!</p>
          </div>
        )}
      </div>
    </>
  );
}