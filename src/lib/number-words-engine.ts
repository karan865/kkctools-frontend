/**
 * Numbers to Words Engine.
 * Supports International (US/UK) scales, Indian (Lakh/Crore) systems,
 * US check formatting with exact cents rounding and carry,
 * Indian cheque formatting (Rupees ... Paise Only),
 * Ordinal conversion, digit grouping, and reverse parsing (words -> digits).
 *
 * ES2017 compatible: Uses BigInt('...') constructors without literals (no 0n),
 * no 'v' or 's' regex flags, no named capture groups.
 */

export type ScaleStyle = 'us' | 'uk';
export type CaseStyle = 'sentence' | 'lower' | 'upper' | 'title';
export type GroupingStyle = 'intl' | 'indian';

const ONES: string[] = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS: string[] = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

const INTL_SCALES: string[] = [
  '',
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
  'sextillion',
  'septillion',
  'octillion',
  'nonillion',
  'decillion',
  'undecillion',
];

/** 10^36 - 1 is the largest number this page names (up to decillions). */
export const MAX_NAMED_DIGITS = 36;

const ORDINAL_IRREGULARS: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
};

/**
 * Applies text casing: lower, upper, title, or sentence.
 */
export function applyCase(text: string, style: CaseStyle): string {
  if (!text) return text;
  switch (style) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'title':
      return text.replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence':
    default:
      return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

/**
 * Converts a number 0..999 to English words.
 */
function threeDigitsToWords(n: number, style: ScaleStyle = 'us'): string {
  if (n === 0) return '';
  const parts: string[] = [];

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    parts.push(`${ONES[hundreds]} hundred`);
  }

  if (remainder > 0) {
    if (hundreds > 0 && style === 'uk') {
      parts.push('and');
    }
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      if (ones > 0) {
        parts.push(`${TENS[tens]}-${ONES[ones]}`);
      } else {
        parts.push(TENS[tens]);
      }
    }
  }

  return parts.join(' ');
}

/**
 * Converts a non-negative BigInt to standard International words (thousand, million, billion...).
 */
export function bigIntToWords(val: bigint, options: { style?: ScaleStyle } = {}): string {
  const { style = 'us' } = options;
  if (val === BigInt('0')) return 'zero';

  let current = val;
  const groups: number[] = [];
  const thousand = BigInt('1000');

  while (current > BigInt('0')) {
    const rem = Number(current % thousand);
    groups.push(rem);
    current = current / thousand;
  }

  if (val.toString().length > MAX_NAMED_DIGITS) {
    return 'number too large to name in standard scale';
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const chunk = groups[i];
    if (chunk === 0) continue;

    let words = threeDigitsToWords(chunk, style);
    // UK style: one thousand and one
    if (style === 'uk' && i === 0 && chunk < 100 && parts.length > 0) words = `and ${words}`;
    const scale = INTL_SCALES[i];
    if (scale) {
      parts.push(`${words} ${scale}`);
    } else {
      parts.push(words);
    }
  }

  return parts.join(' ');
}

/**
 * Converts a non-negative BigInt to Indian words (lakh, crore).
 * Supports > 1,000 crore recursion (e.g. 1000,00,00,000 -> one thousand crore).
 */
