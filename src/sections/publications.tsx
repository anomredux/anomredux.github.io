import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { publications } from '../data/profile';
import styles from './publications.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Publications() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-pub-label]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('[data-pub-item]', {
        y: 50,
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

  if (publications.length === 0) return null;

  return (
    <section ref={sectionRef} className={`section section--half ${styles.publications}`}>
      <div className={styles.container}>
        <p data-pub-label className={styles.label}>
          Publications
        </p>
        <div className={styles.list}>
          {publications.map((pub, i) => (
            <div key={i} data-pub-item className={styles.item}>
              <div className={styles.content}>
                <h3 className={styles.title}>
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h3>
                <p className={styles.venue}>
                  {pub.venue}
                  {pub.status === 'preprint' && (
                    <span className={styles.badge}>Preprint</span>
                  )}
                </p>
              </div>
              <span className={styles.year}>{pub.year}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
