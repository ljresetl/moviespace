"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieDetails } from "@/types/movie";
import styles from "./MoviePage.module.css";

export default function MovieDetailsContent({ movie }: { movie: MovieDetails }) {
  const router = useRouter();
  
  // Стан для коментарів (тимчасове зберігання)
  const [comments, setComments] = useState<{id: number, text: string, date: string}[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Рекомендую подивитися фільм "${movie.title}"`,
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

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      text: newComment,
      date: new Date().toLocaleDateString("uk-UA")
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Назад
        </button>

        <div className={styles.movieContent}>
          <div className={styles.posterWrapper}>
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className={styles.poster}
                priority
              />
            ) : (
              <div className={styles.noPoster}>Постер відсутній</div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            {movie.tagline && <p className={styles.tagline}>&ldquo;{movie.tagline}&rdquo;</p>}
            
            <div className={styles.meta}>
              <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
              <span className={styles.year}>📅 {movie.release_date.split("-")[0]} рік</span>
              {movie.runtime && <span className={styles.runtime}>🕒 {movie.runtime} хв.</span>}
            </div>

            <div className={styles.genres}>
              {movie.genres.map((g) => (
                <span key={g.id} className={styles.genreTag}>{g.name}</span>
              ))}
            </div>

            <div className={styles.description}>
              <h3 style={{ marginBottom: '10px', color: '#fff' }}>Опис</h3>
              <p className={styles.overview}>
                {movie.overview || "Опис українською мовою поки що відсутній."}
              </p>
            </div>

            {/* Нові кнопки під описом */}
            <div className={styles.actionButtons}>
              <a 
                href="https://t.me/your_channel" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.telegramBtn}
              >
                🚀 Telegram
              </a>
              <button onClick={handleShare} className={styles.shareBtn}>
                📢 Поділитися
              </button>
            </div>
          </div>
        </div>

        <div className={styles.playerSection}>
          <h2 className={styles.playerTitle}>Дивитися онлайн</h2>
          <div className={styles.playerPlaceholder}>
            <div className={styles.placeholderOverlay}>
              <div className={styles.playIcon}>▶</div>
              <p>Плеєр тимчасово недоступний (режим розробки)</p>
            </div>
            {movie.backdrop_path && (
              <Image 
                src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
                alt="Player Background" 
                fill 
                className={styles.placeholderImg}
              />
            )}
          </div>
        </div>

        {/* Секція коментарів */}
        <section className={styles.commentsSection}>
          <h2 className={styles.playerTitle}>Відгуки ({comments.length})</h2>
          
          <form onSubmit={addComment} className={styles.commentForm}>
            <textarea 
              placeholder="Поділіться враженнями від фільму..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentInput}
            />
            <button type="submit" className={styles.submitCommentBtn}>Надіслати</button>
          </form>

          <div className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>Гість</span>
                    <span className={styles.commentDate}>{comment.date}</span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>Напишіть перший коментар до цього фільму!</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}