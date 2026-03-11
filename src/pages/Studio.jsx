import React, { useState } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, ShieldCheck, Video, Image, Download, 
  Loader2, UploadCloud, Youtube, Eraser, Stamp, 
  Scissors, UserX, Wand2 
} from 'lucide-react';

const tools = [
  { name: "YouTube Downloader", icon: <Youtube size={32} color="white" />, desc: "Download videos in 4K high quality.", color: "bg-red-500" },
  { name: "Video Watermark Remover", icon: <Video size={32} color="white" />, desc: "High-speed AI watermark removal.", color: "bg-amber-500" },
  { name: "Photo Watermark Remover", icon: <Eraser size={32} color="white" />, desc: "Clean images using AI.", color: "bg-teal-500" },
  { name: "Photo Enhancer", icon: <Image size={32} color="white" />, desc: "DSLR-level sharpening & retouching.", color: "bg-green-500" },
  { name: "Add Custom Logo", icon: <Stamp size={32} color="white" />, desc: "Effortlessly brand your videos.", color: "bg-indigo-500" },
  { name: "Clip Cut Pro Editor", icon: <Scissors size={32} color="white" />, desc: "Precision trim & professional text.", color: "bg-purple-500" },
  { name: "Background Remover", icon: <UserX size={32} color="white" />, desc: "Instant transparent backgrounds.", color: "bg-pink-500" },
  { name: "Video Enhancer", icon: <Wand2 size={32} color="white" />, desc: "Boost color, contrast, and clarity.", color: "bg-blue-600" },
];

