'use client';

import React, { useState } from 'react';
import styles from './FreelanceInputGuide.module.css';

export type FreelanceFieldId =
  | 'targetTakeHome'
  | 'workCalendar'
  | 'billablePct'
  | 'taxRate'
  | 'businessCosts'
  | 'benefits'
  | 'bufferPct'
  | 'hourlyRate';

interface FreelanceInputGuideProps {
  mode: 'goal' | 'income' | 'project';
  activeField?: FreelanceFieldId | null;
  targetTakeHome: number;
  billableHours: number;
  totalWorkingHours: number;
  timeOffDays: number;
  billablePct: number;
  taxPct: number;
  businessCosts: number;
  benefits: number;
  recommendedRate: number;
  breakEvenRate: number;
}

export default function FreelanceInputGuide({
  mode,
  activeField,
  targetTakeHome,
  billableHours,
  totalWorkingHours,
  timeOffDays,
  billablePct,
  taxPct,
  businessCosts,
  benefits,
  recommendedRate,
  breakEvenRate,
}: FreelanceInputGuideProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isRateToIncome = mode === 'income';

  // 52 weeks represented as blocks (4 rows of 13 blocks)
  const totalWeeks = 52;
  const timeOffWeeks = Math.min(20, Math.round(timeOffDays / 5));
  const workWeeks = totalWeeks - timeOffWeeks;
  const billableWeeks = Math.round(workWeeks * (billablePct / 100));
  const adminWeeks = workWeeks - billableWeeks;

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitleGroup}>
          <span className={styles.guideBadge}>Visual Guide</span>
          <span className={styles.guideTitle}>
            {isRateToIncome
              ? 'Freelance Rate-to-Income Reverse Flow (Hourly Rate × Billable Hours → Profit & Take-Home)'
              : 'The Freelance Rate Formula (Target Income + Taxes + Overhead ÷ Billable Hours)'}
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
            viewBox="0 0 760 210"
            className={styles.svgDiagram}
            role="img"
            aria-label="Interactive annual calendar and financial stack formula diagram for freelance hourly rates"
          >
            <defs>
              <linearGradient id="billableGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fdba74" />
              </linearGradient>
              <linearGradient id="moneyStackGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <pattern id="diagonalHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#fb923c" strokeWidth="2" />
              </pattern>
            </defs>

            {/* Left Side: 52-Week Working Year Breakdown */}
            <g transform="translate(20, 15)">
              <text x="0" y="10" fill="#0f172a" fontSize="11" fontWeight="700">
                52-Week Calendar: Real Billable Capacity
              </text>
              <text x="0" y="24" fill="#64748b" fontSize="9.5">
                {timeOffDays}d Time Off ({timeOffWeeks} wks) · {billablePct}% Billable ({Math.round(billableHours)} billable hrs/yr)
              </text>

              {/* 52 Mini Week Blocks (4 rows of 13) */}
              <g transform="translate(0, 32)">
                {Array.from({ length: 52 }).map((_, i) => {
                  const col = i % 13;
                  const row = Math.floor(i / 13);
                  const isTimeOff = i < timeOffWeeks;
                  const isBillable = !isTimeOff && i - timeOffWeeks < billableWeeks;
                  const isAdmin = !isTimeOff && !isBillable;

                  let fill = '#0284c7';
                  let stroke = '#0369a1';
                  if (isTimeOff) {
                    fill = '#e2e8f0';
                    stroke = '#cbd5e1';
                  } else if (isAdmin) {
                    fill = '#ffedd5';
                    stroke = '#fdba74';
                  }

                  return (
                    <rect
                      key={i}
                      x={col * 24}
                      y={row * 18}
                      width="20"
                      height="14"
                      rx="3"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1"
                    />
                  );
                })}
              </g>

              {/* Legend below calendar */}
              <g transform="translate(0, 114)">
                <rect x="0" y="0" width="10" height="10" rx="2" fill="#0284c7" />
                <text x="14" y="9" fill="#334155" fontSize="9" fontWeight="600">
                  Billable Client Time ({Math.round(billableHours)} h)
                </text>

                <rect x="160" y="0" width="10" height="10" rx="2" fill="#ffedd5" stroke="#fdba74" />
                <text x="174" y="9" fill="#334155" fontSize="9" fontWeight="600">
                  Admin &amp; Marketing
                </text>

                <rect x="270" y="0" width="10" height="10" rx="2" fill="#e2e8f0" />
                <text x="284" y="9" fill="#334155" fontSize="9" fontWeight="600">
                  Time Off ({timeOffDays}d)
                </text>
              </g>
            </g>

            {/* Middle Divider / Linking Arrow */}
            <g transform="translate(370, 75)">
              <line x1="0" y1="15" x2="35" y2="15" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4 3" />
              <polygon points="35,10 44,15 35,20" fill="#0284c7" />
              <text x="22" y="32" fill="#0284c7" fontSize="9" fontWeight="700" textAnchor="middle">
                ÷ {Math.round(billableHours)} hrs
              </text>
            </g>

            {/* Right Side: The Financial Stack */}
            <g transform="translate(435, 15)">
              <text x="0" y="10" fill="#0f172a" fontSize="11" fontWeight="700">
                Annual Financial Stack (Read Bottom-Up)
              </text>
              <text x="0" y="24" fill="#64748b" fontSize="9.5">
                Target Pay + Tax Reserve + Overhead + Benefits = Revenue
              </text>

              {/* Stacked Vertical Waterfall Cards */}
              <g transform="translate(0, 32)">
                {/* Layer 4 (Top): +15% Buffer / Profit */}
                <g transform="translate(0, 0)">
                  <rect
                    x="0"
                    y="0"
                    width="295"
                    height="20"
                    rx="4"
                    fill="#ecfdf5"
                    stroke="#10b981"
                    strokeWidth={activeField === 'bufferPct' ? '2' : '1'}
                  />
                  <circle cx="10" cy="10" r="6" fill="#059669" />
                  <text x="10" y="13" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    10
                  </text>
                  <text x="22" y="14" fill="#065f46" fontSize="9" fontWeight="700">
                    +15% Risk Buffer: Recommended Rate = ${Math.round(recommendedRate)}/hr
                  </text>
                </g>

                {/* Layer 3: Benefits & Business Costs */}
                <g transform="translate(0, 24)">
                  <rect
                    x="0"
                    y="0"
                    width="295"
                    height="20"
                    rx="4"
                    fill="#fef3c7"
                    stroke="#f59e0b"
                    strokeWidth={activeField === 'businessCosts' || activeField === 'benefits' ? '2' : '1'}
                  />
                  <circle cx="10" cy="10" r="6" fill="#d97706" />
                  <text x="10" y="13" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    8
                  </text>
                  <text x="22" y="14" fill="#92400e" fontSize="9" fontWeight="700">
                    Overhead &amp; Benefits: ${Math.round(businessCosts + benefits).toLocaleString()}/yr
                  </text>
                </g>

                {/* Layer 2: Estimated Tax (Income + SECA) */}
                <g transform="translate(0, 48)">
                  <rect
                    x="0"
                    y="0"
                    width="295"
                    height="20"
                    rx="4"
                    fill="#fef2f2"
                    stroke="#ef4444"
                    strokeWidth={activeField === 'taxRate' ? '2' : '1'}
                  />
                  <circle cx="10" cy="10" r="6" fill="#dc2626" />
                  <text x="10" y="13" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    7
                  </text>
                  <text x="22" y="14" fill="#991b1b" fontSize="9" fontWeight="700">
                    {taxPct}% Tax Set-Aside: Income &amp; Self-Employment Tax
                  </text>
                </g>

                {/* Layer 1 (Bottom Foundation): Target Take-Home */}
                <g transform="translate(0, 72)">
                  <rect
                    x="0"
                    y="0"
                    width="295"
                    height="22"
                    rx="4"
                    fill="#eff6ff"
                    stroke="#3b82f6"
                    strokeWidth={activeField === 'targetTakeHome' ? '2' : '1.5'}
                  />
                  <circle cx="10" cy="11" r="6" fill="#2563eb" />
                  <text x="10" y="14" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    1
                  </text>
                  <text x="22" y="15" fill="#1e40af" fontSize="9.5" fontWeight="800">
                    Take-Home Target: ${Math.round(targetTakeHome).toLocaleString()}/yr (After-Tax)
                  </text>
                </g>
              </g>

              {/* Bottom Result Pill */}
              <g transform="translate(0, 140)">
                <rect x="0" y="0" width="295" height="26" rx="6" fill="#0284c7" />
                <text x="147" y="17" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
                  Break-Even: ${Math.round(breakEvenRate)}/hr · Recommended: ${Math.round(recommendedRate)}/hr
                </text>
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
