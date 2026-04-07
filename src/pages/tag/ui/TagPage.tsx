import { SimpleGrid, Stack } from "@mantine/core";
import { useParams } from "react-router-dom";
import { getPostsByTag, getTagSummary } from "@/entities/post";
import { getPostsPath } from "@/shared/lib/routes";
import { EmptyState, PageIntro } from "@/shared/ui";
import { PostCard } from "@/widgets/post-card";

export default function TagPage() {
  const { tag } = useParams();
  const tagSlug = tag ?? "";
  const tagSummary = getTagSummary(tagSlug);
  const posts = getPostsByTag(tagSlug);

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

      <SimpleGrid cols={{ base: 1 /*, xl: 2*/ }} spacing="xl">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
