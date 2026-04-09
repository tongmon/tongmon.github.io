import {
  Alert,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PostMeta,
  PostTagList,
  getPostBySlug,
  getRelatedPosts,
  loadPostContent,
  type LoadedPost,
} from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { getPostsPath } from "@/shared/lib/routes";
import { EmptyState } from "@/shared/ui";
import { MarkdownViewer } from "@/widgets/markdown-viewer";
import { PostCard } from "@/widgets/post-card";
import { PostTableOfContents } from "@/widgets/post-table-of-contents";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

export default function PostDetailPage() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : null;
  const [loadedPost, setLoadedPost] = useState<LoadedPost | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMobileViewport = useIsMobileViewport();
  const pageGap = isMobileViewport ? "md" : "xl";
  const sectionGap = isMobileViewport ? "sm" : "md";
  const contentGap = isMobileViewport ? "md" : "xl";
  const relatedGap = isMobileViewport ? "md" : "lg";
  const relatedSpacing = isMobileViewport ? "md" : "xl";
  const descriptionSize = isMobileViewport ? "md" : "lg";

  useEffect(() => {
    let active = true;

    if (!post) {
      setLoadedPost(null);
      setErrorMessage(null);
      return () => {
        active = false;
      };
    }

    setLoadedPost(null);
    setErrorMessage(null);

    loadPostContent(post)
      .then((content) => {
        if (active) {
          setLoadedPost(content);
        }
      })
      .catch(() => {
        if (active) {
          setErrorMessage("The markdown file could not be loaded.");
        }
      });

    return () => {
      active = false;
    };
  }, [post]);

  if (!post) {
    return (
      <Stack py="xl">
        <EmptyState
          actionHref={getPostsPath()}
          actionLabel="Back to posts"
          description="The requested post slug is not present in the generated manifest."
          title="Post not found"
        />
      </Stack>
    );
  }

  const relatedPosts = getRelatedPosts(post, isMobileViewport ? 2 : 4);
  const coverImage = post.thumbnail ? toPublicAssetUrl(post.thumbnail) : null;

  return (
    <Stack gap={pageGap} py={{ base: "lg", md: "xl" }}>
      <Stack gap={sectionGap}>
        {post.category ? (
          <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
            {post.category}
          </Text>
        ) : null}
        <Title order={1}>{post.title}</Title>
        <Text c="var(--app-muted)" maw={760} size={descriptionSize}>
          {post.description}
        </Text>
        <PostMeta
          publishedAt={post.publishedAt}
          readingTime={post.readingTime}
          updatedAt={post.updatedAt}
        />
        <PostTagList tags={post.tags} />
      </Stack>

      {coverImage ? (
        <Paper
          bg="var(--app-surface-1)"
          p={{ base: "xs", md: "sm" }}
          mt={isMobileViewport ? "lg" : undefined}
          shadow="sm"
          style={{ border: "1px solid var(--app-muted-border)" }}
        >
          <Image alt={post.title} radius="lg" src={coverImage} />
        </Paper>
      ) : null}

      {errorMessage ? (
        <Alert color="red" icon={<IconAlertCircle size={16} />} radius="xl">
          {errorMessage}
        </Alert>
      ) : null}

      {loadedPost ? (
        <Grid align="start" gap={contentGap}>
          <Grid.Col order={{ base: 2, lg: 1 }} span={{ base: 12, lg: 8 }}>
            <Paper
              bg="var(--app-surface-1)"
              p={{ base: "md", md: "xl" }}
              shadow="sm"
              style={{ border: "1px solid var(--app-muted-border)" }}
            >
              <MarkdownViewer
                markdown={loadedPost.content}
                postSlug={loadedPost.slug}
              />
            </Paper>
          </Grid.Col>
          <Grid.Col
            order={{ base: 1, lg: 2 }}
            span={{ base: 12, lg: 4 }}
            style={{ alignSelf: "stretch" }}
          >
            <PostTableOfContents headings={loadedPost.headings} />
          </Grid.Col>
        </Grid>
      ) : (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      )}

      {relatedPosts.length > 0 ? (
        <Stack gap={relatedGap}>
          <Title order={2}>Related posts</Title>
          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing={relatedSpacing}>
            {relatedPosts.map((relatedPost) => (
              <PostCard
                key={relatedPost.slug}
                post={relatedPost}
                variant="compact"
              />
            ))}
          </SimpleGrid>
        </Stack>
      ) : null}

      <Group gap={4}>
        <Text c="var(--app-muted)" size="sm">
          Want the full archive?
        </Text>
        <Text
          c="var(--app-anchor)"
          component={Link}
          fw={700}
          size="sm"
          to={getPostsPath()}
        >
          Browse all posts.
        </Text>
      </Group>
    </Stack>
  );
}
