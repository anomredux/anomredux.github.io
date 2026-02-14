import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { awards } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './awards.module.css'

export function Awards() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      bidirectionalReveal('[data-awards-label]', sectionRef.current, { y: 40 })
      bidirectionalReveal('[data-award-card]', sectionRef.current, { y: 60 })
    },
    { scope: sectionRef },
  )

  if (awards.length === 0) return null

  return (
    <section ref={sectionRef} className={`section ${styles.awards}`} aria-labelledby="awards-heading">
      <div className={styles.container}>
        <h2 data-awards-label id="awards-heading" className={styles.label}>
          {t('section.awards')}
        </h2>
        <ul className={styles.grid} role="list">
          {awards.map((award) => (
            <li key={award.id}>
              <Link
                to={`/awards/${award.id}`}
                data-award-card
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <span className={styles.year}>{award.year}</span>
                  <h3 className={styles.cardTitle}>{award.title}</h3>
                  <p className={styles.org}>{award.organization}</p>
                </div>
                <span className={styles.arrow} aria-hidden="true">&#8594;</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
