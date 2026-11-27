# Hispanic Society of Kamloops

Public website for the **Hispanic Society of Kamloops / Sociedad Hispana de Kamloops** (BC Society S0071166). Built and donated by [tresD](https://tresd.ca).

- Intended live URL (GitHub Pages): https://adrianvo85.github.io/hispanic-society-kamloops/
- Default language: English, with a full Spanish version under `/es/`.
- The built site is on the `gh-pages` branch. To attach it to that URL, a GitHub account admin should open **Settings → Pages**, choose **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`, and save. The current token could not enable Pages from the API.
- GitHub Actions workflows live in `.github/workflows/`. `deploy.yml` builds the site on push to `main` and publishes `dist` to the `gh-pages` branch. `facebook-sync.yml` runs every four hours and skips the sync when `FB_PAGE_TOKEN` is not set.

## Stack

Astro static site with a cinematic, editorial visual system inspired by [oceanx.org](https://oceanx.org): full-bleed muted video hero, Inter / Big Shoulders Display / DM Mono typography, GSAP ScrollTrigger and Lenis. Content lives in Markdown and JSON under `src/content/` for Pages CMS and Decap.

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

## Visual identity and media credits

The header, footer, favicon and social image use the Society’s **official 2026 logo** (`public/images/logos/logo-official.png` and the 512px UI versions). The mark was supplied as a JPG and prepared as a high-resolution transparent PNG/WebP (circular badge, design unchanged). Older reconstructed marks remain in `public/images/logos/` for archive only and are not used on the live pages.

Hero video and atmospheric stills are free-license stock. They are not photographs of Society events. Event galleries use only the Society’s public posters. Stock is credited here and is not labelled on the public pages.

| File | Work | Author / source | Licence |
| --- | --- | --- | --- |
| `public/videos/hero.webm` / `hero.mp4` / `hero-poster.jpg` | *Day of the Dead altar under color changing lights* (papel picado, cempasúchil, ~16s muted loop) | [Mixkit #34435](https://mixkit.co/free-stock-video/day-of-the-dead-altar-under-color-changing-lights-34435/) | [Mixkit License](https://mixkit.co/license/) |
| `public/images/stock/papel-picado.jpg` | Still from Mixkit #34435, used on the volunteer band | Same as above | Mixkit License |
| `public/images/stock/festival-night.jpg` | Still from *Festival crowd jumping and dancing at night* (archive) | [Mixkit #14088](https://mixkit.co/free-stock-video/festival-crowd-jumping-and-dancing-at-night-14088/) | Mixkit License |
| `public/images/stock/salsa-studio.jpg` | Still from *Cheerful man and woman dancing salsa* (archive) | [Mixkit #39551](https://mixkit.co/free-stock-video/cheerful-man-and-woman-dancing-salsa-39551/) | Mixkit License |
| `public/images/stock/dance-floor.jpg` | Still from *Close up of people dancing in a busy dance hall* (archive) | [Mixkit #49235](https://mixkit.co/free-stock-video/close-up-of-people-dancing-in-a-busy-dance-hall-49235/) | Mixkit License |

Fonts are self-hosted: Inter, DM Mono, and Big Shoulders Display (SIL Open Font License).
