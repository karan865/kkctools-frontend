'use client';

import React from 'react';
import styles from './PulleyInputGuide.module.css';

interface PulleyInputGuideProps {
  tab: 'pulley' | 'belt' | 'multistage' | 'wheel';
  unit: 'inch' | 'metric';
  driverDia: number;
  drivenDia: number;
  driverRpm: number;
  drivenRpm: number;
  centreDistance: number;
  beltSpeedFtMin: number;
  focusedField?: string | null;
}

export default function PulleyInputGuide({
  tab,
  unit,
  driverDia,
  drivenDia,
  driverRpm,
  drivenRpm,
  centreDistance,
  beltSpeedFtMin,
  focusedField,
}: PulleyInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;
  const unitSuffix = unit === 'metric' ? 'mm' : 'in';

  if (tab === 'wheel') {
    return (
      <details className={styles.guideWrapper} open>
        <summary className={styles.guideSummary}>
          <span className={styles.summaryTitle}>
            <span className={styles.summaryBadge}>Diagram</span> Wheel Rolling Geometry &amp; Vehicle Speed
          </span>
          <span className={styles.summaryHint}>Click to collapse</span>
        </summary>
        <div className={styles.svgContainer}>
          <svg
            className={styles.diagramSvg}
            viewBox="0 0 700 200"
            role="img"
            aria-label="Wheel rolling kinematics diagram showing tire diameter, axle rotational RPM, and forward ground velocity"
          >
            {/* Ground Line */}
            <line x1="40" y1="165" x2="660" y2="165" stroke="var(--ink)" strokeWidth="3" />
            <line x1="40" y1="168" x2="660" y2="168" stroke="var(--line)" strokeWidth="1" strokeDasharray="6 4" />

            {/* Rolling Wheel */}
            <g transform="translate(220, 95)">
              <circle cx="0" cy="0" r="68" className={styles.pulleyCircle} />
              <circle cx="0" cy="0" r="18" className={styles.pulleyHub} />

              {/* Diameter Line */}
              <g className={`${styles.callout} ${isFocused('wheelDia') ? styles.activeCallout : ''}`}>
                <line x1="0" y1="-68" x2="0" y2="68" className={styles.dimLine} />
                <circle cx="0" cy="-68" r="3.5" className={styles.dimDot} />
                <circle cx="0" cy="68" r="3.5" className={styles.dimDot} />
                <rect x="-85" y="-12" width="70" height="24" rx="4" className={styles.badgeBg} />
                <text x="-50" y="4" textAnchor="middle" className={styles.badgeText}>
                  D: {driverDia} {unitSuffix}
                </text>
              </g>

              {/* Axle RPM arrow */}
              <g className={`${styles.callout} ${isFocused('wheelRpm') ? styles.activeCallout : ''}`}>
                <path d="M 0,-32 A 32,32 0 1,1 -27,16" stroke="var(--cat-engineering)" strokeWidth="2.5" fill="none" />
                <polyline points="-33,12 -27,17 -22,10" stroke="var(--cat-engineering)" strokeWidth="2.5" fill="none" />
                <rect x="-40" y="-48" width="80" height="20" rx="4" className={styles.badgeBg} />
                <text x="0" y="-34" textAnchor="middle" className={styles.badgeText}>
                  {Math.round(driverRpm)} RPM
                </text>
              </g>
            </g>

            {/* Forward Velocity Arrow */}
            <g transform="translate(320, 95)">
              <line x1="0" y1="0" x2="160" y2="0" stroke="var(--cat-engineering-deep)" strokeWidth="3" />
              <polyline points="148,-8 160,0 148,8" stroke="var(--cat-engineering-deep)" strokeWidth="3" fill="none" />
              <rect x="20" y="-28" width="130" height="22" rx="4" className={styles.badgeBg} />
              <text x="85" y="-13" textAnchor="middle" className={styles.badgeText}>
                Forward Speed (mph)
              </text>
              <text x="85" y="32" textAnchor="middle" className={styles.captionText}>
                Speed = RPM × (π × D) ÷ 1,056
              </text>
            </g>
          </svg>
        </div>
      </details>
    );
  }

  // Dynamic Pulley Drive Diagram (Driver + Driven + Belt)
  // Clamp radii between 22 and 60 px for aesthetic display
  const maxVisualDia = Math.max(driverDia, drivenDia, 0.1);
  const r1 = Math.max(22, Math.min(60, (driverDia / maxVisualDia) * 55));
  const r2 = Math.max(22, Math.min(60, (drivenDia / maxVisualDia) * 55));

  const x1 = 150;
  const x2 = 500;
  const cy = 100;

  // Tangent lines for open belt connecting circles (x1, cy, r1) and (x2, cy, r2)
  const dx = x2 - x1;
  const dr = r2 - r1;
  const angle = Math.asin(Math.max(-0.95, Math.min(0.95, dr / dx)));
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Top tangent
  const tx1 = x1 - r1 * sinA;
  const ty1 = cy - r1 * cosA;
  const tx2 = x2 - r2 * sinA;
  const ty2 = cy - r2 * cosA;

  // Bottom tangent
  const bx1 = x1 + r1 * sinA;
  const by1 = cy + r1 * cosA;
  const bx2 = x2 + r2 * sinA;
  const by2 = cy + r2 * cosA;

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Two-Pulley Mechanical Drive &amp; Belt Vector
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 700 210"
          role="img"
          aria-label="Two pulley mechanical drive diagram showing driver pulley, driven pulley, center distance, and belt speed"
        >
          {/* Centre Distance Dimension Line */}
          <g className={`${styles.callout} ${isFocused('centre') ? styles.activeCallout : ''}`}>
            <line x1={x1} y1="25" x2={x2} y2="25" className={styles.dimLine} />
            <circle cx={x1} cy="25" r="3.5" className={styles.dimDot} />
            <circle cx={x2} cy="25" r="3.5" className={styles.dimDot} />
            <rect x={(x1 + x2) / 2 - 80} y="13" width="160" height="24" rx="4" className={styles.badgeBg} />
            <text x={(x1 + x2) / 2} y="29" textAnchor="middle" className={styles.badgeText}>
              4 Centre Distance: {centreDistance} {unitSuffix}
            </text>
          </g>

          {/* Belt Lines (Top and Bottom) */}
          <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} className={styles.beltLine} />
          <line x1={bx1} y1={by1} x2={bx2} y2={by2} className={styles.beltLine} />

          {/* Belt Speed Annotation Arrow on Top Belt */}
          <g transform={`translate(${(tx1 + tx2) / 2}, ${(ty1 + ty2) / 2 - 12})`}>
            <rect x="-85" y="-12" width="170" height="22" rx="4" className={styles.badgeBg} />
            <text x="0" y="2" textAnchor="middle" className={styles.badgeText}>
              Belt: {beltSpeedFtMin ? beltSpeedFtMin.toFixed(0) : '—'} ft/min
            </text>
          </g>

          {/* Left Pulley (Driver / Motor) */}
          <g transform={`translate(${x1}, ${cy})`}>
            <circle cx="0" cy="0" r={r1} className={styles.pulleyCircle} />
            <circle cx="0" cy="0" r="14" className={styles.pulleyHub} />

            {/* Driver Diameter Callout */}
            <g className={`${styles.callout} ${isFocused('d1') ? styles.activeCallout : ''}`}>
              <line x1="0" y1={-r1} x2="0" y2={r1} className={styles.dimLine} />
              <circle cx="0" cy={-r1} r="3" className={styles.dimDot} />
              <circle cx="0" cy={r1} r="3" className={styles.dimDot} />
              <rect x="-65" y="-10" width="130" height="20" rx="3" className={styles.badgeBg} />
              <text x="0" y="4" textAnchor="middle" className={styles.badgeText}>
                1 D₁: {driverDia} {unitSuffix}
              </text>
            </g>

            {/* Driver Motor RPM Badge */}
            <g className={`${styles.callout} ${isFocused('n1') ? styles.activeCallout : ''}`} transform={`translate(0, ${r1 + 24})`}>
              <rect x="-65" y="-10" width="130" height="22" rx="4" className={styles.badgeBg} />
              <text x="0" y="5" textAnchor="middle" className={styles.badgeText}>
                2 {driverRpm.toLocaleString()} RPM (Motor)
              </text>
            </g>
          </g>

          {/* Right Pulley (Driven / Machine Shaft) */}
          <g transform={`translate(${x2}, ${cy})`}>
            <circle cx="0" cy="0" r={r2} className={styles.pulleyCircle} />
            <circle cx="0" cy="0" r="14" className={styles.pulleyHub} />

            {/* Driven Diameter Callout */}
            <g className={`${styles.callout} ${isFocused('d2') ? styles.activeCallout : ''}`}>
              <line x1="0" y1={-r2} x2="0" y2={r2} className={styles.dimLine} />
              <circle cx="0" cy={-r2} r="3" className={styles.dimDot} />
              <circle cx="0" cy={r2} r="3" className={styles.dimDot} />
              <rect x="-65" y="-10" width="130" height="20" rx="3" className={styles.badgeBg} />
              <text x="0" y="4" textAnchor="middle" className={styles.badgeText}>
                3 D₂: {drivenDia} {unitSuffix}
              </text>
            </g>

            {/* Driven Shaft RPM Badge */}
            <g className={`${styles.callout} ${isFocused('n2') ? styles.activeCallout : ''}`} transform={`translate(0, ${r2 + 24})`}>
              <rect x="-65" y="-10" width="130" height="22" rx="4" className={styles.badgeBg} />
              <text x="0" y="5" textAnchor="middle" className={styles.badgeText}>
                {drivenRpm.toLocaleString()} RPM (Driven)
              </text>
            </g>
          </g>
        </svg>
      </div>
    </details>
  );
}
