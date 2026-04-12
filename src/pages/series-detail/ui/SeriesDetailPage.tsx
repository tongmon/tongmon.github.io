import { Stack, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { getPostsBySeries, getSeriesSummary } from "@/entities/post";
import { formatDateTime } from "@/shared/lib/date/formatDateTime";
import { getSeriesPath } from "@/shared/lib/routes";
import { EmptyState, PageIntro } from "@/shared/ui";
import { PostCard } from "@/widgets/post-card";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

export default function SeriesDetailPage() {
  const { series } = useParams();
  const seriesSlug = series ?? "";
  const seriesSummary = getSeriesSummary(seriesSlug);
  const posts = getPostsBySeries(seriesSlug);
  const isMobileViewport = useIsMobileViewport();

  if (!seriesSummary) {
    return (
      <Stack py="xl">
        <EmptyState
          actionHref={getSeriesPath()}
          actionLabel="Back to series"
          description="The requested series does not exist in the generated post manifest."
          title="Unknown series"
        />
      </Stack>
    );
  }

  return (
    <Stack gap="xl" py="xl">
      <PageIntro
        description="Posts in this series are listed from part 1 at the top to the latest entry at the bottom."
        eyebrow="Series"
        title={seriesSummary.label}
      />

      <Text c="var(--app-muted)" size="sm">
        {seriesSummary.count} post{seriesSummary.count === 1 ? "" : "s"} in this
        series. Latest update {formatDateTime(seriesSummary.latestUpdatedAt)}.
      </Text>

      <Stack gap="lg">
        {posts.map((post, index) => (
          <Stack gap="xs" key={post.slug}>
            <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
              Part {post.seriesOrder ?? index + 1}
            </Text>
            <PostCard
              post={post}
              variant={isMobileViewport ? "grid" : "compact"}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
