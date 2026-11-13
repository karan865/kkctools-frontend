import React from 'react';
import Link from 'next/link';
import ToolSearch from './ToolSearch';
import Icon from '@/components/icons/Icons';
import styles from './HomeHero.module.css';

export default function HomeHero() {
  return (
    <section className={styles.heroSection}>
      {/* Decorative CSS Mesh Blobs & Dot Grid */}
      <div className={styles.blobSky} aria-hidden="true" />
      <div className={styles.blobOrange} aria-hidden="true" />
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* Left Column: Text, Search, Chips & CTAs */}
          <div className={styles.leftCol}>
            {/* Announcement Pill */}
            <Link href="/concrete-calculator/" className={styles.announcementPill}>
              <span className={styles.pillBadge}>NEW</span>
              <span className={styles.pillText}>Concrete Calculator — slabs, footings &amp; bags</span>
              <Icon name="arrowRight" size={14} className={styles.pillArrow} />
            </Link>

            {/* Instant LCP H1 Heading */}
            <h1 className={styles.heading}>
              Free Construction <span className={styles.headingAccent}>Calculators</span> &amp; Everyday Tools
            </h1>

            {/* Instant LCP Lead Paragraph */}
            <p className={styles.lead}>
              Work out concrete, gravel, lumber, paint and more in seconds. Every tool is free, requires no sign-up, and runs private in your browser.
            </p>

            {/* Single Unified Search Box */}
            <div className={styles.searchWrapper}>
              <ToolSearch mode="inline" />
            </div>

            {/* Category Quick Chips */}
            <div className={styles.chipsScroll}>
              <a href="#concrete" className={styles.chip}>
                <span className={`${styles.chipDot} ${styles.dotConcrete}`} />
                <span>Concrete</span>
              </a>
              <a href="#gravel" className={styles.chip}>
                <span className={`${styles.chipDot} ${styles.dotGravel}`} />
                <span>Gravel &amp; Sand</span>
              </a>
              <a href="#earthwork" className={styles.chip}>
                <span className={`${styles.chipDot} ${styles.dotEarthwork}`} />
                <span>Asphalt &amp; Dirt</span>
              </a>
              <a href="#framing" className={styles.chip}>
                <span className={`${styles.chipDot} ${styles.dotFraming}`} />
                <span>Framing &amp; Roof</span>
              </a>
              <a href="#finishes" className={styles.chip}>
                <span className={`${styles.chipDot} ${styles.dotFinishes}`} />
                <span>Tile &amp; Paint</span>
              </a>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Link href="/tools/" className={styles.btnPrimary}>
                Browse all 22 tools →
              </Link>
              <Link href="/concrete-calculator/" className={styles.btnSecondary}>
                Try Concrete Calculator
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Live Result Cards (≥ 768px) */}
          <div className={styles.rightCol} aria-hidden="true">
            <div className={`${styles.glassCard} ${styles.cardTop}`}>
              <div className={styles.glassHeader}>
                <span className={styles.glassIconSky}>
                  <Icon name="slab" size={18} />
                </span>
                <span className={styles.glassLabel}>Concrete Slab (10×10 ft)</span>
              </div>
              <div className={styles.glassValue}>1.23 yd³</div>
              <div className={styles.glassMeta}>≈ 56 × 80 lb bags (pre-mixed)</div>
            </div>

            <div className={`${styles.glassCard} ${styles.cardMiddle}`}>
              <div className={styles.glassHeader}>
                <span className={styles.glassIconAmber}>
                  <Icon name="road" size={18} />
                </span>
                <span className={styles.glassLabel}>Driveway Asphalt (20×30 ft)</span>
              </div>
              <div className={styles.glassValue}>7.25 Tons</div>
              <div className={styles.glassMeta}>Standard 2-inch compacted top coat</div>
            </div>

            <div className={`${styles.glassCard} ${styles.cardBottom}`}>
              <div className={styles.glassHeader}>
                <span className={styles.glassIconOrange}>
                  <Icon name="roofTruss" size={18} />
                </span>
                <span className={styles.glassLabel}>Roof Rafter Pitch (4/12)</span>
              </div>
              <div className={styles.glassValue}>18.4° Angle</div>
              <div className={styles.glassMeta}>Plumb cut 71.6° · Level cut 18.4°</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

