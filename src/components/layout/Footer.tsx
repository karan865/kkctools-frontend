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
          {/* Column 1: Tools */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Tools</span>
            <ul className={styles.linkList}>
              <li>
                <Link href="/band-name-generator/" className={styles.link}>
                  Band Name Generator
                </Link>
              </li>
              <li>
                <Link href="/construction-estimate-template/" className={styles.link}>
                  Construction Estimate Template
                </Link>
              </li>
              <li>
                <Link href="/asphalt-calculator/" className={styles.link}>
                  Asphalt Calculator
                </Link>
              </li>
              <li>
                <Link href="/cubic-yard-calculator/" className={styles.link}>
                  Cubic Yard Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/" className={styles.link}>
                  All Tools Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Genres */}
          <div className={styles.column}>
            <span className={styles.colTitle}>Genres</span>
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
                  Heavy Metal Band Names
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
                  Random Band Names
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
                  How to Choose a Band Name
                </Link>
              </li>
              <li>
                <Link href="/guides/band-name-ideas-by-genre/" className={styles.link}>
                  Band Name Ideas by Genre
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-check-if-a-band-name-is-taken/" className={styles.link}>
                  Check If a Name Is Taken
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
            Disclaimer: All generated band names are provided for creative inspiration only. Availability searches on third-party platforms do not constitute legal clearance or trademark guarantees.
          </p>
          <p className={styles.copyright}>
            © {currentYear} {SITE_NAME}. Free browser tools built for musicians and creators.
          </p>
        </div>
      </div>
    </footer>
  );
}

