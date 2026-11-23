'use client';

import React from 'react';
import styles from './EpoxyInputGuide.module.css';

interface EpoxyInputGuideProps {
  tab: 'coating' | 'deep' | 'mold' | 'known';
  unit: 'in' | 'cm';
  length: number;
  width: number;
  thickness: number;
  edgePct: number;
  wastePct: number;
  ratioA: number;
  ratioB: number;
  mixMode: 'volume' | 'weight';
  maxLayerDepth?: number;
  shape?: string;
  focusedField?: string | null;
}

export default function EpoxyInputGuide({
  tab,
  unit,
  length,
  width,
  thickness,
  edgePct,
  wastePct,
  ratioA,
  ratioB,
  mixMode,
  maxLayerDepth,
  focusedField,
}: EpoxyInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Visual Dimension & Mix Guide
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 760 260"
          role="img"
          aria-label="Epoxy dimension, pour depth, and mix ratio diagram"
        >
          {tab === 'mold' ? (
            /* Mold Tab: Cylinder & Box Molds */
            <g transform="translate(40, 20)">
              {/* Cylinder Mold */}
              <g className={`${styles.partGroup} ${isFocused('cylinder') ? styles.highlight : ''}`}>
                <ellipse cx="140" cy="60" rx="65" ry="24" className={styles.moldTop} />
                <path d="M 75 60 v 110 c 0 13.2 29.1 24 65 24 s 65 -10.8 65 -24 v -110" className={styles.moldBody} />
                <ellipse cx="140" cy="170" rx="65" ry="24" className={styles.moldBottom} />
                {/* Fluid level inside cylinder */}
                <ellipse cx="140" cy="90" rx="55" ry="20" className={styles.fluidSurface} />
                
                {/* Diameter callout */}
                <line x1="75" y1="50" x2="205" y2="50" className={styles.dimLine} />
                <circle cx="75" cy="50" r="3" className={styles.dimDot} />
                <circle cx="205" cy="50" r="3" className={styles.dimDot} />
                <rect x="110" y="36" width="60" height="20" rx="4" className={styles.badgeBg} />
                <text x="140" y="50" textAnchor="middle" className={styles.badgeText}>
                  1 Dia: {length} {unit}
                </text>

                {/* Height callout */}
                <line x1="225" y1="60" x2="225" y2="170" className={styles.dimLine} />
                <circle cx="225" cy="60" r="3" className={styles.dimDot} />
                <circle cx="225" cy="170" r="3" className={styles.dimDot} />
                <rect x="235" y="105" width="70" height="20" rx="4" className={styles.badgeBg} />
                <text x="270" y="119" textAnchor="middle" className={styles.badgeText}>
                  2 Height: {width} {unit}
                </text>
              </g>

              {/* Mixing Ratio Bottles on the right */}
              <g transform="translate(420, 20)">
                <rect x="20" y="40" width="60" height="110" rx="8" className={styles.bottleA} />
                <rect x="35" y="24" width="30" height="16" rx="2" className={styles.cap} />
                <rect x="25" y="70" width="50" height="75" rx="4" className={styles.liquidA} />
                <text x="50" y="110" textAnchor="middle" className={styles.bottleLabel}>Resin A</text>
                
                <rect x="110" y="55" width="55" height="95" rx="8" className={styles.bottleB} />
                <rect x="122" y="39" width="30" height="16" rx="2" className={styles.cap} />
                <rect x="115" y="85" width="45" height="60" rx="4" className={styles.liquidB} />
                <text x="137" y="120" textAnchor="middle" className={styles.bottleLabel}>Hardener B</text>

                <rect x="40" y="165" width="120" height="24" rx="6" className={styles.pillBg} />
                <text x="100" y="181" textAnchor="middle" className={styles.pillText}>
                  6 Mix Ratio {ratioA}:{ratioB} ({mixMode})
                </text>
              </g>
            </g>
          ) : (
            /* Coating, Deep Pour, Known Volume Tabs: Isometric Table Slab */
            <g transform="translate(30, 20)">
              {/* Slab Isometric Projection */}
              <g className={`${styles.partGroup} ${isFocused('slab') ? styles.highlight : ''}`}>
                {/* Bottom Base Table Board */}
                <polygon points="120,80 340,30 480,90 260,140" className={styles.woodTop} />
                <polygon points="260,140 480,90 480,120 260,170" className={styles.woodFrontRight} />
                <polygon points="120,80 260,140 260,170 120,110" className={styles.woodFrontLeft} />

                {/* Top Resin Coat (Flood / Deep Pour) */}
                <polygon
                  points="120,68 340,18 480,78 260,128"
                  className={styles.epoxyTopSurface}
                />
                <polygon points="260,128 480,78 480,90 260,140" className={styles.epoxyRightEdge} />
                <polygon points="120,68 260,128 260,140 120,80" className={styles.epoxyLeftEdge} />

                {/* Deep pour layer subdivision lines if deep tab */}
                {tab === 'deep' && maxLayerDepth && maxLayerDepth > 0 && (
                  <g className={styles.deepLayers}>
                    <line x1="260" y1="134" x2="480" y2="84" className={styles.layerLine} />
                    <line x1="120" y1="74" x2="260" y2="134" className={styles.layerLine} />
                    <rect x="330" y="138" width="130" height="22" rx="4" className={styles.badgeBg} />
                    <text x="395" y="153" textAnchor="middle" className={styles.badgeText}>
                      7 Max {maxLayerDepth} {unit}/pour
                    </text>
                  </g>
                )}

                {/* Edge drip lip on left edge */}
                {edgePct > 0 && (
                  <path
                    d="M 120,80 Q 115,95 118,102 Q 120,105 122,102 Q 125,95 120,80"
                    className={styles.dripLip}
                  />
                )}
              </g>

              {/* Callout 1: Length */}
              <g className={`${styles.callout} ${isFocused('length') ? styles.activeCallout : ''}`}>
                <line x1="100" y1="72" x2="240" y2="132" className={styles.dimLine} />
                <circle cx="100" cy="72" r="3" className={styles.dimDot} />
                <circle cx="240" cy="132" r="3" className={styles.dimDot} />
                <rect x="120" y="112" width="90" height="20" rx="4" className={styles.badgeBg} />
                <text x="165" y="126" textAnchor="middle" className={styles.badgeText}>
                  1 Length: {length} {unit}
                </text>
              </g>

              {/* Callout 2: Width */}
              <g className={`${styles.callout} ${isFocused('width') ? styles.activeCallout : ''}`}>
                <line x1="355" y1="24" x2="495" y2="84" className={styles.dimLine} />
                <circle cx="355" cy="24" r="3" className={styles.dimDot} />
                <circle cx="495" cy="84" r="3" className={styles.dimDot} />
                <rect x="410" y="40" width="85" height="20" rx="4" className={styles.badgeBg} />
                <text x="452" y="54" textAnchor="middle" className={styles.badgeText}>
                  2 Width: {width} {unit}
                </text>
              </g>

              {/* Callout 3: Thickness */}
              <g className={`${styles.callout} ${isFocused('thickness') ? styles.activeCallout : ''}`}>
                <line x1="500" y1="78" x2="500" y2="90" className={styles.dimLine} />
                <circle cx="500" cy="78" r="3" className={styles.dimDot} />
                <circle cx="500" cy="90" r="3" className={styles.dimDot} />
                <rect x="508" y="74" width="85" height="20" rx="4" className={styles.badgeBg} />
                <text x="550" y="88" textAnchor="middle" className={styles.badgeText}>
                  3 Thick: {thickness} {unit}
                </text>
              </g>

              {/* Allowances callouts */}
              <g transform="translate(60, 175)">
                <rect x="0" y="0" width="105" height="22" rx="4" className={styles.allowancePill} />
                <text x="52" y="15" textAnchor="middle" className={styles.allowanceText}>
                  4 Edge drip: {edgePct}%
                </text>
                <rect x="115" y="0" width="100" height="22" rx="4" className={styles.allowancePill} />
                <text x="165" y="15" textAnchor="middle" className={styles.allowanceText}>
                  5 Waste: {wastePct}%
                </text>
              </g>

              {/* Mix Ratio Bottles on the right */}
              <g transform="translate(560, 20)">
                <rect x="20" y="40" width="55" height="100" rx="8" className={styles.bottleA} />
                <rect x="32" y="26" width="30" height="14" rx="2" className={styles.cap} />
                <rect x="25" y="70" width="45" height="66" rx="4" className={styles.liquidA} />
                <text x="47" y="105" textAnchor="middle" className={styles.bottleLabel}>Resin A</text>
                
                <rect x="95" y="55" width="50" height="85" rx="8" className={styles.bottleB} />
                <rect x="105" y="41" width="30" height="14" rx="2" className={styles.cap} />
                <rect x="100" y="82" width="40" height="54" rx="4" className={styles.liquidB} />
                <text x="120" y="112" textAnchor="middle" className={styles.bottleLabel}>Hardener B</text>

                <rect x="15" y="155" width="145" height="24" rx="6" className={styles.pillBg} />
                <text x="87" y="171" textAnchor="middle" className={styles.pillText}>
                  6 Mix Ratio {ratioA}:{ratioB} ({mixMode})
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </details>
  );
}
