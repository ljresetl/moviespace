"use client";

import { useState, type FormEvent } from 'react';
import { Send, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../../../components/AuthModal/context/AuthContext';
import styles from './MovieComments.module.css';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface Props {
  tmdbId: string | string[];
  isLoggedIn: boolean;
  userEmail: string | null;
}

export default function MovieComments({ tmdbId, isLoggedIn, userEmail }: Props) {
  const { openModal } = useAuth();

  const [comments, setComments] = useState<Comment[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(`comments_${tmdbId}`);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isLoggedIn) return;
    setSending(true);

    const comment: Comment = {
      id: Date.now().toString(),
      author: userEmail || 'Користувач',
      text: text.trim(),
      date: new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${tmdbId}`, JSON.stringify(updated));
    setText('');
    setSending(false);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <MessageCircle size={18} />
          Коментарі ({comments.length})
        </h2>

        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={styles.avatar}>{userEmail?.charAt(0).toUpperCase() || 'U'}</div>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Написати коментар..."
                className={styles.input}
                maxLength={500}
                disabled={sending}
              />
              <button type="submit" className={styles.sendBtn} disabled={!text.trim() || sending}>
                <Send size={18} />
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.loginHint}>
            <User size={18} />
            <p>
              <button onClick={openModal} className={styles.loginBtn}>Увійдіть</button>, щоб залишити коментар
            </p>
          </div>
        )}

        <div className={styles.list}>
          {comments.length === 0 ? (
            <p className={styles.empty}>Поки немає коментарів. Будьте першим!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className={styles.item}>
                <div className={styles.itemAvatar}>{c.author.charAt(0).toUpperCase()}</div>
                <div className={styles.body}>
                  <div className={styles.meta}>
                    <strong>{c.author}</strong>
                    <span>{c.date}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}