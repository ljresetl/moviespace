import type { Metadata } from "next";
import ActorPageClient from "./ActorPageClient";

const SITE_URL = "https://kinoshrot.com";
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const [actorRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${id}?language=uk-UA`, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=uk-UA`, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }),
    ]);

    if (!actorRes.ok) return { title: "Актор — Кіношрот" };

    const actor = await actorRes.json();
    const credits = creditsRes.ok ? await creditsRes.json() : { cast: [] };
    const topMovies = credits.cast
      ?.filter((m: { poster_path: string }) => m.poster_path)
      .sort((a: { vote_average: number }, b: { vote_average: number }) => b.vote_average - a.vote_average)
      .slice(0, 5)
      .map((m: { title: string }) => m.title) || [];

    const photo = actor.profile_path
      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
      : "/og-image.png";

    const department = actor.known_for_department === "Acting" ? "актор" : actor.known_for_department?.toLowerCase() || "діяч кіно";

    const title = `${actor.name} — біографія, фільмографія, фото`;

    const description = `${actor.name} — ${department}. ${topMovies.length > 0 ? `Відомий за фільми: ${topMovies.join(", ")}.` : ""} ${actor.place_of_birth ? `Народився: ${actor.place_of_birth}.` : ""} Біографія, повна фільмографія та фото на Кіношрот.`;

    return {
      title,
      description,
      keywords: [
        actor.name,
        `${actor.name} фільми`,
        `${actor.name} біографія`,
        `${actor.name} фільмографія`,
        ...topMovies,
      ].filter(Boolean),

      openGraph: {
        title: `${actor.name} — біографія та фільмографія`,
        description,
        url: `${SITE_URL}/actor/${id}`,
        siteName: "Кіношрот",
        images: [{ url: photo, width: 500, height: 750, alt: `${actor.name} — фото` }],
        type: "profile",
        locale: "uk_UA",
      },

      twitter: {
        card: "summary_large_image",
        title: `${actor.name} — Кіношрот`,
        description: description.slice(0, 160),
        images: [photo],
      },

      alternates: {
        canonical: `${SITE_URL}/actor/${id}`,
      },
    };
  } catch {
    return { title: "Актор — Кіношрот" };
  }
}

export default function ActorPage() {
  return <ActorPageClient />
};