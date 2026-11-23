'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider, { type TabItem } from '@/components/tool/shared/TabSlider';
import ThreadInputGuide from './ThreadInputGuide';
import styles from './ThreadCalculator.module.css';
import {
  calculateThreadDimensions,
  calculateTapDrill,
  calculateThreeWire,
  convertPitchTpi,
} from '@/lib/thread-engine';

type ThreadTab = 'pitch' | 'tapdrill' | 'threewire' | 'converter';
type ThreadStandard = 'metric' | 'unified' | 'acme' | 'trapezoidal';
type ThreadGender = 'external' | 'internal';

const TAB_OPTIONS: TabItem<ThreadTab>[] = [
  { id: 'pitch', label: 'Pitch Diameter' },
  { id: 'tapdrill', label: 'Tap Drill Size' },
  { id: 'threewire', label: 'Three-Wire Measurement' },
  { id: 'converter', label: 'Pitch ↔ TPI' },
];

export default function ThreadCalculator() {
  const [tab, setTab] = useState<ThreadTab>('pitch');
  const [standard, setStandard] = useState<ThreadStandard>('metric');
  const [gender, setGender] = useState<ThreadGender>('external');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Sync tab with URL
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['pitch', 'tapdrill', 'threewire', 'converter'].includes(tabParam)) {
        setTab(tabParam as ThreadTab);
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleTabChange = (newTabId: ThreadTab) => {
    setTab(newTabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTabId);
    window.history.replaceState({}, '', url.toString());
  };

  // State: Pitch Diameter Tab
  const [metricDia, setMetricDia] = useState<number>(10.0); // M10
  const [metricPitch, setMetricPitch] = useState<number>(1.5); // 1.5 mm

  const [inchDia, setInchDia] = useState<number>(0.25); // 1/4"
  const [inchTpi, setInchTpi] = useState<number>(20); // 20 TPI (1/4-20)

  // State: Tap Drill Tab
  const [tapPercent, setTapPercent] = useState<number>(75);

  // State: Three-Wire Tab
  const [customWireDia, setCustomWireDia] = useState<number | ''>('');
  const [measuredM, setMeasuredM] = useState<number | ''>('');

  // State: Converter Tab
  const [convertInput, setConvertInput] = useState<number>(1.5);
  const [convertMode, setConvertMode] = useState<'pitchMm' | 'tpi'>('pitchMm');

  // IDs
  const standardId = useId();
  const genderId = useId();
  const metricDiaId = useId();
  const metricPitchId = useId();
  const inchDiaId = useId();
  const inchTpiId = useId();
  const tapPercentId = useId();
  const customWireId = useId();
  const measuredMId = useId();
  const convertInputId = useId();
  const convertModeId = useId();

  const isInch = standard === 'unified' || standard === 'acme';
  const unitSuffix = isInch ? 'in' : 'mm';

  // Calculations
  const calculations = useMemo(() => {
    const dia = isInch ? inchDia : metricDia;
    const pitchOrTpi = isInch ? inchTpi : metricPitch;

    const dims = calculateThreadDimensions(dia, pitchOrTpi, isInch, standard);
    // The % thread tap-drill formula and the three-wire constants are for 60° threads only.
    const is60 = standard === 'metric' || standard === 'unified';
    const tap = is60 ? calculateTapDrill(dia, pitchOrTpi, tapPercent, isInch) : null;

    const wire = dims && is60
      ? calculateThreeWire(
          dims.external.pitchDia,
          dims.pitch,
          typeof customWireDia === 'number' ? customWireDia : undefined,
          typeof measuredM === 'number' ? measuredM : undefined
        )
      : null;

    const conv = convertPitchTpi(convertInput, convertMode);

    return {
      is60,
      dims,
      tap,
      wire,
      conv,
      dia,
      pitch: dims?.pitch ?? (isInch ? 1 / inchTpi : metricPitch),
      pitchDia: dims?.external.pitchDia ?? 0,
      minorDia: gender === 'external' ? (dims?.external.minorDiaIso ?? 0) : (dims?.internal.minorDia ?? 0),
    };
  }, [
    standard,
    gender,
    isInch,
    metricDia,
    metricPitch,
    inchDia,
    inchTpi,
    tapPercent,
    customWireDia,
    measuredM,
    convertInput,
    convertMode,
  ]);

  return (
    <div className={styles.card}>
      <div className={styles.tabWrapper}>
        <TabSlider
          tabs={TAB_OPTIONS}
          activeId={tab}
          onChange={handleTabChange}
          ariaLabel="Thread pitch diameter calculation operation mode"
        />
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {tab === 'pitch' && 'Thread Pitch & Minor Diameter Calculator'}
          {tab === 'tapdrill' && 'Tap Drill Size for Target % Thread Engagement'}
          {tab === 'threewire' && 'Three-Wire Pitch Diameter Measurement'}
          {tab === 'converter' && 'Metric Pitch ↔ Threads Per Inch (TPI) Converter'}
        </h2>

        {tab !== 'converter' && (
          <div className={styles.unitToggle}>
            <button
              type="button"
              className={`${styles.unitBtn} ${standard === 'metric' ? styles.unitBtnActive : ''}`}
              onClick={() => setStandard('metric')}
            >
              ISO Metric (60°)
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${standard === 'unified' ? styles.unitBtnActive : ''}`}
              onClick={() => setStandard('unified')}
            >
              Unified Inch (UN/UNC)
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${standard === 'acme' ? styles.unitBtnActive : ''}`}
              onClick={() => setStandard('acme')}
            >
              Acme (29°)
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${standard === 'trapezoidal' ? styles.unitBtnActive : ''}`}
              onClick={() => setStandard('trapezoidal')}
            >
              Trapezoidal (30°)
            </button>
          </div>
        )}
      </div>

      {/* Dynamic SVG Guide Diagram */}
      <ThreadInputGuide
        tab={tab}
        standard={standard}
        nominalDia={calculations.dia}
        pitch={calculations.pitch}
        pitchDia={calculations.pitchDia}
        minorDia={calculations.minorDia}
        unitSuffix={unitSuffix}
        focusedField={focusedField}
      />

      {/* Tab 1, 2, 3 Core Inputs */}
      {tab !== 'converter' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={standardId} className={styles.label}>
              Thread Standard Profile
            </label>
            <select
              id={standardId}
              value={standard}
              onChange={(e) => setStandard(e.target.value as ThreadStandard)}
              className={styles.select}
            >
              <option value="metric">ISO Metric (M-Profile 60°)</option>
              <option value="unified">Unified Inch (UNC / UNF / UNEF 60°)</option>
              <option value="acme">Acme General Purpose (29°)</option>
              <option value="trapezoidal">ISO 2901 Trapezoidal (Tr 30°)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor={genderId} className={styles.label}>
              Thread Geometry Form
            </label>
            <select
              id={genderId}
              value={gender}
              onChange={(e) => setGender(e.target.value as ThreadGender)}
              className={styles.select}
            >
              <option value="external">External Thread (Bolt / Screw / Stud)</option>
              <option value="internal">Internal Thread (Nut / Tapped Hole)</option>
            </select>
          </div>

          {!isInch ? (
            <>
              <div className={styles.field}>
                <label htmlFor={metricDiaId} className={styles.label}>
                  Major Diameter (D) <span className={styles.labelSub}>(mm)</span>
                </label>
                <input
                  id={metricDiaId}
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={metricDia}
                  onChange={(e) => setMetricDia(parseFloat(e.target.value) || 1)}
                  onFocus={() => setFocusedField('d')}
                  onBlur={() => setFocusedField(null)}
                  className={styles.input}
                />
                <span className={styles.helpText}>e.g. 10.0 for M10, 6.0 for M6</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={metricPitchId} className={styles.label}>
                  Thread Pitch (P) <span className={styles.labelSub}>(mm)</span>
                </label>
                <input
                  id={metricPitchId}
                  type="number"
                  step="0.25"
                  min="0.1"
                  value={metricPitch}
                  onChange={(e) => setMetricPitch(parseFloat(e.target.value) || 0.5)}
                  onFocus={() => setFocusedField('pitch')}
                  onBlur={() => setFocusedField(null)}
                  className={styles.input}
                />
                <span className={styles.helpText}>Linear crest-to-crest pitch (e.g. 1.5 mm for M10×1.5)</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.field}>
                <label htmlFor={inchDiaId} className={styles.label}>
                  Major Diameter (D) <span className={styles.labelSub}>(inches)</span>
                </label>
                <input
                  id={inchDiaId}
                  type="number"
                  step="0.0625"
                  min="0.05"
                  value={inchDia}
                  onChange={(e) => setInchDia(parseFloat(e.target.value) || 0.25)}
                  onFocus={() => setFocusedField('d')}
                  onBlur={() => setFocusedField(null)}
                  className={styles.input}
                />
                <span className={styles.helpText}>e.g. 0.25 for 1/4&quot;, 0.50 for 1/2&quot;</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={inchTpiId} className={styles.label}>
                  Threads Per Inch (TPI)
                </label>
                <input
                  id={inchTpiId}
                  type="number"
                  step="1"
                  min="1"
                  value={inchTpi}
                  onChange={(e) => setInchTpi(parseFloat(e.target.value) || 20)}
                  onFocus={() => setFocusedField('pitch')}
                  onBlur={() => setFocusedField(null)}
                  className={styles.input}
                />
                <span className={styles.helpText}>e.g. 20 for 1/4-20 UNC, 28 for 1/4-28 UNF</span>
              </div>
            </>
          )}

          {tab === 'tapdrill' && (
            <div className={styles.field}>
              <label htmlFor={tapPercentId} className={styles.label}>
                Target Thread Engagement (%)
              </label>
              <input
                id={tapPercentId}
                type="number"
                min="50"
                max="90"
                value={tapPercent}
                onChange={(e) => setTapPercent(parseFloat(e.target.value) || 75)}
                className={styles.input}
              />
              <span className={styles.helpText}>Workshop standard is 75% (65%–70% for stainless steel)</span>
            </div>
          )}

          {tab === 'threewire' && (
            <>
              <div className={styles.field}>
                <label htmlFor={customWireId} className={styles.label}>
                  Custom Wire Diameter (W) <span className={styles.labelSub}>({unitSuffix}, optional)</span>
                </label>
                <input
                  id={customWireId}
                  type="number"
                  step="0.001"
                  min="0.01"
                  placeholder={`Best: ${calculations.wire?.bestWireDia.toFixed(3)} ${unitSuffix}`}
                  value={customWireDia}
                  onChange={(e) => setCustomWireDia(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                  className={styles.input}
                />
                <span className={styles.helpText}>Leave blank to use optimal 0.57735 × P wire</span>
              </div>

              <div className={styles.field}>
                <label htmlFor={measuredMId} className={styles.label}>
                  Measured M Over Wires <span className={styles.labelSub}>({unitSuffix}, to reverse-solve d₂)</span>
                </label>
                <input
                  id={measuredMId}
                  type="number"
                  step="0.001"
                  min="0.01"
                  placeholder={`Target: ${calculations.wire?.measurementOverWires.toFixed(3)} ${unitSuffix}`}
                  value={measuredM}
                  onChange={(e) => setMeasuredM(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                  className={styles.input}
                />
                <span className={styles.helpText}>Micrometer reading over three pins</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 4: Pitch <-> TPI Converter Inputs */}
      {tab === 'converter' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={convertModeId} className={styles.label}>
              Convert From
            </label>
            <select
              id={convertModeId}
              value={convertMode}
              onChange={(e) => setConvertMode(e.target.value as 'pitchMm' | 'tpi')}
              className={styles.select}
            >
              <option value="pitchMm">Metric Pitch (mm) → Threads Per Inch (TPI)</option>
              <option value="tpi">Threads Per Inch (TPI) → Metric Pitch (mm)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor={convertInputId} className={styles.label}>
              {convertMode === 'pitchMm' ? 'Metric Pitch (mm)' : 'Threads Per Inch (TPI)'}
            </label>
            <input
              id={convertInputId}
              type="number"
              step={convertMode === 'pitchMm' ? '0.1' : '1'}
              min="0.01"
              value={convertInput}
              onChange={(e) => setConvertInput(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className={styles.resultsSection}>
        {tab === 'converter' ? (
          <div className={styles.resultsGrid}>
            <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
              <span className={styles.resultLabel}>
                {convertMode === 'pitchMm' ? 'Threads Per Inch (TPI)' : 'Metric Pitch'}
              </span>
              <span className={styles.resultValue}>
                {convertMode === 'pitchMm'
                  ? `${calculations.conv?.tpi.toFixed(3)} TPI`
                  : `${calculations.conv?.pitchMm.toFixed(3)} mm`}
              </span>
              <span className={styles.resultSub}>
                {convertMode === 'pitchMm'
                  ? `(Pitch: ${calculations.conv?.pitchIn.toFixed(4)} inches)`
                  : `(${calculations.conv?.pitchIn.toFixed(4)} inches)`}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.resultsGrid}>
              <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                <span className={styles.resultLabel}>Basic Pitch Diameter (d₂)</span>
                <span className={styles.resultValue}>
                  {calculations.pitchDia.toFixed(3)} {unitSuffix}
                </span>
                <span className={styles.resultSub}>Effective pitch circle</span>
              </div>

              <div className={styles.resultCard}>
                <span className={styles.resultLabel}>
                  {gender === 'external' ? 'Minor Diameter (d₃ / ISO root)' : 'Internal Minor Diameter (D₁)'}
                </span>
                <span className={styles.resultValue}>
                  {calculations.minorDia.toFixed(3)} {unitSuffix}
                </span>
                <span className={styles.resultSub}>Crest-to-root clearance</span>
              </div>

              {(tab === 'tapdrill' || tab === 'threewire') && !calculations.is60 && (
                <div className={styles.resultCard} role="note">
                  <span className={styles.resultLabel}>Not for Acme or trapezoidal threads</span>
                  <span className={styles.resultSub}>
                    The % thread tap-drill formula and the three-wire constants here are for 60° threads (Metric and UN).
                    For Acme and trapezoidal threads, use the tap or nut maker&apos;s drill size and a wire chart for that thread angle.
                  </span>
                </div>
              )}

              {tab === 'tapdrill' && calculations.tap && (
                <>
                  <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                    <span className={styles.resultLabel}>Ideal Tap Drill Size</span>
                    <span className={styles.resultValue}>
                      {calculations.tap.idealDrillSize.toFixed(3)} {unitSuffix}
                    </span>
                    <span className={styles.resultSub}>
                      Nearest {calculations.tap.unit === 'inch' ? 'fractional' : 'metric'} drill: {calculations.tap.nearestLabel ?? `${calculations.tap.nearestStandardDrill} ${unitSuffix}`} ({calculations.tap.resultingPercentThread.toFixed(1)}% thread){calculations.tap.unit === 'inch' ? '. Number and letter drills fall between these sizes; check a drill chart.' : ''}
                    </span>
                  </div>
                </>
              )}

              {tab === 'threewire' && calculations.wire && (
                <>
                  <div className={styles.resultCard}>
                    <span className={styles.resultLabel}>Best Wire Diameter</span>
                    <span className={styles.resultValue}>
                      {calculations.wire.bestWireDia.toFixed(3)} {unitSuffix}
                    </span>
                    <span className={styles.resultSub}>0.57735 × Pitch</span>
                  </div>

                  <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                    <span className={styles.resultLabel}>Measurement Over Wires (M)</span>
                    <span className={styles.resultValue}>
                      {calculations.wire.measurementOverWires.toFixed(3)} {unitSuffix}
                    </span>
                    <span className={styles.resultSub}>
                      {typeof measuredM === 'number'
                        ? `Solved d₂: ${calculations.wire.computedPitchDiaFromM.toFixed(3)} ${unitSuffix}`
                        : 'Target micrometer size'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic Summary Sentence (Spec §3.5) */}
            <div className={styles.summaryBanner}>
              {standard === 'metric' && (
                <>
                  An <strong>M{metricDia} × {metricPitch}</strong> thread has a basic pitch diameter of{' '}
                  <strong>{calculations.pitchDia.toFixed(3)} mm</strong> ({metricDia} − 0.6495 × {metricPitch}), with a minor diameter of {calculations.minorDia.toFixed(3)} mm.
                </>
              )}
              {standard === 'unified' && (
                <>
                  A <strong>{inchDia}&quot; - {inchTpi} UNC/UNF</strong> thread has a basic pitch diameter of{' '}
                  <strong>{calculations.pitchDia.toFixed(4)} inches</strong>, with a root minor diameter of {calculations.minorDia.toFixed(4)} inches.
                </>
              )}
              {standard === 'acme' && (
                <>
                  An <strong>Acme 29°</strong> thread at <strong>{calculations.dia} {unitSuffix}</strong> has a pitch diameter of{' '}
                  <strong>{calculations.pitchDia.toFixed(3)} {unitSuffix}</strong> (d − 0.5 × P).
                </>
              )}
              {standard === 'trapezoidal' && (
                <>
                  A <strong>Trapezoidal 30°</strong> thread at <strong>{calculations.dia} {unitSuffix}</strong> has a basic pitch diameter of{' '}
                  <strong>{calculations.pitchDia.toFixed(3)} {unitSuffix}</strong>.
                </>
              )}
            </div>

            {/* Complete Basic Size Dimensions Table */}
            {calculations.dims && (
              <div className={styles.tableWrap}>
                <table className={styles.dimTable}>
                  <thead>
                    <tr>
                      <th>Profile Feature</th>
                      <th>External Thread (Bolt / Screw)</th>
                      <th>Internal Thread (Nut / Tapped Hole)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Major Diameter</td>
                      <td>d = {calculations.dims.external.majorDia.toFixed(3)} {unitSuffix}</td>
                      <td>D = {calculations.dims.internal.majorDia.toFixed(3)} {unitSuffix}</td>
                    </tr>
                    <tr>
                      <td>Pitch Diameter</td>
                      <td>d₂ = <strong>{calculations.dims.external.pitchDia.toFixed(3)} {unitSuffix}</strong></td>
                      <td>D₂ = <strong>{calculations.dims.internal.pitchDia.toFixed(3)} {unitSuffix}</strong></td>
                    </tr>
                    <tr>
                      <td>Minor Diameter</td>
                      <td>
                        d₃ = {calculations.dims.external.minorDiaIso.toFixed(3)} {unitSuffix} (rounded root)
                        <br />
                        d₁ = {calculations.dims.external.minorDiaFlat.toFixed(3)} {unitSuffix} (flat root)
                      </td>
                      <td>D₁ = {calculations.dims.internal.minorDia.toFixed(3)} {unitSuffix}</td>
                    </tr>
                    <tr>
                      <td>Thread Height (H)</td>
                      <td colSpan={2}>{calculations.dims.triangleHeight.toFixed(3)} {unitSuffix} (fundamental triangle)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className={styles.noteBox}>
              📌 <strong>Basic-Size Note:</strong> All calculated values represent basic (zero-tolerance) theoretical engineering sizes. For manufacturing tolerance classes (ASME 2A/2B or ISO 6g/6H) and minimum/maximum allowances, refer to ASME B1.1 or ISO 965.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
