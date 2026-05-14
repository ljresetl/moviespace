import styles from './MovieFAQ.module.css';

interface Props {
  movieTitle: string;
  rating: string;
  genres: string;
  year: string;
  castNames: string[];
}

export default function MovieFAQ({ movieTitle, rating, genres, year, castNames }: Props) {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Часті питання</h2>
        <div className={styles.list}>
          <details className={styles.item}>
            <summary>Де дивитися {movieTitle} онлайн?</summary>
            <p>Дивитися &laquo;{movieTitle}&raquo; онлайн безкоштовно можна на KinoShrot. Фільм доступний у високій якості українською мовою.</p>
          </details>
          <details className={styles.item}>
            <summary>Який рейтинг фільму {movieTitle}?</summary>
            <p>Рейтинг &laquo;{movieTitle}&raquo; — {rating}/10 за TMDB. Жанр: {genres.toLowerCase()}. Рік: {year}.</p>
          </details>
          <details className={styles.item}>
            <summary>Хто знімався у фільмі {movieTitle}?</summary>
            <p>У головних ролях: {castNames.join(', ') || 'інформація завантажується'}.</p>
          </details>
        </div>
      </div>
    </section>
  );
}