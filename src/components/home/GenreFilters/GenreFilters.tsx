"use client";

import React, { Suspense, useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { GENRES, YEARS, COUNTRIES } from "@/components/home/GenreFilters/filters";
import styles from "./GenreFilters.module.css";

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Додаємо shallow: false, щоб nuqs робив реальний перехід по URL
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

  // Скидаємо відкриті списки при кліку поза ними
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Важливо, щоб не спрацьовував useEffect вище
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleUpdate = (key: string, value: string) => {
    if (key === "genre") setGenre(value === "" ? null : value);
    if (key === "year") setYear(value === "Усі роки" ? null : value);
    if (key === "country") setCountry(value === "" ? null : value);
    setOpenDropdown(null);
  };

  // Перевірка активності кнопки "Новинки"
  const isHomeActive = !genre && (year === "Усі роки" || !year) && !country;

  return (
    <div className={`${styles.flexWrapper} ${isPending ? styles.loading : ""}`}>
      <button
        className={`${styles.filterBtn} ${isHomeActive ? styles.active : ""}`}
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
        <button 
          onClick={(e) => toggleDropdown(e, "genre")} 
          className={`${styles.filterBtn} ${genre ? styles.active : ""}`}
        >
          🎭 {GENRES.find((g) => g.id === genre)?.name || "Усі жанри"}
        </button>
        {openDropdown === "genre" && (
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
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
        <button 
          onClick={(e) => toggleDropdown(e, "year")} 
          className={`${styles.filterBtn} ${year && year !== "Усі роки" ? styles.active : ""}`}
        >
          📅 {!year || year === "Усі роки" ? "Рік" : year}
        </button>
        {openDropdown === "year" && (
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
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
        <button 
          onClick={(e) => toggleDropdown(e, "country")} 
          className={`${styles.filterBtn} ${country ? styles.active : ""}`}
        >
          🌍 {COUNTRIES.find((c) => c.id === country)?.name || "Усі країни"}
        </button>
        {openDropdown === "country" && (
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
}

export default function GenreFilters() {
  return (
    <Suspense fallback={null}>
      <FilterContent />
    </Suspense>
  );
}