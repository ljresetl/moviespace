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
        const pages = [1, 2, 3, 4, 5];

        const requests = pages.map((page) => {
          const params = new URLSearchParams();
          params.set("language", "uk-UA");
          params.set("sort_by", sort);
          params.set("page", page.toString());

          if (genre && genre !== "all") params.set("with_genres", genre);
          if (year) params.set("primary_release_year", year);
          if (country) params.set("with_origin_country", country);

          return fetch(`/api/tmdb/discover/movie?${params.toString()}`).then((res) => res.json());
        });

        const results = await Promise.all(requests);
        const allMovies = results.flatMap((data) => data.results || []);
        const uniqueMovies = Array.from(
          new Map(allMovies.map((movie) => [movie.id, movie])).values()
        );

        setMovies(uniqueMovies);
        onMoviesLoaded(uniqueMovies.length);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre, sort, year, country, onMoviesLoaded]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * 20;
  const displayedMovies = movies.slice(startIndex, startIndex + 20);

  return (
    <section className={styles.section} id="popular">
      <div className="container">
        <h2 className={styles.title}>Популярні</h2>

        {displayedMovies.length === 0 ? (
          <p className={styles.notFound}>Фільми не знайдені</p>
        ) : (
          <div className={styles.flexContainer}>
            {displayedMovies.map((movie) => (
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