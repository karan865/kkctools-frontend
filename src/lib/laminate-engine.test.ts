import { describe, it, expect } from 'vitest';
import { calculateLaminate, calculatePlankCoverage } from './laminate-engine';

describe('Laminate Flooring Calculation Engine (Tool #12 Verification Suite)', () => {
  // Test 1: 18x14, 10%, 20/box -> net 252, gross 277.2, 14 boxes, purchased 280, surplus 2.8, 3 rolls, perimeter 64
  it('Vector 1: 18x14 room, 10% waste, 20 sq ft/box', () => {
    const res = calculateLaminate({
      areas: [{ id: '1', lengthFt: 18, widthFt: 14, mode: 'add' }],
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
    });

    expect(res.netAreaSqFt).toBe(252);
    expect(res.grossAreaSqFt).toBe(277.2);
    expect(res.boxesNeeded).toBe(14); // ceil(277.2 / 20) = 14
    expect(res.purchasedAreaSqFt).toBe(280);
    expect(res.surplusSqFt).toBe(2.8);
    expect(res.underlaymentRolls).toBe(3); // ceil(252 / 100) = 3
    expect(res.perimeterLinearFt).toBe(64); // 2 * (18 + 14) = 64
  });

  // Test 2: Float regression test: 20x20, 10%, 20/box -> exactly 22 boxes (not 23)
  it('Vector 2: Float regression guard (20x20 at 10% waste, 20 sq ft/box -> exactly 22 boxes)', () => {
    const res = calculateLaminate({
      areas: [{ id: '1', lengthFt: 20, widthFt: 20, mode: 'add' }],
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
    });

    expect(res.netAreaSqFt).toBe(400);
    // In JS: 400 * 1.1 = 440.00000000000006
    // Naive Math.ceil(440.00000000000006 / 20) would yield 23!
    // Our float-safe epsilon must yield exactly 22:
    expect(res.boxesNeeded).toBe(22);
  });

  // Test 3: Common room sizes at 10% waste and 20 sq ft/box
  it('Vector 3: Common room sizes exact box yields', () => {
    const rooms = [
      { l: 10, w: 10, expected: 6 }, // 100 * 1.1 = 110 -> 6
      { l: 10, w: 12, expected: 7 }, // 120 * 1.1 = 132 -> 7
      { l: 12, w: 12, expected: 8 }, // 144 * 1.1 = 158.4 -> 8
      { l: 12, w: 15, expected: 10 }, // 180 * 1.1 = 198 -> 10
      { l: 12, w: 16, expected: 11 }, // 192 * 1.1 = 211.2 -> 11
      { l: 14, w: 16, expected: 13 }, // 224 * 1.1 = 246.4 -> 13
      { l: 15, w: 20, expected: 17 }, // 300 * 1.1 = 330 -> 17
    ];

    for (const r of rooms) {
      const res = calculateLaminate({
        areas: [{ id: '1', lengthFt: r.l, widthFt: r.w, mode: 'add' }],
        boxCoverageSqFt: 20,
        wastePercent: 10,
        attachedPad: false,
      });
      expect(res.boxesNeeded).toBe(r.expected);
    }
  });

  // Test 4: Direct total square footage benchmarks
  it('Vector 4: Direct square footage box yields at 10% waste and 20 sq ft/box', () => {
    const areas = [
      { sqFt: 100, expected: 6 },
      { sqFt: 200, expected: 11 },
      { sqFt: 300, expected: 17 },
      { sqFt: 400, expected: 22 },
      { sqFt: 500, expected: 28 },
      { sqFt: 1000, expected: 55 },
    ];

    for (const a of areas) {
      const res = calculateLaminate({
        directSqFt: a.sqFt,
        boxCoverageSqFt: 20,
        wastePercent: 10,
        attachedPad: false,
      });
      expect(res.boxesNeeded).toBe(a.expected);
    }
  });

  // Test 5: Multi-room add + subtract; subtract >= add -> net 0 + message
  it('Vector 5: Multi-room addition and subtraction deductions', () => {
    const normalMulti = calculateLaminate({
      areas: [
        { id: '1', label: 'Living Room', lengthFt: 20, widthFt: 15, mode: 'add' }, // 300
        { id: '2', label: 'Hallway', lengthFt: 10, widthFt: 4, mode: 'add' }, // 40
        { id: '3', label: 'Kitchen Island', lengthFt: 6, widthFt: 4, mode: 'subtract' }, // -24
      ],
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
    });
    expect(normalMulti.netAreaSqFt).toBe(316); // 340 - 24 = 316

    const excessiveSub = calculateLaminate({
      areas: [
        { id: '1', lengthFt: 10, widthFt: 10, mode: 'add' }, // 100
        { id: '2', lengthFt: 12, widthFt: 10, mode: 'subtract' }, // -120
      ],
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
    });
    expect(excessiveSub.netAreaSqFt).toBe(0);
    expect(excessiveSub.boxesNeeded).toBe(0);
    expect(excessiveSub.warningMessage).toBeDefined();
  });

  // Test 6: Cost calculation verification
  // 14 boxes @ $38 = $532; per-sq-ft path ($1.90 * 20 * 14) = $532; + 3 * $40 + $45 -> $697; with 7% tax
  it('Vector 6: Cost calculation (perBox, perSqFt, underlayment, molding, sales tax)', () => {
    const costPerBox = calculateLaminate({
      areas: [{ id: '1', lengthFt: 18, widthFt: 14, mode: 'add' }], // 14 boxes
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
      pricing: {
        basis: 'perBox',
        price: 38,
        underlaymentPerRoll: 40,
        molding: { allowance: 45 },
      },
    });

    expect(costPerBox.flooringCost).toBe(532); // 14 * 38
    expect(costPerBox.underlaymentCost).toBe(120); // 3 * 40
    expect(costPerBox.moldingCost).toBe(45);
    expect(costPerBox.totalDiyCost).toBe(697); // 532 + 120 + 45 = 697

    // Per sq ft pricing path: $1.90/sq ft * 20 sq ft/box * 14 boxes = $532
    const costPerSqFt = calculateLaminate({
      areas: [{ id: '1', lengthFt: 18, widthFt: 14, mode: 'add' }],
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
      pricing: {
        basis: 'perSqFt',
        price: 1.90,
        underlaymentPerRoll: 40,
        molding: { allowance: 45 },
        salesTaxPercent: 7,
      },
    });

    expect(costPerSqFt.flooringCost).toBe(532);
    expect(costPerSqFt.materialsSubtotal).toBe(697);
    // 697 * 0.07 = 48.79
    expect(costPerSqFt.salesTaxAmount).toBe(48.79);
    expect(costPerSqFt.totalDiyCost).toBe(745.79);
  });

  // Test 7: attachedPad = true -> 0 rolls, no underlayment cost
  it('Vector 7: Planks with pre-attached pad require 0 rolls and zero underlayment cost', () => {
    const res = calculateLaminate({
      areas: [{ id: '1', lengthFt: 18, widthFt: 14, mode: 'add' }],
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: true,
      pricing: {
        basis: 'perBox',
        price: 38,
        underlaymentPerRoll: 40,
      },
    });

    expect(res.attachedPad).toBe(true);
    expect(res.underlaymentRolls).toBe(0);
    expect(res.underlaymentCost).toBe(0);
  });

  // Test 8: Plank size helper: 7.5 x 47.25 x 9 planks -> 22.15 sq ft
  it('Vector 8: Plank dimensions helper calculates correct box coverage', () => {
    const coverage = calculatePlankCoverage(7.5, 47.25, 9);
    expect(coverage).toBe(22.15);
  });

  // Test 9: Pro benchmark for 252 sq ft -> $504 - $1,260
  it('Vector 9: Professional contractor labor benchmark ($2.00 - $5.00 / sq ft net)', () => {
    const res = calculateLaminate({
      areas: [{ id: '1', lengthFt: 18, widthFt: 14, mode: 'add' }], // 252 sq ft
      boxCoverageSqFt: 20,
      wastePercent: 10,
      attachedPad: false,
    });

    expect(res.proLaborLow).toBe(504); // 252 * 2.00 = 504
    expect(res.proLaborHigh).toBe(1260); // 252 * 5.00 = 1260
    expect(res.diySavingsLow).toBe(504);
    expect(res.diySavingsHigh).toBe(1260);
  });

  // Test 10: Validation edge cases (blank, 0, negative, NaN, Infinity, waste clamping)
  it('Vector 10: Robust validation for edge cases and malformed inputs', () => {
    const res = calculateLaminate({
      directSqFt: -100,
      boxCoverageSqFt: 0,
      wastePercent: 99,
      attachedPad: false,
    });

    expect(res.netAreaSqFt).toBe(0);
    expect(res.boxesNeeded).toBe(0);
    expect(res.totalDiyCost).toBe(0);
  });
});
