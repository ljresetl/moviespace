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

export default function MovieAll({
  currentPage,
  onMoviesLoaded,
}: MovieAllProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  // Фільтри
  const genre = searchParams.get("genre") || "";
  const sort = searchParams.get("sort") || "popularity.desc";
  const year = searchParams.get("year") || "";
  const country = searchParams.get("country") || "";

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

      try {
        const pages = [1, 2, 3, 4, 5];

        const requests = pages.map((page) => {
          const url = new URL(
            "https://api.themoviedb.org/3/discover/movie"
          );

          url.searchParams.set("language", "uk-UA");
          url.searchParams.set("sort_by", sort);
          url.searchParams.set("page", page.toString());

          // Жанр
          if (genre && genre !== "all") {
            url.searchParams.set("with_genres", genre);
          }

          // Рік
          if (year) {
            url.searchParams.set(
              "primary_release_year",
              year
            );
          }

          // Країна
          if (country) {
            url.searchParams.set(
              "with_origin_country",
              country
            );
          }

          return fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json());
        });

        const results = await Promise.all(requests);

        const allMovies = results.flatMap(
          (data) => data.results || []
        );

        // Видаляємо дублікати
        const uniqueMovies = Array.from(
          new Map(
            allMovies.map((movie) => [movie.id, movie])
          ).values()
        );

        setMovies(uniqueMovies);

        // Передаємо кількість фільмів у parent
        onMoviesLoaded(uniqueMovies.length);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [
    genre,
    sort,
    year,
    country,
    onMoviesLoaded,
  ]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // Пагінація
  const startIndex = (currentPage - 1) * 20;

  const displayedMovies = movies.slice(
    startIndex,
    startIndex + 20
  );

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>Всі фільми</h2>

        {displayedMovies.length === 0 ? (
          <p className={styles.notFound}>
            Фільми не знайдені
          </p>
        ) : (
          <div className={styles.flexContainer}>
            {displayedMovies.map((movie) => (
              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                className={styles.card}
              >
                <div className={styles.posterWrapper}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 480px) 50vw,
                           (max-width: 1024px) 25vw,
                           200px"
                    className={styles.poster}
                  />

                  <div className={styles.rating}>
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>

                <div className={styles.info}>
                  <h3 className={styles.movieTitle}>
                    {movie.title}
                  </h3>

                  <p className={styles.year}>
                    {movie.release_date?.split("-")[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}