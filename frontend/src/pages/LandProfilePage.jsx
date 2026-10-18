// frontend/src/pages/LandProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  QrCode,
  Printer
} from 'lucide-react';
import { useLanguage, DOC_TYPE_LABELS } from '../context/LanguageContext';
import InfoTooltip from '../components/InfoTooltip';

export default function LandProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, formatNum } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lands/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        } else {
          setErrorMsg(resData.message);
        }
      })
      .catch(() =>
        setErrorMsg({
          bn: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।',
          en: 'Could not connect to server.'
        })
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="glass-card h-40 animate-pulse bg-amber-50/50" />
        <div className="glass-card h-72 animate-pulse bg-amber-50/50" />
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="glass-card p-8 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">{t(errorMsg)}</h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            {t({ bn: 'হোমপেজে ফিরে যান', en: 'Back to Home' })}
          </Link>
        </div>
      </div>
    );
  }

  const { land, documents, checklist, discrepancyAnalysis, disclaimer } = data;

  const checklistStyle = (status) => {
    switch (status) {
      case 'FOUND':
        return {
          card: 'border-emerald-300/80 bg-emerald-50/40',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        };
      case 'MISSING':
        return {
          card: 'border-rose-300/80 bg-rose-50/50',
          badge: 'bg-rose-600 text-white',
          icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        };
      case 'DISCREPANCY':
        return {
          card: 'border-amber-400/90 bg-amber-50/70',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        };
      default:
        return {
          card: 'border-stone-300/80 bg-stone-100/60',
          badge: 'bg-stone-600 text-white',
          icon: <HelpCircle className="w-5 h-5 text-stone-600 shrink-0" />
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-amber-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {t({ bn: 'সার্চ ফলাফলে ফিরে যান', en: 'Back to Search Directory' })}
        </Link>

        <button
          type="button"
          onClick={() => navigate(`/report/${land.land_id}`)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          {t({
            bn: 'পূর্ণাঙ্গ ডিউ-ডিলিজেন্স সামারি রিপোর্ট দেখুন',
            en: 'View Consolidated Due-Diligence Report'
          })}
        </button>
      </div>

      {/* Section 1: Land Master Profile & Encumbrance Flags */}
      <section className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-amber-200/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              {t({ bn: 'জমির মাস্টার প্রোফাইল', en: 'Master Land Profile' })} #{formatNum(land.land_id)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {t({ bn: 'মৌজা:', en: 'Mouza:' })} {land.mouza}, {land.upazila}, {land.district}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                land.is_khas
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {land.is_khas
                ? t({ bn: '⚠️ ১ নং খাস খতিয়ানভুক্ত', en: '⚠️ Govt Khas Flagged' })
                : t({ bn: 'খাস মুক্ত', en: 'Not Khas' })}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                land.is_acquired_or_gazetted
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {land.is_acquired_or_gazetted
                ? t({ bn: '⚠️ অধিগ্রহণ নোটিশভুক্ত', en: '⚠️ Acquisition Flagged' })
                : t({ bn: 'অধিগ্রহণ মুক্ত', en: 'No Acquisition' })}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                land.litigation_status === 'DISPUTE_REPORTED'
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-stone-100 text-stone-800 border-stone-300'
              }`}
            >
              {land.litigation_status === 'DISPUTE_REPORTED'
                ? t({ bn: '⚠️ দেওয়ানি মামলা চলমান', en: '⚠️ Court Suit Reported' })
                : t({ bn: 'মামলার রেকর্ড পাওয়া যায়নি', en: 'No Court Suit Recorded' })}
            </span>
          </div>
        </div>

        {/* Plot Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-stone-500 block">
              {t({ bn: 'জে.এল. নম্বর', en: 'JL Number' })}
              <InfoTooltip termKey="mouza" />
            </span>
            <span className="text-base font-bold text-stone-900">{land.jl_number}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-stone-500 block">
              {t({ bn: 'খতিয়ান নম্বর', en: 'Khatian No.' })}
              <InfoTooltip termKey="khatian" />
            </span>
            <span className="text-base font-bold text-stone-900">{land.khatian_number}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-stone-500 block">
              {t({ bn: 'বর্তমান দাগ নম্বর', en: 'Current Dag No.' })}
              <InfoTooltip termKey="dag" />
            </span>
            <span className="text-base font-bold text-stone-900">{formatNum(land.dag_number)}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-stone-500 block">
              {t({ bn: 'মোট জমির পরিমাণ', en: 'Total Land Area' })}
            </span>
            <span className="text-base font-bold text-amber-900">{t(land.formatted_area)}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-stone-500 block">
              {t({ bn: 'জমির শ্রেণী', en: 'Land Class' })}
            </span>
            <span className="text-base font-bold text-stone-900">{land.land_class}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-stone-500 block">
              {t({ bn: 'বিভাগ / অঞ্চল', en: 'Division' })}
            </span>
            <span className="text-base font-bold text-stone-900">{land.division}</span>
          </div>
        </div>

        {/* Remarks */}
        <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-xs sm:text-sm text-stone-800">
          <strong>{t({ bn: 'পর্যবেক্ষণ নোট:', en: 'Record Remarks:' })}</strong> {land.remarks}
        </div>
      </section>

      {/* Section 2: 4-Color Verification Checklist UI */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-stone-900">
            {t({
              bn: 'প্রাক-ক্রয় যাচাই চেকলিস্ট (৪-রঙা স্ট্যাটাস বিশ্লেষণ)',
              en: 'Pre-Purchase Verification Checklist (4-Color Status)'
            })}
          </h2>
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 text-emerald-800">🟢 {t({ bn: 'পাওয়া গেছে', en: 'Found' })}</span>
            <span className="inline-flex items-center gap-1 text-rose-800">🔴 {t({ bn: 'পাওয়া যায়নি', en: 'Missing' })}</span>
            <span className="inline-flex items-center gap-1 text-amber-800">🟠 {t({ bn: 'অসঙ্গতি', en: 'Discrepancy' })}</span>
            <span className="inline-flex items-center gap-1 text-stone-600">⚪ {t({ bn: 'অপরীক্ষিত', en: 'Not Checked' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checklist.map((item) => {
            const st = checklistStyle(item.status);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-md shadow-sm flex flex-col justify-between space-y-3 ${st.card}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {st.icon}
                    <h3 className="text-sm font-bold text-stone-900">{t(item.category)}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${st.badge}`}>
                    {t(item.badge)}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{t(item.summary)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Cross-Document Discrepancy Notices */}
      <section className="glass-card p-6 sm:p-8 space-y-5">
        <div className="border-b border-amber-200/60 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {t({
                bn: 'আন্তঃনথি অমিল বিশ্লেষণ ও সতর্কতামূলক নোটিশ (Cross-Document Analysis)',
                en: 'Cross-Document Discrepancy Analysis & Notices'
              })}
              <InfoTooltip termKey="cs_rs" />
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {t({
                bn: 'একক রূপান্তর ইঞ্জিন সকল পরিমাপকে স্বয়ংক্রিয়ভাবে শতকে (Decimal) রূপান্তর করে (±০.০২ শতক সহনশীলতায়) তুলনা করেছে।',
                en: 'Unit Normalization Engine automatically converts all document areas into Decimal (±0.02 Decimal tolerance) for comparison.'
              })}
            </p>
          </div>
        </div>

        {discrepancyAnalysis.notices.length === 0 ? (
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-sm">
              <strong>
                {t({
                  bn: 'কোনো আন্তঃনথি তথ্যগত অমিল পাওয়া যায়নি!',
                  en: 'No Cross-Document Discrepancies Detected!'
                })}
              </strong>
              <p className="text-xs mt-0.5">
                {t({
                  bn: 'সিএস খতিয়ান, আরএস খতিয়ান, মূল কবলা দলিল, নামজারি এবং খাজনার দাখিলার দাগ নম্বর ও জমির পরিমাণ পরস্পর সামঞ্জস্যপূর্ণ।',
                  en: 'Plot numbers and normalized land areas across CS Khatian, RS Khatian, Title Deed, Mutation, and Tax Dakhila are consistent.'
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {discrepancyAnalysis.notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  notice.severity === 'CRITICAL'
                    ? 'bg-red-50/90 border-red-300 text-red-950'
                    : 'bg-amber-50/90 border-amber-300 text-stone-900'
                }`}
              >
                <ShieldAlert
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    notice.severity === 'CRITICAL' ? 'text-red-600' : 'text-amber-700'
                  }`}
                />
                <div className="space-y-1 text-xs sm:text-sm">
                  <span className="font-bold block">{t(notice.field)}</span>
                  <p className="leading-relaxed">{t(notice.message)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-100/70 text-stone-900 border-b border-amber-300">
                <th className="py-3 px-4 font-bold rounded-tl-xl">{t({ bn: 'নথির ধরন', en: 'Document Type' })}</th>
                <th className="py-3 px-4 font-bold">{t({ bn: 'নথি নম্বর ও তারিখ', en: 'Doc No. & Date' })}</th>
                <th className="py-3 px-4 font-bold">{t({ bn: 'উল্লিখিত মালিকের নাম', en: 'Recorded Owner' })}</th>
                <th className="py-3 px-4 font-bold">{t({ bn: 'দাগ নম্বর', en: 'Recorded Dag' })}</th>
                <th className="py-3 px-4 font-bold">{t({ bn: 'জমির পরিমাণ (প্রমিত শতক)', en: 'Area (Normalized Decimal)' })}</th>
                <th className="py-3 px-4 font-bold rounded-tr-xl">{t({ bn: 'QR রেফারেন্স', en: 'QR Reference' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-200/50">
              {discrepancyAnalysis.comparisonMatrix.map((row) => {
                const label = DOC_TYPE_LABELS[row.document_type] || {
                  bn: row.document_type,
                  en: row.document_type
                };
                if (!row.present) {
                  return (
                    <tr key={row.document_type} className="bg-rose-50/40 text-rose-900">
                      <td className="py-3 px-4 font-bold">{t(label)}</td>
                      <td colSpan={5} className="py-3 px-4 font-semibold">
                        🔴 {t({ bn: 'ডেটাবেজে এই নথিটি পাওয়া যায়নি (Missing)', en: 'Document Missing in Records' })}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.document_type} className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-bold text-stone-900">{t(label)}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold block text-stone-800">{row.document_number}</span>
                      <span className="text-xs text-stone-500">{row.issue_date}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-800">{row.recorded_owner_name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold ${
                          row.dag_matches_master
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-200 text-amber-950'
                        }`}
                      >
                        {formatNum(row.recorded_dag_number)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold ${
                          row.area_matches_master
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-200 text-amber-950'
                        }`}
                      >
                        {t(row.formatted_area)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-amber-900">{row.qr_reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: All Linked Documents Metadata Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">
          {t({ bn: 'সংযুক্ত সকল দলিল ও ঐতিহাসিক পর্চার বিবরণ', en: 'All Linked Documents & Historical Surveys' })}
          <InfoTooltip termKey="baya_deed" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.document_id} className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900">
                  <FileText className="w-4 h-4 text-amber-700" />
                  {t(DOC_TYPE_LABELS[doc.document_type] || { bn: doc.document_type, en: doc.document_type })}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-300 font-mono text-xs text-stone-800">
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  {doc.qr_reference}
                </span>
              </div>
              <div className="text-xs text-stone-700 grid grid-cols-2 gap-2 pt-1">
                <p><strong>{t({ bn: 'নম্বর:', en: 'Number:' })}</strong> {doc.document_number}</p>
                <p><strong>{t({ bn: 'তারিখ:', en: 'Date:' })}</strong> {doc.issue_date}</p>
                <p><strong>{t({ bn: 'মালিক:', en: 'Owner:' })}</strong> {doc.recorded_owner_name}</p>
                <p><strong>{t({ bn: 'পরিমাণ:', en: 'Area:' })}</strong> {t(doc.formatted_area)}</p>
              </div>
              <p className="text-xs text-stone-500 pt-1">
                <strong>{t({ bn: 'প্রদানকারী কর্তৃপক্ষ:', en: 'Authority:' })}</strong> {doc.issuing_authority}
                {doc.notes ? ` • ${doc.notes}` : ''}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Non-Accusatory Ethical Footer Note */}
      <div className="p-4 rounded-2xl bg-amber-100/80 border border-amber-300 text-xs sm:text-sm text-stone-800 text-center font-medium">
        {t(disclaimer)}
      </div>
    </div>
  );
}