import { Link } from 'react-router-dom'
import { useLocale } from '../hooks/use-locale'
import styles from './not-found.module.css'

export function NotFound() {
  const { t } = useLocale()

  return (
    <div className={styles.container}>
      <h1 className={styles.code}>{t('notFound.title')}</h1>
      <p className={styles.message}>{t('notFound.message')}</p>
      <Link to="/" className={styles.link}>
        {t('notFound.back')}
      </Link>
    </div>
  )
}
