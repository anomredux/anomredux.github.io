import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { projects } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './projects.module.css'

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  useGSAP(
    () => {
      bidirectionalReveal('[data-projects-label]', sectionRef.current, { y: 40 })
      bidirectionalReveal('[data-project-card]', sectionRef.current, { y: 80, stagger: 0.15 })
    },
    { scope: sectionRef },
  )

  if (projects.length === 0) return null

  return (
    <section ref={sectionRef} className={`section ${styles.projects}`} aria-labelledby="projects-heading">
      <div className={styles.container}>
        <h2 data-projects-label id="projects-heading" className={styles.label}>
          {t('section.projects')}
        </h2>
        <ul className={styles.grid} role="list">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                to={`/projects/${project.id}`}
                data-project-card
                className={styles.card}
              >
                {project.image && (
                  <div className={styles.imageWrapper}>
                    <img src={project.image} alt={project.title} loading="lazy" />
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
                <span className={styles.arrow} aria-hidden="true">&#8594;</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
