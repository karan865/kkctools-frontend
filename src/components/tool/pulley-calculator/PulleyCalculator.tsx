'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider, { type TabItem } from '@/components/tool/shared/TabSlider';
import PulleyInputGuide from './PulleyInputGuide';
import styles from './PulleyCalculator.module.css';
import {
  solvePulley,
  calculateBeltLength,
  centreDistancefromBeltLength,
  calculateMultiStage,
  wheelRpmToSpeed,
} from '@/lib/pulley-engine';

type PulleyTab = 'pulley' | 'belt' | 'multistage' | 'wheel';
type UnitSystem = 'inch' | 'metric';
type SolveForTarget = 'drivenRpm' | 'driverRpm' | 'drivenDia' | 'driverDia';

const TAB_OPTIONS: TabItem<PulleyTab>[] = [
  { id: 'pulley', label: 'Pulley Speed & Size' },
  { id: 'belt', label: 'Belt Length & Centre' },
  { id: 'multistage', label: 'Multi-Stage Drives' },
  { id: 'wheel', label: 'Wheel RPM ↔ Speed' },
];

export default function PulleyCalculator() {
  const [tab, setTab] = useState<PulleyTab>('pulley');
  const [unit, setUnit] = useState<UnitSystem>('inch');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Sync tab with URL
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['pulley', 'belt', 'multistage', 'wheel'].includes(tabParam)) {
        setTab(tabParam as PulleyTab);
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleTabChange = (newTabId: PulleyTab) => {
    setTab(newTabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTabId);
    window.history.replaceState({}, '', url.toString());
  };

  // State: Tab 1 (Pulley Speed & Size)
  const [solveFor, setSolveFor] = useState<SolveForTarget>('drivenRpm');
  const [d1, setD1] = useState<number>(2.0); // Driver Dia (in)
  const [d2, setD2] = useState<number>(4.0); // Driven Dia (in)
  const [n1, setN1] = useState<number>(1725); // Driver RPM
  const [n2, setN2] = useState<number>(862.5); // Driven RPM
  const [slipPct, setSlipPct] = useState<number>(0);
  const [centreDist1, setCentreDist1] = useState<number>(20.0);

  // State: Tab 2 (Belt Length & Centre Distance)
  const [beltD1, setBeltD1] = useState<number>(2.0);
  const [beltD2, setBeltD2] = useState<number>(4.0);
  const [beltCentre, setBeltCentre] = useState<number>(20.0);
  const [stockBeltLength, setStockBeltLength] = useState<number | ''>('');

  // State: Tab 3 (Multi-Stage)
  const [stageCount, setStageCount] = useState<number>(2);
  const [motorRpm, setMotorRpm] = useState<number>(1725);
  const [stage1Driver, setStage1Driver] = useState<number>(2.0);
  const [stage1Driven, setStage1Driven] = useState<number>(4.0);
  const [stage2Driver, setStage2Driver] = useState<number>(3.0);
  const [stage2Driven, setStage2Driven] = useState<number>(6.0);
  const [stage3Driver, setStage3Driver] = useState<number>(2.5);
  const [stage3Driven, setStage3Driven] = useState<number>(5.0);

  // State: Tab 4 (Wheel RPM <-> Speed)
  const [wheelDia, setWheelDia] = useState<number>(26.0); // 26" tire
  const [wheelRpm, setWheelRpm] = useState<number>(200);

  // IDs
  const solveForId = useId();
  const d1Id = useId();
  const d2Id = useId();
  const n1Id = useId();
  const n2Id = useId();
  const slipPctId = useId();
  const centreDist1Id = useId();

  const beltD1Id = useId();
  const beltD2Id = useId();
  const beltCentreId = useId();
  const stockBeltLengthId = useId();

  const stageCountId = useId();
  const motorRpmId = useId();
  const s1DriverId = useId();
  const s1DrivenId = useId();
  const s2DriverId = useId();
  const s2DrivenId = useId();
  const s3DriverId = useId();
  const s3DrivenId = useId();

  const wheelDiaId = useId();
  const wheelRpmId = useId();

  // Calculations
  const calculations = useMemo(() => {
    if (tab === 'pulley') {
      const d1In = unit === 'metric' ? d1 / 25.4 : d1;
      const d2In = unit === 'metric' ? d2 / 25.4 : d2;
      const cIn = unit === 'metric' ? centreDist1 / 25.4 : centreDist1;

      const solved = solvePulley(d1In, d2In, n1, n2, solveFor, slipPct);
      const beltGeo = solved ? calculateBeltLength(solved.driverDia, solved.drivenDia, cIn) : null;

      return {
        driverDia: solved ? (unit === 'metric' ? solved.driverDia * 25.4 : solved.driverDia) : d1,
        drivenDia: solved ? (unit === 'metric' ? solved.drivenDia * 25.4 : solved.drivenDia) : d2,
        driverRpm: solved?.driverRpm ?? n1,
        drivenRpm: solved?.drivenRpm ?? n2,
        speedRatio: solved?.speedRatio ?? 1,
        diameterRatio: solved?.diameterRatio ?? 1,
        isReduction: solved?.isReduction ?? false,
        beltSpeedFtMin: solved?.beltSpeedFtPerMin ?? 0,
        beltSpeedMPerMin: solved?.beltSpeedMPerMin ?? 0,
        centreDistance: centreDist1,
        openBeltLength: beltGeo ? (unit === 'metric' ? beltGeo.openLength * 25.4 : beltGeo.openLength) : 0,
        driverWrapDeg: beltGeo?.driverWrapDeg ?? 180,
        drivenWrapDeg: beltGeo?.drivenWrapDeg ?? 180,
        isLowWrap: beltGeo?.isLowWrapWarning ?? false,
      };
    } else if (tab === 'belt') {
      const d1In = unit === 'metric' ? beltD1 / 25.4 : beltD1;
      const d2In = unit === 'metric' ? beltD2 / 25.4 : beltD2;
      const cIn = unit === 'metric' ? beltCentre / 25.4 : beltCentre;

      const geo = calculateBeltLength(d1In, d2In, cIn);

      // Solve reverse centre if stock belt provided
      let solvedCentre: number | null = null;
      if (typeof stockBeltLength === 'number' && stockBeltLength > 0) {
        const stockLIn = unit === 'metric' ? stockBeltLength / 25.4 : stockBeltLength;
        const revC = centreDistancefromBeltLength(d1In, d2In, stockLIn);
        if (revC) solvedCentre = unit === 'metric' ? revC * 25.4 : revC;
      }

      return {
        driverDia: beltD1,
        drivenDia: beltD2,
        driverRpm: 1725,
        drivenRpm: beltD2 > 0 ? (1725 * beltD1) / beltD2 : 862.5,
        speedRatio: beltD2 > 0 ? beltD1 / beltD2 : 0.5,
        diameterRatio: beltD1 > 0 ? beltD2 / beltD1 : 2,
        isReduction: beltD2 > beltD1,
        beltSpeedFtMin: (Math.PI * d1In * 1725) / 12,
        beltSpeedMPerMin: ((Math.PI * d1In * 1725) / 12) * 0.3048,
        centreDistance: beltCentre,
        openBeltLength: geo ? (unit === 'metric' ? geo.openLength * 25.4 : geo.openLength) : 0,
        crossedBeltLength: geo ? (unit === 'metric' ? geo.crossedLength * 25.4 : geo.crossedLength) : 0,
        driverWrapDeg: geo?.driverWrapDeg ?? 180,
        drivenWrapDeg: geo?.drivenWrapDeg ?? 180,
        isLowWrap: geo?.isLowWrapWarning ?? false,
        solvedCentre,
      };
    } else if (tab === 'multistage') {
      const stages = [
        { driverDia: stage1Driver, drivenDia: stage1Driven },
        { driverDia: stage2Driver, drivenDia: stage2Driven },
      ];
      if (stageCount === 3) {
        stages.push({ driverDia: stage3Driver, drivenDia: stage3Driven });
      }

      const res = calculateMultiStage(motorRpm, stages);
      return {
        driverDia: stage1Driver,
        drivenDia: stage1Driven,
        driverRpm: motorRpm,
        drivenRpm: res?.finalRpm ?? 0,
        speedRatio: res?.totalRatio ? 1 / res.totalRatio : 1,
        diameterRatio: res?.totalRatio ?? 1,
        isReduction: (res?.totalRatio ?? 1) > 1,
        beltSpeedFtMin: (Math.PI * (unit === 'metric' ? stage1Driver / 25.4 : stage1Driver) * motorRpm) / 12,
        beltSpeedMPerMin: 0,
        centreDistance: 20,
        openBeltLength: 0,
        driverWrapDeg: 180,
        drivenWrapDeg: 180,
        isLowWrap: false,
        stageResults: res,
      };
    } else {
      // Wheel speed
      const diaIn = unit === 'metric' ? wheelDia / 25.4 : wheelDia;
      const res = wheelRpmToSpeed(diaIn, wheelRpm);

      return {
        driverDia: wheelDia,
        drivenDia: wheelDia,
        driverRpm: wheelRpm,
        drivenRpm: wheelRpm,
        speedRatio: 1,
        diameterRatio: 1,
        isReduction: false,
        beltSpeedFtMin: res?.ftPerMin ?? 0,
        beltSpeedMPerMin: (res?.ftPerMin ?? 0) * 0.3048,
        centreDistance: 0,
        openBeltLength: 0,
        driverWrapDeg: 180,
        drivenWrapDeg: 180,
        isLowWrap: false,
        mph: res?.mph ?? 0,
        kmh: res?.kmh ?? 0,
      };
    }
  }, [
    tab,
    unit,
    solveFor,
    d1,
    d2,
    n1,
    n2,
    slipPct,
    centreDist1,
    beltD1,
    beltD2,
    beltCentre,
    stockBeltLength,
    stageCount,
    motorRpm,
    stage1Driver,
    stage1Driven,
    stage2Driver,
    stage2Driven,
    stage3Driver,
    stage3Driven,
    wheelDia,
    wheelRpm,
  ]);

  return (
    <div className={styles.card}>
      <div className={styles.tabWrapper}>
        <TabSlider
          tabs={TAB_OPTIONS}
          activeId={tab}
          onChange={handleTabChange}
          ariaLabel="Pulley calculation operation mode"
        />
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {tab === 'pulley' && 'Two-Pulley Ratio & Driven Speed'}
          {tab === 'belt' && 'V-Belt & Flat Belt Length Calculator'}
          {tab === 'multistage' && 'Compound Multi-Stage Pulley Reduction'}
          {tab === 'wheel' && 'Wheel RPM to Linear Vehicle Speed (mph / km/h)'}
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

      {/* Dynamic SVG Guide Diagram */}
      <PulleyInputGuide
        tab={tab}
        unit={unit}
        driverDia={calculations.driverDia}
        drivenDia={calculations.drivenDia}
        driverRpm={calculations.driverRpm}
        drivenRpm={calculations.drivenRpm}
        centreDistance={calculations.centreDistance}
        beltSpeedFtMin={calculations.beltSpeedFtMin}
        focusedField={focusedField}
      />

      {/* Tab 1: Pulley Speed & Size */}
      {tab === 'pulley' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={solveForId} className={styles.label}>
              Solve For Target Variable
            </label>
            <select
              id={solveForId}
              value={solveFor}
              onChange={(e) => setSolveFor(e.target.value as SolveForTarget)}
              className={styles.select}
            >
              <option value="drivenRpm">Driven Pulley Speed (N₂ RPM)</option>
              <option value="driverRpm">Driver Motor Speed (N₁ RPM)</option>
              <option value="drivenDia">Driven Pulley Size (D₂)</option>
              <option value="driverDia">Driver Pulley Size (D₁)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor={d1Id} className={styles.label}>
              1. Driver Diameter (D₁) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={d1Id}
              type="number"
              step={unit === 'metric' ? '1' : '0.125'}
              min="0.1"
              disabled={solveFor === 'driverDia'}
              value={solveFor === 'driverDia' ? calculations.driverDia.toFixed(2) : d1}
              onChange={(e) => setD1(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('d1')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Motor / engine output pulley pitch diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={n1Id} className={styles.label}>
              2. Driver Speed (N₁) <span className={styles.labelSub}>(RPM)</span>
            </label>
            <input
              id={n1Id}
              type="number"
              step="25"
              min="1"
              disabled={solveFor === 'driverRpm'}
              value={solveFor === 'driverRpm' ? calculations.driverRpm.toFixed(0) : n1}
              onChange={(e) => setN1(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('n1')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Example: 1,725 RPM (standard 4-pole motor)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={d2Id} className={styles.label}>
              3. Driven Diameter (D₂) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={d2Id}
              type="number"
              step={unit === 'metric' ? '1' : '0.125'}
              min="0.1"
              disabled={solveFor === 'drivenDia'}
              value={solveFor === 'drivenDia' ? calculations.drivenDia.toFixed(2) : d2}
              onChange={(e) => setD2(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('d2')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Machine shaft / spindle pulley pitch diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={n2Id} className={styles.label}>
              Target Driven Speed (N₂) <span className={styles.labelSub}>(RPM)</span>
            </label>
            <input
              id={n2Id}
              type="number"
              step="25"
              min="1"
              disabled={solveFor === 'drivenRpm'}
              value={solveFor === 'drivenRpm' ? calculations.drivenRpm.toFixed(1) : n2}
              onChange={(e) => setN2(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('n2')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Desired rotation speed at driven load</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={centreDist1Id} className={styles.label}>
              4. Shaft Centre Distance <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={centreDist1Id}
              type="number"
              step={unit === 'metric' ? '10' : '0.5'}
              min="0.5"
              value={centreDist1}
              onChange={(e) => setCentreDist1(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('centre')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Distance between shaft centres for belt length</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={slipPctId} className={styles.label}>
              Belt Slip Allowance <span className={styles.labelSub}>(%, optional)</span>
            </label>
            <input
              id={slipPctId}
              type="number"
              step="0.5"
              min="0"
              max="25"
              value={slipPct}
              onChange={(e) => setSlipPct(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Timing belts don&apos;t slip; for V-belts enter your own estimate</span>
          </div>
        </div>
      )}

      {/* Tab 2: Belt Length & Centre Distance */}
      {tab === 'belt' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={beltD1Id} className={styles.label}>
              Driver Pulley Dia (D₁) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={beltD1Id}
              type="number"
              step={unit === 'metric' ? '1' : '0.125'}
              min="0.1"
              value={beltD1}
              onChange={(e) => setBeltD1(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={beltD2Id} className={styles.label}>
              Driven Pulley Dia (D₂) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={beltD2Id}
              type="number"
              step={unit === 'metric' ? '1' : '0.125'}
              min="0.1"
              value={beltD2}
              onChange={(e) => setBeltD2(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={beltCentreId} className={styles.label}>
              Shaft Centre Distance (C) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={beltCentreId}
              type="number"
              step={unit === 'metric' ? '10' : '0.5'}
              min="0.5"
              value={beltCentre}
              onChange={(e) => setBeltCentre(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={stockBeltLengthId} className={styles.label}>
              Stock Belt Length <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'}, to solve C)</span>
            </label>
            <input
              id={stockBeltLengthId}
              type="number"
              step={unit === 'metric' ? '10' : '0.5'}
              min="1"
              placeholder="e.g. 50 in (reverse solves shaft centre)"
              value={stockBeltLength}
              onChange={(e) => setStockBeltLength(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Enter an off-the-shelf belt to find required centre distance</span>
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Stage */}
      {tab === 'multistage' && (
        <div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={stageCountId} className={styles.label}>
                Number of Reduction Stages
              </label>
              <select
                id={stageCountId}
                value={stageCount}
                onChange={(e) => setStageCount(parseInt(e.target.value, 10))}
                className={styles.select}
              >
                <option value="2">2-Stage Compound Drive</option>
                <option value="3">3-Stage Compound Drive</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={motorRpmId} className={styles.label}>
                Motor Shaft Speed <span className={styles.labelSub}>(RPM)</span>
              </label>
              <input
                id={motorRpmId}
                type="number"
                step="25"
                min="1"
                value={motorRpm}
                onChange={(e) => setMotorRpm(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={s1DriverId} className={styles.label}>
                Stage 1 Driver (D₁ₐ) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
              </label>
              <input
                id={s1DriverId}
                type="number"
                step="0.25"
                min="0.1"
                value={stage1Driver}
                onChange={(e) => setStage1Driver(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={s1DrivenId} className={styles.label}>
                Stage 1 Driven (D₂ₐ) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
              </label>
              <input
                id={s1DrivenId}
                type="number"
                step="0.25"
                min="0.1"
                value={stage1Driven}
                onChange={(e) => setStage1Driven(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={s2DriverId} className={styles.label}>
                Stage 2 Driver (D₁ᵦ) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
              </label>
              <input
                id={s2DriverId}
                type="number"
                step="0.25"
                min="0.1"
                value={stage2Driver}
                onChange={(e) => setStage2Driver(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={s2DrivenId} className={styles.label}>
                Stage 2 Driven (D₂ᵦ) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
              </label>
              <input
                id={s2DrivenId}
                type="number"
                step="0.25"
                min="0.1"
                value={stage2Driven}
                onChange={(e) => setStage2Driven(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            {stageCount === 3 && (
              <>
                <div className={styles.field}>
                  <label htmlFor={s3DriverId} className={styles.label}>
                    Stage 3 Driver (D₁꜀) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
                  </label>
                  <input
                    id={s3DriverId}
                    type="number"
                    step="0.25"
                    min="0.1"
                    value={stage3Driver}
                    onChange={(e) => setStage3Driver(parseFloat(e.target.value) || 0)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={s3DrivenId} className={styles.label}>
                    Stage 3 Driven (D₂꜀) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
                  </label>
                  <input
                    id={s3DrivenId}
                    type="number"
                    step="0.25"
                    min="0.1"
                    value={stage3Driven}
                    onChange={(e) => setStage3Driven(parseFloat(e.target.value) || 0)}
                    className={styles.input}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Wheel Speed */}
      {tab === 'wheel' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={wheelDiaId} className={styles.label}>
              Wheel / Tire Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={wheelDiaId}
              type="number"
              step={unit === 'metric' ? '10' : '0.5'}
              min="1"
              value={wheelDia}
              onChange={(e) => setWheelDia(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('wheelDia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Overall tire outer diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={wheelRpmId} className={styles.label}>
              Wheel Rotation Speed <span className={styles.labelSub}>(RPM)</span>
            </label>
            <input
              id={wheelRpmId}
              type="number"
              step="10"
              min="1"
              value={wheelRpm}
              onChange={(e) => setWheelRpm(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('wheelRpm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Axle speed in revolutions per minute</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className={styles.resultsSection}>
        {calculations.isLowWrap && (
          <div className={styles.warningCard} role="alert">
            ⚠️ <strong>Low Belt Wrap Warning:</strong> Arc of contact on the small pulley ({calculations.driverWrapDeg.toFixed(1)}°) is below 120°. Less wrap means less grip; check your belt maker&apos;s minimum and consider a longer centre distance or an idler.
          </div>
        )}

        <div className={styles.resultsGrid}>
          {tab === 'wheel' ? (
            <>
              <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                <span className={styles.resultLabel}>Vehicle Velocity</span>
                <span className={styles.resultValue}>{((calculations as { mph?: number }).mph ?? 0).toFixed(2)} mph</span>
                <span className={styles.resultSub}>{((calculations as { kmh?: number }).kmh ?? 0).toFixed(2)} km/h</span>
              </div>
              <div className={styles.resultCard}>
                <span className={styles.resultLabel}>Linear Surface Travel</span>
                <span className={styles.resultValue}>{calculations.beltSpeedFtMin.toFixed(0)} ft/min</span>
                <span className={styles.resultSub}>({calculations.beltSpeedMPerMin.toFixed(1)} m/min)</span>
              </div>
            </>
          ) : (
            <>
              <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                <span className={styles.resultLabel}>Driven Shaft Speed</span>
                <span className={styles.resultValue}>{calculations.drivenRpm.toLocaleString(undefined, { maximumFractionDigits: 1 })} RPM</span>
                <span className={styles.resultSub}>
                  {calculations.isReduction
                    ? `${calculations.diameterRatio.toFixed(2)}:1 Speed Reduction`
                    : `1:${(1 / calculations.diameterRatio).toFixed(2)} Overdrive`}
                </span>
              </div>

              <div className={styles.resultCard}>
                <span className={styles.resultLabel}>Linear Belt Speed</span>
                <span className={styles.resultValue}>{calculations.beltSpeedFtMin.toFixed(1)} ft/min</span>
                <span className={styles.resultSub}>
                  ({(calculations.beltSpeedFtMin * 0.3048).toFixed(1)} m/min / {(calculations.beltSpeedFtMin / 60).toFixed(1)} ft/s)
                </span>
              </div>

              {(tab === 'pulley' || tab === 'belt') && (
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>Open Belt Pitch Length</span>
                  <span className={styles.resultValue}>
                    {calculations.openBeltLength.toFixed(2)} {unit === 'metric' ? 'mm' : 'in'}
                  </span>
                  <span className={styles.resultSub}>
                    Wrap: {calculations.driverWrapDeg.toFixed(1)}° driver / {calculations.drivenWrapDeg.toFixed(1)}° driven
                  </span>
                </div>
              )}

              {tab === 'belt' && (calculations as { solvedCentre?: number | null }).solvedCentre && (
                <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
                  <span className={styles.resultLabel}>Required Centre for Stock Belt</span>
                  <span className={styles.resultValue}>
                    {((calculations as { solvedCentre?: number | null }).solvedCentre ?? 0).toFixed(2)} {unit === 'metric' ? 'mm' : 'in'}
                  </span>
                  <span className={styles.resultSub}>For {stockBeltLength} {unit === 'metric' ? 'mm' : 'in'} belt</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Dynamic Summary Sentence (Spec §3.5) */}
        <div className={styles.summaryBanner}>
          {tab === 'pulley' && (
            <>
              A <strong>{d1}&quot;</strong> pulley at <strong>{n1.toLocaleString()} RPM</strong> driving a{' '}
              <strong>{d2}&quot;</strong> pulley turns it at{' '}
              <strong>{calculations.drivenRpm.toLocaleString(undefined, { maximumFractionDigits: 1 })} RPM</strong>, a{' '}
              <strong>{calculations.diameterRatio.toFixed(2)}:1</strong> reduction. The belt moves at about{' '}
              <strong>{calculations.beltSpeedFtMin.toFixed(0)} feet per minute</strong>.
            </>
          )}
          {tab === 'belt' && (
            <>
              For pulleys of <strong>{beltD1}&quot;</strong> and <strong>{beltD2}&quot;</strong> at{' '}
              <strong>{beltCentre}&quot;</strong> centre distance, the required open belt length is{' '}
              <strong>{calculations.openBeltLength.toFixed(2)} inches</strong> ({calculations.driverWrapDeg.toFixed(1)}° wrap).
            </>
          )}
          {tab === 'multistage' && (
            <>
              Compound <strong>{stageCount}-stage drive</strong>: motor at <strong>{motorRpm.toLocaleString()} RPM</strong> reduces through a total ratio of{' '}
              <strong>{(calculations as { stageResults?: { totalRatio: number } }).stageResults?.totalRatio.toFixed(2)}:1</strong> to output{' '}
              <strong>{calculations.drivenRpm.toFixed(1)} RPM</strong>.
            </>
          )}
          {tab === 'wheel' && (
            <>
              A <strong>{wheelDia}&quot;</strong> wheel rotating at <strong>{wheelRpm} RPM</strong> achieves an effective ground travel speed of{' '}
              <strong>{((calculations as { mph?: number }).mph ?? 0).toFixed(2)} mph</strong> ({((calculations as { kmh?: number }).kmh ?? 0).toFixed(2)} km/h).
            </>
          )}
        </div>

        {/* Multi-Stage Breakdown Table */}
        {tab === 'multistage' && (calculations as { stageResults?: { stageRatios: number[]; shaftRpms: number[] } }).stageResults && (
          <div className={styles.tableWrap}>
            <table className={styles.stageTable}>
              <thead>
                <tr>
                  <th>Shaft Stage</th>
                  <th>Driver → Driven</th>
                  <th>Stage Ratio</th>
                  <th>Shaft Output RPM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Motor Shaft (Input)</td>
                  <td>—</td>
                  <td>1.00:1</td>
                  <td><strong>{motorRpm.toLocaleString()} RPM</strong></td>
                </tr>
                <tr>
                  <td>Stage 1 Jackshaft</td>
                  <td>{stage1Driver}&quot; → {stage1Driven}&quot;</td>
                  <td>{(stage1Driven / stage1Driver).toFixed(2)}:1</td>
                  <td><strong>{((calculations as { stageResults?: { shaftRpms: number[] } }).stageResults?.shaftRpms[1] ?? 0).toFixed(1)} RPM</strong></td>
                </tr>
                <tr>
                  <td>Stage 2 Output</td>
                  <td>{stage2Driver}&quot; → {stage2Driven}&quot;</td>
                  <td>{(stage2Driven / stage2Driver).toFixed(2)}:1</td>
                  <td><strong>{((calculations as { stageResults?: { shaftRpms: number[] } }).stageResults?.shaftRpms[2] ?? 0).toFixed(1)} RPM</strong></td>
                </tr>
                {stageCount === 3 && (
                  <tr>
                    <td>Stage 3 Final Output</td>
                    <td>{stage3Driver}&quot; → {stage3Driven}&quot;</td>
                    <td>{(stage3Driven / stage3Driver).toFixed(2)}:1</td>
                    <td><strong>{((calculations as { stageResults?: { shaftRpms: number[] } }).stageResults?.shaftRpms[3] ?? 0).toFixed(1)} RPM</strong></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
