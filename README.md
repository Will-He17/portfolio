# william he: portfolio

Static site. Plain HTML, CSS, and vanilla JS. No build step, no dependencies.

## Run locally

```bash
npx serve .
```

Then open the URL it prints (usually http://localhost:3000). Or just open `index.html` in a browser.

## Edit content

- **Text and links:** edit the `.html` files directly. Look for `TODO` comments.
- **Photo:** save your photo as `assets/photo.jpg`, then in `about.html` change the `<img src>` to `assets/photo.jpg` and update the `alt` text.
- **Instagram:** in `index.html`, replace `href="#"` with your profile URL.
- **Colors and fonts:** variables at the top of `css/style.css`.

## Site structure

```
index.html, about.html, projects.html, experience.html   list pages
experience/<slug>.html      one case study per experience entry
projects/<slug>.html        one case study per project
_template.html              the layout every subpage is copied from
css/style.css               all styles (subpage styles are in the "Subpages" section)
js/scramble.js              cipher side columns
js/subpage.js               carousel and case study sidebar
assets/placeholder.svg      shared placeholder visual for empty slides
assets/media/<slug>/        real images and videos for each subpage
vercel.json                 {"cleanUrls": true}, so /experience/product-sales works
```

Subpages use root-absolute paths (`/css/style.css`), so view them through `npx serve .` rather than opening the file directly. `npx serve .` also serves clean URLs like `/projects/daygree`.

## Add a new subpage

1. Copy `_template.html` to `experience/<slug>.html` or `projects/<slug>.html`.
2. Replace every `{{TOKEN}}` (the list is in the comment at the top of the template) and resolve each `TODO`.
3. Delete the `template-only` noindex line. On experience pages also delete the `projects-only` blocks; on project pages just remove the marker comments.
4. Create `assets/media/<slug>/` with a `.gitkeep`.
5. Add the entry to `experience.html` or `projects.html`, linking its title and the "read" line to the new page.
6. Update the `previous` and `next` links on the neighboring pages in that section so the loop (wrapping at the ends) stays intact.

## Swap placeholder media

Each slide in the carousel is a single line. Save the file as `assets/media/<slug>/01.jpg` (short numbered names, never edit originals in place), then replace the whole placeholder line:

```html
<figure class="slide placeholder">...</figure>
```

with:

```html
<figure class="slide"><img src="/assets/media/<slug>/01.jpg" alt="Describe the image" loading="lazy"><figcaption>Optional caption</figcaption></figure>
```

- Keep `loading="lazy"` on every image except the first slide. Alt text is required.
- Video: `<figure class="slide"><video src="/assets/media/<slug>/demo.mp4" controls muted playsinline preload="metadata"></video></figure>`
- Images are letterboxed (never cropped) inside the 16:9 frame. Add or remove slides freely; the counter and buttons adapt, and the buttons hide at one slide.
- To put an image inside a case study section, use `<figure class="inline-media"><img ...><figcaption>...</figcaption></figure>` (example in the template).
- Demo and source links for projects: uncomment the `sub-links` block in the page header and fill in the URLs.

## Fill in a page with Claude Code

Run `/fill-subpage <slug>` (for example `/fill-subpage product-sales`). The skill lives in `.claude/skills/fill-subpage/SKILL.md`. It copies your media into `assets/media/<slug>/`, builds the slides, and places your writing in the four case study sections without inventing facts.

## Add an experience entry or project to the list page

In `experience.html`, copy one whole `<article class="entry">...</article>` block, paste it at the top (newest first), and edit the role, meta line, and bullets. In `projects.html`, copy one `<article class="project">...</article>` block and edit the title, subtitle, and badge. Then build the matching subpage (see above).

## Deploy (Vercel)

1. Push this folder to a GitHub repo, then import it at vercel.com/new.
2. Framework Preset: **Other**. Build command: empty. Output directory: empty (root).
3. Click Deploy.

Alternative: `npm i -g vercel`, then run `vercel` in this folder and accept the defaults.
