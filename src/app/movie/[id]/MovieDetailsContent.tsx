"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieDetails, Video, MovieVideosResponse, Cast, CreditsResponse } from "@/types/movie";
import styles from "./MoviePage.module.css";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

export default function MovieDetailsContent({ movie }: { movie: MovieDetails }) {
  const router = useRouter();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<string>("");
  
  // Стан для плеєра та коментарів
  const [showFullMovie, setShowFullMovie] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) return;

      try {
        const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=uk-UA`);
        let videoData: MovieVideosResponse = await videoRes.json();
        if (!videoData.results?.length) {
          const fb = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`);
          videoData = await fb.json();
        }
        setTrailerKey(videoData.results?.find(v => v.type === "Trailer")?.key || videoData.results?.[0]?.key || null);

        const creditsRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=uk-UA`);
        const creditsData: CreditsResponse = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 10));
        setDirector(creditsData.crew.find(person => person.job === "Director")?.name || "Невідомо");

      } catch (err) {
        console.error("Помилка завантаження даних:", err);
      }
    };

    fetchData();
  }, [movie.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Переглянь фільм "${movie.title}" на нашому сайті!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Посилання скопійовано!");
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj: Comment = {
      id: Date.now(),
      author: "Гість",
      text: newComment,
      date: new Date().toLocaleDateString("uk-UA"),
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.topActions}>
          <button onClick={() => router.back()} className={styles.backBtn}>← Назад</button>
          <button onClick={handleShare} className={styles.shareBtn}>📤 Поділитися</button>
        </div>

        <div className={styles.movieContent}>
          <div className={styles.posterWrapper}>
            {movie.poster_path && (
              <Image 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                width={300} height={450} 
                className={styles.poster} 
                priority 
              />
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title} ({movie.release_date.split("-")[0]})</h1>
            <p className={styles.metaInfo}>
              {movie.release_date} • {movie.genres.map(g => g.name).join(", ")} • {movie.runtime}хв
            </p>
            
            <div className={styles.ratingCircle}>
              <span>{Math.round(movie.vote_average * 10)}%</span> Оцінка
            </div>

            <div className={styles.description}>
              <h3>Опис</h3>
              <p>{movie.overview || "Опис відсутній."}</p>
            </div>

            <div className={styles.creditsSummary}>
              <div><strong>Режисер:</strong> {director}</div>
            </div>
          </div>

          <aside className={styles.sideDetails}>
            <div className={styles.detailItem}>
              <strong>Оригінальна назва</strong>
              <p>{movie.original_title}</p>
            </div>
            <div className={styles.detailItem}>
              <strong>Статус</strong>
              <p>{movie.status === "Released" ? "Випущено" : movie.status}</p>
            </div>
            <div className={styles.detailItem}>
              <strong>Мова оригіналу</strong>
              <p>{movie.original_language.toUpperCase()}</p>
            </div>
            <div className={styles.detailItem}>
              <strong>Бюджет</strong>
              <p>{movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "-"}</p>
            </div>
          </aside>
        </div>

        <section className={styles.castSection}>
          <h2 className={styles.sectionTitle}>У головних ролях</h2>
          <div className={styles.castGrid}>
            {cast.map(actor => (
              <div key={actor.id} className={styles.actorCard}>
                {actor.profile_path ? (
                  <Image 
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                    alt={actor.name} 
                    width={150} height={225} 
                  />
                ) : (
                  <div className={styles.noPhoto}>👤</div>
                )}
                <div className={styles.actorInfo}>
                  <p className={styles.actorName}>{actor.name}</p>
                  <p className={styles.characterName}>{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* СЕКЦІЯ ТРЕЙЛЕРА */}
        <div className={styles.playerSection}>
          <h2 className={styles.sectionTitle}>Трейлер</h2>
          <div className={styles.videoWrapper}>
            {trailerKey ? (
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?rel=0`} 
                allowFullScreen 
                className={styles.iframe}
              />
            ) : <p className={styles.noVideo}>Трейлер недоступний</p>}
          </div>
        </div>

        {/* НОВА СЕКЦІЯ: ПОВНИЙ ФІЛЬМ */}
        <section className={styles.fullMovieSection}>
          <h2 className={styles.sectionTitle}>Дивитися фільм онлайн</h2>
          {!showFullMovie ? (
            <div className={styles.watchPlaceholder}>
              <div className={styles.watchContent}>
                <h3>Готові до перегляду?</h3>
                <p>Натисніть кнопку нижче, щоб розгорнути плеєр</p>
                <button 
                  className={styles.watchBtn}
                  onClick={() => setShowFullMovie(true)}
                >
                  ▶ Переглянути повний фільм
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.fullMoviePlayer}>
               <div className={styles.playerHeader}>
                  <span>Ви переглядаєте: {movie.title}</span>
                  <button onClick={() => setShowFullMovie(false)}>Закрити плеєр ✕</button>
               </div>
               <div className={styles.videoWrapper}>
                  {/* Сюди потім вставите код реального плеєра */}
                  <div className={styles.placeholderOverlay}>
                    <p>Тут буде основний плеєр фільму</p>
                    <small>Заглушка активована</small>
                  </div>
               </div>
            </div>
          )}
        </section>

        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>Відгуки</h2>
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea 
              placeholder="Напишіть свою думку про фільм..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.textarea}
              required
            />
            <button type="submit" className={styles.submitBtn}>Надіслати відгук</button>
          </form>

          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p className={styles.emptyComments}>Будьте першим, хто залишить відгук!</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{c.author}</span>
                    <span className={styles.commentDate}>{c.date}</span>
                  </div>
                  <p className={styles.commentText}>{c.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}