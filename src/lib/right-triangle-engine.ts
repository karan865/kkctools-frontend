/**
 * Pythagorean Theorem & Right Triangle Calculation Engine
 * Pure TypeScript, zero network calls, fully deterministic.
 */

export interface RightTriangleResult {
  a: number;
  b: number;
  c: number; // hypotenuse
  alphaDeg: number; // angle opposite to a (degrees)
  betaDeg: number; // angle opposite to b (degrees)
  gammaDeg: number; // always 90
  area: number;
  perimeter: number;
  altitude: number; // height to hypotenuse = (a * b) / c
  radicalC?: {
    coefficient: number;
    radicand: number;
    formatted: string;
  };
  steps: string[];
}

export type TriangleType = 'right' | 'acute' | 'obtuse' | 'invalid';

export interface TriangleClassification {
  type: TriangleType;
  a: number;
  b: number;
  c: number; // longest side
  sumSquaresLegs: number; // a^2 + b^2
  hypotenuseSquare: number; // c^2
  difference: number; // a^2 + b^2 - c^2
  explanation: string;
}

export interface SquareCornerResult {
  length: number;
  width: number;
  diagonal: number;
  diagonalFtIn: string;
  suggestedTriple: {
    legA: number;
    legB: number;
    hypotenuse: number;
    multiplier: number;
    description: string;
  };
  measuredD1?: number;
  measuredD2?: number;
  outOfSquare?: number;
  isSquare?: boolean;
  notes: string[];
}

/**
 * Simplifies a square root: sqrt(n) = k * sqrt(m)
 * for an integer radicand >= 0.
 */
export function simplifyRadical(n: number): {
  coefficient: number;
  radicand: number;
  formatted: string;
} {
  const rounded = Math.round(n);
  // Only simplify if n is very close to an integer
  if (Math.abs(n - rounded) > 1e-6 || rounded <= 0) {
    return {
      coefficient: 1,
      radicand: n,
      formatted: `√${Math.round(n * 1000) / 1000}`,
    };
  }

  let coeff = 1;
  let rad = rounded;

  const maxCheck = Math.floor(Math.sqrt(rad));
  for (let i = maxCheck; i >= 2; i--) {
    const square = i * i;
    if (rad % square === 0) {
      coeff *= i;
      rad = rad / square;
      break; // The largest square found first
    }
  }

  // Format cleanly
  let formatted: string;
  if (rad === 1) {
    formatted = `${coeff}`;
  } else if (coeff === 1) {
    formatted = `√${rad}`;
  } else {
    formatted = `${coeff}√${rad}`;
  }

  return { coefficient: coeff, radicand: rad, formatted };
}

/**
 * Solves a right triangle given any two sides (a, b, c where c is hypotenuse).
 */
