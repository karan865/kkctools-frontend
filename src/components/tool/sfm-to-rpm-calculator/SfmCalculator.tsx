'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider, { type TabItem } from '@/components/tool/shared/TabSlider';
import SfmInputGuide from './SfmInputGuide';
import styles from './SfmCalculator.module.css';
import {
  rpmFromSfm,
  sfmFromRpm,
  diaFromSfmRpm,
  rpmFromVc,
  vcFromRpm,
  lineSpeed,
} from '@/lib/machining-engine';

type SfmTab = 'sfmToRpm' | 'rpmToSfm' | 'lineSpeed' | 'rpmChart';
type UnitSystem = 'inch' | 'metric';

const TAB_OPTIONS: TabItem<SfmTab>[] = [
  { id: 'sfmToRpm', label: 'SFM → RPM' },
  { id: 'rpmToSfm', label: 'RPM → SFM' },
  { id: 'lineSpeed', label: 'Belt & Line Speed' },
  { id: 'rpmChart', label: 'RPM Reference Chart' },
];

const STANDARD_INCH_DIAMETERS = [0.125, 0.1875, 0.25, 0.3125, 0.375, 0.5, 0.625, 0.75, 1.0, 1.5, 2.0];
const STANDARD_METRIC_DIAMETERS = [3, 4, 6, 8, 10, 12, 16, 20, 25, 32, 50];
const CHART_SFM_COLUMNS = [100, 200, 300, 400, 600, 800, 1000];
const CHART_METRIC_COLUMNS = [30, 60, 90, 120, 180, 240, 300];

