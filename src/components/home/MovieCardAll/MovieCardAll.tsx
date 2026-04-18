"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Movie, TMDBResponse } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/home/Pagination/Pagination";
import styles from "./MovieCardAll.module.css";

export default function MovieCardAll() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const country = searchParams.get("country");
  const searchQuery = searchParams.get("search");
  const currentPage = Number(searchParams.get("page")) || 1;

  // Функція транслітерації для SEO-friendly URL (без повторів властивостей)
  const transliterate = (text: string) => {
    const map: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
      'ю': 'yu', 'я': 'ya'
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^\w\s-]/g, '') // Видаляємо спецсимволи
      .replace(/\s+/g, '-')     // Пробіли в дефіси
      .replace(/-+/g, '-')      // Видаляємо подвійні дефіси
      .trim();
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("language", "uk-UA");
      params.set("page", currentPage.toString());

      let endpoint = "/movie/popular";

      if (genre || (year && year !== "Усі роки") || country) {
        endpoint = "/discover/movie";
        params.set("sort_by", "popularity.desc");
        if (genre) params.set("with_genres", genre);
        if (year && year !== "Усі роки") params.set("primary_release_year", year);
        if (country) params.set("with_origin_country", country);
      } else if (searchQuery) {
        endpoint = "/search/movie";
        params.set("query", searchQuery);
      }

      const url = `https://api.themoviedb.org/3${endpoint}?${params.toString()}`;

      try {
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            accept: 'application/json'
          }
        });
        const data: TMDBResponse = await res.json();
        setMovies(data.results || []);
        const maxPages = data.total_pages > 500 ? 500 : data.total_pages;
        setTotalPages(maxPages);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchMovies();
  }, [genre, year, country, searchQuery, currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={styles.section}>
      <div className="container">
        {searchQuery && !genre && !year && !country && (
          <h2 className={styles.searchTitle}>
            Результати пошуку: &ldquo;{searchQuery}&rdquo;
          </h2>
        )}
        
        <div className={styles.flexContainer}>
          {loading ? (
            <div className={styles.loader}>Завантаження...</div>
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <Link 
                href={`/movie/${movie.id}-${transliterate(movie.title)}`} 
                key={movie.id} 
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  {movie.poster_path ? (
                    <Image 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title} 
                      fill 
                      sizes="(max-width: 400px) 33vw, 128px" 
                      className={styles.image} 
                    />
                  ) : (
                    <div className={styles.noImage}>Постер відсутній</div>
                  )}
                  <div className={styles.rating}>
                    {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}
                  </div>
                </div>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
              </Link>
            ))
          ) : (
            <div className={styles.empty}>Нічого не знайдено</div>
          )}
        </div>

        {!loading && movies.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </section>
  );
}