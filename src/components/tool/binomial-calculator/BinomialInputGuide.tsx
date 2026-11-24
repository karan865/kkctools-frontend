import React from 'react';
import styles from './BinomialInputGuide.module.css';

interface BinomialInputGuideProps {
  tab: 'probability' | 'inverse' | 'normal';
}

export default function BinomialInputGuide({ tab }: BinomialInputGuideProps) {
  if (tab === 'inverse') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Inverse Mode · Minimum Trials Needed for at Least 1 Success</div>
        <div className={styles.visualPlot}>
          <svg className={styles.plotSvg} viewBox="0 0 540 85">
            {/* Target Probability Box */}
            <rect x="30" y="16" width="160" height="52" rx="8" fill="var(--cat-math-soft)" stroke="var(--cat-math)" />
            <text x="110" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cat-math-ink)">Target Confidence P(X ≥ 1)</text>
            <text x="110" y="53" textAnchor="middle" fontSize="9.5" fill="var(--ink)">e.g. 99.99% (0.9999)</text>

            <path d="M200 42 h30" stroke="var(--ink-muted)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Trial Rate Box */}
            <rect x="240" y="16" width="130" height="52" rx="8" fill="var(--surface)" stroke="var(--line)" />
            <text x="305" y="37" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ink)">Event Rate (p)</text>
            <text x="305" y="53" textAnchor="middle" fontSize="9.5" fill="var(--ink-muted)">e.g. 1% (0.01)</text>

            <path d="M380 42 h30" stroke="var(--cat-math)" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Result Box */}
            <rect x="420" y="16" width="95" height="52" rx="8" fill="#312E81" />
            <text x="467" y="36" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">Trials (n)</text>
            <text x="467" y="54" textAnchor="middle" fontSize="12" fontWeight="800" fill="#38BDF8">917</text>
          </svg>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Formula: n ≥ ln(1 − P) ÷ ln(1 − p)</span>
          <span className={styles.chip}>✓ Evaluates rare-event exposure requirements</span>
          <span className={styles.chip}>✓ Guaranteed integer ceiling calculation</span>
        </div>
      </div>
    );
  }

  if (tab === 'normal') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Normal Approximation Criteria · Continuity Correction (±0.5)</div>
        <div className={styles.visualPlot}>
          <svg className={styles.plotSvg} viewBox="0 0 540 85">
            {/* Criteria Badges */}
            <rect x="40" y="18" width="130" height="48" rx="6" fill="var(--surface)" stroke="var(--line)" />
            <text x="105" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0D9488">np ≥ 10</text>
            <text x="105" y="52" textAnchor="middle" fontSize="9.5" fill="var(--ink-muted)">Expected Successes</text>

            <text x="185" y="46" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">&amp;</text>

            <rect x="200" y="18" width="130" height="48" rx="6" fill="var(--surface)" stroke="var(--line)" />
            <text x="265" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4338CA">n(1 − p) ≥ 10</text>
            <text x="265" y="52" textAnchor="middle" fontSize="9.5" fill="var(--ink-muted)">Expected Failures</text>

            {/* Continuous Curve vs Discrete Bar */}
            <rect x="375" y="16" width="130" height="52" rx="8" fill="var(--cat-math-soft)" stroke="var(--cat-math)" />
            <text x="440" y="36" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--cat-math-ink)">Continuity ±0.5</text>
            <text x="440" y="52" textAnchor="middle" fontSize="9.5" fill="var(--ink)">P(X ≤ k) ≈ Φ((k+0.5−μ)/σ)</text>
          </svg>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Standard Rule: np ≥ 10 and n(1 − p) ≥ 10</span>
          <span className={styles.chip}>✓ Continuity correction bridges discrete &amp; continuous CDFs</span>
          <span className={styles.chip}>✓ Shows exact error vs binomial truth</span>
        </div>
      </div>
    );
  }

  // Probability Tab (Default)
  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Binomial Experiment · n Trials, p Success Rate, k Target</div>
      <div className={styles.visualPlot}>
        <svg className={styles.plotSvg} viewBox="0 0 540 85">
          {/* Trial Coins */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const isSuccess = i < 3;
            return (
              <g key={i} transform={`translate(${45 + i * 26}, 16)`}>
                <circle
                  cx="10"
                  cy="12"
                  r="10"
                  fill={isSuccess ? '#0D9488' : 'var(--surface)'}
                  stroke={isSuccess ? '#0F766E' : 'var(--line)'}
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="16"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="700"
                  fill={isSuccess ? '#FFFFFF' : 'var(--ink-muted)'}
                >
                  {isSuccess ? '✓' : '✗'}
                </text>
              </g>
            );
          })}
          <text x="162" y="52" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--ink)">
            ① n = 10 Trials · ② k = 3 Successes
          </text>

          {/* Probability Dial / Formula */}
          <rect x="330" y="14" width="180" height="54" rx="8" fill="var(--cat-math-soft)" stroke="var(--cat-math)" />
          <text x="420" y="34" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--cat-math-ink)">
            ③ p = 0.5 per trial
          </text>
          <text x="420" y="52" textAnchor="middle" fontSize="9.5" fill="var(--ink)">
            ④ P(X = 3) = C(10,3) · 0.5³ · 0.5⁷ = 0.1172
          </text>
        </svg>
      </div>
      <div className={styles.chipsRow}>
        <span className={styles.chip}>✓ ① Fixed number of independent trials (n)</span>
        <span className={styles.chip}>✓ ② Exactly two outcomes (Success vs Failure)</span>
        <span className={styles.chip}>✓ ③ Constant probability of success (p)</span>
        <span className={styles.chip}>✓ ④ Select =, ≤, &lt;, ≥, &gt;, or Between [k₁, k₂]</span>
      </div>
    </div>
  );
}
