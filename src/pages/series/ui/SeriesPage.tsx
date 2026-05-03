import { Group, Pagination, SimpleGrid, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSeriesSummaries } from "@/entities/post";
import {
  buildPageSearchParams,
  paginateItems,
  parsePageParam,
} from "@/shared/lib/pagination";
import { getPostsPath } from "@/shared/lib/routes";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";
import { EmptyState, getRevealDelay, PageIntro, Revealer } from "@/shared/ui";
import { SeriesCard } from "@/widgets/series-card";

export default function SeriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const seriesSummaries = getSeriesSummaries();
  const isMobileViewport = useIsMobileViewport();
  const revealColumns = isMobileViewport ? 1 : 2;
  const requestedPage = parsePageParam(searchParams.get("page"));
  const {
    currentPage,
    pageItems: visibleSeries,
    totalPages,
  } = paginateItems(seriesSummaries, requestedPage);

  useEffect(() => {
    const normalizedSearchParams = buildPageSearchParams(
      searchParams,
      currentPage,
    );

    if (normalizedSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(normalizedSearchParams, { replace: true });
    }
  }, [currentPage, searchParams, setSearchParams]);

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

      <Stack gap="lg">
        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing={{ base: "md", md: "xl" }}
        >
          {visibleSeries.map((series, index) => (
            <Revealer
              delay={getRevealDelay(index, revealColumns)}
              key={series.slug}
            >
              <SeriesCard series={series} />
            </Revealer>
          ))}
        </SimpleGrid>

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
