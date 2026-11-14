import { describe, expect, it } from 'vitest';
import {
  GATE_PRICES,
  MATERIALS,
  calculateFence,
  defaultFenceInput,
  holeDepthIn,
  holeDiameterIn,
  materialById,
  straightFence,
} from './fence-cost-engine';

const qty = (r: ReturnType<typeof calculateFence>, label: string) => r.materials.find((m) => m.label === label)?.qty ?? 0;

describe('posts and sections', () => {
  it('100 ft straight wood privacy, 8 ft spacing', () => {
    const r = straightFence('woodPrivacy', 100);
    expect(r.sections).toBe(13);
    expect(r.posts).toBe(14);
    expect(r.terminalPosts).toBe(2);
    expect(r.linePosts).toBe(12);
    expect(qty(r, 'Pickets')).toBe(219);
    expect(qty(r, 'Rails')).toBe(39);
    expect(r.postLengthFt).toBe(8);
  });
  it('default backyard: 3 connected runs, one walk gate', () => {
    const r = calculateFence(defaultFenceInput());
    expect(r.totalLengthFt).toBe(160);
    expect(r.gateOpeningFt).toBe(4);
    expect(r.fenceLengthFt).toBe(156);
    expect(r.sections).toBe(21);
    expect(r.sharedPosts).toBe(2);
    expect(r.posts).toBe(23);
    expect(r.terminalPosts).toBe(6);
    expect(r.linePosts).toBe(17);
    expect(qty(r, 'Pickets')).toBe(341);
    expect(qty(r, 'Rails')).toBe(63);
    expect(qty(r, 'Walk gates')).toBe(1);
  });
  it('closed loop shares one more corner', () => {
    const run = { lengthFt: 25, walkGates: 0, doubleGates: 0 };
    const r = calculateFence(defaultFenceInput('woodPrivacy', { runs: [run, run, run, run], closed: true }));
    expect(r.posts).toBe(16);
    expect(r.terminalPosts).toBe(4);
    const open = calculateFence(defaultFenceInput('woodPrivacy', { runs: [run, run, run, run] }));
    expect(open.posts).toBe(17);
  });
  it('separate runs do not share posts', () => {
    const r = calculateFence(defaultFenceInput('woodPrivacy', { connected: false }));
    expect(r.posts).toBe(25);
  });
  it('a double gate splits the run', () => {
    const r = calculateFence(defaultFenceInput('woodPrivacy', { runs: [{ lengthFt: 50, walkGates: 0, doubleGates: 1 }] }));
    expect(r.fenceLengthFt).toBe(40);
    expect(r.sections).toBe(6);
    expect(r.posts).toBe(8);
  });
});

describe('chain link materials', () => {
  const r = straightFence('chainLink', 100);
  it('posts, fabric and top rail', () => {
    expect(r.posts).toBe(11);
    expect(qty(r, 'Terminal posts (ends, corners, gates)')).toBe(2);
    expect(qty(r, 'Line posts')).toBe(9);
    expect(qty(r, 'Chain link fabric')).toBe(100);
    expect(r.materials.find((m) => m.label === 'Chain link fabric')!.note).toBe('2 rolls of 50 ft');
    expect(qty(r, 'Top rail')).toBe(10);
  });
  it('concrete for round posts', () => {
    expect(r.concretePerPostFt3).toBeCloseTo((Math.PI * 3.5 ** 2 * 24 - Math.PI * 1.1875 ** 2 * 24) / 1728, 6);
    expect(r.bags).toBe(9);
  });
});

describe('concrete per post', () => {
  it('Quikrete hole rule', () => {
    expect(holeDiameterIn(3.5)).toBe(10.5);
    expect(holeDiameterIn(2.375)).toBe(7);
    expect(holeDepthIn(6)).toBe(24);
    expect(holeDepthIn(8)).toBe(32);
    expect(holeDepthIn(4)).toBe(24);
  });
  it('square wood posts', () => {
    const r = straightFence('woodPrivacy', 100);
    expect(r.concretePerPostFt3).toBeCloseTo((Math.PI * 5.25 ** 2 * 24 - 3.5 * 3.5 * 24) / 1728, 6);
    expect(r.bags).toBe(25);
    expect(r.concreteCost).toBe(166.25);
  });
});

describe('cost', () => {
  it('100 ft wood privacy', () => {
    const r = straightFence('woodPrivacy', 100);
    expect(r.fenceCost).toBe(3750);
    expect(r.total).toBe(3750);
    expect(r.perFt).toBe(37.5);
    expect(r.materialsCost).toBe(1875);
    expect(r.labourCost).toBe(1875);
    expect(r.diyTotal).toBe(1875);
    expect(r.low).toBe(2500);
    expect(r.high).toBe(5000);
  });
  it('default backyard', () => {
    const r = calculateFence(defaultFenceInput());
    expect(r.fenceCost).toBe(5850);
    expect(r.gatesCost).toBe(450);
    expect(r.total).toBe(6300);
    expect(r.perFt).toBeCloseTo(39.375, 6);
    expect(r.low).toBe(4350);
    expect(r.high).toBe(8250);
  });
  it('removal, terrain and permit', () => {
    const r = calculateFence(defaultFenceInput('woodPrivacy', { removal: true, terrainPct: 20, permit: 150 }));
    expect(r.removalCost).toBe(640);
    expect(r.fenceCost).toBe(7020);
    expect(r.total).toBe(7020 + 450 + 640 + 150);
    expect(r.labourCost).toBeCloseTo((7020 + 450) / 2 + 640, 6);
    expect(r.diyTotal).toBeCloseTo((7020 + 450) / 2 + 150, 6);
  });
  it('chain link gates use chain link prices', () => {
    const inp = defaultFenceInput('chainLink');
    expect(inp.walkGatePrice).toBe(GATE_PRICES.chain.walk);
    expect(calculateFence(inp).gatesCost).toBe(262.5);
  });
  it('empty input', () => {
    const r = calculateFence(defaultFenceInput('woodPrivacy', { runs: [{ lengthFt: 0, walkGates: 0, doubleGates: 0 }] }));
    expect(r.total).toBe(0);
    expect(r.posts).toBe(0);
    expect(r.perFt).toBe(0);
  });
});

describe('material data', () => {
  it('default prices are the midpoints of the published ranges', () => {
    for (const m of MATERIALS) expect(m.pricePerFt).toBeCloseTo((m.range[0] + m.range[1]) / 2, 6);
    for (const g of Object.values(GATE_PRICES)) {
      expect(g.walk).toBeCloseTo((g.walkRange[0] + g.walkRange[1]) / 2, 6);
      expect(g.double).toBeCloseTo((g.doubleRange[0] + g.doubleRange[1]) / 2, 6);
    }
    expect(materialById('x').id).toBe('woodPrivacy');
  });
});
