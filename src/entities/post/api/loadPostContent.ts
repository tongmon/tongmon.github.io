import type { LoadedPost, PostManifestEntry } from "@/entities/post/model/types";
import { extractMarkdownHeadings } from "@/shared/lib/markdown/extractMarkdownHeadings";
import { stripMarkdownFrontmatter } from "@/shared/lib/markdown/stripMarkdownFrontmatter";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";

const postContentCache = new Map<string, Promise<LoadedPost>>();

export function loadPostContent(post: PostManifestEntry) {
  const cachedPost = postContentCache.get(post.slug);

  if (cachedPost) {
    return cachedPost;
  }

  const nextPost = fetch(toPublicAssetUrl(post.contentPath)).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Unable to load markdown for "${post.slug}"`);
    }

    const rawContent = await response.text();
    const content = stripMarkdownFrontmatter(rawContent);

    return {
      ...post,
      content,
      headings: extractMarkdownHeadings(content),
    };
  });

  postContentCache.set(post.slug, nextPost);

  return nextPost;
}
