import React from 'react';
import styles from './AbInputGuide.module.css';

interface AbInputGuideProps {
  tab: 'test' | 'sampleSize' | 'multiVariant';
  controlRate?: number;
  variantRate?: number;
}

export default function AbInputGuide({ tab, controlRate = 0.05, variantRate = 0.057 }: AbInputGuideProps) {
  const cRatePct = (controlRate * 100).toFixed(1);
  const vRatePct = (variantRate * 100).toFixed(1);

  if (tab === 'sampleSize') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Sample Size &amp; Duration Roadmap</div>
        <div className={styles.flow}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepLabel}>Baseline Rate</div>
            <div className={styles.stepDetail}>Current conversion %</div>
          </div>
          <div className={styles.arrow}>+</div>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepLabel}>Minimum Detectable Effect (MDE)</div>
            <div className={styles.stepDetail}>Target lift to detect</div>
          </div>
          <div className={styles.arrow}>&rarr;</div>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepLabel}>Power &amp; Significance</div>
            <div className={styles.stepDetail}>80% power · α = 0.05</div>
          </div>
          <div className={styles.arrow}>=</div>
          <div className={styles.resultPill}>
            <span className={styles.pillTag}>OUTPUT</span>
            <strong>Visitors per Arm &amp; Days</strong>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'multiVariant') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Multi-Arm Testing (A/B/C) with Family-Wise Error Control</div>
        <div className={styles.flow}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>A</div>
            <div className={styles.stepLabel}>Control</div>
            <div className={styles.stepDetail}>Baseline benchmark</div>
          </div>
          <div className={styles.arrow}>vs</div>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>B, C, D</div>
            <div className={styles.stepLabel}>Variants</div>
            <div className={styles.stepDetail}>Up to 4 treatments</div>
          </div>
          <div className={styles.arrow}>&rarr;</div>
          <div className={styles.resultPill}>
            <span className={styles.pillTag}>CORRECTION</span>
            <strong>Bonferroni / Šidák Adjusted α</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Two-Proportion Z-Test Funnel Architecture</div>
      <div className={styles.funnelGrid}>
        {/* Arm A */}
        <div className={styles.armCard}>
          <div className={styles.armHeader}>
            <span className={styles.armBadgeA}>A</span>
            <span className={styles.armName}>Control Arm</span>
          </div>
          <div className={styles.funnelTop}>
            <span className={styles.stageLabel}>1 Visitors</span>
          </div>
          <div className={styles.funnelMid}>
            <span className={styles.rateBadge}>{cRatePct}% Conv Rate</span>
          </div>
          <div className={styles.funnelBottom}>
            <span className={styles.stageLabel}>2 Conversions</span>
          </div>
        </div>

        <div className={styles.vsBadge}>VS</div>

        {/* Arm B */}
        <div className={styles.armCard}>
          <div className={styles.armHeader}>
            <span className={styles.armBadgeB}>B</span>
            <span className={styles.armName}>Variant Arm</span>
          </div>
          <div className={styles.funnelTop}>
            <span className={styles.stageLabel}>1 Visitors</span>
          </div>
          <div className={styles.funnelMid}>
            <span className={styles.rateBadgeVariant}>{vRatePct}% Conv Rate</span>
          </div>
          <div className={styles.funnelBottom}>
            <span className={styles.stageLabel}>2 Conversions</span>
          </div>
        </div>

        {/* Engine specs */}
        <div className={styles.testSpecsCard}>
          <div className={styles.specItem}>
            <span className={styles.specNum}>3</span>
            <div>
              <strong>Confidence Level</strong>
              <div className={styles.specSub}>90%, 95% (standard) or 99%</div>
            </div>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specNum}>4</span>
            <div>
              <strong>Two-Sided Default</strong>
              <div className={styles.specSub}>Detects both positive &amp; negative shifts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
