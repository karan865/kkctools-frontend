export type GenreId =
  | 'any'
  | 'rock'
  | 'metal'
  | 'heavy-metal'
  | 'punk'
  | 'pop'
  | 'kpop'
  | 'boy-band'
  | 'indie';

export type StyleId = 'any' | 'the' | 'two-word' | 'one-word' | 'of-phrase';

export interface GenerateOptions {
  genre: GenreId;
  style: StyleId;
  count: 5 | 10 | 20;
  startsWith?: string;
  mustInclude?: string;
  uppercase?: boolean;
  seed?: number;
  avoid?: Set<string>;
}

export interface GenerateResult {
  names: string[];
  warning?: string;
}

export interface WordPools {
  adjectives: string[];
  nouns: string[];
  plurals?: string[];
  verbsIng?: string[];
  places?: string[];
  colors?: string[];
  numberWords?: string[];
  suffixes?: string[];
  conceptWords?: string[];
}

export interface Pattern {
  template: string;
  style: StyleId;
  weight: number;
}
