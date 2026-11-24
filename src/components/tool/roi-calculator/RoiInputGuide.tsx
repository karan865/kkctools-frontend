import React from 'react';
import styles from './RoiCalculator.module.css';

interface RoiInputGuideProps {
  activeTab: 'roi' | 'compare' | 'marketing' | 'project' | 'target';
}

export const RoiInputGuide: React.FC<RoiInputGuideProps> = ({ activeTab }) => {
  return (
    <div className={styles.guideWrapper} aria-label="ROI Visual Input Guide Diagram">
      <div className={styles.guideHeader}>
        <span className={styles.guideBadge}>Visual Guide</span>
        <span className={styles.guideTitle}>
          {activeTab === 'marketing'
            ? 'Marketing ROI & ROAS: Campaign Revenue, Ad Spend & Gross Margin'
            : activeTab === 'project'
            ? 'Capital Project & Equipment ROI: Cost vs Annual Cost Savings & Payback'
            : activeTab === 'compare'
            ? 'Investment Comparison: Ranking by Annualized Rate across Holding Periods'
            : activeTab === 'target'
            ? 'Target ROI: Ending Value Required to Achieve Target Return'
            : 'Return on Investment (ROI): Initial Cost vs Final Value & Annualized Return'}
        </span>
      </div>

      <div className={styles.guideCanvas}>
        {activeTab === 'marketing' ? (
          <svg viewBox="0 0 760 140" className={styles.guideSvg} role="img" aria-label="Marketing ROI diagram">
            {/* Ad Spend */}
            <rect x="50" y="42" width="130" height="56" rx="8" fill="#EEF2FF" stroke="#4338CA" strokeWidth="2" />
            <text x="115" y="66" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="13">1. Ad Spend / Cost</text>
            <text x="115" y="86" textAnchor="middle" fill="#64748B" fontSize="11">Total marketing budget</text>

            <line x1="180" y1="70" x2="260" y2="70" stroke="#CBD5E1" strokeWidth="3" markerEnd="url(#roi-arrow)" />

            {/* Campaign Revenue */}
            <rect x="260" y="42" width="150" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="335" y="66" textAnchor="middle" fill="#1E293B" fontWeight="700" fontSize="13">2. Gross Revenue</text>
            <text x="335" y="86" textAnchor="middle" fill="#64748B" fontSize="11">Attributed sales generated</text>

            <line x1="410" y1="70" x2="490" y2="70" stroke="#CBD5E1" strokeWidth="3" markerEnd="url(#roi-arrow)" />

            {/* Margin to Net Profit */}
            <rect x="490" y="32" width="220" height="76" rx="8" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2" />
            <text x="600" y="56" textAnchor="middle" fill="#0F766E" fontWeight="700" fontSize="13">3. ROI on Margin</text>
            <text x="600" y="74" textAnchor="middle" fill="#0D9488" fontWeight="600" fontSize="11">(Revenue × Margin %) − Ad Spend</text>
            <text x="600" y="94" textAnchor="middle" fill="#475569" fontSize="10">ROAS = Revenue ÷ Ad Spend</text>
          </svg>
        ) : activeTab === 'project' ? (
          <svg viewBox="0 0 760 140" className={styles.guideSvg} role="img" aria-label="Project ROI diagram">
            {/* Cost Outlay */}
            <rect x="60" y="45" width="150" height="50" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
            <text x="135" y="68" textAnchor="middle" fill="#991B1B" fontWeight="700" fontSize="13">Initial Investment</text>
            <text x="135" y="85" textAnchor="middle" fill="#7F1D1D" fontSize="11">Equipment / Project Cost</text>

            <line x1="210" y1="70" x2="280" y2="70" stroke="#CBD5E1" strokeWidth="3" />

            {/* Annual Savings */}
            {[280, 360, 440, 520].map((x, i) => (
              <g key={x}>
                <rect x={x} y="45" width="60" height="50" rx="4" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1.5" />
                <text x={x + 30} y="68" textAnchor="middle" fill="#0F766E" fontWeight="700" fontSize="12">Yr {i + 1}</text>
                <text x={x + 30} y="84" textAnchor="middle" fill="#0D9488" fontSize="10">Benefit</text>
              </g>
            ))}

            {/* Payback marker */}
            <line x1="520" y1="20" x2="520" y2="120" stroke="#4338CA" strokeWidth="2" strokeDasharray="4 3" />
            <rect x="580" y="45" width="130" height="50" rx="6" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.5" />
            <text x="645" y="68" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="12">Payback Period</text>
            <text x="645" y="85" textAnchor="middle" fill="#4338CA" fontSize="10">Cost ÷ Annual Benefit</text>
          </svg>
        ) : (
          <svg viewBox="0 0 760 140" className={styles.guideSvg} role="img" aria-label="Standard ROI timeline diagram">
            <defs>
              <marker id="roi-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4338CA" />
              </marker>
            </defs>

            {/* 1. Initial Investment */}
            <rect x="60" y="38" width="140" height="64" rx="8" fill="#312E81" />
            <text x="130" y="64" textAnchor="middle" fill="#FFFFFF" fontWeight="700" fontSize="13">1. Amount Invested</text>
            <text x="130" y="84" textAnchor="middle" fill="#C7D2FE" fontSize="11">Initial Cost Outlay</text>

            {/* Timeline */}
            <line x1="200" y1="70" x2="540" y2="70" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

            {/* Optional income / expense chips */}
            <rect x="250" y="24" width="110" height="26" rx="13" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
            <text x="305" y="41" textAnchor="middle" fill="#065F46" fontWeight="600" fontSize="11">+ Income (Dividends)</text>

            <rect x="380" y="24" width="110" height="26" rx="13" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
            <text x="435" y="41" textAnchor="middle" fill="#991B1B" fontWeight="600" fontSize="11">− Fees / Expenses</text>

            {/* Holding Period Badge */}
            <rect x="290" y="90" width="160" height="26" rx="13" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x="370" y="107" textAnchor="middle" fill="#475569" fontWeight="600" fontSize="11">Holding Period (Years)</text>

            {/* 2. Final Value / Total Return */}
            <rect x="540" y="38" width="160" height="64" rx="8" fill="#0D9488" />
            <text x="620" y="64" textAnchor="middle" fill="#FFFFFF" fontWeight="700" fontSize="13">2. Ending Value</text>
            <text x="620" y="84" textAnchor="middle" fill="#CCFBF1" fontSize="11">Total Proceeds / Return</text>
          </svg>
        )}
      </div>
    </div>
  );
};
