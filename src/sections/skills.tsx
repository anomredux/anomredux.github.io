import { useRef, useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import { skills, skillCategories } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { bidirectionalReveal } from '../utils/reveal'
import styles from './skills.module.css'

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLocale()

  const grouped = useMemo(() => {
    const map = new Map<string, typeof skills>()
    for (const cat of skillCategories) map.set(cat, [])
    for (const skill of skills) map.get(skill.category)?.push(skill)
    return map
  }, [])

  useGSAP(
    () => {
      bidirectionalReveal('[data-skill-label]', sectionRef.current, { y: 40 })
      bidirectionalReveal('[data-skill-group]', sectionRef.current, {
        y: 60,
        stagger: 0.1,
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className={`section ${styles.skills}`} aria-labelledby="skills-heading">
      <div className={styles.container}>
        <h2 data-skill-label id="skills-heading" className={styles.label}>
          {t('section.skills')}
        </h2>
        <div className={styles.groups}>
          {skillCategories.map((cat) => (
            <div key={cat} data-skill-group className={styles.group}>
              <h3 className={styles.groupTitle}>
                {t(`skill.${cat}` as 'skill.ml')}
              </h3>
              <ul className={styles.chips} role="list">
                {grouped.get(cat)?.map((skill) => (
                  <li key={skill.name} className={styles.chip}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
