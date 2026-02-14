import type { ProjectSection } from '../data/profile'
import styles from '../pages/detail-page.module.css'

interface DetailSectionsProps {
  sections: ProjectSection[]
}

export function DetailSections({ sections }: DetailSectionsProps) {
  return (
    <>
      {sections.map((section, i) => {
        if (section.type === 'image' && section.image) {
          return (
            <section
              key={i}
              data-detail-section
              className={styles.imageSection}
            >
              <img src={section.image} alt={section.imageAlt ?? ''} />
            </section>
          )
        }

        if (section.type === 'text') {
          return (
            <section key={i} data-detail-section className={styles.bodySection}>
              {section.heading && (
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
              )}
              {section.body && (
                <p className={styles.bodyText}>{section.body}</p>
              )}
            </section>
          )
        }

        if (section.type === 'feature') {
          return (
            <section
              key={i}
              data-detail-section
              className={styles.featureSection}
            >
              {section.heading && <h2>{section.heading}</h2>}
              {section.body && <p>{section.body}</p>}
              {section.image && (
                <img src={section.image} alt={section.imageAlt ?? ''} />
              )}
            </section>
          )
        }

        return null
      })}
    </>
  )
}
