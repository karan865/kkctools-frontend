/**
 * Wage Engine — Pure mathematical functions for converting wages across all 8 pay periods
 * (hour, day, week, biweek, semi-month, month, quarter, year), accounting for working schedules,
 * paid vs unpaid time off, overtime multipliers (FLSA), and wage comparison / raise scenarios.
 *
 * Official metrology and labor standards:
 * - US Department of Labor (DOL) Fair Labor Standards Act (FLSA) — 40 h standard week, 1.5x OT
 * - US Office of Personnel Management (OPM) — 2,087 annual divisor for federal hourly wages
 * - Standard Commercial Work Year: 40 hours/week x 52 weeks = 2,080 hours
 * - UK Working Time Regulations 1998 — 37.5 h standard full-time week (1,950 h/year)
 * - Australia Fair Work Commission — 38.0 h standard full-time week (1,976 h/year)
 */

export type PayPeriod =
  | 'hour'
  | 'day'
  | 'week'
  | 'biweek'
  | 'semi_month'
  | 'month'
  | 'quarter'
  | 'year';

export interface DailySchedule {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface WageInput {
  amount: number;
  period: PayPeriod;
  hoursPerWeek?: number; // default 40
  daysPerWeek?: number; // default 5
  weeksPerYear?: number; // default 52
  dailySchedule?: DailySchedule; // optional custom daily hours
  paidHolidaysDays?: number; // default 0 (salaried pay unchanged, changes worked hr rate)
  paidVacationDays?: number; // default 0
  unpaidDaysOff?: number; // default 0 (reduces annual pay)
  overtimeHoursPerWeek?: number; // default 0
  overtimeMultiplier?: number; // default 1.5
}

export interface PayPeriodBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number; // 26 paychecks per year
  semiMonthly: number; // 24 paychecks per year
  monthly: number; // 12 paychecks per year
  quarterly: number; // 4 quarters per year
  annual: number; // 1 year
}

export interface WageResult {
  regularAnnualGross: number;
  overtimeAnnualGross: number;
  totalAnnualGross: number;
  periods: PayPeriodBreakdown;
  workingHoursScheduled: number; // e.g. 2,080
  paidHoursPerYear: number;
  unpaidHoursPerYear: number;
  actualWorkedHoursPerYear: number;
  effectiveHourlyWorked: number; // annual gross / actual worked hours (accounting for paid time off)
  summarySentence: string;
}

export interface CompareWageInput {
  currentWage: WageInput;
  secondWage?: WageInput;
  raisePercent?: number; // e.g. 5 for 5% raise
}

export interface CompareWageResult {
  currentAnnual: number;
  newAnnual: number;
  annualDifference: number;
  monthlyDifference: number;
  hourlyDifference: number;
  percentChange: number;
  summarySentence: string;
}

export interface WageTableRow {
  hourlyRate: number;
  weeklyGross: number;
  biweeklyGross: number;
  monthlyGross: number;
  annualGross: number;
}

/**
 * Normalises floating point jitter and -0 to 0.
 */
