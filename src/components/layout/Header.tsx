'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SITE_NAME } from '@/config/site';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setToolsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Wordmark with Sound Wave SVG */}
        <Link href="/" className={styles.brand} aria-label={`${SITE_NAME} Home`}>
          <svg
            className={styles.brandIcon}
            width="28"
            height="24"
            viewBox="0 0 28 24"
            fill="none"
            aria-hidden="true"
          >
            <rect x="2" y="8" width="4" height="12" rx="2" fill="var(--accent)" />
            <rect x="9" y="3" width="4" height="18" rx="2" fill="var(--accent)" />
            <rect x="16" y="6" width="4" height="14" rx="2" fill="var(--accent)" />
            <rect x="23" y="10" width="4" height="8" rx="2" fill="var(--accent)" />
          </svg>
          <span className={styles.brandText}>{SITE_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <Link
              href="/tools/"
              className={styles.navLink}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              Tools
              <svg
                className={styles.dropdownArrow}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            {toolsDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  href="/band-name-generator/"
                  className={styles.dropdownItem}
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className={styles.dropdownTitle}>Band Name Generator</span>
                  <span className={styles.dropdownDesc}>Original music band and group naming tool</span>
                </Link>
                <Link
                  href="/tools/"
                  className={styles.dropdownItemAll}
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  View all tools →
                </Link>
              </div>
            )}
          </div>

          <Link href="/guides/" className={styles.navLink}>
            Guides
          </Link>
          <Link href="/about/" className={styles.navLink}>
            About
          </Link>
        </nav>

        {/* Right actions: Theme toggle and mobile hamburger */}
        <div className={styles.actions}>
          <ThemeToggle />
          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
