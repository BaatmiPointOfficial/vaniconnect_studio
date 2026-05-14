import SEO from '../components/SEO';
import React, { useState, useRef, useEffect } from 'react';
// 🌟 Fixed Import: Settings icon is safely included here to prevent the white screen
import { Eraser, Image as ImageIcon, UploadCloud, Settings, AlertCircle, CheckCircle2, Download, X, Sparkles, MousePointer2, Lock, Crown, Zap } from 'lucide-react';
import { auth } from '../firebase.js'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

// 🌟 Import your final PaywallModal
import PaywallModal from '../components/PaywallModal'; 

export default function PhotoWatermark() {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultPhoto, setResultPhoto] = useState(null);
  
  const [mode, setMode] = useState("manual"); 
  
  const [selection, setSelection] = useState(null); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const imageRef = useRef(null); 

  const [isProUser, setIsProUser] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
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

  const handleModeSelect = (selectedMode) => {
    if (selectedMode === 'auto' && !isProUser) {
      setShowUpgradeModal(true); 
      return;
    }
    setMode(selectedMode);
    setSelection(null);
  };

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="AI Photo Watermark Remover | VaniConnect Studio" 
        description="Remove watermarks, text, and unwanted objects from your photos instantly using advanced AI inpainting."
      />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
            <Eraser className="text-purple-600 w-10 h-10" />
            Photo Watermark Remover
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Clean up your images in seconds. Draw a box manually for free, or upgrade to let our AI find and erase watermarks automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            
            {!photoUrl ? (
              <div 
                onClick={handleBrowseClick}
                className="border-4 border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="bg-purple-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Upload your Photo</h3>
                <p className="text-gray-500 mt-2">JPEG, PNG, or WebP up to 10MB</p>
              </div>
            ) : (
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: The Image Canvas */}
                <div className="lg:col-span-2 space-y-4">
                  <div 
                    className="relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner group select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: mode === 'manual' && !resultPhoto ? 'crosshair' : 'default' }}
                  >
                    <img 
                      ref={imageRef}
                      src={resultPhoto || photoUrl} 
                      alt="Workspace" 
                      className="w-full h-auto object-contain max-h-[600px] pointer-events-none"
                    />
                    
                    {selection && mode === 'manual' && !resultPhoto && (
                      <div 
                        className="absolute border-2 border-purple-500 bg-purple-500/20"
                        style={{
                          left: `${selection.x}px`,
                          top: `${selection.y}px`,
                          width: `${selection.w}px`,
                          height: `${selection.h}px`
                        }}
                      />
                    )}

                    {mode === 'auto' && !resultPhoto && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                        <div className="bg-white px-6 py-3 rounded-full font-bold text-purple-600 flex items-center gap-2 shadow-xl">
                          <Sparkles className="w-5 h-5" /> AI Auto-Detection Active
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: The Controls */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">1. Select Mode</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleModeSelect('manual')}
                          className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'manual' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          <MousePointer2 className="w-4 h-4" /> Manual
                        </button>
                        
                        <button
                          onClick={() => handleModeSelect('auto')}
                          className={`relative py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'auto' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          <Sparkles className="w-4 h-4" /> Auto AI
                          {!isProUser && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white p-1 rounded-full shadow-lg">
                              <Crown className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      </div>
                      
                      {mode === 'manual' && !resultPhoto && (
                         <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                           <AlertCircle className="w-4 h-4 text-purple-500" /> Draw a box over the watermark on the image.
                         </p>
                      )}
                    </div>

                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{errorMsg}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    {!resultPhoto ? (
                      <>
                        <button
                          onClick={handleCleanPhoto}
                          disabled={isProcessing || (!selection && mode === 'manual')}
                          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                            isProcessing || (!selection && mode === 'manual')
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-1'
                          }`}
                        >
                          {isProcessing ? (
                            <>Processing Image <span className="animate-pulse">...</span></>
                          ) : (
                            <><Eraser className="w-5 h-5" /> Clean Photo Now</>
                          )}
                        </button>
                        
                        {isProcessing && (
                           <button onClick={handleCancel} className="w-full py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors">
                             Cancel
                           </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-bold mb-4 border border-green-200">
                           <CheckCircle2 className="w-5 h-5" /> Success! Watermark Removed.
                        </div>
                        <button
                          onClick={handleForceDownload}
                          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-black hover:shadow-xl transition-all"
                        >
                          <Download className="w-5 h-5" /> Download HD Photo
                        </button>
                      </>
                    )}

                    {!isProcessing && (
                      <button
                        onClick={clearSelection}
                        className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors"
                      >
                        Start Over
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 THE PAYWALL MOUNT (Fixed to match your exact PaywallModal code!) */}
      <PaywallModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
      
    </div>
  );
}