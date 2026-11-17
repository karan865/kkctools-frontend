import { describe, it, expect } from 'vitest';
import {
  priceFromMarkup,
  markupFromPrice,
  costFromPrice,
  costFromPriceAndProfit,
  priceFromCostAndProfit,
  priceFromMargin,
  marginFromPrice,
  marginFromMarkup,
  markupFromMargin,
  multiplier,
  calculateLandedCost,
  addTax,
  stripTax,
  roundPriceEnding,
  calculatePriceChain,
  calculateProductList,
  parsePastedSpreadsheet,
  generateMarkupMarginTable,
  formatCurrency,
  formatPercent,
} from './pricing-engine';

describe('Pricing Engine — Core Formulas & Relationships', () => {
  it('solves price from cost and markup percentage', () => {
    // Cost $40, 50% markup -> Selling price $60
    expect(priceFromMarkup(40, 50)).toBe(60);
    // Cost $100, 100% markup (keystone) -> $200
    expect(priceFromMarkup(100, 100)).toBe(200);
    // Cost $50, 0% markup -> $50
    expect(priceFromMarkup(50, 0)).toBe(50);
  });

  it('solves markup from cost and selling price', () => {
    // Cost $40, Price $60 -> Markup 50%
    expect(markupFromPrice(40, 60)).toBe(50);
    // Cost $100, Price $250 -> Markup 150%
    expect(markupFromPrice(100, 250)).toBe(150);
    // Zero or negative cost returns null
    expect(markupFromPrice(0, 100)).toBeNull();
    expect(markupFromPrice(-10, 100)).toBeNull();
  });

  it('solves cost from selling price and markup percentage', () => {
    // Price $60, Markup 50% -> Cost $40
    expect(costFromPrice(60, 50)).toBe(40);
    // Price $200, Markup 100% -> Cost $100
    expect(costFromPrice(200, 100)).toBe(100);
    // Boundary: markup <= -100 returns null
    expect(costFromPrice(100, -100)).toBeNull();
    expect(costFromPrice(100, -120)).toBeNull();
  });

  it('solves price and cost with absolute profit', () => {
    expect(priceFromCostAndProfit(40, 20)).toBe(60);
    expect(costFromPriceAndProfit(60, 20)).toBe(40);
  });

  it('converts between markup and gross margin accurately', () => {
    // 50% markup = 33.3333333333% margin
    const m50 = marginFromMarkup(50)!;
    expect(Number(m50.toFixed(2))).toBe(33.33);

    // 100% markup = 50% margin
    expect(marginFromMarkup(100)).toBe(50);

    // 50% margin = 100% markup
    expect(markupFromMargin(50)).toBe(100);

    // 33.3333333333% margin = 50% markup
    expect(Math.round(markupFromMargin(33.3333333333)!)).toBe(50);

    // Margin >= 100% is mathematically impossible on positive cost
    expect(markupFromMargin(100)).toBeNull();
    expect(markupFromMargin(105)).toBeNull();
  });

  it('solves price from target gross margin', () => {
    // Cost $40 with target 50% margin -> Selling price $80
    expect(priceFromMargin(40, 50)).toBe(80);
    // Cost $60 with target 40% margin -> Price $100
    expect(priceFromMargin(60, 40)).toBe(100);
    // Margin >= 100% returns null
    expect(priceFromMargin(50, 100)).toBeNull();
    expect(priceFromMargin(50, 110)).toBeNull();
  });

  it('calculates gross margin from cost and price', () => {
    // Cost $40, Price $60 -> Margin 33.33%
    const g = marginFromPrice(40, 60)!;
    expect(Number(g.toFixed(2))).toBe(33.33);
    // Cost $50, Price $100 -> Margin 50%
    expect(marginFromPrice(50, 100)).toBe(50);
    // Price <= 0 returns null
    expect(marginFromPrice(50, 0)).toBeNull();
    expect(marginFromPrice(50, -10)).toBeNull();
  });

  it('calculates multiplier (e.g. Keystone = 2.0x)', () => {
    expect(multiplier(50, 100)).toBe(2);
    expect(multiplier(40, 60)).toBe(1.5);
    expect(multiplier(0, 50)).toBeNull();
  });
});

describe('Pricing Engine — Landed Cost & Platform Fees', () => {
  it('sums landed cost items accurately', () => {
    const landed = calculateLandedCost({
      baseCost: 20,
      items: [
        { name: 'Shipping', amount: 5 },
        { name: 'Packaging', amount: 2.5 },
        { name: 'Import Tariff', amount: 2.5 },
      ],
      feePercent: 0,
    });
    expect(landed.subtotalCost).toBe(30);
  });

  it('calculates required price to offset marketplace percentage fee', () => {
    // Landed cost $40, Target markup 50% -> normal price is $60.
    // If marketplace takes 10% of selling price:
    // price * (1 - 0.10) = 40 * 1.5 = 60 => price = 60 / 0.90 = $66.666666...
    const landed = calculateLandedCost({
      baseCost: 40,
      feePercent: 10,
    });
    const priceWithFee = landed.requiredPriceMarkup(50)!;
    expect(Number(priceWithFee.toFixed(2))).toBe(66.67);

    // Target margin with fee:
    // price = cost / (1 - margin - fee)
    // Cost $50, target margin 30%, fee 10% => price = 50 / (1 - 0.3 - 0.1) = 50 / 0.6 = $83.3333...
    const landed2 = calculateLandedCost({
      baseCost: 50,
      feePercent: 10,
    });
    const priceMargin = landed2.requiredPriceMargin(30)!;
    expect(Number(priceMargin.toFixed(2))).toBe(83.33);

    // Boundary: fee + margin >= 100% returns null
    expect(landed2.requiredPriceMargin(90)).toBeNull();
  });
});

