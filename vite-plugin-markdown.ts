import type { Plugin } from 'vite'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: ['python', 'typescript', 'javascript', 'go', 'bash', 'json', 'yaml', 'css', 'html', 'tsx', 'jsx', 'sql', 'dockerfile', 'markdown'],
    })
  }
  return highlighterPromise
}

export function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-blog-markdown',
    async transform(code, id) {
      if (!id.endsWith('.md')) return null
      // Only process blog content files
      if (!id.includes('content/blog')) return null

      const { data: frontmatter, content } = matter(code)

      // Set up marked with shiki for code highlighting
      const highlighter = await getHighlighter()
      const marked = new Marked()

      marked.use({
        renderer: {
          code({ text, lang }) {
            const language = lang || 'text'
            try {
              return highlighter.codeToHtml(text, {
                lang: language,
                theme: 'github-dark',
              })
            } catch {
              return `<pre><code class="language-${language}">${text}</code></pre>`
            }
          },
        },
      })

      const html = await marked.parse(content)

      // Extract slug from filename: 2025-01-15-my-post.md → my-post
      const filename = id.split(/[/\\]/).pop()?.replace('.md', '') ?? ''
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '')

      // Calculate reading time (~200 words/min)
      const words = content.trim().split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(words / 200))

      // Normalize date fields: gray-matter auto-converts YAML dates to Date objects
      const dateStr = frontmatter.date instanceof Date
        ? frontmatter.date.toISOString().split('T')[0]
        : String(frontmatter.date ?? '')
      const updatedStr = frontmatter.updated instanceof Date
        ? frontmatter.updated.toISOString().split('T')[0]
        : frontmatter.updated ? String(frontmatter.updated) : undefined

      // Merge computed fields into frontmatter
      const meta = {
        ...frontmatter,
        date: dateStr,
        updated: updatedStr,
        slug,
        readingTime,
        draft: frontmatter.draft ?? false,
        featured: frontmatter.featured ?? false,
        tags: frontmatter.tags ?? [],
      }

      return {
        code: `
          export const frontmatter = ${JSON.stringify(meta)};
          export const html = ${JSON.stringify(html)};
          export const rawContent = ${JSON.stringify(content)};
        `,
        map: null,
      }
    },
  }
}
