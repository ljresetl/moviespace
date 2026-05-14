"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '../Buttons/Buttons';
import AuthModal from '../AuthModal/AuthModal';
import { useAuth } from '../AuthModal/context/AuthContext';
import styles from './Header.module.css';

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

function SearchDropdown({
  results, searching, showResults, query, onSelect,
}: {
  results: SearchResult[];
  searching: boolean;
  showResults: boolean;
  query: string;
  onSelect: () => void;
}) {
  if (!showResults && !searching) return null;

  return (
    <div className={styles.dropdown}>
      {searching && results.length === 0 ? (
        <div className={styles.dropdownLoading}>
          <Loader2 size={18} className={styles.dropdownSpinner} />
          <span>Шукаю...</span>
        </div>
      ) : results.length === 0 ? (
        <div className={styles.dropdownEmpty}>
          Нічого не знайдено за &laquo;{query}&raquo;
        </div>
      ) : (
        results.map(movie => (
          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
            className={styles.dropdownItem}
            onClick={onSelect}
          >
            <div className={styles.dropdownPoster}>
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/no-poster.png'}
                alt={movie.title}
                fill
                className={styles.dropdownPosterImg}
              />
            </div>
            <div className={styles.dropdownInfo}>
              <span className={styles.dropdownTitle}>{movie.title}</span>
              <span className={styles.dropdownMeta}>
                {movie.release_date?.split('-')[0] || '—'}
                {movie.vote_average > 0 && ` • ⭐ ${movie.vote_average.toFixed(1)}`}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default function Header() {
  const { session, isAuthenticated, isModalOpen, openModal, closeModal } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    closeModal();
  }, [closeModal]);

  // Клік зовні — закрити dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchRef.current && !searchRef.current.contains(target) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(target))
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Пошук через onChange + debounce ref (без useEffect)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (val.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      setSearching(false);
      return;
    }

    setSearching(true);

    searchTimer.current = setTimeout(async () => {
      const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
      if (!token) { setSearching(false); return; }

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?language=uk-UA&query=${encodeURIComponent(val.trim())}&page=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setResults((data.results || []).slice(0, 8));
          setShowResults(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  const handleSelect = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
    setIsMenuOpen(false);
  }, []);

  const clearSearch = useCallback(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
    setSearching(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (results.length > 0) setShowResults(true);
  }, [results.length]);

  const userInitial = session?.user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>

          <Link href="/" className={styles.logo}>
            <span className={styles.logoShort}>KS</span>
            <span className={styles.logoFull}>KINO<span>SHROT</span></span>
          </Link>

          <div className={styles.searchWrap} ref={searchRef}>
            <div className={styles.searchForm}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Шукати фільм..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
              />
              {searchQuery && (
                <button type="button" className={styles.clearBtn} onClick={clearSearch}>
                  <X size={16} />
                </button>
              )}
              {searching && <Loader2 size={16} className={styles.searchSpinner} />}
            </div>
            <SearchDropdown
              results={results}
              searching={searching}
              showResults={showResults}
              query={searchQuery}
              onSelect={handleSelect}
            />
          </div>

          <nav className={styles.desktopNav}>
            <Link href="#popular" className={styles.navLink}>Популярні</Link>
            <Link href="#new" className={styles.navLink}>Новинки</Link>

            {isAuthenticated ? (
              <Link href="/profile" className={styles.profileLink}>
                {session?.user?.image ? (
                  <div className={styles.avatarMini}>
                    <Image src={session.user.image} alt="Avatar" width={32} height={32} className={styles.avatarImg} />
                  </div>
                ) : (
                  <div className={styles.avatarInitial}>{userInitial}</div>
                )}
              </Link>
            ) : (
              <Button onClick={openModal}>Реєстрація</Button>
            )}
          </nav>

          <button
            className={`${styles.burgerBtn} aria-label="Відкрити меню" ${isMenuOpen ? styles.burgerActive : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileSearchWrap} ref={mobileSearchRef}>
          <div className={styles.mobileSearchForm}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Шукати фільм..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
            {searchQuery && (
              <button type="button" className={styles.clearBtn} onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>
          <SearchDropdown
            results={results}
            searching={searching}
            showResults={showResults}
            query={searchQuery}
            onSelect={handleSelect}
          />
        </div>

        <nav className={styles.mobileNav}>
          <Link href="/" onClick={closeAll}>Головна</Link>
          <Link href="#popular" onClick={closeAll}>Популярні</Link>
          <Link href="#new" onClick={closeAll}>Новинки</Link>
          {isAuthenticated && (
            <Link href="/profile" onClick={closeAll} className={styles.mobileProfileLink}>
              <div className={styles.avatarInitialSmall}>{userInitial}</div>
              <span>{session?.user?.email ?? "Профіль"}</span>
            </Link>
          )}
        </nav>
        <div className={styles.mobileActions}>
          {!isAuthenticated && (
            <Button onClick={() => { openModal(); setIsMenuOpen(false); }} className={styles.wideBtn}>
              Реєстрація
            </Button>
          )}
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={closeAll}></div>}
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}