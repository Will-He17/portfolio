# CLAUDE.md

Personal portfolio for William He (goes by Will). Static site: plain HTML, CSS, vanilla JS. No frameworks, no build step, no npm dependencies. Deployed on Vercel from the `main` branch of github.com/Will-He17/portfolio (Framework Preset "Other", no build command).

## Layout

- `index.html`, `about.html`, `projects.html`, `experience.html`
- `css/style.css`: one file, color and font variables at the top
- `js/scramble.js`: Enigma-style cipher columns on the left and right edges (hidden below 960px, static under prefers-reduced-motion)
- `assets/willhe.jpg`: portrait on the About page; `assets/photo-placeholder.svg` is unused
- `README.md`: how to run, edit, and deploy

## Conventions

- No em dashes anywhere in site copy or code comments.
- Palette is only paper `#f4efe6` and ink `#111`. Courier Prime for body, nav, bullets; Cormorant Garamond italic for big titles.
- Same nav markup on all inner pages; mark the current page with `aria-current="page"`.
- Add a project: copy one `<details class="project">` block in `projects.html`.
- Add experience: copy one `<article class="entry">` block at the top of `experience.html` (newest first).
- Keep one `<h1>` per page, a `<title>`, meta description, and Open Graph tags on every page.
- Check for no horizontal scroll at 360px wide after layout changes.

## Workflow

- Run locally: `npx serve .`
- Run `git pull` before starting and `git push` when done. Will pushes manually (GitHub token login), so commit but do not push unless asked.
- Do not deploy or log in to any service without asking first.
