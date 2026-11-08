import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  value: string;
}

export default function Chip({
  label,
  selected,
  onClick,
  disabled = false,
  value,
}: ChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      data-value={value}
    >
      {label}
    </button>
  );
}
