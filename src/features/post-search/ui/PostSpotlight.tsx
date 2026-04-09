import { useDeferredValue, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  Group,
  Highlight,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getAllPosts, type PostManifestEntry } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { getPostPath } from "@/shared/lib/routes";

function PostSpotlightActionPreview({
  thumbnail,
  title,
}: {
  thumbnail?: string;
  title: string;
}) {
  return (
    <Box
      miw={88}
      style={{
        alignSelf: "stretch",
        border: "1px solid var(--app-muted-border)",
        display: "flex",
        flexShrink: 0,
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
      w={88}
    >
      {thumbnail ? (
        <Image
          alt={title}
          h="100%"
          fit="cover"
          src={toPublicAssetUrl(thumbnail)}
          w="100%"
        />
      ) : (
        <Group c="var(--app-muted)" h="100%" justify="center" w="100%">
          <IconSearch size={18} />
        </Group>
      )}
    </Box>
  );
}

function PostSpotlightActionContent({
  post,
  query,
}: {
  post: PostManifestEntry;
  query: string;
}) {
  const visibleTags = post.tags.slice(0, 3);
  const hiddenTagCount = post.tags.length - visibleTags.length;

  return (
    <Flex align="stretch" gap="md" wrap="nowrap">
      <PostSpotlightActionPreview
        thumbnail={post.thumbnail}
        title={post.title}
      />

      <Stack gap={6} miw={0} style={{ flex: 1 }}>
        {post.category ? (
          <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
            {post.category}
          </Text>
        ) : null}

        <Text
          fw={700}
          size="sm"
          style={{
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            display: "-webkit-box",
            lineHeight: 1.35,
            overflow: "hidden",
          }}
        >
          <Highlight component="span" highlight={query ? [query] : []}>
            {post.title}
          </Highlight>
        </Text>

        {visibleTags.length > 0 || hiddenTagCount > 0 ? (
          <Group c="var(--app-muted)" gap={8} wrap="wrap">
            {visibleTags.map((tag) => (
              <Badge key={tag} size="xs" variant="light">
                {tag}
              </Badge>
            ))}

            {hiddenTagCount > 0 ? (
              <Badge size="xs" variant="light">
                +{hiddenTagCount}
              </Badge>
            ) : null}
          </Group>
        ) : null}
      </Stack>
    </Flex>
  );
}

export default function PostSpotlight() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  const actions: SpotlightActionData[] = getAllPosts().map((post) => ({
    children: <PostSpotlightActionContent post={post} query={deferredQuery} />,
    id: post.slug,
    keywords: [post.category, post.series, ...post.tags, post.slug].filter(
      (item): item is string => Boolean(item),
    ),
    label: post.title,
    description: post.tags.join(" / "),
    onClick: () => navigate(getPostPath(post.slug)),
  }));

  return (
    <Spotlight
      actions={actions}
      limit={5}
      maxHeight={420}
      nothingFound="No posts found"
      onQueryChange={setQuery}
      query={query}
      removeScrollProps={{ removeScrollBar: false }}
      searchProps={{
        leftSection: <IconSearch size={18} />,
        placeholder: "Search posts, tags, or topics",
        size: "md",
      }}
      shortcut="mod + K"
      size="xl"
    />
  );
}
