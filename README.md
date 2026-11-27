# Hispanic Society of Kamloops

Public website for the **Hispanic Society of Kamloops / Sociedad Hispana de Kamloops** (BC Society S0071166). Built and donated by [tresD](https://tresd.ca).

- Live site (GitHub Pages): https://adrianvo85.github.io/hispanic-society-kamloops/
- Default language: English, with a full Spanish version under `/es/`.

## Stack

Astro static site, GSAP ScrollTrigger, Lenis, a light Three.js logo (CSS 3D and a still image as fallback). Content lives in Markdown and JSON under `src/content/` so it can later be fed by a Google Sheet or a CMS.

## Update content without code

See [docs/guia-actualizar.md](docs/guia-actualizar.md) (and the printable PDF in `docs/guia-actualizar.pdf`).

- **Pages CMS** (recommended): https://app.pagescms.org — sign in with GitHub.
- Optional **Decap CMS** at `/admin/` once a free GitHub OAuth proxy is connected.

## Local development

```bash
npm install
npm run dev
```

The dev server uses the same `/hispanic-society-kamloops/` base path as GitHub Pages.

```bash
npm run build
npm run preview
```

## Facebook sync

`scripts/sync-facebook.mjs` writes posts, photos and events to `src/content/facebook/` when `FB_PAGE_TOKEN` is set. A GitHub Actions workflow runs it every four hours. A page admin must authorize the token once and store it as a repository secret. The script is a no-op without the token.

## Forms and donations

Form endpoints and the Zeffy donation URL are placeholders in `src/content/site/settings.json` until the Society provides them. Do not present the Society as a CRA-registered charity until that status is confirmed.

## License and credit

Site built and donated by tresD. Brand marks and event posters remain property of the Hispanic Society of Kamloops and its partners.
