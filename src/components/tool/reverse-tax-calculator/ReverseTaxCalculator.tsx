'use client';

import React, { useState, useId, useMemo } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import ReverseTaxInputGuide from './ReverseTaxInputGuide';
import {
  calculateReverseTax,
  calculateRateFromPreTaxAndTotal,
  calculateRateFromTaxAndTotal,
  calculateForwardTax,
  calculateReceipt,
  round2,
  ReceiptItem,
} from '@/lib/reverse-tax-engine';
import styles from './ReverseTaxCalculator.module.css';

type ActiveTab = 'priceBefore' | 'findRate' | 'receipt' | 'addTax';

const CURRENCIES = [
  { symbol: '$', label: '$ (USD / CAD / AUD)' },
  { symbol: '£', label: '£ (GBP Pound)' },
  { symbol: '€', label: '€ (EUR Euro)' },
  { symbol: '₹', label: '₹ (INR Rupee)' },
  { symbol: '', label: 'Neutral / No Symbol' },
];

const TAX_LABELS = [
  'Sales Tax',
  'VAT (Value Added Tax)',
  'GST (Goods & Services Tax)',
  'HST (Harmonized Sales Tax)',
];

export default function ReverseTaxCalculator() {
  const [tab, setTab] = useState<ActiveTab>('priceBefore');
  const [currency, setCurrency] = useState<string>('$');
  const [taxLabel, setTaxLabel] = useState<string>('Sales Tax');

  // Tab 1: Price before tax
  const [totalVal, setTotalVal] = useState<string>('107.25');
  const [rateVal, setRateVal] = useState<string>('7.25');
  const [showBuilder, setShowBuilder] = useState<boolean>(false);
  const [stateRate, setStateRate] = useState<string>('4.0');
  const [countyRate, setCountyRate] = useState<string>('1.5');
  const [cityRate, setCityRate] = useState<string>('1.75');
  const [districtRate, setDistrictRate] = useState<string>('0.0');

  // Tab 2: Find rate
  const [findRateMode, setFindRateMode] = useState<'prices' | 'taxAmount'>('prices');
  const [knownPreTax, setKnownPreTax] = useState<string>('100.00');
  const [knownTotal, setKnownTotal] = useState<string>('108.875');
  const [knownTax, setKnownTax] = useState<string>('7.25');

  // Tab 3: Receipt items
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([
    { id: '1', name: 'Item 1 (Taxable)', total: 107.25 },
    { id: '2', name: 'Item 2 (Tax-Exempt Grocery)', total: 50.00, isTaxExempt: true },
  ]);
  const [receiptRate, setReceiptRate] = useState<string>('7.25');

  // Tab 4: Add tax (forward)
  const [fwdPreTax, setFwdPreTax] = useState<string>('100.00');
  const [fwdRate, setFwdRate] = useState<string>('7.25');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Accessible IDs
  const currencyId = useId();
  const taxLabelId = useId();
  const totalInputId = useId();
  const rateInputId = useId();
  const stateRateId = useId();
  const countyRateId = useId();
  const cityRateId = useId();
  const districtRateId = useId();
  const findRateModeId = useId();
  const knownPreTaxId = useId();
  const knownTotalId = useId();
  const knownTaxId = useId();
  const receiptRateId = useId();
  const fwdPreTaxId = useId();
  const fwdRateId = useId();

  // Handle rate builder sum
  const combinedBuilderRate = useMemo(() => {
    const s = parseFloat(stateRate) || 0;
    const c = parseFloat(countyRate) || 0;
    const ci = parseFloat(cityRate) || 0;
    const d = parseFloat(districtRate) || 0;
    return round2(s + c + ci + d);
  }, [stateRate, countyRate, cityRate, districtRate]);

  const applyBuilderRate = () => {
    setRateVal(combinedBuilderRate.toString());
  };

  // Tab 1 calculation
  const reverseTaxResult = useMemo(() => {
    const tot = parseFloat(totalVal);
    const r = parseFloat(rateVal);
    if (isNaN(tot) || isNaN(r) || tot < 0 || r < 0) return null;
    return calculateReverseTax(tot, r);
  }, [totalVal, rateVal]);

  // Tab 2 calculation
  const calculatedTaxRate = useMemo(() => {
    if (findRateMode === 'prices') {
      const p = parseFloat(knownPreTax);
      const t = parseFloat(knownTotal);
      if (isNaN(p) || isNaN(t) || p <= 0 || t < p) return null;
      return calculateRateFromPreTaxAndTotal(p, t);
    } else {
      const tx = parseFloat(knownTax);
      const t = parseFloat(knownTotal);
      if (isNaN(tx) || isNaN(t) || tx < 0 || t <= tx) return null;
      return calculateRateFromTaxAndTotal(tx, t);
    }
  }, [findRateMode, knownPreTax, knownTotal, knownTax]);

  // Tab 3 calculation
  const receiptCalculation = useMemo(() => {
    const r = parseFloat(receiptRate) || 0;
    return calculateReceipt(receiptItems, r);
  }, [receiptItems, receiptRate]);

  // Tab 4 calculation
  const forwardTaxResult = useMemo(() => {
    const p = parseFloat(fwdPreTax);
    const r = parseFloat(fwdRate);
    if (isNaN(p) || isNaN(r) || p < 0 || r < 0) return null;
    return calculateForwardTax(p, r);
  }, [fwdPreTax, fwdRate]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabsConfig = [
    { id: 'priceBefore', label: 'Price Before Tax' },
    { id: 'findRate', label: 'Find Tax Rate' },
    { id: 'receipt', label: 'Multi-Item Receipt' },
    { id: 'addTax', label: 'Add Tax (Forward)' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabNav}>
        <TabSlider
          tabs={tabsConfig}
          activeId={tab}
          onChange={(newTab) => setTab(newTab as ActiveTab)}
          ariaLabel="Reverse Sales Tax Mode"
        />
      </div>

      <ReverseTaxInputGuide tab={tab} />

      <div className={styles.calculatorCard}>
        {/* Global Currency and Tax Type Selectors */}
        <div className={styles.inputsGrid} style={{ marginBottom: 18 }}>
          <div className={styles.inputGroup}>
            <label htmlFor={currencyId} className={styles.label}>Currency Unit</label>
            <select
              id={currencyId}
              className={styles.select}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.label} value={c.symbol}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor={taxLabelId} className={styles.label}>Tax Terminology</label>
            <select
              id={taxLabelId}
              className={styles.select}
              value={taxLabel}
              onChange={(e) => setTaxLabel(e.target.value)}
            >
              {TAX_LABELS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {tab === 'priceBefore' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={totalInputId} className={styles.label}>
                  Total Paid (Tax-Inclusive Price)
                </label>
                <div className={styles.inputWrapper}>
                  {currency && <span className={styles.prefix}>{currency}</span>}
                  <input
                    id={totalInputId}
                    type="number"
                    step="any"
                    min="0"
                    className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                    value={totalVal}
                    onChange={(e) => setTotalVal(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={rateInputId} className={styles.label}>
                  Combined {taxLabel} Rate
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={rateInputId}
                    type="number"
                    step="any"
                    min="0"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={rateVal}
                    onChange={(e) => setRateVal(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
                <span className={styles.helperText}>
                  Example rate: enter your actual jurisdiction tax percentage.
                </span>
              </div>
            </div>

            {/* Optional Rate Builder Accordion */}
            <div className={styles.rateBuilderBox}>
              <div
                className={styles.builderHeader}
                onClick={() => setShowBuilder(!showBuilder)}
              >
                <span>Optional: Combine State, County, City &amp; District Rates</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--cat-math-ink)' }}>
                  {showBuilder ? '▲ Hide Builder' : '▼ Expand Builder'}
                </span>
              </div>

              {showBuilder && (
                <>
                  <div className={styles.builderGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor={stateRateId} className={styles.label}>State Rate (%)</label>
                      <input
                        id={stateRateId}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={stateRate}
                        onChange={(e) => setStateRate(e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={countyRateId} className={styles.label}>County Rate (%)</label>
                      <input
                        id={countyRateId}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={countyRate}
                        onChange={(e) => setCountyRate(e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={cityRateId} className={styles.label}>City Rate (%)</label>
                      <input
                        id={cityRateId}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={cityRate}
                        onChange={(e) => setCityRate(e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={districtRateId} className={styles.label}>District Rate (%)</label>
                      <input
                        id={districtRateId}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={districtRate}
                        onChange={(e) => setDistrictRate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      Combined Rate: <strong>{combinedBuilderRate}%</strong>
                    </span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={applyBuilderRate}
                    >
                      Apply to Calculator
                    </button>
                  </div>
                </>
              )}
            </div>

            {reverseTaxResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Price Before {taxLabel}</span>
                  <div className={styles.heroValue}>
                    {currency}{reverseTaxResult.preTax.toFixed(2)}
                  </div>
                  <div className={styles.heroSub}>
                    <span>{taxLabel} Amount: {currency}{reverseTaxResult.taxAmount.toFixed(2)}</span>
                    <span>·</span>
                    <span>Total: {currency}{reverseTaxResult.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    <strong>{currency}{reverseTaxResult.total.toFixed(2)}</strong> paid with a{' '}
                    <strong>{reverseTaxResult.ratePercent}% {taxLabel}</strong> rate gives a pre-tax base price of{' '}
                    <strong>{currency}{reverseTaxResult.preTax.toFixed(2)}</strong> and tax of{' '}
                    <strong>{currency}{reverseTaxResult.taxAmount.toFixed(2)}</strong>.
                    <br />
                    <em>Reconciliation Check:</em> {currency}{reverseTaxResult.preTax.toFixed(2)} + {currency}{reverseTaxResult.taxAmount.toFixed(2)} = {currency}{reverseTaxResult.total.toFixed(2)} (exact to the cent).
                  </p>
                </div>

                <div className={styles.excelBox}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Excel / Sheets Formula:</span>
                    <div className={styles.excelFormula}>
                      {`=ROUND(${reverseTaxResult.total}/(1+${reverseTaxResult.ratePercent}%), 2)`}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy('excel', `=ROUND(${reverseTaxResult.total}/(1+${reverseTaxResult.ratePercent}%), 2)`)}
                  >
                    {copiedKey === 'excel' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Enter a valid positive total amount and tax rate.
              </div>
            )}
          </>
        )}

        {tab === 'findRate' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor={findRateModeId} className={styles.label}>Solve Rate Using</label>
                <select
                  id={findRateModeId}
                  className={styles.select}
                  value={findRateMode}
                  onChange={(e) => setFindRateMode(e.target.value as 'prices' | 'taxAmount')}
                >
                  <option value="prices">Pre-Tax Price &amp; Total Paid Price</option>
                  <option value="taxAmount">Tax Paid Amount &amp; Total Paid Price</option>
                </select>
              </div>

              {findRateMode === 'prices' ? (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor={knownPreTaxId} className={styles.label}>Pre-Tax Price</label>
                    <div className={styles.inputWrapper}>
                      {currency && <span className={styles.prefix}>{currency}</span>}
                      <input
                        id={knownPreTaxId}
                        type="number"
                        step="any"
                        className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                        value={knownPreTax}
                        onChange={(e) => setKnownPreTax(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={knownTotalId} className={styles.label}>Total Price Paid</label>
                    <div className={styles.inputWrapper}>
                      {currency && <span className={styles.prefix}>{currency}</span>}
                      <input
                        id={knownTotalId}
                        type="number"
                        step="any"
                        className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                        value={knownTotal}
                        onChange={(e) => setKnownTotal(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor={knownTaxId} className={styles.label}>Tax Amount Paid</label>
                    <div className={styles.inputWrapper}>
                      {currency && <span className={styles.prefix}>{currency}</span>}
                      <input
                        id={knownTaxId}
                        type="number"
                        step="any"
                        className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                        value={knownTax}
                        onChange={(e) => setKnownTax(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={knownTotalId} className={styles.label}>Total Price Paid</label>
                    <div className={styles.inputWrapper}>
                      {currency && <span className={styles.prefix}>{currency}</span>}
                      <input
                        id={knownTotalId}
                        type="number"
                        step="any"
                        className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                        value={knownTotal}
                        onChange={(e) => setKnownTotal(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {calculatedTaxRate !== null ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Calculated Effective Tax Rate</span>
                  <div className={styles.heroValue}>
                    {calculatedTaxRate.toFixed(3)}%
                  </div>
                  <div className={styles.heroSub}>
                    <span>Rate = (Total ÷ PreTax) − 1</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    The effective tax rate applied to this purchase was <strong>{calculatedTaxRate.toFixed(3)}%</strong> (or{' '}
                    <strong>{calculatedTaxRate.toFixed(2)}%</strong> rounded to standard two decimal places).
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Total paid must be strictly greater than the pre-tax price or tax amount.
              </div>
            )}
          </>
        )}

        {tab === 'receipt' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={receiptRateId} className={styles.label}>Default {taxLabel} Rate</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={receiptRateId}
                    type="number"
                    step="any"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={receiptRate}
                    onChange={(e) => setReceiptRate(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Total Paid</th>
                    <th>Status</th>
                    <th>Pre-Tax Amount</th>
                    <th>Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptCalculation.items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>{currency}{item.total.toFixed(2)}</td>
                      <td>{item.isTaxExempt ? 'Tax-Exempt (0%)' : `Taxable (${item.effectiveRate}%)`}</td>
                      <td>{currency}{item.preTax.toFixed(2)}</td>
                      <td>{currency}{item.taxAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--cat-math-soft)', fontWeight: 700 }}>
                    <td>Total Summary</td>
                    <td>{currency}{receiptCalculation.grandTotal.toFixed(2)}</td>
                    <td>—</td>
                    <td>{currency}{receiptCalculation.subtotalPreTax.toFixed(2)}</td>
                    <td>{currency}{receiptCalculation.totalTax.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.heroSummary}>
              <p>
                Receipt Breakdown: Total Pre-Tax Base: <strong>{currency}{receiptCalculation.subtotalPreTax.toFixed(2)}</strong> · Total Tax: <strong>{currency}{receiptCalculation.totalTax.toFixed(2)}</strong> · Grand Total: <strong>{currency}{receiptCalculation.grandTotal.toFixed(2)}</strong>.
              </p>
            </div>
          </>
        )}

        {tab === 'addTax' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={fwdPreTaxId} className={styles.label}>Price Before Tax</label>
                <div className={styles.inputWrapper}>
                  {currency && <span className={styles.prefix}>{currency}</span>}
                  <input
                    id={fwdPreTaxId}
                    type="number"
                    step="any"
                    className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                    value={fwdPreTax}
                    onChange={(e) => setFwdPreTax(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={fwdRateId} className={styles.label}>{taxLabel} Rate</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={fwdRateId}
                    type="number"
                    step="any"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={fwdRate}
                    onChange={(e) => setFwdRate(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>

            {forwardTaxResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Total Tax-Inclusive Price</span>
                  <div className={styles.heroValue}>
                    {currency}{forwardTaxResult.total.toFixed(2)}
                  </div>
                  <div className={styles.heroSub}>
                    <span>Tax: {currency}{forwardTaxResult.taxAmount.toFixed(2)}</span>
                    <span>·</span>
                    <span>Base: {currency}{forwardTaxResult.preTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    Adding <strong>{fwdRate}% {taxLabel}</strong> to a pre-tax price of{' '}
                    <strong>{currency}{forwardTaxResult.preTax.toFixed(2)}</strong> yields a tax of{' '}
                    <strong>{currency}{forwardTaxResult.taxAmount.toFixed(2)}</strong>, for a total paid price of{' '}
                    <strong>{currency}{forwardTaxResult.total.toFixed(2)}</strong>.
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Enter a valid positive price and tax rate.
              </div>
            )}
          </>
        )}

        <div className={styles.actionsBar}>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={() => handleCopy('url', typeof window !== 'undefined' ? window.location.href : '')}
          >
            {copiedKey === 'url' ? 'Link Copied!' : 'Copy Tool Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
