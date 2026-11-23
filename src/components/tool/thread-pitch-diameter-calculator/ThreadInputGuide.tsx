'use client';

import React from 'react';
import styles from './ThreadInputGuide.module.css';

interface ThreadInputGuideProps {
  tab: 'pitch' | 'tapdrill' | 'threewire' | 'converter';
  standard: 'metric' | 'unified' | 'acme' | 'trapezoidal';
  nominalDia: number;
  pitch: number;
  pitchDia: number;
  minorDia: number;
  unitSuffix: string;
  focusedField?: string | null;
}

export default function ThreadInputGuide({
  tab,
  standard,
  nominalDia,
  pitch,
  pitchDia,
  minorDia,
  unitSuffix,
  focusedField,
}: ThreadInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;
  const flankAngle = standard === 'acme' ? '29°' : standard === 'trapezoidal' ? '30°' : '60°';

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> {flankAngle} Thread Tooth Geometry &amp; Pitch Line
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 700 220"
          role="img"
          aria-label="Screw thread sawtooth profile diagram showing major diameter, pitch diameter line, minor diameter, and pitch width"
        >
          {/* Thread Sawtooth Profile Cross-Section */}
          <g transform="translate(60, 45)">
            {/* Thread solid core */}
            <path
              d="
                M 0,110
                L 0,20
                L 40,90
                L 80,20
                L 120,90
                L 160,20
                L 200,90
                L 240,20
                L 280,90
                L 320,20
                L 360,90
                L 400,20
                L 440,90
                L 440,110
                Z
              "
              className={styles.threadProfile}
            />

            {/* Pitch Diameter Reference Line (where ridge and groove widths are equal) */}
            <g className={`${styles.callout} ${isFocused('d2') ? styles.activeCallout : ''}`}>
              <line x1="0" y1="55" x2="440" y2="55" className={styles.pitchLine} />
              <rect x="150" y="43" width="180" height="24" rx="4" className={styles.badgeBg} />
              <text x="240" y="59" textAnchor="middle" className={styles.badgeText}>
                Pitch Dia (d₂): {pitchDia.toFixed(3)} {unitSuffix}
              </text>
            </g>

            {/* Major Diameter Line at Crests */}
            <g className={`${styles.callout} ${isFocused('d') ? styles.activeCallout : ''}`}>
              <line x1="0" y1="20" x2="440" y2="20" className={styles.dimLine} />
              <circle cx="80" cy="20" r="3" className={styles.dimDot} />
              <circle cx="240" cy="20" r="3" className={styles.dimDot} />
              <rect x="20" y="6" width="150" height="22" rx="4" className={styles.badgeBg} />
              <text x="95" y="21" textAnchor="middle" className={styles.badgeText}>
                Major Dia: {nominalDia} {unitSuffix}
              </text>
            </g>

            {/* Minor Diameter Line at Roots */}
            <g className={`${styles.callout} ${isFocused('d1') ? styles.activeCallout : ''}`}>
              <line x1="0" y1="90" x2="440" y2="90" className={styles.dimLine} />
              <circle cx="120" cy="90" r="3" className={styles.dimDot} />
              <circle cx="280" cy="90" r="3" className={styles.dimDot} />
              <rect x="30" y="96" width="160" height="22" rx="4" className={styles.badgeBg} />
              <text x="110" y="111" textAnchor="middle" className={styles.badgeText}>
                Minor Root Dia: {minorDia.toFixed(3)} {unitSuffix}
              </text>
            </g>

            {/* Pitch (P) Dimension between adjacent crests */}
            <g className={`${styles.callout} ${isFocused('pitch') ? styles.activeCallout : ''}`}>
              <line x1="160" y1="-8" x2="240" y2="-8" className={styles.dimLine} />
              <circle cx="160" cy="-8" r="3" className={styles.dimDot} />
              <circle cx="240" cy="-8" r="3" className={styles.dimDot} />
              <rect x="175" y="-22" width="110" height="20" rx="3" className={styles.badgeBg} />
              <text x="230" y="-8" textAnchor="middle" className={styles.badgeText}>
                Pitch (P): {pitch} {unitSuffix}
              </text>
            </g>

            {/* Three-Wire Mode: Wires sitting in thread roots */}
            {tab === 'threewire' && (
              <g>
                <circle cx="120" cy="55" r="22" className={styles.wireCircle} />
                <circle cx="200" cy="55" r="22" className={styles.wireCircle} />
                <circle cx="280" cy="55" r="22" className={styles.wireCircle} />
                <rect x="330" y="70" width="150" height="22" rx="4" className={styles.badgeBg} />
                <text x="405" y="85" textAnchor="middle" className={styles.badgeText}>
                  Wires in Flank Contact
                </text>
              </g>
            )}
          </g>

          {/* Right Explanation Box */}
          <g transform="translate(520, 45)">
            <rect x="0" y="0" width="165" height="135" rx="8" className={styles.badgeBg} />
            <text x="82" y="24" textAnchor="middle" className={styles.badgeText}>
              {flankAngle} Thread Angle
            </text>
            <text x="82" y="50" textAnchor="middle" className={styles.captionText}>
              d₂ = d − 0.6495 × P
            </text>
            <text x="82" y="72" textAnchor="middle" className={styles.captionText}>
              (Ridge width = Groove width)
            </text>
            <text x="82" y="100" textAnchor="middle" className={styles.badgeText} fill="var(--cat-engineering)">
              Standard: {standard.toUpperCase()}
            </text>
            <text x="82" y="122" textAnchor="middle" className={styles.captionText}>
              Basic zero-tolerance
            </text>
          </g>
        </svg>
      </div>
    </details>
  );
}