export function solveRightTriangleSides(
  inputA?: number | null,
  inputB?: number | null,
  inputC?: number | null
): RightTriangleResult {
  const steps: string[] = [];

  let a = inputA ?? 0;
  let b = inputB ?? 0;
  let c = inputC ?? 0;

  if (a > 0 && b > 0) {
    // Solve for hypotenuse c
    const sumSq = a * a + b * b;
    c = Math.sqrt(sumSq);

    steps.push(`Formula: c = √(a² + b²)`);
    steps.push(`Substitute: c = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${sumSq}`);

    const radical = simplifyRadical(sumSq);
    if (radical.radicand !== sumSq || radical.radicand === 1) {
      steps.push(`Exact radical: c = ${radical.formatted}`);
    }
    steps.push(`Decimal value: c ≈ ${c.toFixed(4)}`);
  } else if (c > 0 && a > 0) {
    // Solve for leg b
    if (a >= c) {
      throw new Error(`Leg a (${a}) must be strictly less than hypotenuse c (${c}).`);
    }
    const diffSq = c * c - a * a;
    b = Math.sqrt(diffSq);

    steps.push(`Formula: b = √(c² − a²)`);
    steps.push(`Substitute: b = √(${c}² − ${a}²) = √(${c * c} − ${a * a}) = √${diffSq}`);
    const radical = simplifyRadical(diffSq);
    if (radical.radicand !== diffSq || radical.radicand === 1) {
      steps.push(`Exact radical: b = ${radical.formatted}`);
    }
    steps.push(`Decimal value: b ≈ ${b.toFixed(4)}`);
  } else if (c > 0 && b > 0) {
    // Solve for leg a
    if (b >= c) {
      throw new Error(`Leg b (${b}) must be strictly less than hypotenuse c (${c}).`);
    }
    const diffSq = c * c - b * b;
    a = Math.sqrt(diffSq);

    steps.push(`Formula: a = √(c² − b²)`);
    steps.push(`Substitute: a = √(${c}² − ${b}²) = √(${c * c} − ${b * b}) = √${diffSq}`);
    const radical = simplifyRadical(diffSq);
    if (radical.radicand !== diffSq || radical.radicand === 1) {
      steps.push(`Exact radical: a = ${radical.formatted}`);
    }
    steps.push(`Decimal value: a ≈ ${a.toFixed(4)}`);
  } else {
    throw new Error('Provide at least two valid positive side lengths.');
  }

  // Calculate angles in degrees
  const alphaRad = Math.atan2(a, b);
  const alphaDeg = (alphaRad * 180) / Math.PI;
  const betaDeg = 90 - alphaDeg;

  steps.push(`Angle α = arctan(a / b) = arctan(${a} / ${b}) ≈ ${alphaDeg.toFixed(2)}°`);
  steps.push(`Angle β = 90° − α = 90° − ${alphaDeg.toFixed(2)}° ≈ ${betaDeg.toFixed(2)}°`);

  // Area & Perimeter & Altitude
  const area = (a * b) / 2;
  const perimeter = a + b + c;
  const altitude = (a * b) / c;

  steps.push(`Area = (a × b) ÷ 2 = (${a} × ${b}) ÷ 2 = ${area}`);
  steps.push(`Perimeter = a + b + c = ${a} + ${b} + ${c.toFixed(4)} = ${perimeter.toFixed(4)}`);
  steps.push(`Altitude (h) = (a × b) ÷ c = (${a} × ${b}) ÷ ${c.toFixed(4)} ≈ ${altitude.toFixed(4)}`);

  return {
    a,
    b,
    c,
    alphaDeg,
    betaDeg,
    gammaDeg: 90,
    area,
    perimeter,
    altitude,
    radicalC: simplifyRadical(c * c),
    steps,
  };
}

/**
 * Solves a right triangle given one side and one acute angle (in degrees).
 */
export function solveRightTriangleAngle(
  knownSide: 'a' | 'b' | 'c',
  sideValue: number,
  knownAngle: 'alpha' | 'beta',
  angleDeg: number
): RightTriangleResult {
  if (sideValue <= 0) {
    throw new Error('Side length must be positive.');
  }
  if (angleDeg <= 0 || angleDeg >= 90) {
    throw new Error('Acute angle must be between 0° and 90°.');
  }

  const steps: string[] = [];
  const alphaDeg = knownAngle === 'alpha' ? angleDeg : 90 - angleDeg;
  const betaDeg = 90 - alphaDeg;

  const alphaRad = (alphaDeg * Math.PI) / 180;

  let a = 0;
  let b = 0;
  let c = 0;

  if (knownSide === 'c') {
    c = sideValue;
    a = c * Math.sin(alphaRad);
    b = c * Math.cos(alphaRad);
    steps.push(`Given hypotenuse c = ${c} and α = ${alphaDeg}°`);
    steps.push(`a = c × sin(α) = ${c} × sin(${alphaDeg}°) ≈ ${a.toFixed(4)}`);
    steps.push(`b = c × cos(α) = ${c} × cos(${alphaDeg}°) ≈ ${b.toFixed(4)}`);
  } else if (knownSide === 'a') {
    a = sideValue;
    c = a / Math.sin(alphaRad);
    b = a / Math.tan(alphaRad);
    steps.push(`Given leg a = ${a} and α = ${alphaDeg}°`);
    steps.push(`c = a ÷ sin(α) = ${a} ÷ sin(${alphaDeg}°) ≈ ${c.toFixed(4)}`);
    steps.push(`b = a ÷ tan(α) = ${a} ÷ tan(${alphaDeg}°) ≈ ${b.toFixed(4)}`);
  } else {
    // knownSide === 'b'
    b = sideValue;
    c = b / Math.cos(alphaRad);
    a = b * Math.tan(alphaRad);
    steps.push(`Given leg b = ${b} and α = ${alphaDeg}°`);
    steps.push(`c = b ÷ cos(α) = ${b} ÷ cos(${alphaDeg}°) ≈ ${c.toFixed(4)}`);
    steps.push(`a = b × tan(α) = ${b} × tan(${alphaDeg}°) ≈ ${a.toFixed(4)}`);
  }

  const area = (a * b) / 2;
  const perimeter = a + b + c;
  const altitude = (a * b) / c;

  steps.push(`Area = (a × b) ÷ 2 = ${area.toFixed(4)}`);
  steps.push(`Perimeter = a + b + c = ${perimeter.toFixed(4)}`);
  steps.push(`Altitude h = (a × b) ÷ c = ${altitude.toFixed(4)}`);

  return {
    a,
    b,
    c,
    alphaDeg,
    betaDeg,
    gammaDeg: 90,
    area,
    perimeter,
    altitude,
    radicalC: simplifyRadical(c * c),
    steps,
  };
}

