import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SECURE_RANDOM_UNAVAILABLE_MSG, randomBytes } from './secure-random';

const TOOLS_1_TO_4_FILES = [
  'src/lib/secure-random.ts',
  'src/lib/password-engine.ts',
  'src/lib/strength-engine.ts',
  'src/lib/uuid-engine.ts',
  'src/lib/passphrase-engine.ts',
  'src/lib/passphrase-core.ts',
  'src/data/attack-scenarios.ts',
  'src/data/common-passwords.ts',
  'src/data/wordlist-passphrase.ts',
];

const TOOLS_1_TO_4_DIRS = [
  'src/components/tool/password-generator',
  'src/components/tool/password-strength-checker',
  'src/components/tool/uuid-generator',
  'src/components/tool/passphrase-generator',
];

function collectTsFiles(dirRel: string): string[] {
  const full = path.join(process.cwd(), dirRel);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
    .map((f) => path.join(dirRel, f));
}

describe('Batch 7 security & offline invariants', () => {
  it('verifies Tools 1–4 contain no Math.random, generator/rng, fetch(, localStorage, or sessionStorage', () => {
    const targets = [
      ...TOOLS_1_TO_4_FILES,
      ...TOOLS_1_TO_4_DIRS.flatMap(collectTsFiles),
    ];

    expect(targets.length).toBeGreaterThanOrEqual(15);

    const forbidden = [
      /\bMath\.random\b/,
      /generator\/rng/,
      /\bfetch\s*\(/,
      /\blocalStorage\b/,
      /\bsessionStorage\b/,
    ];

    for (const rel of targets) {
      const raw = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
      const content = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');
      for (const rx of forbidden) {
        expect(content, `${rel} matched ${rx}`).not.toMatch(rx);
      }
    }
  });

  it('fails closed when Web Crypto is missing (zero-fallback test)', () => {
    const originalCrypto = globalThis.crypto;
    try {
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        configurable: true,
      });
      expect(() => randomBytes(16)).toThrow(SECURE_RANDOM_UNAVAILABLE_MSG);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        configurable: true,
      });
    }
  });
});
