import { getMovieDetails, getMovieCredits, getMovieVideos } from "@/lib/tmdb";
import MovieDetailsContent from "@/app/movie/[id]/MovieDetailsContent";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  // Розв'язуємо проміс params (вимога Next.js 15)
  const resolvedParams = await params;
  const rawId = resolvedParams.id;

  if (!rawId) return notFound();

  // Витягуємо ID
  const cleanId = parseInt(rawId.split("-")[0]);
  if (isNaN(cleanId)) return notFound();

  // Отримуємо дані паралельно
  const [movie, credits, trailerKey] = await Promise.all([
    getMovieDetails(cleanId),
    getMovieCredits(cleanId),
    getMovieVideos(cleanId)
  ]);

  if (!movie) return notFound();

  // Отримуємо токен (безпечно на сервері)
  const token = process.env.PLAYER_TOKEN || ""; 

  const cast = credits?.cast.slice(0, 10) || [];
  const director = credits?.crew.find((p) => p.job === "Director")?.name || "Невідомо";

  return (
    <MovieDetailsContent 
      movie={movie} 
      trailerKey={trailerKey} 
      cast={cast} 
      director={director} 
      playerToken={token} 
    />
  );
}