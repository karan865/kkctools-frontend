'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
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
            <span className={styles.sectionTitle}>Tools</span>
            <Link href="/asphalt-calculator/" className={styles.navLink} onClick={onClose}>
              🚜 Asphalt Calculator
            </Link>
            <Link href="/construction-estimate-template/" className={styles.navLink} onClick={onClose}>
              📐 Construction Estimate Template
            </Link>
            <Link href="/band-name-generator/" className={styles.navLink} onClick={onClose}>
              🎸 Band Name Generator
            </Link>
            <Link href="/tools/" className={styles.navLinkSub} onClick={onClose}>
              All Tools Index →
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
    </div>
  );
}

