import React from 'react';
import Icon from '@/components/icons/Icons';
import styles from './WhyUs.module.css';

export default function WhyUs() {
  const points = [
    {
      icon: 'shield' as const,
      title: 'Private by Design',
      desc: 'Your inputs and dimensions never leave your browser. Zero accounts, no tracking pixels, and zero server logging.',
    },
    {
      icon: 'bookOpen' as const,
      title: 'Built on Real Formulas',
      desc: 'Every calculator shows its formula and default values (densities, bag yields, coverage rates), and you can edit them to match your supplier.',
    },
    {
      icon: 'zap' as const,
      title: 'Fast on Any Jobsite',
      desc: 'Instant, lightweight client-side execution. Designed to load and calculate instantly even on spotty mobile data.',
    },
    {
      icon: 'check' as const,
      title: '100% Free with No Catch',
      desc: 'No credit cards, no trial periods, and no locked features. Every calculator is free for contractors and homeowners.',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>WHY KKC TOOLS</span>
          <h2 className={styles.title}>Calculators You Can Check</h2>
          <p className={styles.subtitle}>
            For homeowners, DIY builders and trade pros who need quick quantities and want to see how each number is worked out.
          </p>
        </div>

        <div className={styles.grid}>
          {points.map((p, idx) => (
            <div key={idx} className={styles.pointCard}>
              <div className={styles.iconCircle}>
                <Icon name={p.icon} size={22} strokeWidth={2} />
              </div>
              <h3 className={styles.pointTitle}>{p.title}</h3>
              <p className={styles.pointDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

