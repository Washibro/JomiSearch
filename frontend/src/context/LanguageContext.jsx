// frontend/src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const DOC_TYPE_LABELS = {
  CS_KHATIAN: { bn: 'সিএস খতিয়ান (CS Khatian)', en: 'CS Khatian (1940 Survey)' },
  SA_KHATIAN: { bn: 'এসএ খতিয়ান (SA Khatian)', en: 'SA Khatian (State Acquisition)' },
  RS_KHATIAN: { bn: 'আরএস খতিয়ান (RS Khatian)', en: 'RS Khatian (Revisional Survey)' },
  CITY_SURVEY: { bn: 'সিটি / বিএস জরিপ (BS/City)', en: 'City / BS Survey Khatian' },
  MUTATION_KHATIAN: { bn: 'ই-নামজারি খতিয়ান (Mutation)', en: 'e-Mutation Khatian' },
  TITLE_DEED: { bn: 'মূল কবলা দলিল (Title Deed)', en: 'Registered Title Deed' },
  BAYA_DEED: { bn: 'বায়া দলিল (Baya Deed)', en: 'Prior Chain Deed (Baya Deed)' },
  TAX_DAKHILA: { bn: 'ভূমি উন্নয়ন কর দাখিলা (Tax)', en: 'Land Tax Receipt (Dakhila)' },
  DCR: { bn: 'ডুপ্লিকেট কার্বন রসিদ (DCR)', en: 'Duplicate Carbon Receipt (DCR)' }
};

export const CITIZEN_TOOLTIPS = {
  mouza: {
    title: { bn: 'মৌজা (Mouza) কী?', en: 'What is a Mouza?' },
    desc: {
      bn: 'ভূমি জরিপের ভৌগোলিক একক। প্রতিটি উপজেলায় একাধিক মৌজা থাকে এবং প্রতিটি মৌজার একটি স্বতন্ত্র জে.এল. (JL) নম্বর থাকে।',
      en: 'A specific administrative land survey unit within an Upazila, identified by a unique Jurisdiction List (JL) number.'
    }
  },
  khatian: {
    title: { bn: 'খতিয়ান বা পর্চা (Khatian) কী?', en: 'What is a Khatian?' },
    desc: {
      bn: 'জরিপকালে ভূমির মালিকের নাম, পিতার নাম, দাগ নম্বর, জমির শ্রেণী ও হিস্যা উল্লেখ করে যে রেকর্ড প্রস্তুত করা হয় তাকে খতিয়ান বা পর্চা বলে।',
      en: 'Official Record of Rights (RoR) prepared during land surveys listing owner names, shares, plot numbers, and land area.'
    }
  },
  dag: {
    title: { bn: 'দাগ নম্বর (Dag Number) কী?', en: 'What is a Dag Number?' },
    desc: {
      bn: 'মৌজা ম্যাপে প্রতিটি আলাদা জমির খণ্ডকে শনাক্ত করার জন্য যে ক্রমিক নম্বর দেওয়া হয় তাকে দাগ নম্বর বলে। জরিপ ভেদে দাগ নম্বর পরিবর্তন হতে পারে।',
      en: 'Unique parcel/plot identification number on the Mouza map. Plot numbers can change across CS, SA, and RS surveys.'
    }
  },
  mutation: {
    title: { bn: 'নামজারি বা খারিজ (Mutation) কী?', en: 'What is Mutation?' },
    desc: {
      bn: 'জমি ক্রয় বা উত্তরাধিকার সূত্রে পাওয়ার পর পূর্ববর্তী মালিকের নাম বাদ দিয়ে নতুন মালিকের নামে খতিয়ান খোলাকে নামজারি বলে।',
      en: 'Official updating of government land records by transferring title from the seller to the new buyer via the AC Land office.'
    }
  },
  cs_rs: {
    title: { bn: 'সিএস ও আরএস খতিয়ান চেইন কেন জরুরি?', en: 'Why verify CS & RS Khatian Chain?' },
    desc: {
      bn: 'সিএস (১৯৪০) থেকে এসএ এবং আরএস (১৯৮০+) খতিয়ান মিলিয়ে দেখলে বোঝা যায় জমির মালিকানা ও দাগের ধারাবাহিকতা সঠিক আছে কিনা।',
      en: 'Cross-checking CS (1940) through RS (1980+) surveys confirms uninterrupted historical ownership and plot continuity.'
    }
  },
  baya_deed: {
    title: { bn: 'বায়া দলিল (Baya Deed) কী?', en: 'What is a Baya Deed?' },
    desc: {
      bn: 'বর্তমান বিক্রেতা যার কাছ থেকে জমি কিনেছিলেন সেই পূর্ববর্তী দলিলগুলোকে বায়া দলিল বা পেছনের দলিল বলা হয়।',
      en: 'Prior chain of title deeds showing how previous owners acquired the property before the current seller.'
    }
  }
};

export function toBanglaNum(val) {
  if (val === null || val === undefined) return '';
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  return String(val).replace(/[0-9]/g, (d) => map[d]);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jomisearch_lang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('jomisearch_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (bilingualObj) => {
    if (!bilingualObj) return '';
    if (typeof bilingualObj === 'string') return bilingualObj;
    return bilingualObj[lang] || bilingualObj.bn || '';
  };

  const formatNum = (val) => (lang === 'bn' ? toBanglaNum(val) : String(val));

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, formatNum }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);