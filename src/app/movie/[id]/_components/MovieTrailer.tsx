import styles from './MovieTrailer.module.css';

interface Props {
  movieTitle: string;
  trailerKey: string;
}

export default function MovieTrailer({ movieTitle, trailerKey }: Props) {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Трейлер {movieTitle} українською</h2>
        <div className={styles.wrap}>
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            allowFullScreen
            title={`Трейлер ${movieTitle}`}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}