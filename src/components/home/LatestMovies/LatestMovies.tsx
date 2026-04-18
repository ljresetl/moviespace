import { getMovies, getImageUrl } from "@/lib/tmdb";
import { Movie } from "@/types/movie";
import styles from "./LatestMovies.module.css";
import Image from "next/image";
import Link from "next/link";
import SliderButtons from "./SliderButtons/SliderButtons";

export default async function LatestMovies() {
  const movies: Movie[] = await getMovies('/movie/now_playing');
  const latestMovies: Movie[] = movies.slice(0, 10);
  const sliderId = "latest-movies-slider";

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>ОСТАННІ НОВИНКИ</h2>
        
        <div className={styles.relativeWrapper}>
          <SliderButtons sliderId={sliderId} />

          <div id={sliderId} className={styles.sliderContainer}>
            {latestMovies.map((movie: Movie, index: number) => (
              <Link 
                href={`/movie/${movie.id}`} 
                key={movie.id} 
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image 
                    // Виправляємо помилку: передаємо порожній рядок, якщо poster_path === null
                    src={getImageUrl(movie.poster_path || "")} 
                    alt={movie.title}
                    fill
                    sizes="128px"
                    className={styles.image}
                    priority={index < 3}
                  />
                  <div className={styles.rating}>
                    {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}
                  </div>
                </div>
                <div className={styles.info}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                </div>
              </Link>
            ))}
            <div className={styles.sliderPadding}></div>
          </div>
        </div>
      </div>
    </section>
  );
}