/**
 * Checks whether 3 given side lengths form a valid triangle and classifies it
 * as Right, Acute, or Obtuse via the Pythagorean converse (a^2 + b^2 vs c^2).
 */
export function classifyTriangle(s1: number, s2: number, s3: number): TriangleClassification {
  if (s1 <= 0 || s2 <= 0 || s3 <= 0) {
    return {
      type: 'invalid',
      a: s1,
      b: s2,
      c: s3,
      sumSquaresLegs: 0,
      hypotenuseSquare: 0,
      difference: 0,
      explanation: 'All side lengths must be strictly greater than zero.',
    };
  }

  // Sort ascending: a <= b <= c
  const [a, b, c] = [s1, s2, s3].sort((x, y) => x - y);

  // Triangle inequality
  if (a + b <= c) {
    return {
      type: 'invalid',
      a,
      b,
      c,
      sumSquaresLegs: a * a + b * b,
      hypotenuseSquare: c * c,
      difference: a * a + b * b - c * c,
      explanation: `Impossible triangle: the sum of the shorter sides (${a} + ${b} = ${a + b}) must be strictly greater than the longest side (${c}).`,
    };
  }

  const sumSquaresLegs = a * a + b * b;
  const hypotenuseSquare = c * c;
  const diff = sumSquaresLegs - hypotenuseSquare;
  const epsilon = 1e-7;

  if (Math.abs(diff) <= epsilon) {
    return {
      type: 'right',
      a,
      b,
      c,
      sumSquaresLegs,
      hypotenuseSquare,
      difference: 0,
      explanation: `Right triangle: a² + b² = ${sumSquaresLegs} equals c² = ${hypotenuseSquare} exactly. The triangle satisfies the Pythagorean theorem.`,
    };
  } else if (diff > 0) {
    return {
      type: 'acute',
      a,
      b,
      c,
      sumSquaresLegs,
      hypotenuseSquare,
      difference: diff,
      explanation: `Acute triangle: a² + b² = ${sumSquaresLegs} > c² = ${hypotenuseSquare}. All three internal angles are less than 90°.`,
    };
  } else {
    return {
      type: 'obtuse',
      a,
      b,
      c,
      sumSquaresLegs,
      hypotenuseSquare,
      difference: diff,
      explanation: `Obtuse triangle: a² + b² = ${sumSquaresLegs} < c² = ${hypotenuseSquare}. The angle opposite to side c is greater than 90°.`,
    };
  }
}

/**
 * Format decimal feet into feet, inches, and nearest 1/16th inch fraction.
 * Example: 17.2047 -> "17' 2-7/16\""
 */
export function formatFeetInches(totalFeet: number): string {
  if (isNaN(totalFeet) || totalFeet < 0) return '0″';

  const feet = Math.floor(totalFeet);
  const remainingInches = (totalFeet - feet) * 12;
  const wholeInches = Math.floor(remainingInches);
  const fractionInches = remainingInches - wholeInches;

  // Round to nearest 1/16
  const sixteenths = Math.round(fractionInches * 16);

  let finalInches = wholeInches;
  let finalSixteenths = sixteenths;
  let finalFeet = feet;

  if (finalSixteenths === 16) {
    finalSixteenths = 0;
    finalInches += 1;
  }
  if (finalInches === 12) {
    finalInches = 0;
    finalFeet += 1;
  }

  // Simplify fraction
  let fractionStr = '';
  if (finalSixteenths > 0) {
    let num = finalSixteenths;
    let den = 16;
    while (num % 2 === 0 && den % 2 === 0) {
      num /= 2;
      den /= 2;
    }
    fractionStr = `${num}/${den}`;
  }

  const parts: string[] = [];
  if (finalFeet > 0) {
    parts.push(`${finalFeet}′`);
  }

  if (fractionStr && finalInches > 0) {
    parts.push(`${finalInches}-${fractionStr}″`);
  } else if (fractionStr) {
    parts.push(`${fractionStr}″`);
  } else if (finalInches > 0 || finalFeet === 0) {
    parts.push(`${finalInches}″`);
  }

  return parts.join(' ');
}

