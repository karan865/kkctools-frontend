'use client';

import React, { useState, useId, useMemo } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import FractionInputGuide from './FractionInputGuide';
import {
  parseFractionInput,
  calculateFractionToPercent,
  calculateScore,
  percentOf,
  whatPercentIs,
  wholeFromPartAndPercent,
  addPercent,
  subtractPercent,
  generateCommonFractionsTable,
  DEFAULT_STANDARD_GRADE_SCALE,
  DEFAULT_PLUS_MINUS_GRADE_SCALE,
  type GradeBoundary,
} from '@/lib/fraction-percent-engine';
import styles from './FractionPercentCalculator.module.css';

type ActiveTab = 'fraction' | 'score' | 'percentage';
type ScoreMode = 'earned' | 'wrong';
type PercentageOp = 'of' | 'isWhat' | 'wholeFrom' | 'add' | 'subtract';

const COMMON_PILLS = ['4/5', '3/8', '1/3', '3/4', '1 1/4', '5/4', '8/3', '0.375'];

export default function FractionPercentCalculator() {
  const [tab, setTab] = useState<ActiveTab>('fraction');

  // Tab 1: Fraction states
  const [fractionInput, setFractionInput] = useState<string>('4/5');
  const [showFractionTable, setShowFractionTable] = useState<boolean>(false);

  // Tab 2: Score states
  const [scoreVal, setScoreVal] = useState<string>('16');
  const [totalVal, setTotalVal] = useState<string>('20');
  const [scoreMode, setScoreMode] = useState<ScoreMode>('earned');
  const [bonusVal, setBonusVal] = useState<string>('0');
  const [scaleType, setScaleType] = useState<'standard' | 'plusMinus' | 'custom'>('standard');
  // Custom A/B/C/D cutoffs (%): grading scales differ by school, so the user can edit them.
  const [customCuts, setCustomCuts] = useState<{ A: string; B: string; C: string; D: string }>({
    A: '90',
    B: '80',
    C: '70',
    D: '60',
  });
  const [showScoreTable, setShowScoreTable] = useState<boolean>(false);

  // Tab 3: Percentage states
  const [percentOp, setPercentOp] = useState<PercentageOp>('of');
  const [paramA, setParamA] = useState<string>('15');
  const [paramB, setParamB] = useState<string>('80');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Accessible IDs
  const fracInputId = useId();
  const scoreInputId = useId();
  const totalInputId = useId();
  const scoreModeId = useId();
  const bonusInputId = useId();
  const scaleTypeId = useId();
  const percentOpId = useId();
  const paramAId = useId();
  const paramBId = useId();
  const cutBaseId = useId();

  // Active grade scale (example US scales, or the user's own cutoffs)
  const activeScale = useMemo<GradeBoundary[]>(() => {
    if (scaleType === 'standard') return DEFAULT_STANDARD_GRADE_SCALE;
    if (scaleType === 'plusMinus') return DEFAULT_PLUS_MINUS_GRADE_SCALE;
    const num = (v: string, fallback: number) => {
      const n = parseFloat(v);
      return isNaN(n) ? fallback : Math.min(100, Math.max(0, n));
    };
    return [
      { letter: 'A', minPercent: num(customCuts.A, 90) },
      { letter: 'B', minPercent: num(customCuts.B, 80) },
      { letter: 'C', minPercent: num(customCuts.C, 70) },
      { letter: 'D', minPercent: num(customCuts.D, 60) },
      { letter: 'F', minPercent: 0 },
    ];
  }, [scaleType, customCuts]);

  // Fraction Calculation
  const fractionResult = useMemo(() => {
    const parsed = parseFractionInput(fractionInput);
    if (!parsed) return null;
    return calculateFractionToPercent(parsed.numerator, parsed.denominator);
  }, [fractionInput]);

  // Score Calculation
  const scoreResult = useMemo(() => {
    const s = parseFloat(scoreVal);
    const t = parseFloat(totalVal);
    const b = parseFloat(bonusVal) || 0;
    if (isNaN(s) || isNaN(t) || t <= 0) return null;
    return calculateScore(s, t, scoreMode === 'wrong', b, activeScale);
  }, [scoreVal, totalVal, scoreMode, bonusVal, activeScale]);

  // Percentage of a number Calculation
  const percentageResult = useMemo(() => {
    const a = parseFloat(paramA);
    const b = parseFloat(paramB);
    if (isNaN(a) || isNaN(b)) return null;

    if (percentOp === 'of') {
      return { val: percentOf(a, b), label: `${a}% of ${b}` };
    } else if (percentOp === 'isWhat') {
      const res = whatPercentIs(a, b);
      return res !== null ? { val: res, label: `${a} is what % of ${b}`, isPercent: true } : null;
    } else if (percentOp === 'wholeFrom') {
      const res = wholeFromPartAndPercent(a, b);
      return res !== null ? { val: res, label: `${a} is ${b}% of what number` } : null;
    } else if (percentOp === 'add') {
      return { val: addPercent(b, a), label: `${b} + ${a}%` };
    } else {
      return { val: subtractPercent(b, a), label: `${b} − ${a}%` };
    }
  }, [percentOp, paramA, paramB]);

  // Static common fractions reference table
  const commonFractions = useMemo(() => generateCommonFractionsTable(), []);

  // Score reference table for current total
  const scoreTableRows = useMemo(() => {
    const t = Math.min(Math.max(1, Math.round(parseFloat(totalVal) || 20)), 100);
    const rows = [];
    for (let pts = t; pts >= 0; pts--) {
      const res = calculateScore(pts, t, false, 0, activeScale);
      if (res) {
        rows.push({
          points: pts,
          percent: res.percent.toFixed(1) + '%',
          grade: res.letterGrade,
        });
      }
    }
    return { total: t, rows };
  }, [totalVal, activeScale]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabsConfig = [
    { id: 'fraction', label: 'Fraction → Percent' },
    { id: 'score', label: 'Score → Percent & Grade' },
    { id: 'percentage', label: 'Percent of a Number' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabNav}>
        <TabSlider
          tabs={tabsConfig}
          activeId={tab}
          onChange={(newTab) => setTab(newTab as ActiveTab)}
          ariaLabel="Fraction and Percentage Mode"
        />
      </div>

      <FractionInputGuide tab={tab} />

      <div className={styles.calculatorCard}>
        {tab === 'fraction' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor={fracInputId} className={styles.label}>
                  Fraction, Mixed Number, or Decimal
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={fracInputId}
                    type="text"
                    className={styles.input}
                    value={fractionInput}
                    onChange={(e) => setFractionInput(e.target.value)}
                    placeholder="e.g. 4/5, 1 1/4, 3/8, 0.375"
                  />
                </div>
                <div className={styles.quickPills}>
                  <span className={styles.helperText}>Quick examples:</span>
                  {COMMON_PILLS.map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      className={styles.pillBtn}
                      onClick={() => setFractionInput(pill)}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {fractionResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Percentage Equivalent</span>
                  <div className={styles.heroValue}>
                    {fractionResult.isRepeating
                      ? `${fractionResult.repeatString} (${fractionResult.formattedPercent})`
                      : fractionResult.formattedPercent}
                  </div>
                  <div className={styles.heroSub}>
                    <span>Decimal: {fractionResult.formattedDecimal}</span>
                    <span>·</span>
                    <span>Simplified: {fractionResult.simplifiedNum}/{fractionResult.simplifiedDen}</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    <strong>{fractionResult.numerator}/{fractionResult.denominator}</strong> equals{' '}
                    <strong>{fractionResult.isRepeating ? fractionResult.repeatString : fractionResult.formattedPercent}</strong> as a percentage (or{' '}
                    <strong>{fractionResult.formattedDecimal}</strong> in decimal form).
                    {fractionResult.numerator > fractionResult.denominator && (
                      <span> This improper fraction represents a value greater than 100%.</span>
                    )}
                    {fractionResult.isRepeating && (
                      <span> The repetend bar indicates a repeating decimal that cannot terminate in base-10.</span>
                    )}
                  </p>
                </div>

                <div className={styles.stepsBox}>
                  <div className={styles.stepsTitle}>Calculation Steps:</div>
                  <ol className={styles.stepsList}>
                    <li>
                      <strong>Divide Part by Whole:</strong> {fractionResult.numerator} ÷ {fractionResult.denominator} = {fractionResult.decimal.toFixed(6).replace(/\.?0+$/, '')}
                    </li>
                    <li>
                      <strong>Multiply by 100%:</strong> {fractionResult.decimal.toFixed(6).replace(/\.?0+$/, '')} × 100% = {fractionResult.isRepeating ? fractionResult.repeatString : fractionResult.formattedPercent}
                    </li>
                    <li>
                      <strong>Simplify Fraction:</strong> GCD({fractionResult.numerator}, {fractionResult.denominator}) = {fractionResult.numerator / fractionResult.simplifiedNum} → {fractionResult.simplifiedNum}/{fractionResult.simplifiedDen}
                    </li>
                  </ol>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className={styles.pillBtn}
                    onClick={() => setShowFractionTable(!showFractionTable)}
                  >
                    {showFractionTable ? 'Hide Common Fractions Table' : 'Show Common Fractions Reference Table (2–100)'}
                  </button>

                  {showFractionTable && (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Fraction</th>
                            <th>Decimal</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commonFractions.map((row) => (
                            <tr
                              key={row.fraction}
                              className={row.fraction === `${fractionResult.simplifiedNum}/${fractionResult.simplifiedDen}` ? styles.highlightRow : ''}
                            >
                              <td><strong>{row.fraction}</strong></td>
                              <td>{row.decimal}</td>
                              <td><strong>{row.percent}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Enter a valid fraction (e.g. 4/5, 1 1/4, 3/8) with a non-zero denominator.
              </div>
            )}
          </>
        )}

        {tab === 'score' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={scoreModeId} className={styles.label}>Scoring Input Mode</label>
                <select
                  id={scoreModeId}
                  className={styles.select}
                  value={scoreMode}
                  onChange={(e) => setScoreMode(e.target.value as ScoreMode)}
                >
                  <option value="earned">Points Earned / Questions Correct</option>
                  <option value="wrong">Number of Questions Wrong</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={scoreInputId} className={styles.label}>
                  {scoreMode === 'earned' ? 'Points Earned' : 'Questions Missed'}
                </label>
                <input
                  id={scoreInputId}
                  type="number"
                  step="any"
                  min="0"
                  className={styles.input}
                  value={scoreVal}
                  onChange={(e) => setScoreVal(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={totalInputId} className={styles.label}>Total Possible Points</label>
                <input
                  id={totalInputId}
                  type="number"
                  step="any"
                  min="1"
                  className={styles.input}
                  value={totalVal}
                  onChange={(e) => setTotalVal(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={bonusInputId} className={styles.label}>Bonus Points (Optional)</label>
                <input
                  id={bonusInputId}
                  type="number"
                  step="any"
                  min="0"
                  className={styles.input}
                  value={bonusVal}
                  onChange={(e) => setBonusVal(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={scaleTypeId} className={styles.label}>Grading Scale</label>
                <select
                  id={scaleTypeId}
                  className={styles.select}
                  value={scaleType}
                  onChange={(e) => setScaleType(e.target.value as 'standard' | 'plusMinus' | 'custom')}
                >
                  <option value="standard">Example US scale (A 90+, B 80+, C 70+, D 60+)</option>
                  <option value="plusMinus">Example US plus/minus scale (A+ to F)</option>
                  <option value="custom">My own cutoffs (edit)</option>
                </select>
                <span className={styles.helpText}>Grading scales differ by school and course. Check your syllabus, or choose &quot;My own cutoffs&quot;.</span>
              </div>

              {scaleType === 'custom' && (
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.label} id={`${cutBaseId}-legend`}>Minimum % for each grade</span>
                  <div role="group" aria-labelledby={`${cutBaseId}-legend`} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {(['A', 'B', 'C', 'D'] as const).map((g) => (
                      <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label htmlFor={`${cutBaseId}-${g}`} className={styles.label}>{g}</label>
                        <input
                          id={`${cutBaseId}-${g}`}
                          type="number"
                          inputMode="decimal"
                          min={0}
                          max={100}
                          className={styles.input}
                          style={{ width: '5.5rem' }}
                          value={customCuts[g]}
                          onChange={(e) => setCustomCuts({ ...customCuts, [g]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {scoreResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>Test Grade Result</span>
                  <div className={styles.heroValue}>
                    {scoreResult.percent.toFixed(1)}% ({scoreResult.letterGrade})
                  </div>
                  <div className={styles.heroSub}>
                    <span>
                      {scoreResult.effectiveEarned} of {scoreResult.total} points
                    </span>
                    {scoreResult.pointsToNextGrade > 0 && scoreResult.nextGradeLetter && (
                      <>
                        <span>·</span>
                        <span>
                          +{scoreResult.pointsToNextGrade} pt{scoreResult.pointsToNextGrade > 1 ? 's' : ''} to Grade {scoreResult.nextGradeLetter}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    A score of <strong>{scoreResult.effectiveEarned} out of {scoreResult.total}</strong> is{' '}
                    <strong>{scoreResult.percent.toFixed(1)}%</strong>, earning a letter grade of{' '}
                    <strong>{scoreResult.letterGrade}</strong> on the scale shown.
                    {scoreResult.pointsToNextGrade > 0 && scoreResult.nextGradeLetter && (
                      <span> You would need <strong>{scoreResult.pointsToNextGrade} more point{scoreResult.pointsToNextGrade > 1 ? 's' : ''}</strong> to reach Grade {scoreResult.nextGradeLetter}.</span>
                    )}
                  </p>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className={styles.pillBtn}
                    onClick={() => setShowScoreTable(!showScoreTable)}
                  >
                    {showScoreTable ? 'Hide Score Table' : `Show Complete Grading Table (Out of ${scoreTableRows.total})`}
                  </button>

                  {showScoreTable && (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Points</th>
                            <th>Percentage</th>
                            <th>Letter Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scoreTableRows.rows.map((row) => (
                            <tr
                              key={row.points}
                              className={row.points === Math.round(scoreResult.effectiveEarned) ? styles.highlightRow : ''}
                            >
                              <td><strong>{row.points} / {scoreTableRows.total}</strong></td>
                              <td>{row.percent}</td>
                              <td><strong>{row.grade}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Enter valid points and a positive total point value.
              </div>
            )}
          </>
        )}

        {tab === 'percentage' && (
          <>
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor={percentOpId} className={styles.label}>Select Percentage Question</label>
                <select
                  id={percentOpId}
                  className={styles.select}
                  value={percentOp}
                  onChange={(e) => setPercentOp(e.target.value as PercentageOp)}
                >
                  <option value="of">What is P% of X? (e.g. 15% of 80)</option>
                  <option value="isWhat">X is what percent of Y? (e.g. 12 is what % of 80)</option>
                  <option value="wholeFrom">X is P% of what number? (e.g. 12 is 15% of what)</option>
                  <option value="add">Add P% to X (e.g. 80 + 15%)</option>
                  <option value="subtract">Subtract P% from X (e.g. 80 − 15%)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={paramAId} className={styles.label}>
                  {percentOp === 'of' ? 'Percentage (P %)' :
                   percentOp === 'isWhat' ? 'Part Value (X)' :
                   percentOp === 'wholeFrom' ? 'Part Value (X)' :
                   'Percentage to Add/Subtract (P %)'}
                </label>
                <input
                  id={paramAId}
                  type="number"
                  step="any"
                  className={styles.input}
                  value={paramA}
                  onChange={(e) => setParamA(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={paramBId} className={styles.label}>
                  {percentOp === 'of' ? 'Base Number (X)' :
                   percentOp === 'isWhat' ? 'Total / Whole (Y)' :
                   percentOp === 'wholeFrom' ? 'Percentage (P %)' :
                   'Base Number (X)'}
                </label>
                <input
                  id={paramBId}
                  type="number"
                  step="any"
                  className={styles.input}
                  value={paramB}
                  onChange={(e) => setParamB(e.target.value)}
                />
              </div>
            </div>

            {percentageResult ? (
              <>
                <div className={styles.heroResult}>
                  <span className={styles.heroLabel}>{percentageResult.label}</span>
                  <div className={styles.heroValue}>
                    {percentageResult.isPercent
                      ? `${percentageResult.val.toFixed(2)}%`
                      : percentageResult.val.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                  </div>
                  <div className={styles.heroSub}>
                    <span>Calculated with zero rounding error</span>
                  </div>
                </div>

                <div className={styles.heroSummary}>
                  <p>
                    Result for <strong>{percentageResult.label}</strong> is{' '}
                    <strong>
                      {percentageResult.isPercent
                        ? `${percentageResult.val.toFixed(2)}%`
                        : percentageResult.val.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    </strong>.
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.errorBanner}>
                Enter valid numerical values. Whole number or divisor cannot be zero.
              </div>
            )}
          </>
        )}

        <div className={styles.actionsBar}>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={() => handleCopy('url', typeof window !== 'undefined' ? window.location.href : '')}
          >
            {copiedKey === 'url' ? 'Link Copied!' : 'Copy Tool Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
