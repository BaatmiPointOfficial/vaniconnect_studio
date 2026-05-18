import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords }) {
  return (
    <Helmet>
      {/* Standard Google Meta Tags */}
      <title>{title} | Clipeto Studio</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Social Media Sharing Tags (Makes links look beautiful on WhatsApp/Twitter) */}
      <meta property="og:title" content={`${title} | Clipeto Studio`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}