import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
// 🌟 1. ADD THE GOOGLE IMPORT HERE
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🌟 2. WRAP WITH GOOGLE FIRST (Paste your actual Client ID here!) */}
    <GoogleOAuthProvider clientId="541943517991-d8j85ddaeh868hpr7pgh81g746cu0f2i.apps.googleusercontent.com">
      
      {/* 🌟 3. Keep your HelmetProvider safely inside! */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
      
    </GoogleOAuthProvider>
  </StrictMode>,
)