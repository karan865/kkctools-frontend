import { describe, it, expect } from 'vitest';
import {
  pitchFactor,
  SQFT_PER_SQUARE,
  M2_PER_SQUARE,
  ROOFING_MATERIALS,
  calculateRoofReplacement,
  quickEstimate,
  homeSizeTable,
  materialComparison,
  laborPerSquare,
} from './roof-replacement-engine';
import { pitchFactor as shinglePitchFactor } from './shingle-engine';
import { METALS, ASPHALTS, TEAR_OFF_RANGE } from './metal-roof-engine';

describe('Roof Replacement Cost Engine', () => {
  describe('Pitch factors and slope geometry (§3.4)', () => {
    it('matches shingle-engine pitch factors and true geometric formulas √(1 + (r/12)²)', () => {
      // 4/12 = √(1 + (4/12)²) = √(1 + 1/9) = √(10/9) ≈ 1.05409
      expect(pitchFactor(4)).toBeCloseTo(1.054, 3);
      expect(pitchFactor(4)).toBe(shinglePitchFactor(4));

      // 6/12 = √(1 + (6/12)²) = √(1 + 0.25) = √1.25 ≈ 1.11803
      expect(pitchFactor(6)).toBeCloseTo(1.118, 3);
      expect(pitchFactor(6)).toBe(shinglePitchFactor(6));

      // 8/12 = √(1 + (8/12)²) = √(1 + 4/9) = √(13/9) ≈ 1.20185
      expect(pitchFactor(8)).toBeCloseTo(1.202, 3);
      expect(pitchFactor(8)).toBe(shinglePitchFactor(8));

      // 10/12 = √(1 + (10/12)²) = √(1 + 25/36) = √(61/36) ≈ 1.30171
      expect(pitchFactor(10)).toBeCloseTo(1.302, 3);
      expect(pitchFactor(10)).toBe(shinglePitchFactor(10));

      // 12/12 = √(1 + 1) = √2 ≈ 1.41421
      expect(pitchFactor(12)).toBeCloseTo(1.414, 3);
      expect(pitchFactor(12)).toBe(shinglePitchFactor(12));
    });

    it('handles negative or zero pitch cleanly without NaN', () => {
      expect(pitchFactor(0)).toBe(1.0);
      expect(pitchFactor(-5)).toBe(1.0);
    });

    it('verifies standard square conversion constants', () => {
      expect(SQFT_PER_SQUARE).toBe(100);
      expect(M2_PER_SQUARE).toBeCloseTo(9.290304, 6);
    });
  });

  describe('Hand calculation verification (2,000 sq ft footprint, 6/12 pitch)', () => {
    it('accurately computes roof area and squares matching hand geometry', () => {
      /**
       * Hand calculation:
       * Footprint = 2,000 sq ft, modeled aspect ratio 1.5:1.
       * W = √(2000 / 1.5) ≈ 36.5148 ft
       * L = 1.5 * W ≈ 54.7723 ft
       * Overhang = 12 in (1 ft on each side):
       * L_overhang = 54.7723 + 2 = 56.7723 ft
       * W_overhang = 36.5148 + 2 = 38.5148 ft
       * Projected horizontal area = 56.7723 * 38.5148 ≈ 2,186.57 sq ft
       * Slope factor (6/12) = √1.25 ≈ 1.118034
       * Sloped Roof Area = 2,186.57 * 1.118034 ≈ 2,444.66 sq ft
       * Waste (Hip = 15%):
       * Total Squares = (2,444.66 * 1.15) / 100 ≈ 28.11 squares
       */
      const res = quickEstimate(2000, 6, 'architectural', 1);
      expect(res.roofAreaSqFt).toBeGreaterThan(2400);
      expect(res.roofAreaSqFt).toBeLessThan(2500);
      expect(res.totalSquares).toBeGreaterThan(27);
      expect(res.totalSquares).toBeLessThan(29);
      expect(res.pitchFactorVal).toBeCloseTo(1.12, 2);
    });
  });

  describe('Tear-off, Layers, and Code Constraints (§3.2, §3.4)', () => {
    it('scales tear-off linearly with layers and gives 0 when layers = 0', () => {
      const res0 = calculateRoofReplacement({ footprintSqFt: 2000, existingLayers: 0 });
      expect(res0.tearOffTotal).toBe(0);
      expect(res0.dumpsterCount).toBe(0);

      const res1 = calculateRoofReplacement({ footprintSqFt: 2000, existingLayers: 1 });
      const res2 = calculateRoofReplacement({ footprintSqFt: 2000, existingLayers: 2 });

      expect(res1.tearOffTotal).toBeGreaterThan(0);
      // res2 tear off should be exactly double res1
      expect(res2.tearOffTotal).toBeCloseTo(res1.tearOffTotal * 2, 0);
    });

    it('enforces IRC R908.3.1.1: permits overlay for 0 or 1 layer, blocks overlay for 2+ layers', () => {
      const res1 = calculateRoofReplacement({ footprintSqFt: 2000, existingLayers: 1 });
      const overlay1 = res1.compareOptions.find((o) => o.type === 'overlay');
      expect(overlay1?.isPermitted).toBe(true);
      expect(overlay1?.totalCost).toBeGreaterThan(0);

      const res2 = calculateRoofReplacement({ footprintSqFt: 2000, existingLayers: 2 });
      const overlay2 = res2.compareOptions.find((o) => o.type === 'overlay');
      expect(overlay2?.isPermitted).toBe(false);
      expect(overlay2?.restrictionNote).toContain('IRC R908.3.1.1');
    });
  });

  describe('Decking (sheathing) replacement calculation', () => {
    it('replaces ceil(area * pct / 32) sheets', () => {
      const res = calculateRoofReplacement({ footprintSqFt: 2000, pitchRise: 6, deckingReplacePercent: 10 });
      const expectedSheets = Math.ceil((res.roofAreaSqFt * 0.1) / 32);
      expect(res.deckingSheets).toBe(expectedSheets);
      expect(res.deckingTotal).toBeGreaterThan(0);
    });
  });

  describe('Multipliers for stories, slope, and complexity', () => {
    it('applies stories and steep slope surcharges to labour only (not materials)', () => {
      const base1Story = calculateRoofReplacement({
        footprintSqFt: 2000,
        pitchRise: 4, // not steep (< 8)
        stories: '1',
      });

      const steep2Story = calculateRoofReplacement({
        footprintSqFt: 2000,
        pitchRise: 4, // keep pitch same so geometry is identical
        stories: '2', // 1.2x labour
      });

      // Materials must remain identical
      expect(steep2Story.materialTotal).toBe(base1Story.materialTotal);
      // Labour must increase by stories factor (1.2x)
      expect(steep2Story.laborTotal).toBeCloseTo(base1Story.laborTotal * 1.2, 0);
    });

    it('applies steep slope surcharge (+20%) when pitch >= 8/12', () => {
      const labFlat = laborPerSquare('architectural', '1', 6, 'simple');
      const labSteep = laborPerSquare('architectural', '1', 8, 'simple');

      // Steep slope surcharge is +20% on labour
      expect(labSteep.typical).toBeCloseTo(labFlat.typical * 1.2, 1);
    });
  });

  describe('Shared pricing alignment with metal-roof-engine and asphalts', () => {
    it('aligns asphalt rates with ASPHALTS constants', () => {
      const arch = ROOFING_MATERIALS.architectural;
      const metalAsphalt = ASPHALTS.find((a) => a.id === 'architectural');
      expect(metalAsphalt).toBeDefined();
      // $400-$600/square installed matches $4-$6/sq ft
      expect(arch.installedRange[0]).toBe(metalAsphalt!.range[0] * 100);
      expect(arch.installedRange[1]).toBe(metalAsphalt!.range[1] * 100);
      expect(arch.defaultInstalledPerSquare).toBe(metalAsphalt!.price * 100);
    });

    it('aligns standing seam and corrugated metal rates with METALS constants', () => {
      const standing = ROOFING_MATERIALS.standingSeam;
      const metalStanding = METALS.find((m) => m.id === 'standingSeam');
      expect(metalStanding).toBeDefined();
      expect(standing.installedRange[0]).toBe(metalStanding!.range[0] * 100);
      expect(standing.installedRange[1]).toBe(metalStanding!.range[1] * 100);
      expect(standing.defaultInstalledPerSquare).toBe(metalStanding!.price * 100);

      const corrug = ROOFING_MATERIALS.corrugated;
      const metalCorrug = METALS.find((m) => m.id === 'corrugated');
      expect(metalCorrug).toBeDefined();
      expect(corrug.installedRange[0]).toBe(metalCorrug!.range[0] * 100);
      expect(corrug.installedRange[1]).toBe(metalCorrug!.range[1] * 100);
      expect(corrug.defaultInstalledPerSquare).toBe(metalCorrug!.price * 100);
    });

    it('aligns tear-off rates with TEAR_OFF_RANGE', () => {
      expect(TEAR_OFF_RANGE[0] * 100).toBe(100);
      expect(TEAR_OFF_RANGE[1] * 100).toBe(300);
    });
  });

  describe('Low <= Typical <= High and Sanitization checks', () => {
    it('guarantees low <= typical <= high across all line items and totals', () => {
      const res = calculateRoofReplacement({ footprintSqFt: 2500, pitchRise: 8, stories: '2' });
      expect(res.low).toBeLessThanOrEqual(res.total);
      expect(res.total).toBeLessThanOrEqual(res.high);

      for (const item of res.lineItems) {
        expect(item.lowCost).toBeLessThanOrEqual(item.totalCost);
        expect(item.totalCost).toBeLessThanOrEqual(item.highCost);
      }
    });

    it('safely handles empty/negative input without returning NaN or -0', () => {
      const res = calculateRoofReplacement({
        footprintSqFt: -100,
        pitchRise: -4,
        existingLayers: -2,
        permitFee: -50,
      });

      expect(Number.isNaN(res.total)).toBe(false);
      expect(res.total).toBeGreaterThanOrEqual(0);
      expect(Object.is(res.total, -0)).toBe(false);
    });
  });

  describe('Quote checker helper (§3.2, §3.3)', () => {
    it('accurately evaluates contractor quotes against low and high bounds', () => {
      const res = quickEstimate(2000, 6, 'architectural', 1);
      const lowCheck = res.quoteCheck(res.low - 1000);
      expect(lowCheck.status).toBe('below');
      expect(lowCheck.diffAmount).toBeLessThan(0);

      const highCheck = res.quoteCheck(res.high + 2000);
      expect(highCheck.status).toBe('above');
      expect(highCheck.diffAmount).toBeGreaterThan(0);

      const withinCheck = res.quoteCheck(res.total);
      expect(withinCheck.status).toBe('within');

      const invalidCheck = res.quoteCheck(0);
      expect(invalidCheck.status).toBe('n/a');
    });
  });

  describe('Home size and material comparison tables (§3.2)', () => {
    it('produces consistent benchmark rows for 1000 to 3000 sq ft homes', () => {
      const table = homeSizeTable('architectural');
      expect(table.length).toBe(5);
      expect(table[0].homeFootprintSqFt).toBe(1000);
      expect(table[4].homeFootprintSqFt).toBe(3000);

      for (const row of table) {
        expect(row.lowCost).toBeLessThanOrEqual(row.typicalCost);
        expect(row.typicalCost).toBeLessThanOrEqual(row.highCost);
        expect(row.costPerSquare).toBeGreaterThan(0);
      }
    });

    it('produces material comparison matrix with lifespan and annual cost', () => {
      const comparison = materialComparison(2000, 6, 1);
      expect(comparison.length).toBe(Object.keys(ROOFING_MATERIALS).length);

      for (const row of comparison) {
        expect(row.totalCost).toBeGreaterThan(0);
        expect(row.lifespanYears).toBeGreaterThan(0);
        expect(row.costPerYear).toBeCloseTo(row.totalCost / row.lifespanYears, 1);
      }
    });
  });
});
