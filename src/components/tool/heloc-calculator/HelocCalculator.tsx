'use client';

import React, { useState, useMemo, useId, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import TabSlider from '@/components/tool/shared/TabSlider';
import HelocInputGuide from './HelocInputGuide';
import {
  calculateBorrowingLimit,
  calculateHelocPayments,
  generateRateScenarios,
  compareHomeEquityOptions,
  DrawPaymentMethod,
} from '@/lib/heloc-engine';
import styles from './HelocCalculator.module.css';

type Mode = 'payment' | 'borrow' | 'compare';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'payment', label: 'Payments & Payment Shock' },
  { id: 'borrow', label: 'How Much Can I Borrow?' },
  { id: 'compare', label: 'HELOC vs Loan vs Refi' },
];

export default function HelocCalculator() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Mode) || 'payment';
  const validatedTab: Mode = ['payment', 'borrow', 'compare'].includes(initialTab) ? initialTab : 'payment';

  const [activeTab, setActiveTab] = useState<Mode>(validatedTab);
  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  // Tab 1: Borrowing Limit Inputs
  const [homeValue, setHomeValue] = useState<number>(400000);
  const [mortgageBalance, setMortgageBalance] = useState<number>(250000);
  const [maxCltvPct, setMaxCltvPct] = useState<number>(85);

  // Tab 2: Payments & Payment Shock Inputs
  const [drawnAmount, setDrawnAmount] = useState<number>(50000);
  const [aprPct, setAprPct] = useState<number>(8.0);
  const [drawYears, setDrawYears] = useState<number>(10);
  const [repayYears, setRepayYears] = useState<number>(20);
  const [drawMethod, setDrawMethod] = useState<DrawPaymentMethod>('interest-only');
  const [extraPrincipal, setExtraPrincipal] = useState<number>(0);
  const isBalloon = false;
  const [closingCosts, setClosingCosts] = useState<number>(0);
  const [annualFee, setAnnualFee] = useState<number>(50);
  const rateCap = 18.0;

  // Tab 3: Comparison Inputs
  const [helRate, setHelRate] = useState<number>(7.5);
  const [helTermYears, setHelTermYears] = useState<number>(15);
  const helClosingCosts = 1500;

  const currentMortgageRate = 4.0;
  const currentMortgageRemainingYears = 22;
  const [refiRate, setRefiRate] = useState<number>(6.5);
  const refiTermYears = 30;
  const [refiClosingCosts, setRefiClosingCosts] = useState<number>(5000);

  const baseId = useId();

  const handleTabChange = (tabId: Mode) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const fmt = useCallback((val: number) => {
    if (!Number.isFinite(val)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  }, []);

  // 1. Borrowing Limit Calculation
  const borrowLimit = useMemo(() => {
    return calculateBorrowingLimit(homeValue, mortgageBalance, maxCltvPct);
  }, [homeValue, mortgageBalance, maxCltvPct]);

  // 2. Payments & Shock Calculation
  const paymentsResult = useMemo(() => {
    return calculateHelocPayments({
      drawnAmount,
      aprPct,
      drawYears,
      repayYears,
      drawMethod,
      extraPrincipalMonthly: extraPrincipal,
      isBalloon,
      closingCosts,
      annualFee,
      rateCapPct: rateCap,
    });
  }, [drawnAmount, aprPct, drawYears, repayYears, drawMethod, extraPrincipal, isBalloon, closingCosts, annualFee, rateCap]);

  // Rate Scenarios (+0%, +1%, +2%, +3%)
  const rateScenarios = useMemo(() => {
    return generateRateScenarios({
      drawnAmount,
      aprPct,
      drawYears,
      repayYears,
      drawMethod,
      extraPrincipalMonthly: extraPrincipal,
      isBalloon,
      closingCosts,
      annualFee,
      rateCapPct: rateCap,
    });
  }, [drawnAmount, aprPct, drawYears, repayYears, drawMethod, extraPrincipal, isBalloon, closingCosts, annualFee, rateCap]);

  // 3. Comparison Calculation
  const compareResult = useMemo(() => {
    return compareHomeEquityOptions({
      borrowAmount: drawnAmount,
      helocApr: aprPct,
      helocDrawYears: drawYears,
      helocRepayYears: repayYears,
      helocClosingCosts: closingCosts,
      helocAnnualFee: annualFee,

      helRate,
      helTermYears,
      helClosingCosts,

      currentMortgageBalance: mortgageBalance,
      currentMortgageRate,
      currentMortgageRemainingYears,
      refiRate,
      refiTermYears,
      refiClosingCosts,
    });
  }, [
    drawnAmount,
    aprPct,
    drawYears,
    repayYears,
    closingCosts,
    annualFee,
    helRate,
    helTermYears,
    helClosingCosts,
    mortgageBalance,
    currentMortgageRate,
    currentMortgageRemainingYears,
    refiRate,
    refiTermYears,
    refiClosingCosts,
  ]);

  // Dynamic Summary Text
  const summaryText = useMemo(() => {
    if (activeTab === 'payment') {
      return `Borrowing ${fmt(drawnAmount)} at ${aprPct}% APR costs ${fmt(paymentsResult.initialDrawPayment)}/month interest-only during the ${drawYears}-year draw period, then jumps to ${fmt(paymentsResult.repaymentPayment)}/month for ${repayYears} years — a +${paymentsResult.paymentShockPct}% payment shock (+${fmt(paymentsResult.paymentShockDollars)}/month).`;
    }
    if (activeTab === 'borrow') {
      return `On a ${fmt(homeValue)} home with a ${fmt(mortgageBalance)} first mortgage at an ${maxCltvPct}% CLTV limit, your maximum available HELOC credit line is ${fmt(borrowLimit.maxCreditLine)}, leaving ${fmt(borrowLimit.retainedEquity)} in retained home equity.`;
    }
    if (activeTab === 'compare') {
      return `For a ${fmt(drawnAmount)} borrow: HELOC costs ${fmt(compareResult.heloc.monthlyDraw)}/mo in draw (${fmt(compareResult.heloc.monthlyRepay)} in repay); a 15-yr Home Equity Loan is fixed at ${fmt(compareResult.homeEquityLoan.monthlyPayment)}/mo; and Cash-Out Refi increases your monthly mortgage payment by ${fmt(compareResult.cashOutRefi.monthlyPaymentDiff)}/mo.`;
    }
    return '';
  }, [activeTab, drawnAmount, aprPct, paymentsResult, drawYears, repayYears, homeValue, mortgageBalance, maxCltvPct, borrowLimit, compareResult, fmt]);

  const handleCopySummary = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownloadCsv = () => {
    if (!paymentsResult.schedule || paymentsResult.schedule.length === 0) return;
    const header = 'Month,Year,Phase,Starting Balance,Payment,Principal,Interest,Ending Balance\n';
    const rows = paymentsResult.schedule
      .map(
        (r) =>
          `${r.month},${r.year},${r.phase},${r.startingBalance.toFixed(2)},${r.payment.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.endingBalance.toFixed(2)}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heloc-schedule-${drawnAmount}-at-${aprPct}pct.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrap}>
      {/* 3-Tab Slider */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(id) => handleTabChange(id as Mode)}
        ariaLabel="HELOC Calculator Modes"
      />

      {/* Visual Lifecycle Guide */}
      <HelocInputGuide
        mode={activeTab}
        activeField={activeField}
        homeValue={homeValue}
        mortgageBalance={mortgageBalance}
        maxCreditLine={borrowLimit.maxCreditLine}
        drawnAmount={drawnAmount}
        aprPct={aprPct}
        drawPayment={paymentsResult.initialDrawPayment}
        repayPayment={paymentsResult.repaymentPayment}
        shockPct={paymentsResult.paymentShockPct}
      />

      {/* Dynamic Summary Banner (Light Mint) */}
      <div className={styles.summaryBanner} role="region" aria-label="HELOC Calculation Summary">
        <div className={styles.summaryContent}>
          <span className={styles.summaryIcon} aria-hidden="true">💡</span>
          <div className={styles.summaryText}>
            <strong>Bottom Line:</strong> {summaryText}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopySummary}
          className={styles.copySummaryBtn}
          title="Copy calculation summary"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* ================= TAB 1: PAYMENTS & PAYMENT SHOCK ================= */}
      {activeTab === 'payment' && (
        <div className={styles.grid}>
          {/* Inputs Column */}
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>HELOC Line &amp; Rates</h2>
                  <p className={styles.cardSubtitle}>Enter your loan amount and interest terms</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-drawn`} className={styles.label}>
                    Total Amount Drawn / Borrowed
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-drawn`}
                      type="number"
                      min="1000"
                      step="5000"
                      value={drawnAmount || ''}
                      onChange={(e) => setDrawnAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('drawn')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-apr`} className={styles.label}>
                    Variable Interest Rate (APR)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-apr`}
                      type="number"
                      min="1"
                      max="30"
                      step="0.125"
                      value={aprPct || ''}
                      onChange={(e) => setAprPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('apr')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>Variable prime rate + lender margin</span>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-drawYears`} className={styles.label}>
                    Draw Period (Years)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-drawYears`}
                      type="number"
                      min="1"
                      max="20"
                      step="1"
                      value={drawYears || ''}
                      onChange={(e) => setDrawYears(Math.max(1, parseInt(e.target.value, 10) || 10))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>Yrs</span>
                  </div>
                  <span className={styles.helperText}>Standard is 10 years</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-repayYears`} className={styles.label}>
                    Repayment Period (Years)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-repayYears`}
                      type="number"
                      min="5"
                      max="30"
                      step="5"
                      value={repayYears || ''}
                      onChange={(e) => setRepayYears(Math.max(1, parseInt(e.target.value, 10) || 20))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>Yrs</span>
                  </div>
                  <span className={styles.helperText}>Standard is 20 years</span>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Draw Period Payment Method</span>
                  <div className={styles.segmented} role="radiogroup">
                    <button
                      type="button"
                      className={`${styles.segmentBtn} ${drawMethod === 'interest-only' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setDrawMethod('interest-only')}
                    >
                      Interest-Only (Standard)
                    </button>
                    <button
                      type="button"
                      className={`${styles.segmentBtn} ${drawMethod === '1/360' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setDrawMethod('1/360')}
                    >
                      1/360 + Interest
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-extraPmt`} className={styles.label}>
                    Extra Principal / Month (Draw Period)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-extraPmt`}
                      type="number"
                      min="0"
                      step="50"
                      value={extraPrincipal || ''}
                      onChange={(e) => setExtraPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <span className={styles.helperText}>Reduces end-of-draw balance &amp; shock</span>
                </div>
              </div>

              {/* Optional Advanced Settings */}
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-annualFee`} className={styles.label}>
                    Annual Maintenance Fee
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-annualFee`}
                      type="number"
                      min="0"
                      step="25"
                      value={annualFee || ''}
                      onChange={(e) => setAnnualFee(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-closing`} className={styles.label}>
                    Upfront Closing Costs
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-closing`}
                      type="number"
                      min="0"
                      step="100"
                      value={closingCosts || ''}
                      onChange={(e) => setClosingCosts(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className={styles.results}>
            {/* Hero Payment Shock Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Draw vs. Repayment Payment</span>
              <div className={styles.heroRow}>
                <span className={styles.heroValue}>{fmt(paymentsResult.initialDrawPayment)}/mo</span>
                <span className={styles.heroArrow}>➔</span>
                <span className={styles.heroValueRepay}>{fmt(paymentsResult.repaymentPayment)}/mo</span>
                <span className={styles.shockBadge}>+{paymentsResult.paymentShockPct}% Shock</span>
              </div>
              <div className={styles.heroSub}>
                Draw Phase: {drawYears} years of interest-only ({fmt(paymentsResult.initialDrawPayment)}/mo)
                <br />
                Repayment Phase: {repayYears} years of P&amp;I amortization ({fmt(paymentsResult.repaymentPayment)}/mo)
              </div>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Monthly Jump</span>
                <span className={styles.metricValue} style={{ color: '#ef4444' }}>
                  +{fmt(paymentsResult.paymentShockDollars)}
                </span>
                <span className={styles.metricHelp}>Monthly budget impact</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>End-of-Draw Balance</span>
                <span className={styles.metricValue}>{fmt(paymentsResult.balanceAtEndOfDraw)}</span>
                <span className={styles.metricHelp}>Principal entering repay</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Total Interest</span>
                <span className={styles.metricValue}>{fmt(paymentsResult.totalInterest)}</span>
                <span className={styles.metricHelp}>Across 30-year lifecycle</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Total Cost with Fees</span>
                <span className={styles.metricValue}>{fmt(paymentsResult.totalCostWithFees)}</span>
                <span className={styles.metricHelp}>Interest + closing + annual</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Draw Interest</span>
                <span className={styles.metricValue}>{fmt(paymentsResult.totalDrawInterest)}</span>
                <span className={styles.metricHelp}>First {drawYears} years</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Repay Interest</span>
                <span className={styles.metricValue}>{fmt(paymentsResult.totalRepaymentInterest)}</span>
                <span className={styles.metricHelp}>Final {repayYears} years</span>
              </div>
            </div>

            {/* Rate-Rise Sensitivity Table */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Rate-Rise Vulnerability Scenarios</h3>
              <p className={styles.cardSubtitle}>
                Because HELOCs carry variable interest rates, a prime rate increase directly expands your monthly payment
              </p>
              <div className={styles.tableWrap} style={{ marginTop: '0.75rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th className={styles.numCell}>APR</th>
                      <th className={styles.numCell}>Draw Payment</th>
                      <th className={styles.numCell}>Repayment</th>
                      <th className={styles.numCell}>Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateScenarios.map((sc, i) => (
                      <tr key={sc.label} style={{ background: i === 0 ? '#eff6ff' : 'inherit' }}>
                        <td>
                          <strong>{sc.label}</strong> {i === 0 ? '★' : ''}
                        </td>
                        <td className={styles.numCell}>{sc.ratePct}%</td>
                        <td className={styles.numCell}>{fmt(sc.drawPayment)}/mo</td>
                        <td className={styles.numCell}>{fmt(sc.repaymentPayment)}/mo</td>
                        <td className={styles.numCell}>{fmt(sc.totalInterest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amortization Schedule Table & Download */}
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className={styles.cardTitle}>Full Amortization Schedule</h3>
                  <p className={styles.cardSubtitle}>
                    {showAllRows
                      ? `Showing all ${paymentsResult.schedule.length} months`
                      : `Showing first 12 of ${paymentsResult.schedule.length} months`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllRows(!showAllRows)}
                  className={styles.segmentBtn}
                  style={{ border: '1px solid #cbd5e1' }}
                >
                  {showAllRows ? 'Show Less' : 'Show All'}
                </button>
              </div>

              <div className={styles.tableWrap} style={{ marginTop: '0.75rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Mo</th>
                      <th>Phase</th>
                      <th className={styles.numCell}>Starting Bal</th>
                      <th className={styles.numCell}>Payment</th>
                      <th className={styles.numCell}>Interest</th>
                      <th className={styles.numCell}>Ending Bal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllRows ? paymentsResult.schedule : paymentsResult.schedule.slice(0, 12)).map((row) => (
                      <tr key={row.month}>
                        <td>#{row.month}</td>
                        <td style={{ textTransform: 'capitalize', color: row.phase === 'draw' ? '#2563eb' : '#b91c1c' }}>
                          {row.phase}
                        </td>
                        <td className={styles.numCell}>{fmt(row.startingBalance)}</td>
                        <td className={styles.numCell} style={{ fontWeight: 700 }}>
                          {fmt(row.payment)}
                        </td>
                        <td className={styles.numCell} style={{ color: '#ef4444' }}>
                          {fmt(row.interest)}
                        </td>
                        <td className={styles.numCell}>{fmt(row.endingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.actionsBar}>
                <button type="button" onClick={handleDownloadCsv} className={styles.downloadBtn}>
                  ⬇ Download Full Schedule as CSV
                </button>
                <span className={styles.helperText}>Open in Excel, Google Sheets, or Numbers</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BORROWING LIMIT (CLTV) ================= */}
      {activeTab === 'borrow' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Home Value &amp; Existing Mortgages</h2>
                  <p className={styles.cardSubtitle}>Calculate maximum allowable combined loan-to-value</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-val`} className={styles.label}>
                    Estimated Fair Market Home Value
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-val`}
                      type="number"
                      min="10000"
                      step="10000"
                      value={homeValue || ''}
                      onChange={(e) => setHomeValue(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-mortBal`} className={styles.label}>
                    Current First Mortgage Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-mortBal`}
                      type="number"
                      min="0"
                      step="5000"
                      value={mortgageBalance || ''}
                      onChange={(e) => setMortgageBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-cltv`} className={styles.label}>
                    Lender Maximum CLTV Percentage (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-cltv`}
                      type="number"
                      min="50"
                      max="100"
                      step="5"
                      value={maxCltvPct || ''}
                      onChange={(e) => setMaxCltvPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>Most prime banks cap CLTV at 80% or 85%</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Maximum Available HELOC</span>
              <div className={styles.heroValue}>{fmt(borrowLimit.maxCreditLine)}</div>
              <div className={styles.heroSub}>
                Formula: ({fmt(homeValue)} Home Value × {maxCltvPct}% CLTV) − {fmt(mortgageBalance)} Mortgage
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Current LTV</span>
                <span className={styles.metricValue}>{borrowLimit.currentCltvPct}%</span>
                <span className={styles.metricHelp}>Mortgage ÷ Home value</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Max Combined CLTV</span>
                <span className={styles.metricValue}>{borrowLimit.postHelocCltvPct}%</span>
                <span className={styles.metricHelp}>With max credit line</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Retained Home Equity</span>
                <span className={styles.metricValue}>{fmt(borrowLimit.retainedEquity)}</span>
                <span className={styles.metricHelp}>Unencumbered equity</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: COMPARE HELOC VS LOAN VS REFI ================= */}
      {activeTab === 'compare' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Loan &amp; Refinance Terms</h2>
                  <p className={styles.cardSubtitle}>Compare borrowing options on a {fmt(drawnAmount)} cash need</p>
                </div>
              </div>

              <h3 className={styles.cardTitle} style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                Fixed Home Equity Loan
              </h3>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-helRate`} className={styles.label}>
                    Fixed Interest Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-helRate`}
                      type="number"
                      min="2"
                      max="20"
                      step="0.125"
                      value={helRate || ''}
                      onChange={(e) => setHelRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-helTerm`} className={styles.label}>
                    Loan Term (Years)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-helTerm`}
                      type="number"
                      min="5"
                      max="30"
                      step="5"
                      value={helTermYears || ''}
                      onChange={(e) => setHelTermYears(Math.max(1, parseInt(e.target.value, 10) || 15))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>Yrs</span>
                  </div>
                </div>
              </div>

              <h3 className={styles.cardTitle} style={{ fontSize: '0.88rem', margin: '0.75rem 0 0.5rem' }}>
                Cash-Out Refinance
              </h3>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-refiRate`} className={styles.label}>
                    New 30-Year Mortgage Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-refiRate`}
                      type="number"
                      min="2"
                      max="20"
                      step="0.125"
                      value={refiRate || ''}
                      onChange={(e) => setRefiRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-refiClosing`} className={styles.label}>
                    Refi Closing Costs ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-refiClosing`}
                      type="number"
                      min="0"
                      step="500"
                      value={refiClosingCosts || ''}
                      onChange={(e) => setRefiClosingCosts(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <span className={styles.helperText}>From your lender’s quote</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.comparisonGrid}>
              {/* HELOC Card */}
              <div className={styles.compareCard}>
                <div className={styles.compareTitle}>1. HELOC</div>
                <div className={styles.compareRow}>
                  <span>Draw Payment:</span>
                  <strong style={{ color: '#2563eb' }}>{fmt(compareResult.heloc.monthlyDraw)}/mo</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Repay Payment:</span>
                  <strong style={{ color: '#ef4444' }}>{fmt(compareResult.heloc.monthlyRepay)}/mo</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Total Interest:</span>
                  <strong>{fmt(compareResult.heloc.totalInterest)}</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Upfront Fees:</span>
                  <strong>{fmt(compareResult.heloc.closingCosts)}</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Rate Structure:</span>
                  <span style={{ fontSize: '0.75rem' }}>Variable APR</span>
                </div>
              </div>

              {/* Home Equity Loan Card */}
              <div className={styles.compareCard}>
                <div className={styles.compareTitle}>2. Home Equity Loan</div>
                <div className={styles.compareRow}>
                  <span>Fixed Payment:</span>
                  <strong style={{ color: '#16a34a' }}>{fmt(compareResult.homeEquityLoan.monthlyPayment)}/mo</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Term:</span>
                  <strong>{helTermYears} Years</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Total Interest:</span>
                  <strong>{fmt(compareResult.homeEquityLoan.totalInterest)}</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Upfront Fees:</span>
                  <strong>{fmt(compareResult.homeEquityLoan.closingCosts)}</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Rate Structure:</span>
                  <span style={{ fontSize: '0.75rem' }}>Fixed Rate</span>
                </div>
              </div>

              {/* Cash-Out Refi Card */}
              <div className={styles.compareCard}>
                <div className={styles.compareTitle}>3. Cash-Out Refinance</div>
                <div className={styles.compareRow}>
                  <span>New Mortgage Pmt:</span>
                  <strong>{fmt(compareResult.cashOutRefi.newMonthlyPayment)}/mo</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Monthly Increase:</span>
                  <strong style={{ color: '#ef4444' }}>+{fmt(compareResult.cashOutRefi.monthlyPaymentDiff)}/mo</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>New Total Debt:</span>
                  <strong>{fmt(mortgageBalance + drawnAmount + refiClosingCosts)}</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Closing Costs:</span>
                  <strong>{fmt(compareResult.cashOutRefi.closingCosts)}</strong>
                </div>
                <div className={styles.compareRow}>
                  <span>Trade-off:</span>
                  <span style={{ fontSize: '0.75rem' }}>Resets entire mortgage rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