export default function Studio() {
  const [activeTool, setActiveTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [ytUrl, setYtUrl] = useState("");
  
  const [wmX, setWmX] = useState(50);
  const [wmY, setWmY] = useState(50);
  const [wmW, setWmW] = useState(200);
  const [wmH, setWmH] = useState(100);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [videoScale, setVideoScale] = useState(1);
  const [wmStyle, setWmStyle] = useState("Standard AI Inpaint");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [enhanceStyle, setEnhanceStyle] = useState("Auto Color Fix");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(5);
  const [overlayText, setOverlayText] = useState("");
  const [ytQuality, setYtQuality] = useState("720p");
  const [logoX, setLogoX] = useState(10);
  const [logoY, setLogoY] = useState(10);
  const [logoW, setLogoW] = useState(150);
  
  
  const checkJobStatus = async (jobId) => {
    try {
      const response = await axios.get(`https://vaniconnect-vaniconnect-api.hf.space/api/job-status/${jobId}`);
      const data = response.data;
      
      if (data.status === "completed" || data.status === "SUCCESS" || data.status === "success") {
        setLoading(false);
        setResultUrl(data.file_url || data.result);
      } else if (data.status === "failed" || data.status === "FAILURE") {
        alert("Task failed: " + data.error);
        setLoading(false);
      } else {
        setTimeout(() => checkJobStatus(jobId), 2000);
      }
    } catch (error) {
      setTimeout(() => checkJobStatus(jobId), 2000);
    }
  };

  const handleVideoEnhanceProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/enhance-video", formData);
      if (response.data.job_id) {
        checkJobStatus(response.data.job_id);
      }
    } catch (e) { 
      alert("Error starting process"); 
      setLoading(false); 
    }
  };

  const handleWatermarkProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResultUrl(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("x", wmX); formData.append("y", wmY);
    formData.append("w", wmW); formData.append("h", wmH);

    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/remove-video-watermark", formData);
      if (response.data && response.data.job_id) {
        checkJobStatus(response.data.job_id);
      } else { 
        alert("Backend did not return a job ticket!"); 
        setLoading(false); 
      }
    } catch (e) { 
      const errorMsg = e.response && e.response.data ? JSON.stringify(e.response.data) : e.message;
      alert(`Error: ${errorMsg}`); 
      setLoading(false); 
    }
  };

  const handlePhotoWatermarkProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResultUrl(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("x", wmX); formData.append("y", wmY);
    formData.append("w", wmW); formData.append("h", wmH);
    formData.append("style", wmStyle);

    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/remove-photo-watermark", formData);
      if (response.data && response.data.job_id) {
        checkJobStatus(response.data.job_id);
      } else { alert("No job ticket!"); setLoading(false); }
    } catch (e) { alert("Error"); setLoading(false); }
  };

  const handlePhotoEnhanceProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResultUrl(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("style", enhanceStyle);

    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/enhance-photo", formData);
      if (response.data && response.data.job_id) {
        checkJobStatus(response.data.job_id);
      } else { 
        alert("Backend did not return a job ticket!"); 
        setLoading(false); 
      }
    } catch (e) { 
      const errorMsg = e.response && e.response.data ? JSON.stringify(e.response.data) : e.message;
      alert(`Error: ${errorMsg}`); 
      setLoading(false); 
    }
  };

  const handleBgRemoveProcess = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResultUrl(null); 
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/remove-background", formData);
      if (response.data && response.data.job_id) {
        checkJobStatus(response.data.job_id);
      } else { 
        alert("No job ticket!"); 
        setLoading(false); 
      }
    } catch (e) { 
      alert("Error processing file"); 
      setLoading(false); 
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setResultUrl(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/enhance-video", formData);
      if (response.data.status === "success") {
        setResultUrl(`https://vaniconnect-vaniconnect-api.hf.space${response.data.file_url}`);
      }
    } catch (error) { alert("Error"); } finally { setLoading(false); }
  };

  const handleYTDownload = async () => {
    if (!ytUrl) return;
    setLoading(true);
    setResultUrl(null);
    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/yt-download", { url: ytUrl, quality: ytQuality });
      if (response.data && response.data.job_id) {
        checkJobStatus(response.data.job_id);
      } else { alert("No job ticket!"); setLoading(false); }
    } catch (e) { alert("Error downloading YouTube video"); setLoading(false); }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddLogoProcess = async () => {
    if (!selectedFile || !selectedLogo) {
      alert("Please select both a video and a logo!");
      return;
    }
    setLoading(true);
    setResultUrl(null);
    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("logo", selectedLogo);
    formData.append("x", logoX);
    formData.append("y", logoY);
    formData.append("w", logoW);

    try {
      const response = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/add-logo", formData);
      if (response.data && response.data.job_id) {
        checkJobStatus(response.data.job_id);
      } else {
        alert("Backend did not return a job ticket!");
        setLoading(false);
      }
    } catch (e) { 
      const errorMsg = e.response && e.response.data ? JSON.stringify(e.response.data) : e.message;
      alert(`Real Error: ${errorMsg}`);
      setLoading(false); 
    }
  };

  if (activeTool === "YouTube Downloader") {
    const ytId = ytUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];

    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setYtUrl(''); }} className="flex items-center text-red-600 font-bold mb-8"><ArrowLeft className="mr-2" /> Back</button>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center">
          <div className="bg-red-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Youtube size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8">YouTube Downloader</h2>

          {!loading && !resultUrl && (
            <div className="mb-8 max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Paste YouTube Link Here (https://...)" 
                value={ytUrl} 
                onChange={(e) => setYtUrl(e.target.value)} 
                className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 mb-6 text-lg font-mono"
              />

              {ytId && (
                <div className="mb-8 animate-in slide-in-from-bottom-4 duration-300">
                  <img 
                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                    alt="YouTube Thumbnail" 
                    className="w-full rounded-xl shadow-md mb-6 border-4 border-gray-100"
                  />
                  <div className="text-left bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Download Quality:</label>
                    <select 
                      value={ytQuality} 
                      onChange={(e) => setYtQuality(e.target.value)} 
                      className="w-full p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-red-500 font-bold text-gray-800"
                    >
                      <option value="best">1. Highest Quality (1080p/4K - Slower)</option>
                      <option value="720p">2. High Quality (720p - Fast)</option>
                      <option value="480p">3. Standard Quality (480p)</option>
                      <option value="audio">4. Audio Only (MP3 format)</option>
                    </select>
                  </div>
                </div>
              )}

              <button onClick={handleYTDownload} disabled={!ytUrl} className="px-10 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition disabled:opacity-50">
                Download Now
              </button>
            </div>
          )}

          {loading && <div className="py-10"><Loader2 size={48} className="text-red-500 animate-spin mx-auto mb-4" /><p className="font-bold text-gray-700">Downloading your video...</p></div>}

          {resultUrl && !loading && (
            <div className="animate-in zoom-in duration-300 mt-8">
              <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 font-bold max-w-md mx-auto border border-green-200">✅ File Ready for Download!</div>
              {ytId && <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="Thumbnail" className="max-w-md mx-auto rounded-xl shadow-lg mb-6 border-4 border-gray-800" />}
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-red-600 text-lg"><Download className="mr-2" /> Save File to Computer</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Add Custom Logo") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setSelectedLogo(null); setPreviewUrl(null); setLogoPreview(null); }} className="flex items-center text-blue-600 font-bold mb-8">
          <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-10">
          <div className="bg-indigo-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Stamp size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8 text-center">Video Branding Tool</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="p-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 text-center">
              <Video size={32} className="mx-auto mb-2 text-indigo-500" />
              <p className="font-bold">1. Select Video</p>
              <input type="file" className="mt-2" accept="video/*" onChange={handleFileSelect} />
              {selectedFile && <p className="text-green-600 text-xs mt-2">✓ {selectedFile.name}</p>}
            </div>
            <div className="p-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 text-center">
              <Image size={32} className="mx-auto mb-2 text-indigo-500" />
              <p className="font-bold">2. Select Logo (PNG)</p>
              <input type="file" className="mt-2" accept="image/png" onChange={handleLogoSelect} />
              {selectedLogo && <p className="text-green-600 text-xs mt-2">✓ {selectedLogo.name}</p>}
            </div>
          </div>

          {selectedFile && selectedLogo && previewUrl && logoPreview && !loading && !resultUrl && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center animate-in fade-in">
              <h4 className="font-bold text-gray-700 mb-4">Live Logo Preview</h4>
              <div className="relative inline-block w-full max-w-2xl mx-auto overflow-hidden bg-gray-900 rounded-xl shadow-md border-4 border-gray-800">
                <video 
                  src={`${previewUrl}#t=0.1`} 
                  controls
                  className="w-full h-auto block opacity-80"
                  onLoadedData={(e) => {
                    const scale = e.target.clientWidth / e.target.videoWidth;
                    if (scale > 0 && scale < 10) {
                      setVideoScale(scale);
                    }
                  }}
                />
                <div 
                  className="absolute transition-all duration-75 ease-linear pointer-events-none"
                  style={{ left: `${logoX * videoScale}px`, top: `${logoY * videoScale}px`, width: `${logoW * videoScale}px` }}
                >
                  <img src={logoPreview} alt="Logo" className="w-full h-auto drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Play the video to find a good frame, then adjust the numbers below.</p>
            </div>
          )}

          {selectedFile && selectedLogo && !loading && !resultUrl && (
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mb-8 animate-in fade-in">
              <h4 className="font-bold text-indigo-800 mb-4 text-center">Set Logo Position & Size</h4>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">X Position (Left to Right)</label>
                  <input type="number" value={logoX} onChange={(e) => setLogoX(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Y Position (Top to Bottom)</label>
                  <input type="number" value={logoY} onChange={(e) => setLogoY(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Logo Width</label>
                  <input type="number" value={logoW} onChange={(e) => setLogoW(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            </div>
          )}

          {selectedFile && selectedLogo && !loading && !resultUrl && (
            <div className="text-center">
              <button onClick={handleAddLogoProcess} className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg">Start Branding Video</button>
            </div>
          )}

          {loading && <div className="text-center py-10"><Loader2 size={48} className="text-indigo-500 animate-spin mx-auto mb-4" /><p className="text-xl font-bold">Merging...</p></div>}
          
          {resultUrl && (
            <div className="mt-10 text-center">
              <video src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} controls className="w-full max-h-96 rounded-xl shadow-lg mb-6" />
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center"><Download className="mr-2" /> Download Branded Video</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Background Remover") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button 
          onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setPreviewUrl(null); }} 
          className="flex items-center text-pink-600 font-bold mb-8 hover:text-pink-700 transition"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center">
          <div className="bg-pink-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <UserX size={32} color="white" />
          </div>
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Background Remover</h2>
          
          {!selectedFile && !loading && !resultUrl && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-pink-300 rounded-xl bg-pink-50 cursor-pointer hover:bg-pink-100 transition">
              <UploadCloud size={48} className="text-pink-500 mb-4" />
              <span className="font-bold text-gray-700">Upload Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            </label>
          )}
          
          {selectedFile && !loading && !resultUrl && (
            <div className="animate-in fade-in duration-300">
              <img src={previewUrl} className="max-h-64 mx-auto mb-6 rounded-xl shadow-md border-4 border-gray-100" alt="Preview" />
              <button 
                onClick={handleBgRemoveProcess} 
                className="px-10 py-4 bg-pink-500 text-white font-bold rounded-xl shadow-lg hover:bg-pink-600 transition-transform active:scale-95 text-lg"
              >
                Remove Background
              </button>
            </div>
          )}
          
          {loading && (
            <div className="py-12 animate-in fade-in">
              <Loader2 size={56} className="text-pink-500 animate-spin mx-auto mb-4" />
              <p className="font-bold text-gray-700 text-lg">AI is cutting out the background...</p>
            </div>
          )}
          
          {resultUrl && !loading && (
            <div className="animate-in zoom-in duration-300 w-full mt-4">
              <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-8 font-bold max-w-sm mx-auto border border-green-200 shadow-sm">
                ✅ Background Removed!
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="flex flex-col items-center bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-sm">Before (Original)</span>
                  <img src={previewUrl} className="w-full max-h-72 object-contain rounded-xl shadow-sm border border-gray-200" alt="Original Photo" />
                </div>
                
                <div className="flex flex-col items-center bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-sm">After (Transparent)</span>
                  <div className="w-full h-full min-h-[18rem] flex items-center justify-center rounded-xl shadow-inner border border-gray-300 overflow-hidden relative" style={{ backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px', backgroundColor: '#f9fafb' }}>
                    <img src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} className="max-w-full max-h-72 object-contain drop-shadow-2xl" alt="Transparent Photo" />
                  </div>
                </div>
              </div>

              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-pink-500 text-white px-10 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-pink-600 transition-transform active:scale-95 text-lg">
                <Download className="mr-2" /> Download Transparent PNG
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Photo Enhancer") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setPreviewUrl(null); }} className="flex items-center text-green-600 font-bold mb-8"><ArrowLeft className="mr-2" /> Back</button>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center">
          <div className="bg-green-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Image size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8">Photo Enhancer</h2>
          
          {!selectedFile && !loading && !resultUrl && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl bg-green-50 cursor-pointer"><UploadCloud size={48} className="text-green-500 mb-4" /><input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} /></label>
          )}
          
          {selectedFile && !loading && !resultUrl && (
            <div>
              <img src={previewUrl} className="max-h-64 mx-auto mb-6 rounded-xl shadow" />
              <div className="mb-8 max-w-sm mx-auto text-left">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Enhancement Style:</label>
                <select value={enhanceStyle} onChange={(e) => setEnhanceStyle(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 font-bold text-gray-700 transition">
                  <option value="Auto Color Fix">1. Auto Color Fix (Standard)</option>
                  <option value="Sharpen & Clarify">2. Sharpen & Clarify (For Blurry Photos)</option>
                  <option value="HDR Portrait">3. HDR Portrait (Studio Lighting)</option>
                </select>
              </div>
              <button onClick={handlePhotoEnhanceProcess} className="px-10 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-transform active:scale-95">Start Enhancing</button>
            </div>
          )}
          
          {loading && <div className="py-10"><Loader2 size={48} className="text-green-500 animate-spin mx-auto mb-4" /><p className="font-bold text-gray-700">AI is enhancing your photo...</p></div>}
          
          {resultUrl && !loading && (
            <div className="animate-in zoom-in duration-300">
              <img src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} className="max-h-96 mx-auto mb-6 rounded-xl shadow-lg border-4 border-gray-100" />
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-green-600"><Download className="mr-2" /> Download Photo</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Photo Watermark Remover") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setPreviewUrl(null); }} className="flex items-center text-teal-600 font-bold mb-8"><ArrowLeft className="mr-2" /> Back</button>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center">
          <div className="bg-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Eraser size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8">Photo Watermark Remover</h2>

          {!selectedFile && !loading && !resultUrl && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl bg-teal-50 cursor-pointer hover:bg-teal-100 transition"><UploadCloud size={48} className="text-teal-500 mb-4" /><span className="font-bold text-gray-700">Upload Photo</span><input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} /></label>
          )}

          {selectedFile && !loading && !resultUrl && (
            <div>
              <div className="relative inline-block mx-auto mb-8 bg-gray-900 rounded-xl shadow-lg border-4 border-gray-800">
                <img
                  src={previewUrl}
                  className="max-h-96 block"
                  onLoad={(e) => {
                    const scale = e.target.clientWidth / e.target.naturalWidth;
                    if (scale > 0 && scale < 10) setVideoScale(scale);
                  }}
                />
                <div
                  className="absolute border-4 border-red-500 bg-red-500/40 transition-all duration-75 pointer-events-none z-10"
                  style={{ left: `${(wmX || 0) * videoScale}px`, top: `${(wmY || 0) * videoScale}px`, width: `${(wmW || 50) * videoScale}px`, height: `${(wmH || 50) * videoScale}px` }}
                ></div>
              </div>

              <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 mb-8 max-w-2xl mx-auto">
                <h4 className="font-bold text-teal-800 mb-4">Adjust the Target</h4>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">X Position</label><input type="number" value={wmX} onChange={e=>setWmX(Number(e.target.value))} className="w-full p-2 border rounded font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Y Position</label><input type="number" value={wmY} onChange={e=>setWmY(Number(e.target.value))} className="w-full p-2 border rounded font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Width</label><input type="number" value={wmW} onChange={e=>setWmW(Number(e.target.value))} className="w-full p-2 border rounded font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Height</label><input type="number" value={wmH} onChange={e=>setWmH(Number(e.target.value))} className="w-full p-2 border rounded font-mono" /></div>
                </div>
                
                <div className="text-left max-w-sm mx-auto">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Inpaint Style:</label>
                  <select value={wmStyle} onChange={(e) => setWmStyle(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-teal-500 font-bold text-gray-700">
                    <option value="Standard AI Inpaint">Standard AI Inpaint</option>
                    <option value="Advanced Texture Synthesis">Advanced Texture Synthesis</option>
                  </select>
                </div>
              </div>

              <button onClick={handlePhotoWatermarkProcess} className="px-10 py-4 bg-teal-500 text-white font-bold rounded-xl shadow-lg hover:bg-teal-600 transition">Remove Watermark</button>
            </div>
          )}

          {loading && <div className="py-10"><Loader2 size={48} className="text-teal-500 animate-spin mx-auto mb-4" /><p className="font-bold text-gray-700">AI is erasing the watermark...</p></div>}

          {resultUrl && !loading && (
            <div className="animate-in zoom-in duration-300 mt-8">
              <img src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} className="max-h-96 mx-auto mb-6 rounded-xl shadow-lg border-4 border-gray-100" />
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-teal-500 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-teal-600"><Download className="mr-2" /> Download Photo</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Video Watermark Remover") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setPreviewUrl(null); }} className="flex items-center text-amber-600 font-bold mb-8"><ArrowLeft className="mr-2" /> Back</button>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center">
          <div className="bg-amber-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Video size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8">Video Watermark Remover</h2>
          
          {!selectedFile && !loading && !resultUrl && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl bg-amber-50 cursor-pointer hover:bg-amber-100 transition"><UploadCloud size={48} className="text-amber-500 mb-4" /><span className="font-bold text-gray-700">Upload Video</span><input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} /></label>
          )}
          
          {selectedFile && !loading && !resultUrl && (
            <div>
              <div className="relative inline-block mx-auto mb-8 bg-black rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                <video src={`${previewUrl}#t=0.1`} controls className="w-full max-h-96 block opacity-90" onLoadedData={(e) => { const scale = e.target.clientHeight / e.target.videoHeight; if (scale > 0 && scale < 10) setVideoScale(scale); }} />
                <div className="absolute border-4 border-red-500 bg-red-500/30 transition-all duration-75 pointer-events-none" style={{ left: `${wmX * videoScale}px`, top: `${wmY * videoScale}px`, width: `${wmW * videoScale}px`, height: `${wmH * videoScale}px` }}></div>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-8 max-w-2xl mx-auto">
                <h4 className="font-bold text-amber-800 mb-4">Adjust the Red Target Box</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">X Position (Left)</label><input type="number" value={wmX} onChange={e=>setWmX(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-amber-400 font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Y Position (Top)</label><input type="number" value={wmY} onChange={e=>setWmY(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-amber-400 font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Width</label><input type="number" value={wmW} onChange={e=>setWmW(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-amber-400 font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Height</label><input type="number" value={wmH} onChange={e=>setWmH(Number(e.target.value))} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-amber-400 font-mono" /></div>
                </div>
              </div>
              <button onClick={handleWatermarkProcess} className="px-10 py-4 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-transform active:scale-95">Erase Watermark inside Box</button>
            </div>
          )}
          
          {loading && <div className="py-10"><Loader2 size={48} className="text-amber-500 animate-spin mx-auto mb-4" /><p className="font-bold text-gray-700">Erasing watermark...</p></div>}
          
          {resultUrl && !loading && (
            <div className="animate-in zoom-in duration-300">
              <video src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} controls className="w-full max-h-96 mx-auto mb-6 rounded-xl shadow-lg border-4 border-gray-100 bg-black" />
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-amber-600"><Download className="mr-2" /> Download Video</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Video Enhancer") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setPreviewUrl(null); }} className="flex items-center text-blue-600 font-bold mb-8">
          <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
        </button>
        
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center animate-in fade-in">
          <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Wand2 size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8">Video Enhancer</h2>
          
          {!selectedFile && !loading && !resultUrl && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition">
              <UploadCloud size={48} className="text-blue-500 mb-4" />
              <span className="font-bold text-gray-700">Upload Video to Enhance</span>
              <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
            </label>
          )}

          {selectedFile && !loading && !resultUrl && (
            <div>
              <video src={previewUrl} controls className="max-h-64 mx-auto mb-6 rounded-xl shadow-md bg-black" />
              <button onClick={handleVideoEnhanceProcess} className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-transform active:scale-95">Start AI Enhancement</button>
            </div>
          )}

          {loading && (
            <div className="py-10">
              <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-700">AI is processing frames...</p>
              <p className="text-sm text-gray-500 mt-2">Balancing lighting and sharpness. This takes a moment.</p>
            </div>
          )}

          {resultUrl && !loading && (
            <div className="mt-8 animate-in zoom-in duration-300">
              <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full inline-block font-bold mb-6">✨ Enhancement Complete!</div>
              <video src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} controls className="w-full max-h-96 mx-auto mb-6 rounded-xl shadow-lg border-4 border-gray-100 bg-black" />
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-blue-700">
                <Download className="mr-2" /> Download Enhanced Video
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === "Clip Cut Pro Editor") {
    return (
      <div className="min-h-screen bg-gray-50 p-10 font-sans">
        <button onClick={() => { setActiveTool(null); setResultUrl(null); setSelectedFile(null); setPreviewUrl(null); }} className="flex items-center text-purple-600 font-bold mb-8">
          <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
        </button>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-10 text-center animate-in fade-in">
          <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"><Scissors size={32} color="white" /></div>
          <h2 className="text-3xl font-bold mb-8">Clip Cut Pro Editor</h2>
          
          {!selectedFile && !loading && !resultUrl && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50 cursor-pointer hover:bg-purple-100 transition">
              <UploadCloud size={48} className="text-purple-500 mb-4" />
              <span className="font-bold text-gray-700">Upload Video to Edit</span>
              <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
            </label>
          )}

          {selectedFile && !loading && !resultUrl && (
            <div>
              <video src={previewUrl} controls className="w-full max-h-96 mx-auto mb-6 rounded-xl shadow-md bg-black" />
              
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 mb-8 max-w-2xl mx-auto">
                <h4 className="font-bold text-purple-800 mb-4 text-left">Editing Controls</h4>
                <div className="mb-6 text-left">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Professional Text Overlay</label>
                  <input type="text" value={overlayText} onChange={(e) => setOverlayText(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Start Time (sec)</label><input type="number" step="0.1" value={trimStart} onChange={(e) => setTrimStart(Number(e.target.value))} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">End Time (sec)</label><input type="number" step="0.1" value={trimEnd} onChange={(e) => setTrimEnd(Number(e.target.value))} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400" /></div>
                </div>
              </div>

              <button 
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  formData.append("file", selectedFile);
                  formData.append("start", trimStart);
                  formData.append("end", trimEnd);
                  formData.append("text", overlayText); 
                  
                  try {
                    const res = await axios.post("https://vaniconnect-vaniconnect-api.hf.space/api/Clip Cut Pro-edit", formData);
                    if (res.data && res.data.job_id) {
                      checkJobStatus(res.data.job_id);
                    } else {
                      alert("Backend did not return a job ticket!");
                      setLoading(false);
                    }
                  } catch (e) {
                    const errorMsg = e.response && e.response.data ? JSON.stringify(e.response.data) : e.message;
                    alert(`Real Error: ${errorMsg}`);
                    setLoading(false);
                  }
                }} 
                className="px-10 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition"
              >
                Trim & Add Text
              </button>
            </div>
          )}

          {loading && (
            <div className="py-10">
              <Loader2 size={48} className="text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-700">Rendering Video...</p>
              <p className="text-sm text-gray-500 mt-2">Slicing clip and burning in text overlay.</p>
            </div>
          )}

          {resultUrl && !loading && (
            <div className="mt-8 animate-in zoom-in duration-300">
              <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full inline-block font-bold mb-6">✨ Video Edited Successfully!</div>
              <video src={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} controls className="w-full max-h-96 mx-auto mb-6 rounded-xl shadow-lg bg-black" />
              <a href={resultUrl.startsWith('http') ? resultUrl : `https://vaniconnect-vaniconnect-api.hf.space${resultUrl}`} download className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center shadow-lg hover:bg-purple-700">
                <Download className="mr-2" /> Download Final Video
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gray-50 text-gray-900 p-10 font-sans">
<div className="mb-12 text-center mt-10">
<h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">VaniConnect Studio</h1>
<p className="text-gray-500 text-lg font-medium">Your all-in-one automated workspace for processing media files.</p>
</div>

  {/* Trust & Safety Badge */}
  <div className="mb-10 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-full text-sm font-medium mx-auto max-w-fit shadow-sm">
    <span>🔒 <strong>Enterprise Security:</strong> All uploads are encrypted and auto-deleted after 24 hours.</span>
  </div>

  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {tools.map((tool, index) => (
      <div key={index} onClick={() => setActiveTool(tool.name)} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
        <div className={`${tool.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>{tool.icon}</div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">{tool.name}</h2>
        <p className="text-gray-500 font-medium text-sm">{tool.desc}</p>
      </div>
    ))}
  </div>
</div>
);
}