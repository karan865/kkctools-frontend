import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OPTIONS,
  DEFAULT_RATES,
  PROJECTS,
  PSI_PRICES,
  PUBLISHED_INSTALLED,
  YD3_PER_M3,
  concretePerSqFt,
  estimateSlabCost,
  perM2ToPerSqFt,
  perM3ToPerYd3,
  perSqFtToPerM2,
  perTonToPerTonne,
  perTonneToPerTon,
  perYd3ToPerM3,
  psiPrice,
  quickEstimate,
  roundUpTo,
  slabVolumeYd3,
  sqFtPerYd3,
} from './slab-cost-engine';

const line = (r: ReturnType<typeof estimateSlabCost>, id: string) => r.lines.find((l) => l.id === id)?.amount ?? 0;

describe('volume and ordering', () => {
  it('slab volume = L × W × T ÷ 324', () => {
    expect(slabVolumeYd3({ lengthFt: 10, widthFt: 10, thicknessIn: 4, qty: 1 })).toBeCloseTo(1.2346, 4);
    expect(slabVolumeYd3({ lengthFt: 20, widthFt: 20, thicknessIn: 4, qty: 1 })).toBeCloseTo(400 * 4 / 324, 6);
    expect(slabVolumeYd3({ lengthFt: 10, widthFt: 10, thicknessIn: 4, qty: 3 })).toBeCloseTo(3.7037, 4);
  });
  it('rounds the order up to the next quarter yard', () => {
    expect(roundUpTo(5.432, 0.25)).toBe(5.5);
    expect(roundUpTo(5.5, 0.25)).toBe(5.5);
    expect(roundUpTo(0, 0.25)).toBe(0);
  });
  it('one cubic yard covers 81 ft² at 4 in', () => {
    expect(sqFtPerYd3(4)).toBe(81);
    expect(sqFtPerYd3(6)).toBe(54);
  });
  it('concrete-only cost per ft²', () => {
    expect(concretePerSqFt(4, 162)).toBeCloseTo(2, 6);
  });
});

describe('20 × 20 ft, 4 in slab with default options', () => {
  const r = quickEstimate(20, 20, 4);
  it('quantities', () => {
    expect(r.areaSqFt).toBe(400);
    expect(r.netYd3).toBeCloseTo(4.938, 3);
    expect(r.withWasteYd3).toBeCloseTo(5.432, 3);
    expect(r.orderYd3).toBe(5.5);
    expect(r.trucks).toBe(1);
    expect(r.shortLoad).toBe(true);
    expect(r.baseTons).toBeCloseTo(7.9506, 3);
    expect(r.bags).toBe(245);
  });
  it('line items', () => {
    expect(line(r, 'concrete')).toBe(918.5);
    expect(line(r, 'shortLoad')).toBe(236.5);
    expect(line(r, 'delivery')).toBe(0);
    expect(line(r, 'base')).toBe(318.02);
    expect(line(r, 'mesh')).toBe(140);
    expect(line(r, 'forms')).toBe(75);
    expect(line(r, 'labour')).toBe(1400);
    expect(r.lines.some((l) => l.id === 'pump' || l.id === 'vapor' || l.id === 'rebar')).toBe(false);
  });
  it('totals', () => {
    expect(r.total).toBe(3088.02);
    expect(r.perSqFt).toBeCloseTo(7.72, 2);
    expect(r.perOrderedYd3).toBeCloseTo(3088.02 / 5.5, 2);
    expect(r.concreteOnly).toBe(1155);
    expect(r.labourTotal).toBe(1400);
  });
  it('sits inside the 2026 published installed range', () => {
    expect(r.check).toBe('within');
    expect(r.perSqFt).toBeGreaterThan(PUBLISHED_INSTALLED.low);
    expect(r.perSqFt).toBeLessThan(PUBLISHED_INSTALLED.high);
  });
  it('compares DIY bags, DIY ready-mix and a contractor', () => {
    const [bags, rm, pro] = r.compare;
    expect(bags.total).toBe(2162.27); // 245 × 6.65 + 533.02 prep
    expect(rm.total).toBe(1688.02); // 918.50 + 236.50 + 533.02
    expect(pro.total).toBe(r.total);
    expect(rm.total).toBeLessThan(bags.total);
  });
});

describe('10 × 10 ft, 4 in slab', () => {
  const r = quickEstimate(10, 10, 4);
  it('orders 1.5 yd³ and totals correctly', () => {
    expect(r.orderYd3).toBe(1.5);
    expect(line(r, 'concrete')).toBe(250.5);
    expect(line(r, 'shortLoad')).toBe(64.5);
    expect(line(r, 'base')).toBe(79.51);
    expect(r.total).toBe(854.51);
  });
  it('bags', () => {
    expect(r.bags).toBe(62);
    expect(r.compare[0].total).toBe(601.81);
  });
});

