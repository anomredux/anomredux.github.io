import { useEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { CommandPalette } from './command-palette'
import { Analytics } from './analytics'
import { useTheme } from '../hooks/use-theme'

export function Layout() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const { theme, toggle } = useTheme()

  // Scroll to top only on PUSH navigation (not back/forward)
  useEffect(() => {
    if (navigationType === 'PUSH') {
      window.scrollTo(0, 0)
    }
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timer)
  }, [pathname, navigationType])

  // Refresh ScrollTrigger on viewport resize (mobile ↔ desktop)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(timeout)
      timeout = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
      <Analytics />
    </>
  )
}
