import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clapperboard, Calendar } from 'lucide-react';
import type { ActorDetails, ActorMovieCredit } from '../../../../../lib/types';
import styles from './ActorPhoto.module.css';

interface Props {
  actor: ActorDetails;
  age: number | null;
  moviesCount: number;
  topMovies: ActorMovieCredit[];
}

export default function ActorPhoto({ actor, age, moviesCount, topMovies }: Props) {
  const department = actor.known_for_department === 'Acting' ? 'Актор' : actor.known_for_department || 'Кіно';

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.hero}>

          <div className={styles.photoCol}>
            <div className={styles.photo}>
              <Image
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/no-avatar.png'}
                alt={`${actor.name} — фото`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 240px, 280px"
                className={styles.img}
              />
              <div className={styles.popularityBadge}>
                <Star size={12} />
                <span>{actor.popularity.toFixed(0)}</span>
              </div>
            </div>
            <span className={styles.label}>ФОТО СУБ&#39;ЄКТА</span>
          </div>

          <div className={styles.infoCol}>
            <h1 className={styles.name}>{actor.name}</h1>

            {actor.also_known_as && actor.also_known_as.length > 0 && (
              <p className={styles.alias}>{actor.also_known_as.slice(0, 2).join(' / ')}</p>
            )}

            <div className={styles.badges}>
              <div className={styles.badge}>
                <Clapperboard size={14} />
                <span>{department}</span>
              </div>
              {age !== null && (
                <div className={styles.badge}>
                  <Calendar size={14} />
                  <span>{age} років</span>
                </div>
              )}
              {actor.place_of_birth && (
                <div className={styles.badge}>
                  <MapPin size={14} />
                  <span>{actor.place_of_birth.split(',').pop()?.trim()}</span>
                </div>
              )}
              <div className={styles.badge}>
                <Star size={14} />
                <span>{moviesCount}+ фільмів</span>
              </div>
            </div>

            {topMovies.length > 0 && (
              <div className={styles.known}>
                <span className={styles.knownLabel}>ВІДОМИЙ ЗА:</span>
                <div className={styles.knownGrid}>
                  {topMovies.map(m => (
                    <Link href={`/movie/${m.id}`} key={m.id} className={styles.knownItem}>
                      <div className={styles.knownPoster}>
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                          alt={m.title}
                          fill
                          sizes="(max-width: 768px) 60px, (max-width: 1024px) 66px, 78px"
                          className={styles.knownImg}
                          loading="lazy"
                        />
                      </div>
                      <span className={styles.knownTitle}>{m.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}