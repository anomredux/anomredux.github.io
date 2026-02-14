import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../hooks/use-locale'
import { getPostIndex } from '../utils/blog'
import styles from './command-palette.module.css'

interface PaletteItem {
  id: string
  title: string
  hint: string
  group: string
  action: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { t, locale } = useLocale()

  // Build items list
  const allItems = useMemo<PaletteItem[]>(() => {
    const nav: PaletteItem[] = [
      {
        id: 'nav-home',
        title: t('nav.home'),
        hint: '/',
        group: locale === 'ko' ? '페이지' : 'Pages',
        action: () => navigate('/'),
      },
      {
        id: 'nav-blog',
        title: t('nav.blog'),
        hint: '/blog',
        group: locale === 'ko' ? '페이지' : 'Pages',
        action: () => navigate('/blog'),
      },
      {
        id: 'nav-contact',
        title: t('nav.contact'),
        hint: '#contact',
        group: locale === 'ko' ? '페이지' : 'Pages',
        action: () => {
          navigate('/')
          setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        },
      },
    ]

    const posts = getPostIndex()
    const blogItems: PaletteItem[] = posts.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      hint: post.category,
      group: locale === 'ko' ? '블로그 글' : 'Blog Posts',
      action: () => navigate(`/blog/${post.slug}`),
    }))

    return [...nav, ...blogItems]
  }, [navigate, t, locale])

  // Filter items
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems
    const q = query.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
    )
  }, [allItems, query])

  // Group items
  const groupedItems = useMemo(() => {
    const groups: { label: string; items: PaletteItem[] }[] = []
    for (const item of filteredItems) {
      let group = groups.find((g) => g.label === item.group)
      if (!group) {
        group = { label: item.group, items: [] }
        groups.push(group)
      }
      group.items.push(item)
    }
    return groups
  }, [filteredItems])

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Reset active index on filter change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const handleSelect = useCallback(
    (item: PaletteItem) => {
      setOpen(false)
      item.action()
    },
    [],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filteredItems[activeIndex]) {
        e.preventDefault()
        handleSelect(filteredItems[activeIndex])
      }
    },
    [filteredItems, activeIndex, handleSelect],
  )

  let flatIndex = -1

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div className={styles.palette} role="dialog" aria-label="Command palette" aria-modal="true">
        <div className={styles.inputWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={locale === 'ko' ? '검색 또는 이동...' : 'Search or jump to...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-label={locale === 'ko' ? '검색 또는 이동' : 'Search or jump to'}
            aria-expanded={true}
            aria-controls="palette-results"
            aria-activedescendant={filteredItems[activeIndex] ? `palette-item-${filteredItems[activeIndex].id}` : undefined}
          />
          <span className={styles.kbd}>ESC</span>
        </div>
        <div id="palette-results" className={styles.results} role="listbox">
          {groupedItems.length > 0 ? (
            groupedItems.map((group) => (
              <div key={group.label} className={styles.group} role="group" aria-label={group.label}>
                <div className={styles.groupLabel}>{group.label}</div>
                {group.items.map((item) => {
                  flatIndex++
                  const idx = flatIndex
                  return (
                    <div
                      key={item.id}
                      id={`palette-item-${item.id}`}
                      role="option"
                      aria-selected={idx === activeIndex}
                      className={`${styles.item} ${idx === activeIndex ? styles.active : ''}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <div className={styles.itemText}>
                        <div className={styles.itemTitle}>{item.title}</div>
                      </div>
                      <span className={styles.itemHint}>{item.hint}</span>
                    </div>
                  )
                })}
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              {locale === 'ko' ? '결과가 없습니다' : 'No results found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
