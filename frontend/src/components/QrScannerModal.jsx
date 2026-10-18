// frontend/src/components/QrScannerModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, Camera, Upload, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function QrScannerModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [qrInput, setQrInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const scannerRef = useRef(null);

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setErrorMsg(null);
      setQrInput('');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lookupQrCode = async (codeString) => {
    const cleaned = String(codeString || '').trim().toUpperCase();
    if (!cleaned) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/qr/${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        await stopCamera();
        onClose();
        navigate(`/land/${data.data.land.land_id}`);
      } else {
        setErrorMsg(
          data.message || {
            bn: 'কোনো ডেমো রেকর্ড পাওয়া যায়নি।',
            en: 'No matching demo record found.'
          }
        );
      }
    } catch (_) {
      setErrorMsg({
        bn: 'সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।',
        en: 'Failed to connect to backend server.'
      });
    } finally {
      setLoading(false);
    }
  };

  const startCameraScan = async () => {
    setErrorMsg(null);
    setCameraActive(true);
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader-region');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            lookupQrCode(decodedText);
          },
          () => {}
        );
      } catch (_) {
        setCameraActive(false);
        setErrorMsg({
          bn: 'ক্যামেরা চালু করা যায়নি। আপনি নিচে কিউআর ইমেজ আপলোড বা রেফারেন্স কোড লিখে চেক করতে পারেন।',
          en: 'Camera access unavailable. Please upload a QR image or use a demo reference code below.'
        });
      }
    }, 150);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    try {
      const html5QrCode = new Html5Qrcode('qr-file-temp');
      const decodedText = await html5QrCode.scanFile(file, true);
      lookupQrCode(decodedText);
    } catch (_) {
      setErrorMsg({
        bn: 'আপলোডকৃত ছবিতে কোনো স্পষ্ট কিউআর কোড পাওয়া যায়নি।',
        en: 'Could not detect a valid QR code in the uploaded image.'
      });
    }
  };

  const quickDemoCodes = [
    {
      code: 'QR-DH-1001',
      label: { bn: 'QR-DH-1001 (🟢 নিষ্কণ্টক প্লট)', en: 'QR-DH-1001 (🟢 Clean Plot)' }
    },
    {
      code: 'QR-SV-2005',
      label: { bn: 'QR-SV-2005 (🟠 দাগ ও পরিমাণে অমিল)', en: 'QR-SV-2005 (🟠 Dag & Area Discrepancy)' }
    },
    {
      code: 'QR-CTG-3012',
      label: { bn: 'QR-CTG-3012 (🔴 নামজারি নেই ও খাজনা বকেয়া)', en: 'QR-CTG-3012 (🔴 Missing Mutation)' }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-md border border-amber-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-700" />
            <h3 className="text-lg font-bold text-stone-900">
              {t({ bn: 'কিউআর কোড দলিল ও খতিয়ান লুকআপ', en: 'QR Document & Khatian Lookup' })}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera & Image Upload Controls */}
        <div className="grid grid-cols-2 gap-3">
          {!cameraActive ? (
            <button
              type="button"
              onClick={startCameraScan}
              className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-amber-700" />
              {t({ bn: 'ক্যামেরা স্ক্যান করুন', en: 'Scan with Camera' })}
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="py-2.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-900 text-xs font-bold flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {t({ bn: 'ক্যামেরা বন্ধ করুন', en: 'Stop Camera' })}
            </button>
          )}

          <label className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-stone-700" />
            <span>{t({ bn: 'QR ছবি আপলোড করুন', en: 'Upload QR Image' })}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {cameraActive && (
          <div id="qr-reader-region" className="w-full rounded-2xl overflow-hidden border border-amber-300" />
        )}
        <div id="qr-file-temp" className="hidden" />

        {/* Manual QR String Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookupQrCode(qrInput);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder={t({
              bn: 'কিউআর রেফারেন্স কোড লিখুন (যেমন: QR-DH-1001)',
              en: 'Enter QR reference string (e.g. QR-DH-1001)'
            })}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            {t({ bn: 'যাচাই', en: 'Verify' })}
          </button>
        </form>

        {/* Friendly Non-Accusatory Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-stone-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{t(errorMsg)}</span>
          </div>
        )}

        {/* Quick Demo Scenario Pills */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-stone-600 block">
            {t({ bn: 'এক ক্লিকে ডেমো কিউআর কোড টেস্ট করুন:', en: 'Instant Demo QR Scenarios:' })}
          </span>
          <div className="flex flex-col gap-2">
            {quickDemoCodes.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => lookupQrCode(item.code)}
                className="w-full text-left px-3.5 py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-xs font-semibold text-stone-800 flex items-center justify-between transition-colors"
              >
                <span>{t(item.label)}</span>
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}