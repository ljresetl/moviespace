"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../Buttons/Buttons';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  // Блокуємо скрол основної сторінки при відкритих оверлеях
  useEffect(() => {
    if (isMenuOpen || isRegModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen, isRegModalOpen]);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsRegModalOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          
          <Link href="/" className={styles.logo}>
            <span className={styles.logoShort}>KS</span>
            <span className={styles.logoFull}>KINO<span>SHROT</span></span>
          </Link>

          <form className={styles.searchForm}>
            <input type="text" placeholder="Шукати фільм..." className={styles.searchInput} />
          </form>

          {/* Десктопна навігація */}
          <nav className={styles.desktopNav}>
            <Link href="#popular" className={styles.navLink}>Популярні</Link>
            <Link href="#new" className={styles.navLink}>Новинки</Link>
            <Button onClick={() => setIsRegModalOpen(true)}>Реєстрація</Button>
          </nav>

          {/* Кнопка Бургера (Мобільна) */}
          <button 
            className={`${styles.burgerBtn} ${isMenuOpen ? styles.burgerActive : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>
        </div>
      </header>

      {/* Мобільне меню (Slide-in) */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={closeAll}>Головна</Link>
          <Link href="#popular" onClick={closeAll}>Популярні</Link>
          <Link href="#new" onClick={closeAll}>Новинки</Link>
        </nav>
        <div className={styles.mobileActions}>
          <Button onClick={() => { setIsRegModalOpen(true); setIsMenuOpen(false); }} className={styles.wideBtn}>
            Реєстрація
          </Button>
        </div>
      </div>

      {/* Оверлей для мобільного меню */}
      {isMenuOpen && <div className={styles.overlay} onClick={closeAll}></div>}

      {/* Модалка реєстрації (Центрована) */}
      {isRegModalOpen && (
        <div className={styles.modalOverlay} onClick={closeAll}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Приєднуйся</h2>
            <p className={styles.modalSubTitle}>Твій квиток у світ кіно</p>
            
            <div className={styles.modalButtons}>
              <Button variant="secondary" className={styles.wideBtn}>🌐 Google</Button>
              <Button variant="secondary" className={styles.wideBtn}>✈️ Telegram</Button>
              <Button variant="primary" className={styles.wideBtn}>✉️ Пошта</Button>
            </div>

            <Button variant="ghost" onClick={closeAll} className={styles.closeBtn}>
              Скасувати
            </Button>
          </div>
        </div>
      )}
    </>
  );
}