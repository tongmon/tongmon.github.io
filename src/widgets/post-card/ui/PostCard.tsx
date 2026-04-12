import {
  Box,
  Card,
  Flex,
  Group,
  Image,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { PostMeta, PostTagList, type PostManifestEntry } from "@/entities/post";
import { siteConfig } from "@/shared/config/site";
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
  const mediaHeight = isCompact ? 220 : { base: 220, md: 300 };
  const mediaWidth = isCompact ? { base: "100%", md: 220 } : "100%";

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
      <Flex
        direction={isCompact ? { base: "column", md: "row" } : "column"}
        align="center"
      >
        <Box
          component={Link}
          display="block"
          h={mediaHeight}
          miw={isCompact ? { md: 220 } : undefined}
          style={{
            alignSelf: "stretch",
            overflow: "hidden",
            textDecoration: "none",
          }}
          to={postPath}
          w={mediaWidth}
          mr="xs"
        >
          {thumbnail ? (
            <Image
              alt={post.title}
              fit="cover"
              h="100%"
              radius={isCompact ? "xl" : undefined}
              src={thumbnail}
              w="100%"
            />
          ) : (
            <Card radius={isCompact ? "xl" : 0} p="0" h="100%">
              <Stack
                gap="xl"
                h="100%"
                justify="space-between"
                p={isCompact ? "md" : "lg"}
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(84, 188, 146, 0.42), transparent 30%), linear-gradient(155deg, rgba(84, 188, 146, 0.22), rgba(31, 106, 80, 0.08)), var(--app-surface-0)",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
                    {post.series ?? "Short"}
                  </Text>
                  <Text c="var(--app-muted)" size="xs">
                    No Thumbnail
                  </Text>
                </Group>
                <Title ta="center" fw={700} order={1}>
                  {post.title}
                </Title>
                <Space />
              </Stack>
            </Card>
          )}
        </Box>

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
