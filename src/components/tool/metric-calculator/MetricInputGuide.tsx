'use client';

import React from 'react';
import styles from './MetricCalculator.module.css';
import { UnitCategory } from '@/lib/metric-engine';

interface MetricInputGuideProps {
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
  value: number;
}

export default function MetricInputGuide({
  category,
  fromUnit,
  toUnit,
  value,
}: MetricInputGuideProps) {
  return (
    <div className={styles.guideWrapper} aria-label="NIST exact conversion visual guide">
      <div className={styles.guideHeader}>
        <span className={styles.guideBadge}>NIST SP 811 &amp; HB 44 STANDARDS</span>
        <span className={styles.guideTitle}>
          {category === 'length' && 'Length Calibration & Dual Metric/Imperial Ruler'}
          {category === 'weight' && 'Avoirdupois Mass vs International Kilogram Standards'}
          {category === 'volume' && 'US Liquid vs Imperial Volume Capacities'}
          {category === 'area' && 'Two-Dimensional Quadrilateral Area Scaling (Squared Factors)'}
          {category === 'temperature' && 'Thermodynamic Scale: Absolute Point vs Delta Difference'}
          {category === 'speed' && 'Velocity & Transportation Rate Transitions'}
        </span>
      </div>

      <div className={styles.diagramGrid}>
        {category === 'length' && (
          <div className={styles.guideVisual}>
            <div className={styles.rulerContainer}>
              <div className={styles.rulerImperial}>
                <span className={styles.rulerLabel}>Inches / Feet</span>
                <div className={styles.rulerTicks}>
                  <span>0&quot;</span>
                  <span>1&quot;</span>
                  <span>2&quot;</span>
                  <span>3&quot;</span>
                  <span>4&quot;</span>
                  <span>5&quot;</span>
                </div>
              </div>
              <div className={styles.rulerCenterLine}>
                <span className={styles.exactTag}>1 in &equiv; 2.54 cm (Exact 1959 NIST definition)</span>
              </div>
              <div className={styles.rulerMetric}>
                <div className={styles.rulerTicks}>
                  <span>0 cm</span>
                  <span>2.54</span>
                  <span>5.08</span>
                  <span>7.62</span>
                  <span>10.16</span>
                  <span>12.7</span>
                </div>
                <span className={styles.rulerLabel}>Centimetres / Metres</span>
              </div>
            </div>
          </div>
        )}

        {category === 'weight' && (
          <div className={styles.guideVisual}>
            <div className={styles.balanceVisual}>
              <div className={styles.balancePan}>
                <span className={styles.panLabel}>Imperial Avoirdupois</span>
                <span className={styles.panValue}>1 lb (Pound)</span>
              </div>
              <div className={styles.balanceBeam}>
                <span className={styles.fulcrum}>&Delta;</span>
                <span className={styles.balanceEq}>&equiv;</span>
              </div>
              <div className={styles.balancePan}>
                <span className={styles.panLabel}>Metric SI Standard</span>
                <span className={styles.panValue}>0.45359237 kg</span>
              </div>
            </div>
          </div>
        )}

        {category === 'volume' && (
          <div className={styles.guideVisual}>
            <div className={styles.volumeVisual}>
              <div className={styles.jugBox}>
                <span className={styles.jugTitle}>US Liquid Gallon</span>
                <span className={styles.jugVal}>231 in&sup3; &bull; 3.785 L</span>
              </div>
              <div className={styles.volumeCompare}>
                <span className={styles.compareBadge}>A US gallon is 16.7% smaller than an imperial gallon</span>
              </div>
              <div className={styles.jugBox}>
                <span className={styles.jugTitle}>Imperial Gallon</span>
                <span className={styles.jugVal}>277.42 in&sup3; &bull; 4.546 L</span>
              </div>
            </div>
          </div>
        )}

        {category === 'area' && (
          <div className={styles.guideVisual}>
            <div className={styles.areaVisual}>
              <div className={styles.areaBox}>
                <span className={styles.areaDim}>1 ft &times; 1 ft</span>
                <span className={styles.areaVal}>1 ft&sup2;</span>
              </div>
              <div className={styles.areaArrow}>&rarr; squared factor &rarr;</div>
              <div className={styles.areaBox}>
                <span className={styles.areaDim}>0.3048 m &times; 0.3048 m</span>
                <span className={styles.areaVal}>0.09290304 m&sup2; (exact)</span>
              </div>
            </div>
          </div>
        )}

        {category === 'temperature' && (
          <div className={styles.guideVisual}>
            <div className={styles.tempVisual}>
              <div className={styles.tempScale}>
                <span className={styles.tempTitle}>Absolute Reading</span>
                <code>10 &deg;C = 50 &deg;F (cold day)</code>
              </div>
              <div className={styles.tempDivider}>vs</div>
              <div className={styles.tempScale}>
                <span className={styles.tempTitle}>Relative Difference (&Delta;)</span>
                <code>10 &deg;C rise = 18 &deg;F rise (factor 1.8)</code>
              </div>
            </div>
          </div>
        )}

        {category === 'speed' && (
          <div className={styles.guideVisual}>
            <div className={styles.speedVisual}>
              <div className={styles.speedItem}>
                <span>60 mph</span>
                <small>US Highway</small>
              </div>
              <div className={styles.speedDivider}>&harr;</div>
              <div className={styles.speedItem}>
                <span>96.56 km/h</span>
                <small>Metric Equivalent</small>
              </div>
              <div className={styles.speedDivider}>&harr;</div>
              <div className={styles.speedItem}>
                <span>26.82 m/s</span>
                <small>SI Base Velocity</small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.guideFooter}>
        <span className={styles.legendTitle}>Active Selection:</span>
        <span className={styles.currentPair}>
          Converting <strong>{value}</strong> from <em>{fromUnit}</em> to <em>{toUnit}</em>
        </span>
      </div>
    </div>
  );
}