describe('fees and options', () => {
  it('no short-load fee at or above the threshold', () => {
    const r = quickEstimate(30, 40, 6); // 22.2 yd³ → 24.5 ordered
    expect(r.orderYd3).toBe(24.5);
    expect(r.shortLoad).toBe(false);
    expect(line(r, 'shortLoad')).toBe(0);
    expect(r.trucks).toBe(3);
  });
  it('flat short-load fee', () => {
    const r = quickEstimate(10, 10, 4, {}, { shortLoadMode: 'flat', shortLoadAmount: 150 });
    expect(line(r, 'shortLoad')).toBe(150);
  });
  it('delivery per yard', () => {
    expect(line(quickEstimate(10, 10, 4, {}, { deliveryPerYd3: 19 }), 'delivery')).toBe(28.5);
  });
  it('pump minimums', () => {
    expect(line(quickEstimate(20, 20, 4, { pump: 'line' }), 'pump')).toBe(500);
    expect(line(quickEstimate(20, 20, 4, { pump: 'boom' }), 'pump')).toBe(900);
  });
  it('reinforcement, vapour barrier, finishes, sealer, removal', () => {
    const r = quickEstimate(20, 20, 4, { reinforcement: 'rebar', vaporBarrier: true, finish: 'stamped', sealer: true, demolition: true });
    expect(line(r, 'rebar')).toBe(1000);
    expect(line(r, 'mesh')).toBe(0);
    expect(line(r, 'vapor')).toBe(200);
    expect(line(r, 'finish')).toBe(4800);
    expect(line(r, 'sealer')).toBe(600);
    expect(line(r, 'demo')).toBe(1600);
    expect(r.check).toBe('n/a');
    expect(line(quickEstimate(20, 20, 4, { finish: 'colored' }), 'finish')).toBe(2200);
  });
  it('no gravel base when depth is 0', () => {
    const r = quickEstimate(20, 20, 4, { baseDepthIn: 0 });
    expect(r.baseTons).toBe(0);
    expect(line(r, 'base')).toBe(0);
  });
  it('region factor, overhead and permit', () => {
    const base = quickEstimate(20, 20, 4);
    const r = quickEstimate(20, 20, 4, { regionFactor: 1.2, overheadPct: 10, permit: 150 });
    expect(r.regionAdj).toBeCloseTo(base.subtotal * 0.2, 2);
    expect(r.overhead).toBeCloseTo((base.subtotal * 1.2) * 0.1, 1);
    expect(r.permit).toBe(150);
    expect(r.total).toBeCloseTo(base.subtotal * 1.2 * 1.1 + 150, 1);
  });
  it('thickness changes the price (more concrete)', () => {
    expect(quickEstimate(20, 20, 6).total).toBeGreaterThan(quickEstimate(20, 20, 4).total);
  });
  it('several slabs add up and forms are per slab', () => {
    const r = estimateSlabCost(
      [
        { lengthFt: 10, widthFt: 10, thicknessIn: 4, qty: 2 },
        { lengthFt: 12, widthFt: 4, thicknessIn: 4, qty: 1 },
      ],
      DEFAULT_OPTIONS,
      DEFAULT_RATES,
    );
    expect(r.areaSqFt).toBe(248);
    expect(r.slabCount).toBe(3);
    expect(line(r, 'forms')).toBe(225);
  });
  it('empty or invalid input gives zero', () => {
    const r = estimateSlabCost([{ lengthFt: 0, widthFt: 10, thicknessIn: 4, qty: 1 }]);
    expect(r.total).toBe(0);
    expect(r.orderYd3).toBe(0);
    expect(r.bags).toBe(0);
    expect(r.check).toBe('n/a');
  });
});

describe('bags', () => {
  it('kilogram bags scale by weight from 80 lb = 0.60 ft³', () => {
    const r = quickEstimate(10, 10, 4, {}, { bagSize: 'kg25' });
    // 1.358 yd³ = 36.67 ft³; 25 kg yields 0.6 × 25 / 36.287 = 0.4134 ft³ → 89 bags
    expect(r.bags).toBe(89);
    expect(quickEstimate(10, 10, 4, {}, { bagSize: 'lb60' }).bags).toBe(82);
  });
});

describe('display units', () => {
  it('metric details use m³, m² and tonnes with the chosen symbol', () => {
    const r = estimateSlabCost([{ lengthFt: 20, widthFt: 20, thicknessIn: 4, qty: 1 }], DEFAULT_OPTIONS, DEFAULT_RATES, { metric: true, symbol: '€' });
    expect(r.lines.find((l) => l.id === 'concrete')!.detail).toMatch(/m³ × €\d/);
    expect(r.lines.find((l) => l.id === 'labour')!.detail).toMatch(/m² × €/);
    expect(r.lines.find((l) => l.id === 'base')!.detail).toMatch(/ t × €/);
  });
  it('price conversions round-trip', () => {
    expect(perM3ToPerYd3(perYd3ToPerM3(167))).toBeCloseTo(167, 9);
    expect(perM2ToPerSqFt(perSqFtToPerM2(3.5))).toBeCloseTo(3.5, 9);
    expect(perTonneToPerTon(perTonToPerTonne(40))).toBeCloseTo(40, 9);
    expect(perYd3ToPerM3(100)).toBeCloseTo(100 * YD3_PER_M3, 9);
  });
});

describe('published data', () => {
  it('PSI typical prices are the midpoints of the published ranges', () => {
    for (const p of PSI_PRICES) expect(Math.abs(p.typical - (p.low + p.high) / 2)).toBeLessThanOrEqual(0.5);
    expect(psiPrice(4000).typical).toBe(DEFAULT_RATES.concretePerYd3);
  });
  it('project presets are valid', () => {
    for (const p of PROJECTS) {
      expect(p.thicknessIn).toBeGreaterThanOrEqual(4);
      expect(PSI_PRICES.some((x) => x.psi === p.psi)).toBe(true);
    }
  });
});
