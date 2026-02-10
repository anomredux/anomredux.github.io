import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  scrub?: number | false;
  start?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    y = 60,
    duration = 1,
    delay = 0,
    stagger = 0.15,
    scrub = false,
    start = 'top 85%',
  } = options;

  useGSAP(() => {
    if (!ref.current) return;

    const children = ref.current.querySelectorAll('[data-reveal]');
    const targets = children.length > 0 ? children : ref.current;

    gsap.from(targets, {
      y,
      opacity: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start,
        ...(scrub !== false && { scrub }),
      },
    });
  }, { scope: ref });

  return ref;
}
