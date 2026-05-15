"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './MovieTrailer.module.css';

interface Props {
  movieTitle: string;
  trailerKey: string;
}

export default function MovieTrailer({ movieTitle, trailerKey }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Трейлер {movieTitle} українською</h2>

        {loaded ? (
          <div className={styles.wrap}>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              allowFullScreen
              title={`Трейлер ${movieTitle}`}
            />
          </div>
        ) : (
          <button
            className={styles.preview}
            onClick={() => setLoaded(true)}
            aria-label={`Відтворити трейлер ${movieTitle}`}
          >
            <Image
              src={`https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg`}
              alt={`Трейлер ${movieTitle}`}
              fill
              className={styles.thumbnail}
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className={styles.playOverlay}>
              <svg className={styles.playBtn} viewBox="0 0 68 48" width="68" height="48">
                <path
                  d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                  fill="#f00"
                />
                <path d="M45 24 27 14v20" fill="#fff" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}