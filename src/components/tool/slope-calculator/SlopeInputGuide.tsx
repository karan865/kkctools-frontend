import React from 'react';
import styles from './SlopeInputGuide.module.css';

interface SlopeInputGuideProps {
  activeTab: 'riseRun' | 'presets' | 'twoPoint';
  rise?: number | string;
  run?: number | string;
  percentGrade?: number | string;
  degrees?: number | string;
  pitch?: string;
  unit?: string;
}

export default function SlopeInputGuide({
  activeTab,
  rise = 1,
  run = 12,
  percentGrade = '8.33%',
  degrees = '4.76°',
  pitch = '1/12',
  unit = '',
}: SlopeInputGuideProps) {
  const u = unit ? ` ${unit}` : '';

  if (activeTab === 'twoPoint') {
    return (
      <div className={styles.guideWrapper}>
        <div className={styles.guideTitle}>
          <span>📈</span> Two-Point Coordinate Slope (m = Δy ÷ Δx)
        </div>
        <svg
          viewBox="0 0 460 160"
          className={styles.guideSvg}
          role="img"
          aria-label="Coordinate system showing points (x1, y1) and (x2, y2) with delta x run and delta y rise"
        >
          {/* Coordinate Axes */}
          <line x1="40" y1="130" x2="420" y2="130" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="60" y1="20" x2="60" y2="140" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Rise / Run Triangle */}
          <line x1="120" y1="110" x2="340" y2="110" stroke="#4338CA" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="340" y1="110" x2="340" y2="40" stroke="#4338CA" strokeWidth="2" strokeDasharray="4 3" />

          {/* Line Connecting Points */}
          <line x1="80" y1="123" x2="380" y2="27" stroke="#0D9488" strokeWidth="3" />

          {/* Points */}
          <circle cx="120" cy="110" r="5" fill="#4338CA" />
          <circle cx="340" cy="40" r="5" fill="#4338CA" />

          {/* Labels */}
          <text x="120" y="128" textAnchor="middle" className={styles.textMain}>
            (x₁, y₁)
          </text>
          <text x="340" y="30" textAnchor="middle" className={styles.textMain}>
            (x₂, y₂)
          </text>

          <text x="230" y="125" textAnchor="middle" className={styles.textAccent}>
            Δx = x₂ − x₁ (Run)
          </text>
          <text x="375" y="80" textAnchor="start" className={styles.textAccent}>
            Δy = y₂ − y₁ (Rise)
          </text>

          {/* Equation Badge */}
          <rect x="180" y="45" width="100" height="22" rx="4" fill="#312E81" />
          <text x="230" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
            m = Δy ÷ Δx
          </text>
        </svg>
      </div>
    );
  }

  if (activeTab === 'presets') {
    return (
      <div className={styles.guideWrapper}>
        <div className={styles.guideTitle}>
          <span>🏗️</span> Construction Slope Limits (ADA Ramps, Plumbing Drains &amp; Roofs)
        </div>
        <svg
          viewBox="0 0 460 160"
          className={styles.guideSvg}
          role="img"
          aria-label="Construction slope diagram showing ground line, ramp surface, and code limits"
        >
          {/* Ground Baseline */}
          <line x1="30" y1="125" x2="430" y2="125" stroke="#94A3B8" strokeWidth="2" />

          {/* Ramp / Incline */}
          <polygon points="60,125 380,125 380,55" fill="color-mix(in srgb, #4338CA 10%, transparent)" />
          <line x1="60" y1="125" x2="380" y2="55" stroke="#4338CA" strokeWidth="3" />
          <line x1="380" y1="55" x2="380" y2="125" stroke="#C2410C" strokeWidth="2.5" />

          {/* Right Angle Box */}
          <polyline points="365,125 365,110 380,110" fill="none" stroke="#64748B" strokeWidth="1.5" />

          {/* Labels */}
          <text x="220" y="142" textAnchor="middle" className={styles.textMain}>
            Horizontal Run
          </text>
          <text x="405" y="90" textAnchor="start" className={styles.textAccent}>
            Vertical Rise
          </text>

          {/* Standards Badges */}
          <rect x="80" y="25" width="130" height="22" rx="4" fill="#1E293B" />
          <text x="145" y="40" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontWeight="700">
            ADA Ramp: max 1:12 (8.33%)
          </text>

          <rect x="230" y="25" width="140" height="22" rx="4" fill="#1E293B" />
          <text x="300" y="40" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontWeight="700">
            Drain example: ¼″ per ft (2.08%)
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.guideTitle}>
        <span>📐</span> Rise over Run Geometry (Slope = Rise ÷ Run)
      </div>
      <svg
        viewBox="0 0 460 170"
        className={styles.guideSvg}
        role="img"
        aria-label="Right triangle on ground baseline showing vertical rise, horizontal run, slope length, and angle theta"
      >
        {/* Ground Line */}
        <line x1="30" y1="135" x2="430" y2="135" stroke="#94A3B8" strokeWidth="2" />

        {/* Shaded Triangle */}
        <polygon points="60,135 380,135 380,45" fill="color-mix(in srgb, #4338CA 10%, transparent)" />

        {/* Run (Horizontal) */}
        <line x1="60" y1="135" x2="380" y2="135" stroke="#4338CA" strokeWidth="2.5" />

        {/* Rise (Vertical) */}
        <line x1="380" y1="135" x2="380" y2="45" stroke="#C2410C" strokeWidth="3" />

        {/* Sloped Edge / Incline */}
        <line x1="60" y1="135" x2="380" y2="45" stroke="#0D9488" strokeWidth="3" />

        {/* Right Angle Box */}
        <polyline points="365,135 365,120 380,120" fill="none" stroke="#64748B" strokeWidth="1.5" />

        {/* Angle Arc */}
        <path d="M100,135 A40,40 0 0,0 95,122" fill="none" stroke="#4338CA" strokeWidth="1.5" />

        {/* Text Labels */}
        <text x="220" y="153" textAnchor="middle" className={styles.textMain}>
          Run = {run}
          {u}
        </text>
        <text x="405" y="92" textAnchor="start" className={styles.textAccent}>
          Rise = {rise}
          {u}
        </text>
        <text x="210" y="80" textAnchor="middle" className={styles.textMain}>
          Slope Length = √(Rise² + Run²)
        </text>
        <text x="110" y="130" className={styles.textMuted}>
          θ = {degrees}
        </text>

        {/* Live Metrics Ribbon */}
        <g transform="translate(60, 10)">
          <rect x="0" y="0" width="320" height="24" rx="5" fill="#312E81" />
          <text x="160" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
            Grade: {percentGrade} &nbsp;|&nbsp; Angle: {degrees} &nbsp;|&nbsp; Pitch: {pitch}
          </text>
        </g>
      </svg>
    </div>
  );
}
