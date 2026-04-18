import { Suspense } from "react";
import GenreFilters from "@/components/home/GenreFilters/GenreFilters";
import LatestMovies from "@/components/home/LatestMovies/LatestMovies";
import MovieCardAll from "@/components/home/MovieCardAll/MovieCardAll";
import TextGolovna from "@/components/home/TextGolovna/TextGolovna";

export default function HomePage() {
  return (
    <div className="container">
      {/* Слайдер з новинками (зазвичай не залежить від searchParams) */}
      <LatestMovies />

      {/* Загортаємо фільтри та каталог у Suspense. 
          Це критично важливо для успішної команди npm run build.
      */}
      <Suspense fallback={
        <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
          Завантаження каталогу...
        </div>
      }>
        <GenreFilters />
        <MovieCardAll />
      </Suspense>

      {/* Секція з текстом про сайт */}
      <TextGolovna />
    </div>
  );
}