export function bigIntToIndianWords(val: bigint): string {
  if (val === BigInt('0')) return 'zero';

  const crore = BigInt('10000000'); // 10^7
  const lakh = BigInt('100000'); // 10^5
  const thousand = BigInt('1000'); // 10^3
  const hundred = BigInt('100');

  const parts: string[] = [];

  let rem = val;

  // Handle Crores (and recursive crores if >= 100 crore)
  if (rem >= crore) {
    const numCrore = rem / crore;
    rem = rem % crore;
    if (numCrore >= BigInt('100')) {
      parts.push(`${bigIntToIndianWords(numCrore)} crore`);
    } else {
      parts.push(`${threeDigitsToWords(Number(numCrore), 'us')} crore`);
    }
  }

  // Handle Lakhs
  if (rem >= lakh) {
    const numLakh = Number(rem / lakh);
    rem = rem % lakh;
    parts.push(`${threeDigitsToWords(numLakh, 'us')} lakh`);
  }

  // Handle Thousands
  if (rem >= thousand) {
    const numThousand = Number(rem / thousand);
    rem = rem % thousand;
    parts.push(`${threeDigitsToWords(numThousand, 'us')} thousand`);
  }

  // Handle Hundreds
  if (rem >= hundred) {
    const numHundred = Number(rem / hundred);
    rem = rem % hundred;
    parts.push(`${ONES[numHundred]} hundred`);
  }

  // Remaining 1..99
  if (rem > BigInt('0')) {
    const numRem = Number(rem);
    if (numRem < 20) {
      parts.push(ONES[numRem]);
    } else {
      const tens = Math.floor(numRem / 10);
      const ones = numRem % 10;
      if (ones > 0) {
        parts.push(`${TENS[tens]}-${ONES[ones]}`);
      } else {
        parts.push(TENS[tens]);
      }
    }
  }

  return parts.join(' ');
}

export interface ParsedNumber {
  sign: '-' | '';
  intPart: bigint;
  fracStr: string;
  isNegativeZero: boolean;
}

/**
 * Parses user input string (handling commas, Indian commas, spaces, decimals, sign).
 */
export function parseNumberInput(input: string): ParsedNumber | null {
  const clean = input.trim().replace(/[\s,$₹€£]/g, '');
  if (!clean || clean === '-' || clean === '+') return null;

  let sign: '-' | '' = '';
  let rest = clean;
  if (clean.startsWith('-')) {
    sign = '-';
    rest = clean.slice(1);
  } else if (clean.startsWith('+')) {
    rest = clean.slice(1);
  }

  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(rest)) {
    return null;
  }

  const dotIdx = rest.indexOf('.');
  let intStr = dotIdx >= 0 ? rest.slice(0, dotIdx) : rest;
  const fracStr = dotIdx >= 0 ? rest.slice(dotIdx + 1) : '';

  if (intStr.length === 0) intStr = '0';

  const intPart = BigInt(intStr);
  const isZero = intPart === BigInt('0') && (!fracStr || /^0+$/.test(fracStr));

  return {
    sign: isZero ? '' : sign,
    intPart,
    fracStr,
    isNegativeZero: isZero && clean.startsWith('-'),
  };
}

/**
 * Rounds decimal cents to 2 digits with half-up rounding, handling integer carry.
 * e.g. "995" -> { intCarry: 1, centsStr: "00" }
 * e.g. "567" -> { intCarry: 0, centsStr: "57" }
 * e.g. "05" -> { intCarry: 0, centsStr: "05" }
 */
export function roundCents(fracStr: string): { intCarry: number; centsStr: string } {
  if (!fracStr) {
    return { intCarry: 0, centsStr: '00' };
  }

  if (fracStr.length === 1) {
    return { intCarry: 0, centsStr: `${fracStr}0` };
  }

  if (fracStr.length === 2) {
    return { intCarry: 0, centsStr: fracStr };
  }

  // 3 or more digits: round on the 3rd digit
  const firstTwo = parseInt(fracStr.slice(0, 2), 10);
  const thirdDigit = parseInt(fracStr.charAt(2), 10);

  let cents = firstTwo;
  if (thirdDigit >= 5) {
    cents += 1;
  }

  if (cents >= 100) {
    return { intCarry: 1, centsStr: '00' };
  }

  return { intCarry: 0, centsStr: cents.toString().padStart(2, '0') };
}

/**
 * Generates US check amount line:
 * e.g. 5075.62 -> "Five thousand seventy-five and 62/100 dollars"
 */