/**
 * Parses user input for feet and inches into decimal feet.
 * Handles: "10' 6 1/2\"", "10 ft 6 in", "10-6", "17.2047", "14"
 */
export function parseFeetInches(input: string): number | null {
  const clean = input.trim();
  if (!clean) return null;

  // If plain decimal number
  if (/^-?\d+(\.\d+)?$/.test(clean)) {
    const val = parseFloat(clean);
    return isNaN(val) ? null : val;
  }

  // Extract feet (e.g. 10' or 10 ft)
  let totalFeet = 0;
  let remaining = clean;

  const ftMatch = remaining.match(/(\d+(?:\.\d+)?)\s*(?:'|ft|feet)/i);
  if (ftMatch) {
    totalFeet += parseFloat(ftMatch[1]);
    remaining = remaining.replace(ftMatch[0], ' ');
  }

  // Strip trailing quote or inches symbols
  remaining = remaining.replace(/(?:"|in|inch|inches)/gi, ' ').trim();

  // Now remaining could be "6 1/2", "6.5", "1/2", or "6"
  let totalInches = 0;
  const parts = remaining.split(/\s+/).filter(Boolean);
  let hasInches = false;

  for (const part of parts) {
    if (part.includes('/')) {
      const [nStr, dStr] = part.split('/');
      const num = parseFloat(nStr);
      const den = parseFloat(dStr);
      if (den > 0) {
        totalInches += num / den;
        hasInches = true;
      }
    } else if (/^\d+(\.\d+)?$/.test(part)) {
      totalInches += parseFloat(part);
      hasInches = true;
    }
  }

  if (ftMatch || hasInches) {
    return totalFeet + totalInches / 12;
  }

  return null;
}

/**
 * Calculates squareness for builders (slabs, decks, framing).
 * Given Length (L) and Width (W), finds diagonal = sqrt(L^2 + W^2).
 * Also recommends a scaled 3-4-5 layout mark along the perimeter.
 */
export function calculateSquareCorner(
  length: number,
  width: number,
  measuredD1?: number,
  measuredD2?: number
): SquareCornerResult {
  if (length <= 0 || width <= 0) {
    throw new Error('Length and width must both be greater than zero.');
  }

  const diagonal = Math.sqrt(length * length + width * width);
  const diagonalFtIn = formatFeetInches(diagonal);

  // Suggested 3-4-5 multiple
  const shorter = Math.min(length, width);
  const longer = Math.max(length, width);
  // Largest whole multiple k so the 3k leg fits the shorter side AND the 4k leg fits the longer side
  // (10 × 10 → 6-8-10, not 9-12-15).
  const multiplier = Math.max(1, Math.floor(Math.min(shorter / 3, longer / 4)));
  const legA = 3 * multiplier;
  const legB = 4 * multiplier;
  const hypotenuse = 5 * multiplier;

  const notes: string[] = [];
  notes.push(`For a rectangle measuring ${length} × ${width}, the square diagonal must be ${diagonal.toFixed(4)} (${diagonalFtIn}).`);
  notes.push(
    `3-4-5 rule layout: mark ${legA} along one side and ${legB} along the perpendicular side. The cross-corner distance between marks should measure exactly ${hypotenuse}.`
  );

  let outOfSquare: number | undefined;
  let isSquare: boolean | undefined;

  if (measuredD1 !== undefined && measuredD2 !== undefined && measuredD1 > 0 && measuredD2 > 0) {
    outOfSquare = Math.abs(measuredD1 - measuredD2);
    // No tolerance standard is applied: "square" here only means the diagonals match to the
    // 1/16 inch shown on screen (1/192 ft). Your plans or trade decide what is close enough.
    isSquare = outOfSquare < 1 / 192;
    notes.push(
      `Measured diagonals: D1 = ${measuredD1}, D2 = ${measuredD2}. The difference is approximately ${outOfSquare.toFixed(4)} (${formatFeetInches(outOfSquare)}).`
    );
    if (isSquare) {
      notes.push('The diagonals match to the nearest 1/16 inch, so the layout is square to that precision.');
    } else {
      notes.push('The diagonals differ, so the layout is approximately out of square. Adjust the corners until both diagonals measure the same; your plans or trade set how close is close enough.');
    }
  }

  return {
    length,
    width,
    diagonal,
    diagonalFtIn,
    suggestedTriple: {
      legA,
      legB,
      hypotenuse,
      multiplier,
      description: `3-4-5 × ${multiplier} (${legA} : ${legB} : ${hypotenuse})`,
    },
    measuredD1,
    measuredD2,
    outOfSquare,
    isSquare,
    notes,
  };
}
