// frontend/src/components/BrandLogo.jsx
import React from 'react';

export default function BrandLogo({ size = 'md', animated = false }) {
  const dimensions = size === 'lg' ? 'w-20 h-20' : 'w-11 h-11';

  return (
    <div className={`relative flex items-center justify-center ${dimensions} rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-white border border-amber-300/60 shadow-sm`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4/5 h-4/5 ${animated ? 'animate-pulse' : ''}`}
      >
        {/* Stylized Bangladesh Geographic Map Silhouette */}
        <path
          d="M26 7C29 7 32 10 34 12C37 14 43 13 46 16C48 19 45 24 46 28C47 32 52 35 52 40C52 46 49 53 45 56C42 58 40 52 38 48C35 45 31 47 28 50C25 53 21 55 18 52C15 49 16 42 15 37C14 32 10 29 11 24C12 19 17 17 20 14C22 11 23 7 26 7Z"
          fill="#FAEDCD"
          stroke="#C5A059"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Internal Survey Grid Lines */}
        <path d="M20 26H42M18 36H44M30 14V46" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        {/* Search Lens Overlaid on Map */}
        <circle
          cx="33"
          cy="31"
          r="10"
          fill="white"
          fillOpacity="0.85"
          stroke="#92400E"
          strokeWidth="2.8"
        />
        <path
          d="M40.5 38.5L49 47"
          stroke="#92400E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="33" cy="31" r="3.5" fill="#C5A059" />
      </svg>
    </div>
  );
}