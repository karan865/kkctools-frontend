'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import CommercialMortgageInputGuide, { CommercialMortgageFieldId } from './CommercialMortgageInputGuide';
import styles from './CommercialMortgageCalculator.module.css';
import {
  calculateCommercialMortgage,
  calculateMaxLoanSizing,
  calculateBalloonRefinance,
} from '@/lib/commercial-mortgage-engine';

type CommercialMortgageTab = 'payment' | 'sizing' | 'refinance';

const TABS: TabItem<CommercialMortgageTab>[] = [
  { id: 'payment', label: 'Payment & Balloon' },
  { id: 'sizing', label: 'How Much Can I Borrow?' },
  { id: 'refinance', label: 'Refinance the Balloon' },
];

function CommercialMortgageCalculatorInner() {
  const [activeTab, setActiveTab] = useState<CommercialMortgageTab>('payment');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as CommercialMortgageTab;
      if (tabParam === 'sizing' || tabParam === 'refinance') {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: CommercialMortgageTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<CommercialMortgageFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [viewMonthlySchedule, setViewMonthlySchedule] = useState(false);

  // Tab 1 (Payment & Balloon) Inputs
  const [propertyValue, setPropertyValue] = useState<number>(2000000);
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [ratePct, setRatePct] = useState<number>(7.0);
  const [termYears, setTermYears] = useState<number>(10);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);
  const [interestOnlyMonths, setInterestOnlyMonths] = useState<number>(0);
  const [pointsPct, setPointsPct] = useState<number>(1.0);
  const [otherClosingCosts, setOtherClosingCosts] = useState<number>(0);
  const [annualNoi, setAnnualNoi] = useState<number>(160000);

  // Tab 2 (How Much Can I Borrow?) Inputs
  const [maxLtvPct, setMaxLtvPct] = useState<number>(75);
  const [minDscr, setMinDscr] = useState<number>(1.25);
  const [minDebtYieldPct, setMinDebtYieldPct] = useState<number>(9.0);

  // Tab 3 (Refinance) Inputs
  const [refiRatePct, setRefiRatePct] = useState<number>(6.5);
  const [refiAmortYears, setRefiAmortYears] = useState<number>(20);
  const [refiClosingCosts, setRefiClosingCosts] = useState<number>(10000);

  // Calculations
  const loanResult = useMemo(() => {
    return calculateCommercialMortgage({
      propertyValue,
      loanAmount,
      ratePct,
      termYears,
      amortizationYears,
      interestOnlyMonths,
      pointsPct,
      otherClosingCosts,
      annualNoi,
    });
  }, [
    propertyValue,
    loanAmount,
    ratePct,
    termYears,
    amortizationYears,
    interestOnlyMonths,
    pointsPct,
    otherClosingCosts,
    annualNoi,
  ]);

  const sizingResult = useMemo(() => {
    return calculateMaxLoanSizing({
      propertyValue,
      annualNoi,
      ratePct,
      amortizationYears,
      maxLtvPct,
      minDscr,
      minDebtYieldPct,
    });
  }, [propertyValue, annualNoi, ratePct, amortizationYears, maxLtvPct, minDscr, minDebtYieldPct]);

  const refiResult = useMemo(() => {
    return calculateBalloonRefinance({
      balloonBalance: loanResult.balloonBalance,
      newRatePct: refiRatePct,
      newAmortizationYears: refiAmortYears,
      refinanceClosingCosts: refiClosingCosts,
    });
  }, [loanResult.balloonBalance, refiRatePct, refiAmortYears, refiClosingCosts]);

  const handleCopySummary = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    let summaryText = '';
    if (activeTab === 'payment') {
      summaryText = [
        'KKC Tools — Commercial Mortgage Underwriting Summary',
        `Property Value: $${propertyValue.toLocaleString()} | Loan Amount: $${loanAmount.toLocaleString()} (${loanResult.ltvPct}% LTV)`,
        `Interest Rate: ${ratePct.toFixed(2)}% APR | Term: ${termYears} Years | Amortization: ${amortizationYears} Years`,
        `Monthly Payment: $${loanResult.monthlyPayment.toLocaleString()}/mo ($${loanResult.annualDebtService.toLocaleString()}/yr)`,
        `Balloon Balance at Maturity: $${loanResult.balloonBalance.toLocaleString()}`,
        `Interest Paid in Term: $${loanResult.interestPaidInTerm.toLocaleString()} | Principal Paid: $${loanResult.principalPaidInTerm.toLocaleString()}`,
        `DSCR: ${loanResult.dscr !== null ? `${loanResult.dscr}×` : '—'} | Debt Yield: ${loanResult.debtYieldPct !== null ? `${loanResult.debtYieldPct}%` : '—'}`,
        `Effective APR with Fees: ${loanResult.effectiveRatePct !== null ? `${loanResult.effectiveRatePct}%` : '—'}`,
      ].join('\n');
    } else if (activeTab === 'sizing') {
      summaryText = [
        'KKC Tools — Commercial Loan Sizing & Borrowing Capacity',
        `Property Value: $${propertyValue.toLocaleString()} | Annual NOI: $${annualNoi.toLocaleString()}`,
        `Max Loan by LTV (${maxLtvPct}%): $${sizingResult.maxLoanByLtv.toLocaleString()}`,
        `Max Loan by DSCR (${minDscr}×): $${sizingResult.maxLoanByDscr.toLocaleString()}`,
        `Max Loan by Debt Yield (${minDebtYieldPct}%): $${sizingResult.maxLoanByDebtYield.toLocaleString()}`,
        `Binding Borrowing Capacity: $${sizingResult.bindingMaxLoan.toLocaleString()} (${sizingResult.bindingConstraintLabel})`,
        `Required Cash Equity: $${sizingResult.requiredEquity.toLocaleString()}`,
      ].join('\n');
    } else {
      summaryText = [
        'KKC Tools — Balloon Refinance Projection',
        `Original Balloon Balance: $${refiResult.originalBalloon.toLocaleString()}`,
        `Refinanced Amount (incl costs): $${refiResult.refinancedLoanAmount.toLocaleString()}`,
        `New Rate: ${refiRatePct.toFixed(2)}% | New Amortization: ${refiAmortYears} Years`,
        `New Monthly Payment: $${refiResult.newMonthlyPayment.toLocaleString()}/mo ($${refiResult.newAnnualDebtService.toLocaleString()}/yr)`,
      ].join('\n');
    }

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  // SVG Balance Curve Chart calculations
  const chartW = 420;
  const chartH = 200;
  const padL = 50;
  const padR = 25;
  const padT = 20;
  const padB = 30;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const maxChartYears = Math.max(1, amortizationYears);
  const maxChartPrincipal = Math.max(1000, loanAmount * 1.05);

  const toX = (yr: number) => padL + (yr / maxChartYears) * plotW;
  const toY = (bal: number) => padT + plotH - (bal / maxChartPrincipal) * plotH;

  const balloonX = toX(termYears);
  const balloonY = toY(loanResult.balloonBalance);

  return (
    <ToolShell
      features={[
        'Balloon & interest-only',
        'Max loan by LTV & DSCR',
        'Printable schedule',
        'Share link',
      ]}
    >
      <div className={styles.container}>
        {/* Tab Selection */}
        <div className={styles.tabWrapper}>
          <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="Commercial mortgage calculator modes" />
        </div>

        {/* Input Guide Diagram */}
        <CommercialMortgageInputGuide
          mode={activeTab}
          activeField={activeField}
          propertyValue={propertyValue}
          loanAmount={loanAmount}
          ltvPct={loanResult.ltvPct}
          ratePct={ratePct}
          termYears={termYears}
          amortizationYears={amortizationYears}
          interestOnlyMonths={interestOnlyMonths}
          balloonBalance={loanResult.balloonBalance}
          monthlyPayment={loanResult.monthlyPayment}
          bindingConstraint={sizingResult.bindingConstraint}
          maxLoanLtv={sizingResult.maxLoanByLtv}
          maxLoanDscr={sizingResult.maxLoanByDscr}
          maxLoanDy={sizingResult.maxLoanByDebtYield}
        />

        {/* High-Contrast Light Mint Summary Banner */}
        <div className={styles.summaryBanner} role="status">
          {activeTab === 'payment' ? (
            <>
              A <span className={styles.summaryHighlight}>${loanAmount.toLocaleString()}</span> commercial mortgage at{' '}
              <span className={styles.summaryHighlight}>{ratePct.toFixed(2)}%</span> on a{' '}
              <span className={styles.summaryHighlight}>{amortizationYears}-year amortization</span> costs{' '}
              <span className={styles.summaryHighlight}>${loanResult.monthlyPayment.toLocaleString()} a month</span>. After the{' '}
              <span className={styles.summaryHighlight}>{termYears}-year term</span>,{' '}
              <span className={styles.summaryHighlight}>${loanResult.balloonBalance.toLocaleString()}</span> is still owed as a
              balloon payment.
            </>
          ) : activeTab === 'sizing' ? (
            <>
              Based on <span className={styles.summaryHighlight}>${annualNoi.toLocaleString()} NOI</span> and{' '}
              <span className={styles.summaryHighlight}>${propertyValue.toLocaleString()} value</span>, your maximum borrowing capacity is{' '}
              <span className={styles.summaryHighlight}>${sizingResult.bindingMaxLoan.toLocaleString()}</span> (constrained by{' '}
              <span className={styles.summaryHighlight}>{sizingResult.bindingConstraintLabel}</span>), requiring{' '}
              <span className={styles.summaryHighlight}>${sizingResult.requiredEquity.toLocaleString()}</span> in cash equity.
            </>
          ) : (
            <>
              Refinancing your <span className={styles.summaryHighlight}>${refiResult.originalBalloon.toLocaleString()}</span> balloon balance
              at <span className={styles.summaryHighlight}>{refiRatePct.toFixed(2)}%</span> over{' '}
              <span className={styles.summaryHighlight}>{refiAmortYears} years</span> results in a new monthly payment of{' '}
              <span className={styles.summaryHighlight}>${refiResult.newMonthlyPayment.toLocaleString()}/month</span> ($
              {refiResult.newAnnualDebtService.toLocaleString()}/year).
            </>
          )}
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* LEFT: Inputs Card */}
          <div className={styles.formCard}>
            {activeTab === 'payment' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Loan &amp; Amortization Terms</h3>
                  <span className={styles.cardSubtitle}>User-Defined Quote Parameters</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-prop-val" className={styles.fieldLabel}>
                    <span>1. Property Purchase Price / Appraised Value</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cm-prop-val"
                      type="number"
                      step="10000"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={propertyValue || ''}
                      onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('propertyValue')}
                      onBlur={() => setActiveField(null)}
                    />
                  </div>
                </div>

                <div className={styles.twoColInputs}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="cm-loan-amt" className={styles.fieldLabel}>
                      <span>2. Loan Amount</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="cm-loan-amt"
                        type="number"
                        step="5000"
                        min="0"
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                        value={loanAmount || ''}
                        onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                        onFocus={() => setActiveField('loanAmount')}
                        onBlur={() => setActiveField(null)}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="cm-rate" className={styles.fieldLabel}>
                      <span>Interest Rate (APR)</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="cm-rate"
                        type="number"
                        step="0.05"
                        min="0"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={ratePct}
                        onChange={(e) => setRatePct(parseFloat(e.target.value) || 0)}
                        onFocus={() => setActiveField('ratePct')}
                        onBlur={() => setActiveField(null)}
                      />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColInputs}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="cm-term" className={styles.fieldLabel}>
                      <span>3. Loan Term (Years)</span>
                      <span className={styles.fieldHint}>When balloon is due</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="cm-term"
                        type="number"
                        step="1"
                        min="1"
                        max="30"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={termYears}
                        onChange={(e) => setTermYears(parseInt(e.target.value, 10) || 1)}
                        onFocus={() => setActiveField('termYears')}
                        onBlur={() => setActiveField(null)}
                      />
                      <span className={styles.inputSuffix}>yrs</span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="cm-amort" className={styles.fieldLabel}>
                      <span>4. Amortization (Years)</span>
                      <span className={styles.fieldHint}>Payment schedule basis</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="cm-amort"
                        type="number"
                        step="1"
                        min={termYears}
                        max="35"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={amortizationYears}
                        onChange={(e) => setAmortizationYears(parseInt(e.target.value, 10) || termYears)}
                        onFocus={() => setActiveField('amortizationYears')}
                        onBlur={() => setActiveField(null)}
                      />
                      <span className={styles.inputSuffix}>yrs</span>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColInputs}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="cm-io" className={styles.fieldLabel}>
                      <span>Interest-Only Period</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="cm-io"
                        type="number"
                        step="6"
                        min="0"
                        max={termYears * 12}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={interestOnlyMonths}
                        onChange={(e) => setInterestOnlyMonths(parseInt(e.target.value, 10) || 0)}
                        onFocus={() => setActiveField('interestOnlyMonths')}
                        onBlur={() => setActiveField(null)}
                      />
                      <span className={styles.inputSuffix}>mos</span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="cm-points" className={styles.fieldLabel}>
                      <span>Origination Points</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="cm-points"
                        type="number"
                        step="0.25"
                        min="0"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={pointsPct}
                        onChange={(e) => setPointsPct(parseFloat(e.target.value) || 0)}
                        onFocus={() => setActiveField('pointsPct')}
                        onBlur={() => setActiveField(null)}
                      />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-noi" className={styles.fieldLabel}>
                    <span>Annual Net Operating Income (NOI) (Optional)</span>
                    <span className={styles.fieldHint}>For DSCR &amp; debt yield</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cm-noi"
                      type="number"
                      step="5000"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={annualNoi || ''}
                      onChange={(e) => setAnnualNoi(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('annualNoi')}
                      onBlur={() => setActiveField(null)}
                    />
                  </div>
                </div>
              </>
            ) : activeTab === 'sizing' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Underwriting Criteria Inputs</h3>
                  <span className={styles.cardSubtitle}>Lender Sizing Limits</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="size-val" className={styles.fieldLabel}>
                    <span>Property Value ($)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="size-val"
                      type="number"
                      step="10000"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={propertyValue || ''}
                      onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="size-noi" className={styles.fieldLabel}>
                    <span>Annual Net Operating Income (NOI)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="size-noi"
                      type="number"
                      step="5000"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={annualNoi || ''}
                      onChange={(e) => setAnnualNoi(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.twoColInputs}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="size-ltv" className={styles.fieldLabel}>
                      <span>Max Allowed LTV</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="size-ltv"
                        type="number"
                        step="1"
                        min="50"
                        max="90"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={maxLtvPct}
                        onChange={(e) => setMaxLtvPct(parseFloat(e.target.value) || 0)}
                      />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="size-dscr" className={styles.fieldLabel}>
                      <span>Min Required DSCR</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="size-dscr"
                        type="number"
                        step="0.05"
                        min="1.0"
                        max="2.5"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={minDscr}
                        onChange={(e) => setMinDscr(parseFloat(e.target.value) || 1.25)}
                      />
                      <span className={styles.inputSuffix}>×</span>
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="size-dy" className={styles.fieldLabel}>
                    <span>Min Required Debt Yield</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="size-dy"
                      type="number"
                      step="0.5"
                      min="5"
                      max="20"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={minDebtYieldPct}
                      onChange={(e) => setMinDebtYieldPct(parseFloat(e.target.value) || 9.0)}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Refinance Terms at Maturity</h3>
                  <span className={styles.cardSubtitle}>Rollover of ${loanResult.balloonBalance.toLocaleString()} Balloon</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="refi-rate" className={styles.fieldLabel}>
                    <span>New Refinance Interest Rate</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="refi-rate"
                      type="number"
                      step="0.05"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={refiRatePct}
                      onChange={(e) => setRefiRatePct(parseFloat(e.target.value) || 0)}
                    />
                    <span className={styles.inputSuffix}>% APR</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="refi-amort" className={styles.fieldLabel}>
                    <span>New Amortization Period</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="refi-amort"
                      type="number"
                      step="1"
                      min="5"
                      max="30"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={refiAmortYears}
                      onChange={(e) => setRefiAmortYears(parseInt(e.target.value, 10) || 20)}
                    />
                    <span className={styles.inputSuffix}>years</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="refi-costs" className={styles.fieldLabel}>
                    <span>Refinance Closing Costs &amp; Fees</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="refi-costs"
                      type="number"
                      step="1000"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={refiClosingCosts || ''}
                      onChange={(e) => setRefiClosingCosts(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Results Card */}
          <div className={styles.resultsCard}>
            {activeTab === 'payment' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Underwriting &amp; Payment Results</h3>
                  <span className={styles.cardSubtitle}>Full Amortization &amp; Balloon</span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
                    <div className={styles.metricLabel}>Monthly Amortizing Payment</div>
                    <div className={`${styles.metricValue} ${styles.metricValuePrimary}`}>
                      ${loanResult.monthlyPayment.toLocaleString()}
                    </div>
                    <div className={styles.metricSubtext}>
                      ${loanResult.annualDebtService.toLocaleString()} annual debt service
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Balloon Balance at Maturity</div>
                    <div className={styles.metricValue} style={{ color: '#b91c1c' }}>
                      ${loanResult.balloonBalance.toLocaleString()}
                    </div>
                    <div className={styles.metricSubtext}>
                      Due at end of Year {termYears} ({((loanResult.balloonBalance / loanAmount) * 100).toFixed(1)}% of loan)
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Underwriting Coverage</div>
                    <div className={styles.metricValue}>
                      {loanResult.dscr !== null ? `${loanResult.dscr}×` : '—'}
                    </div>
                    <div className={styles.metricSubtext}>
                      {loanResult.debtYieldPct !== null ? `${loanResult.debtYieldPct}% Debt Yield` : 'Enter NOI to view'}
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Effective APR (with fees)</div>
                    <div className={styles.metricValue}>
                      {loanResult.effectiveRatePct !== null ? `${loanResult.effectiveRatePct}%` : `${ratePct}%`}
                    </div>
                    <div className={styles.metricSubtext}>
                      Includes ${loanResult.pointsAmount.toLocaleString()} points &amp; closing
                    </div>
                  </div>
                </div>

                {/* Inline SVG Balance Chart */}
                <div className={styles.chartContainer}>
                  <div className={styles.chartTitle}>Loan Balance Paydown Timeline</div>
                  <svg
                    className={styles.balanceSvg}
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    <line x1={padL} y1={padT} x2={padL} y2={chartH - padB} stroke="#cbd5e1" strokeWidth="1" />
                    <line x1={padL} y1={chartH - padB} x2={chartW - padR} y2={chartH - padB} stroke="#cbd5e1" strokeWidth="1" />

                    {/* Paydown curve line */}
                    <path
                      d={`M ${padL} ${toY(loanAmount)} Q ${(padL + balloonX) / 2} ${toY(loanAmount * 0.9)} ${balloonX} ${balloonY}`}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />

                    {/* Balloon point indicator */}
                    <circle cx={balloonX} cy={balloonY} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <line x1={balloonX} y1={balloonY} x2={balloonX} y2={chartH - padB} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={balloonX} y={balloonY - 8} textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="700">
                      Balloon ${Math.round(loanResult.balloonBalance / 1000)}k
                    </text>

                    {/* Axis Labels */}
                    <text x={chartW / 2} y={chartH - 8} textAnchor="middle" fill="#64748b" fontSize="10">
                      Years Elapsed
                    </text>
                    <text x={padL - 6} y={padT + 10} textAnchor="end" fill="#64748b" fontSize="9">
                      Principal ($)
                    </text>
                  </svg>
                </div>

                {/* Amortization Schedule Table */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    Amortization Schedule ({viewMonthlySchedule ? 'Monthly' : 'Annual Rollup'})
                  </span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => setViewMonthlySchedule(!viewMonthlySchedule)}
                  >
                    {viewMonthlySchedule ? 'Show Annual Summary' : 'Show Full Monthly Schedule'}
                  </button>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.scheduleTable}>
                    <thead>
                      <tr>
                        <th>{viewMonthlySchedule ? 'Month' : 'Year'}</th>
                        <th>Beginning Balance</th>
                        <th>Principal Paid</th>
                        <th>Interest Paid</th>
                        <th>Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!viewMonthlySchedule
                        ? loanResult.schedule.annualSummaries.slice(0, termYears).map((row) => (
                            <tr key={row.year} className={row.year === termYears ? styles.tableRowBalloon : undefined}>
                              <td>Year {row.year} {row.year === termYears ? '★' : ''}</td>
                              <td>${Math.round(row.startingBalance).toLocaleString()}</td>
                              <td>${Math.round(row.principalPaid).toLocaleString()}</td>
                              <td>${Math.round(row.interestPaid).toLocaleString()}</td>
                              <td><strong>${Math.round(row.endingBalance).toLocaleString()}</strong></td>
                            </tr>
                          ))
                        : loanResult.schedule.monthlyRows.slice(0, termYears * 12).map((row) => (
                            <tr key={row.month} className={row.month === termYears * 12 ? styles.tableRowBalloon : undefined}>
                              <td>Mo {row.month}</td>
                              <td>${Math.round(row.endingBalance + row.principal).toLocaleString()}</td>
                              <td>${Math.round(row.principal).toLocaleString()}</td>
                              <td>${Math.round(row.interest).toLocaleString()}</td>
                              <td>${Math.round(row.endingBalance).toLocaleString()}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : activeTab === 'sizing' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Underwriting Triad Comparison</h3>
                  <span className={styles.cardSubtitle}>Lowest Limit Determines Borrowing Capacity</span>
                </div>

                <div className={styles.sizingGrid}>
                  <div className={`${styles.sizingBox} ${sizingResult.bindingConstraint === 'ltv' ? styles.sizingBoxBinding : ''}`}>
                    <div className={styles.sizingBoxLabel}>LTV Limit ({maxLtvPct}%)</div>
                    <div className={styles.sizingBoxVal}>${Math.round(sizingResult.maxLoanByLtv / 1000)}k</div>
                    {sizingResult.bindingConstraint === 'ltv' && <div className={styles.sizingBoxTag}>★ BINDS LOAN</div>}
                  </div>

                  <div className={`${styles.sizingBox} ${sizingResult.bindingConstraint === 'dscr' ? styles.sizingBoxBinding : ''}`}>
                    <div className={styles.sizingBoxLabel}>DSCR Limit ({minDscr}×)</div>
                    <div className={styles.sizingBoxVal}>${Math.round(sizingResult.maxLoanByDscr / 1000)}k</div>
                    {sizingResult.bindingConstraint === 'dscr' && <div className={styles.sizingBoxTag}>★ BINDS LOAN</div>}
                  </div>

                  <div className={`${styles.sizingBox} ${sizingResult.bindingConstraint === 'debtYield' ? styles.sizingBoxBinding : ''}`}>
                    <div className={styles.sizingBoxLabel}>Debt Yield ({minDebtYieldPct}%)</div>
                    <div className={styles.sizingBoxVal}>${Math.round(sizingResult.maxLoanByDebtYield / 1000)}k</div>
                    {sizingResult.bindingConstraint === 'debtYield' && <div className={styles.sizingBoxTag}>★ BINDS LOAN</div>}
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
                    <div className={styles.metricLabel}>Max Approved Loan Amount</div>
                    <div className={`${styles.metricValue} ${styles.metricValuePrimary}`}>
                      ${sizingResult.bindingMaxLoan.toLocaleString()}
                    </div>
                    <div className={styles.metricSubtext}>
                      Governed by {sizingResult.bindingConstraintLabel}
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Required Equity Down Payment</div>
                    <div className={styles.metricValue}>
                      ${sizingResult.requiredEquity.toLocaleString()}
                    </div>
                    <div className={styles.metricSubtext}>
                      {((sizingResult.requiredEquity / propertyValue) * 100).toFixed(1)}% cash equity required
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Refinanced Facility Projections</h3>
                  <span className={styles.cardSubtitle}>Post-Maturity Debt Service</span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
                    <div className={styles.metricLabel}>New Monthly Payment</div>
                    <div className={`${styles.metricValue} ${styles.metricValuePrimary}`}>
                      ${refiResult.newMonthlyPayment.toLocaleString()}
                    </div>
                    <div className={styles.metricSubtext}>
                      ${refiResult.newAnnualDebtService.toLocaleString()} annual debt service
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Refinanced Balance</div>
                    <div className={styles.metricValue}>
                      ${refiResult.refinancedLoanAmount.toLocaleString()}
                    </div>
                    <div className={styles.metricSubtext}>
                      Includes ${refiClosingCosts.toLocaleString()} refinance closing costs
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* YMYL Assumptions and Disclaimer Box */}
            <div className={styles.assumptionsCard}>
              <div className={styles.assumptionsTitle}>Sources &amp; Assumptions (YMYL Estimator Standard)</div>
              Commercial mortgage underwriting criteria, interest rates, and loan spreads vary widely by property asset class,
              anchor tenant credit quality, lease duration, and macro capital markets. Rates, LTV caps, and minimum DSCR hurdles
              shown above are user-entered planning benchmarks and do not constitute a credit decision or loan commitment.
              Consult a licensed commercial mortgage broker or financial advisor. <em>Last reviewed: November 2026.</em>
            </div>

            {/* Actions */}
            <div className={styles.actionsBar}>
              <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
                {copiedToast ? '✓ Copied Summary!' : '📋 Copy Summary'}
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
              >
                🖨️ Print Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

export default function CommercialMortgageCalculator() {
  return (
    <Suspense fallback={<div>Loading Commercial Mortgage Calculator...</div>}>
      <CommercialMortgageCalculatorInner />
    </Suspense>
  );
}
