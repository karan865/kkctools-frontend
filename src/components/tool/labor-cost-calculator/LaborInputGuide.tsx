'use client';

import React, { useState } from 'react';
import styles from './LaborInputGuide.module.css';

export type LaborFieldId =
  | 'wage'
  | 'hours'
  | 'timeoff'
  | 'payrolltaxes'
  | 'workerscomp'
  | 'liability'
  | 'benefits'
  | 'crew'
  | 'expenses'
  | 'markup'
  | 'revenue';

export interface LaborInputGuideProps {
  tab: 'employee' | 'job' | 'labor-pct';
  activeField: LaborFieldId | null;
  wagesAnnual: number;
  payrollTaxesAnnual: number;
  workersCompAnnual: number;
  liabilityAnnual: number;
  benefitsAnnual: number;
  totalCostAnnual: number;
  paidHours: number;
  timeOffHours: number;
  productiveHours: number;
  burdenedProductiveRate: number | null;
  // Job tab props
  totalLaborCost?: number;
  materialsCost?: number;
  equipmentCost?: number;
  subsCost?: number;
  quotePrice?: number;
  // Labor % tab props
  laborCost?: number;
  revenue?: number;
  laborPercent?: number | null;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function LaborInputGuide({
  tab,
  activeField,
  wagesAnnual,
  payrollTaxesAnnual,
  workersCompAnnual,
  liabilityAnnual,
  benefitsAnnual,
  totalCostAnnual,
  paidHours,
  timeOffHours,
  productiveHours,
  burdenedProductiveRate,
  totalLaborCost = 0,
  materialsCost = 0,
  equipmentCost = 0,
  subsCost = 0,
  quotePrice = 0,
  revenue = 0,
  laborPercent = null,
}: LaborInputGuideProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isHighlighted = (field: LaborFieldId) => activeField === field;
  const isDimmed = (field: LaborFieldId) => activeField !== null && activeField !== field;

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitle}>
          <span>Visual Cost Flow</span>
          <span className={styles.guideTitleBadge}>
            {tab === 'employee' ? 'True Employee Cost' : tab === 'job' ? 'Job Labor & Quote' : 'Labor % of Revenue'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.toggleBtn}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? 'Show Diagram' : 'Hide Diagram'}
        </button>
      </div>

      {!isCollapsed && (
        <div className={styles.svgWrap}>
          {tab === 'employee' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 180"
              role="img"
              aria-label="True employee cost breakdown and productive hours workflow"
            >
              {/* Background canvas */}
              <rect x="0" y="0" width="880" height="180" rx="8" fill="#f8fafc" />

              {/* STACKED COST BREAKDOWN (Left Side 0 to 520) */}
              <text x="20" y="24" fill="#475569" fontSize="12" fontWeight="700">
                1. ANNUAL EMPLOYEE COST WATERFALL
              </text>

              {/* Base Wages Box */}
              <g
                className={`${styles.flowBox} ${isHighlighted('wage') ? styles.highlighted : ''} ${
                  isDimmed('wage') ? styles.dimmed : ''
                }`}
              >
                <rect x="20" y="36" width="130" height="58" rx="6" fill="#3b82f6" />
                <circle cx="34" cy="50" r="9" fill="#1d4ed8" />
                <text x="34" y="54" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">1</text>
                <text x="50" y="52" fill="#ffffff" fontSize="11" fontWeight="700">Gross Wages</text>
                <text x="50" y="74" fill="#eff6ff" fontSize="14" fontWeight="800">{fmt(wagesAnnual)}</text>
              </g>

              {/* Plus icon */}
              <text x="160" y="70" fill="#94a3b8" fontSize="18" fontWeight="700" textAnchor="middle">+</text>

              {/* Taxes Box */}
              <g
                className={`${styles.flowBox} ${isHighlighted('payrolltaxes') ? styles.highlighted : ''} ${
                  isDimmed('payrolltaxes') ? styles.dimmed : ''
                }`}
              >
                <rect x="175" y="36" width="105" height="58" rx="6" fill="#0284c7" />
                <circle cx="187" cy="50" r="9" fill="#0369a1" />
                <text x="187" y="54" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">2</text>
                <text x="202" y="52" fill="#ffffff" fontSize="11" fontWeight="700">Payroll Taxes</text>
                <text x="202" y="74" fill="#f0f9ff" fontSize="13" fontWeight="800">{fmt(payrollTaxesAnnual)}</text>
              </g>

              {/* Plus icon */}
              <text x="290" y="70" fill="#94a3b8" fontSize="18" fontWeight="700" textAnchor="middle">+</text>

              {/* Workers Comp & Ins */}
              <g
                className={`${styles.flowBox} ${
                  isHighlighted('workerscomp') || isHighlighted('liability') ? styles.highlighted : ''
                } ${isDimmed('workerscomp') && isDimmed('liability') ? styles.dimmed : ''}`}
              >
                <rect x="305" y="36" width="105" height="58" rx="6" fill="#0d9488" />
                <circle cx="317" cy="50" r="9" fill="#0f766e" />
                <text x="317" y="54" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">3</text>
                <text x="332" y="52" fill="#ffffff" fontSize="11" fontWeight="700">Comp & Ins</text>
                <text x="332" y="74" fill="#ccfbf1" fontSize="13" fontWeight="800">
                  {fmt(workersCompAnnual + liabilityAnnual)}
                </text>
              </g>

              {/* Plus icon */}
              <text x="420" y="70" fill="#94a3b8" fontSize="18" fontWeight="700" textAnchor="middle">+</text>

              {/* Benefits Box */}
              <g
                className={`${styles.flowBox} ${isHighlighted('benefits') ? styles.highlighted : ''} ${
                  isDimmed('benefits') ? styles.dimmed : ''
                }`}
              >
                <rect x="435" y="36" width="95" height="58" rx="6" fill="#10b981" />
                <circle cx="447" cy="50" r="9" fill="#059669" />
                <text x="447" y="54" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">4</text>
                <text x="462" y="52" fill="#ffffff" fontSize="11" fontWeight="700">Benefits</text>
                <text x="462" y="74" fill="#ecfdf5" fontSize="13" fontWeight="800">{fmt(benefitsAnnual)}</text>
              </g>

              {/* Equals icon */}
              <text x="542" y="70" fill="#94a3b8" fontSize="18" fontWeight="700" textAnchor="middle">=</text>

              {/* Total Annual Cost Box */}
              <rect x="555" y="36" width="115" height="58" rx="6" fill="#1e293b" />
              <text x="568" y="52" fill="#94a3b8" fontSize="10" fontWeight="700">TOTAL COST</text>
              <text x="568" y="74" fill="#38bdf8" fontSize="15" fontWeight="800">{fmt(totalCostAnnual)}</text>

              {/* PRODUCTIVE HOURS & BURDENED RATE (Right side 690 to 860) */}
              <text x="690" y="24" fill="#475569" fontSize="12" fontWeight="700">
                2. PRODUCTIVE HOURS
              </text>

              <g
                className={`${styles.flowBox} ${
                  isHighlighted('hours') || isHighlighted('timeoff') ? styles.highlighted : ''
                } ${isDimmed('hours') && isDimmed('timeoff') ? styles.dimmed : ''}`}
              >
                <rect x="690" y="36" width="170" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="702" y="53" fill="#64748b" fontSize="10">
                  {paidHours} Paid − {timeOffHours} Time Off
                </text>
                <text x="702" y="74" fill="#0f172a" fontSize="14" fontWeight="800">
                  = {productiveHours} Billable h
                </text>
              </g>

              {/* BOTTOM FORMULA RIBBON */}
              <rect x="20" y="110" width="840" height="54" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
              <circle cx="45" cy="137" r="14" fill="#10b981" />
              <text x="45" y="142" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">✓</text>
              <text x="72" y="131" fill="#065f46" fontSize="11" fontWeight="700">
                TRUE BURDENED RATE (WHAT YOU PRICE WITH):
              </text>
              <text x="72" y="151" fill="#047857" fontSize="13">
                {fmt(totalCostAnnual)} Total Cost ÷ {productiveHours} Productive Hours ={' '}
                <tspan fontWeight="800" fontSize="15">
                  {burdenedProductiveRate !== null ? `$${burdenedProductiveRate.toFixed(2)}/hour` : '—'}
                </tspan>
              </text>
            </svg>
          )}

          {tab === 'job' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 150"
              role="img"
              aria-label="Job labor and quote estimating flow diagram"
            >
              <rect x="0" y="0" width="880" height="150" rx="8" fill="#f8fafc" />

              {/* Crew Labor */}
              <g
                className={`${styles.flowBox} ${isHighlighted('crew') ? styles.highlighted : ''} ${
                  isDimmed('crew') ? styles.dimmed : ''
                }`}
              >
                <rect x="20" y="30" width="140" height="85" rx="6" fill="#3b82f6" />
                <circle cx="34" cy="48" r="9" fill="#1d4ed8" />
                <text x="34" y="52" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">1</text>
                <text x="50" y="50" fill="#ffffff" fontSize="11" fontWeight="700">Direct Labor</text>
                <text x="32" y="72" fill="#dbeafe" fontSize="10">Crew hours × rates</text>
                <text x="32" y="96" fill="#ffffff" fontSize="15" fontWeight="800">{fmt(totalLaborCost)}</text>
              </g>

              <text x="180" y="77" fill="#94a3b8" fontSize="20" fontWeight="700" textAnchor="middle">+</text>

              {/* Materials & Equipment */}
              <g
                className={`${styles.flowBox} ${isHighlighted('expenses') ? styles.highlighted : ''} ${
                  isDimmed('expenses') ? styles.dimmed : ''
                }`}
              >
                <rect x="200" y="30" width="150" height="85" rx="6" fill="#0284c7" />
                <circle cx="214" cy="48" r="9" fill="#0369a1" />
                <text x="214" y="52" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">2</text>
                <text x="230" y="50" fill="#ffffff" fontSize="11" fontWeight="700">Materials & Subs</text>
                <text x="214" y="72" fill="#e0f2fe" fontSize="10">Materials + Equip + Subs</text>
                <text x="214" y="96" fill="#ffffff" fontSize="15" fontWeight="800">
                  {fmt(materialsCost + equipmentCost + subsCost)}
                </text>
              </g>

              <text x="370" y="77" fill="#94a3b8" fontSize="20" fontWeight="700" textAnchor="middle">+</text>

              {/* Overhead & Profit Markup */}
              <g
                className={`${styles.flowBox} ${isHighlighted('markup') ? styles.highlighted : ''} ${
                  isDimmed('markup') ? styles.dimmed : ''
                }`}
              >
                <rect x="390" y="30" width="160" height="85" rx="6" fill="#0d9488" />
                <circle cx="404" cy="48" r="9" fill="#0f766e" />
                <text x="404" y="52" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">3</text>
                <text x="420" y="50" fill="#ffffff" fontSize="11" fontWeight="700">Overhead & Profit</text>
                <text x="404" y="72" fill="#ccfbf1" fontSize="10">Markup or margin %</text>
                <text x="404" y="96" fill="#ffffff" fontSize="14" fontWeight="800">
                  +{fmt(Math.max(0, quotePrice - (totalLaborCost + materialsCost + equipmentCost + subsCost)))}
                </text>
              </g>

              <text x="570" y="77" fill="#94a3b8" fontSize="20" fontWeight="700" textAnchor="middle">=</text>

              {/* Final Quote Box */}
              <rect x="590" y="24" width="270" height="97" rx="8" fill="#1e293b" />
              <text x="612" y="48" fill="#94a3b8" fontSize="11" fontWeight="700">FINAL CLIENT QUOTE</text>
              <text x="612" y="80" fill="#38bdf8" fontSize="24" fontWeight="800">{fmt(quotePrice)}</text>
              <text x="612" y="103" fill="#cbd5e1" fontSize="11">
                Labor + Materials + Overhead + Profit
              </text>
            </svg>
          )}

          {tab === 'labor-pct' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 140"
              role="img"
              aria-label="Labor cost as a percentage of revenue diagram"
            >
              <rect x="0" y="0" width="880" height="140" rx="8" fill="#f8fafc" />

              {/* Total Labor Cost Bar */}
              <g
                className={`${styles.flowBox} ${isHighlighted('revenue') ? styles.highlighted : ''} ${
                  isDimmed('revenue') ? styles.dimmed : ''
                }`}
              >
                <rect x="30" y="30" width="220" height="80" rx="6" fill="#3b82f6" />
                <text x="50" y="54" fill="#ffffff" fontSize="11" fontWeight="700">Total Labor Cost</text>
                <text x="50" y="82" fill="#ffffff" fontSize="20" fontWeight="800">
                  {fmt(totalLaborCost || wagesAnnual)}
                </text>
                <text x="50" y="100" fill="#dbeafe" fontSize="10">Payroll, taxes, benefits</text>
              </g>

              <text x="280" y="75" fill="#94a3b8" fontSize="16" fontWeight="700" textAnchor="middle">VS</text>

              {/* Total Revenue Bar */}
              <g
                className={`${styles.flowBox} ${isHighlighted('revenue') ? styles.highlighted : ''} ${
                  isDimmed('revenue') ? styles.dimmed : ''
                }`}
              >
                <rect x="310" y="30" width="240" height="80" rx="6" fill="#0284c7" />
                <text x="330" y="54" fill="#ffffff" fontSize="11" fontWeight="700">Total Business Revenue</text>
                <text x="330" y="82" fill="#ffffff" fontSize="20" fontWeight="800">{fmt(revenue)}</text>
                <text x="330" y="100" fill="#e0f2fe" fontSize="10">Gross sales / billings</text>
              </g>

              {/* Result Badge */}
              <rect x="580" y="25" width="270" height="90" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
              <text x="604" y="52" fill="#065f46" fontSize="11" fontWeight="700">LABOR % OF REVENUE</text>
              <text x="604" y="86" fill="#047857" fontSize="26" fontWeight="800">
                {laborPercent !== null ? `${laborPercent.toFixed(1)}%` : '—'}
              </text>
              <text x="604" y="104" fill="#065f46" fontSize="11">
                {laborPercent !== null && laborPercent > 0
                  ? `${laborPercent.toFixed(1)} cents of every revenue dollar goes to labor`
                  : 'Enter positive revenue to calculate'}
              </text>
            </svg>
          )}
        </div>
      )}

      <div className={styles.guideLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#3b82f6' }} />
          <span>Wages / Direct Labor</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#0284c7' }} />
          <span>Payroll Taxes & Caps</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#0d9488' }} />
          <span>Insurance & Comp</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#10b981' }} />
          <span>Benefits</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#1e293b' }} />
          <span>Productive Hourly Rate</span>
        </div>
      </div>
    </div>
  );
}
