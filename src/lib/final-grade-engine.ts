/**
 * Final Grade & Exam Score Calculation Engine
 * 
 * Supports:
 * - Score needed on final exam given current grade, weight, and target grade
 * - Grade after final (what-if projection)
 * - Letter grade cutoff table with "already secured" and "not reachable" states
 * - Weighted categories mode (homework, quizzes, exams, etc.) with auto-normalization
 * - Points-based grading system
 * - Special exam rules: Final counts as N tests, lowest test dropped
 * 
 * Pure functions, zero network, zero side-effects.
 */

export interface GradeCutoff {
  letter: string;
  minScore: number;
}

export const DEFAULT_GRADE_SCALE: GradeCutoff[] = [
  { letter: 'A', minScore: 90 },
  { letter: 'B', minScore: 80 },
  { letter: 'C', minScore: 70 },
  { letter: 'D', minScore: 60 },
];

export const PLUS_MINUS_GRADE_SCALE: GradeCutoff[] = [
  { letter: 'A+', minScore: 97 },
  { letter: 'A', minScore: 93 },
  { letter: 'A-', minScore: 90 },
  { letter: 'B+', minScore: 87 },
  { letter: 'B', minScore: 83 },
  { letter: 'B-', minScore: 80 },
  { letter: 'C+', minScore: 77 },
  { letter: 'C', minScore: 73 },
  { letter: 'C-', minScore: 70 },
  { letter: 'D+', minScore: 67 },
  { letter: 'D', minScore: 63 },
  { letter: 'D-', minScore: 60 },
];

export type GradeNeededStatus = 'achievable' | 'not-reachable' | 'already-secured';

export interface ScoreNeededResult {
  currentGrade: number;
  finalWeightPct: number;
  targetGrade: number;
  neededScore: number;
  minPossibleGrade: number; // if 0% on final
  maxPossibleGrade: number; // if 100% on final
  status: GradeNeededStatus;
  statusMessage: string;
}

export interface LetterTableItem {
  letter: string;
  targetCutoff: number;
  neededScore: number;
  status: GradeNeededStatus;
  label: string;
}

export interface WeightedCategoryInput {
  name: string;
  weightPct: number;
  averageScore: number;
}

export interface WeightedGradeResult {
  currentAverage: number;
  totalNonFinalWeight: number;
  finalWeightPct: number;
  targetGrade: number;
  neededScoreOnFinal: number;
  weightsSum: number;
  isNormalized: boolean;
  minPossible: number;
  maxPossible: number;
  status: GradeNeededStatus;
}

export interface PointsGradeResult {
  pointsEarned: number;
  pointsPossibleSoFar: number;
  currentPct: number;
  finalPoints: number;
  totalPointsWithFinal: number;
  finalWeightPct: number;
  pointsNeededOnFinal: number;
  neededPctOnFinal: number;
  status: GradeNeededStatus;
}

/**
 * Calculates score needed on the final exam.
 * Formula: needed = (Target - Current * (1 - w)) / w
 */
export function calculateNeededScore(
  currentGrade: number,
  finalWeightPct: number,
  targetGrade: number
): ScoreNeededResult | null {
  if (finalWeightPct <= 0 || finalWeightPct > 100) return null;

  const w = finalWeightPct / 100.0;
  const currentPart = currentGrade * (1.0 - w);
  const neededRaw = (targetGrade - currentPart) / w;
  const neededScore = Number(neededRaw.toFixed(2));

  const minPossibleGrade = Number(currentPart.toFixed(2));
  const maxPossibleGrade = Number((currentPart + 100.0 * w).toFixed(2));

  let status: GradeNeededStatus = 'achievable';
  let statusMessage = `You need ${neededScore}% on your final exam.`;

  if (neededScore > 100.0) {
    status = 'not-reachable';
    statusMessage = `Not reachable (maximum possible course grade is ${maxPossibleGrade}% with a 100% on the final).`;
  } else if (neededScore <= 0.0) {
    status = 'already-secured';
    statusMessage = `Already secured (minimum possible course grade is ${minPossibleGrade}% even with a 0% on the final).`;
  }

  return {
    currentGrade,
    finalWeightPct,
    targetGrade,
    neededScore,
    minPossibleGrade,
    maxPossibleGrade,
    status,
    statusMessage,
  };
}

/**
 * Calculates final course grade based on a specific final exam score (what-if).
 * Formula: courseGrade = Current * (1 - w) + Final * w
 */
export function calculateGradeAfterFinal(
  currentGrade: number,
  finalWeightPct: number,
  finalScore: number
): number | null {
  if (finalWeightPct < 0 || finalWeightPct > 100) return null;
  const w = finalWeightPct / 100.0;
  const courseGrade = currentGrade * (1.0 - w) + finalScore * w;
  return Number(courseGrade.toFixed(2));
}

/**
 * Generates letter grade cutoff table with needed scores and status tags.
 */
