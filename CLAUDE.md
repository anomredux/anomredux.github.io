# CLAUDE.md

Guidelines for AI assistants working in this repository.

## Project Overview

This is **anomredux.github.io**, a GitHub Pages personal site repository. It serves static content via GitHub Pages at `https://anomredux.github.io/`.

**Current state:** Newly initialized repository with minimal content. The site structure is yet to be built out.

## Repository Structure

```
anomredux.github.io/
├── README.md          # Repository description
├── CLAUDE.md          # This file — AI assistant guidelines
└── .git/              # Git metadata
```

As the project grows, expect standard GitHub Pages directories such as:
- `index.html` — Site entry point
- `assets/` — CSS, JavaScript, images, fonts
- `_layouts/` / `_includes/` — Jekyll templates (if Jekyll is adopted)
- `_posts/` — Blog posts (if Jekyll is adopted)
- `_config.yml` — Jekyll configuration (if Jekyll is adopted)
- `.github/workflows/` — CI/CD pipelines

## Tech Stack

- **Hosting:** GitHub Pages (static site hosting)
- **Build system:** None configured yet
- **Dependencies:** None configured yet
- **Testing:** None configured yet
- **CI/CD:** None configured yet

When a build system is added, update this section accordingly.

## Development Workflow

### Branching

- The default branch hosts the GitHub Pages deployment
- Feature branches should use descriptive names
- Push changes with `git push -u origin <branch-name>`

### Commits

- Write clear, concise commit messages describing the "why"
- Keep commits focused on a single logical change

### Local Development

No build step is currently required. For a plain HTML/CSS/JS site, open `index.html` in a browser. If Jekyll or another static site generator is adopted later:

```bash
# Jekyll example (when configured):
bundle install
bundle exec jekyll serve
# Site available at http://localhost:4000
```

## Code Conventions

### General

- Use consistent indentation (2 spaces for HTML/CSS/JS, or match existing files)
- Prefer semantic HTML elements
- Keep files focused and reasonably sized

### File Naming

- Use lowercase with hyphens for file and directory names (e.g., `about-me.html`)
- Use standard extensions: `.html`, `.css`, `.js`, `.md`

### CSS

- Prefer a single stylesheet or minimal CSS files
- Use meaningful class names

### JavaScript

- Prefer vanilla JS unless a framework is explicitly adopted
- Keep scripts minimal for a static site

## Deployment

GitHub Pages automatically deploys from the configured branch. No manual deployment steps are needed beyond pushing to the correct branch.

## Things to Watch For

- **No .gitignore** exists yet — add one before introducing build tools or dependencies to avoid committing generated files, `node_modules/`, `_site/`, `.jekyll-cache/`, etc.
- **No LICENSE** file exists — consider adding one if the site content should be openly licensed
- **No linting or formatting** tools are configured — adopt them early if the project grows
