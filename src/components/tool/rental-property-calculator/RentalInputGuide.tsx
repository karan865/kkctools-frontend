'use client';

import React from 'react';
import styles from './RentalInputGuide.module.css';

export type RentalFieldId =
  | 'price'
  | 'down'
  | 'closing'
  | 'repairs'
  | 'rent'
  | 'vacancy'
  | 'expenses'
  | 'mortgage'
  | 'proforma';

export interface RentalInputGuideProps {
  mode: 'returns' | 'pro-forma' | 'cash-vs-mortgage';
  activeField: RentalFieldId | null;
  price: number;
  cashInvested: number;
  rent: number;
  vacancyLossMonthly: number;
  expensesMonthly: number;
  noiMonthly: number;
  debtServiceMonthly: number;
  cashFlowMonthly: number;
  cocPercent: number | null;
  isFinanced: boolean;
  proFormaYears?: number;
  rentGrowthPercent?: number;
  appreciationPercent?: number;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function RentalInputGuide({
  mode,
  activeField,
  price,
  cashInvested,
  rent,
  vacancyLossMonthly,
  expensesMonthly,
  noiMonthly,
  debtServiceMonthly,
  cashFlowMonthly,
  cocPercent,
  isFinanced,
  proFormaYears = 10,
  rentGrowthPercent = 3,
  appreciationPercent = 3,
}: RentalInputGuideProps) {
  const isHighlighted = (field: RentalFieldId) => activeField === field;
  const isDimmed = (field: RentalFieldId) => activeField !== null && activeField !== field;

  return (
    <div className={styles.wrapper}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryTitle}>
            <span className={styles.summaryIcon}>💡</span> How the Rental Returns Flow Works
          </span>
          <span className={styles.diagramTag}>Diagram</span>
        </summary>

        <div className={styles.diagramContainer}>
          <svg
            viewBox={mode === 'pro-forma' ? '0 0 860 270' : '0 0 860 215'}
            className={styles.svg}
            role="img"
            aria-label="Rental property cash flow and cash-on-cash return calculation flow diagram"
            focusable="false"
          >
            <defs>
              <marker
                id="rentArrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--line, #94a3b8)" />
              </marker>
              <linearGradient id="cocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* FLOW 1: UPFRONT CAPITAL (Top Row) */}
            <g
              className={`${styles.block} ${
                isHighlighted('price') ? styles.active : isDimmed('price') ? styles.dimmed : ''
              }`}
            >
              <rect x="15" y="16" width="110" height="48" rx="6" className={styles.box} />
              <circle cx="26" cy="27" r="8" className={styles.badgeBlue} />
              <text x="26" y="30" className={styles.badgeText}>1</text>
              <text x="40" y="29" className={styles.label}>Price</text>
              <text x="26" y="52" className={styles.value}>{fmt(price)}</text>
            </g>

            <path d="M 125 40 L 145 40" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#rentArrow)" />

            <g
              className={`${styles.block} ${
                isHighlighted('down') ? styles.active : isDimmed('down') ? styles.dimmed : ''
              }`}
            >
              <rect x="150" y="16" width="120" height="48" rx="6" className={styles.box} />
              <circle cx="161" cy="27" r="8" className={styles.badgeBlue} />
              <text x="161" y="30" className={styles.badgeText}>2</text>
              <text x="175" y="29" className={styles.label}>{isFinanced ? 'Down Pmt' : 'All-Cash'}</text>
              <text x="161" y="52" className={styles.value}>{isFinanced ? fmt(price * 0.25) : fmt(price)}</text>
            </g>

            <text x="278" y="44" className={styles.operator}>+</text>

            <g
              className={`${styles.block} ${
                isHighlighted('closing') || isHighlighted('repairs')
                  ? styles.active
                  : isDimmed('closing') && isDimmed('repairs')
                  ? styles.dimmed
                  : ''
              }`}
            >
              <rect x="295" y="16" width="150" height="48" rx="6" className={styles.box} />
              <circle cx="306" cy="27" r="8" className={styles.badgeBlue} />
              <text x="306" y="30" className={styles.badgeText}>3</text>
              <circle cx="324" cy="27" r="8" className={styles.badgeBlue} />
              <text x="324" y="30" className={styles.badgeText}>4</text>
              <text x="338" y="29" className={styles.label}>Closing &amp; Rehab</text>
              <text x="306" y="52" className={styles.value}>Outlay</text>
            </g>

            <text x="454" y="44" className={styles.operator}>=</text>

            <g className={styles.summaryPill}>
              <rect x="470" y="16" width="165" height="48" rx="8" className={styles.pillBox} />
              <text x="485" y="32" className={styles.pillLabel}>Total Cash Invested</text>
              <text x="485" y="53" className={styles.pillValue}>{fmt(cashInvested)}</text>
            </g>

            {/* FLOW 2: RENTAL OPERATIONS TO NOI (Middle Row) */}
            <g
              className={`${styles.block} ${
                isHighlighted('rent') ? styles.active : isDimmed('rent') ? styles.dimmed : ''
              }`}
            >
              <rect x="15" y="80" width="125" height="52" rx="6" className={styles.box} />
              <circle cx="26" cy="92" r="8" className={styles.badgeEmerald} />
              <text x="26" y="95" className={styles.badgeText}>5</text>
              <text x="40" y="94" className={styles.label}>Monthly Rent</text>
              <text x="26" y="118" className={styles.valueGreen}>{fmt(rent)}/mo</text>
            </g>

            <text x="148" y="110" className={styles.operator}>−</text>

            <g
              className={`${styles.block} ${
                isHighlighted('vacancy') ? styles.active : isDimmed('vacancy') ? styles.dimmed : ''
              }`}
            >
              <rect x="162" y="80" width="125" height="52" rx="6" className={styles.box} />
              <circle cx="173" cy="92" r="8" className={styles.badgeAmber} />
              <text x="173" y="95" className={styles.badgeText}>6</text>
              <text x="187" y="94" className={styles.label}>Vacancy Loss</text>
              <text x="173" y="118" className={styles.valueAmber}>−{fmt(vacancyLossMonthly)}/mo</text>
            </g>

            <text x="295" y="110" className={styles.operator}>−</text>

            <g
              className={`${styles.block} ${
                isHighlighted('expenses') ? styles.active : isDimmed('expenses') ? styles.dimmed : ''
              }`}
            >
              <rect x="310" y="80" width="175" height="52" rx="6" className={styles.box} />
              <circle cx="321" cy="92" r="8" className={styles.badgeRed} />
              <text x="321" y="95" className={styles.badgeText}>7</text>
              <text x="335" y="94" className={styles.label}>Operating Expenses</text>
              <text x="321" y="118" className={styles.valueRed}>−{fmt(expensesMonthly)}/mo</text>
            </g>

            <text x="493" y="110" className={styles.operator}>=</text>

            <g className={styles.noiBox}>
              <rect x="510" y="80" width="135" height="52" rx="6" className={styles.boxPurple} />
              <text x="522" y="95" className={styles.noiLabel}>Net Oper Inc (NOI)</text>
              <text x="522" y="119" className={styles.noiValue}>{fmt(noiMonthly)}/mo</text>
            </g>

            {/* FLOW 3: DEBT SERVICE TO CASH FLOW & COC (Row 3) */}
            <path d="M 577 132 L 577 150 L 515 150" stroke="var(--line, #94a3b8)" strokeWidth="1.5" fill="none" markerEnd="url(#rentArrow)" />

            <g
              className={`${styles.block} ${
                isHighlighted('mortgage') ? styles.active : isDimmed('mortgage') ? styles.dimmed : ''
              }`}
            >
              <rect x="310" y="145" width="175" height="52" rx="6" className={styles.box} />
              <circle cx="321" cy="157" r="8" className={styles.badgePurple} />
              <text x="321" y="160" className={styles.badgeText}>8</text>
              <text x="335" y="159" className={styles.label}>Mortgage (P&amp;I)</text>
              <text x="321" y="183" className={styles.valuePurple}>{isFinanced ? `−${fmt(debtServiceMonthly)}/mo` : '$0 (All-Cash)'}</text>
            </g>

            <text x="493" y="175" className={styles.operator}>=</text>

            <g className={styles.cfBox}>
              <rect x="510" y="145" width="160" height="52" rx="6" className={styles.boxCashFlow} />
              <text x="522" y="160" className={styles.cfLabel}>Monthly Cash Flow</text>
              <text x="522" y="184" className={styles.cfValue}>{fmt(cashFlowMonthly)}/mo</text>
            </g>

            {/* FINAL RESULT BADGE: CASH-ON-CASH */}
            <g className={styles.cocBadge}>
              <rect x="685" y="80" width="160" height="117" rx="10" fill="url(#cocGrad)" />
              <text x="765" y="105" textAnchor="middle" fill="#d1fae5" fontSize="11" fontWeight="700" letterSpacing="0.05em">
                CASH-ON-CASH RETURN
              </text>
              <text x="765" y="148" textAnchor="middle" fill="#ffffff" fontSize="26" fontWeight="900">
                {cocPercent !== null ? `${cocPercent.toFixed(2)}%` : '—'}
              </text>
              <text x="765" y="172" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="600">
                Cash Flow ÷ Cash Invested
              </text>
            </g>

            {/* TIMELINE SECTION FOR PRO FORMA MODE */}
            {mode === 'pro-forma' && (
              <g className={styles.timelineGroup}>
                <line x1="20" y1="218" x2="840" y2="218" stroke="var(--line, #94a3b8)" strokeWidth="1.5" strokeDasharray="4 4" />
                <rect x="25" y="228" width="135" height="34" rx="4" fill="var(--surface-2, #f8fafc)" stroke="var(--line, #cbd5e1)" />
                <text x="92" y="249" textAnchor="middle" className={styles.timelineText}>
                  Year 1: {fmt(cashFlowMonthly)}/mo
                </text>

                <rect x="330" y="228" width="220" height="34" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
                <text x="440" y="249" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="700">
                  +{rentGrowthPercent}% Rent Growth · +{appreciationPercent}% Appreciation
                </text>

                <rect x="700" y="228" width="140" height="34" rx="4" fill="var(--surface-2, #f8fafc)" stroke="var(--line, #cbd5e1)" />
                <text x="770" y="249" textAnchor="middle" className={styles.timelineText}>
                  Year {proFormaYears}: Equity + IRR
                </text>
              </g>
            )}
          </svg>

          {/* Under-diagram Note */}
          <div className={styles.noticeBox}>
            <span className={styles.noticeIcon}>ℹ️</span>
            <span>
              <strong>Crucial Rule:</strong> Mortgage debt service is <em>not</em> an operating expense. It is paid from Net Operating Income (NOI) to yield your net cash flow.
            </span>
          </div>
        </div>
      </details>
    </div>
  );
}
