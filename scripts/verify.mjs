#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const EVIDENCE_DIR = path.join(ROOT_DIR, 'docs', 'evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const steps = [
  { name: 'lint', cmd: 'npm run lint', file: 'lint.txt' },
  { name: 'test', cmd: 'npm run test', file: 'test.txt' },
  { name: 'check:no-network', cmd: 'npm run check:no-network', file: 'check-no-network.txt' },
  { name: 'build', cmd: 'npm run build', file: 'build.txt' },
  { name: 'seo:audit', cmd: 'npm run seo:audit', file: 'seo-audit.txt' },
  { name: 'docs:bundle', cmd: 'npm run docs:bundle', file: 'docs-bundle.txt' },
];

console.log('🚀 Running full verification pipeline...\n');

let failed = false;

for (const step of steps) {
  process.stdout.write(`⏳ Step [${step.name}] running... `);
  try {
    const output = execSync(step.cmd, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, CI: 'true' },
    });
    fs.writeFileSync(path.join(EVIDENCE_DIR, step.file), output, 'utf8');
    console.log('✅ PASSED');
  } catch (err) {
    const combinedOutput = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + (err.message || '');
    fs.writeFileSync(path.join(EVIDENCE_DIR, step.file), combinedOutput, 'utf8');
    console.log('❌ FAILED');
    console.error(`\n--- Output of ${step.name} ---\n${combinedOutput}\n-----------------------------`);
    failed = true;
    break;
  }
}

if (failed) {
  console.error('\n❌ Verification pipeline FAILED. See docs/evidence/ for logs.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL VERIFICATION STEPS PASSED! Evidence recorded in docs/evidence/');
  process.exit(0);
}
