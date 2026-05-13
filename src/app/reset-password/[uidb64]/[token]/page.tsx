"use client";

import React, { useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordConfirm } from '../../../../../lib/api';
import { ApiError } from '../../../../../lib/types';
import styles from './page.module.css';

type Status = 'form' | 'loading' | 'success';

export default function ResetPasswordPage() {
  const params = useParams<{ uidb64: string; token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>('form');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Пароль повинен містити мінімум 8 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Паролі не збігаються');
      return;
    }

    setStatus('loading');

    try {
      await resetPasswordConfirm(params.uidb64, params.token, newPassword, confirmPassword);
      setStatus('success');
    } catch (err) {
      setStatus('form');
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Помилка з'єднання з сервером");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'success' ? (
          <>
            <div className={styles.icon}>✅</div>
            <h2 className={styles.title}>Пароль змінено!</h2>
            <p className={styles.subtitle}>Тепер ви можете увійти з новим паролем</p>
            <Link href="/" className={styles.button}>
              Перейти на головну та увійти
            </Link>
          </>
        ) : (
          <>
            <div className={styles.icon}>🔑</div>
            <h2 className={styles.title}>Новий пароль</h2>
            <p className={styles.subtitle}>Введіть новий пароль для вашого акаунту</p>

            {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Новий пароль</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Мінімум 8 символів"
                    className={styles.input}
                    disabled={status === 'loading'}
                  />
                  <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <div className={styles.field}>
                <label>Підтвердіть пароль</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторіть пароль"
                  className={styles.input}
                  disabled={status === 'loading'}
                />
              </div>
              <button type="submit" className={styles.button} disabled={status === 'loading'}>
                {status === 'loading' ? 'Збереження...' : 'Зберегти пароль'}
              </button>
            </form>

            <Link href="/" className={styles.backLink}>
              ← На головну
            </Link>
          </>
        )}
      </div>
    </div>
  );
}