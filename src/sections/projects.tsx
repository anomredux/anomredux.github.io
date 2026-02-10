import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/profile';
import styles from './projects.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-projects-label]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('[data-project-card]', {
        y: 80,
        opacity: 0,
        duration: 1,
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

  if (projects.length === 0) return null;

  return (
    <section ref={sectionRef} className={`section ${styles.projects}`}>
      <div className={styles.container}>
        <p data-projects-label className={styles.label}>
          Projects
        </p>
        <div className={styles.grid}>
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              data-project-card
              className={styles.card}
            >
              {project.image && (
                <div className={styles.imageWrapper}>
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardSubtitle}>{project.subtitle}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className={styles.arrow}>&#8594;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
