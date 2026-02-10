import { ScrollReveal } from '../components/scroll-reveal';
import { profile } from '../data/profile';
import styles from './contact.module.css';

export function Contact() {
  return (
    <section className={`section section--half ${styles.contact}`}>
      <ScrollReveal className={styles.content}>
        <p data-reveal className={styles.label}>
          Contact
        </p>
        <h2 data-reveal className={styles.headline}>
          Let&rsquo;s connect.
        </h2>
        <div data-reveal className={styles.links}>
          {profile.emails.map((email) => (
            <a key={email} href={`mailto:${email}`} className={styles.email}>
              {email}
            </a>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.github}
          >
            GitHub
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
