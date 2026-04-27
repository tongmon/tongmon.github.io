# Tongmon Notes

Static personal blog built with React, TypeScript, Vite, Mantine UI, Zustand, and a practical Feature-Sliced Design structure. Posts are authored as Markdown folders and deployed to GitHub Pages with GitHub Actions.

## Stack

- React 19
- TypeScript
- Vite
- Mantine UI
- Zustand
- React Router
- `react-markdown` with GFM support
- Build-time post manifest generation

## Local development

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run content:generate` regenerates the typed manifest and copies post assets to `public/content/posts`
- `npm run build` regenerates content, typechecks, builds the app, and creates `dist/404.html` for GitHub Pages SPA routing
- `npm run preview` previews the production build locally

## Writing a post

Each post owns one folder somewhere under `content/posts`:

```text
content/posts/my-post/
  index.md
  cover.png
  images/

content/posts/react-blog-making/building-a-static-blog/
  index.md
  cover.png
  images/
```

Frontmatter schema:

```yaml
title: string
description: string
publishedAt: string
updatedAt: string?
tags: string[]
thumbnail: string?
draft: boolean?
series: string?
seriesOrder: number?
```

Notes:

- The canonical authoring source is `content/posts`, not `public/content/posts`.
- `index.md` is required for every post.
- `thumbnail` should be relative to the post folder, for example `./cover.png`.
- `slug` is optional. If omitted, the post folder name becomes the flat URL slug.
- `slug` must stay unique across all posts. The content generator fails fast on duplicates.
- Draft posts are excluded from the generated manifest by default.

## Content pipeline

`scripts/generate-post-manifest.ts` does the following:

1. Scans `content/posts/**/index.md`
2. Parses and validates frontmatter
3. Resolves a flat slug from `frontmatter.slug` or the post folder name
4. Fails the build when two posts resolve to the same slug
5. Copies each post folder into `public/content/posts/<slug>`
6. Estimates reading time
7. Sorts posts by `publishedAt` descending
8. Writes `src/shared/generated/posts-manifest.ts`

The app loads markdown content from the copied public paths and uses the generated manifest for archive, tags, and post metadata.

## Project structure

```text
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
content/
  posts/
scripts/
```

Highlights:

- `entities/post` contains post types, selectors, metadata UI, and content loading
- `shared/lib/markdown` contains markdown-specific helpers
- `features/post-filters` contains the small persisted Zustand store
- `widgets/markdown-viewer` renders GitHub-flavored Markdown with headings, tables, task lists, anchors, images, and syntax-highlighted fenced code blocks

## Deployment

GitHub Pages deployment is configured in `.github/workflows/github_page_deploy.yml`.

What to configure manually:

1. In the GitHub repository settings, set Pages to use `GitHub Actions`.
2. Push to `main`.

The Vite `base` path is resolved automatically:

- user/org pages like `username.github.io` build with `/`
- project pages build with `/<repo-name>/`

`dist/404.html` is generated from `dist/index.html` so browser-router deep links keep working on GitHub Pages.
