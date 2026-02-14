export interface BlogPostMeta {
  title: string
  date: string // "2025-01-15"
  updated?: string
  description: string
  category: string
  tags: string[]
  draft: boolean
  featured: boolean
  image?: string
  readingTime: number // calculated at build time
  slug: string // extracted from filename
}

export interface BlogPost extends BlogPostMeta {
  content: string // HTML rendered from markdown
}
