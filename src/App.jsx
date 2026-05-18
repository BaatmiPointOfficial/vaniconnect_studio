import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import our new Master Layout
import Layout from './components/Layout.jsx';

// Import Pages
import Home from './pages/Home.jsx';
import Pricing from './pages/Pricing.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'; 
import TermsOfService from './pages/TermsOfService.jsx'; 
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import RefundPolicy from './pages/RefundPolicy';

// Import Studio Tools
import YoutubeDownloader from './pages/YoutubeDownloader.jsx';
import VideoWatermark from './pages/VideoWatermark.jsx';
import PhotoWatermark from './pages/PhotoWatermark';
import PhotoEnhancer from './pages/PhotoEnhancer';
import VideoEnhancer from './pages/VideoEnhancer';
import ClipCutPro from './pages/ClipCutPro';
import BackgroundRemover from './pages/BackgroundRemover';
import AddLogo from './pages/AddLogo';
export default function App() {
  return (
    <Router>
      {/* We wrap everything inside the new Layout so the Sidebar is always there! */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Just add the onUpgradeClick command right inside the Pricing tag! */}
<Route path="/subscription" element={<Pricing onUpgradeClick={() => setShowPaywall(true)} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} /> 
          <Route path="/terms" element={<TermsOfService />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/refund" element={<RefundPolicy />} />
          
          {/* Tool Routes */}
          <Route path="/studio/youtube-downloader" element={<YoutubeDownloader />} />
          <Route path="/studio/video-watermark" element={<VideoWatermark />} />
          <Route path="/studio/photo-watermark" element={<PhotoWatermark />} />
<Route path="/studio/photo-enhancer" element={<PhotoEnhancer />} />
<Route path="/studio/video-enhancer" element={<VideoEnhancer />} />
<Route path="/studio/clip-cut-pro" element={<ClipCutPro />} />
<Route path="/studio/bg-remover" element={<BackgroundRemover />} />
<Route path="/studio/add-logo" element={<AddLogo />} />
        </Routes>
      </Layout>
    </Router>
  );
}