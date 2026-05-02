"use client";

import React, { useState, useMemo, useSyncExternalStore, useEffect, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { ExtendedMovieDetailsProps, Comment, Genre, CheckMovieResponse, CastMember } from "@/types/movie";
import MovieTabs from "@/components/home/MoviePlayer/MovieTabs";
import styles from "./MoviePage.module.css";

const PLAYER_TOKEN = "33a811c627033af901fb8aa5d449483c";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const RatingStars = ({ voteAverage }: { voteAverage: number }) => {
  const rating = voteAverage / 2;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={styles.starsWrapper} aria-label={`Рейтинг: ${voteAverage} з 10`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={styles.star}>
          {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "½" : "☆"}
        </span>
      ))}
      <span className={styles.voteValue}>{voteAverage.toFixed(1)}</span>
    </div>
  );
};

export default function MovieDetailsContent({ 
  movie, trailerKey, cast, director 
}: ExtendedMovieDetailsProps): React.JSX.Element {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [isMovieAvailable, setIsMovieAvailable] = useState<boolean | null>(null);
  const [player1Url, setPlayer1Url] = useState<string | null>(null);
  const [player2Url, setPlayer2Url] = useState<string | null>(null);
  const [kpId, setKpId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function checkAvailability() {
      try {
        const res = await fetch(`/api/check-movie?id=${movie.id}`);
        const data: CheckMovieResponse = await res.json();
        if (data.found) {
          setIsMovieAvailable(true);
          setKpId(data.kp_id ? String(data.kp_id) : null);
          setPlayer1Url(data.player1Url ? data.player1Url.replace("YOU_TOKEN", PLAYER_TOKEN) : null);
          setPlayer2Url(data.player2Url || null);
        } else {
          setIsMovieAvailable(false);
        }
      } catch (error) {
        setIsMovieAvailable(false);
      }
    }
    if (movie.id) checkAvailability();
  }, [movie.id]);

  const commentsJson = useSyncExternalStore(subscribe, () => localStorage.getItem(`comments_${movie.id}`) || "[]", () => "[]");
  const comments: Comment[] = useMemo(() => JSON.parse(commentsJson), [commentsJson]);

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj: Comment = {
      id: Date.now(),
      author: session?.user?.name || "Гість",
      text: newComment,
      date: new Date().toLocaleDateString("uk-UA"),
    };
    localStorage.setItem(`comments_${movie.id}`, JSON.stringify([commentObj, ...comments]));
    window.dispatchEvent(new Event("storage"));
    setNewComment("");
  };

  return (
    <article className={styles.heroSection}>
      <div className={styles.container}>
        {/* Хлебні крихти та дії */}
        <nav className={styles.topActions}>
          <button onClick={() => router.back()} className={styles.backBtn}>← Назад</button>
          <span className={styles.breadcrumb}>{movie.title}</span>
        </nav>

        {/* Основна інформація */}
        <section className={styles.mainInfoGrid}>
          <div className={styles.posterSide}>
            <Image 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.png"} 
              alt={`Постер до фільму ${movie.title}`} 
              width={400} height={600} 
              className={styles.poster} 
              priority 
            />
          </div>

          <div className={styles.detailsSide}>
            <h1 className={styles.title}>{movie.title} <span>({movie.release_date?.split("-")[0]})</span></h1>
            
            <RatingStars voteAverage={movie.vote_average} />

            <div className={styles.metaList}>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} хв.</span>
              <span>{movie.genres?.map((g: Genre) => g.name).join(", ")}</span>
            </div>

            <section className={styles.synopsis}>
              <h2>Про що фільм:</h2>
              <p>{movie.overview || "Опис фільму наразі відсутній."}</p>
            </section>

            <section className={styles.castBlock}>
              <h2>Акторський склад:</h2>
              <div className={styles.castGrid}>
                {cast.slice(0, 6).map((actor: CastMember) => (
                  <div key={actor.id} className={styles.actorCard}>
                    <div className={styles.actorImageHolder}>
                      <Image 
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "/no-photo.png"} 
                        alt={actor.name} fill sizes="100px" 
                      />
                    </div>
                    <p>{actor.name}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <p className={styles.director}><strong>Режисер:</strong> {director}</p>
          </div>
        </section>

        {/* Секція Плеєра */}
        {isMovieAvailable && (
          <section className={styles.videoSection}>
            <h2 className={styles.sectionTitle}>Дивитися онлайн: {movie.title}</h2>
            {status !== "authenticated" ? (
              <div className={styles.lockOverlay}>
                <h3>Контент доступний лише для членів клубу</h3>
                <button onClick={() => signIn("google")} className={styles.authBtn}>Увійти через Google</button>
              </div>
            ) : (
              <MovieTabs player1Url={player1Url || ""} player2Url={player2Url || ""} kpId={kpId} />
            )}
          </section>
        )}

        {/* Трейлер */}
        <section className={styles.trailerSection}>
          <h2 className={styles.sectionTitle}>Офіційний трейлер</h2>
          <div className={styles.aspectRatio}>
            {trailerKey ? (
              <iframe src={`https://www.youtube.com/embed/${trailerKey}`} allowFullScreen />
            ) : <p>Відео очікується...</p>}
          </div>
        </section>

        {/* Коментарі */}
        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>Відгуки глядачів</h2>
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea 
              placeholder="Поділіться враженнями про фільм..." 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              required 
            />
            <button type="submit">Опублікувати</button>
          </form>
          <div className={styles.commentsList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentCard}>
                <p className={styles.commentHeader}><strong>{c.author}</strong> • {c.date}</p>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}