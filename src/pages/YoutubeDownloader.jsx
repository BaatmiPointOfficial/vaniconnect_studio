import SEO from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { DownloadCloud, Link as LinkIcon, AlertCircle, Globe, Download, Settings2, Music, Lock, Crown, X, CheckCircle2, Zap } from 'lucide-react';
import { auth } from '../firebase.js'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 
const RENDER_API = "https://yt-microservice-o8lu.onrender.com";
export default function Downloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720p'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [downloadLink, setDownloadLink] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isAudioOnly, setIsAudioOnly] = useState(false);

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

  const handleQualitySelect = (selectedId) => {
    if (selectedId === 'best' && !isProUser) {
      setShowUpgradeModal(true); 
      return; 
    }
    setQuality(selectedId);
  };

  // 🌟 RAZORPAY CHECKOUT LOGIC
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
        theme: { color: "#6366f1" } // 🌟 Indigo-500 to match the tool's brand
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

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    // 🛡️ THE BOUNCER: Check if it is a YouTube link before doing anything else
    const urlToCheck = url.trim().toLowerCase();
    if (!urlToCheck.includes("youtube.com") && !urlToCheck.includes("youtu.be")) {
      setErrorMsg("🚀 Instagram & Facebook support is upgrading! Check back in V1.2. For now, please paste a YouTube link.");
      return; // Stops the function completely so it doesn't hit your backend
    }
    
    setIsProcessing(true);
    setErrorMsg('');
    setDownloadLink(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Auth Error: Please Sign In to use the AI tools!");

      const formData = new FormData();
      formData.append("url", url);
      formData.append("quality", quality); 
      formData.append("user_id", currentUser.uid);

    const response = await fetch(`${RENDER_API}/api/download`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok || data.error) throw new Error(data.detail || data.error || "Failed to download video.");

      setDownloadLink(`${import.meta.env.VITE_RENDER_API}/downloads/${data.file_name}`);
      setVideoTitle(data.title);
      setThumbnailUrl(data.thumbnail);
      setIsAudioOnly(data.is_audio);

    } catch (error) {
      if (error.message && error.message.includes("PaywallTrigger")) {
        setShowUpgradeModal(true);
      } else {
        console.error("Bridge Error:", error);
        setErrorMsg(error.message || "Could not connect to the Python Engine.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForceDownload = async () => {
    if (!downloadLink) return;
    try {
      const response = await fetch(downloadLink);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadLink.split('/').pop(); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Could not trigger automatic download.");
    }
  };

  return (
    <>
      <SEO
        title="Free 4K Video Downloader | YouTube, Insta, TikTok"
        description="Extract high-quality MP4 video and MP3 audio directly from YouTube, Instagram Reels, TikTok, and X safely and instantly."
        keywords="youtube downloader, 4k video downloader, instagram reel downloader, tiktok downloader free, mp4 extractor"
      />
      
      <div className="pt-10 pb-24 px-6 md:px-12 max-w-5xl mx-auto h-full flex flex-col overflow-y-auto no-scrollbar relative">
        
        {/* 🌟 THE BULLETPROOF & MOBILE-OPTIMIZED PREMIUM MODAL (INDIGO THEME) */}
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

              <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 p-6 pb-8 sm:p-8 sm:pb-10 flex flex-col items-center relative text-center pt-10 sm:pt-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-inner border border-white/30">
                  <Crown size={28} className="sm:w-8 sm:h-8" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5 sm:mb-2 tracking-tight">Unlock Pro Power</h2>
                
                <p className="text-white/90 font-medium text-xs sm:text-sm">
                  Max Quality 4K Downloads is a Premium Tool!
                </p>
              </div>

              <div className="p-6 sm:p-8 pt-5 sm:pt-6 bg-white">
                
                <p className="text-slate-600 text-center font-medium mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Upgrade to Pro to unlock unlimited 4K ultra-HD downloads, zero watermarks, and maximum server speeds.
                </p>

                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Unlimited 4K Video Downloads",
                    "High-Bitrate Audio Extraction",
                    "Priority Local GPU Processing",
                    "No Daily Restrictions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center text-xs sm:text-sm font-bold text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-500 mr-2.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
                      {item}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-black text-base sm:text-lg shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} className="sm:w-5 sm:h-5 fill-current" /> 
                  {isProcessingPayment ? "Loading Gateway..." : "Upgrade to Pro — ₹299/mo"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowUpgradeModal(false)} 
                  className="w-full text-center mt-3 sm:mt-4 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Maybe later, I'll download 720p
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
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm mb-4">
            <Globe size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-600 tracking-wide">Universal Tool</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Downloader</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Paste a link from <span className="font-bold text-slate-700">YouTube, Instagram, Twitter/X, or TikTok</span>
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 md:p-12 w-full max-w-3xl mx-auto mb-10">
          <form onSubmit={handleDownload} className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <LinkIcon className="text-slate-400" size={24} />
              </div>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="w-full pl-16 pr-6 py-5 bg-white/80 border-2 border-slate-100 rounded-2xl text-lg font-medium text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center ml-2">
                <Settings2 size={14} className="mr-2"/> Download Format
              </label>
              
              <div className="flex flex-col md:flex-row w-full gap-3">
                {[
                  { id: 'best', label: 'Max Quality', sub: 'Original HD', isPro: true },
                  { id: '720p', label: '720p HD', sub: 'Fast & Standard', isPro: false },
                  { id: '480p', label: '480p SD', sub: 'Data Saver', isPro: false },
                  { id: 'audio', label: 'MP3 Audio', sub: 'Audio Only', isPro: false }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleQualitySelect(opt.id)}
                    className={`relative flex-1 py-3 px-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all w-full
                      ${quality === opt.id 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md scale-[1.02] z-10' 
                        : opt.isPro && !isProUser
                          ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 shadow-sm hover:scale-[1.02]' 
                          : 'border-white/40 bg-white/60 text-slate-500 hover:bg-white hover:border-slate-200 shadow-sm' 
                      }
                    `}
                  >
                    {opt.isPro && !isProUser && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1">
                        PRO <Lock size={8} />
                      </div>
                    )}

                    <span className="font-bold text-sm flex items-center gap-1">
                      {opt.label} 
                    </span>
                    <span className={`text-[10px] mt-0.5 font-medium ${opt.isPro && quality !== opt.id ? 'text-amber-600/80' : 'opacity-70'}`}>
                      {opt.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!url || isProcessing}
              className={`w-full py-5 mt-2 rounded-2xl font-extrabold text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${!url ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-indigo-500/30 hover:-translate-y-1'}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Extracting Media...
                </>
              ) : (
                <>
                  <DownloadCloud size={24} /> Fetch Media
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-8 p-4 bg-rose-50 text-rose-600 font-bold rounded-2xl flex items-center justify-center animate-in fade-in">
              <AlertCircle className="mr-2" /> {errorMsg}
            </div>
          )}
        </div>

        {downloadLink && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 bg-white/80 backdrop-blur-xl border border-indigo-100 p-6 md:p-8 rounded-[2.5rem] shadow-2xl w-full max-w-3xl mx-auto flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center line-clamp-2 px-4">{videoTitle}</h3>
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-inner mb-8 aspect-video flex items-center justify-center group">
              {isAudioOnly ? (
                 <div className="absolute inset-0 w-full h-full">
                   <img src={thumbnailUrl} className="w-full h-full object-cover opacity-40 blur-sm" alt="Thumbnail" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
                      <Music size={48} className="text-indigo-400 mb-6 drop-shadow-lg" />
                      <audio src={downloadLink} controls className="w-full max-w-md shadow-xl rounded-full" />
                   </div>
                 </div>
              ) : (
                 <video src={downloadLink} poster={thumbnailUrl} controls className="w-full h-full object-contain" />
              )}
            </div>
            <button onClick={handleForceDownload} className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-slate-900/30 hover:bg-slate-800 transition-all inline-flex items-center justify-center">
              <Download size={22} className="mr-3" /> Save {isAudioOnly ? 'MP3' : 'MP4'} to Device
            </button>
          </div>
        )}
      </div>
    </>
  );
}