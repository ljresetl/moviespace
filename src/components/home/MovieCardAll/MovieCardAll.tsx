"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Movie, TMDBResponse } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/home/Pagination/Pagination";
import styles from "./MovieCardAll.module.css";

export default function MovieCardAll() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Отримуємо всі параметри з URL
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const country = searchParams.get("country");
  const searchQuery = searchParams.get("search");
  const currentPage = Number(searchParams.get("page")) || 1;

  // Логіка скидання пошуку при першому завантаженні (оновленні) сторінки
  useEffect(() => {
    if (searchQuery || genre || (year && year !== "Усі роки") || country || currentPage !== 1) {
      router.replace("/", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set("language", "uk-UA");
      params.set("page", currentPage.toString());

      let endpoint = "/movie/popular";

      /** * ПРІОРИТЕТИЗАЦІЯ ФІЛЬТРІВ:
       * Якщо вибрано будь-який фільтр (жанр, рік, країна), використовуємо /discover/movie.
       * Це дозволяє фільтрам "перебивати" результати текстового пошуку.
       */
      if (genre || (year && year !== "Усі роки") || country) {
        endpoint = "/discover/movie";
        params.set("sort_by", "popularity.desc");
        if (genre) params.set("with_genres", genre);
        if (year && year !== "Усі роки") params.set("primary_release_year", year);
        if (country) params.set("with_origin_country", country);
      } else if (searchQuery) {
        // Якщо фільтрів немає, але є текст — використовуємо пошук
        endpoint = "/search/movie";
        params.set("query", searchQuery);
      }

      const url = `https://api.themoviedb.org/3${endpoint}?${params.toString()}`;

      try {
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            accept: 'application/json'
          }
        });

        if (!res.ok) throw new Error("Failed to fetch movies");

        const data: TMDBResponse = await res.json();
        setMovies(data.results || []);
        
        // Обмеження TMDB у 500 сторінок
        const maxPages = data.total_pages > 500 ? 500 : data.total_pages;
        setTotalPages(maxPages);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        // Плавний скрол вгору при зміні сторінки або фільтрів
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchMovies();
  }, [genre, year, country, searchQuery, currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={styles.section}>
      <div className="container">
        {/* Заголовок результатів пошуку показується лише якщо не застосовані фільтри */}
        {searchQuery && !genre && !year && !country && (
          <h2 className={styles.searchTitle}>
            Результати пошуку: &ldquo;{searchQuery}&rdquo;
          </h2>
        )}
        
        <div className={styles.flexContainer}>
          {loading ? (
            <div className={styles.loader}>Завантаження...</div>
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {movie.poster_path ? (
                    <Image 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title} 
                      fill 
                      sizes="(max-width: 400px) 33vw, 128px" 
                      className={styles.image} 
                      priority={false}
                    />
                  ) : (
                    <div className={styles.noImage}>Постер відсутній</div>
                  )}
                  <div className={styles.rating}>
                    {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}
                  </div>
                </div>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
              </Link>
            ))
          ) : (
            <div className={styles.empty}>Нічого не знайдено за вашим запитом</div>
          )}
        </div>

        {!loading && movies.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </section>
  );
}