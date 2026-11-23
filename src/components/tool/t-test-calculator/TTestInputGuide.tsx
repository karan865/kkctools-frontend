import React from 'react';
import styles from './TTestInputGuide.module.css';

interface TTestInputGuideProps {
  tab: 'two_sample' | 'paired' | 'one_sample';
}

export default function TTestInputGuide({ tab }: TTestInputGuideProps) {
  if (tab === 'paired') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Paired (Dependent) t-Test · Pre-Post or Matched Pairs</div>
        <div className={styles.visualPlot}>
          <svg className={styles.plotSvg} viewBox="0 0 540 85">
            {/* Pair 1 */}
            <circle cx="80" cy="55" r="5" fill="var(--cat-math-deep)" />
            <text x="80" y="74" textAnchor="middle" fontSize="9.5" fill="var(--ink-muted)">Pre (x₁)</text>
            <line x1="85" y1="55" x2="155" y2="28" stroke="var(--cat-math)" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="160" cy="28" r="5" fill="var(--cat-math)" />
            <text x="160" y="18" textAnchor="middle" fontSize="9.5" fill="var(--cat-math-ink)" fontWeight="600">Post (x₂)</text>
            <text x="122" y="36" textAnchor="middle" fontSize="9" fill="var(--ink-muted)">d₁</text>

            {/* Pair 2 */}
            <circle cx="230" cy="62" r="5" fill="var(--cat-math-deep)" />
            <line x1="235" y1="62" x2="305" y2="34" stroke="var(--cat-math)" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="310" cy="34" r="5" fill="var(--cat-math)" />
            <text x="272" y="42" textAnchor="middle" fontSize="9" fill="var(--ink-muted)">d₂</text>

            {/* Difference distribution */}
            <rect x="360" y="16" width="160" height="52" rx="8" fill="var(--cat-math-soft)" stroke="var(--cat-math)" />
            <text x="440" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cat-math-ink)">Mean Difference d̄</text>
            <text x="440" y="52" textAnchor="middle" fontSize="9.5" fill="var(--ink)">t = d̄ ÷ (s_d / √n) · df = n − 1</text>
          </svg>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Subtracts pairs to evaluate mean change d̄</span>
          <span className={styles.chip}>✓ Degrees of freedom: df = n − 1</span>
          <span className={styles.chip}>✓ Settings: α = 0.05 · Two-tailed default</span>
        </div>
      </div>
    );
  }

  if (tab === 'one_sample') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>One-Sample t-Test · Sample Mean vs Known Standard (μ₀)</div>
        <div className={styles.visualPlot}>
          <svg className={styles.plotSvg} viewBox="0 0 540 85">
            {/* Hypothesized mean vertical line */}
            <line x1="150" y1="12" x2="150" y2="70" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
            <text x="150" y="80" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#EF4444">μ₀ (Standard)</text>

            {/* Sample curve */}
            <path d="M120 70 Q240 70, 290 22 Q340 70, 460 70" fill="none" stroke="var(--cat-math)" strokeWidth="2.2" />
            <line x1="290" y1="22" x2="290" y2="70" stroke="var(--cat-math)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="290" y="80" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--cat-math-ink)">Sample Mean (x̄)</text>

            {/* Gap bracket */}
            <path d="M152 40 h134" stroke="var(--ink-muted)" strokeWidth="1.2" />
            <text x="219" y="34" textAnchor="middle" fontSize="9" fill="var(--ink)">Difference: x̄ − μ₀</text>
          </svg>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Compares sample average against benchmark μ₀</span>
          <span className={styles.chip}>✓ Degrees of freedom: df = n − 1</span>
          <span className={styles.chip}>✓ Tests if discrepancy exceeds sampling variance</span>
        </div>
      </div>
    );
  }

  // Two-sample (default)
  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Two-Sample Independent t-Test · Welch (Default) &amp; Student&apos;s Pooled</div>
      <div className={styles.visualPlot}>
        <svg className={styles.plotSvg} viewBox="0 0 540 85">
          {/* Curve 1 */}
          <path d="M40 70 Q140 70, 180 24 Q220 70, 320 70" fill="none" stroke="#0D9488" strokeWidth="2.2" />
          <line x1="180" y1="24" x2="180" y2="70" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="180" y="80" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0D9488">Group 1 Mean (x̄₁)</text>

          {/* Curve 2 */}
          <path d="M220 70 Q320 70, 360 28 Q400 70, 500 70" fill="none" stroke="#4338CA" strokeWidth="2.2" />
          <line x1="360" y1="28" x2="360" y2="70" stroke="#4338CA" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="360" y="80" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#4338CA">Group 2 Mean (x̄₂)</text>

          {/* Difference bracket */}
          <line x1="184" y1="36" x2="356" y2="36" stroke="var(--ink)" strokeWidth="1.4" markerEnd="url(#arrow)" />
          <rect x="238" y="24" width="64" height="20" rx="4" fill="var(--surface)" stroke="var(--line)" />
          <text x="270" y="38" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink)">x̄₁ − x̄₂</text>
        </svg>
      </div>
      <div className={styles.chipsRow}>
        <span className={styles.chip}>✓ ① Sample Sizes (n₁, n₂)</span>
        <span className={styles.chip}>✓ ② Group Means (x̄₁, x̄₂)</span>
        <span className={styles.chip}>✓ ③ Standard Deviations (s₁, s₂)</span>
        <span className={styles.chip}>✓ Welch default: robust to unequal variances</span>
      </div>
    </div>
  );
}
