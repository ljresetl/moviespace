"use client";

import React, { useState } from "react";
import styles from "./MovieTabs.module.css";

interface MovieTabsProps {
  player1Url?: string; // Videoseed
  player2Url?: string; // Vibix
  kpId?: string | number | null;
}

export default function MovieTabs({ player1Url, player2Url, kpId }: MovieTabsProps) {
  // Плеєр 1 активний за замовчуванням
  const [activeTab, setActiveTab] = useState<"videoseed" | "vibix">("videoseed");

  return (
    <div className={styles.playerContainer}>
      <div className={styles.tabsHeader}>
        <button 
          className={`${styles.tabBtn} ${activeTab === "videoseed" ? styles.active : ""}`}
          onClick={() => setActiveTab("videoseed")}
          disabled={!player1Url}
        >
          Плеєр 1
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === "vibix" ? styles.active : ""}`}
          onClick={() => setActiveTab("vibix")}
          disabled={!player2Url && !kpId}
        >
          Плеєр 2
        </button>
      </div>

      <div className={styles.screen}>
        {activeTab === "videoseed" ? (
          <iframe 
            src={player1Url} 
            width="100%" height="100%" 
            frameBorder="0" allowFullScreen 
            className={styles.iframe}
          />
        ) : (
          <iframe 
            src={player2Url || `https://kinobox.tv/embed/kinopoisk/${kpId}`} 
            width="100%" height="100%" 
            frameBorder="0" allowFullScreen 
            className={styles.iframe}
          />
        )}
      </div>
    </div>
  );
}