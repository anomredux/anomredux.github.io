import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { profile } from '../data/profile';
import styles from './hero.module.css';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-hero-name]', {
        y: 80,
        opacity: 0,
        duration: 1.2,
      })
        .from(
          '[data-hero-role]',
          {
            y: 40,
            opacity: 0,
            duration: 1,
          },
          '-=0.6',
        )
        .from(
          '[data-hero-tagline]',
          {
            y: 30,
            opacity: 0,
            duration: 1,
          },
          '-=0.5',
        )
        .from(
          '[data-hero-scroll]',
          {
            opacity: 0,
            duration: 0.8,
          },
          '-=0.3',
        );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className={`section ${styles.hero}`}>
      <div className={styles.content}>
        <h1 data-hero-name className={styles.name}>
          {profile.name}
        </h1>
        <p data-hero-role className={styles.role}>
          {profile.role}
        </p>
        <p data-hero-tagline className={styles.tagline}>
          {profile.tagline}
        </p>
      </div>
      <div data-hero-scroll className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
