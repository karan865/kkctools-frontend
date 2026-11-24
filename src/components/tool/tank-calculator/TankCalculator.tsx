'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import TankInputGuide from './TankInputGuide';
import {
  calculateTankVolume,
  generateDipstickChart,
  solveTankSize,
  TankShape,
  TankHeadType,
  TankVolumeResult,
  DipstickEntry,
} from '@/lib/tank-engine';
import { parseFeetInches } from '@/lib/right-triangle-engine';
import styles from './TankCalculator.module.css';

type TabMode = 'capacity' | 'dipstick' | 'sizing';

export default function TankCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('capacity');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['capacity', 'dipstick', 'sizing'] as string[]).includes(t)) setActiveTab(t as typeof activeTab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tab 1: Tank Capacity & Fill
  const [shape, setShape] = useState<TankShape>('horizontal-cylinder');
  const [headType, setHeadType] = useState<TankHeadType>('flat');
  const [diameterInput, setDiameterInput] = useState<string>('6'); // ft
  const [lengthInput, setLengthInput] = useState<string>('12'); // ft
  const [heightInput, setHeightInput] = useState<string>('6'); // ft
  const [widthInput, setWidthInput] = useState<string>('4'); // ft
  const [coneHeightInput, setConeHeightInput] = useState<string>('2'); // ft

  const [fillMode, setFillMode] = useState<'depth' | 'ullage'>('depth');
  const [depthInput, setDepthInput] = useState<string>('2'); // ft
  const [densityChoice, setDensityChoice] = useState<string>('8.34'); // lb/gal (water, approximate)
  const [customDensity, setCustomDensity] = useState<string>('');

  // Tab 2: Dipstick Chart
  const [dipstickStep, setDipstickStep] = useState<number>(2); // inches

  // Tab 3: Tank Sizing
  const [targetGallons, setTargetGallons] = useState<string>('500');
  const [sizingDiameter, setSizingDiameter] = useState<string>('4');

  const [copied, setCopied] = useState<boolean>(false);

  // useIds for inputs
  const shapeId = useId();
  const headId = useId();
  const diamId = useId();
  const lenId = useId();
  const heightId = useId();
  const widthId = useId();
  const coneHId = useId();
  const depthId = useId();
  const densityId = useId();
  const stepId = useId();
  const targetGalId = useId();
  const sizingDiamId = useId();

  // Tab 1 Calculation
  const volumeResult = useMemo<{ result?: TankVolumeResult; error?: string }>(() => {
    try {
      const dFt = parseFeetInches(diameterInput) ?? 0;
      const lFt = parseFeetInches(lengthInput) ?? 0;
      const hFt = parseFeetInches(heightInput) ?? 0;
      const wFt = parseFeetInches(widthInput) ?? 0;
      const cHft = parseFeetInches(coneHeightInput) ?? 0;

      const maxD = shape === 'rectangle' ? hFt : shape === 'cone-bottom' ? hFt + cHft : dFt;
      const rawFill = parseFeetInches(depthInput) ?? 0;
      const actualDepth = fillMode === 'ullage' ? Math.max(0, maxD - rawFill) : rawFill;
      const density = parseFloat(densityChoice === 'custom' ? customDensity : densityChoice) || undefined;

      return {
        result: calculateTankVolume(
          {
            shape,
            headType,
            diameter: dFt,
            length: lFt,
            height: hFt,
            width: wFt,
            coneHeight: cHft,
          },
          actualDepth,
          density
        ),
      };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid tank dimensions.' };
    }
  }, [
    shape,
    headType,
    diameterInput,
    lengthInput,
    heightInput,
    widthInput,
    coneHeightInput,
    fillMode,
    depthInput,
    densityChoice,
    customDensity,
  ]);

  // Tab 2 Dipstick Chart
  const dipstickEntries = useMemo<DipstickEntry[]>(() => {
    try {
      const dFt = parseFeetInches(diameterInput) ?? 0;
      const lFt = parseFeetInches(lengthInput) ?? 0;
      const hFt = parseFeetInches(heightInput) ?? 0;
      const wFt = parseFeetInches(widthInput) ?? 0;
      const cHft = parseFeetInches(coneHeightInput) ?? 0;

      return generateDipstickChart(
        {
          shape,
          headType,
          diameter: dFt,
          length: lFt,
          height: hFt,
          width: wFt,
          coneHeight: cHft,
        },
        dipstickStep
      );
    } catch {
      return [];
    }
  }, [shape, headType, diameterInput, lengthInput, heightInput, widthInput, coneHeightInput, dipstickStep]);

  // Tab 3 Sizing Calculation
  const sizingResult = useMemo(() => {
    try {
      const tGal = parseFloat(targetGallons);
      const sDiam = parseFeetInches(sizingDiameter) ?? 0;
      if (isNaN(tGal) || tGal <= 0 || sDiam <= 0) return null;
      return solveTankSize(tGal, sDiam);
    } catch {
      return null;
    }
  }, [targetGallons, sizingDiameter]);

  // Presets
  const applyPreset = (s: TankShape, d: string, l: string, dp: string) => {
    setShape(s);
    setDiameterInput(d);
    setLengthInput(l);
    setDepthInput(dp);
    setFillMode('depth');
  };

  const handleCopySummary = () => {
    let text = '';
    if (activeTab === 'capacity' && volumeResult.result) {
      const r = volumeResult.result;
      text = `Tank Volume Result:\nTotal Capacity: ${r.totalUsGal.toFixed(1)} US gal (${r.totalLiters.toFixed(1)} L, ${r.totalCuFt.toFixed(1)} cu ft)\nFilled Volume: ${r.filledUsGal?.toFixed(1) ?? 'N/A'} US gal (${r.percentFull?.toFixed(1) ?? 0}% full)\nDepth: ${r.depthFt?.toFixed(2) ?? 0} ft (Ullage: ${r.ullageFt?.toFixed(2) ?? 0} ft)\nLiquid Weight: ${r.weightLbs ? `${r.weightLbs.toFixed(1)} lbs` : 'N/A'}`;
    } else if (activeTab === 'sizing' && sizingResult) {
      text = `Tank Sizing Result:\nTarget: ${sizingResult.totalUsGal} gal\nDiameter: ${sizingDiameter} ft\nRequired Length: ${sizingResult.requiredLengthFt.toFixed(2)} ft`;
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyDipstickCSV = () => {
    if (!dipstickEntries.length) return;
    const header = 'Depth (in),Formatted,Gallons,Liters,% Full\n';
    const rows = dipstickEntries
      .map((e) => `${e.depthInches},"${e.depthFormatted}",${e.gallons},${e.liters},${e.percentFull}%`)
      .join('\n');
    navigator.clipboard.writeText(header + rows);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      {/* Navigation Tabs */}
      <TabSlider
        tabs={[{ id: 'capacity', label: 'Capacity & Partial Fill' }, { id: 'dipstick', label: 'Dipstick (Strapping) Chart' }, { id: 'sizing', label: 'Tank Sizing' }]}
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
      <TankInputGuide
        shape={shape}
        headType={headType}
        diameter={diameterInput}
        length={lengthInput}
        depth={depthInput}
        percentFull={volumeResult.result ? `${volumeResult.result.percentFull?.toFixed(1) ?? 0}%` : '29.2%'}
        filledGal={volumeResult.result ? `${volumeResult.result.filledUsGal?.toFixed(1) ?? 0} gal` : '740.6 gal'}
        totalGal={volumeResult.result ? `${volumeResult.result.totalUsGal.toFixed(1)} gal` : '2,538.1 gal'}
        unit="ft"
      />

      {/* Interactive Controls Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {activeTab === 'capacity' && 'Calculate Tank Volume & Liquid Level'}
            {activeTab === 'dipstick' && 'Dipstick Strapping Table (Depth vs Gallons)'}
            {activeTab === 'sizing' && 'Calculate Tank Size from Required Volume'}
          </h2>

          {activeTab === 'capacity' && (
            <div className={styles.presetsRow}>
              <span className={styles.presetLabel}>Presets:</span>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => applyPreset('horizontal-cylinder', '6', '12', '2')}
              >
                6 × 12 ft Horiz (2,538 gal)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => applyPreset('vertical-cylinder', '4', '6', '3')}
              >
                4 × 6 ft Vert (564 gal)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => applyPreset('horizontal-cylinder', '4', '10', '1')}
              >
                4 × 10 ft Horiz (940 gal)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => applyPreset('horizontal-cylinder', '10', '20', '3')}
              >
                10 × 20 ft (25.2% full)
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: CAPACITY & FILL */}
        {activeTab === 'capacity' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={shapeId} className={styles.label}>
                  Tank Geometry Shape
                </label>
                <select
                  id={shapeId}
                  className={styles.select}
                  value={shape}
                  onChange={(e) => setShape(e.target.value as TankShape)}
                >
                  <option value="horizontal-cylinder">Horizontal Cylinder (Round Tank)</option>
                  <option value="vertical-cylinder">Vertical Cylinder (Upright Silo)</option>
                  <option value="rectangle">Rectangular Box / Cistern</option>
                  <option value="cone-bottom">Cone-Bottom Tank (Conical Hopper)</option>
                  <option value="sphere">Spherical Tank (Propane Globe)</option>
                </select>
              </div>

              {shape === 'horizontal-cylinder' && (
                <div className={styles.field}>
                  <label htmlFor={headId} className={styles.label}>
                    Head Type (Tank Ends)
                  </label>
                  <select
                    id={headId}
                    className={styles.select}
                    value={headType}
                    onChange={(e) => setHeadType(e.target.value as TankHeadType)}
                  >
                    <option value="flat">Flat Ends (Standard Cylindrical)</option>
                    <option value="hemispherical">Hemispherical Domes (Full Sphere Ends)</option>
                    <option value="elliptical-2-1">2:1 Semi-Elliptical Heads</option>
                  </select>
                </div>
              )}

              {shape !== 'rectangle' && (
                <div className={styles.field}>
                  <label htmlFor={diamId} className={styles.label}>
                    Tank Diameter
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={diamId}
                      type="text"
                      className={styles.input}
                      value={diameterInput}
                      onChange={(e) => setDiameterInput(e.target.value)}
                      placeholder="e.g. 6 or 6 ft"
                    />
                    <span className={styles.inputUnit}>ft</span>
                  </div>
                </div>
              )}

              {(shape === 'horizontal-cylinder' || shape === 'rectangle') && (
                <div className={styles.field}>
                  <label htmlFor={lenId} className={styles.label}>
                    Tank Length
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={lenId}
                      type="text"
                      className={styles.input}
                      value={lengthInput}
                      onChange={(e) => setLengthInput(e.target.value)}
                      placeholder="e.g. 12 or 12 ft"
                    />
                    <span className={styles.inputUnit}>ft</span>
                  </div>
                </div>
              )}

              {(shape === 'vertical-cylinder' || shape === 'rectangle' || shape === 'cone-bottom') && (
                <div className={styles.field}>
                  <label htmlFor={heightId} className={styles.label}>
                    Cylinder / Wall Height
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={heightId}
                      type="text"
                      className={styles.input}
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      placeholder="e.g. 6 or 10 ft"
                    />
                    <span className={styles.inputUnit}>ft</span>
                  </div>
                </div>
              )}

              {shape === 'rectangle' && (
                <div className={styles.field}>
                  <label htmlFor={widthId} className={styles.label}>
                    Tank Width
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={widthId}
                      type="text"
                      className={styles.input}
                      value={widthInput}
                      onChange={(e) => setWidthInput(e.target.value)}
                      placeholder="e.g. 4 or 4 ft"
                    />
                    <span className={styles.inputUnit}>ft</span>
                  </div>
                </div>
              )}

              {shape === 'cone-bottom' && (
                <div className={styles.field}>
                  <label htmlFor={coneHId} className={styles.label}>
                    Cone Bottom Depth
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id={coneHId}
                      type="text"
                      className={styles.input}
                      value={coneHeightInput}
                      onChange={(e) => setConeHeightInput(e.target.value)}
                      placeholder="e.g. 2 ft"
                    />
                    <span className={styles.inputUnit}>ft</span>
                  </div>
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor={depthId} className={styles.label}>
                  {fillMode === 'depth' ? 'Liquid Depth (from Bottom)' : 'Ullage Air Gap (from Top)'}
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={depthId}
                    type="text"
                    className={styles.input}
                    value={depthInput}
                    onChange={(e) => setDepthInput(e.target.value)}
                    placeholder="e.g. 2 or 24 in"
                  />
                  <select
                    value={fillMode}
                    onChange={(e) => setFillMode(e.target.value as 'depth' | 'ullage')}
                    style={{ border: 'none', background: 'var(--surface-subtle)', fontWeight: 600, padding: '0 0.5rem' }}
                  >
                    <option value="depth">Depth (ft)</option>
                    <option value="ullage">Ullage (ft)</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={densityId} className={styles.label}>
                  Liquid Density (Weight)
                </label>
                <select
                  id={densityId}
                  className={styles.select}
                  value={densityChoice}
                  onChange={(e) => setDensityChoice(e.target.value)}
                >
                  <option value="8.34">Water (approx. 8.34 lb/gal)</option>
                  <option value="custom">Other liquid: enter its density</option>
                </select>
              </div>
              {densityChoice === 'custom' && (
                <div className={styles.field}>
                  <label htmlFor={`${densityId}-custom`} className={styles.label}>
                    Density (lb per US gallon)
                  </label>
                  <input
                    id={`${densityId}-custom`}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={customDensity}
                    onChange={(e) => setCustomDensity(e.target.value)}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    Use the figure from your product&apos;s safety data sheet or supplier.
                  </span>
                </div>
              )}
            </div>

            {volumeResult.error && <div className={styles.errorBox}>{volumeResult.error}</div>}

            {volumeResult.result && (
              <>
                <div className={styles.heroResult}>
                  <div className={styles.heroBadge}>
                    <span>🛢️</span> Tank Volume Solved
                  </div>
                  <div className={styles.heroMainValue}>
                    {volumeResult.result.filledUsGal !== undefined
                      ? `${volumeResult.result.filledUsGal.toFixed(1)} US gal`
                      : `${volumeResult.result.totalUsGal.toFixed(1)} US gal`}
                  </div>
                  <div className={styles.heroSubValue}>
                    {volumeResult.result.percentFull !== undefined
                      ? `${volumeResult.result.percentFull.toFixed(1)}% full · Total Capacity: ${volumeResult.result.totalUsGal.toFixed(1)} gal`
                      : `Total Capacity: ${volumeResult.result.totalUsGal.toFixed(1)} US gallons`}
                  </div>
                  <div className={styles.heroSentence}>
                    A {diameterInput} × {lengthInput || heightInput} ft tank holds about{' '}
                    {volumeResult.result.totalUsGal.toFixed(0)} gallons. At {depthInput} ft of liquid it contains{' '}
                    {volumeResult.result.filledUsGal?.toFixed(1) ?? '0'} gallons (
                    {volumeResult.result.percentFull?.toFixed(1) ?? 0}% full).
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Capacity</div>
                    <div className={styles.metricVal}>{volumeResult.result.totalUsGal.toFixed(1)} gal</div>
                    <div className={styles.metricSub}>{volumeResult.result.totalCuFt.toFixed(1)} cu ft</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Filled Litres</div>
                    <div className={styles.metricVal}>
                      {volumeResult.result.filledLiters?.toFixed(1) ?? volumeResult.result.totalLiters.toFixed(1)} L
                    </div>
                    <div className={styles.metricSub}>{volumeResult.result.totalCuMeters.toFixed(2)} m³ full</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Imperial Gallons</div>
                    <div className={styles.metricVal}>
                      {volumeResult.result.filledImpGal?.toFixed(1) ?? volumeResult.result.totalImpGal.toFixed(1)} gal
                    </div>
                    <div className={styles.metricSub}>UK / Canadian standard</div>
                  </div>
                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Oil Barrels (bbl)</div>
                    <div className={styles.metricVal}>
                      {volumeResult.result.filledBarrels?.toFixed(2) ?? volumeResult.result.totalBarrels.toFixed(2)} bbl
                    </div>
                    <div className={styles.metricSub}>42 US gal per bbl</div>
                  </div>
                  {volumeResult.result.weightLbs && (
                    <div className={styles.metricCard}>
                      <div className={styles.metricLabel}>Liquid Weight</div>
                      <div className={styles.metricVal}>{volumeResult.result.weightLbs.toFixed(0)} lbs</div>
                      <div className={styles.metricSub}>Based on {densityChoice === 'custom' ? customDensity || '—' : densityChoice} lb/gal</div>
                    </div>
                  )}
                  {volumeResult.result.ullageFt !== undefined && (
                    <div className={styles.metricCard}>
                      <div className={styles.metricLabel}>Ullage Air Gap</div>
                      <div className={styles.metricVal}>{volumeResult.result.ullageFt.toFixed(2)} ft</div>
                      <div className={styles.metricSub}>{(volumeResult.result.ullageFt * 12).toFixed(1)} inches to top</div>
                    </div>
                  )}
                </div>

                <div className={styles.stepsCard}>
                  <div className={styles.stepsTitle}>Geometric Calculation Steps</div>
                  <ol className={styles.stepsList}>
                    {volumeResult.result.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: DIPSTICK CHART */}
        {activeTab === 'dipstick' && (
          <div>
            <div className={styles.field} style={{ maxWidth: '300px', marginBottom: '1rem' }}>
              <label htmlFor={stepId} className={styles.label}>
                Dipstick Increment Step
              </label>
              <select
                id={stepId}
                className={styles.select}
                value={dipstickStep}
                onChange={(e) => setDipstickStep(Number(e.target.value))}
              >
                <option value={1}>Every 1 inch (High precision)</option>
                <option value={2}>Every 2 inches (Standard strapping stick)</option>
                <option value={6}>Every 6 inches (Rough gauge)</option>
                <option value={12}>Every 12 inches (1 foot increments)</option>
              </select>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', marginBottom: '1rem' }}>
              Because horizontal cylindrical tanks are curved, each inch near the middle holds significantly more volume
              than each inch near the bottom or top. Print or export this strapping chart to tape beside your tank gauge.
            </p>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Depth (Inches)</th>
                    <th>Depth (Ft &amp; In)</th>
                    <th>Liquid (US Gallons)</th>
                    <th>Liquid (Litres)</th>
                    <th>% Full</th>
                  </tr>
                </thead>
                <tbody>
                  {dipstickEntries.map((entry) => (
                    <tr key={entry.depthInches}>
                      <td><strong>{entry.depthInches}″</strong></td>
                      <td>{entry.depthFormatted}</td>
                      <td>{entry.gallons.toFixed(1)} gal</td>
                      <td>{entry.liters.toFixed(1)} L</td>
                      <td>{entry.percentFull.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.actionsRow}>
              <button type="button" className={styles.actionBtn} onClick={handleCopyDipstickCSV}>
                {copied ? '✓ CSV Copied' : '📊 Copy Strapping Table (CSV)'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TANK SIZING */}
        {activeTab === 'sizing' && (
          <div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={targetGalId} className={styles.label}>
                  Required Storage Capacity
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={targetGalId}
                    type="number"
                    step="10"
                    className={styles.input}
                    value={targetGallons}
                    onChange={(e) => setTargetGallons(e.target.value)}
                    placeholder="e.g. 500"
                  />
                  <span className={styles.inputUnit}>US gal</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={sizingDiamId} className={styles.label}>
                  Available Tank Diameter
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id={sizingDiamId}
                    type="text"
                    className={styles.input}
                    value={sizingDiameter}
                    onChange={(e) => setSizingDiameter(e.target.value)}
                    placeholder="e.g. 4 or 4 ft"
                  />
                  <span className={styles.inputUnit}>ft</span>
                </div>
              </div>
            </div>

            {sizingResult && (
              <div className={styles.heroResult}>
                <div className={styles.heroBadge}>
                  <span>📏</span> Required Tank Dimensions
                </div>
                <div className={styles.heroMainValue}>
                  Length = {sizingResult.requiredLengthFt.toFixed(2)} ft
                </div>
                <div className={styles.heroSubValue}>
                  ({(sizingResult.requiredLengthFt * 12).toFixed(1)} inches) &nbsp;·&nbsp; Total volume ={' '}
                  {sizingResult.totalCuFt.toFixed(1)} cu ft
                </div>
                <div className={styles.heroSentence}>
                  To hold {sizingResult.totalUsGal} US gallons in a cylindrical tank with a {sizingDiameter}-foot diameter,
                  the cylinder barrel must be at least {sizingResult.requiredLengthFt.toFixed(2)} feet long (or tall for an upright silo).
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionsRow}>
          <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
            {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
