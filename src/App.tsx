import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Home } from './pages/home'

const ProjectDetail = lazy(() =>
  import('./pages/project-detail').then((m) => ({ default: m.ProjectDetail })),
)
const AwardDetail = lazy(() =>
  import('./pages/award-detail').then((m) => ({ default: m.AwardDetail })),
)
const BlogListing = lazy(() =>
  import('./pages/blog-listing').then((m) => ({ default: m.BlogListing })),
)
const BlogPostPage = lazy(() =>
  import('./pages/blog-post').then((m) => ({ default: m.BlogPostPage })),
)
const ContactPage = lazy(() =>
  import('./pages/contact-page').then((m) => ({ default: m.ContactPage })),
)
const NotFound = lazy(() =>
  import('./pages/not-found').then((m) => ({ default: m.NotFound })),
)

export function App() {
  return (
    <Suspense fallback={<div role="status" aria-live="polite" style={{ minHeight: '100vh' }} />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/awards/:id" element={<AwardDetail />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
