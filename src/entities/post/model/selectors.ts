import type {
  PostManifestEntry,
  SeriesSummary,
  TagSummary,
} from "@/entities/post/model/types";
import { postsManifest } from "@/shared/generated/posts-manifest";
import { toKebabCase } from "@/shared/lib/text/toKebabCase";

function compareSeriesPosts(left: PostManifestEntry, right: PostManifestEntry) {
  const leftOrder = left.seriesOrder ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.seriesOrder ?? Number.POSITIVE_INFINITY;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return right.publishedAt.localeCompare(left.publishedAt);
}

export function getAllPosts() {
  return postsManifest;
}

export function getLatestPosts(limit?: number) {
  return typeof limit === "number" ? postsManifest.slice(0, limit) : postsManifest;
}

export function getPostBySlug(slug: string) {
  return postsManifest.find((post) => post.slug === slug) ?? null;
}

export function getPostsByTag(tagSlug: string) {
  return postsManifest.filter((post) =>
    post.tags.some((tag) => toKebabCase(tag) === tagSlug),
  );
}

export function getPostsBySeries(seriesSlug: string) {
  return postsManifest
    .filter(
      (post) => post.series && toKebabCase(post.series) === seriesSlug,
    )
    .sort(compareSeriesPosts);
}

export function getRelatedPosts(
  currentPost: PostManifestEntry,
  limit = 3,
) {
  return postsManifest
    .filter(
      (post) =>
        post.slug !== currentPost.slug &&
        post.tags.some((tag) => currentPost.tags.includes(tag)),
    )
    .slice(0, limit);
}

export function getTagSummaries(): TagSummary[] {
  const tagsMap = new Map<string, TagSummary>();

  for (const post of postsManifest) {
    for (const tag of post.tags) {
      const slug = toKebabCase(tag);
      const existing = tagsMap.get(slug);

      if (existing) {
        existing.count += 1;
        continue;
      }

      tagsMap.set(slug, {
        count: 1,
        label: tag,
        slug,
      });
    }
  }

  return [...tagsMap.values()].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.label.localeCompare(right.label);
  });
}

export function getTagSummary(tagSlug: string) {
  return getTagSummaries().find((tag) => tag.slug === tagSlug) ?? null;
}

export function getSeriesSummaries(): SeriesSummary[] {
  const seriesMap = new Map<string, SeriesSummary>();

  for (const post of postsManifest) {
    if (!post.series) {
      continue;
    }

    const slug = toKebabCase(post.series);
    const existing = seriesMap.get(slug);

    if (existing) {
      existing.count += 1;
      continue;
    }

    seriesMap.set(slug, {
      count: 1,
      label: post.series,
      slug,
    });
  }

  return [...seriesMap.values()].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.label.localeCompare(right.label);
  });
}
