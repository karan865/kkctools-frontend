'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './UnitPriceCalculator.module.css';
import UnitPriceDiagram from './UnitPriceDiagram';
import {
  UnitPriceItemInput,
  AnyUnit,
  compareUnitPrices,
  calculateShrinkflation,
  calculateSellerUnitCost,
  formatUnitLabel,
  DealType,
} from '@/lib/unit-price-engine';

export type ActiveTab = 'compare' | 'shrinkflation' | 'seller';

const UNIT_PRICE_TABS: { id: ActiveTab; label: string }[] = [
  { id: 'compare', label: '🛒 Compare Products (2–6 items)' },
  { id: 'shrinkflation', label: '📉 Shrinkflation Check' },
  { id: 'seller', label: '🏷️ Seller: Cost & Shelf Tag' },
];

interface UnitRowState {
  id: string;
  label: string;
  priceStr: string;
  packCountStr: string;
  sizePerItemStr: string;
  unit: AnyUnit;
  hasDeal: boolean;
  dealType: DealType;
  dealValueStr: string;
  buyQtyStr: string;
  freeQtyStr: string;
  bundlePriceStr: string;
  bundleQtyStr: string;
}

const DEFAULT_ROWS: UnitRowState[] = [
  {
    id: 'row-1',
    label: 'Small 12 oz Bag',
    priceStr: '8.99',
    packCountStr: '1',
    sizePerItemStr: '12',
    unit: 'oz',
    hasDeal: false,
    dealType: 'none',
    dealValueStr: '',
    buyQtyStr: '',
    freeQtyStr: '',
    bundlePriceStr: '',
    bundleQtyStr: '',
  },
  {
    id: 'row-2',
    label: 'Medium 32 oz Bag (2 lb)',
    priceStr: '18.49',
    packCountStr: '1',
    sizePerItemStr: '32',
    unit: 'oz',
    hasDeal: false,
    dealType: 'none',
    dealValueStr: '',
    buyQtyStr: '',
    freeQtyStr: '',
    bundlePriceStr: '',
    bundleQtyStr: '',
  },
  {
    id: 'row-3',
    label: 'Twin-Pack 16 oz (32 oz total)',
    priceStr: '17.99',
    packCountStr: '2',
    sizePerItemStr: '16',
    unit: 'oz',
    hasDeal: false,
    dealType: 'none',
    dealValueStr: '',
    buyQtyStr: '',
    freeQtyStr: '',
    bundlePriceStr: '',
    bundleQtyStr: '',
  },
];

