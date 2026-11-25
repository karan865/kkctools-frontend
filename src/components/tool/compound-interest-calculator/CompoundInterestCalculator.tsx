'use client';

import React, { useState, useMemo, useId } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import CompoundInputGuide from './CompoundInputGuide';
import {
  calculateCompoundGrowth,
  compareFrequencies,
  compareSimpleVsCompound,
  solveDepositForGoal,
  solveRateForGoal,
  solveTimeForGoal,
  getApy,
  getNominalRate,
  CompoundingFrequency,
  DepositFrequency,
  DepositTiming,
} from '@/lib/compound-interest-engine';
import styles from './CompoundInterestCalculator.module.css';

type Mode = 'growth' | 'goal' | 'simple-vs-compound' | 'apr-vs-apy';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'growth', label: 'Compound Growth' },
  { id: 'goal', label: 'Savings Goal Solver' },
  { id: 'simple-vs-compound', label: 'Simple vs. Compound' },
  { id: 'apr-vs-apy', label: 'APR ↔ APY Converter' },
];
const TAB_IDS: readonly Mode[] = TABS.map((t) => t.id);

export default function CompoundInterestCalculator() {
  const [activeTab, setActiveTab] = useTabParam<Mode>(TAB_IDS, 'growth');

  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  // Tab 1: Growth Inputs
  const [principal, setPrincipal] = useState<number>(10000);
  const [ratePct, setRatePct] = useState<number>(5);
  const [rateType, setRateType] = useState<'apr' | 'apy'>('apr');
  const [compounding, setCompounding] = useState<CompoundingFrequency>('monthly');
  const [years, setYears] = useState<number>(10);
  const [months, setMonths] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(200);
  const [depositFrequency, setDepositFrequency] = useState<DepositFrequency>('monthly');
  const [depositTiming, setDepositTiming] = useState<DepositTiming>('end');
  const [annualStepUp, setAnnualStepUp] = useState<number>(0);
  const [inflationPct, setInflationPct] = useState<number>(0);
  const [taxPct, setTaxPct] = useState<number>(0);

  // Tab 2: Goal Solver Inputs
  const [goalTarget, setGoalTarget] = useState<number>(100000);
  const [goalPrincipal, setGoalPrincipal] = useState<number>(10000);
  const [goalSolveFor, setGoalSolveFor] = useState<'deposit' | 'rate' | 'time'>('deposit');
  const [goalYears, setGoalYears] = useState<number>(10);
  const [goalRate, setGoalRate] = useState<number>(7);
  const [goalDeposit, setGoalDeposit] = useState<number>(450);

  // Tab 3: Simple vs Compound Inputs
  const [svcPrincipal, setSvcPrincipal] = useState<number>(10000);
  const [svcRate, setSvcRate] = useState<number>(5);
  const [svcYears, setSvcYears] = useState<number>(10);
  const [svcDeposit, setSvcDeposit] = useState<number>(200);

  // Tab 4: APR vs APY Converter Inputs
  const [converterRate, setConverterRate] = useState<number>(5);
  const [converterDirection, setConverterDirection] = useState<'aprToApy' | 'apyToApr'>('aprToApy');
  const [converterFreq, setConverterFreq] = useState<CompoundingFrequency>('monthly');

  const baseId = useId();

  // Tab change handler with URL sync handled by useTabParam
  const handleTabChange = (tabId: Mode) => {
    setActiveTab(tabId);
  };

  // 1. Growth calculation
  const growthResult = useMemo(() => {
    return calculateCompoundGrowth({
      initialPrincipal: principal,
      ratePct,
      rateType,
      compounding,
      years,
      months,
      depositAmount,
      depositFrequency,
      depositTiming,
      annualDepositIncreasePct: annualStepUp,
      inflationPct,
      taxPct,
    });
  }, [
    principal,
    ratePct,
    rateType,
    compounding,
    years,
    months,
    depositAmount,
    depositFrequency,
    depositTiming,
    annualStepUp,
    inflationPct,
    taxPct,
  ]);

  // Frequency comparison for initial principal
  const frequencyTable = useMemo(() => {
    return compareFrequencies(principal, ratePct, years + months / 12);
  }, [principal, ratePct, years, months]);

  // 2. Goal calculations
  const goalResult = useMemo(() => {
    if (goalSolveFor === 'deposit') {
      const solved = solveDepositForGoal(goalTarget, goalPrincipal, goalRate, goalYears, 'monthly');
      return { type: 'deposit', value: solved, label: 'Monthly Deposit Needed' };
    } else if (goalSolveFor === 'rate') {
      const solved = solveRateForGoal(goalTarget, goalPrincipal, goalYears, goalDeposit, 'monthly');
      return { type: 'rate', value: solved, label: 'Required Annual Interest Rate' };
    } else {
      const solved = solveTimeForGoal(goalTarget, goalPrincipal, goalRate, goalDeposit, 'monthly');
      return { type: 'time', value: solved, label: 'Time Required to Reach Goal' };
    }
  }, [goalSolveFor, goalTarget, goalPrincipal, goalYears, goalRate, goalDeposit]);

  // 3. Simple vs Compound
  const svcResult = useMemo(() => {
    return compareSimpleVsCompound(svcPrincipal, svcRate, svcYears, svcDeposit);
  }, [svcPrincipal, svcRate, svcYears, svcDeposit]);

  // 4. APR vs APY Converter
  const convertedValue = useMemo(() => {
    if (converterDirection === 'aprToApy') {
      return getApy(converterRate, converterFreq);
    } else {
      return getNominalRate(converterRate, 'apy', converterFreq);
    }
  }, [converterRate, converterDirection, converterFreq]);

  // Helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleCopySummary = () => {
    let summary = '';
    if (activeTab === 'growth') {
      summary = `Starting with ${formatCurrency(principal)} and adding ${formatCurrency(depositAmount)} ${depositFrequency} at ${ratePct}% (${rateType.toUpperCase()}) compounded ${compounding}, you would have ${formatCurrency(growthResult.futureValue)} after ${years} years: ${formatCurrency(growthResult.totalDeposits)} of deposits and ${formatCurrency(growthResult.totalInterest)} of interest.`;
    } else if (activeTab === 'goal') {
      summary = `Goal Target: ${formatCurrency(goalTarget)}. Starting with ${formatCurrency(goalPrincipal)}, ${
        goalSolveFor === 'deposit'
          ? `you need to save ${formatCurrency(goalResult.value || 0)} monthly for ${goalYears} years at ${goalRate}%.`
          : goalSolveFor === 'rate'
          ? `you need a return of ${(goalResult.value || 0).toFixed(2)}% APR saving ${formatCurrency(goalDeposit)}/month for ${goalYears} years.`
          : `you will reach the goal in ${(goalResult.value || 0).toFixed(1)} years saving ${formatCurrency(goalDeposit)}/month at ${goalRate}%.`
      }`;
    } else if (activeTab === 'simple-vs-compound') {
      summary = `With ${formatCurrency(svcPrincipal)} at ${svcRate}% over ${svcYears} years: Simple Interest reaches ${formatCurrency(svcResult.simpleTotal)}, whereas Compound Interest reaches ${formatCurrency(svcResult.compoundTotal)}, generating a ${formatCurrency(svcResult.advantage)} (+${svcResult.advantagePct.toFixed(1)}%) advantage.`;
    } else {
      summary = `${converterRate}% ${converterDirection === 'aprToApy' ? 'APR' : 'APY'} compounded ${converterFreq} equals ${convertedValue.toFixed(4)}% ${converterDirection === 'aprToApy' ? 'APY' : 'APR'}.`;
    }

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadCsv = () => {
    const headers = ['Year', 'Starting Balance', 'Deposits', 'Interest Earned', 'Ending Balance', 'Cumulative Deposits', 'Cumulative Interest', 'Real Value (Inflation Adj)'];
    const rows = growthResult.schedule.map((r) => [
      r.year,
      r.startingBalance.toFixed(2),
      r.deposits.toFixed(2),
      r.interestEarned.toFixed(2),
      r.endingBalance.toFixed(2),
      r.cumulativeDeposits.toFixed(2),
      r.cumulativeInterest.toFixed(2),
      r.inflationAdjustedBalance.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `compound_interest_schedule_${years}yrs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.wrap}>
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={handleTabChange}
        ariaLabel="Compound interest calculation modes"
      />

      <CompoundInputGuide
        mode={activeTab}
        activeField={activeField}
        principal={activeTab === 'growth' ? principal : svcPrincipal}
        ratePct={activeTab === 'growth' ? ratePct : svcRate}
        years={activeTab === 'growth' ? years : svcYears}
        monthlyDeposit={activeTab === 'growth' ? depositAmount : svcDeposit}
        compounding={compounding}
        depositTiming={depositTiming}
        futureValue={activeTab === 'growth' ? growthResult.futureValue : svcResult.compoundTotal}
        interestEarned={activeTab === 'growth' ? growthResult.totalInterest : svcResult.compoundInterest}
      />

      {/* TAB 1: COMPOUND GROWTH */}
      {activeTab === 'growth' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Principal & Interest Rate</h3>
                  <p className={styles.cardSubtitle}>Initial investment balance and annual rate</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-principal`} className={styles.label}>
                    Starting Amount (Principal)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-principal`}
                      type="number"
                      min="0"
                      step="500"
                      value={principal || ''}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      onFocus={() => setActiveField('principal')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-rate`} className={styles.label}>
                    Interest Rate (% per Year)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-rate`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={ratePct || ''}
                      onChange={(e) => setRatePct(Number(e.target.value))}
                      onFocus={() => setActiveField('rate')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Rate Quoted As</span>
                  <div className={styles.radioGroup} role="radiogroup" aria-label="Rate Quoted As">
                    <label className={`${styles.radioOption} ${rateType === 'apr' ? styles.radioSelected : ''}`}>
                      <input
                        type="radio"
                        name="rateType"
                        value="apr"
                        checked={rateType === 'apr'}
                        onChange={() => setRateType('apr')}
                      />
                      APR (Nominal)
                    </label>
                    <label className={`${styles.radioOption} ${rateType === 'apy' ? styles.radioSelected : ''}`}>
                      <input
                        type="radio"
                        name="rateType"
                        value="apy"
                        checked={rateType === 'apy'}
                        onChange={() => setRateType('apy')}
                      />
                      APY (Effective Yield)
                    </label>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-compounding`} className={styles.label}>
                    Compounding Frequency
                  </label>
                  <select
                    id={`${baseId}-compounding`}
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value as CompoundingFrequency)}
                    className={styles.select}
                  >
                    <option value="annually">Annually (1/year)</option>
                    <option value="semiannually">Semi-Annually (2/year)</option>
                    <option value="quarterly">Quarterly (4/year)</option>
                    <option value="monthly">Monthly (12/year)</option>
                    <option value="daily365">Daily (365 days)</option>
                    <option value="daily360">Daily (360-day bank convention)</option>
                    <option value="continuous">Compounded Continuously</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-years`} className={styles.label}>
                    Investment Horizon (Years)
                  </label>
                  <input
                    id={`${baseId}-years`}
                    type="number"
                    min="1"
                    max="60"
                    value={years || ''}
                    onChange={(e) => setYears(Math.max(0, Number(e.target.value)))}
                    onFocus={() => setActiveField('years')}
                    onBlur={() => setActiveField(undefined)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-months`} className={styles.label}>
                    Additional Months
                  </label>
                  <input
                    id={`${baseId}-months`}
                    type="number"
                    min="0"
                    max="11"
                    value={months || ''}
                    onChange={(e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>2</span>
                <div>
                  <h3 className={styles.cardTitle}>Regular Contributions (Deposits)</h3>
                  <p className={styles.cardSubtitle}>Accelerate your wealth with recurring savings</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-deposit`} className={styles.label}>
                    Contribution Amount
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-deposit`}
                      type="number"
                      min="0"
                      step="50"
                      value={depositAmount || ''}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      onFocus={() => setActiveField('deposit')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-dep-freq`} className={styles.label}>
                    Contribution Frequency
                  </label>
                  <select
                    id={`${baseId}-dep-freq`}
                    value={depositFrequency}
                    onChange={(e) => setDepositFrequency(e.target.value as DepositFrequency)}
                    className={styles.select}
                  >
                    <option value="weekly">Weekly (52/yr)</option>
                    <option value="biweekly">Bi-Weekly (26/yr)</option>
                    <option value="monthly">Monthly (12/yr)</option>
                    <option value="quarterly">Quarterly (4/yr)</option>
                    <option value="semiannually">Semi-Annually (2/yr)</option>
                    <option value="annually">Annually (1/yr)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <span className={styles.label}>Contribution Timing</span>
                  <div className={styles.radioGroup} role="radiogroup" aria-label="Contribution Timing">
                    <label className={`${styles.radioOption} ${depositTiming === 'end' ? styles.radioSelected : ''}`}>
                      <input
                        type="radio"
                        name="timing"
                        value="end"
                        checked={depositTiming === 'end'}
                        onChange={() => setDepositTiming('end')}
                      />
                      End of Period
                    </label>
                    <label className={`${styles.radioOption} ${depositTiming === 'start' ? styles.radioSelected : ''}`}>
                      <input
                        type="radio"
                        name="timing"
                        value="start"
                        checked={depositTiming === 'start'}
                        onChange={() => setDepositTiming('start')}
                      />
                      Start of Period
                    </label>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-stepup`} className={styles.label}>
                    Annual Deposit Increase (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-stepup`}
                      type="number"
                      min="0"
                      step="1"
                      value={annualStepUp || ''}
                      onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      placeholder="0"
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-inflation`} className={styles.label}>
                    Expected Inflation Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-inflation`}
                      type="number"
                      min="0"
                      step="0.5"
                      value={inflationPct || ''}
                      onChange={(e) => setInflationPct(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      placeholder="e.g. 2.5"
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-tax`} className={styles.label}>
                    Tax on Interest (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-tax`}
                      type="number"
                      min="0"
                      step="1"
                      value={taxPct || ''}
                      onChange={(e) => setTaxPct(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      placeholder="e.g. 15"
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            {/* Hero Result Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Estimated Future Balance</span>
              <p className={styles.heroValue}>{formatCurrency(growthResult.futureValue)}</p>
              <p className={styles.heroSub}>
                Includes {formatCurrency(growthResult.totalInterest)} total interest earned (
                {growthResult.futureValue > 0
                  ? ((growthResult.totalInterest / growthResult.futureValue) * 100).toFixed(1)
                  : 0}
                % of wealth).
              </p>
            </div>

            {/* High Contrast Summary Banner */}
            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                Starting with {formatCurrency(principal)} and adding {formatCurrency(depositAmount)} {depositFrequency} at{' '}
                {ratePct}% ({rateType.toUpperCase()}) compounded {compounding}, you would have{' '}
                <strong>{formatCurrency(growthResult.futureValue)}</strong> after {years} years: consisting of{' '}
                {formatCurrency(growthResult.totalDeposits)} in cumulative deposits and{' '}
                {formatCurrency(growthResult.totalInterest)} in compound interest.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total Deposits</span>
                <span className={styles.metricValue}>{formatCurrency(growthResult.totalDeposits)}</span>
                <span className={styles.metricSub}>Principal + additions</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total Interest</span>
                <span className={styles.metricValue}>{formatCurrency(growthResult.totalInterest)}</span>
                <span className={styles.metricSub}>Compound earnings</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Effective APY</span>
                <span className={styles.metricValue}>{growthResult.apyPct.toFixed(3)}%</span>
                <span className={styles.metricSub}>Annual yield</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Doubling Time</span>
                <span className={styles.metricValue}>
                  {growthResult.doublingYears > 0 ? `${growthResult.doublingYears.toFixed(1)} yrs` : '—'}
                </span>
                <span className={styles.metricSub}>
                  Rule of 72: {growthResult.ruleOf72Years > 0 ? `${growthResult.ruleOf72Years.toFixed(1)} yrs` : '—'}
                </span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Real Purchasing Power</span>
                <span className={styles.metricValue}>{formatCurrency(growthResult.realPurchasingPower)}</span>
                <span className={styles.metricSub}>
                  {inflationPct > 0 ? `After ${inflationPct}% inflation` : 'Set inflation to adjust'}
                </span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Interest Ratio</span>
                <span className={styles.metricValue}>
                  {growthResult.totalDeposits > 0
                    ? `${((growthResult.totalInterest / growthResult.totalDeposits) * 100).toFixed(0)}%`
                    : '—'}
                </span>
                <span className={styles.metricSub}>Growth on deposits</span>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
              <button type="button" onClick={downloadCsv} className={`${styles.btn} ${styles.btnSecondary}`}>
                ⬇ Download CSV Schedule
              </button>
            </div>

            {/* Visual SVG Chart: Principal vs Interest Over Time */}
            <div className={styles.chartWrap}>
              <h4 className={styles.cardTitle}>Balance Accumulation Over Time</h4>
              <svg
                viewBox="0 0 500 180"
                className={styles.chartSvg}
                role="img"
                aria-label="Stacked balance growth chart over time"
              >
                {/* Horizontal grid lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Bars for every year (up to 15 bars, or sampled) */}
                {(() => {
                  const maxVal = Math.max(1, growthResult.futureValue);
                  const sched = growthResult.schedule;
                  const step = Math.max(1, Math.floor(sched.length / 12));
                  const displayRows = sched.filter((_, i) => (i + 1) % step === 0 || i === sched.length - 1);
                  const barWidth = Math.min(24, Math.floor(400 / (displayRows.length * 1.5)));

                  return displayRows.map((row, idx) => {
                    const x = 50 + idx * ((420 - 50) / Math.max(1, displayRows.length - 1));
                    const totalHeight = (row.endingBalance / maxVal) * 110;
                    const depHeight = (row.cumulativeDeposits / maxVal) * 110;
                    const intHeight = Math.max(0, totalHeight - depHeight);

                    const yTotal = 140 - totalHeight;
                    const yDep = 140 - depHeight;

                    return (
                      <g key={row.year}>
                        {/* Deposits segment */}
                        <rect
                          x={x - barWidth / 2}
                          y={yDep}
                          width={barWidth}
                          height={depHeight}
                          fill="#3b82f6"
                          rx="2"
                        />
                        {/* Interest segment on top */}
                        <rect
                          x={x - barWidth / 2}
                          y={yTotal}
                          width={barWidth}
                          height={intHeight}
                          fill="#10b981"
                          rx="2"
                        />
                        {/* Year label */}
                        <text x={x} y="156" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
                          Y{row.year}
                        </text>
                      </g>
                    );
                  });
                })()}
              </svg>

              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#3b82f6' }} />
                  <span>Total Deposits</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#10b981' }} />
                  <span>Compound Interest</span>
                </div>
              </div>
            </div>

            {/* Compounding Frequency Comparison Table */}
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Daily vs. Monthly vs. Continuous (Starting Principal Only)</h4>
              <p className={styles.cardSubtitle}>
                See how different frequencies impact your ${principal.toLocaleString('en-US')} initial investment over {years} years:
              </p>

              <div className={styles.tableWrap} style={{ marginTop: '0.75rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Frequency</th>
                      <th>Periods/Yr</th>
                      <th>Effective APY</th>
                      <th className={styles.numCell}>Ending Balance</th>
                      <th className={styles.numCell}>Diff vs Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frequencyTable.map((row) => (
                      <tr key={row.frequency}>
                        <td>{row.label}</td>
                        <td>{row.periodsPerYear}</td>
                        <td>{row.apy.toFixed(3)}%</td>
                        <td className={styles.numCell}>{formatCurrency(row.endingBalance)}</td>
                        <td className={styles.numCell} style={{ color: row.diffFromAnnual > 0 ? 'var(--success)' : 'var(--ink-soft)' }}>
                          {row.diffFromAnnual > 0 ? `+${formatCurrency(row.diffFromAnnual)}` : 'Baseline'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOAL SOLVER */}
      {activeTab === 'goal' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>🎯</span>
                <div>
                  <h3 className={styles.cardTitle}>Define Savings Target</h3>
                  <p className={styles.cardSubtitle}>What would you like to solve for?</p>
                </div>
              </div>

              <div className={styles.fieldGroup} style={{ marginBottom: '1rem' }}>
                <span className={styles.label}>Select Variable to Solve:</span>
                <div className={styles.radioGroup} role="radiogroup" aria-label="Variable to Solve">
                  <label className={`${styles.radioOption} ${goalSolveFor === 'deposit' ? styles.radioSelected : ''}`}>
                    <input
                      type="radio"
                      name="goalSolve"
                      value="deposit"
                      checked={goalSolveFor === 'deposit'}
                      onChange={() => setGoalSolveFor('deposit')}
                    />
                    Required Monthly Deposit
                  </label>
                  <label className={`${styles.radioOption} ${goalSolveFor === 'rate' ? styles.radioSelected : ''}`}>
                    <input
                      type="radio"
                      name="goalSolve"
                      value="rate"
                      checked={goalSolveFor === 'rate'}
                      onChange={() => setGoalSolveFor('rate')}
                    />
                    Required Interest Rate (%)
                  </label>
                  <label className={`${styles.radioOption} ${goalSolveFor === 'time' ? styles.radioSelected : ''}`}>
                    <input
                      type="radio"
                      name="goalSolve"
                      value="time"
                      checked={goalSolveFor === 'time'}
                      onChange={() => setGoalSolveFor('time')}
                    />
                    Years to Reach Goal
                  </label>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-goal-target`} className={styles.label}>
                    Target Wealth / Goal Amount
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-goal-target`}
                      type="number"
                      min="1000"
                      step="5000"
                      value={goalTarget || ''}
                      onChange={(e) => setGoalTarget(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-goal-principal`} className={styles.label}>
                    Current Savings (Starting Amount)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-goal-principal`}
                      type="number"
                      min="0"
                      step="1000"
                      value={goalPrincipal || ''}
                      onChange={(e) => setGoalPrincipal(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              {goalSolveFor !== 'deposit' && (
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-goal-dep-input`} className={styles.label}>
                      Monthly Contribution
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${baseId}-goal-dep-input`}
                        type="number"
                        min="0"
                        step="50"
                        value={goalDeposit || ''}
                        onChange={(e) => setGoalDeposit(Number(e.target.value))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {goalSolveFor !== 'rate' && (
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-goal-rate-input`} className={styles.label}>
                      Expected Annual Return (%)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-goal-rate-input`}
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={goalRate || ''}
                        onChange={(e) => setGoalRate(Number(e.target.value))}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>
              )}

              {goalSolveFor !== 'time' && (
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-goal-years-input`} className={styles.label}>
                      Target Time Horizon (Years)
                    </label>
                    <input
                      id={`${baseId}-goal-years-input`}
                      type="number"
                      min="1"
                      max="60"
                      value={goalYears || ''}
                      onChange={(e) => setGoalYears(Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>{goalResult.label}</span>
              <p className={styles.heroValue}>
                {goalResult.type === 'deposit' && formatCurrency(goalResult.value || 0) + '/mo'}
                {goalResult.type === 'rate' && `${(goalResult.value || 0).toFixed(2)}% APR`}
                {goalResult.type === 'time' &&
                  (goalResult.value !== null ? `${(goalResult.value || 0).toFixed(1)} Years` : 'Unreachable')}
              </p>
              <p className={styles.heroSub}>
                To reach your target goal of {formatCurrency(goalTarget)} starting with {formatCurrency(goalPrincipal)}.
              </p>
            </div>

            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                {goalSolveFor === 'deposit' &&
                  `To accumulate ${formatCurrency(goalTarget)} in ${goalYears} years at an annual return of ${goalRate}%, you must contribute ${formatCurrency(goalResult.value || 0)} at the end of each month.`}
                {goalSolveFor === 'rate' &&
                  `To accumulate ${formatCurrency(goalTarget)} in ${goalYears} years while contributing ${formatCurrency(goalDeposit)} monthly, your investments must yield a return of ${(goalResult.value || 0).toFixed(2)}% compounded monthly.`}
                {goalSolveFor === 'time' &&
                  (goalResult.value !== null
                    ? `At ${goalRate}% interest and saving ${formatCurrency(goalDeposit)} monthly, you will achieve your ${formatCurrency(goalTarget)} goal in approximately ${(goalResult.value || 0).toFixed(1)} years (${Math.round((goalResult.value || 0) * 12)} months).`
                    : `Your current contributions and return rate are insufficient to reach the target within standard investment horizons.`)}
              </p>
            </div>

            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Goal Feasibility Insights</h4>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.375rem', lineHeight: '1.5' }}>
                {goalSolveFor === 'deposit' &&
                  `Starting earlier reduces this monthly requirement dramatically because each dollar has more compounding cycles. For example, extending by 5 years reduces the monthly requirement by roughly 30–45%.`}
                {goalSolveFor === 'rate' &&
                  `An investment return of ${(goalResult.value || 0).toFixed(2)}% represents the required hurdle rate. Historically, broad market indexes like the S&P 500 have averaged ~10% nominal annual return before inflation.`}
                {goalSolveFor === 'time' &&
                  `Increasing your monthly deposit by just $100 could accelerate your achievement by multiple years.`}
              </p>
            </div>

            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIMPLE VS COMPOUND */}
      {activeTab === 'simple-vs-compound' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>⚖️</span>
                <div>
                  <h3 className={styles.cardTitle}>Comparison Parameters</h3>
                  <p className={styles.cardSubtitle}>Identical cash flows evaluated under both interest models</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-svc-p`} className={styles.label}>
                    Starting Principal
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-svc-p`}
                      type="number"
                      min="0"
                      step="500"
                      value={svcPrincipal || ''}
                      onChange={(e) => setSvcPrincipal(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-svc-r`} className={styles.label}>
                    Interest Rate (% per Year)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-svc-r`}
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={svcRate || ''}
                      onChange={(e) => setSvcRate(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-svc-y`} className={styles.label}>
                    Time Horizon (Years)
                  </label>
                  <input
                    id={`${baseId}-svc-y`}
                    type="number"
                    min="1"
                    max="60"
                    value={svcYears || ''}
                    onChange={(e) => setSvcYears(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-svc-d`} className={styles.label}>
                    Monthly Contribution
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-svc-d`}
                      type="number"
                      min="0"
                      step="50"
                      value={svcDeposit || ''}
                      onChange={(e) => setSvcDeposit(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Compound Interest Advantage</span>
              <p className={styles.heroValue}>+{formatCurrency(svcResult.advantage)}</p>
              <p className={styles.heroSub}>
                Compound interest yields +{svcResult.advantagePct.toFixed(1)}% more total wealth than simple linear
                interest.
              </p>
            </div>

            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                On a {formatCurrency(svcPrincipal)} principal with {formatCurrency(svcDeposit)}/mo at {svcRate}% over{' '}
                {svcYears} years, simple interest generates {formatCurrency(svcResult.simpleInterest)} in interest, while
                compound interest generates {formatCurrency(svcResult.compoundInterest)}, yielding a{' '}
                <strong>{formatCurrency(svcResult.advantage)} bonus</strong> solely from interest earned on past interest.
              </p>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Simple Interest Total</span>
                <span className={styles.metricValue}>{formatCurrency(svcResult.simpleTotal)}</span>
                <span className={styles.metricSub}>Interest: {formatCurrency(svcResult.simpleInterest)}</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Compound Total</span>
                <span className={styles.metricValue}>{formatCurrency(svcResult.compoundTotal)}</span>
                <span className={styles.metricSub}>Interest: {formatCurrency(svcResult.compoundInterest)}</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Net Outperformance</span>
                <span className={styles.metricValue} style={{ color: 'var(--success)' }}>
                  +{formatCurrency(svcResult.advantage)}
                </span>
                <span className={styles.metricSub}>+{svcResult.advantagePct.toFixed(1)}% advantage</span>
              </div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Why Compound Interest Pulls Away</h4>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.375rem', lineHeight: '1.5' }}>
                Simple interest is strictly linear: only the original principal and raw contributions generate interest.
                Compound interest is exponential: every dollar earned immediately joins the capital base, becoming an active
                earning unit in subsequent periods.
              </p>
            </div>

            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APR VS APY CONVERTER */}
      {activeTab === 'apr-vs-apy' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>🔄</span>
                <div>
                  <h3 className={styles.cardTitle}>Rate Conversion Setup</h3>
                  <p className={styles.cardSubtitle}>Convert between nominal APR and effective annual yield (APY)</p>
                </div>
              </div>

              <div className={styles.fieldGroup} style={{ marginBottom: '1rem' }}>
                <span className={styles.label}>Conversion Direction</span>
                <div className={styles.radioGroup} role="radiogroup" aria-label="Conversion Direction">
                  <label className={`${styles.radioOption} ${converterDirection === 'aprToApy' ? styles.radioSelected : ''}`}>
                    <input
                      type="radio"
                      name="convDir"
                      value="aprToApy"
                      checked={converterDirection === 'aprToApy'}
                      onChange={() => setConverterDirection('aprToApy')}
                    />
                    APR → APY (Nominal to Effective)
                  </label>
                  <label className={`${styles.radioOption} ${converterDirection === 'apyToApr' ? styles.radioSelected : ''}`}>
                    <input
                      type="radio"
                      name="convDir"
                      value="apyToApr"
                      checked={converterDirection === 'apyToApr'}
                      onChange={() => setConverterDirection('apyToApr')}
                    />
                    APY → APR (Effective to Nominal)
                  </label>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-conv-rate`} className={styles.label}>
                    {converterDirection === 'aprToApy' ? 'Nominal APR (%)' : 'Effective APY (%)'}
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-conv-rate`}
                      type="number"
                      min="0"
                      step="0.05"
                      value={converterRate || ''}
                      onChange={(e) => setConverterRate(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-conv-freq`} className={styles.label}>
                    Compounding Frequency
                  </label>
                  <select
                    id={`${baseId}-conv-freq`}
                    value={converterFreq}
                    onChange={(e) => setConverterFreq(e.target.value as CompoundingFrequency)}
                    className={styles.select}
                  >
                    <option value="annually">Annually (1)</option>
                    <option value="semiannually">Semi-Annually (2)</option>
                    <option value="quarterly">Quarterly (4)</option>
                    <option value="monthly">Monthly (12)</option>
                    <option value="daily365">Daily (365)</option>
                    <option value="daily360">Daily (360)</option>
                    <option value="continuous">Continuous</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>
                {converterDirection === 'aprToApy' ? 'Converted APY (Effective Yield)' : 'Converted APR (Nominal Rate)'}
              </span>
              <p className={styles.heroValue}>{convertedValue.toFixed(4)}%</p>
              <p className={styles.heroSub}>
                Based on {converterRate}% {converterDirection === 'aprToApy' ? 'APR' : 'APY'} compounded {converterFreq}.
              </p>
            </div>

            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                {converterDirection === 'aprToApy' ? (
                  <>
                    A nominal APR of <strong>{converterRate}%</strong> compounded {converterFreq} produces an effective annual yield (APY) of{' '}
                    <strong>{convertedValue.toFixed(4)}%</strong>. This is the true annual percentage you earn or pay.
                  </>
                ) : (
                  <>
                    An advertised APY of <strong>{converterRate}%</strong> compounded {converterFreq} corresponds to a nominal base APR of{' '}
                    <strong>{convertedValue.toFixed(4)}%</strong>.
                  </>
                )}
              </p>
            </div>

            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Compounding Yield Table for {converterRate}% Rate</h4>
              <p className={styles.cardSubtitle}>
                How {converterRate}% nominal APR translates to APY across all standard frequencies:
              </p>

              <div className={styles.tableWrap} style={{ marginTop: '0.75rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Compounding Interval</th>
                      <th>Periods/Yr</th>
                      <th className={styles.numCell}>Effective APY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Annually', n: 1, apy: getApy(converterRate, 'annually') },
                      { name: 'Semi-Annually', n: 2, apy: getApy(converterRate, 'semiannually') },
                      { name: 'Quarterly', n: 4, apy: getApy(converterRate, 'quarterly') },
                      { name: 'Monthly', n: 12, apy: getApy(converterRate, 'monthly') },
                      { name: 'Daily (365)', n: 365, apy: getApy(converterRate, 'daily365') },
                      { name: 'Continuous', n: '∞', apy: getApy(converterRate, 'continuous') },
                    ].map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.n}</td>
                        <td className={styles.numCell}>{row.apy.toFixed(4)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
