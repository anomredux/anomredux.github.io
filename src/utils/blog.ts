import type { BlogPostMeta, BlogPost } from '../types/blog'

// Import all markdown files from content/blog (eager — included in bundle)
const modules = import.meta.glob<{
  frontmatter: BlogPostMeta
  html: string
  rawContent: string
}>('../content/blog/**/*.md', { eager: true })

// Build sorted index of all published posts
function buildIndex(): BlogPost[] {
  const posts: BlogPost[] = []

  for (const [, mod] of Object.entries(modules)) {
    const { frontmatter, html } = mod
    if (frontmatter.draft) continue

    posts.push({
      ...frontmatter,
      content: html,
    })
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => b.date.localeCompare(a.date))
  return posts
}

let cachedIndex: BlogPost[] | null = null

export function getPostIndex(): BlogPost[] {
  if (!cachedIndex) {
    cachedIndex = buildIndex()
  }
  return cachedIndex
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPostIndex().find((p) => p.slug === slug)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getPostIndex().filter((p) => p.category === category)
}

export function getFeaturedPosts(): BlogPost[] {
  return getPostIndex().filter((p) => p.featured)
}

export function getAllCategories(): string[] {
  const cats = new Set(getPostIndex().map((p) => p.category))
  return Array.from(cats).sort()
}

export function getAllTags(): string[] {
  const tags = new Set(getPostIndex().flatMap((p) => p.tags))
  return Array.from(tags).sort()
}

// Pagination helper
export function getPaginatedPosts(
  page: number,
  perPage: number = 10,
  category?: string,
): { posts: BlogPost[]; totalPages: number } {
  const all = category ? getPostsByCategory(category) : getPostIndex()
  const totalPages = Math.max(1, Math.ceil(all.length / perPage))
  const start = (page - 1) * perPage
  const posts = all.slice(start, start + perPage)
  return { posts, totalPages }
}
