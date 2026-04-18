import GenreFilters from "@/components/home/GenreFilters/GenreFilters";
import LatestMovies from "@/components/home/LatestMovies/LatestMovies";
import MovieCardAll from "@/components/home/MovieCardAll/MovieCardAll";
import TextGolovna from "@/components/home/TextGolovna/TextGolovna";


export default function HomePage() {
  return (
    
      <div className="container">
        {/* Слайдер з новинками */}
        <LatestMovies />

        {/* Секція з кнопками-фільтрами */}
        <GenreFilters />

        {/* Основна секція, що реагує на фільтри */}
      <MovieCardAll />
      
      {/* Секця з текстом про сайт */}
      <TextGolovna />
    
      </div>
    
  );
}