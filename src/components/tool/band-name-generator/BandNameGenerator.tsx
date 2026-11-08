'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { GenreId } from '@/lib/generator/types';
import { generateNames } from '@/lib/generator/engine';
import { safeStorage } from '@/lib/storage';
import Controls, { GeneratorControlState } from './Controls';
import Results from './Results';
import SavedPanel from './SavedPanel';
import Toast from '@/components/ui/Toast';
import styles from './BandNameGenerator.module.css';

interface BandNameGeneratorProps {
  initialGenre?: GenreId;
  starterNames?: string[];
  compact?: boolean;
}

const DEFAULT_STARTER_NAMES: Record<GenreId, string[]> = {
  'any': [
    'Electric Highway', 'Crimson Throne', 'Steel Dragon', 'Rotten Kids',
    'Neon Daydream', 'NOVA ONE', 'Midnight Avenue', 'Quiet Orchard',
    'The Iron Legion', 'Velvet Skyline'
  ],
  'rock': [
    'Electric Highway', 'The Wild Jackals', 'Broken Static', 'The Diesel Rebels',
    'Neon Voltage', 'Rust & Bones', 'Midnight Wolves', 'The Golden Chariot',
    'Thunderbird Riot', 'Copper Sparks'
  ],
  'metal': [
    'Crimson Throne', 'The Wretched Legion', 'Obsidian Altar', 'Ritual of Doom',
    'Ashen Carrion', 'The Infernal Scourge', 'Abyssal Dominions', 'Bleeding Sepulcher',
    'Iron Tomb', 'Cursed Catacomb'
  ],
  'heavy-metal': [
    'Steel Dragon', 'The Iron Stallions', 'Hammer of Glory', 'Chrome Warriors',
    'The Armored Knights', 'Savage Titan', 'Mighty Warlords', 'Valiant Thunder',
    'The Golden Anvil', 'Thunderous Broadsword'
  ],
  'punk': [
    'Rotten Kids', 'The Gutter Vandals', 'Cheap Static', 'Dead Alley',
    'The Rude Brats', 'Static Riot', 'Feral Outcasts', 'No Curfew',
    'The Trashy Misfits', 'Bootleg Scum'
  ],
  'pop': [
    'Neon Daydream', 'Velvet Heartbeat', 'Pastel Skyline', 'The Sugar Carousel',
    'Golden Confetti', 'The Cherry Mirages', 'Cosmic Parades', 'Honey Echoes',
    'Crystal Symphony', 'Electric Sunshine'
  ],
  'kpop': [
    'NOVA ONE', 'ZENITH-X', 'STELLA NINE', 'ORBIT SEVEN',
    'PRISM AXIS', 'VELA ZERO', 'AURA CHROMA', 'SOLIS PULSE',
    'LUMEN MATRIX', 'ECLIPSE APEX'
  ],
  'boy-band': [
    'Midnight Avenue', 'The Golden Dreamers', 'Sunday Street', 'The Velvet Brothers',
    'Late Letters', 'Harbor Boulevard', 'Summer Sunset', 'The Downtown Romantics',
    'Urban Melody', 'Forever Kings'
  ],
  'indie': [
    'Quiet Orchard', 'The Paper Lighthouses', 'Faded Cardigan', 'Wandering Rivers',
    'The Soft Sparrows', 'Autumn Lanterns', 'Misty Meadows', 'The Humble Cabins',
    'Dusty Gramophones', 'Lonesome Willows'
  ],
};

const SAVED_STORAGE_KEY = 'bng_saved_favorites';

export default function BandNameGenerator({
  initialGenre = 'any',
  starterNames,
  compact = false,
}: BandNameGeneratorProps) {
  const [controls, setControls] = useState<GeneratorControlState>({
    genre: initialGenre,
    style: 'any',
    count: compact ? 5 : 10,
    startsWith: '',
    mustInclude: '',
    uppercase: initialGenre === 'kpop',
  });

  // Curated initial starter names to prevent hydration mismatches
  const initialList =
    starterNames || DEFAULT_STARTER_NAMES[initialGenre] || DEFAULT_STARTER_NAMES['any'];
  const [names, setNames] = useState<string[]>(initialList.slice(0, compact ? 5 : 10));
  const [warning, setWarning] = useState<string | undefined>();
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Keep a session history of the last 50 generated names to avoid repetitions
  const sessionHistoryRef = useRef<Set<string>>(new Set<string>());

  // Load saved names from localStorage on mount
  useEffect(() => {
    const stored = safeStorage.getJSON<string[]>(SAVED_STORAGE_KEY, []);
    if (Array.isArray(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedNames(stored);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  const handleGenerate = () => {
    const result = generateNames({
      genre: controls.genre,
      style: controls.style,
      count: controls.count,
      startsWith: controls.startsWith,
      mustInclude: controls.mustInclude,
      uppercase: controls.uppercase,
      avoid: sessionHistoryRef.current,
    });

    setNames(result.names);
    setWarning(result.warning);

    // Append new names to session history, trim to 50
    for (const name of result.names) {
      sessionHistoryRef.current.add(name.toLowerCase());
    }
    if (sessionHistoryRef.current.size > 50) {
      const arr = Array.from(sessionHistoryRef.current);
      sessionHistoryRef.current = new Set(arr.slice(arr.length - 50));
    }
  };

  const handleToggleSave = (name: string) => {
    let next: string[];
    if (savedNames.includes(name)) {
      next = savedNames.filter((n) => n !== name);
      showToast(`Removed "${name}" from favorites`);
    } else {
      next = [name, ...savedNames];
      showToast(`Saved "${name}" to favorites`);
    }
    setSavedNames(next);
    safeStorage.setJSON(SAVED_STORAGE_KEY, next);
  };

  const handleRemoveSaved = (name: string) => {
    const next = savedNames.filter((n) => n !== name);
    setSavedNames(next);
    safeStorage.setJSON(SAVED_STORAGE_KEY, next);
    showToast(`Removed "${name}"`);
  };

  const handleClearAllSaved = () => {
    setSavedNames([]);
    safeStorage.removeItem(SAVED_STORAGE_KEY);
    showToast('Cleared all saved favorites');
  };

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compactWrapper : ''}`}>
      <Toast message={toastMessage} visible={toastVisible} />

      <div className={styles.layout}>
        {/* Left Column: Generator Controls */}
        <div className={styles.controlsCol}>
          <Controls
            values={controls}
            onChange={(updates) => setControls((prev) => ({ ...prev, ...updates }))}
            onGenerate={handleGenerate}
            compact={compact}
          />
        </div>

        {/* Right Column: Results & Saved Panel */}
        <div className={styles.resultsCol}>
          <Results
            names={names}
            warning={warning}
            savedNames={new Set(savedNames)}
            onToggleSave={handleToggleSave}
            onCopySuccess={showToast}
          />

          {!compact && (
            <SavedPanel
              savedNames={savedNames}
              onRemove={handleRemoveSaved}
              onClearAll={handleClearAllSaved}
              onCopySuccess={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
}
