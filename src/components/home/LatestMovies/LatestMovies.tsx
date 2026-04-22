import { getMovies } from "@/lib/tmdb"; 
import { Movie } from "@/types/movie";
import styles from "./LatestMovies.module.css";
import Image from "next/image";
import Link from "next/link";
import SliderButtons from "./SliderButtons/SliderButtons";
import { slugify } from "@/utils/slugify"; // Використовуємо нашу нову утиліту

export default async function LatestMovies() {
  // Отримуємо дані з TMDB (це серверний запит)
  const movies: Movie[] = await getMovies('/movie/now_playing');
  
  // Беремо перші 10 фільмів для слайдера
  const latestMovies: Movie[] = movies.slice(0, 10);
  const sliderId = "latest-movies-slider";

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>ОСТАННІ НОВИНКИ</h2>
        
        <div className={styles.relativeWrapper}>
          {/* Кнопки керування слайдером */}
          <SliderButtons sliderId={sliderId} />

          <div id={sliderId} className={styles.sliderContainer}>
            {latestMovies.map((movie: Movie, index: number) => {
              // Формуємо красиве посилання: ID + назва латиницею
              const movieSlug = `${movie.id}-${slugify(movie.title)}`;

              return (
                <Link 
                  href={`/movie/${movieSlug}`} 
                  key={movie.id} 
                  className={styles.card}
                >
                  <div className={styles.imageWrapper}>
                    <Image 
                      // Використовуємо середній розмір зображення (w342) для економії трафіку
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} 
                      alt={movie.title}
                      fill
                      // Оптимізація розмірів для різних екранів
                      sizes="(max-width: 768px) 150px, 200px" 
                      className={styles.image}
                      // Пріоритет завантаження тільки для перших 4-х карток у слайдері
                      priority={index < 4}
                      quality={75} 
                    />
                    <div className={styles.rating}>
                      {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}
                    </div>
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.movieTitle}>{movie.title}</h3>
                  </div>
                </Link>
              );
            })}
            {/* Додатковий відступ для коректного скролу в кінці */}
            <div className={styles.sliderPadding}></div>
          </div>
        </div>
      </div>
    </section>
  );
}