function clean(n: number): number {
  if (Object.is(n, -0)) return 0;
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round((n + Number.EPSILON) * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Convert any input wage specification to total annual gross and derived periods.
 */
export function calculateWage(input: WageInput): WageResult {
  const amount = Math.max(0, input.amount || 0);
  const period = input.period;

  // Resolve hours per week
  let hoursPerWeek = input.hoursPerWeek !== undefined ? Math.max(0, input.hoursPerWeek) : 40;
  let daysPerWeek = input.daysPerWeek !== undefined ? Math.max(0.1, input.daysPerWeek) : 5;

  if (input.dailySchedule) {
    const s = input.dailySchedule;
    hoursPerWeek = Math.max(0, s.monday + s.tuesday + s.wednesday + s.thursday + s.friday + s.saturday + s.sunday);
    const activeDays = [s.monday, s.tuesday, s.wednesday, s.thursday, s.friday, s.saturday, s.sunday].filter(
      (h) => h > 0
    ).length;
    daysPerWeek = Math.max(1, activeDays);
  }

  const weeksPerYear = input.weeksPerYear !== undefined ? Math.max(1, input.weeksPerYear) : 52;
  const hoursPerDay = daysPerWeek > 0 ? hoursPerWeek / daysPerWeek : 8;

  // Time off
  const paidHolidaysDays = Math.max(0, input.paidHolidaysDays || 0);
  const paidVacationDays = Math.max(0, input.paidVacationDays || 0);
  const unpaidDaysOff = Math.max(0, input.unpaidDaysOff || 0);

  // Overtime
  const otHoursPerWeek = Math.max(0, input.overtimeHoursPerWeek || 0);
  const otMultiplier = Math.max(1, input.overtimeMultiplier !== undefined ? input.overtimeMultiplier : 1.5);

  const totalScheduledHours = clean(hoursPerWeek * weeksPerYear);
  const unpaidHours = clean(unpaidDaysOff * hoursPerDay);
  const paidHoursPerYear = Math.max(0, clean(totalScheduledHours - unpaidHours));

  // Determine base hourly rate and regular annual gross
  let baseHourly = 0;
  let regularAnnualGross = 0;

  switch (period) {
    case 'hour':
      baseHourly = amount;
      regularAnnualGross = clean(baseHourly * paidHoursPerYear);
      break;
    case 'day':
      baseHourly = hoursPerDay > 0 ? clean(amount / hoursPerDay) : 0;
      regularAnnualGross = clean(amount * (daysPerWeek * weeksPerYear - unpaidDaysOff));
      break;
    case 'week':
      baseHourly = hoursPerWeek > 0 ? clean(amount / hoursPerWeek) : 0;
      regularAnnualGross = clean(amount * (weeksPerYear - (unpaidDaysOff / daysPerWeek)));
      break;
    case 'biweek':
      // 26 biweekly periods per 52-week year
      baseHourly = hoursPerWeek > 0 ? clean(amount / (hoursPerWeek * 2)) : 0;
      regularAnnualGross = clean(amount * 26 - (unpaidDaysOff * hoursPerDay * baseHourly));
      break;
    case 'semi_month':
      // 24 paychecks per year (twice a month)
      regularAnnualGross = clean(amount * 24 - (unpaidDaysOff * hoursPerDay * (totalScheduledHours > 0 ? (amount * 24) / totalScheduledHours : 0)));
      baseHourly = totalScheduledHours > 0 ? clean((amount * 24) / totalScheduledHours) : 0;
      break;
    case 'month':
      // 12 months per year
      regularAnnualGross = clean(amount * 12 - (unpaidDaysOff * hoursPerDay * (totalScheduledHours > 0 ? (amount * 12) / totalScheduledHours : 0)));
      baseHourly = totalScheduledHours > 0 ? clean((amount * 12) / totalScheduledHours) : 0;
      break;
    case 'quarter':
      // 4 quarters per year
      regularAnnualGross = clean(amount * 4 - (unpaidDaysOff * hoursPerDay * (totalScheduledHours > 0 ? (amount * 4) / totalScheduledHours : 0)));
      baseHourly = totalScheduledHours > 0 ? clean((amount * 4) / totalScheduledHours) : 0;
      break;
    case 'year':
      // Annual salary input: unpaid days deduct from annual salary
      baseHourly = totalScheduledHours > 0 ? clean(amount / totalScheduledHours) : 0;
      regularAnnualGross = clean(amount - (unpaidDaysOff * hoursPerDay * baseHourly));
      break;
  }

  // Ensure regularAnnualGross cannot be negative
  regularAnnualGross = Math.max(0, regularAnnualGross);

  // Overtime computation: applies across paid weeks
  const paidWeeksRatio = totalScheduledHours > 0 ? paidHoursPerYear / totalScheduledHours : 0;
  const annualOtHours = clean(otHoursPerWeek * weeksPerYear * paidWeeksRatio);
  const overtimeAnnualGross = clean(annualOtHours * baseHourly * otMultiplier);

  const totalAnnualGross = clean(regularAnnualGross + overtimeAnnualGross);

  // Derived period breakdown from totalAnnualGross
  const periods: PayPeriodBreakdown = {
    annual: totalAnnualGross,
    quarterly: clean(totalAnnualGross / 4),
    monthly: clean(totalAnnualGross / 12),
    semiMonthly: clean(totalAnnualGross / 24),
    biweekly: clean(totalAnnualGross / 26),
    weekly: clean(totalAnnualGross / weeksPerYear),
    daily: daysPerWeek > 0 ? clean(totalAnnualGross / (weeksPerYear * daysPerWeek)) : 0,
    hourly: paidHoursPerYear > 0 ? clean(regularAnnualGross / paidHoursPerYear) : 0,
  };

  // Hours actually worked (subtracting paid holidays and paid vacation)
  const paidTimeOffHours = clean((paidHolidaysDays + paidVacationDays) * hoursPerDay);
  const actualWorkedHoursPerYear = Math.max(0, clean(paidHoursPerYear - paidTimeOffHours + annualOtHours));
  const effectiveHourlyWorked =
    actualWorkedHoursPerYear > 0 ? clean(totalAnnualGross / actualWorkedHoursPerYear) : periods.hourly;

  // Plain-English explanation sentence
  let summarySentence = '';
  if (period === 'hour') {
    summarySentence = `$${amount.toFixed(2)} an hour at ${hoursPerWeek} hours a week is $${totalAnnualGross.toLocaleString(
      'en-US',
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )} a year before tax, about $${periods.monthly.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} a month or $${periods.biweekly.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} every two weeks.`;
  } else if (period === 'year') {
    summarySentence = `A salary of $${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} a year equates to $${periods.hourly.toFixed(2)} per hour at ${hoursPerWeek} hours a week, or $${periods.monthly.toLocaleString(
      'en-US',
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )} per month.`;
  } else {
    summarySentence = `$${amount.toFixed(2)} per ${formatPeriodName(
      period
    )} equals an annual gross income of $${totalAnnualGross.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} ($${periods.hourly.toFixed(2)}/hour at ${hoursPerWeek} h/week).`;
  }

  return {
    regularAnnualGross,
    overtimeAnnualGross,
    totalAnnualGross,
    periods,
    workingHoursScheduled: totalScheduledHours,
    paidHoursPerYear,
    unpaidHoursPerYear: unpaidHours,
    actualWorkedHoursPerYear,
    effectiveHourlyWorked,
    summarySentence,
  };
}

/**
 * Compare two wages or evaluate a percentage raise.
 */
export function compareWages(input: CompareWageInput): CompareWageResult {
  const currentRes = calculateWage(input.currentWage);
  let newAnnual = 0;

  if (input.secondWage) {
    const secondRes = calculateWage(input.secondWage);
    newAnnual = secondRes.totalAnnualGross;
  } else if (input.raisePercent !== undefined) {
    const raiseMultiplier = 1 + input.raisePercent / 100;
    newAnnual = clean(currentRes.totalAnnualGross * raiseMultiplier);
  } else {
    newAnnual = currentRes.totalAnnualGross;
  }

  const currentAnnual = currentRes.totalAnnualGross;
  const annualDifference = clean(newAnnual - currentAnnual);
  const monthlyDifference = clean(annualDifference / 12);
  const hourlyDifference =
    currentRes.paidHoursPerYear > 0 ? clean(annualDifference / currentRes.paidHoursPerYear) : 0;
  const percentChange =
    currentAnnual > 0 ? clean((annualDifference / currentAnnual) * 100) : 0;

  const sign = annualDifference >= 0 ? '+' : '';
  const summarySentence =
    annualDifference >= 0
      ? `A ${sign}$${annualDifference.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })} annual increase (+${percentChange.toFixed(1)}%), adding $${Math.abs(monthlyDifference).toLocaleString(
          'en-US',
          { minimumFractionDigits: 0, maximumFractionDigits: 0 }
        )} to your monthly gross pay.`
      : `A decrease of $${Math.abs(annualDifference).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })} per year (${percentChange.toFixed(1)}%), reducing monthly gross pay by $${Math.abs(
          monthlyDifference
        ).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}.`;

  return {
    currentAnnual,
    newAnnual,
    annualDifference,
    monthlyDifference,
    hourlyDifference,
    percentChange,
    summarySentence,
  };
}

/**
 * Generate standard reference table for wages $10 to $100 per hour (at 40 h/week x 52 weeks = 2,080 h)
 */
export function generateWageTable(hoursPerWeek = 40, weeksPerYear = 52): WageTableRow[] {
  const rates: number[] = [];
  // $10 to $30 in $1 increments
  for (let r = 10; r <= 30; r++) {
    rates.push(r);
  }
  // $35 to $100 in $5 increments
  for (let r = 35; r <= 100; r += 5) {
    rates.push(r);
  }

  return rates.map((hourly) => {
    const annual = clean(hourly * hoursPerWeek * weeksPerYear);
    return {
      hourlyRate: hourly,
      weeklyGross: clean(hourly * hoursPerWeek),
      biweeklyGross: clean(annual / 26),
      monthlyGross: clean(annual / 12),
      annualGross: annual,
    };
  });
}

/**
 * Human-readable period labels
 */
export function formatPeriodName(period: PayPeriod): string {
  switch (period) {
    case 'hour':
      return 'hour';
    case 'day':
      return 'day';
    case 'week':
      return 'week';
    case 'biweek':
      return 'two weeks (biweekly)';
    case 'semi_month':
      return 'semi-monthly (2x/mo)';
    case 'month':
      return 'month';
    case 'quarter':
      return 'quarter';
    case 'year':
      return 'year';
  }
}
