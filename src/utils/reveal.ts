import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface RevealOptions {
  y?: number
  duration?: number
  stagger?: number
  start?: string
  end?: string
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Bidirectional scroll reveal:
 * - Scroll down → elements slide up + fade in
 * - Scroll up → elements slide down + fade in
 * - Elements instantly hide only when fully off-screen
 */
export function bidirectionalReveal(
  targets: gsap.TweenTarget,
  trigger: Element | null,
  options: RevealOptions = {},
) {
  if (!trigger) return

  // Skip animations for users who prefer reduced motion
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return
  }

  const {
    y = 60,
    duration = 0.5,
    stagger = 0.08,
    start = 'top 95%',
    end = 'bottom 5%',
  } = options

  // Initially hide
  gsap.set(targets, { opacity: 0, y })

  ScrollTrigger.create({
    trigger,
    start,
    end,
    onEnter: () =>
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, stagger, ease: 'power3.out' },
      ),
    onEnterBack: () =>
      gsap.fromTo(
        targets,
        { opacity: 0, y: -y },
        { opacity: 1, y: 0, duration, stagger, ease: 'power3.out' },
      ),
    onLeave: () => gsap.set(targets, { opacity: 0, y: -y }),
    onLeaveBack: () => gsap.set(targets, { opacity: 0, y }),
  })
}
