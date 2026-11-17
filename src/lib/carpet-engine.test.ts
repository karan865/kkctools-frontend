import { describe, it, expect } from 'vitest';
import {
  calculateRoomRollLayout,
  calculateStairsArea,
  calculateCarpetProject,
  generateRoomBenchmarks,
  checkQuote,
  compareFloors,
  CARPET_GRADES,
  CARPET_FIBRES,
  CARPET_STYLES,
  CARPET_PADS,
  LABOUR_AND_EXTRAS,
  SQFT_PER_SQYD,
  SQFT_PER_M2,
  CarpetCalculatorInput,
} from './carpet-engine';

describe('Carpet Engine - Roll Layout & Geometry', () => {
  it('handles a 12x12 room on a 12 ft roll with 1 drop, 0 seams, and trim allowance', () => {
    // 12x12 room: with 0.5 ft (6 in) trim allowance, length = 12.5 ft.
    // 1 drop of 12 ft roll = 1 * 12 * 12.5 = 150 sq ft. Seams = 0.
    const layout = calculateRoomRollLayout(12, 12, 12, 0.5, 'Bedroom');
    expect(layout.netAreaSqFt).toBe(144);
    expect(layout.drops).toBe(1);
    expect(layout.seams).toBe(0);
    expect(layout.boughtSqFt).toBe(150);
    expect(layout.wasteSqFt).toBe(6);
    expect(layout.wastePercent).toBe(4.17);
  });

  it('evaluates both orientations for a 14x16 room and picks the smaller purchase', () => {
    // Orientation A (unroll along 16 ft, width 14 ft):
    // drops = ceil(14 / 12) = 2. cutLength = 16.5. bought = 2 * 12 * 16.5 = 396 sq ft.
    // Orientation B (unroll along 14 ft, width 16 ft):
    // drops = ceil(16 / 12) = 2. cutLength = 14.5. bought = 2 * 12 * 14.5 = 348 sq ft.
    // Engine must pick Orientation B because 348 < 396.
    const layout = calculateRoomRollLayout(16, 14, 12, 0.5, 'Living Room');
    expect(layout.netAreaSqFt).toBe(224);
    expect(layout.drops).toBe(2);
    expect(layout.seams).toBe(1);
    expect(layout.boughtSqFt).toBe(348);
    expect(layout.orientation).toBe('widthwise');
    expect(layout.wasteSqFt).toBe(124);
  });

  it('strictly respects roll width boundary conditions (12.0 ft vs 12.01 ft)', () => {
    const exactly12 = calculateRoomRollLayout(12.0, 12.0, 12, 0.5);
    expect(exactly12.drops).toBe(1);
    expect(exactly12.seams).toBe(0);

    const slightlyOver12 = calculateRoomRollLayout(12.01, 12.01, 12, 0.5);
    expect(slightlyOver12.drops).toBe(2);
    expect(slightlyOver12.seams).toBe(1);
  });

  it('accurately converts between sq ft, sq yd and m²', () => {
    const sqft = 900;
    const sqyd = sqft / SQFT_PER_SQYD;
    const m2 = sqft / SQFT_PER_M2;
    expect(sqyd).toBe(100);
    expect(Math.round(m2 * 100) / 100).toBe(83.61);
  });
});

describe('Carpet Engine - Stairs Geometry', () => {
  it('correctly calculates 13 standard steps + 10% waste', () => {
    // 13 steps, width 36 in (3 ft), tread 10 in, riser 7.5 in, nosing wrap 1.5 in.
    // per step depth = 10 + 7.5 + 1.5 = 19 in.
    // flight area = 13 * 36 * 19 / 144 = 61.75 sq ft.
    // landing = 0.
    // net = 61.75 sq ft.
    // with 10% waste: 61.75 * 1.10 = 67.925 -> 67.93 sq ft.
    const stairs = calculateStairsArea({
      enabled: true,
      steps: 13,
      style: 'waterfall',
      stairWidthIn: 36,
      treadDepthIn: 10,
      riserHeightIn: 7.5,
      nosingWrapIn: 1.5,
      landingLengthFt: 0,
      landingWidthFt: 0,
    });

    expect(stairs.stairsNetSqFt).toBe(61.75);
    expect(stairs.stairsCarpetSqFt).toBe(67.93);
  });

  it('adds landing area when specified', () => {
    const stairsWithLanding = calculateStairsArea({
      enabled: true,
      steps: 13,
      style: 'box',
      stairWidthIn: 36,
      treadDepthIn: 10,
      riserHeightIn: 7.5,
      nosingWrapIn: 1.5,
      landingLengthFt: 4,
      landingWidthFt: 4,
    });
    // Landing = 4 * 4 = 16 sq ft.
    // Net = 61.75 + 16 = 77.75 sq ft.
    expect(stairsWithLanding.stairsNetSqFt).toBe(77.75);
    expect(stairsWithLanding.stairsCarpetSqFt).toBe(85.53);
  });
});

