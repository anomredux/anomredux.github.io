import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { experiences } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './experience.module.css'

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      bidirectionalReveal('[data-exp-label]', sectionRef.current, { y: 40 })
      bidirectionalReveal('[data-exp-item]', sectionRef.current, { y: 60, stagger: 0.15 })
    },
    { scope: sectionRef },
  )

  if (experiences.length === 0) return null

  return (
    <section ref={sectionRef} className={`section ${styles.experience}`} aria-labelledby="experience-heading">
      <div className={styles.container}>
        <h2 data-exp-label id="experience-heading" className={styles.label}>
          {t('section.experience')}
        </h2>
        <div className={styles.timeline}>
          {experiences.map((exp) => (
            <div key={exp.id} data-exp-item className={styles.item}>
              <div className={styles.dot}>
                {exp.current && (
                  <>
                    <span className={styles.pulse} />
                    <span className="sr-only">Current position</span>
                  </>
                )}
              </div>
              <div className={styles.content}>
                <span className={styles.period}>{exp.period}</span>
                <h3 className={styles.role}>{exp.role}</h3>
                <p className={styles.company}>{exp.company}</p>
                <p className={styles.description}>{exp.description}</p>
                {exp.highlights && (
                  <ul className={styles.highlights}>
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
