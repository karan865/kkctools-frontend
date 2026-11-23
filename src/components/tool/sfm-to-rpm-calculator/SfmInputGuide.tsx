'use client';

import React from 'react';
import styles from './SfmInputGuide.module.css';

interface SfmInputGuideProps {
  tab: 'sfmToRpm' | 'rpmToSfm' | 'lineSpeed' | 'rpmChart';
  unit: 'inch' | 'metric';
  dia: number;
  sfmOrVc: number;
  rpm: number;
  focusedField?: string | null;
}

export default function SfmInputGuide({
  tab,
  unit,
  dia,
  sfmOrVc,
  rpm,
  focusedField,
}: SfmInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;
  const unitSuffix = unit === 'metric' ? 'mm' : 'in';
  const speedUnit = unit === 'metric' ? 'm/min' : 'SFM';

  if (tab === 'lineSpeed') {
    return (
      <details className={styles.guideWrapper} open>
        <summary className={styles.guideSummary}>
          <span className={styles.summaryTitle}>
            <span className={styles.summaryBadge}>Diagram</span> Roller &amp; Belt Line Speed Geometry
          </span>
          <span className={styles.summaryHint}>Click to collapse</span>
        </summary>
        <div className={styles.svgContainer}>
          <svg
            className={styles.diagramSvg}
            viewBox="0 0 680 200"
            role="img"
            aria-label="Conveyor roller and belt speed diagram showing diameter, rotation RPM, and linear speed"
          >
            {/* Drive Roller */}
            <g transform="translate(180, 100)">
              <circle cx="0" cy="0" r="65" className={styles.toolCircle} />
              <circle cx="0" cy="0" r="16" className={styles.centerHub} />

              {/* Roller Diameter line */}
              <g className={`${styles.callout} ${isFocused('rollerDia') ? styles.activeCallout : ''}`}>
                <line x1="0" y1="-65" x2="0" y2="65" className={styles.dimLine} />
                <circle cx="0" cy="-65" r="3.5" className={styles.dimDot} />
                <circle cx="0" cy="65" r="3.5" className={styles.dimDot} />
                <rect x="-85" y="-12" width="70" height="24" rx="4" className={styles.badgeBg} />
                <text x="-50" y="4" textAnchor="middle" className={styles.badgeText}>
                  D: {dia} {unitSuffix}
                </text>
              </g>

              {/* RPM spin arrow */}
              <g className={`${styles.callout} ${isFocused('rpm') ? styles.activeCallout : ''}`}>
                <path d="M 0,-30 A 30,30 0 1,1 -26,15" stroke="var(--cat-engineering)" strokeWidth="2.5" fill="none" />
                <polyline points="-32,10 -26,16 -20,10" stroke="var(--cat-engineering)" strokeWidth="2.5" fill="none" />
                <rect x="-35" y="-45" width="70" height="20" rx="4" className={styles.badgeBg} />
                <text x="0" y="-31" textAnchor="middle" className={styles.badgeText}>
                  {rpm > 0 ? `${Math.round(rpm)} RPM` : '— RPM'}
                </text>
              </g>
            </g>

            {/* Conveyor Belt running horizontally */}
            <g transform="translate(180, 35)">
              <line x1="0" y1="0" x2="380" y2="0" stroke="var(--cat-engineering-deep)" strokeWidth="5" />
              <line x1="0" y1="130" x2="380" y2="130" stroke="var(--cat-engineering-deep)" strokeWidth="5" />

              {/* Belt Speed Arrow */}
              <g className={`${styles.callout} ${isFocused('speed') ? styles.activeCallout : ''}`}>
                <line x1="120" y1="-14" x2="280" y2="-14" stroke="var(--cat-engineering)" strokeWidth="3" />
                <polyline points="268,-22 280,-14 268,-6" stroke="var(--cat-engineering)" strokeWidth="3" fill="none" />
                <rect x="140" y="-38" width="120" height="22" rx="4" className={styles.badgeBg} />
                <text x="200" y="-23" textAnchor="middle" className={styles.badgeText}>
                  Linear Belt Speed
                </text>
              </g>
            </g>

            <text x="440" y="105" textAnchor="middle" className={styles.captionText}>
              Line Speed = π × Effective Roller Dia × RPM
            </text>
          </svg>
        </div>
      </details>
    );
  }

  // Milling / Turning Tool / Workpiece Diagram
  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Cutting Circle &amp; Peripheral Surface Velocity
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 680 210"
          role="img"
          aria-label="Cutter tool circle showing diameter, peripheral surface speed arrow, and spindle RPM spin"
        >
          {/* Main Circle (Tool / Workpiece) */}
          <g transform="translate(230, 105)">
            <circle cx="0" cy="0" r="75" className={styles.toolCircle} />
            <circle cx="0" cy="0" r="14" className={styles.centerHub} />

            {/* 1 Diameter callout across center */}
            <g className={`${styles.callout} ${isFocused('dia') ? styles.activeCallout : ''}`}>
              <line x1="-75" y1="0" x2="75" y2="0" className={styles.dimLine} />
              <circle cx="-75" cy="0" r="3.5" className={styles.dimDot} />
              <circle cx="75" cy="0" r="3.5" className={styles.dimDot} />
              <rect x="-55" y="-12" width="110" height="24" rx="4" className={styles.badgeBg} />
              <text x="0" y="4" textAnchor="middle" className={styles.badgeText}>
                1 Diameter: {dia} {unitSuffix}
              </text>
            </g>

            {/* 2 Peripheral Surface Speed Arrow along outer rim */}
            <g className={`${styles.callout} ${isFocused('sfm') ? styles.activeCallout : ''}`}>
              <path d="M 0,-75 A 75,75 0 0,1 75,0" stroke="var(--cat-engineering)" strokeWidth="3" fill="none" />
              <polyline points="70,-12 75,2 85,-6" stroke="var(--cat-engineering)" strokeWidth="3" fill="none" />
              <rect x="35" y="-65" width="130" height="24" rx="4" className={styles.badgeBg} />
              <text x="100" y="-49" textAnchor="middle" className={styles.badgeText}>
                2 {sfmOrVc} {speedUnit}
              </text>
            </g>

            {/* 3 Spindle RPM spin at center */}
            <g className={`${styles.callout} ${isFocused('rpm') ? styles.activeCallout : ''}`}>
              <path d="M 0,-26 A 26,26 0 1,1 -22,12" stroke="var(--ink)" strokeWidth="2" fill="none" />
              <polyline points="-28,7 -22,13 -16,7" stroke="var(--ink)" strokeWidth="2" fill="none" />
              <rect x="-45" y="-45" width="90" height="20" rx="4" className={styles.badgeBg} />
              <text x="0" y="-31" textAnchor="middle" className={styles.badgeText}>
                3 {rpm > 0 ? `${Math.round(rpm)} RPM` : '— RPM'}
              </text>
            </g>
          </g>

          {/* Right explanation panel */}
          <g transform="translate(430, 45)">
            <rect x="0" y="0" width="220" height="120" rx="8" className={styles.badgeBg} />
            <text x="110" y="24" textAnchor="middle" className={styles.badgeText}>
              Circumference Principle
            </text>
            <text x="110" y="50" textAnchor="middle" className={styles.captionText}>
              One full revolution travels
            </text>
            <text x="110" y="70" textAnchor="middle" className={styles.badgeText} fill="var(--cat-engineering)">
              π × Diameter ({unit === 'metric' ? (dia * Math.PI).toFixed(1) + ' mm' : (dia * Math.PI).toFixed(3) + ' in'})
            </text>
            <text x="110" y="100" textAnchor="middle" className={styles.captionText}>
              {unit === 'metric' ? 'RPM = (1000 × Vc) ÷ (π × D)' : 'RPM = (12 × SFM) ÷ (π × D)'}
            </text>
          </g>
        </svg>
      </div>
    </details>
  );
}
