import React from 'react';
import Link from 'next/link';
import { SITE_NAME } from '@/config/site';
import { TOOLS_CATALOG } from '@/lib/tools-catalog';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand & Value Header */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLeft}>
            <Link href="/" className={styles.brand} aria-label={`${SITE_NAME} Home`}>
              <div className={styles.brandBadge}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                    fill="url(#footerBrandGrad)"
                    stroke="var(--brand-orange)"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="footerBrandGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className={styles.brandText}>{SITE_NAME}</span>
            </Link>
            <span className={styles.brandTagline}>
              Fast, privacy-first calculators for builders, trades, engineers, and creators.
            </span>
          </div>

          <div className={styles.trustBadges}>
            <span className={styles.trustBadge}>
              <span className={styles.trustCheck}>✓</span> 100% Free
            </span>
            <span className={styles.trustBadge}>
              <span className={styles.trustCheck}>✓</span> Zero Sign-Up
            </span>
            <span className={styles.trustBadge}>
              <span className={styles.trustCheck}>✓</span> Private Client-Side
            </span>
          </div>

          <div className={styles.brandActions}>
            <Link href="/tools/" className={styles.allToolsBtn}>
              All {TOOLS_CATALOG.length} Tools Directory →
            </Link>
            <a
              href="mailto:kkchub1@gmail.com?subject=Tool%20Suggestion%20for%20KKC%20Tools"
              className={styles.suggestBtn}
            >
              Suggest a Tool
            </a>
          </div>
        </div>

        {/* 6 Balanced Category Columns (Max 7-8 links per column) */}
        <div className={styles.grid}>
          {/* Column 1: Concrete & Masonry */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Concrete &amp; Masonry</span>
            <ul className={styles.linkList}>
              <li><Link href="/concrete-calculator/" className={styles.link}>Concrete Calculator</Link></li>
              <li><Link href="/concrete-slab-cost-calculator/" className={styles.link}>Concrete Slab Cost</Link></li>
              <li><Link href="/rebar-calculator/" className={styles.link}>Rebar Calculator</Link></li>
              <li><Link href="/cubic-yard-calculator/" className={styles.link}>Cubic Yard Calculator</Link></li>
              <li><Link href="/cinder-block-calculator/" className={styles.link}>Cinder Block Calculator</Link></li>
              <li><Link href="/brick-calculator/" className={styles.link}>Brick Calculator</Link></li>
            </ul>
            <Link href="/tools/#concrete" className={styles.viewAllLink}>
              All Concrete Tools →
            </Link>
          </div>

          {/* Column 2: Gravel, Earth & Paving */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Gravel &amp; Earthwork</span>
            <ul className={styles.linkList}>
              <li><Link href="/stone-calculator/" className={styles.link}>Gravel &amp; Rock</Link></li>
              <li><Link href="/sand-calculator/" className={styles.link}>Sand Calculator</Link></li>
              <li><Link href="/paver-base-calculator/" className={styles.link}>Paver Base</Link></li>
              <li><Link href="/paver-sand-calculator/" className={styles.link}>Paver Sand</Link></li>
              <li><Link href="/asphalt-calculator/" className={styles.link}>Asphalt Calculator</Link></li>
              <li><Link href="/fill-dirt-calculator/" className={styles.link}>Fill Dirt &amp; Topsoil</Link></li>
              <li><Link href="/tons-to-cubic-yards/" className={styles.link}>Tons ↔ Yards</Link></li>
            </ul>
            <Link href="/tools/#gravel" className={styles.viewAllLink}>
              All Earthwork Tools →
            </Link>
          </div>

          {/* Column 3: Framing & Finishes */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Framing &amp; Finishes</span>
            <ul className={styles.linkList}>
              <li><Link href="/drywall-calculator/" className={styles.link}>Drywall Calculator</Link></li>
              <li><Link href="/paint-cost-calculator/" className={styles.link}>Paint Cost</Link></li>
              <li><Link href="/shingle-calculator/" className={styles.link}>Shingle Roofing</Link></li>
              <li><Link href="/tile-calculator/" className={styles.link}>Tile Calculator</Link></li>
              <li><Link href="/stud-calculator/" className={styles.link}>Stud Framing</Link></li>
              <li><Link href="/square-footage-calculator/" className={styles.link}>Square Footage</Link></li>
              <li><Link href="/deck-cost-calculator/" className={styles.link}>Deck Cost Calculator</Link></li>
            </ul>
            <Link href="/tools/#framing" className={styles.viewAllLink}>
              All Framing Tools →
            </Link>
          </div>

          {/* Column 4: Finance & Business */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Finance &amp; Business</span>
            <ul className={styles.linkList}>
              <li><Link href="/invoice-generator/" className={styles.link}>Invoice Generator</Link></li>
              <li><Link href="/self-employment-tax-calculator/" className={styles.link}>Self-Employment Tax</Link></li>
              <li><Link href="/compound-interest-calculator/" className={styles.link}>Compound Interest</Link></li>
              <li><Link href="/credit-card-payoff-calculator/" className={styles.link}>Credit Card Payoff</Link></li>
              <li><Link href="/sba-loan-calculator/" className={styles.link}>SBA Loan Calculator</Link></li>
              <li><Link href="/rental-property-calculator/" className={styles.link}>Rental Property</Link></li>
              <li><Link href="/profit-margin-calculator/" className={styles.link}>Profit Margin</Link></li>
            </ul>
            <Link href="/tools/#business" className={styles.viewAllLink}>
              All Finance Tools →
            </Link>
          </div>

          {/* Column 5: 3D Printing & CNC */}
          <div className={styles.column}>
            <span className={styles.colTitle}>3D Printing &amp; CNC</span>
            <ul className={styles.linkList}>
              <li><Link href="/3d-print-cost-calculator/" className={styles.link}>3D Print Cost</Link></li>
              <li><Link href="/speeds-and-feeds-calculator/" className={styles.link}>Speeds &amp; Feeds</Link></li>
              <li><Link href="/sfm-to-rpm-calculator/" className={styles.link}>SFM to RPM</Link></li>
              <li><Link href="/pulley-calculator/" className={styles.link}>Pulley Ratio &amp; Speed</Link></li>
              <li><Link href="/steps-per-mm-calculator/" className={styles.link}>Steps per mm</Link></li>
              <li><Link href="/thread-pitch-diameter-calculator/" className={styles.link}>Thread Pitch</Link></li>
              <li><Link href="/epoxy-table-calculator/" className={styles.link}>Epoxy River Table</Link></li>
            </ul>
            <Link href="/tools/#engineering" className={styles.viewAllLink}>
              All CNC &amp; 3D Tools →
            </Link>
          </div>

          {/* Column 6: Math & Statistics */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Math &amp; Statistics</span>
            <ul className={styles.linkList}>
              <li><Link href="/ratio-calculator/" className={styles.link}>Ratio Calculator</Link></li>
              <li><Link href="/standard-deviation-calculator/" className={styles.link}>Standard Deviation</Link></li>
              <li><Link href="/t-test-calculator/" className={styles.link}>T-Test Calculator</Link></li>
              <li><Link href="/cagr-calculator/" className={styles.link}>CAGR Calculator</Link></li>
              <li><Link href="/ab-test-significance-calculator/" className={styles.link}>A/B Test Stat Sig</Link></li>
              <li><Link href="/iqr-calculator/" className={styles.link}>IQR Calculator</Link></li>
              <li><Link href="/reverse-sales-tax-calculator/" className={styles.link}>Reverse Sales Tax</Link></li>
            </ul>
            <Link href="/tools/#math" className={styles.viewAllLink}>
              All Math Tools →
            </Link>
          </div>

          {/* Column 7: Text & Writing */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Text &amp; Writing</span>
            <ul className={styles.linkList}>
              <li><Link href="/sentence-counter/" className={styles.link}>Sentence Counter</Link></li>
              <li><Link href="/numbers-to-words/" className={styles.link}>Numbers to Words</Link></li>
              <li><Link href="/reading-time-calculator/" className={styles.link}>Reading Time</Link></li>
              <li><Link href="/word-counter/" className={styles.link}>Word Counter</Link></li>
              <li><Link href="/twitter-character-counter/" className={styles.link}>Twitter (X) Counter</Link></li>
              <li><Link href="/words-to-pages/" className={styles.link}>Words to Pages</Link></li>
              <li><Link href="/character-counter/" className={styles.link}>Character Counter</Link></li>
            </ul>
            <Link href="/tools/#writing" className={styles.viewAllLink}>
              All Writing Tools →
            </Link>
          </div>

          {/* Column 8: Developer & Web */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Developer &amp; Web</span>
            <ul className={styles.linkList}>
              <li><Link href="/password-generator/" className={styles.link}>Password Generator</Link></li>
              <li><Link href="/password-strength-checker/" className={styles.link}>Password Strength</Link></li>
              <li><Link href="/uuid-generator/" className={styles.link}>UUID / GUID Generator</Link></li>
              <li><Link href="/passphrase-generator/" className={styles.link}>Passphrase Generator</Link></li>
              <li><Link href="/hacker-name-generator/" className={styles.link}>Hacker Name Generator</Link></li>
            </ul>
            <Link href="/tools/#developer" className={styles.viewAllLink}>
              All Developer Tools →
            </Link>
          </div>
        </div>

        {/* Company & Legal Ribbon */}
        <div className={styles.companyRibbon}>
          <nav className={styles.companyNav} aria-label="Footer Company & Legal Navigation">
            <Link href="/about/" className={styles.companyLink}>About Us</Link>
            <span className={styles.dot}>·</span>
            <Link href="/guides/" className={styles.companyLink}>Guides &amp; Articles</Link>
            <span className={styles.dot}>·</span>
            <Link href="/contact/" className={styles.companyLink}>Contact &amp; Support</Link>
            <span className={styles.dot}>·</span>
            <Link href="/site-map/" className={styles.companyLink}>Site Map</Link>
            <span className={styles.dot}>·</span>
            <Link href="/privacy-policy/" className={styles.companyLink}>Privacy Policy</Link>
            <span className={styles.dot}>·</span>
            <Link href="/terms/" className={styles.companyLink}>Terms of Service</Link>
            <span className={styles.dot}>·</span>
            <Link href="/disclaimer/" className={styles.companyLink}>Disclaimer</Link>
          </nav>

          <a href="#main-content" className={styles.backToTop}>
            ↑ Back to top
          </a>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} {SITE_NAME}. Free calculators for planning estimates only — verify with local building codes, trade suppliers and structural engineers. All calculations run client-side in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
