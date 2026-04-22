import { Suspense } from "react";
import GenreFilters from "@/components/home/GenreFilters/GenreFilters";
import LatestMovies from "@/components/home/LatestMovies/LatestMovies";
import MovieCardAll from "@/components/home/MovieCardAll/MovieCardAll";
import TextGolovna from "@/components/home/TextGolovna/TextGolovna";
import HeroSlider from "@/components/home/HeroSlider/HeroSlider";
import { HomePageProps } from "@/types/movie";
import { getMovies } from "@/lib/tmdb";

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Очікуємо параметри (Next.js 15)
  const filters = await searchParams;
  const currentPage = Number(filters.page) || 1;

  // 2. Завантажуємо дані для HeroSlider на сервері
  // Це фіксить помилку 401, бо на сервері є доступ до process.env.TMDB_ACCESS_TOKEN
  const trendingMovies = await getMovies('/trending/movie/day');
  const heroMovie = trendingMovies?.[0] || null;

  // 3. Формуємо чистий об'єкт фільтрів
  const activeFilters = {
    genre: filters.genre,
    year: filters.year,
    country: filters.country
  };

  return (
    <main className="container">
      {/* Передаємо завантажений на сервері фільм у слайдер */}
      <HeroSlider initialMovie={heroMovie} /> 
      
      <LatestMovies />

      {/* Suspense реагує на зміну будь-якого фільтра або сторінки */}
      <Suspense 
        key={JSON.stringify(filters)} 
        fallback={<div className="catalog-loader">Завантаження каталогу...</div>}
      >
        <section id="catalog" style={{ minHeight: '600px', paddingTop: '20px' }}>
          <GenreFilters />
          
          {/* Серверний компонент, який сам завантажить список фільмів */}
          <MovieCardAll 
            filters={activeFilters} 
            page={currentPage} 
          />
        </section>
      </Suspense>

      <TextGolovna />
    </main>
  );
}