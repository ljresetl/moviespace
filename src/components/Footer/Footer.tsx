import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Використовуємо глобальний клас container разом із модульним класом */}
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          MOVIE<span>SPACE</span>
        </div>
        
        <p className={styles.copy}>
          © {currentYear} Усі права захищені.
        </p>
        
        <p className={styles.author}>
          Створено з ❤️ до українців від — <a 
            href="https://webdevcompass.com" 
            target="_blank" 
            className={styles.link}
          >
            webdevcompass.com
          </a>.
        </p>
      </div>
    </footer>
  );
}