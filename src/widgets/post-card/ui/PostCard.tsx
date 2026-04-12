import { Card, Flex, Group, Image, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { PostMeta, PostTagList, type PostManifestEntry } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { getPostPath } from "@/shared/lib/routes";

interface PostCardProps {
  post: PostManifestEntry;
  variant?: "grid" | "compact";
  gridThumbnailHeight?: number;
}

export default function PostCard({ post, variant = "grid" }: PostCardProps) {
  const thumbnail = post.thumbnail ? toPublicAssetUrl(post.thumbnail) : null;
  const isCompact = variant === "compact";
  const postPath = getPostPath(post.slug);

  return (
    <Card
      bg="var(--app-surface-1)"
      p={isCompact ? "xs" : 0}
      shadow="sm"
      style={{
        border: "1px solid var(--app-muted-border)",
        overflow: "hidden",
      }}
    >
      <Flex direction={isCompact ? { base: "column", md: "row" } : "column"}>
        {thumbnail ? (
          <Link style={{ display: "block", lineHeight: 0 }} to={postPath}>
            <Image
              alt={post.title}
              h={isCompact ? { base: 220, md: "100%" } : { base: 220, md: 300 }}
              maw={isCompact ? { md: 220 } : undefined}
              radius={isCompact ? "xl" : undefined}
              src={thumbnail}
            />
          </Link>
        ) : null}

        <Stack gap="md" p={isCompact ? "xs" : "lg"} style={{ flex: 1 }}>
          <Stack gap={8}>
            {post.category ? (
              <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
                {post.category}
              </Text>
            ) : null}
            <Title
              order={isCompact ? 4 : 3}
              renderRoot={(props) => <Link {...props} to={postPath} />}
            >
              {post.title}
            </Title>
            <Text
              c="var(--app-muted)"
              component={Link}
              size="sm"
              style={{ textDecoration: "none" }}
              to={postPath}
            >
              {post.description}
            </Text>
          </Stack>

          <PostMeta
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            updatedAt={post.updatedAt}
          />

          <Group>
            <PostTagList tags={post.tags} />
          </Group>
        </Stack>
      </Flex>
    </Card>
  );
}
