import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '../data/profile';
import styles from './experience.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-exp-label]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('[data-exp-item]', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });
    },
    { scope: sectionRef },
  );

  if (experiences.length === 0) return null;

  return (
    <section ref={sectionRef} className={`section ${styles.experience}`}>
      <div className={styles.container}>
        <p data-exp-label className={styles.label}>
          Experience
        </p>
        <div className={styles.timeline}>
          {experiences.map((exp) => (
            <div key={exp.id} data-exp-item className={styles.item}>
              <div className={styles.dot}>
                {exp.current && <span className={styles.pulse} />}
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
  );
}
