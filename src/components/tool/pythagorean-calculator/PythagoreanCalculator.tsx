'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import PythagorasInputGuide from './PythagorasInputGuide';
import {
  solveRightTriangleSides,
  solveRightTriangleAngle,
  simplifyRadical,
  classifyTriangle,
  calculateSquareCorner,
  formatFeetInches,
  parseFeetInches,
  RightTriangleResult,
  TriangleClassification,
  SquareCornerResult,
} from '@/lib/right-triangle-engine';
import styles from './PythagoreanCalculator.module.css';

type TabMode = 'findSide' | 'sideAngle' | 'square' | 'check';
type UnknownSide = 'c' | 'a' | 'b';

export default function PythagoreanCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('findSide');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['findSide', 'sideAngle', 'square', 'check'] as string[]).includes(t)) setActiveTab(t as typeof activeTab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tab 1: Find a side
  const [solveTarget, setSolveTarget] = useState<UnknownSide>('c');
  const [sideA, setSideA] = useState<string>('3');
  const [sideB, setSideB] = useState<string>('4');
  const [sideC, setSideC] = useState<string>('5');
  const [unit, setUnit] = useState<string>('');

  // Tab 2: Side + Angle
  const [knownSideName, setKnownSideName] = useState<'a' | 'b' | 'c'>('c');
  const [knownSideVal, setKnownSideVal] = useState<string>('10');
  const [knownAngleName, setKnownAngleName] = useState<'alpha' | 'beta'>('alpha');
  const [knownAngleVal, setKnownAngleVal] = useState<string>('30');

  // Tab 3: Is it Square?
  const [squareLen, setSquareLen] = useState<string>('10');
  const [squareWid, setSquareWid] = useState<string>('14');
  const [squareD1, setSquareD1] = useState<string>('');
  const [squareD2, setSquareD2] = useState<string>('');

  // Tab 4: Check Triangle
  const [checkS1, setCheckS1] = useState<string>('5');
  const [checkS2, setCheckS2] = useState<string>('12');
  const [checkS3, setCheckS3] = useState<string>('13');

  const [copied, setCopied] = useState<boolean>(false);

  // useIds for form inputs
  const sideAId = useId();
  const sideBId = useId();
  const sideCId = useId();
  const unitId = useId();

  const sideModeId = useId();
  const sideValId = useId();
  const angleModeId = useId();
  const angleValId = useId();

  const sqLenId = useId();
  const sqWidId = useId();
  const sqD1Id = useId();
  const sqD2Id = useId();

  const chS1Id = useId();
  const chS2Id = useId();
  const chS3Id = useId();

  // Tab 1 Calculation
  const sideResult = useMemo<{ result?: RightTriangleResult; error?: string }>(() => {
    try {
      const aNum = parseFeetInches(sideA);
      const bNum = parseFeetInches(sideB);
      const cNum = parseFeetInches(sideC);

      if (solveTarget === 'c') {
        if (!aNum || !bNum || aNum <= 0 || bNum <= 0) {
          return { error: 'Please enter positive numbers for legs a and b.' };
        }
        return { result: solveRightTriangleSides(aNum, bNum, null) };
      } else if (solveTarget === 'a') {
        if (!bNum || !cNum || bNum <= 0 || cNum <= 0) {
          return { error: 'Please enter positive numbers for leg b and hypotenuse c.' };
        }
        return { result: solveRightTriangleSides(null, bNum, cNum) };
      } else {
        if (!aNum || !cNum || aNum <= 0 || cNum <= 0) {
          return { error: 'Please enter positive numbers for leg a and hypotenuse c.' };
        }
        return { result: solveRightTriangleSides(aNum, null, cNum) };
      }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid side lengths.' };
    }
  }, [solveTarget, sideA, sideB, sideC]);

  // Tab 2 Calculation
  const angleResult = useMemo<{ result?: RightTriangleResult; error?: string }>(() => {
    try {
      const sideVal = parseFeetInches(knownSideVal);
      const angleVal = parseFloat(knownAngleVal);

      if (!sideVal || sideVal <= 0) {
        return { error: 'Please enter a positive side length.' };
      }
      if (isNaN(angleVal) || angleVal <= 0 || angleVal >= 90) {
        return { error: 'Please enter an acute angle between 0° and 90°.' };
      }

      return {
        result: solveRightTriangleAngle(knownSideName, sideVal, knownAngleName, angleVal),
      };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid side and angle values.' };
    }
  }, [knownSideName, knownSideVal, knownAngleName, knownAngleVal]);

  // Tab 3 Calculation
  const squareResult = useMemo<{ result?: SquareCornerResult; error?: string }>(() => {
    try {
      const l = parseFeetInches(squareLen);
      const w = parseFeetInches(squareWid);

      if (!l || !w || l <= 0 || w <= 0) {
        return { error: 'Please enter positive dimensions for length and width.' };
      }

      const d1 = squareD1 ? parseFeetInches(squareD1) ?? undefined : undefined;
      const d2 = squareD2 ? parseFeetInches(squareD2) ?? undefined : undefined;

      return { result: calculateSquareCorner(l, w, d1, d2) };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid layout dimensions.' };
    }
  }, [squareLen, squareWid, squareD1, squareD2]);

  // Tab 4 Calculation
  const checkResult = useMemo<{ result?: TriangleClassification; error?: string }>(() => {
    const s1 = parseFloat(checkS1);
    const s2 = parseFloat(checkS2);
    const s3 = parseFloat(checkS3);

    if (isNaN(s1) || isNaN(s2) || isNaN(s3) || s1 <= 0 || s2 <= 0 || s3 <= 0) {
      return { error: 'Please enter 3 positive numbers for the side lengths.' };
    }

    return { result: classifyTriangle(s1, s2, s3) };
  }, [checkS1, checkS2, checkS3]);

  // Triple Quick Picks
  const applyTriple = (a: number, b: number, c: number) => {
    setSideA(String(a));
    setSideB(String(b));
    setSideC(String(c));
    setCheckS1(String(a));
    setCheckS2(String(b));
    setCheckS3(String(c));
  };

  const handleCopySummary = () => {
    let text = '';
    const uStr = unit ? ` ${unit}` : '';

    if (activeTab === 'findSide' && sideResult.result) {
      const r = sideResult.result;
      text = `Pythagorean Theorem Result:\nSide a: ${r.a.toFixed(4)}${uStr}\nSide b: ${r.b.toFixed(4)}${uStr}\nHypotenuse c: ${r.c.toFixed(4)}${uStr} (${r.radicalC?.formatted || ''})\nAngles: α = ${r.alphaDeg.toFixed(2)}°, β = ${r.betaDeg.toFixed(2)}°\nArea: ${r.area.toFixed(4)}\nAltitude: ${r.altitude.toFixed(4)}`;
    } else if (activeTab === 'sideAngle' && angleResult.result) {
      const r = angleResult.result;
      text = `Right Triangle Result:\nSide a: ${r.a.toFixed(4)}${uStr}\nSide b: ${r.b.toFixed(4)}${uStr}\nHypotenuse c: ${r.c.toFixed(4)}${uStr}\nAngles: α = ${r.alphaDeg.toFixed(2)}°, β = ${r.betaDeg.toFixed(2)}°\nArea: ${r.area.toFixed(4)}`;
    } else if (activeTab === 'square' && squareResult.result) {
      const r = squareResult.result;
      text = `Builder Square Check:\nDimensions: ${r.length} × ${r.width}\nRequired Diagonal: ${r.diagonal.toFixed(4)} (${r.diagonalFtIn})\n3-4-5 Layout: ${r.suggestedTriple.description}`;
    } else if (activeTab === 'check' && checkResult.result) {
      const r = checkResult.result;
      text = `Triangle Classification: ${r.type.toUpperCase()}\nSides: ${r.a}, ${r.b}, ${r.c}\na² + b² = ${r.sumSquaresLegs}, c² = ${r.hypotenuseSquare}\n${r.explanation}`;
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const uStr = unit ? ` ${unit}` : '';

  return (
    <div className={styles.container}>
      {/* Navigation Tabs */}
      <TabSlider
        tabs={[{ id: 'findSide', label: 'Find a Side (a² + b² = c²)' }, { id: 'sideAngle', label: 'Side + Angle' }, { id: 'square', label: 'Is It Square? (3-4-5)' }, { id: 'check', label: 'Check a Triangle' }]}
        activeId={activeTab}
        onChange={(id) => {
          setActiveTab(id as typeof activeTab);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="Calculator modes"
      />

      {/* Input Guide Diagram */}
      <PythagorasInputGuide
        activeTab={activeTab}
        unknownSide={solveTarget}
        valA={activeTab === 'findSide' ? sideA : undefined}
        valB={activeTab === 'findSide' ? sideB : undefined}
        valC={activeTab === 'findSide' ? sideC : undefined}
        unit={unit}
      />

      {/* Main Interactive Controls */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {activeTab === 'findSide' && 'Solve for Any Missing Side'}
            {activeTab === 'sideAngle' && 'Solve from One Side & One Angle'}
            {activeTab === 'square' && 'Check Squareness of Slab, Deck, or Wall'}
            {activeTab === 'check' && 'Check if Triangle is Right, Acute, or Obtuse'}
          </h2>

          {(activeTab === 'findSide' || activeTab === 'check') && (
            <div className={styles.presetsRow}>
              <span className={styles.presetLabel}>Triples:</span>
              <button type="button" className={styles.presetBtn} onClick={() => applyTriple(3, 4, 5)}>
                3-4-5
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyTriple(5, 12, 13)}>
                5-12-13
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyTriple(8, 15, 17)}>
                8-15-17
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyTriple(7, 24, 25)}>
                7-24-25
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: FIND A SIDE */}
        {activeTab === 'findSide' && (
          <div>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="solveTarget"
                  value="c"
                  checked={solveTarget === 'c'}
                  onChange={() => setSolveTarget('c')}
                />
                Find Hypotenuse (c)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="solveTarget"
                  value="a"
                  checked={solveTarget === 'a'}
                  onChange={() => setSolveTarget('a')}
                />
                Find Leg (a)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="solveTarget"
                  value="b"
                  checked={solveTarget === 'b'}
                  onChange={() => setSolveTarget('b')}
                />
                Find Leg (b)
              </label>
            </div>

            <div className={styles.grid}>
              {solveTarget !== 'a' && (
                <div className={styles.field}>
                  <label htmlFor={sideAId} className={styles.label}>
                    Leg a (Height)
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={sideAId}
                      type="text"
                      className={styles.input}
                      value={sideA}
                      onChange={(e) => setSideA(e.target.value)}
                      placeholder={"e.g. 3 or 10' 6\""}
                    />
                    {unit && <span className={styles.inputUnit}>{unit}</span>}
                  </div>
                </div>
              )}

              {solveTarget !== 'b' && (
                <div className={styles.field}>
                  <label htmlFor={sideBId} className={styles.label}>
                    Leg b (Base)
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={sideBId}
                      type="text"
                      className={styles.input}
                      value={sideB}
                      onChange={(e) => setSideB(e.target.value)}
                      placeholder="e.g. 4 or 12 ft"
                    />
                    {unit && <span className={styles.inputUnit}>{unit}</span>}
                  </div>
                </div>
              )}

              {solveTarget !== 'c' && (
                <div className={styles.field}>
                  <label htmlFor={sideCId} className={styles.label}>
                    Hypotenuse c (Longest side)
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={sideCId}
                      type="text"
                      className={styles.input}
                      value={sideC}
                      onChange={(e) => setSideC(e.target.value)}
                      placeholder="e.g. 5 or 20 ft"
                    />
                    {unit && <span className={styles.inputUnit}>{unit}</span>}
                  </div>
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor={unitId} className={styles.label}>
                  Measurement Unit
                </label>
                <select
                  id={unitId}
                  className={styles.select}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="">No unit (unitless math)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                  <option value="yd">Yards (yd)</option>
                  <option value="m">Metres (m)</option>
                  <option value="cm">Centimetres (cm)</option>
                  <option value="mm">Millimetres (mm)</option>
                </select>
              </div>
            </div>

            {sideResult.error && <div className={styles.errorBox}>{sideResult.error}</div>}

            {sideResult.result && (
              <>
                <div className={styles.heroResult}>
                  <div className={styles.heroBadge}>
                    <span>📐</span> Pythagorean Theorem Solved
                  </div>
                  <div className={styles.heroMainValue}>
                    {solveTarget === 'c' && `c = ${sideResult.result.c.toFixed(4)}${uStr}`}
                    {solveTarget === 'a' && `a = ${sideResult.result.a.toFixed(4)}${uStr}`}
                    {solveTarget === 'b' && `b = ${sideResult.result.b.toFixed(4)}${uStr}`}
                  </div>
                  <div className={styles.heroSubValue}>
                    Exact radical:{' '}
                    <strong>
                      {solveTarget === 'c'
                        ? sideResult.result.radicalC?.formatted
                        : simplifyRadical(
                            solveTarget === 'a'
                              ? sideResult.result.a * sideResult.result.a
                              : sideResult.result.b * sideResult.result.b
                          ).formatted}
                    </strong>
                    {unit === 'ft' && ` · ${formatFeetInches(sideResult.result.c)}`}
                  </div>
                  <div className={styles.heroSentence}>
                    With legs of {sideResult.result.a.toFixed(2)} and {sideResult.result.b.toFixed(2)}, the hypotenuse is{' '}
                    {sideResult.result.c.toFixed(2)}. The interior acute angles are {sideResult.result.alphaDeg.toFixed(2)}° and{' '}
                    {sideResult.result.betaDeg.toFixed(2)}°.
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Angle α (opposite leg a)</div>
                    <div className={styles.metricVal}>{sideResult.result.alphaDeg.toFixed(2)}°</div>
                    <div className={styles.metricSub}>arctan(a / b)</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Angle β (opposite leg b)</div>
                    <div className={styles.metricVal}>{sideResult.result.betaDeg.toFixed(2)}°</div>
                    <div className={styles.metricSub}>90° − α</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Triangle Area</div>
                    <div className={styles.metricVal}>
                      {sideResult.result.area.toFixed(2)}
                      {unit ? ` ${unit}²` : ''}
                    </div>
                    <div className={styles.metricSub}>½ × base × height</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Perimeter</div>
                    <div className={styles.metricVal}>
                      {sideResult.result.perimeter.toFixed(2)}
                      {uStr}
                    </div>
                    <div className={styles.metricSub}>a + b + c</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Altitude (h to hypotenuse)</div>
                    <div className={styles.metricVal}>
                      {sideResult.result.altitude.toFixed(2)}
                      {uStr}
                    </div>
                    <div className={styles.metricSub}>(a × b) ÷ c</div>
                  </div>
                </div>

                <div className={styles.stepsCard}>
                  <div className={styles.stepsTitle}>Step-by-Step Calculation</div>
                  <ol className={styles.stepsList}>
                    {sideResult.result.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: SIDE + ANGLE */}
        {activeTab === 'sideAngle' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={sideModeId} className={styles.label}>
                  Known Side
                </label>
                <select
                  id={sideModeId}
                  className={styles.select}
                  value={knownSideName}
                  onChange={(e) => setKnownSideName(e.target.value as 'a' | 'b' | 'c')}
                >
                  <option value="c">Hypotenuse c (Longest side)</option>
                  <option value="a">Leg a (Height)</option>
                  <option value="b">Leg b (Base)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor={sideValId} className={styles.label}>
                  Side Length Value
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={sideValId}
                    type="text"
                    className={styles.input}
                    value={knownSideVal}
                    onChange={(e) => setKnownSideVal(e.target.value)}
                    placeholder="e.g. 10"
                  />
                  {unit && <span className={styles.inputUnit}>{unit}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={angleModeId} className={styles.label}>
                  Known Acute Angle
                </label>
                <select
                  id={angleModeId}
                  className={styles.select}
                  value={knownAngleName}
                  onChange={(e) => setKnownAngleName(e.target.value as 'alpha' | 'beta')}
                >
                  <option value="alpha">Angle α (opposite leg a)</option>
                  <option value="beta">Angle β (opposite leg b)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor={angleValId} className={styles.label}>
                  Angle in Degrees (0° to 90°)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={angleValId}
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="89.9"
                    className={styles.input}
                    value={knownAngleVal}
                    onChange={(e) => setKnownAngleVal(e.target.value)}
                    placeholder="e.g. 30"
                  />
                  <span className={styles.inputUnit}>deg (°)</span>
                </div>
              </div>
            </div>

            {angleResult.error && <div className={styles.errorBox}>{angleResult.error}</div>}

            {angleResult.result && (
              <>
                <div className={styles.heroResult}>
                  <div className={styles.heroBadge}>
                    <span>📐</span> Right Triangle Trigonometry Solved
                  </div>
                  <div className={styles.heroMainValue}>
                    c = {angleResult.result.c.toFixed(4)}
                    {uStr}
                  </div>
                  <div className={styles.heroSubValue}>
                    Leg a = {angleResult.result.a.toFixed(4)}
                    {uStr} &nbsp;·&nbsp; Leg b = {angleResult.result.b.toFixed(4)}
                    {uStr}
                  </div>
                  <div className={styles.heroSentence}>
                    With known side {knownSideName} = {knownSideVal} and {knownAngleName} = {knownAngleVal}°, the missing acute angle is{' '}
                    {(90 - parseFloat(knownAngleVal)).toFixed(2)}°.
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Leg a (Height)</div>
                    <div className={styles.metricVal}>
                      {angleResult.result.a.toFixed(4)}
                      {uStr}
                    </div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Leg b (Base)</div>
                    <div className={styles.metricVal}>
                      {angleResult.result.b.toFixed(4)}
                      {uStr}
                    </div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Hypotenuse c</div>
                    <div className={styles.metricVal}>
                      {angleResult.result.c.toFixed(4)}
                      {uStr}
                    </div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Area</div>
                    <div className={styles.metricVal}>
                      {angleResult.result.area.toFixed(2)}
                      {unit ? ` ${unit}²` : ''}
                    </div>
                  </div>
                </div>

                <div className={styles.stepsCard}>
                  <div className={styles.stepsTitle}>Step-by-Step Derivation</div>
                  <ol className={styles.stepsList}>
                    {angleResult.result.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: IS IT SQUARE? */}
        {activeTab === 'square' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={sqLenId} className={styles.label}>
                  Layout Length (L)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={sqLenId}
                    type="text"
                    className={styles.input}
                    value={squareLen}
                    onChange={(e) => setSquareLen(e.target.value)}
                    placeholder="e.g. 10 or 12 ft"
                  />
                  <span className={styles.inputUnit}>ft</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={sqWidId} className={styles.label}>
                  Layout Width (W)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={sqWidId}
                    type="text"
                    className={styles.input}
                    value={squareWid}
                    onChange={(e) => setSquareWid(e.target.value)}
                    placeholder="e.g. 14 or 16 ft"
                  />
                  <span className={styles.inputUnit}>ft</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={sqD1Id} className={styles.label}>
                  Measured Diagonal 1 (Optional)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={sqD1Id}
                    type="text"
                    className={styles.input}
                    value={squareD1}
                    onChange={(e) => setSquareD1(e.target.value)}
                    placeholder={"e.g. 17.2 or 17' 2\""}
                  />
                  <span className={styles.inputUnit}>ft</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={sqD2Id} className={styles.label}>
                  Measured Diagonal 2 (Optional)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={sqD2Id}
                    type="text"
                    className={styles.input}
                    value={squareD2}
                    onChange={(e) => setSquareD2(e.target.value)}
                    placeholder={"e.g. 17.2 or 17' 2\""}
                  />
                  <span className={styles.inputUnit}>ft</span>
                </div>
              </div>
            </div>

            {squareResult.error && <div className={styles.errorBox}>{squareResult.error}</div>}

            {squareResult.result && (
              <>
                <div className={styles.heroResult}>
                  <div className={styles.heroBadge}>
                    <span>📐</span> Builder&apos;s Squaring Check
                  </div>
                  <div className={styles.heroMainValue}>
                    {squareResult.result.diagonalFtIn}
                  </div>
                  <div className={styles.heroSubValue}>
                    Exact diagonal = {squareResult.result.diagonal.toFixed(4)} ft (√(
                    {squareResult.result.length}² + {squareResult.result.width}²))
                  </div>
                  <div className={styles.heroSentence}>
                    For a rectangular slab or deck measuring {squareResult.result.length} × {squareResult.result.width} ft,
                    both cross-corner diagonals must equal exactly {squareResult.result.diagonalFtIn} for the corners to be 90° square.
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Suggested 3-4-5 Triangle</div>
                    <div className={styles.metricVal}>
                      {squareResult.result.suggestedTriple.legA} : {squareResult.result.suggestedTriple.legB} :{' '}
                      {squareResult.result.suggestedTriple.hypotenuse} ft
                    </div>
                    <div className={styles.metricSub}>Multiplier: {squareResult.result.suggestedTriple.multiplier}×</div>
                  </div>

                  {squareResult.result.outOfSquare !== undefined && (
                    <div className={styles.metricCard}>
                      <div className={styles.metricLabel}>Out-of-Square Difference</div>
                      <div className={styles.metricVal}>
                        {formatFeetInches(squareResult.result.outOfSquare)}
                      </div>
                      <div className={styles.metricSub}>|D1 − D2| = {squareResult.result.outOfSquare.toFixed(4)} ft</div>
                    </div>
                  )}
                </div>

                {squareResult.result.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className={
                      note.includes('out of square')
                        ? styles.squareWarning
                        : styles.squareNote
                    }
                  >
                    {note}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 4: CHECK A TRIANGLE */}
        {activeTab === 'check' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={chS1Id} className={styles.label}>
                  Side 1
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={chS1Id}
                    type="number"
                    step="any"
                    className={styles.input}
                    value={checkS1}
                    onChange={(e) => setCheckS1(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={chS2Id} className={styles.label}>
                  Side 2
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={chS2Id}
                    type="number"
                    step="any"
                    className={styles.input}
                    value={checkS2}
                    onChange={(e) => setCheckS2(e.target.value)}
                    placeholder="e.g. 12"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={chS3Id} className={styles.label}>
                  Side 3
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={chS3Id}
                    type="number"
                    step="any"
                    className={styles.input}
                    value={checkS3}
                    onChange={(e) => setCheckS3(e.target.value)}
                    placeholder="e.g. 13"
                  />
                </div>
              </div>
            </div>

            {checkResult.error && <div className={styles.errorBox}>{checkResult.error}</div>}

            {checkResult.result && (
              <div className={styles.heroResult}>
                <div className={styles.heroBadge}>
                  <span>🔍</span> Triangle Classification
                </div>
                <div className={styles.heroMainValue}>
                  {checkResult.result.type === 'right' && 'Right Triangle (90°)'}
                  {checkResult.result.type === 'acute' && 'Acute Triangle (< 90°)'}
                  {checkResult.result.type === 'obtuse' && 'Obtuse Triangle (> 90°)'}
                  {checkResult.result.type === 'invalid' && 'Invalid Triangle'}
                </div>
                <div className={styles.heroSubValue}>
                  a² + b² = {checkResult.result.sumSquaresLegs} &nbsp;|&nbsp; c² = {checkResult.result.hypotenuseSquare}
                </div>
                <div className={styles.heroSentence}>{checkResult.result.explanation}</div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionsRow}>
          <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
            {copied ? '✓ Copied to Clipboard' : '📋 Copy Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
