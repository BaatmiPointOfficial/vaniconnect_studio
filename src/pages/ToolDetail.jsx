import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { toolsData } from '../data/toolsData';
import { Upload, ArrowLeft, ShieldCheck, FileVideo } from 'lucide-react';

export default function ToolDetail() {
  const { id } = useParams();
  const tool = toolsData[id];

  if (!tool) return <div className="text-center py-20 font-bold text-2xl text-gray-500">Tool not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* 🚀 Top Header Section */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to all tools
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">{tool.title}</h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">{tool.description}</p>
          </div>
        </div>
      </div>

      {/* 🛠️ The Split Workspace (Cutout.pro style) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* LEFT SIDE: The Upload Dropzone */}
            <Link to="/studio" className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-blue-300 rounded-3xl bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group">
              <div className="bg-white p-4 rounded-full shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-blue-600" />
              </div>
              
              <div className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition-all w-full sm:w-auto text-center mb-4">
                Upload Image or Video
              </div>
              
              <p className="text-sm text-gray-500 font-medium mb-1">or drop a file here</p>
              <p className="text-xs text-gray-400">CTRL+V to paste image or URL</p>

              {/* "Try one of these" Sample Images */}
              <div className="mt-8 flex items-center flex-wrap justify-center gap-3">
                <span className="text-sm text-gray-500 font-medium">No image? Try one of these:</span>
                <div className="flex gap-2">
                  <img src={`https://picsum.photos/seed/${id}1/100/100`} alt="sample" className="w-10 h-10 rounded-lg object-cover border border-gray-300 hover:border-blue-500 transition-colors" />
                  <img src={`https://picsum.photos/seed/${id}2/100/100`} alt="sample" className="w-10 h-10 rounded-lg object-cover border border-gray-300 hover:border-blue-500 transition-colors" />
                  <img src={`https://picsum.photos/seed/${id}3/100/100`} alt="sample" className="w-10 h-10 rounded-lg object-cover border border-gray-300 hover:border-blue-500 transition-colors" />
                </div>
              </div>
            </Link>

            {/* RIGHT SIDE: The Demo/Video Area */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center shadow-lg border border-gray-200 group cursor-pointer">
              
              {/* Simulated Before/After Background */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-gray-800 opacity-60 border-r-[3px] border-white"></div>
                <div className="w-1/2 h-full bg-gray-700 opacity-90"></div>
              </div>
              
              {/* Fake YouTube Play Button */}
              <div className="z-10 bg-red-600/90 group-hover:bg-red-600 w-16 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>

              {/* Floating Labels */}
              <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold absolute bottom-4 left-4 backdrop-blur-sm">Before</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold absolute bottom-4 right-4">After</span>
              
              <div className="absolute top-4 left-4 z-10 bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
                <FileVideo size={14} className="text-blue-600" /> Watch Tutorial
              </div>
            </div>

          </div>

          {/* Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 py-3 rounded-xl border border-gray-100">
             <ShieldCheck size={18} className="text-green-500" /> All uploads are heavily encrypted and deleted automatically after 24 hours.
          </div>

        </div>
      </div>

      {/* 🚀 Feature Grid Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why use our {tool.title}?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tool.features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 text-white font-extrabold text-xl shadow-inner`}>
                {index + 1}
              </div>
              <p className="font-bold text-gray-800 text-lg leading-snug">{feature}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}