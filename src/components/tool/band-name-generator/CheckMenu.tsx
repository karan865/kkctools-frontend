'use client';

import React, { useEffect, useRef } from 'react';
import styles from './CheckMenu.module.css';

interface CheckMenuProps {
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckMenu({ name, isOpen, onClose }: CheckMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const encodedName = encodeURIComponent(name);
  const encodedNameQuote = encodeURIComponent(`"${name}" band`);
  const encodedNameBand = encodeURIComponent(`${name} band`);

  const links = [
    {
      label: 'Search on Google',
      url: `https://www.google.com/search?q=${encodedNameQuote}`,
      icon: '🔍',
    },
    {
      label: 'Search on Spotify',
      url: `https://open.spotify.com/search/${encodedName}`,
      icon: '🟢',
    },
    {
      label: 'Search on Bandcamp',
      url: `https://bandcamp.com/search?q=${encodedName}`,
      icon: '🎵',
    },
    {
      label: 'Search on YouTube',
      url: `https://www.youtube.com/results?search_query=${encodedNameBand}`,
      icon: '▶️',
    },
  ];

  return (
    <div className={styles.popup} ref={menuRef} role="menu" aria-label={`Check availability for ${name}`}>
      <div className={styles.header}>
        <span className={styles.title}>Search for this name</span>
        <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close menu">
          ✕
        </button>
      </div>

      <p className={styles.disclaimer}>
        A search is not a guarantee. Always do your own clearance and trademark checks.
      </p>

      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.label} className={styles.item}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={styles.link}
              onClick={onClose}
              role="menuitem"
            >
              <span className={styles.icon} aria-hidden="true">{link.icon}</span>
              <span className={styles.linkText}>{link.label}</span>
              <span className={styles.externalArrow} aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
