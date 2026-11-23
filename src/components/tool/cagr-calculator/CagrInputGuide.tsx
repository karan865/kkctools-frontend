import React from 'react';
import styles from './CagrInputGuide.module.css';

interface CagrInputGuideProps {
  tab: 'cagr' | 'series' | 'doubling';
}

export default function CagrInputGuide({ tab }: CagrInputGuideProps) {
  if (tab === 'series') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Historical Series: Compound Growth vs Arithmetic Average</div>
        <div className={styles.seriesVisual}>
          <div className={styles.seriesBox}>
            <span className={styles.seriesTag}>ACTUAL PATH</span>
            <strong>Jagged Yearly Returns</strong>
            <span className={styles.seriesSub}>e.g. −50%, +30%, +20% (Avg = 0.0%)</span>
          </div>
          <div className={styles.vsBadge}>vs</div>
          <div className={styles.seriesBoxHighlight}>
            <span className={styles.seriesTagHighlight}>TRUE RATE</span>
            <strong>Geometric CAGR</strong>
            <span className={styles.seriesSubHighlight}>= −7.95% per year (Capital shrank to 78%)</span>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'doubling') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Doubling Time &amp; The Rule of 72</div>
        <div className={styles.doublingBanner}>
          <div className={styles.doublingFormula}>
            <span className={styles.ruleLabel}>Mental Math Shortcut:</span>
            <strong>Years to Double ≈ 72 ÷ Growth Rate (%)</strong>
          </div>
          <div className={styles.doublingExact}>
            <span className={styles.ruleLabel}>Exact Equation:</span>
            <strong>Years = ln(2) ÷ ln(1 + r)</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Compound Annual Growth Rate (CAGR) Trajectory</div>
      <div className={styles.curveRoadmap}>
        <div className={styles.nodeCard}>
          <span className={styles.nodeBadge}>1</span>
          <div className={styles.nodeContent}>
            <div className={styles.nodeTitle}>Starting Value</div>
            <div className={styles.nodeDetail}>Initial investment / revenue</div>
          </div>
        </div>

        <div className={styles.curveMiddle}>
          <div className={styles.curveLabel}>Smoothed Exponential Rate</div>
          <div className={styles.curveEquation}>CAGR = (End ÷ Start)^(1 ÷ Years) − 1</div>
        </div>

        <div className={styles.nodeCard}>
          <span className={styles.nodeBadgeEnd}>2</span>
          <div className={styles.nodeContent}>
            <div className={styles.nodeTitle}>Ending Value</div>
            <div className={styles.nodeDetail}>Final portfolio value</div>
          </div>
        </div>
      </div>

      <div className={styles.chipsRow}>
        <span className={styles.chip}>✓ Solves any 1 of 4 variables</span>
        <span className={styles.chip}>✓ Filled Excel &amp; Sheets formulas</span>
        <span className={styles.chip}>✓ Optional inflation adjustment</span>
      </div>
    </div>
  );
}
