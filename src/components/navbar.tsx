import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { profile } from '../data/profile'
import { useLocale } from '../hooks/use-locale'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import styles from './navbar.module.css'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLocale()

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Scroll detection for navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: t('nav.home'), to: '/', exact: true },
    { label: t('nav.blog'), to: '/blog' },
    { label: t('nav.contact'), to: '/contact' },
  ]

  return (
    <>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        aria-label="Main navigation"
      >
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            {profile.name}
          </Link>

          {/* Desktop nav */}
          <div className={styles.desktopNav}>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <LanguageSwitcher />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <div className={styles.hamburgerLines}>
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.open : ''}`}
        aria-hidden={!mobileOpen}
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={styles.mobileLink}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <LanguageSwitcher />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </>
  )
}