describe('Carpet Engine - Project Calculations & Line Items', () => {
  const baseInput: CarpetCalculatorInput = {
    mode: 'replace',
    rooms: [
      { id: '1', name: 'Master Bed', type: 'room', lengthFt: 12, widthFt: 14 },
      { id: '2', name: 'Walk-in Closet', type: 'closet', lengthFt: 6, widthFt: 8 },
    ],
    stairs: {
      enabled: true,
      steps: 13,
      style: 'waterfall',
      stairWidthIn: 36,
      treadDepthIn: 10,
      riserHeightIn: 7.5,
      nosingWrapIn: 1.5,
      landingLengthFt: 0,
      landingWidthFt: 0,
    },
    rollWidthFt: 12,
    patternWastePercent: 0,
    isCarpetTiles: false,
    carpetPricePerSqFt: 3.5,
    padPricePerSqFt: 0.9,
    laborRatePerSqFt: 1.5,
    includeRemoval: true,
    removalRatePerSqFt: 0.4,
    includeDisposal: true,
    disposalRatePerSqFt: 0.25,
    furnitureRoomsCount: 1,
    furnitureRatePerRoom: 40.0,
    replaceTackStrips: true,
    tackStripRatePerFt: 0.9,
    transitionCount: 2,
    transitionRate: 25.0,
    subfloorRepairSqFt: 0,
    subfloorRatePerSqFt: 3.5,
    doorsToTrimCount: 0,
    doorTrimRate: 30.0,
    salesTaxPercent: 6,
    taxMaterialsOnly: true,
    regionalMultiplier: 1.0,
  };

  it('runs complete project takeoff and produces valid subtotals', () => {
    const res = calculateCarpetProject(baseInput);

    expect(res.totalNetSqFt).toBeGreaterThan(0);
    expect(res.totalBoughtSqFt).toBeGreaterThan(res.totalNetSqFt);
    expect(res.materialsCost).toBeGreaterThan(0);
    expect(res.laborCost).toBeGreaterThan(0);
    expect(res.prepRemovalCost).toBeGreaterThan(0);
    expect(res.extrasCost).toBeGreaterThan(0);
    expect(res.salesTaxAmount).toBeGreaterThan(0);
    expect(res.grandTotal).toBe(
      Math.round((res.materialsCost + res.laborCost + res.prepRemovalCost + res.extrasCost + res.salesTaxAmount) * 100) / 100
    );
    expect(res.totalLow).toBeLessThanOrEqual(res.grandTotal);
    expect(res.totalHigh).toBeGreaterThanOrEqual(res.grandTotal);
    expect(res.installedCostPerSqFt).toBeGreaterThan(0);
    expect(res.installedCostPerSqYd).toBeCloseTo(res.installedCostPerSqFt * 9, 1);
  });

  it('toggles removal & disposal depending on mode and user settings', () => {
    const replaceRes = calculateCarpetProject({ ...baseInput, mode: 'replace', includeRemoval: true, includeDisposal: true });
    expect(replaceRes.prepRemovalCost).toBeGreaterThan(0);

    const newRes = calculateCarpetProject({ ...baseInput, mode: 'new', includeRemoval: false, includeDisposal: false });
    expect(newRes.prepRemovalCost).toBe(0);
  });

  it('switches to carpet tiles mode with 5% box waste and 0 roll overage', () => {
    const tileRes = calculateCarpetProject({ ...baseInput, isCarpetTiles: true });
    expect(tileRes.roomRollLayouts[0].wastePercent).toBe(5.0);
    expect(tileRes.totalSeams).toBe(0);
  });

  it('safely handles zero, negative, and extreme inputs without NaN', () => {
    const zeroRes = calculateCarpetProject({
      ...baseInput,
      rooms: [{ id: '1', name: 'Empty', type: 'room', lengthFt: 0, widthFt: -5 }],
      stairs: { ...baseInput.stairs, steps: -2 },
      carpetPricePerSqFt: 0,
      laborRatePerSqFt: 0,
    });

    expect(Number.isFinite(zeroRes.grandTotal)).toBe(true);
    expect(zeroRes.grandTotal).toBeGreaterThanOrEqual(0);
    expect(Number.isNaN(zeroRes.installedCostPerSqFt)).toBe(false);
  });
});