export function toCheckAmount(input: string, options: { suffix?: string } = {}): string | null {
  const parsed = parseNumberInput(input);
  if (!parsed || parsed.sign === '-') return null;

  const { intCarry, centsStr } = roundCents(parsed.fracStr);
  const effectiveInt = parsed.intPart + BigInt(intCarry.toString());
  if (effectiveInt.toString().length > MAX_NAMED_DIGITS) return null;

  const words = bigIntToWords(effectiveInt, { style: 'us' });
  let checkLine = `${applyCase(words, 'sentence')} and ${centsStr}/100 dollars`;
  if (options.suffix) {
    checkLine += ` ${options.suffix}`;
  }
  return checkLine;
}

/**
 * Generates Indian cheque amount line:
 * e.g. 12,34,567.50 -> "Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only"
 */
export function toIndianChequeAmount(input: string): string | null {
  const parsed = parseNumberInput(input);
  if (!parsed || parsed.sign === '-') return null;

  const { intCarry, centsStr } = roundCents(parsed.fracStr);
  const effectiveInt = parsed.intPart + BigInt(intCarry.toString());
  // From one crore crore up, the lakh/crore names repeat and stop being readable.
  if (effectiveInt.toString().length > 14) return null;

  const rupeeWords = applyCase(bigIntToIndianWords(effectiveInt), 'title');
  const paiseVal = parseInt(centsStr, 10);

  let result = `Rupees ${rupeeWords}`;
  if (paiseVal > 0) {
    const paiseWords = applyCase(threeDigitsToWords(paiseVal, 'us'), 'title');
    result += ` and ${paiseWords} Paise`;
  }
  result += ' Only';

  return result;
}

/**
 * Formats a number with comma groupings:
 * - 'intl': 1,234,567
 * - 'indian': 12,34,567
 */
