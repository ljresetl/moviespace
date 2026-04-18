import { Metadata } from "next";
import { getImageUrl } from "@/lib/tmdb";
import { MovieDetails } from "@/types/movie";
import MovieDetailsContent from "./MovieDetailsContent";

type Props = {
  params: Promise<{ id: string }>;
};

// Функція для отримання даних про фільм
async function getMovie(id: string): Promise<MovieDetails | null> {
  const cleanId = id.split("-")[0]; // Витягуємо тільки цифри ID
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${cleanId}?language=uk-UA`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 }, // Кешування на годину
    }
  );
  if (!res.ok) return null;
  return res.json();
}

// ГЕНЕРАЦІЯ МЕТАДАНИХ ДЛЯ SEO (Фото та опис)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const movie = await getMovie(resolvedParams.id);

  if (!movie) return { title: "Фільм не знайдено - MovieSpace" };

  const description = movie.overview ? movie.overview.slice(0, 160) + "..." : "Дивитися фільм онлайн на MovieSpace";
  const image = getImageUrl(movie.backdrop_path || movie.poster_path || "");

  return {
    title: `${movie.title} (${movie.release_date.split("-")[0]}) — MovieSpace`,
    description: description,
    openGraph: {
      title: movie.title,
      description: description,
      images: [{ url: image }],
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: description,
      images: [image],
    },
  };
}

export default async function MoviePage({ params }: Props) {
  const resolvedParams = await params;
  const movie = await getMovie(resolvedParams.id);

  if (!movie) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
        <h2>Фільм не знайдено</h2>
      </div>
    );
  }

  // Передаємо дані у клієнтський компонент для відображення інтерфейсу
  return <MovieDetailsContent movie={movie} />;
}