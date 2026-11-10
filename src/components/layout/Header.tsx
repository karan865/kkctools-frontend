'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_NAME } from '@/config/site';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
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

  const isToolsActive = pathname.startsWith('/tools') || pathname.startsWith('/band-name-generator') || pathname.startsWith('/construction-estimate');
  const isGuidesActive = pathname.startsWith('/guides');
  const isAboutActive = pathname.startsWith('/about');
  const isHomeActive = pathname === '/';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Wordmark with Modern Tech Emblem */}
        <Link href="/" className={styles.brand} aria-label={`${SITE_NAME} Home`}>
          <div className={styles.brandBadge}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#headerBrandGrad)" stroke="var(--brand-orange)" strokeWidth="1.2" strokeLinejoin="round" />
              <defs>
                <linearGradient id="headerBrandGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#EA580C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.brandText}>{SITE_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <Link href="/" className={`${styles.navLink} ${isHomeActive ? styles.navLinkActive : ''}`}>
            Home
          </Link>

          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <Link
              href="/tools/"
              className={`${styles.navLink} ${isToolsActive ? styles.navLinkActive : ''}`}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              <span>Tools</span>
              <svg
                className={styles.dropdownArrow}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
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
                  <span className={styles.dropdownDesc}>Original music band & group naming ideas</span>
                </Link>
                <Link
                  href="/construction-estimate-template/"
                  className={styles.dropdownItem}
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className={styles.dropdownTitle}>Construction Estimate Template</span>
                  <span className={styles.dropdownDesc}>Free estimate builder with print-to-PDF & CSV</span>
                </Link>
                <Link
                  href="/asphalt-calculator/"
                  className={styles.dropdownItem}
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className={styles.dropdownTitle}>Asphalt Calculator</span>
                  <span className={styles.dropdownDesc}>Calculate tons, cubic yards, millings & cost</span>
                </Link>
                <Link
                  href="/tools/"
                  className={styles.dropdownItemAll}
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  View all tools directory →
                </Link>
              </div>
            )}
          </div>

          <Link href="/guides/" className={`${styles.navLink} ${isGuidesActive ? styles.navLinkActive : ''}`}>
            Guides
          </Link>
          <Link href="/about/" className={`${styles.navLink} ${isAboutActive ? styles.navLinkActive : ''}`}>
            About
          </Link>
        </nav>

        {/* Right actions: CTA pill, Theme toggle and mobile hamburger */}
        <div className={styles.actions}>
          <Link href="/tools/" className={styles.ctaPill}>
            Explore Tools →
          </Link>
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

