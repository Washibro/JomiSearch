// backend/engines/unitConverter.js

const CONVERSION_RATES_TO_DECIMAL = {
  acre: 100.0,
  decimal: 1.0,
  katha: 1.65289, // 720 sq ft government standard
  bigha: 33.0
};

const EPSILON_TOLERANCE = 0.02;

const UNIT_LABELS = {
  acre: { bn: 'একর', en: 'Acre' },
  decimal: { bn: 'শতক', en: 'Decimal' },
  katha: { bn: 'কাঠা', en: 'Katha' },
  bigha: { bn: 'বিঘা', en: 'Bigha' }
};

function toBanglaDigits(input) {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  return String(input).replace(/[0-9]/g, (d) => map[d]);
}

function normalizeToDecimal(value, unit = 'decimal') {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  const key = String(unit).toLowerCase().trim();
  const factor = CONVERSION_RATES_TO_DECIMAL[key] || 1.0;
  return Number((num * factor).toFixed(2));
}

function areAreasEqual(areaA, unitA, areaB, unitB) {
  const normA = normalizeToDecimal(areaA, unitA);
  const normB = normalizeToDecimal(areaB, unitB);
  const diff = Number(Math.abs(normA - normB).toFixed(2));
  return {
    isMatch: diff <= EPSILON_TOLERANCE,
    normA,
    normB,
    variance: diff
  };
}

function formatAreaDisplay(value, unit = 'decimal') {
  const num = parseFloat(value);
  const key = String(unit).toLowerCase().trim();
  const normalized = normalizeToDecimal(num, key);
  const unitLabel = UNIT_LABELS[key] || UNIT_LABELS.decimal;

  if (key === 'decimal') {
    return {
      bn: `${toBanglaDigits(normalized.toFixed(2))} শতক`,
      en: `${normalized.toFixed(2)} Decimal`,
      normalizedDecimal: normalized
    };
  }

  const rawFormatted = key === 'acre' ? num.toFixed(4) : num.toFixed(2);
  return {
    bn: `${toBanglaDigits(rawFormatted)} ${unitLabel.bn} (${toBanglaDigits(normalized.toFixed(2))} শতক)`,
    en: `${rawFormatted} ${unitLabel.en} (${normalized.toFixed(2)} Decimal)`,
    normalizedDecimal: normalized
  };
}

module.exports = {
  normalizeToDecimal,
  areAreasEqual,
  formatAreaDisplay,
  toBanglaDigits,
  EPSILON_TOLERANCE
};