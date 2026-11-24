'use client';

import React, { useState, useId, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import {
  calculateNeededScore,
  calculateGradeAfterFinal,
  calculateLetterCutoffTable,
  calculateWeightedGrade,
  calculatePointsGrade,
  WeightedCategoryInput,
  GradeCutoff,
  DEFAULT_GRADE_SCALE,
  PLUS_MINUS_GRADE_SCALE,
} from '@/lib/final-grade-engine';
import { FinalGradeInputGuide } from './FinalGradeInputGuide';
import styles from './FinalGradeCalculator.module.css';

type TabMode = 'needed' | 'weighted' | 'points' | 'whatif';

export function FinalGradeCalculator() {
  const [tab, setTab] = useState<TabMode>('needed');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['needed', 'weighted', 'points', 'whatif'] as string[]).includes(t)) setTab(t as typeof tab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Needed Tab State (Defaults from spec: current 85%, final weight 20%, target 87%)
  const [currentGrade, setCurrentGrade] = useState<string>('85');
  const [finalWeight, setFinalWeight] = useState<string>('20');
  const [targetGrade, setTargetGrade] = useState<string>('87');

  // Weighted Tab State (Defaults: HW 20% @ 92, Quiz 20% @ 85, Test 35% @ 80, Final 25%, target 85)
  const [weightedTarget, setWeightedTarget] = useState<string>('85');
  const [weightedFinalWeight, setWeightedFinalWeight] = useState<string>('25');
  const [categories, setCategories] = useState<WeightedCategoryInput[]>([
    { name: 'Homework & Assignments', weightPct: 20, averageScore: 92 },
    { name: 'Quizzes', weightPct: 20, averageScore: 85 },
    { name: 'Midterm & Unit Tests', weightPct: 35, averageScore: 80 },
  ]);

  // Points Tab State
  const [ptsEarned, setPtsEarned] = useState<string>('420');
  const [ptsPossible, setPtsPossible] = useState<string>('500');
  const [ptsFinal, setPtsFinal] = useState<string>('100');
  const [ptsTarget, setPtsTarget] = useState<string>('85');

  // What-If Slider State
  const [simulatedFinalScore, setSimulatedFinalScore] = useState<number>(90);

  // Scale Option
  const [usePlusMinus, setUsePlusMinus] = useState<boolean>(false);

  // Accessible IDs
  const idCurrent = useId();
  const idWhatIfCurrent = useId();
  const idWhatIfWeight = useId();
  const idWeight = useId();
  const idTarget = useId();

  const idWeightTarget = useId();
  const idWeightFinal = useId();

  const idPtsEarned = useId();
  const idPtsPossible = useId();
  const idPtsFinal = useId();
  const idPtsTarget = useId();

  const idSlider = useId();

  // Calculations
  const numCurrent = parseFloat(currentGrade) || 0;
  const numWeight = parseFloat(finalWeight) || 0;
  const numTarget = parseFloat(targetGrade) || 0;

  const neededRes = calculateNeededScore(numCurrent, numWeight, numTarget);
  const selectedScale: GradeCutoff[] = usePlusMinus ? PLUS_MINUS_GRADE_SCALE : DEFAULT_GRADE_SCALE;
  const letterTable = calculateLetterCutoffTable(numCurrent, numWeight, selectedScale);

  const numWeightedTarget = parseFloat(weightedTarget) || 0;
  const numWeightedFinal = parseFloat(weightedFinalWeight) || 0;
  const weightedRes = calculateWeightedGrade(categories, numWeightedFinal, numWeightedTarget);

  const numPtsEarned = parseFloat(ptsEarned) || 0;
  const numPtsPoss = parseFloat(ptsPossible) || 0;
  const numPtsFinal = parseFloat(ptsFinal) || 0;
  const numPtsTarget = parseFloat(ptsTarget) || 0;
  const pointsRes = calculatePointsGrade(numPtsEarned, numPtsPoss, numPtsFinal, numPtsTarget);

  const whatIfCourseGrade = calculateGradeAfterFinal(numCurrent, numWeight, simulatedFinalScore);

  const handleUpdateCategory = (index: number, field: keyof WeightedCategoryInput, val: string) => {
    const updated = [...categories];
    if (field === 'name') {
      updated[index] = { ...updated[index], name: val };
    } else {
      updated[index] = { ...updated[index], [field]: parseFloat(val) || 0 };
    }
    setCategories(updated);
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { name: `Category ${categories.length + 1}`, weightPct: 10, averageScore: 85 },
    ]);
  };

  const handleRemoveCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={styles.container}>
      {/* Visual Input Guide Diagram */}
      <FinalGradeInputGuide activeTab={tab} finalWeight={numWeight} />

      {/* Tabs */}
      <TabSlider
        tabs={[{ id: 'needed', label: 'Score Needed' }, { id: 'weighted', label: 'Weighted Categories' }, { id: 'points', label: 'Points-Based' }, { id: 'whatif', label: 'What-If Projection' }]}
        activeId={tab}
        onChange={(id) => {
          setTab(id as typeof tab);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="Final Grade Calculator Modes"
      />

      {/* Inputs Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {tab === 'needed' && 'What Do I Need on My Final Exam?'}
            {tab === 'weighted' && 'Calculate from Weighted Categories (Syllabus Weights)'}
            {tab === 'points' && 'Points-Based Grading System'}
            {tab === 'whatif' && 'Simulate Your Final Course Grade'}
          </h2>
          <div className={styles.presetsRow}>
            <span className={styles.presetLabel}>Quick Presets:</span>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => {
                setCurrentGrade('85');
                setFinalWeight('20');
                setTargetGrade('87');
              }}
            >
              85% Current · 20% Final · Want 87%
            </button>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => {
                setCurrentGrade('88');
                setFinalWeight('25');
                setTargetGrade('90');
              }}
            >
              88% Current · 25% Final · Want 90%
            </button>
          </div>
        </div>

        {tab === 'needed' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={idCurrent} className={styles.label}>
                Current Course Grade
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idCurrent}
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  className={styles.input}
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
              <span className={styles.helperText}>Your grade in the class before taking the final exam.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idWeight} className={styles.label}>
                Final Exam Weight
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idWeight}
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  className={styles.input}
                  value={finalWeight}
                  onChange={(e) => setFinalWeight(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
              <span className={styles.helperText}>Percentage of total grade the final exam is worth (from syllabus).</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idTarget} className={styles.label}>
                Target Desired Grade
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idTarget}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className={styles.input}
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
              <span className={styles.helperText}>Overall percentage you wish to achieve in the course.</span>
            </div>
          </div>
        )}

        {tab === 'weighted' && (
          <div>
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div className={styles.field} style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor={idWeightFinal} className={styles.label}>
                  Final Exam Weight
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idWeightFinal}
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    className={styles.input}
                    value={weightedFinalWeight}
                    onChange={(e) => setWeightedFinalWeight(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.field} style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor={idWeightTarget} className={styles.label}>
                  Target Course Grade
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idWeightTarget}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className={styles.input}
                    value={weightedTarget}
                    onChange={(e) => setWeightedTarget(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Category Weight (%)</th>
                    <th>Your Average Score (%)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}
                          value={c.name}
                          onChange={(e) => handleUpdateCategory(idx, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem', width: '100px' }}
                          value={c.weightPct}
                          onChange={(e) => handleUpdateCategory(idx, 'weightPct', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem', width: '100px' }}
                          value={c.averageScore}
                          onChange={(e) => handleUpdateCategory(idx, 'averageScore', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.presetBtn}
                          disabled={categories.length <= 1}
                          onClick={() => handleRemoveCategory(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className={styles.actionBtn} onClick={handleAddCategory}>
              + Add Category
            </button>
          </div>
        )}

        {tab === 'points' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={idPtsEarned} className={styles.label}>
                Points Earned So Far
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idPtsEarned}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={ptsEarned}
                  onChange={(e) => setPtsEarned(e.target.value)}
                />
                <span className={styles.suffix}>pts</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={idPtsPossible} className={styles.label}>
                Total Points Possible So Far
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idPtsPossible}
                  type="number"
                  min="1"
                  step="any"
                  className={styles.input}
                  value={ptsPossible}
                  onChange={(e) => setPtsPossible(e.target.value)}
                />
                <span className={styles.suffix}>pts</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={idPtsFinal} className={styles.label}>
                Points Worth on Final Exam
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idPtsFinal}
                  type="number"
                  min="1"
                  step="any"
                  className={styles.input}
                  value={ptsFinal}
                  onChange={(e) => setPtsFinal(e.target.value)}
                />
                <span className={styles.suffix}>pts</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={idPtsTarget} className={styles.label}>
                Target Course Percentage
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idPtsTarget}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className={styles.input}
                  value={ptsTarget}
                  onChange={(e) => setPtsTarget(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'whatif' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={idWhatIfCurrent} className={styles.label}>Current Grade: {numCurrent}%</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idWhatIfCurrent}
                    type="number"
                    className={styles.input}
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={idWhatIfWeight} className={styles.label}>Final Weight: {numWeight}%</label>
                <div className={styles.inputWrapper}>
                  <input
                    id={idWhatIfWeight}
                    type="number"
                    className={styles.input}
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(e.target.value)}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>

            <div className={styles.sliderWrapper}>
              <label htmlFor={idSlider} className={styles.label} style={{ fontSize: '1rem', fontWeight: 700 }}>
                Hypothetical Score on Final Exam: <span>{simulatedFinalScore}%</span>
              </label>
              <input
                id={idSlider}
                type="range"
                min="0"
                max="100"
                step="1"
                className={styles.rangeInput}
                value={simulatedFinalScore}
                onChange={(e) => setSimulatedFinalScore(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                <span>0% (F)</span>
                <span>50%</span>
                <span>75%</span>
                <span>100% (A+)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Result Section */}
      {tab === 'needed' && neededRes && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Score Needed on Final Exam
            </div>
            <div className={styles.heroMainValue}>
              {neededRes.status === 'not-reachable'
                ? `${neededRes.neededScore}%`
                : neededRes.status === 'already-secured'
                ? 'Secured'
                : `${neededRes.neededScore}%`}
            </div>
            <div className={styles.heroSubValue}>
              {neededRes.status === 'not-reachable' && (
                <span style={{ color: '#FECDD3' }}>Not reachable · Maximum possible course grade is {neededRes.maxPossibleGrade}%</span>
              )}
              {neededRes.status === 'already-secured' && (
                <span style={{ color: '#A7F3D0' }}>Already secured · Minimum possible grade is {neededRes.minPossibleGrade}% even with 0%</span>
              )}
              {neededRes.status === 'achievable' && (
                <span>Required final exam score for {numTarget}% course grade</span>
              )}
            </div>
            <div className={styles.heroSentence}>
              You need {neededRes.neededScore}% on your final to finish with {numTarget}%. Even a 0% on the final leaves you with {neededRes.minPossibleGrade}%; a perfect 100% score gives {neededRes.maxPossibleGrade}%.
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Current Coursework Share</span>
              <span className={styles.metricValue}>{(100 - numWeight)}%</span>
              <span className={styles.metricDetail}>{numCurrent}% average grade</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Final Exam Weight</span>
              <span className={styles.metricValue}>{numWeight}%</span>
              <span className={styles.metricDetail}>Remaining course weight</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Worst-Case Grade (0% Final)</span>
              <span className={styles.metricValue}>{neededRes.minPossibleGrade}%</span>
              <span className={styles.metricDetail}>Guaranteed floor grade</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Best-Case Grade (100% Final)</span>
              <span className={styles.metricValue}>{neededRes.maxPossibleGrade}%</span>
              <span className={styles.metricDetail}>Ceiling grade with 100%</span>
            </div>
          </div>

          {/* Letter Grade Table */}
          <div className={styles.tableCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Needed Scores for Every Letter Grade</h3>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setUsePlusMinus(!usePlusMinus)}
              >
                {usePlusMinus ? 'Show Standard (A, B, C, D)' : 'Show +/- Scale (A+, A, A-...)'}
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Letter Grade</th>
                  <th>Cutoff (%)</th>
                  <th>Score Needed on Final</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {letterTable.map((item) => (
                  <tr key={item.letter}>
                    <td>
                      <span className={styles.letterBadge}>{item.letter}</span>
                    </td>
                    <td>{item.targetCutoff}%</td>
                    <td>
                      <strong>{item.neededScore}%</strong>
                    </td>
                    <td>
                      {item.status === 'not-reachable' && (
                        <span className={styles.statusNotReachable}>Not reachable (max {neededRes.maxPossibleGrade}%)</span>
                      )}
                      {item.status === 'already-secured' && (
                        <span className={styles.statusSecured}>Already secured (min {neededRes.minPossibleGrade}%)</span>
                      )}
                      {item.status === 'achievable' && (
                        <span className={styles.statusAchievable}>Achievable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'weighted' && weightedRes && (
        <>
          {weightedRes.isNormalized && (
            <div className={styles.warningBox}>
              <strong>Note:</strong> Weights sum to {weightedRes.weightsSum}% (not 100%). Scores have been normalized automatically.
            </div>
          )}

          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Weighted Final Exam Score Needed
            </div>
            <div className={styles.heroMainValue}>
              {weightedRes.status === 'not-reachable'
                ? `${weightedRes.neededScoreOnFinal}%`
                : weightedRes.status === 'already-secured'
                ? 'Secured'
                : `${weightedRes.neededScoreOnFinal}%`}
            </div>
            <div className={styles.heroSubValue}>
              Target: {numWeightedTarget}% · Current Weighted Average: {weightedRes.currentAverage}%
            </div>
            <div className={styles.heroSentence}>
              Across your course categories, you currently hold a {weightedRes.currentAverage}% average over {weightedRes.totalNonFinalWeight}% of the course. You need {weightedRes.neededScoreOnFinal}% on the final exam ({numWeightedFinal}% weight) to finish with {numWeightedTarget}%.
            </div>
          </div>
        </>
      )}

      {tab === 'points' && pointsRes && (
        <div className={styles.heroResult}>
          <div className={styles.heroBadge}>
            Points-Based Final Target
          </div>
          <div className={styles.heroMainValue}>
            {pointsRes.neededPctOnFinal}%
          </div>
          <div className={styles.heroSubValue}>
            {pointsRes.pointsNeededOnFinal} / {numPtsFinal} points needed on final exam
          </div>
          <div className={styles.heroSentence}>
            You have earned {numPtsEarned} of {numPtsPoss} points ({pointsRes.currentPct}%). To achieve {numPtsTarget}% of the {pointsRes.totalPointsWithFinal} total course points, you need {pointsRes.pointsNeededOnFinal} points ({pointsRes.neededPctOnFinal}%) on the final.
          </div>
        </div>
      )}

      {tab === 'whatif' && whatIfCourseGrade !== null && (
        <div className={styles.heroResult}>
          <div className={styles.heroBadge}>
            Projected Course Grade
          </div>
          <div className={styles.heroMainValue}>
            {whatIfCourseGrade}%
          </div>
          <div className={styles.heroSubValue}>
            With a {simulatedFinalScore}% on the final exam ({numWeight}% weight)
          </div>
          <div className={styles.heroSentence}>
            Entering the final with an {numCurrent}% grade and scoring {simulatedFinalScore}% on the final exam will result in an overall final course grade of {whatIfCourseGrade}%.
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => {
            setCurrentGrade('85');
            setFinalWeight('20');
            setTargetGrade('87');
            setWeightedTarget('85');
            setWeightedFinalWeight('25');
            setCategories([
              { name: 'Homework & Assignments', weightPct: 20, averageScore: 92 },
              { name: 'Quizzes', weightPct: 20, averageScore: 85 },
              { name: 'Tests / Midterms', weightPct: 35, averageScore: 80 },
            ]);
            setPtsEarned('420');
            setPtsPossible('500');
            setPtsFinal('100');
            setPtsTarget('85');
            setSimulatedFinalScore(90);
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
