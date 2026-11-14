import React from 'react';
import Link from 'next/link';
import Icon from '@/components/icons/Icons';
import { SITE_NAME } from '@/config/site';
import { TOOLS_CATALOG } from '@/lib/tools-catalog';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Top Band */}
      <div className={styles.topBand}>
        <div className={styles.topBandContainer}>
          <div className={styles.topBandText}>
            <span className={styles.topBandIcon}>
              <Icon name="zap" size={16} />
            </span>
            <span>Free construction calculators, material estimators &amp; utilities for builders, DIYers and creators.</span>
          </div>
          <div className={styles.topBandActions}>
            <Link href="/tools/" className={styles.topBandBtn}>
              All {TOOLS_CATALOG.length} tools directory
            </Link>
            <a
              href="mailto:kkchub1@gmail.com?subject=Tool%20Suggestion%20for%20KKC%20Tools"
              className={styles.topBandBtnSecondary}
            >
              Suggest a tool
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand & Core Commitments (2 cols desktop) */}
          <div className={`${styles.column} ${styles.brandCol}`}>
            <Link href="/" className={styles.brand} aria-label={`${SITE_NAME} Home`}>
              <div className={styles.brandBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

            <p className={styles.brandDesc}>
              Fast, privacy-first online calculators for construction, materials, hardscaping, and creative naming. Built with zero tracking and real-world math.
            </p>

            <ul className={styles.trustList}>
              <li>
                <span className={styles.trustCheck}>✓</span> 100% Free &amp; Open
              </li>
              <li>
                <span className={styles.trustCheck}>✓</span> Zero Mandatory Sign-Up
              </li>
              <li>
                <span className={styles.trustCheck}>✓</span> Private Client-Side Compute
              </li>
            </ul>

            <a href="#main-content" className={styles.backToTop}>
              ↑ Back to top
            </a>
          </div>

          {/* Column 2: Concrete & Masonry */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Concrete &amp; Masonry</span>
            <ul className={styles.linkList}>
              <li><Link href="/concrete-calculator/" className={styles.link}>Concrete Calculator</Link></li>
              <li><Link href="/rebar-calculator/" className={styles.link}>Rebar Calculator</Link></li>
              <li><Link href="/cubic-yard-calculator/" className={styles.link}>Cubic Yard Calculator</Link></li>
              <li><Link href="/cinder-block-calculator/" className={styles.link}>Cinder Block Calculator</Link></li>
              <li><Link href="/brick-calculator/" className={styles.link}>Brick Calculator</Link></li>
            </ul>
          </div>

          {/* Column 3: Gravel, Earth & Paving */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Gravel, Earth &amp; Paving</span>
            <ul className={styles.linkList}>
              <li><Link href="/stone-calculator/" className={styles.link}>Stone &amp; Rock</Link></li>
              <li><Link href="/sand-calculator/" className={styles.link}>Sand Calculator</Link></li>
              <li><Link href="/paver-base-calculator/" className={styles.link}>Paver Base</Link></li>
              <li><Link href="/paver-sand-calculator/" className={styles.link}>Paver Sand</Link></li>
              <li><Link href="/asphalt-calculator/" className={styles.link}>Asphalt Calculator</Link></li>
              <li><Link href="/fill-dirt-calculator/" className={styles.link}>Fill Dirt &amp; Topsoil</Link></li>
              <li><Link href="/compost-calculator/" className={styles.link}>Compost Calculator</Link></li>
              <li><Link href="/lawn-mowing-cost-calculator/" className={styles.link}>Lawn Mowing Cost</Link></li>
              <li><Link href="/tons-to-cubic-yards/" className={styles.link}>Tons ↔ Yards</Link></li>
              <li><Link href="/pipe-volume-calculator/" className={styles.link}>Pipe Volume</Link></li>
            </ul>
          </div>

          {/* Column 4: Framing & Finishes */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Framing &amp; Finishes</span>
            <ul className={styles.linkList}>
              <li><Link href="/rafter-calculator/" className={styles.link}>Rafter Calculator</Link></li>
              <li><Link href="/shingle-calculator/" className={styles.link}>Shingle Roof Calculator</Link></li>
              <li><Link href="/board-and-batten-calculator/" className={styles.link}>Board and Batten</Link></li>
              <li><Link href="/wire-gauge-calculator/" className={styles.link}>Wire Gauge</Link></li>
              <li><Link href="/stud-calculator/" className={styles.link}>Stud Framing</Link></li>
              <li><Link href="/square-footage-calculator/" className={styles.link}>Square Footage</Link></li>
              <li><Link href="/linear-foot-calculator/" className={styles.link}>Linear Foot</Link></li>
              <li><Link href="/drywall-calculator/" className={styles.link}>Drywall Calculator</Link></li>
              <li><Link href="/tile-calculator/" className={styles.link}>Tile Calculator</Link></li>
              <li><Link href="/laminate-flooring-calculator/" className={styles.link}>Laminate Flooring</Link></li>
              <li><Link href="/paint-cost-calculator/" className={styles.link}>Paint Cost</Link></li>
              <li><Link href="/fence-stain-calculator/" className={styles.link}>Fence Stain</Link></li>
            </ul>
          </div>

          {/* Column 5: More Tools & Utilities (Chhoti Cheez 2 Fix) */}
          <div className={styles.column}>
            <span className={styles.colTitle}>More Utilities</span>
            <ul className={styles.linkList}>
              <li><Link href="/construction-estimate-template/" className={styles.link}>Estimate Template (PDF)</Link></li>
              <li><Link href="/band-name-generator/" className={styles.link}>Band Name Generator</Link></li>
              <li><Link href="/tools/" className={styles.link}>All Tools Directory</Link></li>
              <li>
                <a
                  href="mailto:kkchub1@gmail.com?subject=Tool%20Suggestion"
                  className={styles.link}
                >
                  Suggest a Tool →
                </a>
              </li>
            </ul>
          </div>

          {/* Column 6: Company & Editorial */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Company &amp; Legal</span>
            <ul className={styles.linkList}>
              <li><Link href="/about/" className={styles.link}>About Us</Link></li>
              <li><Link href="/guides/" className={styles.link}>Guides &amp; Articles</Link></li>
              <li><Link href="/contact/" className={styles.link}>Contact &amp; Support</Link></li>
              <li><Link href="/privacy-policy/" className={styles.link}>Privacy Policy</Link></li>
              <li><Link href="/terms/" className={styles.link}>Terms of Service</Link></li>
              <li><Link href="/disclaimer/" className={styles.link}>Disclaimer</Link></li>
              <li><Link href="/site-map/" className={styles.link}>Site Map</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} {SITE_NAME}. Free calculators for planning estimates only — verify with local building codes, trade suppliers and structural engineers.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy/" className={styles.bottomLink}>Privacy</Link>
            <span className={styles.dot}>·</span>
            <Link href="/terms/" className={styles.bottomLink}>Terms</Link>
            <span className={styles.dot}>·</span>
            <Link href="/disclaimer/" className={styles.bottomLink}>Disclaimer</Link>
            <span className={styles.dot}>·</span>
            <Link href="/site-map/" className={styles.bottomLink}>Site Map</Link>
            <span className={styles.dot}>·</span>
            <Link href="/contact/" className={styles.bottomLink}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
