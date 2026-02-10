import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { awards } from '../data/profile';
import styles from './awards.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Awards() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-awards-label]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('[data-award-card]', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });
    },
    { scope: sectionRef },
  );

  if (awards.length === 0) return null;

  return (
    <section ref={sectionRef} className={`section ${styles.awards}`}>
      <div className={styles.container}>
        <p data-awards-label className={styles.label}>
          Awards
        </p>
        <div className={styles.grid}>
          {awards.map((award) => (
            <Link
              key={award.id}
              to={`/awards/${award.id}`}
              data-award-card
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <span className={styles.year}>{award.year}</span>
                <h3 className={styles.cardTitle}>{award.title}</h3>
                <p className={styles.org}>{award.organization}</p>
              </div>
              <span className={styles.arrow}>&#8594;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
