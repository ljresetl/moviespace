"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>
          {/* Логотип */}
          <Link href="/" className={styles.logo}>
            KINO<span>SHROT</span>
          </Link>

          {/* Посилання */}
          <div className={styles.links}>
            <Link href="/copyright">Правовласникам</Link>
            <span className={styles.divider}>|</span>
            <Link href="/privacy">Політика конфіденційності</Link>
          </div>

          {/* Копірайт */}
          <div className={styles.copyright}>
            © {currentYear} Усі права захищені.
          </div>

          {/* Створення */}
          <div className={styles.creator}>
            Створено з <span className={styles.heart}>❤️</span> до українців від — 
            <a href="https://webdevcompass.com" target="_blank" rel="noopener noreferrer"> webdevcompass.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}