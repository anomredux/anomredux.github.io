import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certifications } from '../data/profile';
import styles from './certifications.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-cert-label]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('[data-cert-item]', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });
    },
    { scope: sectionRef },
  );

  if (certifications.length === 0) return null;

  return (
    <section ref={sectionRef} className={`section section--half ${styles.certifications}`}>
      <div className={styles.container}>
        <p data-cert-label className={styles.label}>
          Certifications
        </p>
        <div className={styles.grid}>
          {certifications.map((cert, i) => (
            <div key={i} data-cert-item className={styles.card}>
              <span className={styles.year}>{cert.year}</span>
              <h3 className={styles.name}>
                {cert.link ? (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    {cert.name}
                  </a>
                ) : (
                  cert.name
                )}
              </h3>
              <p className={styles.issuer}>{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
