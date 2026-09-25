import { Category, PrecisionMode, Unit, CategoryId } from '../types';

/**
 * Core conversion calculator between two units in a category
 */
export const convertValue = (val: number, fromUnit: Unit, toUnit: Unit): number => {
  if (isNaN(val)) return 0;
  if (fromUnit.id === toUnit.id) return val;

  // Custom toBase/fromBase calculation (e.g. Temperature, Fuel Economy)
  if (fromUnit.toBase || toUnit.fromBase) {
    let baseValue = val;
    if (fromUnit.toBase) {
      baseValue = fromUnit.toBase(val);
    } else if (fromUnit.factor) {
      baseValue = val * fromUnit.factor;
    }

    if (toUnit.fromBase) {
      return toUnit.fromBase(baseValue);
    } else if (toUnit.factor) {
      return baseValue / toUnit.factor;
    }
  }

  // Standard factor conversion: baseVal = val * fromUnit.factor; res = baseVal / toUnit.factor
  const fromFactor = fromUnit.factor || 1;
  const toFactor = toUnit.factor || 1;

  const baseVal = val * fromFactor;
  return baseVal / toFactor;
};

/**
 * Precision formatter supporting Auto, Scientific Notation, Exact Decimals, and Cooking/Imperial Fractions
 */
export const formatNumber = (
  val: number,
  mode: PrecisionMode = 'auto',
  decimalPlaces: number = 4
): string => {
  if (isNaN(val)) return '0';
  if (val === 0) return '0';

  const absVal = Math.abs(val);

  // Scientific notation mode or extreme values
  if (mode === 'scientific' || (mode === 'auto' && (absVal >= 1e9 || (absVal < 1e-4 && absVal > 0)))) {
    return val.toExponential(4);
  }

  // Fraction mode (useful for cooking or inch measurements)
  if (mode === 'fraction') {
    return toFractionString(val);
  }

  // Specific decimal precision
  if (mode !== 'auto') {
    const fixed = parseInt(mode, 10);
    if (!isNaN(fixed)) {
      return val.toFixed(fixed);
    }
  }

  // Auto precision smart formatting
  if (Number.isInteger(val)) {
    return val.toLocaleString('en-US');
  }

  // Smart max digits
  const formatted = val.toLocaleString('en-US', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: 0
  });

  return formatted;
};

/**
 * Converts decimal numbers to user-friendly vulgar fraction strings (e.g. 1.25 -> 1 1/4)
 */
const toFractionString = (val: number): string => {
  const wholePart = Math.floor(Math.abs(val));
  const decimal = Math.abs(val) - wholePart;
  const sign = val < 0 ? '-' : '';

  if (decimal < 0.01) return `${sign}${wholePart}`;

  const denominators = [2, 3, 4, 8, 16, 32, 64];
  let bestNum = 0;
  let bestDen = 1;
  let minDiff = 1;

  for (const den of denominators) {
    const num = Math.round(decimal * den);
    const diff = Math.abs(decimal - num / den);
    if (diff < minDiff) {
      minDiff = diff;
      bestNum = num;
      bestDen = den;
    }
  }

  if (bestNum === bestDen) {
    return `${sign}${wholePart + 1}`;
  }

  // Reduce fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const common = gcd(bestNum, bestDen);
  const finalNum = bestNum / common;
  const finalDen = bestDen / common;

  if (wholePart === 0) {
    return `${sign}${finalNum}/${finalDen}`;
  }
  return `${sign}${wholePart} ${finalNum}/${finalDen}`;
};

/**
 * Generates forward and reverse educational formula text
 */
export const getFormulaStrings = (
  fromUnit: Unit,
  toUnit: Unit
): { forward: string; reverse: string } => {
  if (fromUnit.id === toUnit.id) {
    return {
      forward: `1 ${fromUnit.symbol} = 1 ${toUnit.symbol}`,
      reverse: `1 ${toUnit.symbol} = 1 ${fromUnit.symbol}`
    };
  }

  const forwardVal = convertValue(1, fromUnit, toUnit);
  const reverseVal = convertValue(1, toUnit, fromUnit);

  const formattedFwd = formatNumber(forwardVal, 'auto', 6);
  const formattedRev = formatNumber(reverseVal, 'auto', 6);

  return {
    forward: `1 ${fromUnit.name} (${fromUnit.symbol}) = ${formattedFwd} ${toUnit.name} (${toUnit.symbol})`,
    reverse: `1 ${toUnit.name} (${toUnit.symbol}) = ${formattedRev} ${fromUnit.name} (${fromUnit.symbol})`
  };
};

/**
 * Natural language query parser
 * Examples:
 *  "50 kg to lbs" -> { value: 50, fromUnitId: 'kg', toUnitId: 'lb', categoryId: 'weight' }
 *  "37.5 celsius in fahrenheit" -> { value: 37.5, ... }
 *  "100 usd to eur" -> { value: 100, ... }
 */
export const parseNaturalLanguageQuery = (
  query: string,
  categories: Category[]
): {
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
  category: Category;
} | null => {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // Regex patterns like: "100 km to miles", "50kg in lbs", "37 c -> f"
  const regex = /^([+-]?\d+(?:\.\d+)?)\s*([a-z°%/^\s]+?)\s+(?:to|in|into|as|->|=)\s+([a-z°%/^\s]+)$/i;
  const match = clean.match(regex);

  if (!match) return null;

  const val = parseFloat(match[1]);
  if (isNaN(val)) return null;

  const fromStr = match[2].trim();
  const toStr = match[3].trim();

  // Search through categories and units for best match
  for (const cat of categories) {
    let matchedFrom: Unit | undefined;
    let matchedTo: Unit | undefined;

    for (const unit of cat.units) {
      const names = [unit.id.toLowerCase(), unit.name.toLowerCase(), unit.symbol.toLowerCase()];
      if (names.some((n) => n === fromStr || fromStr.includes(n))) {
        if (!matchedFrom) matchedFrom = unit;
      }
      if (names.some((n) => n === toStr || toStr.includes(n))) {
        if (!matchedTo) matchedTo = unit;
      }
    }

    if (matchedFrom && matchedTo) {
      return {
        value: val,
        fromUnit: matchedFrom,
        toUnit: matchedTo,
        category: cat
      };
    }
  }

  return null;
};
