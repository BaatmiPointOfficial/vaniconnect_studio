import SEO from '../components/SEO';
import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Image as ImageIcon, UploadCloud, Settings, AlertCircle, CheckCircle2, Download, X, Sparkles, MousePointer2, Lock, Crown, Zap } from 'lucide-react'; 
import { auth } from '../firebase.js'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

export default function PhotoWatermark() {
  // --- STATE VARIABLES ---
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultPhoto, setResultPhoto] = useState(null);
  
  const [mode, setMode] = useState("manual"); // "manual" or "auto"
  
  // Drawing state for manual mode
  const [selection, setSelection] = useState(null); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Refs
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const imageRef = useRef(null); 

  // Paywall State
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
        name: "VaniConnect Studio",
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
            alert("🎉 Payment Successful! Welcome to VaniConnect Pro!");
            window.location.reload(); 
          }
        },
        prefill: {
          name: currentUser.displayName || "User",
          email: currentUser.email || "",
        },
        theme: { color: "#9333ea" } 
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function () {
         setIsProcessingPayment(false);
      });
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong initializing the checkout.");
      setIsProcessingPayment(false);
    }
  };

  // --- FILE HANDLING ---
  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
      setResultPhoto(null);
      setErrorMsg('');
      setSelection(null); 
    }
  };

  // --- 🛑 THE UI BOUNCER ---
  const handleModeSelect = (selectedMode) => {
    if (selectedMode === 'auto' && !isProUser) {
      handleCheckout(); // Triggers direct Razorpay checkout!
      return;
    }
    setMode(selectedMode);
    setSelection(null);
  };

  // --- UNIFIED TOUCH & MOUSE DRAWING LOGIC ---
  const getCoordinates = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleStart = (e) => {
    if (isProcessing || mode === "auto" || resultPhoto) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = getCoordinates(e);
    const x = coords.clientX - rect.left;
    const y = coords.clientY - rect.top;
    setStartPos({ x, y });
    setSelection({ x, y, w: 0, h: 0 });
    setIsDrawing(true);
  };

  const handleMove = (e) => {
    if (!isDrawing || isProcessing || mode === "auto" || resultPhoto) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = getCoordinates(e);
    const currentX = coords.clientX - rect.left;
    const currentY = coords.clientY - rect.top;

    setSelection({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      w: Math.abs(currentX - startPos.x),
      h: Math.abs(currentY - startPos.y)
    });
  };

  const handleEnd = () => setIsDrawing(false);

  // --- 🚀 THE MASTER AI REQUEST ---
  const handleCleanPhoto = async () => {
    if (!photoFile) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultPhoto(null);
    abortControllerRef.current = new AbortController();

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Auth Error: Please Sign In to use the AI tools!");

      const formData = new FormData();
      formData.append("file", photoFile);
      formData.append("mode", mode);
      formData.append("style", "Standard AI Inpaint");
      formData.append("user_id", currentUser.uid);

      let finalX = 0, finalY = 0, finalW = 0, finalH = 0; 

      if (mode === "manual") {
        if (selection && selection.w > 5 && selection.h > 5 && imageRef.current) {
          const scaleX = imageRef.current.naturalWidth / imageRef.current.clientWidth;
          const scaleY = imageRef.current.naturalHeight / imageRef.current.clientHeight;

          let calcX = Math.round(selection.x * scaleX);
          let calcY = Math.round(selection.y * scaleY);
          let calcW = Math.round(selection.w * scaleX);
          let calcH = Math.round(selection.h * scaleY);

          finalX = Math.max(0, calcX);
          finalY = Math.max(0, calcY);
          finalW = Math.min(imageRef.current.naturalWidth - finalX, calcW);
          finalH = Math.min(imageRef.current.naturalHeight - finalY, calcH);
          
        } else {
          throw new Error("Please draw a box over the watermark first!");
        }
      }

      formData.append("x", finalX); 
      formData.append("y", finalY);
      formData.append("w", finalW);
      formData.append("h", finalH);

      const response = await fetch(`${import.meta.env.VITE_HF_API}/api/remove-photo-watermark`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal 
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.detail || data.error || "Failed to process photo");
      }

      setResultPhoto(`${import.meta.env.VITE_HF_API}/downloads/${data.file_name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg("Process canceled by user.");
      } else if (error.message && error.message.includes("PaywallTrigger")) {
        handleCheckout(); // Triggers direct Razorpay checkout!
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
    setPhotoFile(null);
    setPhotoUrl(null);
    setResultPhoto(null);
    setSelection(null);
    setErrorMsg('');
  };

  // --- DOWNLOAD OVERRIDE ---
  const handleForceDownload = async () => {
    if (!resultPhoto) return;
    try {
      const response = await fetch(resultPhoto);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = "VaniConnect_Cleaned.jpg"; 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Force download failed:", error);
      alert("Browser blocked the download. Please right-click the image and click 'Save Image As...'");
    }
  };
  
  return (
    <>
      <SEO 
        title="Auto Brand Watermark | Protect Your Content"
        description="Protect your original content. Auto-stamp your custom logo and text onto photos and videos with exact coordinate precision."
        keywords="add watermark to video, auto watermark, protect video copyright, bulk video watermark, logo stamper"
      />
      <div className="w-full h-full animate-in fade-in duration-700 pt-8 pb-12 px-6 md:px-10 max-w-7xl mx-auto overflow-y-auto no-scrollbar relative">

        {/* Main UI */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/80 border border-white flex items-center justify-center shadow-sm">
              <ImageIcon size={24} className="text-blue-500" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Photo Watermark <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Remover</span></h1>
              <p className="text-slate-500 font-medium mt-1">Upload any image and let our AI seamlessly erase text or logos.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Upload & Preview Area */}
          <div className="flex-1 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />

           {!photoUrl ? (
             <div className="flex flex-col items-center justify-center py-12 w-full h-full text-center">
               <div className="w-24 h-24 bg-white shadow-xl shadow-blue-500/10 rounded-full flex items-center justify-center mb-8">
                 <UploadCloud size={40} className="text-blue-500" />
               </div>
               
               <h3 className="text-2xl font-extrabold text-slate-800 mb-3 text-center">Drag & Drop Image</h3>
               
               <p className="text-slate-500 font-medium mb-8 text-center max-w-sm">
                 Support for JPG, PNG, and WebP. Up to 8K resolution.
               </p>
               
               <button onClick={handleBrowseClick} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg mx-auto">
                 <ImageIcon size={18} /> Browse Images
               </button>
             </div>
           ) : (
             <div className="w-full flex flex-col items-center relative">
               <div className="bg-slate-900/5 px-4 py-2 rounded-full mb-4 flex items-center gap-2 text-slate-600 font-bold text-sm">
                 {mode === "auto" ? (
                   <><Sparkles size={16} className="text-blue-500" /> AI Auto-Detect Active</>
                 ) : (
                   <><MousePointer2 size={16} className="text-blue-500" /> Draw a box over the watermark</>
                 )}
               </div>
               
               <div 
                 className={`touch-none relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/50 ${isProcessing || mode === "auto" ? 'cursor-default' : 'cursor-crosshair'}`}
                 onMouseDown={handleStart} 
                 onMouseMove={handleMove} 
                 onMouseUp={handleEnd} 
                 onMouseLeave={handleEnd}
                 onTouchStart={handleStart} 
                 onTouchMove={handleMove} 
                 onTouchEnd={handleEnd}
               >
                 <img ref={imageRef} src={photoUrl} alt="Preview" draggable="false" className="max-h-[500px] w-auto block object-contain select-none" />

                 {/* The Red Drawing Box */}
                 {mode === "manual" && selection && (
                   <div className="absolute border-2 border-rose-500 bg-rose-500/20 backdrop-blur-[1px]"
                     style={{ left: `${selection.x}px`, top: `${selection.y}px`, width: `${selection.w}px`, height: `${selection.h}px` }}
                   />
                 )}

                 {/* Processing Overlay */}
                 {isProcessing && (
                   <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                     <div className="w-14 h-14 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4 shadow-lg"></div>
                     <p className="text-white font-extrabold text-sm tracking-widest uppercase animate-pulse drop-shadow-md">
                       {mode === "auto" ? "Scanning for text..." : "Reconstructing Image..."}
                     </p>
                   </div>
                 )}
               </div>

               <div className="mt-6 flex items-center gap-4">
                 <button onClick={handleBrowseClick} disabled={isProcessing} className={`font-bold transition-colors text-sm ${isProcessing ? 'text-slate-300' : 'text-slate-500 hover:text-blue-600'}`}>Change Image</button>
                 <button onClick={clearSelection} disabled={isProcessing} className={`font-bold transition-colors text-sm ${isProcessing ? 'text-slate-300' : 'text-slate-500 hover:text-rose-600'}`}>Clear</button>
               </div>
             </div>
           )}
          </div>

          {/* RIGHT COLUMN: Engine Settings */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
              <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center">
                <Settings size={20} className="mr-2 text-blue-600" /> Retouch Settings
              </h3>
              
              <div className="mb-8">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Selection Tool</label>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  
                  {/* 🌟 PRO BUTTON: AI AUTO WITH PREMIUM STYLING */}
                  <button 
                    type="button"
                    onClick={() => handleModeSelect("auto")}
                    disabled={isProcessingPayment}
                    className={`relative flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 flex items-center justify-center transition-all w-full
                      ${mode === "auto" 
                        ? 'border-blue-500 text-blue-700 bg-blue-50 shadow-sm z-10' 
                        : 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-400 text-amber-900 shadow-sm hover:shadow-md hover:border-amber-500' 
                      }
                      ${isProcessingPayment ? 'opacity-50 cursor-wait' : ''}
                    `}
                  >
                    {!isProUser && mode !== "auto" && (
                      <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-20 flex items-center gap-1">
                        PRO <Lock size={10} />
                      </div>
                    )}
                    <Sparkles size={16} className="mr-2" /> {isProcessingPayment ? "Loading Gateway..." : "AI Auto (Text)"}
                  </button>

                  {/* 🌟 FREE BUTTON: MANUAL */}
                  <button 
                    type="button"
                    onClick={() => handleModeSelect("manual")}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 flex items-center justify-center transition-all w-full
                      ${mode === "manual" ? 'border-blue-500 text-blue-700 bg-blue-50 shadow-sm' : 'border-transparent text-slate-600 bg-white/60 hover:bg-white shadow-sm'}`}
                  >
                    <MousePointer2 size={16} className="mr-2" /> Manual Box
                  </button>

                </div>
              </div>
              
              {isProcessing ? (
                <div className="flex flex-col gap-3">
                  <button disabled className="w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center transition-all bg-blue-50 text-blue-600 border border-blue-200 cursor-wait shadow-inner">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing Image...
                  </button>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-rose-500 text-sm font-bold transition-colors flex items-center justify-center py-2">
                    <X size={16} strokeWidth={3} className="mr-1" /> Cancel Process
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleCleanPhoto} disabled={!photoFile}
                  className={`w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center transition-all ${!photoFile ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl'}`}
                >
                  <span className="flex items-center"><Eraser size={20} className="mr-2" /> Clean Image</span>
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

        {resultPhoto && (
          <div className="mt-10 pt-8 border-t border-white/60 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center"><CheckCircle2 className="textemerald-500 mr-2" /> Watermark Removed!</h3>
            <div className="bg-white/50 p-6 rounded-2xl border border-white/80 text-center flex flex-col items-center">
              <div className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/50 mb-6 bg-slate-100 flex justify-center">
                <img src={resultPhoto} alt="Cleaned Result" className="max-h-[400px] object-contain" />
              </div>
              <p className="text-slate-600 font-medium mb-6">Your photo has been successfully processed by the Python engine.</p>
              <button onClick={handleForceDownload} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors inline-flex items-center">
  <Download size={20} className="mr-2" /> Download Clean Image
</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}