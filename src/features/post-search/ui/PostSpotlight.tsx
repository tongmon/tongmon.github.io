import { useDeferredValue, useState } from "react";
import {
  Badge,
  Box,
  Divider,
  Group,
  Image,
  OverflowList,
  Stack,
  Text,
} from "@mantine/core";
import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getAllPosts, type PostManifestEntry } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { getPostPath } from "@/shared/lib/routes";

const SPOTLIGHT_LIMIT = 5;

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
        // border: "1px solid var(--app-muted-border)",
        display: "flex",
        flexShrink: 0,
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
      w="100%"
      h={{ base: 150, md: 250 }}
    >
      {thumbnail ? (
        <Image
          alt={title}
          h="100%"
          w="100%"
          fit="cover"
          src={toPublicAssetUrl(thumbnail)}
        />
      ) : (
        <Group
          c="var(--app-muted)"
          h="100%"
          justify="center"
          w="100%"
          bd="1px solid var(--app-muted-border)"
        >
          <IconSearch size={18} />
        </Group>
      )}
    </Box>
  );
}

function PostSpotlightActionContent({
  post,
  query,
  isLast,
}: {
  post: PostManifestEntry;
  query: string;
  isLast: boolean;
}) {
  return (
    <Stack w="100%" gap="xs">
      <PostSpotlightActionPreview
        thumbnail={post.thumbnail}
        title={post.title}
      />
      <Text
        fw={700}
        size="lg"
        style={{
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          display: "-webkit-box",
          lineHeight: 1.35,
          overflow: "hidden",
        }}
        px="xs"
      >
        {post.title}
      </Text>
      <Text px="xs" size="sm">
        {post.description}
      </Text>
      <OverflowList
        data={post.tags}
        gap="xs"
        renderOverflow={(items) => <Badge>+{items.length} more</Badge>}
        renderItem={(item, index) => <Badge key={index}>{item}</Badge>}
        w="100%"
        px="xs"
      />
      {!isLast && <Divider my="xs" variant="dashed" size="sm" />}
    </Stack>
  );
}

export default function PostSpotlight() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  const actions: SpotlightActionData[] = getAllPosts().map(
    (post, ind, arr) => ({
      children: (
        <PostSpotlightActionContent
          post={post}
          query={deferredQuery}
          isLast={ind >= SPOTLIGHT_LIMIT - 1 || arr.length - 1 === ind}
        />
      ),
      id: post.slug,
      keywords: [post.category, post.series, ...post.tags, post.slug].filter(
        (item): item is string => Boolean(item),
      ),
      label: post.title,
      description: post.tags.join(" / "),
      onClick: () => navigate(getPostPath(post.slug)),
    }),
  );

  return (
    <Spotlight
      actions={actions}
      limit={SPOTLIGHT_LIMIT}
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
