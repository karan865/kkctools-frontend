import { describe, it, expect } from 'vitest';
import {
  calculatePrintCost,
  filamentGramsFromLength,
  filamentLengthFromGrams,
  calculateFarmOutput,
} from './print-cost-engine';

describe('print-cost-engine', () => {
  describe('Spec 02 Worked Example (3D Print Cost Calculator)', () => {
    it('matches exact spec values for 50 g print with power, wear, failure, labor, markup', () => {
      // 50 g of $20/kg filament ($20 per 1000g)
      // 3 hours, 120W, $0.15/kWh
      // $300 printer, 2000h lifetime
      // 5% failure rate
      // 0.25h labor at $20/h
      // 50% markup
      const res = calculatePrintCost({
        materialType: 'filament',
        filament: {
          gramsUsed: 50,
          spoolPrice: 20,
          spoolWeightGrams: 1000,
        },
        electricity: {
          printerWatts: 120,
          printHours: 3,
          pricePerKwh: 0.15,
        },
        wear: {
          printerPurchasePrice: 300,
          lifetimeHours: 2000,
          printHours: 3,
        },
        failurePct: 5,
        laborHours: 0.25,
        laborRatePerHour: 20,
        markupPct: 50,
        taxPct: 0,
        partsPerPlate: 1,
      });

      // Material: 50 / 1000 * 20 = $1.00
      expect(res.materialCost).toBeCloseTo(1.0, 2);

      // Electricity: (120/1000) * 3 * 0.15 = 0.36 * 0.15 = $0.054
      expect(res.electricityCost).toBeCloseTo(0.054, 3);

      // Wear: (300 / 2000) * 3 = 0.15 * 3 = $0.45
      expect(res.wearCost).toBeCloseTo(0.45, 2);

      // Base consumables: 1.00 + 0.054 + 0.45 = 1.504
      expect(res.baseConsumables).toBeCloseTo(1.504, 3);

      // With 5% failure (/ 0.95): 1.504 / 0.95 = 1.58315... ~ $1.58
      expect(res.totalConsumablesWithFailure).toBeCloseTo(1.583, 3);

      // Labor: 0.25 * 20 = $5.00
      expect(res.laborCost).toBeCloseTo(5.0, 2);

      // Total cost: 1.58315 + 5.00 = $6.58315 ~ $6.58
      expect(res.totalCost).toBeCloseTo(6.58, 2);

      // Price with 50% markup: 6.58315 * 1.50 = $9.8747 ~ $9.87
      expect(res.finalPriceToCharge).toBeCloseTo(9.87, 2);
    });
  });

  describe('Filament length and weight conversions', () => {
    it('calculates grams from length', () => {
      // 10m of 1.75mm PLA (density 1.24 g/cm³)
      // volume = 10000mm * pi * (0.875)^2 = 24052.8 mm³ = 24.0528 cm³
      // weight = 24.0528 * 1.24 = 29.825 g
      const g = filamentGramsFromLength(10, 1.75, 1.24);
      expect(g).toBeCloseTo(29.825, 2);

      // Round-trip back to length
      const len = filamentLengthFromGrams(g, 1.75, 1.24);
      expect(len).toBeCloseTo(10, 3);
    });
  });

  describe('Resin printing mode', () => {
    it('calculates resin material with wash and cure costs', () => {
      const res = calculatePrintCost({
        materialType: 'resin',
        resin: {
          mlUsed: 40,
          bottlePrice: 35,
          bottleMl: 1000,
          washAndCureCostPerPrint: 0.5,
        },
        electricity: {
          printerWatts: 50,
          printHours: 4,
          pricePerKwh: 0.15,
        },
        wear: {
          printerPurchasePrice: 250,
          lifetimeHours: 1500,
          printHours: 4,
        },
        failurePct: 8,
        laborHours: 0.2,
        laborRatePerHour: 25,
        markupPct: 60,
      });

      // Resin: (40/1000)*35 + 0.50 = 1.40 + 0.50 = $1.90
      expect(res.materialCost).toBeCloseTo(1.9, 2);
      expect(res.totalCost).toBeGreaterThan(0);
      expect(res.finalPriceToCharge).toBeGreaterThan(res.totalCost);
    });
  });

  describe('Farm outputs', () => {
    it('calculates daily and monthly output for multiple printers', () => {
      // 5 printers, 3 prints/day, 2 parts/plate -> 30 parts/day
      // cost $5/part, price $12/part
      const farm = calculateFarmOutput(5, 3, 2, 5, 12);
      expect(farm.partsPerDay).toBe(30);
      expect(farm.dailyRevenue).toBe(360);
      expect(farm.dailyProfit).toBe(210);
      expect(farm.monthlyRevenue).toBe(10800);
      expect(farm.monthlyProfit).toBe(6300);
    });
  });
});
