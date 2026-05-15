"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { ActorDetails, ActorMovieCredit, ExtendedSession } from '../../../../lib/types';

import ActorPhoto from './_components/ActorPhoto';
import ActorBio from './_components/ActorBio';
import ActorFilmography from './_components/ActorFilmography';
import ActorFAQ from './_components/ActorFAQ';
import { DossierStamp, DossierDivider, DossierFooter } from './_components/DossierShell';
import styles from './page.module.css';

const MovieComments = dynamic(() => import('../../movie/[id]/_components/MovieComments'), { ssr: false });

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
    ю: 'yu', я: 'ya', ъ: '', э: 'e', ы: 'y',
    А: 'A', Б: 'B', В: 'V', Г: 'H', Ґ: 'G', Д: 'D', Е: 'E', Є: 'Ye',
    Ж: 'Zh', З: 'Z', И: 'Y', І: 'I', Ї: 'Yi', Й: 'Y', К: 'K', Л: 'L',
    М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U',
    Ф: 'F', Х: 'Kh', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Shch', Ь: '',
    Ю: 'Yu', Я: 'Ya', Ъ: '', Э: 'E', Ы: 'Y',
  };
  return text.split('').map(ch => map[ch] ?? ch).join('');
}

export default function ActorPageClient() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id as string;
  const actorId = rawId?.split('-')[0];
  const { data: sessionData, status: authStatus } = useSession();
  const session = sessionData as ExtendedSession | null;
  const isLoggedIn = authStatus === 'authenticated';

  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [movies, setMovies] = useState<ActorMovieCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const fetchActor = async () => {
      if (!actorId) { setLoading(false); return; }
      try {
        const [actorRes, creditsRes] = await Promise.all([
          fetch(`/api/tmdb/person/${actorId}?language=uk-UA`),
          fetch(`/api/tmdb/person/${actorId}/movie_credits?language=uk-UA`),
        ]);

        if (!actorRes.ok) throw new Error(`TMDB error: ${actorRes.status}`);

        const actorData: ActorDetails = await actorRes.json();
        setActor(actorData);

        if (actorData.birthday) {
          const now = new Date();
          const birth = new Date(actorData.birthday);
          let years = now.getFullYear() - birth.getFullYear();
          const m = now.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
          setAge(years);
        }

        if (creditsRes.ok) {
          const creditsData = await creditsRes.json();
          const sorted = (creditsData.cast || [])
            .filter((m: ActorMovieCredit) => m.poster_path && m.release_date)
            .sort((a: ActorMovieCredit, b: ActorMovieCredit) =>
              new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
            )
            .slice(0, 20);
          setMovies(sorted);
        }
      } catch (error) {
        console.error("Error fetching actor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActor();
  }, [actorId]);

  useEffect(() => {
    if (actor) {
      const slug = transliterate(actor.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const newUrl = `/actor/${actorId}-${slug}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [actor, actorId]);

  if (loading) return (
    <div className={styles.loaderWrap}>
      <Loader2 className={styles.spinner} size={40} />
      <span className={styles.loaderText}>ЗАВАНТАЖЕННЯ ДОСЬЄ...</span>
    </div>
  );

  if (!actor || !actorId) return (
    <div className={styles.loaderWrap}>
      <h2 className={styles.errorTitle}>ЗАПИС НЕ ЗНАЙДЕНО</h2>
      <p className={styles.errorSub}>Суб&#39;єкт відсутній у базі даних</p>
      <Link href="/" className={styles.errorLink}>← Повернутися</Link>
    </div>
  );

  const birthdayFormatted = actor.birthday
    ? new Date(actor.birthday).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const deathdayFormatted = actor.deathday
    ? new Date(actor.deathday).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const aboutParts: string[] = [];
  if (actor.known_for_department === 'Acting') {
    aboutParts.push(`${actor.name} — актор`);
  } else if (actor.known_for_department) {
    aboutParts.push(`${actor.name} — ${actor.known_for_department.toLowerCase()}`);
  } else {
    aboutParts.push(`${actor.name} — діяч кіно`);
  }
  if (actor.place_of_birth) aboutParts.push(`народився в ${actor.place_of_birth}`);
  if (birthdayFormatted) aboutParts.push(`${birthdayFormatted}${age !== null ? ` (${age} років)` : ''}`);
  if (deathdayFormatted) aboutParts.push(`помер ${deathdayFormatted}`);
  if (movies.length > 0) aboutParts.push(`знявся у ${movies.length}+ фільмах`);
  aboutParts.push(`індекс популярності — ${actor.popularity.toFixed(0)}`);
  const aboutText = aboutParts.join(', ') + '.';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: actor.name,
    description: actor.biography,
    image: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : undefined,
    birthDate: actor.birthday,
    birthPlace: actor.place_of_birth,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.navSection}>
        <div className="container">
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={18} />
            <span>Назад</span>
          </button>
        </div>
      </section>

      <DossierStamp actorId={actorId} />
      <ActorPhoto
        actor={actor}
        age={age}
        moviesCount={movies.length}
        topMovies={movies
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 5)
        }
      />
      <ActorBio actor={actor} aboutText={aboutText} />

      {movies.length > 0 && (
        <>
          <DossierDivider text={`ФІЛЬМОГРАФІЯ — ${movies.length} записів`} />
          <ActorFilmography movies={movies} actorName={actor.name} />
        </>
      )}

      <DossierDivider text="ДОВІДКА" />
      <ActorFAQ actorName={actor.name} aboutText={aboutText} movies={movies} birthdayFormatted={birthdayFormatted} age={age} />

      <DossierDivider text="КОМЕНТАРІ" />
      <MovieComments tmdbId={`actor_${actorId}`} isLoggedIn={isLoggedIn} userEmail={session?.user?.email || null} />

      <DossierFooter actorId={actorId} />
    </>
  );
}