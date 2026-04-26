"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieDetailsProps, Comment } from "@/types/movie";
import styles from "./MoviePage.module.css";

// Типізація користувача Telegram
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export default function MovieDetailsContent({ 
  movie, 
  trailerKey, 
  cast, 
  director 
}: MovieDetailsProps) {
  const router = useRouter();
  const [showFullMovie, setShowFullMovie] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Стан авторизації (перевірка в localStorage)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tg_user") === "true";
    }
    return false;
  });

  useEffect(() => {
    // Функція-колбек для Telegram
    window.onTelegramAuth = (user: TelegramUser) => {
      console.log("Авторизація через Telegram:", user);
      localStorage.setItem("tg_user", "true");
      localStorage.setItem("tg_user_data", JSON.stringify(user));
      setIsAuthorized(true);
    };

    // Додаємо віджет Telegram, якщо не авторизовані
    if (!isAuthorized && widgetContainerRef.current) {
      widgetContainerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", "MovieSpaceAuthBot"); // Твій юзернейм бота
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      widgetContainerRef.current.appendChild(script);
    }
  }, [isAuthorized]);

  const isTargetMovie = movie.id === 82702 || movie.id === 47021;
  const PLAYER_TOKEN = "33a811c627033af901fb8aa5d449483c";

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
            <Image 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.png"} 
              alt={movie.title} width={300} height={450} className={styles.poster} priority 
            />
          </div>
          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title} ({movie.release_date.split("-")[0]})</h1>
            <p className={styles.metaInfo}>{movie.release_date} • {movie.genres.map(g => g.name).join(", ")} • {movie.runtime} хв</p>
            <div className={styles.ratingCircle}><span>{Math.round(movie.vote_average * 10)}%</span> Оцінка</div>
            <div className={styles.description}>
              <h3>Опис</h3>
              <p>{movie.overview || "Опис відсутній."}</p>
            </div>
            <p><strong>Режисер:</strong> {director}</p>
          </div>
        </div>

        {/* Секція Трейлера (Завжди доступна) */}
        <section className={styles.playerSection}>
          <h2 className={styles.sectionTitle}>Трейлер</h2>
          <div className={styles.videoWrapper}>
            {trailerKey ? (
              <iframe src={`https://www.youtube.com/embed/${trailerKey}?rel=0`} allowFullScreen className={styles.iframe} />
            ) : <p className={styles.noVideo}>Трейлер відсутній</p>}
          </div>
        </section>

        {/* Секція Повного фільму (З доступом через Telegram) */}
        <section className={styles.fullMovieSection}>
          <h2 className={styles.sectionTitle}>Повний фільм</h2>
          {!isAuthorized ? (
            <div className={styles.lockOverlay}>
              <div className={styles.lockContent}>
                <div className={styles.lockIcon}>🔒</div>
                <h3>Вхід через Telegram</h3>
                <p>Авторизуйтесь, щоб отримати доступ до перегляду повного фільму.</p>
                <div className={styles.tgWidgetWrapper} ref={widgetContainerRef}></div>
              </div>
            </div>
          ) : (
            <div className={styles.fullMoviePlayer}>
              {!showFullMovie ? (
                <div className={styles.watchPlaceholder}>
                  <button className={styles.watchBtn} onClick={() => setShowFullMovie(true)}>▶ Дивитися повну версію</button>
                </div>
              ) : (
                <div className={styles.videoWrapper}>
                  {isTargetMovie ? (
                    <iframe 
                      src={`https://tv-1-kinoserial.net/embed/47021/?token=${PLAYER_TOKEN}`} 
                      width="100%" height="450" frameBorder="0" allowFullScreen
                      className={styles.iframe}
                    ></iframe>
                  ) : (
                    <div className={styles.placeholderOverlay}><p>Плеєр додається...</p></div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>Відгуки</h2>
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea placeholder="Ваш відгук..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className={styles.textarea} required />
            <button type="submit" className={styles.submitBtn}>Надіслати</button>
          </form>
          <div className={styles.commentsList}>
            {comments.map(c => (
              <div key={c.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{c.author}</span>
                  <span className={styles.commentDate}>{c.date}</span>
                </div>
                <p className={styles.commentText}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}