import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { projects } from '../data/profile'
import { prefersReducedMotion } from '../utils/reveal'
import { DetailSections } from '../components/detail-sections'
import styles from './detail-page.module.css'

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const containerRef = useRef<HTMLDivElement>(null)
  const project = projects.find((p) => p.id === id)

  useGSAP(
    () => {
      if (!project || prefersReducedMotion()) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-detail-back]', { x: -20, opacity: 0, duration: 0.6 })
        .from(
          '[data-detail-title]',
          { y: 60, opacity: 0, duration: 1 },
          '-=0.3',
        )
        .from(
          '[data-detail-subtitle]',
          { y: 40, opacity: 0, duration: 0.8 },
          '-=0.5',
        )
        .from(
          '[data-detail-tags]',
          { y: 30, opacity: 0, duration: 0.6 },
          '-=0.4',
        )

      gsap.utils.toArray<HTMLElement>('[data-detail-section]').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        })
      })
    },
    { scope: containerRef },
  )

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h1>Project not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={styles.page}>
      <section className={styles.hero}>
        <Link to="/" data-detail-back className={styles.backLink}>
          <span aria-hidden="true">&#8592; </span>Back
        </Link>
        <h1 data-detail-title className={styles.title}>
          {project.title}
        </h1>
        <p data-detail-subtitle className={styles.subtitle}>
          {project.subtitle}
        </p>
        <div data-detail-tags className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            data-detail-tags
            className={styles.repoLink}
          >
            View on GitHub <span aria-hidden="true">&#8599;</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
      </section>

      {project.image && (
        <section data-detail-section className={styles.imageSection}>
          <img src={project.image} alt={project.title} />
        </section>
      )}

      <section data-detail-section className={styles.bodySection}>
        <p className={styles.bodyText}>{project.description}</p>
      </section>

      {project.sections && <DetailSections sections={project.sections} />}
    </div>
  )
}
