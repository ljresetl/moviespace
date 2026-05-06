"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  videos?: { results: { key: string; type: string }[] };
  credits?: { cast: Actor[] };
}

export default function MoviePage() {
  const router = useRouter();
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=uk-UA&append_to_response=videos,credits`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieData();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Скасовано");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Посилання скопійовано!");
    }
  };

  if (loading) return <div className={styles.loaderContainer}><div className={styles.spinner}></div></div>;
  if (!movie) return <div className={styles.error}>Фільм не знайдено</div>;

  const trailer = movie.videos?.results.find(v => v.type === "Trailer");
  const cast = movie.credits?.cast.slice(0, 10);

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <button onClick={() => router.back()} className={styles.backBtn}>← Назад</button>

        <div className={styles.mainGrid}>
          {/* Ліва колонка */}
          <aside className={styles.leftCol}>
            <div className={styles.posterWrapper}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                priority
                className={styles.posterImage}
              />
              <div className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</div>
            </div>
            <a href="https://t.me/your_channel" target="_blank" className={styles.tgBtnMain}>
              Дивитись у Telegram
            </a>
          </aside>

          {/* Права колонка */}
          <main className={styles.rightCol}>
            <div className={styles.headerRow}>
              <h1 className={styles.title}>{movie.title}</h1>
              <button onClick={handleShare} className={styles.shareBtn} title="Поділитися">
                🔗
              </button>
            </div>

            <div className={styles.meta}>
              <span className={styles.year}>{movie.release_date?.split('-')[0]}</span>
              <div className={styles.genres}>
                {movie.genres.map(g => <span key={g.id} className={styles.genre}>{g.name}</span>)}
              </div>
            </div>

            <p className={styles.overview}>{movie.overview || "Опис додається..."}</p>

            {/* Блок Telegram підписки */}
            <div className={styles.tgSubBox}>
              <div className={styles.tgSubText}>
                <strong>Ми в Telegram</strong>
                <span>Підписуйся, щоб не пропустити нові фільми!</span>
              </div>
              <a href="https://t.me/your_channel" target="_blank" className={styles.tgSubBtn}>
                Підписатися
              </a>
            </div>

            {/* Плеєр */}
            <section className={styles.playerSection}>
              <div className={styles.videoPlaceholder}>
                <div className={styles.overlay}>
                  <button className={styles.playBtn}>▶ Грати</button>
                  <p>Оберіть озвучення у плеєрі після запуску</p>
                </div>
              </div>
            </section>

            {/* Трейлер */}
            {trailer && (
              <section className={styles.trailerSection}>
                <h3 className={styles.sectionTitle}>Офіційний трейлер</h3>
                <div className={styles.iframeWrapper}>
                  <iframe src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen />
                </div>
              </section>
            )}

            {/* Актори */}
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