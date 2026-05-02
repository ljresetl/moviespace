import { discoverMovies, getMovieDetails } from "@/lib/tmdb";
import MovieCardAllClient from "./MovieCardAllClient";
import { 
  DiscoverFilters, 
  TMDBResponse, 
  Movie, 
  MovieDetails,
  MoviesJsonData 
} from "@/types/movie";
import { getServerSession } from "next-auth";
import fs from "fs";
import path from "path";

interface MovieCardAllProps {
  filters: DiscoverFilters;
  page: number;
}

export default async function MovieCardAll({ filters, page }: MovieCardAllProps) {
  const session = await getServerSession();
  const isAuth = !!session;

  // 1. Отримуємо дані з TMDB за вашими фільтрами
  const data = (await discoverMovies(filters, page)) as TMDBResponse;
  
  // Використовуємо const, оскільки масив rawMovies не перепризначається
  const rawMovies: Movie[] = data?.results || [];
  const totalPages: number = data?.total_pages || 1;

  let finalMovies: Movie[] = [];

  if (isAuth) {
    try {
      // 2. Завантажуємо ваш список "повних" фільмів із JSON
      const filePath = path.join(process.cwd(), "src/data/movies.json");
      
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, "utf8");
        // Типізуємо парсинг JSON
        const jsonData: MoviesJsonData = JSON.parse(fileContents);
        
        // Створюємо Set для швидкої перевірки ID (Performance Boost)
        const premiumIds = new Set(jsonData.data.map(m => String(m.id_tmdb)));

        // 3. Залишаємо лише ті фільми від TMDB, які існують у вашому JSON
        finalMovies = rawMovies.filter(movie => premiumIds.has(String(movie.id)));
      }
    } catch (error) {
      console.error("Error matching premium movies:", error);
      finalMovies = [];
    }
  } else {
    // Для гостей відображаємо стандартний результат від TMDB
    finalMovies = rawMovies;
  }

  // Перевірка наявності активних фільтрів для заголовка
  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== null);

  return (
    <MovieCardAllClient 
      movies={finalMovies} 
      totalPages={totalPages} 
      currentPage={page}
      hasFilters={hasFilters}
      isPremiumView={isAuth}
    />
  );
}