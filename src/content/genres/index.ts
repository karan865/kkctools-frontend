import type { GenreConfig } from './types';
import { kpopConfig } from './kpop';
import { metalConfig } from './metal';
import { heavyMetalConfig } from './heavy-metal';
import { rockConfig } from './rock';
import { randomConfig } from './random';
import { boyBandConfig } from './boy-band';

export * from './types';

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  kpop: kpopConfig,
  metal: metalConfig,
  'heavy-metal': heavyMetalConfig,
  rock: rockConfig,
  random: randomConfig,
  'boy-band': boyBandConfig,
};

export const GENRE_SLUGS = Object.keys(GENRE_CONFIGS);

export function getGenreConfig(slug: string): GenreConfig | undefined {
  return GENRE_CONFIGS[slug];
}

export function getAllGenreConfigs(): GenreConfig[] {
  return Object.values(GENRE_CONFIGS);
}

