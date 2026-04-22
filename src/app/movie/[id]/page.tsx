import { getMovieDetails, getMovieCredits, getMovieVideos } from "@/lib/tmdb";
import MovieDetailsContent from "@/app/movie/[id]/MovieDetailsContent";
import { notFound } from "next/navigation";

// Описуємо інтерфейс пропсів для Next.js 15
interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  // 1. Обов'язково чекаємо на розв'язання params
  const resolvedParams = await params;
  const rawId = resolvedParams.id;

  // 2. Перевіряємо чи є значення, щоб уникнути помилки split
  if (!rawId) {
    return notFound();
  }

  // 3. Витягуємо числовий ID (наприклад, із "1084577-myachi-dohory")
  const id = parseInt(rawId.split("-")[0]);

  // Якщо ID не є числом
  if (isNaN(id)) {
    return notFound();
  }

  // 4. Завантажуємо всі дані паралельно на сервері
  const [movie, credits, trailerKey] = await Promise.all([
    getMovieDetails(id),
    getMovieCredits(id),
    getMovieVideos(id)
  ]);

  if (!movie) {
    return notFound();
  }

  // Обробляємо дані для передачі в клієнтський компонент
  const cast = credits?.cast.slice(0, 10) || [];
  const director = credits?.crew.find((p) => p.job === "Director")?.name || "Невідомо";

  return (
    <MovieDetailsContent 
      movie={movie} 
      trailerKey={trailerKey} 
      cast={cast} 
      director={director} 
    />
  );
}