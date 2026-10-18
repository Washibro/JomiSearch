// backend/engines/discrepancyEngine.js
const {
  areAreasEqual,
  formatAreaDisplay,
  toBanglaDigits
} = require('./unitConverter');
const { parseBanglaYear, CURRENT_BANGABDA_YEAR } = require('./checklistEngine');

function analyzeDiscrepancies(landRecord, documents) {
  const notices = [];
  const byType = {};

  documents.forEach((doc) => {
    byType[doc.document_type] = doc;
  });

  const csDoc = byType['CS_KHATIAN'];
  const rsDoc = byType['RS_KHATIAN'] || byType['CITY_SURVEY'];
  const deedDoc = byType['TITLE_DEED'];
  const mutationDoc = byType['MUTATION_KHATIAN'];
  const taxDoc = byType['TAX_DAKHILA'];

  // 1. Dag Number Continuity Check (TITLE_DEED vs RS_KHATIAN)
  if (deedDoc && rsDoc) {
    const deedDag = String(deedDoc.recorded_dag_number).trim();
    const rsDag = String(rsDoc.recorded_dag_number).trim();
    if (deedDag !== rsDag) {
      notices.push({
        id: 'dag_discrepancy_deed_rs',
        severity: 'WARNING',
        field: { bn: 'দাগ নম্বর ধারাবাহিকতা', en: 'Plot (Dag) Continuity' },
        message: {
          bn: `দলিলে উল্লিখিত দাগ নম্বর [${toBanglaDigits(deedDag)}], কিন্তু আরএস খতিয়ানে দাগ নম্বর [${toBanglaDigits(rsDag)}]। জরিপ পরিবর্তন বা টাইপিং ভুলের কারণে এটি হতে পারে—অফিসিয়ালি পর্চা যাচাই করুন।`,
          en: `Plot number in Title Deed is [${deedDag}], but in RS Khatian it is [${rsDag}]. Potential survey renumbering or clerical variance—official verification recommended.`
        }
      });
    }
  }

  // 2. Land Area Variance Check (TITLE_DEED vs MUTATION_KHATIAN)
  if (deedDoc && mutationDoc) {
    const areaComp = areAreasEqual(
      deedDoc.recorded_area,
      deedDoc.area_unit,
      mutationDoc.recorded_area,
      mutationDoc.area_unit
    );

    if (!areaComp.isMatch) {
      const deedNormStr = areaComp.normA.toFixed(2);
      const mutNormStr = areaComp.normB.toFixed(2);
      const varStr = areaComp.variance.toFixed(2);

      notices.push({
        id: 'area_variance_deed_mutation',
        severity: 'WARNING',
        field: { bn: 'জমির পরিমাণ সামঞ্জস্যতা', en: 'Land Area Consistency' },
        message: {
          bn: `দলিলে জমির পরিমাণ [${toBanglaDigits(deedNormStr)} শতক], কিন্তু নামজারিতে পাওয়া গেছে [${toBanglaDigits(mutNormStr)} শতক] (পার্থক্য: ${toBanglaDigits(varStr)} শতক)। যৌথ মালিকানা বা পূর্ববর্তী বিক্রয় যাচাই করুন।`,
          en: `Land area in Title Deed is [${deedNormStr} Decimal], but in Mutation it is [${mutNormStr} Decimal] (Variance: ${varStr} Decimal). Please verify joint ownership or prior sales.`
        }
      });
    }
  }

  // 3. Missing Mutation Notice
  if (!mutationDoc) {
    notices.push({
      id: 'missing_mutation_notice',
      severity: 'HIGH',
      field: { bn: 'ই-নামজারি ঘাটতি', en: 'Missing Mutation Record' },
      message: {
        bn: 'বিক্রেতার নামে হালনাগাদ নামজারি (Mutation) খতিয়ান পাওয়া যায়নি। ক্রয়ের পূর্বে এসিল্যান্ড অফিসে মূল জোত ও নামজারি স্ট্যাটাস সরাসরি যাচাই করার পরামর্শ দেওয়া হচ্ছে।',
        en: 'Updated Mutation Khatian in the current owner name was not found. Direct verification with the AC Land office is strongly recommended prior to purchase.'
      }
    });
  }

  // 4. Land Development Tax Validity Check
  if (taxDoc) {
    const paidYear = parseBanglaYear(taxDoc.tax_paid_up_to_year);
    if (paidYear > 0 && paidYear < CURRENT_BANGABDA_YEAR) {
      const yearsBehind = CURRENT_BANGABDA_YEAR - paidYear;
      notices.push({
        id: 'tax_overdue_notice',
        severity: 'WARNING',
        field: { bn: 'ভূমি উন্নয়ন কর হালনাগাদ', en: 'Land Tax Validity' },
        message: {
          bn: `ভূমি উন্নয়ন কর সর্বশেষ [${taxDoc.tax_paid_up_to_year}] পর্যন্ত পরিশোধিত (ন্যূনতম ${toBanglaDigits(yearsBehind)} বছরের বকেয়া)। রেজিস্ট্রেশনের পূর্বেই হালনাগাদ দাখিলা সংগ্রহ করুন।`,
          en: `Land Development Tax was last paid up to [${taxDoc.tax_paid_up_to_year}] (at least ${yearsBehind} years overdue). Request an updated tax clearance receipt before registration.`
        }
      });
    }
  }

  // 5. Legal & Government Encumbrance Red Alerts
  if (landRecord.is_khas) {
    notices.push({
      id: 'encumbrance_khas',
      severity: 'CRITICAL',
      field: { bn: 'সরকারি খাস জমি সতর্কতা', en: 'Government Khas Land Alert' },
      message: {
        bn: 'সতর্কবার্তা: এই প্লটটি সরকারি ১ নং খাস খতিয়ানভুক্ত হিসেবে চিহ্নিত। ব্যক্তিগতভাবে এই জমি ক্রয়-বিক্রয় আইনত ঝুঁকিপূর্ণ—জেলা প্রশাসক বা ভূমি অফিসে যাচাই করুন।',
        en: 'Red Alert: This plot is flagged under Government Khas Khatian No. 1. Private transfer requires strict verification with the Deputy Commissioner / Land Office.'
      }
    });
  }

  if (landRecord.is_acquired_or_gazetted) {
    notices.push({
      id: 'encumbrance_acquired',
      severity: 'CRITICAL',
      field: { bn: 'সরকারি অধিগ্রহণ সতর্কতা', en: 'Government Acquisition Alert' },
      message: {
        bn: 'সতর্কবার্তা: এই প্লটটি সরকারি উন্নয়ন প্রকল্পের জন্য অধিগ্রহণ বা গেজেটভুক্ত হিসেবে চিহ্নিত। ক্রয়ের পূর্বে এলএ (LA) শাখায় অনাপত্তি যাচাই করুন।',
        en: 'Red Alert: This plot is flagged for government project acquisition / gazette notification. Verify clearance with the Land Acquisition (LA) branch.'
      }
    });
  }

  if (landRecord.is_vested_or_abandoned) {
    notices.push({
      id: 'encumbrance_vested',
      severity: 'CRITICAL',
      field: { bn: 'অর্পিত বা পরিত্যক্ত সম্পত্তি সতর্কতা', en: 'Vested / Abandoned Property Alert' },
      message: {
        bn: 'সতর্কবার্তা: এই প্লটটি অর্পিত বা পরিত্যক্ত সম্পত্তি তালিকায় চিহ্নিত। অবমুক্তির আদেশ (Release Order) ছাড়া ক্রয় হতে বিরত থাকুন।',
        en: 'Red Alert: This plot is flagged as Vested or Abandoned Property. Verify official Tribunal Release Order before any transaction.'
      }
    });
  }

  if (landRecord.litigation_status === 'DISPUTE_REPORTED') {
    notices.push({
      id: 'encumbrance_litigation',
      severity: 'CRITICAL',
      field: { bn: 'আদালতের মামলা সতর্কতা', en: 'Court Litigation Alert' },
      message: {
        bn: `আইনি বিরোধের তথ্য পাওয়া গেছে: "${landRecord.remarks}"। বিজ্ঞ আইনজীবীর মাধ্যমে দেওয়ানি আদালতের নথি যাচাইয়ের পরামর্শ দেওয়া হচ্ছে।`,
        en: `Active court dispute recorded: "${landRecord.remarks}". Legal vetting of civil court records is strongly advised.`
      }
    });
  }

  // Build Side-by-Side Comparison Matrix for UI
  const keyDocTypes = ['CS_KHATIAN', 'RS_KHATIAN', 'TITLE_DEED', 'MUTATION_KHATIAN', 'TAX_DAKHILA'];
  const comparisonMatrix = keyDocTypes.map((type) => {
    const doc = byType[type];
    if (!doc) {
      return {
        document_type: type,
        present: false
      };
    }
    const formattedArea = formatAreaDisplay(doc.recorded_area, doc.area_unit);
    return {
      document_type: type,
      present: true,
      document_number: doc.document_number,
      issue_date: doc.issue_date,
      issuing_authority: doc.issuing_authority,
      qr_reference: doc.qr_reference,
      recorded_owner_name: doc.recorded_owner_name,
      recorded_dag_number: doc.recorded_dag_number,
      recorded_khatian_number: doc.recorded_khatian_number,
      raw_area: doc.recorded_area,
      area_unit: doc.area_unit,
      normalized_area_decimal: formattedArea.normalizedDecimal,
      formatted_area: formattedArea,
      tax_paid_up_to_year: doc.tax_paid_up_to_year,
      dag_matches_master: String(doc.recorded_dag_number).trim() === String(landRecord.dag_number).trim(),
      area_matches_master: areAreasEqual(
        doc.recorded_area,
        doc.area_unit,
        landRecord.land_area,
        landRecord.area_unit
      ).isMatch
    };
  });

  return {
    hasDiscrepancies: notices.length > 0,
    discrepancyCount: notices.length,
    notices,
    comparisonMatrix
  };
}

module.exports = { analyzeDiscrepancies };