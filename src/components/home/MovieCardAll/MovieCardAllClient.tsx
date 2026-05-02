"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "./../Pagination/Pagination";
import styles from "./MovieCardAll.module.css";
import { Movie } from "@/types/movie";
import { slugify } from "@/utils/slugify";

// Типізація пропсів для клієнтської частини
interface MovieCardAllClientProps {
  movies: Movie[];
  totalPages: number;
  currentPage: number;
  hasFilters: boolean;
  isPremiumView: boolean;
}

export default function MovieCardAllClient({ 
  movies, 
  totalPages, 
  currentPage, 
  hasFilters,
  isPremiumView
}: MovieCardAllClientProps) {
  const sectionRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (currentPage > 1 && sectionRef.current) {
      const yOffset = -100; 
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <section className={styles.section}>
      <h2 ref={sectionRef} className={styles.titleText}>
        {isPremiumView ? "Ваша преміум колекція" : (hasFilters ? "Результати пошуку" : "Усі фільми")}
      </h2>

      <div className={styles.flexContainer}>
        {movies.length > 0 ? (
          movies.map((movie) => {
            const movieSlug = `${movie.id}-${slugify(movie.title)}`;
            
            return (
              <Link 
                key={movie.id} 
                href={`/movie/${movieSlug}`} 
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  {isPremiumView && (
                    <div className={styles.premiumBadge}>Full HD</div>
                  )}
                  <div className={styles.rating}>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}
                  </div>
                  <Image 
                    className={styles.image}
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.png"} 
                    alt={movie.title} 
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    quality={75}
                  />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <span className={styles.movieYear}>
                    {movie.release_date ? movie.release_date.split("-")[0] : "—"}
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={styles.noResults}>
            <p>Наразі фільмів не знайдено.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} />
      )}
    </section>
  );
}