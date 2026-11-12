'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const firstFocusable = menuRef.current?.querySelector('a, button') as HTMLElement | null;
      firstFocusable?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
      <div
        className={styles.menu}
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.heading}>Navigation</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Calculators &amp; Tools</span>
            <Link href="/paver-sand-calculator/" className={styles.navLink} onClick={onClose}>
              🧱 Paver Sand Calculator
            </Link>
            <Link href="/paver-base-calculator/" className={styles.navLink} onClick={onClose}>
              🏗️ Paver Base Calculator
            </Link>
            <Link href="/compost-calculator/" className={styles.navLink} onClick={onClose}>
              🍂 Compost Calculator
            </Link>
            <Link href="/fence-stain-calculator/" className={styles.navLink} onClick={onClose}>
              🪵 Fence Stain Calculator
            </Link>
            <Link href="/tons-to-cubic-yards/" className={styles.navLink} onClick={onClose}>
              ⚖️ Tons to Cubic Yards
            </Link>
            <Link href="/stud-calculator/" className={styles.navLink} onClick={onClose}>
              🪚 Stud Framing Calculator
            </Link>
            <Link href="/stone-calculator/" className={styles.navLink} onClick={onClose}>
              🪨 Stone &amp; Gravel Calculator
            </Link>
            <Link href="/laminate-flooring-calculator/" className={styles.navLink} onClick={onClose}>
              🪵 Laminate Flooring Calculator
            </Link>
            <Link href="/tile-calculator/" className={styles.navLink} onClick={onClose}>
              📐 Tile Calculator
            </Link>
            <Link href="/paint-cost-calculator/" className={styles.navLink} onClick={onClose}>
              🎨 Paint Cost Calculator
            </Link>
            <Link href="/brick-calculator/" className={styles.navLink} onClick={onClose}>
              🧱 Brick Calculator
            </Link>
            <Link href="/cinder-block-calculator/" className={styles.navLink} onClick={onClose}>
              🧱 Cinder Block Calculator
            </Link>
            <Link href="/square-footage-calculator/" className={styles.navLink} onClick={onClose}>
              📐 Square Footage Calculator
            </Link>
            <Link href="/asphalt-calculator/" className={styles.navLink} onClick={onClose}>
              🚜 Asphalt Calculator
            </Link>
            <Link href="/cubic-yard-calculator/" className={styles.navLink} onClick={onClose}>
              📦 Cubic Yard Calculator
            </Link>
            <Link href="/sand-calculator/" className={styles.navLink} onClick={onClose}>
              🏖️ Sand Calculator
            </Link>
            <Link href="/fill-dirt-calculator/" className={styles.navLink} onClick={onClose}>
              🌱 Fill Dirt Calculator
            </Link>
            <Link href="/linear-foot-calculator/" className={styles.navLink} onClick={onClose}>
              📏 Linear Foot Calculator
            </Link>
            <Link href="/rafter-calculator/" className={styles.navLink} onClick={onClose}>
              🏠 Rafter Calculator
            </Link>
            <Link href="/construction-estimate-template/" className={styles.navLink} onClick={onClose}>
              📋 Construction Estimate Template
            </Link>
            <Link href="/band-name-generator/" className={styles.navLink} onClick={onClose}>
              🎸 Band Name Generator
            </Link>
            <Link href="/tools/" className={styles.navLinkSub} onClick={onClose}>
              All 19 Tools Directory →
            </Link>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Popular Genres</span>
            <div className={styles.genreGrid}>
              <Link href="/band-name-generator/rock/" className={styles.genrePill} onClick={onClose}>Rock</Link>
              <Link href="/band-name-generator/metal/" className={styles.genrePill} onClick={onClose}>Metal</Link>
              <Link href="/band-name-generator/kpop/" className={styles.genrePill} onClick={onClose}>K-pop</Link>
              <Link href="/band-name-generator/heavy-metal/" className={styles.genrePill} onClick={onClose}>Heavy Metal</Link>
              <Link href="/band-name-generator/boy-band/" className={styles.genrePill} onClick={onClose}>Boy Band</Link>
              <Link href="/band-name-generator/random/" className={styles.genrePill} onClick={onClose}>Random</Link>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Resources</span>
            <Link href="/guides/" className={styles.navLink} onClick={onClose}>
              Guides & Articles
            </Link>
            <Link href="/about/" className={styles.navLink} onClick={onClose}>
              About Us
            </Link>
            <Link href="/contact/" className={styles.navLink} onClick={onClose}>
              Contact & Feedback
            </Link>
          </div>
        </nav>
      </div>
    </div>,
    document.body
  );
}

