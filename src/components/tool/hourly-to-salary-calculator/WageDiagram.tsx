'use client';

import React, { useState } from 'react';
import styles from './WageDiagram.module.css';
import { WageResult } from '@/lib/wage-engine';

interface WageDiagramProps {
  wageResult: WageResult;
  currencySymbol?: string;
}

export default function WageDiagram({ wageResult, currencySymbol = '$' }: WageDiagramProps) {
  const [view, setView] = useState<'paychecks' | 'hours'>('paychecks');

  const {
    periods,
    workingHoursScheduled,
    paidHoursPerYear,
    actualWorkedHoursPerYear,
    overtimeAnnualGross,
    effectiveHourlyWorked,
  } = wageResult;

  const svgW = 540;
  const svgH = 240;

  // View 1: Paycheck Frequencies
  // Normalize monthly as the maximum 100% bar
  const maxPay = Math.max(periods.monthly, 1);
  const wMonthly = 320;
  const wSemi = Math.max(10, (periods.semiMonthly / maxPay) * wMonthly);
  const wBiweek = Math.max(10, (periods.biweekly / maxPay) * wMonthly);
  const wWeek = Math.max(10, (periods.weekly / maxPay) * wMonthly);

  // View 2: Hours Breakdown
  const totalHoursBase = Math.max(workingHoursScheduled, 1);
  const workedRatio = Math.min(1, Math.max(0, actualWorkedHoursPerYear / totalHoursBase));
  const ptoHours = Math.max(0, paidHoursPerYear - actualWorkedHoursPerYear);
  const ptoRatio = Math.min(1 - workedRatio, Math.max(0, ptoHours / totalHoursBase));

  const barTotalW = 460;
  const wWorkedBar = workedRatio * barTotalW;
  const wPtoBar = ptoRatio * barTotalW;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Visual Wage Distribution</h3>
          <p className={styles.subtitle}>
            {view === 'paychecks'
              ? 'Gross paycheck amounts by disbursement schedule'
              : 'Annual scheduled working hours vs paid leave'}
          </p>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${view === 'paychecks' ? styles.tabBtnActive : ''}`}
            onClick={() => setView('paychecks')}
          >
            Paychecks
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${view === 'hours' ? styles.tabBtnActive : ''}`}
            onClick={() => setView('hours')}
          >
            Hours Breakdown
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        {view === 'paychecks' ? (
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className={styles.svg}
            role="img"
            aria-label="Paycheck disbursement schedule comparison"
          >
            {/* Background grid */}
            <line x1="130" y1="20" x2="130" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="130" y1="200" x2="490" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Row 1: Monthly (12x) */}
            <g transform="translate(0, 30)">
              <text x="120" y="24" fill="#334155" fontSize="12" fontWeight="700" textAnchor="end">
                Monthly (12x)
              </text>
              <rect x="130" y="8" width={wMonthly} height="24" fill="#0284c7" rx="5" />
              <text
                x={140 + wMonthly}
                y="24"
                fill="#0f172a"
                fontSize="12"
                fontWeight="800"
                textAnchor="start"
              >
                {currencySymbol}
                {Math.round(periods.monthly).toLocaleString()}
              </text>
            </g>

            {/* Row 2: Semi-Monthly (24x) */}
            <g transform="translate(0, 75)">
              <text x="120" y="24" fill="#334155" fontSize="12" fontWeight="700" textAnchor="end">
                Semi-Mo (24x)
              </text>
              <rect x="130" y="8" width={wSemi} height="24" fill="#38bdf8" rx="5" />
              <text
                x={140 + wSemi}
                y="24"
                fill="#0f172a"
                fontSize="12"
                fontWeight="800"
                textAnchor="start"
              >
                {currencySymbol}
                {Math.round(periods.semiMonthly).toLocaleString()}
              </text>
            </g>

            {/* Row 3: Biweekly (26x) */}
            <g transform="translate(0, 120)">
              <text x="120" y="24" fill="#334155" fontSize="12" fontWeight="700" textAnchor="end">
                Biweekly (26x)
              </text>
              <rect x="130" y="8" width={wBiweek} height="24" fill="#10b981" rx="5" />
              <text
                x={140 + wBiweek}
                y="24"
                fill="#0f172a"
                fontSize="12"
                fontWeight="800"
                textAnchor="start"
              >
                {currencySymbol}
                {Math.round(periods.biweekly).toLocaleString()}
              </text>
            </g>

            {/* Row 4: Weekly (52x) */}
            <g transform="translate(0, 165)">
              <text x="120" y="24" fill="#334155" fontSize="12" fontWeight="700" textAnchor="end">
                Weekly (52x)
              </text>
              <rect x="130" y="8" width={wWeek} height="24" fill="#a7f3d0" rx="5" />
              <text
                x={140 + wWeek}
                y="24"
                fill="#0f172a"
                fontSize="12"
                fontWeight="800"
                textAnchor="start"
              >
                {currencySymbol}
                {Math.round(periods.weekly).toLocaleString()}
              </text>
            </g>

            {/* Note at bottom */}
            <text x="270" y="228" fill="#64748b" fontSize="10.5" textAnchor="middle">
              Biweekly has 26 paychecks/yr; Semi-Monthly has 24 paychecks/yr (1st &amp; 15th)
            </text>
          </svg>
        ) : (
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className={styles.svg}
            role="img"
            aria-label="Annual working hours and paid leave breakdown"
          >
            {/* Header info */}
            <text x="40" y="32" fill="#0f172a" fontSize="13" fontWeight="800">
              Total Scheduled Base: {workingHoursScheduled.toLocaleString()} Hours / Year
            </text>
            <text x="40" y="52" fill="#64748b" fontSize="11">
              Effective Pay per Hour Actually Worked:{' '}
              <tspan fill="#059669" fontWeight="800">
                {currencySymbol}
                {effectiveHourlyWorked.toFixed(2)}/hr
              </tspan>
            </text>

            {/* Stacked Bar Container */}
            <g transform="translate(40, 75)">
              <rect
                x="0"
                y="0"
                width={barTotalW}
                height="44"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                rx="8"
              />

              {/* Actually Worked Hours */}
              <rect x="0" y="0" width={wWorkedBar} height="44" fill="#0284c7" rx="8" />
              {wWorkedBar > 80 && (
                <text
                  x={wWorkedBar / 2}
                  y="27"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {actualWorkedHoursPerYear.toLocaleString()} h Worked
                </text>
              )}

              {/* Paid Time Off (Holidays + Vacation) */}
              {ptoHours > 0 && (
                <>
                  <rect
                    x={wWorkedBar}
                    y="0"
                    width={wPtoBar}
                    height="44"
                    fill="#10b981"
                    rx={wWorkedBar > 0 ? 0 : 8}
                  />
                  {wPtoBar > 50 && (
                    <text
                      x={wWorkedBar + wPtoBar / 2}
                      y="27"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {ptoHours} h PTO
                    </text>
                  )}
                </>
              )}
            </g>

            {/* Overtime badge if applicable */}
            {overtimeAnnualGross > 0 && (
              <g transform="translate(40, 145)">
                <rect x="0" y="0" width={barTotalW} height="36" fill="#fef3c7" stroke="#fde68a" rx="6" />
                <text x="14" y="23" fill="#92400e" fontSize="11.5" fontWeight="700">
                  ⚡ Overtime Added: +{currencySymbol}
                  {Math.round(overtimeAnnualGross).toLocaleString()} / year (included in total gross)
                </text>
              </g>
            )}

            {/* Explanatory footer */}
            <text x="270" y={overtimeAnnualGross > 0 ? 218 : 175} fill="#64748b" fontSize="11" textAnchor="middle">
              Paid time off preserves your annual salary while lowering hours on the clock.
            </text>
          </svg>
        )}
      </div>

      <div className={styles.legend}>
        {view === 'paychecks' ? (
          <>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#0284c7' }} />
              <span>Monthly (12x)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#38bdf8' }} />
              <span>Semi-Monthly (24x)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#10b981' }} />
              <span>Biweekly (26x)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#a7f3d0' }} />
              <span>Weekly (52x)</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#0284c7' }} />
              <span>Hours on the Clock ({actualWorkedHoursPerYear} h)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#10b981' }} />
              <span>Paid Time Off ({paidHoursPerYear - actualWorkedHoursPerYear} h)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
