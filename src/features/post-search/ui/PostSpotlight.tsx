import { Box, Group, Image } from "@mantine/core";
import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { IconCalendar, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { formatDate } from "@/shared/lib/date/formatDate";
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
      h={56}
      miw={72}
      style={{
        border: "1px solid var(--app-muted-border)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
      w={72}
    >
      {thumbnail ? (
        <Image
          alt={title}
          h="100%"
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

export default function PostSpotlight() {
  const navigate = useNavigate();
  const actions: SpotlightActionData[] = getAllPosts().map((post) => ({
    id: post.slug,
    keywords: [post.category, post.series, ...post.tags, post.slug].filter(
      (item): item is string => Boolean(item),
    ),
    leftSection: (
      <PostSpotlightActionPreview
        thumbnail={post.thumbnail}
        title={post.title}
      />
    ),
    label: post.title,
    description: [formatDate(post.publishedAt), post.description]
      .filter(Boolean)
      .join(" · "),
    onClick: () => navigate(getPostPath(post.slug)),
  }));

  return (
    <Spotlight
      actions={actions}
      highlightQuery
      limit={5}
      maxHeight={420}
      nothingFound="No posts found"
      removeScrollProps={{ removeScrollBar: false }}
      searchProps={{
        leftSection: <IconSearch size={18} />,
        placeholder: "Search posts, tags, or topics",
        size: "md",
      }}
      shortcut="mod + K"
    />
  );
}
