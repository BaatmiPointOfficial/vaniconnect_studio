import SEO from '../components/SEO';
import { auth } from '../firebase.js';
import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, CheckCircle2, Download, Palette, FileImage, Layers } from 'lucide-react';

<SEO 
  title="Free AI Background Remover | HD Photo Cutout"
  description="Instantly strip away backgrounds from products and portraits with AI. Get crisp, professional studio colors or transparent PNGs with zero cloud-lag."
  keywords="background remover, remove bg, transparent background maker, ai photo cutout, free background eraser"
/>
export default function BackgroundRemover() {
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultImage, setResultImage] = useState(null);

  // 🌟 PRO FEATURES STATE
  const [bgStrategy, setBgStrategy] = useState("transparent"); // "transparent", "color", "image"
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);

  const fileInputRef = useRef(null);
  const bgFileInputRef = useRef(null);
  const abortControllerRef = useRef(null); // Added this back just in case!

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setResultImage(null);
      setErrorMsg('');
    }
  };

  const handleBgFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImageFile(file);
      setBgImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveBackground = async () => {
    if (!imageFile) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultImage(null);
    abortControllerRef.current = new AbortController();

    try {
      // 🛑 1. SECURITY CHECK: Is the user logged in?
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Auth Error: Please Sign In to use the AI tools!");
      }

      const formData = new FormData();
      formData.append("file", imageFile);
      
      // 🌟 2. THE PIPELINE: Send the real Google UID to Python!
      formData.append("user_id", currentUser.uid);

      // 🌟 Append Pro Features if selected
      if (bgStrategy === "color") {
        formData.append("bg_color", bgColor);
      } else if (bgStrategy === "image" && bgImageFile) {
        formData.append("bg_image", bgImageFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/api/remove-bg`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal 
      });

      const data = await response.json();
      
      // 🛑 3. PAYWALL CATCHER: FastAPI sends errors inside 'data.detail'
      if (!response.ok) {
        throw new Error(data.detail || data.error || "Failed to process image");
      }

      setResultImage(`${import.meta.env.VITE_API_URL}/downloads/${data.file_name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg("Process canceled by user.");
      } else {
        console.error("Bridge Error:", error);
        
        // If it's our Paywall error, make it look clean
        if (error.message.includes("PaywallTrigger")) {
           setErrorMsg("Out of credits! Please click the Pro button to upgrade.");
           // Optional: You could even trigger your setIsPaywallOpen(true) here!
        } else {
           setErrorMsg(error.message || "Failed to connect to Python server.");
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 🌟 Smart Download Hack (Knows if it's PNG or JPEG)
  const handleForceDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = bgStrategy === "transparent" ? "VaniConnect_Transparent.png" : "VaniConnect_Pro_BG.jpg"; 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Could not download file.");
    }
  };

  const clearSelection = () => {
    if (isProcessing) return;
    setImageFile(null);
    setImageUrl(null);
    setResultImage(null);
    setBgImageFile(null);
    setBgImageUrl(null);
  };

  return (
    <div className="pt-10 pb-24 px-6 md:px-12 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm mb-4">
          <Layers size={16} className="text-fuchsia-600" />
          <span className="text-sm font-bold text-slate-600 tracking-wide">Studio Tool</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
          Background <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">Remover</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl text-lg">
          Instantly isolate subjects with AI, or place them in a brand new environment.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* LEFT COLUMN: Main Upload Area */}
        <div className="flex-1 flex flex-col">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png,image/jpeg,image/webp" className="hidden" />

          {!imageUrl ? (
            <div 
              className={`flex-1 min-h-[400px] bg-white/30 backdrop-blur-2xl border-2 border-dashed ${dragActive ? 'border-fuchsia-500 bg-fuchsia-50/50' : 'border-white/80'} rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center p-10 transition-all duration-300 relative overflow-hidden group cursor-pointer`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDrop={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-24 h-24 bg-white shadow-xl shadow-fuchsia-200/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <UploadCloud size={40} className="text-fuchsia-500" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Upload Photo</h3>
              <p className="text-slate-500 font-medium text-center">PNG, JPG, WEBP</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center relative bg-white/40 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60">
              <div className="relative rounded-xl overflow-hidden shadow-sm border-2 border-slate-200/50 w-full bg-slate-100/50 flex justify-center items-center min-h-[400px]">
                <img src={imageUrl} className="max-h-[500px] w-auto object-contain rounded-lg shadow-sm" alt="Original" />

                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-14 h-14 border-4 border-white/20 border-t-fuchsia-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-extrabold text-sm tracking-widest uppercase animate-pulse">Processing AI Mask...</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <button onClick={() => fileInputRef.current.click()} disabled={isProcessing} className="font-bold text-sm text-slate-500 hover:text-fuchsia-600 transition-colors">Change Photo</button>
                <button onClick={clearSelection} disabled={isProcessing} className="font-bold text-sm text-slate-500 hover:text-rose-600 transition-colors">Clear</button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Pro Settings */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8">
            <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-fuchsia-600" /> Background Mode
            </h3>

            {/* Strategy Tabs */}
            <div className="flex bg-white/60 p-1.5 rounded-xl border border-slate-200 mb-6">
              <button onClick={() => setBgStrategy("transparent")} className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${bgStrategy === "transparent" ? 'bg-fuchsia-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Transparent</button>
              <button onClick={() => setBgStrategy("color")} className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${bgStrategy === "color" ? 'bg-fuchsia-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Color <span className="text-[9px] bg-white/20 px-1 rounded ml-1">PRO</span></button>
              <button onClick={() => setBgStrategy("image")} className={`flex-1 py-2 font-bold text-xs rounded-lg transition-all ${bgStrategy === "image" ? 'bg-fuchsia-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Image <span className="text-[9px] bg-white/20 px-1 rounded ml-1">PRO</span></button>
            </div>

            {/* Dynamic Settings */}
            <div className="mb-8 min-h-[120px]">
              {bgStrategy === "transparent" && (
                <div className="animate-in fade-in flex flex-col items-center justify-center h-full text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Layers className="text-slate-300 mb-2" size={32} />
                  <p className="text-sm font-bold text-slate-500">Subject cutout only.</p>
                  <p className="text-xs text-slate-400 mt-1">Downloads as a transparent PNG.</p>
                </div>
              )}

              {bgStrategy === "color" && (
                <div className="animate-in fade-in space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center"><Palette size={14} className="mr-2"/> Pick a Color</label>
                  <div className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-none p-0 bg-transparent" />
                    <input type="text" value={bgColor.toUpperCase()} onChange={(e) => setBgColor(e.target.value)} className="font-mono text-lg font-bold text-slate-700 outline-none uppercase w-full bg-transparent" />
                  </div>
                </div>
              )}

              {bgStrategy === "image" && (
                <div className="animate-in fade-in space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center"><FileImage size={14} className="mr-2"/> Upload New Background</label>
                  <input type="file" ref={bgFileInputRef} onChange={handleBgFileChange} accept="image/*" className="hidden" />
                  
                  {!bgImageUrl ? (
                    <button onClick={() => bgFileInputRef.current.click()} className="w-full py-8 border-2 border-dashed border-fuchsia-200 rounded-2xl text-fuchsia-600 font-bold hover:bg-fuchsia-50 transition-colors">
                      + Browse Background Image
                    </button>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                      <img src={bgImageUrl} className="w-full h-32 object-cover opacity-80" alt="New BG" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                         <button onClick={() => bgFileInputRef.current.click()} className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg hover:bg-white/30">Change Image</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={handleRemoveBackground} 
              disabled={!imageFile || isProcessing || (bgStrategy === "image" && !bgImageFile)}
              className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${(!imageFile || (bgStrategy === "image" && !bgImageFile)) ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-fuchsia-500/30 hover:-translate-y-1'}`}
            >
               Process Image
            </button>
          </div>
        </div>
      </div>

      {errorMsg && <div className="mt-8 p-4 bg-rose-50 text-rose-600 font-bold rounded-2xl flex items-center max-w-2xl mx-auto"><AlertCircle className="mr-2" /> {errorMsg}</div>}

      {resultImage && (
        <div className="mt-10 pt-8 border-t border-slate-200 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full text-center">
          <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center justify-center"><CheckCircle2 className="text-emerald-500 mr-2" /> Magic Complete!</h3>
          <div className="bg-white/80 p-6 rounded-[2rem] border border-slate-100 shadow-lg flex flex-col items-center">
            {/* Checkerboard background wrapper to show transparency clearly */}
            <div className="w-full rounded-2xl overflow-hidden shadow-md border-2 border-slate-200/50 mb-6 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-slate-100 flex justify-center">
              <img src={resultImage} className="max-h-[500px] w-auto object-contain" alt="Result" />
            </div>
            <button onClick={handleForceDownload} className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 hover:bg-slate-800 transition-all inline-flex items-center">
              <Download size={20} className="mr-2" /> Download Final Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}