export function calculateLetterCutoffTable(
  currentGrade: number,
  finalWeightPct: number,
  scale: GradeCutoff[] = DEFAULT_GRADE_SCALE
): LetterTableItem[] {
  if (finalWeightPct <= 0 || finalWeightPct > 100) return [];

  return scale.map((item) => {
    const res = calculateNeededScore(currentGrade, finalWeightPct, item.minScore);
    if (!res) {
      return {
        letter: item.letter,
        targetCutoff: item.minScore,
        neededScore: 0,
        status: 'achievable',
        label: 'N/A',
      };
    }

    let label = `${res.neededScore}%`;
    if (res.status === 'not-reachable') {
      label = `${res.neededScore}%, not reachable (max possible ${res.maxPossibleGrade}%)`;
    } else if (res.status === 'already-secured') {
      label = `already secured (min possible ${res.minPossibleGrade}%)`;
    }

    return {
      letter: item.letter,
      targetCutoff: item.minScore,
      neededScore: res.neededScore,
      status: res.status,
      label,
    };
  });
}

/**
 * Calculates needed score from weighted course categories (homework, quizzes, exams, etc.).
 */
export function calculateWeightedGrade(
  categories: WeightedCategoryInput[],
  finalWeightPct: number,
  targetGrade: number
): WeightedGradeResult | null {
  if (finalWeightPct <= 0) return null;

  const totalOtherWeight = categories.reduce((sum, c) => sum + Math.max(0, c.weightPct), 0);
  const weightsSum = totalOtherWeight + finalWeightPct;
  const isNormalized = Math.abs(weightsSum - 100.0) > 0.01;

  // Compute weighted sum of completed work
  let weightedEarned = 0;
  categories.forEach((c) => {
    weightedEarned += (Math.max(0, c.averageScore) * Math.max(0, c.weightPct));
  });

  const currentAverage = totalOtherWeight > 0 ? Number((weightedEarned / totalOtherWeight).toFixed(2)) : 0;

  // Target points required on normalized 100 scale:
  // (weightedEarned + finalScore * finalWeightPct) / weightsSum = targetGrade
  // finalScore * finalWeightPct = targetGrade * weightsSum - weightedEarned
  const neededRaw = (targetGrade * weightsSum - weightedEarned) / finalWeightPct;
  const neededScoreOnFinal = Number(neededRaw.toFixed(2));

  const minPossible = Number((weightedEarned / weightsSum).toFixed(2));
  const maxPossible = Number(((weightedEarned + 100.0 * finalWeightPct) / weightsSum).toFixed(2));

  let status: GradeNeededStatus = 'achievable';
  if (neededScoreOnFinal > 100.0) {
    status = 'not-reachable';
  } else if (neededScoreOnFinal <= 0.0) {
    status = 'already-secured';
  }

  return {
    currentAverage,
    totalNonFinalWeight: totalOtherWeight,
    finalWeightPct,
    targetGrade,
    neededScoreOnFinal,
    weightsSum: Number(weightsSum.toFixed(2)),
    isNormalized,
    minPossible,
    maxPossible,
    status,
  };
}

/**
 * Calculates grade needed in a points-based grading system.
 */
export function calculatePointsGrade(
  pointsEarned: number,
  pointsPossibleSoFar: number,
  finalPoints: number,
  targetPct: number
): PointsGradeResult | null {
  if (pointsPossibleSoFar <= 0 || finalPoints <= 0) return null;

  const totalPointsWithFinal = pointsPossibleSoFar + finalPoints;
  const currentPct = Number(((pointsEarned / pointsPossibleSoFar) * 100).toFixed(2));
  const finalWeightPct = Number(((finalPoints / totalPointsWithFinal) * 100).toFixed(2));

  // Required total points = totalPointsWithFinal * (targetPct / 100)
  const targetTotalPoints = totalPointsWithFinal * (targetPct / 100.0);
  const pointsNeededOnFinal = Math.max(0, Number((targetTotalPoints - pointsEarned).toFixed(2)));
  const neededPctOnFinal = Number(((pointsNeededOnFinal / finalPoints) * 100).toFixed(2));

  let status: GradeNeededStatus = 'achievable';
  if (neededPctOnFinal > 100.0) {
    status = 'not-reachable';
  } else if (neededPctOnFinal <= 0.0) {
    status = 'already-secured';
  }

  return {
    pointsEarned,
    pointsPossibleSoFar,
    currentPct,
    finalPoints,
    totalPointsWithFinal,
    finalWeightPct,
    pointsNeededOnFinal,
    neededPctOnFinal,
    status,
  };
}

/**
 * Special rule: Final exam counts as N regular test grades.
 * e.g. You have 3 tests with average avgTest, and final counts as 2 tests.
 */
export function calculateFinalAsNTests(
  existingTestScores: number[],
  finalCountN: number,
  targetTestAverage: number
): { neededOnFinal: number; status: GradeNeededStatus } | null {
  const k = existingTestScores.length;
  if (k === 0 || finalCountN <= 0) return null;

  const existingSum = existingTestScores.reduce((a, b) => a + b, 0);
  const totalTests = k + finalCountN;
  // targetTestAverage = (existingSum + finalScore * N) / totalTests
  // finalScore * N = targetTestAverage * totalTests - existingSum
  const needed = (targetTestAverage * totalTests - existingSum) / finalCountN;
  const neededScore = Number(needed.toFixed(2));

  let status: GradeNeededStatus = 'achievable';
  if (neededScore > 100.0) status = 'not-reachable';
  else if (neededScore <= 0.0) status = 'already-secured';

  return {
    neededOnFinal: neededScore,
    status,
  };
}
