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

## Add a project

In `projects.html`, copy one whole `<details class="project">...</details>` block, paste it after the last one, and edit the title, subtitle, badge, and bullets.

## Add an experience entry

In `experience.html`, copy one whole `<article class="entry">...</article>` block, paste it at the top (newest first), and edit the role, meta line, and bullets.

## Deploy (Vercel)

1. Push this folder to a GitHub repo, then import it at vercel.com/new.
2. Framework Preset: **Other**. Build command: empty. Output directory: empty (root).
3. Click Deploy.

Alternative: `npm i -g vercel`, then run `vercel` in this folder and accept the defaults.
