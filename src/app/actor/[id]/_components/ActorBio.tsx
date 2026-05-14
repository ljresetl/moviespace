"use client";

import { useState } from 'react';
import type { ActorDetails } from '../../../../../lib/types';
import styles from './ActorBio.module.css';

interface Props {
  actor: ActorDetails;
  aboutText: string;
}

export default function ActorBio({ actor, aboutText }: Props) {
  const [showFull, setShowFull] = useState(false);

  const bioShort = actor.biography && actor.biography.length > 500
    ? actor.biography.slice(0, 500) + '...'
    : actor.biography;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.tag}>БІОГРАФІЧНІ ДАНІ</div>

        <div className={styles.about}>
          <p>{aboutText}</p>
        </div>

        {actor.biography ? (
          <div className={styles.bio}>
            <p className={styles.text}>{showFull ? actor.biography : bioShort}</p>
            {actor.biography.length > 500 && (
              <button className={styles.more} onClick={() => setShowFull(!showFull)}>
                [ {showFull ? 'ЗГОРНУТИ' : 'ЧИТАТИ ПОВНІСТЮ'} ]
              </button>
            )}
          </div>
        ) : (
          <div className={styles.bio}>
            <p className={styles.empty}>
              Біографія {actor.name} українською мовою відсутня в базі.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}