import { Link } from 'react-router-dom'
import { useLocale } from '../hooks/use-locale'
import type { BlogPostMeta } from '../types/blog'
import styles from './blog-card.module.css'

interface BlogCardProps {
  post: BlogPostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  const { t, locale } = useLocale()

  return (
    <Link to={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.category}>{post.category}</span>
        <span className={styles.date}>{formatDate(post.date, locale)}</span>
        <span className={styles.readingTime}>
          {post.readingTime} {t('blog.minRead')}
        </span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.description}>{post.description}</p>
      {post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

function formatDate(dateStr: string, locale: string): string {
  const normalized = dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00'
  const date = new Date(normalized)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
