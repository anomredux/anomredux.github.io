import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../utils/blog'
import { useLocale } from '../hooks/use-locale'
import styles from './blog-post.module.css'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined
  const { t, locale } = useLocale()

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h1>Post not found</h1>
        <Link to="/blog">{t('blog.back')}</Link>
      </div>
    )
  }

  const dateStr = new Date(post.date + 'T00:00:00').toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )

  return (
    <div className={styles.page}>
      <article className={styles.container}>
        <Link to="/blog" className={styles.backLink}>
          {t('blog.back')}
        </Link>

        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{dateStr}</span>
            <span className={styles.readingTime}>
              {post.readingTime} {t('blog.minRead')}
            </span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}
