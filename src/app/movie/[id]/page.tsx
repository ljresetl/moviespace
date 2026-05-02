import { getMovieDetails, getMovieCredits, getMovieVideos } from "@/lib/tmdb";
import MovieDetailsContent from "@/app/movie/[id]/MovieDetailsContent";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Налаштовуємо кешування: сторінка фільму оновлюється не частіше ніж раз на добу (86400 сек)
// Оскільки інформація про фільм (актори, опис) змінюється рідко.
export const revalidate = 86400; 

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Динамічна генерація метаданих
 */
export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  
  if (!rawId) return {};

  const cleanId = parseInt(rawId.split("-")[0]);
  if (isNaN(cleanId)) return {};

  // Next.js автоматично дедуплікує цей запит, тому він не навантажує API повторно
  const movie = await getMovieDetails(cleanId);
  if (!movie) return {};

  const title = `${movie.title} дивитись онлайн українською`;
  const description = movie.overview 
    ? movie.overview.slice(0, 160) + "..." 
    : `Дивитись фільм ${movie.title} онлайн в хорошій якості на KinoShrot.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
      type: "video.movie",
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;

  if (!rawId) return notFound();

  const cleanId = parseInt(rawId.split("-")[0]);
  if (isNaN(cleanId)) return notFound();

  // Паралельне завантаження вже є — це чудово для швидкості першого рендеру
  const [movie, credits, trailerKey] = await Promise.all([
    getMovieDetails(cleanId),
    getMovieCredits(cleanId),
    getMovieVideos(cleanId)
  ]);

  if (!movie) return notFound();

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