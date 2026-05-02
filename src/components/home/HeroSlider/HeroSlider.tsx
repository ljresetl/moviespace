"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./HeroSlider.module.css";
import { Movie } from "@/types/movie";
import { slugify } from "@/utils/slugify";
import { getMovies } from "@/lib/tmdb";

interface HeroSliderProps {
  initialMovie?: Movie | null; 
}

export default function HeroSlider({ initialMovie }: HeroSliderProps) {
  const [movie, setMovie] = useState<Movie | null>(initialMovie || null);

  useEffect(() => {
    if (!initialMovie) {
      const fetchHeroMovie = async () => {
        try {
          // Викликаємо з рядковим параметром ендпоінту
          const movies = await getMovies('/movie/popular'); 
          
          if (movies && movies.length > 0) {
            setMovie(movies[0]);
          }
        } catch (error) {
          console.error("Slider data fetch error:", error);
        }
      };
      fetchHeroMovie();
    }
  }, [initialMovie]);

  if (!movie) return <div className={styles.heroPlaceholder} />;

  const movieSlug = `${movie.id}-${slugify(movie.title)}`;

  return (
    <div className={styles.heroSection}>
      <div className={styles.container}>
        {movie.backdrop_path ? (
          <Image 
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
            alt={movie.title}
            fill 
            priority 
            sizes="100vw"
            className={styles.backgroundImage}
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          <div className={styles.noBackdrop} />
        )}
        
        <div className={styles.overlay}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          
          <p className={styles.movieInfo}>
            {/* Безпечна перевірка довжини для уникнення помилки 'undefined' */}
            {movie.overview && movie.overview.length > 250 
              ? `${movie.overview.substring(0, 250)}...` 
              : movie.overview || "Опис відсутній."}
          </p>

          <Link href={`/movie/${movieSlug}`} className={styles.watchBtn}>
            <span>▶</span> Дивитися зараз
          </Link>
        </div>
      </div>
    </div>
  );
}