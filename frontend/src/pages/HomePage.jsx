// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, QrCode, ShieldAlert, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import InfoTooltip from '../components/InfoTooltip';

export default function HomePage({ onOpenQrModal }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [mouza, setMouza] = useState('');
  const [khatian, setKhatian] = useState('');
  const [dag, setDag] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLocations(data.locations);
      })
      .catch((err) => console.error(err));
  }, []);

  const districts = useMemo(
    () => [...new Set(locations.map((l) => l.district))],
    [locations]
  );

  const upazilas = useMemo(
    () =>
      [...new Set(locations.filter((l) => !district || l.district === district).map((l) => l.upazila))],
    [locations, district]
  );

  const mouzas = useMemo(
    () =>
      [
        ...new Set(
          locations
            .filter((l) => (!district || l.district === district) && (!upazila || l.upazila === upazila))
            .map((l) => l.mouza)
        )
      ],
    [locations, district, upazila]
  );

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);

    const params = new URLSearchParams();
    if (district) params.set('district', district);
    if (upazila) params.set('upazila', upazila);
    if (mouza) params.set('mouza', mouza);
    if (khatian) params.set('khatian_number', khatian);
    if (dag) params.set('dag_number', dag);

    try {
      const res = await fetch(`/api/lands?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.results.length > 0) {
        // প্রথম ম্যাচ করা প্লটে সরাসরি চলে যাবে
        navigate(`/land/${data.results[0].land.land_id}`);
      } else {
        setSearchError({
          bn: 'প্রদত্ত তথ্যের সাথে কোনো রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে সঠিক মৌজা বা দাগ নম্বর দিন।',
          en: 'No records found matching your query. Please verify the Mouza or Plot number.'
        });
      }
    } catch (_) {
      setSearchError({
        bn: 'সার্ভারের সাথে সংযোগ করা যায়নি।',
        en: 'Could not connect to the backend server.'
      });
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setDistrict('');
    setUpazila('');
    setMouza('');
    setKhatian('');
    setDag('');
    setSearchError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner & Ethical Disclaimer */}
      <section className="glass-card p-6 sm:p-8 bg-gradient-to-r from-amber-50/80 via-white/90 to-amber-100/40">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/70">
            🌾 {t({ bn: 'নাগরিক বান্ধব প্রাক-ক্রয় ভূমি যাচাই সহকারী', en: 'Smart Pre-Purchase Land Due-Diligence Assistant' })}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
            {t({
              bn: 'জমি কেনার আগে খতিয়ান, দলিল, নামজারি ও খাজনার ধারাবাহিকতা যাচাই করুন এক ক্লিকে',
              en: 'Verify Khatian, Deed, Mutation & Tax Continuity Before Buying Land'
            })}
          </h1>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            {t({
              bn: 'সিএস, এসএ, আরএস খতিয়ান, বায়া দলিল ও নামজারির দাগ নম্বর এবং পরিমাপের স্বয়ংক্রিয় তুলনা ও ৪-রঙা চেকলিস্ট বিশ্লেষণ।',
              en: 'Automated cross-document discrepancy detection, multi-unit land area normalization, and 4-color checklist analysis.'
            })}
          </p>
        </div>

        <div className="mt-5 p-3.5 rounded-xl bg-amber-100/70 border border-amber-300/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium text-stone-800">
            <strong>{t({ bn: 'গুরুত্বপূর্ণ ডিসক্লেইমার:', en: 'Official Disclaimer:' })}</strong>{' '}
            {t({
              bn: 'JomiSearch কোনো সরকারি কর্তৃপক্ষ নয় এবং কোনো মালিকানা সনদ প্রদান করে না। তথ্যের কোনো গরমিল শনাক্ত হলে ক্রয়ের পূর্বে সংশ্লিষ্ট সাব-রেজিস্ট্রি বা ভূমি অফিসে সরাসরি যাচাই করার পরামর্শ দেওয়া হচ্ছে।',
              en: 'JomiSearch is not a government authority and does not issue legal ownership certificates. If any variance is flagged, official verification with the Sub-Registry or AC Land office is strongly recommended.'
            })}
          </p>
        </div>
      </section>

      {/* Dual Entry: Manual Search Form + QR Card */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <form onSubmit={handleSearchSubmit} className="lg:col-span-3 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-700" />
              {t({ bn: 'জমির তথ্য দিয়ে অনুসন্ধান করুন', en: 'Search Land Records Manually' })}
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t({ bn: 'রিসেট করুন', en: 'Reset Filters' })}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t({ bn: 'জেলা (District)', en: 'District' })}
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setUpazila('');
                  setMouza('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">{t({ bn: 'সকল জেলা', en: 'All Districts' })}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t({ bn: 'উপজেলা (Upazila)', en: 'Upazila' })}
              </label>
              <select
                value={upazila}
                onChange={(e) => {
                  setUpazila(e.target.value);
                  setMouza('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">{t({ bn: 'সকল উপজেলা', en: 'All Upazilas' })}</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t({ bn: 'মৌজা (Mouza)', en: 'Mouza' })}
                <InfoTooltip termKey="mouza" />
              </label>
              <select
                value={mouza}
                onChange={(e) => setMouza(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">{t({ bn: 'সকল মৌজা', en: 'All Mouzas' })}</option>
                {mouzas.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t({ bn: 'খতিয়ান নম্বর', en: 'Khatian No.' })}
                <InfoTooltip termKey="khatian" />
              </label>
              <input
                type="text"
                value={khatian}
                onChange={(e) => setKhatian(e.target.value)}
                placeholder="যেমন: KH-201"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t({ bn: 'দাগ নম্বর', en: 'Dag No.' })}
                <InfoTooltip termKey="dag" />
              </label>
              <input
                type="text"
                value={dag}
                onChange={(e) => setDag(e.target.value)}
                placeholder="যেমন: 105"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={searching}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {searching ? t({ bn: 'অনুসন্ধান হচ্ছে...', en: 'Searching...' }) : t({ bn: 'রেকর্ড খুঁজুন', en: 'Search Records' })}
              </button>
            </div>
          </div>

          {searchError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {t(searchError)}
            </div>
          )}
        </form>

        {/* QR Scanner Card */}
        <div className="glass-card p-6 flex flex-col justify-between bg-gradient-to-b from-amber-50/90 to-white">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {t({ bn: 'কিউআর কোড ডকুমেন্ট লুকআপ', en: 'QR Document Lookup' })}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t({
                bn: 'দলিলের কিউআর কোড স্ক্যান করে সরাসরি জমির ডিউ-ডিলিজেন্স প্রোফাইল দেখুন।',
                en: 'Scan deed QR code to inspect complete land due diligence directly.'
              })}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={onOpenQrModal}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              {t({ bn: 'কিউআর স্ক্যানার খুলুন', en: 'Open QR Scanner' })}
            </button>
            <p className="text-[11px] text-center text-stone-500">
              {t({ bn: 'ডেমো কোড: QR-DH-1001, QR-SV-2005', en: 'Demo: QR-DH-1001, QR-SV-2005' })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}