describe('Pricing Engine — Tax Calculations', () => {
  it('adds tax ex-tax to inc-tax and strips tax inc-tax to ex-tax', () => {
    // UK VAT 20%
    const priceEx = 50;
    const priceInc = addTax(priceEx, 20);
    expect(priceInc).toBe(60);
    expect(stripTax(priceInc, 20)).toBe(50);

    // AU GST 10%
    const auInc = addTax(100, 10);
    expect(auInc).toBe(110);
    expect(stripTax(auInc, 10)).toBe(100);
  });
});

describe('Pricing Engine — Psychological Price Endings', () => {
  it('rounds to .99 ending correctly', () => {
    // $59.20 -> $59.99
    const res = roundPriceEnding(59.2, '99', 40);
    expect(res.roundedPrice).toBe(59.99);
    // Cost $40, Price $59.99 -> markup ~49.975%
    expect(Number(res.actualMarkupPercent!.toFixed(2))).toBe(49.98);
  });

  it('rounds to .95 ending correctly', () => {
    // $19.10 -> $19.95
    const res = roundPriceEnding(19.1, '95', 10);
    expect(res.roundedPrice).toBe(19.95);
  });

  it('never drops below cost when rounding down', () => {
    // Cost $19.90, price calculated as $20.01 with .95 ending
    // $19.95 is > cost $19.90 -> ok
    const res = roundPriceEnding(20.01, '95', 19.9);
    expect(res.roundedPrice).toBe(20.95);
    expect(res.roundedPrice).toBeGreaterThanOrEqual(19.9);
  });

  it('rounds to whole dollar and nearest 5', () => {
    expect(roundPriceEnding(42.3, 'whole', 20).roundedPrice).toBe(42);
    expect(roundPriceEnding(42.7, 'whole', 20).roundedPrice).toBe(43);
    expect(roundPriceEnding(41.2, 'up5', 20).roundedPrice).toBe(45);
    expect(roundPriceEnding(45.0, 'up5', 20).roundedPrice).toBe(45);
  });
});

describe('Pricing Engine — 3-Tier Sequential Price Chain', () => {
  it('computes Maker -> Wholesale -> Retail chain with Keystone', () => {
    // Maker cost $10
    // Maker markup 100% -> Wholesaler buys at $20
    // Wholesaler markup 100% -> Retailer buys at $40
    // Retailer markup 100% -> Consumer buys at $80
    const tiers = [
      { role: 'Manufacturer', markupPercent: 100 },
      { role: 'Wholesaler / Distributor', markupPercent: 100 },
      { role: 'Retailer', markupPercent: 100 },
    ];
    const chain = calculatePriceChain(10, tiers);

    expect(chain.rows).toHaveLength(3);
    expect(chain.rows[0].sellPrice).toBe(20);
    expect(chain.rows[1].sellPrice).toBe(40);
    expect(chain.rows[2].sellPrice).toBe(80);
    expect(chain.consumerPrice).toBe(80);
    expect(chain.totalMultiplier).toBe(8); // $80 / $10 = 8x
    expect(chain.totalSystemProfit).toBe(70); // 10 + 20 + 40 = 70
  });
});

describe('Pricing Engine — Spreadsheet Parsing & Batch Calculation', () => {
  it('parses tab-separated product copy-paste', () => {
    const rawTSV = `
Cotton T-Shirt\t$12.50\t60%
Denim Jacket\t$45.00\t80%
Wool Beanie\t$8.00
    `.trim();

    const parsed = parsePastedSpreadsheet(rawTSV);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].name).toBe('Cotton T-Shirt');
    expect(parsed[0].cost).toBe(12.5);
    expect(parsed[0].markupPercent).toBe(60);

    expect(parsed[2].name).toBe('Wool Beanie');
    expect(parsed[2].cost).toBe(8.0);
    expect(parsed[2].markupPercent).toBeUndefined();

    // Now compute product list with default 50% markup for row 3
    const results = calculateProductList(parsed, 50);
    expect(results).toHaveLength(3);
    // T-shirt: 12.50 * 1.6 = 20.00
    expect(results[0].price).toBe(20);
    expect(results[0].profit).toBe(7.5);
    // Beanie: 8.00 * 1.5 = 12.00
    expect(results[2].price).toBe(12);
    expect(results[2].profit).toBe(4);
  });

  it('parses comma-separated values', () => {
    const rawCSV = `
Item A, 25.00, 40
Item B, 100.00, 100
    `.trim();
    const parsed = parsePastedSpreadsheet(rawCSV);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].cost).toBe(25);
    expect(parsed[0].markupPercent).toBe(40);
  });
});

describe('Pricing Engine — Reference Table & Formatters', () => {
  it('generates benchmark markup vs margin table', () => {
    const table = generateMarkupMarginTable(100);
    expect(table.length).toBeGreaterThan(10);
    const row50 = table.find((r) => r.markupPercent === 50);
    expect(row50).toBeDefined();
    expect(row50?.examplePrice).toBe(150);
    expect(Number(row50?.marginPercent.toFixed(2))).toBe(33.33);

    const row100 = table.find((r) => r.markupPercent === 100);
    expect(row100).toBeDefined();
    expect(row100?.examplePrice).toBe(200);
    expect(row100?.marginPercent).toBe(50);
    expect(row100?.multiplier).toBe(2);
  });

  it('formats currency and percentages safely', () => {
    expect(formatCurrency(49.99)).toBe('$49.99');
    expect(formatCurrency(-15.5)).toBe('−$15.50');
    expect(formatPercent(33.33333)).toBe('33.33%');
    expect(formatPercent(null)).toBe('0.00%');
  });
});
