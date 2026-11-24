import React from 'react';
import styles from './BudgetCalculator.module.css';

interface BudgetInputGuideProps {
  needsPct?: number;
  wantsPct?: number;
  savingsPct?: number;
}

export const BudgetInputGuide: React.FC<BudgetInputGuideProps> = ({
  needsPct = 55,
  wantsPct = 20,
  savingsPct = 15,
}) => {
  return (
    <div className={styles.guideWrapper} aria-label="Budget Visual Input Guide Diagram">
      <div className={styles.guideHeader}>
        <span className={styles.guideBadge}>Visual Guide</span>
        <span className={styles.guideTitle}>
          Monthly Budget Flow: 50/30/20 Allocation (Income Pours into 3 Buckets)
        </span>
      </div>

      <div className={styles.guideCanvas}>
        <svg viewBox="0 0 760 140" className={styles.guideSvg} role="img" aria-label="50/30/20 budget allocation diagram">
          <defs>
            <marker id="budget-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4338CA" />
            </marker>
          </defs>

          {/* 1. Take-Home Income Wallet */}
          <rect x="50" y="38" width="160" height="64" rx="8" fill="#312E81" />
          <text x="130" y="62" textAnchor="middle" fill="#FFFFFF" fontWeight="700" fontSize="13">1. Monthly Income</text>
          <text x="130" y="80" textAnchor="middle" fill="#C7D2FE" fontSize="11">Take-Home Pay (All Sources)</text>

          {/* Flow Arrows */}
          <line x1="210" y1="55" x2="270" y2="55" stroke="#4338CA" strokeWidth="2.5" markerEnd="url(#budget-arrow)" />
          <line x1="210" y1="70" x2="430" y2="70" stroke="#4338CA" strokeWidth="2.5" markerEnd="url(#budget-arrow)" />
          <line x1="210" y1="85" x2="590" y2="85" stroke="#4338CA" strokeWidth="2.5" markerEnd="url(#budget-arrow)" />

          {/* 2. Needs Jar (50% target) */}
          <rect x="270" y="28" width="135" height="84" rx="8" fill="#EEF2FF" stroke="#4338CA" strokeWidth="2" />
          <text x="337" y="52" textAnchor="middle" fill="#312E81" fontWeight="800" fontSize="13">2. Needs</text>
          <text x="337" y="70" textAnchor="middle" fill="#4338CA" fontWeight="700" fontSize="12">Target: 50%</text>
          <text x="337" y="88" textAnchor="middle" fill="#64748B" fontSize="11">Actual: {needsPct}%</text>
          <text x="337" y="102" textAnchor="middle" fill="#475569" fontSize="9">Rent, bills, groceries</text>

          {/* 3. Wants Jar (30% target) */}
          <rect x="430" y="28" width="135" height="84" rx="8" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2" />
          <text x="497" y="52" textAnchor="middle" fill="#0F766E" fontWeight="800" fontSize="13">3. Wants</text>
          <text x="497" y="70" textAnchor="middle" fill="#0D9488" fontWeight="700" fontSize="12">Target: 30%</text>
          <text x="497" y="88" textAnchor="middle" fill="#64748B" fontSize="11">Actual: {wantsPct}%</text>
          <text x="497" y="102" textAnchor="middle" fill="#475569" fontSize="9">Dining, fun, shopping</text>

          {/* 4. Savings Jar (20% target) */}
          <rect x="590" y="28" width="135" height="84" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <text x="657" y="52" textAnchor="middle" fill="#92400E" fontWeight="800" fontSize="13">4. Savings & Debt</text>
          <text x="657" y="70" textAnchor="middle" fill="#B45309" fontWeight="700" fontSize="12">Target: 20%</text>
          <text x="657" y="88" textAnchor="middle" fill="#64748B" fontSize="11">Actual: {savingsPct}%</text>
          <text x="657" y="102" textAnchor="middle" fill="#475569" fontSize="9">Emergency, extra debt</text>
        </svg>
      </div>
    </div>
  );
};
