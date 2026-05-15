"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { MovieDetails, ExtendedSession } from '../../../../lib/types';

import MovieHero from './_components/MovieHero';
import MovieDescription from './_components/MovieDescription';
import styles from './page.module.css';

// Ліниві компоненти — вантажаться тільки коли потрібні
const MoviePlayer = dynamic(() => import('./_components/MoviePlayer'), { ssr: false });
const MovieTrailer = dynamic(() => import('./_components/MovieTrailer'), { ssr: false });
const MovieCast = dynamic(() => import('./_components/MovieCast'), { ssr: false });
const MovieComments = dynamic(() => import('./_components/MovieComments'), { ssr: false });
const MovieFAQ = dynamic(() => import('./_components/MovieFAQ'), { ssr: false });

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
    ю: 'yu', я: 'ya', ъ: '', э: 'e', ы: 'y',
    А: 'A', Б: 'B', В: 'V', Г: 'H', Ґ: 'G', Д: 'D', Е: 'E', Є: 'Ye',
    Ж: 'Zh', З: 'Z', И: 'Y', І: 'I', Ї: 'Yi', Й: 'Y', К: 'K', Л: 'L',
    М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U',
    Ф: 'F', Х: 'Kh', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Shch', Ь: '',
    Ю: 'Yu', Я: 'Ya', Ъ: '', Э: 'E', Ы: 'Y',
  };
  return text.split('').map(ch => map[ch] ?? ch).join('');
}

export default function MoviePageClient() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id as string;
  const tmdbId = rawId?.split('-')[0];
  const { data: sessionData, status: authStatus } = useSession();
  const session = sessionData as ExtendedSession | null;
  const isLoggedIn = authStatus === 'authenticated';

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [externalId, setExternalId] = useState<{ type: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!tmdbId) { setLoading(false); return; }
      try {
        const res = await fetch(
          `/api/tmdb/movie/${tmdbId}?language=uk-UA&append_to_response=videos,credits,external_ids`
        );
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
        const data: MovieDetails = await res.json();
        setMovie(data);

        if (data.external_ids?.kp_id) {
          setExternalId({ type: "kp", id: String(data.external_ids.kp_id) });
        } else if (data.external_ids?.imdb_id) {
          setExternalId({ type: "imdb", id: data.external_ids.imdb_id });
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [tmdbId]);

  useEffect(() => {
    if (movie) {
      const slug = transliterate(movie.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const newUrl = `/movie/${tmdbId}-${slug}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [movie, tmdbId]);

  if (loading) return (
    <div className={styles.loader}>
      <Loader2 className={styles.spinner} size={50} />
    </div>
  );

  if (!movie || !tmdbId) return (
    <div className={styles.error}>
      <h2>Фільм не знайдено</h2>
      <p>Перевірте посилання або поверніться на головну</p>
    </div>
  );

  const trailer = movie.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const cast = movie.credits?.cast.slice(0, 10) || [];
  const year = movie.release_date?.split('-')[0] || '';
  const castNames = cast.map(a => a.name);
  const genreNames = movie.genres.map(g => g.name).join(', ');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    datePublished: movie.release_date,
    genre: movie.genres.map(g => g.name),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average.toFixed(1),
      bestRating: "10",
      ratingCount: String(movie.vote_count || 1000),
    },
    actor: cast.map(a => ({ "@type": "Person", name: a.name })),
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.navSection}>
        <div className="container">
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={18} />
            <span>Назад</span>
          </button>
        </div>
      </section>

      <MovieHero movie={movie} />
      <MovieDescription movie={movie} castNames={castNames} />
      <MoviePlayer movieTitle={movie.title} year={year} isLoggedIn={isLoggedIn} externalId={externalId} loading={loading} />
      {trailer && <MovieTrailer movieTitle={movie.title} trailerKey={trailer.key} />}
      <MovieCast cast={cast} movieTitle={movie.title} />
      <MovieComments tmdbId={tmdbId} isLoggedIn={isLoggedIn} userEmail={session?.user?.email || null} />
      <MovieFAQ movieTitle={movie.title} rating={movie.vote_average.toFixed(1)} genres={genreNames} year={year} castNames={castNames} />
    </div>
  );
}