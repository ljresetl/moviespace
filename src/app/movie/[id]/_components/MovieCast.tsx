import Link from 'next/link';
import Image from 'next/image';
import styles from './MovieCast.module.css';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Props {
  cast: CastMember[];
  movieTitle: string;
}

export default function MovieCast({ cast, movieTitle }: Props) {
  if (cast.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Актори фільму {movieTitle}</h2>
        <div className={styles.grid}>
          {cast.map(actor => (
            <Link href={`/actor/${actor.id}`} key={actor.id} className={styles.card}>
              <div className={styles.avatar}>
                <Image
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/no-avatar.png'}
                  alt={`${actor.name}`}
                  fill
                  sizes="(max-width: 768px) 56px, 72px"
                  className={styles.avatarImg}
                  loading="lazy"
                />
              </div>
              <div className={styles.info}>
                <p className={styles.name}>{actor.name}</p>
                {actor.character && <p className={styles.role}>{actor.character}</p>}
              </div>
            </Link>
          ))}
        </div>
        <p className={styles.text}>
          У фільмі &laquo;{movieTitle}&raquo; знімалися: {cast.map(a => a.name).join(', ')}.
        </p>
      </div>
    </section>
  );
}