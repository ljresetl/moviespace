"use client";

import React, { useEffect, useState } from "react";
import styles from "./MovieCardAll.module.css";

// 1. Описуємо структуру об'єкта фільму (додано vote_average для рейтингу)
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

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const filterYear = year === "Усі роки" ? "" : year;
        
        // Формуємо URL запиту
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
      <h2 style={{ marginBottom: "15px", fontSize: "1.1rem", textAlign: "left" }}>
        {genre || (year && year !== "Усі роки") || country ? "Результати пошуку" : "Усі фільми"}
      </h2>

      <div className={styles.flexContainer}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {/* Рейтинг фільму */}
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
                />
              </div>
              
              <h3 className={styles.movieTitle}>{movie.title}</h3>
              
              {/* Додатково можна вивести рік під назвою */}
              <span style={{ fontSize: '0.65rem', color: 'gray' }}>
                {movie.release_date?.split("-")[0]}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.loader}>Фільмів не знайдено</p>
        )}
      </div>
    </section>
  );
}