'use client';

import React, { useState, useEffect, useId, useMemo } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './MarkupCalculator.module.css';
import MarkupDiagram from './MarkupDiagram';
import {
  priceFromMarkup,
  markupFromPrice,
  costFromPrice,
  priceFromMargin,
  marginFromPrice,
  multiplier,
  calculateLandedCost,
  addTax,
  stripTax,
  roundPriceEnding,
  calculatePriceChain,
  calculateProductList,
  parsePastedSpreadsheet,
  formatCurrency,
  formatPercent,
  PriceEndingOption,
  PriceChainTier,
  ProductListRowOutput,
} from '@/lib/pricing-engine';

type CalculatorMode = 'markup' | 'margin' | 'price' | 'reverse' | 'batch';

const MARKUP_TABS: { id: CalculatorMode; label: string }[] = [
  { id: 'markup', label: 'Cost & Markup %' },
  { id: 'margin', label: 'Cost & Target Margin %' },
  { id: 'price', label: 'Cost & Selling Price' },
  { id: 'reverse', label: 'Target Price to Max Cost' },
  { id: 'batch', label: 'Multi-Item Spreadsheet' },
];

export default function MarkupCalculator() {
  const baseId = useId();

  // Mode Selection
  const [mode, setMode] = useState<CalculatorMode>('markup');

  // Primary Inputs
  const [costInput, setCostInput] = useState<string>('40');
  const [markupInput, setMarkupInput] = useState<string>('50');
  const [marginInput, setMarginInput] = useState<string>('33.33');
  const [priceInput, setPriceInput] = useState<string>('60');

  // Currency Symbol
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Advanced Options - Landed Cost & Platform Fees
  const [isLandedOpen, setIsLandedOpen] = useState<boolean>(false);
  const [shippingInput, setShippingInput] = useState<string>('0');
  const [packagingInput, setPackagingInput] = useState<string>('0');
  const [feePercentInput, setFeePercentInput] = useState<string>('0');

  // Advanced Options - Psychological Price Endings
  const [isEndingOpen, setIsEndingOpen] = useState<boolean>(false);
  const [priceEnding, setPriceEnding] = useState<PriceEndingOption>('none');

  // Advanced Options - Tax Handling
  const [isTaxOpen, setIsTaxOpen] = useState<boolean>(false);
  const [taxRateInput, setTaxRateInput] = useState<string>('0');
  const [isTaxInclusive, setIsTaxInclusive] = useState<boolean>(false);

  // Advanced Options - 3-Tier Distribution Chain
  const [isChainOpen, setIsChainOpen] = useState<boolean>(false);
  const [makerMarkup, setMakerMarkup] = useState<number>(50);
  const [wholesaleMarkup, setWholesaleMarkup] = useState<number>(50);
  const [retailMarkup, setRetailMarkup] = useState<number>(100);

  // Batch Mode
  const [batchRawText, setBatchRawText] = useState<string>(
    'Cotton T-Shirt\t12.50\t60\nDenim Jacket\t45.00\t80\nWool Beanie\t8.00\t50\nCanvas Tote\t6.50\t100'
  );
  const [batchDefaultMarkup, setBatchDefaultMarkup] = useState<string>('50');
  const [batchResults, setBatchResults] = useState<ProductListRowOutput[]>([]);

  // Copy Feedback
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync with URL parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('cost');
      const m = params.get('markup');
      const p = params.get('price');
      const g = params.get('margin');

      if (c) setCostInput(c);
      if (m) {
        setMarkupInput(m);
        setMode('markup');
      } else if (g) {
        setMarginInput(g);
        setMode('margin');
      } else if (p) {
        setPriceInput(p);
        setMode('price');
      }
    };

    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  // Parse Numbers
  const baseCost = parseFloat(costInput) || 0;
  const shipping = parseFloat(shippingInput) || 0;
  const packaging = parseFloat(packagingInput) || 0;
  const totalCost = baseCost + shipping + packaging;

  const inputMarkup = parseFloat(markupInput) || 0;
  const inputMargin = parseFloat(marginInput) || 0;
  const inputPrice = parseFloat(priceInput) || 0;
  const feePct = parseFloat(feePercentInput) || 0;
  const taxRate = parseFloat(taxRateInput) || 0;

  // Primary Computations depending on Mode
  const computed = useMemo(() => {
    let effectiveSellingPrice = 0;
    let effectiveCost = totalCost;
    let markupPct: number | null = null;
    let marginPct: number | null = null;
    let dollarProfit = 0;
    let mult: number | null = null;

    if (mode === 'markup') {
      if (feePct > 0) {
        const landed = calculateLandedCost({
          baseCost: totalCost,
          feePercent: feePct,
        });
        effectiveSellingPrice = landed.requiredPriceMarkup(inputMarkup) || 0;
      } else {
        effectiveSellingPrice = priceFromMarkup(totalCost, inputMarkup);
      }
      dollarProfit = effectiveSellingPrice - totalCost;
      markupPct = inputMarkup;
      marginPct = marginFromPrice(totalCost, effectiveSellingPrice);
      mult = multiplier(totalCost, effectiveSellingPrice);
    } else if (mode === 'margin') {
      if (feePct > 0) {
        const landed = calculateLandedCost({
          baseCost: totalCost,
          feePercent: feePct,
        });
        effectiveSellingPrice = landed.requiredPriceMargin(inputMargin) || 0;
      } else {
        effectiveSellingPrice = priceFromMargin(totalCost, inputMargin) || 0;
      }
      dollarProfit = effectiveSellingPrice - totalCost;
      marginPct = inputMargin;
      markupPct = markupFromPrice(totalCost, effectiveSellingPrice);
      mult = multiplier(totalCost, effectiveSellingPrice);
    } else if (mode === 'price') {
      effectiveSellingPrice = inputPrice;
      dollarProfit = effectiveSellingPrice - totalCost;
      markupPct = markupFromPrice(totalCost, effectiveSellingPrice);
      marginPct = marginFromPrice(totalCost, effectiveSellingPrice);
      mult = multiplier(totalCost, effectiveSellingPrice);
    } else if (mode === 'reverse') {
      // Selling price known, target markup known -> find max allowable cost
      const maxCost = costFromPrice(inputPrice, inputMarkup);
      effectiveCost = maxCost || 0;
      effectiveSellingPrice = inputPrice;
      dollarProfit = effectiveSellingPrice - effectiveCost;
      markupPct = inputMarkup;
      marginPct = marginFromPrice(effectiveCost, effectiveSellingPrice);
      mult = multiplier(effectiveCost, effectiveSellingPrice);
    }

    // Apply Psychological Price Ending if configured
    let finalDisplayPrice = effectiveSellingPrice;
    let actualEndingMarkup = markupPct;
    let actualEndingMargin = marginPct;

    if (priceEnding !== 'none' && effectiveSellingPrice > 0) {
      const rounded = roundPriceEnding(effectiveSellingPrice, priceEnding, totalCost);
      finalDisplayPrice = rounded.roundedPrice;
      dollarProfit = finalDisplayPrice - totalCost;
      actualEndingMarkup = rounded.actualMarkupPercent;
      actualEndingMargin = rounded.actualMarginPercent;
      mult = multiplier(totalCost, finalDisplayPrice);
    }

    // Apply Tax if enabled
    let priceExTax = finalDisplayPrice;
    let priceIncTax = finalDisplayPrice;
    let taxAmount = 0;

    if (taxRate > 0) {
      if (isTaxInclusive) {
        priceIncTax = finalDisplayPrice;
        priceExTax = stripTax(finalDisplayPrice, taxRate);
        taxAmount = priceIncTax - priceExTax;
      } else {
        priceExTax = finalDisplayPrice;
        priceIncTax = addTax(finalDisplayPrice, taxRate);
        taxAmount = priceIncTax - priceExTax;
      }
    }

    return {
      cost: effectiveCost,
      sellingPrice: finalDisplayPrice,
      priceExTax,
      priceIncTax,
      taxAmount,
      dollarProfit,
      markupPercent: actualEndingMarkup,
      marginPercent: actualEndingMargin,
      multiplier: mult,
    };
  }, [
    mode,
    totalCost,
    inputMarkup,
    inputMargin,
    inputPrice,
    feePct,
    priceEnding,
    taxRate,
    isTaxInclusive,
  ]);

  // 3-Tier Distribution Chain Computation
  const chainResult = useMemo(() => {
    const tiers: PriceChainTier[] = [
      { role: '1. Factory / Maker', markupPercent: makerMarkup },
      { role: '2. Wholesaler / Distributor', markupPercent: wholesaleMarkup },
      { role: '3. Retail Store (MSRP)', markupPercent: retailMarkup },
    ];
    return calculatePriceChain(totalCost > 0 ? totalCost : 10, tiers);
  }, [totalCost, makerMarkup, wholesaleMarkup, retailMarkup]);

  // Batch Mode Execution
  const runBatchCalculation = () => {
    const defM = parseFloat(batchDefaultMarkup) || 50;
    const parsed = parsePastedSpreadsheet(batchRawText);
    const computedList = calculateProductList(parsed, defM);
    setBatchResults(computedList);
  };

  // Quick Preset Actions
  const applyPreset = (markupVal: number) => {
    setCostInput('40');
    setMarkupInput(String(markupVal));
    setMode('markup');
  };

  // Copy Summary
  const handleCopySummary = async () => {
    const summary = [
      `--- KKCTools Markup Calculation ---`,
      `Item Cost: ${formatCurrency(computed.cost, currencySymbol)}`,
      `Markup: ${formatPercent(computed.markupPercent)}`,
      `Selling Price: ${formatCurrency(computed.sellingPrice, currencySymbol)}`,
      `Gross Profit: ${formatCurrency(computed.dollarProfit, currencySymbol)}`,
      `Gross Margin: ${formatPercent(computed.marginPercent)}`,
      `Multiplier: ${computed.multiplier !== null ? `${computed.multiplier.toFixed(2)}x` : '—'}`,
      computed.taxAmount > 0
        ? `Tax (${taxRate}%): ${formatCurrency(computed.taxAmount, currencySymbol)} | Total Inc Tax: ${formatCurrency(computed.priceIncTax, currencySymbol)}`
        : '',
      `Calculated with https://kkctools.com/markup-calculator/`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Copy Shareable URL
  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('cost', costInput);
    if (mode === 'markup') url.searchParams.set('markup', markupInput);
    if (mode === 'margin') url.searchParams.set('margin', marginInput);
    if (mode === 'price') url.searchParams.set('price', priceInput);

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Copy Batch CSV
  const handleCopyBatchCSV = async () => {
    if (batchResults.length === 0) return;
    const header = 'Product,Cost,Markup %,Selling Price,Gross Profit,Margin %';
    const lines = batchResults.map(
      (r) =>
        `"${r.name}",${r.cost.toFixed(2)},${r.markupPercent.toFixed(1)}%,${r.price.toFixed(
          2
        )},${r.profit.toFixed(2)},${r.marginPercent.toFixed(2)}%`
    );
    const csv = [header, ...lines].join('\n');
    await navigator.clipboard.writeText(csv);
  };

  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode);
    if (newMode === 'batch' && batchResults.length === 0) {
      runBatchCalculation();
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Tab Navigation */}
      <TabSlider
        tabs={MARKUP_TABS}
        activeId={mode}
        onChange={handleModeChange}
        ariaLabel="Markup Calculator Modes"
      />

      {mode !== 'batch' ? (
        <div className={styles.grid}>
          {/* Left Column: Inputs & Modular Adjustments */}
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Enter Cost &amp; Pricing Targets</h2>
                  <p className={styles.cardSubtitle}>
                    Select your preferred starting values or pick an industry benchmark below.
                  </p>
                </div>
              </div>

              {/* Quick Benchmark Presets */}
              <div className={styles.presetsBar}>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(100)}
                  title="Keystone Pricing: 100% markup doubles cost to achieve 50% gross margin"
                >
                  ⚡ Keystone (100% Markup = 2.0×)
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(50)}
                  title="Retail Standard: 50% markup yields 33.3% gross margin"
                >
                  50% Retail Standard
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(30)}
                  title="Wholesale / Volume: 30% markup"
                >
                  30% Wholesale
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(200)}
                  title="Boutique / Apparel: 200% markup (3.0× multiplier)"
                >
                  200% Boutique (3.0×)
                </button>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                  <label htmlFor={`${baseId}-curr`} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-muted)' }}>Currency:</label>
                  <select
                    id={`${baseId}-curr`}
                    value={currencySymbol}
                    aria-label="Currency Symbol"
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)' }}
                  >
                    <option value="$">$ (USD / CAD / AUD)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="₹">₹ (INR)</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                {/* Cost Field */}
                {mode !== 'reverse' && (
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor={`${baseId}-cost`} className={styles.label}>
                        Product Cost (COGS / Wholesale)
                      </label>
                      <span className={styles.labelHint}>Base unit expense</span>
                    </div>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={`${baseId}-cost`}
                        type="number"
                        min="0"
                        step="any"
                        className={styles.input}
                        value={costInput}
                        onChange={(e) => setCostInput(e.target.value)}
                        placeholder="40.00"
                      />
                    </div>
                  </div>
                )}

                {/* Markup % Field */}
                {(mode === 'markup' || mode === 'reverse') && (
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor={`${baseId}-markup`} className={styles.label}>
                        Markup Percentage (%)
                      </label>
                      <span className={styles.labelHint}>Profit added on top of cost</span>
                    </div>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-markup`}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={markupInput}
                        onChange={(e) => setMarkupInput(e.target.value)}
                        placeholder="50"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                    </div>
                  </div>
                )}

                {/* Target Margin % Field */}
                {mode === 'margin' && (
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor={`${baseId}-margin`} className={styles.label}>
                        Target Gross Margin (%)
                      </label>
                      <span className={styles.labelHint}>% of selling price kept as profit</span>
                    </div>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-margin`}
                        type="number"
                        min="0"
                        max="99.9"
                        step="any"
                        className={styles.input}
                        value={marginInput}
                        onChange={(e) => setMarginInput(e.target.value)}
                        placeholder="33.33"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                    </div>
                  </div>
                )}

                {/* Selling Price Field */}
                {(mode === 'price' || mode === 'reverse') && (
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor={`${baseId}-price`} className={styles.label}>
                        {mode === 'reverse' ? 'Target Selling Price (MSRP)' : 'Actual Selling Price'}
                      </label>
                      <span className={styles.labelHint}>Final customer ticket price</span>
                    </div>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={`${baseId}-price`}
                        type="number"
                        min="0"
                        step="any"
                        className={styles.input}
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="60.00"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modular Accordion 1: Landed Cost & Platform Fees */}
            <div className={styles.accordion}>
              <button
                type="button"
                className={styles.accordionHead}
                onClick={() => setIsLandedOpen(!isLandedOpen)}
                aria-expanded={isLandedOpen}
              >
                <span>📦 Landed Cost &amp; Marketplace Fees (Amazon / Shopify / Stripe)</span>
                <span className={styles.accordionIcon}>{isLandedOpen ? '▲' : '▼'}</span>
              </button>
              {isLandedOpen && (
                <div className={styles.accordionBody}>
                  <p className={styles.formulaNote}>
                    Incorporate inbound freight, packaging, and platform percentage transaction fees to ensure your profit margin isn&apos;t quietly eaten away.
                  </p>
                  <div className={styles.optionsGrid}>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-shipping`} className={styles.label}>
                        Freight / Shipping
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.unitBadge}>{currencySymbol}</span>
                        <input
                          id={`${baseId}-shipping`}
                          type="number"
                          min="0"
                          step="any"
                          className={styles.input}
                          value={shippingInput}
                          onChange={(e) => setShippingInput(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-pkg`} className={styles.label}>
                        Packaging &amp; Prep
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.unitBadge}>{currencySymbol}</span>
                        <input
                          id={`${baseId}-pkg`}
                          type="number"
                          min="0"
                          step="any"
                          className={styles.input}
                          value={packagingInput}
                          onChange={(e) => setPackagingInput(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-fee`} className={styles.label}>
                        Platform Fee %
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={`${baseId}-fee`}
                          type="number"
                          min="0"
                          max="90"
                          step="any"
                          className={styles.input}
                          value={feePercentInput}
                          onChange={(e) => setFeePercentInput(e.target.value)}
                          placeholder="0"
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                    </div>
                  </div>
                  {totalCost > baseCost && (
                    <div className={styles.formulaNote}>
                      <strong>Effective Landed Cost:</strong> {formatCurrency(totalCost, currencySymbol)} (Base: {formatCurrency(baseCost, currencySymbol)} + Inbound: {formatCurrency(shipping + packaging, currencySymbol)})
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modular Accordion 2: Psychological Price Endings */}
            <div className={styles.accordion}>
              <button
                type="button"
                className={styles.accordionHead}
                onClick={() => setIsEndingOpen(!isEndingOpen)}
                aria-expanded={isEndingOpen}
              >
                <span>🏷️ Psychological Price Endings (.99, .95, Whole Dollar)</span>
                <span className={styles.accordionIcon}>{isEndingOpen ? '▲' : '▼'}</span>
              </button>
              {isEndingOpen && (
                <div className={styles.accordionBody}>
                  <p className={styles.formulaNote}>
                    Charm pricing boosts conversion rates without sacrificing margins. Select an ending to see your price automatically adjusted and actual margin recalculated.
                  </p>
                  <div className={styles.optionsGrid}>
                    <button
                      type="button"
                      className={`${styles.optionCard} ${priceEnding === 'none' ? styles.optionCardActive : ''}`}
                      onClick={() => setPriceEnding('none')}
                    >
                      Exact Math (No Rounding)
                    </button>
                    <button
                      type="button"
                      className={`${styles.optionCard} ${priceEnding === '99' ? styles.optionCardActive : ''}`}
                      onClick={() => setPriceEnding('99')}
                    >
                      .99 Charm (e.g. $59.99)
                    </button>
                    <button
                      type="button"
                      className={`${styles.optionCard} ${priceEnding === '95' ? styles.optionCardActive : ''}`}
                      onClick={() => setPriceEnding('95')}
                    >
                      .95 Friendly (e.g. $59.95)
                    </button>
                    <button
                      type="button"
                      className={`${styles.optionCard} ${priceEnding === '49' ? styles.optionCardActive : ''}`}
                      onClick={() => setPriceEnding('49')}
                    >
                      .49 Mid (e.g. $59.49)
                    </button>
                    <button
                      type="button"
                      className={`${styles.optionCard} ${priceEnding === 'whole' ? styles.optionCardActive : ''}`}
                      onClick={() => setPriceEnding('whole')}
                    >
                      Whole Dollar (e.g. $60)
                    </button>
                    <button
                      type="button"
                      className={`${styles.optionCard} ${priceEnding === 'up5' ? styles.optionCardActive : ''}`}
                      onClick={() => setPriceEnding('up5')}
                    >
                      Nearest $5 (e.g. $65)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modular Accordion 3: Sales Tax / VAT / GST */}
            <div className={styles.accordion}>
              <button
                type="button"
                className={styles.accordionHead}
                onClick={() => setIsTaxOpen(!isTaxOpen)}
                aria-expanded={isTaxOpen}
              >
                <span>🏛️ Sales Tax / VAT / GST Adjustments</span>
                <span className={styles.accordionIcon}>{isTaxOpen ? '▲' : '▼'}</span>
              </button>
              {isTaxOpen && (
                <div className={styles.accordionBody}>
                  <div className={styles.presetsBar}>
                    <button type="button" className={styles.presetBtn} onClick={() => setTaxRateInput('20')}>
                      UK VAT (20%)
                    </button>
                    <button type="button" className={styles.presetBtn} onClick={() => setTaxRateInput('10')}>
                      Australia GST (10%)
                    </button>
                    <button type="button" className={styles.presetBtn} onClick={() => setTaxRateInput('15')}>
                      New Zealand GST (15%)
                    </button>
                    <button type="button" className={styles.presetBtn} onClick={() => setTaxRateInput('7')}>
                      US Avg State Tax (7%)
                    </button>
                    <button type="button" className={styles.presetBtn} onClick={() => setTaxRateInput('0')}>
                      0% (Tax Exempt)
                    </button>
                  </div>

                  <div className={styles.optionsGrid}>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-taxrate`} className={styles.label}>
                        Tax / VAT Rate %
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={`${baseId}-taxrate`}
                          type="number"
                          min="0"
                          step="any"
                          className={styles.input}
                          value={taxRateInput}
                          onChange={(e) => setTaxRateInput(e.target.value)}
                          placeholder="0"
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                    </div>

                    <div className={styles.field}>
                      <span className={styles.label}>Price Display Mode</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button
                          type="button"
                          className={`${styles.presetBtn} ${!isTaxInclusive ? styles.optionCardActive : ''}`}
                          onClick={() => setIsTaxInclusive(false)}
                        >
                          Price is Ex-Tax
                        </button>
                        <button
                          type="button"
                          className={`${styles.presetBtn} ${isTaxInclusive ? styles.optionCardActive : ''}`}
                          onClick={() => setIsTaxInclusive(true)}
                        >
                          Price is Inc-Tax
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modular Accordion 4: 3-Tier Distribution Chain */}
            <div className={styles.accordion}>
              <button
                type="button"
                className={styles.accordionHead}
                onClick={() => setIsChainOpen(!isChainOpen)}
                aria-expanded={isChainOpen}
              >
                <span>🏭 3-Tier Distribution Chain (Factory → Wholesale → Retail)</span>
                <span className={styles.accordionIcon}>{isChainOpen ? '▲' : '▼'}</span>
              </button>
              {isChainOpen && (
                <div className={styles.accordionBody}>
                  <p className={styles.formulaNote}>
                    See how a manufacturing unit cost compounds across distributor margins into the final consumer retail price.
                  </p>
                  <div className={styles.optionsGrid}>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-maker`} className={styles.label}>
                        Maker Markup %
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={`${baseId}-maker`}
                          type="number"
                          className={styles.input}
                          value={makerMarkup}
                          onChange={(e) => setMakerMarkup(parseFloat(e.target.value) || 0)}
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-ws`} className={styles.label}>
                        Wholesale Markup %
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={`${baseId}-ws`}
                          type="number"
                          className={styles.input}
                          value={wholesaleMarkup}
                          onChange={(e) => setWholesaleMarkup(parseFloat(e.target.value) || 0)}
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-retail`} className={styles.label}>
                        Retailer Markup %
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={`${baseId}-retail`}
                          type="number"
                          className={styles.input}
                          value={retailMarkup}
                          onChange={(e) => setRetailMarkup(parseFloat(e.target.value) || 0)}
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.batchTableWrap}>
                    <table className={styles.batchTable}>
                      <thead>
                        <tr>
                          <th>Tier / Role</th>
                          <th>Buy Price</th>
                          <th>Markup</th>
                          <th>Sell Price</th>
                          <th>Profit</th>
                          <th>Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chainResult.rows.map((row, idx) => (
                          <tr key={idx}>
                            <td><strong>{row.role}</strong></td>
                            <td>{formatCurrency(row.buyPrice, currencySymbol)}</td>
                            <td>{formatPercent(row.markupPercent)}</td>
                            <td><strong>{formatCurrency(row.sellPrice, currencySymbol)}</strong></td>
                            <td style={{ color: '#059669', fontWeight: 600 }}>+{formatCurrency(row.profit, currencySymbol)}</td>
                            <td>{formatPercent(row.marginPercent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.formulaNote}>
                    <strong>System Total:</strong> Final consumer pays {formatCurrency(chainResult.consumerPrice, currencySymbol)} ({chainResult.totalMultiplier.toFixed(2)}× original production cost).
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Output Card & Interactive Visual Diagram */}
          <div className={styles.results}>
            <div className={styles.resultCard}>
              <div className={styles.resultHero}>
                <span className={styles.resultHeroLabel}>
                  {mode === 'reverse' ? 'Recommended Maximum Unit Cost' : 'Recommended Selling Price'}
                </span>
                <div className={styles.resultHeroValue}>
                  {formatCurrency(
                    mode === 'reverse' ? computed.cost : computed.sellingPrice,
                    currencySymbol
                  )}
                </div>
                <p className={styles.resultHeroSentence}>
                  At a <strong>{formatPercent(computed.markupPercent)}</strong> markup on{' '}
                  <strong>{formatCurrency(computed.cost, currencySymbol)}</strong> unit cost, you make{' '}
                  <strong>{formatCurrency(computed.dollarProfit, currencySymbol)}</strong> gross profit per item (
                  <strong>{formatPercent(computed.marginPercent)}</strong> gross margin).
                </p>
              </div>

              {/* Four Key Metrics Strip */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricBox}>
                  <span className={styles.metricBoxLabel}>Markup %</span>
                  <span className={styles.metricBoxVal}>
                    {formatPercent(computed.markupPercent)}
                  </span>
                </div>
                <div className={`${styles.metricBox} ${styles.metricBoxHighlight}`}>
                  <span className={styles.metricBoxLabel}>Gross Margin</span>
                  <span className={`${styles.metricBoxVal} ${styles.metricBoxValHighlight}`}>
                    {formatPercent(computed.marginPercent)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricBoxLabel}>Profit / Unit</span>
                  <span className={styles.metricBoxVal}>
                    {formatCurrency(computed.dollarProfit, currencySymbol)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricBoxLabel}>Multiplier</span>
                  <span className={styles.metricBoxVal}>
                    {computed.multiplier !== null ? `${computed.multiplier.toFixed(2)}×` : '—'}
                  </span>
                </div>
              </div>

              {/* Tax Strip if enabled */}
              {computed.taxAmount > 0 && (
                <div style={{ marginBottom: '18px', padding: '10px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.85rem' }}>
                  <strong>Tax Details:</strong> Ex-Tax: {formatCurrency(computed.priceExTax, currencySymbol)} + {taxRate}% Tax: {formatCurrency(computed.taxAmount, currencySymbol)} = <strong>Total Inc-Tax: {formatCurrency(computed.priceIncTax, currencySymbol)}</strong>
                </div>
              )}

              {/* Interactive SVG Diagram */}
              <MarkupDiagram
                cost={computed.cost}
                price={computed.sellingPrice}
                profit={computed.dollarProfit}
                markupPercent={computed.markupPercent}
                marginPercent={computed.marginPercent}
                multiplierVal={computed.multiplier}
              />

              {/* Action Buttons */}
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${copiedSummary ? styles.actionBtnCopied : ''}`}
                  onClick={handleCopySummary}
                >
                  {copiedSummary ? '✓ Copied Summary' : '📋 Copy Summary'}
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${copiedLink ? styles.actionBtnCopied : ''}`}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? '✓ Link Copied' : '🔗 Share Calculation'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                >
                  🖨️ Print Sheet
                </button>
              </div>
            </div>

            {/* Quick Spreadsheet Formula Box */}
            <div className={styles.formulaCard}>
              <h3 className={styles.formulaTitle}>📊 Excel &amp; Google Sheets Formula</h3>
              <div className={styles.codeBox}>
                =A2 * (1 + B2) &nbsp;&nbsp;[Cost in A2, Markup% in B2]
              </div>
              <p className={styles.formulaNote}>
                To calculate markup from Price (B2) and Cost (A2): <code>=(B2 - A2) / A2</code>. Format cell as Percentage.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Batch / Multi-Item Spreadsheet Mode */
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.step}>1</span>
            <div>
              <h2 className={styles.cardTitle}>Batch Product Pricing Spreadsheet</h2>
              <p className={styles.cardSubtitle}>
                Paste tab-separated or comma-separated rows directly from Excel or Google Sheets (Columns: Product Name, Cost, Optional Markup %).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              className={styles.batchTextarea}
              value={batchRawText}
              onChange={(e) => setBatchRawText(e.target.value)}
              placeholder="Product Name&#9;Cost&#9;Markup%&#10;T-Shirt&#9;12.50&#9;60"
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor={`${baseId}-def-markup`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Fallback Markup % (if omitted in row):
                </label>
                <input
                  id={`${baseId}-def-markup`}
                  type="number"
                  value={batchDefaultMarkup}
                  onChange={(e) => setBatchDefaultMarkup(e.target.value)}
                  style={{ width: '80px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--line)' }}
                />
              </div>

              <button type="button" className={styles.btnPrimary} onClick={runBatchCalculation}>
                ⚡ Compute Pricing for All Items
              </button>

              {batchResults.length > 0 && (
                <button type="button" className={styles.actionBtn} onClick={handleCopyBatchCSV}>
                  📋 Copy Calculated CSV
                </button>
              )}
            </div>

            {batchResults.length > 0 && (
              <div className={styles.batchTableWrap}>
                <table className={styles.batchTable}>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Unit Cost</th>
                      <th>Markup %</th>
                      <th>Selling Price</th>
                      <th>Gross Profit</th>
                      <th>Gross Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r, i) => (
                      <tr key={i}>
                        <td><strong>{r.name}</strong></td>
                        <td>{formatCurrency(r.cost, currencySymbol)}</td>
                        <td>{formatPercent(r.markupPercent)}</td>
                        <td><strong>{formatCurrency(r.price, currencySymbol)}</strong></td>
                        <td style={{ color: '#059669', fontWeight: 600 }}>+{formatCurrency(r.profit, currencySymbol)}</td>
                        <td>{formatPercent(r.marginPercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
