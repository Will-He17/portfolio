# CLAUDE.md

Personal portfolio for William He. Static HTML, CSS, and vanilla JS. No frameworks, no build step. Deployed on Vercel (`vercel.json` sets `cleanUrls`).

## Run
`npx serve .` then open the printed URL. Subpages use root-absolute paths, so use the server, not file://.

## Style
- Palette: `--paper: #f4efe6`, `--ink: #111111`. Black on warm paper, nothing else. Derived tint: `--paper-deep`.
- Fonts: Cormorant Garamond italic for headings, Courier Prime for everything else. Variables at the top of `css/style.css`.
- Hairline 1px black rules, no shadows, no rounded corners. Visible focus and hover on every link and button.
- NEVER use em dashes in site copy or code comments. Use periods, commas, or colons.
- Do not invent facts, numbers, or links in any copy.

## Cipher columns
`js/scramble.js` builds two fixed columns of five-letter groups on every page and flickers a few letters per tick. They are `aria-hidden`, hidden below 960px, and stop under `prefers-reduced-motion`. CSS width is `9.2em` (two whole groups) so nothing clips mid-letter. Subpage containers leave 8.5rem each side at 960px and up.

## Files
- `index.html`, `about.html`, `projects.html`, `experience.html`: list pages (relative links, `.html` hrefs)
- `experience/<slug>.html`, `projects/<slug>.html`: case study subpages (root-absolute links, clean URLs)
- `_template.html`: single source of truth for subpages, with `{{TOKEN}}` and TODO markers
- `css/style.css`: all styles, subpage rules in the "Subpages" section
- `js/scramble.js`, `js/subpage.js` (carousel, sidebar highlight)
- `assets/placeholder.svg`, `assets/media/<slug>/` for per-page media

## Add a subpage
Copy `_template.html` to `/experience/` or `/projects/`, replace every `{{TOKEN}}`, resolve TODOs, delete the `template-only` line, add `assets/media/<slug>/.gitkeep`, link it from the list page, and update prev/next on the neighboring pages. Details in README.md.

## Swap placeholder media
Each slide is one line. Replace `<figure class="slide placeholder">...</figure>` with `<figure class="slide"><img src="/assets/media/<slug>/01.jpg" alt="..." loading="lazy"></figure>`. Lazy-load every image after the first slide. Use `/fill-subpage <slug>` to do the whole page.

## Rules
Do not deploy or log in to any account without asking first.
