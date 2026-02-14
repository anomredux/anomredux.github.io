import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { prefersReducedMotion } from '../utils/reveal'
import styles from './hero.module.css'

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const targets = '[data-hero-name], [data-hero-role], [data-hero-tagline], [data-hero-scroll]'

      // Initial page-load animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-name]', { y: 80, opacity: 0, duration: 1.2 })
        .from('[data-hero-role]', { y: 40, opacity: 0, duration: 1 }, '-=0.6')
        .from('[data-hero-tagline]', { y: 30, opacity: 0, duration: 1 }, '-=0.5')
        .from('[data-hero-scroll]', { opacity: 0, duration: 0.8 }, '-=0.3')

      // Bidirectional reveal when scrolling back up
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 95%',
        end: 'bottom 5%',
        onLeave: () => gsap.set(targets, { opacity: 0, y: -60 }),
        onEnterBack: () =>
          gsap.fromTo(
            targets,
            { opacity: 0, y: -60 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
          ),
      })
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className={`section ${styles.hero}`}>
      <div className={styles.content}>
        <h1 data-hero-name className={styles.name}>
          {profile.name}
        </h1>
        <p data-hero-role className={styles.role}>
          {t('hero.role')}
        </p>
        <p data-hero-tagline className={styles.tagline}>
          {t('hero.tagline').split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
      <div data-hero-scroll className={styles.scrollIndicator}>
        <span className={styles.scrollText}>{t('hero.scroll')}</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
