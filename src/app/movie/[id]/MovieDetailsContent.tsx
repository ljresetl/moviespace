"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
// Імпортуємо розширений інтерфейс
import { ExtendedMovieDetailsProps, Comment } from "@/types/movie";
import { movieEmbedLinks } from "@/lib/movieLinks";
import styles from "./MoviePage.module.css";

export default function MovieDetailsContent({ 
  movie, 
  trailerKey, 
  cast, 
  director,
  playerToken // Додаємо цей проп, який ми передаємо з серверного компонента
}: ExtendedMovieDetailsProps) { // Змінюємо тип на ExtendedMovieDetailsProps
  const router = useRouter();
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  // Отримуємо код плеєра. Якщо ви використовуєте динамічні посилання, 
  // можна додати playerToken до URL тут.
  const fullIframeCode = movieEmbedLinks[Number(movie.id)];

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Помилка:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Посилання скопійовано!");
    }
  };

  const handleSubmitComment = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;
    const commentObj: Comment = {
      id: Date.now(),
      author: session.user?.name || "Користувач",
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

        {/* ОСНОВНА ІНФОРМАЦІЯ */}
        <div className={styles.movieContent}>
          <div className={styles.posterWrapper}>
            <Image 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.png"} 
              alt={movie.title} width={300} height={450} className={styles.poster} priority 
            />
          </div>
          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title} ({movie.release_date?.split("-")[0]})</h1>
            <p className={styles.metaInfo}>
              {movie.release_date} • {movie.genres?.map(g => g.name).join(", ")} • {movie.runtime} хв
            </p>
            <div className={styles.ratingCircle}>
              <span>{Math.round(movie.vote_average * 10)}%</span> Оцінка
            </div>
            <div className={styles.description}>
              <h3>Опис</h3>
              <p>{movie.overview || "Опис відсутній."}</p>
            </div>
            <p><strong>Режисер:</strong> {director}</p>
            {cast && cast.length > 0 && (
              <p><strong>У ролях:</strong> {cast.map(c => c.name).slice(0, 5).join(", ")}</p>
            )}
            
            {/* Технічний вивід токена (якщо потрібно для відладки плеєра) */}
            {process.env.NODE_ENV === 'development' && playerToken && (
              <p style={{fontSize: '10px', color: 'gray'}}>Token active</p>
            )}
          </div>
        </div>

        {/* 1. СЕКЦІЯ ТРЕЙЛЕРА (для неавторизованих) */}
        {status !== "authenticated" && (
          <section className={styles.playerSection}>
            <h2 className={styles.sectionTitle}>Трейлер фільму</h2>
            <div className={styles.videoWrapper}>
              {trailerKey ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${trailerKey}?rel=0`} 
                  allowFullScreen 
                  className={styles.iframe} 
                  frameBorder="0"
                />
              ) : <p className={styles.noVideo}>Трейлер відсутній</p>}
            </div>
          </section>
        )}

        {/* 2. СЕКЦІЯ ПОВНОГО ФІЛЬМУ */}
        <section className={styles.fullMovieSection}>
          <h2 className={styles.sectionTitle}>Повний фільм</h2>
          
          {status !== "authenticated" ? (
            <div className={styles.lockOverlay}>
              <div className={styles.lockContent}>
                <div className={styles.lockIcon} style={{ fontSize: "40px", marginBottom: "10px" }}>🔒</div>
                <h3>Дивіться повну версію</h3>
                <p>Увійдіть через Google, щоб отримати доступ до плеєра в високій якості.</p>
                <button 
                  className={styles.tgBigBtn} 
                  onClick={() => signIn("google")}
                  style={{ 
                    backgroundColor: "#4285F4", 
                    color: "#fff", 
                    padding: "14px 28px", 
                    borderRadius: "8px", 
                    border: "none", 
                    cursor: "pointer", 
                    marginTop: "15px", 
                    fontWeight: "bold",
                    fontSize: "16px"
                  }}
                >
                  Увійти через Google
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.fullMoviePlayer}>
              {fullIframeCode ? (
                <div 
                  className={styles.videoWrapper}
                  /* Якщо плеєр підтримує токени через атрибути, 
                     ви можете модифікувати fullIframeCode перед вставкою */
                  dangerouslySetInnerHTML={{ __html: fullIframeCode }} 
                />
              ) : (
                <div className={styles.lockOverlay} style={{ background: "#1a1a1a" }}>
                   <p>Цей фільм скоро зявиться в нашому кінотеатрі.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ВІДГУКИ */}
        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>Відгуки користувачів</h2>
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea 
              placeholder={session ? "Поділіться враженнями про фільм..." : "Авторизуйтесь, щоб залишити відгук"} 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              className={styles.textarea} 
              disabled={!session}
              required 
            />
            <button type="submit" className={styles.submitBtn} disabled={!session}>Надіслати відгук</button>
          </form>
          <div className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map(c => (
                <div key={c.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{c.author}</span>
                    <span className={styles.commentDate}>{c.date}</span>
                  </div>
                  <p className={styles.commentText}>{c.text}</p>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>Ще немає жодного відгуку. Будьте першим!</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}