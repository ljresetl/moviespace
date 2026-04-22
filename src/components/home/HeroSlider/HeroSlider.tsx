"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./HeroSlider.module.css";
import { Movie } from "@/types/movie";
import { slugify } from "@/utils/slugify";
import { getMovies } from "@/lib/tmdb"; // Додаємо імпорт для завантаження даних

interface HeroSliderProps {
  // Додаємо ?, щоб TypeScript не лаявся у page.tsx
  initialMovie?: Movie | null; 
}

export default function HeroSlider({ initialMovie }: HeroSliderProps) {
  // Використовуємо стан, щоб слайдер міг сам завантажити фільм, якщо його не передали
  const [movie, setMovie] = useState<Movie | null>(initialMovie || null);

  useEffect(() => {
    // Якщо при першому рендері фільму немає, завантажуємо популярний фільм
    if (!initialMovie) {
      const fetchHeroMovie = async () => {
        const movies = await getMovies('/movie/popular');
        if (movies && movies.length > 0) {
          setMovie(movies[0]);
        }
      };
      fetchHeroMovie();
    }
  }, [initialMovie]);

  // Якщо фільму все ще немає (йде завантаження), повертаємо заглушку або null
  if (!movie) return <div className={styles.heroPlaceholder} />;

  const movieSlug = `${movie.id}-${slugify(movie.title)}`;

  return (
    <div className={styles.heroSection}>
      <div className={styles.container}>
        <Image 
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
          alt={movie.title}
          fill 
          priority 
          sizes="100vw"
          className={styles.backgroundImage}
          style={{ objectFit: 'cover' }} 
        />
        
        <div className={styles.overlay}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          <p className={styles.movieInfo}>
            {movie.overview?.length > 250 
              ? `${movie.overview.substring(0, 250)}...` 
              : movie.overview}
          </p>
          <Link href={`/movie/${movieSlug}`} className={styles.watchBtn}>
            <span>▶</span> Дивитися зараз
          </Link>
        </div>
      </div>
    </div>
  );
}