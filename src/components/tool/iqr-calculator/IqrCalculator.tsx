'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import IqrInputGuide from './IqrInputGuide';
import styles from './IqrCalculator.module.css';
import {
  parseNumbers,
  getSummaryStats,
  compareAllQuartileMethods,
  QuartileMethod,
} from '@/lib/stats-engine';

type TabType = 'iqr' | 'compare';

const TABS: TabItem<TabType>[] = [
  { id: 'iqr', label: '1. IQR & Box Plot' },
  { id: 'compare', label: '2. Compare Quartile Methods' },
];

interface PresetItem {
  name: string;
  data: string;
}

const PRESETS: PresetItem[] = [
  { name: 'Spec Example 1 (1..15)', data: '1, 3, 5, 7, 9, 11, 13, 15' },
  { name: 'Spec Example 2 (5, 7, 8, 9)', data: '5, 7, 8, 9' },
  { name: 'With Outlier (mild & extreme)', data: '10, 12, 14, 15, 16, 18, 19, 20, 22, 58' },
];

export default function IqrCalculator() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('iqr');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync tab from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab') as TabType;
        if (urlTab && TABS.some((t) => t.id === urlTab)) {
          setTab(urlTab);
        }
      };
      const timer = setTimeout(syncFromUrl, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // State
  const [rawText, setRawText] = useState<string>('1, 3, 5, 7, 9, 11, 13, 15');
  const [method, setMethod] = useState<QuartileMethod>('tukey_exclusive');

  // Parse numbers
  const parseResult = useMemo(() => {
    return parseNumbers(rawText);
  }, [rawText]);

  const summary = useMemo(() => {
    if (parseResult.numbers.length < 2) return null;
    return getSummaryStats(parseResult.numbers, method);
  }, [parseResult.numbers, method]);

  const sortedNumbers = useMemo(() => {
    return [...parseResult.numbers].sort((a, b) => a - b);
  }, [parseResult.numbers]);

  const methodComparison = useMemo(() => {
    if (sortedNumbers.length < 2) return [];
    return compareAllQuartileMethods(sortedNumbers);
  }, [sortedNumbers]);

  const methodName = useMemo(() => {
    switch (method) {
      case 'tukey_exclusive':
        return 'Tukey (Median Excluded)';
      case 'inclusive':
        return 'Inclusive (Excel QUARTILE.INC)';
      case 'exclusive':
        return 'Exclusive (Excel QUARTILE.EXC)';
      case 'tukey_inclusive':
        return 'Tukey (Median Included)';
    }
  }, [method]);

  // Copy handler
  const handleCopyText = () => {
    if (!summary) return;
    const text = `Five-Number Summary (${methodName}):
Count (n): ${summary.count}
Sum: ${summary.sum}
Mean: ${summary.mean.toFixed(2)}
Min: ${summary.min}
Q1 (25%): ${summary.quartiles.q1}
Median (50%): ${summary.median}
Q3 (75%): ${summary.quartiles.q3}
Max: ${summary.max}
Range: ${summary.range}
IQR: ${summary.quartiles.iqr}
Fences (1.5x IQR): [${summary.quartiles.lowerInnerFence.toFixed(2)}, ${summary.quartiles.upperInnerFence.toFixed(2)}]
Outliers: ${summary.quartiles.allOutliers.length > 0 ? summary.quartiles.allOutliers.join(', ') : 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCsv = () => {
    if (!summary) return;
    const csv = `Metric,Value
Count,${summary.count}
Sum,${summary.sum}
Mean,${summary.mean.toFixed(4)}
Min,${summary.min}
Q1,${summary.quartiles.q1}
Median,${summary.median}
Q3,${summary.quartiles.q3}
Max,${summary.max}
Range,${summary.range}
IQR,${summary.quartiles.iqr}
LowerFence,${summary.quartiles.lowerInnerFence}
UpperFence,${summary.quartiles.upperInnerFence}
Outliers,"${summary.quartiles.allOutliers.join(';')}"`;

    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="IQR calculator view tabs" />

      {/* Input Guide Diagram */}
      <IqrInputGuide
        tab={tab}
        q1={summary?.quartiles.q1 ?? 4}
        medianVal={summary?.median ?? 8}
        q3={summary?.quartiles.q3 ?? 12}
        iqr={summary?.quartiles.iqr ?? 8}
        methodName={methodName}
        focusedField={focusedField}
      />

      {/* Main Data Input */}
      <div className={`${styles.field} ${styles.inputCard}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor={`${id}-dataset`} className={styles.label}>
            <span className={styles.badge}>1</span> Enter or Paste Data Set
          </label>
          <div className={styles.presetBar}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-soft)' }}>Examples:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.presetBtn}
                onClick={() => setRawText(p.data)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <textarea
          id={`${id}-dataset`}
          className={styles.textarea}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          onFocus={() => setFocusedField('data')}
          onBlur={() => setFocusedField(null)}
          placeholder="e.g. 1, 3, 5, 7, 9, 11, 13, 15 or paste from spreadsheet columns"
        />

        <div className={styles.controlsRow}>
          <div className={styles.controlGroup}>
            <label htmlFor={`${id}-method`} className={styles.controlLabel}>
              Quartile Calculation Method:
            </label>
            <select
              id={`${id}-method`}
              className={styles.select}
              value={method}
              onChange={(e) => setMethod(e.target.value as QuartileMethod)}
              onFocus={() => setFocusedField('method')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="tukey_exclusive">Tukey (TI-84 / US Textbooks - Exclude Median)</option>
              <option value="inclusive">Excel QUARTILE.INC / Google Sheets / R Type 7</option>
              <option value="exclusive">Excel QUARTILE.EXC / R Type 6</option>
              <option value="tukey_inclusive">Tukey (Alternative Textbooks - Include Median)</option>
            </select>
          </div>

          <span className={styles.inputHint} style={{ alignSelf: 'flex-end', paddingBottom: '8px' }}>
            {parseResult.numbers.length} numbers parsed
            {parseResult.rejectedTokens.length > 0 && ` (${parseResult.rejectedTokens.length} non-numeric tokens ignored)`}
          </span>
        </div>
      </div>

      {/* TAB 1: IQR & BOX PLOT */}
      {tab === 'iqr' && summary && (
        <div className={styles.resultsBand}>
          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Interquartile Range (IQR)</div>
            <div className={styles.heroValue}>{summary.quartiles.iqr}</div>
            <div className={styles.heroSub}>
              Q1 = {summary.quartiles.q1} &bull; Median = {summary.median} &bull; Q3 = {summary.quartiles.q3}
            </div>
          </div>

          <div className={styles.sentence}>
            The middle 50% of your data spans <strong>{summary.quartiles.iqr}</strong> (Q1 ={' '}
            <strong>{summary.quartiles.q1}</strong>, Q3 = <strong>{summary.quartiles.q3}</strong>).{' '}
            {summary.quartiles.allOutliers.length > 0 ? (
              <span>
                Identified <strong>{summary.quartiles.allOutliers.length} outlier(s)</strong> outside the 1.5 × IQR fences of{' '}
                [{summary.quartiles.lowerInnerFence.toFixed(2)}, {summary.quartiles.upperInnerFence.toFixed(2)}]:{' '}
                <strong>{summary.quartiles.allOutliers.join(', ')}</strong>.
              </span>
            ) : (
              <span>
                No values fall outside the 1.5 × IQR outlier fences of [
                {summary.quartiles.lowerInnerFence.toFixed(2)}, {summary.quartiles.upperInnerFence.toFixed(2)}].
              </span>
            )}
          </div>

          {/* Complete 5-number summary grid + Mean & Range */}
          <div className={styles.summaryGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Count (n)</span>
              <span className={styles.statValue}>{summary.count}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Mean (Average)</span>
              <span className={styles.statValue}>{summary.mean.toFixed(2)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Minimum</span>
              <span className={styles.statValue}>{summary.min}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Q1 (25%)</span>
              <span className={styles.statValue}>{summary.quartiles.q1}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Median (50%)</span>
              <span className={styles.statValue}>{summary.median}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Q3 (75%)</span>
              <span className={styles.statValue}>{summary.quartiles.q3}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Maximum</span>
              <span className={styles.statValue}>{summary.max}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Range</span>
              <span className={styles.statValue}>{summary.range}</span>
            </div>
          </div>

          {/* Theme-Aware SVG Box Plot */}
          <div className={styles.boxPlotContainer}>
            <div className={styles.boxPlotTitle}>Five-Number Summary Box Plot (with 1.5 × IQR Fences)</div>
            {(() => {
              const minVal = Math.min(summary.min, summary.quartiles.lowerInnerFence);
              const maxVal = Math.max(summary.max, summary.quartiles.upperInnerFence);
              const valSpan = maxVal - minVal || 1;
              const plotWidth = 600;
              const scale = (val: number) => 50 + ((val - minVal) / valSpan) * plotWidth;

              const xMin = scale(summary.quartiles.whiskerLower);
              const xQ1 = scale(summary.quartiles.q1);
              const xMed = scale(summary.median);
              const xQ3 = scale(summary.quartiles.q3);
              const xMax = scale(summary.quartiles.whiskerUpper);
              const xLoFence = scale(summary.quartiles.lowerInnerFence);
              const xHiFence = scale(summary.quartiles.upperInnerFence);

              return (
                <svg viewBox="0 0 700 130" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Axis */}
                  <line x1="50" y1="95" x2="650" y2="95" stroke="var(--line)" strokeWidth="2" />

                  {/* Fences */}
                  <line x1={xLoFence} y1="35" x2={xLoFence} y2="85" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1={xHiFence} y1="35" x2={xHiFence} y2="85" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Whiskers */}
                  <line x1={xMin} y1="60" x2={xQ1} y2="60" stroke="var(--ink)" strokeWidth="2" />
                  <line x1={xMin} y1="48" x2={xMin} y2="72" stroke="var(--ink)" strokeWidth="2" />
                  <line x1={xQ3} y1="60" x2={xMax} y2="60" stroke="var(--ink)" strokeWidth="2" />
                  <line x1={xMax} y1="48" x2={xMax} y2="72" stroke="var(--ink)" strokeWidth="2" />

                  {/* Box */}
                  <rect
                    x={xQ1}
                    y="35"
                    width={Math.max(2, xQ3 - xQ1)}
                    height="50"
                    rx="4"
                    fill="rgba(79, 70, 229, 0.16)"
                    stroke="#4F46E5"
                    strokeWidth="2"
                  />

                  {/* Median Line */}
                  <line x1={xMed} y1="35" x2={xMed} y2="85" stroke="#0D9488" strokeWidth="3" />

                  {/* Outliers */}
                  {summary.quartiles.allOutliers.map((out, i) => (
                    <circle key={i} cx={scale(out)} cy="60" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                  ))}

                  {/* Labels */}
                  <text x={xQ1} y="25" textAnchor="middle" fill="#4F46E5" fontSize="11" fontWeight="bold">
                    Q1: {summary.quartiles.q1}
                  </text>
                  <text x={xMed} y="18" textAnchor="middle" fill="#0D9488" fontSize="11" fontWeight="bold">
                    Med: {summary.median}
                  </text>
                  <text x={xQ3} y="25" textAnchor="middle" fill="#4F46E5" fontSize="11" fontWeight="bold">
                    Q3: {summary.quartiles.q3}
                  </text>
                  <text x={xMin} y="115" textAnchor="middle" fill="var(--ink-soft)" fontSize="10">
                    Min: {summary.quartiles.whiskerLower}
                  </text>
                  <text x={xMax} y="115" textAnchor="middle" fill="var(--ink-soft)" fontSize="10">
                    Max: {summary.quartiles.whiskerUpper}
                  </text>
                </svg>
              );
            })()}
          </div>

          {/* Steps Breakdown */}
          <div className={styles.stepsBox}>
            <div className={styles.stepsTitle}>Step-by-Step Calculation ({methodName})</div>
            <ol className={styles.stepList}>
              <li>
                <strong>Sort data in ascending order:</strong> {sortedNumbers.join(', ')}
              </li>
              <li>
                <strong>Find median (Q2):</strong> For n = {summary.count},{' '}
                {summary.count % 2 === 0
                  ? `the average of the middle two values (${sortedNumbers[summary.count / 2 - 1]} and ${sortedNumbers[summary.count / 2]}) gives ${summary.median}.`
                  : `the exact center value at index ${Math.floor(summary.count / 2) + 1} gives ${summary.median}.`}
              </li>
              <li>
                <strong>Calculate Q1 and Q3:</strong> Using {methodName}, Q1 is {summary.quartiles.q1} and Q3 is {summary.quartiles.q3}.
              </li>
              <li>
                <strong>Compute Interquartile Range (IQR):</strong> IQR = Q3 − Q1 = {summary.quartiles.q3} − {summary.quartiles.q1} = <strong>{summary.quartiles.iqr}</strong>.
              </li>
              <li>
                <strong>Calculate Outlier Fences (1.5 × IQR):</strong><br />
                Lower Fence = Q1 − (1.5 × {summary.quartiles.iqr}) = {summary.quartiles.lowerInnerFence.toFixed(2)}<br />
                Upper Fence = Q3 + (1.5 × {summary.quartiles.iqr}) = {summary.quartiles.upperInnerFence.toFixed(2)}
              </li>
            </ol>
          </div>

          <div className={styles.actionsBar}>
            <button type="button" className={styles.copyBtn} onClick={handleCopyText}>
              {copied ? '✓ Copied' : 'Copy Summary'}
            </button>
            <button type="button" className={styles.copyBtn} onClick={handleCopyCsv}>
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COMPARE QUARTILE METHODS */}
      {tab === 'compare' && methodComparison.length > 0 && (
        <div className={styles.resultsBand}>
          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Quartile Method Comparison</div>
            <div className={styles.heroValue}>4 Methods Compared</div>
            <div className={styles.heroSub}>Dataset: {sortedNumbers.length} values &bull; Median = {summary?.median}</div>
          </div>

          <div className={styles.sentence}>
            Different statistical packages and textbooks define quartiles slightly differently. Below is the side-by-side comparison of your dataset across all four quartile algorithms:
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Method Name</th>
                  <th>Software / Textbook Standard</th>
                  <th>Q1</th>
                  <th>Q3</th>
                  <th>IQR</th>
                  <th>Mathematical Rule</th>
                </tr>
              </thead>
              <tbody>
                {methodComparison.map((row) => (
                  <tr
                    key={row.methodId}
                    style={{
                      background: method === row.methodId ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                      fontWeight: method === row.methodId ? 700 : 400,
                    }}
                  >
                    <td>
                      {row.name} {method === row.methodId && '★ (Active)'}
                    </td>
                    <td>{row.softwareLabel}</td>
                    <td><strong>{row.q1}</strong></td>
                    <td><strong>{row.q3}</strong></td>
                    <td><strong style={{ color: 'var(--cat-math-deep)' }}>{row.iqr}</strong></td>
                    <td style={{ fontSize: '0.84rem' }}>{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.stepsBox} style={{ marginTop: '20px' }}>
            <div className={styles.stepsTitle}>Why Do These Results Differ?</div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
              When dividing a discrete set of numbers into four equal parts, there is no single universally agreed-upon mathematical standard for fractional ranks.
              Textbooks (Tukey method) divide the sorted dataset into two distinct halves and find the median of each half.
              Software like Microsoft Excel (<code>QUARTILE.INC</code> and <code>QUARTILE.EXC</code>) and R use continuous linear interpolation between points.
              All four methods converge to the exact same value as your sample size grows large.
            </p>
          </div>

          <div className={styles.actionsBar}>
            <button type="button" className={styles.copyBtn} onClick={handleCopyText}>
              {copied ? '✓ Copied' : 'Copy Summary'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
