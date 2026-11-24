'use client';

import React from 'react';
import styles from './BooleanCalculator.module.css';

interface BooleanInputGuideProps {
  activeTab: 'simplify' | 'equiv' | 'binary';
  expression?: string;
  variables?: string[];
  isEquivalent?: boolean;
  binA?: string;
  binB?: string;
  bitWidth?: number;
}

export default function BooleanInputGuide({
  activeTab,
  expression = '(A AND B) OR (A AND NOT B)',
  variables = ['A', 'B'],
  isEquivalent = true,
  binA = '1011',
  binB = '0110',
  bitWidth = 8,
}: BooleanInputGuideProps) {
  return (
    <div className={styles.guideWrapper} aria-label="Boolean and logic architecture diagram">
      <div className={styles.guideHeader}>
        <span className={styles.guideBadge}>LOGIC &amp; BITWISE PIPELINE</span>
        <span className={styles.guideTitle}>
          {activeTab === 'simplify' && 'Expression Simplification & Truth Table Flow'}
          {activeTab === 'equiv' && 'Dual Expression Logical Equivalence Verification'}
          {activeTab === 'binary' && `Binary & Two's Complement Arithmetic (${bitWidth}-bit)`}
        </span>
      </div>

      <div className={styles.diagramGrid}>
        {activeTab === 'simplify' && (
          <div className={styles.simplifyDiagram}>
            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>1</span>
              <span className={styles.blockLabel}>Inputs / Variables</span>
              <div className={styles.pillGroup}>
                {variables.length > 0 ? (
                  variables.map((v) => (
                    <span key={v} className={styles.varPill}>
                      {v}
                    </span>
                  ))
                ) : (
                  <span className={styles.varPill}>A, B</span>
                )}
              </div>
            </div>

            <div className={styles.diagramArrow}>&rarr;</div>

            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>2</span>
              <span className={styles.blockLabel}>Logic Gates (AST)</span>
              <div className={styles.formulaPill}>{expression || 'Expression'}</div>
            </div>

            <div className={styles.diagramArrow}>&rarr;</div>

            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>3</span>
              <span className={styles.blockLabel}>Outputs</span>
              <div className={styles.badgeRow}>
                <span className={styles.statusBadge}>Minimal SOP</span>
                <span className={styles.statusBadge}>Truth Table (2ⁿ)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equiv' && (
          <div className={styles.equivDiagram}>
            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>Expr 1</span>
              <span className={styles.blockLabel}>Expression A</span>
              <div className={styles.formulaPill}>NOT(A AND B)</div>
            </div>

            <div className={styles.diagramCompare}>
              <span className={isEquivalent ? styles.matchBadge : styles.diffBadge}>
                {isEquivalent ? '≡ EQUIVALENT' : '≢ NOT EQUAL'}
              </span>
            </div>

            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>Expr 2</span>
              <span className={styles.blockLabel}>Expression B</span>
              <div className={styles.formulaPill}>NOT A OR NOT B</div>
            </div>
          </div>
        )}

        {activeTab === 'binary' && (
          <div className={styles.binaryDiagram}>
            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>Operand 1</span>
              <span className={styles.blockLabel}>Input A</span>
              <span className={styles.codePill}>{binA}</span>
            </div>

            <div className={styles.diagramArrow}>+ / - / &amp;</div>

            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>Operand 2</span>
              <span className={styles.blockLabel}>Input B</span>
              <span className={styles.codePill}>{binB}</span>
            </div>

            <div className={styles.diagramArrow}>&rarr;</div>

            <div className={styles.diagramBlock}>
              <span className={styles.stepNum}>Register</span>
              <span className={styles.blockLabel}>{bitWidth}-bit Result</span>
              <div className={styles.badgeRow}>
                <span className={styles.statusBadge}>Unsigned Dec</span>
                <span className={styles.statusBadge}>Two&apos;s Complement</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.guideFooter}>
        <span className={styles.legendTitle}>Syntax Legend:</span>
        <div className={styles.legendTags}>
          <code>AND: &amp;, *, AND</code>
          <code>OR: |, +, OR</code>
          <code>NOT: !, ~, NOT</code>
          <code>XOR: ^, ⊕, XOR</code>
          <code>Precedence: NOT &gt; AND &gt; XOR &gt; OR</code>
        </div>
      </div>
    </div>
  );
}
