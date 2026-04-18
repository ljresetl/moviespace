import { Suspense } from "react";
import GenreFilters from "@/components/home/GenreFilters/GenreFilters";
import LatestMovies from "@/components/home/LatestMovies/LatestMovies";
import MovieCardAll from "@/components/home/MovieCardAll/MovieCardAll";
import TextGolovna from "@/components/home/TextGolovna/TextGolovna";

// Описуємо типи для пропсів сторінки
interface HomePageProps {
  searchParams: Promise<{ 
    genre?: string; 
    year?: string; 
    country?: string 
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Чекаємо на отримання фільтрів з URL
  const filters = await searchParams;

  return (
    <div className="container">
      {/* Слайдер з новинками */}
      <LatestMovies />

      {/* Фільтри та каталог загортаємо в Suspense з унікальним ключем */}
      <Suspense 
        key={JSON.stringify(filters)} 
        fallback={<div className="catalog-loader">Завантаження каталогу...</div>}
      >
        <GenreFilters />
        {/* Тепер TypeScript знає, що MovieCardAll приймає filters */}
        <MovieCardAll filters={filters} />
      </Suspense>

      {/* Текстова секція */}
      <TextGolovna />
    </div>
  );
}