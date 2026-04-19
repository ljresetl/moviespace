"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

interface FeaturedMovie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
}

export default function HeroSlider() {
  const [movie, setMovie] = useState<FeaturedMovie | null>(null);

  // Функція транслітерації без дублікатів властивостей
  const slugify = (text: string) => {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ю': 'yu', 
      'я': 'ya', 'ы': 'y', 'э': 'e', 'ё': 'yo', 'ъ': ''
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  useEffect(() => {
    const fetchTrending = async () => {
      // Використовуємо тренди тижня для автоматичного оновлення контенту
      const url = `https://api.themoviedb.org/3/trending/movie/week?language=uk-UA`;
      
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          // Беремо найпопулярніший фільм тижня (перший у списку)
          setMovie(data.results[0]);
        }
      } catch (err) {
        console.error("Помилка завантаження банера:", err);
      }
    };
    fetchTrending();
  }, []);

  if (!movie) return null;

  // Формуємо SEO-friendly посилання з ID та транслітерованою назвою
  const movieSlug = `${movie.id}-${slugify(movie.title)}`;

  return (
    <div className={styles.heroSection}>
      <div className={styles.container}>
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
          className={styles.backgroundImage}
          alt={movie.title}
        />
        <div className={styles.overlay}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          <p className={styles.movieInfo}>{movie.overview}</p>
          <Link href={`/movie/${movieSlug}`} className={styles.watchBtn}>
            <span>▶</span> Дивитися зараз
          </Link>
        </div>
      </div>
    </div>
  );
}