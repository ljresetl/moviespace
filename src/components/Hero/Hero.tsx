"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../Buttons/Buttons';
import styles from './Hero.module.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
}

export default function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingMovie = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
        if (!token) return;

        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?language=uk-UA`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (!res.ok) return;

        const data = await res.json();
        if (data.results && data.results.length > 0) {
          // Беремо випадковий фільм з першої десятки
          const randomIndex = Math.floor(Math.random() * 10);
          setMovie(data.results[randomIndex]);
        }
      } catch (error) {
        console.error("Помилка завантаження банера:", error);
      }
    };

    fetchTrendingMovie();
  }, []);

  const handleNavigate = () => {
    if (movie) {
      router.push(`/movie/${movie.id}`);
    }
  };

  if (!movie) return <div className={styles.loader}></div>;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className={styles.backgroundImage}
          sizes="100vw"
        />
      </div>

      <div className={styles.overlay}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.badge}>У тренді цього тижня</div>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.description}>
              {movie.overview.length > 200 
                ? movie.overview.substring(0, 200) + "..." 
                : movie.overview}
            </p>
            <div className={styles.actions}>
              <Button variant="primary" onClick={handleNavigate}>
                Дивитися зараз
              </Button>
              <Button variant="secondary" onClick={handleNavigate}>
                Про фільм
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}