# CLAUDE.md

Guidelines for AI assistants working in this repository.

## Project Overview

**anomredux.github.io** — A personal portfolio/profile site hosted on GitHub Pages.

- **URL:** `https://anomredux.github.io/`
- **Goal:** Apple-inspired minimalist design with smooth scroll-driven animations
- **Design reference:** [Apple iPhone 17 Pro page](https://www.apple.com/kr/iphone-17-pro/) — large typography, generous whitespace, scroll-triggered fade/slide animations

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **React 19** + **TypeScript** | Functional components, hooks only |
| Build | **Vite** | Fast dev server, static build output to `dist/` |
| Animation | **GSAP + ScrollTrigger** | Scroll-driven animations, timeline sequencing |
| Styling | **CSS Modules** or **Tailwind CSS** | Scoped styles, utility-first (decide at setup) |
| Linting | **ESLint v10+** (flat config) | `eslint.config.ts` with `defineConfig()` |
| Formatting | **Prettier** | Run separately from ESLint, use `eslint-config-prettier` |
| Hosting | **GitHub Pages** | Static deploy from `gh-pages` branch |
| Deploy | **GitHub Actions** | Auto-build and deploy on push to `main` |

## Repository Structure

```
anomredux.github.io/
├── public/                  # Static assets copied as-is (favicon, og-image, etc.)
├── src/
│   ├── assets/              # Images, fonts, SVGs imported by components
│   ├── components/          # Reusable UI components
│   │   └── ScrollReveal.tsx # Example: scroll-triggered animation wrapper
│   ├── sections/            # Page sections (Hero, About, Skills, Projects, Contact)
│   ├── hooks/               # Custom React hooks (useScrollAnimation, etc.)
│   ├── styles/              # Global styles, CSS variables, reset
│   ├── utils/               # Helper functions
│   ├── App.tsx              # Root component, section composition
│   └── main.tsx             # Entry point, ReactDOM.createRoot
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deploy workflow
├── index.html               # Vite HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── eslint.config.ts         # ESLint flat config
├── .prettierrc              # Prettier config
├── .gitignore               # node_modules, dist, .cache, etc.
├── package.json
├── CLAUDE.md                # This file
└── README.md
```

### Key directories

- **`src/sections/`** — Each major page section is a standalone component (Hero, About, Skills, Projects, Contact). Compose them in `App.tsx`.
- **`src/components/`** — Small, reusable UI pieces (buttons, cards, animation wrappers).
- **`src/hooks/`** — Custom hooks, especially for GSAP animation lifecycle.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run deploy       # Build + deploy to gh-pages branch (if using gh-pages package)
```

## Development Workflow

### Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server with HMR
```

### Branching & Commits

- `main` — Source of truth, triggers deploy on push
- Feature branches — Descriptive names, PR into `main`
- Commit messages — Concise, describe the "why", one logical change per commit

### Deployment

GitHub Actions automatically builds and deploys to GitHub Pages on push to `main`:
1. `npm ci` → `npm run build` → deploy `dist/` to `gh-pages` branch
2. GitHub Pages serves from `gh-pages` branch

**Important:** For a user site (`username.github.io`), `base` in `vite.config.ts` should be `'/'` (not a subdirectory).

## Code Conventions

### TypeScript / React

- **Functional components only** — No class components
- **Named exports** — Avoid default exports (except for pages/sections if needed by lazy loading)
- **File naming** — kebab-case for files (`scroll-reveal.tsx`), PascalCase for components (`ScrollReveal`)
- **Component per file** — One component per file, file name matches component name
- **Props** — Define with `interface`, suffix with `Props` (e.g., `interface HeroProps`)
- **Hooks** — Prefix with `use` (e.g., `useScrollAnimation`)
- **No barrel exports** — Import directly from files, not from `index.ts` re-exports (better tree-shaking with Vite)

### CSS / Styling

- Use CSS custom properties (variables) for the design system (colors, spacing, typography)
- Mobile-first responsive design with `min-width` media queries
- Respect `prefers-reduced-motion` — disable or simplify animations for users who prefer reduced motion
- Prefer `transform` and `opacity` for animations (GPU-accelerated, no layout thrashing)

### GSAP + ScrollTrigger Rules

These rules are critical for correct behavior in React:

1. **Register plugins once** at the app root:
   ```tsx
   import { gsap } from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   gsap.registerPlugin(ScrollTrigger);
   ```

2. **Use `useGSAP` hook** (from `@gsap/react`) or `useLayoutEffect` with cleanup:
   ```tsx
   useGSAP(() => {
     gsap.to(ref.current, { opacity: 1, scrollTrigger: { trigger: ref.current } });
   }, { scope: containerRef }); // auto-cleanup
   ```

3. **Always clean up** — Kill ScrollTrigger instances on unmount. `useGSAP` handles this automatically; if using `useEffect`, return a cleanup function that calls `ScrollTrigger.kill()` on each instance.

4. **Never animate the pinned element itself** — Animate children inside the pinned container.

5. **Call `ScrollTrigger.refresh()`** after dynamic content loads or layout changes.

6. **Use `scrub: 0.5` to `scrub: 1`** for smooth scroll-linked animations (not `scrub: true` which is instant).

7. **Use `markers: true`** during development for visual debugging, remove before production.

### Animation Design Principles (Apple-style)

- **Restraint** — Fewer, purposeful animations. Not everything needs to animate.
- **Scroll-triggered reveals** — Fade-in + slight upward slide (translateY) as sections enter viewport.
- **Large typography** — Headlines should be bold and oversized, body text clean and readable.
- **Generous whitespace** — Sections should breathe. Use `min-height: 100vh` for hero sections.
- **High contrast** — Dark text on light backgrounds (or vice versa for dark sections).
- **Sticky sections** — Pin content while animating sub-elements within.

## Performance Guidelines

- **Images** — Use WebP/AVIF formats, provide responsive `srcset`, lazy-load below-the-fold images
- **Fonts** — Self-host, use `font-display: swap`, limit to 2 font families max
- **Bundle** — Keep total JS under 200KB gzipped. GSAP core (~23KB) + ScrollTrigger is lightweight
- **Animations** — Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`
- **Accessibility** — Wrap animations in `prefers-reduced-motion` checks:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

## Things to Watch For

- **No `.env` files in git** — Add to `.gitignore` if any secrets are introduced
- **GSAP license** — Free for public sites, but check [GSAP licensing](https://gsap.com/licensing/) if using premium plugins
- **SPA routing on GitHub Pages** — If React Router is added, a `404.html` redirect hack is needed (copy `index.html` to `404.html` in the build step)
- **Asset paths** — Always use relative imports or Vite's asset handling, never hardcoded absolute URLs
