import { profile } from '../data/profile';
import styles from './footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span className={styles.copy}>
          &copy; {year} {profile.name}
        </span>
        <div className={styles.links}>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href={`mailto:${profile.emails[0]}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}
