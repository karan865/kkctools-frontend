'use client';

import React from 'react';
import styles from './StepsInputGuide.module.css';

interface StepsInputGuideProps {
  tab: 'belt' | 'leadscrew' | 'esteps' | 'axis' | 'hardware';
  stepAngle: number;
  microsteps: number;
  pitchOrLead: number;
  teethOrRatio: number;
  calculatedSteps: number | null;
  focusedField?: string | null;
}

export default function StepsInputGuide({
  tab,
  stepAngle,
  microsteps,
  pitchOrLead,
  teethOrRatio,
  calculatedSteps,
  focusedField,
}: StepsInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  if (tab === 'esteps') {
    return (
      <details className={styles.guideWrapper} open>
        <summary className={styles.guideSummary}>
          <span className={styles.summaryTitle}>
            <span className={styles.summaryBadge}>Diagram</span> 100 mm Filament Mark Calibration Method
          </span>
          <span className={styles.summaryHint}>Click to collapse</span>
        </summary>
        <div className={styles.svgContainer}>
          <svg
            className={styles.diagramSvg}
            viewBox="0 0 700 190"
            role="img"
            aria-label="Filament calibration diagram showing 120 mm ruler mark, 100 mm requested extrusion, and remaining distance"
          >
            {/* Extruder Entry Block */}
            <g transform="translate(60, 45)">
              <rect x="0" y="20" width="70" height="60" rx="6" className={styles.stepperBody} />
              <text x="35" y="55" textAnchor="middle" className={styles.badgeText}>
                Extruder Intake
              </text>
            </g>

            {/* Filament Line leaving intake */}
            <line x1="130" y1="95" x2="640" y2="95" className={styles.filamentLine} />

            {/* 120 mm Mark Indicator */}
            <g className={`${styles.callout} ${isFocused('mark') ? styles.activeCallout : ''}`}>
              <line x1="600" y1="75" x2="600" y2="115" stroke="var(--ink)" strokeWidth="3" />
              <rect x="520" y="35" width="160" height="24" rx="4" className={styles.badgeBg} />
              <text x="600" y="51" textAnchor="middle" className={styles.badgeText}>
                120 mm Mark Reference
              </text>
            </g>

            {/* 100 mm Requested Arrow */}
            <g className={`${styles.callout} ${isFocused('requested') ? styles.activeCallout : ''}`}>
              <line x1="130" y1="130" x2="520" y2="130" className={styles.dimLine} />
              <circle cx="130" cy="130" r="3.5" className={styles.dimDot} />
              <circle cx="520" cy="130" r="3.5" className={styles.dimDot} />
              <rect x="250" y="118" width="150" height="24" rx="4" className={styles.badgeBg} />
              <text x="325" y="134" textAnchor="middle" className={styles.badgeText}>
                100 mm Commanded (G1 E100)
              </text>
            </g>

            {/* Remaining Distance Dimension */}
            <g className={`${styles.callout} ${isFocused('remaining') ? styles.activeCallout : ''}`}>
              <line x1="520" y1="130" x2="600" y2="130" stroke="var(--cat-engineering)" strokeWidth="2" />
              <circle cx="600" cy="130" r="3.5" className={styles.dimDot} />
              <rect x="495" y="152" width="130" height="22" rx="4" className={styles.badgeBg} />
              <text x="560" y="167" textAnchor="middle" className={styles.badgeText}>
                Remaining Distance
              </text>
            </g>
          </svg>
        </div>
      </details>
    );
  }

  if (tab === 'axis') {
    return (
      <details className={styles.guideWrapper} open>
        <summary className={styles.guideSummary}>
          <span className={styles.summaryTitle}>
            <span className={styles.summaryBadge}>Diagram</span> Printed Test Cube Calibration Vector
          </span>
          <span className={styles.summaryHint}>Click to collapse</span>
        </summary>
        <div className={styles.svgContainer}>
          <svg
            className={styles.diagramSvg}
            viewBox="0 0 700 180"
            role="img"
            aria-label="3D printed calibration cube diagram comparing commanded 20 mm size with digital caliper measured size"
          >
            {/* 3D Test Cube */}
            <g transform="translate(180, 40)">
              <rect x="0" y="0" width="90" height="90" rx="4" className={styles.pulleyBody} />
              <text x="45" y="52" textAnchor="middle" className={styles.badgeText} fontSize="14">
                X / Y / Z Cube
              </text>

              {/* Commanded Callout */}
              <g className={styles.callout}>
                <line x1="0" y1="-14" x2="90" y2="-14" className={styles.dimLine} />
                <circle cx="0" cy="-14" r="3" className={styles.dimDot} />
                <circle cx="90" cy="-14" r="3" className={styles.dimDot} />
                <rect x="-10" y="-36" width="110" height="20" rx="3" className={styles.badgeBg} />
                <text x="45" y="-22" textAnchor="middle" className={styles.badgeText}>
                  Commanded: 20.00 mm
                </text>
              </g>
            </g>

            {/* Vernier / Digital Caliper Jaws */}
            <g transform="translate(360, 40)">
              <rect x="0" y="10" width="280" height="100" rx="8" className={styles.badgeBg} />
              <text x="140" y="36" textAnchor="middle" className={styles.badgeText}>
                Caliper Measured Dimension
              </text>
              <text x="140" y="65" textAnchor="middle" className={styles.badgeText} fill="var(--cat-engineering)" fontSize="15">
                New Steps = Current × (20.00 ÷ Measured)
              </text>
              <text x="140" y="95" textAnchor="middle" className={styles.captionText}>
                Eliminates under/oversized printed parts
              </text>
            </g>
          </svg>
        </div>
      </details>
    );
  }

  // Belt / Lead Screw / Hardware Default
  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Stepper &amp; Drive Mechanism Kinematics
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 700 190"
          role="img"
          aria-label="Stepper motor, microstepping driver, and toothed pulley linear belt drive diagram"
        >
          {/* Stepper Motor Body (NEMA 17) */}
          <g transform="translate(80, 40)">
            <rect x="0" y="0" width="85" height="85" rx="6" className={styles.stepperBody} />
            <circle cx="42.5" cy="42.5" r="22" fill="var(--surface-secondary)" stroke="var(--line)" strokeWidth="1.5" />
            <circle cx="42.5" cy="42.5" r="5" fill="var(--ink)" />

            <g className={`${styles.callout} ${isFocused('stepAngle') ? styles.activeCallout : ''}`}>
              <rect x="-10" y="95" width="105" height="22" rx="4" className={styles.badgeBg} />
              <text x="42.5" y="110" textAnchor="middle" className={styles.badgeText}>
                1 {stepAngle}° ({Math.round(360 / stepAngle)} steps/rev)
              </text>
            </g>
          </g>

          {/* Microstepping Driver Badge */}
          <g transform="translate(225, 60)" className={`${styles.callout} ${isFocused('microsteps') ? styles.activeCallout : ''}`}>
            <rect x="0" y="0" width="115" height="45" rx="6" className={styles.badgeBg} />
            <text x="57" y="18" textAnchor="middle" className={styles.captionText}>
              Driver Microstepping
            </text>
            <text x="57" y="36" textAnchor="middle" className={styles.badgeText} fill="var(--cat-engineering)">
              2 1/{microsteps} Microsteps
            </text>
          </g>

          {/* Linear Drive (Pulley + Belt OR Lead Screw) */}
          <g transform="translate(390, 40)">
            {tab === 'leadscrew' ? (
              <>
                {/* Lead Screw Shaft */}
                <rect x="0" y="32" width="260" height="20" rx="3" className={styles.pulleyBody} />
                <line x1="0" y1="42" x2="260" y2="42" stroke="var(--cat-engineering-deep)" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="50" y="95" width="160" height="24" rx="4" className={styles.badgeBg} />
                <text x="130" y="111" textAnchor="middle" className={styles.badgeText}>
                  3 Lead: {pitchOrLead} mm/revolution
                </text>
              </>
            ) : (
              <>
                {/* Toothed Pulley & Belt */}
                <circle cx="40" cy="42.5" r="30" className={styles.pulleyBody} />
                <line x1="40" y1="12.5" x2="270" y2="12.5" className={styles.beltLine} />
                <line x1="40" y1="72.5" x2="270" y2="72.5" className={styles.beltLine} />

                <g className={`${styles.callout} ${isFocused('pulley') ? styles.activeCallout : ''}`}>
                  <rect x="-10" y="95" width="130" height="22" rx="4" className={styles.badgeBg} />
                  <text x="55" y="110" textAnchor="middle" className={styles.badgeText}>
                    3 {teethOrRatio} Pulley Teeth
                  </text>
                </g>

                <g className={`${styles.callout} ${isFocused('pitch') ? styles.activeCallout : ''}`}>
                  <rect x="140" y="95" width="130" height="22" rx="4" className={styles.badgeBg} />
                  <text x="205" y="110" textAnchor="middle" className={styles.badgeText}>
                    4 {pitchOrLead} mm Pitch (GT2)
                  </text>
                </g>
              </>
            )}
          </g>

          {/* Result Badge */}
          <g transform="translate(230, 155)">
            <text x="120" y="15" textAnchor="middle" className={styles.badgeText} fill="var(--cat-engineering)">
              Resolution: {calculatedSteps ? `${calculatedSteps.toFixed(1)} steps/mm` : '—'}
            </text>
          </g>
        </svg>
      </div>
    </details>
  );
}
