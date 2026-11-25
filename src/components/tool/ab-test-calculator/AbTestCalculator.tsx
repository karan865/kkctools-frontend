'use client';

import React, { useState, useEffect, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import AbInputGuide from './AbInputGuide';
import styles from './AbTestCalculator.module.css';
import {
  calculateAbTest,
  calculateSampleSize,
  checkSrm,
  calculateMultiVariantTest,
  VariantArmInput,
} from '@/lib/ab-test-engine';

type TabType = 'test' | 'sampleSize' | 'multiVariant';

const TABS: TabItem<TabType>[] = [
  { id: 'test', label: '1. Test Significance' },
  { id: 'sampleSize', label: '2. Sample Size & Duration' },
  { id: 'multiVariant', label: '3. A/B/C Multi-Arm' },
];

interface PresetItem {
  name: string;
  cA: number;
  nA: number;
  cB: number;
  nB: number;
}

const PRESETS: PresetItem[] = [
  { name: 'Spec Example 1 (10k: 500 vs 570)', nA: 10000, cA: 500, nB: 10000, cB: 570 },
  { name: 'Spec Example 2 (50k: 500 vs 570)', nA: 50000, cA: 500, nB: 50000, cB: 570 },
  { name: 'Borderline (10k: 500 vs 530)', nA: 10000, cA: 500, nB: 10000, cB: 530 },
];

export default function AbTestCalculator() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('test');
  const [copied, setCopied] = useState(false);

  // Tab 1 state (defaults = Spec worked example)
  const [controlVisitors, setControlVisitors] = useState<number>(10000);
  const [controlConversions, setControlConversions] = useState<number>(500);
  const [variantVisitors, setVariantVisitors] = useState<number>(10000);
  const [variantConversions, setVariantConversions] = useState<number>(570);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  const [isTwoSided, setIsTwoSided] = useState<boolean>(true);

  // Tab 2 state (Sample size planner)
  const [baselineRatePct, setBaselineRatePct] = useState<number>(5.0);
  const [relativeMdePct, setRelativeMdePct] = useState<number>(10.0);
  const [sampleAlpha, setSampleAlpha] = useState<number>(0.05);
  const [samplePower, setSamplePower] = useState<number>(0.80);
  const [dailyTraffic, setDailyTraffic] = useState<number>(2000);

  // Tab 3 state (Multi-variant)
  const [variants, setVariants] = useState<VariantArmInput[]>([
    { name: 'Variant B', visitors: 10000, conversions: 570 },
    { name: 'Variant C', visitors: 10000, conversions: 610 },
  ]);
  const [correctionMethod, setCorrectionMethod] = useState<'bonferroni' | 'sidak' | 'none'>('bonferroni');

  // Sync tab from URL
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

  // Calculations for Tab 1
  let testResult = null;
  let srmResult = null;
  let testError = '';

  try {
    testResult = calculateAbTest({
      controlVisitors,
      controlConversions,
      variantVisitors,
      variantConversions,
      confidenceLevel,
      isTwoSided,
    });
    srmResult = checkSrm({
      controlVisitors,
      variantVisitors,
      plannedControlRatio: 0.5,
    });
  } catch (err) {
    testError = err instanceof Error ? err.message : 'Invalid inputs';
  }

  // Calculations for Tab 2
  let sampleSizeResult = null;
  let sampleError = '';
  try {
    sampleSizeResult = calculateSampleSize({
      baselineRate: baselineRatePct / 100,
      relativeMde: relativeMdePct / 100,
      alpha: sampleAlpha,
      power: samplePower,
      isTwoSided: true,
      dailyTraffic: dailyTraffic > 0 ? dailyTraffic : undefined,
    });
  } catch (err) {
    sampleError = err instanceof Error ? err.message : 'Invalid sample size inputs';
  }

  // Calculations for Tab 3
  let multiResult = null;
  let multiError = '';
  try {
    multiResult = calculateMultiVariantTest(
      { name: 'Control Arm A', visitors: controlVisitors, conversions: controlConversions },
      variants,
      1 - confidenceLevel,
      correctionMethod
    );
  } catch (err) {
    multiError = err instanceof Error ? err.message : 'Invalid multi-variant inputs';
  }

  const handleCopySummary = () => {
    if (!testResult) return;
    const text = `A/B Test Significance Report:
Control: ${controlVisitors.toLocaleString()} visitors, ${controlConversions.toLocaleString()} conversions (${(testResult.controlRate * 100).toFixed(2)}%)
Variant: ${variantVisitors.toLocaleString()} visitors, ${variantConversions.toLocaleString()} conversions (${(testResult.variantRate * 100).toFixed(2)}%)
Relative Uplift: ${testResult.relativeLift > 0 ? '+' : ''}${testResult.relativeLift.toFixed(2)}%
Two-Sided p-value: ${testResult.pValueTwoSided.toFixed(4)}
Z-Score: ${testResult.zScore.toFixed(3)}
Statistically Significant: ${testResult.isSignificant ? 'YES' : 'NO'} (${Math.round(confidenceLevel * 100)}% Confidence)
95% CI Difference: [${(testResult.ciLower * 100).toFixed(2)}%, ${(testResult.ciUpper * 100).toFixed(2)}%]
Source: KKC Tools (https://kkctools.com/ab-test-significance-calculator/)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="A/B test modes" />

      <AbInputGuide
        tab={tab}
        controlRate={testResult ? testResult.controlRate : 0.05}
        variantRate={testResult ? testResult.variantRate : 0.057}
      />

      {/* Preset pills for quick testing */}
      {tab === 'test' && (
        <div className={styles.presetBar}>
          <span className={styles.presetLabel}>Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              className={styles.presetBtn}
              onClick={() => {
                setControlVisitors(p.nA);
                setControlConversions(p.cA);
                setVariantVisitors(p.nB);
                setVariantConversions(p.cB);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: TEST SIGNIFICANCE */}
      {tab === 'test' && (
        <>
          <div className={styles.fieldGrid}>
            {/* Control Arm */}
            <div className={styles.armBox}>
              <div className={styles.armTitleRow}>
                <div className={styles.armHeading}>
                  <span className={styles.armBadgeA}>A</span>
                  Control (Baseline)
                </div>
                {testResult && (
                  <span className={styles.ratePill}>
                    {(testResult.controlRate * 100).toFixed(2)}%
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-ctrl-vis`}>
                  Control Visitors
                </label>
                <input
                  id={`${id}-ctrl-vis`}
                  type="number"
                  min="1"
                  step="1"
                  className={styles.input}
                  value={controlVisitors}
                  onChange={(e) => setControlVisitors(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-ctrl-conv`}>
                  Control Conversions
                </label>
                <input
                  id={`${id}-ctrl-conv`}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={controlConversions}
                  onChange={(e) => setControlConversions(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>

            {/* Variant Arm */}
            <div className={styles.armBox}>
              <div className={styles.armTitleRow}>
                <div className={styles.armHeading}>
                  <span className={styles.armBadgeB}>B</span>
                  Variant (Treatment)
                </div>
                {testResult && (
                  <span className={styles.ratePill}>
                    {(testResult.variantRate * 100).toFixed(2)}%
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-var-vis`}>
                  Variant Visitors
                </label>
                <input
                  id={`${id}-var-vis`}
                  type="number"
                  min="1"
                  step="1"
                  className={styles.input}
                  value={variantVisitors}
                  onChange={(e) => setVariantVisitors(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-var-conv`}>
                  Variant Conversions
                </label>
                <input
                  id={`${id}-var-conv`}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={variantConversions}
                  onChange={(e) => setVariantConversions(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.controlItem}>
              <label className={styles.controlLabel} htmlFor={`${id}-conf`}>
                Confidence Level:
              </label>
              <select
                id={`${id}-conf`}
                className={styles.select}
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
              >
                <option value={0.90}>90% (α = 0.10)</option>
                <option value={0.95}>95% (α = 0.05, Standard)</option>
                <option value={0.99}>99% (α = 0.01)</option>
              </select>
            </div>

            <div className={styles.controlItem}>
              <label className={styles.controlLabel} htmlFor={`${id}-sided`}>
                Hypothesis Test Type:
              </label>
              <select
                id={`${id}-sided`}
                className={styles.select}
                value={isTwoSided ? 'two' : 'one'}
                onChange={(e) => setIsTwoSided(e.target.value === 'two')}
              >
                <option value="two">Two-Sided (Default: detects lift or drop)</option>
                <option value="one">One-Sided (Variant &gt; Control only)</option>
              </select>
            </div>
          </div>

          {testError && <div className={styles.warningBox}>{testError}</div>}

          {testResult && (
            <div className={styles.resultsBand}>
              {/* Warnings if any */}
              {testResult.warnings.length > 0 && (
                <div className={styles.warningBox}>
                  {testResult.warnings.map((w, i) => (
                    <div key={i}>{w}</div>
                  ))}
                </div>
              )}

              {/* User's Required Dark Hero Result Card */}
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>
                  {testResult.isSignificant ? '✓ STATISTICALLY SIGNIFICANT' : 'NOT STATISTICALLY SIGNIFICANT'}
                </div>
                <div className={styles.heroValue}>
                  {testResult.relativeLift > 0 ? '+' : ''}
                  {testResult.relativeLift.toFixed(1)}%
                </div>
                <div className={styles.heroSub}>
                  <span>Relative Lift</span>
                  <span>·</span>
                  <span>p = {testResult.pValue.toFixed(3)}</span>
                  <span>·</span>
                  <span>z = {testResult.zScore.toFixed(2)}</span>
                </div>
              </div>

              {/* Verdict banner */}
              <div className={testResult.isSignificant ? styles.verdictBanner : styles.verdictBannerNotSig}>
                <div className={styles.verdictTitle}>{testResult.verdict}</div>
                <div className={styles.verdictText}>{testResult.explanation}</div>
                <div className={styles.verdictText}>{testResult.meaning}</div>
              </div>

              {/* Plain English meaning line */}
              <div className={styles.sentence}>
                <strong>Exact Meaning of this p-value:</strong> If there were truly no conversion difference between the two designs, an observed gap this large or larger would occur about {(testResult.pValueTwoSided * 100).toFixed(1)}% of the time purely due to random visitor assignment.
              </div>

              {/* Key Metrics Grid */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Control Rate</span>
                  <span className={styles.metricValue}>{(testResult.controlRate * 100).toFixed(2)}%</span>
                  <span className={styles.metricSub}>{testResult.controlConversions} / {testResult.controlVisitors.toLocaleString()}</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Variant Rate</span>
                  <span className={styles.metricValue}>{(testResult.variantRate * 100).toFixed(2)}%</span>
                  <span className={styles.metricSub}>{testResult.variantConversions} / {testResult.variantVisitors.toLocaleString()}</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Absolute Difference</span>
                  <span className={styles.metricValue}>
                    {testResult.rateDifference > 0 ? '+' : ''}{(testResult.rateDifference * 100).toFixed(2)} pp
                  </span>
                  <span className={styles.metricSub}>Percentage points</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>95% CI of Difference</span>
                  <span className={styles.metricValue} style={{ fontSize: '1.05rem' }}>
                    [{(testResult.ciLower * 100).toFixed(2)}%, {(testResult.ciUpper * 100).toFixed(2)}%]
                  </span>
                  <span className={styles.metricSub}>Unpooled error</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Standard Error</span>
                  <span className={styles.metricValue}>{(testResult.standardError * 100).toFixed(3)}%</span>
                  <span className={styles.metricSub}>SE of difference</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Observed Power</span>
                  <span className={styles.metricValue}>{(testResult.observedPower * 100).toFixed(1)}%</span>
                  <span className={styles.metricSub}>Observed, not a planning tool</span>
                </div>
              </div>

              {/* Sample Ratio Mismatch check card */}
              {srmResult && (
                <div className={styles.srmCard}>
                  <div>
                    <strong>Sample Ratio Mismatch (SRM) Check:</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: '2px' }}>
                      Traffic split: {((controlVisitors / (controlVisitors + variantVisitors)) * 100).toFixed(1)}% Control vs {((variantVisitors / (controlVisitors + variantVisitors)) * 100).toFixed(1)}% Variant (χ² = {srmResult.chiSquare.toFixed(2)}, p = {srmResult.pValue.toFixed(3)})
                    </div>
                  </div>
                  <div>
                    <span className={srmResult.isMismatch ? styles.srmBadgeWarn : styles.srmBadge}>
                      {srmResult.statusText}
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.actionsBar}>
                <button type="button" className={styles.copyBtn} onClick={handleCopySummary}>
                  {copied ? '✓ Copied' : 'Copy Test Summary'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: SAMPLE SIZE & DURATION */}
      {tab === 'sampleSize' && (
        <>
          <div className={styles.fieldGrid}>
            <div className={styles.armBox}>
              <div className={styles.armHeading}>Test Parameters</div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-base-rate`}>
                  Baseline Conversion Rate (%)
                </label>
                <input
                  id={`${id}-base-rate`}
                  type="number"
                  min="0.01"
                  max="99.9"
                  step="0.1"
                  className={styles.input}
                  value={baselineRatePct}
                  onChange={(e) => setBaselineRatePct(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-mde`}>
                  Minimum Detectable Effect (Relative MDE %)
                </label>
                <input
                  id={`${id}-mde`}
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.5"
                  className={styles.input}
                  value={relativeMdePct}
                  onChange={(e) => setRelativeMdePct(parseFloat(e.target.value) || 0)}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                  Target rate to detect: {(baselineRatePct * (1 + relativeMdePct / 100)).toFixed(2)}%
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-daily-traf`}>
                  Daily Visitors (Both Arms Combined, Optional)
                </label>
                <input
                  id={`${id}-daily-traf`}
                  type="number"
                  min="0"
                  step="100"
                  className={styles.input}
                  value={dailyTraffic}
                  onChange={(e) => setDailyTraffic(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>

            <div className={styles.armBox}>
              <div className={styles.armHeading}>Statistical Power &amp; Significance</div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-plan-alpha`}>
                  Significance Level (α)
                </label>
                <select
                  id={`${id}-plan-alpha`}
                  className={styles.select}
                  value={sampleAlpha}
                  onChange={(e) => setSampleAlpha(parseFloat(e.target.value))}
                >
                  <option value={0.10}>α = 0.10 (90% Confidence)</option>
                  <option value={0.05}>α = 0.05 (95% Confidence, Standard)</option>
                  <option value={0.01}>α = 0.01 (99% Confidence)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={`${id}-plan-power`}>
                  Statistical Power (1 − β)
                </label>
                <select
                  id={`${id}-plan-power`}
                  className={styles.select}
                  value={samplePower}
                  onChange={(e) => setSamplePower(parseFloat(e.target.value))}
                >
                  <option value={0.80}>80% Power (Standard Default)</option>
                  <option value={0.85}>85% Power</option>
                  <option value={0.90}>90% Power</option>
                </select>
              </div>
            </div>
          </div>

          {sampleError && <div className={styles.warningBox}>{sampleError}</div>}

          {sampleSizeResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>REQUIRED SAMPLE SIZE PER ARM</div>
                <div className={styles.heroValue}>
                  {sampleSizeResult.sampleSizePerArm.toLocaleString()}
                </div>
                <div className={styles.heroSub}>
                  <span>Total: {sampleSizeResult.totalSampleSize.toLocaleString()} visitors</span>
                  {sampleSizeResult.daysNeeded !== null && (
                    <>
                      <span>·</span>
                      <span>Run Time: ~{sampleSizeResult.daysNeeded} days</span>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Control Baseline</span>
                  <span className={styles.metricValue}>{(sampleSizeResult.baselineRate * 100).toFixed(2)}%</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Target Variant</span>
                  <span className={styles.metricValue}>{(sampleSizeResult.targetRate * 100).toFixed(2)}%</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Relative MDE</span>
                  <span className={styles.metricValue}>+{(sampleSizeResult.relativeMde * 100).toFixed(1)}%</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Absolute Lift Needed</span>
                  <span className={styles.metricValue}>{(sampleSizeResult.absoluteMde * 100).toFixed(2)} pp</span>
                </div>
              </div>

              <div className={styles.sentence}>
                <strong>Mathematical Formula Used (Fleiss / Miller):</strong>
                <code style={{ display: 'block', marginTop: '6px', fontSize: '0.88rem' }}>
                  {sampleSizeResult.formula}
                </code>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 3: A/B/C MULTI-ARM */}
      {tab === 'multiVariant' && (
        <>
          <div className={styles.armBox}>
            <div className={styles.armHeading}>Multi-Arm Testing Configuration</div>
            <div className={styles.controlsRow}>
              <div className={styles.controlItem}>
                <label className={styles.controlLabel} htmlFor={`${id}-corr`}>
                  Family-Wise Correction Method:
                </label>
                <select
                  id={`${id}-corr`}
                  className={styles.select}
                  value={correctionMethod}
                  onChange={(e) => setCorrectionMethod(e.target.value as 'bonferroni' | 'sidak' | 'none')}
                >
                  <option value="bonferroni">Bonferroni (α / m) — Conservative &amp; Standard</option>
                  <option value="sidak">Šidák (1 − (1−α)^(1/m))</option>
                  <option value="none">None (Unadjusted, Higher False Positive Risk)</option>
                </select>
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--ink-soft)' }}>
                Comparing {variants.length} variant{variants.length > 1 ? 's' : ''} against Control (A)
              </div>
            </div>

            {/* Editable variant rows */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={styles.input}
                    style={{ width: '130px' }}
                    value={v.name}
                    onChange={(e) => {
                      const next = [...variants];
                      next[idx].name = e.target.value;
                      setVariants(next);
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Visitors:</span>
                    <input
                      type="number"
                      className={styles.input}
                      style={{ width: '110px' }}
                      value={v.visitors}
                      onChange={(e) => {
                        const next = [...variants];
                        next[idx].visitors = Math.max(1, parseInt(e.target.value) || 0);
                        setVariants(next);
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Conversions:</span>
                    <input
                      type="number"
                      className={styles.input}
                      style={{ width: '90px' }}
                      value={v.conversions}
                      onChange={(e) => {
                        const next = [...variants];
                        next[idx].conversions = Math.max(0, parseInt(e.target.value) || 0);
                        setVariants(next);
                      }}
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      className={styles.presetBtn}
                      style={{ color: '#EF4444' }}
                      onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
              ))}

              {variants.length < 4 && (
                <div>
                  <button
                    type="button"
                    className={styles.presetBtn}
                    onClick={() =>
                      setVariants([
                        ...variants,
                        { name: `Variant ${String.fromCharCode(66 + variants.length)}`, visitors: 10000, conversions: 580 },
                      ])
                    }
                  >
                    + Add Variant Arm
                  </button>
                </div>
              )}
            </div>
          </div>

          {multiError && <div className={styles.warningBox}>{multiError}</div>}

          {multiResult && (
            <div className={styles.resultsBand}>
              <div className={styles.sentence}>
                <strong>Family-Wise Error Control:</strong> With {multiResult.variants.length} simultaneous hypothesis tests, nominal α = {multiResult.nominalAlpha} is adjusted to <strong>α_adj = {multiResult.adjustedAlpha.toFixed(4)}</strong> via {multiResult.correctionMethod} to protect against false discovery inflation.
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Variant</th>
                      <th>Visitors</th>
                      <th>Conversions</th>
                      <th>Conv Rate</th>
                      <th>Lift vs Control</th>
                      <th>Raw p-value</th>
                      <th>Adjusted p-value</th>
                      <th>Significant?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: 'var(--bg)', fontWeight: 600 }}>
                      <td>{multiResult.control.name} (Control)</td>
                      <td>{multiResult.control.visitors.toLocaleString()}</td>
                      <td>{multiResult.control.conversions.toLocaleString()}</td>
                      <td>{(multiResult.control.rate * 100).toFixed(2)}%</td>
                      <td>—</td>
                      <td>—</td>
                      <td>—</td>
                      <td>Benchmark</td>
                    </tr>
                    {multiResult.variants.map((v, i) => (
                      <tr key={i}>
                        <td><strong>{v.name}</strong></td>
                        <td>{v.visitors.toLocaleString()}</td>
                        <td>{v.conversions.toLocaleString()}</td>
                        <td>{(v.rate * 100).toFixed(2)}%</td>
                        <td>
                          <strong style={{ color: v.relativeLift > 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {v.relativeLift > 0 ? '+' : ''}{v.relativeLift.toFixed(2)}%
                          </strong>
                        </td>
                        <td>{v.rawPValue.toFixed(4)}</td>
                        <td>{v.adjustedPValue.toFixed(4)}</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: v.isSignificant ? '#047857' : 'var(--line)',
                              color: v.isSignificant ? '#FFFFFF' : 'var(--ink)',
                            }}
                          >
                            {v.isSignificant ? 'Significant' : 'Not Sig'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
