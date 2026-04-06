import { Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { getPostsBySeries, getSeriesSummaries } from "@/entities/post";
import { getPostPath, getPostsPath } from "@/shared/lib/routes";
import { EmptyState, PageIntro } from "@/shared/ui";

export default function SeriesPage() {
  const seriesSummaries = getSeriesSummaries();

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
        description="Grouped reading tracks for posts that belong together and are meant to be read in sequence."
        eyebrow="Series"
        title="Read by series"
      />

      <SimpleGrid cols={{ base: 1, xl: 2 }}>
        {seriesSummaries.map((series) => {
          const posts = getPostsBySeries(series.slug);

          return (
            <Paper
              bg="var(--app-surface-1)"
              key={series.slug}
              p="xl"
              shadow="sm"
              style={{ border: "1px solid var(--app-muted-border)" }}
            >
              <Stack gap="lg">
                <Stack gap="xs">
                  <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
                    {series.count} post{series.count === 1 ? "" : "s"}
                  </Text>
                  <Title order={2}>{series.label}</Title>
                  <Text c="var(--app-muted)" size="sm">
                    Posts in this series are listed in their intended reading order.
                  </Text>
                </Stack>

                <Stack gap="sm">
                  {posts.map((post, index) => (
                    <Paper
                      bg="transparent"
                      key={post.slug}
                      p="md"
                      style={{ border: "1px solid var(--app-muted-border)" }}
                    >
                      <Stack gap="xs">
                        <Text
                          c="var(--app-muted)"
                          fw={700}
                          size="xs"
                          tt="uppercase"
                        >
                          Part {post.seriesOrder ?? index + 1}
                        </Text>
                        <Title
                          order={3}
                          renderRoot={(props) => (
                            <Link {...props} to={getPostPath(post.slug)} />
                          )}
                        >
                          {post.title}
                        </Title>
                        <Text c="var(--app-muted)" size="sm">
                          {post.description}
                        </Text>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
