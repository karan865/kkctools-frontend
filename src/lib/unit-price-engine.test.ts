import { describe, it, expect } from 'vitest';
import {
  toBaseQuantity,
  fromBaseQuantity,
  applyDeal,
  compareUnitPrices,
  calculateShrinkflation,
  calculateSellerUnitCost,
} from './unit-price-engine';

describe('Unit Price Engine — Conversion Mathematics', () => {
  it('converts weight units accurately based on NIST standards', () => {
    // 16 oz = 1 lb = 453.59237 g
    const gFrom16Oz = toBaseQuantity(16, 'oz');
    const gFrom1Lb = toBaseQuantity(1, 'lb');
    expect(gFrom16Oz).toBe(453.59237);
    expect(gFrom1Lb).toBe(453.59237);

    // Round-trip back to oz
    const ozFromLb = fromBaseQuantity(gFrom1Lb, 'oz');
    expect(ozFromLb).toBe(16);
  });

  it('converts volume units accurately based on NIST standards', () => {
    // 1 US gallon = 128 US fl oz = 3785.411784 ml
    const mlFrom1Gal = toBaseQuantity(1, 'gal');
    const mlFrom128FlOz = toBaseQuantity(128, 'fl_oz');
    expect(mlFrom1Gal).toBe(3785.411784);
    expect(mlFrom128FlOz).toBe(3785.411784);

    // Round-trip back to fl oz
    const flOzFromGal = fromBaseQuantity(mlFrom1Gal, 'fl_oz');
    expect(flOzFromGal).toBe(128);
  });
});

describe('Unit Price Engine — Deal Pricing', () => {
  it('applies percentage off correctly', () => {
    // $10 with 20% off -> $8
    expect(applyDeal(10, { type: 'percent_off', value: 20 })).toBe(8);
  });

  it('applies amount off correctly', () => {
    // $6.50 with $1.50 off -> $5.00
    expect(applyDeal(6.5, { type: 'amount_off', value: 1.5 })).toBe(5);
  });

  it('applies Buy 1 Get 1 Free (BOGO) correctly', () => {
    // $6 item: buy 1 get 1 free -> effective price per unit is $3
    expect(applyDeal(6, { type: 'bogo', buyQty: 1, freeQty: 1 })).toBe(3);
    // Buy 2 Get 1 Free on $9 item -> 2 * $9 / 3 = $6 per item
    expect(applyDeal(9, { type: 'bogo', buyQty: 2, freeQty: 1 })).toBe(6);
  });

  it('applies Multi-buy bundle ("3 for $5") correctly', () => {
    // 3 for $5 -> effective price per unit is 5 / 3 = $1.666667
    const eff = applyDeal(2.5, { type: 'x_for_y', bundleQty: 3, bundlePrice: 5 });
    expect(Number(eff.toFixed(2))).toBe(1.67);
  });
});

describe('Unit Price Engine — Product Comparisons', () => {
  it('correctly compares 6 × 330 ml multi-pack vs 2 L bottle', () => {
    // Option A: 6-pack of 330 ml cans ($4.99) -> total 1980 ml -> $4.99 / 1.98 L = $2.5202/L
    // Option B: Single 2 L bottle ($2.49) -> total 2000 ml -> $2.49 / 2.00 L = $1.245/L
    const res = compareUnitPrices(
      [
        { id: '1', label: '6-pack 330ml', price: 4.99, packCount: 6, sizePerItem: 330, unit: 'ml' },
        { id: '2', label: '2L Bottle', price: 2.49, packCount: 1, sizePerItem: 2, unit: 'l' },
      ],
      'l'
    );

    expect(res.hasMismatchedGroups).toBe(false);
    expect(res.cheapestItem?.label).toBe('2L Bottle');
    expect(res.cheapestItem?.isCheapest).toBe(true);

    const bottle = res.items.find((it) => it.label === '2L Bottle')!;
    const multi = res.items.find((it) => it.label === '6-pack 330ml')!;

    expect(Number(bottle.unitPrice.toFixed(2))).toBe(1.25);
    expect(Number(multi.unitPrice.toFixed(2))).toBe(2.52);
    expect(multi.percentMoreThanCheapest).toBeGreaterThan(100);
  });

  it('flags mismatched unit groups (dry weight vs fluid volume) with a warning', () => {
    // Comparing 16 oz cereal (weight) with 16 fl oz milk (volume) is invalid
    const res = compareUnitPrices([
      { id: '1', price: 4.0, sizePerItem: 16, unit: 'oz' },
      { id: '2', price: 3.5, sizePerItem: 16, unit: 'fl_oz' },
    ]);

    expect(res.hasMismatchedGroups).toBe(true);
    expect(res.items).toHaveLength(0);
    expect(res.cheapestItem).toBeNull();
  });

  it('calculates quantity-to-buy packs and total spend', () => {
    // Need 64 oz of coffee:
    // Option A: 12 oz bag ($8.00) -> needs ceil(64 / 12) = 6 bags -> total $48.00
    // Option B: 32 oz bag ($18.00) -> needs ceil(64 / 32) = 2 bags -> total $36.00
    const res = compareUnitPrices(
      [
        { id: '1', label: '12 oz bag', price: 8.0, sizePerItem: 12, unit: 'oz' },
        { id: '2', label: '32 oz bag', price: 18.0, sizePerItem: 32, unit: 'oz' },
      ],
      'oz',
      64
    );

    const bag12 = res.items.find((it) => it.label === '12 oz bag')!;
    const bag32 = res.items.find((it) => it.label === '32 oz bag')!;

    expect(bag12.packsNeededForTarget).toBe(6);
    expect(bag12.totalCostForTarget).toBe(48);

    expect(bag32.packsNeededForTarget).toBe(2);
    expect(bag32.totalCostForTarget).toBe(36);
  });
});

describe('Unit Price Engine — Shrinkflation Math', () => {
  it('proves that a 10% size drop at same price equals an 11.11% unit price hike', () => {
    // Old: $10.00 for 10 oz ($1.00 / oz)
    // New: $10.00 for 9 oz ($1.1111 / oz)
    const res = calculateShrinkflation({
      oldPrice: 10,
      oldSize: 10,
      newPrice: 10,
      newSize: 9,
      unitLabel: 'oz',
    });

    expect(res.oldUnitPrice).toBe(1.0);
    expect(Number(res.newUnitPrice.toFixed(4))).toBe(1.1111);
    expect(res.sizeChangePercent).toBe(-10);
    expect(res.priceChangePercent).toBe(0);
    expect(Number(res.unitPriceIncreasePercent.toFixed(2))).toBe(11.11);
    expect(res.summarySentence).toContain('11.1% price increase');
  });
});

describe('Unit Price Engine — Seller Shelf Tagging', () => {
  it('computes statutory price per kg and per 100g for shelf labels', () => {
    // 500g package made for $4.00
    const res = calculateSellerUnitCost({
      batchTotalCost: 400,
      unitsProduced: 100, // $4.00 per unit
      packageSize: 500,
      packageUnit: 'g',
    });

    expect(res.costPerUnit).toBe(4);
    // 500g is 0.5 kg -> $4 / 0.5 = $8.00 / kg
    expect(res.shelfTagPerKgOrLiter).toBe(8);
    // Price per 100g = $0.80
    expect(res.shelfTagPer100gOr100ml).toBe(0.8);
  });
});
