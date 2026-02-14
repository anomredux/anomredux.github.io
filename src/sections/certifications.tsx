import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { certifications } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './certifications.module.css'

export function Certifications() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      bidirectionalReveal('[data-cert-label]', sectionRef.current, { y: 40 })
      bidirectionalReveal('[data-cert-item]', sectionRef.current, { y: 50 })
    },
    { scope: sectionRef },
  )

  if (certifications.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className={`section section--half ${styles.certifications}`}
      aria-labelledby="certifications-heading"
    >
      <div className={styles.container}>
        <h2 data-cert-label id="certifications-heading" className={styles.label}>
          {t('section.certifications')}
        </h2>
        <ul className={styles.grid} role="list">
          {certifications.map((cert, i) => (
            <li key={i} data-cert-item className={styles.card}>
              <span className={styles.year}>{cert.year}</span>
              <h3 className={styles.name}>
                {cert.link ? (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    {cert.name}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  cert.name
                )}
              </h3>
              <p className={styles.issuer}>{cert.issuer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
