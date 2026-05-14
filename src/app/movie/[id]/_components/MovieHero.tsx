"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Star, Calendar, Film, Clock, Globe, Share2 } from 'lucide-react';
import type { MovieDetails } from '../../../../../lib/types';
import styles from './MovieHero.module.css';

interface Props {
  movie: MovieDetails;
}

export default function MovieHero({ movie }: Props) {
  const [toast, setToast] = useState(false);
  const year = movie.release_date?.split('-')[0];

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${movie.title} — дивитися онлайн на KinoShrot`;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const mins = movie.runtime ? movie.runtime % 60 : 0;
  const countries = movie.production_countries?.map(c => c.name).join(', ');

  return (
    <section className={styles.section}>
      {toast && <div className={styles.toast}>✅ Посилання скопійовано!</div>}
      <div className="container">
        <div className={styles.grid}>

          {/* Постер */}
          <div className={styles.posterWrap}>
            <Image
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.png'}
              alt={`Постер ${movie.title} (${year})`}
              fill priority className={styles.posterImg}
              sizes="(max-width: 768px) 160px, 280px"
            />
            <div className={styles.ratingBadge}>
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          </div>

          {/* Інфо */}
          <div className={styles.info}>
            <div className={styles.infoTop}>
              <h1 className={styles.title}>
                {movie.title}
                <span className={styles.year}> ({year})</span>
              </h1>

              {movie.original_title && movie.original_title !== movie.title && (
                <p className={styles.originalTitle}>{movie.original_title}</p>
              )}

              <div className={styles.tags}>
                {movie.genres.map(g => (
                  <span key={g.id} className={styles.tag}>{g.name}</span>
                ))}
              </div>
            </div>

            {/* Мета-дані */}
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <Star size={16} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Рейтинг</span>
                  <strong className={styles.metaValue}>{movie.vote_average.toFixed(1)} / 10</strong>
                </div>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Рік</span>
                  <strong className={styles.metaValue}>{year}</strong>
                </div>
              </div>
              <div className={styles.metaItem}>
                <Film size={16} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Жанр</span>
                  <strong className={styles.metaValue}>{movie.genres.map(g => g.name).join(', ') || '—'}</strong>
                </div>
              </div>
              {movie.runtime > 0 && (
                <div className={styles.metaItem}>
                  <Clock size={16} className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Тривалість</span>
                    <strong className={styles.metaValue}>{hours}г {mins}хв</strong>
                  </div>
                </div>
              )}
              {countries && (
                <div className={styles.metaItem}>
                  <Globe size={16} className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Країна</span>
                    <strong className={styles.metaValue}>{countries}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Короткий опис — видно тільки на десктопі */}
            {movie.overview && (
              <p className={styles.overview}>{movie.overview}</p>
            )}

            {/* Кнопки */}
            <div className={styles.actions}>
              <button onClick={handleShare} className={styles.shareBtn}>
                <Share2 size={16} />
                <span>Поділитися</span>
              </button>
              <a href="https://t.me/kinoshrot_channel" target="_blank" rel="noopener noreferrer" className={styles.tgBtn}>
                <span>✈️ Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}