'use client';

import React, { useState, useId, useMemo } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider from '@/components/tool/shared/TabSlider';
import { ValuationInputGuide } from './ValuationInputGuide';
import {
  calculateSde,
  calculateEbitda,
  calculateBusinessValuation,
  generateValuationSensitivity,
  calculateAssetValuation,
  calculateDealStructure,
} from '@/lib/business-valuation-engine';
import styles from './BusinessValuationCalculator.module.css';

type TabMode = 'sde' | 'ebitda' | 'asset' | 'deal';

export function BusinessValuationCalculator() {
  const uid = useId();

  // URL Tab sync
  const [activeTab, setActiveTab] = useState<TabMode>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('tab');
      if (p === 'ebitda' || p === 'asset' || p === 'deal') return p;
    }
    return 'sde';
  });

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab as TabMode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Tab 1 & General Inputs (Spec defaults)
  const [netProfit, setNetProfit] = useState<number>(120000);
  const [ownerSalary, setOwnerSalary] = useState<number>(80000);
  const [ownerBenefits, setOwnerBenefits] = useState<number>(10000);
  const [personalExpenses, setPersonalExpenses] = useState<number>(5000);
  const [oneOffExpenses, setOneOffExpenses] = useState<number>(8000);
  const [depreciationAmortization, setDepreciationAmortization] = useState<number>(12000);
  const [interestExpense, setInterestExpense] = useState<number>(6000);
  const incomeTaxes = 0;

  // Valuation Multiples
  const [multipleLow, setMultipleLow] = useState<number>(2.0);
  const [multipleHigh, setMultipleHigh] = useState<number>(3.0);

  // Balance Sheet Proceeds Adjustments
  const [debtToRepay, setDebtToRepay] = useState<number>(50000);
  const [cashKeptBySeller, setCashKeptBySeller] = useState<number>(30000);
  const workingCapitalActual = 45000;
  const workingCapitalTarget = 45000;

  // Tab 2: EBITDA Specific Inputs
  const [replacementManagerSalary, setReplacementManagerSalary] = useState<number>(75000);

  // Tab 3: Asset Valuation Inputs
  const [equipmentValue, setEquipmentValue] = useState<number>(150000);
  const [inventoryValue, setInventoryValue] = useState<number>(50000);
  const [accountsReceivable, setAccountsReceivable] = useState<number>(40000);
  const [cashAndEquivalents, setCashAndEquivalents] = useState<number>(20000);
  const [otherTangibleAssets, setOtherTangibleAssets] = useState<number>(10000);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(70000);

  // Tab 4: Deal Structure Inputs
  const [dealCashPct, setDealCashPct] = useState<number>(70);
  const [dealNotePct, setDealNotePct] = useState<number>(20);
  const [dealNoteRate, setDealNoteRate] = useState<number>(7.0);
  const [dealNoteYears, setDealNoteYears] = useState<number>(5);
  const [dealEarnPct, setDealEarnPct] = useState<number>(10);

  const [copied, setCopied] = useState<boolean>(false);

  // Formatters
  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const fmtDec = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  // Calculations
  const sdeResult = useMemo(() => {
    return calculateSde({
      netProfit,
      ownerSalary,
      ownerBenefits,
      personalExpenses,
      oneOffExpenses,
      depreciationAmortization,
      interestExpense,
    });
  }, [
    netProfit,
    ownerSalary,
    ownerBenefits,
    personalExpenses,
    oneOffExpenses,
    depreciationAmortization,
    interestExpense,
  ]);

  const ebitdaResult = useMemo(() => {
    return calculateEbitda({
      netProfit,
      interestExpense,
      incomeTaxes,
      depreciationAmortization,
      sde: sdeResult.sde,
      replacementManagerSalary,
    });
  }, [
    netProfit,
    interestExpense,
    incomeTaxes,
    depreciationAmortization,
    sdeResult.sde,
    replacementManagerSalary,
  ]);

  const currentEarnings = activeTab === 'ebitda' ? ebitdaResult.adjustedEbitda : sdeResult.sde;

  const valuationResult = useMemo(() => {
    return calculateBusinessValuation({
      earnings: currentEarnings,
      multipleLow,
      multipleHigh,
      debtToRepay,
      cashKeptBySeller,
      workingCapitalActual,
      workingCapitalTarget,
    });
  }, [
    currentEarnings,
    multipleLow,
    multipleHigh,
    debtToRepay,
    cashKeptBySeller,
    workingCapitalActual,
    workingCapitalTarget,
  ]);

  const sensitivityMatrix = useMemo(() => {
    return generateValuationSensitivity(currentEarnings, valuationResult.multipleMid);
  }, [currentEarnings, valuationResult.multipleMid]);

  const assetResult = useMemo(() => {
    return calculateAssetValuation({
      equipmentValue,
      inventoryValue,
      accountsReceivable,
      cashAndEquivalents,
      otherTangibleAssets,
      totalLiabilities,
    });
  }, [
    equipmentValue,
    inventoryValue,
    accountsReceivable,
    cashAndEquivalents,
    otherTangibleAssets,
    totalLiabilities,
  ]);

  const dealResult = useMemo(() => {
    return calculateDealStructure({
      totalPurchasePrice: valuationResult.enterpriseValueMid,
      cashAtClosePercent: dealCashPct,
      sellerNotePercent: dealNotePct,
      sellerNoteInterestRate: dealNoteRate,
      sellerNoteTermYears: dealNoteYears,
      earnOutPercent: dealEarnPct,
    });
  }, [
    valuationResult.enterpriseValueMid,
    dealCashPct,
    dealNotePct,
    dealNoteRate,
    dealNoteYears,
    dealEarnPct,
  ]);

  const handleCopySummary = () => {
    const text = `Business Valuation Summary (${activeTab.toUpperCase()} Mode):\n` +
      `Earnings Base: ${fmtCurrency(currentEarnings)}\n` +
      `Multiple Range: ${multipleLow}x to ${multipleHigh}x (Mid: ${valuationResult.multipleMid}x)\n` +
      `Enterprise Value: ${fmtCurrency(valuationResult.enterpriseValueLow)} - ${fmtCurrency(valuationResult.enterpriseValueHigh)} (Mid: ${fmtCurrency(valuationResult.enterpriseValueMid)})\n` +
      `Net Owner Proceeds: ${fmtCurrency(valuationResult.equityValueMid)} (after ${fmtCurrency(debtToRepay)} debt & ${fmtCurrency(cashKeptBySeller)} cash)\n` +
      `Asset Floor (NAV): ${fmtCurrency(assetResult.netAssetValue)}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <ToolShell
      features={[
        'SDE add-back builder',
        'EBITDA & equity value',
        'Sensitivity grid',
        'Print & share link',
      ]}
    >
      <div className={styles.container}>
        {/* Navigation Tabs */}
        <div className={styles.tabWrapper}>
          <TabSlider
            tabs={[
              { id: 'sde', label: 'SDE (Owner-Run)' },
              { id: 'ebitda', label: 'EBITDA (Managed)' },
              { id: 'asset', label: 'Asset Check (NAV)' },
              { id: 'deal', label: 'Deal Structure' },
            ]}
            activeId={activeTab}
            onChange={handleTabChange}
            ariaLabel="Small business valuation calculator modes"
          />
        </div>

        {/* Dynamic BLUF Summary Banner */}
        <div className={styles.summaryBanner}>
          {valuationResult.isEarningsPositive ? (
            <span>
              <strong>Bottom Line:</strong> With <strong>{fmtCurrency(currentEarnings)}</strong> of{' '}
              {activeTab === 'ebitda' ? 'Adjusted EBITDA' : "Seller's Discretionary Earnings (SDE)"} and a{' '}
              <strong>{multipleLow}× to {multipleHigh}× multiple</strong>, the business has an estimated Enterprise Value of{' '}
              <strong>{fmtCurrency(valuationResult.enterpriseValueLow)} to {fmtCurrency(valuationResult.enterpriseValueHigh)}</strong> (midpoint:{' '}
              <strong>{fmtCurrency(valuationResult.enterpriseValueMid)}</strong>). After resolving {fmtCurrency(debtToRepay)} in debt and retaining{' '}
              {fmtCurrency(cashKeptBySeller)} in cash, the owner takes home approximately{' '}
              <strong>{fmtCurrency(valuationResult.equityValueMid)}</strong> in net equity proceeds.
            </span>
          ) : (
            <span>
              <strong>Notice:</strong> Current earnings are zero or negative ({fmtCurrency(currentEarnings)}). Standard earnings multiples do not apply to unprofitable businesses; review the{' '}
              <strong>Asset Check (NAV)</strong> tab to calculate the tangible liquidation floor value.
            </span>
          )}
        </div>

        {/* Visual Bridge Diagram */}
        <ValuationInputGuide
          activeTab={activeTab}
          netProfit={netProfit}
          sde={sdeResult.sde}
          adjustedEbitda={ebitdaResult.adjustedEbitda}
          multipleLow={multipleLow}
          multipleHigh={multipleHigh}
          evMid={valuationResult.enterpriseValueMid}
          equityMid={valuationResult.equityValueMid}
          debt={debtToRepay}
          cash={cashKeptBySeller}
        />

        {/* Tab 1: SDE Mode (Owner-Operator) */}
        {activeTab === 'sde' && (
          <div className={styles.calculatorGrid}>
            {/* Input Card */}
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>
                <span>SDE Earnings &amp; Add-Backs</span>
                <span className={styles.hint}>From Annual P&amp;L</span>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor={`${uid}-profit`} className={styles.label}>Pre-Tax Net Profit</label>
                  <span className={styles.hint}>P&amp;L ordinary bottom-line</span>
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-profit`}
                    type="number"
                    step="5000"
                    value={netProfit || ''}
                    onChange={(e) => setNetProfit(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-owner-pay`} className={styles.label}>Owner Salary / W-2</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-owner-pay`}
                      type="number"
                      step="5000"
                      value={ownerSalary || ''}
                      onChange={(e) => setOwnerSalary(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-owner-benefits`} className={styles.label}>Owner Benefits &amp; Perks</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-owner-benefits`}
                      type="number"
                      step="1000"
                      value={ownerBenefits || ''}
                      onChange={(e) => setOwnerBenefits(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-personal`} className={styles.label}>Personal Expenses</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-personal`}
                      type="number"
                      step="1000"
                      value={personalExpenses || ''}
                      onChange={(e) => setPersonalExpenses(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-one-off`} className={styles.label}>One-Off Non-Recurring</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-one-off`}
                      type="number"
                      step="1000"
                      value={oneOffExpenses || ''}
                      onChange={(e) => setOneOffExpenses(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-da`} className={styles.label}>Depreciation &amp; Amortization</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-da`}
                      type="number"
                      step="1000"
                      value={depreciationAmortization || ''}
                      onChange={(e) => setDepreciationAmortization(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-int`} className={styles.label}>Interest Expense</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-int`}
                      type="number"
                      step="1000"
                      value={interestExpense || ''}
                      onChange={(e) => setInterestExpense(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Controls */}
              <div style={{ borderTop: '1px solid var(--border, #e2e8f0)', paddingTop: '16px' }}>
                <div className={styles.cardTitle}>
                  <span>Valuation Multiple Range</span>
                  <span className={styles.hint}>From Comparable Sales</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-mult-low`} className={styles.label}>Low Multiple</label>
                    <div className={styles.inputGroup}>
                      <input
                        id={`${uid}-mult-low`}
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="15.0"
                        value={multipleLow || ''}
                        onChange={(e) => setMultipleLow(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.suffix}>×</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-mult-high`} className={styles.label}>High Multiple</label>
                    <div className={styles.inputGroup}>
                      <input
                        id={`${uid}-mult-high`}
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="15.0"
                        value={multipleHigh || ''}
                        onChange={(e) => setMultipleHigh(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.suffix}>×</span>
                    </div>
                  </div>
                </div>
                <span className={styles.hint} style={{ display: 'block', marginTop: '4px' }}>
                  Example baseline only. Multiples vary by industry, revenue size, customer concentration, and growth rate.
                </span>
              </div>

              {/* Balance Sheet Adjustments */}
              <div style={{ borderTop: '1px solid var(--border, #e2e8f0)', paddingTop: '16px' }}>
                <div className={styles.cardTitle}>
                  <span>EV to Equity Bridge (Debt &amp; Cash)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-debt`} className={styles.label}>Debt to Repay at Close</label>
                    <div className={styles.inputGroup}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${uid}-debt`}
                        type="number"
                        step="5000"
                        value={debtToRepay || ''}
                        onChange={(e) => setDebtToRepay(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-cash`} className={styles.label}>Cash Retained by Seller</label>
                    <div className={styles.inputGroup}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${uid}-cash`}
                        type="number"
                        step="5000"
                        value={cashKeptBySeller || ''}
                        onChange={(e) => setCashKeptBySeller(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>
                <span>Valuation Outputs</span>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className={styles.actionBtn}
                >
                  {copied ? '✓ Copied' : '📋 Copy Summary'}
                </button>
              </div>

              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Estimated Enterprise Value</div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtCurrency(valuationResult.enterpriseValueMid)}
                  </div>
                  <div className={styles.hint} style={{ marginTop: '2px' }}>
                    Range: {fmtCurrency(valuationResult.enterpriseValueLow)} – {fmtCurrency(valuationResult.enterpriseValueHigh)}
                  </div>
                </div>

                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Net Owner Cash Proceeds</div>
                  <div className={`${styles.headlineValue} ${styles.greenValue}`}>
                    {fmtCurrency(valuationResult.equityValueMid)}
                  </div>
                  <div className={styles.hint} style={{ marginTop: '2px' }}>
                    After paying debt ({fmtCurrency(debtToRepay)}) &amp; keeping cash
                  </div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Total Seller&apos;s Discretionary Earnings (SDE)</span>
                  <span className={styles.metricVal}>{fmtCurrency(sdeResult.sde)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Midpoint Valuation Multiple</span>
                  <span className={styles.metricVal}>{valuationResult.multipleMid.toFixed(2)}× SDE</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Tangible Net Asset Liquidation Floor</span>
                  <span className={styles.metricVal}>{fmtCurrency(assetResult.netAssetValue)}</span>
                </div>
              </div>

              {/* SDE Add-Back Bridge Table */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--ink-1, #0f172a)' }}>
                  SDE Add-Back Breakdown
                </div>
                <table className={styles.bridgeTable}>
                  <thead>
                    <tr>
                      <th>Line Item</th>
                      <th>Buyer Acceptance</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sdeResult.bridge.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.label}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{item.description}</div>
                        </td>
                        <td>
                          {item.buyerAcceptance === 'generally-accepted' ? (
                            <span className={styles.badgeAccepted}>Standard</span>
                          ) : (
                            <span className={styles.badgeScrutinized}>Scrutinized</span>
                          )}
                        </td>
                        <td>{fmtCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                      <td colSpan={2}>Total SDE (Cash Flow Available to 1 Owner)</td>
                      <td style={{ color: '#047857' }}>{fmtCurrency(sdeResult.sde)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 5x5 Sensitivity Grid */}
              <div className={styles.matrixWrap}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--ink-1, #0f172a)' }}>
                  Valuation Sensitivity (Earnings ±10% vs. Multiple ±0.5×)
                </div>
                <table className={styles.matrixTable}>
                  <thead>
                    <tr>
                      <th>Earnings / Mult</th>
                      {sensitivityMatrix.multipleSteps.map((m, idx) => (
                        <th key={idx}>{m.toFixed(2)}×</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityMatrix.grid.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td style={{ fontWeight: 700, textAlign: 'left', background: 'var(--surface-2, #f8fafc)' }}>
                          {fmtCurrency(row[0].earnings)} ({row[0].earningsDeltaPct > 0 ? `+${row[0].earningsDeltaPct}%` : `${row[0].earningsDeltaPct}%`})
                        </td>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={rIdx === 2 && cIdx === 2 ? styles.matrixCenterCell : ''}
                          >
                            {fmtCurrency(cell.enterpriseValue)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={styles.actionBtn}
                >
                  🖨️ Print Valuation Report
                </button>
              </div>

              {/* YMYL Notice */}
              <div className={styles.ymylCard}>
                <strong>Valuation Disclaimer:</strong> This calculation provides planning estimates only and does not constitute a certified appraisal. Formal valuations for SBA lending, partner buyouts, litigation, or IRS tax compliance require certified business appraisers (CVA, ASA, or CPA/ABV).
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: EBITDA Mode */}
        {activeTab === 'ebitda' && (
          <div className={styles.calculatorGrid}>
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>EBITDA Adjustments</div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-sde-ref`} className={styles.label}>Base SDE (from Tab 1)</label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-sde-ref`}
                    type="number"
                    disabled
                    value={sdeResult.sde}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    style={{ background: '#f1f5f9' }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor={`${uid}-mgr-pay`} className={styles.label}>Replacement Manager Salary</label>
                  <span className={styles.hint}>Market rate to replace you</span>
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-mgr-pay`}
                    type="number"
                    step="5000"
                    value={replacementManagerSalary || ''}
                    onChange={(e) => setReplacementManagerSalary(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
                <span className={styles.hint}>
                  Deducts the cost of hiring a General Manager so the business can operate under absentee or institutional ownership.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-ebitda-mult-low`} className={styles.label}>EBITDA Multiple Low</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-ebitda-mult-low`}
                      type="number"
                      step="0.25"
                      value={multipleLow}
                      onChange={(e) => setMultipleLow(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>×</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-ebitda-mult-high`} className={styles.label}>EBITDA Multiple High</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-ebitda-mult-high`}
                      type="number"
                      step="0.25"
                      value={multipleHigh}
                      onChange={(e) => setMultipleHigh(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>×</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>EBITDA Valuation Breakdown</div>
              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Reported P&amp;L EBITDA</div>
                  <div className={styles.headlineValue}>
                    {fmtCurrency(ebitdaResult.reportedEbitda)}
                  </div>
                </div>

                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Adjusted EBITDA</div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtCurrency(ebitdaResult.adjustedEbitda)}
                  </div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Enterprise Value Range ({multipleLow}× – {multipleHigh}×)</span>
                  <span className={styles.metricVal}>
                    {fmtCurrency(valuationResult.enterpriseValueLow)} – {fmtCurrency(valuationResult.enterpriseValueHigh)}
                  </span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Midpoint Valuation</span>
                  <span className={styles.metricVal}>{fmtCurrency(valuationResult.enterpriseValueMid)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Net Equity After Debt ({fmtCurrency(debtToRepay)})</span>
                  <span className={styles.metricVal} style={{ color: '#047857' }}>
                    {fmtCurrency(valuationResult.equityValueMid)}
                  </span>
                </div>
              </div>

              <div className={styles.ymylCard} style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#14532d' }}>
                <strong>When to Use EBITDA:</strong> Institutional buyers and private equity firms use EBITDA rather than SDE because they do not plan to work as daily owner-operators.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Asset Check Mode */}
        {activeTab === 'asset' && (
          <div className={styles.calculatorGrid}>
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>Tangible Asset Inventory</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-asset-equip`} className={styles.label}>Machinery &amp; Equipment (FMV)</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-asset-equip`}
                      type="number"
                      value={equipmentValue || ''}
                      onChange={(e) => setEquipmentValue(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-asset-inv`} className={styles.label}>Salable Inventory (Cost)</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-asset-inv`}
                      type="number"
                      value={inventoryValue || ''}
                      onChange={(e) => setInventoryValue(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-asset-ar`} className={styles.label}>Accounts Receivable</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-asset-ar`}
                      type="number"
                      value={accountsReceivable || ''}
                      onChange={(e) => setAccountsReceivable(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-asset-cash`} className={styles.label}>Cash &amp; Deposits</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-asset-cash`}
                      type="number"
                      value={cashAndEquivalents || ''}
                      onChange={(e) => setCashAndEquivalents(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-asset-other`} className={styles.label}>Other Tangible Assets</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-asset-other`}
                      type="number"
                      value={otherTangibleAssets || ''}
                      onChange={(e) => setOtherTangibleAssets(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-asset-liab`} className={styles.label}>Total Liabilities</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-asset-liab`}
                      type="number"
                      value={totalLiabilities || ''}
                      onChange={(e) => setTotalLiabilities(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>Asset Floor Analysis</div>
              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Total Tangible Assets</div>
                  <div className={styles.headlineValue}>
                    {fmtCurrency(assetResult.totalTangibleAssets)}
                  </div>
                </div>

                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Net Asset Value (Floor)</div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtCurrency(assetResult.netAssetValue)}
                  </div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Earnings Valuation (Midpoint)</span>
                  <span className={styles.metricVal}>{fmtCurrency(valuationResult.enterpriseValueMid)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Intangible Goodwill Premium</span>
                  <span className={styles.metricVal} style={{ color: '#047857' }}>
                    {fmtCurrency(Math.max(0, valuationResult.enterpriseValueMid - assetResult.netAssetValue))}
                  </span>
                </div>
              </div>

              <div className={styles.ymylCard}>
                <strong>Asset Floor Principle:</strong> A healthy, profitable business sells for more than its Net Asset Value because its ongoing cash flow, brand, and customer relationships represent intangible goodwill.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Deal Structure Mode */}
        {activeTab === 'deal' && (
          <div className={styles.calculatorGrid}>
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>Capital Stack Percentages</div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-deal-cash`} className={styles.label}>Cash at Close %</label>
                <div className={styles.inputGroup}>
                  <input
                    id={`${uid}-deal-cash`}
                    type="number"
                    min="0"
                    max="100"
                    value={dealCashPct}
                    onChange={(e) => setDealCashPct(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-deal-note`} className={styles.label}>Seller Note %</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-deal-note`}
                      type="number"
                      min="0"
                      max="100"
                      value={dealNotePct}
                      onChange={(e) => setDealNotePct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-deal-earn`} className={styles.label}>Earn-Out %</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-deal-earn`}
                      type="number"
                      min="0"
                      max="100"
                      value={dealEarnPct}
                      onChange={(e) => setDealEarnPct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-deal-rate`} className={styles.label}>Seller Note Interest Rate</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-deal-rate`}
                      type="number"
                      step="0.5"
                      value={dealNoteRate}
                      onChange={(e) => setDealNoteRate(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-deal-years`} className={styles.label}>Seller Note Term</label>
                  <select
                    id={`${uid}-deal-years`}
                    value={dealNoteYears}
                    onChange={(e) => setDealNoteYears(Number(e.target.value))}
                    className={styles.input}
                  >
                    <option value={3}>3 years (36 mo)</option>
                    <option value={5}>5 years (60 mo)</option>
                    <option value={7}>7 years (84 mo)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>Deal Payout Waterfall</div>
              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Cash Wire at Closing</div>
                  <div className={`${styles.headlineValue} ${styles.greenValue}`}>
                    {fmtCurrency(dealResult.cashAtCloseAmount)}
                  </div>
                  <div className={styles.hint}>{dealCashPct}% of enterprise value</div>
                </div>

                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Seller Note Monthly Pmt</div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtDec(dealResult.sellerNoteMonthlyPayment)}/mo
                  </div>
                  <div className={styles.hint}>Principal: {fmtCurrency(dealResult.sellerNoteAmount)}</div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Seller Note Total Interest Earned</span>
                  <span className={styles.metricVal} style={{ color: '#047857' }}>
                    +{fmtCurrency(dealResult.sellerNoteTotalInterest)}
                  </span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Contingent Performance Earn-Out</span>
                  <span className={styles.metricVal}>{fmtCurrency(dealResult.earnOutAmount)}</span>
                </div>
              </div>

              <div className={styles.ymylCard}>
                <strong>SBA Standstill Note:</strong> When buyers use SBA 7(a) financing, the SBA often requires seller notes to be on full standby (zero principal or interest payments) for up to 24 months.
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
