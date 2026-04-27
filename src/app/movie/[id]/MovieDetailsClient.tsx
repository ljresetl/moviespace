// Знайдіть файл, де лежить ваш компонент MovieDetails
// Зазвичай це src/components/MovieDetails.tsx або подібний

import { ExtendedMovieDetailsProps } from "@/types/movie"; // Перевірте шлях до типів

export default function MovieDetails({ 
  movie, 
  trailerKey, 
  cast, 
  director, 
  playerToken // Тепер TypeScript дозволить його тут прийняти
}: ExtendedMovieDetailsProps) { // ЗМІНІТЬ ТИП ТУТ з MovieDetailsProps на ExtendedMovieDetailsProps
  
  return (
    <div>
      {/* Ваш контент */}
      <h1>{movie.title}</h1>
      {/* Використання токена, наприклад, для плеєра */}
      <input type="hidden" id="token" value={playerToken} />
    </div>
  );
}