import React from 'react';
import styles from './FractionInputGuide.module.css';

interface FractionInputGuideProps {
  tab: 'fraction' | 'score' | 'percentage';
}

export default function FractionInputGuide({ tab }: FractionInputGuideProps) {
  if (tab === 'score') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Test Score to Percentage &amp; Grade Conversion</div>
        <div className={styles.visualRow}>
          <div className={styles.fractionBox}>
            <span className={styles.numerator}>16 Earned</span>
            <div className={styles.fractionBar} />
            <span className={styles.denominator}>20 Total</span>
          </div>
          <div className={styles.arrowEquation}>
            <span className={styles.eqLabel}>Percent Math</span>
            <span className={styles.eqFormula}>(Points Earned ÷ Total) × 100</span>
          </div>
          <div className={styles.resultBadge}>
            <div className={styles.resultVal}>80.0% (Grade B)</div>
            <div className={styles.resultTag}>+2 pts for A (90%)</div>
          </div>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ Earned or number wrong mode</span>
          <span className={styles.chip}>✓ Optional extra credit / bonus points</span>
          <span className={styles.chip}>✓ Customizable letter grade boundaries</span>
        </div>
      </div>
    );
  }

  if (tab === 'percentage') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Percentage Operations &amp; Number Relations</div>
        <div className={styles.visualRow}>
          <div className={styles.fractionBox}>
            <span className={styles.numerator}>15% Rate</span>
            <div className={styles.fractionBar} />
            <span className={styles.denominator}>80 Base Number</span>
          </div>
          <div className={styles.arrowEquation}>
            <span className={styles.eqLabel}>Formula</span>
            <span className={styles.eqFormula}>Result = (Rate ÷ 100) × Base</span>
          </div>
          <div className={styles.resultBadge}>
            <div className={styles.resultVal}>12.00</div>
            <div className={styles.resultTag}>15% of 80</div>
          </div>
        </div>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>✓ P% of X</span>
          <span className={styles.chip}>✓ X is what % of Y</span>
          <span className={styles.chip}>✓ X is P% of what (find whole)</span>
          <span className={styles.chip}>✓ Add or subtract P%</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Fraction to Percentage Conversion Mechanics</div>
      <div className={styles.visualRow}>
        <div className={styles.fractionBox}>
          <span className={styles.numerator}>4 Part (Numerator)</span>
          <div className={styles.fractionBar} />
          <span className={styles.denominator}>5 Whole (Denominator)</span>
        </div>
        <div className={styles.arrowEquation}>
          <span className={styles.eqLabel}>Division &amp; Scale</span>
          <span className={styles.eqFormula}>0.80 × 100%</span>
        </div>
        <div className={styles.resultBadge}>
          <div className={styles.resultVal}>80%</div>
          <div className={styles.resultTag}>Simplified: 4/5</div>
        </div>
      </div>
      <div className={styles.chipsRow}>
        <span className={styles.chip}>✓ Proper fractions (4/5, 3/8)</span>
        <span className={styles.chip}>✓ Repeating decimals marked (1/3 = 33.3̅%)</span>
        <span className={styles.chip}>✓ Mixed numbers (1 1/4 = 125%)</span>
        <span className={styles.chip}>✓ Decimal to fraction &amp; %</span>
      </div>
    </div>
  );
}
