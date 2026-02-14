import { profile } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import styles from './footer.module.css'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span className={styles.copy}>{t('footer.copyright')}</span>
        <div className={styles.links}>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a href={`mailto:${profile.emails[0]}`} aria-label={`Send email to ${profile.name}`}>
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
