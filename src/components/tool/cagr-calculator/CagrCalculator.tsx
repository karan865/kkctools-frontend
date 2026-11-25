'use client';

import React, { useState, useId, useMemo } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import CagrInputGuide from './CagrInputGuide';
import {
  calculateCagr,
  calculateEndFromCagr,
  calculateStartFromCagr,
  calculateYearsFromCagr,
  calculateRealCagr,
  calculateCagrFromSeries,
  calculateDoubling,
  DoublingComparison,
  CagrSeriesResult,
} from '@/lib/growth-engine';
import styles from './CagrCalculator.module.css';

type ActiveTab = 'cagr' | 'series' | 'doubling';
type SolveFor = 'cagr' | 'end' | 'start' | 'years';
type TimeMode = 'years' | 'dates';

const CURRENCIES = [
  { symbol: '', label: 'Neutral / No Symbol' },
  { symbol: '$', label: '$ (USD / CAD / AUD)' },
  { symbol: '₹', label: '₹ (INR Rupee)' },
  { symbol: '€', label: '€ (EUR Euro)' },
  { symbol: '£', label: '£ (GBP Pound)' },
];

export default function CagrCalculator() {
  const [tab, setTab] = useState<ActiveTab>('cagr');
  const [solveFor, setSolveFor] = useState<SolveFor>('cagr');
  const [timeMode, setTimeMode] = useState<TimeMode>('years');

  // Input states
  const [startVal, setStartVal] = useState<string>('10000');
  const [endVal, setEndVal] = useState<string>('20000');
  const [yearsVal, setYearsVal] = useState<string>('5');
  const [cagrInputVal, setCagrInputVal] = useState<string>('14.87');
  const [currency, setCurrency] = useState<string>('');
  const [inflationVal, setInflationVal] = useState<string>('');

  // Dates mode
  const [startDate, setStartDate] = useState<string>('2021-01-01');
  const [endDate, setEndDate] = useState<string>('2026-01-01');

  // Series mode
  const [seriesInput, setSeriesInput] = useState<string>('100, 50, 65, 78');

  // Doubling mode
  const [doublingRateVal, setDoublingRateVal] = useState<string>('8');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Accessible IDs
  const solveForId = useId();
  const timeModeId = useId();
  const startId = useId();
  const endId = useId();
  const yearsId = useId();
  const cagrRateId = useId();
  const currencyId = useId();
  const inflationId = useId();
  const startDateId = useId();
  const endDateId = useId();
  const seriesInputId = useId();
  const doublingRateId = useId();

  // Effective years calculation
  const effectiveYears = useMemo(() => {
    if (timeMode === 'years') {
      const y = parseFloat(yearsVal);
      return isNaN(y) || y <= 0 ? null : y;
    } else {
      if (!startDate || !endDate) return null;
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const diffMs = d2.getTime() - d1.getTime();
      if (diffMs <= 0) return null;
      const days = diffMs / (1000 * 60 * 60 * 24);
      return days / 365.25;
    }
  }, [timeMode, yearsVal, startDate, endDate]);

  // Main 4-way solver calculation
  const calculationResult = useMemo(() => {
    const s = parseFloat(startVal);
    const e = parseFloat(endVal);
    const r = parseFloat(cagrInputVal) / 100;
    const y = effectiveYears;
    const infl = parseFloat(inflationVal);

    if (solveFor === 'cagr') {
      if (isNaN(s) || isNaN(e) || !y) return { valid: false, error: 'Enter valid positive start, end, and duration values.' };
      const rate = calculateCagr(s, e, y);
      if (rate === null) return { valid: false, error: 'Start value must be positive, and end value non-negative.' };
      const realRate = !isNaN(infl) ? calculateRealCagr(rate, infl / 100) : null;
      const totalGrowth = ((e - s) / s) * 100;
      const doubling = rate > 0 ? calculateDoubling(rate) : null;
      return {
        valid: true,
        solvedType: 'cagr',
        cagrPercent: rate * 100,
        realCagrPercent: realRate !== null ? realRate * 100 : null,
        totalGrowthPercent: totalGrowth,
        doublingYears: doubling ? doubling.exactYears : null,
        start: s,
        end: e,
        years: y,
      };
    } else if (solveFor === 'end') {
      if (isNaN(s) || isNaN(r) || !y) return { valid: false, error: 'Enter valid start value, CAGR rate, and duration.' };
      const endCalculated = calculateEndFromCagr(s, r, y);
      if (endCalculated === null) return { valid: false, error: 'Invalid parameters for compound growth.' };
      return {
        valid: true,
        solvedType: 'end',
        calculatedEnd: endCalculated,
        start: s,
        cagrPercent: r * 100,
        years: y,
      };
    } else if (solveFor === 'start') {
      if (isNaN(e) || isNaN(r) || !y) return { valid: false, error: 'Enter valid end value, CAGR rate, and duration.' };
      const startCalculated = calculateStartFromCagr(e, r, y);
      if (startCalculated === null) return { valid: false, error: 'Invalid parameters for reverse compound growth.' };
      return {
        valid: true,
        solvedType: 'start',
        calculatedStart: startCalculated,
        end: e,
        cagrPercent: r * 100,
        years: y,
      };
    } else {
      if (isNaN(s) || isNaN(e) || isNaN(r)) return { valid: false, error: 'Enter valid start value, end value, and CAGR rate.' };
      const yearsCalculated = calculateYearsFromCagr(s, e, r);
      if (yearsCalculated === null) return { valid: false, error: 'Cannot solve years with zero or negative growth values.' };
      return {
        valid: true,
        solvedType: 'years',
        calculatedYears: yearsCalculated,
        start: s,
        end: e,
        cagrPercent: r * 100,
      };
    }
  }, [solveFor, startVal, endVal, cagrInputVal, effectiveYears, inflationVal]);

  // Series calculation
  const seriesResult: CagrSeriesResult | null = useMemo(() => {
    if (tab !== 'series') return null;
    const parts = seriesInput
      .split(/[,\s]+/)
      .map((p) => parseFloat(p.trim()))
      .filter((n) => !isNaN(n));
    return calculateCagrFromSeries(parts);
  }, [tab, seriesInput]);

  // Doubling calculation
  const doublingResult: DoublingComparison | null = useMemo(() => {
    if (tab !== 'doubling') return null;
    const r = parseFloat(doublingRateVal);
    if (isNaN(r) || r <= 0) return null;
    return calculateDoubling(r / 100);
  }, [tab, doublingRateVal]);

  // Copy helper
  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabsConfig = [
    { id: 'cagr', label: 'CAGR Solver' },
    { id: 'series', label: 'Series Mode' },
    { id: 'doubling', label: 'Doubling Time (Rule of 72)' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabNav}>
        <TabSlider
          tabs={tabsConfig}
          activeId={tab}
          onChange={(newTab) => setTab(newTab as ActiveTab)}
          ariaLabel="CAGR Calculator Mode"
        />
      </div>

      <CagrInputGuide tab={tab} />

      <div className={styles.calculatorCard}>
        {tab === 'cagr' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={solveForId} className={styles.label}>Solve For</label>
                <select
                  id={solveForId}
                  className={styles.select}
                  value={solveFor}
                  onChange={(e) => setSolveFor(e.target.value as SolveFor)}
                >
                  <option value="cagr">CAGR (Compound Growth Rate)</option>
                  <option value="end">Ending Value</option>
                  <option value="start">Starting Value</option>
                  <option value="years">Number of Years</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={currencyId} className={styles.label}>Currency Unit</label>
                <select
                  id={currencyId}
                  className={styles.select}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.label} value={c.symbol}>{c.label}</option>
                  ))}
                </select>
              </div>

              {solveFor !== 'start' && (
                <div className={styles.inputGroup}>
                  <label htmlFor={startId} className={styles.label}>Starting Value</label>
                  <div className={styles.inputWrapper}>
                    {currency && <span className={styles.prefix}>{currency}</span>}
                    <input
                      id={startId}
                      type="number"
                      step="any"
                      min="0.001"
                      className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                      value={startVal}
                      onChange={(e) => setStartVal(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {solveFor !== 'end' && (
                <div className={styles.inputGroup}>
                  <label htmlFor={endId} className={styles.label}>Ending Value</label>
                  <div className={styles.inputWrapper}>
                    {currency && <span className={styles.prefix}>{currency}</span>}
                    <input
                      id={endId}
                      type="number"
                      step="any"
                      min="0"
                      className={`${styles.input} ${currency ? styles.inputWithPrefix : ''}`}
                      value={endVal}
                      onChange={(e) => setEndVal(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {solveFor !== 'cagr' && (
                <div className={styles.inputGroup}>
                  <label htmlFor={cagrRateId} className={styles.label}>CAGR Rate</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={cagrRateId}
                      type="number"
                      step="any"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={cagrInputVal}
                      onChange={(e) => setCagrInputVal(e.target.value)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              )}

              {solveFor !== 'years' && (
                <div className={styles.inputGroup}>
                  <label htmlFor={timeModeId} className={styles.label}>Duration Format</label>
                  <select
                    id={timeModeId}
                    className={styles.select}
                    value={timeMode}
                    onChange={(e) => setTimeMode(e.target.value as TimeMode)}
                  >
                    <option value="years">Direct Years</option>
                    <option value="dates">Calendar Dates (Exact Days)</option>
                  </select>
                </div>
              )}

              {solveFor !== 'years' && timeMode === 'years' && (
                <div className={styles.inputGroup}>
                  <label htmlFor={yearsId} className={styles.label}>Time Period (Years)</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={yearsId}
                      type="number"
                      step="any"
                      min="0.01"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={yearsVal}
                      onChange={(e) => setYearsVal(e.target.value)}
                    />
                    <span className={styles.suffix}>yrs</span>
                  </div>
                </div>
              )}

              {solveFor !== 'years' && timeMode === 'dates' && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor={startDateId} className={styles.label}>Start Date</label>
                    <input
                      id={startDateId}
                      type="date"
                      className={styles.input}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor={endDateId} className={styles.label}>End Date</label>
                    <input
                      id={endDateId}
                      type="date"
                      className={styles.input}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    {effectiveYears && (
                      <span className={styles.helperText}>
                        Duration: {effectiveYears.toFixed(2)} years (actual days / 365.25)
                      </span>
                    )}
                  </div>
                </>
              )}

              {solveFor === 'cagr' && (
                <div className={styles.inputGroup}>
                  <label htmlFor={inflationId} className={styles.label}>Annual Inflation (Optional)</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={inflationId}
                      type="number"
                      step="any"
                      placeholder="e.g. 3.0"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={inflationVal}
                      onChange={(e) => setInflationVal(e.target.value)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              )}
            </div>

            {calculationResult.valid ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>
                    {calculationResult.solvedType === 'cagr' ? 'Compound Annual Growth Rate' :
                     calculationResult.solvedType === 'end' ? 'Projected Ending Value' :
                     calculationResult.solvedType === 'start' ? 'Required Starting Value' : 'Required Duration'}
                  </span>
                  <div className={styles.heroValue}>
                    {calculationResult.solvedType === 'cagr' ? `${calculationResult.cagrPercent!.toFixed(2)}%` :
                     calculationResult.solvedType === 'end' ? `${currency}${calculationResult.calculatedEnd!.toLocaleString('en-US', { maximumFractionDigits: 2 })}` :
                     calculationResult.solvedType === 'start' ? `${currency}${calculationResult.calculatedStart!.toLocaleString('en-US', { maximumFractionDigits: 2 })}` :
                     `${calculationResult.calculatedYears!.toFixed(2)} Years`}
                  </div>
                  <div className={styles.heroSub}>
                    {calculationResult.solvedType === 'cagr' ? (
                      <>
                        <span>Total Growth: {calculationResult.totalGrowthPercent! >= 0 ? '+' : ''}{calculationResult.totalGrowthPercent!.toFixed(2)}%</span>
                        {calculationResult.doublingYears && (
                          <span>· Doubling: ~{calculationResult.doublingYears.toFixed(2)} yrs</span>
                        )}
                      </>
                    ) : (
                      <span>Compound rate: {calculationResult.cagrPercent!.toFixed(2)}% per year</span>
                    )}
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  {calculationResult.solvedType === 'cagr' && (
                    <p>
                      Growing from <strong>{currency}{calculationResult.start!.toLocaleString()}</strong> to{' '}
                      <strong>{currency}{calculationResult.end!.toLocaleString()}</strong> over{' '}
                      <strong>{calculationResult.years!.toFixed(2)} years</strong> is an annualized compound rate of{' '}
                      <strong>{calculationResult.cagrPercent!.toFixed(2)}%</strong>.
                      {calculationResult.realCagrPercent != null && (
                        <span> After accounting for inflation, the real purchasing-power growth rate is <strong>{calculationResult.realCagrPercent.toFixed(2)}%</strong>.</span>
                      )}
                    </p>
                  )}
                  {calculationResult.solvedType === 'end' && (
                    <p>
                      Starting with <strong>{currency}{calculationResult.start!.toLocaleString()}</strong> compounding at{' '}
                      <strong>{calculationResult.cagrPercent!.toFixed(2)}%</strong> for <strong>{calculationResult.years!.toFixed(2)} years</strong> yields an ending value of{' '}
                      <strong>{currency}{calculationResult.calculatedEnd!.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>.
                    </p>
                  )}
                  {calculationResult.solvedType === 'start' && (
                    <p>
                      To reach <strong>{currency}{calculationResult.end!.toLocaleString()}</strong> in <strong>{calculationResult.years!.toFixed(2)} years</strong> at{' '}
                      <strong>{calculationResult.cagrPercent!.toFixed(2)}%</strong> annual growth, you need an initial capital of{' '}
                      <strong>{currency}{calculationResult.calculatedStart!.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>.
                    </p>
                  )}
                  {calculationResult.solvedType === 'years' && (
                    <p>
                      Growing from <strong>{currency}{calculationResult.start!.toLocaleString()}</strong> to{' '}
                      <strong>{currency}{calculationResult.end!.toLocaleString()}</strong> at{' '}
                      <strong>{calculationResult.cagrPercent!.toFixed(2)}%</strong> CAGR takes{' '}
                      <strong>{calculationResult.calculatedYears!.toFixed(2)} years</strong>.
                    </p>
                  )}
                </div>

                {/* Filled Excel & Sheets Formulas */}
                {calculationResult.solvedType === 'cagr' && (
                  <div className={styles.excelCard}>
                    <div className={styles.excelHeader}>
                      <span className={styles.excelTitle}>Live Excel &amp; Google Sheets Formulas (Filled with Your Numbers)</span>
                    </div>
                    <div className={styles.formulaGrid}>
                      <div className={styles.formulaRow}>
                        <span className={styles.formulaLabel}>Power Formula:</span>
                        <code className={styles.formulaCode}>
                          {`=(${calculationResult.end}/${calculationResult.start})^(1/${calculationResult.years!.toFixed(2)})-1`}
                        </code>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => handleCopy('power', `=(${calculationResult.end}/${calculationResult.start})^(1/${calculationResult.years!.toFixed(2)})-1`)}
                        >
                          {copiedKey === 'power' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className={styles.formulaRow}>
                        <span className={styles.formulaLabel}>Excel RRI:</span>
                        <code className={styles.formulaCode}>
                          {`=RRI(${calculationResult.years!.toFixed(2)}, ${calculationResult.start}, ${calculationResult.end})`}
                        </code>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => handleCopy('rri', `=RRI(${calculationResult.years!.toFixed(2)}, ${calculationResult.start}, ${calculationResult.end})`)}
                        >
                          {copiedKey === 'rri' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className={styles.formulaRow}>
                        <span className={styles.formulaLabel}>Excel RATE:</span>
                        <code className={styles.formulaCode}>
                          {`=RATE(${calculationResult.years!.toFixed(2)}, 0, -${calculationResult.start}, ${calculationResult.end})`}
                        </code>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => handleCopy('rate', `=RATE(${calculationResult.years!.toFixed(2)}, 0, -${calculationResult.start}, ${calculationResult.end})`)}
                        >
                          {copiedKey === 'rate' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.errorBanner}>{calculationResult.error}</div>
            )}
          </>
        )}

        {tab === 'series' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor={seriesInputId} className={styles.label}>
                  Historical Values Series (Comma or Space Separated)
                </label>
                <textarea
                  id={seriesInputId}
                  className={styles.textarea}
                  value={seriesInput}
                  onChange={(e) => setSeriesInput(e.target.value)}
                  placeholder="e.g. 100, 50, 65, 78"
                />
                <span className={styles.helperText}>
                  Enter consecutive portfolio/revenue checkpoints over equal time periods (e.g. yearly closes).
                </span>
              </div>
            </div>

            {seriesResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Historical Growth Analysis</span>
                  <div className={styles.heroValue}>
                    {(seriesResult.cagr * 100).toFixed(2)}% CAGR
                  </div>
                  <div className={styles.heroSub}>
                    <span>Arithmetic Average: {(seriesResult.arithmeticAverage * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    Over this series, your asset ended at <strong>{seriesResult.yearlyChanges.length > 0 ? (seriesResult.finalVsStartRatio * 100).toFixed(1) : 0}%</strong> of its starting value.
                    Notice that the simple arithmetic average is <strong>{(seriesResult.arithmeticAverage * 100).toFixed(2)}%</strong>, but the true compound return (CAGR) is <strong>{(seriesResult.cagr * 100).toFixed(2)}%</strong>. Arithmetic averages ignore the compounding impact of previous drawdowns.
                  </p>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Period Transition</th>
                        <th>Periodic Return</th>
                        <th>Multiplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesResult.yearlyChanges.map((change, idx) => (
                        <tr key={idx}>
                          <td>Period {idx + 1} → Period {idx + 2}</td>
                          <td style={{ color: change >= 0 ? '#0D9488' : '#DC2626', fontWeight: 600 }}>
                            {change >= 0 ? '+' : ''}{(change * 100).toFixed(2)}%
                          </td>
                          <td>{(1 + change).toFixed(4)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Please enter at least two positive numbers in the series.
              </div>
            )}
          </>
        )}

        {tab === 'doubling' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={doublingRateId} className={styles.label}>Annual Growth Rate</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={doublingRateId}
                    type="number"
                    step="any"
                    min="0.01"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={doublingRateVal}
                    onChange={(e) => setDoublingRateVal(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>

            {doublingResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Exact Doubling Time</span>
                  <div className={styles.heroValue}>
                    {doublingResult.exactYears.toFixed(2)} Years
                  </div>
                  <div className={styles.heroSub}>
                    <span>Rule of 72 Approximation: {doublingResult.rule72Years.toFixed(2)} yrs</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    At an annual growth rate of <strong>{doublingRateVal}%</strong>, an investment doubles in value every{' '}
                    <strong>{doublingResult.exactYears.toFixed(2)} years</strong>. The classic mental-math Rule of 72 yields{' '}
                    <strong>{doublingResult.rule72Years.toFixed(2)} years</strong>, an error of{' '}
                    <strong>{doublingResult.rule72Error >= 0 ? '+' : ''}{doublingResult.rule72Error.toFixed(2)} years</strong>.
                  </p>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Rule / Formula</th>
                        <th>Equation</th>
                        <th>Doubling Time</th>
                        <th>Estimation Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Exact Mathematical</strong></td>
                        <td><code>ln(2) ÷ ln(1 + r)</code></td>
                        <td><strong>{doublingResult.exactYears.toFixed(2)} yrs</strong></td>
                        <td>0.00 yrs (Exact)</td>
                      </tr>
                      <tr>
                        <td><strong>Rule of 72</strong></td>
                        <td><code>72 ÷ Rate(%)</code></td>
                        <td>{doublingResult.rule72Years.toFixed(2)} yrs</td>
                        <td>{doublingResult.rule72Error >= 0 ? '+' : ''}{doublingResult.rule72Error.toFixed(2)} yrs</td>
                      </tr>
                      <tr>
                        <td><strong>Rule of 70</strong></td>
                        <td><code>70 ÷ Rate(%)</code></td>
                        <td>{doublingResult.rule70Years.toFixed(2)} yrs</td>
                        <td>{doublingResult.rule70Error >= 0 ? '+' : ''}{doublingResult.rule70Error.toFixed(2)} yrs</td>
                      </tr>
                      <tr>
                        <td><strong>Rule of 69.3</strong></td>
                        <td><code>69.3 ÷ Rate(%)</code></td>
                        <td>{doublingResult.rule69Years.toFixed(2)} yrs</td>
                        <td>{doublingResult.rule69Error >= 0 ? '+' : ''}{doublingResult.rule69Error.toFixed(2)} yrs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Please enter a positive growth rate percentage.
              </div>
            )}
          </>
        )}

        <div className={styles.actionsBar}>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={() => handleCopy('url', typeof window !== 'undefined' ? window.location.href : '')}
          >
            {copiedKey === 'url' ? 'Link Copied!' : 'Copy Tool Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
