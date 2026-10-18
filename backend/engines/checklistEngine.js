// backend/engines/checklistEngine.js
const { areAreasEqual, toBanglaDigits } = require('./unitConverter');

const CURRENT_BANGABDA_YEAR = 1431; // Minimum benchmark year per specification

function parseBanglaYear(yearStr) {
  if (!yearStr) return 0;
  const map = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  const normalized = String(yearStr).replace(/[০-৯]/g, (d) => map[d]);
  const match = normalized.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

function generateChecklist(landRecord, documents) {
  const byType = {};
  documents.forEach((doc) => {
    byType[doc.document_type] = doc;
  });

  const csDoc = byType['CS_KHATIAN'];
  const rsDoc = byType['RS_KHATIAN'] || byType['CITY_SURVEY'];
  const deedDoc = byType['TITLE_DEED'];
  const bayaDoc = byType['BAYA_DEED'];
  const mutationDoc = byType['MUTATION_KHATIAN'];
  const taxDoc = byType['TAX_DAKHILA'];

  const checklist = [];

  // 1. Historical Khatian Chain (CS & RS/BS)
  if (csDoc && rsDoc) {
    const dagMatches = String(csDoc.recorded_dag_number).trim() === String(rsDoc.recorded_dag_number).trim();
    checklist.push({
      id: 'khatian_chain',
      category: { bn: 'খতিয়ান ধারাবাহিকতা (CS ও RS)', en: 'Khatian Chain (CS & RS)' },
      status: dagMatches ? 'FOUND' : 'DISCREPANCY',
      badge: dagMatches
        ? { bn: 'পাওয়া গেছে', en: 'Found' }
        : { bn: 'অসঙ্গতি', en: 'Discrepancy' },
      summary: dagMatches
        ? {
            bn: `সিএস (${csDoc.document_number}) এবং আরএস (${rsDoc.document_number}) খতিয়ান সংযুক্ত ও সামঞ্জস্যপূর্ণ।`,
            en: `CS (${csDoc.document_number}) and RS (${rsDoc.document_number}) Khatians are present and consistent.`
          }
        : {
            bn: `সিএস ও আরএস খতিয়ান পাওয়া গেছে, কিন্তু দাগ নম্বরে পার্থক্য রয়েছে (${toBanglaDigits(csDoc.recorded_dag_number)} বনাম ${toBanglaDigits(rsDoc.recorded_dag_number)})।`,
            en: `CS and RS Khatians found, but plot numbers vary (${csDoc.recorded_dag_number} vs ${rsDoc.recorded_dag_number}).`
          }
    });
  } else {
    checklist.push({
      id: 'khatian_chain',
      category: { bn: 'খতিয়ান ধারাবাহিকতা (CS ও RS)', en: 'Khatian Chain (CS & RS)' },
      status: 'MISSING',
      badge: { bn: 'পাওয়া যায়নি', en: 'Missing' },
      summary: {
        bn: 'পূর্ণাঙ্গ সিএস বা আরএস খতিয়ান চেইন ডেটাবেজে পাওয়া যায়নি।',
        en: 'Complete CS or RS Khatian chain is missing in records.'
      }
    });
  }

  // 2. Title Deed & Baya Deed Chain
  if (deedDoc) {
    const hasBaya = Boolean(bayaDoc);
    checklist.push({
      id: 'deed_chain',
      category: { bn: 'মূল ও বায়া দলিল (Deed Chain)', en: 'Title & Baya Deed Chain' },
      status: 'FOUND',
      badge: { bn: 'পাওয়া গেছে', en: 'Found' },
      summary: {
        bn: `মূল দলিল (${deedDoc.document_number})${hasBaya ? ` এবং বায়া দলিল (${bayaDoc.document_number})` : ''} সংযুক্ত আছে।`,
        en: `Title Deed (${deedDoc.document_number})${hasBaya ? ` and Baya Deed (${bayaDoc.document_number})` : ''} verified in system.`
      }
    });
  } else {
    checklist.push({
      id: 'deed_chain',
      category: { bn: 'মূল ও বায়া দলিল (Deed Chain)', en: 'Title & Baya Deed Chain' },
      status: 'MISSING',
      badge: { bn: 'পাওয়া যায়নি', en: 'Missing' },
      summary: {
        bn: 'মূল কবলা দলিলের রেকর্ড পাওয়া যায়নি।',
        en: 'Registered Title Deed record was not found.'
      }
    });
  }

  // 3. Mutation Khatian (ই-নামজারি খতিয়ান)
  if (mutationDoc) {
    let areaMatch = true;
    if (deedDoc) {
      areaMatch = areAreasEqual(
        deedDoc.recorded_area,
        deedDoc.area_unit,
        mutationDoc.recorded_area,
        mutationDoc.area_unit
      ).isMatch;
    }
    checklist.push({
      id: 'mutation_status',
      category: { bn: 'ই-নামজারি খতিয়ান (Mutation)', en: 'Mutation Khatian' },
      status: areaMatch ? 'FOUND' : 'DISCREPANCY',
      badge: areaMatch
        ? { bn: 'পাওয়া গেছে', en: 'Found' }
        : { bn: 'অসঙ্গতি', en: 'Discrepancy' },
      summary: areaMatch
        ? {
            bn: `হালনাগাদ নামজারি খতিয়ান (${mutationDoc.document_number}) ও জমির পরিমাণ সামঞ্জস্যপূর্ণ।`,
            en: `Updated Mutation Khatian (${mutationDoc.document_number}) matches deed land area.`
          }
        : {
            bn: `নামজারি খতিয়ান (${mutationDoc.document_number}) আছে, তবে দলিলের সাথে জমির পরিমাণে অমিল রয়েছে।`,
            en: `Mutation Khatian (${mutationDoc.document_number}) found, but area differs from Title Deed.`
          }
    });
  } else {
    checklist.push({
      id: 'mutation_status',
      category: { bn: 'ই-নামজারি খতিয়ান (Mutation)', en: 'Mutation Khatian' },
      status: 'MISSING',
      badge: { bn: 'পাওয়া যায়নি', en: 'Missing' },
      summary: {
        bn: 'বিক্রেতার নিজ নামে হালনাগাদ নামজারি (Mutation) খতিয়ান পাওয়া যায়নি। নামজারি ছাড়া জমি ক্রয় ঝুঁকিপূর্ণ।',
        en: 'Seller Mutation Khatian is missing. Purchasing land without updated mutation carries legal risk.'
      }
    });
  }

  // 4. Land Development Tax (ভূমি উন্নয়ন কর দাখিলা)
  if (taxDoc) {
    const paidYear = parseBanglaYear(taxDoc.tax_paid_up_to_year);
    const isUpToDate = paidYear >= CURRENT_BANGABDA_YEAR;
    checklist.push({
      id: 'tax_dakhila',
      category: { bn: 'ভূমি উন্নয়ন কর (খাজনা দাখিলা)', en: 'Land Development Tax (Dakhila)' },
      status: isUpToDate ? 'FOUND' : 'DISCREPANCY',
      badge: isUpToDate
        ? { bn: 'পাওয়া গেছে', en: 'Found' }
        : { bn: 'বকেয়া সতর্কতা', en: 'Overdue Warning' },
      summary: isUpToDate
        ? {
            bn: `খাজনা ${taxDoc.tax_paid_up_to_year} পর্যন্ত হালনাগাদ পরিশোধিত আছে (${taxDoc.document_number})।`,
            en: `Land tax is paid up to ${taxDoc.tax_paid_up_to_year} (${taxDoc.document_number}).`
          }
        : {
            bn: `সর্বশেষ খাজনা পরিশোধের সন ${taxDoc.tax_paid_up_to_year}। বর্তমান সন পর্যন্ত খাজনা বকেয়া রয়েছে।`,
            en: `Last tax paid up to ${taxDoc.tax_paid_up_to_year}. Land Development Tax is currently overdue.`
          }
    });
  } else {
    checklist.push({
      id: 'tax_dakhila',
      category: { bn: 'ভূমি উন্নয়ন কর (খাজনা দাখিলা)', en: 'Land Development Tax (Dakhila)' },
      status: 'MISSING',
      badge: { bn: 'পাওয়া যায়নি', en: 'Missing' },
      summary: {
        bn: 'ভূমি উন্নয়ন কর পরিশোধের দাখিলা পাওয়া যায়নি।',
        en: 'Land Development Tax receipt (Dakhila) is missing.'
      }
    });
  }

  // 5. Government Encumbrance Status (খাস / অর্পিত / অধিগ্রহণ)
  const hasGovRestriction =
    landRecord.is_khas || landRecord.is_vested_or_abandoned || landRecord.is_acquired_or_gazetted;
  checklist.push({
    id: 'gov_encumbrance',
    category: { bn: 'সরকারি খাস, অর্পিত বা অধিগ্রহণ যাচাই', en: 'Govt Khas, Vested & Acquisition Check' },
    status: hasGovRestriction ? 'DISCREPANCY' : 'FOUND',
    badge: hasGovRestriction
      ? { bn: 'সরকারি বিধিনিষেধ', en: 'Restricted' }
      : { bn: 'মুক্ত (পাওয়া গেছে)', en: 'Clear (Found)' },
    summary: hasGovRestriction
      ? {
          bn: 'সতর্কতা: এই দাগে সরকারি খাস, অর্পিত সম্পত্তি বা ভূমি অধিগ্রহণ সংক্রান্ত বিধিনিষেধ চিহ্নিত হয়েছে।',
          en: 'Alert: Plot is flagged under Govt Khas, Vested Property, or Land Acquisition notice.'
        }
      : {
          bn: 'প্রাথমিক রেকর্ডে খাস, অর্পিত বা অধিগ্রহণ তালিকাভুক্তির কোনো তথ্য পাওয়া যায়নি।',
          en: 'Not flagged as Khas, Vested, or Acquired in available records.'
        }
  });

  // 6. Bank Mortgage & Local Civil Suit Registry (Not Centrally Digitized / Litigation Flag)
  if (landRecord.litigation_status === 'DISPUTE_REPORTED') {
    checklist.push({
      id: 'litigation_mortgage',
      category: { bn: 'দেওয়ানি মামলা ও ব্যাংক বন্ধক যাচাই', en: 'Court Litigation & Bank Mortgage' },
      status: 'DISCREPANCY',
      badge: { bn: 'মামলা চলমান', en: 'Dispute Reported' },
      summary: {
        bn: `আইনি বিরোধ শনাক্ত: ${landRecord.remarks}`,
        en: `Legal dispute reported on this plot: ${landRecord.remarks}`
      }
    });
  } else {
    checklist.push({
      id: 'litigation_mortgage',
      category: { bn: 'ব্যাংক বন্ধক ও স্থানীয় দেওয়ানি মামলা', en: 'Bank Mortgage & Civil Court Suits' },
      status: 'NOT_CHECKED',
      badge: { bn: 'সিস্টেমে অপরীক্ষিত', en: 'Not Checked' },
      summary: {
        bn: 'ব্যাংক মর্টগেজ ও আদালতের চলমান মামলার কোনো কেন্দ্রীয় ডিজিটাল ডেটাবেজ নেই। সাব-রেজিস্ট্রি অফিস থেকে নির্দায় সনদ (NEC) যাচাই করুন।',
        en: 'No centralized digital database exists for bank mortgages or local court suits. Verify Non-Encumbrance Certificate (NEC) at the Sub-Registry office.'
      }
    });
  }

  return checklist;
}

module.exports = { generateChecklist, parseBanglaYear, CURRENT_BANGABDA_YEAR };