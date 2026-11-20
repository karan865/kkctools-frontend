'use client';

import React, { useState } from 'react';
import styles from './AirbnbInputGuide.module.css';

export type StrFieldId =
  | 'nightlyRate'
  | 'occupancyPct'
  | 'avgStayNights'
  | 'cleaningFeeCharged'
  | 'platformFee'
  | 'cleaningCost'
  | 'fixedBills'
  | 'occupancyTax'
  | 'mortgageOrRent';

interface AirbnbInputGuideProps {
  mode: 'buy' | 'arbitrage' | 'midterm' | 'str-vs-ltr';
  activeField?: StrFieldId | null;
  nightlyRate: number;
  occupancyPct: number;
  avgStayNights: number;
  cleaningFeeCharged: number;
  hostFeePct: number;
  cleaningCost: number;
  suppliesCost: number;
  monthlyFixedBills: number;
  monthlyDebtOrRent: number;
}

export default function AirbnbInputGuide({
  mode,
  activeField,
  nightlyRate,
  occupancyPct,
  avgStayNights,
  cleaningFeeCharged,
  hostFeePct,
  cleaningCost,
  suppliesCost,
  monthlyFixedBills,
  monthlyDebtOrRent,
}: AirbnbInputGuideProps) {
  const [collapsed, setCollapsed] = useState(false);

  // 30 days calendar representation
  const totalDays = 30;
  const bookedDays = Math.round((occupancyPct / 100) * totalDays);
  const stayLength = Math.max(1, Math.min(30, Math.round(avgStayNights)));

  // Identify where turnovers occur
  const turnovers: number[] = [];
  let currentStayDays = 0;
  for (let i = 0; i < bookedDays; i++) {
    currentStayDays++;
    if (currentStayDays >= stayLength || i === bookedDays - 1) {
      turnovers.push(i);
      currentStayDays = 0;
    }
  }

  const isArbitrage = mode === 'arbitrage';
  const isMidterm = mode === 'midterm';

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitleGroup}>
          <span className={styles.guideBadge}>Visual Guide</span>
          <span className={styles.guideTitle}>
            {isMidterm
              ? 'Mid-Term Rental (30+ Day Stays) Monthly Turnover Flow'
              : isArbitrage
              ? 'Rental Arbitrage Cash Flow Engine'
              : 'Short-Term Rental 30-Day Booking & Cash Flow Engine'}
          </span>
        </div>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          {collapsed ? 'Show Diagram ▼' : 'Hide Diagram ▲'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.diagramWrap}>
          <svg
            viewBox="0 0 740 230"
            className={styles.svgDiagram}
            role="img"
            aria-label="Interactive 30-day booking calendar and income waterfall diagram for short-term rentals"
          >
            <defs>
              <linearGradient id="bookedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="emptyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <linearGradient id="noiGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Top Bar: Live Price & Cleaning Tag */}
            <g transform="translate(20, 10)">
              {/* Badge 1: Nightly Rate */}
              <g opacity={activeField === 'nightlyRate' ? 1 : 0.95}>
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="34"
                  rx="6"
                  fill={activeField === 'nightlyRate' ? '#e0f2fe' : '#f0f9ff'}
                  stroke={activeField === 'nightlyRate' ? '#0284c7' : '#bae6fd'}
                  strokeWidth={activeField === 'nightlyRate' ? '2' : '1'}
                />
                <circle cx="16" cy="17" r="10" fill="#0284c7" />
                <text x="16" y="21" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  1
                </text>
                <text x="34" y="21" fill="#0369a1" fontSize="11" fontWeight="700">
                  Nightly ADR: ${Math.round(nightlyRate)}
                </text>
              </g>

              {/* Badge 2: Occupancy Rate */}
              <g transform="translate(195, 0)" opacity={activeField === 'occupancyPct' ? 1 : 0.95}>
                <rect
                  x="0"
                  y="0"
                  width="170"
                  height="34"
                  rx="6"
                  fill={activeField === 'occupancyPct' ? '#e0f2fe' : '#f0f9ff'}
                  stroke={activeField === 'occupancyPct' ? '#0284c7' : '#bae6fd'}
                  strokeWidth={activeField === 'occupancyPct' ? '2' : '1'}
                />
                <circle cx="16" cy="17" r="10" fill="#0284c7" />
                <text x="16" y="21" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  2
                </text>
                <text x="34" y="21" fill="#0369a1" fontSize="11" fontWeight="700">
                  Occupancy: {occupancyPct}% ({bookedDays}d/mo)
                </text>
              </g>

              {/* Badge 3: Average Stay */}
              <g transform="translate(380, 0)" opacity={activeField === 'avgStayNights' ? 1 : 0.95}>
                <rect
                  x="0"
                  y="0"
                  width="155"
                  height="34"
                  rx="6"
                  fill={activeField === 'avgStayNights' ? '#e0f2fe' : '#f0f9ff'}
                  stroke={activeField === 'avgStayNights' ? '#0284c7' : '#bae6fd'}
                  strokeWidth={activeField === 'avgStayNights' ? '2' : '1'}
                />
                <circle cx="16" cy="17" r="10" fill="#0284c7" />
                <text x="16" y="21" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  3
                </text>
                <text x="34" y="21" fill="#0369a1" fontSize="11" fontWeight="700">
                  Avg Stay: {avgStayNights} Nights
                </text>
              </g>

              {/* Badge 4: Cleaning Fee */}
              <g transform="translate(550, 0)" opacity={activeField === 'cleaningFeeCharged' ? 1 : 0.95}>
                <rect
                  x="0"
                  y="0"
                  width="150"
                  height="34"
                  rx="6"
                  fill={activeField === 'cleaningFeeCharged' ? '#e0f2fe' : '#f0f9ff'}
                  stroke={activeField === 'cleaningFeeCharged' ? '#0284c7' : '#bae6fd'}
                  strokeWidth={activeField === 'cleaningFeeCharged' ? '2' : '1'}
                />
                <circle cx="16" cy="17" r="10" fill="#0284c7" />
                <text x="16" y="21" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  4
                </text>
                <text x="34" y="21" fill="#0369a1" fontSize="11" fontWeight="700">
                  Cleaning Fee: ${Math.round(cleaningFeeCharged)}
                </text>
              </g>
            </g>

            {/* 30-Day Visual Calendar Strip */}
            <g transform="translate(20, 58)">
              <text x="0" y="10" fill="#64748b" fontSize="10.5" fontWeight="600">
                Sample 30-Day Booking Calendar ({bookedDays} Booked Days · {totalDays - bookedDays} Vacant Days · {turnovers.length} Turnover Cycles)
              </text>

              <g transform="translate(0, 18)">
                {Array.from({ length: 30 }).map((_, i) => {
                  const isBooked = i < bookedDays;
                  const isTurnover = turnovers.includes(i);
                  const x = i * 23.3;

                  return (
                    <g key={i} transform={`translate(${x}, 0)`}>
                      <rect
                        width="21"
                        height="26"
                        rx="4"
                        fill={isBooked ? 'url(#bookedGrad)' : 'url(#emptyGrad)'}
                        stroke={isBooked ? '#0284c7' : '#cbd5e1'}
                        strokeWidth="1"
                      />
                      <text
                        x="10.5"
                        y="16"
                        fill={isBooked ? '#ffffff' : '#94a3b8'}
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {i + 1}
                      </text>
                      {/* Turnover broom indicator at end of stay */}
                      {isTurnover && (
                        <circle cx="10.5" cy="22" r="2.5" fill="#f59e0b" />
                      )}
                    </g>
                  );
                })}
              </g>
            </g>

            {/* Bottom Section: The Cash Flow Money Waterfall */}
            <g transform="translate(20, 128)">
              <rect x="0" y="0" width="700" height="84" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

              <text x="12" y="18" fill="#334155" fontSize="10.5" fontWeight="700">
                Monthly Net Cash Flow Waterfall (Revenue − Platform Fee − Variable Costs − Fixed Bills − Remitted Tax = NOI − Mortgage/Rent = Cash Flow)
              </text>

              {/* Step 5: Platform Fee */}
              <g transform="translate(14, 28)" opacity={activeField === 'platformFee' ? 1 : 0.9}>
                <rect
                  x="0"
                  y="0"
                  width="116"
                  height="44"
                  rx="6"
                  fill={activeField === 'platformFee' ? '#fef3c7' : '#ffffff'}
                  stroke={activeField === 'platformFee' ? '#f59e0b' : '#e2e8f0'}
                  strokeWidth="1.5"
                />
                <circle cx="14" cy="14" r="8" fill="#f59e0b" />
                <text x="14" y="17.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  5
                </text>
                <text x="28" y="15" fill="#92400e" fontSize="9.5" fontWeight="700">
                  Platform Fee
                </text>
                <text x="12" y="32" fill="#78350f" fontSize="10.5" fontWeight="700">
                  {hostFeePct}% fee
                </text>
              </g>

              {/* Arrow */}
              <text x="135" y="54" fill="#94a3b8" fontSize="14" fontWeight="bold">
                −
              </text>

              {/* Step 6: Turnover & Supplies */}
              <g transform="translate(148, 28)" opacity={activeField === 'cleaningCost' ? 1 : 0.9}>
                <rect
                  x="0"
                  y="0"
                  width="122"
                  height="44"
                  rx="6"
                  fill={activeField === 'cleaningCost' ? '#fef3c7' : '#ffffff'}
                  stroke={activeField === 'cleaningCost' ? '#f59e0b' : '#e2e8f0'}
                  strokeWidth="1.5"
                />
                <circle cx="14" cy="14" r="8" fill="#f59e0b" />
                <text x="14" y="17.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  6
                </text>
                <text x="28" y="15" fill="#92400e" fontSize="9.5" fontWeight="700">
                  Turnover Costs
                </text>
                <text x="12" y="32" fill="#78350f" fontSize="10.5" fontWeight="700">
                  ${Math.round(cleaningCost + suppliesCost)}/stay
                </text>
              </g>

              {/* Arrow */}
              <text x="275" y="54" fill="#94a3b8" fontSize="14" fontWeight="bold">
                −
              </text>

              {/* Step 7: Fixed Bills */}
              <g transform="translate(288, 28)" opacity={activeField === 'fixedBills' ? 1 : 0.9}>
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="44"
                  rx="6"
                  fill={activeField === 'fixedBills' ? '#fef3c7' : '#ffffff'}
                  stroke={activeField === 'fixedBills' ? '#f59e0b' : '#e2e8f0'}
                  strokeWidth="1.5"
                />
                <circle cx="14" cy="14" r="8" fill="#f59e0b" />
                <text x="14" y="17.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  7
                </text>
                <text x="28" y="15" fill="#92400e" fontSize="9.5" fontWeight="700">
                  Fixed Bills
                </text>
                <text x="12" y="32" fill="#78350f" fontSize="10.5" fontWeight="700">
                  ${Math.round(monthlyFixedBills)}/mo
                </text>
              </g>

              {/* Arrow */}
              <text x="413" y="54" fill="#94a3b8" fontSize="14" fontWeight="bold">
                =
              </text>

              {/* Step 8: NOI */}
              <g transform="translate(426, 28)">
                <rect x="0" y="0" width="118" height="44" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="8" fill="#059669" />
                <text x="14" y="17.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  8
                </text>
                <text x="28" y="15" fill="#065f46" fontSize="9.5" fontWeight="700">
                  Monthly NOI
                </text>
                <text x="12" y="32" fill="#047857" fontSize="10" fontWeight="700">
                  Pre-debt profit
                </text>
              </g>

              {/* Arrow */}
              <text x="549" y="54" fill="#94a3b8" fontSize="14" fontWeight="bold">
                −
              </text>

              {/* Step 9: Debt or Rent */}
              <g transform="translate(562, 28)" opacity={activeField === 'mortgageOrRent' ? 1 : 0.9}>
                <rect
                  x="0"
                  y="0"
                  width="124"
                  height="44"
                  rx="6"
                  fill={activeField === 'mortgageOrRent' ? '#fef2f2' : '#ffffff'}
                  stroke={activeField === 'mortgageOrRent' ? '#ef4444' : '#e2e8f0'}
                  strokeWidth="1.5"
                />
                <circle cx="14" cy="14" r="8" fill="#dc2626" />
                <text x="14" y="17.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  9
                </text>
                <text x="28" y="15" fill="#991b1b" fontSize="9.5" fontWeight="700">
                  {isArbitrage ? 'Rent to Landlord' : 'Mortgage Payment'}
                </text>
                <text x="12" y="32" fill="#b91c1c" fontSize="10.5" fontWeight="700">
                  ${Math.round(monthlyDebtOrRent)}/mo
                </text>
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
