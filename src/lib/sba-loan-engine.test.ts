import { describe, it, expect } from 'vitest';
import {
  calculateSba504,
  calculateSba7a,
  compareSba504Vs7a,
  calculateSbaAcquisition,
} from './sba-loan-engine';

describe('SBA Loan Engine', () => {
  describe('SBA 504 Loan Calculations', () => {
    it('accurately reproduces the spec §3.4 worked example', () => {
      // Worked example:
      // Project: $2,000,000
      // 50% Bank ($1,000,000 @ 7.0%, 25 yr) -> $7,067.79/mo
      // 40% CDC ($800,000 @ 6.5%, 25 yr) -> $5,401.66/mo
      // Total loan: $1,800,000
      // Total monthly: $12,469.45/mo
      // Blended rate: 6.778%
      // Equity: $200,000 (10%)
      const res = calculateSba504({
        projectCost: 2000000,
        bankPct: 50,
        bankRatePct: 7.0,
        bankTermYears: 25,
        bankAmortYears: 25,
        cdcPct: 40,
        cdcRatePct: 6.5,
        cdcTermYears: 25,
        cdcFeePct: 0,
        cdcFeeFinanced: false,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.bankLoanAmount).toBe(1000000);
      expect(res.cdcBaseLoanAmount).toBe(800000);
      expect(res.equityAmount).toBe(200000);
      expect(res.equityPct).toBe(10);
      expect(res.totalLoanAmount).toBe(1800000);

      // Verify monthly payments within a few cents
      expect(res.bankMonthlyPayment).toBeCloseTo(7067.79, 1);
      expect(res.cdcMonthlyPayment).toBeCloseTo(5401.66, 1);
      expect(res.totalMonthlyPayment).toBeCloseTo(12469.45, 1);

      // Verify blended rate: (1M * 7 + 0.8M * 6.5) / 1.8M = 12.2 / 1.8 = 6.777777...
      expect(res.blendedRatePct).toBeCloseTo(6.7778, 3);
      expect(res.bankBalloonPayment).toBe(0);
    });

    it('correctly models CDC debenture fees when financed into note', () => {
      // $800,000 CDC loan + 3% fee ($24,000) financed = $824,000 CDC note
      const res = calculateSba504({
        projectCost: 2000000,
        bankPct: 50,
        bankRatePct: 7.0,
        bankTermYears: 25,
        bankAmortYears: 25,
        cdcPct: 40,
        cdcRatePct: 6.5,
        cdcTermYears: 25,
        cdcFeePct: 3.0,
        cdcFeeFinanced: true,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.cdcFees).toBe(24000);
      expect(res.cdcTotalLoanAmount).toBe(824000);
      expect(res.totalLoanAmount).toBe(1824000);
      // Payment on $824,000 @ 6.5% for 25 yrs
      expect(res.cdcMonthlyPayment).toBeCloseTo(5563.71, 1);
    });

    it('calculates bank balloon payment when loan term is shorter than amortization', () => {
      // 10-year balloon on 25-year amortization
      const res = calculateSba504({
        projectCost: 2000000,
        bankPct: 50,
        bankRatePct: 7.0,
        bankTermYears: 10,
        bankAmortYears: 25,
        cdcPct: 40,
        cdcRatePct: 6.5,
        cdcTermYears: 20,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.bankBalloonPayment).toBeGreaterThan(700000);
      expect(res.bankBalloonPayment).toBeLessThan(900000);
    });

    it('calculates DSCR when operating cash flow is provided', () => {
      const res = calculateSba504({
        projectCost: 2000000,
        bankPct: 50,
        bankRatePct: 7.0,
        bankTermYears: 25,
        bankAmortYears: 25,
        cdcPct: 40,
        cdcRatePct: 6.5,
        cdcTermYears: 25,
        annualCashFlow: 200000,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      // Annual debt service = 12469.45 * 12 = 149633.40
      // DSCR = 200,000 / 149,633.40 = 1.3366
      expect(res.dscr).toBeCloseTo(1.337, 2);
    });

    it('returns null on invalid percentages or negative costs', () => {
      expect(
        calculateSba504({
          projectCost: -100,
          bankPct: 50,
          bankRatePct: 7,
          bankTermYears: 25,
          bankAmortYears: 25,
          cdcPct: 40,
          cdcRatePct: 6.5,
          cdcTermYears: 25,
        })
      ).toBeNull();

      // Over 100% combined
      expect(
        calculateSba504({
          projectCost: 1000000,
          bankPct: 65,
          bankRatePct: 7,
          bankTermYears: 25,
          bankAmortYears: 25,
          cdcPct: 45,
          cdcRatePct: 6.5,
          cdcTermYears: 25,
        })
      ).toBeNull();
    });
  });

  describe('SBA 7(a) Loan Calculations', () => {
    it('reproduces spec §3.4 7(a) benchmark', () => {
      // $1,800,000 @ 9.0% for 25 yrs = $15,105.53/mo
      const res = calculateSba7a({
        loanAmount: 1800000,
        ratePct: 9.0,
        termYears: 25,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.monthlyPayment).toBeCloseTo(15105.53, 1);
      expect(res.totalInterest).toBeCloseTo(2731659, -1);
    });

    it('handles financed guarantee fees', () => {
      const res = calculateSba7a({
        loanAmount: 1000000,
        ratePct: 8.5,
        termYears: 10,
        guaranteeFeePct: 3.0,
        feesFinanced: true,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.guaranteeFee).toBe(30000);
      expect(res.totalFinancedAmount).toBe(1030000);
    });
  });

  describe('504 vs 7(a) Comparison', () => {
    it('compares same $1.8M debt across 504 and 7(a)', () => {
      const cmp = compareSba504Vs7a(
        {
          projectCost: 2000000,
          bankPct: 50,
          bankRatePct: 7.0,
          bankTermYears: 25,
          bankAmortYears: 25,
          cdcPct: 40,
          cdcRatePct: 6.5,
          cdcTermYears: 25,
        },
        9.0, // 7(a) rate
        25
      );

      expect(cmp).not.toBeNull();
      if (!cmp) return;

      // 504: $12,469.45/mo vs 7(a): $15,105.53/mo -> savings $2,636.08/mo
      expect(cmp.monthlyPaymentSavings504).toBeCloseTo(2636.08, 1);
      expect(cmp.annualPaymentSavings504).toBeCloseTo(31633, -1);
      expect(cmp.totalInterestSavings504).toBeGreaterThan(500000);
    });
  });

  describe('Business Acquisition Financing', () => {
    it('calculates acquisition capital stack with seller note and DSCR', () => {
      // $1.5M purchase, 10% buyer equity ($150k), 15% seller note ($225k @ 8%, 5 yr), 75% SBA 7(a) ($1.125M @ 10.5%, 10 yr)
      // Cash flow $350k
      const res = calculateSbaAcquisition({
        purchasePrice: 1500000,
        buyerEquityPct: 10,
        sellerNotePct: 15,
        sellerNoteRatePct: 8.0,
        sellerNoteTermYears: 5,
        sbaRatePct: 10.5,
        sbaTermYears: 10,
        annualSdeOrCashFlow: 350000,
        minDscr: 1.25,
      });

      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.buyerEquityAmount).toBe(150000);
      expect(res.sellerNoteAmount).toBe(225000);
      expect(res.sbaLoanAmount).toBe(1125000);

      // SBA payment: $1.125M @ 10.5% for 10 yrs = $15,180.19/mo
      expect(res.sbaMonthlyPayment).toBeCloseTo(15180.19, 1);

      // Seller note payment: $225k @ 8% for 5 yrs = $4,562.19/mo
      expect(res.sellerNoteMonthlyPayment).toBeCloseTo(4562.19, 1);

      // Total monthly: ~$19,742.38
      expect(res.totalMonthlyDebtService).toBeCloseTo(19742.38, 1);

      // Annual debt service: ~$236,908.51
      expect(res.annualDebtService).toBeCloseTo(236908.51, 1);

      // DSCR = 350,000 / 236,908.51 = 1.477
      expect(res.dscr).toBeCloseTo(1.477, 2);
      expect(res.meetsMinDscr).toBe(true);
      expect(res.postDebtAnnualCashFlow).toBeCloseTo(113091.49, 1);
    });
  });
});
