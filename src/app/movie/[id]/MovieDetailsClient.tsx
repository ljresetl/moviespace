"use client";
import { useRouter } from "next/navigation";
import styles from "./MoviePage.module.css";

export default function MovieDetailsClient() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={styles.backBtn}>
      ← Назад
    </button>
  );
}