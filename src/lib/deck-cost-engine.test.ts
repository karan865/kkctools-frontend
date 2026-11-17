import { describe, it, expect } from 'vitest';
import {
  calculateDeckCost,
  deckSizeTable,
  compareMaterials,
  checkQuote,
  DEFAULT_FRAMING,
  type DeckCostInput,
} from './deck-cost-engine';

describe('Deck Cost Engine', () => {
  const base12x12: DeckCostInput = {
    mode: 'new',
    sections: [{ name: 'Main Deck', lengthFt: 12, widthFt: 12, isAttached: true, houseEdge: 'length' }],
    heightBand: 'low', // 2-4 ft
    materialId: 'pt_pine',
    boardWidthIn: 5.5,
    boardLengthFt: 16,
    gapIn: 0.1875, // 3/16"
    pattern: 'straight',
    wastePct: 10,
    pictureFrame: false,
    framing: { ...DEFAULT_FRAMING, joistSpacingIn: 16, postSpacingFt: 8 },
    railing: { include: true, type: 'wood' },
    stairs: { include: true, widthFt: 4, hasLanding: false, risers: 4 },
    fastenerType: 'face_screws',
    isDIY: false,
    regionIndex: 1.0,
    contingencyPct: 10,
    currencySymbol: '$',
  };

  it('calculates 12x12 joist count with 16" o.c. spacing correctly (hand verified)', () => {
    // Hand calculation:
    // Deck length along ledger = 12 ft = 144 inches.
    // Joists in section = ceil(144 / 16) + 1 = 9 + 1 = 10 joists.
    // Plus 2 rim joists (outer band joists) = 12 joists.
    const res = calculateDeckCost(base12x12);
    expect(res.framing.joistCount).toBe(12);
  });

  it('calculates 12 ft width row count with 5.5" board and 3/16" gap', () => {
    // Hand calculation:
    // Board pitch = (5.5 + 0.1875) / 12 = 5.6875 / 12 = 0.473958 ft
    // Rows = ceil(12 / 0.473958) = ceil(25.3187) = 26 rows.
    const res = calculateDeckCost(base12x12);
    expect(res.decking.rows).toBe(26);
  });

  it('diagonal pattern increases waste and board count compared to straight', () => {
    const straightRes = calculateDeckCost({ ...base12x12, pattern: 'straight', wastePct: undefined });
    const diagRes = calculateDeckCost({ ...base12x12, pattern: 'diagonal', wastePct: undefined });

    expect(diagRes.decking.wastePct).toBe(15);
    expect(straightRes.decking.wastePct).toBe(10);
    expect(diagRes.decking.totalBoards).toBeGreaterThan(straightRes.decking.totalBoards);
  });

  it('picture frame adds perimeter boards based on exposed edges', () => {
    const withoutPf = calculateDeckCost({ ...base12x12, pictureFrame: false });
    const withPf = calculateDeckCost({ ...base12x12, pictureFrame: true });

    // Exposed perimeter for 12x12 attached along one 12' length = 2*(12+12) - 12 = 36 ft.
    // Boards of 16 ft needed for perimeter = ceil(36 / 16) = 3 boards.
    expect(withPf.decking.pictureFrameBoards).toBe(3);
    expect(withPf.decking.totalBoards).toBeGreaterThan(withoutPf.decking.totalBoards);
  });

  it('calculates footing concrete matching cylinder volume and QUIKRETE 80 lb bags', () => {
    // 12x12 attached deck:
    // Beams: 1 row. Beam length = 12 ft. Posts per beam = ceil(12 / 8) + 1 = 2 + 1 = 3 posts.
    // Footings = 3 footings.
    // Diameter = 12" = 1 ft. Radius = 0.5 ft. Depth = 42" = 3.5 ft.
    // Vol per footing = pi * (0.5)^2 * 3.5 = 2.7489 ft3.
    // Total 3 footings = 8.2467 ft3 -> in yd3 = 8.2467 / 27 = ~0.31 yd3.
    // Bags (80 lb @ 0.60 ft3 yield) = ceil(8.2467 / 0.60) = 14 bags.
    const res = calculateDeckCost(base12x12);
    expect(res.framing.footingCount).toBe(3);
    expect(res.framing.concreteVolumeCuYd).toBeCloseTo(0.31, 1);
    expect(res.framing.concreteBags80lb).toBe(14);
  });

  it('railing lf accurately excludes house ledger side and stair opening', () => {
    // 12x12 perimeter = 48 lf. House side = 12 lf. Exposed = 36 lf.
    // Stair opening = 4 lf. Railing length = 36 - 4 = 32 lf.
    const res = calculateDeckCost(base12x12);
    expect(res.exposedPerimeterLf).toBe(36);
    expect(res.railing.lengthLf).toBe(32);
  });

  it('resurface mode zeros framing/footings and includes board removal demolition', () => {
    const resurfaceInput: DeckCostInput = {
      ...base12x12,
      mode: 'resurface',
    };
    const res = calculateDeckCost(resurfaceInput);

    expect(res.framing.joistCount).toBe(0);
    expect(res.framing.footingCount).toBe(0);
    expect(res.framing.concreteBags80lb).toBe(0);

    const demoLine = res.lineItems.find((l) => l.category === 'demo');
    expect(demoLine).toBeDefined();
    expect(demoLine?.totalCost).toBeGreaterThan(0);
  });

  it('replace mode includes full demolition tear-out and full framing', () => {
    const replaceInput: DeckCostInput = {
      ...base12x12,
      mode: 'replace',
    };
    const res = calculateDeckCost(replaceInput);

    expect(res.framing.joistCount).toBe(12);
    expect(res.framing.footingCount).toBe(3);
    const demoLine = res.lineItems.find((l) => l.category === 'demo');
    expect(demoLine).toBeDefined();
    expect(demoLine?.description).toContain('tear-out');
  });

  it('height band multiplier scales labor only and leaves material costs unchanged', () => {
    const groundRes = calculateDeckCost({ ...base12x12, heightBand: 'ground' }); // 1.0x
    const elevatedRes = calculateDeckCost({ ...base12x12, heightBand: 'elevated' }); // 1.45x

    expect(elevatedRes.materialsTotal).toBe(groundRes.materialsTotal);
    expect(elevatedRes.laborTotal).toBeGreaterThan(groundRes.laborTotal);
  });

  it('diy toggle zeroes contractor labor and shows substantial savings', () => {
    const proRes = calculateDeckCost({ ...base12x12, isDIY: false });
    const diyRes = calculateDeckCost({ ...base12x12, isDIY: true });

    expect(diyRes.laborTotal).toBe(0);
    expect(diyRes.grandTotal).toBeLessThan(proRes.grandTotal);
    expect(diyRes.diySavings).toBeGreaterThan(1500);
  });

  it('handles empty or zero dimensions safely without NaN', () => {
    const emptyInput: DeckCostInput = {
      ...base12x12,
      sections: [{ name: 'Zero', lengthFt: 0, widthFt: 0, isAttached: true, houseEdge: 'none' }],
    };
    const res = calculateDeckCost(emptyInput);

    expect(Number.isFinite(res.grandTotal)).toBe(true);
    expect(res.totalAreaSqFt).toBe(0);
    expect(res.costPerSqFt).toBe(0);
    expect(isNaN(res.grandTotal)).toBe(false);
  });

  it('generates valid deck size benchmarks table', () => {
    const table = deckSizeTable('composite_basic');
    expect(table.length).toBe(6);
    expect(table[0].dimensions).toBe('10 × 10');
    expect(table[0].areaSqFt).toBe(100);
    expect(table[0].low).toBeLessThan(table[0].typical);
    expect(table[0].typical).toBeLessThan(table[0].high);
  });

  it('generates multi-material lifetime cost comparison', () => {
    const comp = compareMaterials(base12x12);
    expect(comp.length).toBe(6);

    const pt = comp.find((c) => c.id === 'pt_pine')!;
    const compBasic = comp.find((c) => c.id === 'composite_basic')!;

    // PT Pine has lower upfront cost than composite
    expect(pt.upfrontCost).toBeLessThan(compBasic.upfrontCost);
    // PT Pine has higher annual maintenance cost than composite
    expect(pt.annualMaintenance).toBeGreaterThan(compBasic.annualMaintenance);
  });

  it('evaluates contractor quotes accurately', () => {
    const res = calculateDeckCost(base12x12);

    const lowCheck = checkQuote(res.lowEstimate * 0.7, res);
    expect(lowCheck.status).toBe('low');

    const fairCheck = checkQuote(res.grandTotal, res);
    expect(fairCheck.status).toBe('fair');

    const highCheck = checkQuote(res.highEstimate * 1.5, res);
    expect(highCheck.status).toBe('very_high');
  });

  it('generates complete bill of materials with all expected categories', () => {
    const res = calculateDeckCost(base12x12);
    const categories = new Set(res.bom.map((b) => b.category));

    expect(categories.has('decking')).toBe(true);
    expect(categories.has('framing')).toBe(true);
    expect(categories.has('hardware')).toBe(true);
    expect(categories.has('concrete')).toBe(true);
    expect(categories.has('railing')).toBe(true);
    expect(categories.has('stairs')).toBe(true);
  });
});
