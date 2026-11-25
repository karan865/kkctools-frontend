'use client';

import React, { useState, useMemo, useId } from 'react';
import styles from './TTestCalculator.module.css';
import TabSlider from '@/components/tool/shared/TabSlider';
import TTestInputGuide from './TTestInputGuide';
import {
  calculateTwoSampleTTest,
  calculatePairedTTest,
  calculateOneSampleTTest,
  type TailType,
  type TTestResult,
} from '@/lib/t-test-engine';
import { parseNumbers, getSummaryStats } from '@/lib/stats-engine';

type ActiveTab = 'two_sample' | 'paired' | 'one_sample';
type InputMode = 'summary' | 'raw';

export default function TTestCalculator() {
  const [tab, setTab] = useState<ActiveTab>('two_sample');
  const [inputMode, setInputMode] = useState<InputMode>('summary');

  // Common Settings
  const [alpha, setAlpha] = useState<number>(0.05);
  const [tails, setTails] = useState<TailType>('two');
  const [delta, setDelta] = useState<number>(0);
  const [isWelch, setIsWelch] = useState<boolean>(true);

  // Two-sample summary inputs (Spec defaults: Group 1: 30, 75, 10; Group 2: 30, 70, 12)
  const [n1, setN1] = useState<string>('30');
  const [mean1, setMean1] = useState<string>('75');
  const [sd1, setSd1] = useState<string>('10');
  const [n2, setN2] = useState<string>('30');
  const [mean2, setMean2] = useState<string>('70');
  const [sd2, setSd2] = useState<string>('12');

  // Two-sample raw inputs
  const [raw1, setRaw1] = useState<string>('72, 78, 69, 81, 74, 76, 70, 83, 75, 72');
  const [raw2, setRaw2] = useState<string>('68, 71, 65, 72, 69, 74, 67, 70, 73, 68');

  // Paired summary inputs
  const [nPaired, setNPaired] = useState<string>('20');
  const [meanDiffPaired, setMeanDiffPaired] = useState<string>('2.5');
  const [sdDiffPaired, setSdDiffPaired] = useState<string>('4.0');

  // One-sample summary inputs
  const [nOne, setNOne] = useState<string>('25');
  const [meanOne, setMeanOne] = useState<string>('104');
  const [sdOne, setSdOne] = useState<string>('10');
  const [mu0, setMu0] = useState<string>('100');

  // Raw data for paired or one sample
  const [rawSingle, setRawSingle] = useState<string>('102, 105, 98, 106, 104, 110, 101, 103, 107, 104');

  const [copied, setCopied] = useState<boolean>(false);

  // Element IDs
  const alphaId = useId();
  const tailsId = useId();
  const deltaId = useId();
  const welchToggleId = useId();
  const n1Id = useId();
  const mean1Id = useId();
  const sd1Id = useId();
  const n2Id = useId();
  const mean2Id = useId();
  const sd2Id = useId();
  const raw1Id = useId();
  const raw2Id = useId();
  const nPairedId = useId();
  const meanDiffPairedId = useId();
  const sdDiffPairedId = useId();
  const nOneId = useId();
  const meanOneId = useId();
  const sdOneId = useId();
  const mu0Id = useId();
  const rawSingleId = useId();

  // Calculated descriptives
  const descriptives = useMemo(() => {
    if (tab === 'two_sample') {
      if (inputMode === 'raw') {
        const p1 = parseNumbers(raw1).numbers;
        const p2 = parseNumbers(raw2).numbers;
        const s1 = p1.length >= 2 ? getSummaryStats(p1) : null;
        const s2 = p2.length >= 2 ? getSummaryStats(p2) : null;
        return {
          g1: s1 ? { n: s1.count, mean: s1.mean, sd: s1.sampleSD, se: s1.standardError } : null,
          g2: s2 ? { n: s2.count, mean: s2.mean, sd: s2.sampleSD, se: s2.standardError } : null,
        };
      } else {
        const vN1 = parseFloat(n1);
        const vM1 = parseFloat(mean1);
        const vS1 = parseFloat(sd1);
        const vN2 = parseFloat(n2);
        const vM2 = parseFloat(mean2);
        const vS2 = parseFloat(sd2);
        return {
          g1: !isNaN(vN1) && !isNaN(vM1) && !isNaN(vS1) && vN1 >= 2 && vS1 > 0 ? { n: vN1, mean: vM1, sd: vS1, se: vS1 / Math.sqrt(vN1) } : null,
          g2: !isNaN(vN2) && !isNaN(vM2) && !isNaN(vS2) && vN2 >= 2 && vS2 > 0 ? { n: vN2, mean: vM2, sd: vS2, se: vS2 / Math.sqrt(vN2) } : null,
        };
      }
    }
    return null;
  }, [tab, inputMode, raw1, raw2, n1, mean1, sd1, n2, mean2, sd2]);

  // Main T-Test calculation result
  const result: TTestResult | null = useMemo(() => {
    if (tab === 'two_sample') {
      if (!descriptives?.g1 || !descriptives?.g2) return null;
      return calculateTwoSampleTTest(
        descriptives.g1.n,
        descriptives.g1.mean,
        descriptives.g1.sd,
        descriptives.g2.n,
        descriptives.g2.mean,
        descriptives.g2.sd,
        isWelch,
        alpha,
        tails,
        delta
      );
    }

    if (tab === 'paired') {
      if (inputMode === 'raw') {
        const vals = parseNumbers(rawSingle).numbers;
        if (vals.length < 2) return null;
        const st = getSummaryStats(vals);
        if (!st) return null;
        return calculatePairedTTest(st.count, st.mean, st.sampleSD, alpha, tails, delta);
      } else {
        const n = parseFloat(nPaired);
        const m = parseFloat(meanDiffPaired);
        const s = parseFloat(sdDiffPaired);
        if (isNaN(n) || isNaN(m) || isNaN(s) || n < 2 || s <= 0) return null;
        return calculatePairedTTest(n, m, s, alpha, tails, delta);
      }
    }

    if (tab === 'one_sample') {
      const vMu0 = parseFloat(mu0);
      if (isNaN(vMu0)) return null;

      if (inputMode === 'raw') {
        const vals = parseNumbers(rawSingle).numbers;
        if (vals.length < 2) return null;
        const st = getSummaryStats(vals);
        if (!st) return null;
        return calculateOneSampleTTest(st.count, st.mean, st.sampleSD, vMu0, alpha, tails);
      } else {
        const n = parseFloat(nOne);
        const m = parseFloat(meanOne);
        const s = parseFloat(sdOne);
        if (isNaN(n) || isNaN(m) || isNaN(s) || n < 2 || s <= 0) return null;
        return calculateOneSampleTTest(n, m, s, vMu0, alpha, tails);
      }
    }

    return null;
  }, [tab, inputMode, descriptives, isWelch, alpha, tails, delta, rawSingle, nPaired, meanDiffPaired, sdDiffPaired, mu0, nOne, meanOne, sdOne]);

  // Handle Copy Summary
  const handleCopy = () => {
    if (!result) return;
    const testName =
      result.testType === 'welch'
        ? "Welch's Two-Sample t-Test"
        : result.testType === 'pooled'
        ? "Student's Two-Sample Pooled t-Test"
        : result.testType === 'paired'
        ? 'Paired (Dependent) t-Test'
        : 'One-Sample t-Test';

    const text = [
      `=== ${testName} ===`,
      `t-statistic: ${result.t.toFixed(3)}`,
      `Degrees of Freedom (df): ${result.df.toFixed(2)}`,
      `p-value (${result.tails === 'two' ? 'two-tailed' : 'one-tailed'}): ${result.pValue.toFixed(4)}`,
      `Significance Level (α): ${result.alpha}`,
      `Critical t: ±${result.criticalT.toFixed(3)}`,
      `Difference of Means: ${result.meanDiff.toFixed(3)} (SE = ${result.seDiff.toFixed(3)})`,
      `${((1 - result.alpha) * 100).toFixed(0)}% Confidence Interval: [${result.ciLower.toFixed(3)}, ${result.ciUpper.toFixed(3)}]`,
      `Effect Size: Cohen's d = ${result.cohensD.toFixed(3)}, Hedges' g = ${result.hedgesG.toFixed(3)}`,
      `Verdict: ${result.isSignificant ? 'Statistically significant difference detected (p < α)' : 'Difference is not statistically significant (p ≥ α)'}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (tab === 'two_sample') {
      setN1('30');
      setMean1('75');
      setSd1('10');
      setN2('30');
      setMean2('70');
      setSd2('12');
      setIsWelch(true);
    } else if (tab === 'paired') {
      setNPaired('20');
      setMeanDiffPaired('2.5');
      setSdDiffPaired('4.0');
    } else {
      setNOne('25');
      setMeanOne('104');
      setSdOne('10');
      setMu0('100');
    }
    setAlpha(0.05);
    setTails('two');
    setDelta(0);
  };

  const tabsConfig = [
    { id: 'two_sample', label: 'Two-Sample (Welch / Pooled)' },
    { id: 'paired', label: 'Paired (Matched)' },
    { id: 'one_sample', label: 'One-Sample' },
  ];

  // SVG Bell Curve visualization helper points
  const chartPoints = useMemo(() => {
    if (!result) return null;
    const df = Math.max(2, result.df);
    const range = Math.max(4.2, Math.abs(result.t) * 1.25);
    const width = 600;
    const height = 180;
    const margin = { top: 25, right: 30, bottom: 40, left: 30 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    // Student t pdf approximation
    const tPdf = (x: number, d: number) => {
      // standard normal or t pdf shape for visualization
      const factor = (d + 1) / 2;
      return Math.pow(1 + (x * x) / d, -factor);
    };

    const maxDensity = tPdf(0, df);
    const scaleX = (x: number) => margin.left + ((x + range) / (2 * range)) * plotW;
    const scaleY = (y: number) => margin.top + plotH - (y / maxDensity) * plotH;

    const points: Array<[number, number]> = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = -range + (i / steps) * (2 * range);
      const y = tPdf(x, df);
      points.push([scaleX(x), scaleY(y)]);
    }

    const pathD = points.map((p, idx) => (idx === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

    const tX = scaleX(result.t);
    const critXPos = scaleX(result.criticalT);
    const critXNeg = scaleX(-result.criticalT);

    return { width, height, pathD, scaleX, scaleY, tX, critXPos, critXNeg, margin, plotW, plotH, range };
  }, [result]);

  return (
    <div className={styles.container}>
      <div className={styles.tabNav}>
        <TabSlider
          tabs={tabsConfig}
          activeId={tab}
          onChange={(newTab) => setTab(newTab as ActiveTab)}
          ariaLabel="T-Test Type"
        />
      </div>

      <TTestInputGuide tab={tab} />

      <div className={styles.calculatorCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {tab === 'two_sample' && 'Two-Sample Independent Groups'}
            {tab === 'paired' && 'Paired (Dependent) Observations'}
            {tab === 'one_sample' && 'One-Sample Benchmark Comparison'}
          </h2>
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeBtn} ${inputMode === 'summary' ? styles.modeBtnActive : ''}`}
              onClick={() => setInputMode('summary')}
            >
              Summary Stats
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${inputMode === 'raw' ? styles.modeBtnActive : ''}`}
              onClick={() => setInputMode('raw')}
            >
              Raw Data
            </button>
          </div>
        </div>

        {/* Tab 1: Two-Sample Inputs */}
        {tab === 'two_sample' && inputMode === 'summary' && (
          <div className={styles.inputsGrid}>
            <div className={styles.groupCard}>
              <div className={styles.groupCardHeader}>
                <span className={styles.groupCardTitle}>Group 1 (Treatment / A)</span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={n1Id} className={styles.label}>Sample Size (n₁)</label>
                <input
                  id={n1Id}
                  className={styles.input}
                  type="number"
                  min="2"
                  value={n1}
                  onChange={(e) => setN1(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={mean1Id} className={styles.label}>Sample Mean (x̄₁)</label>
                <input
                  id={mean1Id}
                  className={styles.input}
                  type="number"
                  step="any"
                  value={mean1}
                  onChange={(e) => setMean1(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={sd1Id} className={styles.label}>Standard Deviation (s₁)</label>
                <input
                  id={sd1Id}
                  className={styles.input}
                  type="number"
                  min="0.0001"
                  step="any"
                  value={sd1}
                  onChange={(e) => setSd1(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.groupCard}>
              <div className={styles.groupCardHeader}>
                <span className={styles.groupCardTitle}>Group 2 (Control / B)</span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={n2Id} className={styles.label}>Sample Size (n₂)</label>
                <input
                  id={n2Id}
                  className={styles.input}
                  type="number"
                  min="2"
                  value={n2}
                  onChange={(e) => setN2(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={mean2Id} className={styles.label}>Sample Mean (x̄₂)</label>
                <input
                  id={mean2Id}
                  className={styles.input}
                  type="number"
                  step="any"
                  value={mean2}
                  onChange={(e) => setMean2(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={sd2Id} className={styles.label}>Standard Deviation (s₂)</label>
                <input
                  id={sd2Id}
                  className={styles.input}
                  type="number"
                  min="0.0001"
                  step="any"
                  value={sd2}
                  onChange={(e) => setSd2(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'two_sample' && inputMode === 'raw' && (
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor={raw1Id} className={styles.label}>Group 1 Data (comma or space separated)</label>
              <textarea
                id={raw1Id}
                className={styles.textarea}
                rows={4}
                value={raw1}
                onChange={(e) => setRaw1(e.target.value)}
              />
              <span className={styles.helperText}>Example: 72, 78, 69, 81, 74, 76, 70, 83, 75, 72</span>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={raw2Id} className={styles.label}>Group 2 Data (comma or space separated)</label>
              <textarea
                id={raw2Id}
                className={styles.textarea}
                rows={4}
                value={raw2}
                onChange={(e) => setRaw2(e.target.value)}
              />
              <span className={styles.helperText}>Example: 68, 71, 65, 72, 69, 74, 67, 70, 73, 68</span>
            </div>
          </div>
        )}

        {/* Tab 2: Paired Inputs */}
        {tab === 'paired' && inputMode === 'summary' && (
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor={nPairedId} className={styles.label}>Number of Pairs (n)</label>
              <input
                id={nPairedId}
                className={styles.input}
                type="number"
                min="2"
                value={nPaired}
                onChange={(e) => setNPaired(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={meanDiffPairedId} className={styles.label}>Mean Difference (d̄ = x̄₁ − x̄₂)</label>
              <input
                id={meanDiffPairedId}
                className={styles.input}
                type="number"
                step="any"
                value={meanDiffPaired}
                onChange={(e) => setMeanDiffPaired(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={sdDiffPairedId} className={styles.label}>SD of Differences (s_d)</label>
              <input
                id={sdDiffPairedId}
                className={styles.input}
                type="number"
                min="0.0001"
                step="any"
                value={sdDiffPaired}
                onChange={(e) => setSdDiffPaired(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 3: One-Sample Inputs */}
        {tab === 'one_sample' && inputMode === 'summary' && (
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor={nOneId} className={styles.label}>Sample Size (n)</label>
              <input
                id={nOneId}
                className={styles.input}
                type="number"
                min="2"
                value={nOne}
                onChange={(e) => setNOne(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={meanOneId} className={styles.label}>Sample Mean (x̄)</label>
              <input
                id={meanOneId}
                className={styles.input}
                type="number"
                step="any"
                value={meanOne}
                onChange={(e) => setMeanOne(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={sdOneId} className={styles.label}>Sample SD (s)</label>
              <input
                id={sdOneId}
                className={styles.input}
                type="number"
                min="0.0001"
                step="any"
                value={sdOne}
                onChange={(e) => setSdOne(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={mu0Id} className={styles.label}>Hypothesized Mean (μ₀)</label>
              <input
                id={mu0Id}
                className={styles.input}
                type="number"
                step="any"
                value={mu0}
                onChange={(e) => setMu0(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Raw mode for paired or one sample */}
        {(tab === 'paired' || tab === 'one_sample') && inputMode === 'raw' && (
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
              <label htmlFor={rawSingleId} className={styles.label}>
                {tab === 'paired' ? 'Pairwise Differences (d_i = x₁ − x₂)' : 'Sample Observations'}
              </label>
              <textarea
                id={rawSingleId}
                className={styles.textarea}
                rows={3}
                value={rawSingle}
                onChange={(e) => setRawSingle(e.target.value)}
              />
            </div>
            {tab === 'one_sample' && (
              <div className={styles.inputGroup}>
                <label htmlFor={mu0Id} className={styles.label}>Hypothesized Mean (μ₀)</label>
                <input
                  id={mu0Id}
                  className={styles.input}
                  type="number"
                  step="any"
                  value={mu0}
                  onChange={(e) => setMu0(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Common Settings: Alpha, Tails, Welch toggle */}
        <div className={styles.inputsGrid} style={{ marginTop: 18 }}>
          <div className={styles.inputGroup}>
            <label htmlFor={alphaId} className={styles.label}>Significance Threshold (α)</label>
            <select
              id={alphaId}
              className={styles.select}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
            >
              <option value={0.01}>α = 0.01 (99% confidence)</option>
              <option value={0.05}>α = 0.05 (95% confidence, Standard)</option>
              <option value={0.10}>α = 0.10 (90% confidence)</option>
            </select>
            <div className={styles.quickPills}>
              {[0.01, 0.05, 0.10].map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`${styles.pillBtn} ${alpha === a ? styles.pillBtnActive : ''}`}
                  onClick={() => setAlpha(a)}
                >
                  α = {a}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor={tailsId} className={styles.label}>Hypothesis Direction (Tails)</label>
            <select
              id={tailsId}
              className={styles.select}
              value={tails}
              onChange={(e) => setTails(e.target.value as TailType)}
            >
              <option value="two">Two-tailed (x̄₁ ≠ x̄₂, non-directional)</option>
              <option value="one_greater">One-tailed (x̄₁ &gt; x̄₂, directional)</option>
              <option value="one_less">One-tailed (x̄₁ &lt; x̄₂, directional)</option>
            </select>
          </div>

          {tab === 'two_sample' && (
            <div className={styles.inputGroup}>
              <label htmlFor={deltaId} className={styles.label}>Hypothesized Difference (Δ)</label>
              <input
                id={deltaId}
                className={styles.input}
                type="number"
                step="any"
                value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value) || 0)}
              />
              <span className={styles.helperText}>Standard null hypothesis: Δ = 0</span>
            </div>
          )}
        </div>

        {tab === 'two_sample' && (
          <div className={styles.toggleRow}>
            <input
              id={welchToggleId}
              type="checkbox"
              className={styles.checkbox}
              checked={isWelch}
              onChange={(e) => setIsWelch(e.target.checked)}
            />
            <label htmlFor={welchToggleId} className={styles.toggleLabel}>
              Use Welch&apos;s t-test (unequal variances assumed — standard default)
            </label>
          </div>
        )}
      </div>

      {result ? (
        <>
          {/* Hero Result Card */}
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              {result.testType === 'welch' && "Welch's Two-Sample t-Test"}
              {result.testType === 'pooled' && "Student's Pooled Variance t-Test"}
              {result.testType === 'paired' && 'Paired Difference t-Test'}
              {result.testType === 'one_sample' && 'One-Sample t-Test'}
            </div>
            <div className={styles.heroValue}>t = {result.t.toFixed(3)}</div>
            <div className={styles.heroSub}>
              <span>df ≈ {result.df.toFixed(2)}</span>
              <span>·</span>
              <span>p = {result.pValue.toFixed(3)} ({result.tails === 'two' ? 'two-tailed' : 'one-tailed'})</span>
              <span>·</span>
              <span>α = {result.alpha}</span>
            </div>
            <div className={styles.heroVerdict}>
              {result.isSignificant
                ? `At α = ${result.alpha}, the difference of ${Math.abs(result.meanDiff).toFixed(2)} points is statistically significant (${result.testType === 'welch' ? 'Welch ' : ''}t = ${result.t.toFixed(3)}, df ≈ ${result.df.toFixed(2)}, p = ${result.pValue.toFixed(3)}).`
                : `At α = ${result.alpha}, the difference of ${Math.abs(result.meanDiff).toFixed(2)} points is not statistically significant (${result.testType === 'welch' ? 'Welch ' : ''}t = ${result.t.toFixed(3)}, df ≈ ${result.df.toFixed(2)}, p = ${result.pValue.toFixed(3)}).`}
            </div>
            <div className={styles.heroMeaning}>
              If the true difference were {delta}, a difference at least this large would appear about{' '}
              <strong>{(result.pValue * 100).toFixed(1)}%</strong> of the time due to random sampling chance alone.
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>p-Value ({result.tails === 'two' ? '2-tailed' : '1-tailed'})</span>
              <span className={styles.statVal}>{result.pValue.toFixed(4)}</span>
              <span className={styles.statSub}>
                {result.pValue < result.alpha ? 'p < α (Significant)' : 'p ≥ α (Not Significant)'}
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Critical t (t*)</span>
              <span className={styles.statVal}>±{result.criticalT.toFixed(3)}</span>
              <span className={styles.statSub}>Threshold at α = {result.alpha}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>{((1 - result.alpha) * 100).toFixed(0)}% CI of Difference</span>
              <span className={styles.statVal}>
                [{result.ciLower.toFixed(2)}, {result.ciUpper.toFixed(2)}]
              </span>
              <span className={styles.statSub}>SE(diff) = {result.seDiff.toFixed(3)}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Effect Size</span>
              <span className={styles.statVal}>d = {result.cohensD.toFixed(3)}</span>
              <span className={styles.statSub}>Hedges&apos; g = {result.hedgesG.toFixed(3)}</span>
            </div>
          </div>

          {/* Theme-Aware t-Distribution Curve Chart */}
          {chartPoints && (
            <div className={styles.chartContainer}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Student-t Distribution (df = {result.df.toFixed(1)})</span>
                <div className={styles.chartLegend}>
                  <span style={{ color: 'var(--ink-soft)' }}>━ Curve</span>
                  <span style={{ color: '#EF4444' }}>- - Critical t (±{result.criticalT.toFixed(2)})</span>
                  <span style={{ color: '#0D9488' }}>● Observed t ({result.t.toFixed(2)})</span>
                </div>
              </div>
              <svg className={styles.chartSvg} viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}>
                {/* Baseline Axis */}
                <line
                  x1={chartPoints.margin.left}
                  y1={chartPoints.margin.top + chartPoints.plotH}
                  x2={chartPoints.margin.left + chartPoints.plotW}
                  y2={chartPoints.margin.top + chartPoints.plotH}
                  stroke="var(--line)"
                  strokeWidth="1.5"
                />

                {/* Center 0 Axis */}
                <line
                  x1={chartPoints.scaleX(0)}
                  y1={chartPoints.margin.top}
                  x2={chartPoints.scaleX(0)}
                  y2={chartPoints.margin.top + chartPoints.plotH}
                  stroke="var(--line)"
                  strokeDasharray="2 2"
                />
                <text
                  x={chartPoints.scaleX(0)}
                  y={chartPoints.margin.top + chartPoints.plotH + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--ink-muted)"
                >
                  0
                </text>

                {/* Critical line positive */}
                <line
                  x1={chartPoints.critXPos}
                  y1={chartPoints.margin.top}
                  x2={chartPoints.critXPos}
                  y2={chartPoints.margin.top + chartPoints.plotH}
                  stroke="#EF4444"
                  strokeWidth="1.6"
                  strokeDasharray="3 3"
                />
                <text
                  x={chartPoints.critXPos}
                  y={chartPoints.margin.top + chartPoints.plotH + 16}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#EF4444"
                >
                  +{result.criticalT.toFixed(2)}
                </text>

                {/* Critical line negative if two-tailed */}
                {result.tails === 'two' && (
                  <>
                    <line
                      x1={chartPoints.critXNeg}
                      y1={chartPoints.margin.top}
                      x2={chartPoints.critXNeg}
                      y2={chartPoints.margin.top + chartPoints.plotH}
                      stroke="#EF4444"
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={chartPoints.critXNeg}
                      y={chartPoints.margin.top + chartPoints.plotH + 16}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="#EF4444"
                    >
                      -{result.criticalT.toFixed(2)}
                    </text>
                  </>
                )}

                {/* Distribution curve */}
                <path d={chartPoints.pathD} fill="none" stroke="#4338CA" strokeWidth="2.4" />

                {/* Observed t marker */}
                <line
                  x1={chartPoints.tX}
                  y1={chartPoints.margin.top + 5}
                  x2={chartPoints.tX}
                  y2={chartPoints.margin.top + chartPoints.plotH}
                  stroke="#0D9488"
                  strokeWidth="2.2"
                />
                <circle cx={chartPoints.tX} cy={chartPoints.margin.top + 5} r="4" fill="#0D9488" />
                <text
                  x={chartPoints.tX}
                  y={chartPoints.margin.top - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#0D9488"
                >
                  t = {result.t.toFixed(2)}
                </text>
              </svg>
            </div>
          )}

          {/* Group Descriptives Table */}
          {tab === 'two_sample' && descriptives?.g1 && descriptives?.g2 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Sample Size (n)</th>
                    <th>Mean (x̄)</th>
                    <th>SD (s)</th>
                    <th>Std Error (SE)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Group 1</strong></td>
                    <td>{descriptives.g1.n}</td>
                    <td>{descriptives.g1.mean.toFixed(3)}</td>
                    <td>{descriptives.g1.sd.toFixed(3)}</td>
                    <td>{descriptives.g1.se.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td><strong>Group 2</strong></td>
                    <td>{descriptives.g2.n}</td>
                    <td>{descriptives.g2.mean.toFixed(3)}</td>
                    <td>{descriptives.g2.sd.toFixed(3)}</td>
                    <td>{descriptives.g2.se.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td><strong>Difference (1 − 2)</strong></td>
                    <td>—</td>
                    <td>{result.meanDiff.toFixed(3)}</td>
                    <td>—</td>
                    <td>{result.seDiff.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Assumptions helper */}
          <div className={styles.assumptionsCard}>
            <div className={styles.assumptionsTitle}>Assumption Checklist &amp; Interpretation Guidance</div>
            <div className={styles.assumptionItem}>
              • <strong>Welch vs Pooled:</strong> Welch&apos;s t-test does not assume equal variances. It maintains robust Type I error rates across both equal and unequal variance scenarios (Delacre et al., 2017).
            </div>
            <div className={styles.assumptionItem}>
              • <strong>Normality:</strong> t-tests assume continuous data drawn from approximately normal distributions. By the Central Limit Theorem, deviations from normality are less problematic as sample size exceeds 30.
            </div>
            <div className={styles.assumptionItem}>
              • <strong>Interpretation of p:</strong> A p-value of {result.pValue.toFixed(3)} is the probability of observing test statistic |t| ≥ {Math.abs(result.t).toFixed(3)} assuming the null hypothesis is true; it is <em>not</em> the probability that the null hypothesis itself is true.
            </div>
          </div>

          {/* Actions: Copy & Reset */}
          <div className={styles.actionsRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopy}>
              {copied ? '✓ Copied Summary' : 'Copy Statistical Summary'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleReset}>
              Reset Defaults
            </button>
            {copied && <span className={styles.copiedNotification}>Copied to clipboard!</span>}
          </div>
        </>
      ) : (
        <div className={styles.errorBox}>
          Please enter valid numerical values. Sample sizes must be at least 2, and standard deviations must be greater than 0.
        </div>
      )}
    </div>
  );
}
