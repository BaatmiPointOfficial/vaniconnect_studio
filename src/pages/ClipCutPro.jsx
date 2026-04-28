import SEO from '../components/SEO';
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Scissors, SlidersHorizontal, Video, AlertCircle, CheckCircle2, Download, X, Layers, Archive, Lock, Crown, Zap } from 'lucide-react';
import { auth } from '../firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

<SEO

  title="AI Video Clipper & Trimmer | Clip Cut Pro"

  description="Precision video trimming and batch splitting. Effortlessly chop long podcasts, interviews, or speeches into bite-sized viral shorts."

  keywords="video clipper, ai shorts generator, podcast to shorts, video trimmer free, split video online"

/>

export default function ClipCutPro() {
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultMedia, setResultMedia] = useState(null);
  
  const [isBatchMode, setIsBatchMode] = useState(false);

  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("00:00:10");
  const [overlayText, setOverlayText] = useState("VaniConnect AI");

  const [splitDuration, setSplitDuration] = useState(60);
  const [batchStrategy, setBatchStrategy] = useState("seconds"); 
  const [totalParts, setTotalParts] = useState(5); 

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mediaRef = useRef(null); 

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

  const handleBrowseClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setResultMedia(null);
      setErrorMsg('');
    }
  };

  const handleModeToggle = (mode) => {
    if (mode === 'batch' && !isProUser) {
      setShowUpgradeModal(true); 
      return;
    }
    setIsBatchMode(mode === 'batch');
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
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment`, {
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
        theme: { color: "#6366f1" } // Indigo to match your tool's theme
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

  const handleExportSingleClip = async () => {
    if (startTime >= endTime) {
      setErrorMsg("Start Time must be before End Time!");
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    setResultMedia(null);
    abortControllerRef.current = new AbortController();

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Auth Error: Please Sign In to use the AI tools!");

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("start_time", startTime); 
      formData.append("end_time", endTime);    
      formData.append("text", overlayText);
      formData.append("user_id", currentUser.uid);

      
      const response = await fetch('https://yt-microservice-o8lu.onrender.com/api/batch-split', {
   
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal 
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || "Failed to process video");
      }

      setResultMedia(`${import.meta.env.VITE_HF_API}/downloads/${data.file_name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg("Process canceled by user.");
      } else if (error.message.includes("PaywallTrigger")) {
        setShowUpgradeModal(true); 
      } else {
        setErrorMsg(error.message || "Could not connect to the Python Engine.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchSplit = async () => {
    if (!videoFile || !mediaRef.current) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultMedia(null);
    abortControllerRef.current = new AbortController();

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Auth Error: Please Sign In to use the AI tools!");

      let finalDurationSec = splitDuration;
      
      if (batchStrategy === "parts") {
        const totalVideoDuration = mediaRef.current.duration; 
        if (totalVideoDuration) {
          finalDurationSec = Math.floor(totalVideoDuration / totalParts);
        } else {
          throw new Error("Could not read video duration. Try 'Split by Time' instead.");
        }
      }

      const formData = new FormData();
      formData.append("video_file", videoFile);
      formData.append("clip_duration", finalDurationSec.toString()); 
      formData.append("user_id", currentUser.uid);

      const response = await fetch("https://yt-microservice-o8lu.onrender.com/api/batch-split", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal 
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || "Failed to batch split video");
      }

      setResultMedia(`http://127.0.0.1:8000/downloads/${data.file_name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg("Process canceled by user.");
      } else if (error.message.includes("PaywallTrigger")) {
        setShowUpgradeModal(true);
      } else {
        setErrorMsg(error.message || "Could not connect to the Python Engine.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const executeProcess = () => {
    if (!videoFile) return;
    if (isBatchMode) handleBatchSplit();
    else handleExportSingleClip();
  };

  const handleForceDownload = async () => {
    if (!resultMedia) return;
    try {
      const response = await fetch(resultMedia);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const isZip = resultMedia.toLowerCase().endsWith('.zip');
      link.download = isZip ? "VaniConnect_Batch.zip" : "VaniConnect_ClipPro.mp4"; 
      
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Force download failed:", error);
      alert("Could not download the file automatically.");
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort(); 
  };

  const clearSelection = () => {
    if (isProcessing) return;
    setVideoFile(null);
    setVideoUrl(null);
    setResultMedia(null);
  };

  return (
    <>
      <SEO 
        title="AI Video Clipper & Trimmer | Clip Cut Pro"
        description="Precision video trimming and batch splitting. Effortlessly chop long podcasts, interviews, or speeches into bite-sized viral shorts."
        keywords="video clipper, ai shorts generator, podcast to shorts, video trimmer free, split video online"
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

              <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-6 pb-8 sm:p-8 sm:pb-10 flex flex-col items-center relative text-center pt-10 sm:pt-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-inner border border-white/30">
                  <Crown size={28} className="sm:w-8 sm:h-8" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5 sm:mb-2 tracking-tight">Unlock Pro Power</h2>
                <p className="text-white/90 font-medium text-xs sm:text-sm">
                  Batch Mode is a Premium Creator Tool!
                </p>
              </div>

              <div className="p-6 sm:p-8 pt-5 sm:pt-6 bg-white">
                <p className="text-slate-600 text-center font-medium mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Upgrade to Pro to instantly split 1-hour podcasts into 60 viral shorts and download them all in a single ZIP.
                </p>

                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Unlimited Batch Splitting",
                    "Auto-generate ZIP Packages",
                    "Priority Local GPU Processing",
                    "No Daily Restrictions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center text-xs sm:text-sm font-bold text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-500 mr-2.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* 🌟 THE WIRED-UP RAZORPAY BUTTON */}
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-black text-base sm:text-lg shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} className="sm:w-5 sm:h-5 fill-current" /> 
                  {isProcessingPayment ? "Loading Gateway..." : "Upgrade to Pro — ₹299/mo"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowUpgradeModal(false)} 
                  className="w-full text-center mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Maybe later, I'll trim one clip
                </button>

                <div className="mt-5 sm:mt-6 text-center border-t border-slate-100 pt-3 sm:pt-4">
                  <a href="/pricing" className="text-indigo-600 hover:text-indigo-700 text-[11px] sm:text-xs font-extrabold transition-colors">
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
            <Scissors size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-600 tracking-wide">Studio Tool</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Clip Cut <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Pro</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl text-lg">
            Precision trimming for your media, or Batch Split long videos for YouTube Shorts and Reels.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* LEFT COLUMN: Upload & Preview Area */}
          <div className="flex-1 flex flex-col">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/mp4,video/quicktime" className="hidden" />

            {!videoUrl ? (
              <div 
                className={`flex-1 min-h-[400px] w-full text-center bg-white/30 backdrop-blur-2xl border-2 border-dashed ${dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-white/80'} rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center p-10 transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDrop={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-24 h-24 bg-white shadow-xl shadow-indigo-200/50 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud size={40} className="text-indigo-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-2 w-full text-center">Drag & Drop Video</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto text-center">MP4, MOV up to 2GB.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center relative bg-white/40 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/50 w-full bg-black">
                  <video ref={mediaRef} src={videoUrl} controls className="max-h-[450px] w-full block object-contain" />

                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                      <div className="w-14 h-14 border-4 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4 shadow-lg"></div>
                      <p className="text-white font-extrabold text-sm tracking-widest uppercase animate-pulse drop-shadow-md">
                        {isBatchMode ? "Slicing & Zipping Batch..." : "Rendering Clip..."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button onClick={() => fileInputRef.current.click()} disabled={isProcessing} className={`font-bold transition-colors text-sm ${isProcessing ? 'text-slate-300' : 'text-slate-500 hover:text-indigo-600'}`}>Change Video</button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Settings Controls */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            
            {/* 🌟 PREMIUM UPGRADED MODE TOGGLE */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-2 rounded-2xl shadow-sm flex items-center gap-2">
              <button 
                type="button"
                onClick={() => handleModeToggle('single')}
                className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all flex justify-center items-center gap-2 
                  ${!isBatchMode 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                    : 'text-slate-500 hover:text-slate-800 bg-transparent border border-transparent'
                  }`}
              >
                <Scissors size={16} /> Single Clip
              </button>

              <button 
                type="button"
                onClick={() => handleModeToggle('batch')}
                className={`relative flex-1 py-3 font-bold text-sm rounded-xl transition-all flex justify-center items-center gap-1 
                  ${isBatchMode 
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md border border-transparent' 
                    : !isProUser 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-300 text-amber-900 shadow-sm hover:shadow-md hover:border-amber-400' 
                      : 'text-slate-500 hover:text-slate-800 border border-transparent bg-transparent'
                  }
                `}
              >
                {!isProUser && !isBatchMode && (
                  <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1">
                    PRO <Lock size={8} />
                  </div>
                )}
                <Layers size={16} /> Batch Mode 
              </button>
            </div>

            {/* DYNAMIC CONTROL PANEL */}
            <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8">
              <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-indigo-600" /> 
                {isBatchMode ? "Batch Settings" : "Timeline Controls"}
              </h3>
              
              {!isBatchMode ? (
                <>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Start Time</label>
                      <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="00:00:00" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl text-sm font-mono text-slate-700 outline-none focus:border-indigo-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">End Time</label>
                      <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="00:00:10" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl text-sm font-mono text-slate-700 outline-none focus:border-indigo-400" />
                    </div>
                  </div>

                  <div className="mb-8 border-t border-slate-200/60 pt-6">
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Overlay Brand Text</label>
                    <input type="text" value={overlayText} onChange={(e) => setOverlayText(e.target.value)} placeholder="Leave blank for no text" className="w-full bg-white/60 border border-white px-4 py-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400" />
                  </div>
                </>
              ) : (
                <div className="mb-8">
                  <div className="flex bg-white/60 p-1.5 rounded-xl border border-slate-200 mb-6">
                    <button 
                      onClick={() => setBatchStrategy("seconds")}
                      className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${batchStrategy === "seconds" ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Split by Time (Secs)
                    </button>
                    <button 
                      onClick={() => setBatchStrategy("parts")}
                      className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${batchStrategy === "parts" ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Split by Parts
                    </button>
                  </div>

                  {batchStrategy === "seconds" ? (
                    <div className="animate-in fade-in duration-300">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Target Clip Length</label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[15, 30, 60].map((duration) => (
                          <button 
                            key={duration}
                            onClick={() => setSplitDuration(duration)}
                            className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${splitDuration === duration ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-transparent bg-white/60 text-slate-500 hover:bg-white'}`}
                          >
                            {duration}s
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 p-1.5 rounded-xl border border-slate-200 focus-within:border-violet-400 transition-all">
                        <span className="text-sm font-extrabold text-slate-400 pl-3 uppercase tracking-wider">Custom</span>
                        <input 
                          type="number" min="5" value={splitDuration} 
                          onChange={(e) => setSplitDuration(parseInt(e.target.value) || "")}
                          className="w-full bg-transparent border-none py-2 px-2 text-lg font-black text-violet-600 text-center outline-none"
                        />
                        <span className="text-sm font-bold text-slate-400 pr-4">sec</span>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-300">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Number of Equal Clips</label>
                      <div className="flex items-center justify-between bg-white/80 p-2 rounded-xl border border-slate-200 shadow-sm mb-2">
                         <button 
                           onClick={() => setTotalParts(Math.max(2, totalParts - 1))}
                           className="w-12 h-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xl flex items-center justify-center transition-colors"
                         >-</button>
                         <div className="flex flex-col items-center">
                           <span className="text-3xl font-black text-violet-600">{totalParts}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parts</span>
                         </div>
                         <button 
                           onClick={() => setTotalParts(totalParts + 1)}
                           className="w-12 h-12 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-600 font-black text-xl flex items-center justify-center transition-colors"
                         >+</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isProcessing ? (
                <div className="flex flex-col gap-3">
                  <button disabled className="w-full bg-indigo-50 text-indigo-600 border border-indigo-200 py-4 rounded-2xl font-extrabold text-lg shadow-inner flex items-center justify-center gap-2 cursor-wait">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    {isBatchMode ? "Zipping..." : "Cutting..."}
                  </button>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-rose-500 text-sm font-bold transition-colors flex items-center justify-center py-2">
                    <X size={16} strokeWidth={3} className="mr-1" /> Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={executeProcess} disabled={!videoFile}
                  className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${!videoFile ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : isBatchMode ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-violet-500/30 hover:-translate-y-1' : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-indigo-500/30 hover:-translate-y-1'}`}
                >
                  {isBatchMode ? <Layers size={20} /> : <Scissors size={20} />} 
                  {isBatchMode ? "Start Batch Split" : "Export Clip"}
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

        {resultMedia && (
          <div className="mt-10 pt-8 border-t border-white/60 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-500 mr-2" /> 
              {resultMedia.endsWith('.zip') ? "Batch Complete!" : "Clip Cut Successfully!"}
            </h3>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white text-center flex flex-col items-center shadow-lg">
              
              {resultMedia.endsWith('.zip') ? (
                <div className="mb-6 p-8 bg-violet-50 border border-violet-100 rounded-2xl w-full flex flex-col items-center">
                  <Archive size={48} className="text-violet-500 mb-4" />
                  <h4 className="font-bold text-slate-800 text-lg">Your Batch Package is Ready</h4>
                  <p className="text-sm text-slate-500 mt-1">Contains your trimmed clips in .mp4 format.</p>
                </div>
              ) : (
                <div className="w-full rounded-2xl overflow-hidden shadow-md border-2 border-slate-200/50 mb-6 bg-black flex justify-center">
                  <video src={resultMedia} controls className="max-h-[500px] w-full" />
                </div>
              )}

              <button onClick={handleForceDownload} className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-slate-900/30 hover:bg-slate-800 transition-all inline-flex items-center">
                <Download size={20} className="mr-2" /> 
                {resultMedia.endsWith('.zip') ? "Download .ZIP Package" : "Download Snippet"}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}