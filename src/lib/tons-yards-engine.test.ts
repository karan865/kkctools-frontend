import { describe, it, expect } from 'vitest';
import { convert } from './tons-yards-engine';

describe('Tons to Cubic Yards Engine (Tool #15)', () => {
  it('T1 default: 12 short tons crushed stone', () => {
    // 12 tons crushed stone (2800 lb/yd3):
    // lbs = 24000
    // cy = 24000 / 2800 = 8.5714 -> 8.57 cy
    // cf = 8.5714 * 27 = 231.428 -> 231.4 cf
    // m3 = 8.5714 * 0.764555 = 6.553 -> 6.55 m3
    // tonnes = 24000 / 2204.62 = 10.886 -> 10.89 tonnes
    // bags = 24000 / 50 = 480 bags
    // At $60/ton: $720.00
    const res = convert({
      direction: 'tons-to-yards',
      quantity: 12,
      materialId: 'crushed_stone',
      priceMode: 'ton',
      price: 60,
    });

    expect(res.orderLbs).toBe(24000);
    expect(res.orderCy).toBe(8.57);
    expect(res.orderCf).toBe(231.4);
    expect(res.orderM3).toBe(6.55);
    expect(res.orderMetricTonnes).toBe(10.89);
    expect(res.bags50Lb).toBe(480);
    expect(res.grandTotalCost).toBe(720.0);
  });

  it('T2: 14 tons crushed stone = 10.00 cy ; 14 tons #57 limestone = 10.37 cy', () => {
    // Crushed stone: 14 * 2000 = 28000 / 2800 = 10.00 cy
    const res1 = convert({
      direction: 'tons-to-yards',
      quantity: 14,
      materialId: 'crushed_stone',
    });
    expect(res1.orderCy).toBe(10.0);

    // #57 limestone: 14 * 2000 = 28000 / 2700 = 10.3703 -> 10.37 cy
    const res2 = convert({
      direction: 'tons-to-yards',
      quantity: 14,
      materialId: 'limestone_57',
    });
    expect(res2.orderCy).toBe(10.37);
  });

  it('T3 B: 8.5 cy topsoil = 9.35 tons = 18,700 lb', () => {
    // Topsoil: 2200 lb/yd3. 8.5 cy * 2200 = 18,700 lb.
    // 18700 / 2000 = 9.35 tons.
    const res = convert({
      direction: 'yards-to-tons',
      quantity: 8.5,
      materialId: 'topsoil',
    });

    expect(res.orderLbs).toBe(18700);
    expect(res.orderShortTons).toBe(9.35);
  });

  it('T4 B: 10 cy crushed stone, 10% buffer: base 14.00 tons, order 15.40 tons', () => {
    // 10 cy * 2800 = 28,000 lb = 14.00 tons base.
    // 10% buffer: 14.00 * 1.10 = 15.40 tons.
    const res = convert({
      direction: 'yards-to-tons',
      quantity: 10,
      materialId: 'crushed_stone',
      bufferPct: 10,
    });

    expect(res.baseShortTons).toBe(14.0);
    expect(res.orderShortTons).toBe(15.4);
  });

  it('T5: 10 metric tonnes crushed stone: 22,046 lb, 7.87 cy, 11.02 short tons', () => {
    // 10 * 2204.62 = 22,046.2 lb -> round to 22,046 lb.
    // cy = 22046.2 / 2800 = 7.8736 -> 7.87 cy.
    // short tons = 22046.2 / 2000 = 11.0231 -> 11.02 short tons.
    const res = convert({
      direction: 'tons-to-yards',
      quantity: 10,
      weightUnit: 'metric-tonne',
      materialId: 'crushed_stone',
    });

    expect(res.orderLbs).toBe(22046);
    expect(res.orderCy).toBe(7.87);
    expect(res.orderShortTons).toBe(11.02);
  });

  it('T6: 1 ton crushed stone = 0.71 cy ; 20 tons = 14.29 cy', () => {
    const res1 = convert({
      direction: 'tons-to-yards',
      quantity: 1,
      materialId: 'crushed_stone',
    });
    expect(res1.orderCy).toBe(0.71);

    const res2 = convert({
      direction: 'tons-to-yards',
      quantity: 20,
      materialId: 'crushed_stone',
    });
    expect(res2.orderCy).toBe(14.29);
  });

  it('T7 custom 100 lb/ft3 (= 2700 lb/yd3): 10 tons = 7.41 cy', () => {
    // 100 * 27 = 2700 lb/yd3.
    // 10 tons = 20,000 lbs. 20000 / 2700 = 7.4074 -> 7.41 cy.
    const res = convert({
      direction: 'tons-to-yards',
      quantity: 10,
      materialId: 'custom',
      customDensityValue: 100,
      customDensityUnit: 'lb-per-cf',
    });

    expect(res.orderCy).toBe(7.41);
  });

  it('T8 price mode per cy: $84/yd3 on crushed stone = $60.00/ton ; 12 tons = $720.00', () => {
    // Crushed stone density = 2800 lb/yd3 = 1.40 tons/yd3.
    // $84 / 1.40 = $60.00 per ton.
    // 12 tons * $60 = $720.00.
    const res = convert({
      direction: 'tons-to-yards',
      quantity: 12,
      materialId: 'crushed_stone',
      priceMode: 'cy',
      price: 84,
    });

    expect(res.pricePerTon).toBe(60.0);
    expect(res.grandTotalCost).toBe(720.0);
  });

  it('handles formatted strings with commas like "1,200"', () => {
    const res = convert({
      direction: 'tons-to-yards',
      quantity: '1,200',
      materialId: 'crushed_stone',
    });

    expect(res.orderShortTons).toBe(1200);
    expect(res.orderLbs).toBe(2400000);
  });
});
