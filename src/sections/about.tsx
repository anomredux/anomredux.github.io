import { ScrollReveal } from '../components/scroll-reveal'
import { useLocale } from '../hooks/use-locale'
import styles from './about.module.css'

export function About() {
  const { t } = useLocale()

  return (
    <section className={`section ${styles.about}`} aria-labelledby="about-heading">
      <ScrollReveal className={styles.content}>
        <p data-reveal className={styles.label} aria-hidden="true">
          {t('section.about')}
        </p>
        <h2 data-reveal id="about-heading" className={styles.headline}>
          {t('about.headline').split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        <div data-reveal className={styles.body}>
          <p>{t('about.body1')}</p>
          <p>{t('about.body2')}</p>
        </div>
      </ScrollReveal>
    </section>
  )
}
