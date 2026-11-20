'use client';

import React, { useState, useMemo, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import TabSlider from '@/components/tool/shared/TabSlider';
import CardPayoffInputGuide from './CardPayoffInputGuide';
import {
  simulateCardPayoff,
  calculatePaymentForMonths,
  simulateMinimumPayment,
  simulateMultiCardPayoff,
  calculateBalanceTransfer,
  convertApr,
  CreditCardItem,
} from '@/lib/card-payoff-engine';
import styles from './CreditCardPayoffCalculator.module.css';

type Mode = 'payoff' | 'minimum' | 'multi-card' | 'transfer' | 'converter';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'payoff', label: 'Payoff & Interest' },
  { id: 'minimum', label: 'Minimum Payment Trap' },
  { id: 'multi-card', label: 'Avalanche vs. Snowball' },
  { id: 'transfer', label: '0% Balance Transfer' },
  { id: 'converter', label: 'APR Converter' },
];

export default function CreditCardPayoffCalculator() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Mode) || 'payoff';
  const validatedTab: Mode = ['payoff', 'minimum', 'multi-card', 'transfer', 'converter'].includes(initialTab)
    ? initialTab
    : 'payoff';

  const [activeTab, setActiveTab] = useState<Mode>(validatedTab);
  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  // Tab 1: Payoff Inputs
  const [balance, setBalance] = useState<number>(5000);
  const [aprPct, setAprPct] = useState<number>(22);
  const [payoffMode, setPayoffMode] = useState<'payment' | 'months'>('payment');
  const [monthlyPayment, setMonthlyPayment] = useState<number>(200);
  const [targetMonths, setTargetMonths] = useState<number>(24);
  const [interestMethod, setInterestMethod] = useState<'monthly' | 'daily'>('monthly');
  const [newCharges, setNewCharges] = useState<number>(0);
  const [annualFee, setAnnualFee] = useState<number>(0);
  const [showAllRows, setShowAllRows] = useState<boolean>(false);

  // Tab 2: Minimum Payment Inputs
  const [minBalance, setMinBalance] = useState<number>(5000);
  const [minAprPct, setMinAprPct] = useState<number>(22);
  const [minPctOfBalance, setMinPctOfBalance] = useState<number>(1.0);
  const [minPlusInterest, setMinPlusInterest] = useState<boolean>(true);
  const [minFloor, setMinFloor] = useState<number>(25);
  const [minCompareFixedPayment, setMinCompareFixedPayment] = useState<number>(200);

  // Tab 3: Multi-Card Inputs
  const [multiCards, setMultiCards] = useState<CreditCardItem[]>([
    { id: '1', name: 'Store Card', balance: 1500, aprPct: 28.99, minPayment: 45 },
    { id: '2', name: 'Bank Card', balance: 5000, aprPct: 22.24, minPayment: 125 },
    { id: '3', name: 'Credit Union Card', balance: 3500, aprPct: 14.50, minPayment: 85 },
  ]);
  const [multiBudget, setMultiBudget] = useState<number>(500);
  const [multiStrategy, setMultiStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  // Tab 4: Balance Transfer Inputs
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [transferFeePct, setTransferFeePct] = useState<number>(3.0);
  const promoAprPct = 0.0;
  const [promoMonths, setPromoMonths] = useState<number>(18);
  const [goAprPct, setGoAprPct] = useState<number>(24.0);
  const [transferCurrentApr, setTransferCurrentApr] = useState<number>(22.0);
  const [transferMonthlyPayment, setTransferMonthlyPayment] = useState<number>(250);

  // Tab 5: APR Converter Inputs
  const [converterApr, setConverterApr] = useState<number>(22.0);

  const baseId = useId();

  const handleTabChange = (tabId: Mode) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Currency helper
  const fmt = (val: number) => {
    if (!Number.isFinite(val)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // 1. Payoff Simulation Calculation
  const calculatedPaymentForTargetMonths = useMemo(() => {
    if (payoffMode === 'months') {
      return calculatePaymentForMonths(balance, aprPct, targetMonths, interestMethod);
    }
    return monthlyPayment;
  }, [payoffMode, balance, aprPct, targetMonths, interestMethod, monthlyPayment]);

  const effectiveMonthlyPayment = payoffMode === 'payment' ? monthlyPayment : calculatedPaymentForTargetMonths;

  const payoffResult = useMemo(() => {
    return simulateCardPayoff(
      balance,
      aprPct,
      effectiveMonthlyPayment,
      interestMethod,
      newCharges,
      annualFee
    );
  }, [balance, aprPct, effectiveMonthlyPayment, interestMethod, newCharges, annualFee]);

  // Sensitivity Analysis Payments ($150 to $400 or scaled)
  const sensitivityRows = useMemo(() => {
    if (balance <= 0) return [];
    const basePmt = effectiveMonthlyPayment || 200;
    const testPayments = [
      Math.max(25, Math.round(basePmt * 0.6 / 25) * 25),
      Math.max(35, Math.round(basePmt * 0.8 / 25) * 25),
      Math.max(45, Math.round(basePmt * 1.0)),
      Math.max(55, Math.round(basePmt * 1.25 / 25) * 25),
      Math.max(65, Math.round(basePmt * 1.5 / 25) * 25),
      Math.max(75, Math.round(basePmt * 1.75 / 25) * 25),
      Math.max(85, Math.round(basePmt * 2.0 / 25) * 25),
    ].filter((v, i, arr) => arr.indexOf(v) === i && v > 0);

    return testPayments.map((pmt) => {
      const sim = simulateCardPayoff(balance, aprPct, pmt, interestMethod, newCharges, annualFee);
      return {
        payment: pmt,
        months: sim.isPayoffPossible ? sim.months : null,
        interest: sim.isPayoffPossible ? sim.totalInterest : null,
        savings: sim.isPayoffPossible && payoffResult.isPayoffPossible
          ? Math.max(0, payoffResult.totalInterest - sim.totalInterest)
          : 0,
      };
    });
  }, [balance, aprPct, effectiveMonthlyPayment, interestMethod, newCharges, annualFee, payoffResult]);

  // 2. Minimum Payment Simulation
  const minResult = useMemo(() => {
    return simulateMinimumPayment(
      minBalance,
      minAprPct,
      minPctOfBalance,
      minPlusInterest,
      minFloor,
      interestMethod
    );
  }, [minBalance, minAprPct, minPctOfBalance, minPlusInterest, minFloor, interestMethod]);

  const minFixedComparison = useMemo(() => {
    return simulateCardPayoff(
      minBalance,
      minAprPct,
      minCompareFixedPayment,
      interestMethod
    );
  }, [minBalance, minAprPct, minCompareFixedPayment, interestMethod]);

  // 3. Multi-Card Simulation
  const avalancheResult = useMemo(() => {
    return simulateMultiCardPayoff(multiCards, multiBudget, 'avalanche');
  }, [multiCards, multiBudget]);

  const snowballResult = useMemo(() => {
    return simulateMultiCardPayoff(multiCards, multiBudget, 'snowball');
  }, [multiCards, multiBudget]);

  const multiActiveResult = multiStrategy === 'avalanche' ? avalancheResult : snowballResult;
  const multiSavingsVsOther = Math.abs(avalancheResult.totalInterest - snowballResult.totalInterest);

  // 4. Balance Transfer Calculation
  const transferResult = useMemo(() => {
    return calculateBalanceTransfer(
      transferAmount,
      transferFeePct,
      promoAprPct,
      promoMonths,
      goAprPct,
      transferMonthlyPayment,
      transferCurrentApr
    );
  }, [
    transferAmount,
    transferFeePct,
    promoAprPct,
    promoMonths,
    goAprPct,
    transferMonthlyPayment,
    transferCurrentApr,
  ]);

  const promoPayoffTargetMonthly = useMemo(() => {
    if (promoMonths <= 0) return 0;
    const fee = transferAmount * (transferFeePct / 100);
    return Math.ceil(((transferAmount + fee) / promoMonths) * 100) / 100;
  }, [transferAmount, transferFeePct, promoMonths]);

  // 5. APR Converter Calculation
  const conversionResult = useMemo(() => {
    return convertApr(converterApr);
  }, [converterApr]);

  // Summary Text Generator
  const summaryText = useMemo(() => {
    if (activeTab === 'payoff') {
      if (!payoffResult.isPayoffPossible) {
        return `Your monthly payment of ${fmt(effectiveMonthlyPayment)} does not cover interest charges on a ${fmt(balance)} balance at ${aprPct}% APR.`;
      }
      return `Paying ${fmt(effectiveMonthlyPayment)} a month on a ${fmt(balance)} balance at ${aprPct}% APR clears it in ${payoffResult.months} months (${payoffResult.years} years) with ${fmt(payoffResult.totalInterest)} in total interest (${fmt(payoffResult.totalPaid)} total paid).`;
    }
    if (activeTab === 'minimum') {
      const savedYears = Math.max(0, (minResult.years - minFixedComparison.years)).toFixed(1);
      const savedInterest = Math.max(0, minResult.totalInterest - minFixedComparison.totalInterest);
      return `Paying only minimum payments on ${fmt(minBalance)} at ${minAprPct}% APR takes ${minResult.months} months (${minResult.years} years) and ${fmt(minResult.totalInterest)} in interest. Paying a fixed ${fmt(minCompareFixedPayment)}/mo clears it in ${minFixedComparison.months} months, saving ${savedYears} years and ${fmt(savedInterest)} in interest!`;
    }
    if (activeTab === 'multi-card') {
      const favStrategy = avalancheResult.totalInterest <= snowballResult.totalInterest ? 'Debt Avalanche' : 'Debt Snowball';
      return `With a ${fmt(multiBudget)} monthly budget across ${multiCards.length} cards, the ${favStrategy} clears all debt in ${avalancheResult.months} months, saving ${fmt(multiSavingsVsOther)} in interest compared to ${favStrategy === 'Debt Avalanche' ? 'Snowball' : 'Avalanche'}.`;
    }
    if (activeTab === 'transfer') {
      if (transferResult.isWorthIt) {
        return `Transferring ${fmt(transferAmount)} to a ${promoMonths}-month 0% card with a ${transferFeePct}% fee (${fmt(transferResult.transferFee)}) saves ${fmt(transferResult.netSavings)} in net interest compared to keeping it at ${transferCurrentApr}% APR!`;
      }
      return `Transferring ${fmt(transferAmount)} with a ${transferFeePct}% fee (${fmt(transferResult.transferFee)}) costs ${fmt(Math.abs(transferResult.netSavings))} more than keeping the balance on your current card.`;
    }
    if (activeTab === 'converter') {
      return `${conversionResult.aprPct}% APR corresponds to a daily periodic rate of ${conversionResult.dailyPeriodicRatePct}%, a monthly rate of ${conversionResult.monthlyPeriodicRatePct}%, and an effective APY of ${conversionResult.effectiveApyPct}% with daily compounding.`;
    }
    return '';
  }, [
    activeTab,
    payoffResult,
    effectiveMonthlyPayment,
    balance,
    aprPct,
    minBalance,
    minAprPct,
    minResult,
    minFixedComparison,
    minCompareFixedPayment,
    multiBudget,
    multiCards,
    avalancheResult,
    snowballResult,
    multiSavingsVsOther,
    transferAmount,
    promoMonths,
    transferFeePct,
    transferResult,
    transferCurrentApr,
    conversionResult,
  ]);

  const handleCopySummary = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownloadCsv = () => {
    if (!payoffResult.schedule || payoffResult.schedule.length === 0) return;
    const header = 'Month,Starting Balance,Interest Charged,Payment,Principal Paid,Ending Balance,Cumulative Interest,Cumulative Payments\n';
    const rows = payoffResult.schedule
      .map(
        (r) =>
          `${r.month},${r.startingBalance.toFixed(2)},${r.interestCharged.toFixed(2)},${r.payment.toFixed(2)},${r.principalPaid.toFixed(2)},${r.endingBalance.toFixed(2)},${r.cumulativeInterest.toFixed(2)},${r.cumulativePayments.toFixed(2)}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-card-payoff-schedule-${balance}-at-${aprPct}pct.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrap}>
      {/* 5-Tab Slider */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(id) => handleTabChange(id as Mode)}
        ariaLabel="Credit Card Payoff Calculator Modes"
      />

      {/* Visual Input Guide Diagram */}
      <CardPayoffInputGuide
        mode={activeTab}
        activeField={activeField}
        balance={activeTab === 'minimum' ? minBalance : activeTab === 'transfer' ? transferAmount : balance}
        aprPct={activeTab === 'minimum' ? minAprPct : activeTab === 'transfer' ? transferCurrentApr : aprPct}
        monthlyPayment={effectiveMonthlyPayment}
        months={activeTab === 'minimum' ? minResult.months : payoffResult.months}
        totalInterest={activeTab === 'minimum' ? minResult.totalInterest : payoffResult.totalInterest}
        debtFreeDateText={payoffResult.debtFreeDateText}
      />

      {/* Dynamic Summary Banner (Light Mint) */}
      <div className={styles.summaryBanner} role="region" aria-label="Payoff Summary">
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

      {/* ================= TAB 1: PAYOFF TIME & INTEREST ================= */}
      {activeTab === 'payoff' && (
        <div className={styles.grid}>
          {/* Inputs Column */}
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Credit Card Balance & Rate</h2>
                  <p className={styles.cardSubtitle}>Enter your statement balance and APR</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-balance`} className={styles.label}>
                    Current Statement Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-balance`}
                      type="number"
                      min="1"
                      step="50"
                      value={balance || ''}
                      onChange={(e) => setBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('balance')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-apr`} className={styles.label}>
                    Annual Percentage Rate (APR)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-apr`}
                      type="number"
                      min="0"
                      max="99"
                      step="0.01"
                      value={aprPct || ''}
                      onChange={(e) => setAprPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('apr')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>Check your statement for standard purchases APR</span>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Interest Calculation Convention</span>
                  <div className={styles.segmented} role="radiogroup" aria-label="Interest Calculation Method">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={interestMethod === 'monthly'}
                      className={`${styles.segmentBtn} ${interestMethod === 'monthly' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setInterestMethod('monthly')}
                    >
                      Monthly (APR ÷ 12)
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={interestMethod === 'daily'}
                      className={`${styles.segmentBtn} ${interestMethod === 'daily' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setInterestMethod('daily')}
                    >
                      Daily (APR ÷ 365)
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Calculation Target</span>
                  <div className={styles.segmented} role="radiogroup" aria-label="Calculation Mode">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={payoffMode === 'payment'}
                      className={`${styles.segmentBtn} ${payoffMode === 'payment' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setPayoffMode('payment')}
                    >
                      Monthly Payment
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={payoffMode === 'months'}
                      className={`${styles.segmentBtn} ${payoffMode === 'months' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setPayoffMode('months')}
                    >
                      Payoff Timeline
                    </button>
                  </div>
                </div>
              </div>

              {payoffMode === 'payment' ? (
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-payment`} className={styles.label}>
                      Monthly Payment Amount
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${baseId}-payment`}
                        type="number"
                        min="1"
                        step="10"
                        value={monthlyPayment || ''}
                        onChange={(e) => setMonthlyPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                        onFocus={() => setActiveField('payment')}
                        onBlur={() => setActiveField(undefined)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                    <span className={styles.helperText}>
                      Must exceed monthly interest (${((balance * (aprPct / 100)) / 12).toFixed(2)})
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-targetMonths`} className={styles.label}>
                      Target Payoff Time (Months)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-targetMonths`}
                        type="number"
                        min="1"
                        max="360"
                        step="1"
                        value={targetMonths || ''}
                        onChange={(e) => setTargetMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        onFocus={() => setActiveField('months')}
                        onBlur={() => setActiveField(undefined)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.suffix}>Mos</span>
                    </div>
                    <span className={styles.helperText}>
                      Calculated payment: <strong>{fmt(calculatedPaymentForTargetMonths)}/mo</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Advanced optional adjustments */}
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-newCharges`} className={styles.label}>
                    Ongoing Monthly Charges (Optional)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-newCharges`}
                      type="number"
                      min="0"
                      step="25"
                      value={newCharges || ''}
                      onChange={(e) => setNewCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-annualFee`} className={styles.label}>
                    Card Annual Fee (Optional)
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
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className={styles.results}>
            {payoffResult.isPayoffPossible ? (
              <>
                <div className={styles.heroCard}>
                  <span className={styles.heroTag}>Time to Debt-Free</span>
                  <div className={styles.heroValue}>
                    {payoffResult.months} Months
                  </div>
                  <div className={styles.heroDate}>
                    Debt-Free Target: <strong>{payoffResult.debtFreeDateText}</strong> ({payoffResult.years} years)
                  </div>
                  <div className={styles.heroSub}>
                    Total interest costs: {fmt(payoffResult.totalInterest)} · Total paid: {fmt(payoffResult.totalPaid)}
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricTile}>
                    <span className={styles.metricLabel}>Monthly Payment</span>
                    <span className={styles.metricValue}>{fmt(effectiveMonthlyPayment)}</span>
                    <span className={styles.metricHelp}>Fixed payment</span>
                  </div>

                  <div className={styles.metricTile}>
                    <span className={styles.metricLabel}>Total Interest</span>
                    <span className={styles.metricValue}>{fmt(payoffResult.totalInterest)}</span>
                    <span className={styles.metricHelp}>
                      {balance > 0 ? ((payoffResult.totalInterest / payoffResult.totalPaid) * 100).toFixed(1) : 0}% of total
                    </span>
                  </div>

                  <div className={styles.metricTile}>
                    <span className={styles.metricLabel}>Total Amount Paid</span>
                    <span className={styles.metricValue}>{fmt(payoffResult.totalPaid)}</span>
                    <span className={styles.metricHelp}>Principal + Interest</span>
                  </div>

                  <div className={styles.metricTile}>
                    <span className={styles.metricLabel}>Initial Interest</span>
                    <span className={styles.metricValue}>
                      {fmt((balance * (aprPct / 100)) / 12)}
                    </span>
                    <span className={styles.metricHelp}>First month cut</span>
                  </div>
                </div>

                {/* SVG Visual Balance Amortization Chart */}
                <div className={styles.chartWrap}>
                  <h3 className={styles.cardTitle}>Balance Payoff Trajectory</h3>
                  <svg
                    className={styles.chartSvg}
                    viewBox="0 0 500 180"
                    role="img"
                    aria-label="Balance Payoff Trajectory Chart"
                  >
                    <line x1="45" y1="20" x2="45" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="45" y1="150" x2="480" y2="150" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Y-axis labels */}
                    <text x="40" y="25" textAnchor="end" fontSize="10" fill="#64748b">
                      ${Math.round(balance).toLocaleString()}
                    </text>
                    <text x="40" y="85" textAnchor="end" fontSize="10" fill="#64748b">
                      ${Math.round(balance / 2).toLocaleString()}
                    </text>
                    <text x="40" y="150" textAnchor="end" fontSize="10" fill="#64748b">
                      $0
                    </text>

                    {/* Horizontal grid lines */}
                    <line x1="45" y1="25" x2="480" y2="25" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="45" y1="85" x2="480" y2="85" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Trajectory path */}
                    {(() => {
                      if (!payoffResult.schedule || payoffResult.schedule.length < 2) return null;
                      const maxMonths = payoffResult.months;
                      const points = payoffResult.schedule.map((row) => {
                        const x = 45 + (row.month / maxMonths) * 435;
                        const y = 150 - (row.endingBalance / balance) * 125;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      });
                      const pathD = `M 45,25 L ${points.join(' L ')}`;
                      const areaD = `M 45,25 L ${points.join(' L ')} L 480,150 L 45,150 Z`;

                      return (
                        <g>
                          <path d={areaD} fill="rgba(37, 99, 235, 0.08)" />
                          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" />
                          <circle cx="480" cy="150" r="4" fill="#10b981" />
                        </g>
                      );
                    })()}

                    {/* X-axis labels */}
                    <text x="45" y="168" textAnchor="middle" fontSize="10" fill="#64748b">
                      Mo 0
                    </text>
                    <text x="260" y="168" textAnchor="middle" fontSize="10" fill="#64748b">
                      Mo {Math.round(payoffResult.months / 2)}
                    </text>
                    <text x="475" y="168" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="700">
                      Mo {payoffResult.months}
                    </text>
                  </svg>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: '#2563eb' }} />
                      <span>Remaining Balance</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: '#10b981' }} />
                      <span>Debt-Free (${fmt(0)})</span>
                    </div>
                  </div>
                </div>

                {/* Sensitivity Table */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Payment Sensitivity Analysis</h3>
                  <p className={styles.cardSubtitle}>See how paying just $25–$50 more per month slashes your interest</p>
                  <div className={styles.tableWrap} style={{ marginTop: '0.75rem' }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Monthly Payment</th>
                          <th className={styles.numCell}>Months to Free</th>
                          <th className={styles.numCell}>Total Interest</th>
                          <th className={styles.numCell}>Interest Saved</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sensitivityRows.map((row) => {
                          const isCurrent = Math.abs(row.payment - effectiveMonthlyPayment) < 2;
                          return (
                            <tr key={row.payment} className={isCurrent ? styles.selectedRow : ''}>
                              <td>
                                {fmt(row.payment)} {isCurrent ? '★ (Current)' : ''}
                              </td>
                              <td className={styles.numCell}>
                                {row.months !== null ? `${row.months} mos` : 'Never'}
                              </td>
                              <td className={styles.numCell}>
                                {row.interest !== null ? fmt(row.interest) : 'Infinite'}
                              </td>
                              <td className={styles.numCell} style={{ color: row.savings > 0 ? '#15803d' : 'inherit' }}>
                                {row.savings > 0 ? `+${fmt(row.savings)}` : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Schedule Table Preview & CSV Download */}
                <div className={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 className={styles.cardTitle}>Amortization Schedule</h3>
                      <p className={styles.cardSubtitle}>
                        {showAllRows
                          ? `Showing all ${payoffResult.schedule.length} months`
                          : `Showing first 12 of ${payoffResult.schedule.length} months`}
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
                          <th className={styles.numCell}>Start Bal</th>
                          <th className={styles.numCell}>Interest</th>
                          <th className={styles.numCell}>Principal</th>
                          <th className={styles.numCell}>Ending Bal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(showAllRows ? payoffResult.schedule : payoffResult.schedule.slice(0, 12)).map((row) => (
                          <tr key={row.month}>
                            <td>#{row.month}</td>
                            <td className={styles.numCell}>{fmt(row.startingBalance)}</td>
                            <td className={styles.numCell} style={{ color: '#ef4444' }}>
                              {fmt(row.interestCharged)}
                            </td>
                            <td className={styles.numCell} style={{ color: '#10b981' }}>
                              {fmt(row.principalPaid)}
                            </td>
                            <td className={styles.numCell}>{fmt(row.endingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.actionsBar}>
                    <button type="button" onClick={handleDownloadCsv} className={styles.downloadBtn}>
                      ⬇ Download Schedule as CSV
                    </button>
                    <span className={styles.helperText}>Open in Excel, Google Sheets, or Numbers</span>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.warningBanner}>
                <span className={styles.warningIcon} aria-hidden="true">⚠️</span>
                <div>
                  <strong>Payment Too Low to Cover Interest</strong>
                  <p>{payoffResult.unaffordableMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MINIMUM PAYMENT TRAP ================= */}
      {activeTab === 'minimum' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Minimum Payment Formula</h2>
                  <p className={styles.cardSubtitle}>Check your card agreement for exact minimum terms</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-minBalance`} className={styles.label}>
                    Card Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-minBalance`}
                      type="number"
                      min="1"
                      step="50"
                      value={minBalance || ''}
                      onChange={(e) => setMinBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-minApr`} className={styles.label}>
                    Card APR (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-minApr`}
                      type="number"
                      min="0"
                      max="99"
                      step="0.01"
                      value={minAprPct || ''}
                      onChange={(e) => setMinAprPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-minPct`} className={styles.label}>
                    Issuer Percentage of Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-minPct`}
                      type="number"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={minPctOfBalance || ''}
                      onChange={(e) => setMinPctOfBalance(Math.max(0.1, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>Major banks use 1.0% or 2.0%</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-minFloor`} className={styles.label}>
                    Minimum Payment Floor ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-minFloor`}
                      type="number"
                      min="10"
                      max="100"
                      step="5"
                      value={minFloor || ''}
                      onChange={(e) => setMinFloor(Math.max(10, parseFloat(e.target.value) || 25))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <span className={styles.helperText}>See your card agreement or statement</span>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Plus Interest Formula</span>
                  <div className={styles.segmented} role="radiogroup">
                    <button
                      type="button"
                      className={`${styles.segmentBtn} ${minPlusInterest ? styles.segmentBtnActive : ''}`}
                      onClick={() => setMinPlusInterest(true)}
                    >
                      1% + Interest (Standard)
                    </button>
                    <button
                      type="button"
                      className={`${styles.segmentBtn} ${!minPlusInterest ? styles.segmentBtnActive : ''}`}
                      onClick={() => setMinPlusInterest(false)}
                    >
                      Flat % Only
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-minCompare`} className={styles.label}>
                    Compare with Fixed Payment ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-minCompare`}
                      type="number"
                      min="25"
                      step="25"
                      value={minCompareFixedPayment || ''}
                      onChange={(e) => setMinCompareFixedPayment(Math.max(25, parseFloat(e.target.value) || 25))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Side by Side */}
          <div className={styles.results}>
            <div className={styles.comparisonGrid}>
              {/* Minimum Payment Trap Card */}
              <div className={`${styles.compareCard} ${styles.compareCardTrap}`}>
                <div className={styles.compareTitle}>
                  <span>Paying Only Minimum</span>
                  <span className={styles.badgeRed}>The Trap</span>
                </div>
                <div className={styles.heroValue} style={{ color: '#dc2626', fontSize: '1.8rem' }}>
                  {minResult.years} Years
                </div>
                <div className={styles.compareStats}>
                  <div className={styles.compareRow}>
                    <span>Total Months:</span>
                    <strong>{minResult.months} mos</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>First Month Payment:</span>
                    <strong>{fmt(minResult.firstMonthPayment)}</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Final Floor Payment:</span>
                    <strong>{fmt(minResult.lastMonthPayment)}</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Total Interest Paid:</span>
                    <strong style={{ color: '#dc2626' }}>{fmt(minResult.totalInterest)}</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Total Amount Paid:</span>
                    <strong>{fmt(minResult.totalPaid)}</strong>
                  </div>
                </div>
              </div>

              {/* Fixed Payment Card */}
              <div className={`${styles.compareCard} ${styles.compareCardTarget}`}>
                <div className={styles.compareTitle}>
                  <span>Fixed {fmt(minCompareFixedPayment)}/mo</span>
                  <span className={styles.badgeGreen}>Fast Track</span>
                </div>
                <div className={styles.heroValue} style={{ color: '#2563eb', fontSize: '1.8rem' }}>
                  {minFixedComparison.years} Years
                </div>
                <div className={styles.compareStats}>
                  <div className={styles.compareRow}>
                    <span>Total Months:</span>
                    <strong>{minFixedComparison.months} mos</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Time Saved:</span>
                    <strong style={{ color: '#16a34a' }}>
                      {Math.max(0, minResult.months - minFixedComparison.months)} mos (
                      {Math.max(0, minResult.years - minFixedComparison.years).toFixed(1)} yrs)
                    </strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Total Interest Paid:</span>
                    <strong style={{ color: '#2563eb' }}>{fmt(minFixedComparison.totalInterest)}</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Interest Saved:</span>
                    <strong style={{ color: '#16a34a' }}>
                      +{fmt(Math.max(0, minResult.totalInterest - minFixedComparison.totalInterest))}
                    </strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Total Amount Paid:</span>
                    <strong>{fmt(minFixedComparison.totalPaid)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Why Minimum Payments Take Decades</h3>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.25rem', lineHeight: 1.5 }}>
                Card issuers set your minimum payment as a percentage of your <em>remaining</em> balance. As your balance
                decreases, your required payment shrinks as well, causing principal reduction to slow to a crawl. On a{' '}
                {fmt(minBalance)} balance at {minAprPct}% APR, you would pay{' '}
                <strong>{fmt(minResult.totalInterest)} in pure interest</strong> — more than{' '}
                {((minResult.totalInterest / minBalance) * 100).toFixed(0)}% of what you originally borrowed!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: AVALANCHE VS. SNOWBALL ================= */}
      {activeTab === 'multi-card' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Your Credit Cards</h2>
                  <p className={styles.cardSubtitle}>Enter balances, rates, and minimums</p>
                </div>
              </div>

              {multiCards.map((card, idx) => (
                <div key={card.id} className={styles.cardRowItem}>
                  <input
                    type="text"
                    value={card.name}
                    aria-label={`Card ${idx + 1} Name`}
                    onChange={(e) => {
                      const updated = [...multiCards];
                      updated[idx].name = e.target.value;
                      setMultiCards(updated);
                    }}
                    className={styles.input}
                    placeholder="Card Name"
                  />
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      type="number"
                      aria-label={`${card.name} Balance`}
                      value={card.balance || ''}
                      onChange={(e) => {
                        const updated = [...multiCards];
                        updated[idx].balance = Math.max(0, parseFloat(e.target.value) || 0);
                        setMultiCards(updated);
                      }}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      placeholder="Balance"
                    />
                  </div>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      aria-label={`${card.name} APR`}
                      value={card.aprPct || ''}
                      onChange={(e) => {
                        const updated = [...multiCards];
                        updated[idx].aprPct = Math.max(0, parseFloat(e.target.value) || 0);
                        setMultiCards(updated);
                      }}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      placeholder="APR"
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      type="number"
                      aria-label={`${card.name} Minimum Payment`}
                      value={card.minPayment || ''}
                      onChange={(e) => {
                        const updated = [...multiCards];
                        updated[idx].minPayment = Math.max(0, parseFloat(e.target.value) || 0);
                        setMultiCards(updated);
                      }}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      placeholder="Min"
                    />
                  </div>
                  {multiCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMultiCards(multiCards.filter((_, i) => i !== idx))}
                      className={styles.removeBtn}
                      title="Remove card"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setMultiCards([
                    ...multiCards,
                    {
                      id: String(Date.now()),
                      name: `Card ${multiCards.length + 1}`,
                      balance: 2000,
                      aprPct: 21.99,
                      minPayment: 60,
                    },
                  ])
                }
                className={styles.addCardBtn}
              >
                + Add Another Card
              </button>

              <div className={styles.formRow} style={{ marginTop: '1rem' }}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-budget`} className={styles.label}>
                    Total Monthly Debt Paydown Budget ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-budget`}
                      type="number"
                      min={multiCards.reduce((acc, c) => acc + c.minPayment, 0)}
                      step="25"
                      value={multiBudget || ''}
                      onChange={(e) => setMultiBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <span className={styles.helperText}>
                    Minimum required: ${multiCards.reduce((acc, c) => acc + c.minPayment, 0)}/mo
                  </span>
                </div>

                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Strategy</span>
                  <div className={styles.segmented} role="radiogroup">
                    <button
                      type="button"
                      className={`${styles.segmentBtn} ${multiStrategy === 'avalanche' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setMultiStrategy('avalanche')}
                    >
                      Avalanche (Highest APR First)
                    </button>
                    <button
                      type="button"
                      className={`${styles.segmentBtn} ${multiStrategy === 'snowball' ? styles.segmentBtnActive : ''}`}
                      onClick={() => setMultiStrategy('snowball')}
                    >
                      Snowball (Smallest Balance First)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Strategy Comparison</span>
              <div className={styles.heroValue}>
                {multiStrategy === 'avalanche' ? 'Debt Avalanche' : 'Debt Snowball'}
              </div>
              <div className={styles.heroDate}>
                Total Payoff Time: <strong>{multiActiveResult.months} Months</strong> ({multiActiveResult.years} years)
              </div>
              <div className={styles.heroSub}>
                {avalancheResult.totalInterest <= snowballResult.totalInterest
                  ? `Avalanche saves ${fmt(multiSavingsVsOther)} in interest compared to Snowball.`
                  : `Snowball matches Avalanche within ${fmt(multiSavingsVsOther)} in total interest.`}
              </div>
            </div>

            <div className={styles.comparisonGrid}>
              <div className={`${styles.compareCard} ${multiStrategy === 'avalanche' ? styles.compareCardTarget : ''}`}>
                <div className={styles.compareTitle}>
                  <span>Debt Avalanche</span>
                  <span className={styles.badgeGreen}>Lowest Interest</span>
                </div>
                <div className={styles.compareStats}>
                  <div className={styles.compareRow}>
                    <span>Payoff Time:</span>
                    <strong>{avalancheResult.months} mos</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Total Interest:</span>
                    <strong style={{ color: '#16a34a' }}>{fmt(avalancheResult.totalInterest)}</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Order:</span>
                    <span style={{ fontSize: '0.75rem' }}>{avalancheResult.payoffOrder.join(' → ')}</span>
                  </div>
                </div>
              </div>

              <div className={`${styles.compareCard} ${multiStrategy === 'snowball' ? styles.compareCardTarget : ''}`}>
                <div className={styles.compareTitle}>
                  <span>Debt Snowball</span>
                  <span className={styles.badgeGreen}>Fastest Motivation</span>
                </div>
                <div className={styles.compareStats}>
                  <div className={styles.compareRow}>
                    <span>Payoff Time:</span>
                    <strong>{snowballResult.months} mos</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Total Interest:</span>
                    <strong>{fmt(snowballResult.totalInterest)}</strong>
                  </div>
                  <div className={styles.compareRow}>
                    <span>Order:</span>
                    <span style={{ fontSize: '0.75rem' }}>{snowballResult.payoffOrder.join(' → ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: BALANCE TRANSFER OFFER ================= */}
      {activeTab === 'transfer' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Balance Transfer Terms</h2>
                  <p className={styles.cardSubtitle}>Compare transfer fee vs interest saved</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-trAmount`} className={styles.label}>
                    Balance to Transfer ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-trAmount`}
                      type="number"
                      min="100"
                      step="100"
                      value={transferAmount || ''}
                      onChange={(e) => setTransferAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-trFee`} className={styles.label}>
                    Transfer Fee (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-trFee`}
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={transferFeePct || ''}
                      onChange={(e) => setTransferFeePct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>Upfront fee: {fmt(transferResult.transferFee)}</span>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-trPromoMonths`} className={styles.label}>
                    Intro 0% Promo Duration (Months)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-trPromoMonths`}
                      type="number"
                      min="6"
                      max="36"
                      step="3"
                      value={promoMonths || ''}
                      onChange={(e) => setPromoMonths(Math.max(1, parseInt(e.target.value, 10) || 12))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>Mos</span>
                  </div>
                  <span className={styles.helperText}>From the transfer offer terms</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-trPostApr`} className={styles.label}>
                    Regular APR After Promo (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-trPostApr`}
                      type="number"
                      min="10"
                      max="35"
                      step="0.1"
                      value={goAprPct || ''}
                      onChange={(e) => setGoAprPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-trCurrentApr`} className={styles.label}>
                    Current Card APR (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-trCurrentApr`}
                      type="number"
                      min="5"
                      max="35"
                      step="0.1"
                      value={transferCurrentApr || ''}
                      onChange={(e) => setTransferCurrentApr(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-trPayment`} className={styles.label}>
                    Planned Monthly Payment ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-trPayment`}
                      type="number"
                      min="50"
                      step="25"
                      value={transferMonthlyPayment || ''}
                      onChange={(e) => setTransferMonthlyPayment(Math.max(10, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Balance Transfer Verdict</span>
              <div
                className={styles.heroValue}
                style={{ color: transferResult.isWorthIt ? '#38bdf8' : '#f87171' }}
              >
                {transferResult.isWorthIt
                  ? `Saves ${fmt(transferResult.netSavings)} Net`
                  : `Costs ${fmt(Math.abs(transferResult.netSavings))} More`}
              </div>
              <div className={styles.heroDate}>
                {transferResult.isWorthIt
                  ? 'Transferring is mathematically worthwhile after paying the fee.'
                  : 'Transfer fee outweighs interest savings at your current repayment pace.'}
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Upfront Transfer Fee</span>
                <span className={styles.metricValue}>{fmt(transferResult.transferFee)}</span>
                <span className={styles.metricHelp}>{transferFeePct}% of transfer</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>New Total Balance</span>
                <span className={styles.metricValue}>{fmt(transferResult.newStartingBalance)}</span>
                <span className={styles.metricHelp}>Principal + Fee</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Staying Cost</span>
                <span className={styles.metricValue}>{fmt(transferResult.totalInterestStaying)}</span>
                <span className={styles.metricHelp}>Interest at {transferCurrentApr}%</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Transfer Total Cost</span>
                <span className={styles.metricValue}>{fmt(transferResult.totalInterestPromo)}</span>
                <span className={styles.metricHelp}>Fee + remaining int</span>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Pay-in-Full Promo Target</h3>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.25rem' }}>
                To pay off 100% of the balance within {promoMonths} months and avoid all {goAprPct}% post-promo
                interest, pay <strong>{fmt(promoPayoffTargetMonthly)}/month</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: APR CONVERTER ================= */}
      {activeTab === 'converter' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>APR Rate Translation</h2>
                  <p className={styles.cardSubtitle}>Convert nominal annual APR to daily and monthly periodic rates</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-convApr`} className={styles.label}>
                    Credit Card Nominal APR (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-convApr`}
                      type="number"
                      min="0"
                      max="99"
                      step="0.01"
                      value={converterApr || ''}
                      onChange={(e) => setConverterApr(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>Nominal stated APR on your credit card agreement</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Effective Annual Yield (APY)</span>
              <div className={styles.heroValue}>
                {conversionResult.effectiveApyPct}% APY
              </div>
              <div className={styles.heroDate}>
                Compounded Daily: <strong>(1 + {conversionResult.aprPct}% / 365)³⁶⁵ − 1</strong>
              </div>
              <div className={styles.heroSub}>
                Due to daily interest compounding, the true annualized interest rate is higher than the nominal APR.
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Daily Periodic Rate</span>
                <span className={styles.metricValue}>{conversionResult.dailyPeriodicRatePct}%</span>
                <span className={styles.metricHelp}>APR ÷ 365 days</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Monthly Periodic Rate</span>
                <span className={styles.metricValue}>{conversionResult.monthlyPeriodicRatePct}%</span>
                <span className={styles.metricHelp}>APR ÷ 12 months</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Effective APY</span>
                <span className={styles.metricValue}>{conversionResult.effectiveApyPct}%</span>
                <span className={styles.metricHelp}>With daily compounding</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Daily Cost per $1,000</span>
                <span className={styles.metricValue}>
                  {fmt((1000 * (conversionResult.aprPct / 100)) / 365)}
                </span>
                <span className={styles.metricHelp}>Accrues every 24 hours</span>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>How Card Issuers Use Daily Periodic Rate</h3>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.25rem', lineHeight: 1.5 }}>
                Every day you carry a revolving balance, your issuer multiplies your closing balance by your Daily
                Periodic Rate ({conversionResult.dailyPeriodicRatePct}%). At the end of the 30-day billing cycle, all 30
                daily interest amounts are summed up and added to your statement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
