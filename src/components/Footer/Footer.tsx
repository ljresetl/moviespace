import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          KINO<span>SHROT</span>
        </div>
        
        <p className={styles.copy}>
          © {currentYear} Усі права захищені.
        </p>

        <div className={styles.navLinks}>
          <Link href="/dmca" className={styles.secondaryLink}>Правовласникам</Link>
          <span className={styles.separator}>|</span>
          <Link href="/privacy" className={styles.secondaryLink}>Політика конфіденційності</Link>
        </div>
        
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