import type {
  PostManifestEntry,
  SeriesSummary,
  TagSummary,
} from "@/entities/post/model/types";
import { postsManifest } from "@/shared/generated/posts-manifest";
import { toKebabCase } from "@/shared/lib/text/toKebabCase";

function getPostActivityAt(post: PostManifestEntry) {
  return post.updatedAt ?? post.publishedAt;
}

function compareSeriesPosts(left: PostManifestEntry, right: PostManifestEntry) {
  const leftOrder = left.seriesOrder ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.seriesOrder ?? Number.POSITIVE_INFINITY;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return right.publishedAt.localeCompare(left.publishedAt);
}

function getSeriesGroups() {
  const seriesMap = new Map<
    string,
    { label: string; posts: PostManifestEntry[] }
  >();

  for (const post of postsManifest) {
    if (!post.series) {
      continue;
    }

    const slug = toKebabCase(post.series);
    const existing = seriesMap.get(slug);

    if (existing) {
      existing.posts.push(post);
      continue;
    }

    seriesMap.set(slug, {
      label: post.series,
      posts: [post],
    });
  }

  return [...seriesMap.entries()]
    .map(([slug, group]) => {
      const posts = [...group.posts].sort(compareSeriesPosts);
      const latestUpdatedAt = posts.reduce((latest, post) => {
        const postActivityAt = getPostActivityAt(post);

        return postActivityAt.localeCompare(latest) > 0
          ? postActivityAt
          : latest;
      }, getPostActivityAt(posts[0]));

      return {
        posts,
        summary: {
          count: posts.length,
          label: group.label,
          latestUpdatedAt,
          slug,
          thumbnail: posts[0].thumbnail,
        } satisfies SeriesSummary,
      };
    })
    .sort((left, right) => {
      const activityComparison = right.summary.latestUpdatedAt.localeCompare(
        left.summary.latestUpdatedAt,
      );

      if (activityComparison !== 0) {
        return activityComparison;
      }

      return left.summary.label.localeCompare(right.summary.label);
    });
}

export function getAllPosts() {
  return postsManifest;
}

export function getLatestPosts(limit?: number) {
  return typeof limit === "number"
    ? postsManifest.slice(0, limit)
    : postsManifest;
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
  return (
    getSeriesGroups().find((group) => group.summary.slug === seriesSlug)
      ?.posts ?? []
  );
}

function getRelatedSeriesPosts(
  currentPost: PostManifestEntry,
  limit: number,
) {
  if (!currentPost.series || limit <= 0) {
    return [];
  }

  const seriesPosts = getPostsBySeries(toKebabCase(currentPost.series));
  const currentIndex = seriesPosts.findIndex(
    (post) => post.slug === currentPost.slug,
  );

  if (currentIndex < 0) {
    return [];
  }

  const relatedPosts: PostManifestEntry[] = [];

  for (
    let offset = 1;
    relatedPosts.length < limit &&
    (currentIndex - offset >= 0 || currentIndex + offset < seriesPosts.length);
    offset += 1
  ) {
    const previousPost = seriesPosts[currentIndex - offset];

    if (previousPost) {
      relatedPosts.push(previousPost);
    }

    if (relatedPosts.length >= limit) {
      break;
    }

    const nextPost = seriesPosts[currentIndex + offset];

    if (nextPost) {
      relatedPosts.push(nextPost);
    }
  }

  return relatedPosts;
}

export function getRelatedPosts(currentPost: PostManifestEntry, limit = 2) {
  const relatedSeriesPosts = getRelatedSeriesPosts(currentPost, limit);
  const excludedSlugs = new Set([
    currentPost.slug,
    ...relatedSeriesPosts.map((post) => post.slug),
  ]);
  const remainingSlots = limit - relatedSeriesPosts.length;

  if (remainingSlots <= 0) {
    return relatedSeriesPosts;
  }

  const relatedTagPosts = postsManifest
    .filter(
      (post) =>
        !excludedSlugs.has(post.slug) &&
        post.tags.some((tag) => currentPost.tags.includes(tag)),
    )
    .slice(0, remainingSlots);

  return [...relatedSeriesPosts, ...relatedTagPosts];
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
  return getSeriesGroups().map((group) => group.summary);
}

export function getSeriesSummary(seriesSlug: string) {
  return (
    getSeriesGroups().find((group) => group.summary.slug === seriesSlug)
      ?.summary ?? null
  );
}
