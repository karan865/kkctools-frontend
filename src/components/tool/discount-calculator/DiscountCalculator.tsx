'use client';

import React, { useState, useId, useEffect, useMemo, useCallback } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './DiscountCalculator.module.css';
import {
  calculateDiscount,
  reverseDiscount,
  calculateDeal,
  generateDiscountTable,
  generateCommonPricesMatrix,
  DealType,
} from '@/lib/discount-engine';
import DiscountDiagram from './DiscountDiagram';

export type DiscountTab = 'forward' | 'reverse' | 'deals' | 'table';

const DISCOUNT_TABS: { id: DiscountTab; label: string }[] = [
  { id: 'forward', label: '🏷️ Percent Off & Sale Price' },
  { id: 'reverse', label: '🔄 Reverse (Find Original or %)' },
  { id: 'deals', label: '🎁 BOGO & Retail Deals' },
  { id: 'table', label: '📋 Reference Table ($10–$200)' },
];

export default function DiscountCalculator() {
  const [activeTab, setActiveTab] = useState<DiscountTab>('forward');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Tab 1: Forward Mode State
  const [originalPriceStr, setOriginalPriceStr] = useState<string>('100');
  const [discountPercentStr, setDiscountPercentStr] = useState<string>('20');
  const [couponAmountStr, setCouponAmountStr] = useState<string>('0');
  const [couponOrder, setCouponOrder] = useState<'percent-first' | 'coupon-first'>('percent-first');
  const [stackedDiscountPercentStr, setStackedDiscountPercentStr] = useState<string>('0');
  const [taxPercentStr, setTaxPercentStr] = useState<string>('0');
  const [taxTiming, setTaxTiming] = useState<'after-discount' | 'before-discount'>('after-discount');

  // Accordion open/close states
  const [isCouponOpen, setIsCouponOpen] = useState<boolean>(false);
  const [isStackedOpen, setIsStackedOpen] = useState<boolean>(false);
  const [isTaxOpen, setIsTaxOpen] = useState<boolean>(false);

  // Tab 2: Reverse Mode State
  const [reverseMode, setReverseMode] = useState<'find-original' | 'find-percent' | 'find-target'>('find-original');
  const [revSalePriceStr, setRevSalePriceStr] = useState<string>('80');
  const [revDiscountPercentStr, setRevDiscountPercentStr] = useState<string>('20');
  const [revOriginalPriceStr, setRevOriginalPriceStr] = useState<string>('120');
  const [revDesiredSavingsStr, setRevDesiredSavingsStr] = useState<string>('30');

  // Tab 3: Deals & BOGO State
  const [dealType, setDealType] = useState<DealType>('bogo-free');
  const [dealItemPriceStr, setDealItemPriceStr] = useState<string>('50');
  const [secondItemPctStr, setSecondItemPctStr] = useState<string>('50');
  const [buyQtyStr, setBuyQtyStr] = useState<string>('2');
  const [getQtyStr, setGetQtyStr] = useState<string>('1');
  const [spendThresholdStr, setSpendThresholdStr] = useState<string>('100');
  const [saveAmountStr, setSaveAmountStr] = useState<string>('20');
  const [bundleQtyStr, setBundleQtyStr] = useState<string>('3');
  const [bundleTotalPriceStr, setBundleTotalPriceStr] = useState<string>('25');

  // Tab 4: Reference Table Search
  const [tableSearch, setTableSearch] = useState<string>('');

  // Feedback states
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  // Unique IDs for accessibility
  const origPriceId = useId();
  const discPctId = useId();
  const couponId = useId();
  const stackedPctId = useId();
  const taxPctId = useId();
  const revSaleId = useId();
  const revPctId = useId();
  const revOrigId = useId();
  const revSaveId = useId();
  const dealPriceId = useId();

  // Quick preset percentages
  const standardPresets = [10, 15, 20, 25, 30, 40, 50, 75];

  // Forward Calculation
  const forwardResult = useMemo(() => {
    const orig = parseFloat(originalPriceStr) || 0;
    const disc = parseFloat(discountPercentStr) || 0;
    const coupon = parseFloat(couponAmountStr) || 0;
    const stacked = parseFloat(stackedDiscountPercentStr) || 0;
    const tax = parseFloat(taxPercentStr) || 0;

    return calculateDiscount({
      originalPrice: orig,
      discountPercent: disc,
      couponAmount: coupon,
      couponOrder,
      stackedDiscountPercent: stacked,
      taxPercent: tax,
      taxTiming,
    });
  }, [
    originalPriceStr,
    discountPercentStr,
    couponAmountStr,
    couponOrder,
    stackedDiscountPercentStr,
    taxPercentStr,
    taxTiming,
  ]);

  // Forward summary sentence
  const forwardSummary = useMemo(() => {
    return `Saving ${currencySymbol}${forwardResult.totalSavings.toFixed(2)} on a ${currencySymbol}${forwardResult.originalPrice.toFixed(2)} purchase (${forwardResult.effectiveDiscountPercent.toFixed(1)}% total savings).`;
  }, [currencySymbol, forwardResult]);

  // Reverse Calculation
  const reverseResult = useMemo(() => {
    return reverseDiscount({
      mode: reverseMode,
      originalPrice: parseFloat(revOriginalPriceStr) || 0,
      salePrice: parseFloat(revSalePriceStr) || 0,
      discountPercent: parseFloat(revDiscountPercentStr) || 0,
      desiredSavings: parseFloat(revDesiredSavingsStr) || 0,
    });
  }, [
    reverseMode,
    revOriginalPriceStr,
    revSalePriceStr,
    revDiscountPercentStr,
    revDesiredSavingsStr,
  ]);

  // Reverse summary sentence
  const reverseSummary = useMemo(() => {
    if (reverseMode === 'find-original') {
      return `An item on sale for ${currencySymbol}${reverseResult.salePrice.toFixed(2)} with a ${reverseResult.discountPercent}% discount had an original MSRP of ${currencySymbol}${reverseResult.originalPrice.toFixed(2)}.`;
    }
    if (reverseMode === 'find-percent') {
      return `A discount from ${currencySymbol}${reverseResult.originalPrice.toFixed(2)} to ${currencySymbol}${reverseResult.salePrice.toFixed(2)} equals ${reverseResult.discountPercent.toFixed(1)}% off, saving ${currencySymbol}${reverseResult.savingsDollars.toFixed(2)}.`;
    }
    return `To save ${currencySymbol}${reverseResult.savingsDollars.toFixed(2)} on a ${currencySymbol}${reverseResult.originalPrice.toFixed(2)} item, target price is ${currencySymbol}${reverseResult.salePrice.toFixed(2)} (${reverseResult.discountPercent.toFixed(1)}% off).`;
  }, [currencySymbol, reverseMode, reverseResult]);

  // Deals Calculation
  const dealResult = useMemo(() => {
    return calculateDeal({
      type: dealType,
      itemPrice: parseFloat(dealItemPriceStr) || 0,
      secondItemDiscountPercent: parseFloat(secondItemPctStr) || 50,
      buyQty: parseInt(buyQtyStr, 10) || 2,
      getQty: parseInt(getQtyStr, 10) || 1,
      spendThreshold: parseFloat(spendThresholdStr) || 100,
      saveAmount: parseFloat(saveAmountStr) || 20,
      bundleQty: parseInt(bundleQtyStr, 10) || 3,
      bundleTotalPrice: parseFloat(bundleTotalPriceStr) || 25,
    });
  }, [
    dealType,
    dealItemPriceStr,
    secondItemPctStr,
    buyQtyStr,
    getQtyStr,
    spendThresholdStr,
    saveAmountStr,
    bundleQtyStr,
    bundleTotalPriceStr,
  ]);

  // Dynamic Table & Matrix Data
  const dynamicTable = useMemo(() => {
    const p = parseFloat(originalPriceStr) || 100;
    return generateDiscountTable(p > 0 ? p : 100);
  }, [originalPriceStr]);

  const commonMatrix = useMemo(() => {
    return generateCommonPricesMatrix();
  }, []);

  // Filtered Dynamic Table
  const filteredDynamicTable = useMemo(() => {
    if (!tableSearch.trim()) return dynamicTable;
    const q = tableSearch.toLowerCase().replace('$', '').replace('%', '').trim();
    return dynamicTable.filter(
      (row) =>
        row.percent.toString().includes(q) ||
        row.salePrice.toFixed(2).includes(q) ||
        row.savings.toFixed(2).includes(q)
    );
  }, [dynamicTable, tableSearch]);

  // Sync state from URL query on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam && ['forward', 'reverse', 'deals', 'table'].includes(tabParam)) {
          setActiveTab(tabParam as DiscountTab);
        }
        const p = params.get('price');
        const d = params.get('discount');
        const cur = params.get('cur');
        if (p) setOriginalPriceStr(p);
        if (d) setDiscountPercentStr(d);
        if (cur) setCurrencySymbol(cur);
      } catch {
        // Safe fallback
      }
    };

    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync URL query params on state update
  const syncToUrl = useCallback(
    (tab: DiscountTab) => {
      if (typeof window === 'undefined') return;
      try {
        const params = new URLSearchParams();
        params.set('tab', tab);
        params.set('price', originalPriceStr);
        params.set('discount', discountPercentStr);
        if (currencySymbol !== '$') params.set('cur', currencySymbol);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
      } catch {
        // Safe fallback
      }
    },
    [originalPriceStr, discountPercentStr, currencySymbol]
  );

  useEffect(() => {
    syncToUrl(activeTab);
  }, [activeTab, syncToUrl]);

  // Actions
  const handleCopySummary = () => {
    let text = '';
    if (activeTab === 'forward') {
      text = `=== Discount & Sale Price Calculation ===\n`;
      text += `${forwardSummary}\n\n`;
      text += `• Original MSRP: ${currencySymbol}${forwardResult.originalPrice.toFixed(2)}\n`;
      text += `• Primary Discount: ${discountPercentStr}%\n`;
      if (parseFloat(stackedDiscountPercentStr) > 0) {
        text += `• Stacked Discount: +${stackedDiscountPercentStr}%\n`;
      }
      if (parseFloat(couponAmountStr) > 0) {
        text += `• Fixed Coupon: -${currencySymbol}${parseFloat(couponAmountStr).toFixed(2)}\n`;
      }
      text += `• Final Sale Price: ${currencySymbol}${forwardResult.salePrice.toFixed(2)}\n`;
      text += `• Total You Save: ${currencySymbol}${forwardResult.totalSavings.toFixed(2)} (${forwardResult.effectiveDiscountPercent.toFixed(1)}% total)\n`;
      if (forwardResult.taxAmount > 0) {
        text += `• Sales Tax (${taxPercentStr}%): +${currencySymbol}${forwardResult.taxAmount.toFixed(2)}\n`;
        text += `• Total with Tax: ${currencySymbol}${forwardResult.finalPriceWithTax.toFixed(2)}\n`;
      }
      text += `\nCalculated at KKCTools: https://kkctools.com/discount-calculator/`;
    } else if (activeTab === 'reverse') {
      text = `=== Reverse Discount Calculation ===\n`;
      text += `${reverseSummary}\n`;
      text += `• Original MSRP: ${currencySymbol}${reverseResult.originalPrice.toFixed(2)}\n`;
      text += `• Sale Price: ${currencySymbol}${reverseResult.salePrice.toFixed(2)}\n`;
      text += `• Discount: ${reverseResult.discountPercent.toFixed(1)}%\n`;
      text += `• Savings: ${currencySymbol}${reverseResult.savingsDollars.toFixed(2)}\n`;
      text += `\nCalculated at KKCTools: https://kkctools.com/discount-calculator/?tab=reverse`;
    } else if (activeTab === 'deals') {
      text = `=== Retail Deal & BOGO Calculation ===\n`;
      text += `${dealResult.explanation}\n\n`;
      text += `• Deal Type: ${dealResult.dealName}\n`;
      text += `• Total Deal Price: ${currencySymbol}${dealResult.totalSalePrice.toFixed(2)}\n`;
      text += `• Effective Unit Price: ${currencySymbol}${dealResult.pricePerUnit.toFixed(2)}/item\n`;
      text += `• Total Savings: ${currencySymbol}${dealResult.totalSavings.toFixed(2)} (${dealResult.effectiveDiscountPercent.toFixed(1)}% off)\n`;
      text += `\nCalculated at KKCTools: https://kkctools.com/discount-calculator/?tab=deals`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleShareUrl = () => {
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

  return (
    <div className={styles.wrap}>
      {/* Navigation Tabs Bar */}
      <TabSlider
        tabs={DISCOUNT_TABS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as DiscountTab)}
        ariaLabel="Discount Calculator Modes"
      />

      {/* ==================================================== */}
      {/* TAB 1: FORWARD DISCOUNT (PERCENT OFF & CHECKOUT)      */}
      {/* ==================================================== */}
      {activeTab === 'forward' && (
        <div className={styles.grid}>
          {/* Inputs Column */}
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <span className={styles.step}>1</span>
                  <div>
                    <h2 className={styles.cardTitle}>Price &amp; Discount Rate</h2>
                    <p className={styles.cardSubtitle}>
                      Enter the sticker price and store discount percentage
                    </p>
                  </div>
                </div>
                <select
                  className={styles.select}
                  style={{ width: '84px', height: '32px', fontSize: '0.8rem' }}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  aria-label="Currency"
                >
                  <option value="$">$ (USD)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="₹">₹ (INR)</option>
                  <option value="A$">A$ (AUD)</option>
                  <option value="C$">C$ (CAD)</option>
                </select>
              </div>

              {/* Original Price */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor={origPriceId}>
                  <span>Original Price (MSRP)</span>
                  <span className={styles.labelHint}>Pre-sale sticker tag</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.unitBadge}>{currencySymbol}</span>
                  <input
                    id={origPriceId}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={originalPriceStr}
                    onChange={(e) => setOriginalPriceStr(e.target.value)}
                    placeholder="100.00"
                  />
                </div>
              </div>

              {/* Primary Discount % */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor={discPctId}>
                  <span>Discount Percentage</span>
                  <span className={styles.labelHint}>Store mark-down %</span>
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={discPctId}
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className={styles.input}
                    value={discountPercentStr}
                    onChange={(e) => setDiscountPercentStr(e.target.value)}
                    placeholder="20"
                  />
                  <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                </div>

                {/* Quick Presets */}
                <div className={styles.chipGroup}>
                  {standardPresets.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`${styles.chip} ${discountPercentStr === pct.toString() ? styles.chipActive : ''}`}
                      onClick={() => setDiscountPercentStr(pct.toString())}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion 1: Dollar Coupon */}
              <div className={styles.accordion}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                >
                  <span>🏷️ Fixed Dollar Coupon ({currencySymbol} Off)</span>
                  <span>{isCouponOpen ? '▲' : '▼'}</span>
                </button>
                {isCouponOpen && (
                  <div className={styles.accordionBody}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={couponId}>
                        <span>Coupon Voucher Value</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.unitBadge}>{currencySymbol}</span>
                        <input
                          id={couponId}
                          type="number"
                          min="0"
                          step="0.5"
                          className={styles.input}
                          value={couponAmountStr}
                          onChange={(e) => setCouponAmountStr(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Application Sequence</label>
                      <select
                        className={styles.select}
                        value={couponOrder}
                        onChange={(e) => setCouponOrder(e.target.value as 'percent-first' | 'coupon-first')}
                      >
                        <option value="percent-first">Percentage off first, then coupon (Standard store policy)</option>
                        <option value="coupon-first">Coupon first, then percentage off</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Stacked Second Discount */}
              <div className={styles.accordion}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => setIsStackedOpen(!isStackedOpen)}
                >
                  <span>➕ Stacked Secondary Discount (Extra Promo %)</span>
                  <span>{isStackedOpen ? '▲' : '▼'}</span>
                </button>
                {isStackedOpen && (
                  <div className={styles.accordionBody}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={stackedPctId}>
                        <span>Additional Discount Rate</span>
                        <span className={styles.labelHint}>e.g. Extra 10% Clearance</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={stackedPctId}
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className={styles.input}
                          value={stackedDiscountPercentStr}
                          onChange={(e) => setStackedDiscountPercentStr(e.target.value)}
                          placeholder="0"
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                      <div className={styles.chipGroup}>
                        {[5, 10, 15, 20].map((extra) => (
                          <button
                            key={extra}
                            type="button"
                            className={`${styles.chip} ${stackedDiscountPercentStr === extra.toString() ? styles.chipActive : ''}`}
                            onClick={() => setStackedDiscountPercentStr(extra.toString())}
                          >
                            +{extra}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Sales Tax */}
              <div className={styles.accordion}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => setIsTaxOpen(!isTaxOpen)}
                >
                  <span>🏛️ Estimated Sales Tax / VAT</span>
                  <span>{isTaxOpen ? '▲' : '▼'}</span>
                </button>
                {isTaxOpen && (
                  <div className={styles.accordionBody}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={taxPctId}>
                        <span>Sales Tax / VAT Rate</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={taxPctId}
                          type="number"
                          min="0"
                          max="50"
                          step="0.25"
                          className={styles.input}
                          value={taxPercentStr}
                          onChange={(e) => setTaxPercentStr(e.target.value)}
                          placeholder="0"
                        />
                        <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                      </div>
                      <div className={styles.chipGroup}>
                        {[0, 5, 7, 8.25, 10, 20].map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`${styles.chip} ${taxPercentStr === t.toString() ? styles.chipActive : ''}`}
                            onClick={() => setTaxPercentStr(t.toString())}
                          >
                            {t === 0 ? '0% (Tax-Free)' : t === 20 ? '20% (UK VAT)' : `${t}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Tax Calculation Timing</label>
                      <select
                        className={styles.select}
                        value={taxTiming}
                        onChange={(e) => setTaxTiming(e.target.value as 'after-discount' | 'before-discount')}
                      >
                        <option value="after-discount">Tax applied after discount (Standard retail practice)</option>
                        <option value="before-discount">Tax calculated on original MSRP (Manufacturer rebates)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Column (Sticky) */}
          <div className={styles.results}>
            {/* Hero Result Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Final Sale Price</span>
              <span className={styles.heroValue}>
                {currencySymbol}
                {forwardResult.salePrice.toFixed(2)}
              </span>
              <span className={styles.heroSub}>
                {forwardResult.taxAmount > 0
                  ? `With ${taxPercentStr}% tax: ${currencySymbol}${forwardResult.finalPriceWithTax.toFixed(2)} • You save ${currencySymbol}${forwardResult.totalSavings.toFixed(2)}`
                  : `You save ${currencySymbol}${forwardResult.totalSavings.toFixed(2)} (${forwardResult.effectiveDiscountPercent.toFixed(1)}% total discount)`}
              </span>
            </div>

            {/* Summary Banner */}
            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>{forwardSummary}</p>
            </div>

            {/* Visual Diagram Waterfall */}
            <div className={styles.card}>
              <DiscountDiagram
                originalPrice={forwardResult.originalPrice}
                salePrice={forwardResult.salePrice}
                totalSavings={forwardResult.totalSavings}
                effectiveDiscountPercent={forwardResult.effectiveDiscountPercent}
                percentSavingsOnly={forwardResult.percentSavingsOnly}
                couponSavingsOnly={forwardResult.couponSavingsOnly}
                stackedSavingsOnly={forwardResult.stackedSavingsOnly}
                taxAmount={forwardResult.taxAmount}
                finalPriceWithTax={forwardResult.finalPriceWithTax}
              />
            </div>

            {/* Metrics Breakdown Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <span className={styles.step}>2</span>
                  <div>
                    <h3 className={styles.cardTitle}>Complete Savings Breakdown</h3>
                    <p className={styles.cardSubtitle}>
                      Exact dollar values and effective rate
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Original MSRP</span>
                  <span className={styles.metricVal}>
                    {currencySymbol}
                    {forwardResult.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Total You Save</span>
                  <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                    {currencySymbol}
                    {forwardResult.totalSavings.toFixed(2)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Effective Discount</span>
                  <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                    {forwardResult.effectiveDiscountPercent.toFixed(1)}%
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Total w/ Tax</span>
                  <span className={styles.metricVal}>
                    {currencySymbol}
                    {forwardResult.finalPriceWithTax.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsBar}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                  onClick={handleCopySummary}
                >
                  {copied ? '✓ Copied' : '📋 Copy Results'}
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                  onClick={handleShareUrl}
                >
                  {shared ? '✓ URL Copied' : '🔗 Share URL'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handlePrint}
                >
                  🖨️ Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: REVERSE DISCOUNT (ORIGINAL OR PERCENTAGE)     */}
      {/* ==================================================== */}
      {activeTab === 'reverse' && (
        <div className={styles.grid}>
          {/* Inputs Column */}
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <span className={styles.step}>1</span>
                  <div>
                    <h2 className={styles.cardTitle}>Reverse Calculation Mode</h2>
                    <p className={styles.cardSubtitle}>
                      Determine original MSRP, percentage markdown, or target price
                    </p>
                  </div>
                </div>
                <select
                  className={styles.select}
                  style={{ width: '84px', height: '32px', fontSize: '0.8rem' }}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  aria-label="Currency"
                >
                  <option value="$">$ (USD)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="₹">₹ (INR)</option>
                  <option value="A$">A$ (AUD)</option>
                  <option value="C$">C$ (CAD)</option>
                </select>
              </div>

              {/* Submode Selection */}
              <div className={styles.field}>
                <label className={styles.label}>Select What to Calculate</label>
                <div className={styles.chipGroup}>
                  <button
                    type="button"
                    className={`${styles.chip} ${reverseMode === 'find-original' ? styles.chipActive : ''}`}
                    onClick={() => setReverseMode('find-original')}
                  >
                    🏷️ Find Original MSRP
                  </button>
                  <button
                    type="button"
                    className={`${styles.chip} ${reverseMode === 'find-percent' ? styles.chipActive : ''}`}
                    onClick={() => setReverseMode('find-percent')}
                  >
                    📊 Calculate Discount %
                  </button>
                  <button
                    type="button"
                    className={`${styles.chip} ${reverseMode === 'find-target' ? styles.chipActive : ''}`}
                    onClick={() => setReverseMode('find-target')}
                  >
                    🎯 Target Price for Savings
                  </button>
                </div>
              </div>

              {/* Mode A: Find Original */}
              {reverseMode === 'find-original' && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={revSaleId}>
                      <span>Sale Price (What you paid)</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={revSaleId}
                        type="number"
                        min="0"
                        step="0.01"
                        className={styles.input}
                        value={revSalePriceStr}
                        onChange={(e) => setRevSalePriceStr(e.target.value)}
                        placeholder="80.00"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={revPctId}>
                      <span>Known Discount Percentage</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={revPctId}
                        type="number"
                        min="0"
                        max="99.9"
                        step="0.5"
                        className={styles.input}
                        value={revDiscountPercentStr}
                        onChange={(e) => setRevDiscountPercentStr(e.target.value)}
                        placeholder="20"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                    </div>
                    <div className={styles.chipGroup}>
                      {standardPresets.map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className={`${styles.chip} ${revDiscountPercentStr === pct.toString() ? styles.chipActive : ''}`}
                          onClick={() => setRevDiscountPercentStr(pct.toString())}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mode B: Find Percent */}
              {reverseMode === 'find-percent' && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={revOrigId}>
                      <span>Original Price (MSRP)</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={revOrigId}
                        type="number"
                        min="0"
                        step="0.01"
                        className={styles.input}
                        value={revOriginalPriceStr}
                        onChange={(e) => setRevOriginalPriceStr(e.target.value)}
                        placeholder="120.00"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={revSaleId}>
                      <span>Sale Price Offered</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={revSaleId}
                        type="number"
                        min="0"
                        step="0.01"
                        className={styles.input}
                        value={revSalePriceStr}
                        onChange={(e) => setRevSalePriceStr(e.target.value)}
                        placeholder="80.00"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Mode C: Find Target */}
              {reverseMode === 'find-target' && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={revOrigId}>
                      <span>Original Price (MSRP)</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={revOrigId}
                        type="number"
                        min="0"
                        step="0.01"
                        className={styles.input}
                        value={revOriginalPriceStr}
                        onChange={(e) => setRevOriginalPriceStr(e.target.value)}
                        placeholder="100.00"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={revSaveId}>
                      <span>Desired Dollar Savings</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id={revSaveId}
                        type="number"
                        min="0"
                        step="0.5"
                        className={styles.input}
                        value={revDesiredSavingsStr}
                        onChange={(e) => setRevDesiredSavingsStr(e.target.value)}
                        placeholder="30.00"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results Column (Sticky) */}
          <div className={styles.results}>
            {/* Hero Result Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>
                {reverseMode === 'find-original'
                  ? 'Original Sticker Price (MSRP)'
                  : reverseMode === 'find-percent'
                    ? 'Calculated Discount Rate'
                    : 'Target Sale Price'}
              </span>
              <span className={styles.heroValue}>
                {reverseMode === 'find-original' &&
                  `${currencySymbol}${reverseResult.originalPrice.toFixed(2)}`}
                {reverseMode === 'find-percent' &&
                  `${reverseResult.discountPercent.toFixed(1)}%`}
                {reverseMode === 'find-target' &&
                  `${currencySymbol}${reverseResult.salePrice.toFixed(2)}`}
              </span>
              <span className={styles.heroSub}>
                {reverseMode === 'find-original' &&
                  `Before ${revDiscountPercentStr}% store discount • You save ${currencySymbol}${reverseResult.savingsDollars.toFixed(2)}`}
                {reverseMode === 'find-percent' &&
                  `Saved ${currencySymbol}${reverseResult.savingsDollars.toFixed(2)} on ${currencySymbol}${parseFloat(revOriginalPriceStr).toFixed(2)} item`}
                {reverseMode === 'find-target' &&
                  `Required discount: ${reverseResult.discountPercent.toFixed(1)}% to save ${currencySymbol}${reverseResult.savingsDollars.toFixed(2)}`}
              </span>
            </div>

            {/* Summary Banner */}
            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>{reverseSummary}</p>
            </div>

            {/* Metrics Breakdown Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <span className={styles.step}>2</span>
                  <div>
                    <h3 className={styles.cardTitle}>Reverse Price Summary</h3>
                    <p className={styles.cardSubtitle}>Key values verified by reverse formula</p>
                  </div>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Original MSRP</span>
                  <span className={styles.metricVal}>
                    {currencySymbol}
                    {reverseResult.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Sale Price</span>
                  <span className={styles.metricVal}>
                    {currencySymbol}
                    {reverseResult.salePrice.toFixed(2)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Discount %</span>
                  <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                    {reverseResult.discountPercent.toFixed(1)}%
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Total Savings</span>
                  <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                    {currencySymbol}
                    {reverseResult.savingsDollars.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsBar}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                  onClick={handleCopySummary}
                >
                  {copied ? '✓ Copied' : '📋 Copy Results'}
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                  onClick={handleShareUrl}
                >
                  {shared ? '✓ URL Copied' : '🔗 Share URL'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handlePrint}
                >
                  🖨️ Print Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: BOGO & RETAIL DEALS                           */}
      {/* ==================================================== */}
      {activeTab === 'deals' && (
        <div className={styles.grid}>
          {/* Inputs Column */}
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <span className={styles.step}>1</span>
                  <div>
                    <h2 className={styles.cardTitle}>Retail Deal Type &amp; Terms</h2>
                    <p className={styles.cardSubtitle}>
                      Calculate real per-item savings on common store promotions
                    </p>
                  </div>
                </div>
                <select
                  className={styles.select}
                  style={{ width: '84px', height: '32px', fontSize: '0.8rem' }}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  aria-label="Currency"
                >
                  <option value="$">$ (USD)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="₹">₹ (INR)</option>
                  <option value="A$">A$ (AUD)</option>
                  <option value="C$">C$ (CAD)</option>
                </select>
              </div>

              {/* Deal Type Selection */}
              <div className={styles.field}>
                <label className={styles.label}>Promotion Type</label>
                <select
                  className={styles.select}
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value as DealType)}
                >
                  <option value="bogo-free">Buy 1, Get 1 Free (BOGO Free)</option>
                  <option value="bogo-percent">Buy 1, Get 2nd at % Off (e.g. 50% off second)</option>
                  <option value="buy-x-get-y">Buy X, Get Y Free (e.g. Buy 2, Get 1 Free)</option>
                  <option value="spend-x-save-y">Spend $X, Save $Y Off (Threshold rebate)</option>
                  <option value="bundle">Bundle / Multi-pack Pricing (e.g. 3 for $25)</option>
                </select>
              </div>

              {/* Item Price */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor={dealPriceId}>
                  <span>Single Item MSRP</span>
                  <span className={styles.labelHint}>Regular price per unit</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.unitBadge}>{currencySymbol}</span>
                  <input
                    id={dealPriceId}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={dealItemPriceStr}
                    onChange={(e) => setDealItemPriceStr(e.target.value)}
                    placeholder="50.00"
                  />
                </div>
              </div>

              {/* Conditional parameters based on DealType */}
              {dealType === 'bogo-percent' && (
                <div className={styles.field}>
                  <label className={styles.label}>Second Item Discount %</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      className={styles.input}
                      value={secondItemPctStr}
                      onChange={(e) => setSecondItemPctStr(e.target.value)}
                      placeholder="50"
                    />
                    <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {[25, 40, 50, 75].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className={`${styles.chip} ${secondItemPctStr === pct.toString() ? styles.chipActive : ''}`}
                        onClick={() => setSecondItemPctStr(pct.toString())}
                      >
                        {pct}% off second
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {dealType === 'buy-x-get-y' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Buy Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className={styles.input}
                      style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                      value={buyQtyStr}
                      onChange={(e) => setBuyQtyStr(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Get Free Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className={styles.input}
                      style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                      value={getQtyStr}
                      onChange={(e) => setGetQtyStr(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>
              )}

              {dealType === 'spend-x-save-y' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Spend Threshold ({currencySymbol})</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        type="number"
                        min="1"
                        className={styles.input}
                        value={spendThresholdStr}
                        onChange={(e) => setSpendThresholdStr(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Instant Rebate ({currencySymbol})</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        type="number"
                        min="1"
                        className={styles.input}
                        value={saveAmountStr}
                        onChange={(e) => setSaveAmountStr(e.target.value)}
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {dealType === 'bundle' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Items in Bundle</label>
                    <input
                      type="number"
                      min="2"
                      className={styles.input}
                      style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                      value={bundleQtyStr}
                      onChange={(e) => setBundleQtyStr(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Bundle Price ({currencySymbol})</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className={styles.input}
                        value={bundleTotalPriceStr}
                        onChange={(e) => setBundleTotalPriceStr(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Column (Sticky) */}
          <div className={styles.results}>
            {/* Hero Result Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Total Promotion Checkout</span>
              <span className={styles.heroValue}>
                {currencySymbol}
                {dealResult.totalSalePrice.toFixed(2)}
              </span>
              <span className={styles.heroSub}>
                Effective price: {currencySymbol}{dealResult.pricePerUnit.toFixed(2)} / item • {dealResult.effectiveDiscountPercent.toFixed(1)}% total savings
              </span>
            </div>

            {/* Summary Banner */}
            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>{dealResult.explanation}</p>
            </div>

            {/* Metrics Breakdown Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <span className={styles.step}>2</span>
                  <div>
                    <h3 className={styles.cardTitle}>Promotion Economics</h3>
                    <p className={styles.cardSubtitle}>Retail comparison breakdown</p>
                  </div>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Promotion Deal</span>
                  <span className={styles.metricVal} style={{ fontSize: '1.1rem' }}>{dealResult.dealName}</span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Total Saved</span>
                  <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                    {currencySymbol}
                    {dealResult.totalSavings.toFixed(2)}
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Effective Discount</span>
                  <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                    {dealResult.effectiveDiscountPercent.toFixed(1)}%
                  </span>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>Net Unit Price</span>
                  <span className={styles.metricVal}>
                    {currencySymbol}
                    {dealResult.pricePerUnit.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.noticeBox} style={{ marginTop: '14px' }}>
                Without this promotion, buying at regular price would total {currencySymbol}{dealResult.totalOriginalCost.toFixed(2)}. You pocket {currencySymbol}{dealResult.totalSavings.toFixed(2)} in net retail savings.
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsBar}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                  onClick={handleCopySummary}
                >
                  {copied ? '✓ Copied' : '📋 Copy Results'}
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                  onClick={handleShareUrl}
                >
                  {shared ? '✓ URL Copied' : '🔗 Share URL'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handlePrint}
                >
                  🖨️ Print Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: REFERENCE TABLES ($10–$200)                    */}
      {/* ==================================================== */}
      {activeTab === 'table' && (
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.cardHeadTitle}>
              <span className={styles.step}>📋</span>
              <div>
                <h2 className={styles.cardTitle}>
                  Quick Reference Discount Tables ({currencySymbol})
                </h2>
                <p className={styles.cardSubtitle}>
                  Instant lookup for common retail prices and standard store percentages
                </p>
              </div>
            </div>

            <div style={{ minWidth: '180px' }}>
              <input
                type="text"
                className={styles.input}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                }}
                placeholder="🔍 Search discount or price..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--ink)' }}>
              Discount Matrix for {currencySymbol}{parseFloat(originalPriceStr) > 0 ? parseFloat(originalPriceStr).toFixed(2) : '100.00'} Original Price
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Discount %</th>
                    <th>You Save ({currencySymbol})</th>
                    <th>Final Sale Price ({currencySymbol})</th>
                    <th>Formula</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDynamicTable.map((row) => {
                    const isSelected =
                      discountPercentStr === row.percent.toString();
                    return (
                      <tr key={row.percent} className={isSelected ? styles.activeRow : undefined}>
                        <td><strong>{row.percent}% Off</strong></td>
                        <td style={{ color: '#16a34a', fontWeight: 600 }}>
                          -{currencySymbol}{row.savings.toFixed(2)}
                        </td>
                        <td>
                          <strong>{currencySymbol}{row.salePrice.toFixed(2)}</strong>
                        </td>
                        <td style={{ color: 'var(--ink-muted)', fontSize: '0.78rem' }}>
                          {row.stepCalculation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--ink)' }}>
              Common Retail Price Matrix ($10 to $200 Across Standard Markdowns)
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Original MSRP</th>
                    <th>10% Off</th>
                    <th>15% Off</th>
                    <th>20% Off</th>
                    <th>25% Off</th>
                    <th>30% Off</th>
                    <th>40% Off</th>
                    <th>50% Off</th>
                    <th>75% Off</th>
                  </tr>
                </thead>
                <tbody>
                  {commonMatrix.map((item) => (
                    <tr key={item.price}>
                      <td><strong>{currencySymbol}{item.price.toFixed(2)}</strong></td>
                      <td>{currencySymbol}{item.discounts[10].salePrice.toFixed(2)}</td>
                      <td>{currencySymbol}{item.discounts[15].salePrice.toFixed(2)}</td>
                      <td>{currencySymbol}{item.discounts[20].salePrice.toFixed(2)}</td>
                      <td>{currencySymbol}{item.discounts[25].salePrice.toFixed(2)}</td>
                      <td>{currencySymbol}{item.discounts[30].salePrice.toFixed(2)}</td>
                      <td>{currencySymbol}{item.discounts[40].salePrice.toFixed(2)}</td>
                      <td><strong style={{ color: '#0284c7' }}>{currencySymbol}{item.discounts[50].salePrice.toFixed(2)}</strong></td>
                      <td><strong style={{ color: '#16a34a' }}>{currencySymbol}{item.discounts[75].salePrice.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Bar */}
          <div className={styles.actionsBar} style={{ marginTop: '20px' }}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handlePrint}
            >
              🖨️ Print Reference Table
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
              onClick={handleShareUrl}
            >
              {shared ? '✓ URL Copied' : '🔗 Share Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