export default function SfmCalculator() {
  const [tab, setTab] = useState<SfmTab>('sfmToRpm');
  const [unit, setUnit] = useState<UnitSystem>('inch');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Sync tab with URL
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['sfmToRpm', 'rpmToSfm', 'lineSpeed', 'rpmChart'].includes(tabParam)) {
        setTab(tabParam as SfmTab);
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleTabChange = (newTabId: SfmTab) => {
    setTab(newTabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTabId);
    window.history.replaceState({}, '', url.toString());
  };

  // State: SFM -> RPM
  const [dia1, setDia1] = useState<number>(0.5); // inch
  const [sfm1, setSfm1] = useState<number>(300); // SFM
  const [maxRpm1, setMaxRpm1] = useState<number | ''>('');

  // State: RPM -> SFM
  const [dia2, setDia2] = useState<number>(1.0); // inch
  const [rpm2, setRpm2] = useState<number>(1000); // RPM

  // State: Line Speed
  const [rollerDia, setRollerDia] = useState<number>(4.0); // inch
  const [rollerRpm, setRollerRpm] = useState<number>(100);
  const [beltThickness, setBeltThickness] = useState<number>(0);
  const [gearRatio, setGearRatio] = useState<number>(1.0);
  const [slipPct, setSlipPct] = useState<number>(0);

  // IDs
  const dia1Id = useId();
  const sfm1Id = useId();
  const maxRpm1Id = useId();

  const dia2Id = useId();
  const rpm2Id = useId();

  const rollerDiaId = useId();
  const rollerRpmId = useId();
  const beltThicknessId = useId();
  const gearRatioId = useId();
  const slipPctId = useId();

  // Calculations
  const calculations = useMemo(() => {
    if (tab === 'sfmToRpm') {
      const diaIn = unit === 'metric' ? dia1 / 25.4 : dia1;
      const sfm = unit === 'metric' ? sfm1 / 0.3048 : sfm1;
      const rpm = rpmFromSfm(sfm, diaIn) ?? 0;
      const vc = sfm * 0.3048;
      const ftPerSec = sfm / 60;
      const mPerSec = vc / 60;
      const isCapped = typeof maxRpm1 === 'number' && maxRpm1 > 0 && rpm > maxRpm1;

      return {
        rpm: Math.round(rpm),
        actualRpm: isCapped ? Number(maxRpm1) : Math.round(rpm),
        sfm,
        vc,
        ftPerSec,
        mPerSec,
        isCapped,
        dia: dia1,
        guideDia: dia1,
        guideSfm: sfm1,
        guideRpm: Math.round(rpm),
      };
    } else if (tab === 'rpmToSfm') {
      const diaIn = unit === 'metric' ? dia2 / 25.4 : dia2;
      const sfm = sfmFromRpm(rpm2, diaIn) ?? 0;
      const vc = sfm * 0.3048;
      const ftPerSec = sfm / 60;
      const mPerSec = vc / 60;

      return {
        rpm: rpm2,
        actualRpm: rpm2,
        sfm,
        vc,
        ftPerSec,
        mPerSec,
        isCapped: false,
        dia: dia2,
        guideDia: dia2,
        guideSfm: unit === 'metric' ? vc : sfm,
        guideRpm: rpm2,
      };
    } else if (tab === 'lineSpeed') {
      const rollerDiaIn = unit === 'metric' ? rollerDia / 25.4 : rollerDia;
      const beltThickIn = unit === 'metric' ? beltThickness / 25.4 : beltThickness;
      const res = lineSpeed(rollerRpm, rollerDiaIn, beltThickIn, slipPct, gearRatio);

      return {
        rpm: rollerRpm,
        actualRpm: rollerRpm,
        sfm: res?.ftPerMin ?? 0,
        vc: res?.mPerMin ?? 0,
        ftPerSec: (res?.ftPerMin ?? 0) / 60,
        mPerSec: res?.mPerSec ?? 0,
        mph: res?.mph ?? 0,
        isCapped: false,
        dia: rollerDia,
        guideDia: rollerDia,
        guideSfm: res?.ftPerMin ?? 0,
        guideRpm: rollerRpm,
      };
    } else {
      // RPM Chart Tab
      return {
        rpm: 0,
        actualRpm: 0,
        sfm: 300,
        vc: 91.4,
        ftPerSec: 5,
        mPerSec: 1.5,
        isCapped: false,
        dia: 0.5,
        guideDia: 0.5,
        guideSfm: 300,
        guideRpm: 2292,
      };
    }
  }, [
    tab,
    unit,
    dia1,
    sfm1,
    maxRpm1,
    dia2,
    rpm2,
    rollerDia,
    rollerRpm,
    beltThickness,
    gearRatio,
    slipPct,
  ]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleExportCsv = () => {
    const isMetric = unit === 'metric';
    const diameters = isMetric ? STANDARD_METRIC_DIAMETERS : STANDARD_INCH_DIAMETERS;
    const speeds = isMetric ? CHART_METRIC_COLUMNS : CHART_SFM_COLUMNS;
    const speedHeader = isMetric ? 'm/min' : 'SFM';

    let csv = `Diameter (${isMetric ? 'mm' : 'in'}),${speeds.map((s) => `${s} ${speedHeader}`).join(',')}\n`;

    diameters.forEach((d) => {
      const row = [d];
      speeds.forEach((s) => {
        const rpm = isMetric ? rpmFromVc(s, d) : rpmFromSfm(s, d);
        row.push(rpm ? Math.round(rpm) : 0);
      });
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rpm-speeds-chart-${isMetric ? 'metric' : 'imperial'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.card}>
      <div className={styles.tabWrapper}>
        <TabSlider
          tabs={TAB_OPTIONS}
          activeId={tab}
          onChange={handleTabChange}
          ariaLabel="SFM and RPM calculation operation mode"
        />
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {tab === 'sfmToRpm' && 'Convert Surface Speed (SFM) to Spindle RPM'}
          {tab === 'rpmToSfm' && 'Convert Spindle RPM to Surface Speed (SFM)'}
          {tab === 'lineSpeed' && 'Conveyor Belt & Roller Line Speed Calculator'}
          {tab === 'rpmChart' && 'Spindle RPM Reference Matrix'}
        </h2>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.unitBtn} ${unit === 'inch' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnit('inch')}
          >
            Inches (Imperial)
          </button>
          <button
            type="button"
            className={`${styles.unitBtn} ${unit === 'metric' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnit('metric')}
          >
            Millimeters (Metric)
          </button>
        </div>
      </div>

      {/* Interactive Input Guide SVG */}
      <SfmInputGuide
        tab={tab}
        unit={unit}
        dia={calculations.guideDia}
        sfmOrVc={Math.round(calculations.guideSfm)}
        rpm={calculations.guideRpm}
        focusedField={focusedField}
      />

      {/* Tab 1: SFM -> RPM */}
      {tab === 'sfmToRpm' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={dia1Id} className={styles.label}>
              1. Tool or Workpiece Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={dia1Id}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.0625'}
              min="0.001"
              value={dia1}
              onChange={(e) => setDia1(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('dia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Milling: tool diameter · Turning/Lathe: workpiece diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={sfm1Id} className={styles.label}>
              2. Surface Speed <span className={styles.labelSub}>({unit === 'metric' ? 'm/min Vc' : 'SFM'})</span>
            </label>
            <input
              id={sfm1Id}
              type="number"
              min="1"
              value={sfm1}
              onChange={(e) => setSfm1(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('sfm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Example: 300 SFM (consult your cutter manufacturer)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={maxRpm1Id} className={styles.label}>
              Spindle Max RPM <span className={styles.labelSub}>(Optional machine limit)</span>
            </label>
            <input
              id={maxRpm1Id}
              type="number"
              min="100"
              placeholder="e.g. 5000 or 24000"
              value={maxRpm1}
              onChange={(e) => setMaxRpm1(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Warns if calculated speed exceeds machine capability</span>
          </div>
        </div>
      )}

      {/* Tab 2: RPM -> SFM */}
      {tab === 'rpmToSfm' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={dia2Id} className={styles.label}>
              1. Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={dia2Id}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.0625'}
              min="0.001"
              value={dia2}
              onChange={(e) => setDia2(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('dia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Outer cutting diameter or rotating cylinder diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={rpm2Id} className={styles.label}>
              2. Spindle Speed <span className={styles.labelSub}>(RPM)</span>
            </label>
            <input
              id={rpm2Id}
              type="number"
              min="1"
              value={rpm2}
              onChange={(e) => setRpm2(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('rpm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Actual tachometer or programmed spindle speed</span>
          </div>
        </div>
      )}

      {/* Tab 3: Line Speed */}
      {tab === 'lineSpeed' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={rollerDiaId} className={styles.label}>
              1. Roller / Pulley Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={rollerDiaId}
              type="number"
              step="0.1"
              min="0.1"
              value={rollerDia}
              onChange={(e) => setRollerDia(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('rollerDia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={rollerRpmId} className={styles.label}>
              2. Roller Shaft Speed <span className={styles.labelSub}>(RPM)</span>
            </label>
            <input
              id={rollerRpmId}
              type="number"
              min="1"
              value={rollerRpm}
              onChange={(e) => setRollerRpm(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('rpm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={beltThicknessId} className={styles.label}>
              Belt Thickness <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'}, optional)</span>
            </label>
            <input
              id={beltThicknessId}
              type="number"
              step="0.01"
              min="0"
              value={beltThickness}
              onChange={(e) => setBeltThickness(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Added to diameter for effective pitch diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={gearRatioId} className={styles.label}>
              Gear Ratio <span className={styles.labelSub}>(Output ÷ Input, default 1.0)</span>
            </label>
            <input
              id={gearRatioId}
              type="number"
              step="0.1"
              min="0.01"
              value={gearRatio}
              onChange={(e) => setGearRatio(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={slipPctId} className={styles.label}>
              Belt Slip Allowance <span className={styles.labelSub}>(%, default 0)</span>
            </label>
            <input
              id={slipPctId}
              type="number"
              step="0.5"
              min="0"
              max="50"
              value={slipPct}
              onChange={(e) => setSlipPct(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
        </div>
      )}

      {/* Tab 4: RPM Chart */}
      {tab === 'rpmChart' && (
        <div>
          <p className={styles.helpText}>
            Below is a dynamic spindle RPM matrix computed using exact π geometry for standard workshop diameters across common cutting speeds.
          </p>
          <div className={styles.chartWrap}>
            <table className={styles.chartTable}>
              <thead>
                <tr>
                  <th>Diameter ({unit === 'metric' ? 'mm' : 'in'})</th>
                  {(unit === 'metric' ? CHART_METRIC_COLUMNS : CHART_SFM_COLUMNS).map((s) => (
                    <th key={s}>
                      {s} {unit === 'metric' ? 'm/min' : 'SFM'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(unit === 'metric' ? STANDARD_METRIC_DIAMETERS : STANDARD_INCH_DIAMETERS).map((d) => (
                  <tr key={d}>
                    <td>
                      <strong>
                        {d}
                        {unit === 'metric' ? ' mm' : '"'}
                      </strong>
                    </td>
                    {(unit === 'metric' ? CHART_METRIC_COLUMNS : CHART_SFM_COLUMNS).map((s) => {
                      const rpm = unit === 'metric' ? rpmFromVc(s, d) : rpmFromSfm(s, d);
                      return <td key={s}>{rpm ? Math.round(rpm).toLocaleString() : '—'}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.chartActions}>
            <button type="button" onClick={handleExportCsv} className={styles.actionBtn}>
              📥 Export CSV
            </button>
            <button type="button" onClick={handlePrint} className={styles.actionBtn}>
              🖨️ Print Matrix
            </button>
          </div>
        </div>
      )}

      {/* Results Banner for Tabs 1, 2, 3 */}
      {tab !== 'rpmChart' && (
        <div className={styles.resultsSection}>
          {calculations.isCapped && (
            <div className={styles.warningCard} role="alert">
              ⚠️ <strong>Machine Speed Exceeded:</strong> Theoretical speed ({calculations.rpm.toLocaleString()} RPM) exceeds machine limit ({maxRpm1} RPM). Capped at {maxRpm1} RPM. Reduce tool diameter or slow down your linear feed to prevent tooth rubbing.
            </div>
          )}

          <div className={styles.resultsGrid}>
            {tab === 'sfmToRpm' && (
              <>
                <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                  <span className={styles.resultLabel}>Spindle Speed</span>
                  <span className={styles.resultValue}>{calculations.actualRpm.toLocaleString()} RPM</span>
                  <span className={styles.resultSub}>Revolutions per minute</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Cutting Velocity (Vc)</span>
                  <span className={styles.resultValue}>{calculations.vc.toFixed(1)} m/min</span>
                  <span className={styles.resultSub}>Metric standard</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Peripheral Speed</span>
                  <span className={styles.resultValue}>{calculations.ftPerSec.toFixed(1)} ft/s</span>
                  <span className={styles.resultSub}>({calculations.mPerSec.toFixed(2)} m/s)</span>
                </div>
              </>
            )}

            {tab === 'rpmToSfm' && (
              <>
                <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                  <span className={styles.resultLabel}>Surface Speed</span>
                  <span className={styles.resultValue}>{calculations.sfm.toFixed(1)} SFM</span>
                  <span className={styles.resultSub}>Surface feet per minute</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Metric Cutting Speed (Vc)</span>
                  <span className={styles.resultValue}>{calculations.vc.toFixed(1)} m/min</span>
                  <span className={styles.resultSub}>Meters per minute</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Tangential Velocity</span>
                  <span className={styles.resultValue}>{calculations.ftPerSec.toFixed(1)} ft/s</span>
                  <span className={styles.resultSub}>({calculations.mPerSec.toFixed(2)} m/s)</span>
                </div>
              </>
            )}

            {tab === 'lineSpeed' && (
              <>
                <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                  <span className={styles.resultLabel}>Belt Line Speed</span>
                  <span className={styles.resultValue}>{calculations.sfm.toFixed(1)} ft/min</span>
                  <span className={styles.resultSub}>Linear travel per minute</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Metric Line Speed</span>
                  <span className={styles.resultValue}>{calculations.vc.toFixed(2)} m/min</span>
                  <span className={styles.resultSub}>({calculations.mPerSec.toFixed(2)} m/s)</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Velocity (mph)</span>
                  <span className={styles.resultValue}>{(calculations as { mph?: number }).mph?.toFixed(2) || '0.00'} mph</span>
                  <span className={styles.resultSub}>Miles per hour</span>
                </div>
              </>
            )}
          </div>

          {/* Dynamic Summary Sentence (Spec §3.5) */}
          <div className={styles.summaryBanner}>
            {tab === 'sfmToRpm' && (
              <>
                At <strong>{sfm1} surface feet per minute</strong>, a <strong>{dia1}&quot;</strong> tool spins at{' '}
                <strong>{calculations.rpm.toLocaleString()} RPM</strong> ({calculations.vc.toFixed(1)} m/min).
              </>
            )}
            {tab === 'rpmToSfm' && (
              <>
                A <strong>{dia2}&quot;</strong> diameter tool rotating at <strong>{rpm2.toLocaleString()} RPM</strong> moves at{' '}
                <strong>{calculations.sfm.toFixed(1)} surface feet per minute</strong> ({calculations.vc.toFixed(1)} m/min).
              </>
            )}
            {tab === 'lineSpeed' && (
              <>
                A <strong>{rollerDia}&quot;</strong> roller turning at <strong>{rollerRpm} RPM</strong> propels the belt at{' '}
                <strong>{calculations.sfm.toFixed(1)} feet per minute</strong> ({calculations.vc.toFixed(2)} m/min).
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
