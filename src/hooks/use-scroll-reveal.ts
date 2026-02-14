import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { bidirectionalReveal } from '../utils/reveal'

interface ScrollRevealOptions {
  y?: number
  duration?: number
  stagger?: number
  start?: string
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null)
  const { y = 60, duration = 1, stagger = 0.15, start = 'top 85%' } = options

  useGSAP(
    () => {
      if (!ref.current) return

      const children = ref.current.querySelectorAll('[data-reveal]')
      const targets = children.length > 0 ? children : ref.current

      bidirectionalReveal(targets, ref.current, {
        y,
        duration,
        stagger,
        start,
      })
    },
    { scope: ref },
  )

  return ref
}
