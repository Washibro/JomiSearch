// frontend/src/components/InfoTooltip.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useLanguage, CITIZEN_TOOLTIPS } from '../context/LanguageContext';

export default function InfoTooltip({ termKey }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useLanguage();
  const info = CITIZEN_TOOLTIPS[termKey];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!info) return null;

  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Citizen Guidance Info"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors text-xs font-bold"
      >
        <Info className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-amber-300/70 shadow-lg z-40 text-left">
          <p className="text-xs font-bold text-amber-900 mb-1">{t(info.title)}</p>
          <p className="text-xs leading-relaxed text-stone-700 font-normal">{t(info.desc)}</p>
        </div>
      )}
    </span>
  );
}