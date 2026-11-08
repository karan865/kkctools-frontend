import type { GenreId } from '@/lib/generator/types';

export interface GenreSection {
  title: string;
  paragraphs: string[];
}

export interface GenreFaqItem {
  q: string;
  a: string;
}

export interface GenreSiblingLink {
  slug: string;
  title: string;
  description: string;
}

export interface GenreGuideLink {
  path: string;
  title: string;
  description: string;
}

export interface GenreConfig {
  slug: string;
  routeKey: string;
  generatorGenre: GenreId;
  h1: string;
  intro: string;
  curatedExamples: string[];
  sections: GenreSection[];
  faq: GenreFaqItem[];
  siblings: GenreSiblingLink[];
  guides: GenreGuideLink[];
}

