import { useDeferredValue, useState, Fragment } from "react";
import {
  Badge,
  Box,
  Divider,
  Image,
  OverflowList,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { IconPhotoOff, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getAllPosts, type PostManifestEntry } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { getPostPath } from "@/shared/lib/routes";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

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
      h={{ base: 150, md: 260 }}
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
        <Paper
          h="100%"
          w="100%"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          bg="transparent"
          bd="1px solid var(--app-muted-border)"
        >
          <IconPhotoOff size={80} color="var(--app-muted)" />
        </Paper>
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
    </Stack>
  );
}

export default function PostSpotlight() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const isMobileViewport = useIsMobileViewport();

  const actions: SpotlightActionData[] = getAllPosts().map((post, ind) => ({
    children: (
      <Stack gap="xs">
        {ind !== 0 && (
          <Divider
            mb="calc(var(--mantine-spacing-xs) / 2)"
            variant="dashed"
            size="sm"
          />
        )}
        <PostSpotlightActionContent post={post} query={deferredQuery} />
      </Stack>
    ),
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
      size={isMobileViewport ? "xl" : "lg"}
    />
  );
}
