import React from 'react';
import styles from './FinalGradeCalculator.module.css';

interface FinalGradeInputGuideProps {
  activeTab: 'needed' | 'weighted' | 'points' | 'whatif';
  finalWeight?: number;
}

export const FinalGradeInputGuide: React.FC<FinalGradeInputGuideProps> = ({
  activeTab,
  finalWeight = 20,
}) => {
  const currentWeight = Math.max(10, 100 - finalWeight);

  return (
    <div className={styles.guideWrapper} aria-label="Final Grade Visual Input Guide Diagram">
      <div className={styles.guideHeader}>
        <span className={styles.guideBadge}>Visual Guide</span>
        <span className={styles.guideTitle}>
          {activeTab === 'weighted'
            ? 'Weighted Categories: Homework, Quizzes, Tests & Final Exam Weights'
            : activeTab === 'points'
            ? 'Points-Based Course: Accumulated Points vs Final Exam Points'
            : activeTab === 'whatif'
            ? 'What-If Final Exam Projection: Final Score vs Overall Course Grade'
            : 'Course Weight Breakdown: Prior Coursework vs Final Exam Weight'}
        </span>
      </div>

      <div className={styles.guideCanvas}>
        {activeTab === 'weighted' ? (
          <svg viewBox="0 0 760 130" className={styles.guideSvg} role="img" aria-label="Weighted categories diagram">
            {/* Homework Block */}
            <rect x="50" y="40" width="140" height="54" rx="6" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.5" />
            <text x="120" y="62" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="13">Homework</text>
            <text x="120" y="80" textAnchor="middle" fill="#4338CA" fontSize="11">20% Weight · Avg 92%</text>

            {/* Quizzes Block */}
            <rect x="200" y="40" width="140" height="54" rx="6" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.5" />
            <text x="270" y="62" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="13">Quizzes</text>
            <text x="270" y="80" textAnchor="middle" fill="#4338CA" fontSize="11">20% Weight · Avg 85%</text>

            {/* Midterm/Tests Block */}
            <rect x="350" y="40" width="180" height="54" rx="6" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.5" />
            <text x="440" y="62" textAnchor="middle" fill="#312E81" fontWeight="700" fontSize="13">Tests / Midterms</text>
            <text x="440" y="80" textAnchor="middle" fill="#4338CA" fontSize="11">35% Weight · Avg 80%</text>

            {/* Final Exam Block */}
            <rect x="540" y="32" width="170" height="70" rx="8" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2.5" />
            <text x="625" y="58" textAnchor="middle" fill="#0F766E" fontWeight="800" fontSize="14">Final Exam</text>
            <text x="625" y="76" textAnchor="middle" fill="#0D9488" fontWeight="700" fontSize="12">25% Remaining Weight</text>
            <text x="625" y="92" textAnchor="middle" fill="#115E59" fontSize="10">Target: 85% Course Grade</text>
          </svg>
        ) : (
          <svg viewBox="0 0 760 130" className={styles.guideSvg} role="img" aria-label="Course grade bar split">
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#312E81" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
              <linearGradient id="finalGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>

            {/* Total course bar outline */}
            <rect x="50" y="45" width="660" height="42" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Current Work Portion */}
            <rect
              x="50"
              y="45"
              width={(currentWeight / 100) * 660}
              height="42"
              rx="8"
              fill="url(#currentGrad)"
            />
            <text
              x={50 + ((currentWeight / 100) * 660) / 2}
              y="71"
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="700"
              fontSize="13"
            >
              1. Current Grade ({currentWeight}% of Course)
            </text>

            {/* Final Exam Portion */}
            <rect
              x={50 + (currentWeight / 100) * 660}
              y="45"
              width={(finalWeight / 100) * 660}
              height="42"
              rx="8"
              fill="url(#finalGrad)"
            />
            <text
              x={50 + (currentWeight / 100) * 660 + ((finalWeight / 100) * 660) / 2}
              y="71"
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="700"
              fontSize="12"
            >
              2. Final ({finalWeight}%)
            </text>

            {/* Target Line Callout */}
            <line
              x1={50 + (currentWeight / 100) * 660}
              y1="25"
              x2={50 + (currentWeight / 100) * 660}
              y2="105"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray="4 3"
            />
            <rect
              x={50 + (currentWeight / 100) * 660 - 55}
              y="12"
              width="110"
              height="22"
              rx="4"
              fill="#FEF3C7"
              stroke="#F59E0B"
            />
            <text
              x={50 + (currentWeight / 100) * 660}
              y="27"
              textAnchor="middle"
              fill="#92400E"
              fontWeight="700"
              fontSize="11"
            >
              3. Target Grade
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
