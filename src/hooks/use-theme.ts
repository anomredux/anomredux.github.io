import { useState, useEffect, useCallback } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme-preference'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  // Then check system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'

  return 'dark'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Apply theme on mount and sync with system changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setTheme])

  return { theme, toggle } as const
}
