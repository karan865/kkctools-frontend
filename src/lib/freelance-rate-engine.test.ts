import { describe, it, expect } from 'vitest';
import {
  calculateFreelanceCalendar,
  calculateFreelanceRateFromGoal,
  calculateIncomeFromRate,
  calculateProjectQuote,
  calculateUsSelfEmploymentTaxHelper,
  FreelanceGoalInput,
} from './freelance-rate-engine';

describe('Freelance Rate Engine', () => {
  const defaultGoalInput: FreelanceGoalInput = {
    targetTakeHome: 70000,
    taxPct: 25,
    calendar: {
      workDaysPerWeek: 5,
      hoursPerDay: 8,
      holidaysDays: 10,
      vacationDays: 15,
      sickDays: 5,
      trainingDays: 5,
      billablePct: 70,
    },
    businessCosts: {
      softwareMonthly: 200, // $2,400/yr
      equipmentAnnual: 1600,
      insuranceAnnual: 1000,
      coworkingMonthly: 0,
      otherAnnual: 1000, // Total = $6,000/yr
    },
    benefits: {
      healthInsuranceAnnual: 6000,
      retirementAnnual: 3500, // Total benefits = $9,500/yr
    },
    bufferPct: 15,
  };

  it('matches the BUILD SPEC §3.4 worked example exactly', () => {
    const res = calculateFreelanceRateFromGoal(defaultGoalInput);

    // Work days: 52*5 (260) - 10 - 15 - 5 - 5 = 225 days
    expect(res.actualWorkDays).toBe(225);

    // Billable hours: 225 * 8 (1,800) * 70% = 1,260 hours
    expect(res.billableHours).toBe(1260);

    // Pre-tax profit needed: $70,000 / (1 - 0.25) = $93,333.33
    expect(res.preTaxProfitNeeded).toBeCloseTo(93333.33, 2);

    // Business costs: $6,000; Benefits: $9,500
    expect(res.totalBusinessCostsAnnual).toBe(6000);
    expect(res.totalBenefitsAnnual).toBe(9500);

    // Required revenue: $93,333.33 + $6,000 + $9,500 = $108,833.33
    expect(res.requiredRevenueAnnual).toBeCloseTo(108833.33, 2);

    // Break-even hourly rate: $108,833.33 / 1,260 = $86.3756 -> $86.38/h
    expect(res.breakEvenHourlyRate).toBeCloseTo(86.38, 2);

    // Recommended rate (+15% buffer): $86.3756 * 1.15 = $99.332 -> $99.33/h
    expect(res.recommendedHourlyRate).toBeCloseTo(99.33, 2);

    // Day rate: $99.332 * 8 = $794.656 -> $794.66
    expect(res.dayRate).toBeCloseTo(794.66, 2);

    // Weekly retainer: $99.332 * (1,260 / 52) = $2,781.30
    expect(res.weeklyRetainer).toBeCloseTo(2781.3, 2);
  });

  it('round-trips from goal -> rate -> income cleanly', () => {
    const goalRes = calculateFreelanceRateFromGoal(defaultGoalInput);
    expect(goalRes.breakEvenHourlyRate).not.toBeNull();

    // Now calculate income using the break-even hourly rate
    const incomeRes = calculateIncomeFromRate({
      hourlyRate: goalRes.breakEvenHourlyRate!,
      calendar: defaultGoalInput.calendar,
      businessCosts: defaultGoalInput.businessCosts,
      benefits: defaultGoalInput.benefits,
      taxPct: defaultGoalInput.taxPct,
    });

    // Net take-home should exactly equal the initial target of $70,000
    expect(incomeRes.netTakeHomeAnnual).toBeCloseTo(70000, 1);
    expect(incomeRes.grossRevenueAnnual).toBeCloseTo(goalRes.requiredRevenueAnnual, 1);
  });

  it('handles edge case of 0 billable hours or 100% tax safely', () => {
    // 0% billable
    const zeroBillable = calculateFreelanceRateFromGoal({
      ...defaultGoalInput,
      calendar: { ...defaultGoalInput.calendar, billablePct: 0 },
    });
    expect(zeroBillable.billableHours).toBe(0);
    expect(zeroBillable.breakEvenHourlyRate).toBeNull();
    expect(zeroBillable.recommendedHourlyRate).toBeNull();

    // 100% tax rate capped
    const extremeTax = calculateFreelanceRateFromGoal({
      ...defaultGoalInput,
      taxPct: 100, // Should be clamped to 99%
    });
    expect(extremeTax.preTaxProfitNeeded).toBeGreaterThan(0);
    expect(Number.isFinite(extremeTax.breakEvenHourlyRate!)).toBe(true);
  });

  it('calculates project quotes with revision buffer and expenses', () => {
    const quote = calculateProjectQuote({
      estimatedHours: 40,
      hourlyRate: 100,
      revisionBufferPct: 20, // +20% buffer
      fixedExpenses: 300, // Stock photos & fonts
    });

    // Base labor: 40 * $100 = $4,000
    expect(quote.baseLaborCost).toBe(4000);
    // Buffer: $4,000 * 20% = $800
    expect(quote.bufferAmount).toBe(800);
    // Total quote: $4,000 + $800 + $300 = $5,100
    expect(quote.totalProjectQuote).toBe(5100);
    // Effective rate: ($5,100 - $300) / 40 = $120/hr
    expect(quote.effectiveHourlyRate).toBe(120);
  });

  it('calculates US Self-Employment Tax (SECA) accurately using official rates', () => {
    const seTax = calculateUsSelfEmploymentTaxHelper(100000);

    // Subject to SECA: $100,000 * 92.35% = $92,350
    expect(seTax.profitSubjectToTax).toBeCloseTo(92350, 2);

    // Social Security (12.4% on $92,350): $11,451.40
    expect(seTax.socialSecurityTax).toBeCloseTo(11451.4, 2);

    // Medicare (2.9% on $92,350): $2,678.15
    expect(seTax.medicareTax).toBeCloseTo(2678.15, 2);

    // Total SE Tax: $11,451.40 + $2,678.15 = $14,129.55
    expect(seTax.totalSelfEmploymentTax).toBeCloseTo(14129.55, 2);

    // Half deductible: $14,129.55 / 2 = $7,064.775
    expect(seTax.halfDeductiblePortion).toBeCloseTo(7064.775, 2);

    // Effective SE Tax % on $100k profit = 14.13%
    expect(seTax.effectiveSeTaxRatePct).toBeCloseTo(14.13, 2);
  });
});
