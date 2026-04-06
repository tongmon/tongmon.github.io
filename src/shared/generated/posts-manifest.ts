import type { PostManifestEntry } from "@/entities/post";

export const postsManifest: PostManifestEntry[] = [
  {
    "slug": "building-a-static-blog",
    "title": "Building a folder-owned static blog",
    "description": "A practical content workflow where each post owns its markdown, cover image, and supporting assets without dragging in a CMS.",
    "publishedAt": "2026-04-04T09:00:00+09:00",
    "updatedAt": "2026-04-05T10:15:00+09:00",
    "tags": [
      "React",
      "Mantine",
      "GitHub Pages"
    ],
    "category": "Engineering",
    "thumbnail": "content/posts/building-a-static-blog/cover.png",
    "draft": false,
    "series": "Build log",
    "seriesOrder": 1,
    "readingTime": 1,
    "contentPath": "content/posts/building-a-static-blog/index.md"
  },
  {
    "slug": "mantine-markdown-notes",
    "title": "Making markdown feel native in a Mantine blog",
    "description": "Rendering markdown well is less about adding every plugin in sight and more about choosing a restrained pipeline with good defaults.",
    "publishedAt": "2026-04-02T20:30:00+09:00",
    "tags": [
      "Markdown",
      "Zustand",
      "TypeScript"
    ],
    "category": "Frontend",
    "thumbnail": "content/posts/mantine-markdown-notes/cover.png",
    "draft": false,
    "series": "Build log",
    "seriesOrder": 2,
    "readingTime": 1,
    "contentPath": "content/posts/mantine-markdown-notes/index.md"
  },
  {
    "slug": "draft-routing-experiment",
    "title": "Draft routing experiment",
    "description": "A hidden draft used to verify that unpublished entries do not leak into the production manifest.",
    "publishedAt": "2026-04-01T08:00:00+09:00",
    "tags": [
      "Draft",
      "Routing"
    ],
    "category": "Lab",
    "thumbnail": "content/posts/draft-routing-experiment/cover.png",
    "draft": false,
    "series": "Build log",
    "seriesOrder": 1,
    "readingTime": 1,
    "contentPath": "content/posts/draft-routing-experiment/index.md"
  }
];
