"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          className={styles.imageWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            fetchPriority="high"
            className={styles.backgroundImage}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className={styles.overlay}>
        <div className="container">
          <div className={styles.content}>
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              У тренді цього тижня
            </motion.div>

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {movie.title}
            </motion.h1>

            <motion.div
              className={styles.ratingLine}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className={styles.ratingBadge}>⭐ {movie.vote_average.toFixed(1)}</span>
            </motion.div>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {movie.overview.length > 200
                ? movie.overview.substring(0, 200) + "..."
                : movie.overview}
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button variant="primary" onClick={() => router.push(`/movie/${movie.id}`)}>
                Дивитися зараз
              </Button>
              <Button variant="secondary" onClick={() => router.push(`/movie/${movie.id}`)}>
                Про фільм
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}