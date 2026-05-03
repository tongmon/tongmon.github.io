import { Group, Pagination, SimpleGrid, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPostsByTag, getTagSummary } from "@/entities/post";
import {
  buildPageSearchParams,
  paginateItems,
  parsePageParam,
} from "@/shared/lib/pagination";
import { getPostsPath } from "@/shared/lib/routes";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";
import { EmptyState, getRevealDelay, PageIntro, Revealer } from "@/shared/ui";
import { PostCard } from "@/widgets/post-card";

export default function TagPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tag } = useParams();
  const isMobileViewport = useIsMobileViewport();
  const revealColumns = isMobileViewport ? 1 : 2;
  const tagSlug = tag ?? "";
  const tagSummary = getTagSummary(tagSlug);
  const posts = getPostsByTag(tagSlug);
  const requestedPage = parsePageParam(searchParams.get("page"));
  const {
    currentPage,
    pageItems: visiblePosts,
    totalPages,
  } = paginateItems(posts, requestedPage);

  useEffect(() => {
    const normalizedSearchParams = buildPageSearchParams(
      searchParams,
      currentPage,
    );

    if (normalizedSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(normalizedSearchParams, { replace: true });
    }
  }, [currentPage, searchParams, setSearchParams]);

  if (!tagSummary) {
    return (
      <Stack py="xl">
        <EmptyState
          actionHref={getPostsPath()}
          actionLabel="Browse all posts"
          description="The requested tag does not exist in the generated post manifest."
          title="Unknown tag"
        />
      </Stack>
    );
  }

  return (
    <Stack gap="xl" py="xl">
      <PageIntro
        description={`${tagSummary.count} post${tagSummary.count === 1 ? "" : "s"} filed under this topic.`}
        eyebrow="Tag archive"
        title={`#${tagSummary.label}`}
      />

      <Stack gap="lg">
        <SimpleGrid
          cols={{ base: 1, md: 2 /*, xl: 2*/ }}
          spacing={{ base: "md", md: "xl" }}
        >
          {visiblePosts.map((post, index) => (
            <Revealer
              delay={getRevealDelay(index, revealColumns)}
              key={post.slug}
            >
              <PostCard post={post} />
            </Revealer>
          ))}
        </SimpleGrid>

        {totalPages > 1 ? (
          <Group justify="center">
            <Pagination
              onChange={(page) =>
                setSearchParams(buildPageSearchParams(searchParams, page))
              }
              total={totalPages}
              value={currentPage}
            />
          </Group>
        ) : null}
      </Stack>
    </Stack>
  );
}
