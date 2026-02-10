import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { awards } from '../data/profile';
import { DetailSections } from '../components/detail-sections';
import styles from './detail-page.module.css';

gsap.registerPlugin(ScrollTrigger);

export function AwardDetail() {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const award = awards.find((a) => a.id === id);

  useGSAP(
    () => {
      if (!award) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-detail-back]', { x: -20, opacity: 0, duration: 0.6 })
        .from('[data-detail-title]', { y: 60, opacity: 0, duration: 1 }, '-=0.3')
        .from('[data-detail-subtitle]', { y: 40, opacity: 0, duration: 0.8 }, '-=0.5');

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

  if (!award) {
    return (
      <div className={styles.notFound}>
        <h1>Award not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.page}>
      <section className={styles.hero}>
        <Link to="/" data-detail-back className={styles.backLink}>
          &#8592; Back
        </Link>
        <span data-detail-subtitle className={styles.yearBadge}>
          {award.year}
        </span>
        <h1 data-detail-title className={styles.title}>
          {award.title}
        </h1>
        <p data-detail-subtitle className={styles.subtitle}>
          {award.organization}
        </p>
      </section>

      {award.image && (
        <section data-detail-section className={styles.imageSection}>
          <img src={award.image} alt={award.title} />
        </section>
      )}

      <section data-detail-section className={styles.bodySection}>
        <p className={styles.bodyText}>{award.description}</p>
      </section>

      {award.sections && <DetailSections sections={award.sections} />}
    </div>
  );
}