export function groupDigits(digits: string, system: GroupingStyle): string {
  const clean = digits.replace(/\D/g, '');
  if (!clean) return '';

  if (system === 'intl') {
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Indian grouping: last 3 digits, then groups of 2
  if (clean.length <= 3) return clean;
  const lastThree = clean.slice(-3);
  const leading = clean.slice(0, -3);
  const leadingGrouped = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${leadingGrouped},${lastThree}`;
}

/**
 * Converts a cardinal number in words to an ordinal:
 * e.g. "twenty-one" -> "twenty-first", "one hundred" -> "one hundredth"
 */
export function toOrdinalWords(cardinal: string): string {
  const clean = cardinal.trim();
  if (!clean) return '';

  const words = clean.split(' ');
  const lastWord = words[words.length - 1];

  let ordinalLast = '';

  // Check hyphenated compound (e.g. "twenty-one")
  const hyphenIdx = lastWord.lastIndexOf('-');
  if (hyphenIdx >= 0) {
    const prefix = lastWord.slice(0, hyphenIdx + 1);
    const sub = lastWord.slice(hyphenIdx + 1);
    if (ORDINAL_IRREGULARS[sub]) {
      ordinalLast = prefix + ORDINAL_IRREGULARS[sub];
    } else if (sub.endsWith('y')) {
      ordinalLast = `${prefix}${sub.slice(0, -1)}ieth`;
    } else {
      ordinalLast = `${prefix}${sub}th`;
    }
  } else if (ORDINAL_IRREGULARS[lastWord]) {
    ordinalLast = ORDINAL_IRREGULARS[lastWord];
  } else if (lastWord.endsWith('y')) {
    ordinalLast = `${lastWord.slice(0, -1)}ieth`;
  } else if (lastWord.endsWith('e')) {
    ordinalLast = `${lastWord.slice(0, -1)}th`;
  } else {
    ordinalLast = `${lastWord}th`;
  }

  words[words.length - 1] = ordinalLast;
  return words.join(' ');
}

/**
 * Maps word token to value for reverse parsing (words -> digits).
 */
const WORD_VALUES: Record<string, bigint> = {
  zero: BigInt('0'),
  one: BigInt('1'),
  first: BigInt('1'),
  a: BigInt('1'),
  two: BigInt('2'),
  second: BigInt('2'),
  three: BigInt('3'),
  third: BigInt('3'),
  four: BigInt('4'),
  fourth: BigInt('4'),
  five: BigInt('5'),
  fifth: BigInt('5'),
  six: BigInt('6'),
  sixth: BigInt('6'),
  seven: BigInt('7'),
  seventh: BigInt('7'),
  eight: BigInt('8'),
  eighth: BigInt('8'),
  nine: BigInt('9'),
  ninth: BigInt('9'),
  ten: BigInt('10'),
  tenth: BigInt('10'),
  eleven: BigInt('11'),
  eleventh: BigInt('11'),
  twelve: BigInt('12'),
  twelfth: BigInt('12'),
  thirteen: BigInt('13'),
  thirteenth: BigInt('13'),
  fourteenth: BigInt('14'),
  fifteenth: BigInt('15'),
  sixteenth: BigInt('16'),
  seventeenth: BigInt('17'),
  eighteenth: BigInt('18'),
  nineteenth: BigInt('19'),
  fourteen: BigInt('14'),
  fifteen: BigInt('15'),
  sixteen: BigInt('16'),
  seventeen: BigInt('17'),
  eighteen: BigInt('18'),
  nineteen: BigInt('19'),
  twenty: BigInt('20'),
  twentieth: BigInt('20'),
  thirty: BigInt('30'),
  thirtieth: BigInt('30'),
  forty: BigInt('40'),
  fortieth: BigInt('40'),
  fifty: BigInt('50'),
  fiftieth: BigInt('50'),
  sixty: BigInt('60'),
  sixtieth: BigInt('60'),
  seventy: BigInt('70'),
  seventieth: BigInt('70'),
  eighty: BigInt('80'),
  eightieth: BigInt('80'),
  ninety: BigInt('90'),
  ninetieth: BigInt('90'),
};

const SCALE_MULTIPLIERS: Record<string, bigint> = {
  lakh: BigInt('100000'),
  lac: BigInt('100000'),
  crore: BigInt('10000000'),
};
INTL_SCALES.forEach((name, i) => {
  if (name) SCALE_MULTIPLIERS[name] = BigInt('1' + '000'.repeat(i));
});
Object.keys(SCALE_MULTIPLIERS).forEach((name) => {
  SCALE_MULTIPLIERS[`${name}s`] = SCALE_MULTIPLIERS[name];
  SCALE_MULTIPLIERS[`${name}th`] = SCALE_MULTIPLIERS[name];
});

const IGNORED_WORDS = ['and', 'only', 'exactly', 'rupee', 'rupees', 'dollar', 'dollars'];
const has = (map: Record<string, bigint>, key: string) => Object.prototype.hasOwnProperty.call(map, key);

export interface ReverseParseResult {
  success: boolean;
  value?: bigint; // integer part, signed
  formatted?: string; // plain digits with sign and decimals
  formattedIntl?: string;
  formattedIndian?: string;
  unknownWord?: string; // the word that could not be read, or that breaks the order
}

/**
 * Reverse parser: English number words to digits.
 * "three hundred fifty" -> 350, "one thousand crore" -> 10,000,000,000, "minus three point one" -> -3.1
 */
export function parseWordsToNumber(text: string): ReverseParseResult {
  const tokens = text.toLowerCase().replace(/[,.]/g, ' ').split(/[\s-]+/).filter(Boolean);
  if (tokens.length === 0) return { success: false };

  const zero = BigInt('0');
  const one = BigInt('1');
  const ten = BigInt('10');
  const twenty = BigInt('20');
  const hundred = BigInt('100');
  let sign = '';
  if (tokens[0] === 'minus' || tokens[0] === 'negative') {
    sign = '-';
    tokens.shift();
  }

  const stack: { value: bigint; scale: bigint }[] = [];
  let group = zero;
  let seen = false;
  let sawZero = false;
  let fraction: string | null = null;

  for (const token of tokens) {
    if (fraction !== null) {
      if (!has(WORD_VALUES, token) || WORD_VALUES[token] >= ten || token === 'a') {
        return { success: false, unknownWord: token };
      }
      fraction += WORD_VALUES[token].toString();
      continue;
    }
    if (token === 'point') {
      fraction = '';
      continue;
    }
    if (IGNORED_WORDS.indexOf(token) >= 0) continue;

    if (token === 'hundred' || token === 'hundreds' || token === 'hundredth') {
      if (group >= hundred || sawZero) return { success: false, unknownWord: token };
      group = (group === zero ? one : group) * hundred;
    } else if (has(WORD_VALUES, token)) {
      const value = WORD_VALUES[token];
      const tail = group % hundred;
      let ok = !sawZero;
      if (value === zero) ok = !seen;
      else if (tail !== zero) ok = ok && value < ten && tail >= twenty && tail % ten === zero;
      if (!ok) return { success: false, unknownWord: token };
      if (value === zero) sawZero = true;
      group += value;
    } else if (has(SCALE_MULTIPLIERS, token)) {
      const scale = SCALE_MULTIPLIERS[token];
      if (sawZero) return { success: false, unknownWord: token };
      // Smaller scales before a bigger one multiply together: "one lakh crore".
      let sum = group;
      while (stack.length > 0 && stack[stack.length - 1].scale < scale) {
        sum += stack[stack.length - 1].value;
        stack.pop();
      }
      if (stack.length > 0 && stack[stack.length - 1].scale === scale) return { success: false, unknownWord: token };
      stack.push({ value: (sum === zero ? one : sum) * scale, scale });
      group = zero;
    } else {
      return { success: false, unknownWord: token };
    }
    seen = true;
  }

  if (!seen && !fraction) return { success: false };
  if (fraction === '') return { success: false, unknownWord: 'point' };

  const total = stack.reduce((sum, entry) => sum + entry.value, group);
  const digits = total.toString();
  const tail = fraction ? `.${fraction}` : '';
  if (total === zero && !/[1-9]/.test(tail)) sign = '';
  return {
    success: true,
    value: sign ? -total : total,
    formatted: `${sign}${digits}${tail}`,
    formattedIntl: `${sign}${groupDigits(digits, 'intl')}${tail}`,
    formattedIndian: `${sign}${groupDigits(digits, 'indian')}${tail}`,
  };
}

/**
 * Formats fractional decimals in words:
 * e.g. "14" -> "and fourteen hundredths"
 * e.g. "5" -> "and five tenths"
 * e.g. "05" -> "and five hundredths"
 * e.g. "000" -> "and zero thousandths"
 * Past millionths (> 6 decimals): falls back to "point" and notes it.
 */
export function formatFractionalDecimals(
  fracStr: string,
  options: { style?: ScaleStyle; groupingSystem?: GroupingStyle } = {}
): { text: string; fallbackToPoint: boolean } {
  if (!fracStr) return { text: '', fallbackToPoint: false };

  // Past millionths (> 6 decimal digits): fall back to "point"
  if (fracStr.length > 6) {
    const pointWords = fracStr
      .split('')
      .map((d) => bigIntToWords(BigInt(d), options))
      .join(' ');
    return {
      text: `point ${pointWords}`,
      fallbackToPoint: true,
    };
  }

  const denominatorUnits: { [len: number]: [string, string] } = {
    1: ['tenth', 'tenths'],
    2: ['hundredth', 'hundredths'],
    3: ['thousandth', 'thousandths'],
    4: ['ten-thousandth', 'ten-thousandths'],
    5: ['hundred-thousandth', 'hundred-thousandths'],
    6: ['millionth', 'millionths'],
  };

  const den = denominatorUnits[fracStr.length];
  const val = BigInt(fracStr);
  const numWords = options.groupingSystem === 'indian' ? bigIntToIndianWords(val) : bigIntToWords(val, options);
  const unit = val === BigInt('1') ? den[0] : den[1];

  return {
    text: `and ${numWords} ${unit}`,
    fallbackToPoint: false,
  };
}

export interface ConvertNumberOptions {
  groupingSystem?: GroupingStyle;
  scaleStyle?: ScaleStyle;
  decimalStyle?: 'point' | 'fraction';
  caseStyle?: CaseStyle;
}

/**
 * Converts a string number representation into full spelled words.
 */
export function numberStringToWords(
  input: string,
  options: ConvertNumberOptions = {}
): { text: string; isError: boolean; note?: string; groupedIntl?: string; groupedIndian?: string } {
  const {
    groupingSystem = 'intl',
    scaleStyle = 'us',
    decimalStyle = 'point',
    caseStyle = 'sentence',
  } = options;

  const parsed = parseNumberInput(input);
  if (!parsed) return { text: 'Enter digits only (e.g. 1,234,567 or -42.5)', isError: true };

  if (parsed.intPart.toString().length > MAX_NAMED_DIGITS) {
    return { text: 'Too large to name (over 36 digits). Use scientific notation.', isError: true };
  }

  let note: string | undefined;
  let words =
    groupingSystem === 'indian'
      ? bigIntToIndianWords(parsed.intPart)
      : bigIntToWords(parsed.intPart, { style: scaleStyle });

  if (parsed.fracStr) {
    if (decimalStyle === 'fraction') {
      const frac = formatFractionalDecimals(parsed.fracStr, { style: scaleStyle, groupingSystem });
      if (frac.fallbackToPoint) note = 'More than 6 decimal places, so the point style was used.';
      words += ` ${frac.text}`;
    } else {
      const pointWords = parsed.fracStr
        .split('')
        .map((d) => bigIntToWords(BigInt(d), { style: scaleStyle }))
        .join(' ');
      words += ` point ${pointWords}`;
    }
  }

  if (parsed.sign === '-') {
    words = `negative ${words}`;
  }

  return {
    text: applyCase(words, caseStyle),
    isError: false,
    note,
    groupedIntl: groupDigits(parsed.intPart.toString(), 'intl'),
    groupedIndian: groupDigits(parsed.intPart.toString(), 'indian'),
  };
}

export interface LargeNumberScaleItem {
  name: string;
  powerOfTen: number;
  digits: number;
  system: string;
  example: string;
}

export const LARGE_NUMBER_NAMES: LargeNumberScaleItem[] = [
  { name: 'Thousand', powerOfTen: 3, digits: 4, system: 'International', example: '1,000' },
  { name: 'Lakh', powerOfTen: 5, digits: 6, system: 'Indian', example: '1,00,000' },
  { name: 'Million', powerOfTen: 6, digits: 7, system: 'International', example: '1,000,000' },
  { name: 'Crore', powerOfTen: 7, digits: 8, system: 'Indian', example: '1,00,00,000' },
  { name: 'Billion', powerOfTen: 9, digits: 10, system: 'International (Short Scale)', example: '1,000,000,000' },
  { name: 'Trillion', powerOfTen: 12, digits: 13, system: 'International', example: '1,000,000,000,000' },
  { name: 'Quadrillion', powerOfTen: 15, digits: 16, system: 'International', example: '1,000,000,000,000,000' },
  { name: 'Quintillion', powerOfTen: 18, digits: 19, system: 'International', example: '10^18' },
  { name: 'Sextillion', powerOfTen: 21, digits: 22, system: 'International', example: '10^21' },
  { name: 'Septillion', powerOfTen: 24, digits: 25, system: 'International', example: '10^24' },
  { name: 'Octillion', powerOfTen: 27, digits: 28, system: 'International', example: '10^27' },
  { name: 'Nonillion', powerOfTen: 30, digits: 31, system: 'International', example: '10^30' },
  { name: 'Decillion', powerOfTen: 33, digits: 34, system: 'International', example: '10^33' },
];
