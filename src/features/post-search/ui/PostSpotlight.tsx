import { Badge, Box, Group, Image, Stack, Text } from "@mantine/core";
import { Spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { IconCalendar, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { formatDate } from "@/shared/lib/date/formatDate";
import { getPostPath } from "@/shared/lib/routes";

function PostSpotlightActionContent({
  publishedAt,
  tags,
  thumbnail,
  title,
}: {
  publishedAt: string;
  tags: string[];
  thumbnail?: string;
  title: string;
}) {
  return (
    <Group align="flex-start" gap="md" wrap="nowrap">
      <Box
        h={78}
        miw={96}
        style={{
          border: "1px solid var(--app-muted-border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
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

      <Stack gap={8} style={{ flex: 1, minWidth: 0 }}>
        <Text fw={700} lineClamp={2}>
          {title}
        </Text>

        <Group gap={6}>
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} radius="xl" size="xs" variant="light">
              {tag}
            </Badge>
          ))}
        </Group>

        <Group c="var(--app-muted)" gap={6}>
          <IconCalendar size={14} />
          <Text size="sm">{formatDate(publishedAt)}</Text>
        </Group>
      </Stack>
    </Group>
  );
}

export default function PostSpotlight() {
  const navigate = useNavigate();
  const actions: SpotlightActionData[] = getAllPosts().map((post) => ({
    id: post.slug,
    keywords: [post.category, post.series, ...post.tags, post.slug].filter(
      (item): item is string => Boolean(item),
    ),
    label: post.title,
    description: post.description,
    onClick: () => navigate(getPostPath(post.slug)),
    children: (
      <PostSpotlightActionContent
        publishedAt={post.publishedAt}
        tags={post.tags}
        thumbnail={post.thumbnail}
        title={post.title}
      />
    ),
  }));

  return (
    <Spotlight
      actions={actions}
      highlightQuery
      limit={5}
      maxHeight={420}
      nothingFound="No posts found"
      searchProps={{
        leftSection: <IconSearch size={18} />,
        placeholder: "Search posts, tags, or topics",
      }}
      shortcut="mod + K"
    />
  );
}
