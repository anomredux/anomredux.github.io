import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/profile';
import styles from './skills.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-skill-label]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('[data-skill-item]', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={`section ${styles.skills}`}>
      <div className={styles.container}>
        <p data-skill-label className={styles.label}>
          Skills
        </p>
        <div className={styles.grid}>
          {skills.map((skill) => (
            <div key={skill.name} data-skill-item className={styles.card}>
              <span className={styles.skillName}>{skill.name}</span>
              <span className={styles.skillCategory}>{skill.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
