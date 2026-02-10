import { ScrollReveal } from '../components/scroll-reveal';
import styles from './about.module.css';

export function About() {
  return (
    <section className={`section ${styles.about}`}>
      <ScrollReveal className={styles.content}>
        <p data-reveal className={styles.label}>
          About
        </p>
        <h2 data-reveal className={styles.headline}>
          Machine Learning Engineer
          <br />
          building systems that scale.
        </h2>
        <div data-reveal className={styles.body}>
          <p>
            I focus on the full lifecycle of ML — designing training pipelines,
            optimizing models, and deploying them into production environments
            that handle real-world traffic.
          </p>
          <p>
            Currently working as a Technical Research Personnel (
            <span lang="ko">전문연구요원</span>), bridging research and
            engineering to ship reliable ML infrastructure.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
