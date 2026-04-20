"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieDetails, Video, MovieVideosResponse } from "@/types/movie";
import styles from "./MoviePage.module.css";

export default function MovieDetailsContent({ movie }: { movie: MovieDetails }) {
  const router = useRouter();
  
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [comments, setComments] = useState<{id: number, text: string, date: string}[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVideo = async (): Promise<void> => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      
      if (!apiKey) {
        console.error("API Key is missing in .env.local");
        return;
      }

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=uk-UA`
        );
        
        // Якщо українською немає, спробуємо знайти оригінал (англійською)
        let data: MovieVideosResponse = await res.json();
        
        if (!data.results || data.results.length === 0) {
          const fallbackRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`
          );
          data = await fallbackRes.json();
        }

        const trailer = data.results?.find(
          (v: Video) => v.type === "Trailer" && v.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        } else if (data.results?.length > 0) {
          setTrailerKey(data.results[0].key);
        }
      } catch (err) {
        console.error("Помилка запиту:", err);
      }
    };

    fetchVideo();
  }, [movie.id]);

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addComment = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = { id: Date.now(), text: newComment, date: new Date().toLocaleDateString("uk-UA") };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <button onClick={() => router.back()} className={styles.backBtn}>← Назад</button>

        <div className={styles.movieContent}>
          <div className={styles.posterWrapper}>
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className={styles.poster}
                priority
              />
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            <div className={styles.meta}>
              <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
              <span className={styles.year}>📅 {movie.release_date.split("-")[0]}</span>
            </div>
            <div className={styles.description}>
              <p className={styles.overview}>{movie.overview || "Опис відсутній."}</p>
            </div>
            <div className={styles.actionButtons}>
              <a href="https://t.me/your_channel" target="_blank" className={styles.telegramBtn}>🚀 Telegram</a>
              <button onClick={handleShare} className={styles.shareBtn}>📢 Поділитися</button>
            </div>
          </div>
        </div>

        <div className={styles.playerSection}>
          <h2 className={styles.playerTitle}>Трейлер</h2>
          <div className={styles.playerPlaceholder}>
            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?rel=0&showinfo=0`}
                title="Trailer"
                allowFullScreen
                className={styles.iframePlayer}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            ) : (
              <div className={styles.noTrailer}>Трейлер завантажується або недоступний</div>
            )}
          </div>
        </div>

        <section className={styles.commentsSection}>
          <h2 className={styles.playerTitle}>Відгуки ({comments.length})</h2>
          <form onSubmit={addComment} className={styles.commentForm}>
            <textarea 
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
              className={styles.commentInput}
              placeholder="Напишіть відгук..."
            />
            <button type="submit" className={styles.submitCommentBtn}>Надіслати</button>
          </form>
          {/* Список коментарів залишається таким самим */}
        </section>
      </div>
    </main>
  );
}