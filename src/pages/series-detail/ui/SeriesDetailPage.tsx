import { Group, Pagination, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPostsBySeries, getSeriesSummary } from "@/entities/post";
import { formatDateTime } from "@/shared/lib/date/formatDateTime";
import {
  buildPageSearchParams,
  paginateItems,
  parsePageParam,
} from "@/shared/lib/pagination";
import { getSeriesPath } from "@/shared/lib/routes";
import { EmptyState, PageIntro } from "@/shared/ui";
import { PostCard } from "@/widgets/post-card";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

const SERIES_DETAIL_PAGE_LIMIT = 5;

export default function SeriesDetailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { series } = useParams();
  const seriesSlug = series ?? "";
  const seriesSummary = getSeriesSummary(seriesSlug);
  const posts = getPostsBySeries(seriesSlug);
  const postsWithSeriesIndex = posts.map((post, index) => ({
    fallbackSeriesOrder: index + 1,
    post,
  }));
  const requestedPage = parsePageParam(searchParams.get("page"));
  const {
    currentPage,
    pageItems: visiblePostItems,
    totalPages,
  } = paginateItems(
    postsWithSeriesIndex,
    requestedPage,
    SERIES_DETAIL_PAGE_LIMIT,
  );
  const isMobileViewport = useIsMobileViewport();

  useEffect(() => {
    const normalizedSearchParams = buildPageSearchParams(
      searchParams,
      currentPage,
    );

    if (normalizedSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(normalizedSearchParams, { replace: true });
    }
  }, [currentPage, searchParams, setSearchParams]);

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

      <Text c="var(--app-muted)" style={{ whiteSpace: "pre-wrap" }} size="sm">
        {`${seriesSummary.count} post${seriesSummary.count === 1 ? "" : "s"} in this series.\nLatest update ${formatDateTime(seriesSummary.latestUpdatedAt)}`}
      </Text>

      <Stack gap="lg">
        {visiblePostItems.map(({ fallbackSeriesOrder, post }) => (
          <Stack gap="xs" key={post.slug}>
            <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
              Part {post.seriesOrder ?? fallbackSeriesOrder}
            </Text>
            <PostCard
              post={post}
              variant={isMobileViewport ? "grid" : "compact"}
            />
          </Stack>
        ))}

        {totalPages > 1 ? (
          <Group justify="center">
            <Pagination
              onChange={(page) =>
                setSearchParams(buildPageSearchParams(searchParams, page))
              }
              total={totalPages}
              value={currentPage}
            />
          </Group>
        ) : null}
      </Stack>
    </Stack>
  );
}
