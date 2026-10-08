---
name: fill-subpage
description: Fills in one portfolio case study subpage with real media and writeup. Use when the user provides images, videos, or writing for a specific experience or project page.
---

Usage: /fill-subpage <slug>, where slug is a page such as product-sales or roll-the-credits.

1. Find the page at /experience/<slug>.html or /projects/<slug>.html. Read it and _template.html first.
2. Copy any media the user attached or pointed to into assets/media/<slug>/ with short numbered names (01.jpg, 02.jpg). Do not edit originals in place.
3. Replace placeholder slides with real <figure class="slide"> elements using the user's order, with meaningful alt text and optional captions. Remove unused placeholder slides.
4. Put the user's writing into the four case study sections (Situation, Task, Action, Result). Keep their wording. Fix only obvious typos, and never use em dashes. If their text does not fit the four sections, ask once how to split it.
5. Replace the one-sentence summary placeholder with a sentence drawn only from the user's text. Never invent facts, numbers, or links.
6. If demo or source links were provided, uncomment the links row and fill in the URLs (open in a new tab with rel="noopener noreferrer").
7. Remove the TODO comments you resolved. Preview with npx serve . and check desktop and mobile widths.
