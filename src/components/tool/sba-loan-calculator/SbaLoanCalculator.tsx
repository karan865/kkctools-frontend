'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import SbaInputGuide, { SbaFieldId } from './SbaInputGuide';
import styles from './SbaLoanCalculator.module.css';
import {
  calculateSba504,
  calculateSba7a,
  compareSba504Vs7a,
  calculateSbaAcquisition,
} from '@/lib/sba-loan-engine';

type SbaTab = '504' | '7a' | 'compare' | 'acquisition';

const TABS: TabItem<SbaTab>[] = [
  { id: '504', label: 'SBA 504 Loan' },
  { id: '7a', label: 'SBA 7(a) Loan' },
  { id: 'compare', label: 'Compare 504 vs 7(a)' },
  { id: 'acquisition', label: 'Buy a Business (M&A)' },
];

function SbaLoanCalculatorInner() {
  const [activeTab, setActiveTab] = useState<SbaTab>('504');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as SbaTab;
      if (tabParam && ['504', '7a', 'compare', 'acquisition'].includes(tabParam)) {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: SbaTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<SbaFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Tab 1 (SBA 504) Inputs
  const [projectCost, setProjectCost] = useState<number>(2000000);
  const [bankPct, setBankPct] = useState<number>(50);
  const [bankRatePct, setBankRatePct] = useState<number>(7.0);
  const [bankTermYears, setBankTermYears] = useState<number>(25);
  const [bankAmortYears, setBankAmortYears] = useState<number>(25);
  const [cdcPct, setCdcPct] = useState<number>(40);
  const [cdcRatePct, setCdcRatePct] = useState<number>(6.5);
  const [cdcTermYears, setCdcTermYears] = useState<number>(25);
  const [cdcFeePct, setCdcFeePct] = useState<number>(3.0);
  const [cdcFeeFinanced, setCdcFeeFinanced] = useState<boolean>(false);
  const [annualCashFlow504, setAnnualCashFlow504] = useState<number>(220000);

  // Tab 2 (SBA 7(a)) Inputs
  const [loanAmount7a, setLoanAmount7a] = useState<number>(1800000);
  const [ratePct7a, setRatePct7a] = useState<number>(9.0);
  const [termYears7a, setTermYears7a] = useState<number>(25);
  const [guaranteeFeePct7a, setGuaranteeFeePct7a] = useState<number>(3.0);
  const [otherFees7a, setOtherFees7a] = useState<number>(5000);
  const [feesFinanced7a, setFeesFinanced7a] = useState<boolean>(false);
  const [annualCashFlow7a, setAnnualCashFlow7a] = useState<number>(220000);

  // Tab 4 (Acquisition) Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1500000);
  const [buyerEquityPct, setBuyerEquityPct] = useState<number>(10);
  const [sellerNotePct, setSellerNotePct] = useState<number>(15);
  const [sellerNoteRatePct, setSellerNoteRatePct] = useState<number>(8.0);
  const [sellerNoteTermYears, setSellerNoteTermYears] = useState<number>(5);
  const [sellerNoteIo, setSellerNoteIo] = useState<boolean>(false);
  const [sbaAcqRatePct, setSbaAcqRatePct] = useState<number>(10.5);
  const [sbaAcqTermYears, setSbaAcqTermYears] = useState<number>(10);
  const [sdeCashFlow, setSdeCashFlow] = useState<number>(350000);

  // Computed results
  const res504 = useMemo(() => {
    return calculateSba504({
      projectCost,
      bankPct,
      bankRatePct,
      bankTermYears,
      bankAmortYears,
      cdcPct,
      cdcRatePct,
      cdcTermYears,
      cdcFeePct,
      cdcFeeFinanced,
      annualCashFlow: annualCashFlow504,
    });
  }, [
    projectCost,
    bankPct,
    bankRatePct,
    bankTermYears,
    bankAmortYears,
    cdcPct,
    cdcRatePct,
    cdcTermYears,
    cdcFeePct,
    cdcFeeFinanced,
    annualCashFlow504,
  ]);

  const res7a = useMemo(() => {
    return calculateSba7a({
      loanAmount: loanAmount7a,
      ratePct: ratePct7a,
      termYears: termYears7a,
      guaranteeFeePct: guaranteeFeePct7a,
      otherFees: otherFees7a,
      feesFinanced: feesFinanced7a,
      annualCashFlow: annualCashFlow7a,
    });
  }, [
    loanAmount7a,
    ratePct7a,
    termYears7a,
    guaranteeFeePct7a,
    otherFees7a,
    feesFinanced7a,
    annualCashFlow7a,
  ]);

  const compareRes = useMemo(() => {
    return compareSba504Vs7a(
      {
        projectCost,
        bankPct,
        bankRatePct,
        bankTermYears,
        bankAmortYears,
        cdcPct,
        cdcRatePct,
        cdcTermYears,
        cdcFeePct,
        cdcFeeFinanced,
        annualCashFlow: annualCashFlow504,
      },
      ratePct7a,
      termYears7a,
      guaranteeFeePct7a,
      feesFinanced7a
    );
  }, [
    projectCost,
    bankPct,
    bankRatePct,
    bankTermYears,
    bankAmortYears,
    cdcPct,
    cdcRatePct,
    cdcTermYears,
    cdcFeePct,
    cdcFeeFinanced,
    annualCashFlow504,
    ratePct7a,
    termYears7a,
    guaranteeFeePct7a,
    feesFinanced7a,
  ]);

  const acqRes = useMemo(() => {
    return calculateSbaAcquisition({
      purchasePrice,
      buyerEquityPct,
      sellerNotePct,
      sellerNoteRatePct,
      sellerNoteTermYears,
      sellerNoteInterestOnly: sellerNoteIo,
      sbaRatePct: sbaAcqRatePct,
      sbaTermYears: sbaAcqTermYears,
      annualSdeOrCashFlow: sdeCashFlow,
      minDscr: 1.25,
    });
  }, [
    purchasePrice,
    buyerEquityPct,
    sellerNotePct,
    sellerNoteRatePct,
    sellerNoteTermYears,
    sellerNoteIo,
    sbaAcqRatePct,
    sbaAcqTermYears,
    sdeCashFlow,
  ]);

  // Copy Summary BLUF
  const blufSentence = useMemo(() => {
    if (activeTab === '504' && res504) {
      return `On a $${res504.projectCost.toLocaleString()} project with a 50/40/10 example split, the bank and CDC loans cost $${Math.round(res504.totalMonthlyPayment).toLocaleString()} a month together at a ${res504.blendedRatePct.toFixed(2)}% blended rate.`;
    }
    if (activeTab === '7a' && res7a) {
      return `A $${res7a.baseLoanAmount.toLocaleString()} SBA 7(a) loan at ${res7a.ratePct}% over ${res7a.termYears} years costs $${Math.round(res7a.monthlyPayment).toLocaleString()}/month with $${Math.round(res7a.totalInterest).toLocaleString()} total interest.`;
    }
    if (activeTab === 'compare' && compareRes) {
      return `For a $${compareRes.totalDebt.toLocaleString()} loan, the SBA 504 structure saves $${Math.round(compareRes.monthlyPaymentSavings504).toLocaleString()}/month ($${Math.round(compareRes.annualPaymentSavings504).toLocaleString()}/year) compared to a single SBA 7(a) loan.`;
    }
    if (activeTab === 'acquisition' && acqRes) {
      return `Acquiring a $${acqRes.purchasePrice.toLocaleString()} business requires $${acqRes.buyerEquityAmount.toLocaleString()} equity, yielding $${Math.round(acqRes.totalMonthlyDebtService).toLocaleString()}/month total debt service and a ${acqRes.dscr ? acqRes.dscr.toFixed(2) : 'N/A'}x DSCR.`;
    }
    return '';
  }, [activeTab, res504, res7a, compareRes, acqRes]);

  const handleCopyBluf = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(blufSentence);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleDownloadCsv = () => {
    if (!res504 || !res504.combinedAnnualSchedule.length) return;
    const headers = ['Year', 'Starting Balance', 'Total Payments', 'Principal Paid', 'Interest Paid', 'Ending Balance'];
    const rows = res504.combinedAnnualSchedule.map((r) => [
      r.year,
      r.startingBalance.toFixed(2),
      r.totalPayments.toFixed(2),
      r.principalPaid.toFixed(2),
      r.interestPaid.toFixed(2),
      r.endingBalance.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sba-504-schedule-${projectCost}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="SBA loan calculation modes" />

      <SbaInputGuide
        mode={activeTab}
        activeField={activeField}
        projectCost={projectCost}
        bankPct={bankPct}
        bankRatePct={bankRatePct}
        cdcPct={cdcPct}
        cdcRatePct={cdcRatePct}
        equityPct={res504 ? res504.equityPct : 10}
        totalMonthlyPayment504={res504 ? Math.round(res504.totalMonthlyPayment) : 12469}
        loanAmount7a={loanAmount7a}
        ratePct7a={ratePct7a}
        monthlyPayment7a={res7a ? Math.round(res7a.monthlyPayment) : 15106}
        purchasePrice={purchasePrice}
        buyerEquityPct={buyerEquityPct}
        sellerNotePct={sellerNotePct}
      />

      {/* Summary Banner (High-contrast light mint) */}
      <div className={styles.summaryBanner}>
        <div className={styles.bannerHeadline}>
          <span>
            {activeTab === '504' && 'Combined 504 Monthly Payment:'}
            {activeTab === '7a' && 'SBA 7(a) Monthly Payment:'}
            {activeTab === 'compare' && 'SBA 504 Monthly Cash Flow Savings:'}
            {activeTab === 'acquisition' && 'Combined Acquisition Debt Service:'}
          </span>
          <span className={styles.bannerAmount}>
            {activeTab === '504' && res504 && `$${Math.round(res504.totalMonthlyPayment).toLocaleString()}/mo`}
            {activeTab === '7a' && res7a && `$${Math.round(res7a.monthlyPayment).toLocaleString()}/mo`}
            {activeTab === 'compare' && compareRes && `+$${Math.round(compareRes.monthlyPaymentSavings504).toLocaleString()}/mo`}
            {activeTab === 'acquisition' && acqRes && `$${Math.round(acqRes.totalMonthlyDebtService).toLocaleString()}/mo`}
          </span>
        </div>
        <p className={styles.bannerBluf}>{blufSentence}</p>
        <div style={{ marginTop: '0.75rem' }}>
          <button type="button" onClick={handleCopyBluf} className={styles.copyButton}>
            {copiedToast ? '✓ Copied to clipboard' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Form Controls Card */}
        <div className={styles.formCard}>
          {activeTab === '504' && (
            <>
              <div className={styles.sectionTitle}>
                <span>SBA 504 Financing Structure</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>① Total Project Cost (Real Estate / Machinery)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={projectCost}
                    onChange={(e) => setProjectCost(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('projectCost')}
                    onBlur={() => setActiveField(null)}
                    step="50000"
                    min="100000"
                  />
                </div>
                <p className={styles.subHelp}>Land, building purchase, modern construction, or long-term heavy machinery.</p>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>② Bank Loan Share</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={bankPct}
                      onChange={(e) => setBankPct(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('bankPct')}
                      onBlur={() => setActiveField(null)}
                      step="5"
                      min="10"
                      max="70"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Bank Interest Rate</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={bankRatePct}
                      onChange={(e) => setBankRatePct(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('bankRatePct')}
                      onBlur={() => setActiveField(null)}
                      step="0.1"
                      min="1"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Bank Balloon Term</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={bankTermYears}
                      onChange={(e) => setBankTermYears(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('bankTermYears')}
                      onBlur={() => setActiveField(null)}
                      step="1"
                      min="5"
                      max="30"
                    />
                    <span className={styles.inputSuffix}>yrs</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Bank Amortization</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={bankAmortYears}
                      onChange={(e) => setBankAmortYears(Number(e.target.value) || 0)}
                      step="1"
                      min="10"
                      max="30"
                    />
                    <span className={styles.inputSuffix}>yrs</span>
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color, #e2e8f0)' }} />

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>③ CDC / SBA Debenture Share</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={cdcPct}
                      onChange={(e) => setCdcPct(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('cdcPct')}
                      onBlur={() => setActiveField(null)}
                      step="5"
                      min="10"
                      max="50"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>CDC Debenture Rate</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={cdcRatePct}
                      onChange={(e) => setCdcRatePct(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('cdcRatePct')}
                      onBlur={() => setActiveField(null)}
                      step="0.1"
                      min="1"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>CDC Term (SBA 10/20/25 yr)</span>
                  </label>
                  <select
                    className={styles.input}
                    value={cdcTermYears}
                    onChange={(e) => setCdcTermYears(Number(e.target.value))}
                  >
                    <option value={25}>25 Years (Real Estate)</option>
                    <option value={20}>20 Years (Real Estate / Machinery)</option>
                    <option value={10}>10 Years (Equipment)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>CDC Fee % (~3% per SBA.gov)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={cdcFeePct}
                      onChange={(e) => setCdcFeePct(Number(e.target.value) || 0)}
                      step="0.5"
                      min="0"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.toggleRow}>
                <input
                  type="checkbox"
                  id="cdcFeeFinanced"
                  className={styles.checkbox}
                  checked={cdcFeeFinanced}
                  onChange={(e) => setCdcFeeFinanced(e.target.checked)}
                />
                <label htmlFor="cdcFeeFinanced" className={styles.checkboxLabel}>
                  Finance CDC fee into debenture (SBA allowed)
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Annual Operating Cash Flow / NOI (For DSCR)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={annualCashFlow504}
                    onChange={(e) => setAnnualCashFlow504(Number(e.target.value) || 0)}
                    step="10000"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === '7a' && (
            <>
              <div className={styles.sectionTitle}>
                <span>SBA 7(a) Loan Terms</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Loan Amount (Max $5M statutory cap)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={loanAmount7a}
                    onChange={(e) => setLoanAmount7a(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('loanAmount7a')}
                    onBlur={() => setActiveField(null)}
                    step="25000"
                    max="5000000"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Interest Rate (Fixed or Prime + Spread)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={ratePct7a}
                      onChange={(e) => setRatePct7a(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('ratePct7a')}
                      onBlur={() => setActiveField(null)}
                      step="0.25"
                      min="1"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Loan Maturity Term</span>
                  </label>
                  <select
                    className={styles.input}
                    value={termYears7a}
                    onChange={(e) => setTermYears7a(Number(e.target.value))}
                  >
                    <option value={25}>25 Years (Commercial Real Estate)</option>
                    <option value={10}>10 Years (Equipment / Acquisition)</option>
                    <option value={7}>7 Years (Working Capital)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>SBA Upfront Guarantee Fee %</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={guaranteeFeePct7a}
                      onChange={(e) => setGuaranteeFeePct7a(Number(e.target.value) || 0)}
                      step="0.25"
                      min="0"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Other Packaging &amp; Closing Fees</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={otherFees7a}
                      onChange={(e) => setOtherFees7a(Number(e.target.value) || 0)}
                      step="500"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.toggleRow}>
                <input
                  type="checkbox"
                  id="feesFinanced7a"
                  className={styles.checkbox}
                  checked={feesFinanced7a}
                  onChange={(e) => setFeesFinanced7a(e.target.checked)}
                />
                <label htmlFor="feesFinanced7a" className={styles.checkboxLabel}>
                  Roll guarantee &amp; closing fees into 7(a) loan balance
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Annual Operating Cash Flow (For DSCR)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={annualCashFlow7a}
                    onChange={(e) => setAnnualCashFlow7a(Number(e.target.value) || 0)}
                    step="10000"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'compare' && (
            <>
              <div className={styles.sectionTitle}>
                <span>Compare Project Debt: 504 vs 7(a)</span>
              </div>
              <p className={styles.subHelp}>
                Evaluate the two-loan SBA 504 structure against a single SBA 7(a) loan for the same project size.
              </p>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Total Project Cost</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={projectCost}
                    onChange={(e) => setProjectCost(Number(e.target.value) || 0)}
                    step="50000"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>SBA 504 Blended Rate</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={res504 ? `${res504.blendedRatePct.toFixed(2)}%` : '6.78%'}
                    disabled
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>SBA 7(a) Assumed Rate</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={ratePct7a}
                      onChange={(e) => setRatePct7a(Number(e.target.value) || 0)}
                      step="0.25"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'acquisition' && (
            <>
              <div className={styles.sectionTitle}>
                <span>Buy a Business (7(a) M&amp;A Capital Stack)</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Business Purchase Price</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('purchasePrice')}
                    onBlur={() => setActiveField(null)}
                    step="50000"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Buyer Cash Equity %</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={buyerEquityPct}
                      onChange={(e) => setBuyerEquityPct(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('buyerEquityPct')}
                      onBlur={() => setActiveField(null)}
                      step="2"
                      min="5"
                      max="50"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Seller Note (Subordinated) %</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={sellerNotePct}
                      onChange={(e) => setSellerNotePct(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('sellerNotePct')}
                      onBlur={() => setActiveField(null)}
                      step="2"
                      min="0"
                      max="30"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Seller Note Rate &amp; Term</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={sellerNoteRatePct}
                      onChange={(e) => setSellerNoteRatePct(Number(e.target.value) || 0)}
                      step="0.5"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Seller Note Term</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={sellerNoteTermYears}
                      onChange={(e) => setSellerNoteTermYears(Number(e.target.value) || 0)}
                      step="1"
                    />
                    <span className={styles.inputSuffix}>yrs</span>
                  </div>
                </div>
              </div>

              <div className={styles.toggleRow}>
                <input
                  type="checkbox"
                  id="sellerNoteIo"
                  className={styles.checkbox}
                  checked={sellerNoteIo}
                  onChange={(e) => setSellerNoteIo(e.target.checked)}
                />
                <label htmlFor="sellerNoteIo" className={styles.checkboxLabel}>
                  Seller note is interest-only (IO) payments
                </label>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>SBA 7(a) Senior Rate</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={sbaAcqRatePct}
                      onChange={(e) => setSbaAcqRatePct(Number(e.target.value) || 0)}
                      step="0.25"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>SBA 7(a) Term</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={sbaAcqTermYears}
                      onChange={(e) => setSbaAcqTermYears(Number(e.target.value) || 0)}
                      step="1"
                    />
                    <span className={styles.inputSuffix}>yrs</span>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Annual Cash Flow (SDE / EBITDA)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={sdeCashFlow}
                    onChange={(e) => setSdeCashFlow(Number(e.target.value) || 0)}
                    step="25000"
                  />
                </div>
                <p className={styles.subHelp}>Earnings available to service debt after operating expenses and owner draw.</p>
              </div>
            </>
          )}
        </div>

        {/* Results Card */}
        <div className={styles.resultsCard}>
          <div className={styles.sectionTitle}>
            <span>Underwriting &amp; Payment Summary</span>
          </div>

          {activeTab === '504' && res504 && (
            <>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Total Monthly</span>
                  <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>
                    ${Math.round(res504.totalMonthlyPayment).toLocaleString()}
                  </span>
                  <span className={styles.metricSub}>Bank + CDC note</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Blended Rate</span>
                  <span className={styles.metricValue}>{res504.blendedRatePct.toFixed(2)}%</span>
                  <span className={styles.metricSub}>Effective combined</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Borrower Equity</span>
                  <span className={styles.metricValue}>${res504.equityAmount.toLocaleString()}</span>
                  <span className={styles.metricSub}>{res504.equityPct}% down payment</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>DSCR Coverage</span>
                  <span className={styles.metricValue}>
                    {res504.dscr !== null ? `${res504.dscr.toFixed(2)}x` : 'N/A'}
                  </span>
                  <span className={styles.metricSub}>{res504.dscr && res504.dscr >= 1.25 ? '✓ Meets ≥ 1.25' : 'Provide cash flow'}</span>
                </div>
              </div>

              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Loan Component</th>
                    <th>Share</th>
                    <th>Principal</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bank 1st Lien ({bankRatePct}%)</td>
                    <td>{res504.bankPct}%</td>
                    <td>${res504.bankLoanAmount.toLocaleString()}</td>
                    <td>${Math.round(res504.bankMonthlyPayment).toLocaleString()}/mo</td>
                  </tr>
                  <tr>
                    <td>CDC / SBA 2nd Lien ({cdcRatePct}%)</td>
                    <td>{res504.cdcPct}%</td>
                    <td>${res504.cdcTotalLoanAmount.toLocaleString()}</td>
                    <td>${Math.round(res504.cdcMonthlyPayment).toLocaleString()}/mo</td>
                  </tr>
                  {res504.bankBalloonPayment > 0 && (
                    <tr>
                      <td colSpan={3} style={{ color: '#b45309' }}>
                        Bank Balloon Payoff (at Yr {bankTermYears})
                      </td>
                      <td style={{ color: '#b45309', fontWeight: 700 }}>
                        ${Math.round(res504.bankBalloonPayment).toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Total Loan Amount</td>
                    <td>{100 - res504.equityPct}%</td>
                    <td>${res504.totalLoanAmount.toLocaleString()}</td>
                    <td><strong>${Math.round(res504.totalMonthlyPayment).toLocaleString()}/mo</strong></td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.actionsRow}>
                <button type="button" onClick={handleDownloadCsv} className={styles.btnSecondary}>
                  Download Combined Amortization (CSV)
                </button>
              </div>
            </>
          )}

          {activeTab === '7a' && res7a && (
            <>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Monthly Payment</span>
                  <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>
                    ${Math.round(res7a.monthlyPayment).toLocaleString()}
                  </span>
                  <span className={styles.metricSub}>{res7a.termYears} yr maturity</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Total Interest</span>
                  <span className={styles.metricValue}>${Math.round(res7a.totalInterest).toLocaleString()}</span>
                  <span className={styles.metricSub}>Over loan life</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Guarantee Fee</span>
                  <span className={styles.metricValue}>${Math.round(res7a.guaranteeFee).toLocaleString()}</span>
                  <span className={styles.metricSub}>{guaranteeFeePct7a}% upfront</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>DSCR Coverage</span>
                  <span className={styles.metricValue}>
                    {res7a.dscr !== null ? `${res7a.dscr.toFixed(2)}x` : 'N/A'}
                  </span>
                  <span className={styles.metricSub}>{res7a.dscr && res7a.dscr >= 1.25 ? '✓ At or above 1.25 (example minimum)' : 'Below 1.25 (example minimum; ask your lender)'}</span>
                </div>
              </div>

              <table className={styles.breakdownTable}>
                <tbody>
                  <tr>
                    <td>Base Loan Amount</td>
                    <td>${res7a.baseLoanAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>SBA Guarantee Fee</td>
                    <td>${res7a.guaranteeFee.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Packaging &amp; Closing Costs</td>
                    <td>${res7a.otherFees.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Total Amount Financed</td>
                    <td><strong>${res7a.totalFinancedAmount.toLocaleString()}</strong></td>
                  </tr>
                  <tr>
                    <td>Total 25-Year Payments</td>
                    <td>${Math.round(res7a.totalPayments).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'compare' && compareRes && (
            <>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Monthly Savings</span>
                  <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>
                    +${Math.round(compareRes.monthlyPaymentSavings504).toLocaleString()}/mo
                  </span>
                  <span className={styles.metricSub}>SBA 504 advantage</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Annual Savings</span>
                  <span className={styles.metricValue}>
                    +${Math.round(compareRes.annualPaymentSavings504).toLocaleString()}
                  </span>
                  <span className={styles.metricSub}>Cash flow preserved</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Lifetime Interest</span>
                  <span className={styles.metricValue}>
                    +${Math.round(compareRes.totalInterestSavings504).toLocaleString()}
                  </span>
                  <span className={styles.metricSub}>Total interest saved</span>
                </div>
              </div>

              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>SBA 504 (Two Loans)</th>
                    <th>SBA 7(a) (Single Loan)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monthly Debt Service</td>
                    <td><strong>${Math.round(compareRes.sba504.totalMonthlyPayment).toLocaleString()}</strong></td>
                    <td>${Math.round(compareRes.sba7a.monthlyPayment).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Blended Interest Rate</td>
                    <td>{compareRes.sba504.blendedRatePct.toFixed(2)}%</td>
                    <td>{compareRes.sba7a.ratePct.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Total Interest Paid</td>
                    <td>${Math.round(compareRes.sba504.totalInterest).toLocaleString()}</td>
                    <td>${Math.round(compareRes.sba7a.totalInterest).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Down Payment Required</td>
                    <td>Your equity % (set above)</td>
                    <td>Set by your lender</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'acquisition' && acqRes && (
            <>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Total Debt Service</span>
                  <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>
                    ${Math.round(acqRes.totalMonthlyDebtService).toLocaleString()}/mo
                  </span>
                  <span className={styles.metricSub}>SBA + Seller note</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>DSCR Ratio</span>
                  <span className={styles.metricValue}>
                    {acqRes.dscr !== null ? `${acqRes.dscr.toFixed(2)}x` : 'N/A'}
                  </span>
                  <span className={styles.metricSub}>{acqRes.meetsMinDscr ? '✓ Meets lender 1.25x' : '⚠ Below 1.25x'}</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Post-Debt Cash Flow</span>
                  <span className={styles.metricValue}>
                    ${Math.round(acqRes.postDebtAnnualCashFlow).toLocaleString()}/yr
                  </span>
                  <span className={styles.metricSub}>Net owner take-home</span>
                </div>
              </div>

              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Capital Tranche</th>
                    <th>Amount</th>
                    <th>Monthly Debt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Buyer Equity ({buyerEquityPct}%)</td>
                    <td>${acqRes.buyerEquityAmount.toLocaleString()}</td>
                    <td>$0</td>
                  </tr>
                  <tr>
                    <td>Seller Note ({sellerNotePct}%)</td>
                    <td>${acqRes.sellerNoteAmount.toLocaleString()}</td>
                    <td>${Math.round(acqRes.sellerNoteMonthlyPayment).toLocaleString()}/mo</td>
                  </tr>
                  <tr>
                    <td>SBA 7(a) Senior Loan ({100 - buyerEquityPct - sellerNotePct}%)</td>
                    <td>${acqRes.sbaLoanAmount.toLocaleString()}</td>
                    <td>${Math.round(acqRes.sbaMonthlyPayment).toLocaleString()}/mo</td>
                  </tr>
                  <tr>
                    <td><strong>Total Acquisition Debt</strong></td>
                    <td><strong>${(acqRes.sellerNoteAmount + acqRes.sbaLoanAmount).toLocaleString()}</strong></td>
                    <td><strong>${Math.round(acqRes.totalMonthlyDebtService).toLocaleString()}/mo</strong></td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {/* Dated Sources & Rules Box */}
          <div className={styles.sourcesBox}>
            <div className={styles.sourcesTitle}>Official SBA Program Rules &amp; Verification Dates:</div>
            <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
              <li>
                <strong>SBA 504 Maturities:</strong> 10-, 20-, and 25-year maturity terms available for real estate &amp; long-life equipment (verified on{' '}
                <a href="https://www.sba.gov/funding-programs/loans/504-loans" target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  sba.gov/funding-programs/loans/504-loans
                </a>{' '}
                on 2026-11-20).
              </li>
              <li>
                <strong>SBA 504 Pricing:</strong> CDC debenture rate pegged to an increment above 10-year U.S. Treasury yields; CDC fees (~3% of debt) can be financed into note.
              </li>
              <li>
                <strong>SBA 7(a) Statutory Maximum:</strong> $5,000,000 maximum loan amount (verified on{' '}
                <a href="https://www.sba.gov/funding-programs/loans/7a-loans" target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  sba.gov/funding-programs/loans/7a-loans
                </a>{' '}
                on 2026-11-20).
              </li>
              <li>
                <strong>Note on Rates:</strong> All interest rates and lender spreads shown in this tool are illustrative user defaults. Confirm current fiscal year guarantee fee schedules and maximum allowable spreads on SBA.gov. Last reviewed: 2026-11-20.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SbaLoanCalculator() {
  return (
    <Suspense fallback={<div>Loading SBA loan calculator...</div>}>
      <SbaLoanCalculatorInner />
    </Suspense>
  );
}
