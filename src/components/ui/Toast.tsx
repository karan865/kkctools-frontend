import React from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string | null;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  if (!visible || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={styles.toast}
    >
      <span className={styles.icon} aria-hidden="true">✓</span>
      <span>{message}</span>
    </div>
  );
}
