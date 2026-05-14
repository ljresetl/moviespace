"use client";

import { useCallback, useEffect } from 'react';
import { Clock, Lock } from 'lucide-react';
import Script from 'next/script';
import { useAuth } from '../../../../components/AuthModal/context/AuthContext';
import styles from './MoviePlayer.module.css';

interface Props {
  movieTitle: string;
  year: string;
  isLoggedIn: boolean;
  externalId: { type: string; id: string } | null;
  loading: boolean;
}

export default function MoviePlayer({ movieTitle, year, isLoggedIn, externalId, loading }: Props) {
  const { openModal } = useAuth();

  const PUBLISHER_ID = process.env.NEXT_PUBLIC_VIBIX_PUBLISHER_ID || "677712298";
  const VIBIX_TOKEN = process.env.NEXT_PUBLIC_VIBIX_TOKEN || "25865|pXUsxpJTa3RbdjAJVzCCAb4jSIEtajYpohl3VBb29b0ecb46";
  const AD_TYPES = process.env.NEXT_PUBLIC_VIBIX_AD_TYPES || "brand,sticker,pcsticker,banners,flyroll";

  const initVibix = useCallback(() => {
    // @ts-expect-error: Vibix SDK
    if (typeof window !== 'undefined' && window.Vibix && typeof window.Vibix.init === 'function') {
      // @ts-expect-error: Vibix SDK
      window.Vibix.init();
    }
  }, []);

  useEffect(() => {
    if (externalId && !loading && isLoggedIn) {
      const timer = setTimeout(initVibix, 1000);
      return () => clearTimeout(timer);
    }
  }, [externalId, loading, initVibix, isLoggedIn]);

  return (
    <section className={styles.section}>
      <Script src="https://graphicslab.io/sdk/v2/rendex-sdk.min.js" strategy="afterInteractive" onLoad={initVibix} />
      <Script src="https://v-js-menu.run/public/lib.en.min.js" strategy="afterInteractive" />

      <div className="container">
        <h2 className={styles.heading}>Дивитися {movieTitle} ({year}) онлайн</h2>

        {isLoggedIn ? (
          <div className={styles.playerWrap}>
            {externalId ? (
              <div className="playerFrame" data-vibix-player-shell>
                <ins
                  className="vibix-player"
                  data-publisher-id={PUBLISHER_ID}
                  data-token={VIBIX_TOKEN}
                  data-type={externalId.type}
                  data-id={externalId.id}
                  data-design="1"
                  data-ad_types={AD_TYPES}
                ></ins>
              </div>
            ) : (
              <div className={styles.fallback}>
                <Clock size={32} />
                <p>Плеєр завантажується. Спробуйте оновити сторінку.</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.locked}>
            <div className={styles.lockedInner}>
              <Lock size={44} />
              <h3>Увійдіть, щоб дивитися</h3>
              <p>Перегляд фільмів доступний тільки зареєстрованим користувачам</p>
              <button onClick={openModal} className={styles.loginBtn}>
                Увійти або зареєструватися
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}