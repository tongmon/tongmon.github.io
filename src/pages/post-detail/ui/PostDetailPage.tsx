import {
  Alert,
  Grid,
  Group,
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
  getSeriesPostNavigation,
  loadPostContent,
  type LoadedPost,
} from "@/entities/post";
import { getPostsPath } from "@/shared/lib/routes";
import { EmptyState, Revealer } from "@/shared/ui";
import { GiscusComments } from "@/widgets/giscus-comments";
import { MarkdownViewer } from "@/widgets/markdown-viewer";
import { PostCard } from "@/widgets/post-card";
import { SeriesPostNavigation } from "@/widgets/series-post-navigation";
import { PostTableOfContents } from "@/widgets/post-table-of-contents";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

export default function PostDetailPage() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : null;
  const [commentCount, setCommentCount] = useState(0);
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
      setCommentCount(0);
      setLoadedPost(null);
      setErrorMessage(null);
      return () => {
        active = false;
      };
    }

    setCommentCount(0);
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
  const seriesNavigation = getSeriesPostNavigation(post);
  // const coverImage = post.thumbnail ? toPublicAssetUrl(post.thumbnail) : null;

  return (
    <Stack gap={pageGap} py={{ base: "lg", md: "xl" }}>
      <Stack gap={sectionGap}>
        <Title order={1}>{post.title}</Title>
        <Text c="var(--app-muted)" maw={760} size={descriptionSize}>
          {post.description}
        </Text>
        <PostMeta
          commentCount={commentCount}
          publishedAt={post.publishedAt}
          readingTime={post.readingTime}
          updatedAt={post.updatedAt}
        />
        <PostTagList tags={post.tags} />
      </Stack>

      {
        // coverImage ? (
        // <Paper
        //   bg="var(--app-surface-1)"
        //   p={{ base: "xs", md: "sm" }}
        //   mt={isMobileViewport ? "lg" : undefined}
        //   // shadow="sm"
        //   // style={{ border: "1px solid var(--app-muted-border)" }}
        // >
        //   <Image alt={post.title} radius="lg" src={coverImage} />
        // </Paper>
        // ) : null
      }

      {errorMessage ? (
        <Alert color="red" icon={<IconAlertCircle size={16} />} radius="xl">
          {errorMessage}
        </Alert>
      ) : null}

      {loadedPost ? (
        <Grid align="start" gap={contentGap}>
          <Grid.Col order={{ base: 2, lg: 1 }} span={{ base: 12, lg: 8 }}>
            <Paper
              bg="transparent"
              // bg="var(--app-surface-1)"
              py={{ base: "xs", md: "lg" }}
              radius={0}
              style={{
                borderTop: "2px dashed var(--app-muted-border)",
                borderBottom: "2px dashed var(--app-muted-border)",
              }}
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
            <Revealer from="bottom" h="100%" viewportMargin="0px">
              <PostTableOfContents headings={loadedPost.headings} />
            </Revealer>
          </Grid.Col>
        </Grid>
      ) : (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      )}

      {seriesNavigation ? (
        <SeriesPostNavigation navigation={seriesNavigation} />
      ) : null}

      <GiscusComments
        onCommentCountChange={setCommentCount}
        pageKey={post.slug}
      />

      {relatedPosts.length > 0 ? (
        <Stack gap={relatedGap}>
          <Title order={2}>Related posts</Title>
          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing={relatedSpacing}>
            {relatedPosts.map((relatedPost) => (
              <Revealer key={relatedPost.slug}>
                <PostCard
                  post={relatedPost}
                  // variant="compact"
                />
              </Revealer>
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
