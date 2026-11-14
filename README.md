# Jefferson Solano — Beyond the CV

Personal portfolio for the Queensland Museum Front End Web Developer (AO6) application.
Built with **Next.js (App Router) + TypeScript**, exported as a static site and deployed to GitHub Pages.

Live: https://kurtthe.github.io

## Run locally
Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000 with hot reload
npm run build      # static export to ./out
npm start          # serves ./out at http://localhost:3000
```

## Structure
```
app/            layout (metadata, structured data), page, global CSS
components/     one component per section + interactive pieces
                (CodeEditor, Gallery, Pipeline, FlashDemo, RoleFit, Header …)
data/content.ts all copy: projects, experience, requirements, evidence
lib/            asset() base-path helper, useInView hook
public/assets/  favicon, profile photo, product screens (webp)
.github/        GitHub Actions workflow that builds and deploys on push to main
```

Content lives in `data/content.ts`, separate from the components. That file is the layer a
headless CMS (e.g. Sanity) would replace.

## Edit
- Text: `data/content.ts`
- Photo: replace `public/assets/profile-placeholder.svg` (4:5, e.g. 800×1000) and update the path in `components/Hero.tsx`
- Styles and design tokens: `app/globals.css` (tokens at the top in `:root`)

## Deploy
Push to `main`. The workflow in `.github/workflows/deploy.yml` runs `npm ci`, `npm run build`
and publishes `./out`. One-time setup: **Settings → Pages → Source: GitHub Actions**.

If the site is served from a sub-folder (`https://user.github.io/repo-name/`), add a repository
variable `BASE_PATH` = `/repo-name` (Settings → Secrets and variables → Actions → Variables).

## Accessibility and motion
Semantic landmarks and headings, visible focus states, ARIA tabs with arrow-key support,
alt text on every product screen. All motion stops with `prefers-reduced-motion`.
Automated checks don't replace manual keyboard and screen-reader testing.
