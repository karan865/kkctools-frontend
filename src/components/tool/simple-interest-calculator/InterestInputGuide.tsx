import React from 'react';
import styles from './SimpleInterestCalculator.module.css';

interface InterestInputGuideProps {
  activeTab: 'accrued' | 'solver' | 'bond' | 'compare';
}

export const InterestInputGuide: React.FC<InterestInputGuideProps> = ({ activeTab }) => {
  return (
    <div className={styles.guideWrapper} aria-label="Simple & Accrued Interest Timeline Diagram">
      <div className={styles.guideHeader}>
        <span className={styles.guideBadge}>Visual Guide</span>
        <span className={styles.guideTitle}>
          {activeTab === 'bond'
            ? 'Bond Accrued Interest: Settlement Between Coupon Dates'
            : activeTab === 'compare'
            ? 'Day-Count Convention Basis: 360 vs 365 Days per Year'
            : activeTab === 'solver'
            ? 'Simple Interest Model: Linear Daily Growth (I = P × r × t)'
            : 'Accrued Interest Timeline: Fixed Daily Accrual between Dates'}
        </span>
      </div>

      <div className={styles.guideCanvas}>
        {activeTab === 'bond' ? (
          <svg viewBox="0 0 760 140" className={styles.guideSvg} role="img" aria-label="Bond accrual diagram">
            {/* Timeline line */}
            <line x1="60" y1="70" x2="700" y2="70" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

            {/* Shaded accrued slice */}
            <rect x="120" y="45" width="280" height="50" rx="6" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />

            {/* Last Coupon Date */}
            <circle cx="120" cy="70" r="9" fill="#4338CA" />
            <text x="120" y="32" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="13">Last Coupon Date</text>
            <text x="120" y="104" textAnchor="middle" fill="#64748B" fontSize="11">Previous Coupon Paid</text>

            {/* Settlement Date */}
            <circle cx="400" cy="70" r="9" fill="#0D9488" />
            <text x="400" y="32" textAnchor="middle" fill="#0D9488" fontWeight="700" fontSize="13">Settlement Date</text>
            <text x="400" y="104" textAnchor="middle" fill="#0D9488" fontSize="11">Buyer Reimburses Seller</text>

            {/* Next Coupon Date */}
            <circle cx="640" cy="70" r="9" fill="#94A3B8" />
            <text x="640" y="32" textAnchor="middle" fill="#475569" fontWeight="700" fontSize="13">Next Coupon Date</text>
            <text x="640" y="104" textAnchor="middle" fill="#64748B" fontSize="11">Issuer Pays Full Coupon</text>

            {/* Accrued Bracket */}
            <line x1="120" y1="118" x2="400" y2="118" stroke="#4338CA" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="260" y="132" textAnchor="middle" fill="#4338CA" fontWeight="700" fontSize="12">
              Accrued Interest = (Days Accrued / Days in Period) × Periodic Coupon
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 760 140" className={styles.guideSvg} role="img" aria-label="Simple interest linear timeline">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4338CA" />
              </marker>
            </defs>

            {/* Baseline Principal at Start Date */}
            <rect x="70" y="40" width="36" height="56" rx="4" fill="#312E81" opacity="0.9" />
            <text x="88" y="30" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="12">1. Principal (P)</text>
            <text x="88" y="112" textAnchor="middle" fill="#64748B" fontSize="11">Start Date</text>

            {/* Straight Linear Timeline - Not curved (Pure simple interest) */}
            <line x1="120" y1="70" x2="620" y2="70" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

            {/* Equal Daily Increments */}
            {[180, 240, 300, 360, 420, 480, 540].map((x) => (
              <g key={x}>
                <line x1={x} y1="62" x2={x} y2="78" stroke="#4338CA" strokeWidth="2" />
                <circle cx={x} cy="70" r="3" fill="#4338CA" />
              </g>
            ))}

            {/* Annual Rate Badge */}
            <rect x="300" y="32" width="160" height="26" rx="13" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.5" />
            <text x="380" y="49" textAnchor="middle" fill="#4338CA" fontWeight="700" fontSize="12">
              2. Annual Rate (r %)
            </text>

            {/* End Date / Total Return */}
            <circle cx="630" cy="70" r="9" fill="#0D9488" />
            <text x="630" y="30" textAnchor="middle" fill="#0D9488" fontWeight="700" fontSize="12">Total (A = P + I)</text>
            <text x="630" y="112" textAnchor="middle" fill="#64748B" fontSize="11">End Date (t)</text>

            {/* Day Count Basis callout */}
            <rect x="250" y="96" width="260" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="380" y="112" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600">
              Day Count Convention: Actual/365, Actual/360, or 30/360
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
