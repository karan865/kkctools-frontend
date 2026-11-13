import React from 'react';
import Link from 'next/link';
import { SITE_NAME } from '@/config/site';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Categorized Tools Grid */}
          <div className={`${styles.column} ${styles.toolsColSpan}`}>
            <span className={styles.colTitle}>Calculators &amp; Tools</span>
            
            <div className={styles.toolsCategoriesGrid}>
              {/* Category: Aggregates & Volume */}
              <div className={styles.categoryGroup}>
                <span className={styles.categoryHeading}>Aggregates &amp; Earth</span>
                <ul className={styles.linkList}>
                  <li>
                    <Link href="/cubic-yard-calculator/" className={styles.link}>
                      Cubic Yard Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/concrete-calculator/" className={styles.link}>
                      Concrete Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tons-to-cubic-yards/" className={styles.link}>
                      Tons to Cubic Yards
                    </Link>
                  </li>
                  <li>
                    <Link href="/stone-calculator/" className={styles.link}>
                      Stone &amp; Rock Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/sand-calculator/" className={styles.link}>
                      Sand Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/fill-dirt-calculator/" className={styles.link}>
                      Fill Dirt Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/asphalt-calculator/" className={styles.link}>
                      Asphalt Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Category: Masonry & Framing */}
              <div className={styles.categoryGroup}>
                <span className={styles.categoryHeading}>Masonry &amp; Framing</span>
                <ul className={styles.linkList}>
                  <li>
                    <Link href="/brick-calculator/" className={styles.link}>
                      Brick Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/cinder-block-calculator/" className={styles.link}>
                      Cinder Block Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/stud-calculator/" className={styles.link}>
                      Stud Framing Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/rafter-calculator/" className={styles.link}>
                      Rafter Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/linear-foot-calculator/" className={styles.link}>
                      Linear Foot Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/square-footage-calculator/" className={styles.link}>
                      Square Footage Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Category: Finishes & Other Tools */}
              <div className={styles.categoryGroup}>
                <span className={styles.categoryHeading}>Finishes &amp; More</span>
                <ul className={styles.linkList}>
                  <li>
                    <Link href="/paint-cost-calculator/" className={styles.link}>
                      Paint Cost Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tile-calculator/" className={styles.link}>
                      Tile Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/laminate-flooring-calculator/" className={styles.link}>
                      Laminate Flooring
                    </Link>
                  </li>
                  <li>
                    <Link href="/construction-estimate-template/" className={styles.link}>
                      Estimate Template
                    </Link>
                  </li>
                  <li>
                    <Link href="/band-name-generator/" className={styles.link}>
                      Band Name Generator
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/" className={styles.allToolsLink}>
                      View All Tools →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 2: Creative & Music */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Music Genres</span>
            <ul className={styles.linkList}>
              <li>
                <Link href="/band-name-generator/rock/" className={styles.link}>
                  Rock Band Names
                </Link>
              </li>
              <li>
                <Link href="/band-name-generator/metal/" className={styles.link}>
                  Metal Band Names
                </Link>
              </li>
              <li>
                <Link href="/band-name-generator/heavy-metal/" className={styles.link}>
                  Heavy Metal Names
                </Link>
              </li>
              <li>
                <Link href="/band-name-generator/kpop/" className={styles.link}>
                  K-pop Band Names
                </Link>
              </li>
              <li>
                <Link href="/band-name-generator/boy-band/" className={styles.link}>
                  Boy Band Names
                </Link>
              </li>
              <li>
                <Link href="/band-name-generator/random/" className={styles.link}>
                  Random Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Guides */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Guides</span>
            <ul className={styles.linkList}>
              <li>
                <Link href="/guides/how-to-choose-a-band-name/" className={styles.link}>
                  How to Choose a Name
                </Link>
              </li>
              <li>
                <Link href="/guides/band-name-ideas-by-genre/" className={styles.link}>
                  Ideas by Genre
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-check-if-a-band-name-is-taken/" className={styles.link}>
                  Check Name Availability
                </Link>
              </li>
              <li>
                <Link href="/guides/" className={styles.link}>
                  All Guides Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Company</span>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about/" className={styles.link}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact/" className={styles.link}>
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className={styles.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms/" className={styles.link}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.disclaimer}>
            Disclaimer: All tools, formulas, and estimates are provided for planning and inspiration purposes only. Construction and structural projects should always be verified with local building codes, certified scale tickets, and qualified trade professionals.
          </p>
          <p className={styles.copyright}>
            © {currentYear} {SITE_NAME}. Free, fast, private online calculation tools.
          </p>
        </div>
      </div>
    </footer>
  );
}
