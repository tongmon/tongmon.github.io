import {
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type {
  PostManifestEntry,
  SeriesPostNavigation as SeriesPostNavigationData,
} from "@/entities/post";
import { getPostPath, getSeriesDetailPath } from "@/shared/lib/routes";

interface SeriesPostNavigationProps {
  navigation: SeriesPostNavigationData;
}

interface SeriesPostNavigationCardProps {
  direction: "next" | "previous";
  post: PostManifestEntry;
}

function SeriesPostNavigationCard({
  direction,
  post,
}: SeriesPostNavigationCardProps) {
  const isPrevious = direction === "previous";
  const label = isPrevious ? "Previous post" : "Next post";
  const postPath = getPostPath(post.slug);
  const icon = (
    <ThemeIcon
      color="brand"
      radius="xl"
      size={44}
      style={{ border: "1px solid currentColor", flex: "0 0 auto" }}
      variant="transparent"
    >
      {isPrevious ? <IconArrowLeft size={24} /> : <IconArrowRight size={24} />}
    </ThemeIcon>
  );

  return (
    <Link style={{ display: "block", textDecoration: "none" }} to={postPath}>
      <Paper
        bg="var(--app-surface-1)"
        h="100%"
        p={{ base: "md", md: "lg" }}
        shadow="sm"
        style={{
          border: "1px solid var(--app-muted-border)",
          transition: "transform 150ms ease, border-color 150ms ease",
        }}
      >
        <Group align="center" justify="space-between" wrap="nowrap">
          {isPrevious ? icon : null}

          <Stack gap={4} style={{ flex: 1 }}>
            <Text
              c="var(--app-muted)"
              fw={700}
              size="xs"
              ta={isPrevious ? "left" : "right"}
              tt="uppercase"
            >
              {label}
            </Text>
            <Text
              fw={800}
              lineClamp={2}
              size="lg"
              ta={isPrevious ? "left" : "right"}
            >
              {post.title}
            </Text>
          </Stack>

          {!isPrevious ? icon : null}
        </Group>
      </Paper>
    </Link>
  );
}

export default function SeriesPostNavigation({
  navigation,
}: SeriesPostNavigationProps) {
  const cards = [
    navigation.previousPost
      ? {
          direction: "previous" as const,
          post: navigation.previousPost,
        }
      : null,
    navigation.nextPost
      ? {
          direction: "next" as const,
          post: navigation.nextPost,
        }
      : null,
  ].filter((item) => item !== null);

  if (cards.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      {
        // <Group justify="space-between">
        //   <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
        //     Continue this series
        //   </Text>
        //   <Text
        //     c="var(--app-muted)"
        //     component={Link}
        //     size="sm"
        //     style={{ textDecoration: "none" }}
        //     to={getSeriesDetailPath(navigation.seriesLabel)}
        //   >
        //     {navigation.totalPosts} post{navigation.totalPosts === 1 ? "" : "s"} in{" "}
        //     {navigation.seriesLabel}
        //   </Text>
        // </Group>
      }
      <SimpleGrid cols={{ base: 1, md: cards.length > 1 ? 2 : 1 }} spacing="md">
        {cards.map((card) => (
          <SeriesPostNavigationCard
            direction={card.direction}
            key={card.direction}
            post={card.post}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
