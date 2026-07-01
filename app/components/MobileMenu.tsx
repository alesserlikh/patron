'use client';

import { useState } from 'react';
import { uiTexts } from '@/app/lib/ui-texts';
import styles from './MobileMenu.module.css';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navTexts = uiTexts.nav;

  return (
    <>
      <button 
        className={styles.burgerButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className={styles.mobileMenuOverlay} onClick={() => setIsOpen(false)}>
          <nav className={styles.mobileMenu} onClick={e => e.stopPropagation()}>
            <ul>
              {navTexts.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={() => setIsOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#" className={styles.mobileCta} onClick={() => setIsOpen(false)}>
              {navTexts.cta}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
