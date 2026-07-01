'use client';

import { uiTexts } from '@/app/lib/ui-texts';
import { MobileMenu } from './MobileMenu';
import styles from './Navigation.module.css';

export function Navigation() {
  const navTexts = uiTexts.nav;

  return (
    <nav className={styles.nav}>
      <a className={styles.navLogo} href="#">
        {navTexts.logo}
      </a>
      <ul className={styles.navLinks}>
        {navTexts.links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className={styles.navRight}>
        <a className={styles.navCta} href="#">
          {navTexts.cta}
        </a>
        <MobileMenu />
      </div>
    </nav>
  );
}
