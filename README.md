# Jefferson Solano — Beyond the CV

Personal portfolio for the Queensland Museum Front End Web Developer (AO6) application (QM705871).
Plain HTML, CSS and vanilla JavaScript. No dependencies, no build step, no tracking.

## Run locally
From this folder: `python3 -m http.server 8000`, then open http://localhost:8000

## Deploy
Upload the whole folder (index.html, css/, js/, assets/) to any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages). When you know the final address,
add the canonical and og:url tags (see the comment in the <head> of index.html).

## Structure
- index.html — all content (works fully without JavaScript)
- css/styles.css — design tokens at the top (:root), then components; print styles at the end
- assets/profile-placeholder.svg — TEMPORARY photo. Replace with your own (e.g. assets/profile.jpg, 800×1000) and update the <img src> in index.html
- js/main.js — progressive enhancements: mobile menu, Brisbane clock, scroll progress,
  label decode effect, count-up stats, scroll reveals, hero dot field, role-fit tabs and filter,
  copy email, print-as-résumé

## Motion
All motion is disabled with prefers-reduced-motion. The hero dot field only animates on
mouse/trackpad devices and only while the hero is visible.

## Content notes
- Every claim comes from the CV and Statement of Suitability supplied for QM705871.
- Headless CMS is shown as "Transferable", matching the statement.
- Phone number, street address and referee details are intentionally NOT published.
