'use client';

import React, { useState, useMemo, useId } from 'react';
import styles from './BinomialCalculator.module.css';
import TabSlider from '@/components/tool/shared/TabSlider';
import BinomialInputGuide from './BinomialInputGuide';
import {
  calculateBinomial,
  calculateTrialsNeeded,
  type ComparisonType,
  type BinomialResult,
} from '@/lib/binomial-engine';

type ActiveTab = 'probability' | 'inverse' | 'normal';

export default function BinomialCalculator() {
  const [tab, setTab] = useState<ActiveTab>('probability');

  // Probability Tab Inputs (Spec defaults: n = 10, p = 0.5, k = 3)
  const [n, setN] = useState<string>('10');
  const [p, setP] = useState<string>('0.5');
  const [k, setK] = useState<string>('3');
  const [k2, setK2] = useState<string>('5');
  const [comparison, setComparison] = useState<ComparisonType>('exact');

  // Inverse Tab Inputs (Spec defaults: target = 0.9999, p = 0.01 -> 917 trials)
  const [targetProb, setTargetProb] = useState<string>('0.9999');
  const [inverseP, setInverseP] = useState<string>('0.01');

  // Normal Approximation Tab Inputs (n = 100, p = 0.5, k = 45)
  const [normN, setNormN] = useState<string>('100');
  const [normP, setNormP] = useState<string>('0.5');
  const [normK, setNormK] = useState<string>('45');
  const [normComparison, setNormComparison] = useState<ComparisonType>('at_most');

  // Collapsible steps
  const [stepsOpen, setStepsOpen] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Element IDs
  const nId = useId();
  const pId = useId();
  const kId = useId();
  const k2Id = useId();
  const comparisonId = useId();
  const targetProbId = useId();
  const inversePId = useId();
  const normNId = useId();
  const normPId = useId();
  const normKId = useId();
  const normComparisonId = useId();

  // Tab 1 Calculation Result
  const result: BinomialResult | null = useMemo(() => {
    if (tab === 'probability') {
      const valN = parseInt(n, 10);
      const valP = parseFloat(p);
      const valK = parseInt(k, 10);
      const valK2 = k2 ? parseInt(k2, 10) : undefined;
      if (isNaN(valN) || isNaN(valP) || isNaN(valK)) return null;
      return calculateBinomial(valN, valP, valK, comparison, valK2);
    }
    if (tab === 'normal') {
      const valN = parseInt(normN, 10);
      const valP = parseFloat(normP);
      const valK = parseInt(normK, 10);
      if (isNaN(valN) || isNaN(valP) || isNaN(valK)) return null;
      return calculateBinomial(valN, valP, valK, normComparison);
    }
    return null;
  }, [tab, n, p, k, k2, comparison, normN, normP, normK, normComparison]);

  // Tab 2 Calculation Result (Trials Needed)
  const trialsResult = useMemo(() => {
    if (tab !== 'inverse') return null;
    const t = parseFloat(targetProb);
    const prob = parseFloat(inverseP);
    if (isNaN(t) || isNaN(prob)) return null;
    const needed = calculateTrialsNeeded(t, prob);
    return { target: t, p: prob, needed };
  }, [tab, targetProb, inverseP]);

  // Handle Copy Summary
  const handleCopy = () => {
    if (tab === 'inverse' && trialsResult && trialsResult.needed) {
      const text = [
        '=== Binomial Inverse: Trials Needed ===',
        `Target Probability P(X ≥ 1): ${(trialsResult.target * 100).toFixed(2)}%`,
        `Single-Trial Event Rate (p): ${(trialsResult.p * 100).toFixed(4)}%`,
        `Minimum Trials Needed (n): ${trialsResult.needed}`,
        `Formula: n ≥ ln(1 − P) ÷ ln(1 − p) = ln(${1 - trialsResult.target}) ÷ ln(${1 - trialsResult.p})`,
      ].join('\n');
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (!result) return;
    const text = [
      '=== Binomial Probability Distribution ===',
      `Trials (n): ${result.n}`,
      `Success Rate (p): ${result.p}`,
      `Comparison: ${result.comparisonLabel}`,
      `Probability: ${result.selectedProbability.toFixed(6)} (${(result.selectedProbability * 100).toFixed(4)}%)`,
      `Mean (μ = np): ${result.moments.mean.toFixed(4)}`,
      `Variance (σ² = npq): ${result.moments.variance.toFixed(4)}`,
      `Std Dev (σ): ${result.moments.sd.toFixed(4)}`,
      `Mode(s): ${result.moments.modes.join(', ')}`,
      `Skewness: ${result.moments.skewness.toFixed(4)}`,
      result.normalApprox.isApplicable
        ? `Normal Approx: ${result.normalApprox.approxProbability.toFixed(6)} (Error = ${result.normalApprox.absoluteError.toFixed(6)})`
        : 'Normal Approx: Not applicable (np < 10 or n(1-p) < 10)',
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy CSV of distribution table
  const handleCopyCsv = () => {
    if (!result || result.bars.length === 0) return;
    const rows = ['k,P(X=k),P(X<=k),Selected'];
    result.bars.forEach((b) => {
      rows.push(`${b.k},${b.pmf.toFixed(6)},${b.cdf.toFixed(6)},${b.isSelected ? 'Yes' : 'No'}`);
    });
    navigator.clipboard.writeText(rows.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (tab === 'probability') {
      setN('10');
      setP('0.5');
      setK('3');
      setK2('5');
      setComparison('exact');
    } else if (tab === 'inverse') {
      setTargetProb('0.9999');
      setInverseP('0.01');
    } else {
      setNormN('100');
      setNormP('0.5');
      setNormK('45');
      setNormComparison('at_most');
    }
  };

  const tabsConfig = [
    { id: 'probability', label: 'Probability (PMF / CDF)' },
    { id: 'inverse', label: 'Trials Needed (Inverse)' },
    { id: 'normal', label: 'Normal Approximation' },
  ];

  // SVG Chart rendering helper
  const chartConfig = useMemo(() => {
    if (!result || result.bars.length === 0) return null;
    const maxPmf = Math.max(...result.bars.map((b) => b.pmf), 0.001);
    const width = 620;
    const height = 180;
    const margin = { top: 25, right: 25, bottom: 35, left: 35 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    const count = result.bars.length;
    const barWidth = Math.max(4, Math.min(28, (plotW / count) * 0.75));
    const stepX = plotW / count;

    return { maxPmf, width, height, margin, plotW, plotH, barWidth, stepX };
  }, [result]);

  return (
    <div className={styles.container}>
      <div className={styles.tabNav}>
        <TabSlider
          tabs={tabsConfig}
          activeId={tab}
          onChange={(newTab) => setTab(newTab as ActiveTab)}
          ariaLabel="Binomial Calculator Mode"
        />
      </div>

      <BinomialInputGuide tab={tab} />

      <div className={styles.calculatorCard}>
        {/* Tab 1: Probability Inputs */}
        {tab === 'probability' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={nId} className={styles.label}>Number of Trials (n)</label>
                <input
                  id={nId}
                  className={styles.input}
                  type="number"
                  min="1"
                  max="1000000"
                  step="1"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                />
                <span className={styles.helperText}>Total repetitions (e.g. 10 coin flips)</span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={pId} className={styles.label}>Success Probability (p)</label>
                <input
                  id={pId}
                  className={styles.input}
                  type="number"
                  min="0"
                  max="1"
                  step="any"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                />
                <div className={styles.quickPills}>
                  {[0.1, 0.25, 0.5, 0.75].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`${styles.pillBtn} ${p === String(val) ? styles.pillBtnActive : ''}`}
                      onClick={() => setP(String(val))}
                    >
                      {val * 100}%
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={comparisonId} className={styles.label}>Comparison Type</label>
                <select
                  id={comparisonId}
                  className={styles.select}
                  value={comparison}
                  onChange={(e) => setComparison(e.target.value as ComparisonType)}
                >
                  <option value="exact">P(X = k) · Exactly k</option>
                  <option value="at_most">P(X ≤ k) · At most k (Cumulative)</option>
                  <option value="less_than">P(X &lt; k) · Fewer than k</option>
                  <option value="at_least">P(X ≥ k) · At least k</option>
                  <option value="greater_than">P(X &gt; k) · More than k</option>
                  <option value="between">P(k₁ ≤ X ≤ k₂) · Between k₁ and k₂</option>
                  <option value="outside">P(X &lt; k₁ or X &gt; k₂) · Outside range</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={kId} className={styles.label}>
                  {comparison === 'between' || comparison === 'outside' ? 'Lower Bound (k₁)' : 'Successes (k)'}
                </label>
                <input
                  id={kId}
                  className={styles.input}
                  type="number"
                  min="0"
                  step="1"
                  value={k}
                  onChange={(e) => setK(e.target.value)}
                />
              </div>

              {(comparison === 'between' || comparison === 'outside') && (
                <div className={styles.inputGroup}>
                  <label htmlFor={k2Id} className={styles.label}>Upper Bound (k₂)</label>
                  <input
                    id={k2Id}
                    className={styles.input}
                    type="number"
                    min="0"
                    step="1"
                    value={k2}
                    onChange={(e) => setK2(e.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab 2: Inverse Mode Inputs */}
        {tab === 'inverse' && (
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor={targetProbId} className={styles.label}>Target Probability P(X ≥ 1)</label>
              <input
                id={targetProbId}
                className={styles.input}
                type="number"
                min="0.0001"
                max="0.999999"
                step="any"
                value={targetProb}
                onChange={(e) => setTargetProb(e.target.value)}
              />
              <div className={styles.quickPills}>
                {[0.9, 0.95, 0.99, 0.9999].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles.pillBtn} ${targetProb === String(val) ? styles.pillBtnActive : ''}`}
                    onClick={() => setTargetProb(String(val))}
                  >
                    {val * 100}%
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={inversePId} className={styles.label}>Single-Trial Success Rate (p)</label>
              <input
                id={inversePId}
                className={styles.input}
                type="number"
                min="0.000001"
                max="0.999999"
                step="any"
                value={inverseP}
                onChange={(e) => setInverseP(e.target.value)}
              />
              <div className={styles.quickPills}>
                {[0.001, 0.01, 0.05, 0.1].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles.pillBtn} ${inverseP === String(val) ? styles.pillBtnActive : ''}`}
                    onClick={() => setInverseP(String(val))}
                  >
                    {val * 100}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Normal Approximation Inputs */}
        {tab === 'normal' && (
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor={normNId} className={styles.label}>Number of Trials (n)</label>
              <input
                id={normNId}
                className={styles.input}
                type="number"
                min="10"
                step="1"
                value={normN}
                onChange={(e) => setNormN(e.target.value)}
              />
              <span className={styles.helperText}>Requires np ≥ 10 and n(1−p) ≥ 10</span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={normPId} className={styles.label}>Success Rate (p)</label>
              <input
                id={normPId}
                className={styles.input}
                type="number"
                min="0.01"
                max="0.99"
                step="any"
                value={normP}
                onChange={(e) => setNormP(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={normComparisonId} className={styles.label}>Condition</label>
              <select
                id={normComparisonId}
                className={styles.select}
                value={normComparison}
                onChange={(e) => setNormComparison(e.target.value as ComparisonType)}
              >
                <option value="at_most">P(X ≤ k) · At most</option>
                <option value="at_least">P(X ≥ k) · At least</option>
                <option value="exact">P(X = k) · Exactly</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={normKId} className={styles.label}>Cutoff (k)</label>
              <input
                id={normKId}
                className={styles.input}
                type="number"
                min="0"
                step="1"
                value={normK}
                onChange={(e) => setNormK(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab 2: Inverse Mode Result Display */}
      {tab === 'inverse' && trialsResult && trialsResult.needed ? (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>Minimum Trials Required</div>
            <div className={styles.heroValue}>{trialsResult.needed} Trials</div>
            <div className={styles.heroSub}>
              <span>Target: {(trialsResult.target * 100).toFixed(2)}%</span>
              <span>·</span>
              <span>Single Rate p: {(trialsResult.p * 100).toFixed(4)}%</span>
            </div>
            <div className={styles.heroVerdict}>
              You need at least <strong>{trialsResult.needed} trials</strong> to be {(trialsResult.target * 100).toFixed(2)}% confident of experiencing at least one success.
            </div>
            <div className={styles.heroMeaning}>
              Formula: n ≥ ln(1 − P) ÷ ln(1 − p) = ln({(1 - trialsResult.target).toFixed(6)}) ÷ ln({(1 - trialsResult.p).toFixed(6)}) = {(Math.log(1 - trialsResult.target) / Math.log(1 - trialsResult.p)).toFixed(2)} → ceiling to {trialsResult.needed}.
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopy}>
              {copied ? '✓ Copied Summary' : 'Copy Result'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleReset}>
              Reset Defaults
            </button>
            {copied && <span className={styles.copiedNotification}>Copied to clipboard!</span>}
          </div>
        </>
      ) : null}

      {/* Tab 1 & Tab 3: Standard Distribution Results */}
      {(tab === 'probability' || tab === 'normal') && result ? (
        <>
          {/* Hero Result Card */}
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              {tab === 'normal' ? 'Normal Approximation' : 'Binomial Probability'}
            </div>
            <div className={styles.heroValue}>
              {result.selectedProbability.toFixed(4)}
            </div>
            <div className={styles.heroSub}>
              <span>{result.comparisonLabel}</span>
              <span>·</span>
              <span>{(result.selectedProbability * 100).toFixed(2)}% Chance</span>
              <span>·</span>
              <span>B(n = {result.n}, p = {result.p})</span>
            </div>
            <div className={styles.heroVerdict}>
              The probability of {result.comparison === 'exact' ? `exactly ${result.k}` : result.comparisonLabel} successes in {result.n} trials at p = {result.p} is{' '}
              <strong>{result.selectedProbability.toFixed(4)} ({(result.selectedProbability * 100).toFixed(2)}%)</strong>.
            </div>
            <div className={styles.heroMeaning}>
              In repeated experiments of {result.n} independent trials, this outcome will occur about{' '}
              {(result.selectedProbability * 100).toFixed(1)}% of the time by chance.
            </div>
          </div>

          {/* Moments Cards Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Expected Mean (μ)</span>
              <span className={styles.statVal}>{result.moments.mean.toFixed(2)}</span>
              <span className={styles.statSub}>μ = n × p</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Variance (σ²)</span>
              <span className={styles.statVal}>{result.moments.variance.toFixed(3)}</span>
              <span className={styles.statSub}>σ² = n × p × (1 − p)</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Standard Dev (σ)</span>
              <span className={styles.statVal}>{result.moments.sd.toFixed(3)}</span>
              <span className={styles.statSub}>σ = √variance</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Mode (Most Likely k)</span>
              <span className={styles.statVal}>{result.moments.modes.join(', ')}</span>
              <span className={styles.statSub}>⌊(n + 1) × p⌋</span>
            </div>
          </div>

          {/* Normal Approximation Callout (especially on Normal tab) */}
          <div className={styles.assumptionsCard}>
            <div className={styles.assumptionsTitle}>
              Normal Approximation with Continuity Correction (±0.5)
            </div>
            {result.normalApprox.isApplicable ? (
              <>
                <div className={styles.assumptionItem}>
                  • <strong>Rule Criteria:</strong> np = {result.normalApprox.np.toFixed(1)} ≥ 10 and n(1−p) = {result.normalApprox.nq.toFixed(1)} ≥ 10 — <span style={{ color: '#0D9488', fontWeight: 700 }}>Passed ✓</span>
                </div>
                <div className={styles.assumptionItem}>
                  • <strong>Normal Approximation:</strong> {result.normalApprox.approxProbability.toFixed(4)} vs Exact Binomial: {result.normalApprox.exactProbability.toFixed(4)} (Absolute Error = {result.normalApprox.absoluteError.toFixed(5)})
                </div>
                <div className={styles.assumptionItem}>
                  • <em>Continuity Correction:</em> Adjusts discrete boundaries by ±0.5 to accurately integrate under the continuous Gaussian curve.
                </div>
              </>
            ) : (
              <div className={styles.assumptionItem}>
                • <strong>Criteria Not Met:</strong> np = {result.normalApprox.np.toFixed(1)} or n(1−p) = {result.normalApprox.nq.toFixed(1)} is below 10. Normal approximation is inaccurate for small samples or extreme probabilities; exact binomial calculation is used.
              </div>
            )}
          </div>

          {/* Distribution Bar Chart */}
          {chartConfig && (
            <div className={styles.chartContainer}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Binomial Distribution PMF (Selected Highlighted)</span>
                <div className={styles.chartLegend}>
                  <span style={{ color: '#0D9488' }}>■ Selected</span>
                  <span style={{ color: '#94A3B8' }}>■ Other</span>
                </div>
              </div>
              <svg className={styles.chartSvg} viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}>
                {/* Horizontal Baseline */}
                <line
                  x1={chartConfig.margin.left}
                  y1={chartConfig.margin.top + chartConfig.plotH}
                  x2={chartConfig.margin.left + chartConfig.plotW}
                  y2={chartConfig.margin.top + chartConfig.plotH}
                  stroke="var(--line)"
                  strokeWidth="1.5"
                />

                {/* Bars */}
                {result.bars.map((b, idx) => {
                  const barH = (b.pmf / chartConfig.maxPmf) * chartConfig.plotH;
                  const x = chartConfig.margin.left + idx * chartConfig.stepX + (chartConfig.stepX - chartConfig.barWidth) / 2;
                  const y = chartConfig.margin.top + chartConfig.plotH - barH;

                  return (
                    <g key={b.k}>
                      <rect
                        x={x}
                        y={y}
                        width={chartConfig.barWidth}
                        height={Math.max(barH, 1)}
                        rx="3"
                        fill={b.isSelected ? '#0D9488' : '#94A3B8'}
                        opacity={b.isSelected ? 0.95 : 0.35}
                      />
                      {result.bars.length <= 25 && (
                        <text
                          x={x + chartConfig.barWidth / 2}
                          y={chartConfig.margin.top + chartConfig.plotH + 16}
                          textAnchor="middle"
                          fontSize="9"
                          fill="var(--ink-muted)"
                        >
                          {b.k}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Step-by-Step Breakdown */}
          <div className={styles.stepsCard}>
            <button
              type="button"
              className={styles.stepsHeader}
              onClick={() => setStepsOpen(!stepsOpen)}
              aria-expanded={stepsOpen}
            >
              <span className={styles.stepsTitle}>
                {stepsOpen ? '▼ Hide Calculation Steps' : '▶ Show Step-by-Step Math'}
              </span>
            </button>
            {stepsOpen && (
              <div className={styles.stepBox}>
                <div>1. Combinations: C({result.n}, {result.k}) = {result.n}! ÷ ({result.k}! × ({result.n} − {result.k})!)</div>
                <div>2. Success Power: p^{result.k} = {result.p}^{result.k} = {Math.pow(result.p, result.k).toExponential(4)}</div>
                <div>3. Failure Power: (1 − p)^({result.n} − {result.k}) = (1 − {result.p})^{result.n - result.k} = {Math.pow(1 - result.p, result.n - result.k).toExponential(4)}</div>
                <div>4. Exact P(X = {result.k}) = {result.exactPmf.toFixed(6)}</div>
                <div>5. Cumulative P(X ≤ {result.k}) = {result.atMostCdf.toFixed(6)}</div>
                <div>6. Condition Result ({result.comparisonLabel}) = {result.selectedProbability.toFixed(6)} ({(result.selectedProbability * 100).toFixed(4)}%)</div>
              </div>
            )}
          </div>

          {/* PMF & CDF Data Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>k (Successes)</th>
                  <th>P(X = k) · PMF</th>
                  <th>P(X ≤ k) · CDF</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.bars.map((b) => (
                  <tr key={b.k} className={b.isSelected ? styles.selectedRow : undefined}>
                    <td><strong>{b.k}</strong></td>
                    <td>{b.pmf.toFixed(4)} ({(b.pmf * 100).toFixed(2)}%)</td>
                    <td>{b.cdf.toFixed(4)} ({(b.cdf * 100).toFixed(2)}%)</td>
                    <td>{b.isSelected ? '✓ Selected' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopy}>
              {copied ? '✓ Copied Summary' : 'Copy Statistical Summary'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleCopyCsv}>
              Copy Table CSV
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleReset}>
              Reset Defaults
            </button>
            {copied && <span className={styles.copiedNotification}>Copied to clipboard!</span>}
          </div>
        </>
      ) : null}
    </div>
  );
}
