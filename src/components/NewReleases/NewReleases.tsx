"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import styles from './NewReleases.module.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function NewReleases() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const res = await fetch('/api/tmdb/movie/now_playing?language=uk-UA&page=1');
        if (!res.ok) return;
        const data = await res.json();
        setMovies(data.results ? data.results.slice(0, 20) : []);
      } catch (error) {
        console.error("Error fetching new releases:", error);
      }
    };
    fetchNewReleases();
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.title}>Новинки</h2>
          <div className={styles.controls}>
            <button className="swiper-prev-custom">❮</button>
            <button className="swiper-next-custom">❯</button>
          </div>
        </div>
      </div>

      {movies.length > 0 && (
        <div className={styles.sliderWrapper}>
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={20}
            slidesPerView={'auto'}
            loop={true}
            freeMode={true}
            grabCursor={true}
            navigation={{
              prevEl: '.swiper-prev-custom',
              nextEl: '.swiper-next-custom',
            }}
            className={styles.slider}
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id} className={styles.slide}>
                <Link href={`/movie/${movie.id}`} className={styles.card}>
                  <div className={styles.posterWrapper}>
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 768px) 120px, 135px"
                      className={styles.poster}
                      priority={false}
                    />
                    <div className={styles.cardOverlay}>
                      <span className={styles.playBtn}>▶</span>
                    </div>
                  </div>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
}