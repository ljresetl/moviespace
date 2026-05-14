import type { MovieDetails } from '../../../../../lib/types';
import styles from './MovieDescription.module.css';

interface Props {
  movie: MovieDetails;
  castNames: string[];
}

export default function MovieDescription({ movie, castNames }: Props) {
  const year = movie.release_date?.split('-')[0];
  const genres = movie.genres.map(g => g.name).join(', ');

  return (
    <section className={styles.section}>
      <div className="container">
        {/* Опис — видно ТІЛЬКИ на мобілі (на десктопі він в Hero) */}
        {movie.overview && (
          <div className={styles.mobileOverview}>
            <h2 className={styles.heading}>Опис фільму {movie.title}</h2>
            <p className={styles.overviewText}>{movie.overview}</p>
          </div>
        )}

        {/* SEO мета-текст — видно завжди */}
        <div className={styles.meta}>
          <p>
            <strong>{movie.title}</strong> — фільм {year} року у жанрі {genres.toLowerCase()}.
            {movie.vote_average > 7 && ` Рейтинг ${movie.vote_average.toFixed(1)}/10.`}
            {castNames.length > 0 && ` У головних ролях: ${castNames.slice(0, 5).join(', ')}.`}
          </p>
          <p>
            Дивитися <strong>{movie.title}</strong> онлайн українською безкоштовно на KinoShrot.
          </p>
        </div>
      </div>
    </section>
  );
}