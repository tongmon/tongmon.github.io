import {
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconBooks, IconRefresh } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { getSeriesSummaries } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { formatDateTime } from "@/shared/lib/date/formatDateTime";
import { getPostsPath, getSeriesDetailPath } from "@/shared/lib/routes";
import { EmptyState, PageIntro } from "@/shared/ui";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

export default function SeriesPage() {
  const seriesSummaries = getSeriesSummaries();
  const isMobileViewport = useIsMobileViewport();

  if (seriesSummaries.length === 0) {
    return (
      <Stack py="xl">
        <EmptyState
          actionHref={getPostsPath()}
          actionLabel="Browse all posts"
          description="No post series are defined in the generated manifest yet."
          title="No series yet"
        />
      </Stack>
    );
  }

  return (
    <Stack gap="xl" py="xl">
      <PageIntro
        description="Each card represents a writing track. Open a series to browse its posts in reading order."
        eyebrow="Series"
        title="Browse by series"
      />

      <SimpleGrid cols={{ base: 1, xl: 2 }}>
        {seriesSummaries.map((series) => {
          const coverImage = series.thumbnail
            ? toPublicAssetUrl(series.thumbnail)
            : null;

          return (
            <UnstyledButton
              component={Link}
              key={series.slug}
              style={{
                color: "inherit",
                display: "block",
                textDecoration: "none",
              }}
              to={getSeriesDetailPath(series.label)}
            >
              <Paper
                bg="var(--app-surface-1)"
                shadow="sm"
                style={{
                  border: "1px solid var(--app-muted-border)",
                  overflow: "hidden",
                }}
              >
                {coverImage ? (
                  <Image
                    alt={series.label}
                    h={isMobileViewport ? 220 : 300}
                    src={coverImage}
                  />
                ) : null}

                <Stack gap="lg" p="xl">
                  <Stack gap="xs">
                    <Text
                      c="var(--app-muted)"
                      fw={700}
                      size="xs"
                      tt="uppercase"
                    >
                      Series
                    </Text>
                    <Title order={2}>{series.label}</Title>
                  </Stack>

                  <Group c="var(--app-muted)" gap="md" wrap="wrap">
                    <Group gap={6}>
                      <IconRefresh size={16} stroke={1.8} />
                      <Text size="sm">
                        Updated {formatDateTime(series.latestUpdatedAt)}
                      </Text>
                    </Group>
                    <Group gap={6}>
                      <IconBooks size={16} stroke={1.8} />
                      <Text size="sm">
                        {series.count} post{series.count === 1 ? "" : "s"}
                      </Text>
                    </Group>
                  </Group>

                  <Text c="var(--app-anchor)" fw={700} size="sm">
                    Open series
                  </Text>
                </Stack>
              </Paper>
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
