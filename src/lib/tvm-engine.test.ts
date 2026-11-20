import { describe, it, expect } from 'vitest';
import {
  pv,
  fv,
  pvAnnuity,
  fvAnnuity,
  pvGrowingAnnuity,
  pvPerpetuity,
  effectiveRate,
  nominalFromApy,
  perPeriodRate,
  npv,
  irr,
  npvProject,
  profitabilityIndex,
  discountedPayback,
  npvProfile,
  xnpv,
  pvTable,
  annuityTable,
  generateExcelFormulas,
} from './tvm-engine';

describe('tvm-engine', () => {
  describe('Worked Examples from Spec (§3.4)', () => {
    it('calculates PV of $10,000 in 10 years at 6% = $5,583.95', () => {
      const result = pv(10000, 6, 10, 'annually');
      expect(result).not.toBeNull();
      expect(Number(result!.toFixed(2))).toBe(5583.95);
    });

    it('calculates PV of $1,000/yr for 10 years at 6% = $7,360.09', () => {
      const result = pvAnnuity(1000, 6, 10, 'ordinary');
      expect(result).not.toBeNull();
      expect(Number(result!.toFixed(2))).toBe(7360.09);
    });

    it('calculates NPV of -$10,000 + 5 × $3,000 at 8% = $1,978.13', () => {
      const flows = [3000, 3000, 3000, 3000, 3000];
      const result = npvProject(10000, flows, 8);
      expect(result).not.toBeNull();
      expect(Number(result!.toFixed(2))).toBe(1978.13);
    });

    it('calculates IRR of -$10,000 + 5 × $3,000 = 15.24%', () => {
      const fullSeries = [-10000, 3000, 3000, 3000, 3000, 3000];
      const result = irr(fullSeries);
      expect(result).not.toBeNull();
      expect(Number(result!.toFixed(2))).toBe(15.24);
    });
  });

  describe('Single Sum PV and FV with Compounding Frequencies', () => {
    it('handles semi-annual, quarterly, monthly, daily, and continuous compounding', () => {
      // $10,000 at 8% for 5 years
      const annual = pv(10000, 8, 5, 'annually');
      const semi = pv(10000, 8, 5, 'semiannually');
      const quarterly = pv(10000, 8, 5, 'quarterly');
      const monthly = pv(10000, 8, 5, 'monthly');
      const daily = pv(10000, 8, 5, 'daily');
      const continuous = pv(10000, 8, 5, 'continuous');

      // More frequent compounding produces a smaller present value required today
      expect(annual).toBeGreaterThan(semi!);
      expect(semi).toBeGreaterThan(quarterly!);
      expect(quarterly).toBeGreaterThan(monthly!);
      expect(monthly).toBeGreaterThan(daily!);
      expect(daily).toBeGreaterThan(continuous!);

      // Continuous formula test: 10000 * e^(-0.08 * 5) = 10000 * e^(-0.4) = 6703.20046
      expect(Number(continuous!.toFixed(2))).toBe(6703.2);
    });

    it('supports FV round-trip calculation', () => {
      const present = 5000;
      const rate = 7;
      const years = 10;
      const future = fv(present, rate, years, 'monthly');
      expect(future).not.toBeNull();

      const roundTrip = pv(future!, rate, years, 'monthly');
      expect(Number(roundTrip!.toFixed(2))).toBe(5000);
    });

    it('handles 0% interest rate gracefully', () => {
      expect(pv(10000, 0, 10)).toBe(10000);
      expect(fv(10000, 0, 10)).toBe(10000);
      expect(pvAnnuity(1000, 0, 10)).toBe(10000);
      expect(fvAnnuity(1000, 0, 10)).toBe(10000);
    });
  });

  describe('Annuities: Ordinary, Due, Growing, Perpetuities', () => {
    it('compares ordinary annuity vs annuity due', () => {
      const ordinary = pvAnnuity(1000, 6, 10, 'ordinary');
      const due = pvAnnuity(1000, 6, 10, 'due');

      // Annuity due receives cash immediately, so PV is higher by (1 + r)
      expect(Number((ordinary! * 1.06).toFixed(2))).toBe(Number(due!.toFixed(2)));
    });

    it('calculates growing annuity with i > g', () => {
      // $1,000 first year, growing at 3% per year, discounted at 7% for 10 years
      const result = pvGrowingAnnuity(1000, 7, 3, 10);
      expect(result).not.toBeNull();
      // PV = 1000 / (0.07 - 0.03) * (1 - (1.03/1.07)^10) = 25000 * (1 - 0.6831787) = 7920.53
      expect(Number(result!.toFixed(2))).toBe(7920.53);
    });

    it('handles growing annuity when discount rate equals growth rate (i === g)', () => {
      // When i === g = 5%, PV = PMT * n / (1 + i) = 1000 * 5 / 1.05 = 4761.90
      const result = pvGrowingAnnuity(1000, 5, 5, 5);
      expect(result).not.toBeNull();
      expect(Number(result!.toFixed(2))).toBe(4761.9);
    });

    it('calculates perpetuity and growing perpetuity', () => {
      // $500 forever at 5% = $10,000
      expect(pvPerpetuity(500, 5)).toBe(10000);

      // $500 forever growing at 2% with 6% discount rate = 500 / (0.06 - 0.02) = $12,500
      expect(pvPerpetuity(500, 6, 2)).toBe(12500);

      // Returns null when rate <= growth rate (infinite sum)
      expect(pvPerpetuity(500, 5, 5)).toBeNull();
      expect(pvPerpetuity(500, 4, 5)).toBeNull();
    });
  });

  describe('Rate Conversions: EAR / APY, Nominal, Periodic', () => {
    it('calculates effective rate (APY) from nominal APR', () => {
      // 12% compounded monthly -> (1 + 0.01)^12 - 1 = 12.6825%
      const ear = effectiveRate(12, 12);
      expect(Number(ear!.toFixed(4))).toBe(12.6825);
    });

    it('calculates nominal rate from APY', () => {
      const nominal = nominalFromApy(12.6825, 12);
      expect(Number(nominal!.toFixed(2))).toBe(12.0);
    });

    it('calculates per-period rate', () => {
      expect(perPeriodRate(12, 12)).toBe(1);
      expect(perPeriodRate(6, 4)).toBe(1.5);
    });
  });

  describe('Capital Budgeting Metrics: PI, Discounted Payback, NPV Profile', () => {
    it('calculates profitability index (PI)', () => {
      const flows = [3000, 3000, 3000, 3000, 3000];
      const pi = profitabilityIndex(10000, flows, 8);
      // PV of inflows = 11,978.13; PI = 11,978.13 / 10,000 = 1.1978
      expect(Number(pi!.toFixed(4))).toBe(1.1978);
    });

    it('calculates discounted payback period', () => {
      const flows = [3000, 3000, 3000, 3000, 3000];
      const dpb = discountedPayback(10000, flows, 8);
      // Cumulative discounted inflows:
      // Yr 1: 2777.78
      // Yr 2: 2572.02 -> cum 5349.79
      // Yr 3: 2381.50 -> cum 7731.29
      // Yr 4: 2205.09 -> cum 9936.38 (needed 63.62 in yr 5)
      // Yr 5: 2041.75 -> 4 + (63.62 / 2041.75) = 4.03 years
      expect(Number(dpb!.toFixed(2))).toBe(4.03);
    });

    it('generates NPV profile curve points', () => {
      const flows = [3000, 3000, 3000, 3000, 3000];
      const profile = npvProfile(10000, flows, 0, 20, 5);
      expect(profile.length).toBe(5); // 0%, 5%, 10%, 15%, 20%
      // At 0%, NPV = 15,000 - 10,000 = 5,000
      expect(profile[0].npv).toBe(5000);
      // Near 15.24% (between 15% and 20%), NPV crosses zero
      const at15 = profile.find((p) => p.rate === 15);
      const at20 = profile.find((p) => p.rate === 20);
      expect(at15!.npv).toBeGreaterThan(0);
      expect(at20!.npv).toBeLessThan(0);
    });
  });

  describe('XNPV for Irregular Dates', () => {
    it('calculates XNPV for dated cash flows', () => {
      const dateFlows = [
        { date: '2026-01-01', amount: -10000 },
        { date: '2027-01-01', amount: 5000 },
        { date: '2028-01-01', amount: 7000 },
      ];
      const result = xnpv(10, dateFlows);
      expect(result).not.toBeNull();
      // Year 0: -10000
      // Year 1 (365 days): 5000 / 1.10 = 4545.45
      // Year 2 (730 days = 2.0 yrs): 7000 / 1.10^2 = 5785.12
      // NPV ~ 330.58
      expect(Number(result!.toFixed(2))).toBe(330.58);
    });
  });

  describe('Tables & Formula Generators', () => {
    it('generates PV discount factor table matching standard finance tables', () => {
      const table = pvTable([5, 6, 8, 10], 5);
      expect(table.length).toBe(5);
      // Period 1 at 10% = 1 / 1.10 = 0.9091
      expect(table[0].factors[10]).toBe(0.9091);
      // Period 5 at 6% = 1 / (1.06)^5 = 0.7473
      expect(table[4].factors[6]).toBe(0.7473);
    });

    it('generates Annuity factor table', () => {
      const table = annuityTable([6, 8, 10], 5);
      expect(table.length).toBe(5);
      // Period 5 at 8% = (1 - 1.08^-5) / 0.08 = 3.9927
      expect(table[4].factors[8]).toBe(3.9927);
    });

    it('produces exact spreadsheet formulas with period-0 notes', () => {
      const lump = generateExcelFormulas('lump-sum', { ratePct: 6, periods: 10, fv: 10000 });
      expect(lump.excel).toBe('=PV(6%, 10, 0, -10000)');

      const npvF = generateExcelFormulas('npv', { ratePct: 8, initialInvestment: 10000, cashFlows: [3000, 3000, 3000, 3000, 3000] });
      expect(npvF.excel).toBe('=NPV(8%, B2:B6) - 10000');
      expect(npvF.notes.toLowerCase()).toContain('period 0');
    });
  });
});
