'use client';

import React, { useState } from 'react';
import styles from './LeaseInputGuide.module.css';

export type LeaseFieldId =
  | 'area'
  | 'load'
  | 'baserate'
  | 'leasetype'
  | 'passthrough'
  | 'term'
  | 'escalation'
  | 'concession'
  | 'cam'
  | 'percentage';

export interface LeaseInputGuideProps {
  tab: 'cost' | 'compare' | 'cam' | 'retail';
  activeField: LeaseFieldId | null;
  usableArea: number;
  rentableArea: number;
  loadFactorPercent: number;
  baseRateYr: number;
  passThroughRateYr: number;
  leaseType: string;
  year1MonthlyTotal: number;
  termYears: number;
  totalLeaseCost: number;
  netEffectiveRentYr: number;
  freeRentMonths: number;
  tiAllowancePerUnit: number;
  // CAM tab
  buildingRsf?: number;
  tenantRsf?: number;
  camSharePercent?: number | null;
  // Retail tab
  projectedSales?: number;
  breakpoint?: number;
  percentageRent?: number;
}

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function LeaseInputGuide({
  tab,
  activeField,
  usableArea,
  rentableArea,
  loadFactorPercent,
  baseRateYr,
  passThroughRateYr,
  leaseType,
  year1MonthlyTotal,
  termYears,
  totalLeaseCost,
  netEffectiveRentYr,
  freeRentMonths,
  tiAllowancePerUnit,
  buildingRsf = 50000,
  tenantRsf = 2300,
  camSharePercent = 4.6,
  projectedSales = 1000000,
  breakpoint = 1000000,
  percentageRent = 0,
}: LeaseInputGuideProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isHighlighted = (field: LeaseFieldId) => activeField === field;
  const isDimmed = (field: LeaseFieldId) => activeField !== null && activeField !== field;

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitle}>
          <span>Visual Lease Breakdown</span>
          <span className={styles.guideTitleBadge}>
            {tab === 'cost'
              ? 'Floor Plan & Occupancy Cost'
              : tab === 'compare'
              ? 'Offer Comparison'
              : tab === 'cam'
              ? 'Building CAM Share'
              : 'Retail Sales Breakpoint'}
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
          {tab === 'cost' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 185"
              role="img"
              aria-label="Floor plan usable vs rentable space and lease cost waterfall diagram"
            >
              <rect x="0" y="0" width="880" height="185" rx="8" fill="#f8fafc" />

              {/* 1. FLOOR PLAN (Left: 20 to 240) */}
              <text x="20" y="24" fill="#475569" fontSize="11" fontWeight="700">
                1. SPACE: USABLE VS. RENTABLE
              </text>

              {/* Outer shaded ring = Rentable Area (Load Factor) */}
              <g
                className={`${styles.flowBox} ${isHighlighted('load') ? styles.highlighted : ''} ${
                  isDimmed('load') ? styles.dimmed : ''
                }`}
              >
                <rect x="20" y="34" width="210" height="78" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="218" y="48" fill="#64748b" fontSize="10" textAnchor="end">
                  +{loadFactorPercent}% Load Factor
                </text>
              </g>

              {/* Inner suite = Usable Area */}
              <g
                className={`${styles.flowBox} ${isHighlighted('area') ? styles.highlighted : ''} ${
                  isDimmed('area') ? styles.dimmed : ''
                }`}
              >
                <rect x="32" y="46" width="150" height="54" rx="4" fill="#3b82f6" />
                <circle cx="44" cy="58" r="8" fill="#1d4ed8" />
                <text x="44" y="62" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">1</text>
                <text x="58" y="60" fill="#ffffff" fontSize="10" fontWeight="700">Usable (USF)</text>
                <text x="36" y="86" fill="#eff6ff" fontSize="13" fontWeight="800">
                  {Math.round(usableArea).toLocaleString()} sq ft
                </text>
              </g>

              {/* Total Rentable Badge */}
              <rect x="20" y="116" width="210" height="24" rx="4" fill="#1e293b" />
              <text x="125" y="132" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">
                = {Math.round(rentableArea).toLocaleString()} Rentable (RSF)
              </text>

              {/* PLUS ICON */}
              <text x="250" y="80" fill="#94a3b8" fontSize="18" fontWeight="700" textAnchor="middle">×</text>

              {/* 2. RENT STACK (Middle: 265 to 550) */}
              <text x="265" y="24" fill="#475569" fontSize="11" fontWeight="700">
                2. RENT &amp; PASS-THROUGHS ({leaseType.toUpperCase()})
              </text>

              {/* Base Rent Box */}
              <g
                className={`${styles.flowBox} ${isHighlighted('baserate') ? styles.highlighted : ''} ${
                  isDimmed('baserate') ? styles.dimmed : ''
                }`}
              >
                <rect x="265" y="34" width="130" height="64" rx="6" fill="#0284c7" />
                <circle cx="277" cy="48" r="8" fill="#0369a1" />
                <text x="277" y="52" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">2</text>
                <text x="290" y="50" fill="#ffffff" fontSize="10" fontWeight="700">Base Rent</text>
                <text x="277" y="72" fill="#ffffff" fontSize="13" fontWeight="800">${baseRateYr.toFixed(2)}/SF/yr</text>
                <text x="277" y="88" fill="#e0f2fe" fontSize="10">{fmt((rentableArea * baseRateYr) / 12)}/mo</text>
              </g>

              <text x="408" y="70" fill="#94a3b8" fontSize="16" fontWeight="700" textAnchor="middle">+</text>

              {/* Pass-Throughs (NNN / CAM / Tax) */}
              <g
                className={`${styles.flowBox} ${isHighlighted('passthrough') ? styles.highlighted : ''} ${
                  isDimmed('passthrough') ? styles.dimmed : ''
                }`}
              >
                <rect
                  x="420"
                  y="34"
                  width="130"
                  height="64"
                  rx="6"
                  fill={leaseType === 'gross' ? '#94a3b8' : '#0d9488'}
                />
                <circle cx="432" cy="48" r="8" fill={leaseType === 'gross' ? '#64748b' : '#0f766e'} />
                <text x="432" y="52" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">3</text>
                <text x="445" y="50" fill="#ffffff" fontSize="10" fontWeight="700">
                  {leaseType === 'gross' ? 'Pass-Throughs' : 'NNN / CAM'}
                </text>
                <text x="432" y="72" fill="#ffffff" fontSize="13" fontWeight="800">
                  {leaseType === 'gross' ? '$0.00 (Gross)' : `$${passThroughRateYr.toFixed(2)}/SF/yr`}
                </text>
                <text x="432" y="88" fill="#ccfbf1" fontSize="10">
                  {leaseType === 'gross' ? 'Landlord pays' : `${fmt((rentableArea * passThroughRateYr) / 12)}/mo`}
                </text>
              </g>

              {/* EQUALS ICON */}
              <text x="565" y="70" fill="#94a3b8" fontSize="18" fontWeight="700" textAnchor="middle">=</text>

              {/* 3. YEAR 1 OCCUPANCY COST (580 to 860) */}
              <rect x="580" y="34" width="280" height="64" rx="6" fill="#1e293b" />
              <text x="596" y="52" fill="#94a3b8" fontSize="10" fontWeight="700">
                YEAR 1 MONTHLY TOTAL (BASE + NNN)
              </text>
              <text x="596" y="78" fill="#38bdf8" fontSize="22" fontWeight="800">
                {fmt(year1MonthlyTotal)}/mo
              </text>
              <text x="596" y="92" fill="#cbd5e1" fontSize="10">
                {fmt(year1MonthlyTotal * 12)}/year gross occupancy cost
              </text>

              {/* BOTTOM CONCESSIONS & NET EFFECTIVE RIBBON */}
              <rect x="20" y="112" width="840" height="58" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
              <circle cx="45" cy="141" r="13" fill="#10b981" />
              <text x="45" y="146" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">★</text>
              <text x="70" y="133" fill="#065f46" fontSize="11" fontWeight="700">
                CONCESSIONS &amp; NET EFFECTIVE RENT ({termYears}-YEAR LEASE TOTAL: {fmt(totalLeaseCost)})
              </text>
              <text x="70" y="153" fill="#047857" fontSize="12">
                {freeRentMonths} Mos Free Rent (−{fmt((freeRentMonths * rentableArea * baseRateYr) / 12)}) + ${tiAllowancePerUnit} TI Allowance (−{fmt(tiAllowancePerUnit * rentableArea)}) →{' '}
                <tspan fontWeight="800" fontSize="14">
                  Net Effective Rent: ${netEffectiveRentYr.toFixed(2)}/SF/yr
                </tspan>
              </text>
            </svg>
          )}

          {tab === 'compare' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 140"
              role="img"
              aria-label="Lease offer comparison overview diagram"
            >
              <rect x="0" y="0" width="880" height="140" rx="8" fill="#f8fafc" />

              <g className={styles.flowBox}>
                <rect x="30" y="25" width="380" height="90" rx="8" fill="#3b82f6" />
                <text x="50" y="52" fill="#ffffff" fontSize="12" fontWeight="700">OFFER A (NNN Base + Pass-Throughs)</text>
                <text x="50" y="80" fill="#ffffff" fontSize="22" fontWeight="800">${baseRateYr}/SF NNN + $8 Pass</text>
                <text x="50" y="100" fill="#dbeafe" fontSize="11">5-Yr Total: $375,864 ($6,264/mo avg)</text>
              </g>

              <text x="440" y="75" fill="#94a3b8" fontSize="16" fontWeight="700" textAnchor="middle">VS</text>

              <g className={styles.flowBox}>
                <rect x="470" y="25" width="380" height="90" rx="8" fill="#0284c7" />
                <text x="490" y="52" fill="#ffffff" fontSize="12" fontWeight="700">OFFER B (Full Service Gross)</text>
                <text x="490" y="80" fill="#ffffff" fontSize="22" fontWeight="800">$32.00/SF Gross ($0 Pass)</text>
                <text x="490" y="100" fill="#e0f2fe" fontSize="11">5-Yr Total: $390,752 ($6,513/mo avg)</text>
              </g>
            </svg>
          )}

          {tab === 'cam' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 140"
              role="img"
              aria-label="Common Area Maintenance pro-rata share diagram"
            >
              <rect x="0" y="0" width="880" height="140" rx="8" fill="#f8fafc" />

              <rect x="30" y="25" width="220" height="90" rx="8" fill="#3b82f6" />
              <text x="50" y="52" fill="#ffffff" fontSize="11" fontWeight="700">Your Suite RSF</text>
              <text x="50" y="82" fill="#ffffff" fontSize="22" fontWeight="800">
                {Math.round(tenantRsf).toLocaleString()} RSF
              </text>
              <text x="50" y="100" fill="#dbeafe" fontSize="10">Leased space</text>

              <text x="280" y="75" fill="#94a3b8" fontSize="20" fontWeight="700" textAnchor="middle">÷</text>

              <rect x="310" y="25" width="220" height="90" rx="8" fill="#0284c7" />
              <text x="330" y="52" fill="#ffffff" fontSize="11" fontWeight="700">Total Building RSF</text>
              <text x="330" y="82" fill="#ffffff" fontSize="22" fontWeight="800">
                {Math.round(buildingRsf).toLocaleString()} RSF
              </text>
              <text x="330" y="100" fill="#e0f2fe" fontSize="10">Gross leasable area</text>

              <text x="560" y="75" fill="#94a3b8" fontSize="20" fontWeight="700" textAnchor="middle">=</text>

              <rect x="590" y="25" width="260" height="90" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
              <text x="614" y="52" fill="#065f46" fontSize="11" fontWeight="700">YOUR PRO-RATA CAM SHARE</text>
              <text x="614" y="84" fill="#047857" fontSize="26" fontWeight="800">
                {camSharePercent !== null ? `${camSharePercent.toFixed(2)}%` : '—'}
              </text>
              <text x="614" y="102" fill="#065f46" fontSize="10">
                Share of all building maintenance &amp; taxes
              </text>
            </svg>
          )}

          {tab === 'retail' && (
            <svg
              className={styles.svg}
              viewBox="0 0 880 140"
              role="img"
              aria-label="Retail percentage rent breakpoint diagram"
            >
              <rect x="0" y="0" width="880" height="140" rx="8" fill="#f8fafc" />

              <rect x="30" y="25" width="230" height="90" rx="8" fill="#3b82f6" />
              <text x="50" y="50" fill="#ffffff" fontSize="11" fontWeight="700">Annual Gross Sales</text>
              <text x="50" y="78" fill="#ffffff" fontSize="20" fontWeight="800">{fmt(projectedSales)}</text>
              <text x="50" y="98" fill="#dbeafe" fontSize="10">Reported retail revenue</text>

              <text x="290" y="75" fill="#94a3b8" fontSize="16" fontWeight="700" textAnchor="middle">VS</text>

              <rect x="320" y="25" width="230" height="90" rx="8" fill="#0284c7" />
              <text x="340" y="50" fill="#ffffff" fontSize="11" fontWeight="700">Breakpoint Threshold</text>
              <text x="340" y="78" fill="#ffffff" fontSize="20" fontWeight="800">{fmt(breakpoint)}</text>
              <text x="340" y="98" fill="#e0f2fe" fontSize="10">Base rent ÷ % rate</text>

              <rect x="580" y="25" width="270" height="90" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
              <text x="604" y="50" fill="#065f46" fontSize="11" fontWeight="700">OVERAGE / PERCENTAGE RENT</text>
              <text x="604" y="80" fill="#047857" fontSize="24" fontWeight="800">{fmt(percentageRent)}/yr</text>
              <text x="604" y="98" fill="#065f46" fontSize="10">
                {projectedSales > breakpoint
                  ? `Due on ${fmt(projectedSales - breakpoint)} sales over breakpoint`
                  : 'Sales below breakpoint ($0 percentage rent)'}
              </text>
            </svg>
          )}
        </div>
      )}

      <div className={styles.guideLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#3b82f6' }} />
          <span>Usable Space (USF)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#e2e8f0' }} />
          <span>Load Factor &amp; Common Areas</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#0284c7' }} />
          <span>Base Rent ($/SF/yr)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#0d9488' }} />
          <span>Pass-Throughs (NNN / CAM)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#10b981' }} />
          <span>Concessions &amp; Net Effective Rent</span>
        </div>
      </div>
    </div>
  );
}
