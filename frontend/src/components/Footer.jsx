// frontend/src/components/Footer.jsx
import React from 'react';
import { ExternalLink, Mail, Phone, ShieldCheck } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 bg-white/80 backdrop-blur-md border-t border-amber-200/60 text-stone-700 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Mission */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <BrandLogo size="md" />
            <span className="text-lg font-bold text-stone-900">
              {t({ bn: 'জমি সার্চ (JomiSearch)', en: 'JomiSearch' })}
            </span>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            {t({
              bn: 'বাংলাদেশে একজন সাধারণ নাগরিক জমি কেনার পূর্বে যাতে খতিয়ান, দলিল, নামজারি ও খাজনার ধারাবাহিকতা এবং সম্ভাব্য তথ্যগত অমিল এক জায়গায় সহজে যাচাই করতে পারেন—সেজন্য নির্মিত প্রাক-ক্রয় সহায়ক প্ল্যাটফর্ম।',
              en: 'A citizen-friendly pre-purchase land due-diligence assistant designed to help prospective buyers cross-check Khatians, deeds, mutations, and land tax continuity in one place.'
            })}
          </p>
        </div>

        {/* Column 2: Official Govt Portal Links */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
            {t({ bn: 'অফিসিয়াল সরকারি ভূমি পোর্টালসমূহ', en: 'Official Land Portals' })}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://eporcha.gov.bd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-600 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t({ bn: 'ই-পর্চা (e-Porcha) — খতিয়ান অনুসন্ধান', en: 'e-Porcha — Official Khatian Portal' })}</span>
              </a>
            </li>
            <li>
              <a
                href="https://dlrms.land.gov.bd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-600 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t({ bn: 'ডিএলআরএমএস (DLRMS) — ডিজিটাল ভূমি রেকর্ড', en: 'DLRMS — Digital Land Record System' })}</span>
              </a>
            </li>
            <li>
              <a
                href="https://minland.gov.bd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-600 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t({ bn: 'ভূমি মন্ত্রণালয় (Ministry of Land)', en: 'Ministry of Land, Bangladesh' })}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Citizen Support */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
            {t({ bn: 'নাগরিক সহায়তা ও যোগাযোগ', en: 'Citizen Support & Contact' })}
          </h3>
          <div className="space-y-2 text-sm text-stone-600">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-700" />
              <span>support@jomisearch.bd</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-700" />
              <span>{t({ bn: 'হেল্পলাইন: +৮৮০ ১৯০০-০০০০০০ (ডেমো)', en: 'Helpline: +880 1900-000000 (Demo)' })}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal Disclaimer Strip */}
      <div className="bg-amber-50/70 border-t border-amber-200/50 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
          <p className="flex items-center gap-1.5 font-medium text-stone-700">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {t({
                bn: 'আইনি ডিসক্লেইমার: JomiSearch একটি স্বাধীন প্রি-পারচেজ অ্যাসিস্ট্যান্ট এবং কোনো সরকারি মালিকানা সনদ নয়। সকল ডেটা ডেমো ও শিক্ষামূলক প্রোটোটাইপের অংশ।',
                en: 'Legal Disclaimer: JomiSearch is an independent pre-purchase due-diligence assistant and NOT an official government ownership certificate.'
              })}
            </span>
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} JomiSearch Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}