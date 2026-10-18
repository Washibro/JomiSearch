// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ShieldAlert } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ onOpenQrModal }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 no-print">
      {/* Main Frosted Glass Navbar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-amber-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-stone-900 tracking-tight group-hover:text-amber-700 transition-colors">
                  {lang === 'bn' ? 'জমি সার্চ' : 'JomiSearch'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300/60">
                  MVP 2.0
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {t({
                  bn: 'প্রাক-ক্রয় ভূমি রেকর্ড ও দলিল যাচাই সহকারী',
                  en: 'Citizen Pre-Purchase Land Due-Diligence Assistant'
                })}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenQrModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/70 text-sm font-semibold transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>{t({ bn: 'QR দলিল যাচাই', en: 'Scan Document QR' })}</span>
            </button>

            {/* Language Switcher [ বাংলা | English ] */}
            <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'bn'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Notice Ticker (Marquee) */}
      <div className="bg-amber-100/80 backdrop-blur-sm border-b border-amber-200/70 overflow-hidden py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600 text-white text-xs font-bold shrink-0 z-10">
            <ShieldAlert className="w-3.5 h-3.5" />
            {t({ bn: 'নাগরিক নোটিশ', en: 'Citizen Notice' })}
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="inline-block animate-marquee text-xs font-medium text-stone-800">
              {t({
                bn: 'জরুরি নাগরিক নোটিশ: জমি কেনার আগে স্বচক্ষে মূল দলিল, পর্চা ও সরেজমিন দখল যাচাই করুন • JomiSearch কোনো সরকারি কর্তৃপক্ষ নয় এবং কোনো অফিসিয়াল মালিকানা সনদ প্রদান করে না • তথ্যের অমিল পাওয়া গেলে সংশ্লিষ্ট সাব-রেজিস্ট্রি বা এসিল্যান্ড অফিসে সরাসরি যোগাযোগ করুন।',
                en: 'Important Citizen Notice: Always inspect original deeds, Khatians, and physical possession before purchasing land • JomiSearch is an independent pre-purchase assistant and does not issue legal ownership certificates • Verify any flagged discrepancies with the Sub-Registry or AC Land office.'
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}