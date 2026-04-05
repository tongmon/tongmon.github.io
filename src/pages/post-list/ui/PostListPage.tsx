import { SimpleGrid, Stack, Text } from "@mantine/core";
import { getAllPosts, getTagSummaries } from "@/entities/post";
import { PostFilters, usePostFiltersStore } from "@/features/post-filters";
import { toKebabCase } from "@/shared/lib/text/toKebabCase";
import { EmptyState, PageIntro } from "@/shared/ui";
import { PostCard } from "@/widgets/post-card";

export default function PostListPage() {
  const posts = getAllPosts();
  const tags = getTagSummaries();
  const { searchQuery, selectedTag, viewMode } = usePostFiltersStore();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        post.title,
        post.description,
        post.category,
        post.series,
        ...post.tags,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));

    const matchesTag =
      selectedTag === null ||
      post.tags.some((tag) => toKebabCase(tag) === selectedTag);

    return matchesQuery && matchesTag;
  });

  return (
    <Stack gap="xl" py="xl">
      <PageIntro
        description="Search by topic, narrow by tag, and keep your preferred post list view in local storage with a small Zustand store."
        eyebrow="Archive"
        title="All posts"
      />

      <PostFilters availableTags={tags} />

      <Text c="var(--app-muted)" size="sm">
        {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"} found.
      </Text>

      {filteredPosts.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xl: viewMode === "grid" ? 2 : 1 }}>
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} variant={viewMode} />
          ))}
        </SimpleGrid>
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
