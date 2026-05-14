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

interface Props {
  initialMovie?: Movie | null;
}

export default function Hero({ initialMovie = null }: Props) {
  const [movie, setMovie] = useState<Movie | null>(initialMovie);
  const router = useRouter();

  useEffect(() => {
    if (movie) return;

    const fetchMovie = async () => {
      try {
        const res = await fetch('/api/tmdb/trending/movie/week?language=uk-UA');
        if (!res.ok) return;
        const data = await res.json();
        if (data.results?.length > 0) {
          setMovie(data.results[Math.floor(Math.random() * 10)]);
        }
      } catch (error) {
        console.error("Помилка завантаження банера:", error);
      }
    };
    fetchMovie();
  }, [movie]);

  if (!movie) return <div className={styles.loader}></div>;

  const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          fetchPriority="high"
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
              <Button variant="primary" onClick={() => router.push(`/movie/${movie.id}`)}>
                Дивитися зараз
              </Button>
              <Button variant="secondary" onClick={() => router.push(`/movie/${movie.id}`)}>
                Про фільм
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}