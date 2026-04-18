"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GENRES, YEARS, COUNTRIES } from "@/components/home/GenreFilters/filters";
import styles from "./GenreFilters.module.css";

// Внутрішній компонент, який використовує пошукові параметри
function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const currentGenreId = searchParams.get("genre") || "";
  const currentYear = searchParams.get("year") || "Усі роки";
  const currentCountryId = searchParams.get("country") || "";

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "" || value === "Усі роки" || value === "Усі жанри" || value === "Усі країни") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
    setOpenDropdown(null);
  };

  return (
    <div className={styles.flexWrapper}>
      <button 
        className={`${styles.filterBtn} ${(!currentGenreId && currentYear === "Усі роки" && !currentCountryId) ? styles.active : ""}`}
        onClick={() => router.push("/", { scroll: false })}
      >
        🔥 Новинки
      </button>

      {/* Жанри */}
      <div className={styles.dropdown}>
        <button onClick={() => toggleDropdown('genre')} className={styles.filterBtn}>
          🎭 {GENRES.find(g => g.id === currentGenreId)?.name || "Жанри"}
        </button>
        {openDropdown === 'genre' && (
          <div className={styles.menu}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => updateFilters("genre", g.id)} className={styles.menuItem}>
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Роки */}
      <div className={styles.dropdown}>
        <button onClick={() => toggleDropdown('year')} className={styles.filterBtn}>
          📅 {currentYear === "Усі роки" ? "Рік" : currentYear}
        </button>
        {openDropdown === 'year' && (
          <div className={styles.menu}>
            {YEARS.map(y => (
              <button key={y} onClick={() => updateFilters("year", y)} className={styles.menuItem}>
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Країни */}
      <div className={styles.dropdown}>
        <button onClick={() => toggleDropdown('country')} className={styles.filterBtn}>
          🌍 {COUNTRIES.find(c => c.id === currentCountryId)?.name || "Країни"}
        </button>
        {openDropdown === 'country' && (
          <div className={styles.menu}>
            {COUNTRIES.map(c => (
              <button key={c.id} onClick={() => updateFilters("country", c.id)} className={styles.menuItem}>
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Основний компонент, загорнутий у Suspense
export default function GenreFilters() {
  return (
    <section className={styles.filterSection}>
      <div className="container">
        <Suspense fallback={<div className={styles.loader}>Завантаження фільтрів...</div>}>
          <FilterContent />
        </Suspense>
      </div>
    </section>
  );
}