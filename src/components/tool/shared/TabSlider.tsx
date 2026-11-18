'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './TabSlider.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabSliderProps<T extends string> {
  tabs: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}

export default function TabSlider<T extends string>({
  tabs,
  activeId,
  onChange,
  ariaLabel,
}: TabSliderProps<T>) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateTabScroll = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateTabScroll();
    el.addEventListener('scroll', updateTabScroll, { passive: true });
    window.addEventListener('resize', updateTabScroll);
    return () => {
      el.removeEventListener('scroll', updateTabScroll);
      window.removeEventListener('resize', updateTabScroll);
    };
  }, [updateTabScroll]);

  // Keep the active tab in view (also after a #hash or ?tab= link selects it).
  useEffect(() => {
    const el = tabsScrollRef.current;
    const btn = el?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!el || !btn) return;
    const left = btn.offsetLeft - el.offsetLeft;
    const target = left - (el.clientWidth - btn.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeId]);

  const scrollTabs = (dir: -1 | 1) => {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.6), behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const currentIndex = tabs.findIndex((t) => t.id === activeId);
    if (currentIndex === -1) return;
    if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      onChange(tabs[prevIndex].id);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % tabs.length;
      onChange(tabs[nextIndex].id);
      e.preventDefault();
    }
  };

  return (
    <div className={styles.tabsShell}>
      <button
        type="button"
        className={`${styles.tabArrow} ${styles.tabArrowLeft}`}
        onClick={() => scrollTabs(-1)}
        aria-label="Show previous modes"
        hidden={!canScrollLeft}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className={styles.tabsContainer} ref={tabsScrollRef}>
        <div
          className={styles.tabsBar}
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`${styles.tabBtn} ${isActive ? styles.tabActive : ''}`}
                onClick={() => onChange(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.tabArrow} ${styles.tabArrowRight}`}
        onClick={() => scrollTabs(1)}
        aria-label="Show more modes"
        hidden={!canScrollRight}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