export default function UnitPriceCalculator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('compare');

  // Compare Tab State
  const [rows, setRows] = useState<UnitRowState[]>(DEFAULT_ROWS);
  const [customOutputUnit, setCustomOutputUnit] = useState<AnyUnit | ''>('');
  const [targetQuantityStr, setTargetQuantityStr] = useState<string>('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Shrinkflation Tab State
  const [sfOldPriceStr, setSfOldPriceStr] = useState<string>('4.99');
  const [sfOldSizeStr, setSfOldSizeStr] = useState<string>('16');
  const [sfNewPriceStr, setSfNewPriceStr] = useState<string>('4.99');
  const [sfNewSizeStr, setSfNewSizeStr] = useState<string>('14.2');
  const [sfUnit, setSfUnit] = useState<string>('oz');

  // Seller Tab State
  const [sellerBatchCostStr, setSellerBatchCostStr] = useState<string>('240.00');
  const [sellerUnitsStr, setSellerUnitsStr] = useState<string>('80');
  const [sellerPkgSizeStr, setSellerPkgSizeStr] = useState<string>('250');
  const [sellerPkgUnit, setSellerPkgUnit] = useState<AnyUnit>('g');

  // Feedback states
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  // Sync state from URL query on initial client load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'compare' || tabParam === 'shrinkflation' || tabParam === 'seller') {
          setActiveTab(tabParam);
        }
        const curParam = params.get('cur');
        if (curParam) setCurrencySymbol(curParam);

        if (tabParam === 'shrinkflation') {
          const op = params.get('op');
          const os = params.get('os');
          const np = params.get('np');
          const ns = params.get('ns');
          const u = params.get('u');
          if (op) setSfOldPriceStr(op);
          if (os) setSfOldSizeStr(os);
          if (np) setSfNewPriceStr(np);
          if (ns) setSfNewSizeStr(ns);
          if (u) setSfUnit(u);
        } else if (tabParam === 'seller') {
          const bc = params.get('bc');
          const up = params.get('up');
          const ps = params.get('ps');
          const pu = params.get('pu') as AnyUnit;
          if (bc) setSellerBatchCostStr(bc);
          if (up) setSellerUnitsStr(up);
          if (ps) setSellerPkgSizeStr(ps);
          if (pu) setSellerPkgUnit(pu);
        }
      } catch {
        // Ignore URL parsing errors
      }
    };

    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update query params on state change (without pushing endless history states)
  const syncToUrl = useCallback(
    (tab: ActiveTab) => {
      if (typeof window === 'undefined') return;
      try {
        const params = new URLSearchParams();
        params.set('tab', tab);
        if (currencySymbol !== '$') params.set('cur', currencySymbol);

        if (tab === 'shrinkflation') {
          params.set('op', sfOldPriceStr);
          params.set('os', sfOldSizeStr);
          params.set('np', sfNewPriceStr);
          params.set('ns', sfNewSizeStr);
          params.set('u', sfUnit);
        } else if (tab === 'seller') {
          params.set('bc', sellerBatchCostStr);
          params.set('up', sellerUnitsStr);
          params.set('ps', sellerPkgSizeStr);
          params.set('pu', sellerPkgUnit);
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
      } catch {
        // Safe fallback
      }
    },
    [
      currencySymbol,
      sfOldPriceStr,
      sfOldSizeStr,
      sfNewPriceStr,
      sfNewSizeStr,
      sfUnit,
      sellerBatchCostStr,
      sellerUnitsStr,
      sellerPkgSizeStr,
      sellerPkgUnit,
    ]
  );

  // Trigger sync on active tab changes
  useEffect(() => {
    syncToUrl(activeTab);
  }, [activeTab, syncToUrl]);

  // Handle row mutations
  const updateRow = (id: string, field: keyof UnitRowState, value: string | boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    if (rows.length >= 6) return;
    const newRow: UnitRowState = {
      id: `row-${Date.now()}`,
      label: `Option ${String.fromCharCode(65 + rows.length)}`,
      priceStr: '10.00',
      packCountStr: '1',
      sizePerItemStr: '16',
      unit: rows[0]?.unit || 'oz',
      hasDeal: false,
      dealType: 'none',
      dealValueStr: '',
      buyQtyStr: '',
      freeQtyStr: '',
      bundlePriceStr: '',
      bundleQtyStr: '',
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 2) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const resetDefaults = () => {
    setRows(DEFAULT_ROWS);
    setCustomOutputUnit('');
    setTargetQuantityStr('');
    setCurrencySymbol('$');
    setSfOldPriceStr('4.99');
    setSfOldSizeStr('16');
    setSfNewPriceStr('4.99');
    setSfNewSizeStr('14.2');
    setSfUnit('oz');
    setSellerBatchCostStr('240.00');
    setSellerUnitsStr('80');
    setSellerPkgSizeStr('250');
    setSellerPkgUnit('g');
  };

  // Convert row states into Engine Inputs
  const engineInputs: UnitPriceItemInput[] = useMemo(() => {
    return rows.map((r) => {
      const price = parseFloat(r.priceStr) || 0;
      const packCount = parseInt(r.packCountStr, 10) || 1;
      const sizePerItem = parseFloat(r.sizePerItemStr) || 0;

      let deal = undefined;
      if (r.hasDeal && r.dealType !== 'none') {
        deal = {
          type: r.dealType,
          value: parseFloat(r.dealValueStr) || undefined,
          buyQty: parseInt(r.buyQtyStr, 10) || undefined,
          freeQty: parseInt(r.freeQtyStr, 10) || undefined,
          bundlePrice: parseFloat(r.bundlePriceStr) || undefined,
          bundleQty: parseInt(r.bundleQtyStr, 10) || undefined,
        };
      }

      return {
        id: r.id,
        label: r.label.trim() || `Item ${r.id}`,
        price,
        packCount,
        sizePerItem,
        unit: r.unit,
        deal,
      };
    });
  }, [rows]);

  // Run Comparison Engine
  const targetQuantity = parseFloat(targetQuantityStr) || undefined;
  const compareResult = useMemo(() => {
    return compareUnitPrices(
      engineInputs,
      customOutputUnit ? customOutputUnit : undefined,
      targetQuantity
    );
  }, [engineInputs, customOutputUnit, targetQuantity]);

  // Run Shrinkflation Engine
  const shrinkflationResult = useMemo(() => {
    const oldP = parseFloat(sfOldPriceStr) || 0;
    const oldS = parseFloat(sfOldSizeStr) || 0;
    const newP = parseFloat(sfNewPriceStr) || 0;
    const newS = parseFloat(sfNewSizeStr) || 0;

    return calculateShrinkflation({
      oldPrice: oldP,
      oldSize: oldS,
      newPrice: newP,
      newSize: newS,
      unitLabel: sfUnit,
    });
  }, [sfOldPriceStr, sfOldSizeStr, sfNewPriceStr, sfNewSizeStr, sfUnit]);

  // Run Seller Unit Cost Engine
  const sellerCostResult = useMemo(() => {
    const batchCost = parseFloat(sellerBatchCostStr) || 0;
    const units = parseInt(sellerUnitsStr, 10) || 0;
    const pkgSize = parseFloat(sellerPkgSizeStr) || 0;

    return calculateSellerUnitCost({
      batchTotalCost: batchCost,
      unitsProduced: units,
      packageSize: pkgSize,
      packageUnit: sellerPkgUnit,
    });
  }, [sellerBatchCostStr, sellerUnitsStr, sellerPkgSizeStr, sellerPkgUnit]);

  // Copy results summary or table to clipboard
  const handleCopy = () => {
    let text = '';
    if (activeTab === 'compare') {
      text = `=== Unit Price Comparison ===\n`;
      text += `${compareResult.summarySentence}\n\n`;
      text += `Rank | Option | Effective Price | Unit Price (${compareResult.outputUnit}) | vs Best\n`;
      text += `--------------------------------------------------------\n`;
      compareResult.items.forEach((it) => {
        const vsBest = it.isCheapest ? 'Cheapest' : `+${it.percentMoreThanCheapest.toFixed(1)}%`;
        text += `#${it.rank} | ${it.label} | ${currencySymbol}${it.effectivePrice.toFixed(2)} | ${currencySymbol}${it.unitPrice.toFixed(4)}/${formatUnitLabel(compareResult.outputUnit)} | ${vsBest}\n`;
      });
      text += `\nCalculated with KKCTools Unit Price Calculator: https://kkctools.com/unit-price-calculator/`;
    } else if (activeTab === 'shrinkflation') {
      text = `=== Shrinkflation Analysis ===\n`;
      text += `${shrinkflationResult.summarySentence}\n`;
      text += `Size Change: ${shrinkflationResult.sizeChangePercent.toFixed(1)}%\n`;
      text += `Hidden Price Rise: +${shrinkflationResult.unitPriceIncreasePercent.toFixed(1)}%\n`;
      text += `\nCalculated with KKCTools: https://kkctools.com/unit-price-calculator/?tab=shrinkflation`;
    } else {
      text = `=== Seller Cost & Shelf Tagging ===\n`;
      text += `Cost per Unit: ${currencySymbol}${sellerCostResult.costPerUnit.toFixed(2)}\n`;
      if (sellerCostResult.shelfTagPerKgOrLiter) {
        text += `Shelf Tag (per kg/L): ${currencySymbol}${sellerCostResult.shelfTagPerKgOrLiter.toFixed(2)}\n`;
      }
      text += `\nCalculated with KKCTools: https://kkctools.com/unit-price-calculator/?tab=seller`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    syncToUrl(activeTab);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Group-aware available units for output dropdown
  const detectedGroup = compareResult.commonGroup || 'weight';

  return (
    <div className={styles.wrap}>
      {/* Navigation Tabs */}
      <TabSlider
        tabs={UNIT_PRICE_TABS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as ActiveTab)}
        ariaLabel="Unit Price Calculator Modes"
      />

      {/* Main Grid: Inputs Left, Results Right */}
      <div className={styles.grid}>
        {/* ==================================================== */}
        {/* TAB 1: COMPARE PRODUCTS                              */}
        {/* ==================================================== */}
        {activeTab === 'compare' && (
          <>
            <div className={styles.inputs}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>1</span>
                    <div>
                      <h2 className={styles.cardTitle}>Product Options</h2>
                      <p className={styles.cardSubtitle}>
                        Enter price, pack count, and size for each competing item
                      </p>
                    </div>
                  </div>
                  <select
                    className={styles.select}
                    style={{ width: '80px', height: '32px', fontSize: '0.8rem' }}
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    aria-label="Currency Symbol"
                  >
                    <option value="$">$ (USD/AUD)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="C$">C$ (CAD)</option>
                  </select>
                </div>

                <div className={styles.itemsList}>
                  {rows.map((row, idx) => {
                    const rowLetter = String.fromCharCode(65 + idx);
                    return (
                      <div key={row.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemBadge}>Option {rowLetter}</span>
                          {rows.length > 2 && (
                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={() => removeRow(row.id)}
                              aria-label={`Remove Option ${rowLetter}`}
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        <div className={styles.itemRowGrid}>
                          <div className={styles.field}>
                            <label className={styles.label} htmlFor={`label-${row.id}`}>
                              Label (Optional)
                            </label>
                            <input
                              id={`label-${row.id}`}
                              type="text"
                              className={styles.input}
                              style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                              value={row.label}
                              onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                              placeholder={`Option ${rowLetter}`}
                            />
                          </div>

                          <div className={styles.field}>
                            <label className={styles.label} htmlFor={`price-${row.id}`}>
                              Price
                            </label>
                            <div className={styles.inputWrap}>
                              <span className={styles.unitBadge}>{currencySymbol}</span>
                              <input
                                id={`price-${row.id}`}
                                type="number"
                                step="any"
                                min="0"
                                className={styles.input}
                                value={row.priceStr}
                                onChange={(e) => updateRow(row.id, 'priceStr', e.target.value)}
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div className={styles.field}>
                            <label className={styles.label} htmlFor={`pack-${row.id}`}>
                              Packs / Multi
                            </label>
                            <div className={styles.inputWrap}>
                              <input
                                id={`pack-${row.id}`}
                                type="number"
                                min="1"
                                className={styles.input}
                                value={row.packCountStr}
                                onChange={(e) => updateRow(row.id, 'packCountStr', e.target.value)}
                                placeholder="1"
                              />
                              <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>
                                pk
                              </span>
                            </div>
                          </div>

                          <div className={styles.field}>
                            <label className={styles.label} htmlFor={`size-${row.id}`}>
                              Size per Item
                            </label>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input
                                id={`size-${row.id}`}
                                type="number"
                                step="any"
                                min="0"
                                className={styles.input}
                                style={{
                                  border: '1px solid var(--line)',
                                  borderRadius: '8px',
                                  width: '55%',
                                }}
                                value={row.sizePerItemStr}
                                onChange={(e) => updateRow(row.id, 'sizePerItemStr', e.target.value)}
                                placeholder="Size"
                              />
                              <select
                                className={styles.select}
                                style={{ width: '45%' }}
                                value={row.unit}
                                onChange={(e) =>
                                  updateRow(row.id, 'unit', e.target.value as AnyUnit)
                                }
                                aria-label="Unit of measure"
                              >
                                <optgroup label="Weight">
                                  <option value="oz">oz (ounces)</option>
                                  <option value="lb">lb (pounds)</option>
                                  <option value="g">g (grams)</option>
                                  <option value="kg">kg (kilograms)</option>
                                </optgroup>
                                <optgroup label="Volume">
                                  <option value="fl_oz">fl oz (fluid oz)</option>
                                  <option value="cup">cup</option>
                                  <option value="pt">pt (pints)</option>
                                  <option value="qt">qt (quarts)</option>
                                  <option value="gal">gal (gallons)</option>
                                  <option value="ml">ml (milliliters)</option>
                                  <option value="l">L (liters)</option>
                                </optgroup>
                                <optgroup label="Count">
                                  <option value="item">item / each</option>
                                  <option value="sheet">sheets</option>
                                  <option value="roll">rolls</option>
                                  <option value="load">loads</option>
                                  <option value="pc">pcs</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Deal Accordion Toggle */}
                        <div>
                          <button
                            type="button"
                            className={styles.dealToggle}
                            onClick={() => updateRow(row.id, 'hasDeal', !row.hasDeal)}
                          >
                            {row.hasDeal ? '▼ Hide Coupon / Promotion' : '▶ Add Coupon / Deal (BOGO, % Off, Multi-Buy)'}
                          </button>
                        </div>

                        {/* Deal Settings */}
                        {row.hasDeal && (
                          <div className={styles.dealBox}>
                            <div className={styles.dealInputs}>
                              <div className={styles.field}>
                                <label className={styles.label}>Promotion Type</label>
                                <select
                                  className={styles.select}
                                  value={row.dealType}
                                  onChange={(e) =>
                                    updateRow(row.id, 'dealType', e.target.value as DealType)
                                  }
                                >
                                  <option value="none">No promotion</option>
                                  <option value="percent_off">Percentage Off (%)</option>
                                  <option value="amount_off">Amount Off ($)</option>
                                  <option value="bogo">Buy X Get Y Free (BOGO)</option>
                                  <option value="x_for_y">Multi-Buy (X for $Y)</option>
                                </select>
                              </div>

                              {row.dealType === 'percent_off' && (
                                <div className={styles.field}>
                                  <label className={styles.label}>Discount Percentage</label>
                                  <div className={styles.inputWrap}>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      className={styles.input}
                                      value={row.dealValueStr}
                                      onChange={(e) =>
                                        updateRow(row.id, 'dealValueStr', e.target.value)
                                      }
                                      placeholder="e.g. 20"
                                    />
                                    <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>
                                      %
                                    </span>
                                  </div>
                                </div>
                              )}

                              {row.dealType === 'amount_off' && (
                                <div className={styles.field}>
                                  <label className={styles.label}>Coupon Value</label>
                                  <div className={styles.inputWrap}>
                                    <span className={styles.unitBadge}>{currencySymbol}</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="any"
                                      className={styles.input}
                                      value={row.dealValueStr}
                                      onChange={(e) =>
                                        updateRow(row.id, 'dealValueStr', e.target.value)
                                      }
                                      placeholder="e.g. 1.50"
                                    />
                                  </div>
                                </div>
                              )}

                              {row.dealType === 'bogo' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <div className={styles.field} style={{ flex: 1 }}>
                                    <label className={styles.label}>Buy</label>
                                    <input
                                      type="number"
                                      min="1"
                                      className={styles.input}
                                      style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                                      value={row.buyQtyStr}
                                      onChange={(e) =>
                                        updateRow(row.id, 'buyQtyStr', e.target.value)
                                      }
                                      placeholder="1"
                                    />
                                  </div>
                                  <div className={styles.field} style={{ flex: 1 }}>
                                    <label className={styles.label}>Get Free</label>
                                    <input
                                      type="number"
                                      min="1"
                                      className={styles.input}
                                      style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                                      value={row.freeQtyStr}
                                      onChange={(e) =>
                                        updateRow(row.id, 'freeQtyStr', e.target.value)
                                      }
                                      placeholder="1"
                                    />
                                  </div>
                                </div>
                              )}

                              {row.dealType === 'x_for_y' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <div className={styles.field} style={{ flex: 1 }}>
                                    <label className={styles.label}>Bundle Qty</label>
                                    <input
                                      type="number"
                                      min="1"
                                      className={styles.input}
                                      style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                                      value={row.bundleQtyStr}
                                      onChange={(e) =>
                                        updateRow(row.id, 'bundleQtyStr', e.target.value)
                                      }
                                      placeholder="3"
                                    />
                                  </div>
                                  <div className={styles.field} style={{ flex: 1 }}>
                                    <label className={styles.label}>Bundle Price</label>
                                    <div className={styles.inputWrap}>
                                      <span className={styles.unitBadge}>{currencySymbol}</span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        className={styles.input}
                                        value={row.bundlePriceStr}
                                        onChange={(e) =>
                                          updateRow(row.id, 'bundlePriceStr', e.target.value)
                                        }
                                        placeholder="5.00"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className={styles.addRowBar} style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={addRow}
                    disabled={rows.length >= 6}
                  >
                    + Add Product Option ({rows.length}/6)
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={resetDefaults}
                  >
                    ↺ Reset Examples
                  </button>
                </div>

                {/* Additional Settings */}
                <div className={styles.prefGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="output-unit-select">
                      Compare By (Output Unit)
                    </label>
                    <select
                      id="output-unit-select"
                      className={styles.select}
                      value={customOutputUnit || compareResult.outputUnit}
                      onChange={(e) => setCustomOutputUnit(e.target.value as AnyUnit)}
                    >
                      {detectedGroup === 'weight' && (
                        <>
                          <option value="oz">per Ounce (oz)</option>
                          <option value="lb">per Pound (lb)</option>
                          <option value="g">per Gram (g)</option>
                          <option value="kg">per Kilogram (kg)</option>
                        </>
                      )}
                      {detectedGroup === 'volume' && (
                        <>
                          <option value="fl_oz">per Fluid Ounce (fl oz)</option>
                          <option value="pt">per Pint (pt)</option>
                          <option value="qt">per Quart (qt)</option>
                          <option value="gal">per Gallon (gal)</option>
                          <option value="ml">per Milliliter (ml)</option>
                          <option value="l">per Liter (L)</option>
                        </>
                      )}
                      {detectedGroup === 'count' && (
                        <>
                          <option value="item">per Item</option>
                          <option value="sheet">per Sheet</option>
                          <option value="roll">per Roll</option>
                          <option value="load">per Load</option>
                          <option value="pc">per Piece</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="target-qty">
                      Total Needed (Optional)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="target-qty"
                        type="number"
                        min="0"
                        step="any"
                        className={styles.input}
                        value={targetQuantityStr}
                        onChange={(e) => setTargetQuantityStr(e.target.value)}
                        placeholder="e.g. 64"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>
                        {formatUnitLabel(compareResult.outputUnit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mismatched Groups Warning */}
                {compareResult.hasMismatchedGroups && (
                  <div className={styles.warningBox} style={{ marginTop: '16px' }}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <div>
                      <strong>Mismatched Measurement Types:</strong> You have mixed weight (oz/lb),
                      liquid volume (fl oz/L), or item counts. Fluid ounces (fl oz) measure volume,
                      while ounces (oz) measure weight. For accurate pricing, ensure all items share
                      the same physical property.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Side */}
            <div className={styles.results}>
              {/* Plain English Winner Banner */}
              {compareResult.cheapestItem && (
                <div className={styles.summaryBanner}>
                  <div className={styles.summaryIcon}>✓</div>
                  <p className={styles.summaryText}>{compareResult.summarySentence}</p>
                </div>
              )}

              {/* Visual Diagram */}
              <div className={styles.card}>
                <UnitPriceDiagram
                  items={compareResult.items}
                  outputUnit={compareResult.outputUnit}
                  currencySymbol={currencySymbol}
                  mode="compare"
                />
              </div>

              {/* Ranked Breakdown Table */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>2</span>
                    <div>
                      <h3 className={styles.cardTitle}>Ranked Comparison Table</h3>
                      <p className={styles.cardSubtitle}>
                        Ranked from lowest cost per {formatUnitLabel(compareResult.outputUnit)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Option</th>
                        <th>Effective Price</th>
                        <th>Price / {formatUnitLabel(compareResult.outputUnit)}</th>
                        <th>Difference</th>
                        {targetQuantity && <th>Packs Needed</th>}
                        {targetQuantity && <th>Total Cost</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {compareResult.items.map((it) => (
                        <tr
                          key={it.id}
                          className={it.isCheapest ? styles.tableRowBest : undefined}
                        >
                          <td>
                            <span
                              className={`${styles.rankBadge} ${
                                it.isCheapest ? styles.rankBest : styles.rankOther
                              }`}
                            >
                              {it.rank}
                            </span>
                          </td>
                          <td>
                            <strong>{it.label}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {it.packCount > 1 ? `${it.packCount} × ` : ''}
                              {it.sizePerItem} {formatUnitLabel(it.unit)}
                            </div>
                          </td>
                          <td>
                            {currencySymbol}
                            {it.effectivePrice.toFixed(2)}
                            {it.effectivePrice !== it.originalPrice && (
                              <div
                                style={{
                                  fontSize: '0.7rem',
                                  textDecoration: 'line-through',
                                  color: '#94a3b8',
                                }}
                              >
                                {currencySymbol}
                                {it.originalPrice.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>
                              {currencySymbol}
                              {it.unitPrice.toFixed(4)}
                            </strong>
                          </td>
                          <td>
                            {it.isCheapest ? (
                              <span className={styles.diffBadgeBest}>Best Deal</span>
                            ) : (
                              <span className={styles.diffBadgeWorse}>
                                +{it.percentMoreThanCheapest.toFixed(1)}%
                              </span>
                            )}
                          </td>
                          {targetQuantity && (
                            <td>
                              <strong>{it.packsNeededForTarget || 0}</strong> pk
                            </td>
                          )}
                          {targetQuantity && (
                            <td>
                              <strong>
                                {currencySymbol}
                                {(it.totalCostForTarget || 0).toFixed(2)}
                              </strong>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionsBar}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✓ Copied Table' : '📋 Copy Results'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                    onClick={handleShare}
                  >
                    {shared ? '✓ URL Copied' : '🔗 Share URL'}
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handlePrint}
                  >
                    🖨️ Print Sheet
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================================== */}
        {/* TAB 2: SHRINKFLATION CHECK                           */}
        {/* ==================================================== */}
        {activeTab === 'shrinkflation' && (
          <>
            <div className={styles.inputs}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>1</span>
                    <div>
                      <h2 className={styles.cardTitle}>Shrinkflation Inputs</h2>
                      <p className={styles.cardSubtitle}>
                        Compare package sizes before and after downsizing
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.field} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>Measurement Unit</label>
                  <input
                    type="text"
                    className={styles.input}
                    style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                    value={sfUnit}
                    onChange={(e) => setSfUnit(e.target.value)}
                    placeholder="oz, g, sheets, ml..."
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Original Package */}
                  <div className={styles.itemCard}>
                    <span className={styles.itemBadge}>Original Package</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className={styles.field}>
                        <label className={styles.label}>Original Price</label>
                        <div className={styles.inputWrap}>
                          <span className={styles.unitBadge}>{currencySymbol}</span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className={styles.input}
                            value={sfOldPriceStr}
                            onChange={(e) => setSfOldPriceStr(e.target.value)}
                            placeholder="4.99"
                          />
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Original Size</label>
                        <div className={styles.inputWrap}>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className={styles.input}
                            value={sfOldSizeStr}
                            onChange={(e) => setSfOldSizeStr(e.target.value)}
                            placeholder="16"
                          />
                          <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>
                            {sfUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New Downsized Package */}
                  <div className={styles.itemCard}>
                    <span className={styles.itemBadge} style={{ background: '#fee2e2', color: '#b91c1c' }}>
                      New Downsized Package
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className={styles.field}>
                        <label className={styles.label}>New Price</label>
                        <div className={styles.inputWrap}>
                          <span className={styles.unitBadge}>{currencySymbol}</span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className={styles.input}
                            value={sfNewPriceStr}
                            onChange={(e) => setSfNewPriceStr(e.target.value)}
                            placeholder="4.99"
                          />
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>New Size</label>
                        <div className={styles.inputWrap}>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className={styles.input}
                            value={sfNewSizeStr}
                            onChange={(e) => setSfNewSizeStr(e.target.value)}
                            placeholder="14.2"
                          />
                          <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>
                            {sfUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.results}>
              {/* Summary Banner */}
              <div
                className={styles.summaryBanner}
                style={{
                  background:
                    shrinkflationResult.unitPriceIncreasePercent > 0 ? '#fef2f2' : '#ecfdf5',
                  borderColor:
                    shrinkflationResult.unitPriceIncreasePercent > 0 ? '#fecaca' : '#a7f3d0',
                }}
              >
                <div
                  className={styles.summaryIcon}
                  style={{
                    background:
                      shrinkflationResult.unitPriceIncreasePercent > 0 ? '#ef4444' : '#10b981',
                  }}
                >
                  {shrinkflationResult.unitPriceIncreasePercent > 0 ? '!' : '✓'}
                </div>
                <p
                  className={styles.summaryText}
                  style={{
                    color:
                      shrinkflationResult.unitPriceIncreasePercent > 0 ? '#991b1b' : '#065f46',
                  }}
                >
                  {shrinkflationResult.summarySentence}
                </p>
              </div>

              {/* Visual Diagram */}
              <div className={styles.card}>
                <UnitPriceDiagram
                  items={[]}
                  outputUnit="oz"
                  currencySymbol={currencySymbol}
                  mode="shrinkflation"
                  shrinkflationData={{
                    oldPrice: parseFloat(sfOldPriceStr) || 0,
                    oldSize: parseFloat(sfOldSizeStr) || 0,
                    newPrice: parseFloat(sfNewPriceStr) || 0,
                    newSize: parseFloat(sfNewSizeStr) || 0,
                    unitPriceIncreasePercent: shrinkflationResult.unitPriceIncreasePercent,
                    unitLabel: sfUnit,
                  }}
                />
              </div>

              {/* Metrics Grid */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>Detailed Shrinkflation Impact</h3>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Package Size Change</span>
                    <span
                      className={`${styles.metricVal} ${
                        shrinkflationResult.sizeChangePercent < 0
                          ? styles.metricValPositive
                          : styles.metricValGood
                      }`}
                    >
                      {shrinkflationResult.sizeChangePercent >= 0 ? '+' : ''}
                      {shrinkflationResult.sizeChangePercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Effective Hidden Price Rise</span>
                    <span
                      className={`${styles.metricVal} ${
                        shrinkflationResult.unitPriceIncreasePercent > 0
                          ? styles.metricValPositive
                          : styles.metricValGood
                      }`}
                    >
                      {shrinkflationResult.unitPriceIncreasePercent >= 0 ? '+' : ''}
                      {shrinkflationResult.unitPriceIncreasePercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Original Unit Price</span>
                    <span className={styles.metricVal}>
                      {currencySymbol}
                      {shrinkflationResult.oldUnitPrice.toFixed(4)} / {sfUnit}
                    </span>
                  </div>

                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>New Unit Price</span>
                    <span className={styles.metricVal}>
                      {currencySymbol}
                      {shrinkflationResult.newUnitPrice.toFixed(4)} / {sfUnit}
                    </span>
                  </div>
                </div>

                <div className={styles.actionsBar} style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✓ Copied Summary' : '📋 Copy Analysis'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                    onClick={handleShare}
                  >
                    {shared ? '✓ URL Copied' : '🔗 Share URL'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================================== */}
        {/* TAB 3: SELLER UNIT COST & SHELF TAGGING              */}
        {/* ==================================================== */}
        {activeTab === 'seller' && (
          <>
            <div className={styles.inputs}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>1</span>
                    <div>
                      <h2 className={styles.cardTitle}>Production & Packaging Specs</h2>
                      <p className={styles.cardSubtitle}>
                        Calculate unit manufacturing cost and mandatory retail shelf-tag prices
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="batch-cost">
                      Total Production / Batch Cost
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id="batch-cost"
                        type="number"
                        step="any"
                        min="0"
                        className={styles.input}
                        value={sellerBatchCostStr}
                        onChange={(e) => setSellerBatchCostStr(e.target.value)}
                        placeholder="240.00"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="units-produced">
                      Units Produced in Batch
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="units-produced"
                        type="number"
                        min="1"
                        className={styles.input}
                        value={sellerUnitsStr}
                        onChange={(e) => setSellerUnitsStr(e.target.value)}
                        placeholder="80"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>
                        units
                      </span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="seller-pkg-size">
                      Packaged Net Size per Finished Unit
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        id="seller-pkg-size"
                        type="number"
                        step="any"
                        min="0"
                        className={styles.input}
                        style={{
                          border: '1px solid var(--line)',
                          borderRadius: '8px',
                          width: '60%',
                        }}
                        value={sellerPkgSizeStr}
                        onChange={(e) => setSellerPkgSizeStr(e.target.value)}
                        placeholder="250"
                      />
                      <select
                        className={styles.select}
                        style={{ width: '40%' }}
                        value={sellerPkgUnit}
                        onChange={(e) => setSellerPkgUnit(e.target.value as AnyUnit)}
                        aria-label="Package Unit"
                      >
                        <option value="g">grams (g)</option>
                        <option value="kg">kilograms (kg)</option>
                        <option value="oz">ounces (oz)</option>
                        <option value="lb">pounds (lb)</option>
                        <option value="ml">milliliters (ml)</option>
                        <option value="l">liters (L)</option>
                        <option value="fl_oz">fluid ounces (fl oz)</option>
                        <option value="item">individual items</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.results}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>Unit Cost & Shelf-Tag Pricing</h3>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Cost per Finished Unit</span>
                    <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                      {currencySymbol}
                      {sellerCostResult.costPerUnit.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Batch cost ÷ {sellerUnitsStr || '0'} units
                    </span>
                  </div>

                  {sellerCostResult.shelfTagPerKgOrLiter !== null && (
                    <div className={styles.metricBox}>
                      <span className={styles.metricLabel}>
                        Shelf Tag (per {['g', 'kg', 'oz', 'lb'].includes(sellerPkgUnit) ? 'kg' : 'L'})
                      </span>
                      <span className={styles.metricVal}>
                        {currencySymbol}
                        {sellerCostResult.shelfTagPerKgOrLiter.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Standardized statutory unit cost
                      </span>
                    </div>
                  )}

                  {sellerCostResult.shelfTagPer100gOr100ml !== null && (
                    <div className={styles.metricBox}>
                      <span className={styles.metricLabel}>
                        Shelf Tag (per {['g', 'kg', 'oz', 'lb'].includes(sellerPkgUnit) ? '100 g' : '100 ml'})
                      </span>
                      <span className={styles.metricVal}>
                        {currencySymbol}
                        {sellerCostResult.shelfTagPer100gOr100ml.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Grocery shelf baseline
                      </span>
                    </div>
                  )}
                </div>

                {/* Deep link to Markup Calculator */}
                <div className={styles.linkBanner} style={{ marginTop: '16px' }}>
                  <h4 className={styles.linkBannerTitle}>Next Step: Pricing & Profit Margins</h4>
                  <p className={styles.linkBannerText}>
                    Now that your unit cost is {currencySymbol}
                    {sellerCostResult.costPerUnit.toFixed(2)}, calculate the exact retail price and
                    profit margin needed for your business.
                  </p>
                  <Link
                    href={`/markup-calculator/?cost=${sellerCostResult.costPerUnit.toFixed(2)}`}
                    className={styles.deepLink}
                  >
                    Open Markup Calculator with this cost →
                  </Link>
                </div>

                <div className={styles.actionsBar} style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✓ Copied' : '📋 Copy Shelf Rates'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                    onClick={handleShare}
                  >
                    {shared ? '✓ URL Copied' : '🔗 Share URL'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
