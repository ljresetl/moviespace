import { Suspense } from "react";
import GenreFilters from "@/components/home/GenreFilters/GenreFilters";
import LatestMovies from "@/components/home/LatestMovies/LatestMovies";
import MovieCardAll from "@/components/home/MovieCardAll/MovieCardAll";
import TextGolovna from "@/components/home/TextGolovna/TextGolovna";

export default function HomePage() {
  return (
    <div className="container">
      {/* Слайдер з новинками */}
      <LatestMovies />

      {/* Фільтри та каталог */}
      <Suspense fallback={<div className="catalog-loader">Завантаження каталогу...</div>}>
        <GenreFilters />
        <MovieCardAll />
      </Suspense>

      {/* Текстова секція */}
      <TextGolovna />
    </div>
  );
}