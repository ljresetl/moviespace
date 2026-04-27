"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react"; // Імпортуємо методи NextAuth
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import styles from "./Header.module.css";

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
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Помилка сервера");
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
                <Image src={getImageUrl(m.poster_path || "", "w92")} alt={m.title} fill sizes="40px" />
              </div>
              <div className={styles.movieInfo}>
                <span className={styles.movieName}>{m.title}</span>
                <span className={styles.movieYear}>{m.release_date ? m.release_date.split("-")[0] : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session } = useSession(); // Отримуємо дані сесії

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => { 
    if (!session) {
      setIsAuthModalOpen(true); 
      setIsMenuOpen(false); 
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>
            <span className={styles.fullLogo}>Kino<span>Shrot</span></span>
            <span className={styles.mobileLogo}>K<span>S</span></span>
          </Link>

          <Suspense fallback={<div className={styles.searchInput}>Завантаження...</div>}>
            <SearchInput />
          </Suspense>

          <nav className={styles.desktopNav}>
            <Link href="/">Головна</Link>
            <Link href="/#popular">Популярні</Link>
            {session ? (
              // Якщо залогінений — кнопка виходу або ім'я
              <button className={styles.tgHeaderBtn} onClick={() => signOut()}>
                Вийти ({session.user?.name?.split(" ")[0]})
              </button>
            ) : (
              <button className={styles.tgHeaderBtn} onClick={openModal}>Вхід</button>
            )}
          </nav>

          <button className={styles.burger} onClick={toggleMenu}>
            <div className={`${styles.line} ${isMenuOpen ? styles.line1 : ""}`}></div>
            <div className={`${styles.line} ${isMenuOpen ? styles.line2 : ""}`}></div>
            <div className={`${styles.line} ${isMenuOpen ? styles.line3 : ""}`}></div>
          </button>
        </div>

        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuActive : ""}`}>
          <nav className={styles.mobileNavLinks}>
            <Link href="/" onClick={toggleMenu}>Головна</Link>
            <Link href="/#popular" onClick={toggleMenu}>Популярні</Link>
            {session ? (
              <button className={styles.tgLoginBtnMobile} onClick={() => signOut()}>
                Вийти
              </button>
            ) : (
              <button className={styles.tgLoginBtnMobile} onClick={openModal}>
                Увійти
              </button>
            )}
          </nav>
        </div>
      </header>

      {isAuthModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAuthModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setIsAuthModalOpen(false)}>✕</button>
            <div className={styles.lockIcon}>🔐</div>
            <h3>Авторизація</h3>
            <p>Увійдіть через Google, щоб отримати доступ до перегляду фільмів у високій якості</p>
            <button 
              className={styles.tgBigBtn} 
              onClick={() => signIn("google")} // Викликаємо вхід Google
            >
              Продовжити з Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}