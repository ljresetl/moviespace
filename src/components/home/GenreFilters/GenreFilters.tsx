"use client";

import React, { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { GENRES, YEARS, COUNTRIES } from "@/components/home/GenreFilters/filters";
import styles from "./GenreFilters.module.css";

function FilterContent() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [genre, setGenre] = useQueryState(
    "genre",
    parseAsString.withDefault("").withOptions({ shallow: false, startTransition })
  );

  const [year, setYear] = useQueryState(
    "year",
    parseAsString.withDefault("Усі роки").withOptions({ shallow: false, startTransition })
  );

  const [country, setCountry] = useQueryState(
    "country",
    parseAsString.withDefault("").withOptions({ shallow: false, startTransition })
  );

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleUpdate = (key: string, value: string) => {
    if (key === "genre") setGenre(value === "" ? null : value);
    if (key === "year") setYear(value === "Усі роки" ? null : value);
    if (key === "country") setCountry(value === "" ? null : value);
    setOpenDropdown(null);
  };

  const isActive = !genre && (year === "Усі роки" || !year) && !country;

  return (
    <div className={`${styles.flexWrapper} ${isPending ? styles.loading : ""}`}>
      <button
        className={`${styles.filterBtn} ${isActive ? styles.active : ""}`}
        onClick={() => {
          setGenre(null);
          setYear(null);
          setCountry(null);
          router.push("/", { scroll: false });
        }}
      >
        🔥 Новинки
      </button>

      {/* Жанри */}
      <div className={styles.dropdown}>
        <button onClick={() => toggleDropdown("genre")} className={styles.filterBtn}>
          🎭 {GENRES.find((g) => g.id === genre)?.name || "Жанри"}
        </button>
        {openDropdown === "genre" && (
          <div className={`${styles.menu} ${styles.wideMenu}`}>
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleUpdate("genre", g.id)}
                className={`${styles.menuItem} ${genre === g.id ? styles.activeItem : ""}`}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Роки */}
      <div className={styles.dropdown}>
        <button onClick={() => toggleDropdown("year")} className={styles.filterBtn}>
          📅 {!year || year === "Усі роки" ? "Рік" : year}
        </button>
        {openDropdown === "year" && (
          <div className={styles.menu}>
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => handleUpdate("year", y)}
                className={`${styles.menuItem} ${(year === y || (!year && y === "Усі роки")) ? styles.activeItem : ""}`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Країни */}
      <div className={styles.dropdown}>
        <button onClick={() => toggleDropdown("country")} className={styles.filterBtn}>
          🌍 {COUNTRIES.find((c) => c.id === country)?.name || "Країни"}
        </button>
        {openDropdown === "country" && (
          <div className={styles.menu}>
            {COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleUpdate("country", c.id)}
                className={`${styles.menuItem} ${country === c.id ? styles.activeItem : ""}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {isPending && <div className={styles.smallLoader}>Оновлення...</div>}
    </div>
  );
}

export default function GenreFilters() {
  return (
    <section className={styles.filterSection}>
      <div className="container">
        <Suspense fallback={null}>
          <FilterContent />
        </Suspense>
      </div>
    </section>
  );
}