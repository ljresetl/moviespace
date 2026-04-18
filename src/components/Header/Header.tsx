"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import styles from "./Header.module.css";

// 1. Виносимо логіку пошуку в окремий компонент
function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(urlSearch);
  const [results, setResults] = useState<Movie[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (urlSearch !== query && !isDropdownOpen && query === "") {
      setQuery(urlSearch);
  }

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
        console.error("Помилка підказок:", error);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const executeSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsDropdownOpen(false);
    router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeSearch(query);
    }
  };

  const handleSelectMovie = (movieId: number) => {
    setQuery("");
    setIsDropdownOpen(false);
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className={styles.searchWrapper} ref={dropdownRef}>
      <input 
        key={urlSearch}
        type="text" 
        placeholder="Пошук фільмів..." 
        className={styles.searchInput}
        defaultValue={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsDropdownOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <span 
        className={styles.searchIcon} 
        onClick={() => executeSearch(query)}
        style={{ cursor: 'pointer' }}
      >
        🔍
      </span>

      {isDropdownOpen && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((movie) => (
            <div 
              key={movie.id} 
              className={styles.dropdownItem}
              onClick={() => handleSelectMovie(movie.id)}
            >
              <div className={styles.miniPoster}>
                <Image 
                  src={getImageUrl(movie.poster_path || "")} 
                  alt={movie.title}
                  fill
                  sizes="40px"
                />
              </div>
              <div className={styles.movieInfo}>
                <span className={styles.movieName}>{movie.title}</span>
                <span className={styles.movieYear}>
                  {movie.release_date ? movie.release_date.split("-")[0] : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 2. Основний компонент Header, який обгортає пошук у Suspense
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.logo}>
          MOVIE<span>SPACE</span>
        </Link>

        <Suspense fallback={<div className={styles.searchPlaceholder}>Завантаження...</div>}>
          <SearchInput />
        </Suspense>
      </div>
    </header>
  );
}