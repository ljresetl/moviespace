"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Share2, Loader2 } from 'lucide-react'; 
import Script from 'next/script';
import styles from './page.module.css';

// --- Interfaces ---
interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface MovieVideo {
  key: string;
  type: string;
  site: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  videos?: { results: MovieVideo[] };
  credits?: { cast: Actor[] };
  external_ids?: {
    kp_id?: string | number;
    imdb_id?: string;
  };
}

export default function MoviePage() {
  const router = useRouter();
  const params = useParams();
  const tmdbId = params?.id;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [externalId, setExternalId] = useState<{ type: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Константи з твого .env
  const PUBLISHER_ID = process.env.NEXT_PUBLIC_VIBIX_PUBLISHER_ID || "677712298";
  const VIBIX_TOKEN = process.env.NEXT_PUBLIC_VIBIX_TOKEN || "25865|pXUsxpJTa3RbdjAJVzCCAb4jSIEtajYpohl3VBb29b0ecb46";
  const AD_TYPES = process.env.NEXT_PUBLIC_VIBIX_AD_TYPES || "brand,sticker,pcsticker,banners,flyroll";

  // Функція ініціалізації плеєра
  const initVibix = useCallback(() => {
    // @ts-expect-error: Vibix SDK interface
    if (typeof window !== 'undefined' && window.Vibix && typeof window.Vibix.init === 'function') {
      console.log("Vibix: Initializing Player...");
      // @ts-expect-error: Vibix SDK interface
      window.Vibix.init();
    }
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
      if (!tmdbId || !token) {
        console.error("Missing tmdbId or TMDB token");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbId}?language=uk-UA&append_to_response=videos,credits,external_ids`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
        
        const data = await res.json();
        setMovie(data);

        // Визначаємо ID для плеєра
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

    fetchMovieData();
  }, [tmdbId]);

  // Запуск плеєра після появи даних у DOM
  useEffect(() => {
    if (externalId && !loading) {
      const timer = setTimeout(initVibix, 1000);
      return () => clearTimeout(timer);
    }
  }, [externalId, loading, initVibix]);

  if (loading) return (
    <div className={styles.loaderContainer}>
      <Loader2 className={styles.spinner} size={50} />
    </div>
  );

  if (!movie) return <div className={styles.error}>Фільм не знайдено. Перевірте консоль (F12).</div>;

  const trailer = movie.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const cast = movie.credits?.cast.slice(0, 10);

  return (
    <div className={styles.pageWrapper}>
      {/* Скрипти Vibix */}
      <Script 
        src="https://graphicslab.io/sdk/v2/rendex-sdk.min.js" 
        strategy="afterInteractive" 
        onLoad={initVibix}
      />
      <Script 
        src="https://v-js-menu.run/public/lib.en.min.js" 
        strategy="afterInteractive" 
      />

      <div className="container">
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={20} />
          <span>Назад</span>
        </button>

        <div className={styles.mainGrid}>
          <aside className={styles.leftCol}>
            <div className={styles.posterWrapper}>
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.png'}
                alt={movie.title}
                fill
                priority
                className={styles.posterImage}
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <div className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</div>
            </div>
          </aside>

          <main className={styles.rightCol}>
            <div className={styles.headerRow}>
              <h1 className={styles.title}>{movie.title}</h1>
              <button className={styles.shareBtn}><Share2 size={20} /></button>
            </div>

            <div className={styles.meta}>
              <span className={styles.year}>{movie.release_date?.split('-')[0]}</span>
              <div className={styles.genres}>
                {movie.genres.map(g => <span key={g.id} className={styles.genre}>{g.name}</span>)}
              </div>
            </div>

            <p className={styles.overview}>{movie.overview || "Опис завантажується..."}</p>

            {/* СЕКЦІЯ ПЛЕЄРА */}
            <section className={styles.playerSection}>
              <div className={styles.playerContainer}>
                {externalId ? (
                  <div className="playerFrame" data-vibix-player-shell>
                    <ins 
                      className="vibix-player"
                      data-publisher-id={PUBLISHER_ID}
                      data-token={VIBIX_TOKEN}
                      data-type={externalId.type} 
                      data-id={externalId.id}
                      data-design="1"
                      data-ad_types={AD_TYPES}
                    ></ins>
                  </div>
                ) : (
                  <div className={styles.errorText}>
                    ID для плеєра не знайдено (потрібен Kinopoisk або IMDB ID).
                  </div>
                )}
              </div>
            </section>

            {trailer && (
              <section className={styles.trailerSection}>
                <h3 className={styles.sectionTitle}>Трейлер</h3>
                <div className={styles.iframeWrapper}>
                  <iframe 
                    src={`https://www.youtube.com/embed/${trailer.key}`} 
                    allowFullScreen 
                    title="Official Trailer"
                  />
                </div>
              </section>
            )}

            <section className={styles.castSection}>
              <h3 className={styles.sectionTitle}>Актори</h3>
              <div className={styles.castScroll}>
                {cast?.map(actor => (
                  <div key={actor.id} className={styles.actorCard}>
                    <div className={styles.avatarWrapper}>
                      <Image
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/no-avatar.png'}
                        alt={actor.name}
                        fill
                        className={styles.avatar}
                      />
                    </div>
                    <p className={styles.actorName}>{actor.name}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}