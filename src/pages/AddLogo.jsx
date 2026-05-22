import React, { useState, useRef } from 'react';
import { UploadCloud, Stamp, Image as ImageIcon, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { auth } from '../firebase.js'; // 🌟 Add this!

export default function AddLogo() {
  const [baseFile, setBaseFile] = useState(null);
  const [basePreview, setBasePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [logoPos, setLogoPos] = useState({ x: 20, y: 20 });
  const [logoSize, setLogoSize] = useState(150);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultMedia, setResultMedia] = useState(null);

  const containerRef = useRef(null);
  const mediaRef = useRef(null); 
  const baseInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleDrag = (e) => {
    if (!containerRef.current) return;
    
    // Grab the X and Y coordinates depending on if it's a touch or a mouse click!
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left - (logoSize / 2), rect.width - logoSize));
    const y = Math.max(0, Math.min(clientY - rect.top - (logoSize / 2), rect.height - logoSize));
    setLogoPos({ x: Math.round(x), y: Math.round(y) });
  };

  const handleApplyBranding = async () => {
    if (!baseFile || !logoFile || !mediaRef.current) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultMedia(null); // Clear previous result if any
    
    try {
      // 🛑 1. SECURITY CHECK: Is user logged in?
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Auth Error: Please Sign In to use the AI tools!");
      }

      const displayedWidth = mediaRef.current.getBoundingClientRect().width;
      const actualWidth = baseFile.type.includes('video') ? mediaRef.current.videoWidth : mediaRef.current.naturalWidth;
      const scale = actualWidth / displayedWidth;

      const trueX = Math.round(logoPos.x * scale);
      const trueY = Math.round(logoPos.y * scale);
      const trueLogoW = Math.round(logoSize * scale);

      const formData = new FormData();
      formData.append("video_file", baseFile); 
      formData.append("logo_file", logoFile);
      formData.append("x", trueX);
      formData.append("y", trueY);
      formData.append("logo_w", trueLogoW);
      formData.append("logo_h", 100); 

      // 🌟 2. THE PIPELINE: Send the real Google UID to Python!
      formData.append("user_id", currentUser.uid);

      const response = await fetch(`${import.meta.env.VITE_HF_API}/api/add-custom-logo`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      // 🛑 3. ERROR CATCHER: Catch 402 Paywall & Python internal errors cleanly
      if (!response.ok || data.error) {
        throw new Error(data.detail || data.error || "Failed to brand");
      }

      setResultMedia(`${import.meta.env.VITE_HF_API}/downloads/${data.file_name}`);
    } catch (error) {
      if (error.message.includes("PaywallTrigger")) {
        // ✨ Catch the Paywall Error Cleanly
        setErrorMsg("Out of credits! Please upgrade to Pro.");
      } else {
        console.error("Bridge Error:", error);
        setErrorMsg(error.message || "Failed to connect to Python server.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // 🌟 THE BULLETPROOF DOWNLOAD HACK 
  const handleForceDownload = async () => {
    if (!resultMedia) return;
    try {
      const response = await fetch(resultMedia);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = baseFile?.type.includes('video') ? "Clipeto_Branded.mp4" : "Clipeto_Branded.jpg"; 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Force download failed:", error);
      alert("Browser blocked the download. Please right-click the video below and click 'Save Video As...'");
    }
  };

  const handleAITool = async (imageFile) => {
  // 🛑 THE BOUNCER: Check the VIP List first!
  if (!isProUser) {
    // If they haven't paid, stop them and pop open the Razorpay window!
    setShowUpgradeModal(true); 
    return; 
  }

  // ✅ VIP GRANTED: Send it to Hugging Face
  setIsProcessing(true);
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    // Notice we use the HF_API here, not Render!
    const response = await fetch(`${import.meta.env.VITE_HF_API}/process-image`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResultImage(data.output_url);

  } catch (error) {
    console.error("Hugging Face Error:", error);
    setErrorMsg("AI Processing failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <div className="pt-10 pb-24 px-6 md:px-12 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto no-scrollbar">
      <h1 className="text-4xl font-black text-slate-900 mb-8">Add <span className="text-fuchsia-600">Logo</span></h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-sm relative flex flex-col items-center">
          {!basePreview ? (
            <div className="w-full h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-3xl">
              <button onClick={() => baseInputRef.current.click()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">Upload Background</button>
            </div>
          ) : (
            <div 
              ref={containerRef}
              // 🌟 Added "touch-none" here to prevent the phone from scrolling while dragging!
              className="relative w-fit overflow-hidden rounded-2xl bg-black cursor-crosshair mx-auto touch-none"
              
              // Desktop Mouse Events
              onMouseDown={(e) => {
                const move = (moveE) => handleDrag(moveE);
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
              }}
              
              // 📱 Mobile Touch Events
              onTouchStart={(e) => {
                const move = (moveE) => handleDrag(moveE);
                window.addEventListener('touchmove', move, { passive: false });
                window.addEventListener('touchend', () => window.removeEventListener('touchmove', move), { once: true });
              }}
            >
              {baseFile?.type.includes('video') ? (
                <video ref={mediaRef} src={basePreview} className="max-h-[500px] w-auto select-none pointer-events-none" />
              ) : (
                <img ref={mediaRef} src={basePreview} className="max-h-[500px] w-auto select-none pointer-events-none" alt="Base" />
              )}
              
              {logoPreview && (
                <div 
                  className="absolute border-2 border-fuchsia-500 shadow-lg cursor-move bg-white/20"
                  style={{ left: logoPos.x, top: logoPos.y, width: logoSize, height: 'auto' }}
                >
                  <img src={logoPreview} className="w-full h-auto pointer-events-none" alt="Logo" />
                  <div className="absolute -bottom-2 -right-2 bg-fuchsia-600 text-[10px] text-white px-1 rounded">DRAG ME</div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <input type="file" ref={baseInputRef} onChange={(e) => {
              const file = e.target.files[0];
              setBaseFile(file);
              setBasePreview(URL.createObjectURL(file));
              setResultMedia(null);accept="video/mp4,video/quicktime"
            }} className="hidden"  />
            <input type="file" ref={logoInputRef} onChange={(e) => {
              const file = e.target.files[0];
              setLogoFile(file);
              setLogoPreview(URL.createObjectURL(file));
            }} className="hidden" accept="image/png" />
            
            <button onClick={() => logoInputRef.current.click()} className="text-fuchsia-600 font-bold text-sm">Upload PNG Logo</button>
            <button onClick={() => baseInputRef.current.click()} className="text-slate-500 font-bold text-sm">Change Video</button>
          </div>
        </div>

        <div className="w-full lg:w-[350px] space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Size Control</h3>
            <input 
              type="range" min="50" max="400" value={logoSize} 
              onChange={(e) => setLogoSize(parseInt(e.target.value))}
              className="w-full accent-fuchsia-600"
            />
            
            <button 
              onClick={handleApplyBranding}
              disabled={isProcessing || !baseFile || !logoFile}
              className={`w-full mt-8 py-4 rounded-2xl font-black shadow-lg transition-all ${(!baseFile || !logoFile) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-fuchsia-600 text-white hover:-translate-y-1 shadow-fuchsia-200'}`}
            >
              {isProcessing ? "Processing..." : "Apply Branding"}
            </button>
          </div>
        </div>
      </div>
      
      {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-4 font-bold max-w-2xl mx-auto"><AlertCircle className="inline mr-2"/>{errorMsg}</div>}
      
      {/* 🌟 THE NEW PREVIEW AND DOWNLOAD SECTION */}
      {resultMedia && (
        <div className="mt-10 pt-8 border-t border-slate-200 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full">
          <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500 mr-2" /> Branding Applied Successfully!
          </h3>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center shadow-sm">
            
            {/* The Final Video/Photo Player */}
            <div className="w-full rounded-2xl overflow-hidden shadow-md bg-black flex justify-center mb-6">
               {baseFile?.type.includes('video') ? (
                 <video src={resultMedia} controls autoPlay className="max-h-[400px] w-auto" />
               ) : (
                 <img src={resultMedia} className="max-h-[400px] w-auto" alt="Final Result" />
               )}
            </div>

            {/* The Force Download Button */}
            <button onClick={handleForceDownload} className="px-8 py-4 bg-fuchsia-600 text-white font-black rounded-2xl shadow-lg shadow-fuchsia-200 hover:-translate-y-1 transition-all inline-flex items-center">
              <Download size={20} className="mr-2" /> Download Final Media
            </button>
          </div>
        </div>
      )}

    </div>
  );
}