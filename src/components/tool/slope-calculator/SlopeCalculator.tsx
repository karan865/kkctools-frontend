'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import SlopeInputGuide from './SlopeInputGuide';
import {
  calculateSlopeFromRiseRun,
  planAccessibleRamp,
  calculateTwoPointSlope,
  analyzeTableSlope,
  SlopeConversions,
  RampPlannerResult,
  TwoPointSlopeResult,
  TableSlopeResult,
} from '@/lib/slope-engine';
import { parseFeetInches } from '@/lib/right-triangle-engine';
import styles from './SlopeCalculator.module.css';

type TabMode = 'riseRun' | 'presets' | 'twoPoint';

export default function SlopeCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('riseRun');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['riseRun', 'presets', 'twoPoint'] as string[]).includes(t)) setActiveTab(t as typeof activeTab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tab 1: Rise & Run
  const [riseInput, setRiseInput] = useState<string>('1');
  const [runInput, setRunInput] = useState<string>('12');
  const [unit, setUnit] = useState<string>('ft');

  // Tab 2: Ramp & Code Presets
  const [rampRise, setRampRise] = useState<string>('24'); // inches
  const [rampMaxRatio, setRampMaxRatio] = useState<number>(12); // 1:12 ADA

  // Tab 3: Two Points / Table
  const [twoPointMode, setTwoPointMode] = useState<'twoPoints' | 'table'>('twoPoints');
  const [x1, setX1] = useState<string>('1');
  const [y1, setY1] = useState<string>('2');
  const [x2, setX2] = useState<string>('4');
  const [y2, setY2] = useState<string>('11');
  const [tableText, setTableText] = useState<string>('1, 2\n2, 5\n3, 8');

  const [copied, setCopied] = useState<boolean>(false);

  // useId hooks
  const riseId = useId();
  const runId = useId();
  const unitId = useId();

  const rampRiseId = useId();
  const rampRatioId = useId();

  const x1Id = useId();
  const y1Id = useId();
  const x2Id = useId();
  const y2Id = useId();
  const tableTextId = useId();

  // Tab 1 Calculation
  const slopeResult = useMemo<{ result?: SlopeConversions; error?: string }>(() => {
    try {
      const riseNum = parseFeetInches(riseInput);
      const runNum = parseFeetInches(runInput);

      if (riseNum === null || runNum === null) {
        return { error: 'Please enter valid numerical or ft-in measurements for rise and run.' };
      }

      return { result: calculateSlopeFromRiseRun(riseNum, runNum) };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid slope parameters.' };
    }
  }, [riseInput, runInput]);

  // Tab 2 Calculation
  const rampResult = useMemo<{ result?: RampPlannerResult; error?: string }>(() => {
    try {
      const riseInches = parseFloat(rampRise);
      if (isNaN(riseInches) || riseInches <= 0) {
        return { error: 'Please enter a positive total rise in inches.' };
      }
      return { result: planAccessibleRamp(riseInches, rampMaxRatio) };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid ramp parameters.' };
    }
  }, [rampRise, rampMaxRatio]);

  // Tab 3 Calculation
  const twoPointResult = useMemo<{ result?: TwoPointSlopeResult; error?: string }>(() => {
    const pX1 = parseFloat(x1);
    const pY1 = parseFloat(y1);
    const pX2 = parseFloat(x2);
    const pY2 = parseFloat(y2);

    if (isNaN(pX1) || isNaN(pY1) || isNaN(pX2) || isNaN(pY2)) {
      return { error: 'Please enter valid coordinates for both points.' };
    }

    return { result: calculateTwoPointSlope(pX1, pY1, pX2, pY2) };
  }, [x1, y1, x2, y2]);

  const tableResult = useMemo<{ result?: TableSlopeResult; error?: string }>(() => {
    try {
      const lines = tableText.split('\n').filter((l) => l.trim().length > 0);
      const points: Array<{ x: number; y: number }> = [];

      for (const line of lines) {
        const parts = line.split(/[,\s\t]+/).filter(Boolean);
        if (parts.length >= 2) {
          const px = parseFloat(parts[0]);
          const py = parseFloat(parts[1]);
          if (!isNaN(px) && !isNaN(py)) {
            points.push({ x: px, y: py });
          }
        }
      }

      if (points.length < 2) {
        return { error: 'Please enter at least 2 coordinate rows (e.g., x, y).' };
      }

      return { result: analyzeTableSlope(points) };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid table data.' };
    }
  }, [tableText]);

  // Quick Preset Handlers
  const applyPreset = (r: string, rn: string, u = 'ft') => {
    setRiseInput(r);
    setRunInput(rn);
    setUnit(u);
  };

  const handleCopySummary = () => {
    let text = '';
    const uStr = unit ? ` ${unit}` : '';

    if (activeTab === 'riseRun' && slopeResult.result) {
      const s = slopeResult.result;
      text = `Slope / Rise over Run Result:\nRise: ${s.rise}${uStr}, Run: ${s.run}${uStr}\nPercent Grade: ${s.percentGrade.toFixed(2)}%\nAngle: ${s.degrees.toFixed(2)}°\nRatio: ${s.ratio1ToN}\nRoof Pitch: ${s.roofPitchFormatted}\nSlope Length: ${s.slopeLength.toFixed(4)}${uStr}`;
    } else if (activeTab === 'presets' && rampResult.result) {
      const r = rampResult.result;
      text = `Accessible Ramp Layout:\nTotal Rise: ${r.totalRiseInches} in\nMinimum Run: ${r.minRunFeet} ft (${r.minRunInches} in)\nRuns Needed: ${r.runsCount}\nLandings: ${r.landingsCount}\nCitation: ${r.citation}`;
    } else if (activeTab === 'twoPoint' && twoPointMode === 'twoPoints' && twoPointResult.result) {
      const p = twoPointResult.result;
      text = `Two-Point Slope Result:\nPoints: (${p.x1}, ${p.y1}) and (${p.x2}, ${p.y2})\nSlope m: ${p.slope.toFixed(4)}\nEquation: ${p.equation}\nDistance: ${p.distance.toFixed(4)}`;
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
        tabs={[{ id: 'riseRun', label: 'Rise & Run (Any Two)' }, { id: 'presets', label: 'Ramp, Drain & Roof Presets' }, { id: 'twoPoint', label: 'Two Points & Rate of Change' }]}
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
      <SlopeInputGuide
        activeTab={activeTab}
        rise={riseInput}
        run={runInput}
        percentGrade={slopeResult.result ? `${slopeResult.result.percentGrade.toFixed(2)}%` : '8.33%'}
        degrees={slopeResult.result ? `${slopeResult.result.degrees.toFixed(2)}°` : '4.76°'}
        pitch={slopeResult.result ? slopeResult.result.roofPitchFormatted : '1/12'}
        unit={unit}
      />

      {/* Main Interactive Controls */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {activeTab === 'riseRun' && 'Calculate Slope from Rise and Run'}
            {activeTab === 'presets' && 'Construction Grade & Code Compliance'}
            {activeTab === 'twoPoint' && 'Find Slope (m) from Coordinates or Table'}
          </h2>

          {activeTab === 'riseRun' && (
            <div className={styles.presetsRow}>
              <span className={styles.presetLabel}>Quick Presets:</span>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('1', '12')}>
                1:12 Ramp (8.33%)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('4', '12')}>
                4/12 Roof (18.43°)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('0.25', '12', 'in')}>
                ¼″/ft Drain (2.08%)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('0.4', '20')}>
                2% Walkway
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: RISE & RUN */}
        {activeTab === 'riseRun' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={riseId} className={styles.label}>
                  Vertical Rise (Height)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={riseId}
                    type="text"
                    className={styles.input}
                    value={riseInput}
                    onChange={(e) => setRiseInput(e.target.value)}
                    placeholder="e.g. 1 or 2.5 ft"
                  />
                  {unit && <span className={styles.inputUnit}>{unit}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={runId} className={styles.label}>
                  Horizontal Run (Length)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={runId}
                    type="text"
                    className={styles.input}
                    value={runInput}
                    onChange={(e) => setRunInput(e.target.value)}
                    placeholder="e.g. 12 or 20 ft"
                  />
                  {unit && <span className={styles.inputUnit}>{unit}</span>}
                </div>
              </div>

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
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                  <option value="m">Metres (m)</option>
                  <option value="cm">Centimetres (cm)</option>
                  <option value="">Unitless</option>
                </select>
              </div>
            </div>

            {slopeResult.error && <div className={styles.errorBox}>{slopeResult.error}</div>}

            {slopeResult.result && (
              <>
                <div className={styles.heroResult}>
                  <div className={styles.heroBadge}>
                    <span>📐</span> Slope Calculated
                  </div>
                  <div className={styles.heroMainValue}>
                    {slopeResult.result.percentGrade.toFixed(2)}% Grade
                  </div>
                  <div className={styles.heroSubValue}>
                    {slopeResult.result.degrees.toFixed(2)}° Angle &nbsp;·&nbsp; Ratio {slopeResult.result.ratio1ToN} &nbsp;·&nbsp; Pitch {slopeResult.result.roofPitchFormatted}
                  </div>
                  <div className={styles.heroSentence}>
                    A rise of {slopeResult.result.rise} over a run of {slopeResult.result.run} yields a slope of{' '}
                    {slopeResult.result.slope.toFixed(4)}. Note: a 10% slope is an incline of 5.71°, not 10°.
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Percentage Grade</div>
                    <div className={styles.metricVal}>{slopeResult.result.percentGrade.toFixed(2)}%</div>
                    <div className={styles.metricSub}>Rise ÷ Run × 100</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Angle in Degrees</div>
                    <div className={styles.metricVal}>{slopeResult.result.degrees.toFixed(2)}°</div>
                    <div className={styles.metricSub}>arctan(Rise ÷ Run)</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Ratio (1:N)</div>
                    <div className={styles.metricVal}>{slopeResult.result.ratio1ToN}</div>
                    <div className={styles.metricSub}>1 unit rise per N run</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Roof Pitch (x/12)</div>
                    <div className={styles.metricVal}>{slopeResult.result.roofPitchFormatted}</div>
                    <div className={styles.metricSub}>{slopeResult.result.inchesPerFoot.toFixed(2)} in / foot run</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Slope Length (Hypotenuse)</div>
                    <div className={styles.metricVal}>
                      {slopeResult.result.slopeLength.toFixed(3)}
                      {uStr}
                    </div>
                    <div className={styles.metricSub}>√(Rise² + Run²)</div>
                  </div>
                </div>

                <div className={styles.stepsCard}>
                  <div className={styles.stepsTitle}>Step-by-Step Conversion Math</div>
                  <ol className={styles.stepsList}>
                    {slopeResult.result.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: PRESETS */}
        {activeTab === 'presets' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={rampRiseId} className={styles.label}>
                  Ramp Total Vertical Rise
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={rampRiseId}
                    type="number"
                    step="0.5"
                    className={styles.input}
                    value={rampRise}
                    onChange={(e) => setRampRise(e.target.value)}
                    placeholder="e.g. 24"
                  />
                  <span className={styles.inputUnit}>inches</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={rampRatioId} className={styles.label}>
                  Maximum Running Slope Standard
                </label>
                <select
                  id={rampRatioId}
                  className={styles.select}
                  value={rampMaxRatio}
                  onChange={(e) => setRampMaxRatio(Number(e.target.value))}
                >
                  <option value={12}>1:12 (8.33% – 2010 ADA Standards §405.2)</option>
                  <option value={16}>1:16 (6.25% – Gentle accessible slope)</option>
                  <option value={20}>1:20 (5.00% – Ramp threshold / Walkway)</option>
                </select>
              </div>
            </div>

            {rampResult.error && <div className={styles.errorBox}>{rampResult.error}</div>}

            {rampResult.result && (
              <>
                <div className={styles.heroResult}>
                  <div className={styles.heroBadge}>
                    <span>♿</span> Accessible Ramp Plan (ADA Compliant)
                  </div>
                  <div className={styles.heroMainValue}>
                    {rampResult.result.minRunFeet} ft Minimum Run
                  </div>
                  <div className={styles.heroSubValue}>
                    {rampResult.result.minRunInches} inches horizontal ramp length at 1:{rampResult.result.maxSlopeRatio}
                  </div>
                  <div className={styles.heroSentence}>
                    Under 2010 ADA Standards §405.2, an incline of 1:12 requires 1 foot of horizontal run for every 1 inch of rise.
                    Total rise of {rampResult.result.totalRiseInches} in requires {rampResult.result.runsCount} ramp run(s) and{' '}
                    {rampResult.result.landingsCount} intermediate level landing(s).
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Ramp Runs Required</div>
                    <div className={styles.metricVal}>{rampResult.result.runsCount}</div>
                    <div className={styles.metricSub}>Max 30″ rise per run (ADA §405.6)</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Level Landings</div>
                    <div className={styles.metricVal}>{rampResult.result.landingsCount}</div>
                    <div className={styles.metricSub}>Min 60″ length (ADA §405.7)</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Drain fall (example)</div>
                    <div className={styles.metricVal}>¼″ per foot = 2.08%</div>
                    <div className={styles.metricSub}>Check the plumbing code your area has adopted</div>
                  </div>
                </div>

                {rampResult.result.notes.map((note, idx) => (
                  <div key={idx} className={styles.noticeBox}>
                    {note}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 3: TWO POINTS & TABLE */}
        {activeTab === 'twoPoint' && (
          <div className={styles.card}>
            <div className={styles.radioGroup} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--ink)' }}>
                <input
                  type="radio"
                  name="twoPointMode"
                  value="twoPoints"
                  checked={twoPointMode === 'twoPoints'}
                  onChange={() => setTwoPointMode('twoPoints')}
                />
                Two Coordinate Points (x₁, y₁) &amp; (x₂, y₂)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--ink)' }}>
                <input
                  type="radio"
                  name="twoPointMode"
                  value="table"
                  checked={twoPointMode === 'table'}
                  onChange={() => setTwoPointMode('table')}
                />
                Data Table / Rate of Change
              </label>
            </div>

            {twoPointMode === 'twoPoints' && (
              <>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label htmlFor={x1Id} className={styles.label}>
                      Point 1: x₁
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id={x1Id}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={x1}
                        onChange={(e) => setX1(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor={y1Id} className={styles.label}>
                      Point 1: y₁
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id={y1Id}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={y1}
                        onChange={(e) => setY1(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor={x2Id} className={styles.label}>
                      Point 2: x₂
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id={x2Id}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={x2}
                        onChange={(e) => setX2(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor={y2Id} className={styles.label}>
                      Point 2: y₂
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id={y2Id}
                        type="number"
                        step="any"
                        className={styles.input}
                        value={y2}
                        onChange={(e) => setY2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {twoPointResult.error && <div className={styles.errorBox}>{twoPointResult.error}</div>}

                {twoPointResult.result && (
                  <>
                    <div className={styles.heroResult}>
                      <div className={styles.heroBadge}>
                        <span>📈</span> Rate of Change (m = Δy ÷ Δx)
                      </div>
                      <div className={styles.heroMainValue}>
                        Slope m = {twoPointResult.result.isVertical ? 'Undefined' : twoPointResult.result.slope.toFixed(4)}
                      </div>
                      <div className={styles.heroSubValue}>
                        Equation: <strong>{twoPointResult.result.equation}</strong> &nbsp;·&nbsp; Distance ≈{' '}
                        {twoPointResult.result.distance.toFixed(4)}
                      </div>
                      <div className={styles.heroSentence}>
                        Between ({twoPointResult.result.x1}, {twoPointResult.result.y1}) and ({twoPointResult.result.x2},{' '}
                        {twoPointResult.result.y2}), the vertical change Δy is {twoPointResult.result.deltaY} and horizontal change Δx is{' '}
                        {twoPointResult.result.deltaX}.
                      </div>
                    </div>

                    <div className={styles.stepsCard}>
                      <div className={styles.stepsTitle}>Algebraic Derivation</div>
                      <ol className={styles.stepsList}>
                        {twoPointResult.result.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}
              </>
            )}

            {twoPointMode === 'table' && (
              <>
                <div className={styles.field} style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor={tableTextId} className={styles.label}>
                    Coordinate Pairs (x, y per line)
                  </label>
                  <textarea
                    id={tableTextId}
                    rows={5}
                    className={styles.input}
                    style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}
                    value={tableText}
                    onChange={(e) => setTableText(e.target.value)}
                  />
                </div>

                {tableResult.error && <div className={styles.errorBox}>{tableResult.error}</div>}

                {tableResult.result && (
                  <div className={styles.heroResult}>
                    <div className={styles.heroBadge}>
                      <span>📊</span> Table Linearity Analysis
                    </div>
                    <div className={styles.heroMainValue}>
                      {tableResult.result.isLinear ? `Linear (m = ${tableResult.result.averageSlope})` : 'Non-Linear Table'}
                    </div>
                    <div className={styles.heroSubValue}>
                      {tableResult.result.equation || `Average rate of change ≈ ${tableResult.result.averageSlope.toFixed(4)}`}
                    </div>
                    <div className={styles.heroSentence}>{tableResult.result.notes.join(' ')}</div>
                  </div>
                )}
              </>
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
