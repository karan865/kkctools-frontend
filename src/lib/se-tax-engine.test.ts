import { describe, it, expect } from 'vitest';
import {
  calculateMileageDeduction,
  calculateSeTax,
  calculateWhatIf,
} from './se-tax-engine';

describe('Self-Employment (1099) Tax Engine', () => {
  describe('Spec §3.4 Worked Example', () => {
    it('reproduces the exact benchmark: $70k gross, $10k exp = $60k net -> $8,477.73 SE tax and $4,238.87 deduction', () => {
      const res = calculateSeTax({
        grossIncome: 70000,
        expenses: 10000,
        fedTaxRatePct: 12,
        stateTaxRatePct: 0,
      });

      expect(res.netSelfEmploymentEarnings).toBe(60000);
      expect(res.seFactor).toBe(0.9235);
      expect(res.taxableSeBase).toBe(55410);

      // Social Security 12.4% on $55,410 = $6,870.84
      expect(res.socialSecurityTax).toBe(6870.84);
      // Medicare 2.9% on $55,410 = $1,606.89
      expect(res.medicareTax).toBe(1606.89);
      expect(res.additionalMedicareTax).toBe(0);

      // Total SE Tax: $6,870.84 + $1,606.89 = $8,477.73
      expect(res.totalSeTax).toBe(8477.73);

      // Half-SE Deduction: $8,477.73 / 2 = $4,238.865 -> $4,238.87
      expect(res.halfSeDeduction).toBeCloseTo(4238.87, 2);

      // Taxable income estimate: $60,000 - $4,238.87 = $55,761.13
      expect(res.taxableIncomeEstimate).toBeCloseTo(55761.13, 2);
      // Fed tax @ 12% = $6,691.34
      expect(res.federalIncomeTaxEstimate).toBeCloseTo(6691.34, 2);

      // Total tax liability: $8,477.73 + $6,691.34 = $15,169.07
      expect(res.totalTaxLiability).toBeCloseTo(15169.07, 2);
      // Quarterly: $15,169.07 / 4 = $3,792.27
      expect(res.quarterlyPayment).toBeCloseTo(3792.27, 2);
    });
  });

  describe('IRC $400 Minimum Exemption Threshold', () => {
    it('implements zero SE tax when net earnings are below $400', () => {
      const res = calculateSeTax({
        grossIncome: 500,
        expenses: 150, // net = $350 < $400
      });

      expect(res.netSelfEmploymentEarnings).toBe(350);
      expect(res.isBelowMinimum).toBe(true);
      expect(res.totalSeTax).toBe(0);
      expect(res.halfSeDeduction).toBe(0);
    });

    it('triggers SE tax when net earnings reach exactly $400', () => {
      const res = calculateSeTax({
        grossIncome: 600,
        expenses: 200, // net = $400
      });

      expect(res.netSelfEmploymentEarnings).toBe(400);
      expect(res.isBelowMinimum).toBe(false);
      expect(res.totalSeTax).toBeGreaterThan(0);
    });
  });

  describe('Social Security Wage Base & W-2 Interactions', () => {
    it('caps Social Security tax at $184,500 wage base for pure 1099 income', () => {
      const res = calculateSeTax({
        grossIncome: 300000,
        expenses: 0,
        fedTaxRatePct: 20,
      });

      // Taxable base: $300,000 * 0.9235 = $277,050
      // Capped at $184,500 * 12.4% = $22,878.00
      expect(res.socialSecurityTax).toBe(22878);
      // Medicare 2.9% on full $277,050 = $8,034.45
      expect(res.medicareTax).toBe(8034.45);
    });

    it('offsets Social Security tax when W-2 wages already reach the wage base', () => {
      const res = calculateSeTax({
        grossIncome: 80000,
        expenses: 0,
        w2Wages: 184500, // W-2 already hit $184,500 cap
      });

      expect(res.ssWageBaseRemaining).toBe(0);
      expect(res.socialSecurityTax).toBe(0);
      // Medicare is uncapped, so Medicare tax still applies
      expect(res.medicareTax).toBeGreaterThan(0);
    });

    it('allows partial Social Security room when W-2 wages are below the wage base', () => {
      const res = calculateSeTax({
        grossIncome: 100000,
        expenses: 0,
        w2Wages: 150000, // Room = $184,500 - $150,000 = $34,500
      });

      expect(res.ssWageBaseRemaining).toBe(34500);
      // SS tax = $34,500 * 12.4% = $4,278
      expect(res.socialSecurityTax).toBe(4278);
    });
  });

  describe('Additional Medicare Surtax (0.9%)', () => {
    it('applies 0.9% additional Medicare surtax above single threshold ($200,000)', () => {
      const res = calculateSeTax({
        grossIncome: 300000,
        expenses: 0,
        filingStatus: 'single',
      });

      // Taxable base = $300k * 0.9235 = $277,050
      // Excess above $200k = $77,050 * 0.9% = $693.45
      expect(res.additionalMedicareTax).toBe(693.45);
    });

    it('applies higher threshold ($250,000) for Married Filing Jointly', () => {
      const res = calculateSeTax({
        grossIncome: 300000,
        expenses: 0,
        filingStatus: 'mfj',
      });

      // Taxable base = $277,050
      // Excess above $250k = $27,050 * 0.9% = $243.45
      expect(res.additionalMedicareTax).toBe(243.45);
    });
  });

  describe('Standard Mileage Allowance (Split 2026 Rates)', () => {
    it('calculates two-period mileage deduction accurately', () => {
      // 1,000 miles in H1 @ 72.5¢ = $725
      // 2,000 miles in H2 @ 76.0¢ = $1,520
      // Total = $2,245.00
      const ded = calculateMileageDeduction(1000, 2000, 2026);
      expect(ded).toBe(2245);
    });
  });

  describe('Quarterly Estimated Tax Schedule & Safe Harbor', () => {
    it('generates 4 quarterly vouchers with official IRS due dates', () => {
      const res = calculateSeTax({
        grossIncome: 60000,
        expenses: 10000,
      });

      expect(res.quarterlyVouchers).toHaveLength(4);
      expect(res.quarterlyVouchers[0].dueDate).toBe('2026-04-15');
      expect(res.quarterlyVouchers[1].dueDate).toBe('2026-06-15');
      expect(res.quarterlyVouchers[2].dueDate).toBe('2026-09-15');
      expect(res.quarterlyVouchers[3].dueDate).toBe('2027-01-15');
    });

    it('determines safe harbor based on smaller of 90% current year vs 100% prior year', () => {
      const res = calculateSeTax({
        grossIncome: 80000,
        expenses: 10000,
        fedTaxRatePct: 15,
        priorYearTotalTax: 12000,
      });

      // If 90% of current year > $12,000 prior year, recommended target is prior year $12,000
      expect(res.safeHarbor.priorYear100Pct).toBe(12000);
      expect(res.safeHarbor.recommendedAnnualTarget).toBeLessThanOrEqual(res.safeHarbor.currentYear90Pct);
    });
  });

  describe('What-If Deduction Scenario', () => {
    it('calculates tax savings and net out-of-pocket cost for an extra $5,000 expense', () => {
      const whatIf = calculateWhatIf(
        {
          grossIncome: 70000,
          expenses: 10000,
          fedTaxRatePct: 15,
        },
        5000
      );

      expect(whatIf.taxSavings).toBeGreaterThan(1000);
      expect(whatIf.effectiveSavingsRatePct).toBeGreaterThan(20);
      expect(whatIf.netOutOfPocketCost).toBe(5000 - whatIf.taxSavings);
    });
  });
});
