import { Feed } from 'feed'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SITE_URL = 'https://anomredux.github.io'
const DIST_DIR = resolve(__dirname, '../dist')
const CONTENT_DIR = resolve(__dirname, '../src/content/blog')

interface PostMeta {
  title: string
  date: string
  description: string
  category: string
  slug: string
  draft?: boolean
}

function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = []

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (entry.endsWith('.md')) {
        const raw = readFileSync(full, 'utf-8')
        const { data } = matter(raw)
        if (data.draft) continue

        const slug = entry.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
        const dateStr =
          data.date instanceof Date
            ? data.date.toISOString().split('T')[0]
            : String(data.date ?? '')

        posts.push({
          title: data.title ?? slug,
          date: dateStr,
          description: data.description ?? '',
          category: data.category ?? '',
          slug,
        })
      }
    }
  }

  walk(CONTENT_DIR)
  posts.sort((a, b) => b.date.localeCompare(a.date))
  return posts
}

function main() {
  const posts = getAllPosts()

  const feed = new Feed({
    title: 'Mingi Hong — Blog',
    description: 'Thoughts on ML engineering, systems, and building things.',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    copyright: `© ${new Date().getFullYear()} Mingi Hong`,
    author: {
      name: 'Mingi Hong',
      email: 'me@mghong.dev',
      link: SITE_URL,
    },
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/#/blog/${post.slug}`,
      link: `${SITE_URL}/#/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date + 'T00:00:00'),
      category: [{ name: post.category }],
    })
  }

  writeFileSync(join(DIST_DIR, 'rss.xml'), feed.rss2())
  writeFileSync(join(DIST_DIR, 'atom.xml'), feed.atom1())
  writeFileSync(join(DIST_DIR, 'feed.json'), feed.json1())

  console.log(`RSS feeds generated (${posts.length} posts)`)
}

main()
