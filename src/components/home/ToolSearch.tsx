'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/icons/Icons';
import { TOOLS_CATALOG, CatalogTool } from '@/lib/tools-catalog';
import styles from './ToolSearch.module.css';

interface ToolSearchProps {
  mode?: 'inline' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
}

export default function ToolSearch({
  mode = 'inline',
  isOpen = false,
  onClose,
  placeholder,
}: ToolSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const filteredTools: CatalogTool[] = query.trim()
    ? TOOLS_CATALOG.filter((tool) => {
        const q = query.toLowerCase().trim();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [];

  // Global `/` key shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      window.location.href = filteredTools[selectedIndex].slug;
    } else if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
      if (onClose) onClose();
    }
  };

  const defaultPlaceholder = `Search ${TOOLS_CATALOG.length} tools — press / to search`;

  const searchBox = (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>
          <Icon name="search" size={20} />
        </span>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder={placeholder || defaultPlaceholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search all tools and calculators"
          aria-autocomplete="list"
          aria-controls={query.trim().length > 0 ? 'tool-search-results' : undefined}
        />
        <div className={styles.slashHint}>/</div>
      </div>

      {query.trim().length > 0 && (
        <div id="tool-search-results" className={styles.resultsMenu} role="listbox">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => (
              <Link
                key={tool.slug}
                href={tool.slug}
                className={`${styles.resultItem} ${idx === selectedIndex ? styles.selectedItem : ''}`}
                onClick={() => {
                  setQuery('');
                  if (onClose) onClose();
                }}
              >
                <div className={styles.resultIcon}>
                  <Icon name={tool.icon} size={18} />
                </div>
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{tool.name}</span>
                  <span className={styles.resultDesc}>{tool.description}</span>
                </div>
                <span className={styles.resultTag}>{tool.tags[0]}</span>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No calculator found for &ldquo;{query}&rdquo;.</p>
              <a
                href={`mailto:kkchub1@gmail.com?subject=Tool%20Suggestion%3A%20${encodeURIComponent(query)}`}
                className={styles.suggestLink}
              >
                Suggest this tool →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (mode === 'modal') {
    if (!isOpen) return null;
    return (
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {searchBox}
        </div>
      </div>
    );
  }

  return searchBox;
}
