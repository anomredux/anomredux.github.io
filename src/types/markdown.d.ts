declare module '*.md' {
  export const frontmatter: import('./blog').BlogPostMeta
  export const html: string
  export const rawContent: string
}
