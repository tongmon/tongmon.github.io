# tongmon.github.io

A pixel-art, scroll-driven introduction page for **tongstar**, served from GitHub Pages at <https://tongmon.github.io/>.

The desk scene is drawn in code on a low-resolution canvas and scaled by an integer number of device pixels, so every scene pixel stays square. Scrolling switches the scene between stages (title, day job, game dev, quant) with a dithered wipe, and each stage's monitor content advances with the scroll position.

## Stack

- Vite + TypeScript, no framework
- Canvas 2D for the scene, palette: [ENDESGA 32](https://lospec.com/palette-list/endesga-32)
- [Galmuri](https://github.com/quiple/galmuri) pixel fonts (OFL), split into Latin and Hangul subsets

## Local development

```bash
npm install
npm run dev
```

- `npm run build` typechecks and builds into `dist/`
- `npm run preview` serves the production build locally

Pushing to `main` deploys through `.github/workflows/github_page_deploy.yml`.

## Editing content

| What | Where |
| --- | --- |
| English copy | `src/content/en.ts` |
| Korean copy | `src/content/ko.ts` |
| Links, repos, record times | `src/content/profile.ts` |
| Scene art and stage props | `src/scene/art.ts`, `src/scene/stages.ts` |
| Room, desk, character | `src/scene/room.ts` |

Arrays in `en.ts` / `ko.ts` (stages, records, inventory, contacts) line up by index with the facts in `profile.ts`.

## Regenerating assets

Both scripts need Python with `fonttools`, `brotli` and `pillow`:

```bash
pip install fonttools brotli pillow
python scripts/subset-fonts.py   # src/assets/fonts/*.woff2 from node_modules/galmuri
python scripts/make-og.py        # public/og.png social preview
```

The old blog lives on the `main-temp` branch.
