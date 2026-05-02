import { Suspense } from "react";
import GenreFilters from "@/components/home/GenreFilters/GenreFilters";
import LatestMovies from "@/components/home/LatestMovies/LatestMovies";
import MovieCardAll from "@/components/home/MovieCardAll/MovieCardAll";
import TextGolovna from "@/components/home/TextGolovna/TextGolovna";
import HeroSlider from "@/components/home/HeroSlider/HeroSlider";
import { HomePageProps } from "@/types/movie";
import { getMovies } from "@/lib/tmdb";

// Налаштовуємо ISR: сторінка буде оновлюватися у фоновому режимі максимум раз на 1 годину (3600 сек)
// Це дозволяє Next.js віддавати сторінку миттєво з кешу сервера
export const revalidate = 3600; 

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Очікуємо параметри
  const filters = await searchParams;
  const currentPage = Number(filters.page) || 1;

  // 2. Завантажуємо дані для HeroSlider
  // Додаємо cache: 'force-cache' або використовуємо налаштування fetch у getMovies
  const trendingMovies = await getMovies('/trending/movie/day');
  const heroMovie = trendingMovies?.[0] || null;

  const activeFilters = {
    genre: filters.genre,
    year: filters.year,
    country: filters.country
  };

  return (
    <main className="container">
      {/* HeroSlider тепер рендериться миттєво з кешу */}
      <HeroSlider initialMovie={heroMovie} /> 
      
      {/* Рекомендую додати Suspense і сюди, якщо LatestMovies робить важкі запити */}
      <Suspense fallback={<div>Завантаження новинок...</div>}>
        <LatestMovies />
      </Suspense>

      <Suspense 
        key={JSON.stringify(filters)} 
        fallback={<div className="catalog-loader" style={{textAlign: 'center', padding: '50px'}}>Завантаження каталогу...</div>}
      >
        <section id="catalog" style={{ minHeight: '600px', paddingTop: '20px' }}>
          <GenreFilters />
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