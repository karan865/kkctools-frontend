import { describe, it, expect } from 'vitest';
import {
  calculateEmployeeBurden,
  calculateJobQuote,
  calculateLaborPercent,
  compareEmployeeVsSub,
  EmployeeBurdenInput,
} from './labor-cost-engine';

describe('labor-cost-engine', () => {
  describe('calculateEmployeeBurden', () => {
    it('matches the build spec worked example exactly ($30/hr employee)', () => {
      const input: EmployeeBurdenInput = {
        payType: 'hourly',
        hourlyRate: 30,
        annualSalary: 0,
        paidHoursPerYear: 2080,
        overtimeHoursPerYear: 0,
        overtimeMultiplier: 1.5,
        paidHolidaysHours: 80,
        paidPtoHours: 80,
        paidSickHours: 0,
        trainingNonBillableHours: 0,
        countryMode: 'us',
        ssEmployerRate: 0.062,
        ssWageBase: 184500,
        medicareRate: 0.0145,
        futaRate: 0.006,
        futaWageBase: 7000,
        sutaRate: 0.02,
        sutaWageBase: 10000,
        workersCompRatePer100: 5.0,
        generalLiabilityAnnual: 0,
        annualBenefits: 6000,
      };

      const result = calculateEmployeeBurden(input);

      // Wages: 30 * 2080 = $62,400
      expect(result.wagesAnnual).toBe(62400);
      expect(result.socialSecurityAnnual).toBe(3868.80);
      expect(result.medicareAnnual).toBe(904.80);
      expect(result.futaAnnual).toBe(42.00);
      expect(result.sutaAnnual).toBe(200.00);
      expect(result.payrollTaxesAnnual).toBe(5015.60);
      expect(result.workersCompAnnual).toBe(3120.00);
      expect(result.benefitsAnnual).toBe(6000.00);

      // Total annual cost: 62400 + 5015.60 + 3120 + 6000 = $76,535.60
      expect(result.totalCostAnnual).toBe(76535.60);
      expect(result.burdenAmountAnnual).toBe(14135.60);
      expect(result.burdenPercent).toBe(22.65);

      // Hours: 2080 paid, 160 time off, 1920 productive
      expect(result.paidHoursAnnual).toBe(2080);
      expect(result.timeOffHoursAnnual).toBe(160);
      expect(result.productiveHoursAnnual).toBe(1920);

      // Rates: $36.80 per paid hour, $39.86 per productive hour
      expect(result.burdenedRatePerPaidHour).toBe(36.80);
      expect(result.burdenedRatePerProductiveHour).toBe(39.86);
      expect(result.baseHourlyWage).toBe(30);
    });

    it('enforces the Social Security wage base cap for high earners', () => {
      const input: EmployeeBurdenInput = {
        payType: 'salary',
        hourlyRate: 0,
        annualSalary: 250000,
        paidHoursPerYear: 2080,
        paidHolidaysHours: 80,
        paidPtoHours: 80,
        paidSickHours: 0,
        trainingNonBillableHours: 0,
        countryMode: 'us',
        ssEmployerRate: 0.062,
        ssWageBase: 184500,
        medicareRate: 0.0145,
        workersCompRatePer100: 1.0,
        generalLiabilityAnnual: 0,
        annualBenefits: 10000,
      };

      const result = calculateEmployeeBurden(input);

      // SS capped at $184,500 * 0.062 = $11,439.00
      expect(result.socialSecurityAnnual).toBe(11439.00);
      // Medicare is NOT capped: $250,000 * 0.0145 = $3,625.00
      expect(result.medicareAnnual).toBe(3625.00);
    });

    it('enforces FUTA and SUTA caps', () => {
      const input: EmployeeBurdenInput = {
        payType: 'salary',
        hourlyRate: 0,
        annualSalary: 80000,
        paidHoursPerYear: 2080,
        paidHolidaysHours: 0,
        paidPtoHours: 0,
        paidSickHours: 0,
        trainingNonBillableHours: 0,
        countryMode: 'us',
        futaRate: 0.006,
        futaWageBase: 7000,
        sutaRate: 0.03,
        sutaWageBase: 12000,
        workersCompRatePer100: 0,
        generalLiabilityAnnual: 0,
        annualBenefits: 0,
      };

      const result = calculateEmployeeBurden(input);

      // FUTA capped at $7,000 * 0.006 = $42
      expect(result.futaAnnual).toBe(42.00);
      // SUTA capped at $12,000 * 0.03 = $360
      expect(result.sutaAnnual).toBe(360.00);
    });

    it('returns null for productive rate when time off exceeds or equals paid hours', () => {
      const input: EmployeeBurdenInput = {
        payType: 'hourly',
        hourlyRate: 25,
        annualSalary: 0,
        paidHoursPerYear: 100,
        paidHolidaysHours: 50,
        paidPtoHours: 50,
        paidSickHours: 10, // time off = 110 > 100
        trainingNonBillableHours: 0,
        countryMode: 'us',
        workersCompRatePer100: 0,
        generalLiabilityAnnual: 0,
        annualBenefits: 0,
      };

      const result = calculateEmployeeBurden(input);
      expect(result.productiveHoursAnnual).toBe(0);
      expect(result.burdenedRatePerProductiveHour).toBeNull();
    });

    it('handles overtime hours and 1.5x multiplier correctly', () => {
      const input: EmployeeBurdenInput = {
        payType: 'hourly',
        hourlyRate: 20,
        annualSalary: 0,
        paidHoursPerYear: 2000,
        overtimeHoursPerYear: 100, // 100 hrs * $20 * 1.5 = $3,000
        overtimeMultiplier: 1.5,
        paidHolidaysHours: 0,
        paidPtoHours: 0,
        paidSickHours: 0,
        trainingNonBillableHours: 0,
        countryMode: 'other',
        otherOnCostsPercent: 20,
        workersCompRatePer100: 0,
        generalLiabilityAnnual: 0,
        annualBenefits: 0,
      };

      const result = calculateEmployeeBurden(input);
      expect(result.regularWagesAnnual).toBe(40000);
      expect(result.overtimeWagesAnnual).toBe(3000);
      expect(result.wagesAnnual).toBe(43000);
      expect(result.otherOnCostsAnnual).toBe(8600); // 20% of $43,000
      expect(result.totalCostAnnual).toBe(51600);
    });

    it('supports non-US country mode with single on-costs percentage', () => {
      const input: EmployeeBurdenInput = {
        payType: 'salary',
        hourlyRate: 0,
        annualSalary: 50000,
        paidHoursPerYear: 1950,
        paidHolidaysHours: 75,
        paidPtoHours: 150,
        paidSickHours: 0,
        trainingNonBillableHours: 0,
        countryMode: 'other',
        otherOnCostsPercent: 25, // 25% on-costs
        workersCompRatePer100: 0,
        generalLiabilityAnnual: 0,
        annualBenefits: 5000,
      };

      const result = calculateEmployeeBurden(input);
      expect(result.otherOnCostsAnnual).toBe(12500); // 25% of 50,000
      expect(result.socialSecurityAnnual).toBe(0);
      expect(result.medicareAnnual).toBe(0);
      expect(result.totalCostAnnual).toBe(67500); // 50000 + 12500 + 5000
    });
  });

  describe('calculateJobQuote', () => {
    it('matches the build spec worked example for job quote ($6,051.10)', () => {
      const result = calculateJobQuote({
        crew: [
          {
            id: '1',
            role: 'Worker 1',
            burdenedHourlyRate: 39.8623,
            regularHours: 40,
            overtimeHours: 0,
          },
          {
            id: '2',
            role: 'Worker 2',
            burdenedHourlyRate: 39.8623,
            regularHours: 40,
            overtimeHours: 0,
          },
          {
            id: '3',
            role: 'Worker 3',
            burdenedHourlyRate: 39.8623,
            regularHours: 40,
            overtimeHours: 0,
          },
        ],
        materialsCost: 0,
        equipmentCost: 0,
        subcontractorsCost: 0,
        overheadPercent: 15,
        profitPercent: 10,
        pricingMode: 'markup',
      });

      // 120 hrs * 39.8623 = $4,783.48
      expect(result.totalLaborHours).toBe(120);
      expect(result.totalLaborCost).toBe(4783.48);
      expect(result.directCostsSubtotal).toBe(4783.48);
      // Overhead 15%: $717.52 -> cost with overhead = $5,501.00
      expect(result.overheadAmount).toBe(717.52);
      expect(result.costWithOverhead).toBe(5501.00);
      // Profit 10%: $550.10 -> quote = $6,051.10
      expect(result.profitAmount).toBe(550.10);
      expect(result.finalQuotePrice).toBe(6051.10);
      expect(result.effectiveMarkupPercent).toBe(26.5);
    });

    it('supports margin mode using pricing-engine priceFromMargin', () => {
      const result = calculateJobQuote({
        crew: [
          {
            id: '1',
            role: 'Lead',
            burdenedHourlyRate: 50,
            regularHours: 10,
            overtimeHours: 0,
          },
        ],
        materialsCost: 500,
        equipmentCost: 0,
        subcontractorsCost: 0,
        overheadPercent: 10,
        profitPercent: 20, // 20% margin on final price
        pricingMode: 'margin',
      });

      // Direct cost = 500 labor + 500 materials = 1,000
      expect(result.directCostsSubtotal).toBe(1000);
      // Overhead 10% = 100 -> costWithOverhead = 1,100
      expect(result.costWithOverhead).toBe(1100);
      // 20% margin: 1,100 / (1 - 0.20) = 1,375.00
      expect(result.finalQuotePrice).toBe(1375.00);
      expect(result.effectiveGrossMarginPercent).toBe(27.27);
    });
  });

  describe('calculateLaborPercent', () => {
    it('computes labor percent of revenue accurately', () => {
      const result = calculateLaborPercent(30000, 100000);
      expect(result.laborPercent).toBe(30.0);
    });

    it('handles zero or negative revenue safely', () => {
      const result = calculateLaborPercent(30000, 0);
      expect(result.laborPercent).toBeNull();
    });
  });

  describe('compareEmployeeVsSub', () => {
    it('compares employee vs subcontractor correctly', () => {
      // Employee burdened rate $40 vs Sub quote $55 for 100 hours
      const result = compareEmployeeVsSub({
        burdenedProductiveRate: 40,
        subcontractorHourlyRate: 55,
        projectHours: 100,
      });

      expect(result.employeeTotalCost).toBe(4000);
      expect(result.subcontractorTotalCost).toBe(5500);
      expect(result.costDifference).toBe(1500);
      expect(result.cheaperOption).toBe('employee');
      expect(result.percentDifference).toBe(37.5);
    });

    it('identifies when subcontractor is cheaper', () => {
      const result = compareEmployeeVsSub({
        burdenedProductiveRate: 60,
        subcontractorHourlyRate: 45,
        projectHours: 50,
      });

      expect(result.costDifference).toBe(-750);
      expect(result.cheaperOption).toBe('subcontractor');
    });
  });
});
