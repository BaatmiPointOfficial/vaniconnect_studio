import SEO from '../components/SEO';
import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Image as ImageIcon, UploadCloud, Settings, AlertCircle, CheckCircle2, Download, X, Sparkles, MousePointer2, Lock, Crown, Zap } from 'lucide-react'; 
import { auth } from '../firebase.js'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

// 🌟 THE MASTER CHECKOUT MODAL
import PaywallModal from '../components/PaywallModal.jsx'; 

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const db = getFirestore();

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
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
      setResultPhoto(null);
      setErrorMsg('');
      setSelection(null); 
    }
  };

  // --- 🛑 THE UI BOUNCER ---
  const handleModeSelect = (selectedMode) => {
    // Stop free users from clicking "Auto"
    if (selectedMode === 'auto' && !isProUser) {
      setShowUpgradeModal(true); 
      return;
    }
    setMode(selectedMode);
    setSelection(null);
  };

  // --- MANUAL DRAWING LOGIC ---
  const handleMouseDown = (e) => {
    if (isProcessing || mode === "auto" || resultPhoto) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setSelection({ x, y, w: 0, h: 0 });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || isProcessing || mode === "auto" || resultPhoto) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setSelection({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      w: Math.abs(currentX - startPos.x),
      h: Math.abs(currentY - startPos.y)
    });
  };

  const handleMouseUp = () => setIsDrawing(false);

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
        // 🛑 THE SERVER BOUNCER: Python says out of credits! Pop the modal!
        setShowUpgradeModal(true); 
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
                  This is a Premium Studio Tool!
                </p>
              </div>

              <div className="p-6 sm:p-8 pt-5 sm:pt-6 bg-white">
                
                <p className="text-slate-600 text-center font-medium mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Upgrade to Pro to unlock unlimited processing, advanced AI features, and priority speed.
                </p>

                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Unlimited AI Usage",
                    "Max Quality 4K Downloads",
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
                <button onClick={() => setShowUpgradeModal(true)}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-black text-base sm:text-lg shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} className="sm:w-5 sm:h-5 fill-current" /> 
                  {isProcessingPayment ? "Loading Gateway..." : "Upgrade to Pro — ₹299/mo"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowUpgradeModal(false)} 
                  className="w-full text-center mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Maybe later, close this
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
                 className={`relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200/50 ${isProcessing || mode === "auto" ? 'cursor-default' : 'cursor-crosshair'}`}
                 onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
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
                   className={`relative flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 flex items-center justify-center transition-all w-full
                     ${mode === "auto" 
                       ? 'border-blue-500 text-blue-700 bg-blue-50 shadow-sm z-10' 
                       : 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-400 text-amber-900 shadow-sm hover:shadow-md hover:border-amber-500' 
                     }
                   `}
                 >
                   {!isProUser && mode !== "auto" && (
                     <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-20 flex items-center gap-1">
                       PRO <Lock size={10} />
                     </div>
                   )}
                   <Sparkles size={16} className="mr-2" /> AI Auto (Text)
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
           <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center"><CheckCircle2 className="text-emerald-500 mr-2" /> Watermark Removed!</h3>
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