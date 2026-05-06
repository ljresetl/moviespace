"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MovieAll.module.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

// Додаємо пропси
export default function MovieAll({ currentPage }: { currentPage: number }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
      try {
        const pages = [1, 2, 3, 4, 5];
        const requests = pages.map(page =>
          fetch(
            `https://api.themoviedb.org/3/discover/movie?language=uk-UA&sort_by=popularity.desc&page=${page}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).then(res => res.json())
        );
        const results = await Promise.all(requests);
        setMovies(results.flatMap(data => data.results || []));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div className={styles.loaderContainer}><div className={styles.spinner}></div></div>;

  // Логіка вибору потрібної 20-ки фільмів залежно від сторінки
  const startIndex = (currentPage - 1) * 20;
  const displayedMovies = movies.slice(startIndex, startIndex + 20);

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>Всі фільми</h2>
        <div className={styles.flexContainer}>
          {displayedMovies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.card}>
              <div className={styles.posterWrapper}>
                <Image
                  src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 480px) 50vw, (max-width: 1024px) 25vw, 200px"
                  className={styles.poster}
                />
                <div className={styles.rating}>{movie.vote_average.toFixed(1)}</div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <p className={styles.year}>{movie.release_date?.split('-')[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}