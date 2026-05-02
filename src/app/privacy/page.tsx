import React from 'react';
import Link from 'next/link';
import styles from './Privacy.module.css';

export default function PrivacyPolicy() {
  const domain = "kinoshrot.com";
  const lastUpdated = new Date().toLocaleDateString('uk-UA');

  return (
    <main className={styles.privacyMain}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <span>←</span> Повернутися на головну
        </Link>
        
        <h1 className={styles.title}>Політика конфіденційності</h1>
        
        <div className={styles.section}>
          <h2>1. Загальні положення</h2>
          <p>
            Ця Політика конфіденційності описує, як сайт <strong>{domain}</strong> збирає, 
            використовує та захищає вашу інформацію при використанні сервісів авторизації.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Збір даних через Google Auth</h2>
          <p>При вході через Google ми отримуємо наступні дані:</p>
          <ul>
            <li>Ваше ім&apos;я та прізвище;</li>
            <li>Адресу електронної пошти;</li>
            <li>Посилання на публічне фото профілю.</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>3. Використання інформації</h2>
          <p>Ми використовуємо ці дані виключно для:</p>
          <ul>
            <li>Ідентифікації вас як автора коментарів та відгуків;</li>
            <li>Запобігання спаму та зловживанням на платформі;</li>
            <li>Надання доступу до персоналізованого контенту (плеєрів).</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>4. Захист та видалення</h2>
          <p>
            Ми не передаємо ваші дані третім особам. Ви маєте право в будь-який момент 
            відкликати доступ нашого додатка до вашого Google-аккаунту в налаштуваннях безпеки Google.
          </p>
        </div>

        <footer className={styles.footer}>
          Сайт {domain} &copy; 2026. Останнє оновлення: {lastUpdated}
        </footer>
      </div>
    </main>
  );
}