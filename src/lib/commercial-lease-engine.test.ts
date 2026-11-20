import { describe, it, expect } from 'vitest';
import {
  calculateCommercialLease,
  calculateCamShare,
  calculatePercentageRent,
  compareLeaseOffers,
  CommercialLeaseInput,
} from './commercial-lease-engine';

describe('commercial-lease-engine', () => {
  describe('calculateCommercialLease', () => {
    it('matches the build spec worked example exactly ($24 NNN, 2,000 USF, 15% load)', () => {
      const input: CommercialLeaseInput = {
        areaInputMode: 'usable',
        usableArea: 2000,
        loadFactorPercent: 15,
        areaUnit: 'sqft',
        baseRate: 24,
        rateBasis: 'per-year',
        leaseType: 'nnn',
        propertyTaxAnnualPerUnit: 3,
        insuranceAnnualPerUnit: 1,
        camAnnualPerUnit: 4,
        leaseTermYears: 5,
        escalationType: 'percent',
        escalationValue: 3,
        escalationAppliesTo: 'base-only',
        freeRentMonths: 2,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 10,
      };

      const result = calculateCommercialLease(input);

      // Space: 2,000 USF * 1.15 = 2,300 RSF
      expect(result.usableArea).toBe(2000);
      expect(result.rentableArea).toBe(2300);
      expect(result.loadFactorPercent).toBe(15);

      // Year 1 metrics
      expect(result.year1BaseRentAnnual).toBe(55200); // 2,300 * $24
      expect(result.year1BaseRentMonthly).toBe(4600);
      expect(result.year1PassThroughAnnual).toBe(18400); // 2,300 * ($3 + $1 + $4)
      expect(result.year1PassThroughMonthly).toBe(1533.33);
      expect(result.year1TotalAnnual).toBe(73600);
      expect(result.year1TotalMonthly).toBe(6133.33);

      // Concessions
      expect(result.totalFreeRentCredit).toBe(9200); // 2 months * $4,600
      expect(result.totalTiAllowance).toBe(23000); // 2,300 * $10

      // 5-Year Totals
      expect(result.totalBaseRent).toBe(293064.30);
      expect(result.totalPassThroughs).toBe(92000.00);
      expect(result.totalLeaseCost).toBe(375864.30);
      expect(result.averageMonthlyCost).toBe(6264.40);

      // Net Effective Rent
      expect(result.netEffectiveRentPerUnitYr).toBe(22.68);
    });

    it('handles gross (full service) leases where landlord absorbs pass-throughs', () => {
      const input: CommercialLeaseInput = {
        usableArea: 1000,
        loadFactorPercent: 0,
        areaUnit: 'sqft',
        baseRate: 35,
        rateBasis: 'per-year',
        leaseType: 'gross',
        propertyTaxAnnualPerUnit: 4,
        insuranceAnnualPerUnit: 2,
        camAnnualPerUnit: 6,
        leaseTermYears: 3,
        escalationType: 'none',
        escalationValue: 0,
        escalationAppliesTo: 'base-only',
        freeRentMonths: 0,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 0,
      };

      const result = calculateCommercialLease(input);

      // In a full service gross lease, tenant pays $0 pass-through
      expect(result.year1PassThroughAnnual).toBe(0);
      expect(result.totalPassThroughs).toBe(0);
      expect(result.year1TotalAnnual).toBe(35000);
      expect(result.totalLeaseCost).toBe(105000);
    });

    it('handles modified gross lease with custom tenant pass-through toggles', () => {
      const input: CommercialLeaseInput = {
        usableArea: 1000,
        loadFactorPercent: 0,
        areaUnit: 'sqft',
        baseRate: 25,
        rateBasis: 'per-year',
        leaseType: 'modified-gross',
        modifiedGrossToggles: {
          tenantPaysPropertyTax: false,
          tenantPaysInsurance: false,
          tenantPaysCam: true, // $5/SF
          tenantPaysUtilities: true, // $2/SF
        },
        propertyTaxAnnualPerUnit: 3,
        insuranceAnnualPerUnit: 1,
        camAnnualPerUnit: 5,
        utilitiesAnnualPerUnit: 2,
        leaseTermYears: 1,
        escalationType: 'none',
        escalationValue: 0,
        escalationAppliesTo: 'base-only',
        freeRentMonths: 0,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 0,
      };

      const result = calculateCommercialLease(input);
      // Tenant pays CAM ($5) + Utilities ($2) = $7/SF = $7,000/yr
      expect(result.year1PassThroughAnnual).toBe(7000);
      expect(result.year1TotalAnnual).toBe(32000); // 25,000 + 7,000
    });

    it('supports step-rate escalations ($/SF/year increase)', () => {
      const input: CommercialLeaseInput = {
        usableArea: 1000,
        loadFactorPercent: 0,
        areaUnit: 'sqft',
        baseRate: 20,
        rateBasis: 'per-year',
        leaseType: 'gross',
        propertyTaxAnnualPerUnit: 0,
        insuranceAnnualPerUnit: 0,
        camAnnualPerUnit: 0,
        leaseTermYears: 3,
        escalationType: 'step-rate',
        escalationValue: 1.0, // $1.00/SF increase per year
        escalationAppliesTo: 'base-only',
        freeRentMonths: 0,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 0,
      };

      const result = calculateCommercialLease(input);
      expect(result.schedule[0].baseRatePerUnitYr).toBe(20);
      expect(result.schedule[1].baseRatePerUnitYr).toBe(21);
      expect(result.schedule[2].baseRatePerUnitYr).toBe(22);
      expect(result.totalBaseRent).toBe(63000); // 20k + 21k + 22k
    });

    it('converts monthly rate basis to annual ($2.00/SF/mo -> $24.00/SF/yr)', () => {
      const input: CommercialLeaseInput = {
        usableArea: 1000,
        loadFactorPercent: 0,
        areaUnit: 'sqft',
        baseRate: 2.0,
        rateBasis: 'per-month',
        leaseType: 'gross',
        propertyTaxAnnualPerUnit: 0,
        insuranceAnnualPerUnit: 0,
        camAnnualPerUnit: 0,
        leaseTermYears: 1,
        escalationType: 'none',
        escalationValue: 0,
        escalationAppliesTo: 'base-only',
        freeRentMonths: 0,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 0,
      };

      const result = calculateCommercialLease(input);
      expect(result.year1BaseRentAnnual).toBe(24000);
      expect(result.year1BaseRentMonthly).toBe(2000);
    });
  });

  describe('calculateCamShare', () => {
    it('calculates pro-rata share accurately', () => {
      const result = calculateCamShare({
        tenantRentableArea: 2300,
        buildingRentableArea: 50000,
        totalBuildingCamAnnual: 200000,
      });

      expect(result.proRataSharePercent).toBe(4.6);
      expect(result.tenantCamAnnual).toBe(9200);
      expect(result.tenantCamMonthly).toBe(766.67);
      expect(result.tenantCamPerUnitYr).toBe(4.0);
    });

    it('handles zero building area gracefully', () => {
      const result = calculateCamShare({
        tenantRentableArea: 2300,
        buildingRentableArea: 0,
        totalBuildingCamAnnual: 200000,
      });

      expect(result.proRataSharePercent).toBeNull();
      expect(result.tenantCamAnnual).toBeNull();
    });
  });

  describe('calculatePercentageRent', () => {
    it('calculates retail percentage rent above natural breakpoint', () => {
      const result = calculatePercentageRent({
        annualGrossSales: 1200000,
        breakpointMode: 'natural',
        annualBaseRent: 60000,
        customBreakpoint: 0,
        percentageRentRate: 6, // 6%
      });

      // Natural breakpoint = $60,000 / 0.06 = $1,000,000
      expect(result.effectiveBreakpoint).toBe(1000000);
      expect(result.salesAboveBreakpoint).toBe(200000);
      // Percentage rent = $200,000 * 6% = $12,000
      expect(result.percentageRentAnnual).toBe(12000);
      expect(result.totalRentAnnual).toBe(72000);
    });

    it('returns 0 percentage rent when sales are below breakpoint', () => {
      const result = calculatePercentageRent({
        annualGrossSales: 800000,
        breakpointMode: 'natural',
        annualBaseRent: 60000,
        customBreakpoint: 0,
        percentageRentRate: 6,
      });

      expect(result.salesAboveBreakpoint).toBe(0);
      expect(result.percentageRentAnnual).toBe(0);
      expect(result.totalRentAnnual).toBe(60000);
    });
  });

  describe('compareLeaseOffers', () => {
    it('compares two lease offers and identifies the cheaper option', () => {
      const offerA: CommercialLeaseInput = {
        usableArea: 2000,
        loadFactorPercent: 15, // 2,300 RSF
        areaUnit: 'sqft',
        baseRate: 24,
        rateBasis: 'per-year',
        leaseType: 'nnn',
        propertyTaxAnnualPerUnit: 3,
        insuranceAnnualPerUnit: 1,
        camAnnualPerUnit: 4,
        leaseTermYears: 5,
        escalationType: 'percent',
        escalationValue: 3,
        escalationAppliesTo: 'base-only',
        freeRentMonths: 2,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 10,
      };

      const offerB: CommercialLeaseInput = {
        usableArea: 2000,
        loadFactorPercent: 15,
        areaUnit: 'sqft',
        baseRate: 32, // $32 Gross
        rateBasis: 'per-year',
        leaseType: 'gross',
        propertyTaxAnnualPerUnit: 0,
        insuranceAnnualPerUnit: 0,
        camAnnualPerUnit: 0,
        leaseTermYears: 5,
        escalationType: 'percent',
        escalationValue: 3,
        escalationAppliesTo: 'base-only',
        freeRentMonths: 0,
        freeRentAppliesTo: 'base-only',
        tenantImprovementAllowancePerUnit: 0,
      };

      const comparison = compareLeaseOffers(offerA, offerB);

      // Offer A total = $375,864.30
      // Offer B total = 2,300 * 32 = $73,600 yr 1 with 3% esc for 5 yrs = $390,752.40
      expect(comparison.cheaperOffer).toBe('A');
      expect(comparison.costDifferenceTotal).toBeLessThan(0);
      expect(comparison.savingsPercent).toBeGreaterThan(0);
    });
  });
});
