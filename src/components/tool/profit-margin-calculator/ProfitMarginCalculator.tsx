'use client';

import React, { useState, useEffect, useId, useMemo } from 'react';
import styles from './ProfitMarginCalculator.module.css';
import MarginDiagram from './MarginDiagram';
import {
  calculateGrossMargin,
  calculatePnL,
  priceForTargetMargin,
  calculateProductMix,
  ProductMixItemInput,
} from '@/lib/margin-engine';
import { formatCurrency, formatPercent } from '@/lib/pricing-engine';

type MarginTab = 'gross' | 'pnl' | 'target' | 'mix';

export default function ProfitMarginCalculator() {
  const baseId = useId();

  // Tab State
  const [tab, setTab] = useState<MarginTab>('gross');

  // Currency
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // TAB 1: Gross Margin Inputs
  const [revenueInput, setRevenueInput] = useState<string>('100');
  const [cogsInput, setCogsInput] = useState<string>('60');
  const [isPerUnit, setIsPerUnit] = useState<boolean>(false);
  const [unitsInput, setUnitsInput] = useState<string>('100');

  // TAB 2: Full P&L Waterfall Inputs
  const [grossSalesInput, setGrossSalesInput] = useState<string>('105000');
  const [returnsInput, setReturnsInput] = useState<string>('5000');
  const [pnlCogsInput, setPnlCogsInput] = useState<string>('60000');
  const [rentInput, setRentInput] = useState<string>('5000');
  const [salariesInput, setSalariesInput] = useState<string>('12000');
  const [marketingInput, setMarketingInput] = useState<string>('3000');
  const [daInput, setDaInput] = useState<string>('4000'); // D&A
  const [interestInput, setInterestInput] = useState<string>('2000');
  const [taxInput, setTaxInput] = useState<string>('3000');

  // TAB 3: Target Margin Pricing Inputs
  const [targetCostInput, setTargetCostInput] = useState<string>('60');
  const [targetMarginInput, setTargetMarginInput] = useState<string>('40');
  const [targetFeePercentInput, setTargetFeePercentInput] = useState<string>('0');

  // TAB 4: Multi-Product Mix Inputs
  const [productRows, setProductRows] = useState<ProductMixItemInput[]>([
    { name: 'Core Product A', units: 500, pricePerUnit: 50, costPerUnit: 30 },
    { name: 'Premium Product B', units: 100, pricePerUnit: 120, costPerUnit: 48 },
    { name: 'Economy Add-on C', units: 800, pricePerUnit: 15, costPerUnit: 12 },
  ]);

  // Copy Feedback
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync with URL query parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('rev');
      const c = params.get('cogs');
      const m = params.get('margin');
      const t = params.get('tab') as MarginTab;

      if (r) setRevenueInput(r);
      if (c) setCogsInput(c);
      if (m) setTargetMarginInput(m);
      if (t && ['gross', 'pnl', 'target', 'mix'].includes(t)) {
        setTab(t);
      }
    };

    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  // Primary Computations for Gross Margin
  const grossResult = useMemo(() => {
    const rev = parseFloat(revenueInput) || 0;
    const cogs = parseFloat(cogsInput) || 0;
    const u = isPerUnit ? parseFloat(unitsInput) || 1 : undefined;

    return calculateGrossMargin({
      revenue: rev,
      cogs: cogs,
      units: u,
    });
  }, [revenueInput, cogsInput, isPerUnit, unitsInput]);

  // Primary Computations for Full P&L
  const pnlResult = useMemo(() => {
    return calculatePnL({
      grossSales: parseFloat(grossSalesInput) || 0,
      returnsAndAllowances: parseFloat(returnsInput) || 0,
      cogs: parseFloat(pnlCogsInput) || 0,
      operatingExpenses: {
        rent: parseFloat(rentInput) || 0,
        salaries: parseFloat(salariesInput) || 0,
        marketing: parseFloat(marketingInput) || 0,
      },
      depreciationAmortization: parseFloat(daInput) || 0,
      interest: parseFloat(interestInput) || 0,
      taxes: parseFloat(taxInput) || 0,
    });
  }, [
    grossSalesInput,
    returnsInput,
    pnlCogsInput,
    rentInput,
    salariesInput,
    marketingInput,
    daInput,
    interestInput,
    taxInput,
  ]);

  // Primary Computations for Target Margin Pricing
  const targetResult = useMemo(() => {
    const cost = parseFloat(targetCostInput) || 0;
    const margin = parseFloat(targetMarginInput) || 0;
    const fee = parseFloat(targetFeePercentInput) || 0;
    return priceForTargetMargin(cost, margin, fee);
  }, [targetCostInput, targetMarginInput, targetFeePercentInput]);

  // Primary Computations for Product Mix
  const mixResult = useMemo(() => {
    return calculateProductMix(productRows);
  }, [productRows]);

  // Preset Actions
  const applyPreset = (rev: number, cogs: number) => {
    setRevenueInput(String(rev));
    setCogsInput(String(cogs));
    setTab('gross');
  };

  // Copy Summary
  const handleCopySummary = async () => {
    let summary = '';
    if (tab === 'gross') {
      summary = [
        `--- KKCTools Gross Margin Calculation ---`,
        `Revenue: ${formatCurrency(grossResult.revenue, currencySymbol)}`,
        `COGS: ${formatCurrency(grossResult.cogs, currencySymbol)}`,
        `Gross Profit: ${formatCurrency(grossResult.grossProfit, currencySymbol)}`,
        `Gross Profit Margin: ${formatPercent(grossResult.grossMarginPercent)}`,
        `Markup: ${formatPercent(grossResult.markupPercent)}`,
        `Multiplier: ${grossResult.multiplier !== null ? `${grossResult.multiplier.toFixed(2)}x` : '—'}`,
        grossResult.profitPerUnit !== undefined
          ? `Per-Unit Profit: ${formatCurrency(grossResult.profitPerUnit, currencySymbol)} (Units: ${unitsInput})`
          : '',
        `Calculated with https://kkctools.com/profit-margin-calculator/`,
      ]
        .filter(Boolean)
        .join('\n');
    } else if (tab === 'pnl') {
      summary = [
        `--- KKCTools Income Statement (P&L) Margins ---`,
        `Net Revenue: ${formatCurrency(pnlResult.netRevenue, currencySymbol)}`,
        `COGS: ${formatCurrency(pnlResult.cogs, currencySymbol)}`,
        `Gross Margin: ${formatPercent(pnlResult.grossMarginPercent)} (${formatCurrency(pnlResult.grossProfit, currencySymbol)})`,
        `Operating Expenses (OPEX): ${formatCurrency(pnlResult.operatingExpenses, currencySymbol)}`,
        `Operating Margin (EBIT): ${formatPercent(pnlResult.operatingMarginPercent)} (${formatCurrency(pnlResult.operatingProfit, currencySymbol)})`,
        `EBITDA Margin: ${formatPercent(pnlResult.ebitdaMarginPercent)} (${formatCurrency(pnlResult.ebitda, currencySymbol)})`,
        `Net Profit Margin: ${formatPercent(pnlResult.netMarginPercent)} (${formatCurrency(pnlResult.netProfit, currencySymbol)})`,
        `Calculated with https://kkctools.com/profit-margin-calculator/`,
      ].join('\n');
    } else if (tab === 'target') {
      summary = [
        `--- KKCTools Target Margin Pricing ---`,
        `Unit Cost: ${formatCurrency(parseFloat(targetCostInput) || 0, currencySymbol)}`,
        `Target Gross Margin: ${targetMarginInput}%`,
        `Required Selling Price: ${formatCurrency(targetResult.sellingPrice || 0, currencySymbol)}`,
        `Gross Profit: ${formatCurrency(targetResult.grossProfit || 0, currencySymbol)}`,
        `Equivalent Markup: ${formatPercent(targetResult.equivalentMarkupPercent)}`,
        `Calculated with https://kkctools.com/profit-margin-calculator/`,
      ].join('\n');
    } else if (tab === 'mix') {
      summary = [
        `--- KKCTools Multi-Product Blended Margin ---`,
        `Total Portfolio Revenue: ${formatCurrency(mixResult.totalRevenue, currencySymbol)}`,
        `Total Portfolio Profit: ${formatCurrency(mixResult.totalProfit, currencySymbol)}`,
        `Blended Gross Margin: ${formatPercent(mixResult.blendedMarginPercent)}`,
        `Simple Average of Margins (Unweighted): ${formatPercent(mixResult.simpleAverageMarginPercent)}`,
        `Calculated with https://kkctools.com/profit-margin-calculator/`,
      ].join('\n');
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Share URL with Query Params
  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    if (tab === 'gross') {
      url.searchParams.set('rev', revenueInput);
      url.searchParams.set('cogs', cogsInput);
    } else if (tab === 'target') {
      url.searchParams.set('cost', targetCostInput);
      url.searchParams.set('margin', targetMarginInput);
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Add Product Row in Mix
  const handleAddProductRow = () => {
    setProductRows([
      ...productRows,
      {
        name: `Product ${productRows.length + 1}`,
        units: 100,
        pricePerUnit: 50,
        costPerUnit: 30,
      },
    ]);
  };

  // Remove Product Row in Mix
  const handleRemoveProductRow = (index: number) => {
    if (productRows.length <= 1) return;
    setProductRows(productRows.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrap}>
      {/* Tab Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsBar} role="tablist" aria-label="Profit Margin Calculator Modes">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'gross'}
            className={`${styles.tabBtn} ${tab === 'gross' ? styles.tabActive : ''}`}
            onClick={() => setTab('gross')}
          >
            Gross Profit Margin
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'pnl'}
            className={`${styles.tabBtn} ${tab === 'pnl' ? styles.tabActive : ''}`}
            onClick={() => setTab('pnl')}
          >
            Full P&amp;L (Gross, Operating, Net)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'target'}
            className={`${styles.tabBtn} ${tab === 'target' ? styles.tabActive : ''}`}
            onClick={() => setTab('target')}
          >
            Price for Target Margin
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'mix'}
            className={`${styles.tabBtn} ${tab === 'mix' ? styles.tabActive : ''}`}
            onClick={() => setTab('mix')}
          >
            Product Mix &amp; Blended Margin
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Input Forms */}
        <div className={styles.inputs}>
          {tab === 'gross' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Calculate Gross Margin (GP)</h2>
                  <p className={styles.cardSubtitle}>
                    Enter your top-line sales revenue and direct cost of goods sold (COGS).
                  </p>
                </div>
              </div>

              {/* Quick Benchmark Presets */}
              <div className={styles.presetsBar}>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(100, 60)}
                  title="40% Standard Retail Margin"
                >
                  ⚡ 40% Standard Retail ($100/$60)
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(100, 40)}
                  title="60% Digital / Software Margin"
                >
                  60% Digital / Software
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset(100, 85)}
                  title="15% Grocery / High-Volume Margin"
                >
                  15% Grocery / Volume
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
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor={`${baseId}-rev`} className={styles.label}>
                      Sales Revenue (Total or Unit Price)
                    </label>
                    <span className={styles.labelHint}>Customer price or total sales</span>
                  </div>
                  <div className={styles.inputWrap}>
                    <span className={styles.unitBadge}>{currencySymbol}</span>
                    <input
                      id={`${baseId}-rev`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.input}
                      value={revenueInput}
                      onChange={(e) => setRevenueInput(e.target.value)}
                      placeholder="100.00"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor={`${baseId}-cogs`} className={styles.label}>
                      Cost of Goods Sold (COGS)
                    </label>
                    <span className={styles.labelHint}>Direct materials &amp; direct labor</span>
                  </div>
                  <div className={styles.inputWrap}>
                    <span className={styles.unitBadge}>{currencySymbol}</span>
                    <input
                      id={`${baseId}-cogs`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.input}
                      value={cogsInput}
                      onChange={(e) => setCogsInput(e.target.value)}
                      placeholder="60.00"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    id={`${baseId}-perunit`}
                    type="checkbox"
                    checked={isPerUnit}
                    onChange={(e) => setIsPerUnit(e.target.checked)}
                  />
                  <label htmlFor={`${baseId}-perunit`} style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Include Volume / Units Sold Breakdown
                  </label>
                </div>

                {isPerUnit && (
                  <div className={styles.field}>
                    <label htmlFor={`${baseId}-units`} className={styles.label}>
                      Total Units Sold
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-units`}
                        type="number"
                        min="1"
                        step="1"
                        className={styles.input}
                        value={unitsInput}
                        onChange={(e) => setUnitsInput(e.target.value)}
                        placeholder="100"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>units</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'pnl' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Complete Multi-Tier P&amp;L Cascade</h2>
                  <p className={styles.cardSubtitle}>
                    Follow the waterfall from top-line revenue down to operating and net profit.
                  </p>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className={styles.field}>
                    <label htmlFor={`${baseId}-gs`} className={styles.label}>Gross Sales</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={`${baseId}-gs`}
                        type="number"
                        className={styles.input}
                        value={grossSalesInput}
                        onChange={(e) => setGrossSalesInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={`${baseId}-ret`} className={styles.label}>Returns &amp; Discounts</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={`${baseId}-ret`}
                        type="number"
                        className={styles.input}
                        value={returnsInput}
                        onChange={(e) => setReturnsInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${baseId}-pnlcogs`} className={styles.label}>Cost of Goods Sold (COGS)</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.unitBadge}>{currencySymbol}</span>
                    <input
                      id={`${baseId}-pnlcogs`}
                      type="number"
                      className={styles.input}
                      value={pnlCogsInput}
                      onChange={(e) => setPnlCogsInput(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                    Operating Expenses (OPEX):
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-rent`} className={styles.labelHint}>Rent / Facilities</label>
                      <input
                        id={`${baseId}-rent`}
                        type="number"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px 8px' }}
                        value={rentInput}
                        onChange={(e) => setRentInput(e.target.value)}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-sal`} className={styles.labelHint}>Staff Payroll</label>
                      <input
                        id={`${baseId}-sal`}
                        type="number"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px 8px' }}
                        value={salariesInput}
                        onChange={(e) => setSalariesInput(e.target.value)}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${baseId}-mkt`} className={styles.labelHint}>Marketing</label>
                      <input
                        id={`${baseId}-mkt`}
                        type="number"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px 8px' }}
                        value={marketingInput}
                        onChange={(e) => setMarketingInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                  <div className={styles.field}>
                    <label htmlFor={`${baseId}-da`} className={styles.labelHint}>Depreciation (D&amp;A)</label>
                    <input
                      id={`${baseId}-da`}
                      type="number"
                      className={styles.input}
                      style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px 8px' }}
                      value={daInput}
                      onChange={(e) => setDaInput(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={`${baseId}-int`} className={styles.labelHint}>Interest Expense</label>
                    <input
                      id={`${baseId}-int`}
                      type="number"
                      className={styles.input}
                      style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px 8px' }}
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={`${baseId}-tax`} className={styles.labelHint}>Income Taxes</label>
                    <input
                      id={`${baseId}-tax`}
                      type="number"
                      className={styles.input}
                      style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px 8px' }}
                      value={taxInput}
                      onChange={(e) => setTaxInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'target' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Price for a Target Gross Margin</h2>
                  <p className={styles.cardSubtitle}>
                    Find the exact selling price needed to achieve your target profit percentage.
                  </p>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label htmlFor={`${baseId}-tcost`} className={styles.label}>Product Cost (COGS)</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.unitBadge}>{currencySymbol}</span>
                    <input
                      id={`${baseId}-tcost`}
                      type="number"
                      min="0"
                      className={styles.input}
                      value={targetCostInput}
                      onChange={(e) => setTargetCostInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${baseId}-tmargin`} className={styles.label}>Target Gross Margin (%)</label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-tmargin`}
                      type="number"
                      min="0"
                      max="99.9"
                      className={styles.input}
                      value={targetMarginInput}
                      onChange={(e) => setTargetMarginInput(e.target.value)}
                    />
                    <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${baseId}-tfee`} className={styles.label}>Platform / Card Processing Fee (%)</label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-tfee`}
                      type="number"
                      min="0"
                      max="90"
                      className={styles.input}
                      value={targetFeePercentInput}
                      onChange={(e) => setTargetFeePercentInput(e.target.value)}
                    />
                    <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'mix' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Multi-Product Mix &amp; Blended Margin</h2>
                  <p className={styles.cardSubtitle}>
                    Enter product lines to compute weighted portfolio margin.
                  </p>
                </div>
              </div>

              <div className={styles.batchTableWrap}>
                <table className={styles.batchTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Units</th>
                      <th>Price</th>
                      <th>Cost</th>
                      <th>Margin %</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row, idx) => {
                      const rowMargin = row.pricePerUnit > 0 ? ((row.pricePerUnit - row.costPerUnit) / row.pricePerUnit) * 100 : 0;
                      return (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => {
                                const copy = [...productRows];
                                copy[idx].name = e.target.value;
                                setProductRows(copy);
                              }}
                              style={{ width: '110px', padding: '4px', border: '1px solid var(--line)', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.units}
                              onChange={(e) => {
                                const copy = [...productRows];
                                copy[idx].units = parseFloat(e.target.value) || 0;
                                setProductRows(copy);
                              }}
                              style={{ width: '60px', padding: '4px', border: '1px solid var(--line)', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.pricePerUnit}
                              onChange={(e) => {
                                const copy = [...productRows];
                                copy[idx].pricePerUnit = parseFloat(e.target.value) || 0;
                                setProductRows(copy);
                              }}
                              style={{ width: '60px', padding: '4px', border: '1px solid var(--line)', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.costPerUnit}
                              onChange={(e) => {
                                const copy = [...productRows];
                                copy[idx].costPerUnit = parseFloat(e.target.value) || 0;
                                setProductRows(copy);
                              }}
                              style={{ width: '60px', padding: '4px', border: '1px solid var(--line)', borderRadius: '4px' }}
                            />
                          </td>
                          <td style={{ fontWeight: 700, color: rowMargin >= 0 ? '#059669' : '#dc2626' }}>
                            {formatPercent(rowMargin)}
                          </td>
                          <td>
                            {productRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProductRow(idx)}
                                style={{ background: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                className={styles.presetBtn}
                onClick={handleAddProductRow}
                style={{ marginTop: '12px' }}
              >
                + Add Another Product
              </button>

              <div className={styles.warningBox}>
                <strong>⚠️ Why Average of Margins Fails:</strong> The simple average of your margins is{' '}
                <strong>{formatPercent(mixResult.simpleAverageMarginPercent)}</strong>, but your true volume-weighted blended margin is{' '}
                <strong>{formatPercent(mixResult.blendedMarginPercent)}</strong>. High-volume items always pull the overall business margin toward their own margin rate.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Results Card & Interactive Diagram */}
        <div className={styles.results}>
          <div className={styles.resultCard}>
            <div className={styles.resultHero}>
              <span className={styles.resultHeroLabel}>
                {tab === 'pnl' ? 'Bottom-Line Net Profit Margin' : tab === 'target' ? 'Required Selling Price' : tab === 'mix' ? 'Blended Portfolio Margin' : 'Gross Profit Margin'}
              </span>
              <div className={styles.resultHeroValue}>
                {tab === 'target'
                  ? formatCurrency(targetResult.sellingPrice || 0, currencySymbol)
                  : tab === 'pnl'
                  ? formatPercent(pnlResult.netMarginPercent)
                  : tab === 'mix'
                  ? formatPercent(mixResult.blendedMarginPercent)
                  : formatPercent(grossResult.grossMarginPercent)}
              </div>
              <p className={styles.resultHeroSentence}>
                {tab === 'gross' && (
                  <>
                    At <strong>{formatCurrency(grossResult.revenue, currencySymbol)}</strong> revenue and{' '}
                    <strong>{formatCurrency(grossResult.cogs, currencySymbol)}</strong> COGS, you retain{' '}
                    <strong>{formatCurrency(grossResult.grossProfit, currencySymbol)}</strong> gross profit (
                    <strong>{formatPercent(grossResult.grossMarginPercent)}</strong> of sales) with a{' '}
                    <strong>{formatPercent(grossResult.markupPercent)}</strong> markup on cost.
                  </>
                )}
                {tab === 'pnl' && (
                  <>
                    From <strong>{formatCurrency(pnlResult.netRevenue, currencySymbol)}</strong> net sales, your company achieves a{' '}
                    <strong>{formatPercent(pnlResult.grossMarginPercent)}</strong> gross margin,{' '}
                    <strong>{formatPercent(pnlResult.operatingMarginPercent)}</strong> operating margin (EBIT), and clears{' '}
                    <strong>{formatCurrency(pnlResult.netProfit, currencySymbol)}</strong> net income (
                    <strong>{formatPercent(pnlResult.netMarginPercent)}</strong> net margin).
                  </>
                )}
                {tab === 'target' && (
                  <>
                    To achieve a <strong>{targetMarginInput}%</strong> gross margin on{' '}
                    <strong>{formatCurrency(parseFloat(targetCostInput) || 0, currencySymbol)}</strong> cost, charge{' '}
                    <strong>{formatCurrency(targetResult.sellingPrice || 0, currencySymbol)}</strong> per unit (an equivalent{' '}
                    <strong>{formatPercent(targetResult.equivalentMarkupPercent)}</strong> markup).
                  </>
                )}
                {tab === 'mix' && (
                  <>
                    Across all {productRows.length} product lines, total revenue is{' '}
                    <strong>{formatCurrency(mixResult.totalRevenue, currencySymbol)}</strong> with{' '}
                    <strong>{formatCurrency(mixResult.totalProfit, currencySymbol)}</strong> total profit, producing an exact{' '}
                    <strong>{formatPercent(mixResult.blendedMarginPercent)}</strong> weighted blended margin.
                  </>
                )}
              </p>
            </div>

            {/* Metrics Strip */}
            <div className={styles.metricsGrid}>
              <div className={`${styles.metricBox} ${styles.metricBoxHighlight}`}>
                <span className={styles.metricBoxLabel}>Gross Margin</span>
                <span className={`${styles.metricBoxVal} ${styles.metricBoxValHighlight}`}>
                  {tab === 'pnl' ? formatPercent(pnlResult.grossMarginPercent) : tab === 'mix' ? formatPercent(mixResult.blendedMarginPercent) : formatPercent(grossResult.grossMarginPercent)}
                </span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricBoxLabel}>Operating (EBIT)</span>
                <span className={styles.metricBoxVal}>
                  {tab === 'pnl' ? formatPercent(pnlResult.operatingMarginPercent) : '—'}
                </span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricBoxLabel}>Markup on Cost</span>
                <span className={styles.metricBoxVal}>
                  {tab === 'target' ? formatPercent(targetResult.equivalentMarkupPercent) : formatPercent(grossResult.markupPercent)}
                </span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricBoxLabel}>Gross Profit</span>
                <span className={styles.metricBoxVal}>
                  {tab === 'pnl' ? formatCurrency(pnlResult.grossProfit, currencySymbol) : tab === 'mix' ? formatCurrency(mixResult.totalProfit, currencySymbol) : formatCurrency(grossResult.grossProfit, currencySymbol)}
                </span>
              </div>
            </div>

            {/* Interactive Visual SVG Diagram */}
            <MarginDiagram
              revenue={tab === 'pnl' ? pnlResult.netRevenue : tab === 'mix' ? mixResult.totalRevenue : grossResult.revenue}
              cogs={tab === 'pnl' ? pnlResult.cogs : tab === 'mix' ? mixResult.totalCost : grossResult.cogs}
              grossProfit={tab === 'pnl' ? pnlResult.grossProfit : tab === 'mix' ? mixResult.totalProfit : grossResult.grossProfit}
              grossMarginPercent={tab === 'pnl' ? pnlResult.grossMarginPercent : tab === 'mix' ? mixResult.blendedMarginPercent : grossResult.grossMarginPercent}
              opex={tab === 'pnl' ? pnlResult.operatingExpenses : 0}
              operatingProfit={tab === 'pnl' ? pnlResult.operatingProfit : undefined}
              operatingMarginPercent={tab === 'pnl' ? pnlResult.operatingMarginPercent : undefined}
              netProfit={tab === 'pnl' ? pnlResult.netProfit : undefined}
              netMarginPercent={tab === 'pnl' ? pnlResult.netMarginPercent : undefined}
              currencySymbol={currencySymbol}
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
            <h3 className={styles.formulaTitle}>📊 Excel &amp; Google Sheets Margin Formula</h3>
            <div className={styles.codeBox}>
              =(Revenue - COGS) / Revenue &nbsp;&nbsp;[=(A2 - B2) / A2]
            </div>
            <p className={styles.formulaNote}>
              Format the formula cell as <strong>Percentage (%)</strong>. For Net Profit Margin: <code>=Net_Income / Revenue</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
