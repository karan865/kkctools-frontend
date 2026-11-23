import React from 'react';
import styles from './GallonsInputGuide.module.css';

interface GallonsInputGuideProps {
  tab: 'convert' | 'dimensions' | 'table';
}

export default function GallonsInputGuide({ tab }: GallonsInputGuideProps) {
  if (tab === 'dimensions') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Calculate Volume From Container Dimensions</div>
        <div className={styles.shapesGrid}>
          <div className={styles.shapeCard}>
            <div className={styles.shapeIcon}>📦</div>
            <div className={styles.shapeTitle}>Rectangular Box / Tank</div>
            <div className={styles.shapeFormula}>Volume = Length × Width × Height</div>
            <div className={styles.shapeDesc}>Aquariums, ponds, raised beds &amp; planters</div>
          </div>
          <div className={styles.shapeCard}>
            <div className={styles.shapeIcon}>🛢️</div>
            <div className={styles.shapeTitle}>Cylinder / Round Tank</div>
            <div className={styles.shapeFormula}>Volume = π × (Diameter ÷ 2)² × Height</div>
            <div className={styles.shapeDesc}>Drums, hot tubs, circular pools &amp; barrels</div>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'table') {
    return (
      <div className={styles.diagramWrapper} aria-hidden="true">
        <div className={styles.title}>Reference Conversion Table &amp; Range Generator</div>
        <div className={styles.tableNotes}>
          <span>✓ Select any range (1–1,000)</span>
          <span>·</span>
          <span>✓ Custom step sizes</span>
          <span>·</span>
          <span>✓ One-click Copy CSV</span>
          <span>·</span>
          <span>✓ Print stylesheet ready</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Exact Volume Relationship (NIST Handbook 44)</div>
      <div className={styles.ratioBanner}>
        <div className={styles.cubeBox}>
          <div className={styles.cubeVisual}>1 ft³</div>
          <div className={styles.cubeSub}>1,728 in³</div>
        </div>

        <div className={styles.equalsSign}>=</div>

        <div className={styles.jugsBox}>
          <div className={styles.jugsVisual}>7.48052 US Gallons</div>
          <div className={styles.jugsSub}>231 in³ per gallon · 28.32 Litres</div>
        </div>

        <div className={styles.reciprocalBox}>
          <div className={styles.recipTag}>RECIPROCAL</div>
          <div className={styles.recipVal}>1 US gal = 0.133681 ft³</div>
        </div>
      </div>

      <div className={styles.chipsRow}>
        <span className={styles.chip}>1 US gal = 231 in³</span>
        <span className={styles.chip}>1 ft³ = 28.3168 L</span>
        <span className={styles.chip}>1 m³ = 264.172 US gal</span>
        <span className={styles.chip}>1 Imperial gal = 4.54609 L</span>
      </div>
    </div>
  );
}
