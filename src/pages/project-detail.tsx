import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/profile';
import styles from './detail-page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.id === id);

  useGSAP(
    () => {
      if (!project) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-detail-back]', { x: -20, opacity: 0, duration: 0.6 })
        .from('[data-detail-title]', { y: 60, opacity: 0, duration: 1 }, '-=0.3')
        .from('[data-detail-subtitle]', { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('[data-detail-tags]', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('[data-detail-body]', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3');

      // Animate additional content sections on scroll
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
        });
      });
    },
    { scope: containerRef },
  );

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h1>Project not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.page}>
      {/* Hero area */}
      <section className={styles.hero}>
        <Link to="/" data-detail-back className={styles.backLink}>
          &#8592; Back
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
      </section>

      {/* Image section — supports images and GIFs */}
      {project.image && (
        <section data-detail-section className={styles.imageSection}>
          <img src={project.image} alt={project.title} />
        </section>
      )}

      {/* Description */}
      <section data-detail-body className={styles.bodySection}>
        <p className={styles.bodyText}>{project.description}</p>
      </section>

      {/*
        Add more sections below for Apple-style presentation.
        Each section with data-detail-section will animate on scroll.
        Example:

        <section data-detail-section className={styles.featureSection}>
          <h2>Key Contribution</h2>
          <p>Description of your contribution...</p>
          <img src="/path/to/diagram.gif" alt="diagram" />
        </section>
      */}
    </div>
  );
}
