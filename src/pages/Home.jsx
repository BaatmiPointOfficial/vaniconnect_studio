import SEO from '../components/SEO';
import React from 'react';
import { Link } from 'react-router-dom';
import { DownloadCloud, Eraser, Sparkles, Film, Scissors, Layers, ArrowRight, Clock, Download } from 'lucide-react'; // Updated icons!

<SEO 
  title="Clipeto Studio | Local AI Media Tools"
  description="Create with pure focus. A harmonious suite of local AI media tools designed to help you process, clean, and enhance your content with less stress."
  keywords="ai media tools, local ai, video enhancer, photo enhancer, background remover, vaniconnect studio"
/>

export default function Home() {
  const tools = [
    {
      title: "Universal Downloader",
      desc: "Extract high-quality MP4 video and MP3 audio directly from YouTube, Instagram Reels, TikTok, and X.",
      icon: <DownloadCloud size={24} />,
      link: "/studio/youtube-downloader", // Keeping your original links to avoid breaking routing!
      color: "text-purple-600",
      bgHover: "hover:bg-purple-50",
      borderHover: "group-hover:border-purple-300"
    },
    {
      title: "Video Watermark",
      desc: "Protect your original content. Auto-stamp your custom logo onto photos and videos with coordinate precision.",
      icon: <Eraser size={24} />, 
      link: "/studio/video-watermark",
      color: "text-rose-500",
      bgHover: "hover:bg-rose-50",
      borderHover: "group-hover:border-rose-300"
    },
    {
      title: "Photo Enhancer",
      desc: "Rescue blurry images. Run local neural networks to upscale resolution, restore details, and sharpen faces.",
      icon: <Sparkles size={24} />,
      link: "/studio/photo-enhancer",
      color: "text-emerald-500",
      bgHover: "hover:bg-emerald-50",
      borderHover: "group-hover:border-emerald-300"
    },
    {
      title: "Video Polish Engine",
      desc: "Mathematically enhance video frames. Auto-correct poor lighting, boost contrast, and sharpen blurry footage.",
      icon: <Film size={24} />,
      link: "/studio/video-enhancer",
      color: "text-amber-500",
      bgHover: "hover:bg-amber-50",
      borderHover: "group-hover:border-amber-300"
    },
    {
      title: "Background Studio",
      desc: "AI-powered background removal. Isolate subjects instantly and drop them into crisp, professional studio colors.",
      icon: <Layers size={24} />,
      link: "/studio/bg-remover",
      color: "text-pink-500",
      bgHover: "hover:bg-pink-50",
      borderHover: "group-hover:border-pink-300"
    },
    {
      title: "Clip Cut Pro",
      desc: "Precision video trimming and batch splitting. Effortlessly chop long podcasts or speeches into viral shorts.",
      icon: <Scissors size={24} />,
      link: "/studio/clip-cut-pro",
      color: "text-indigo-500",
      bgHover: "hover:bg-indigo-50",
      borderHover: "group-hover:border-indigo-300"
    }
  ];

  return (
    <div className="pt-10 pb-24 px-6 md:px-12 max-w-7xl mx-auto h-full flex flex-col">
      
      {/* Hero Section */}
      <div className="text-center mb-16 mt-8">
        <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm mb-6">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-600">Clipeto Studio 1.0</span> {/* Updated to 1.0 per our freeze! */}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
          Create with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">pure focus.</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          A harmonious suite of local AI media tools. Designed to help you extract, clean, and enhance your content with zero cloud-lag and less stress.
        </p>
      </div>

      {/* The Launchpad Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Link 
            key={index} 
            to={tool.link}
            className={`group bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${tool.bgHover}`}
          >
            <div className={`w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${tool.color} border border-transparent ${tool.borderHover}`}>
              {tool.icon}
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
              {tool.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
              {tool.desc}
            </p>
            <div className={`flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300 ${tool.color}`}>
              Launch Tool <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

     {/* 🌟 RECENT ACTIVITY SECTION (Mobile Optimized) */}
      <div className="mt-12 md:mt-16 mb-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 px-1 sm:px-2">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2 truncate">
            <Clock size={20} className="text-slate-400 flex-shrink-0" /> 
            <span className="truncate">Recent Files</span>
          </h2>
          <button className="text-xs md:text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors whitespace-nowrap ml-2">
            View All
          </button>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col gap-1">
          
          {/* Recent Item 1 */}
          <div className="flex items-center justify-between p-3 md:p-4 hover:bg-white/60 rounded-xl md:rounded-2xl transition-all cursor-pointer group">
            {/* The min-w-0 and flex-1 are the magic tricks here! */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center border border-purple-200">
                <DownloadCloud size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-800 mb-0.5 truncate">Podcast_Interview_4K.mp4</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate">Universal Downloader • 2 mins ago</p>
              </div>
            </div>
            <button className="flex-shrink-0 ml-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-purple-600 shadow-sm border border-white group-hover:border-purple-200 transition-all hover:scale-105">
              <Download size={18} />
            </button>
          </div>

          {/* Recent Item 2 */}
          <div className="flex items-center justify-between p-3 md:p-4 hover:bg-white/60 rounded-xl md:rounded-2xl transition-all cursor-pointer group">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center border border-rose-200">
                <Eraser size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-800 mb-0.5 truncate">Drone_Footage_Clean.mov</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate">Video Watermark • 3 hours ago</p>
              </div>
            </div>
            <button className="flex-shrink-0 ml-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-rose-500 shadow-sm border border-white group-hover:border-rose-200 transition-all hover:scale-105">
              <Download size={18} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}