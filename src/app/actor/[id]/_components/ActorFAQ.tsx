import type { ActorMovieCredit } from '../../../../../lib/types';
import styles from './ActorFAQ.module.css';

interface Props {
  actorName: string;
  aboutText: string;
  movies: ActorMovieCredit[];
  birthdayFormatted: string | null;
  age: number | null;
}

export default function ActorFAQ({ actorName, aboutText, movies, birthdayFormatted, age }: Props) {
  return (
    <section className={styles.section}>
      <div className="container">
        <details className={styles.q}>
          <summary><span className={styles.marker}>?</span> Хто такий {actorName}?</summary>
          <p>{aboutText}</p>
        </details>

        <details className={styles.q}>
          <summary><span className={styles.marker}>?</span> В яких фільмах знімався {actorName}?</summary>
          <p>
            {actorName} знімався: {movies.slice(0, 5).map(m => `«${m.title}»`).join(', ')}
            {movies.length > 5 && ` та ще ${movies.length - 5} інших`}.
          </p>
        </details>

        {birthdayFormatted && (
          <details className={styles.q}>
            <summary><span className={styles.marker}>?</span> Скільки років {actorName}?</summary>
            <p>
              {actorName} народився {birthdayFormatted}.
              {age !== null && ` Зараз йому ${age} років.`}
            </p>
          </details>
        )}
      </div>
    </section>
  );
}