"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Pagination from "./../Pagination/Pagination";
import styles from "./MovieCardAll.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieCardAllProps {
  filters: {
    genre?: string;
    year?: string;
    country?: string;
  };
}

export default function MovieCardAll({ filters }: MovieCardAllProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const sectionRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true); // Для контролю першого завантаження
  const { genre, year, country } = filters;

  const slugify = (text: string) => {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
      'ю': 'yu', 'я': 'ya', 'ы': 'y', 'э': 'e', 'ё': 'yo', 'ъ': ''
    };
    return text.toLowerCase().split('').map(char => cyrillicToLatin[char] || char).join('')
      .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  };

  // Видаляємо окремий useEffect для setPage(1). 
  // Замість нього використовуємо цей ефект для скидання сторінки при зміні фільтрів
  // БЕЗ виклику зайвого рендеру до запиту.
  useEffect(() => {
    if (!isFirstRender.current) {
      setPage(1);
    }
  }, [genre, year, country]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const filterYear = year === "Усі роки" ? "" : year;
        
        const url = `https://api.themoviedb.org/3/discover/movie?language=uk-UA&page=${page}&with_genres=${genre || ""}&primary_release_year=${filterYear || ""}&with_origin_country=${country || ""}&sort_by=popularity.desc`;

        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
          },
        };

        const response = await fetch(url, options);
        const data = await response.json();
        
        setMovies(data.results || []);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);

        // Скрол робимо тільки якщо це НЕ перше завантаження сторінки
        if (!isFirstRender.current && sectionRef.current) {
          const yOffset = -100;
          const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        
        isFirstRender.current = false;
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre, year, country, page]);

  return (
    <section className={styles.section}>
      <h2 ref={sectionRef} className={styles.titleText}>
        {genre || (year && year !== "Усі роки") || country ? "Результати пошуку" : "Усі фільми"}
      </h2>

      <div className={styles.flexContainer}>
        {loading ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '100px', color: 'white' }}>
             <div className={styles.loader}>Завантаження...</div>
          </div>
        ) : movies.length > 0 ? (
          movies.map((movie) => {
            const movieSlug = `${movie.id}-${slugify(movie.title)}`;
            return (
              <Link key={movie.id} href={`/movie/${movieSlug}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <div className={styles.rating}>{movie.vote_average.toFixed(1)}</div>
                  <img 
                    className={styles.image}
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.png"} 
                    alt={movie.title} 
                  />
                </div>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <span className={styles.movieYear}>{movie.release_date?.split("-")[0]}</span>
              </Link>
            );
          })
        ) : (
          <p className={styles.loader}>Фільмів не знайдено</p>
        )}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={(p) => setPage(p)} 
      />
    </section>
  );
}