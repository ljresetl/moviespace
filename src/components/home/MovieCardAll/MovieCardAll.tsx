"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

  const { genre, year, country } = filters;

  // Функція транслітерації БЕЗ дублікатів властивостей
  const slugify = (text: string) => {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
      'ю': 'yu', 'я': 'ya', 'ы': 'y', 'э': 'e', 'ё': 'yo', 'ъ': ''
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('')
      .replace(/[^\w\s-]/g, '') // Видаляємо все, крім англ. букв, цифр і дефісів
      .trim()
      .replace(/\s+/g, '-')     // Пробіли в дефіси
      .replace(/-+/g, '-');     // Подвійні дефіси в один
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const filterYear = year === "Усі роки" ? "" : year;
        const url = `https://api.themoviedb.org/3/discover/movie?language=uk-UA&page=1&with_genres=${genre || ""}&primary_release_year=${filterYear || ""}&with_origin_country=${country || ""}`;

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
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre, year, country]);

  if (loading) return <div className={styles.loader}>Завантаження фільмів...</div>;

  return (
    <section className={styles.section}>
      <h2 className={styles.titleText}>
        {genre || (year && year !== "Усі роки") || country ? "Результати пошуку" : "Усі фільми"}
      </h2>

      <div className={styles.flexContainer}>
        {movies.length > 0 ? (
          movies.map((movie) => {
            // Формуємо slug: /movie/ID-nazva-filmu
            const movieSlug = `${movie.id}-${slugify(movie.title)}`;
            
            return (
              <Link 
                key={movie.id} 
                href={`/movie/${movieSlug}`} 
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <div className={styles.rating}>
                    {movie.vote_average.toFixed(1)}
                  </div>
                  
                  <img 
                    className={styles.image}
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                      : "/no-poster.png"
                    } 
                    alt={movie.title} 
                    loading="lazy"
                  />
                </div>
                
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                
                <span className={styles.movieYear}>
                  {movie.release_date?.split("-")[0]}
                </span>
              </Link>
            );
          })
        ) : (
          <p className={styles.loader}>Фільмів не знайдено</p>
        )}
      </div>
    </section>
  );
}