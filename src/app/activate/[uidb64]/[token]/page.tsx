"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

type Status = 'loading' | 'success' | 'error';

export default function ActivatePage() {
  const params = useParams<{ uidb64: string; token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function activate() {
      try {
        const res = await fetch(`/api/proxy/users/activate/${params.uidb64}/${params.token}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          setStatus('success');
          setMessage('Ваш акаунт успішно активовано!');
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.error || 'Посилання недійсне або прострочене');
        }
      } catch {
        setStatus('error');
        setMessage("Помилка з'єднання з сервером");
      }
    }

    if (params.uidb64 && params.token) {
      activate();
    }
  }, [params.uidb64, params.token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'loading' && (
          <>
            <div className={styles.spinner}></div>
            <h2 className={styles.title}>Активація акаунту...</h2>
            <p className={styles.subtitle}>Зачекайте, будь ласка</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.icon}>✅</div>
            <h2 className={styles.title}>Акаунт активовано!</h2>
            <p className={styles.subtitle}>{message}</p>
            <Link href="/" className={styles.button}>
              Перейти на головну та увійти
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.icon}>❌</div>
            <h2 className={styles.title}>Помилка активації</h2>
            <p className={styles.subtitle}>{message}</p>
            <Link href="/" className={styles.buttonSecondary}>
              На головну
            </Link>
          </>
        )}
      </div>
    </div>
  );
}