"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import styles from "./Header.module.css";

// --- Компонент Пошуку ---
function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [results, setResults] = useState<Movie[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsDropdownOpen(false);
        return;
      }
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=uk-UA`,
          {
            headers: { 
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
              accept: 'application/json'
            }
          }
        );
        const data = await res.json();
        setResults(data.results?.slice(0, 6) || []);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Помилка пошуку:", error);
      }
    };
    const timer = setTimeout(searchMovies, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id: number) => {
    setQuery("");
    setIsDropdownOpen(false);
    router.push(`/movie/${id}`);
  };

  return (
    <div className={styles.searchWrapper} ref={dropdownRef}>
      <span className={styles.searchIcon}>🔍</span>
      <input 
        type="text" 
        placeholder="Пошук фільмів..." 
        className={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsDropdownOpen(true)}
      />
      {isDropdownOpen && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((m) => (
            <div key={m.id} className={styles.dropdownItem} onClick={() => handleSelect(m.id)}>
              <div className={styles.miniPoster}>
                <Image src={getImageUrl(m.poster_path || "")} alt={m.title} fill sizes="40px" />
              </div>
              <div className={styles.movieInfo}>
                <span className={styles.movieName}>{m.title}</span>
                <span className={styles.movieYear}>{m.release_date?.split("-")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Основний компонент Header ---
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => { setIsAuthModalOpen(true); setIsMenuOpen(false); };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          
          <Link href="/" className={styles.logo}>
            <span className={styles.fullLogo}>MOVIE<span>SPACE</span></span>
            <span className={styles.mobileLogo}>M<span>S</span></span>
          </Link>

          <Suspense fallback={<div className={styles.searchInput}>...</div>}>
            <SearchInput />
          </Suspense>

          {/* Навігація для Планшетів/Десктопів */}
          <nav className={styles.desktopNav}>
            <Link href="/">Головна</Link>
            <Link href="/popular">Популярні</Link>
            <button className={styles.loginBtn} onClick={openModal}>Вхід</button>
          </nav>

          {/* Бургер (тільки для мобільних) */}
          <button className={styles.burger} onClick={toggleMenu} aria-label="Меню">
            <div className={`${styles.line} ${isMenuOpen ? styles.line1 : ""}`}></div>
            <div className={`${styles.line} ${isMenuOpen ? styles.line2 : ""}`}></div>
            <div className={`${styles.line} ${isMenuOpen ? styles.line3 : ""}`}></div>
          </button>
        </div>

        {/* Мобільне меню */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuActive : ""}`}>
          <nav className={styles.mobileNavLinks}>
            <Link href="/" onClick={toggleMenu}>Головна</Link>
            <Link href="/popular" onClick={toggleMenu}>Популярні</Link>
            <button className={styles.loginBtnMobile} onClick={openModal}>
              Увійти через Google
            </button>
          </nav>
        </div>
      </header>

      {/* Модальне вікно входу */}
      {isAuthModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAuthModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setIsAuthModalOpen(false)}>✕</button>
            <h3>Увійти на сайт</h3>
            <p>Використовуйте свій Google аккаунт для швидкого входу</p>
            <button className={styles.googleBtn} onClick={() => alert("Інтеграція з Google...")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" />
              Продовжити з Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}