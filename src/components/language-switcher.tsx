import { useLocale } from '../hooks/use-locale'
import styles from './language-switcher.module.css'

export function LanguageSwitcher() {
  const { locale, toggle } = useLocale()

  return (
    <button
      className={styles.switcher}
      onClick={toggle}
      aria-label={locale === 'en' ? '한국어로 전환' : 'Switch to English'}
      title={locale === 'en' ? '한국어' : 'English'}
    >
      {locale === 'en' ? 'KO' : 'EN'}
    </button>
  )
}
