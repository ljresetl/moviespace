"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import styles from "./MovieAll.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieAllProps {
  currentPage: number;
  onMoviesLoaded: (count: number) => void;
}

export default function MovieAll({ currentPage, onMoviesLoaded }: MovieAllProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const genre = searchParams.get("genre") || "";
  const sort = searchParams.get("sort") || "popularity.desc";
  const year = searchParams.get("year") || "";
  const country = searchParams.get("country") || "";

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("language", "uk-UA");
        params.set("sort_by", sort);
        params.set("page", currentPage.toString());

        if (genre && genre !== "all") params.set("with_genres", genre);
        if (year) params.set("primary_release_year", year);
        if (country) params.set("with_origin_country", country);

        const res = await fetch(`/api/tmdb/discover/movie?${params.toString()}`);
        const data = await res.json();

        setMovies(data.results || []);
        onMoviesLoaded(data.total_results || 0);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre, sort, year, country, currentPage, onMoviesLoaded]);

  if (loading) {
    return (
      <section className={styles.section} id="popular">
        <div className="container">
          <h2 className={styles.title}>Популярні</h2>
          <div className={styles.flexContainer}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={styles.skeleton}>
                <div className={styles.skeletonPoster}></div>
                <div className={styles.skeletonTitle}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="popular">
      <div className="container">
        <h2 className={styles.title}>Популярні</h2>

        {movies.length === 0 ? (
          <p className={styles.notFound}>Фільми не знайдені</p>
        ) : (
          <div className={styles.flexContainer}>
            {movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.card}>
                <div className={styles.posterWrapper}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 480px) 45vw, (max-width: 1024px) 20vw, 160px"
                    className={styles.poster}
                    quality={75}
                  />
                  <div className={styles.rating}>{movie.vote_average.toFixed(1)}</div>
                </div>
                <div className={styles.info}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <p className={styles.year}>{movie.release_date?.split("-")[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}