import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { publications } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './publications.module.css'

export function Publications() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      bidirectionalReveal('[data-pub-label]', sectionRef.current, { y: 40 })
      bidirectionalReveal('[data-pub-item]', sectionRef.current, { y: 50 })
    },
    { scope: sectionRef },
  )

  if (publications.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className={`section section--half ${styles.publications}`}
      aria-labelledby="publications-heading"
    >
      <div className={styles.container}>
        <h2 data-pub-label id="publications-heading" className={styles.label}>
          {t('section.publications')}
        </h2>
        <ul className={styles.list} role="list">
          {publications.map((pub, i) => (
            <li key={i} data-pub-item className={styles.item}>
              <div className={styles.content}>
                <h3 className={styles.title}>
                  {pub.link ? (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pub.title}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    pub.title
                  )}
                </h3>
                <p className={styles.venue}>
                  {pub.venue}
                  {pub.status === 'preprint' && (
                    <span className={styles.badge}>
                      {t('publication.preprint')}
                    </span>
                  )}
                </p>
              </div>
              <span className={styles.year}>{pub.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
