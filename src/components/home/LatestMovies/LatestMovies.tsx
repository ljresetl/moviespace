import { getMovies } from "@/lib/tmdb"; // Прибираємо getImageUrl, якщо він повертає /original/
import { Movie } from "@/types/movie";
import styles from "./LatestMovies.module.css";
import Image from "next/image";
import Link from "next/link";
import SliderButtons from "./SliderButtons/SliderButtons";

export default async function LatestMovies() {
  const movies: Movie[] = await getMovies('/movie/now_playing');
  const latestMovies: Movie[] = movies.slice(0, 10);
  const sliderId = "latest-movies-slider";

  // Функція транслітерації для SEO-friendly URL
  const transliterate = (text: string) => {
    const map: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
      'ю': 'yu', 'я': 'ya'
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>ОСТАННІ НОВИНКИ</h2>
        
        <div className={styles.relativeWrapper}>
          <SliderButtons sliderId={sliderId} />

          <div id={sliderId} className={styles.sliderContainer}>
            {latestMovies.map((movie: Movie, index: number) => (
              <Link 
                href={`/movie/${movie.id}-${transliterate(movie.title)}`} 
                key={movie.id} 
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image 
                    // ВИПРАВЛЕННЯ: використовуємо w342 замість оригінального розміру
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} 
                    alt={movie.title}
                    fill
                    // ВИПРАВЛЕННЯ: вказуємо реальний розмір картки в макеті
                    sizes="(max-width: 768px) 150px, 200px" 
                    className={styles.image}
                    // Пріоритет тільки для перших карток, які видно відразу
                    priority={index < 4}
                    quality={75} // Оптимальна якість для малих зображень
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