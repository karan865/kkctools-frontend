'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider, { type TabItem } from '@/components/tool/shared/TabSlider';
import StepsInputGuide from './StepsInputGuide';
import styles from './StepsCalculator.module.css';
import {
  stepsPerRev,
  beltStepsPerMm,
  leadScrewStepsPerMm,
  extruderHwStepsPerMm,
  calibrateESteps,
  calibrateAxis,
  klipperRotationDistance,
  stepFrequencyHz,
  generateFirmwareCommands,
} from '@/lib/steps-engine';

type StepsTab = 'belt' | 'leadscrew' | 'esteps' | 'axis' | 'hardware';

const TAB_OPTIONS: TabItem<StepsTab>[] = [
  { id: 'belt', label: 'Belt Axis' },
  { id: 'leadscrew', label: 'Lead Screw' },
  { id: 'esteps', label: 'E-Steps Calibration' },
  { id: 'axis', label: 'Axis Calibration' },
  { id: 'hardware', label: 'Extruder Hardware' },
];

export default function StepsCalculator() {
  const [tab, setTab] = useState<StepsTab>('belt');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copiedFirmware, setCopiedFirmware] = useState<string | null>(null);

  // Sync tab with URL
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['belt', 'leadscrew', 'esteps', 'axis', 'hardware'].includes(tabParam)) {
        setTab(tabParam as StepsTab);
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleTabChange = (newTabId: StepsTab) => {
    setTab(newTabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTabId);
    window.history.replaceState({}, '', url.toString());
  };

  // State: Common Motor Settings
  const [stepAngle, setStepAngle] = useState<number>(1.8);
  const [microsteps, setMicrosteps] = useState<number>(16);
  const [maxSpeedMmS, setMaxSpeedMmS] = useState<number>(200);

  // State: Tab 1 (Belt Axis)
  const [beltPitch, setBeltPitch] = useState<number>(2.0); // GT2 default
  const [pulleyTeeth, setPulleyTeeth] = useState<number>(20);
  const [beltAxisLetter, setBeltAxisLetter] = useState<'X' | 'Y'>('X');

  // State: Tab 2 (Lead Screw)
  const [leadMm, setLeadMm] = useState<number>(8.0); // T8x8 default
  const [screwAxisLetter, setScrewAxisLetter] = useState<'Z'>('Z');

  // State: Tab 3 (E-Steps)
  const [currentESteps, setCurrentESteps] = useState<number>(93.0);
  const [requestedMm, setRequestedMm] = useState<number>(100.0);
  const [markDistanceMm, setMarkDistanceMm] = useState<number>(120.0);
  const [remainingDistanceMm, setRemainingDistanceMm] = useState<number>(25.0);

  // State: Tab 4 (Axis Calibration)
  const [currentAxisSteps, setCurrentAxisSteps] = useState<number>(80.0);
  const [commandedMm, setCommandedMm] = useState<number>(20.0);
  const [measuredMm, setMeasuredMm] = useState<number>(19.8);
  const [calibAxisLetter, setCalibAxisLetter] = useState<'X' | 'Y' | 'Z'>('X');

  // State: Tab 5 (Extruder Hardware)
  const [gearRatio, setGearRatio] = useState<number>(3.0); // 3:1 BMG style
  const [driveGearDiaMm, setDriveGearDiaMm] = useState<number>(7.3);

  // IDs
  const stepAngleId = useId();
  const microstepsId = useId();
  const maxSpeedId = useId();

  const beltPitchId = useId();
  const pulleyTeethId = useId();
  const beltAxisId = useId();

  const leadMmId = useId();
  const screwAxisId = useId();

  const currentEStepsId = useId();
  const requestedMmId = useId();
  const markDistanceId = useId();
  const remainingDistanceId = useId();

  const currentAxisStepsId = useId();
  const commandedMmId = useId();
  const measuredMmId = useId();
  const calibAxisId = useId();

  const gearRatioId = useId();
  const driveGearDiaId = useId();

  // Calculations
  const calculations = useMemo(() => {
    let finalStepsPerMm = 0;
    let targetAxis: 'X' | 'Y' | 'Z' | 'E' = 'X';
    let summaryText = '';
    let pitchOrLead = beltPitch;
    let teethOrRatio = pulleyTeeth;

    if (tab === 'belt') {
      const steps = beltStepsPerMm(stepAngle, microsteps, beltPitch, pulleyTeeth) ?? 0;
      finalStepsPerMm = steps;
      targetAxis = beltAxisLetter;
      pitchOrLead = beltPitch;
      teethOrRatio = pulleyTeeth;
      const rotDist = klipperRotationDistance(stepAngle, microsteps, steps) ?? 0;
      summaryText = `A ${stepAngle}° motor at ${microsteps} microsteps on a ${beltPitch} mm belt with a ${pulleyTeeth}-tooth pulley needs ${steps.toFixed(1)} steps per mm (Klipper rotation_distance: ${rotDist.toFixed(3)}).`;
    } else if (tab === 'leadscrew') {
      const steps = leadScrewStepsPerMm(stepAngle, microsteps, leadMm) ?? 0;
      finalStepsPerMm = steps;
      targetAxis = screwAxisLetter;
      pitchOrLead = leadMm;
      teethOrRatio = 1;
      const rotDist = klipperRotationDistance(stepAngle, microsteps, steps) ?? 0;
      summaryText = `A ${stepAngle}° motor at ${microsteps} microsteps with an ${leadMm} mm lead screw needs ${steps.toFixed(1)} steps per mm (Klipper rotation_distance: ${rotDist.toFixed(3)}).`;
    } else if (tab === 'esteps') {
      const res = calibrateESteps(currentESteps, requestedMm, markDistanceMm, remainingDistanceMm);
      finalStepsPerMm = res?.newESteps ?? currentESteps;
      targetAxis = 'E';
      pitchOrLead = requestedMm;
      teethOrRatio = res?.actualExtrudedMm ?? 0;
      const actual = res?.actualExtrudedMm ?? 0;
      summaryText = `Extruded ${actual.toFixed(1)} mm out of ${requestedMm} mm commanded (${res?.errorPct ? Math.abs(res.errorPct).toFixed(1) : '0'}% ${res?.isUnderExtruding ? 'under-extrusion' : 'over-extrusion'}). Adjust E-steps from ${currentESteps} to ${finalStepsPerMm.toFixed(2)}.`;
    } else if (tab === 'axis') {
      const res = calibrateAxis(currentAxisSteps, commandedMm, measuredMm);
      finalStepsPerMm = res?.newStepsPerMm ?? currentAxisSteps;
      targetAxis = calibAxisLetter;
      pitchOrLead = commandedMm;
      teethOrRatio = measuredMm;
      summaryText = `Printed object measured ${measuredMm.toFixed(2)} mm vs ${commandedMm} mm target (${res?.isUndersized ? 'undersized' : 'oversized'}). Update ${calibAxisLetter} steps from ${currentAxisSteps} to ${finalStepsPerMm.toFixed(2)}.`;
    } else {
      // Extruder hardware
      const steps = extruderHwStepsPerMm(stepAngle, microsteps, gearRatio, driveGearDiaMm) ?? 0;
      finalStepsPerMm = steps;
      targetAxis = 'E';
      pitchOrLead = driveGearDiaMm;
      teethOrRatio = gearRatio;
      summaryText = `Extruder with ${gearRatio}:1 gearing and ${driveGearDiaMm} mm hobbed gear diameter requires ${steps.toFixed(1)} steps per mm.`;
    }

    const resolutionUm = finalStepsPerMm > 0 ? (1 / finalStepsPerMm) * 1000 : 0;
    const pulseHz = stepFrequencyHz(finalStepsPerMm, maxSpeedMmS) ?? 0;
    const fw = generateFirmwareCommands(targetAxis, finalStepsPerMm, stepAngle, microsteps);

    return {
      stepsPerMm: finalStepsPerMm,
      stepsPerInch: finalStepsPerMm * 25.4,
      resolutionUm,
      pulseHz,
      firmware: fw,
      summaryText,
      targetAxis,
      pitchOrLead,
      teethOrRatio,
    };
  }, [
    tab,
    stepAngle,
    microsteps,
    maxSpeedMmS,
    beltPitch,
    pulleyTeeth,
    beltAxisLetter,
    leadMm,
    screwAxisLetter,
    currentESteps,
    requestedMm,
    markDistanceMm,
    remainingDistanceMm,
    currentAxisSteps,
    commandedMm,
    measuredMm,
    calibAxisLetter,
    gearRatio,
    driveGearDiaMm,
  ]);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedFirmware(label);
      setTimeout(() => setCopiedFirmware(null), 2500);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.tabWrapper}>
        <TabSlider
          tabs={TAB_OPTIONS}
          activeId={tab}
          onChange={handleTabChange}
          ariaLabel="Stepper steps per mm calculation operation mode"
        />
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {tab === 'belt' && 'Belt-Driven Axis (X / Y / CoreXY)'}
          {tab === 'leadscrew' && 'Lead Screw Driven Axis (Z Axis / CNC Router)'}
          {tab === 'esteps' && 'Extruder E-Steps 100 mm Calibration'}
          {tab === 'axis' && 'Axis Test Object Calibration (Test Cube)'}
          {tab === 'hardware' && 'Extruder Gear Ratio & Drive Diameter'}
        </h2>
      </div>

      {/* Dynamic SVG Guide Diagram */}
      <StepsInputGuide
        tab={tab}
        stepAngle={stepAngle}
        microsteps={microsteps}
        pitchOrLead={calculations.pitchOrLead}
        teethOrRatio={calculations.teethOrRatio}
        calculatedSteps={calculations.stepsPerMm}
        focusedField={focusedField}
      />

      {/* Global Motor & Driver Section (Applies across all tabs) */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor={stepAngleId} className={styles.label}>
            Motor Step Angle <span className={styles.labelSub}>({Math.round(stepsPerRev(stepAngle))} full steps/rev)</span>
          </label>
          <select
            id={stepAngleId}
            value={stepAngle}
            onChange={(e) => setStepAngle(parseFloat(e.target.value))}
            onFocus={() => setFocusedField('stepAngle')}
            onBlur={() => setFocusedField(null)}
            className={styles.select}
          >
            <option value="1.8">1.8° (200 steps/rev - standard NEMA 17)</option>
            <option value="0.9">0.9° (400 steps/rev - high precision)</option>
            <option value="7.5">7.5° (48 steps/rev - small tin-can stepper)</option>
          </select>
          <span className={styles.helpText}>Physical rotor step angle specification</span>
        </div>

        <div className={styles.field}>
          <label htmlFor={microstepsId} className={styles.label}>
            Driver Microstepping Setting
          </label>
          <select
            id={microstepsId}
            value={microsteps}
            onChange={(e) => setMicrosteps(parseInt(e.target.value, 10))}
            onFocus={() => setFocusedField('microsteps')}
            onBlur={() => setFocusedField(null)}
            className={styles.select}
          >
            <option value="16">1/16 Microstepping (Standard Marlin/TMC)</option>
            <option value="32">1/32 Microstepping</option>
            <option value="64">1/64 Microstepping</option>
            <option value="128">1/128 Microstepping</option>
            <option value="8">1/8 Microstepping</option>
            <option value="4">1/4 Microstepping</option>
            <option value="1">1/1 Full Step</option>
          </select>
          <span className={styles.helpText}>TMC2209, A4988, or DRV8825 driver mode</span>
        </div>

        <div className={styles.field}>
          <label htmlFor={maxSpeedId} className={styles.label}>
            Target Max Velocity <span className={styles.labelSub}>(mm/s)</span>
          </label>
          <input
            id={maxSpeedId}
            type="number"
            min="10"
            max="1000"
            value={maxSpeedMmS}
            onChange={(e) => setMaxSpeedMmS(parseFloat(e.target.value) || 100)}
            className={styles.input}
          />
          <span className={styles.helpText}>Used to check MCU step pulse rate (Hz)</span>
        </div>
      </div>

      {/* Tab 1: Belt Axis Inputs */}
      {tab === 'belt' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={beltAxisId} className={styles.label}>
              Target Axis
            </label>
            <select
              id={beltAxisId}
              value={beltAxisLetter}
              onChange={(e) => setBeltAxisLetter(e.target.value as 'X' | 'Y')}
              className={styles.select}
            >
              <option value="X">X Axis (Cartesian / CoreXY A)</option>
              <option value="Y">Y Axis (Cartesian / CoreXY B)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor={beltPitchId} className={styles.label}>
              Belt Tooth Pitch <span className={styles.labelSub}>(mm)</span>
            </label>
            <select
              id={beltPitchId}
              value={beltPitch}
              onChange={(e) => setBeltPitch(parseFloat(e.target.value))}
              onFocus={() => setFocusedField('pitch')}
              onBlur={() => setFocusedField(null)}
              className={styles.select}
            >
              <option value="2.0">2.0 mm (GT2 Belt - 3D Printing Standard)</option>
              <option value="3.0">3.0 mm (GT3 Belt)</option>
              <option value="5.0">5.0 mm (HTD 5M - Heavy CNC)</option>
            </select>
            <span className={styles.helpText}>Distance from tooth crest to crest</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={pulleyTeethId} className={styles.label}>
              Pulley Tooth Count (Teeth)
            </label>
            <input
              id={pulleyTeethId}
              type="number"
              min="10"
              max="120"
              value={pulleyTeeth}
              onChange={(e) => setPulleyTeeth(parseInt(e.target.value, 10) || 20)}
              onFocus={() => setFocusedField('pulley')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Count the teeth on your pulley (e.g. 20T or 16T)</span>
          </div>
        </div>
      )}

      {/* Tab 2: Lead Screw Inputs */}
      {tab === 'leadscrew' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={screwAxisId} className={styles.label}>
              Target Axis
            </label>
            <select
              id={screwAxisId}
              value={screwAxisLetter}
              onChange={(e) => setScrewAxisLetter(e.target.value as 'Z')}
              className={styles.select}
            >
              <option value="Z">Z Axis (Linear Elevation)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor={leadMmId} className={styles.label}>
              Lead Screw Lead <span className={styles.labelSub}>(mm/revolution)</span>
            </label>
            <select
              id={leadMmId}
              value={leadMm}
              onChange={(e) => setLeadMm(parseFloat(e.target.value))}
              className={styles.select}
            >
              <option value="8.0">8.0 mm lead (T8x8: 2 mm pitch × 4 starts - Standard)</option>
              <option value="4.0">4.0 mm lead (T8x4: 2 mm pitch × 2 starts)</option>
              <option value="2.0">2.0 mm lead (T8x2: 2 mm pitch × 1 start - Non-backdriving)</option>
              <option value="1.27">1.27 mm lead (1/4&quot;-20 threaded rod)</option>
              <option value="1.5875">1.5875 mm lead (5/16&quot;-18 threaded rod)</option>
            </select>
            <span className={styles.helpText}>Linear forward travel in one 360° turn</span>
          </div>
        </div>
      )}

      {/* Tab 3: E-Steps Calibration Inputs */}
      {tab === 'esteps' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={currentEStepsId} className={styles.label}>
              Current Firmware E-Steps <span className={styles.labelSub}>(from M503)</span>
            </label>
            <input
              id={currentEStepsId}
              type="number"
              step="0.1"
              min="1"
              value={currentESteps}
              onChange={(e) => setCurrentESteps(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
            <span className={styles.helpText}>Read from terminal with M503 (e.g. 93.0)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={markDistanceId} className={styles.label}>
              Initial Mark Distance <span className={styles.labelSub}>(mm)</span>
            </label>
            <input
              id={markDistanceId}
              type="number"
              step="5"
              min="100"
              value={markDistanceMm}
              onChange={(e) => setMarkDistanceMm(parseFloat(e.target.value) || 100)}
              onFocus={() => setFocusedField('mark')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Distance marked from extruder entry (e.g. 120 mm)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={requestedMmId} className={styles.label}>
              Requested Extrusion (G1 E100) <span className={styles.labelSub}>(mm)</span>
            </label>
            <input
              id={requestedMmId}
              type="number"
              step="10"
              min="10"
              value={requestedMm}
              onChange={(e) => setRequestedMm(parseFloat(e.target.value) || 100)}
              onFocus={() => setFocusedField('requested')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Commanded length (usually 100 mm)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={remainingDistanceId} className={styles.label}>
              Remaining Measured Distance <span className={styles.labelSub}>(mm)</span>
            </label>
            <input
              id={remainingDistanceId}
              type="number"
              step="0.5"
              min="0"
              value={remainingDistanceMm}
              onChange={(e) => setRemainingDistanceMm(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('remaining')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Distance from intake to mark after extrusion</span>
          </div>
        </div>
      )}

      {/* Tab 4: Axis Calibration Inputs */}
      {tab === 'axis' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={calibAxisId} className={styles.label}>
              Calibrated Axis
            </label>
            <select
              id={calibAxisId}
              value={calibAxisLetter}
              onChange={(e) => setCalibAxisLetter(e.target.value as 'X' | 'Y' | 'Z')}
              className={styles.select}
            >
              <option value="X">X Axis</option>
              <option value="Y">Y Axis</option>
              <option value="Z">Z Axis</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor={currentAxisStepsId} className={styles.label}>
              Current Steps per mm
            </label>
            <input
              id={currentAxisStepsId}
              type="number"
              step="0.1"
              min="1"
              value={currentAxisSteps}
              onChange={(e) => setCurrentAxisSteps(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={commandedMmId} className={styles.label}>
              Commanded (CAD) Dimension <span className={styles.labelSub}>(mm)</span>
            </label>
            <input
              id={commandedMmId}
              type="number"
              step="1"
              min="1"
              value={commandedMm}
              onChange={(e) => setCommandedMm(parseFloat(e.target.value) || 20)}
              className={styles.input}
            />
            <span className={styles.helpText}>e.g. 20.00 mm calibration cube</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={measuredMmId} className={styles.label}>
              Caliper Measured Dimension <span className={styles.labelSub}>(mm)</span>
            </label>
            <input
              id={measuredMmId}
              type="number"
              step="0.05"
              min="0.1"
              value={measuredMm}
              onChange={(e) => setMeasuredMm(parseFloat(e.target.value) || 20)}
              className={styles.input}
            />
            <span className={styles.helpText}>Physical vernier / digital caliper reading</span>
          </div>
        </div>
      )}

      {/* Tab 5: Extruder Hardware Inputs */}
      {tab === 'hardware' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={gearRatioId} className={styles.label}>
              Extruder Gear Ratio <span className={styles.labelSub}>(e.g. 3.0 for 3:1)</span>
            </label>
            <input
              id={gearRatioId}
              type="number"
              step="0.1"
              min="1"
              value={gearRatio}
              onChange={(e) => setGearRatio(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
            <span className={styles.helpText}>1.0 with no gearing; geared extruders: use the maker&apos;s stated ratio</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={driveGearDiaId} className={styles.label}>
              Drive Gear Effective Pitch Diameter <span className={styles.labelSub}>(mm)</span>
            </label>
            <input
              id={driveGearDiaId}
              type="number"
              step="0.1"
              min="1"
              value={driveGearDiaMm}
              onChange={(e) => setDriveGearDiaMm(parseFloat(e.target.value) || 7.3)}
              className={styles.input}
            />
            <span className={styles.helpText}>Effective diameter where filament bites</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsGrid}>
          <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
            <span className={styles.resultLabel}>Steps per Millimeter</span>
            <span className={styles.resultValue}>{calculations.stepsPerMm.toFixed(2)}</span>
            <span className={styles.resultSub}>({calculations.stepsPerInch.toFixed(1)} steps/inch)</span>
          </div>

          <div className={styles.resultCard}>
            <span className={styles.resultLabel}>Klipper rotation_distance</span>
            <span className={styles.resultValue}>{calculations.firmware.rotationDistance.toFixed(3)}</span>
            <span className={styles.resultSub}>For printer.cfg</span>
          </div>

          <div className={styles.resultCard}>
            <span className={styles.resultLabel}>Linear Resolution</span>
            <span className={styles.resultValue}>{calculations.resolutionUm.toFixed(2)} µm</span>
            <span className={styles.resultSub}>Per single microstep</span>
          </div>

          <div className={styles.resultCard}>
            <span className={styles.resultLabel}>Step Frequency @ {maxSpeedMmS} mm/s</span>
            <span className={styles.resultValue}>{(calculations.pulseHz / 1000).toFixed(1)} kHz</span>
            <span className={styles.resultSub}>{Math.round(calculations.pulseHz).toLocaleString()} pulses/sec</span>
          </div>
        </div>

        {/* Dynamic Summary Sentence (Spec §3.5) */}
        <div className={styles.summaryBanner}>{calculations.summaryText}</div>

        {/* Firmware Code Snippets Box with Copy Buttons */}
        <div className={styles.firmwareBox}>
          <div className={styles.firmwareHeader}>
            <span className={styles.firmwareTitle}>📋 Copy Configuration Snippets for Your Firmware</span>
            <span className={styles.helpText}>Back up your configuration before saving</span>
          </div>
          <div className={styles.firmwareGrid}>
            <div className={styles.codeCard}>
              <div>
                <span className={styles.codeLabel}>Marlin / RepRapFirmware (G-Code)</span>
                <pre className={styles.codeBlock}>{calculations.firmware.marlinSave}</pre>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(calculations.firmware.marlinSave, 'marlin')}
                className={styles.copyBtn}
              >
                {copiedFirmware === 'marlin' ? '✓ Copied!' : 'Copy Marlin G-Code'}
              </button>
            </div>

            <div className={styles.codeCard}>
              <div>
                <span className={styles.codeLabel}>Klipper (printer.cfg)</span>
                <pre className={styles.codeBlock}>{calculations.firmware.klipper}</pre>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(calculations.firmware.klipper, 'klipper')}
                className={styles.copyBtn}
              >
                {copiedFirmware === 'klipper' ? '✓ Copied!' : 'Copy Klipper Config'}
              </button>
            </div>

            <div className={styles.codeCard}>
              <div>
                <span className={styles.codeLabel}>GRBL CNC ($ Parameters)</span>
                <pre className={styles.codeBlock}>{calculations.firmware.grbl}</pre>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(calculations.firmware.grbl, 'grbl')}
                className={styles.copyBtn}
              >
                {copiedFirmware === 'grbl' ? '✓ Copied!' : 'Copy GRBL Setting'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
