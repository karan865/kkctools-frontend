'use client';

import React, { useEffect, useRef, useSyncExternalStore, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Icon from '@/components/icons/Icons';
import {
  CATEGORIES,
  TOOLS_CATALOG,
  getToolsByCategory,
  CategoryId,
} from '@/lib/tools-catalog';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [activeCategory, setActiveCategory] = useState<string | null>('concrete');

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

  const toggleCategory = (catId: string) => {
    setActiveCategory((prev) => (prev === catId ? null : catId));
  };

  const categoryKeys: CategoryId[] = [
    'concrete',
    'gravel',
    'earthwork',
    'framing',
    'finishes',
    'business',
    'engineering',
    'math',
  ];

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
            <span className={styles.sectionTitle}>Calculators by Category</span>

            <div className={styles.accordionList}>
              {categoryKeys.map((catKey) => {
                const cat = CATEGORIES[catKey];
                const tools = getToolsByCategory(catKey);
                const isExpanded = activeCategory === catKey;

                return (
                  <div key={catKey} className={styles.accordionGroup}>
                    <button
                      type="button"
                      className={styles.accordionTrigger}
                      onClick={() => toggleCategory(catKey)}
                      aria-expanded={isExpanded}
                    >
                      <span className={styles.catLabel}>{cat.name}</span>
                      <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>
                        <Icon name="chevronDown" size={16} />
                      </span>
                    </button>

                    {isExpanded && (
                      <div className={styles.accordionBody}>
                        {tools.slice(0, 3).map((tool) => (
                          <Link
                            key={tool.slug}
                            href={tool.slug}
                            className={styles.navLink}
                            onClick={onClose}
                          >
                            <span className={styles.toolIcon}>
                              <Icon name={tool.icon} size={15} />
                            </span>
                            <span>{tool.name}</span>
                          </Link>
                        ))}
                        {tools.length > 3 && (
                          <Link
                            href={`/tools/#${catKey}`}
                            className={styles.viewCategoryAll}
                            onClick={onClose}
                          >
                            All {tools.length} in {cat.name} →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Resources &amp; Company</span>
            <Link href="/tools/" className={styles.resourceLink} onClick={onClose}>
              All {TOOLS_CATALOG.length} Tools Directory →
            </Link>
            <Link href="/guides/" className={styles.resourceLink} onClick={onClose}>
              Guides &amp; Articles
            </Link>
            <Link href="/about/" className={styles.resourceLink} onClick={onClose}>
              About Us
            </Link>
            <Link href="/contact/" className={styles.resourceLink} onClick={onClose}>
              Contact &amp; Feedback
            </Link>
          </div>
        </nav>
      </div>
    </div>,
    document.body
  );
}
