'use client';

import React, { useState } from 'react';
import type { GenreId, StyleId } from '@/lib/generator/types';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import styles from './Controls.module.css';

export interface GeneratorControlState {
  genre: GenreId;
  style: StyleId;
  count: 5 | 10 | 20;
  startsWith: string;
  mustInclude: string;
  uppercase: boolean;
}

interface ControlsProps {
  values: GeneratorControlState;
  onChange: (updates: Partial<GeneratorControlState>) => void;
  onGenerate: () => void;
  compact?: boolean;
}

const ALL_GENRES: { id: GenreId; label: string }[] = [
  { id: 'any', label: 'Any (Mix)' },
  { id: 'rock', label: 'Rock' },
  { id: 'metal', label: 'Metal' },
  { id: 'heavy-metal', label: 'Heavy Metal' },
  { id: 'punk', label: 'Punk' },
  { id: 'pop', label: 'Pop' },
  { id: 'kpop', label: 'K-pop' },
  { id: 'boy-band', label: 'Boy Band' },
  { id: 'indie', label: 'Indie' },
];

const COMPACT_GENRES: { id: GenreId; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'rock', label: 'Rock' },
  { id: 'metal', label: 'Metal' },
  { id: 'kpop', label: 'K-pop' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Controls({
  values,
  onChange,
  onGenerate,
  compact = false,
}: ControlsProps) {
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);

  const genresToDisplay = compact ? COMPACT_GENRES : ALL_GENRES;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
    }
  };

  const handleGenreChange = (newGenre: GenreId) => {
    onChange({
      genre: newGenre,
      uppercase: newGenre === 'kpop',
    });
  };

  return (
    <div className={`${styles.controlsCard} ${compact ? styles.compactCard : ''}`}>
      {/* 1. Genre Selector */}
      <div className={styles.group}>
        <label className={styles.label} id="genre-label">
          Genre
        </label>
        <div
          className={styles.chipRow}
          role="radiogroup"
          aria-labelledby="genre-label"
        >
          {genresToDisplay.map((g) => (
            <Chip
              key={g.id}
              value={g.id}
              label={g.label}
              selected={values.genre === g.id}
              onClick={() => handleGenreChange(g.id)}
            />
          ))}
        </div>
      </div>

      {!compact && (
        <>
          {/* Collapsible toggle for mobile cleanliness */}
          <div className={styles.mobileMoreToggle}>
            <button
              type="button"
              className={styles.toggleMoreBtn}
              onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
              aria-expanded={moreOptionsOpen}
            >
              <span>{moreOptionsOpen ? '▴ Fewer options' : '▾ More options (style, words, letters)'}</span>
            </button>
          </div>

          <div className={`${styles.extraOptions} ${moreOptionsOpen ? styles.extraOptionsOpen : ''}`}>
            {/* 2. Name Style */}
            <div className={styles.group}>
              <label htmlFor="style-select" className={styles.label}>
                Naming Style
              </label>
              <select
                id="style-select"
                className={styles.select}
                value={values.style}
                onChange={(e) => onChange({ style: e.target.value as StyleId })}
                onKeyDown={handleKeyDown}
              >
                <option value="any">Any Style</option>
                <option value="the">&quot;The ...&quot; Names</option>
                <option value="two-word">Two Words</option>
                <option value="one-word">One Word</option>
                <option value="of-phrase">&quot;X of Y&quot; Phrases</option>
              </select>
            </div>

            {/* 3. Number of Names */}
            <div className={styles.group}>
              <span className={styles.label} id="count-label">Number of Names</span>
              <div className={styles.countRow} role="radiogroup" aria-labelledby="count-label">
                {([5, 10, 20] as const).map((num) => (
                  <button
                    key={num}
                    type="button"
                    role="radio"
                    aria-checked={values.count === num}
                    className={`${styles.countBtn} ${values.count === num ? styles.countSelected : ''}`}
                    onClick={() => onChange({ count: num })}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Starts with Letter */}
            <div className={styles.group}>
              <label htmlFor="starts-with-select" className={styles.label}>
                Starts with letter (Optional)
              </label>
              <select
                id="starts-with-select"
                className={styles.select}
                value={values.startsWith}
                onChange={(e) => onChange({ startsWith: e.target.value })}
                onKeyDown={handleKeyDown}
              >
                <option value="">Any Letter</option>
                {ALPHABET.map((letter) => (
                  <option key={letter} value={letter}>
                    {letter}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Must Include Word */}
            <div className={styles.group}>
              <label htmlFor="must-include-input" className={styles.label}>
                Must include word (Optional)
              </label>
              <input
                id="must-include-input"
                type="text"
                maxLength={20}
                placeholder="e.g. Iron, Velvet, Nova"
                className={styles.textInput}
                value={values.mustInclude}
                onChange={(e) => onChange({ mustInclude: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* 6. ALL CAPS Toggle */}
            <div className={styles.groupCheckbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={values.uppercase}
                  onChange={(e) => onChange({ uppercase: e.target.checked })}
                />
                <span>ALL CAPS (Style like K-POP or acronyms)</span>
              </label>
            </div>
          </div>
        </>
      )}

      {/* 7. Generate Action Button */}
      <div className={styles.generateWrapper}>
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onGenerate}
          className={styles.generateBtn}
        >
          ⚡ Generate Band Names
        </Button>
      </div>
    </div>
  );
}
