"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieDetails } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import styles from "./MoviePage.module.css";

export default function MovieDetailsContent({ movie }: { movie: MovieDetails }) {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className="container">
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Назад
        </button>

        <div className={styles.movieContent}>
          <div className={styles.posterWrapper}>
            {movie.poster_path ? (
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                width={300}
                height={450}
                className={styles.poster}
                priority
              />
            ) : (
              <div className={styles.noPoster}>Постер відсутній</div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            {movie.tagline && <p className={styles.tagline}>&ldquo;{movie.tagline}&rdquo;</p>}
            
            <div className={styles.meta}>
              <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
              <span className={styles.year}>📅 {movie.release_date.split("-")[0]} рік</span>
              {movie.runtime && <span className={styles.runtime}>🕒 {movie.runtime} хв.</span>}
            </div>

            <div className={styles.genres}>
              {movie.genres.map((g) => (
                <span key={g.id} className={styles.genreTag}>{g.name}</span>
              ))}
            </div>

            <div className={styles.description}>
              <h3>Опис</h3>
              <p className={styles.overview}>
                {movie.overview || "Опис українською мовою поки що відсутній."}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.playerSection}>
          <h2 className={styles.playerTitle}>Дивитися онлайн</h2>
          <div className={styles.playerPlaceholder}>
            <div className={styles.placeholderOverlay}>
              <div className={styles.playIcon}>▶</div>
              <p>Плеєр тимчасово недоступний (режим розробки)</p>
            </div>
            {movie.backdrop_path && (
              <Image 
                src={getImageUrl(movie.backdrop_path)} 
                alt="Player Background" 
                fill 
                className={styles.placeholderImg}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}