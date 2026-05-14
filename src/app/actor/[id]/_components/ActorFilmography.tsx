import Link from 'next/link';
import Image from 'next/image';
import type { ActorMovieCredit } from '../../../../../lib/types';
import styles from './ActorFilmography.module.css';

interface Props {
  movies: ActorMovieCredit[];
  actorName: string;
}

export default function ActorFilmography({ movies, actorName }: Props) {
  if (movies.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.cN}>№</span>
          <span className={styles.cP}></span>
          <span className={styles.cT}>НАЗВА</span>
          <span className={styles.cY}>РІК</span>
          <span className={styles.cR}>РОЛЬ</span>
          <span className={styles.cS}>★</span>
        </div>

        {movies.map((m, i) => (
          <Link href={`/movie/${m.id}`} key={m.id} className={styles.row}>
            <span className={styles.cN}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.cP}>
              <div className={styles.mini}>
                <Image
                  src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                  alt={m.title}
                  fill
                  sizes="26px"
                  className={styles.miniImg}
                  loading="lazy"
                />
              </div>
            </span>
            <span className={styles.cT}>{m.title}</span>
            <span className={styles.cY}>{m.release_date?.split('-')[0]}</span>
            <span className={styles.cR}>{m.character || '—'}</span>
            <span className={styles.cS}>
              <span className={styles.badge}>{m.vote_average.toFixed(1)}</span>
            </span>
          </Link>
        ))}

        <p className={styles.summary}>
          ► {actorName} — учасник {movies.length}+ кінопроєктів.
          Найвідоміші: {movies.slice(0, 5).map(m => `«${m.title}»`).join(', ')}.
        </p>
      </div>
    </section>
  );
}