import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './DossierShell.module.css';

export function DossierBack() {
  return (
    <section className={styles.backSection}>
      <div className="container">
        <Link href="/" className={styles.back}>
          <ArrowLeft size={16} />
          ПОВЕРНУТИСЯ ДО КАТАЛОГУ
        </Link>
      </div>
    </section>
  );
}

export function DossierStamp({ actorId }: { actorId: string | string[] }) {
  return (
    <section className={styles.stampSection}>
      <div className="container">
        <div className={styles.stampRow}>
          <span className={styles.stamp}>ДОСЬЄ</span>
          <span className={styles.fileNum}>№ {actorId}</span>
        </div>
        <div className={styles.dashLine}></div>
      </div>
    </section>
  );
}

export function DossierDivider({ text }: { text: string }) {
  return (
    <section className={styles.dividerSection}>
      <div className="container">
        <div className={styles.divider}><span>{text}</span></div>
      </div>
    </section>
  );
}

export function DossierFooter({ actorId }: { actorId: string | string[] }) {
  return (
    <section className={styles.footerSection}>
      <div className="container">
        <div className={styles.foot}>
          <span>КІНЕЦЬ ДОСЬЄ • KINOSHROT DATABASE</span>
          <span>ID: {actorId}</span>
        </div>
      </div>
    </section>
  );
}