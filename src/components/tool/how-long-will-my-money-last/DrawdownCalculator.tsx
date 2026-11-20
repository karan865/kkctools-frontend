'use client';

import React, { useState, useMemo, useId, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import TabSlider from '@/components/tool/shared/TabSlider';
import DrawdownInputGuide from './DrawdownInputGuide';
import {
  calculateDrawdown,
  calculateClosedFormYears,
  solveMaxSpending,
  calculateScenarios,
  OtherIncomeSource,
} from '@/lib/drawdown-engine';
import styles from './DrawdownCalculator.module.css';

type Mode = 'years' | 'spend' | 'four-percent';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'years', label: 'How Many Years Will It Last?' },
  { id: 'spend', label: 'How Much Can I Spend?' },
  { id: 'four-percent', label: '4% Rule Baseline' },
];

export default function DrawdownCalculator() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Mode) || 'years';
  const validatedTab: Mode = ['years', 'spend', 'four-percent'].includes(initialTab) ? initialTab : 'years';

  const [activeTab, setActiveTab] = useState<Mode>(validatedTab);
  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  // Core Inputs
  const [initialSavings, setInitialSavings] = useState<number>(500000);
  const [currentAge, setCurrentAge] = useState<number>(65);
  const [spendingAnnual, setSpendingAnnual] = useState<number>(40000);
  const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(true);
  const [expectedReturnPct, setExpectedReturnPct] = useState<number>(5.0);
  const [inflationPct, setInflationPct] = useState<number>(3.0);
  const [feesPct, setFeesPct] = useState<number>(0.0);

  // Tab 2: Spend Mode Target
  const [targetAge, setTargetAge] = useState<number>(95);

  // Other Incomes (Social Security / Pension)
  const [otherIncomes, setOtherIncomes] = useState<OtherIncomeSource[]>([]);
  const [incLabel, setIncLabel] = useState('');
  const [incAmount, setIncAmount] = useState<number>(18000);
  const [incStartAge, setIncStartAge] = useState<number>(67);

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

  const fmtWhole = useCallback((val: number) => {
    if (!Number.isFinite(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  }, []);

  // 1. Years to Depletion Calculation
  const drawdownResult = useMemo(() => {
    return calculateDrawdown({
      initialSavings,
      currentAge,
      spendingAnnual: activeTab === 'four-percent' ? initialSavings * 0.04 : spendingAnnual,
      inflationAdjusted,
      expectedReturnPct,
      inflationPct,
      feesPct,
      otherIncomes,
    });
  }, [
    initialSavings,
    currentAge,
    spendingAnnual,
    inflationAdjusted,
    expectedReturnPct,
    inflationPct,
    feesPct,
    otherIncomes,
    activeTab,
  ]);

  // Closed-form flat comparison
  const closedFormFlatYears = useMemo(() => {
    return calculateClosedFormYears(initialSavings, spendingAnnual, expectedReturnPct - feesPct);
  }, [initialSavings, spendingAnnual, expectedReturnPct, feesPct]);

  // 2. Spend Solver Calculation
  const spendResult = useMemo(() => {
    return solveMaxSpending({
      initialSavings,
      currentAge,
      targetAge,
      inflationAdjusted,
      expectedReturnPct,
      inflationPct,
      feesPct,
      otherIncomes,
    });
  }, [
    initialSavings,
    currentAge,
    targetAge,
    inflationAdjusted,
    expectedReturnPct,
    inflationPct,
    feesPct,
    otherIncomes,
  ]);

  // 3. Stress Test Scenarios
  const scenarioResult = useMemo(() => {
    return calculateScenarios({
      initialSavings,
      currentAge,
      spendingAnnual: activeTab === 'four-percent' ? initialSavings * 0.04 : spendingAnnual,
      inflationAdjusted,
      expectedReturnPct,
      inflationPct,
      feesPct,
      otherIncomes,
    });
  }, [
    initialSavings,
    currentAge,
    spendingAnnual,
    inflationAdjusted,
    expectedReturnPct,
    inflationPct,
    feesPct,
    otherIncomes,
    activeTab,
  ]);

  // Summary Banner Text
  const summaryText = useMemo(() => {
    if (activeTab === 'years') {
      if (drawdownResult.isIndefinite) {
        return `At an assumed ${expectedReturnPct.toFixed(1)}% return, withdrawing ${fmtWhole(spendingAnnual)} a year leaves your ${fmtWhole(initialSavings)} portfolio intact indefinitely. Annual investment growth exceeds withdrawals.`;
      }
      const inflStr = inflationAdjusted ? `rising with ${inflationPct.toFixed(1)}% inflation` : 'flat';
      const flatNote = closedFormFlatYears && Number.isFinite(closedFormFlatYears)
        ? ` Without inflation increases it would last about ${closedFormFlatYears.toFixed(1)} years.`
        : '';
      return `Taking ${fmtWhole(spendingAnnual)} a year from ${fmtWhole(initialSavings)}, ${inflStr} and earning ${expectedReturnPct.toFixed(1)}%, the money lasts about ${drawdownResult.yearsLasted.toFixed(1)} years, until age ${Math.round(drawdownResult.depletedAge)}.${flatNote}`;
    }
    if (activeTab === 'spend') {
      return `To make your ${fmtWhole(initialSavings)} savings last 30 years until age ${targetAge} at an assumed ${expectedReturnPct.toFixed(1)}% return and ${inflationPct.toFixed(1)}% inflation, you can spend about ${fmtWhole(spendResult.maxInitialAnnualSpending)} in Year 1 (${fmt(spendResult.maxInitialMonthlySpending)}/mo), representing a ${spendResult.initialWithdrawalRatePct.toFixed(2)}% initial withdrawal rate.`;
    }
    if (activeTab === 'four-percent') {
      const fourPctSpend = initialSavings * 0.04;
      return `Under the 4% rule, withdrawing ${fmtWhole(fourPctSpend)} in Year 1 from ${fmtWhole(initialSavings)} (adjusted for ${inflationPct.toFixed(1)}% inflation) is projected to last ${drawdownResult.yearsLasted.toFixed(1)} years (until age ${Math.round(drawdownResult.depletedAge)}) at an assumed ${expectedReturnPct.toFixed(1)}% return.`;
    }
    return '';
  }, [
    activeTab,
    spendingAnnual,
    initialSavings,
    inflationAdjusted,
    inflationPct,
    expectedReturnPct,
    drawdownResult,
    closedFormFlatYears,
    targetAge,
    spendResult,
    fmt,
    fmtWhole,
  ]);

  const copySummary = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddOtherIncome = () => {
    if (incAmount <= 0) return;
    setOtherIncomes([
      ...otherIncomes,
      {
        id: String(Date.now()),
        label: incLabel.trim() || 'Guaranteed Pension / SS',
        annualAmount: incAmount,
        startAge: incStartAge,
        annualIncreasePct: 2.5,
      },
    ]);
    setIncLabel('');
  };

  const handleRemoveOtherIncome = (id?: string) => {
    setOtherIncomes(otherIncomes.filter((item) => item.id !== id));
  };

  const downloadCsv = () => {
    const activeSchedule = activeTab === 'spend' ? spendResult.schedule : drawdownResult.schedule;
    const headers = [
      'Year',
      'Age',
      'Starting Balance',
      'Investment Growth',
      'Gross Spending',
      'Other Income',
      'One-Off Expense',
      'Net Withdrawal',
      'Ending Balance',
    ];
    const rows = activeSchedule.map((row) => [
      row.year,
      row.age,
      row.startingBalance,
      row.investmentGrowth,
      row.grossSpending,
      row.otherIncome,
      row.oneOffExpense,
      row.netWithdrawal,
      row.endingBalance,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `retirement-drawdown-schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.wrap}>
      {/* Tab Navigation */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(tabId) => handleTabChange(tabId as Mode)}
        ariaLabel="Drawdown Calculator Modes"
      />

      {/* Input Guide Diagram */}
      <DrawdownInputGuide
        mode={activeTab}
        activeField={activeField}
        initialSavings={initialSavings}
        currentAge={currentAge}
        spendingAnnual={activeTab === 'four-percent' ? initialSavings * 0.04 : spendingAnnual}
        expectedReturnPct={expectedReturnPct}
        inflationPct={inflationPct}
        feesPct={feesPct}
        yearsLasted={drawdownResult.yearsLasted}
        depletedAge={drawdownResult.depletedAge}
        isIndefinite={drawdownResult.isIndefinite}
        targetAge={targetAge}
        solvedSpending={spendResult.maxInitialAnnualSpending}
      />

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left Column: Form Inputs */}
        <div className={styles.inputs}>
          {/* Card 1: Savings & Retirement Age */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>1</span>
              <div>
                <h3 className={styles.cardTitle}>Retirement Capital &amp; Timeline</h3>
                <p className={styles.cardSubtitle}>Your current nest egg and planning horizon</p>
              </div>
            </div>

            <div className={styles.inputGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${baseId}-sav`}>
                  Savings Today <span className={styles.labelHint}>Total portfolio</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={`${baseId}-sav`}
                    type="number"
                    className={styles.input}
                    value={initialSavings || ''}
                    min={0}
                    step={10000}
                    onChange={(e) => setInitialSavings(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('initialSavings')}
                    onBlur={() => setActiveField(undefined)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${baseId}-age`}>
                  Current Age
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${baseId}-age`}
                    type="number"
                    className={styles.input}
                    value={currentAge || ''}
                    min={20}
                    max={100}
                    step={1}
                    onChange={(e) => setCurrentAge(Number(e.target.value) || 20)}
                  />
                  <span className={styles.suffix}>Yrs</span>
                </div>
              </div>

              {activeTab === 'spend' && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-target-age`}>
                    Target Age <span className={styles.labelHint}>Plan to age</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-target-age`}
                      type="number"
                      className={styles.input}
                      value={targetAge || ''}
                      min={currentAge + 1}
                      max={110}
                      step={1}
                      onChange={(e) => setTargetAge(Number(e.target.value) || currentAge + 1)}
                    />
                    <span className={styles.suffix}>Yrs</span>
                  </div>
                </div>
              )}

              {activeTab !== 'spend' && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-spend`}>
                    Annual Spending from Savings <span className={styles.labelHint}>Year 1</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-spend`}
                      type="number"
                      className={styles.input}
                      value={activeTab === 'four-percent' ? initialSavings * 0.04 : spendingAnnual || ''}
                      min={0}
                      step={1000}
                      disabled={activeTab === 'four-percent'}
                      onChange={(e) => setSpendingAnnual(Number(e.target.value) || 0)}
                    />
                  </div>
                  <label className={styles.toggleRow}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={inflationAdjusted}
                      onChange={(e) => setInflationAdjusted(e.target.checked)}
                    />
                    <span>Spending rises with inflation each year</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Return & Inflation Rates */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>2</span>
              <div>
                <h3 className={styles.cardTitle}>Return Rate, Inflation &amp; Fees</h3>
                <p className={styles.cardSubtitle}>Deterministic assumptions (illustrations, not forecasts)</p>
              </div>
            </div>

            <div className={styles.inputGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${baseId}-ret`}>
                  Expected Return <span className={styles.labelHint}>Nominal %</span>
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${baseId}-ret`}
                    type="number"
                    className={styles.input}
                    value={expectedReturnPct || ''}
                    min={0}
                    max={20}
                    step={0.1}
                    onChange={(e) => setExpectedReturnPct(Number(e.target.value) || 0)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${baseId}-inf`}>
                  Estimated Inflation
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${baseId}-inf`}
                    type="number"
                    className={styles.input}
                    value={inflationPct}
                    min={0}
                    max={15}
                    step={0.1}
                    onChange={(e) => setInflationPct(Number(e.target.value) || 0)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${baseId}-fees`}>
                  Annual Fees / Drag
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${baseId}-fees`}
                    type="number"
                    className={styles.input}
                    value={feesPct}
                    min={0}
                    max={5}
                    step={0.05}
                    onChange={(e) => setFeesPct(Number(e.target.value) || 0)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Other Guaranteed Income */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>3</span>
              <div>
                <h3 className={styles.cardTitle}>Social Security &amp; Pensions (Optional)</h3>
                <p className={styles.cardSubtitle}>Supplemental income reduces withdrawals from savings</p>
              </div>
            </div>

            {otherIncomes.map((inc) => (
              <div key={inc.id} className={styles.incomeRow}>
                <div>
                  <strong>{inc.label}</strong>
                  <div className={styles.labelHint}>Starts age {inc.startAge}</div>
                </div>
                <div>{fmtWhole(inc.annualAmount)}/yr</div>
                <div>+{inc.annualIncreasePct}%/yr</div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveOtherIncome(inc.id)}
                  title="Remove income"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className={styles.inputGrid} style={{ marginTop: '0.75rem' }}>
              <div className={styles.field}>
                <label className={styles.label}>Income Source Name</label>
                <input
                  type="text"
                  className={styles.input}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem' }}
                  placeholder="e.g. Social Security"
                  value={incLabel}
                  onChange={(e) => setIncLabel(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Annual Amount</label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    type="number"
                    className={styles.input}
                    value={incAmount || ''}
                    min={0}
                    step={1000}
                    onChange={(e) => setIncAmount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Start Age</label>
                <div className={styles.inputWrap}>
                  <input
                    type="number"
                    className={styles.input}
                    value={incStartAge || ''}
                    min={50}
                    max={90}
                    onChange={(e) => setIncStartAge(Number(e.target.value) || 67)}
                  />
                  <span className={styles.suffix}>Yrs</span>
                </div>
              </div>
            </div>

            <button type="button" className={styles.addBtn} onClick={handleAddOtherIncome}>
              + Add Guaranteed Income Source
            </button>
          </div>
        </div>

        {/* Right Column: Results & Longevity Breakdown */}
        <div className={styles.results}>
          {/* Summary Banner */}
          <div className={styles.summaryBanner}>
            <div className={styles.summaryContent}>
              <span className={styles.summaryIcon}>💡</span>
              <p className={styles.summaryText}>{summaryText}</p>
            </div>
            <button
              type="button"
              className={styles.copySummaryBtn}
              onClick={copySummary}
              aria-label="Copy summary to clipboard"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* YMYL Regulatory Disclaimer */}
          <div className={styles.ymylNotice}>
            <span>⚖</span>
            <span>
              <strong>Planning Notice:</strong> Projections assume steady annual rates. Actual market returns are
              volatile. A market decline in the early years of retirement (sequence-of-returns risk) can deplete savings
              much faster.
            </span>
          </div>

          {/* Results Card */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>⏱️</span>
              <div>
                <h3 className={styles.cardTitle}>Portfolio Longevity Metrics</h3>
                <p className={styles.cardSubtitle}>Based on your deterministic input parameters</p>
              </div>
            </div>

            {activeTab === 'spend' ? (
              <div className={styles.metricsGrid}>
                <div className={`${styles.metricTile} ${styles.metricTileGreen}`}>
                  <span className={styles.metricLabel}>Max Initial Spend</span>
                  <span className={styles.metricValue}>{fmtWhole(spendResult.maxInitialAnnualSpending)}</span>
                  <span className={styles.metricSub}>Year 1 annual amount</span>
                </div>

                <div className={`${styles.metricTile} ${styles.metricTileHighlight}`}>
                  <span className={styles.metricLabel}>Monthly Equivalent</span>
                  <span className={styles.metricValue}>{fmt(spendResult.maxInitialMonthlySpending)}</span>
                  <span className={styles.metricSub}>Starting monthly budget</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Withdrawal Rate</span>
                  <span className={styles.metricValue}>{spendResult.initialWithdrawalRatePct.toFixed(2)}%</span>
                  <span className={styles.metricSub}>Initial rate on savings</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Sustains to Age</span>
                  <span className={styles.metricValue}>Age {targetAge}</span>
                  <span className={styles.metricSub}>{targetAge - currentAge} Years</span>
                </div>
              </div>
            ) : (
              <div className={styles.metricsGrid}>
                <div
                  className={`${styles.metricTile} ${
                    drawdownResult.isIndefinite ? styles.metricTileGreen : styles.metricTileHighlight
                  }`}
                >
                  <span className={styles.metricLabel}>Duration</span>
                  <span className={styles.metricValue}>
                    {drawdownResult.isIndefinite ? 'Indefinite' : `~${drawdownResult.yearsLasted.toFixed(1)} Yrs`}
                  </span>
                  <span className={styles.metricSub}>
                    {drawdownResult.isIndefinite ? 'Preserved forever' : `Until Age ${Math.round(drawdownResult.depletedAge)}`}
                  </span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Total Withdrawn</span>
                  <span className={styles.metricValue}>{fmtWhole(drawdownResult.totalWithdrawn)}</span>
                  <span className={styles.metricSub}>Cumulative spend</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Growth Earned</span>
                  <span className={styles.metricValue}>{fmtWhole(drawdownResult.totalGrowthEarned)}</span>
                  <span className={styles.metricSub}>Compound interest</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Initial Rate</span>
                  <span className={styles.metricValue}>
                    {((spendingAnnual / (initialSavings || 1)) * 100).toFixed(2)}%
                  </span>
                  <span className={styles.metricSub}>Year 1 withdrawal</span>
                </div>
              </div>
            )}
          </div>

          {/* Stress-Testing Scenarios Card */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>📉</span>
              <div>
                <h3 className={styles.cardTitle}>Sequence-of-Returns &amp; Return Stress Test</h3>
                <p className={styles.cardSubtitle}>Compare base case vs. lower returns vs. a bad market start</p>
              </div>
            </div>

            <div className={styles.scenarioGrid}>
              <div className={styles.scenarioTile}>
                <div className={styles.scenarioTitle}>Expected Case ({expectedReturnPct}%)</div>
                <div className={styles.scenarioVal}>
                  {scenarioResult.expectedYears >= 80 ? '80+ Yrs' : `~${scenarioResult.expectedYears.toFixed(1)} Yrs`}
                </div>
                <div className={styles.metricSub}>Runs out at Age {Math.round(scenarioResult.expectedEndAge)}</div>
              </div>

              <div className={styles.scenarioTile}>
                <div className={styles.scenarioTitle}>Lower Return (-2 pts)</div>
                <div className={styles.scenarioVal}>~{scenarioResult.lowerReturnYears.toFixed(1)} Yrs</div>
                <div className={styles.metricSub}>Runs out at Age {Math.round(scenarioResult.lowerReturnEndAge)}</div>
              </div>

              <div className={styles.scenarioTile} style={{ borderLeft: '3px solid #dc2626' }}>
                <div className={styles.scenarioTitle} style={{ color: '#dc2626' }}>
                  Bad Start (-15% Yrs 1-2)
                </div>
                <div className={styles.scenarioVal} style={{ color: '#b91c1c' }}>
                  ~{scenarioResult.badStartYears.toFixed(1)} Yrs
                </div>
                <div className={styles.metricSub}>Runs out at Age {Math.round(scenarioResult.badStartEndAge)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      {drawdownResult.schedule.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeadRow}>
            <h3 className={styles.tableTitle}>Year-by-Year Retirement Drawdown Schedule</h3>
            <div className={styles.tableActions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setShowAllRows(!showAllRows)}
              >
                {showAllRows ? 'Show Fewer Rows' : `Show All ${drawdownResult.schedule.length} Years`}
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={downloadCsv}
              >
                Download CSV
              </button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Year (Age)</th>
                  <th>Starting Balance</th>
                  <th>Investment Growth</th>
                  <th>Spending</th>
                  {otherIncomes.length > 0 && <th>Other Income</th>}
                  <th>Net Withdrawal</th>
                  <th>Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {(showAllRows ? drawdownResult.schedule : drawdownResult.schedule.slice(0, 10)).map((row) => (
                  <tr key={row.year}>
                    <td>
                      Year {row.year} (Age {row.age})
                    </td>
                    <td>{fmtWhole(row.startingBalance)}</td>
                    <td>+{fmtWhole(row.investmentGrowth)}</td>
                    <td>-{fmtWhole(row.grossSpending)}</td>
                    {otherIncomes.length > 0 && <td>+{fmtWhole(row.otherIncome)}</td>}
                    <td>-{fmtWhole(row.netWithdrawal)}</td>
                    <td>
                      <strong>{fmtWhole(row.endingBalance)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
