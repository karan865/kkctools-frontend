'use client';

import React from 'react';
import Link from 'next/link';
import styles from './FloatingPill.module.css';

export default function FloatingPill() {
  return (
    <Link
      href="/contact/"
      className={styles.floatingPill}
      aria-label="Suggest a tool or send feedback"
    >
      <span className={styles.icon}>💡</span>
      <span>Suggest a Tool</span>
    </Link>
  );
}

