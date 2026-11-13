'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_NAME } from '@/config/site';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import ToolSearch from '@/components/home/ToolSearch';
import Icon from '@/components/icons/Icons';
import {
  CATEGORIES,
  getToolsByCategory,
  CategoryId,
} from '@/lib/tools-catalog';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setToolsDropdownOpen(false);
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isHomeActive = pathname === '/';
  const isToolsActive = pathname.startsWith('/tools') || pathname.includes('-calculator') || pathname.includes('-generator') || pathname.includes('-template');
  const isGuidesActive = pathname.startsWith('/guides');
  const isAboutActive = pathname.startsWith('/about');

  const categoryKeys: CategoryId[] = [
    'concrete',
    'gravel',
    'earthwork',
    'framing',
    'finishes',
    'business',
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Brand Wordmark with Modern Tech Emblem */}
          <Link href="/" className={styles.brand} aria-label={`${SITE_NAME} Home`}>
            <div className={styles.brandBadge}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  fill="url(#headerBrandGrad)"
                  stroke="var(--brand-orange)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
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

            {/* Mega Menu Dropdown */}
            <div
              className={styles.dropdownContainer}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                type="button"
                className={`${styles.navLink} ${isToolsActive ? styles.navLinkActive : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
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
              </button>

              {toolsDropdownOpen && (
                <div className={styles.megaMenu}>
                  <div className={styles.megaGrid}>
                    {categoryKeys.map((catKey) => {
                      const cat = CATEGORIES[catKey];
                      const tools = getToolsByCategory(catKey);
                      return (
                        <div key={catKey} className={styles.megaCol}>
                          <span className={styles.megaColTitle}>{cat.name}</span>
                          <ul className={styles.megaList}>
                            {tools.slice(0, 5).map((t) => (
                              <li key={t.slug}>
                                <Link
                                  href={t.slug}
                                  className={styles.megaItem}
                                  onClick={() => setToolsDropdownOpen(false)}
                                >
                                  <span className={styles.megaIcon}>
                                    <Icon name={t.icon} size={15} />
                                  </span>
                                  <span className={styles.megaName}>{t.name}</span>
                                </Link>
                              </li>
                            ))}
                            {tools.length > 5 && (
                              <li>
                                <Link
                                  href={`/tools/#${catKey}`}
                                  className={styles.megaMore}
                                  onClick={() => setToolsDropdownOpen(false)}
                                >
                                  View all {tools.length} in {cat.name} →
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.megaBottom}>
                    <Link
                      href="/tools/"
                      className={styles.megaAllBtn}
                      onClick={() => setToolsDropdownOpen(false)}
                    >
                      View all 22 tools directory →
                    </Link>
                    <span className={styles.megaNewPill}>
                      New: Concrete Calculator
                    </span>
                  </div>
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

          {/* Right actions: Search button (/), Theme toggle and mobile hamburger */}
          <div className={styles.actions}>
            {/* Unified Search Trigger (/ hint) */}
            <button
              type="button"
              className={styles.searchPill}
              onClick={() => {
                if (pathname === '/') {
                  const heroInput = document.querySelector('input[type="search"]') as HTMLInputElement | null;
                  if (heroInput) {
                    heroInput.focus();
                    heroInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                  }
                }
                setSearchModalOpen(true);
              }}
              aria-label="Search all tools and calculators"
            >
              <Icon name="search" size={15} />
              <span className={styles.searchText}>Search tools</span>
              <kbd className={styles.searchKbd}>/</kbd>
            </button>

            <ThemeToggle />

            <Link href="/tools/" className={styles.ctaPill}>
              All tools →
            </Link>

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
      </header>

      {/* Global Search Modal Overlay (for subpages or header trigger) */}
      <ToolSearch
        mode="modal"
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Mobile Drawer (via createPortal) */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
