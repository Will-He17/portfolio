# CLAUDE.md

Personal portfolio for William He (goes by Will). Static HTML, CSS, and vanilla JS. No frameworks, no build step, no npm dependencies. Deployed on Vercel from the `main` branch of github.com/Will-He17/portfolio (Framework Preset "Other", no build command). `vercel.json` sets `cleanUrls`.

## Run
`npx serve .` then open the printed URL. Subpages use root-absolute paths, so use the server, not file://.

## Style
- Palette: `--paper: #f4efe6`, `--ink: #111111`. Black on warm paper, nothing else. Derived tint: `--paper-deep`.
- Fonts: Cormorant Garamond italic for headings, Courier Prime for everything else. Variables at the top of `css/style.css`.
- Hairline 1px black rules, no shadows, no rounded corners. Visible focus and hover on every link and button.
- NEVER use em dashes in site copy or code comments. Use periods, commas, or colons.
- Do not invent facts, numbers, or links in any copy.
- Keep one `<h1>` per page, a `<title>`, meta description, and Open Graph tags on every page.
- Check for no horizontal scroll at 360px wide after layout changes.

## Cipher columns
`js/scramble.js` builds two fixed columns of five-letter groups on every page. Two effects: a fast shimmer (letters and opacities change on a timer) and a perpetual downward scroll (one transform per frame, rows recycled to the top). They are `aria-hidden`, hidden below 960px, and static under `prefers-reduced-motion`. `ROW_HEIGHT` in the JS must match the 21px `.cipher-row` height in the CSS. CSS width is `9.2em` (two whole groups) so nothing clips mid-letter. Subpage containers leave 8.5rem each side at 960px and up.

## Files
- `index.html`, `about.html`, `projects.html`, `experience.html`: list pages (relative links, `.html` hrefs)
- `experience/<slug>.html`, `projects/<slug>.html`: case study subpages (root-absolute links, clean URLs)
- `_template.html`: single source of truth for subpages, with `{{TOKEN}}` and TODO markers
- `css/style.css`: all styles, subpage rules in the "Subpages" section
- `js/scramble.js`, `js/subpage.js` (carousel, sidebar highlight)
- `assets/willhe.jpg`: portrait on the About page; `assets/placeholder.svg` is the shared slide placeholder
- `assets/media/<slug>/` for per-page media

## Add content
- Experience: copy one `<article class="entry">` block at the top of `experience.html` (newest first).
- Project: copy one `<article class="project">` block in `projects.html`.
- Then build its subpage: copy `_template.html` to `/experience/` or `/projects/`, replace every `{{TOKEN}}`, resolve TODOs, delete the `template-only` line, add `assets/media/<slug>/.gitkeep`, and update prev/next on the neighboring pages. Details in README.md.

## Swap placeholder media
Each slide is one line. Replace `<figure class="slide placeholder">...</figure>` with `<figure class="slide"><img src="/assets/media/<slug>/01.jpg" alt="..." loading="lazy"></figure>`. Lazy-load every image after the first slide. Use `/fill-subpage <slug>` to do the whole page.

## Workflow
- Run `git pull` before starting. Will pushes from more than one place, so always sync with `origin` first to avoid diverging branches.
- Do not deploy or log in to any service without asking first.
