"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '../Buttons/Buttons';
import AuthModal from '../AuthModal/AuthModal';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsAuthModalOpen(false);
  };

  // Перша літера email для аватарки
  const userInitial = session?.user?.email?.charAt(0).toUpperCase() ?? "?";

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

          <nav className={styles.desktopNav}>
            <Link href="#popular" className={styles.navLink}>Популярні</Link>
            <Link href="#new" className={styles.navLink}>Новинки</Link>
            
            {status === "authenticated" ? (
              <Link href="/profile" className={styles.profileLink}>
                {session.user?.image ? (
                  <div className={styles.avatarMini}>
                    <Image 
                      src={session.user.image} 
                      alt="Avatar" 
                      width={32} 
                      height={32} 
                      className={styles.avatarImg}
                    />
                  </div>
                ) : (
                  <div className={styles.avatarInitial}>
                    {userInitial}
                  </div>
                )}
              </Link>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>Реєстрація</Button>
            )}
          </nav>

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

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={closeAll}>Головна</Link>
          <Link href="#popular" onClick={closeAll}>Популярні</Link>
          <Link href="#new" onClick={closeAll}>Новинки</Link>
          {status === "authenticated" && (
            <Link href="/profile" onClick={closeAll} className={styles.mobileProfileLink}>
              <div className={styles.avatarInitialSmall}>{userInitial}</div>
              <span>{session.user?.email ?? "Профіль"}</span>
            </Link>
          )}
        </nav>
        <div className={styles.mobileActions}>
          {status !== "authenticated" && (
            <Button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className={styles.wideBtn}>
              Реєстрація
            </Button>
          )}
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={closeAll}></div>}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}