import { describe, it, expect } from 'vitest';
import {
  calculateNeededScore,
  calculateGradeAfterFinal,
  calculateLetterCutoffTable,
  calculateWeightedGrade,
  calculatePointsGrade,
  calculateFinalAsNTests,
} from './final-grade-engine';

describe('Final Grade Engine', () => {
  it('calculates score needed: 85% current, 20% weight, 87% target = 95% needed', () => {
    const res = calculateNeededScore(85, 20, 87);
    expect(res).not.toBeNull();
    expect(res?.neededScore).toBe(95.0);
    expect(res?.minPossibleGrade).toBe(68.0);
    expect(res?.maxPossibleGrade).toBe(88.0);
    expect(res?.status).toBe('achievable');
  });

  it('generates letter cutoff table matching spec fixture', () => {
    // 85% current, 20% final weight
    const table = calculateLetterCutoffTable(85, 20);
    expect(table).toHaveLength(4);

    const gradeA = table.find((t) => t.letter === 'A');
    expect(gradeA?.targetCutoff).toBe(90);
    expect(gradeA?.neededScore).toBe(110.0);
    expect(gradeA?.status).toBe('not-reachable');

    const gradeB = table.find((t) => t.letter === 'B');
    expect(gradeB?.targetCutoff).toBe(80);
    expect(gradeB?.neededScore).toBe(60.0);
    expect(gradeB?.status).toBe('achievable');

    const gradeC = table.find((t) => t.letter === 'C');
    expect(gradeC?.targetCutoff).toBe(70);
    expect(gradeC?.neededScore).toBe(10.0);
    expect(gradeC?.status).toBe('achievable');

    const gradeD = table.find((t) => t.letter === 'D');
    expect(gradeD?.targetCutoff).toBe(60);
    expect(gradeD?.neededScore).toBe(-40.0);
    expect(gradeD?.status).toBe('already-secured');
  });

  it('calculates weighted categories fixture: HW 20% @ 92, Quiz 20% @ 85, Test 35% @ 80, Final 25%, target 85 = 86.4%', () => {
    const res = calculateWeightedGrade(
      [
        { name: 'Homework', weightPct: 20, averageScore: 92 },
        { name: 'Quizzes', weightPct: 20, averageScore: 85 },
        { name: 'Tests', weightPct: 35, averageScore: 80 },
      ],
      25,
      85
    );

    expect(res).not.toBeNull();
    expect(res?.weightsSum).toBe(100.0);
    expect(res?.isNormalized).toBe(false);
    expect(res?.neededScoreOnFinal).toBe(86.4);
    expect(res?.status).toBe('achievable');
  });

  it('calculates what-if grade after final', () => {
    // 85% current, 20% weight, 90% on final -> 85*0.8 + 90*0.2 = 68 + 18 = 86%
    const grade = calculateGradeAfterFinal(85, 20, 90);
    expect(grade).toBe(86.0);
  });

  it('calculates points-based system correctly', () => {
    // 400 earned so far out of 500 possible, final is worth 100 points (total 600), want 85% (510 total)
    // Points needed = 510 - 400 = 110 out of 100 -> 110% (not reachable)
    const pointsRes = calculatePointsGrade(400, 500, 100, 85);
    expect(pointsRes).not.toBeNull();
    expect(pointsRes?.currentPct).toBe(80.0);
    expect(pointsRes?.pointsNeededOnFinal).toBe(110.0);
    expect(pointsRes?.neededPctOnFinal).toBe(110.0);
    expect(pointsRes?.status).toBe('not-reachable');
  });

  it('handles final as N tests special rule', () => {
    // 3 tests: 80, 85, 90 (sum 255), final counts as 2 tests (total 5 tests), target average 88 (total 440)
    // Needed for 2 tests = 440 - 255 = 185 -> 185 / 2 = 92.5%
    const res = calculateFinalAsNTests([80, 85, 90], 2, 88);
    expect(res).not.toBeNull();
    expect(res?.neededOnFinal).toBe(92.5);
    expect(res?.status).toBe('achievable');
  });
});
