import React from 'react';
import styles from './TankInputGuide.module.css';

interface TankInputGuideProps {
  shape?: string;
  headType?: string;
  diameter?: number | string;
  length?: number | string;
  depth?: number | string;
  percentFull?: number | string;
  filledGal?: number | string;
  totalGal?: number | string;
  unit?: string;
}

export default function TankInputGuide({
  shape = 'horizontal-cylinder',
  diameter = 6,
  length = 12,
  depth = 2,
  percentFull = '29.2%',
  filledGal = '740.6 gal',
  totalGal = '2,538.1 gal',
  unit = 'ft',
}: TankInputGuideProps) {
  const isHoriz = shape === 'horizontal-cylinder';
  const u = unit ? ` ${unit}` : '';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.guideTitle}>
        <span>🛢️</span> Tank Geometry &amp; Partial Fill Level
      </div>
      <svg
        viewBox="0 0 460 170"
        className={styles.guideSvg}
        role="img"
        aria-label="Tank diagram illustrating diameter, length, liquid fill depth, and ullage air gap"
      >
        {isHoriz ? (
          <>
            {/* Horizontal Cylinder Outline */}
            {/* Cylinder barrel */}
            <rect x="130" y="35" width="220" height="90" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" rx="4" />

            {/* Left End Ellipse */}
            <ellipse cx="130" cy="80" rx="25" ry="45" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />

            {/* Right End Curve */}
            <path d="M350 35 c15 0 25 20 25 45 s-10 45 -25 45" fill="none" stroke="#64748B" strokeWidth="2" />

            {/* Shaded Liquid Volume (Partial Fill ~30%) */}
            <path
              d="M130 95 L350 95 C365 95 372 108 350 125 L130 125 C115 125 108 108 130 95 Z"
              fill="color-mix(in srgb, #0284C7 35%, transparent)"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Liquid Surface Line */}
            <line x1="120" y1="95" x2="365" y2="95" stroke="#0284C7" strokeWidth="2" strokeDasharray="3 2" />

            {/* Dimensions */}
            {/* Diameter D */}
            <line x1="90" y1="35" x2="90" y2="125" stroke="#4338CA" strokeWidth="1.5" />
            <polyline points="87,42 90,35 93,42" fill="none" stroke="#4338CA" strokeWidth="1.5" />
            <polyline points="87,118 90,125 93,118" fill="none" stroke="#4338CA" strokeWidth="1.5" />
            <text x="80" y="83" textAnchor="end" className={styles.textAccent}>
              D = {diameter}
              {u}
            </text>

            {/* Length L */}
            <line x1="130" y1="140" x2="350" y2="140" stroke="#4338CA" strokeWidth="1.5" />
            <polyline points="137,137 130,140 137,143" fill="none" stroke="#4338CA" strokeWidth="1.5" />
            <polyline points="343,137 350,140 343,143" fill="none" stroke="#4338CA" strokeWidth="1.5" />
            <text x="240" y="155" textAnchor="middle" className={styles.textAccent}>
              Length = {length}
              {u}
            </text>

            {/* Liquid Depth h */}
            <line x1="390" y1="95" x2="390" y2="125" stroke="#0284C7" strokeWidth="2" />
            <polyline points="387,100 390,95 393,100" fill="none" stroke="#0284C7" strokeWidth="1.5" />
            <polyline points="387,120 390,125 393,120" fill="none" stroke="#0284C7" strokeWidth="1.5" />
            <text x="398" y="113" textAnchor="start" className={styles.textAccent} fill="#0284C7">
              Depth = {depth}
              {u}
            </text>

            {/* Ullage (gap) */}
            <line x1="390" y1="35" x2="390" y2="95" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
            <text x="398" y="65" textAnchor="start" className={styles.textMuted}>
              Ullage Air Gap
            </text>
          </>
        ) : (
          <>
            {/* Vertical Cylinder Outline */}
            <rect x="180" y="30" width="100" height="100" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            <ellipse cx="230" cy="30" rx="50" ry="14" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />
            <ellipse cx="230" cy="130" rx="50" ry="14" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />

            {/* Liquid Fill */}
            <path
              d="M180 85 h100 v45 c0 8 -22 14 -50 14 s-50 -6 -50 -14 Z"
              fill="color-mix(in srgb, #0284C7 35%, transparent)"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            <ellipse cx="230" cy="85" rx="50" ry="14" fill="none" stroke="#0284C7" strokeWidth="2" />

            {/* Labels */}
            <text x="230" y="20" textAnchor="middle" className={styles.textAccent}>
              Diameter = {diameter}
              {u}
            </text>
            <text x="160" y="85" textAnchor="end" className={styles.textMain}>
              Height = {length}
              {u}
            </text>
            <text x="300" y="110" textAnchor="start" className={styles.textAccent} fill="#0284C7">
              Depth = {depth}
              {u}
            </text>
          </>
        )}

        {/* Live Ribbon */}
        <g transform="translate(70, 8)">
          <rect x="0" y="0" width="320" height="22" rx="4" fill="#312E81" />
          <text x="160" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
            Filled: {filledGal} ({percentFull}) &nbsp;|&nbsp; Capacity: {totalGal}
          </text>
        </g>
      </svg>
    </div>
  );
}
