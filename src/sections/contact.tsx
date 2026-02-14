import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { profile } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './contact.module.css'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      bidirectionalReveal('[data-contact-item]', sectionRef.current, { y: 40 })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`section section--half ${styles.contact}`}
      aria-labelledby="contact-heading"
    >
      <div className={styles.content}>
        <p data-contact-item className={styles.label} aria-hidden="true">
          {t('section.contact')}
        </p>
        <h2 data-contact-item id="contact-heading" className={styles.headline}>
          {t('contact.headline')}
        </h2>
        <div data-contact-item className={styles.links}>
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
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