describe('Carpet Engine - Sourced Pricing Constants', () => {
  it('verifies all grades have low <= typical <= high and valid sources', () => {
    Object.values(CARPET_GRADES).forEach((grade) => {
      expect(grade.low).toBeLessThanOrEqual(grade.typical);
      expect(grade.typical).toBeLessThanOrEqual(grade.high);
      expect(grade.source.length).toBeGreaterThan(3);
    });
  });

  it('verifies all fibres and styles have valid pricing ranges', () => {
    Object.values(CARPET_FIBRES).forEach((fibre) => {
      expect(fibre.low).toBeLessThanOrEqual(fibre.typical);
      expect(fibre.typical).toBeLessThanOrEqual(fibre.high);
    });
    Object.values(CARPET_STYLES).forEach((style) => {
      expect(style.low).toBeLessThanOrEqual(style.typical);
      expect(style.typical).toBeLessThanOrEqual(style.high);
    });
    Object.values(CARPET_PADS).forEach((pad) => {
      expect(pad.low).toBeLessThanOrEqual(pad.typical);
      expect(pad.typical).toBeLessThanOrEqual(pad.high);
    });
  });

  it('verifies labour and extra items have valid rates', () => {
    Object.values(LABOUR_AND_EXTRAS).forEach((extra) => {
      expect(extra.low).toBeLessThanOrEqual(extra.typical);
      expect(extra.typical).toBeLessThanOrEqual(extra.high);
    });
  });
});

describe('Carpet Engine - Benchmarks, Quote Verifier & Comparisons', () => {
  it('generates consistent room benchmarks', () => {
    const benchmarks = generateRoomBenchmarks();
    expect(benchmarks.length).toBe(10);
    benchmarks.forEach((b) => {
      expect(b.netSqFt).toBeGreaterThan(0);
      expect(b.lowCost).toBeLessThanOrEqual(b.typicalCost);
      expect(b.typicalCost).toBeLessThanOrEqual(b.highCost);
    });
  });

  it('verifies contractor quotes correctly (below, within, above)', () => {
    const mockResult = calculateCarpetProject({
      mode: 'replace',
      rooms: [{ id: '1', name: 'Master', type: 'room', lengthFt: 12, widthFt: 14 }],
      stairs: { enabled: false, steps: 0, style: 'waterfall', stairWidthIn: 36, treadDepthIn: 10, riserHeightIn: 7.5, nosingWrapIn: 1.5, landingLengthFt: 0, landingWidthFt: 0 },
      rollWidthFt: 12,
      patternWastePercent: 0,
      isCarpetTiles: false,
      carpetPricePerSqFt: 4.0,
      padPricePerSqFt: 0.9,
      laborRatePerSqFt: 1.5,
      includeRemoval: true,
      removalRatePerSqFt: 0.4,
      includeDisposal: true,
      disposalRatePerSqFt: 0.25,
      furnitureRoomsCount: 0,
      furnitureRatePerRoom: 40,
      replaceTackStrips: false,
      tackStripRatePerFt: 0.9,
      transitionCount: 1,
      transitionRate: 25,
      subfloorRepairSqFt: 0,
      subfloorRatePerSqFt: 3.5,
      doorsToTrimCount: 0,
      doorTrimRate: 30,
      salesTaxPercent: 0,
      taxMaterialsOnly: true,
      regionalMultiplier: 1.0,
    });

    const lowQuote = checkQuote(mockResult.totalLow - 200, mockResult);
    expect(lowQuote.status).toBe('below');

    const fairQuote = checkQuote(mockResult.grandTotal, mockResult);
    expect(fairQuote.status).toBe('within');

    const highQuote = checkQuote(mockResult.totalHigh + 500, mockResult);
    expect(highQuote.status).toBe('above');
  });

  it('produces floor comparison items for arbitrary areas', () => {
    const comparisons = compareFloors(800);
    expect(comparisons.length).toBe(4);
    expect(comparisons[0].type).toContain('Carpet');
    expect(comparisons[1].type).toContain('Vinyl');
    comparisons.forEach((item) => {
      expect(item.totalCost).toBeGreaterThan(0);
      expect(item.lifespanYears.length).toBeGreaterThan(3);
    });
  });
});
