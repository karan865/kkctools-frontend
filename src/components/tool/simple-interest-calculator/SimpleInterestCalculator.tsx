'use client';

import React, { useState, useId, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import Link from 'next/link';
import {
  calculateSimpleInterest,
  solveSimpleInterest,
  calculateAccruedInterest,
  compareDayCountConventions,
  calculateBondAccruedInterest,
  DayCountMethod,
  TimeUnit,
} from '@/lib/simple-interest-engine';
import { InterestInputGuide } from './InterestInputGuide';
import styles from './SimpleInterestCalculator.module.css';

type TabMode = 'accrued' | 'solver' | 'bond' | 'compare';

export function SimpleInterestCalculator() {
  const [tab, setTab] = useState<TabMode>('accrued');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['accrued', 'solver', 'bond', 'compare'] as string[]).includes(t)) setTab(t as typeof tab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Accrued Tab State (Defaults from spec: $10,000 · 5% · 2026-01-15 → 2026-04-15 · Act/365)
  const [accruedPrincipal, setAccruedPrincipal] = useState<string>('10000');
  const [accruedRate, setAccruedRate] = useState<string>('5');
  const [startDate, setStartDate] = useState<string>('2026-01-15');
  const [endDate, setEndDate] = useState<string>('2026-04-15');
  const [convention, setConvention] = useState<DayCountMethod>('ACT/365');

  // Solver Tab State (Default: P $10,000 · r 5% · t 3 years)
  const [solveFor, setSolveFor] = useState<'I' | 'P' | 'r' | 't'>('I');
  const [solveP, setSolveP] = useState<string>('10000');
  const [solveR, setSolveR] = useState<string>('5');
  const [solveT, setSolveT] = useState<string>('3');
  const [solveTUnit, setSolveTUnit] = useState<TimeUnit>('years');
  const [solveI, setSolveI] = useState<string>('1500');

  // Bond Tab State (Default: $1,000 face · 5.75% · semi-annual · 61 days)
  const [bondFace, setBondFace] = useState<string>('1000');
  const [bondCoupon, setBondCoupon] = useState<string>('5.75');
  const [bondFreq, setBondFreq] = useState<1 | 2 | 4 | 12>(2);
  const [bondDaysAccrued, setBondDaysAccrued] = useState<string>('61');

  // Copy notification state
  const [copiedFormula, setCopiedFormula] = useState(false);

  // Accessible IDs
  const idAccruedP = useId();
  const idCmpP = useId();
  const idCmpR = useId();
  const idCmpS = useId();
  const idCmpE = useId();
  const idAccruedR = useId();
  const idStartDate = useId();
  const idEndDate = useId();
  const idConvention = useId();

  const idSolveP = useId();
  const idSolveR = useId();
  const idSolveT = useId();
  const idSolveTUnit = useId();
  const idSolveI = useId();

  const idBondFace = useId();
  const idBondCoupon = useId();
  const idBondFreq = useId();
  const idBondDays = useId();

  // Calculations
  const numAccruedP = parseFloat(accruedPrincipal) || 0;
  const numAccruedR = parseFloat(accruedRate) || 0;
  const accruedRes = calculateAccruedInterest(numAccruedP, numAccruedR, startDate, endDate, convention);
  const comparisonList = compareDayCountConventions(numAccruedP, numAccruedR, startDate, endDate);

  const numSolveP = parseFloat(solveP) || 0;
  const numSolveR = parseFloat(solveR) || 0;
  const numSolveT = parseFloat(solveT) || 0;
  const numSolveI = parseFloat(solveI) || 0;
  const solverRes = solveSimpleInterest({
    solveFor,
    principal: numSolveP,
    annualRatePct: numSolveR,
    time: numSolveT,
    timeUnit: solveTUnit,
    interest: numSolveI,
  });

  const simpleBaseRes = calculateSimpleInterest(numSolveP, numSolveR, solverRes.timeInYears);

  const numBondFace = parseFloat(bondFace) || 0;
  const numBondCoupon = parseFloat(bondCoupon) || 0;
  const numBondDays = parseFloat(bondDaysAccrued) || 0;
  const bondRes = calculateBondAccruedInterest(numBondFace, numBondCoupon, bondFreq, numBondDays);

  const handleCopyFormula = (formula: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(formula);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Visual Input Guide Diagram */}
      <InterestInputGuide activeTab={tab} />

      {/* Tabs */}
      <TabSlider
        tabs={[{ id: 'accrued', label: 'Accrued between Dates' }, { id: 'solver', label: 'Simple Interest Solver' }, { id: 'bond', label: 'Bond Accrued Interest' }, { id: 'compare', label: 'Compare Day Counts' }]}
        activeId={tab}
        onChange={(id) => {
          setTab(id as typeof tab);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="Simple & Accrued Interest Modes"
      />

      {/* Inputs Card */}
      <div className={styles.card}>
        {tab === 'accrued' && (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Calculate Accrued Interest between Two Dates</h2>
              <div className={styles.presetsRow}>
                <span className={styles.presetLabel}>Quick Dates:</span>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => {
                    setStartDate('2026-01-15');
                    setEndDate('2026-04-15');
                  }}
                >
                  90 Days (Q1)
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => {
                    setStartDate('2026-01-01');
                    setEndDate('2026-12-31');
                  }}
                >
                  Full Year (2026)
                </button>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={idAccruedP} className={styles.label}>
                  Principal Amount
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={idAccruedP}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.input}
                    value={accruedPrincipal}
                    onChange={(e) => setAccruedPrincipal(e.target.value)}
                  />
                </div>
                <span className={styles.helperText}>Initial loan balance or deposit balance.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idAccruedR} className={styles.label}>
                  Annual Interest Rate
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idAccruedR}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={accruedRate}
                    onChange={(e) => setAccruedRate(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
                <span className={styles.helperText}>Nominal annual simple interest rate.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idStartDate} className={styles.label}>
                  Start Date
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idStartDate}
                    type="date"
                    className={styles.input}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <span className={styles.helperText}>Date accrual begins (interest starts accruing).</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idEndDate} className={styles.label}>
                  End Date
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idEndDate}
                    type="date"
                    className={styles.input}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <span className={styles.helperText}>Settlement or payoff date.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idConvention} className={styles.label}>
                  Day Count Convention
                </label>
                <select
                  id={idConvention}
                  className={styles.select}
                  value={convention}
                  onChange={(e) => setConvention(e.target.value as DayCountMethod)}
                >
                  <option value="ACT/365">Actual/365 (Fixed - 365 days)</option>
                  <option value="ACT/360">Actual/360 (Banker’s Rule - 360 days)</option>
                  <option value="30/360">30/360 US (NASD / Bond Basis)</option>
                  <option value="30E/360">30E/360 (Eurobond Basis)</option>
                  <option value="ACT/ACT">Actual/Actual (ISDA - Leap Aware)</option>
                </select>
                <span className={styles.helperText}>Determines how days per month and year are counted.</span>
              </div>
            </div>
          </>
        )}

        {tab === 'solver' && (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Solve Any Variable in Simple Interest (I = P × r × t)</h2>
              <div className={styles.presetsRow}>
                <span className={styles.presetLabel}>Solve For:</span>
                {(['I', 'P', 'r', 't'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`${styles.presetBtn} ${solveFor === v ? styles.tabBtnActive : ''}`}
                    onClick={() => setSolveFor(v)}
                  >
                    {v === 'I' ? 'Interest (I)' : v === 'P' ? 'Principal (P)' : v === 'r' ? 'Rate (r)' : 'Time (t)'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.grid}>
              {solveFor !== 'P' && (
                <div className={styles.field}>
                  <label htmlFor={idSolveP} className={styles.label}>
                    Principal Amount (P)
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={idSolveP}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.input}
                      value={solveP}
                      onChange={(e) => setSolveP(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {solveFor !== 'r' && (
                <div className={styles.field}>
                  <label htmlFor={idSolveR} className={styles.label}>
                    Annual Interest Rate (r)
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={idSolveR}
                      type="number"
                      min="0"
                      step="0.01"
                      className={styles.input}
                      value={solveR}
                      onChange={(e) => setSolveR(e.target.value)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              )}

              {solveFor !== 't' && (
                <div className={styles.field}>
                  <label htmlFor={idSolveT} className={styles.label}>
                    Time / Duration (t)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className={styles.inputWrapper} style={{ flex: 1 }}>
                      <input
                        id={idSolveT}
                        type="number"
                        min="0"
                        step="any"
                        className={styles.input}
                        value={solveT}
                        onChange={(e) => setSolveT(e.target.value)}
                      />
                    </div>
                    <select
                      id={idSolveTUnit}
                      className={styles.select}
                      style={{ width: '120px' }}
                      value={solveTUnit}
                      onChange={(e) => setSolveTUnit(e.target.value as TimeUnit)}
                    >
                      <option value="years">Years</option>
                      <option value="months">Months</option>
                      <option value="weeks">Weeks</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              )}

              {solveFor !== 'I' && (
                <div className={styles.field}>
                  <label htmlFor={idSolveI} className={styles.label}>
                    Total Interest Earned (I)
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={idSolveI}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.input}
                      value={solveI}
                      onChange={(e) => setSolveI(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'bond' && (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Bond Accrued Interest (Dirty vs Clean Price)</h2>
              <div className={styles.presetsRow}>
                <span className={styles.presetLabel}>Example Fixture:</span>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => {
                    setBondFace('1000');
                    setBondCoupon('5.75');
                    setBondFreq(2);
                    setBondDaysAccrued('61');
                  }}
                >
                  $1,000 · 5.75% · 61 Days
                </button>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={idBondFace} className={styles.label}>
                  Bond Par / Face Value
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={idBondFace}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.input}
                    value={bondFace}
                    onChange={(e) => setBondFace(e.target.value)}
                  />
                </div>
                <span className={styles.helperText}>Nominal face value per bond.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idBondCoupon} className={styles.label}>
                  Annual Coupon Rate
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idBondCoupon}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={bondCoupon}
                    onChange={(e) => setBondCoupon(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
                <span className={styles.helperText}>Annual coupon percentage on face value.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idBondFreq} className={styles.label}>
                  Payment Frequency
                </label>
                <select
                  id={idBondFreq}
                  className={styles.select}
                  value={bondFreq}
                  onChange={(e) => setBondFreq(Number(e.target.value) as 1 | 2 | 4 | 12)}
                >
                  <option value={2}>Semi-Annual (2 times/year)</option>
                  <option value={1}>Annual (1 time/year)</option>
                  <option value={4}>Quarterly (4 times/year)</option>
                  <option value={12}>Monthly (12 times/year)</option>
                </select>
                <span className={styles.helperText}>Coupon disbursement schedule.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={idBondDays} className={styles.label}>
                  Days Accrued since Last Coupon
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idBondDays}
                    type="number"
                    min="0"
                    step="1"
                    className={styles.input}
                    value={bondDaysAccrued}
                    onChange={(e) => setBondDaysAccrued(e.target.value)}
                  />
                  <span className={styles.suffix}>days</span>
                </div>
                <span className={styles.helperText}>Elapsed days from last coupon payment to settlement.</span>
              </div>
            </div>
          </>
        )}

        {tab === 'compare' && (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Compare All 5 Day-Count Conventions Side-by-Side</h2>
            </div>
            <p className={styles.helperText} style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              Financial markets calculate interest using different day-count conventions. For commercial loans, Actual/360
              charges approximately 1.39% more annual interest than Actual/365 because the daily rate divides by 360 instead of 365.
            </p>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={idCmpP} className={styles.label}>Principal</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id={idCmpP}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.input}
                    value={accruedPrincipal}
                    onChange={(e) => setAccruedPrincipal(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={idCmpR} className={styles.label}>Annual Rate</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idCmpR}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={accruedRate}
                    onChange={(e) => setAccruedRate(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={idCmpS} className={styles.label}>Start Date</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idCmpS}
                    type="date"
                    className={styles.input}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={idCmpE} className={styles.label}>End Date</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idCmpE}
                    type="date"
                    className={styles.input}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hero Result Section */}
      {tab === 'accrued' && accruedRes && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Accrued Interest · {convention}
            </div>
            <div className={styles.heroMainValue}>
              ${accruedRes.accruedInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={styles.heroSubValue}>
              Total Amount (Principal + Accrued): ${accruedRes.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={styles.heroSentence}>
              Between {startDate} and {endDate} ({accruedRes.actualDays} calendar days), ${numAccruedP.toLocaleString()} at {numAccruedR}% accrues ${accruedRes.accruedInterest.toFixed(2)} on an {convention} basis (daily rate: ${accruedRes.dailyAccrual.toFixed(4)}/day).
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Actual Elapsed Days</span>
              <span className={styles.metricValue}>{accruedRes.actualDays} days</span>
              <span className={styles.metricDetail}>Exact calendar dates</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Counted Days ({convention})</span>
              <span className={styles.metricValue}>{accruedRes.countedDays} days</span>
              <span className={styles.metricDetail}>Adjusted for year convention</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Year Fraction (τ)</span>
              <span className={styles.metricValue}>{accruedRes.yearFraction.toFixed(5)}</span>
              <span className={styles.metricDetail}>Counted days / basis</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Daily Accrual</span>
              <span className={styles.metricValue}>${accruedRes.dailyAccrual.toFixed(4)}</span>
              <span className={styles.metricDetail}>Interest per 24 hours</span>
            </div>
          </div>

          {/* Excel / Google Sheets Formula */}
          <div className={styles.formulaBox}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                Excel / Google Sheets Formula:
              </div>
              <div className={styles.formulaText}>{accruedRes.excelFormula}</div>
            </div>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => handleCopyFormula(accruedRes.excelFormula)}
            >
              {copiedFormula ? 'Copied!' : 'Copy Formula'}
            </button>
          </div>
        </>
      )}

      {tab === 'solver' && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              {solveFor === 'I'
                ? 'Calculated Interest (I = P × r × t)'
                : solveFor === 'P'
                ? 'Calculated Principal (P = I ÷ (r × t))'
                : solveFor === 'r'
                ? 'Calculated Rate (r = I ÷ (P × t))'
                : 'Calculated Time (t = I ÷ (P × r))'}
            </div>
            <div className={styles.heroMainValue}>
              {solveFor === 'I' && `$${solverRes.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {solveFor === 'P' && `$${solverRes.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {solveFor === 'r' && `${solverRes.annualRatePct.toFixed(2)}%`}
              {solveFor === 't' && `${solverRes.solvedValue.toLocaleString()} ${solveTUnit}`}
            </div>
            <div className={styles.heroSubValue}>
              Total Repayment Amount (A = P + I): ${solverRes.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={styles.heroSentence}>
              A principal of ${solverRes.principal.toLocaleString()} invested at {solverRes.annualRatePct}% simple interest for {solverRes.timeInYears} year(s) earns exactly ${solverRes.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in simple interest.
            </div>
          </div>

          <div className={styles.compoundCallout}>
            <strong>Simple vs Compound Comparison:</strong> At {solverRes.annualRatePct}% over {solverRes.timeInYears} year(s),
            monthly compounding would earn <strong>${simpleBaseRes.monthlyCompoundInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> (an extra <strong>${simpleBaseRes.compoundDifference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>).{' '}
            <Link href="/compound-interest-calculator/" className={styles.compoundLink}>
              Open Compound Interest Calculator →
            </Link>
          </div>
        </>
      )}

      {tab === 'bond' && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Bond Accrued Interest (AI)
            </div>
            <div className={styles.heroMainValue}>
              ${bondRes.accruedInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={styles.heroSubValue}>
              Dirty Price (Clean Price ${bondRes.faceValue.toLocaleString()} + Accrued): ${bondRes.dirtyPricePerBond.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={styles.heroSentence}>
              On a ${bondRes.faceValue.toLocaleString()} par bond with a {bondRes.couponRatePct}% coupon paid {bondRes.frequency === 2 ? 'semi-annually' : `${bondRes.frequency} times/year`}, the buyer reimburses the seller ${bondRes.accruedInterest.toFixed(2)} for the {bondRes.daysAccrued} elapsed days since the last coupon.
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Annual Coupon</span>
              <span className={styles.metricValue}>${bondRes.annualCoupon.toFixed(2)}</span>
              <span className={styles.metricDetail}>Face value × Coupon rate</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Periodic Coupon Payment</span>
              <span className={styles.metricValue}>${bondRes.periodicCoupon.toFixed(2)}</span>
              <span className={styles.metricDetail}>Paid per period</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Days Accrued / Period</span>
              <span className={styles.metricValue}>{bondRes.daysAccrued} / {bondRes.daysInPeriod}</span>
              <span className={styles.metricDetail}>{((bondRes.daysAccrued / bondRes.daysInPeriod) * 100).toFixed(1)}% of coupon period</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Settlement Price</span>
              <span className={styles.metricValue}>${bondRes.dirtyPricePerBond.toFixed(2)}</span>
              <span className={styles.metricDetail}>Full purchase settlement</span>
            </div>
          </div>

          <div className={styles.formulaBox}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                Excel ACCRINT Bond Formula:
              </div>
              <div className={styles.formulaText}>{bondRes.excelFormula}</div>
            </div>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => handleCopyFormula(bondRes.excelFormula)}
            >
              {copiedFormula ? 'Copied!' : 'Copy Formula'}
            </button>
          </div>
        </>
      )}

      {tab === 'compare' && (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day-Count Method</th>
                <th>Days Counted</th>
                <th>Year Fraction (τ)</th>
                <th>Accrued Interest</th>
                <th>Diff vs Act/365</th>
                <th>Market Usage</th>
              </tr>
            </thead>
            <tbody>
              {comparisonList.map((item) => (
                <tr key={item.convention} className={item.convention === 'ACT/360' ? styles.highlightRow : undefined}>
                  <td>
                    <strong>{item.label}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Basis: {item.basis} days</div>
                  </td>
                  <td>{item.countedDays} days</td>
                  <td>{item.yearFraction.toFixed(5)}</td>
                  <td>
                    <strong>${item.accruedInterest.toFixed(2)}</strong>
                  </td>
                  <td style={{ color: item.differenceVsAct365 > 0 ? '#B45309' : 'inherit', fontWeight: 600 }}>
                    {item.differenceVsAct365 > 0 ? `+$${item.differenceVsAct365.toFixed(2)}` : '$0.00'}
                  </td>
                  <td style={{ fontSize: '0.8rem', maxWidth: '320px', lineHeight: 1.4 }}>
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => {
            setAccruedPrincipal('10000');
            setAccruedRate('5');
            setStartDate('2026-01-15');
            setEndDate('2026-04-15');
            setConvention('ACT/365');
            setSolveP('10000');
            setSolveR('5');
            setSolveT('3');
            setSolveTUnit('years');
            setSolveFor('I');
            setBondFace('1000');
            setBondCoupon('5.75');
            setBondFreq(2);
            setBondDaysAccrued('61');
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
