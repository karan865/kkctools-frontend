#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TARGET_DIRS = [
  path.join(process.cwd(), 'src', 'lib', 'generator'),
  path.join(process.cwd(), 'src', 'components', 'tool'),
];

const FORBIDDEN_PATTERNS = [
  { name: 'fetch', regex: /\bfetch\s*\(/ },
  { name: 'XMLHttpRequest', regex: /\bXMLHttpRequest\b/ },
  { name: 'sendBeacon', regex: /\bsendBeacon\s*\(/ },
  { name: 'WebSocket', regex: /\bWebSocket\b/ },
];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const violations = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      violations.push(...scanDirectory(fullPath));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.regex.test(content)) {
          violations.push({ file: fullPath, pattern: pattern.name });
        }
      }
    }
  }
  return violations;
}

let allViolations = [];
for (const dir of TARGET_DIRS) {
  allViolations.push(...scanDirectory(dir));
}

if (allViolations.length > 0) {
  console.error('❌ Network calls detected in client generator code:');
  for (const v of allViolations) {
    console.error(`  - ${v.file}: contains forbidden "${v.pattern}"`);
  }
  process.exit(1);
} else {
  console.log('✅ check:no-network passed! No client-side network calls found in tool code.');
  process.exit(0);
}
