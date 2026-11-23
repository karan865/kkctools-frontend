/**
 * Date Difference and Age Calculation Engine.
 * Implements the Month-Stepping calendar algorithm (updated 2026-11-22).
 * Shared across Age Difference (#02), Simple & Accrued Interest (#17), CAGR (#06),
 * and Batch 8 Date Tools.
 * Pure UTC date-only math. No timezone shifts. Zero network.
 */

export interface DateYMD {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  remainingDays: number;
  totalMonths: number;
  isNegative: boolean; // true if dateB < dateA
}

export type DayCountConvention = 'ACT/365' | 'ACT/360' | '30/360' | 'ACT/ACT';

/**
 * Checks if a given year is a leap year in the Gregorian calendar.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in a specific month of a specific year.
 */
export function getDaysInMonth(year: number, month: number): number {
  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

/**
 * Parses an ISO date string (YYYY-MM-DD) into DateYMD without timezone distortion.
 */
export function parseISODate(dateStr: string): DateYMD | null {
  if (!dateStr) return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12) return null;
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) return null;

  return { year, month, day };
}

/**
 * Formats DateYMD into ISO string (YYYY-MM-DD).
 */
export function formatISODate(d: DateYMD): string {
  const y = d.year.toString().padStart(4, '0');
  const m = d.month.toString().padStart(2, '0');
  const day = d.day.toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Converts DateYMD to UTC day number since Unix epoch (1970-01-01).
 */
export function dateToUtcDayNumber(d: DateYMD): number {
  // setUTCFullYear keeps years 0–99 literal (Date.UTC maps them to 1900–1999).
  const t = new Date(0);
  t.setUTCFullYear(d.year, d.month - 1, d.day);
  return Math.floor(t.getTime() / 86400000);
}

/**
 * Adds clamped months to a DateYMD.
 * If target month has fewer days than d.day (e.g. Jan 31 + 1 month),
 * clamps to the last day of the month (e.g. Feb 28 or Feb 29).
 */
export function addMonthsClamped(d: DateYMD, monthsToAdd: number): DateYMD {
  const totalMonths = d.year * 12 + (d.month - 1) + monthsToAdd;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = (totalMonths % 12) + 1;
  const maxDay = getDaysInMonth(targetYear, targetMonth);
  const targetDay = Math.min(d.day, maxDay);

  return {
    year: targetYear,
    month: targetMonth,
    day: targetDay,
  };
}

/**
 * Calculates calendar difference between two dates using Month-Stepping.
 * Always treats dateA as the earlier baseline and dateB as later (reverses if needed).
 */
export function calculateDateDiff(dateA: DateYMD, dateB: DateYMD): DateDiffResult {
  const dayNumA = dateToUtcDayNumber(dateA);
  const dayNumB = dateToUtcDayNumber(dateB);

  const isNegative = dayNumB < dayNumA;
  const start = isNegative ? dateB : dateA;
  const end = isNegative ? dateA : dateB;

  const totalDays = Math.abs(dayNumB - dayNumA);
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // Month-stepping: find largest whole k such that addMonthsClamped(start, k) <= end
  let k = 0;
  // Fast approximate initial guess
  const approxYears = end.year - start.year;
  const approxMonths = approxYears * 12 + (end.month - start.month) - 1;
  k = Math.max(0, approxMonths);

  const dayNumEnd = dateToUtcDayNumber(end);
  while (dateToUtcDayNumber(addMonthsClamped(start, k + 1)) <= dayNumEnd) {
    k++;
  }

  const steppedDate = addMonthsClamped(start, k);
  const days = dateToUtcDayNumber(end) - dateToUtcDayNumber(steppedDate);

  const years = Math.floor(k / 12);
  const months = k % 12;
  const totalMonths = k;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingDays,
    totalMonths,
    isNegative,
  };
}

/**
 * Computes the latest date of birth to reach a target age as of a specific date.
 * If target year is non-leap and birthday was Feb 29, returns Feb 28.
 */
