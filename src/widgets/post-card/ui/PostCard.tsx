import { Card, Flex, Group, Image, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { PostMeta, PostTagList, type PostManifestEntry } from "@/entities/post";
import { siteConfig } from "@/shared/config/site";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { getPostPath } from "@/shared/lib/routes";
import { FallbackCover } from "@/shared/ui";

interface PostCardProps {
  post: PostManifestEntry;
  variant?: "grid" | "compact";
}

export default function PostCard({ post, variant = "grid" }: PostCardProps) {
  const thumbnail = post.thumbnail ? toPublicAssetUrl(post.thumbnail) : null;
  const isCompact = variant === "compact";
  const postPath = getPostPath(post.slug);
  const mediaHeight = isCompact ? "100%" : { base: 220, md: 250 };
  const mediaWidth = isCompact ? /* { base: "100%", md: 280 }*/ 280 : "100%";
  const fallbackEyebrow = post.series ?? "Short";
  const fallbackMeta =
    post.tags.slice(0, 2).join(" / ") || `${post.readingTime} min read`;

  return (
    <Card
      bg="var(--app-surface-1)"
      p={isCompact ? "xs" : 0}
      h={isCompact ? /* { base: 260, lg: 220 } */ 220 : 450}
      shadow="sm"
      style={{
        border: "1px solid var(--app-muted-border)",
        overflow: "hidden",
      }}
    >
      <Flex
        direction={isCompact ? { base: "column", md: "row" } : "column"}
        align="center"
        h="100%"
      >
        <Group
          h={mediaHeight}
          w={mediaWidth}
          pr={isCompact ? "xs" : undefined}
          renderRoot={(props) => <Link {...props} to={postPath} />}
        >
          {thumbnail ? (
            <Image
              alt={post.title}
              fit="cover"
              h="100%"
              w="100%"
              radius={isCompact ? "xl" : undefined}
              src={thumbnail}
            />
          ) : (
            <FallbackCover
              aside={`${post.readingTime} min`}
              compact={isCompact}
              eyebrow={fallbackEyebrow}
              meta={fallbackMeta}
              radius={isCompact ? "xl" : undefined}
              title={siteConfig.title}
            />
          )}
        </Group>
        <Stack
          gap="md"
          p={isCompact ? "xs" : "lg"}
          style={{ flex: 1 }}
          // h={isCompact ? "100%" : undefined}
          h="100%"
          w={isCompact ? undefined : "100%"}
          //bd="1px solid"
        >
          <Stack gap={8}>
            <Title
              order={3}
              renderRoot={(props) => <Link {...props} to={postPath} />}
            >
              {post.title}
            </Title>
            <Text
              c="var(--app-muted)"
              component={Link}
              size={isCompact ? "md" : "sm"}
              style={{
                textDecoration: "none",
              }}
              // truncate="end"
              // w="100%"
              //bd="1px solid"
              to={postPath}
            >
              {post.description}
            </Text>
          </Stack>

          <PostMeta
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            updatedAt={post.updatedAt}
            mt="auto"
          />

          <Group>
            <PostTagList tags={post.tags} />
          </Group>
        </Stack>
      </Flex>
    </Card>
  );
}
