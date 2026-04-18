"use client";

import styles from "./SliderButtons.module.css";

export default function SliderButtons({ sliderId }: { sliderId: string }) {
  const scroll = (direction: "left" | "right") => {
    const s = document.getElementById(sliderId);
    if (s) {
      // Крок прокрутки: ширина однієї картки (128px) + gap (6px) = 134px
      const step = 134; 
      s.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
    }
  };

  return (
    <>
      <button 
        className={`${styles.navBtn} ${styles.prev}`} 
        onClick={() => scroll("left")}
        aria-label="Назад"
      >
        &#10094;
      </button>
      <button 
        className={`${styles.navBtn} ${styles.next}`} 
        onClick={() => scroll("right")}
        aria-label="Вперед"
      >
        &#10095;
      </button>
    </>
  );
}