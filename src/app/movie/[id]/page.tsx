import { getMovieDetails, getMovieCredits, getMovieVideos } from "@/lib/tmdb";
import MovieDetailsContent from "@/app/movie/[id]/MovieDetailsContent";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;

  if (!rawId) return notFound();

  const id = parseInt(rawId.split("-")[0]);
  if (isNaN(id)) return notFound();

  const [movie, credits, trailerKey] = await Promise.all([
    getMovieDetails(id),
    getMovieCredits(id),
    getMovieVideos(id)
  ]);

  if (!movie) return notFound();

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