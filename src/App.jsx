import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Studio from './pages/Studio'; 
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy'; // 👈 Added
import TermsOfService from './pages/TermsOfService'; // 👈 Added
import Contact from './pages/Contact';
import About from './pages/About';
import ToolDetail from './pages/ToolDetail';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} /> {/* 👈 Added */}
            <Route path="/terms" element={<TermsOfService />} /> {/* 👈 Added */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}