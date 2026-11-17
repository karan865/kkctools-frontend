import { describe, it, expect } from 'vitest';
import {
  calculateWage,
  compareWages,
  generateWageTable,
} from './wage-engine';

describe('Wage Engine — Conversions & Core Rules', () => {
  it('converts $25/hr at 40h/week to $52,000 annual gross', () => {
    const res = calculateWage({ amount: 25, period: 'hour', hoursPerWeek: 40, weeksPerYear: 52 });
    expect(res.totalAnnualGross).toBe(52000);
    expect(res.periods.weekly).toBe(1000);
    expect(res.periods.biweekly).toBe(2000);
    expect(res.periods.monthly).toBeCloseTo(4333.33, 2);
    expect(res.workingHoursScheduled).toBe(2080);
  });

  it('reverses $52,000 salary back to $25/hr', () => {
    const res = calculateWage({ amount: 52000, period: 'year', hoursPerWeek: 40, weeksPerYear: 52 });
    expect(res.periods.hourly).toBe(25);
    expect(res.periods.monthly).toBeCloseTo(4333.33, 2);
    expect(res.periods.biweekly).toBe(2000);
  });

  it('demonstrates biweekly (26 paychecks) differs from semi-monthly (24 paychecks)', () => {
    const res = calculateWage({ amount: 52000, period: 'year' });
    // Biweekly = 52,000 / 26 = 2,000
    expect(res.periods.biweekly).toBe(2000);
    // Semi-monthly = 52,000 / 24 = 2,166.67
    expect(res.periods.semiMonthly).toBeCloseTo(2166.67, 2);
    expect(res.periods.semiMonthly).toBeGreaterThan(res.periods.biweekly);
  });

  it('proves paid time off does not reduce annual pay, but increases effective hourly worked', () => {
    const withoutPto = calculateWage({
      amount: 25,
      period: 'hour',
      paidHolidaysDays: 0,
      paidVacationDays: 0,
    });
    const withPto = calculateWage({
      amount: 25,
      period: 'hour',
      paidHolidaysDays: 10,
      paidVacationDays: 15, // 25 days off total (200 hours)
    });

    // Total gross pay is unchanged!
    expect(withPto.totalAnnualGross).toBe(withoutPto.totalAnnualGross);
    expect(withPto.totalAnnualGross).toBe(52000);

    // But actual worked hours drop from 2080 to 1880
    expect(withPto.actualWorkedHoursPerYear).toBe(1880);
    // Effective hourly worked rate increases
    expect(withPto.effectiveHourlyWorked).toBeCloseTo(52000 / 1880, 2); // ~$27.66/hr
    expect(withPto.effectiveHourlyWorked).toBeGreaterThan(25);
  });

  it('reduces annual gross when unpaid days off are taken', () => {
    // 5 unpaid days off = 40 unpaid hours at $25 = $1,000 reduction
    const res = calculateWage({
      amount: 25,
      period: 'hour',
      unpaidDaysOff: 5,
    });

    expect(res.unpaidHoursPerYear).toBe(40);
    expect(res.totalAnnualGross).toBe(51000); // 52,000 - 1,000
  });

  it('calculates overtime pay accurately with 1.5x multiplier', () => {
    // $20/hr base, 5 OT hours/week at 1.5x = $30/hr OT rate
    // Regular: 40 * 20 * 52 = $41,600
    // OT: 5 * 30 * 52 = $7,800
    // Total: $49,400
    const res = calculateWage({
      amount: 20,
      period: 'hour',
      overtimeHoursPerWeek: 5,
      overtimeMultiplier: 1.5,
    });

    expect(res.regularAnnualGross).toBe(41600);
    expect(res.overtimeAnnualGross).toBe(7800);
    expect(res.totalAnnualGross).toBe(49400);
  });

  it('supports custom variable daily schedule (Mon-Sun)', () => {
    const res = calculateWage({
      amount: 30,
      period: 'hour',
      dailySchedule: {
        monday: 8,
        tuesday: 8,
        wednesday: 8,
        thursday: 6,
        friday: 6,
        saturday: 0,
        sunday: 0, // Total 36 hours across 5 active days
      },
      weeksPerYear: 52,
    });

    // 36 * 52 = 1,872 hours
    expect(res.workingHoursScheduled).toBe(1872);
    // 1,872 * 30 = $56,160
    expect(res.totalAnnualGross).toBe(56160);
  });

  it('handles international presets (UK 37.5h week, AU 38h week)', () => {
    const ukRes = calculateWage({ amount: 20, period: 'hour', hoursPerWeek: 37.5, weeksPerYear: 52 });
    expect(ukRes.workingHoursScheduled).toBe(1950);
    expect(ukRes.totalAnnualGross).toBe(39000);

    const auRes = calculateWage({ amount: 35, period: 'hour', hoursPerWeek: 38, weeksPerYear: 52 });
    expect(auRes.workingHoursScheduled).toBe(1976);
    expect(auRes.totalAnnualGross).toBe(69160);
  });

  it('compares two wages or evaluates a percentage raise', () => {
    const raiseTest = compareWages({
      currentWage: { amount: 50000, period: 'year' },
      raisePercent: 10,
    });

    expect(raiseTest.newAnnual).toBe(55000);
    expect(raiseTest.annualDifference).toBe(5000);
    expect(raiseTest.monthlyDifference).toBeCloseTo(416.67, 2);
    expect(raiseTest.percentChange).toBe(10);
  });

  it('generates complete wage reference table from $10 to $100/hr', () => {
    const table = generateWageTable(40, 52);
    expect(table.length).toBeGreaterThanOrEqual(35);

    const row15 = table.find((r) => r.hourlyRate === 15);
    expect(row15?.annualGross).toBe(31200);

    const row20 = table.find((r) => r.hourlyRate === 20);
    expect(row20?.annualGross).toBe(41600);

    const row25 = table.find((r) => r.hourlyRate === 25);
    expect(row25?.annualGross).toBe(52000);

    const row30 = table.find((r) => r.hourlyRate === 30);
    expect(row30?.annualGross).toBe(62400);
  });

  it('guards against division by zero and negative inputs', () => {
    const zeroHours = calculateWage({ amount: 1000, period: 'month', hoursPerWeek: 0 });
    expect(Number.isFinite(zeroHours.totalAnnualGross)).toBe(true);
    expect(zeroHours.periods.hourly).toBe(0);

    const negativeAmt = calculateWage({ amount: -50, period: 'hour' });
    expect(negativeAmt.totalAnnualGross).toBe(0);
  });
});
