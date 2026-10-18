// frontend/src/components/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import BrandLogo from './BrandLogo';

export default function SplashScreen({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 1400);
    const doneTimer = setTimeout(() => onComplete(), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-stone-100 transition-opacity duration-500 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-amber-200/50 shadow-xl">
        <BrandLogo size="lg" animated={true} />
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-stone-900">
          জমি সার্চ <span className="text-amber-700 font-semibold">(JomiSearch)</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-stone-600">
          প্রাক-ক্রয় ভূমি যাচাই সহকারী • Smart Land Due Diligence
        </p>
        <div className="mt-5 w-48 h-1.5 bg-amber-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}