"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './SeoBlock.module.css';

interface Movie {
  id: number;
  title: string;
  release_date: string;
}

interface Props {
  movieId?: string;
}

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
    ю: 'yu', я: 'ya', ъ: '', э: 'e', ы: 'y',
  };
  return text.split('').map(ch => map[ch] ?? ch).join('');
}

function getSlug(movie: Movie): string {
  const slug = transliterate(movie.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${movie.id}-${slug}`;
}

export default function SeoBlock({ movieId }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url: string;

        if (movieId) {
          url = `/api/tmdb/movie/${movieId}/similar?language=uk-UA&page=1`;
        } else {
          url = '/api/tmdb/trending/movie/week?language=uk-UA';
        }

        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();

        let results: Movie[] = data.results || [];

        if (!movieId) {
          const nowRes = await fetch('/api/tmdb/movie/now_playing?language=uk-UA&page=1');
          if (nowRes.ok) {
            const nowData = await nowRes.json();
            results = [...results, ...(nowData.results || [])] as Movie[];
          }
        }

        const unique: Movie[] = Array.from(
          new Map<number, Movie>(results.map((m) => [m.id, m])).values()
        )
          .filter((m) => m.id.toString() !== movieId)
          .slice(0, 50);

        setMovies(unique);
      } catch {
        /* silent */
      }
    };
    fetchMovies();
  }, [movieId]);

  if (movies.length === 0) return null;

  const title = movieId
    ? 'Схожі фільми — дивитися онлайн'
    : 'Обговорення фільмів на Кіношрот';

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.links}>
            {movies.map((movie, i) => {
              const year = movie.release_date?.split('-')[0];
              return (
                <span key={movie.id}>
                  <Link href={`/movie/${getSlug(movie)}`} className={styles.link}>
                    {movie.title} ({year}) {movieId ? 'онлайн' : 'Обговорення'}
                  </Link>
                  {i < movies.length - 1 && <span className={styles.divider}> | </span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}