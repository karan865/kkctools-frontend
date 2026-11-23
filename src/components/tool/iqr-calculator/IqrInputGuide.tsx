'use client';

import React from 'react';
import styles from './IqrInputGuide.module.css';

interface IqrInputGuideProps {
  tab: 'iqr' | 'compare';
  q1?: number;
  medianVal?: number;
  q3?: number;
  iqr?: number;
  methodName?: string;
  focusedField?: string | null;
}

export default function IqrInputGuide({
  tab,
  q1 = 4,
  medianVal = 8,
  q3 = 12,
  iqr = 8,
  methodName = 'Tukey (Median Excluded)',
  focusedField,
}: IqrInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Five-Number Summary &amp; Box Plot Guide
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 720 180"
          role="img"
          aria-label="Five-number summary box plot diagram with Q1, median, Q3, fences, and outliers"
        >
          <g transform="translate(40, 20)">
            {/* Callout 1: Data Input Strip */}
            <g transform="translate(140, 0)" className={isFocused('data') ? styles.highlight : ''}>
              <circle cx="0" cy="12" r="9" className={styles.badgeCircle} />
              <text x="0" y="16" textAnchor="middle" className={styles.labelNumber}>1</text>
              <text x="18" y="16" className={styles.labelText}>
                Dataset: Values sorted from lowest to highest
              </text>
            </g>

            {/* Callout 2: Method badge */}
            <g transform="translate(450, 0)" className={isFocused('method') ? styles.highlight : ''}>
              <circle cx="0" cy="12" r="9" className={styles.badgeCircle} />
              <text x="0" y="16" textAnchor="middle" className={styles.labelNumber}>2</text>
              <text x="18" y="16" className={styles.labelText}>
                Method: {methodName}
              </text>
            </g>

            {/* Timeline / Scale Line */}
            <line x1="50" y1="90" x2="590" y2="90" className={styles.axisLine} />

            {/* Left Fence (1.5 IQR) */}
            <line x1="100" y1="60" x2="100" y2="120" className={styles.fenceLine} />
            <text x="100" y="135" textAnchor="middle" className={styles.labelMuted}>
              Lower Fence (Q1 − 1.5×IQR)
            </text>

            {/* Left Whisker */}
            <line x1="140" y1="90" x2="220" y2="90" className={styles.whiskerLine} />
            <line x1="140" y1="75" x2="140" y2="105" className={styles.whiskerEnd} />
            <text x="140" y="68" textAnchor="middle" className={styles.labelMuted}>
              Min (in fence)
            </text>

            {/* Box (Q1 to Q3) */}
            <rect x="220" y="55" width="200" height="70" rx="4" className={styles.boxRect} />

            {/* Q1 Marker */}
            <line x1="220" y1="55" x2="220" y2="125" stroke="#4F46E5" strokeWidth="2.5" />
            <text x="220" y="45" textAnchor="middle" fontWeight="bold" fill="#4F46E5" className={styles.labelText}>
              Q1 ({q1})
            </text>
            <text x="220" y="142" textAnchor="middle" className={styles.labelMuted}>25th percentile</text>

            {/* Median Line */}
            <line x1="320" y1="55" x2="320" y2="125" className={styles.medianLine} />
            <text x="320" y="45" textAnchor="middle" fontWeight="bold" fill="#0D9488" className={styles.labelText}>
              Median ({medianVal})
            </text>
            <text x="320" y="142" textAnchor="middle" className={styles.labelMuted}>50th percentile</text>

            {/* Q3 Marker */}
            <line x1="420" y1="55" x2="420" y2="125" stroke="#4F46E5" strokeWidth="2.5" />
            <text x="420" y="45" textAnchor="middle" fontWeight="bold" fill="#4F46E5" className={styles.labelText}>
              Q3 ({q3})
            </text>
            <text x="420" y="142" textAnchor="middle" className={styles.labelMuted}>75th percentile</text>

            {/* Right Whisker */}
            <line x1="420" y1="90" x2="500" y2="90" className={styles.whiskerLine} />
            <line x1="500" y1="75" x2="500" y2="105" className={styles.whiskerEnd} />
            <text x="500" y="68" textAnchor="middle" className={styles.labelMuted}>
              Max (in fence)
            </text>

            {/* Right Fence */}
            <line x1="540" y1="60" x2="540" y2="120" className={styles.fenceLine} />
            <text x="540" y="135" textAnchor="middle" className={styles.labelMuted}>
              Upper Fence (Q3 + 1.5×IQR)
            </text>

            {/* Outlier Dots */}
            <circle cx="60" cy="90" r="5" className={styles.outlierDot} />
            <text x="60" y="75" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold">Outlier</text>

            {/* Bracket over Box: IQR */}
            <path d="M 220 50 Q 320 30 420 50" fill="none" stroke="#4F46E5" strokeWidth="1.8" />
            <text x="320" y="26" textAnchor="middle" fill="#4F46E5" fontWeight="bold" fontSize="12">
              IQR = Q3 − Q1 = {iqr}
            </text>
          </g>
        </svg>
      </div>
    </details>
  );
}
