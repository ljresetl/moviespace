import type { Metadata } from "next";
import MoviePageClient from "./MoviePageClient";
import SeoBlock from "@/components/SeoBlock/SeoBlock";

const SITE_URL = "https://kinoshrot.com";
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tmdbId = id.split("-")[0];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=uk-UA&append_to_response=credits`,
      {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return { title: "Фільм — Кіношрот" };

    const movie = await res.json();
    const year = movie.release_date?.split("-")[0] || "";
    const genres = movie.genres?.map((g: { name: string }) => g.name).join(", ") || "";
    const cast = movie.credits?.cast?.slice(0, 5).map((a: { name: string }) => a.name).join(", ") || "";
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/og-image.png";

    const title = movie.original_title && movie.original_title !== movie.title
      ? `${movie.title} (${movie.original_title}, ${year}) — дивитись онлайн`
      : `${movie.title} (${year}) — дивитись онлайн українською`;

    const description = `Дивитись «${movie.title}» (${year}) онлайн безкоштовно українською мовою на Кіношрот. ${genres ? `Жанр: ${genres}.` : ""} ${movie.vote_average ? `Рейтинг: ${movie.vote_average.toFixed(1)}/10.` : ""} ${cast ? `У ролях: ${cast}.` : ""} ${movie.overview ? movie.overview.slice(0, 160) : ""}`;

    return {
      title,
      description,
      keywords: [
        movie.title,
        movie.original_title,
        `${movie.title} дивитись онлайн`,
        `${movie.title} українською`,
        `${movie.title} ${year}`,
        ...movie.genres?.map((g: { name: string }) => g.name) || [],
      ].filter(Boolean),

      openGraph: {
        title: `${movie.title} (${year}) — дивитись онлайн на Кіношрот`,
        description: movie.overview?.slice(0, 200) || description,
        url: `${SITE_URL}/movie/${id}`,
        siteName: "Кіношрот",
        images: [{ url: poster, width: 500, height: 750, alt: `Постер ${movie.title}` }],
        type: "video.movie",
        locale: "uk_UA",
      },

      twitter: {
        card: "summary_large_image",
        title: `${movie.title} (${year})`,
        description: movie.overview?.slice(0, 160) || "",
        images: [poster],
      },

      alternates: {
        canonical: `${SITE_URL}/movie/${id}`,
      },
    };
  } catch {
    return { title: "Фільм — Кіношрот" };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const tmdbId = id.split("-")[0];

  return (
    <>
      <MoviePageClient />
      <SeoBlock movieId={tmdbId} />
    </>
  );
}