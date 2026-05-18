import SEO from '../components/SEO';
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Video as VideoIcon, Settings, AlertCircle, CheckCircle2, Download, X, Zap, Lock, Crown, Sparkles } from 'lucide-react';
import { auth } from '../firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function VideoEnhancer() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultVideo, setResultVideo] = useState(null);
  
  // 🌟 ENGINE PARAMETERS STATE
  const [resolution, setResolution] = useState("1080p FHD"); 
  const [fps60, setFps60] = useState(false); 
  const [denoise, setDenoise] = useState(true); 

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Paywall States
  const [isProUser, setIsProUser] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const db = getFirestore();

  // 🚀 THE BULLETPROOF RENDER GATEWAY
  const RENDER_API = "https://yt-microservice-o8lu.onrender.com";

  // --- 🌟 VIP LIST CHECKER ---
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

  // --- FILE HANDLING ---
  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setResultVideo(null);
      setErrorMsg('');
    }
  };

  // --- 🌟 RAZORPAY CHECKOUT LOGIC ---
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

      const orderResponse = await fetch(`${RENDER_API}/api/create-order`, {
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
        name: "Clipeto Studio",
        description: "Studio Pro Upgrade",
        order_id: orderData.order_id,
        handler: async function (response) {
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
            alert("🎉 Payment Successful! Welcome to Clipeto Pro!");
            window.location.reload(); 
          }
        },
        prefill: {
          name: currentUser.displayName || "User",
          email: currentUser.email || "",
        },
        theme: { color: "#f97316" } // Orange-500
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function () {
         setIsProcessingPayment(false);
      });
      
    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please check your connection.");
      setIsProcessingPayment(false);
    }
  };

  // --- 🛑 PRO ACTION BOUNCER ---
  // If a free user clicks a Pro button, it triggers Razorpay instantly!
  const handleProAction = (action) => {
    if (!isProUser) {
      handleCheckout(); 
      return;
    }
    action();
  };

  // --- 🚀 THE MASTER AI REQUEST ---
  const handleProcessVideo = async () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultVideo(null);
    abortControllerRef.current = new AbortController();

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Auth Error: Please Sign In to use the AI tools!");

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("resolution", resolution);
      formData.append("fps_60", fps60 ? "true" : "false");
      formData.append("denoise", denoise ? "true" : "false");
      formData.append("user_id", currentUser.uid);

      const response = await fetch(`${import.meta.env.VITE_HF_API}/api/enhance-video`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal 
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.detail || data.error || "Failed to process video");

      setResultVideo(`${import.meta.env.VITE_HF_API}/downloads/${data.file_name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg("Process canceled by user.");
      } else if (error.message && error.message.includes("PaywallTrigger")) {
        handleCheckout(); // Pops open Razorpay directly!
      } else {
        console.error("Bridge Error:", error);
        setErrorMsg(error.message || "Could not connect to the Python Engine.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort(); 
  };

  const clearSelection = () => {
    if (isProcessing) return;
    setVideoFile(null);
    setVideoUrl(null);
    setResultVideo(null);
    setErrorMsg('');
  };

  const handleForceDownload = async () => {
    if (!resultVideo) return;
    try {
      const response = await fetch(resultVideo);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = "Clipeto_Enhanced_Video.mp4"; 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Could not download the file. Try right-clicking the video and saving!");
    }
  };

  // --- REUSABLE TOGGLE UI ---
  const ToggleSwitch = ({ label, enabled, onClick, isLocked }) => (
    <div 
      onClick={onClick}
      className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all mt-3
        ${isLocked 
          ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-400 shadow-sm cursor-pointer hover:shadow-md' 
          : 'bg-white/60 border-slate-100 cursor-pointer hover:border-orange-200' 
        }
        ${isProcessingPayment && isLocked ? 'opacity-50 cursor-wait' : ''}
      `}
    >
      {isLocked && (
        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-20 flex items-center gap-1">
          PRO <Lock size={10} />
        </div>
      )}
      <span className={`font-bold text-sm block ${isLocked ? 'text-amber-900' : 'text-slate-700'}`}>
        {isProcessingPayment && isLocked ? "Loading Gateway..." : label}
      </span>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-orange-500' : 'bg-slate-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );

  return (
    <>
      <SEO 
        title="AI Video Enhancer | Upscale to 4K 60FPS"
        description="Mathematically enhance video frames. Auto-correct poor lighting, boost contrast, stabilize, and sharpen blurry footage."
        keywords="video enhancer, upscale video, 4k 60fps ai, fix blurry video, video quality enhancer"
      />
      <div className="w-full h-full animate-in fade-in duration-700 pt-8 pb-12 px-6 md:px-10 max-w-7xl mx-auto overflow-y-auto no-scrollbar relative">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/80 border border-white flex items-center justify-center shadow-sm">
              <Zap size={24} className="text-orange-500" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Enhancer</span></h1>
              <p className="text-slate-500 font-medium mt-1">Inject frames for buttery 60fps, reduce grain, and upscale old footage.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Upload Area */}
          <div className="flex-1 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/mp4,video/quicktime" className="hidden" />

            {!videoUrl ? (
              <div className="flex flex-col items-center justify-center py-12 w-full h-full text-center">
                <div className="w-24 h-24 bg-white shadow-xl shadow-orange-500/10 rounded-full flex items-center justify-center mb-8">
                  <UploadCloud size={40} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3 text-center">Drag & Drop Footage</h3>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-sm">Support for MP4 and MOV. Processing time varies by length.</p>
                <button onClick={handleBrowseClick} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg mx-auto">
                  <VideoIcon size={18} /> Browse Video
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center relative">
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/50 w-full bg-black">
                  <video src={videoUrl} controls className="max-h-[500px] w-full block object-contain" />

                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                      <div className="w-14 h-14 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin mb-4 shadow-lg"></div>
                      <p className="text-white font-extrabold text-sm tracking-widest uppercase animate-pulse drop-shadow-md">
                        Rendering Frames...
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button onClick={handleBrowseClick} disabled={isProcessing} className={`font-bold transition-colors text-sm ${isProcessing ? 'text-slate-300' : 'text-slate-500 hover:text-orange-600'}`}>Change Video</button>
                  <button onClick={clearSelection} disabled={isProcessing} className={`font-bold transition-colors text-sm ${isProcessing ? 'text-slate-300' : 'text-slate-500 hover:text-rose-600'}`}>Clear</button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Engine Parameters */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
              <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center">
                <Settings size={20} className="mr-2 text-orange-600" /> Engine Parameters
              </h3>
              
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Target Resolution</label>
                
                <div className="flex flex-col sm:flex-row w-full gap-3 pt-3">
                  {[
                    { id: "1080p FHD", label: "1080p FHD", sub: "Standard" },
                    { id: "4K UHD", label: "4K UHD", sub: "Max Quality" }
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      type="button"
                      onClick={() => handleProAction(() => setResolution(opt.id))}
                      className={`relative flex-1 py-3 px-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all w-full
                        ${resolution === opt.id 
                          ? 'border-orange-400 bg-white text-slate-800 shadow-md scale-[1.02] z-10'
                          : !isProUser 
                            ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300 text-amber-900 shadow-sm hover:shadow-md hover:border-amber-500' 
                            : 'border-white/40 bg-white/60 text-slate-500 hover:bg-white hover:border-slate-300 shadow-sm'
                        }
                      `}
                    >
                      {!isProUser && (
                        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1">
                          PRO <Lock size={8} />
                        </div>
                      )}
                      <span className="font-bold text-sm flex items-center gap-1">
                        {opt.label} 
                      </span>
                      <span className={`text-[10px] mt-0.5 font-bold ${!isProUser && resolution !== opt.id ? 'text-amber-700/70' : 'opacity-70'}`}>
                        {opt.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 flex flex-col pt-2">
                 <ToggleSwitch 
                   label="60 FPS Interpolation" 
                   enabled={fps60} 
                   onClick={() => handleProAction(() => setFps60(!fps60))} 
                   isLocked={!isProUser} 
                 />
                 <ToggleSwitch 
                   label="Denoise / De-grain" 
                   enabled={denoise} 
                   onClick={() => handleProAction(() => setDenoise(!denoise))} 
                   isLocked={!isProUser} 
                 />
              </div>

              {isProcessing ? (
                <div className="flex flex-col gap-3">
                  <button disabled className="w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center transition-all bg-orange-50 text-orange-600 border border-orange-200 cursor-wait shadow-inner">
                    <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing...
                  </button>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-rose-500 text-sm font-bold transition-colors flex items-center justify-center py-2">
                    <X size={16} strokeWidth={3} className="mr-1" /> Cancel
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleProAction(handleProcessVideo)} disabled={!videoFile}
                  className={`w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center transition-all ${!videoFile ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : !isProUser ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:-translate-y-1 hover:shadow-xl border border-amber-300' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:-translate-y-1 hover:shadow-xl'}`}
                >
                  <span className="flex items-center"><Zap size={20} className="mr-2" /> Process Footage {!isProUser && <Lock size={16} className="ml-2 text-amber-200" />}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 font-bold flex items-center max-w-2xl mx-auto">
            <AlertCircle className="mr-2 flex-shrink-0" /> {errorMsg}
          </div>
        )}

        {resultVideo && (
          <div className="mt-10 pt-8 border-t border-white/60 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center justify-center"><CheckCircle2 className="text-emerald-500 mr-2" /> Video Processed Successfully!</h3>
            <button onClick={handleForceDownload} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors inline-flex items-center">
              <Download size={20} className="mr-2" /> Download Enhanced Video
            </button>
          </div>
        )}

      </div>
    </>
  );
}