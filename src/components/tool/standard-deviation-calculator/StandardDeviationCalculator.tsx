'use client';

import React, { useState, useId, useMemo } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import StdevInputGuide from './StdevInputGuide';
import { parseNumbers, getSummaryStats, SummaryStats } from '@/lib/stats-engine';
import styles from './StandardDeviationCalculator.module.css';

type ActiveTab = 'raw' | 'frequency' | 'grouped';
type DatasetType = 'sample' | 'population';

const EXAMPLE_DATASETS = [
  { label: 'Spec Example (2,4,4,4,5,5,7,9)', data: '2, 4, 4, 4, 5, 5, 7, 9' },
  { label: 'Even Spread (10 to 50)', data: '10, 20, 30, 40, 50' },
  { label: 'High Variance (1, 10, 100)', data: '1, 10, 100, 1000' },
  { label: 'Uniform Data', data: '7, 7, 7, 7, 7' },
];

export default function StandardDeviationCalculator() {
  const [tab, setTab] = useState<ActiveTab>('raw');
  const [datasetType, setDatasetType] = useState<DatasetType>('sample');
  const [decimals, setDecimals] = useState<number>(3);

  // Raw data input
  const [rawDataInput, setRawDataInput] = useState<string>('2, 4, 4, 4, 5, 5, 7, 9');

  // Frequency table input
  const [freqInput, setFreqInput] = useState<string>('2:1, 4:3, 5:2, 7:1, 9:1');

  // Grouped data input
  const [groupedInput, setGroupedInput] = useState<string>('0-10: 2\n10-20: 5\n20-30: 8\n30-40: 3');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Accessible IDs
  const rawDataId = useId();
  const freqDataId = useId();
  const groupedDataId = useId();
  const datasetTypeId = useId();
  const decimalsId = useId();

  // Parse raw data numbers
  const effectiveNumbers = useMemo(() => {
    if (tab === 'raw') {
      const parsed = parseNumbers(rawDataInput);
      return parsed.numbers;
    } else if (tab === 'frequency') {
      const numbers: number[] = [];
      const pairs = freqInput.split(/[\n,;]+/);
      for (const pair of pairs) {
        const parts = pair.split(/[:\s]+/);
        if (parts.length >= 2) {
          const val = parseFloat(parts[0].trim());
          const count = parseInt(parts[1].trim(), 10);
          if (!isNaN(val) && !isNaN(count) && count > 0) {
            for (let i = 0; i < count; i++) {
              numbers.push(val);
            }
          }
        }
      }
      return numbers;
    } else {
      const numbers: number[] = [];
      const lines = groupedInput.split('\n');
      for (const line of lines) {
        const parts = line.split(/[:\s]+/);
        if (parts.length >= 2) {
          const range = parts[0].split('-');
          const count = parseInt(parts[1].trim(), 10);
          if (range.length === 2 && !isNaN(count) && count > 0) {
            const low = parseFloat(range[0].trim());
            const high = parseFloat(range[1].trim());
            if (!isNaN(low) && !isNaN(high)) {
              const midpoint = (low + high) / 2;
              for (let i = 0; i < count; i++) {
                numbers.push(midpoint);
              }
            }
          }
        }
      }
      return numbers;
    }
  }, [tab, rawDataInput, freqInput, groupedInput]);

  // Compute full summary statistics
  const stats: SummaryStats | null = useMemo(() => {
    if (effectiveNumbers.length === 0) return null;
    return getSummaryStats(effectiveNumbers, 'tukey_exclusive');
  }, [effectiveNumbers]);

  // Step-by-step deviations calculation
  const stepsData = useMemo(() => {
    if (!stats) return [];
    return effectiveNumbers.map((val) => {
      const diff = val - stats.mean;
      const sqDiff = diff * diff;
      const effectiveSd = datasetType === 'sample' ? stats.sampleSD : stats.populationSD;
      const z = effectiveSd > 0 ? diff / effectiveSd : 0;
      return {
        val,
        diff,
        sqDiff,
        z,
      };
    });
  }, [effectiveNumbers, stats, datasetType]);

  const sumSqDiff = useMemo(() => {
    if (!stepsData || stepsData.length === 0) return 0;
    return stepsData.reduce((acc, row) => acc + row.sqDiff, 0);
  }, [stepsData]);

  const coefficientOfVariation = useMemo(() => {
    if (!stats || stats.mean === 0) return null;
    const sd = datasetType === 'sample' ? stats.sampleSD : stats.populationSD;
    return (sd / Math.abs(stats.mean)) * 100;
  }, [stats, datasetType]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabsConfig = [
    { id: 'raw', label: 'Raw Data List' },
    { id: 'frequency', label: 'Frequency Table' },
    { id: 'grouped', label: 'Grouped Classes' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabNav}>
        <TabSlider
          tabs={tabsConfig}
          activeId={tab}
          onChange={(newTab) => setTab(newTab as ActiveTab)}
          ariaLabel="Standard Deviation Mode"
        />
      </div>

      <StdevInputGuide tab={tab} />

      <div className={styles.calculatorCard}>
        <div className={styles.inputsGrid} style={{ marginBottom: 18 }}>
          <div className={styles.inputGroup}>
            <label htmlFor={datasetTypeId} className={styles.label}>Statistical Scope</label>
            <select
              id={datasetTypeId}
              className={styles.select}
              value={datasetType}
              onChange={(e) => setDatasetType(e.target.value as DatasetType)}
            >
              <option value="sample">Sample Standard Deviation (s, Divisor: n − 1)</option>
              <option value="population">Population Standard Deviation (σ, Divisor: n)</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor={decimalsId} className={styles.label}>Display Precision</label>
            <select
              id={decimalsId}
              className={styles.select}
              value={decimals}
              onChange={(e) => setDecimals(parseInt(e.target.value, 10))}
            >
              <option value={2}>2 Decimals (0.01)</option>
              <option value={3}>3 Decimals (0.001, Standard)</option>
              <option value={4}>4 Decimals (0.0001)</option>
              <option value={6}>6 Decimals (High Precision)</option>
            </select>
          </div>
        </div>

        {tab === 'raw' && (
          <div className={styles.inputGroup} style={{ marginBottom: 24 }}>
            <label htmlFor={rawDataId} className={styles.label}>
              Enter Raw Numbers (Separated by Commas, Spaces, or Lines)
            </label>
            <textarea
              id={rawDataId}
              className={styles.textarea}
              value={rawDataInput}
              onChange={(e) => setRawDataInput(e.target.value)}
              placeholder="e.g. 2, 4, 4, 4, 5, 5, 7, 9"
            />
            <div className={styles.quickPills}>
              <span className={styles.helperText}>Presets:</span>
              {EXAMPLE_DATASETS.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  className={styles.pillBtn}
                  onClick={() => setRawDataInput(ex.data)}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'frequency' && (
          <div className={styles.inputGroup} style={{ marginBottom: 24 }}>
            <label htmlFor={freqDataId} className={styles.label}>
              Enter Value and Frequency Pairs (Value:Count or Value,Count)
            </label>
            <textarea
              id={freqDataId}
              className={styles.textarea}
              value={freqInput}
              onChange={(e) => setFreqInput(e.target.value)}
              placeholder="e.g. 2:1, 4:3, 5:2, 7:1, 9:1"
            />
            <span className={styles.helperText}>
              Example: <code>4:3</code> means the value 4 appears 3 times.
            </span>
          </div>
        )}

        {tab === 'grouped' && (
          <div className={styles.inputGroup} style={{ marginBottom: 24 }}>
            <label htmlFor={groupedDataId} className={styles.label}>
              Enter Class Bins and Frequencies (From-To: Count)
            </label>
            <textarea
              id={groupedDataId}
              className={styles.textarea}
              value={groupedInput}
              onChange={(e) => setGroupedInput(e.target.value)}
              placeholder="0-10: 2&#10;10-20: 5&#10;20-30: 8&#10;30-40: 3"
            />
            <span className={styles.helperText}>
              Uses class midpoints (e.g. 10–20 midpoint = 15) to compute estimated standard deviation.
            </span>
          </div>
        )}

        {stats ? (
          <>
            <div className={styles.heroResult}>
              <span className={styles.heroLabel}>
                {datasetType === 'sample' ? 'Sample Standard Deviation (s)' : 'Population Standard Deviation (σ)'}
              </span>
              <div className={styles.heroValue}>
                {datasetType === 'sample'
                  ? stats.count > 1 ? stats.sampleSD.toFixed(decimals) : 'N/A (n < 2)'
                  : stats.populationSD.toFixed(decimals)}
              </div>
              <div className={styles.heroSub}>
                <span>Mean (x̄): {stats.mean.toFixed(decimals)}</span>
                <span>·</span>
                <span>
                  Variance ({datasetType === 'sample' ? 's²' : 'σ²'}):{' '}
                  {(datasetType === 'sample' ? stats.sampleVariance : stats.populationVariance).toFixed(decimals)}
                </span>
                <span>·</span>
                <span>SE: {stats.standardError.toFixed(decimals)}</span>
              </div>
            </div>

            <div className={styles.heroSummary}>
              <p>
                Your <strong>{stats.count} values</strong> have a mean of <strong>{stats.mean.toFixed(decimals)}</strong> with a{' '}
                <strong>{datasetType === 'sample' ? 'sample' : 'population'} standard deviation of{' '}
                {(datasetType === 'sample' ? stats.sampleSD : stats.populationSD).toFixed(decimals)}</strong>.
                {datasetType === 'sample' && stats.count > 1 && (
                  <span> (If treated as an entire population, σ = {stats.populationSD.toFixed(decimals)}).</span>
                )}
                {datasetType === 'population' && stats.count > 1 && (
                  <span> (If treated as a representative sample, s = {stats.sampleSD.toFixed(decimals)}).</span>
                )}
              </p>
            </div>

            {/* Complete Descriptive Statistics Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Sample Size (n)</span>
                <span className={styles.statVal}>{stats.count}</span>
                <span className={styles.statSub}>Total observed values</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Sum (Σx)</span>
                <span className={styles.statVal}>{stats.sum.toFixed(decimals)}</span>
                <span className={styles.statSub}>Total point aggregate</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Mean (Average)</span>
                <span className={styles.statVal}>{stats.mean.toFixed(decimals)}</span>
                <span className={styles.statSub}>x̄ = Σx ÷ n</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Median</span>
                <span className={styles.statVal}>{stats.median.toFixed(decimals)}</span>
                <span className={styles.statSub}>Middle 50th percentile</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Mode(s)</span>
                <span className={styles.statVal}>
                  {stats.modes.length > 0 ? stats.modes.join(', ') : 'None'}
                </span>
                <span className={styles.statSub}>Most frequent value</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Sum of Squares (SS)</span>
                <span className={styles.statVal}>{sumSqDiff.toFixed(decimals)}</span>
                <span className={styles.statSub}>Σ(x − x̄)²</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Sample Variance (s²)</span>
                <span className={styles.statVal}>
                  {stats.count > 1 ? stats.sampleVariance.toFixed(decimals) : 'N/A'}
                </span>
                <span className={styles.statSub}>SS ÷ (n − 1)</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Population Variance (σ²)</span>
                <span className={styles.statVal}>{stats.populationVariance.toFixed(decimals)}</span>
                <span className={styles.statSub}>SS ÷ n</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Standard Error (SE)</span>
                <span className={styles.statVal}>{stats.standardError.toFixed(decimals)}</span>
                <span className={styles.statSub}>s ÷ √n</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Coefficient of Variation</span>
                <span className={styles.statVal}>
                  {coefficientOfVariation !== null ? `${coefficientOfVariation.toFixed(2)}%` : 'N/A'}
                </span>
                <span className={styles.statSub}>(SD ÷ Mean) × 100</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Data Range</span>
                <span className={styles.statVal}>{stats.range.toFixed(decimals)}</span>
                <span className={styles.statSub}>Min: {stats.min} · Max: {stats.max}</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Interquartile Range (IQR)</span>
                <span className={styles.statVal}>{stats.quartiles.iqr.toFixed(decimals)}</span>
                <span className={styles.statSub}>Q1: {stats.quartiles.q1} · Q3: {stats.quartiles.q3}</span>
              </div>
            </div>

            {/* Step-by-Step Deviations Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data Point (x_i)</th>
                    <th>Mean (x̄)</th>
                    <th>Deviation (x_i − x̄)</th>
                    <th>Squared Deviation (x_i − x̄)²</th>
                    <th>z-Score</th>
                  </tr>
                </thead>
                <tbody>
                  {stepsData.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.val}</strong></td>
                      <td>{stats.mean.toFixed(decimals)}</td>
                      <td>{row.diff >= 0 ? '+' : ''}{row.diff.toFixed(decimals)}</td>
                      <td>{row.sqDiff.toFixed(decimals)}</td>
                      <td>{row.z.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                    <td><strong>Total (n = {stats.count})</strong></td>
                    <td>—</td>
                    <td>Σ = 0.000</td>
                    <td><strong>SS = {sumSqDiff.toFixed(decimals)}</strong></td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className={styles.errorBanner}>
            Enter at least two valid numbers to compute standard deviation and variance.
          </div>
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
