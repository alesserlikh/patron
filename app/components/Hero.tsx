'use client';

import { uiTexts } from '@/app/lib/ui-texts';
import styles from './Hero.module.css';

export function Hero() {
  const texts = uiTexts.hero;

  return (
    <section className={styles.hero}>
      {/* Background tagline */}
      <span className={styles.bgTagline} aria-hidden="true">
        {texts.bgTagline}
      </span>

      <div className={styles.heroMain}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine}></span>
          <span className={styles.eyebrowText}>{texts.eyebrow}</span>
        </div>

        {/* Headline */}
        <div className={styles.headline}>
          {texts.headline.lines.map((line, idx) => (
            <span
              key={idx}
              className={`${styles.headlineRow} ${
                line.weight === 'thin' ? styles.hlThin : styles.hlBold
              }`}
            >
              {line.text}{' '}
              {line.suffix && (
                <span className={styles.hlAccent}>{line.suffix}</span>
              )}
            </span>
          ))}
        </div>

        {/* Descriptors */}
        <div className={styles.descriptor}>
          {texts.descriptors.map((desc, idx) => (
            <div key={idx} className={styles.descBlock}>
              <span className={styles.descLabel}>{desc.label}</span>
              <p className={styles.descText}>{desc.text}</p>
              {idx < texts.descriptors.length - 1 && (
                <div className={styles.descDivider}></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div className={styles.ctaRow}>
          <a href="#" className={styles.btnPrimary}>
            {texts.buttons.primary}
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </a>
          <a href="#" className={styles.btnGhost}>
            {texts.buttons.secondary}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.heroBottom}>
        <div className={styles.statsRow}>
          {texts.stats.map((stat, idx) => (
            <div key={idx}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              {idx < texts.stats.length - 1 && (
                <div className={styles.statSep}></div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.scrollHint}>
          <span className={styles.scrollIcon}></span>
          {texts.scrollHint}
        </div>
      </div>
    </section>
  );
}
