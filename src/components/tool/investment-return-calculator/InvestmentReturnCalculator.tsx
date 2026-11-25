'use client';

import React, { useState, useMemo, useId, useCallback } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import InvestInputGuide from './InvestInputGuide';
import {
  calculateProjection,
  calculateMoneyMarket,
  calculateTBill,
  calculateCompare,
  ContributionFrequency,
  ContributionTiming,
} from '@/lib/investment-return-engine';
import styles from './InvestmentReturnCalculator.module.css';

type Mode = 'projection' | 'money-market' | 'tbill' | 'compare';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'projection', label: 'Growth Projection & S&P 500' },
  { id: 'money-market', label: 'Money Market & Savings' },
  { id: 'tbill', label: 'Treasury Bills (T-Bills)' },
  { id: 'compare', label: 'Stocks vs Cash Compare' },
];
const TAB_IDS: readonly Mode[] = TABS.map((t) => t.id);

export default function InvestmentReturnCalculator() {
  const [activeTab, setActiveTab] = useTabParam<Mode>(TAB_IDS, 'projection');
  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  // Tab 1: Projection Inputs
  const [startingAmount, setStartingAmount] = useState<number>(10000);
  const [contribution, setContribution] = useState<number>(300);
  const [contributionFrequency, setContributionFrequency] = useState<ContributionFrequency>('monthly');
  const [contributionTiming, setContributionTiming] = useState<ContributionTiming>('end');
  const [stepUpPct, setStepUpPct] = useState<number>(0);
  const [assumedReturnPct, setAssumedReturnPct] = useState<number>(7.0);
  const [feesPct, setFeesPct] = useState<number>(0.0);
  const [taxDragPct, setTaxDragPct] = useState<number>(0.0);
  const [inflationPct, setInflationPct] = useState<number>(2.5);
  const [years, setYears] = useState<number>(20);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);

  // Tab 2: Money Market Inputs
  const [mmBalance, setMmBalance] = useState<number>(25000);
  const [mmApyPct, setMmApyPct] = useState<number>(4.5);
  const [mmDeposit, setMmDeposit] = useState<number>(0);
  const [mmMonths, setMmMonths] = useState<number>(12);

  // Tab 3: T-Bill Inputs
  const [tbillFace, setTbillFace] = useState<number>(10000);
  const [tbillPrice, setTbillPrice] = useState<number>(9750);
  const [tbillDays, setTbillDays] = useState<number>(182);

  // Tab 4: Compare Inputs
  const [cmpStarting, setCmpStarting] = useState<number>(10000);
  const [cmpMonthly, setCmpMonthly] = useState<number>(300);
  const [cmpYears, setCmpYears] = useState<number>(20);
  const [cmpStockReturn, setCmpStockReturn] = useState<number>(7.0);
  const [cmpCashApy, setCmpCashApy] = useState<number>(4.5);
  const [cmpInflation, setCmpInflation] = useState<number>(2.5);

  const baseId = useId();

  const handleTabChange = (tabId: Mode) => {
    setActiveTab(tabId);
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

  // 1. Projection Calculation
  const projectionResult = useMemo(() => {
    return calculateProjection({
      startingAmount,
      contribution,
      contributionFrequency,
      contributionTiming,
      stepUpPct,
      assumedReturnPct,
      feesPct,
      taxDragPct,
      inflationPct,
      years,
      withdrawalAmount,
    });
  }, [
    startingAmount,
    contribution,
    contributionFrequency,
    contributionTiming,
    stepUpPct,
    assumedReturnPct,
    feesPct,
    taxDragPct,
    inflationPct,
    years,
    withdrawalAmount,
  ]);

  // 2. Money Market Calculation
  const mmResult = useMemo(() => {
    return calculateMoneyMarket({
      initialBalance: mmBalance,
      apyPct: mmApyPct,
      monthlyDeposit: mmDeposit,
      months: mmMonths,
    });
  }, [mmBalance, mmApyPct, mmDeposit, mmMonths]);

  // 3. T-Bill Calculation
  const tbillResult = useMemo(() => {
    return calculateTBill({
      faceValue: tbillFace,
      pricePaid: tbillPrice,
      daysToMaturity: tbillDays,
    });
  }, [tbillFace, tbillPrice, tbillDays]);

  // 4. Compare Calculation
  const compareResult = useMemo(() => {
    return calculateCompare({
      startingAmount: cmpStarting,
      monthlyContribution: cmpMonthly,
      years: cmpYears,
      stockAssumedReturnPct: cmpStockReturn,
      cashApyPct: cmpCashApy,
      inflationPct: cmpInflation,
    });
  }, [cmpStarting, cmpMonthly, cmpYears, cmpStockReturn, cmpCashApy, cmpInflation]);

  // Summary Banner Text
  const summaryText = useMemo(() => {
    if (activeTab === 'projection') {
      const contribStr = contribution > 0 ? ` plus ${fmtWhole(contribution)} a month` : '';
      return `Investing ${fmtWhole(startingAmount)}${contribStr} at an assumed ${assumedReturnPct.toFixed(1)}% annual return would grow to about ${fmtWhole(projectionResult.finalBalance)} in ${years} years (${fmtWhole(projectionResult.realFinalBalance)} in today's purchasing power). That is an illustration, not a forecast.`;
    }
    if (activeTab === 'money-market') {
      return `A ${mmApyPct.toFixed(2)}% APY money market account pays ${fmt(mmResult.totalInterest)} in interest on a ${fmtWhole(mmBalance)} balance over ${mmMonths} months with monthly compounding.`;
    }
    if (activeTab === 'tbill') {
      return `A ${fmtWhole(tbillResult.faceValue)} Treasury bill purchased at ${fmt(tbillResult.pricePaid)} with ${tbillDays} days to maturity yields a ${tbillResult.discountRatePct.toFixed(3)}% discount rate and a ${tbillResult.investmentYieldPct.toFixed(3)}% coupon-equivalent investment yield.`;
    }
    if (activeTab === 'compare') {
      return `Over ${cmpYears} years, an assumed ${cmpStockReturn.toFixed(1)}% equity portfolio grows to ${fmtWhole(compareResult.stockFinalBalance)} while a ${cmpCashApy.toFixed(1)}% cash account reaches ${fmtWhole(compareResult.cashFinalBalance)} — a difference of ${fmtWhole(compareResult.difference)} (+${compareResult.differencePct.toFixed(1)}%).`;
    }
    return '';
  }, [
    activeTab,
    startingAmount,
    contribution,
    assumedReturnPct,
    years,
    projectionResult,
    mmApyPct,
    mmBalance,
    mmMonths,
    mmResult,
    tbillResult,
    tbillDays,
    cmpYears,
    cmpStockReturn,
    cmpCashApy,
    compareResult,
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

  const downloadProjectionCsv = () => {
    const headers = [
      'Year',
      'Starting Balance',
      'Contributions',
      'Interest Earned',
      'Fees Paid',
      'Ending Balance',
      'Real Purchasing Power',
    ];
    const rows = projectionResult.schedule.map((row) => [
      row.year,
      row.startingBalance,
      row.contributions,
      row.interestEarned,
      row.feesPaid,
      row.endingBalance,
      row.realEndingBalance,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investment-projection-${years}yr.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stacked bar percentages
  const principalShare =
    projectionResult.finalBalance > 0
      ? Math.min(100, (projectionResult.totalContributed / projectionResult.finalBalance) * 100)
      : 100;
  const gainShare = Math.max(0, 100 - principalShare);

  return (
    <div className={styles.wrap}>
      {/* Tab Navigation */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(tabId) => handleTabChange(tabId as Mode)}
        ariaLabel="Investment Calculator Modes"
      />

      {/* Input Guide Diagram */}
      <InvestInputGuide
        mode={activeTab}
        activeField={activeField}
        startingAmount={startingAmount}
        contribution={contribution}
        assumedReturnPct={assumedReturnPct}
        years={years}
        finalValue={projectionResult.finalBalance}
        realValue={projectionResult.realFinalBalance}
        feesPct={feesPct}
        balance={mmBalance}
        apyPct={mmApyPct}
        faceValue={tbillFace}
        pricePaid={tbillPrice}
      />

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left Column: Form Inputs */}
        <div className={styles.inputs}>
          {activeTab === 'projection' && (
            <>
              {/* Card 1: Capital & Contributions */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.step}>1</span>
                  <div>
                    <h3 className={styles.cardTitle}>Initial Capital &amp; Regular Deposits</h3>
                    <p className={styles.cardSubtitle}>Starting lump sum and scheduled periodic savings</p>
                  </div>
                </div>

                <div className={styles.inputGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-start`}>
                      Starting Balance <span className={styles.labelHint}>Initial lump sum</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${baseId}-start`}
                        type="number"
                        className={styles.input}
                        value={startingAmount || ''}
                        min={0}
                        step={500}
                        onChange={(e) => setStartingAmount(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('startingAmount')}
                        onBlur={() => setActiveField(undefined)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-contrib`}>
                      Periodic Contribution <span className={styles.labelHint}>Ongoing deposit</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${baseId}-contrib`}
                        type="number"
                        className={styles.input}
                        value={contribution || ''}
                        min={0}
                        step={50}
                        onChange={(e) => setContribution(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('contribution')}
                        onBlur={() => setActiveField(undefined)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-freq`}>
                      Deposit Frequency
                    </label>
                    <select
                      id={`${baseId}-freq`}
                      className={styles.select}
                      value={contributionFrequency}
                      onChange={(e) => setContributionFrequency(e.target.value as ContributionFrequency)}
                    >
                      <option value="monthly">Monthly (12/yr)</option>
                      <option value="yearly">Annually (1/yr)</option>
                      <option value="biweekly">Bi-Weekly (26/yr)</option>
                      <option value="weekly">Weekly (52/yr)</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-timing`}>
                      Deposit Timing
                    </label>
                    <select
                      id={`${baseId}-timing`}
                      className={styles.select}
                      value={contributionTiming}
                      onChange={(e) => setContributionTiming(e.target.value as ContributionTiming)}
                    >
                      <option value="end">End of Period (Ordinary Annuity)</option>
                      <option value="beginning">Beginning of Period (Annuity Due)</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-stepup`}>
                      Annual Contribution Step-Up <span className={styles.labelHint}>Increase %</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-stepup`}
                        type="number"
                        className={styles.input}
                        value={stepUpPct || ''}
                        min={0}
                        max={30}
                        step={0.5}
                        onChange={(e) => setStepUpPct(Number(e.target.value) || 0)}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-withdraw`}>
                      Monthly Withdrawals <span className={styles.labelHint}>Optional distributions</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id={`${baseId}-withdraw`}
                        type="number"
                        className={styles.input}
                        value={withdrawalAmount || ''}
                        min={0}
                        step={100}
                        onChange={(e) => setWithdrawalAmount(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Return, Fees & Timeline */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.step}>2</span>
                  <div>
                    <h3 className={styles.cardTitle}>Return Rate, Fees &amp; Timeline</h3>
                    <p className={styles.cardSubtitle}>Assumed returns, investment fees, and purchasing power</p>
                  </div>
                </div>

                <div className={styles.inputGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-ret`}>
                      Assumed Annual Return <span className={styles.labelHint}>Nominal rate</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-ret`}
                        type="number"
                        className={styles.input}
                        value={assumedReturnPct || ''}
                        min={0}
                        max={30}
                        step={0.1}
                        onChange={(e) => setAssumedReturnPct(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('assumedReturnPct')}
                        onBlur={() => setActiveField(undefined)}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                    <div className={styles.chipRow}>
                      <button
                        type="button"
                        className={`${styles.chipBtn} ${assumedReturnPct === 6 ? styles.chipBtnActive : ''}`}
                        onClick={() => setAssumedReturnPct(6.0)}
                      >
                        6% Conservative
                      </button>
                      <button
                        type="button"
                        className={`${styles.chipBtn} ${assumedReturnPct === 7 ? styles.chipBtnActive : ''}`}
                        onClick={() => setAssumedReturnPct(7.0)}
                      >
                        7% Baseline
                      </button>
                      <button
                        type="button"
                        className={`${styles.chipBtn} ${assumedReturnPct === 8 ? styles.chipBtnActive : ''}`}
                        onClick={() => setAssumedReturnPct(8.0)}
                      >
                        8% Growth
                      </button>
                      <button
                        type="button"
                        className={`${styles.chipBtn} ${assumedReturnPct === 10 ? styles.chipBtnActive : ''}`}
                        onClick={() => setAssumedReturnPct(10.0)}
                      >
                        10% Hist. S&amp;P 500
                      </button>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-years`}>
                      Investment Horizon <span className={styles.labelHint}>Years</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-years`}
                        type="number"
                        className={styles.input}
                        value={years || ''}
                        min={1}
                        max={60}
                        step={1}
                        onChange={(e) => setYears(Number(e.target.value) || 1)}
                        onFocus={() => setActiveField('years')}
                        onBlur={() => setActiveField(undefined)}
                      />
                      <span className={styles.suffix}>Yrs</span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-fees`}>
                      Expense Ratio / Fees <span className={styles.labelHint}>Annual fund fee</span>
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

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-tax`}>
                      Tax Drag <span className={styles.labelHint}>Taxable account %</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${baseId}-tax`}
                        type="number"
                        className={styles.input}
                        value={taxDragPct}
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={(e) => setTaxDragPct(Number(e.target.value) || 0)}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${baseId}-inf`}>
                      Estimated Inflation <span className={styles.labelHint}>CPI discount rate</span>
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
                </div>
              </div>
            </>
          )}

          {activeTab === 'money-market' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Money Market &amp; Savings Parameters</h3>
                  <p className={styles.cardSubtitle}>High-yield savings accounts and money market mutual funds</p>
                </div>
              </div>

              <div className={styles.inputGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-mm-bal`}>
                    Starting Deposit / Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-mm-bal`}
                      type="number"
                      className={styles.input}
                      value={mmBalance || ''}
                      min={0}
                      step={1000}
                      onChange={(e) => setMmBalance(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-mm-apy`}>
                    Annual Percentage Yield (APY)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-mm-apy`}
                      type="number"
                      className={styles.input}
                      value={mmApyPct || ''}
                      min={0}
                      max={20}
                      step={0.05}
                      onChange={(e) => setMmApyPct(Number(e.target.value) || 0)}
                    />
                    <span className={styles.suffix}>% APY</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-mm-dep`}>
                    Monthly Deposit (Optional)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-mm-dep`}
                      type="number"
                      className={styles.input}
                      value={mmDeposit || ''}
                      min={0}
                      step={100}
                      onChange={(e) => setMmDeposit(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-mm-months`}>
                    Holding Period (Months)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-mm-months`}
                      type="number"
                      className={styles.input}
                      value={mmMonths || ''}
                      min={1}
                      max={120}
                      step={1}
                      onChange={(e) => setMmMonths(Number(e.target.value) || 1)}
                    />
                    <span className={styles.suffix}>Mos</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tbill' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>U.S. Treasury Bill (T-Bill) Details</h3>
                  <p className={styles.cardSubtitle}>Short-term federal government obligations sold at a discount</p>
                </div>
              </div>

              <div className={styles.inputGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-tb-face`}>
                    Maturity Par Value (Face Value)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-tb-face`}
                      type="number"
                      className={styles.input}
                      value={tbillFace || ''}
                      min={100}
                      step={1000}
                      onChange={(e) => setTbillFace(Number(e.target.value) || 100)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-tb-price`}>
                    Purchase Price Paid <span className={styles.labelHint}>Discounted cost</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-tb-price`}
                      type="number"
                      className={styles.input}
                      value={tbillPrice || ''}
                      min={1}
                      step={10}
                      onChange={(e) => setTbillPrice(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label} htmlFor={`${baseId}-tb-days`}>
                    Days to Maturity
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-tb-days`}
                      type="number"
                      className={styles.input}
                      value={tbillDays || ''}
                      min={1}
                      max={365}
                      step={1}
                      onChange={(e) => setTbillDays(Number(e.target.value) || 1)}
                    />
                    <span className={styles.suffix}>Days</span>
                  </div>
                  <div className={styles.chipRow}>
                    <button
                      type="button"
                      className={`${styles.chipBtn} ${tbillDays === 28 ? styles.chipBtnActive : ''}`}
                      onClick={() => setTbillDays(28)}
                    >
                      4-Week (28 Days)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chipBtn} ${tbillDays === 91 ? styles.chipBtnActive : ''}`}
                      onClick={() => setTbillDays(91)}
                    >
                      13-Week (91 Days)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chipBtn} ${tbillDays === 182 ? styles.chipBtnActive : ''}`}
                      onClick={() => setTbillDays(182)}
                    >
                      26-Week (182 Days)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chipBtn} ${tbillDays === 364 ? styles.chipBtnActive : ''}`}
                      onClick={() => setTbillDays(364)}
                    >
                      52-Week (364 Days)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Compare Equities vs. Cash Capital</h3>
                  <p className={styles.cardSubtitle}>Stock market assumed returns vs. risk-free money market rates</p>
                </div>
              </div>

              <div className={styles.inputGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-cmp-start`}>
                    Starting Capital
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-cmp-start`}
                      type="number"
                      className={styles.input}
                      value={cmpStarting || ''}
                      min={0}
                      step={1000}
                      onChange={(e) => setCmpStarting(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-cmp-mo`}>
                    Monthly Contribution
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-cmp-mo`}
                      type="number"
                      className={styles.input}
                      value={cmpMonthly || ''}
                      min={0}
                      step={50}
                      onChange={(e) => setCmpMonthly(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-cmp-yr`}>
                    Time Horizon (Years)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-cmp-yr`}
                      type="number"
                      className={styles.input}
                      value={cmpYears || ''}
                      min={1}
                      max={50}
                      step={1}
                      onChange={(e) => setCmpYears(Number(e.target.value) || 1)}
                    />
                    <span className={styles.suffix}>Yrs</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-cmp-stock`}>
                    Stock Assumed Return
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-cmp-stock`}
                      type="number"
                      className={styles.input}
                      value={cmpStockReturn || ''}
                      min={0}
                      max={20}
                      step={0.1}
                      onChange={(e) => setCmpStockReturn(Number(e.target.value) || 0)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-cmp-cash`}>
                    Cash / Money Market APY
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-cmp-cash`}
                      type="number"
                      className={styles.input}
                      value={cmpCashApy || ''}
                      min={0}
                      max={15}
                      step={0.1}
                      onChange={(e) => setCmpCashApy(Number(e.target.value) || 0)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${baseId}-cmp-inf`}>
                    Inflation Rate
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-cmp-inf`}
                      type="number"
                      className={styles.input}
                      value={cmpInflation || ''}
                      min={0}
                      max={15}
                      step={0.1}
                      onChange={(e) => setCmpInflation(Number(e.target.value) || 0)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results & Analytics */}
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

          {/* Prominent Disclaimer next to result */}
          <div className={styles.disclaimerBox}>
            <span className={styles.disclaimerIcon}>⚠️</span>
            <span>
              <strong>Important Disclosure:</strong> Calculations are educational illustrations based on your input
              assumptions, not a guarantee or forecast of actual future market returns. Stocks entail market risk,
              including potential loss of principal.
            </span>
          </div>

          {/* Tab 1 Results: Projection */}
          {activeTab === 'projection' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>📈</span>
                <div>
                  <h3 className={styles.cardTitle}>Projected Growth Summary</h3>
                  <p className={styles.cardSubtitle}>Nominal value, real purchasing power, and contributions</p>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={`${styles.metricTile} ${styles.metricTileHighlight}`}>
                  <span className={styles.metricLabel}>Final Value</span>
                  <span className={styles.metricValue}>{fmtWhole(projectionResult.finalBalance)}</span>
                  <span className={styles.metricSub}>Nominal balance</span>
                </div>

                <div className={`${styles.metricTile} ${styles.metricTileGreen}`}>
                  <span className={styles.metricLabel}>Total Contributed</span>
                  <span className={styles.metricValue}>{fmtWhole(projectionResult.totalContributed)}</span>
                  <span className={styles.metricSub}>Lump sum + deposits</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Compound Gains</span>
                  <span className={styles.metricValue}>{fmtWhole(projectionResult.totalGains)}</span>
                  <span className={styles.metricSub}>Growth on capital</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Real Value</span>
                  <span className={styles.metricValue}>{fmtWhole(projectionResult.realFinalBalance)}</span>
                  <span className={styles.metricSub}>Inflation-adjusted</span>
                </div>

                {feesPct > 0 && (
                  <div className={styles.metricTile}>
                    <span className={styles.metricLabel}>Fee Drag Lost</span>
                    <span className={styles.metricValue}>{fmtWhole(projectionResult.totalFeesPaid)}</span>
                    <span className={styles.metricSub}>Expense ratio cost</span>
                  </div>
                )}

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Nominal CAGR</span>
                  <span className={styles.metricValue}>{projectionResult.annualizedCagr.toFixed(2)}%</span>
                  <span className={styles.metricSub}>Annualized return</span>
                </div>
              </div>

              {/* Stacked Growth Bar */}
              <div className={styles.stackBarContainer}>
                <div className={styles.stackBar}>
                  <div
                    className={styles.stackSegmentPrincipal}
                    style={{ width: `${principalShare}%` }}
                    title={`Contributions: ${fmtWhole(projectionResult.totalContributed)} (${principalShare.toFixed(1)}%)`}
                  />
                  <div
                    className={styles.stackSegmentGain}
                    style={{ width: `${gainShare}%` }}
                    title={`Gains: ${fmtWhole(projectionResult.totalGains)} (${gainShare.toFixed(1)}%)`}
                  />
                </div>
                <div className={styles.stackLegend}>
                  <span>
                    <span className={styles.legendDotPrincipal} /> Contributions:{' '}
                    {fmtWhole(projectionResult.totalContributed)} ({principalShare.toFixed(1)}%)
                  </span>
                  <span>
                    <span className={styles.legendDotGain} /> Growth:{' '}
                    {fmtWhole(projectionResult.totalGains)} ({gainShare.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Results: Money Market */}
          {activeTab === 'money-market' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>🏦</span>
                <div>
                  <h3 className={styles.cardTitle}>Money Market Earnings</h3>
                  <p className={styles.cardSubtitle}>Guaranteed monthly interest accrual</p>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={`${styles.metricTile} ${styles.metricTileGreen}`}>
                  <span className={styles.metricLabel}>Total Balance</span>
                  <span className={styles.metricValue}>{fmt(mmResult.finalBalance)}</span>
                  <span className={styles.metricSub}>After {mmMonths} months</span>
                </div>

                <div className={`${styles.metricTile} ${styles.metricTileHighlight}`}>
                  <span className={styles.metricLabel}>Interest Earned</span>
                  <span className={styles.metricValue}>+{fmt(mmResult.totalInterest)}</span>
                  <span className={styles.metricSub}>Compounded monthly</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Total Deposited</span>
                  <span className={styles.metricValue}>{fmt(mmResult.totalDeposited)}</span>
                  <span className={styles.metricSub}>Principal capital</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Effective APY</span>
                  <span className={styles.metricValue}>{mmResult.effectiveAnnualRate.toFixed(2)}%</span>
                  <span className={styles.metricSub}>Stated yield</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3 Results: T-Bill */}
          {activeTab === 'tbill' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>🏛️</span>
                <div>
                  <h3 className={styles.cardTitle}>Treasury Bill Yield Analysis</h3>
                  <p className={styles.cardSubtitle}>TreasuryDirect standard auction discount &amp; coupon yield</p>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={`${styles.metricTile} ${styles.metricTileHighlight}`}>
                  <span className={styles.metricLabel}>Investment Yield</span>
                  <span className={styles.metricValue}>{tbillResult.investmentYieldPct.toFixed(3)}%</span>
                  <span className={styles.metricSub}>Coupon Equivalent (365d)</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Discount Rate</span>
                  <span className={styles.metricValue}>{tbillResult.discountRatePct.toFixed(3)}%</span>
                  <span className={styles.metricSub}>Treasury basis (360d)</span>
                </div>

                <div className={`${styles.metricTile} ${styles.metricTileGreen}`}>
                  <span className={styles.metricLabel}>Total Interest</span>
                  <span className={styles.metricValue}>+{fmt(tbillResult.totalInterest)}</span>
                  <span className={styles.metricSub}>Maturity gain</span>
                </div>

                <div className={styles.metricTile}>
                  <span className={styles.metricLabel}>Purchase Cost</span>
                  <span className={styles.metricValue}>{fmt(tbillResult.pricePaid)}</span>
                  <span className={styles.metricSub}>Discounted price</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4 Results: Compare */}
          {activeTab === 'compare' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>⚖️</span>
                <div>
                  <h3 className={styles.cardTitle}>Asset Growth Comparison</h3>
                  <p className={styles.cardSubtitle}>Equities vs. Cash over {cmpYears} Years</p>
                </div>
              </div>

              <div className={styles.compareRow}>
                <div className={`${styles.compareCard} ${styles.compareStock}`}>
                  <div className={styles.compareHead}>
                    <span>Stocks ({cmpStockReturn}% assumed)</span>
                    <span>📈</span>
                  </div>
                  <div className={styles.compareVal}>{fmtWhole(compareResult.stockFinalBalance)}</div>
                  <div className={styles.metricSub}>Total Gains: {fmtWhole(compareResult.stockTotalGains)}</div>
                  <div className={styles.metricSub}>Real Value: {fmtWhole(compareResult.stockRealBalance)}</div>
                </div>

                <div className={`${styles.compareCard} ${styles.compareCash}`}>
                  <div className={styles.compareHead}>
                    <span>Cash / APY ({cmpCashApy}%)</span>
                    <span>🛡️</span>
                  </div>
                  <div className={styles.compareVal}>{fmtWhole(compareResult.cashFinalBalance)}</div>
                  <div className={styles.metricSub}>Total Gains: {fmtWhole(compareResult.cashTotalGains)}</div>
                  <div className={styles.metricSub}>Real Value: {fmtWhole(compareResult.cashRealBalance)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projection Annual Breakdown Table */}
      {activeTab === 'projection' && projectionResult.schedule.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeadRow}>
            <h3 className={styles.tableTitle}>Annual Growth &amp; Balance Schedule</h3>
            <div className={styles.tableActions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setShowAllRows(!showAllRows)}
              >
                {showAllRows ? 'Show Fewer Rows' : `Show All ${projectionResult.schedule.length} Years`}
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={downloadProjectionCsv}
              >
                Download CSV
              </button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Starting Balance</th>
                  <th>Contributions</th>
                  <th>Growth Earned</th>
                  {feesPct > 0 && <th>Fees</th>}
                  <th>Ending Balance</th>
                  <th>Real Purchasing Power</th>
                </tr>
              </thead>
              <tbody>
                {(showAllRows ? projectionResult.schedule : projectionResult.schedule.slice(0, 10)).map((row) => (
                  <tr key={row.year}>
                    <td>Year {row.year}</td>
                    <td>{fmtWhole(row.startingBalance)}</td>
                    <td>+{fmtWhole(row.contributions)}</td>
                    <td>+{fmtWhole(row.interestEarned)}</td>
                    {feesPct > 0 && <td>-{fmt(row.feesPaid)}</td>}
                    <td>
                      <strong>{fmtWhole(row.endingBalance)}</strong>
                    </td>
                    <td>{fmtWhole(row.realEndingBalance)}</td>
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
