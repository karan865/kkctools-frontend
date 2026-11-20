'use client';

import React, { useState, useId, useMemo } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider from '@/components/tool/shared/TabSlider';
import { EquipmentInputGuide } from './EquipmentInputGuide';
import {
  calculateEquipmentLoan,
  calculateLeaseVsLoanVsCash,
  calculateEquipmentRoi,
  calculateMca,
  calculateLineOfCredit,
  type PaymentFrequency,
} from '@/lib/equipment-loan-engine';
import styles from './EquipmentLoanCalculator.module.css';

type TabMode = 'loan' | 'lease' | 'loc' | 'mca';

export function EquipmentLoanCalculator() {
  const uid = useId();

  // URL Tab sync
  const [activeTab, setActiveTab] = useState<TabMode>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('tab');
      if (p === 'lease' || p === 'loc' || p === 'mca') return p;
    }
    return 'loan';
  });

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab as TabMode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Tab 1: Equipment Loan Inputs
  const [price, setPrice] = useState<number>(80000);
  const [taxPct, setTaxPct] = useState<number>(6);
  const [fees, setFees] = useState<number>(500);
  const [down, setDown] = useState<number>(10000);
  const [tradeIn, setTradeIn] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [balloonAmount, setBalloonAmount] = useState<number>(0);
  const [frequency, setFrequency] = useState<PaymentFrequency>('monthly');

  // ROI / Payback inputs
  const [enableRoi, setEnableRoi] = useState<boolean>(false);
  const [monthlyBenefit, setMonthlyBenefit] = useState<number>(3500);
  const [monthlyOperatingCost, setMonthlyOperatingCost] = useState<number>(800);

  // Tab 2: Lease vs Loan vs Cash Inputs
  const [leasePmt, setLeasePmt] = useState<number>(1450);
  const [leaseTerm, setLeaseTerm] = useState<number>(60);
  const [leaseUpfront, setLeaseUpfront] = useState<number>(2900);
  const [leaseBuyoutType, setLeaseBuyoutType] = useState<'$1' | 'fmv' | 'none'>('$1');
  const [leaseBuyoutAmount, setLeaseBuyoutAmount] = useState<number>(1);
  const [resaleValueAtEnd, setResaleValueAtEnd] = useState<number>(25000);

  // Tab 3: Line of Credit Inputs
  const [locLimit, setLocLimit] = useState<number>(100000);
  const [locDrawn, setLocDrawn] = useState<number>(40000);
  const [locRate, setLocRate] = useState<number>(9.5);
  const [locRepayMonths, setLocRepayMonths] = useState<number>(36);

  // Tab 4: MCA Inputs
  const [mcaAdvance, setMcaAdvance] = useState<number>(50000);
  const [mcaFactor, setMcaFactor] = useState<number>(1.35);
  const [mcaDays, setMcaDays] = useState<number>(180);
  const [mcaFreq, setMcaFreq] = useState<'daily' | 'weekly'>('daily');

  // Schedule view toggle
  const [scheduleView, setScheduleView] = useState<'annual' | 'monthly'>('annual');
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
  const loanResult = useMemo(() => {
    return calculateEquipmentLoan({
      equipmentPrice: price,
      salesTaxPercent: taxPct,
      lenderFees: fees,
      downPayment: down,
      tradeInValue: tradeIn,
      annualInterestRate: interestRate,
      termMonths,
      balloonPayment: balloonAmount,
      frequency,
    });
  }, [price, taxPct, fees, down, tradeIn, interestRate, termMonths, balloonAmount, frequency]);

  const roiResult = useMemo(() => {
    if (!enableRoi) return null;
    return calculateEquipmentRoi({
      equipmentPrice: price,
      downPayment: down,
      lenderFees: fees,
      monthlyLoanPayment: loanResult.monthlyPayment,
      monthlyRevenueOrSavings: monthlyBenefit,
      monthlyOperatingCost,
    });
  }, [enableRoi, price, down, fees, loanResult.monthlyPayment, monthlyBenefit, monthlyOperatingCost]);

  const leaseCompResult = useMemo(() => {
    return calculateLeaseVsLoanVsCash({
      equipmentPrice: price,
      salesTaxPercent: taxPct,
      resaleValueAtEnd,
      loanDownPayment: down,
      loanFees: fees,
      loanInterestRate: interestRate,
      loanTermMonths: termMonths,
      loanBalloon: balloonAmount,
      leaseMonthlyPayment: leasePmt,
      leaseTermMonths: leaseTerm,
      leaseUpfrontCosts: leaseUpfront,
      leaseBuyoutType,
      leaseBuyoutAmount,
    });
  }, [
    price,
    taxPct,
    resaleValueAtEnd,
    down,
    fees,
    interestRate,
    termMonths,
    balloonAmount,
    leasePmt,
    leaseTerm,
    leaseUpfront,
    leaseBuyoutType,
    leaseBuyoutAmount,
  ]);

  const locResult = useMemo(() => {
    return calculateLineOfCredit({
      creditLimit: locLimit,
      amountDrawn: locDrawn,
      annualInterestRate: locRate,
      repaymentMonths: locRepayMonths,
    });
  }, [locLimit, locDrawn, locRate, locRepayMonths]);

  const mcaResult = useMemo(() => {
    return calculateMca({
      advanceAmount: mcaAdvance,
      factorRate: mcaFactor,
      repaymentDays: mcaDays,
      remittanceFrequency: mcaFreq,
    });
  }, [mcaAdvance, mcaFactor, mcaDays, mcaFreq]);

  // Copy Summary
  const handleCopySummary = () => {
    let summaryText = '';
    if (activeTab === 'loan') {
      summaryText = `Equipment Loan Summary:\nPrice: ${fmtCurrency(price)}\nAmount Financed: ${fmtCurrency(loanResult.amountFinanced)}\nRate: ${interestRate}% APR\nTerm: ${termMonths} months (${frequency})\nPayment: ${fmtDec(loanResult.periodicPayment)} / ${frequency}\nTotal Interest: ${fmtDec(loanResult.totalInterest)}\nTotal Cost: ${fmtDec(loanResult.totalCostOfLoan)}`;
    } else if (activeTab === 'lease') {
      summaryText = `Lease vs Loan vs Cash Summary:\nCheapest Option: ${leaseCompResult.cheapestOption.toUpperCase()}\nCash Net Cost: ${fmtCurrency(leaseCompResult.cash.netCostAfterResale)}\nLoan Net Cost: ${fmtCurrency(leaseCompResult.loan.netCostAfterResale)}\nLease Net Cost: ${fmtCurrency(leaseCompResult.lease.netCostAfterResale)}`;
    } else if (activeTab === 'mca') {
      summaryText = `MCA Advance Summary:\nAdvance: ${fmtCurrency(mcaAdvance)}\nFactor: ${mcaFactor}\nTotal Payback: ${fmtCurrency(mcaResult.totalPayback)}\nDaily/Weekly Payment: ${fmtDec(mcaResult.paymentPerRemittance)}\nNominal APR: ${mcaResult.nominalApr}%`;
    } else {
      summaryText = `Line of Credit Summary:\nLimit: ${fmtCurrency(locLimit)}\nDrawn: ${fmtCurrency(locDrawn)}\nDraw Period Interest: ${fmtDec(locResult.drawPeriodMonthlyInterest)}/mo\nRepayment Pmt: ${fmtDec(locResult.repaymentPeriodMonthlyPayment)}/mo`;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <ToolShell
      features={[
        'Lease vs loan vs cash',
        '24–84 month table',
        'MCA factor → APR',
        'Printable schedule',
      ]}
    >
      <div className={styles.container}>
        {/* Navigation Tabs */}
        <div className={styles.tabWrapper}>
          <TabSlider
            tabs={[
              { id: 'loan', label: 'Equipment Loan' },
              { id: 'lease', label: 'Lease vs Loan vs Cash' },
              { id: 'loc', label: 'Business Line of Credit' },
              { id: 'mca', label: 'Merchant Advance (MCA)' },
            ]}
            activeId={activeTab}
            onChange={handleTabChange}
            ariaLabel="Equipment and business financing calculator modes"
          />
        </div>

        {/* Dynamic BLUF Summary Banner */}
        <div className={styles.summaryBanner}>
          {activeTab === 'loan' && (
            <span>
              <strong>Bottom Line:</strong> Financing <strong>{fmtCurrency(loanResult.amountFinanced)}</strong> of equipment at{' '}
              <strong>{interestRate}% APR</strong> for <strong>{termMonths} months</strong> costs{' '}
              <strong>{fmtDec(loanResult.periodicPayment)}</strong> per {frequency === 'monthly' ? 'month' : frequency} and{' '}
              <strong>{fmtCurrency(loanResult.totalInterest)}</strong> in total financing interest.
            </span>
          )}
          {activeTab === 'lease' && (
            <span>
              <strong>Bottom Line:</strong> Comparing options for a {fmtCurrency(price)} equipment purchase over {leaseTerm} months:{' '}
              <strong>{leaseCompResult.cheapestOption.toUpperCase()}</strong> is the most cost-effective path, saving{' '}
              <strong>{fmtCurrency(leaseCompResult.savingsVsHighest)}</strong> in lifetime net cost after accounting for resale equity.
            </span>
          )}
          {activeTab === 'loc' && (
            <span>
              <strong>Bottom Line:</strong> Drawing <strong>{fmtCurrency(locDrawn)}</strong> from a {fmtCurrency(locLimit)} credit line at{' '}
              <strong>{locRate}% APR</strong> costs <strong>{fmtDec(locResult.drawPeriodMonthlyInterest)}/month</strong> in interest-only servicing,
              followed by <strong>{fmtDec(locResult.repaymentPeriodMonthlyPayment)}/month</strong> across {locRepayMonths} months to amortize to zero.
            </span>
          )}
          {activeTab === 'mca' && (
            <span>
              <strong>Bottom Line:</strong> A <strong>{fmtCurrency(mcaAdvance)}</strong> advance with a <strong>{mcaFactor} factor rate</strong> requires{' '}
              <strong>{fmtCurrency(mcaResult.totalPayback)}</strong> in total repayment ({fmtDec(mcaResult.paymentPerRemittance)} {mcaFreq}), translating to an effective{' '}
              <strong>{mcaResult.nominalApr}% nominal APR</strong> over {mcaDays} days.
            </span>
          )}
        </div>

        {/* Interactive Visual Guide Diagram */}
        <EquipmentInputGuide
          activeTab={activeTab}
          price={price}
          taxAmount={loanResult.salesTaxAmount}
          fees={fees}
          down={down}
          tradeIn={tradeIn}
          amountFinanced={loanResult.amountFinanced}
          termMonths={termMonths}
          balloon={balloonAmount}
        />

        {/* Tab 1: Equipment Loan Mode */}
        {activeTab === 'loan' && (
          <div className={styles.calculatorGrid}>
            {/* Input Controls */}
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>
                <span>Loan Parameters</span>
                <span className={styles.hint}>Contractor &amp; Farm Equipment</span>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor={`${uid}-price`} className={styles.label}>Equipment Purchase Price</label>
                  <span className={styles.hint}>MSRP or negotiated cost</span>
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-price`}
                    type="number"
                    min="1000"
                    step="1000"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-tax`} className={styles.label}>Sales Tax</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-tax`}
                      type="number"
                      min="0"
                      max="15"
                      step="0.1"
                      value={taxPct || ''}
                      onChange={(e) => setTaxPct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-fees`} className={styles.label}>Lender / Doc Fees</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-fees`}
                      type="number"
                      min="0"
                      step="100"
                      value={fees || ''}
                      onChange={(e) => setFees(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-down`} className={styles.label}>Cash Down Payment</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-down`}
                      type="number"
                      min="0"
                      step="1000"
                      value={down || ''}
                      onChange={(e) => setDown(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-trade`} className={styles.label}>Trade-In Equity</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-trade`}
                      type="number"
                      min="0"
                      step="1000"
                      value={tradeIn || ''}
                      onChange={(e) => setTradeIn(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-rate`} className={styles.label}>Interest Rate (APR)</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-rate`}
                      type="number"
                      min="0"
                      max="30"
                      step="0.05"
                      value={interestRate || ''}
                      onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-term`} className={styles.label}>Loan Term</label>
                  <select
                    id={`${uid}-term`}
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    className={styles.select}
                  >
                    <option value={24}>24 months (2 years)</option>
                    <option value={36}>36 months (3 years)</option>
                    <option value={48}>48 months (4 years)</option>
                    <option value={60}>60 months (5 years)</option>
                    <option value={72}>72 months (6 years)</option>
                    <option value={84}>84 months (7 years)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-freq`} className={styles.label}>Payment Frequency</label>
                  <select
                    id={`${uid}-freq`}
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as PaymentFrequency)}
                    className={styles.select}
                  >
                    <option value="monthly">Monthly (12/yr)</option>
                    <option value="quarterly">Quarterly (4/yr)</option>
                    <option value="semi-annual">Semi-Annual (2/yr)</option>
                    <option value="annual">Annual (Farm / Seasonal)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-balloon`} className={styles.label}>Optional Balloon ($)</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-balloon`}
                      type="number"
                      min="0"
                      step="1000"
                      value={balloonAmount || ''}
                      onChange={(e) => setBalloonAmount(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              {/* Optional ROI / Payback toggle */}
              <div style={{ borderTop: '1px solid var(--border, #e2e8f0)', paddingTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={enableRoi}
                    onChange={(e) => setEnableRoi(e.target.checked)}
                  />
                  <span>Calculate Equipment ROI &amp; Payback Period</span>
                </label>

                {enableRoi && (
                  <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`${uid}-benefit`} className={styles.label}>Monthly Revenue / Savings</label>
                      <div className={styles.inputGroup}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id={`${uid}-benefit`}
                          type="number"
                          value={monthlyBenefit || ''}
                          onChange={(e) => setMonthlyBenefit(Number(e.target.value) || 0)}
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor={`${uid}-opcost`} className={styles.label}>Monthly Operating Cost</label>
                      <div className={styles.inputGroup}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id={`${uid}-opcost`}
                          type="number"
                          value={monthlyOperatingCost || ''}
                          onChange={(e) => setMonthlyOperatingCost(Number(e.target.value) || 0)}
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Output Card */}
            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>
                <span>Financing Results</span>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className={styles.actionBtn}
                  aria-label="Copy summary"
                >
                  {copied ? '✓ Copied' : '📋 Copy Summary'}
                </button>
              </div>

              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>
                    {frequency === 'monthly' ? 'Estimated Monthly Payment' : `${frequency.toUpperCase()} PAYMENT`}
                  </div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtDec(loanResult.periodicPayment)}
                  </div>
                </div>

                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Total Interest Paid</div>
                  <div className={styles.headlineValue}>
                    {fmtCurrency(loanResult.totalInterest)}
                  </div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Gross Equipment Cost (inc. Tax &amp; Fees)</span>
                  <span className={styles.metricVal}>{fmtCurrency(loanResult.grossCost)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Net Amount Financed</span>
                  <span className={styles.metricVal}>{fmtCurrency(loanResult.amountFinanced)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Total Payments ({loanResult.totalPaymentsCount})</span>
                  <span className={styles.metricVal}>{fmtCurrency(loanResult.totalCostOfLoan)}</span>
                </div>
                {loanResult.effectiveApr && (
                  <div className={styles.metricRow}>
                    <span className={styles.metricKey}>Effective APR (with $500 doc fees)</span>
                    <span className={styles.metricVal}>{loanResult.effectiveApr.toFixed(2)}%</span>
                  </div>
                )}
              </div>

              {/* Term comparison table */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--ink-1, #0f172a)' }}>
                  Monthly Payment by Loan Term (24 to 84 Months)
                </div>
                <table className={styles.termTable}>
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Monthly Payment</th>
                      <th>Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanResult.termOptions.map((opt) => (
                      <tr
                        key={opt.months}
                        className={opt.months === termMonths ? styles.activeTermRow : ''}
                      >
                        <td>{opt.months} months ({opt.months / 12} yrs)</td>
                        <td>{fmtDec(opt.payment)}</td>
                        <td>{fmtCurrency(opt.totalInterest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ROI & Payback Section */}
              {roiResult && (
                <div className={styles.roiCard}>
                  <div className={styles.roiHeadline}>
                    <span>Equipment ROI &amp; Payback</span>
                    <span>{roiResult.paybackMonths ? `${roiResult.paybackMonths} Months Payback` : 'Cash Flow Negative'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8125rem' }}>
                    <div>Net Monthly Cash Flow: <strong>{fmtDec(roiResult.netMonthlyCashFlowAfterLoan)}</strong></div>
                    <div>Annualized Cash ROI: <strong>{roiResult.annualRoiPercent ? `${roiResult.annualRoiPercent}%` : 'N/A'}</strong></div>
                  </div>
                </div>
              )}

              {/* Amortization Schedule with Toggle */}
              <div className={styles.scheduleSection}>
                <div className={styles.scheduleHeader}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink-1, #0f172a)' }}>
                    Amortization Schedule
                  </span>
                  <div className={styles.scheduleToggle}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${scheduleView === 'annual' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setScheduleView('annual')}
                    >
                      Annual
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${scheduleView === 'monthly' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setScheduleView('monthly')}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <div className={styles.scheduleScroll}>
                  <table className={styles.scheduleTable}>
                    <thead>
                      <tr>
                        <th>{scheduleView === 'annual' ? 'Year' : 'Month'}</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleView === 'annual'
                        ? loanResult.scheduleResult.annualSummaries.map((yr) => (
                            <tr key={yr.year}>
                              <td>Year {yr.year}</td>
                              <td>{fmtCurrency(yr.totalPayments)}</td>
                              <td>{fmtCurrency(yr.principalPaid)}</td>
                              <td>{fmtCurrency(yr.interestPaid)}</td>
                              <td>{fmtCurrency(yr.endingBalance)}</td>
                            </tr>
                          ))
                        : loanResult.scheduleResult.monthlyRows.map((mo) => (
                            <tr key={mo.month}>
                              <td>Mo {mo.month}</td>
                              <td>{fmtDec(mo.payment)}</td>
                              <td>{fmtDec(mo.principal)}</td>
                              <td>{fmtDec(mo.interest)}</td>
                              <td>{fmtCurrency(mo.endingBalance)}</td>
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
                    🖨️ Print Schedule
                  </button>
                </div>
              </div>

              {/* Section 179 YMYL Notice */}
              <div className={styles.ymylCard}>
                <strong>IRS Section 179 Tax Deduction:</strong> Qualified commercial machinery and heavy equipment purchased or financed can be fully expensed in the tax year placed in service. Verify annual deduction limits with your CPA at <a href="https://www.irs.gov/newsroom/heres-what-businesses-need-to-know-about-the-section-179-deduction" target="_blank" rel="noopener noreferrer" style={{ color: '#b45309', textDecoration: 'underline' }}>IRS.gov Section 179</a>.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lease vs Loan vs Cash Mode */}
        {activeTab === 'lease' && (
          <div className={styles.container}>
            <div className={styles.comparisonGrid}>
              {/* Cash Purchase Card */}
              <div className={`${styles.compareCard} ${leaseCompResult.cheapestOption === 'cash' ? styles.cheapestCard : ''}`}>
                {leaseCompResult.cheapestOption === 'cash' && <span className={styles.cheapestBadge}>Lowest Total Cost</span>}
                <div className={styles.compareCardTitle}>Option 1: Cash Purchase</div>
                <div className={styles.compareCardPrice}>{fmtCurrency(leaseCompResult.cash.netCostAfterResale)}</div>
                <span className={styles.hint}>Net cost after resale equity</span>

                <div className={styles.compareList}>
                  <div className={styles.compareItem}>
                    <span>Upfront Outlay:</span>
                    <strong>{fmtCurrency(leaseCompResult.cash.upfrontCost)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Monthly Payment:</span>
                    <strong>$0.00</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Total Financing Interest:</span>
                    <strong>$0.00</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Estimated Resale Value:</span>
                    <strong style={{ color: '#16a34a' }}>−{fmtCurrency(resaleValueAtEnd)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Ownership at End:</span>
                    <strong>Yes (100% Equity)</strong>
                  </div>
                </div>
              </div>

              {/* Equipment Loan Card */}
              <div className={`${styles.compareCard} ${leaseCompResult.cheapestOption === 'loan' ? styles.cheapestCard : ''}`}>
                {leaseCompResult.cheapestOption === 'loan' && <span className={styles.cheapestBadge}>Lowest Total Cost</span>}
                <div className={styles.compareCardTitle}>Option 2: Equipment Loan</div>
                <div className={styles.compareCardPrice}>{fmtCurrency(leaseCompResult.loan.netCostAfterResale)}</div>
                <span className={styles.hint}>Net cost after resale equity</span>

                <div className={styles.compareList}>
                  <div className={styles.compareItem}>
                    <span>Cash Down Payment:</span>
                    <strong>{fmtCurrency(leaseCompResult.loan.upfrontCost)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Monthly Payment:</span>
                    <strong>{fmtDec(leaseCompResult.loan.monthlyPayment)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Total Lifetime Payments:</span>
                    <strong>{fmtCurrency(leaseCompResult.loan.totalGrossCost)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Estimated Resale Value:</span>
                    <strong style={{ color: '#16a34a' }}>−{fmtCurrency(resaleValueAtEnd)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Ownership at End:</span>
                    <strong>Yes (Keep Title)</strong>
                  </div>
                </div>
              </div>

              {/* Equipment Lease Card */}
              <div className={`${styles.compareCard} ${leaseCompResult.cheapestOption === 'lease' ? styles.cheapestCard : ''}`}>
                {leaseCompResult.cheapestOption === 'lease' && <span className={styles.cheapestBadge}>Lowest Total Cost</span>}
                <div className={styles.compareCardTitle}>Option 3: Equipment Lease</div>
                <div className={styles.compareCardPrice}>{fmtCurrency(leaseCompResult.lease.netCostAfterResale)}</div>
                <span className={styles.hint}>Net cost after buyout &amp; resale</span>

                <div className={styles.compareList}>
                  <div className={styles.compareItem}>
                    <span>Upfront Outlay (First/Deposit):</span>
                    <strong>{fmtCurrency(leaseCompResult.lease.upfrontCost)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Monthly Lease Payment:</span>
                    <strong>{fmtDec(leaseCompResult.lease.monthlyPayment)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>End of Lease Buyout:</span>
                    <strong>{fmtCurrency(leaseCompResult.lease.buyoutCost)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Total Lifetime Payments:</span>
                    <strong>{fmtCurrency(leaseCompResult.lease.totalGrossCost)}</strong>
                  </div>
                  <div className={styles.compareItem}>
                    <span>Ownership at End:</span>
                    <strong>{leaseBuyoutType !== 'none' ? 'Yes (Via Buyout)' : 'No (Returned)'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Lease Customization Controls */}
            <div className={styles.inputCard} style={{ marginTop: '16px' }}>
              <div className={styles.cardTitle}>Adjust Lease &amp; Resale Assumptions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-lease-pmt`} className={styles.label}>Monthly Lease Payment</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-lease-pmt`}
                      type="number"
                      value={leasePmt || ''}
                      onChange={(e) => setLeasePmt(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-lease-upfront`} className={styles.label}>Lease Upfront Outlay</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-lease-upfront`}
                      type="number"
                      value={leaseUpfront || ''}
                      onChange={(e) => setLeaseUpfront(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-lease-term`} className={styles.label}>Lease Term</label>
                  <select
                    id={`${uid}-lease-term`}
                    value={leaseTerm}
                    onChange={(e) => setLeaseTerm(Number(e.target.value))}
                    className={styles.select}
                  >
                    <option value={24}>24 months (2 yrs)</option>
                    <option value={36}>36 months (3 yrs)</option>
                    <option value={48}>48 months (4 yrs)</option>
                    <option value={60}>60 months (5 yrs)</option>
                    <option value={72}>72 months (6 yrs)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-buyout`} className={styles.label}>Buyout Option at Maturity</label>
                  <select
                    id={`${uid}-buyout`}
                    value={leaseBuyoutType}
                    onChange={(e) => {
                      const val = e.target.value as '$1' | 'fmv' | 'none';
                      setLeaseBuyoutType(val);
                      if (val === '$1') setLeaseBuyoutAmount(1);
                      if (val === 'fmv') setLeaseBuyoutAmount(Math.round(price * 0.10));
                      if (val === 'none') setLeaseBuyoutAmount(0);
                    }}
                    className={styles.select}
                  >
                    <option value="$1">$1 Buyout Lease (Capital / Finance)</option>
                    <option value="fmv">Fair Market Value (FMV / Operating)</option>
                    <option value="none">No Buyout (Return Equipment)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-resale`} className={styles.label}>Est. Resale Value at End</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${uid}-resale`}
                      type="number"
                      value={resaleValueAtEnd || ''}
                      onChange={(e) => setResaleValueAtEnd(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Business Line of Credit Mode */}
        {activeTab === 'loc' && (
          <div className={styles.calculatorGrid}>
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>Line of Credit Setup</div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-loc-limit`} className={styles.label}>Total Credit Limit</label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-loc-limit`}
                    type="number"
                    value={locLimit || ''}
                    onChange={(e) => setLocLimit(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-loc-drawn`} className={styles.label}>Amount Drawn</label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-loc-drawn`}
                    type="number"
                    max={locLimit}
                    value={locDrawn || ''}
                    onChange={(e) => setLocDrawn(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-loc-rate`} className={styles.label}>Interest Rate (APR)</label>
                  <div className={styles.inputGroup}>
                    <input
                      id={`${uid}-loc-rate`}
                      type="number"
                      step="0.1"
                      value={locRate || ''}
                      onChange={(e) => setLocRate(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-loc-repay`} className={styles.label}>Repayment Period</label>
                  <select
                    id={`${uid}-loc-repay`}
                    value={locRepayMonths}
                    onChange={(e) => setLocRepayMonths(Number(e.target.value))}
                    className={styles.select}
                  >
                    <option value={12}>12 months (1 yr)</option>
                    <option value={24}>24 months (2 yrs)</option>
                    <option value={36}>36 months (3 yrs)</option>
                    <option value={60}>60 months (5 yrs)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>Revolving Facility Debt Service</div>
              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Draw Period (Interest-Only)</div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtDec(locResult.drawPeriodMonthlyInterest)}/mo
                  </div>
                </div>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Repayment Period (P &amp; I)</div>
                  <div className={styles.headlineValue}>
                    {fmtDec(locResult.repaymentPeriodMonthlyPayment)}/mo
                  </div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Available Undrawn Credit</span>
                  <span className={styles.metricVal} style={{ color: '#16a34a' }}>
                    {fmtCurrency(locResult.availableCredit)}
                  </span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Total Interest in Repayment Phase</span>
                  <span className={styles.metricVal}>{fmtCurrency(locResult.totalRepaymentInterest)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Merchant Cash Advance (MCA) Mode */}
        {activeTab === 'mca' && (
          <div className={styles.calculatorGrid}>
            <div className={styles.inputCard}>
              <div className={styles.cardTitle}>Merchant Cash Advance Parameters</div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-mca-adv`} className={styles.label}>Cash Advance Amount</label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${uid}-mca-adv`}
                    type="number"
                    value={mcaAdvance || ''}
                    onChange={(e) => setMcaAdvance(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-mca-factor`} className={styles.label}>Factor Rate</label>
                  <input
                    id={`${uid}-mca-factor`}
                    type="number"
                    step="0.01"
                    min="1.05"
                    max="1.60"
                    value={mcaFactor || ''}
                    onChange={(e) => setMcaFactor(Number(e.target.value) || 1.0)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-mca-days`} className={styles.label}>Repayment Term (Days)</label>
                  <input
                    id={`${uid}-mca-days`}
                    type="number"
                    step="30"
                    min="30"
                    max="365"
                    value={mcaDays || ''}
                    onChange={(e) => setMcaDays(Number(e.target.value) || 180)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-mca-freq`} className={styles.label}>Remittance Frequency</label>
                <select
                  id={`${uid}-mca-freq`}
                  value={mcaFreq}
                  onChange={(e) => setMcaFreq(e.target.value as 'daily' | 'weekly')}
                  className={styles.select}
                >
                  <option value="daily">Daily Business ACH (Mon–Fri)</option>
                  <option value="weekly">Weekly ACH</option>
                </select>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.cardTitle}>MCA True Cost &amp; Effective APR</div>
              <div className={styles.headlineGrid}>
                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Daily / Periodic Remittance</div>
                  <div className={`${styles.headlineValue} ${styles.primaryValue}`}>
                    {fmtDec(mcaResult.paymentPerRemittance)}
                  </div>
                </div>

                <div className={styles.headlineBox}>
                  <div className={styles.headlineLabel}>Total Payback Amount</div>
                  <div className={styles.headlineValue}>
                    {fmtCurrency(mcaResult.totalPayback)}
                  </div>
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Fixed Finance Fee</span>
                  <span className={styles.metricVal} style={{ color: '#dc2626' }}>
                    {fmtCurrency(mcaResult.totalFinanceCost)}
                  </span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricKey}>Annualized Nominal APR</span>
                  <span className={styles.metricVal} style={{ color: '#b91c1c' }}>
                    {mcaResult.nominalApr.toFixed(1)}% APR
                  </span>
                </div>
                {mcaResult.effectiveApr && (
                  <div className={styles.metricRow}>
                    <span className={styles.metricKey}>Compounding Effective APR</span>
                    <span className={styles.metricVal} style={{ color: '#b91c1c' }}>
                      {mcaResult.effectiveApr.toFixed(1)}% APR
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.ymylCard} style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' }}>
                <strong>MCA Disclosure Notice:</strong> Unlike conventional loans with declining balance amortization, Merchant Cash Advances charge a fixed fee based on the initial balance regardless of early payoff. Converted to an annual rate, the cost is often far higher than the factor rate suggests: see the APR figures above.
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
