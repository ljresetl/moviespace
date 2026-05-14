import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
  title: 'Політика конфіденційності — KinoShrot',
  description: 'Політика конфіденційності та захисту персональних даних сайту KinoShrot.',
};

export default function PrivacyPage() {
  return (
    <>
      <section className={styles.navSection}>
        <div className="container">
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={18} />
            <span>Назад</span>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h1 className={styles.title}>Політика конфіденційності</h1>
          <p className={styles.updated}>Останнє оновлення: 14 травня 2025</p>

          <div className={styles.content}>
            <div className={styles.block}>
              <h2>1. Загальні положення</h2>
              <p>
                Ця Політика конфіденційності описує, як <strong>KinoShrot</strong> (далі — «Сайт»)
                збирає, використовує та захищає інформацію, яку ви надаєте при використанні нашого Сайту.
              </p>
              <p>
                Використовуючи Сайт, ви погоджуєтесь з умовами цієї Політики. Якщо ви не згодні з
                будь-яким пунктом — будь ласка, припиніть використання Сайту.
              </p>
            </div>

            <div className={styles.block}>
              <h2>2. Які дані ми збираємо</h2>
              <p>Ми можемо збирати наступну інформацію:</p>
              <ul className={styles.list}>
                <li><strong>Дані реєстрації:</strong> електронна адреса, ім&#39;я, прізвище (за бажанням).</li>
                <li><strong>Дані профілю:</strong> номер телефону, дата народження (за бажанням).</li>
                <li><strong>Технічні дані:</strong> IP-адреса, тип браузера, операційна система, час відвідування.</li>
                <li><strong>Cookies:</strong> файли для збереження сесії та налаштувань.</li>
                <li><strong>Дані авторизації через Google:</strong> email та ім&#39;я з вашого Google-акаунту.</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h2>3. Як ми використовуємо дані</h2>
              <p>Зібрані дані використовуються для:</p>
              <ul className={styles.list}>
                <li>Забезпечення роботи вашого облікового запису та авторизації.</li>
                <li>Персоналізації контенту та рекомендацій.</li>
                <li>Покращення роботи Сайту та виправлення помилок.</li>
                <li>Зв&#39;язку з вами у разі необхідності.</li>
                <li>Забезпечення безпеки та запобігання шахрайству.</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h2>4. Cookies</h2>
              <p>
                Сайт використовує cookies для забезпечення коректної роботи авторизації, збереження
                ваших налаштувань та аналітики відвідувань.
              </p>
              <p>
                Ви можете вимкнути cookies у налаштуваннях свого браузера, проте це може вплинути
                на функціональність Сайту.
              </p>
            </div>

            <div className={styles.block}>
              <h2>5. Передача даних третім сторонам</h2>
              <p>
                Ми <strong>не продаємо</strong> та <strong>не передаємо</strong> ваші персональні
                дані третім сторонам, за винятком випадків:
              </p>
              <ul className={styles.list}>
                <li>Вимоги чинного законодавства або запиту правоохоронних органів.</li>
                <li>Захисту прав, власності або безпеки KinoShrot та його користувачів.</li>
                <li>Використання сервісів аналітики (Google Analytics) в анонімізованому вигляді.</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h2>6. Захист даних</h2>
              <p>
                Ми вживаємо всіх розумних технічних та організаційних заходів для захисту ваших
                персональних даних від несанкціонованого доступу, зміни, розкриття або знищення.
              </p>
              <p>
                Паролі зберігаються у зашифрованому вигляді. Передача даних між вашим браузером
                та сервером захищена протоколом HTTPS.
              </p>
            </div>

            <div className={styles.block}>
              <h2>7. Ваші права</h2>
              <p>Ви маєте право:</p>
              <ul className={styles.list}>
                <li>Отримати інформацію про дані, які ми зберігаємо про вас.</li>
                <li>Вимагати виправлення неточних даних.</li>
                <li>Вимагати видалення вашого облікового запису та всіх пов&#39;язаних даних.</li>
                <li>Відкликати згоду на обробку даних у будь-який час.</li>
              </ul>
              <p>Для реалізації цих прав зверніться за адресою:</p>
              <a href="mailto:privacy@kinoshrot.com" className={styles.email}>
                privacy@kinoshrot.com
              </a>
            </div>

            <div className={styles.block}>
              <h2>8. Зміни до Політики</h2>
              <p>
                Ми залишаємо за собою право змінювати цю Політику конфіденційності в будь-який час.
                Актуальна версія завжди доступна на цій сторінці. Рекомендуємо періодично перевіряти
                її на наявність оновлень.
              </p>
            </div>

            <div className={styles.block}>
              <h2>9. Контакти</h2>
              <p>З питань конфіденційності звертайтесь:</p>
              <a href="mailto:privacy@kinoshrot.com" className={styles.email}>
                privacy@kinoshrot.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}