export function calculateBornOnOrBefore(targetAge: number, asOf: DateYMD): DateYMD {
  const birthYear = asOf.year - targetAge;
  const maxDays = getDaysInMonth(birthYear, asOf.month);
  const birthDay = Math.min(asOf.day, maxDays);

  return {
    year: birthYear,
    month: asOf.month,
    day: birthDay,
  };
}

export interface FamilyMemberInput {
  name: string;
  dob: DateYMD;
}

export interface FamilyMemberResult {
  name: string;
  dob: DateYMD;
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  gapToNext?: DateDiffResult;
}

export interface FamilyComparisonResult {
  membersSorted: FamilyMemberResult[];
  overallSpread: DateDiffResult | null;
}

/**
 * Compares an array of family members or people, sorting by age (oldest first),
 * computing current age as of a date, pairwise gaps to the next person, and total family spread.
 */
export function compareFamilyAges(
  members: FamilyMemberInput[],
  asOf: DateYMD
): FamilyComparisonResult | null {
  if (members.length < 2) return null;

  // Sort ascending by birthdate (earliest DOB = oldest first)
  const sorted = [...members].sort((a, b) => {
    const da = dateToUtcDayNumber(a.dob);
    const db = dateToUtcDayNumber(b.dob);
    return da - db;
  });

  const memberResults: FamilyMemberResult[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    const age = calculateDateDiff(m.dob, asOf);

    let gapToNext: DateDiffResult | undefined;
    if (i < sorted.length - 1) {
      gapToNext = calculateDateDiff(m.dob, sorted[i + 1].dob);
    }

    memberResults.push({
      name: m.name || `Person ${i + 1}`,
      dob: m.dob,
      ageYears: age.years,
      ageMonths: age.months,
      ageDays: age.days,
      gapToNext,
    });
  }

  const oldest = sorted[0];
  const youngest = sorted[sorted.length - 1];
  const overallSpread = calculateDateDiff(oldest.dob, youngest.dob);

  return {
    membersSorted: memberResults,
    overallSpread,
  };
}

export function quickBirthYearDiff(yearA: number, yearB: number): { diffYears: number; note: string } {
  const diff = Math.abs(yearA - yearB);
  return {
    diffYears: diff,
    note: `Born in ${yearA} vs ${yearB} means a calendar year difference of ${diff} year${diff === 1 ? '' : 's'}. Depending on specific birth dates, the exact age gap can vary by ±1 year.`,
  };
}

/**
 * Calculates year fraction between dates for financial interest calculations.
 */
export function calculateYearFraction(
  start: DateYMD,
  end: DateYMD,
  convention: DayCountConvention = 'ACT/365'
): number {
  const dayA = dateToUtcDayNumber(start);
  const dayB = dateToUtcDayNumber(end);
  const actualDays = Math.max(0, dayB - dayA);

  switch (convention) {
    case 'ACT/365':
      return actualDays / 365.0;
    case 'ACT/360':
      return actualDays / 360.0;
    case '30/360': {
      // US NASD 30/360
      const d1 = start.day === 31 ? 30 : start.day;
      let d2 = end.day;
      if (end.day === 31 && d1 >= 30) {
        d2 = 30;
      }
      const days360 =
        (end.year - start.year) * 360 +
        (end.month - start.month) * 30 +
        (d2 - d1);
      return Math.max(0, days360) / 360.0;
    }
    case 'ACT/ACT': {
      if (start.year === end.year) {
        const yearDays = isLeapYear(start.year) ? 366 : 365;
        return actualDays / yearDays;
      }
      // Multi-year actual/actual
      const yearStart = isLeapYear(start.year) ? 366 : 365;
      const yearEnd = isLeapYear(end.year) ? 366 : 365;
      const daysInStartYear =
        dateToUtcDayNumber({ year: start.year, month: 12, day: 31 }) - dayA + 1;
      const daysInEndYear =
        dayB - dateToUtcDayNumber({ year: end.year, month: 1, day: 1 });
      const fullYears = Math.max(0, end.year - start.year - 1);

      return (
        daysInStartYear / yearStart +
        fullYears +
        daysInEndYear / yearEnd
      );
    }
  }
}
