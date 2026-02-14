import { useState, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { bidirectionalReveal } from '../utils/reveal'
import MiniSearch from 'minisearch'
import { getPostIndex, getAllCategories } from '../utils/blog'
import { BlogCard } from '../components/blog-card'
import { useLocale } from '../hooks/use-locale'
import type { BlogPost } from '../types/blog'
import styles from './blog-listing.module.css'

const POSTS_PER_PAGE = 10

export function BlogListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const { t } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      const els = containerRef.current.querySelectorAll('[data-reveal]')
      bidirectionalReveal(els, containerRef.current)
    },
    { scope: containerRef },
  )

  const currentPage = Number(searchParams.get('page') ?? '1')
  const activeCategory = searchParams.get('category') ?? ''

  const allPosts = useMemo(() => getPostIndex(), [])
  const categories = useMemo(() => getAllCategories(), [])

  // Build search index
  const searchIndex = useMemo(() => {
    const index = new MiniSearch<BlogPost>({
      fields: ['title', 'description', 'category'],
      storeFields: ['slug'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    })
    index.addAll(allPosts.map((p, i) => ({ ...p, id: i })))
    return index
  }, [allPosts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    let posts = allPosts

    if (activeCategory) {
      posts = posts.filter((p) => p.category === activeCategory)
    }

    if (query.trim()) {
      const results = searchIndex.search(query.trim())
      const slugs = new Set(results.map((r) => r.slug))
      posts = posts.filter((p) => slugs.has(p.slug))
    }

    return posts
  }, [allPosts, activeCategory, query, searchIndex])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  )

  function setCategory(cat: string) {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    setSearchParams(params)
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams)
    if (p > 1) {
      params.set('page', String(p))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container} ref={containerRef}>
        <header className={styles.header} data-reveal>
          <h1 className={styles.title}>{t('blog.title')}</h1>
          <p className={styles.subtitle}>{t('blog.subtitle')}</p>
        </header>

        {/* Search */}
        <div className={styles.searchWrapper} data-reveal>
          <input
            type="search"
            placeholder={t('blog.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search blog posts"
          />
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className={styles.categories} role="tablist" data-reveal>
            <button
              className={`${styles.categoryTab} ${!activeCategory ? styles.active : ''}`}
              onClick={() => setCategory('')}
              role="tab"
              aria-selected={!activeCategory}
            >
              {t('blog.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryTab} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {paginatedPosts.length > 0 ? (
          <div className={styles.grid} data-reveal>
            {paginatedPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className={styles.empty} data-reveal>{t('blog.empty')}</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination} data-reveal>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
