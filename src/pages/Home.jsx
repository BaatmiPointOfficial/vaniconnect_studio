import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Download, Scissors, Image, MonitorPlay, Mic } from 'lucide-react';

export default function Home() {
  const features = [
    { id: "watermark-remover", name: "Watermark Remover", desc: "Clean up your videos by intelligently removing unwanted logos and text in seconds.", icon: <Wand2 size={24} className="text-purple-600" />, bg: "bg-purple-100" },
    { id: "youtube-downloader", name: "YouTube Downloader", desc: "Download CC-licensed videos directly in 4K resolution without leaving the browser.", icon: <Download size={24} className="text-blue-600" />, bg: "bg-blue-100" },
    { id: "video-enhancer", name: "4K Video Enhancer", desc: "Turn blurry, low-quality clips into crystal clear, DSLR-level footage using AI upscaling.", icon: <MonitorPlay size={24} className="text-green-600" />, bg: "bg-green-100" },
    { id: "background-remover", name: "Background Remover", desc: "Instantly cut out subjects from photos and videos with pixel-perfect accuracy.", icon: <Image size={24} className="text-pink-600" />, bg: "bg-pink-100" },
    { id: "clip-cut-pro", name: "Clip Cut Pro", desc: "Trim, split, and merge your media files with our lightning-fast browser editor.", icon: <Scissors size={24} className="text-yellow-600" />, bg: "bg-yellow-100" },
    { id: "audio-cleaner", name: "Audio Cleaner", desc: "Remove background noise and enhance voice clarity for studio-quality sound.", icon: <Mic size={24} className="text-indigo-600" />, bg: "bg-indigo-100" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* 📱 HERO SECTION: Optimized padding and text sizes for mobile */}
      <div className="pt-12 pb-12 md:pt-24 md:pb-16 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight leading-tight">
          Next-Generation <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Media Processing</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium mb-8 md:mb-10 max-w-2xl mx-auto px-2">
          VaniConnect AI provides high-speed automated tools for video enhancement, watermark removal, and intelligent media editing.
        </p>
        
        {/* 📱 BUTTON: Full width on mobile (easier to tap), normal on laptop */}
        <Link to="/studio" className="block w-full sm:w-auto sm:inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Enter AI Studio
        </Link>
      </div>

      {/* 📱 VISUAL FEATURES GRID: Tighter padding on mobile */}
      <div className="bg-gray-50 py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Everything you need to create faster</h2>
            <p className="text-gray-500 text-base md:text-lg">An entire production studio packed into one simple dashboard.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Link 
                to={`/tool/${feature.id}`} 
                key={index} 
                className="block bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className={`${feature.bg} w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.name}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}