import { type ReactNode } from 'react';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
}

export function ScrollReveal({
  children,
  className,
  y,
  delay,
  stagger,
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({ y, delay, stagger });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
