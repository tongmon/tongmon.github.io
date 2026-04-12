import { Group, Pagination, SimpleGrid, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllPosts } from "@/entities/post";
import { usePostFiltersStore } from "@/features/post-filters";
import {
  buildPageSearchParams,
  paginateItems,
  parsePageParam,
} from "@/shared/lib/pagination";
import { toKebabCase } from "@/shared/lib/text/toKebabCase";
import { EmptyState, PageIntro } from "@/shared/ui";
import { PostCard } from "@/widgets/post-card";

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const posts = getAllPosts();
  const { searchQuery, selectedTag, viewMode } = usePostFiltersStore();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [post.title, post.description, post.category, post.series, ...post.tags]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));

    const matchesTag =
      selectedTag === null ||
      post.tags.some((tag) => toKebabCase(tag) === selectedTag);

    return matchesQuery && matchesTag;
  });
  const requestedPage = parsePageParam(searchParams.get("page"));
  const {
    currentPage,
    pageItems: visiblePosts,
    totalPages,
  } = paginateItems(filteredPosts, requestedPage);

  useEffect(() => {
    const normalizedSearchParams = buildPageSearchParams(
      searchParams,
      currentPage,
    );

    if (normalizedSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(normalizedSearchParams, { replace: true });
    }
  }, [currentPage, searchParams, setSearchParams]);

  return (
    <Stack gap="xl" py="xl">
      <PageIntro
        description={`There are ${filteredPosts.length} post${filteredPosts.length === 1 ? "" : "s"} in total.`}
        eyebrow="Archive"
        title="All posts"
      />

      {filteredPosts.length > 0 ? (
        <Stack gap="lg">
          <SimpleGrid
            cols={{ base: 1, md: 2 /*, xl: viewMode === "grid" ? 2 : 1*/ }}
            spacing={{ base: "md", md: "xl" }}
          >
            {visiblePosts.map((post) => (
              <PostCard key={post.slug} post={post} variant={viewMode} />
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
      ) : (
        <EmptyState
          actionHref="/posts"
          actionLabel="Clear filters"
          description="Try broadening the search query or clearing the selected tag to see the full archive again."
          title="No posts match the current filters"
        />
      )}
    </Stack>
  );
}
