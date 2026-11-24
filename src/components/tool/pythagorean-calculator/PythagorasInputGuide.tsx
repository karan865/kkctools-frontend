import React from 'react';
import styles from './PythagorasInputGuide.module.css';

interface PythagorasInputGuideProps {
  activeTab: 'findSide' | 'sideAngle' | 'square' | 'check';
  unknownSide?: 'a' | 'b' | 'c';
  valA?: string | number;
  valB?: string | number;
  valC?: string | number;
  unit?: string;
}

export default function PythagorasInputGuide({
  activeTab,
  unknownSide = 'c',
  valA = 3,
  valB = 4,
  valC = 5,
  unit = '',
}: PythagorasInputGuideProps) {
  const u = unit ? ` ${unit}` : '';

  if (activeTab === 'square') {
    return (
      <div className={styles.guideWrapper}>
        <div className={styles.guideTitle}>
          <span>📐</span> Builder&apos;s Squaring Layout (Diagonal &amp; 3-4-5 Method)
        </div>
        <svg
          viewBox="0 0 460 160"
          className={styles.guideSvg}
          role="img"
          aria-label="Rectangle diagram showing Length, Width, Diagonal, and 3-4-5 corner layout"
        >
          {/* Outer Rectangle */}
          <rect
            x="40"
            y="25"
            width="340"
            height="110"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
            rx="4"
          />

          {/* Diagonals */}
          <line
            x1="40"
            y1="25"
            x2="380"
            y2="135"
            stroke="#4338CA"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <line
            x1="40"
            y1="135"
            x2="380"
            y2="25"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 3-4-5 Corner Triangle */}
          <polygon points="40,135 110,135 40,85" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.5" />
          <text x="75" y="148" textAnchor="middle" className={styles.textAccent} fontSize="9">
            3×
          </text>
          <text x="28" y="112" textAnchor="middle" className={styles.textAccent} fontSize="9">
            4×
          </text>
          <text x="84" y="104" textAnchor="middle" className={styles.textAccent} fontSize="9">
            5×
          </text>

          {/* Labels */}
          <text x="210" y="18" textAnchor="middle" className={styles.textMain}>
            Length (L)
          </text>
          <text x="210" y="152" textAnchor="middle" className={styles.textMuted}>
            Opposite Length
          </text>
          <text x="20" y="85" textAnchor="middle" className={styles.textMain}>
            Width (W)
          </text>
          <text x="400" y="85" textAnchor="middle" className={styles.textMuted}>
            Width
          </text>

          {/* Diagonal Badge */}
          <rect x="160" y="72" width="100" height="24" rx="4" fill="#312E81" />
          <text x="210" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
            Diagonal = √(L² + W²)
          </text>
        </svg>
      </div>
    );
  }

  const isADashed = unknownSide === 'a';
  const isBDashed = unknownSide === 'b';
  const isCDashed = unknownSide === 'c';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.guideTitle}>
        <span>📐</span> Right Triangle Geometry &amp; Pythagoras Equation (a² + b² = c²)
      </div>
      <svg
        viewBox="0 0 460 170"
        className={styles.guideSvg}
        role="img"
        aria-label="Right triangle diagram showing side a, side b, hypotenuse c, angles alpha and beta, and right-angle box"
      >
        {/* Triangle Fill */}
        <polygon points="80,140 360,140 80,30" fill="color-mix(in srgb, #4338CA 8%, transparent)" />

        {/* Right-angle box at corner (80, 140) */}
        <polyline points="80,122 98,122 98,140" fill="none" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="89" cy="131" r="1.5" fill="#64748B" />

        {/* Leg a (vertical: 80,30 to 80,140) */}
        <line
          x1="80"
          y1="30"
          x2="80"
          y2="140"
          stroke={isADashed ? '#C2410C' : '#4338CA'}
          strokeWidth={isADashed ? '3' : '2.5'}
          strokeDasharray={isADashed ? '5 3' : 'none'}
        />

        {/* Leg b (horizontal: 80,140 to 360,140) */}
        <line
          x1="80"
          y1="140"
          x2="360"
          y2="140"
          stroke={isBDashed ? '#C2410C' : '#4338CA'}
          strokeWidth={isBDashed ? '3' : '2.5'}
          strokeDasharray={isBDashed ? '5 3' : 'none'}
        />

        {/* Hypotenuse c (slanted: 80,30 to 360,140) */}
        <line
          x1="80"
          y1="30"
          x2="360"
          y2="140"
          stroke={isCDashed ? '#C2410C' : '#0D9488'}
          strokeWidth={isCDashed ? '3' : '2.5'}
          strokeDasharray={isCDashed ? '5 3' : 'none'}
        />

        {/* Labels */}
        {/* Leg a */}
        <text x="35" y="85" textAnchor="middle" className={isADashed ? styles.textAccent : styles.textMain}>
          Side a {valA ? `(${valA}${u})` : ''}
        </text>

        {/* Leg b */}
        <text x="220" y="160" textAnchor="middle" className={isBDashed ? styles.textAccent : styles.textMain}>
          Side b {valB ? `(${valB}${u})` : ''}
        </text>

        {/* Hypotenuse c */}
        <text x="240" y="75" textAnchor="middle" className={isCDashed ? styles.textAccent : styles.textMain}>
          Hypotenuse c {valC ? `(${valC}${u})` : ''}
        </text>

        {/* Angles */}
        <text x="110" y="45" className={styles.textMuted}>
          Angle β
        </text>
        <text x="325" y="130" className={styles.textMuted}>
          Angle α
        </text>
        <text x="95" y="112" className={styles.textMuted}>
          90°
        </text>
      </svg>
    </div>
  );
}
