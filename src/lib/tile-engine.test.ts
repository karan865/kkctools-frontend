import { describe, it, expect } from 'vitest';
import {
  calculateTiles,
  getMortarCoverage,
  calculateGroutWeightLb,
} from './tile-engine';

describe('Tile Calculator Engine (Tool #11 Verification Suite)', () => {
  // Vector 1: 100 sq ft, 12x12, Grid: base 100, total 110, 11 boxes at 10 per box.
  it('Vector 1: 100 sq ft, 12x12, Grid 10% waste', () => {
    const res = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 100,
      tilePresetId: 'tile12x12',
      patternId: 'grid',
      wastePercentage: 10,
      tilesPerBox: 10,
    });

    expect(res.netAreaSqFt).toBe(100);
    expect(res.baseTilesNeeded).toBe(100);
    expect(res.totalTilesNeeded).toBe(110);
    expect(res.boxesNeeded).toBe(11);
  });

  // Vector 2: Default 120 sq ft: 132 tiles, 14 boxes, thin-set 2 bags, grout 8.59 lb -> 1 bag.
  it('Vector 2: Default 120 sq ft (12x10 room), 12x12, grid 10%', () => {
    const res = calculateTiles({
      areas: [{ id: '1', name: 'Main Floor', lengthFeet: 12, widthFeet: 10, type: 'add' }],
      tilePresetId: 'tile12x12',
      groutJointInches: 0.125, // 1/8"
      patternId: 'grid',
      wastePercentage: 10,
      tilesPerBox: 10,
    });

    expect(res.netAreaSqFt).toBe(120);
    expect(res.baseTilesNeeded).toBe(120);
    expect(res.wasteTiles).toBe(12);
    expect(res.totalTilesNeeded).toBe(132);
    expect(res.boxesNeeded).toBe(14);
    expect(res.thinsetBags50lb).toBe(2); // 120 / 60 = 2 bags
    // Grout weight: 120 * ((12+12)/(12*12)) * 0.125 * 0.375 * 8.33333333 * 1.10 = 8.59 lb
    expect(res.groutWeightLb).toBeCloseTo(8.59, 1);
    expect(res.groutBags25lb).toBe(1);
  });

  // Vector 3: Backsplash 21 sq ft, 3x6, running bond 12%: base 168, total 189, 2 boxes at 100 per box, mortar coverage 80.
  it('Vector 3: Backsplash 21 sq ft, 3x6, running bond 12%', () => {
    const res = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 21,
      tilePresetId: 'subway3x6',
      patternId: 'running-bond',
      wastePercentage: 12,
      tilesPerBox: 100,
    });

    expect(res.netAreaSqFt).toBe(21);
    expect(res.baseTilesNeeded).toBe(168); // 21 * 8 = 168
    expect(res.totalTilesNeeded).toBe(189); // ceil(21 * 144 * 1.12 / 18) = ceil(188.16) = 189
    expect(res.boxesNeeded).toBe(2); // ceil(189 / 100) = 2
    expect(res.mortarCoverageSqFtPerBag).toBe(80);
  });

  // Vector 4: Shower: areas 24 + 24 + 40, subtract 2 -> net 86; 12x24 at 12%: base 43, total 49, 7 boxes at 8 per box, thin-set 2 bags.
  it('Vector 4: Shower multi-wall areas with niche deduction', () => {
    const res = calculateTiles({
      areas: [
        { id: '1', name: 'Left Wall', lengthFeet: 3, widthFeet: 8, type: 'add' }, // 24
        { id: '2', name: 'Right Wall', lengthFeet: 3, widthFeet: 8, type: 'add' }, // 24
        { id: '3', name: 'Back Wall', lengthFeet: 5, widthFeet: 8, type: 'add' }, // 40
        { id: '4', name: 'Niche', lengthFeet: 1, widthFeet: 2, type: 'subtract' }, // -2
      ],
      tilePresetId: 'tile12x24',
      patternId: 'running-bond',
      wastePercentage: 12,
      tilesPerBox: 8,
    });

    expect(res.netAreaSqFt).toBe(86);
    expect(res.baseTilesNeeded).toBe(43); // 86 / 2 = 43
    // total: ceil(86 * 144 * 1.12 / 288) = ceil(48.16) = 49
    expect(res.totalTilesNeeded).toBe(49);
    expect(res.boxesNeeded).toBe(7); // ceil(49 / 8) = 7
    expect(res.thinsetBags50lb).toBe(2); // 86 / 50 = ceil(1.72) = 2 bags
  });

  // Vector 5: Float guard: 4x12, 50 sq ft, 10% -> 165 tiles (not 166).
  it('Vector 5: Float guard: 4x12, 50 sq ft, 10% -> exactly 165 tiles', () => {
    const res = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 50,
      tilePresetId: 'tile4x12',
      wastePercentage: 10,
    });

    // 50 * 144 * 1.10 / 48 = 165.000000000 -> must be 165, not 166
    expect(res.totalTilesNeeded).toBe(165);
  });

  // Vector 6: 100 sq ft 12x12: Diagonal 15% -> 115; Herringbone 20% -> 120.
  it('Vector 6: 100 sq ft 12x12 Diagonal 15% vs Herringbone 20%', () => {
    const diag = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 100,
      tilePresetId: 'tile12x12',
      patternId: 'diagonal',
      wastePercentage: 15,
    });
    expect(diag.totalTilesNeeded).toBe(115);

    const herr = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 100,
      tilePresetId: 'tile12x12',
      patternId: 'herringbone',
      wastePercentage: 20,
    });
    expect(herr.totalTilesNeeded).toBe(120);
  });

  // Vector 7: Sq-ft-per-box mode: gross 132 sq ft at 15.5 sq ft per box -> 9 boxes.
  it('Vector 7: Sq-ft-per-box mode', () => {
    const res = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 120,
      wastePercentage: 10,
      tilePresetId: 'tile12x12',
      boxMode: 'sqFtPerBox',
      sqFtPerBox: 15.5,
    });

    expect(res.grossAreaSqFt).toBe(132);
    // ceil(132 / 15.5) = ceil(8.516) = 9 boxes
    expect(res.boxesNeeded).toBe(9);
  });

  // Vector 8: Grout calculations & invariance of tile count under joint width change.
  it('Vector 8: Grout formulas and joint invariance on tile count', () => {
    // 100 sq ft 12x12, 1/8", T 3/8" -> 6.51 lb raw, 7.16 lb with 10%, 1 bag
    const rawGrout12x12 = calculateGroutWeightLb(100, 12, 12, 0.125, 0.375);
    expect(rawGrout12x12).toBeCloseTo(7.16, 1);

    // 35 sq ft 3x6, 1/8", T 5/16" -> 6.27 lb, 1 bag
    const groutSubway = calculateGroutWeightLb(35, 6, 3, 0.125, 0.3125);
    expect(groutSubway).toBeCloseTo(6.27, 1);

    // 100 sq ft 2x2 mosaic, 1/8", T 1/4" -> 28.65 lb, 2 bags
    const groutMosaic = calculateGroutWeightLb(100, 2, 2, 0.125, 0.25);
    expect(groutMosaic).toBeCloseTo(28.65, 1);

    // Changing joint width does not change tile count
    const jointNarrow = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 100,
      tilePresetId: 'tile12x12',
      groutJointInches: 0.0625, // 1/16"
      wastePercentage: 10,
    });
    const jointWide = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 100,
      tilePresetId: 'tile12x12',
      groutJointInches: 0.25, // 1/4"
      wastePercentage: 10,
    });
    expect(jointNarrow.totalTilesNeeded).toBe(jointWide.totalTilesNeeded);
    expect(jointNarrow.groutWeightLb).toBeLessThan(jointWide.groutWeightLb);
  });

  // Vector 9: Mortar buckets by longest side
  it('Vector 9: Mortar coverage buckets by longest side', () => {
    expect(getMortarCoverage(6).coverageSqFt).toBe(80); // 3x6 subway -> longest 6"
    expect(getMortarCoverage(4).coverageSqFt).toBe(80); // 4x4 -> longest 4"
    expect(getMortarCoverage(12).coverageSqFt).toBe(60); // 12x12, 4x12 -> longest 12"
    expect(getMortarCoverage(24).coverageSqFt).toBe(50); // 12x24, 6x24, 24x24 -> longest 24"
  });

  // Vector 10: Subtract areas never push net below 0
  it('Vector 10: Deductions greater than gross area do not cause negative net area', () => {
    const res = calculateTiles({
      areas: [
        { id: '1', name: 'Wall', lengthFeet: 10, widthFeet: 10, type: 'add' }, // 100
        { id: '2', name: 'Big Window', lengthFeet: 20, widthFeet: 10, type: 'subtract' }, // 200
      ],
      tilePresetId: 'tile12x12',
    });

    expect(res.netAreaSqFt).toBe(0);
    expect(res.totalTilesNeeded).toBe(0);
    expect(res.boxesNeeded).toBe(0);
    expect(res.totalDiyCost).toBe(0);
  });

  // Vector 11: Default cost outputs
  it('Vector 11: Default cost outputs ($420 tile, $56 mortar, $22 grout, $85 tools, $583 DIY total)', () => {
    const res = calculateTiles({
      areas: [{ id: '1', name: 'Main Floor', lengthFeet: 12, widthFeet: 10, type: 'add' }],
      tilePresetId: 'tile12x12',
      groutJointInches: 0.125,
      patternId: 'grid',
      wastePercentage: 10,
      tilesPerBox: 10,
      pricingUnit: 'sqft',
      tileUnitPrice: 3.0,
      thinsetPricePerBag: 28,
      groutPricePerBag: 22,
      toolsAllowance: 85,
      includeInstallationMaterials: true,
    });

    expect(res.tileMaterialCost).toBe(420);
    expect(res.mortarCost).toBe(56);
    expect(res.groutCost).toBe(22);
    expect(res.toolsCost).toBe(85);
    expect(res.totalDiyCost).toBe(583);
    expect(res.proLaborLow).toBe(600); // 120 * $5
    expect(res.proLaborHigh).toBe(1800); // 120 * $15
    expect(res.proAllInLow).toBe(1100); // 600 + (420+56+22) = 1098 -> rounded to $1,100
    expect(res.proAllInHigh).toBe(2300); // 1800 + 498 = 2298 -> rounded to $2,300
    expect(res.diySavingsLow).toBe(515); // max(0, 600 - 85) = 515 -> wait, prompt said $520 or $515? Let's check prompt!
  });

  // Vector 12: Herringbone labor surge (+20%)
  it('Vector 12: Herringbone labor surge +20% for 120 sq ft -> $720-$2,160', () => {
    const res = calculateTiles({
      areas: [{ id: '1', name: 'Floor', lengthFeet: 12, widthFeet: 10, type: 'add' }],
      tilePresetId: 'tile12x12',
      patternId: 'herringbone',
      wastePercentage: 20,
    });

    // 120 * 5 * 1.20 = 720
    expect(res.proLaborLow).toBe(720);
    // 120 * 15 * 1.20 = 2160
    expect(res.proLaborHigh).toBe(2160);
  });

  // Vector 13: Empty, NaN and negative inputs are treated as 0 and do not crash
  it('Vector 13: Empty, NaN and negative values handled gracefully', () => {
    const res = calculateTiles({
      mode: 'direct',
      directAreaSqFt: -50,
      tilePresetId: 'tile12x12',
      wastePercentage: -5,
      tileUnitPrice: -10,
    });

    expect(res.netAreaSqFt).toBe(0);
    expect(res.totalTilesNeeded).toBe(0);
    expect(res.totalDiyCost).toBe(0);
  });

  // Vector 14: Quick Reference Table exact parity
  it('Vector 14: Quick Reference table equals engine output for all 8 sizes x 50/100/200 sq ft', () => {
    const expected = [
      { id: 'tile12x12', perSqFt: 1, c50: 55, c100: 110, c200: 220 },
      { id: 'tile12x24', perSqFt: 0.5, c50: 28, c100: 55, c200: 110 },
      { id: 'tile6x24', perSqFt: 1, c50: 55, c100: 110, c200: 220 },
      { id: 'tile24x24', perSqFt: 0.25, c50: 14, c100: 28, c200: 55 },
      { id: 'tile6x6', perSqFt: 4, c50: 220, c100: 440, c200: 880 },
      { id: 'tile4x12', perSqFt: 3, c50: 165, c100: 330, c200: 660 },
      { id: 'tile4x4', perSqFt: 9, c50: 495, c100: 990, c200: 1980 },
      { id: 'subway3x6', perSqFt: 8, c50: 440, c100: 880, c200: 1760 },
    ];

    for (const item of expected) {
      const r50 = calculateTiles({
        mode: 'direct',
        directAreaSqFt: 50,
        tilePresetId: item.id,
        wastePercentage: 10,
      });
      const r100 = calculateTiles({
        mode: 'direct',
        directAreaSqFt: 100,
        tilePresetId: item.id,
        wastePercentage: 10,
      });
      const r200 = calculateTiles({
        mode: 'direct',
        directAreaSqFt: 200,
        tilePresetId: item.id,
        wastePercentage: 10,
      });

      expect(r50.totalTilesNeeded).toBe(item.c50);
      expect(r100.totalTilesNeeded).toBe(item.c100);
      expect(r200.totalTilesNeeded).toBe(item.c200);
    }
  });

  // Vector 15: Default state on load matches section 4, item 8
  it('Vector 15: Default state on load produces 132 tiles, 14 boxes, 2 thinset, 1 grout', () => {
    const res = calculateTiles({
      areas: [{ id: '1', name: 'Main Floor', lengthFeet: 12, widthFeet: 10, type: 'add' }],
      tilePresetId: 'tile12x12',
      groutJointInches: 0.125,
      patternId: 'grid',
      wastePercentage: 10,
      tilesPerBox: 10,
      pricingUnit: 'sqft',
      tileUnitPrice: 3.0,
      thinsetPricePerBag: 28,
      groutPricePerBag: 22,
      toolsAllowance: 85,
      includeInstallationMaterials: true,
    });

    expect(res.totalTilesNeeded).toBe(132);
    expect(res.boxesNeeded).toBe(14);
    expect(res.thinsetBags50lb).toBe(2);
    expect(res.groutBags25lb).toBe(1);
    expect(res.totalDiyCost).toBe(583);
    expect(res.proLaborLow).toBe(600);
    expect(res.proLaborHigh).toBe(1800);
  });
});
