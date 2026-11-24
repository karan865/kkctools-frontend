'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import styles from './MetricCalculator.module.css';
import MetricInputGuide from './MetricInputGuide';
import {
  UnitCategory,
  LENGTH_UNITS,
  WEIGHT_UNITS,
  VOLUME_UNITS,
  AREA_UNITS,
  SPEED_UNITS,
  TemperatureUnit,
  convertGeneral,
  convertTemperature,
  parseFeetInches,
  generateConversionChart,
} from '@/lib/metric-engine';

const CATEGORY_TABS: TabItem<UnitCategory>[] = [
  { id: 'length', label: 'Length' },
  { id: 'weight', label: 'Weight' },
  { id: 'volume', label: 'Volume' },
  { id: 'area', label: 'Area' },
  { id: 'temperature', label: 'Temperature' },
  { id: 'speed', label: 'Speed' },
];

export default function MetricCalculator() {
  const [category, setCategory] = useState<UnitCategory>('length');

  // Open the category named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && CATEGORY_TABS.some((c) => c.id === t)) setCategory(t as UnitCategory);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Input states per category
  const [lengthVal, setLengthVal] = useState('10');
  const [lengthFrom, setLengthFrom] = useState('ft');
  const [lengthTo, setLengthTo] = useState('m');

  const [weightVal, setWeightVal] = useState('100');
  const [weightFrom, setWeightFrom] = useState('kg');
  const [weightTo, setWeightTo] = useState('lb');

  const [volumeVal, setVolumeVal] = useState('1');
  const [volumeFrom, setVolumeFrom] = useState('us_gal');
  const [volumeTo, setVolumeTo] = useState('l');

  const [areaVal, setAreaVal] = useState('1');
  const [areaFrom, setAreaFrom] = useState('sq_m');
  const [areaTo, setAreaTo] = useState('sq_ft');

  const [tempVal, setTempVal] = useState('68');
  const [tempFrom, setTempFrom] = useState<TemperatureUnit>('f');
  const [tempTo, setTempTo] = useState<TemperatureUnit>('c');
  const [tempMode, setTempMode] = useState<'point' | 'diff'>('point');

  const [speedVal, setSpeedVal] = useState('60');
  const [speedFrom, setSpeedFrom] = useState('mph');
  const [speedTo, setSpeedTo] = useState('kmh');

  const [decimals, setDecimals] = useState(4);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // IDs
  const idVal = useId();
  const idFrom = useId();
  const idTo = useId();

  // Unit dictionaries
  const currentUnits = useMemo(() => {
    switch (category) {
      case 'length':
        return LENGTH_UNITS;
      case 'weight':
        return WEIGHT_UNITS;
      case 'volume':
        return VOLUME_UNITS;
      case 'area':
        return AREA_UNITS;
      case 'speed':
        return SPEED_UNITS;
      default:
        return {};
    }
  }, [category]);

  // Current active value and unit IDs
  const activeInput = useMemo(() => {
    switch (category) {
      case 'length': {
        const parsed = parseFeetInches(lengthVal);
        const num = parsed !== null ? parsed : 0;
        return { valStr: lengthVal, num, from: lengthFrom, to: lengthTo };
      }
      case 'weight': {
        const num = parseFloat(weightVal) || 0;
        return { valStr: weightVal, num, from: weightFrom, to: weightTo };
      }
      case 'volume': {
        const num = parseFloat(volumeVal) || 0;
        return { valStr: volumeVal, num, from: volumeFrom, to: volumeTo };
      }
      case 'area': {
        const num = parseFloat(areaVal) || 0;
        return { valStr: areaVal, num, from: areaFrom, to: areaTo };
      }
      case 'temperature': {
        const num = parseFloat(tempVal) || 0;
        return { valStr: tempVal, num, from: tempFrom, to: tempTo };
      }
      case 'speed': {
        const num = parseFloat(speedVal) || 0;
        return { valStr: speedVal, num, from: speedFrom, to: speedTo };
      }
    }
  }, [
    category,
    lengthVal,
    lengthFrom,
    lengthTo,
    weightVal,
    weightFrom,
    weightTo,
    volumeVal,
    volumeFrom,
    volumeTo,
    areaVal,
    areaFrom,
    areaTo,
    tempVal,
    tempFrom,
    tempTo,
    speedVal,
    speedFrom,
    speedTo,
  ]);

  // Main conversion calculation
  const conversionResult = useMemo(() => {
    if (category === 'temperature') {
      return convertTemperature(activeInput.num, tempFrom, tempTo, tempMode, decimals);
    }
    return convertGeneral(activeInput.num, activeInput.from, activeInput.to, category, decimals);
  }, [category, activeInput, tempFrom, tempTo, tempMode, decimals]);

  // Dynamic conversion chart rows
  const chartRows = useMemo(() => {
    return generateConversionChart(activeInput.from, activeInput.to, category, 1, 10, 1);
  }, [activeInput.from, activeInput.to, category]);

  // Swap function
  const handleSwap = () => {
    if (category === 'length') {
      setLengthFrom(lengthTo);
      setLengthTo(lengthFrom);
    } else if (category === 'weight') {
      setWeightFrom(weightTo);
      setWeightTo(weightFrom);
    } else if (category === 'volume') {
      setVolumeFrom(volumeTo);
      setVolumeTo(volumeFrom);
    } else if (category === 'area') {
      setAreaFrom(areaTo);
      setAreaTo(areaFrom);
    } else if (category === 'temperature') {
      setTempFrom(tempTo);
      setTempTo(tempFrom);
    } else if (category === 'speed') {
      setSpeedFrom(speedTo);
      setSpeedTo(speedFrom);
    }
  };

  // CSV Export for Conversion Chart
  const downloadChartCSV = () => {
    const fromName =
      category === 'temperature'
        ? tempFrom.toUpperCase()
        : currentUnits[activeInput.from]?.symbol || activeInput.from;
    const toName =
      category === 'temperature'
        ? tempTo.toUpperCase()
        : currentUnits[activeInput.to]?.symbol || activeInput.to;

    const headers = [`From (${fromName})`, `To (${toName})`];
    const rows = chartRows.map((r) => `${r.from},${r.toFormatted}`);
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `conversion_chart_${category}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopyStatus('Chart Downloaded!');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  // Pitfall text per tab
  const getPitfallText = () => {
    switch (category) {
      case 'length':
        return 'Feet + inches syntax supports mixed notation (e.g. 5\' 10", 5 ft 10 in, or fractional 5\' 10 1/2"). 1 inch is defined as exactly 2.54 cm by international treaty.';
      case 'weight':
        return 'US short ton is 2,000 lb (907.18 kg), UK long ton is 2,240 lb (1,016.05 kg), and metric tonne is 1,000 kg. All avoirdupois calculations use the exact 1959 factor: 1 lb = 0.45359237 kg.';
      case 'volume':
        return 'A US liquid gallon (231 in³ ≈ 3.785 L) is approximately 17% smaller than an Imperial gallon (4.546 L). Conversely, a US fluid ounce (29.57 mL) is about 4% larger than an Imperial fluid ounce (28.41 mL).';
      case 'area':
        return 'Area conversions square the linear length factor. For example, because 1 ft = 0.3048 m, 1 ft² = (0.3048)² = 0.09290304 m² (exact).';
      case 'temperature':
        return 'Be careful to distinguish between an absolute reading and a temperature difference. A reading of 10 °C is 50 °F, but a temperature CHANGE of 10 °C corresponds to an 18 °F change (using the 9/5 slope factor without adding 32).';
      case 'speed':
        return 'Transportation velocities: 60 mph equals 96.56 km/h or 26.82 m/s. 1 nautical mile per hour (knot) is defined via 1,852 metres per hour.';
    }
  };

  return (
    <div className={styles.calculatorWrapper}>
      {/* Input Guide Diagram */}
      <MetricInputGuide
        category={category}
        fromUnit={
          category === 'temperature'
            ? tempFrom.toUpperCase()
            : currentUnits[activeInput.from]?.name || activeInput.from
        }
        toUnit={
          category === 'temperature'
            ? tempTo.toUpperCase()
            : currentUnits[activeInput.to]?.name || activeInput.to
        }
        value={activeInput.num}
      />

      {/* Tabs for Categories */}
      <TabSlider
        tabs={CATEGORY_TABS}
        activeId={category}
        onChange={(id) => {
          setCategory(id);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="Unit categories"
      />

      <div className={styles.calcCard}>
        {/* Input & Unit selectors */}
        <div className={styles.inputGrid}>
          {/* Value input */}
          <div className={styles.formGroup}>
            <label htmlFor={idVal} className={styles.label}>
              {category === 'length' ? 'Value (or 5\' 10")' : 'Value to Convert'}
            </label>
            <input
              id={idVal}
              type="text"
              className={styles.input}
              value={activeInput.valStr}
              onChange={(e) => {
                const v = e.target.value;
                if (category === 'length') setLengthVal(v);
                else if (category === 'weight') setWeightVal(v);
                else if (category === 'volume') setVolumeVal(v);
                else if (category === 'area') setAreaVal(v);
                else if (category === 'temperature') setTempVal(v);
                else if (category === 'speed') setSpeedVal(v);
              }}
              placeholder="e.g. 10"
            />
          </div>

          {/* From Unit */}
          <div className={styles.formGroup}>
            <label htmlFor={idFrom} className={styles.label}>
              From Unit
            </label>
            {category === 'temperature' ? (
              <select
                id={idFrom}
                className={styles.select}
                value={tempFrom}
                onChange={(e) => setTempFrom(e.target.value as TemperatureUnit)}
              >
                <option value="c">Celsius (°C)</option>
                <option value="f">Fahrenheit (°F)</option>
                <option value="k">Kelvin (K)</option>
              </select>
            ) : (
              <select
                id={idFrom}
                className={styles.select}
                value={activeInput.from}
                onChange={(e) => {
                  const v = e.target.value;
                  if (category === 'length') setLengthFrom(v);
                  else if (category === 'weight') setWeightFrom(v);
                  else if (category === 'volume') setVolumeFrom(v);
                  else if (category === 'area') setAreaFrom(v);
                  else if (category === 'speed') setSpeedFrom(v);
                }}
              >
                {Object.values(currentUnits).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Swap Button */}
          <button
            type="button"
            className={styles.swapBtn}
            onClick={handleSwap}
            title="Swap Units"
            aria-label="Swap from and to units"
          >
            ⇄
          </button>

          {/* To Unit */}
          <div className={styles.formGroup}>
            <label htmlFor={idTo} className={styles.label}>
              To Unit
            </label>
            {category === 'temperature' ? (
              <select
                id={idTo}
                className={styles.select}
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value as TemperatureUnit)}
              >
                <option value="c">Celsius (°C)</option>
                <option value="f">Fahrenheit (°F)</option>
                <option value="k">Kelvin (K)</option>
              </select>
            ) : (
              <select
                id={idTo}
                className={styles.select}
                value={activeInput.to}
                onChange={(e) => {
                  const v = e.target.value;
                  if (category === 'length') setLengthTo(v);
                  else if (category === 'weight') setWeightTo(v);
                  else if (category === 'volume') setVolumeTo(v);
                  else if (category === 'area') setAreaTo(v);
                  else if (category === 'speed') setSpeedTo(v);
                }}
              >
                {Object.values(currentUnits).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Controls row: Mode for temp & Precision */}
        <div className={styles.controlsRow}>
          {category === 'temperature' && (
            <div className={styles.segmentedControl} role="radiogroup" aria-label="Temperature mode">
              <button
                type="button"
                role="radio"
                aria-checked={tempMode === 'point'}
                className={`${styles.segBtn} ${tempMode === 'point' ? styles.segBtnActive : ''}`}
                onClick={() => setTempMode('point')}
              >
                Temperature Point (e.g. 68 °F)
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={tempMode === 'diff'}
                className={`${styles.segBtn} ${tempMode === 'diff' ? styles.segBtnActive : ''}`}
                onClick={() => setTempMode('diff')}
              >
                Difference / Rise (Δ 10 °C = 18 °F)
              </button>
            </div>
          )}

          <div className={styles.segmentedControl} role="radiogroup" aria-label="Display precision">
            {[2, 4, 6].map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={decimals === p}
                className={`${styles.segBtn} ${decimals === p ? styles.segBtnActive : ''}`}
                onClick={() => setDecimals(p)}
              >
                {p} Decimals
              </button>
            ))}
          </div>
        </div>

        {/* Hero Card Result */}
        {conversionResult && (
          <div className={styles.heroCard}>
            <span className={styles.heroLabel}>
              Converted Result &bull; {conversionResult.fromUnit} to {conversionResult.toUnit}
            </span>
            <div className={styles.heroValue}>
              {conversionResult.formattedResult}{' '}
              {category === 'temperature'
                ? tempTo.toUpperCase() === 'C'
                  ? '°C'
                  : tempTo.toUpperCase() === 'F'
                  ? '°F'
                  : 'K'
                : currentUnits[activeInput.to]?.symbol || ''}
            </div>
            <p className={styles.heroExplanation}>{conversionResult.explanation}</p>

            <div className={styles.pitfallBox}>
              <span className={styles.pitfallIcon}>⚠</span>
              <span>{getPitfallText()}</span>
            </div>
          </div>
        )}

        {/* All Units in Category Grid */}
        {conversionResult && (
          <div className={styles.allUnitsSection}>
            <span className={styles.sectionHeading}>
              All {category.charAt(0).toUpperCase() + category.slice(1)} Units at a Glance
            </span>
            <div className={styles.unitsGrid}>
              {conversionResult.allConversions.map((item) => (
                <div
                  key={item.unit}
                  className={`${styles.unitCard} ${
                    item.unit === conversionResult.toUnit ? styles.unitCardActive : ''
                  }`}
                >
                  <span className={styles.unitCardTitle}>{item.unit}</span>
                  <span className={styles.unitCardVal}>
                    {item.formatted} {item.symbol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversion Chart Table */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <span className={styles.sectionHeading}>Quick Reference Conversion Chart (1 to 10)</span>
            <button type="button" className={styles.csvBtn} onClick={downloadChartCSV}>
              {copyStatus || 'Export CSV (RFC 4180)'}
            </button>
          </div>

          <div className={styles.chartScroll}>
            <table className={styles.chartTable}>
              <thead>
                <tr>
                  <th>
                    {conversionResult?.fromUnit} (
                    {category === 'temperature'
                      ? tempFrom.toUpperCase()
                      : currentUnits[activeInput.from]?.symbol}
                    )
                  </th>
                  <th>
                    {conversionResult?.toUnit} (
                    {category === 'temperature'
                      ? tempTo.toUpperCase()
                      : currentUnits[activeInput.to]?.symbol}
                    )
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartRows.map((row) => (
                  <tr key={row.from}>
                    <td>{row.from}</td>
                    <td>{row.toFormatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
