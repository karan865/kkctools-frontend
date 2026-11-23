import React from 'react';
import styles from './StdevInputGuide.module.css';

interface StdevInputGuideProps {
  tab: 'raw' | 'frequency' | 'grouped';
}

export default function StdevInputGuide({ tab }: StdevInputGuideProps) {
  if (tab === 'frequency') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Weighted Frequency Table (Value : Count)</div>
        <div className={styles.visualPlot}>
          <svg className={styles.plotSvg} viewBox="0 0 540 80">
            <rect x="40" y="15" width="130" height="45" rx="6" fill="var(--surface)" stroke="var(--line)" />
            <text x="105" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cat-math-deep)">Score: 85</text>
            <text x="105" y="50" textAnchor="middle" fontSize="9" fill="var(--ink-muted)">Frequency: 14 students</text>

            <path d="M190 38 h40" stroke="var(--cat-math)" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="250" y="15" width="250" height="45" rx="6" fill="var(--cat-math-soft)" stroke="var(--cat-math)" />
            <text x="375" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cat-math-ink)">Weighted Sample SD</text>
            <text x="375" y="49" textAnchor="middle" fontSize="9.5" fill="var(--ink)">Total n = Σf · Weights each point</text>
          </svg>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Formats: value, frequency or value:count</span>
          <span className={styles.chip}>✓ Calculates weighted mean &amp; sample variance</span>
        </div>
      </div>
    );
  }

  if (tab === 'grouped') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Grouped Continuous Classes (Midpoint Estimates)</div>
        <div className={styles.visualPlot}>
          <svg className={styles.plotSvg} viewBox="0 0 540 80">
            <rect x="40" y="20" width="80" height="40" rx="4" fill="var(--surface)" stroke="var(--line)" />
            <text x="80" y="43" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">10 – 20</text>

            <rect x="130" y="10" width="80" height="50" rx="4" fill="var(--cat-math-soft)" stroke="var(--cat-math)" />
            <text x="170" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--cat-math-deep)">20 – 30</text>

            <rect x="220" y="25" width="80" height="35" rx="4" fill="var(--surface)" stroke="var(--line)" />
            <text x="260" y="45" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">30 – 40</text>

            <text x="420" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">Estimated SD</text>
            <text x="420" y="50" textAnchor="middle" fontSize="9" fill="var(--ink-muted)">Using Class Midpoint (m_i)</text>
          </svg>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Enter class bins: e.g. 10-20, 20-30</span>
          <span className={styles.chip}>✓ Flagged clearly as estimate of population</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Normal Curve &amp; Dispersion Anatomy (x̄ = 5, s = 2.138)</div>
      <div className={styles.visualPlot}>
        <svg className={styles.plotSvg} viewBox="0 0 540 80">
          {/* ±1 SD shaded zone */}
          <rect x="180" y="10" width="180" height="55" rx="6" fill="var(--cat-math-soft)" opacity="0.8" />
          <text x="270" y="24" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--cat-math-deep)">
            ±1 SD Zone (~68% of normal data)
          </text>

          {/* Center mean line */}
          <line x1="270" y1="10" x2="270" y2="65" stroke="var(--cat-math)" strokeWidth="2.5" />
          <text x="270" y="60" textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--cat-math-ink)">Mean x̄</text>

          {/* Dots */}
          <circle cx="120" cy="50" r="5" fill="#0D9488" />
          <circle cx="210" cy="50" r="5" fill="#4338CA" />
          <circle cx="250" cy="50" r="5" fill="#4338CA" />
          <circle cx="270" cy="38" r="5" fill="#4338CA" />
          <circle cx="290" cy="50" r="5" fill="#4338CA" />
          <circle cx="330" cy="50" r="5" fill="#4338CA" />
          <circle cx="430" cy="50" r="5" fill="#0D9488" />

          {/* Axis */}
          <line x1="40" y1="65" x2="500" y2="65" stroke="var(--line)" strokeWidth="1.5" />
        </svg>
      </div>
      <div className={styles.chipsRow}>
        <span className={styles.chip}>✓ Sample SD (s, n − 1 divisor) vs Population SD (σ, n divisor)</span>
        <span className={styles.chip}>✓ Full descriptive table: Mean, Median, Mode, SE, Variance, CV</span>
        <span className={styles.chip}>✓ Step-by-step deviations table</span>
      </div>
    </div>
  );
}
