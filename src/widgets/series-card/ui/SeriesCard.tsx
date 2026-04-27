import { Card, Flex, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconBooks, IconPacmanFilled, IconRefresh } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { type SeriesSummary } from "@/entities/post";
import { toPublicAssetUrl } from "@/shared/lib/base-path/toPublicAssetUrl";
import { formatDate } from "@/shared/lib/date/formatDate";
import { getSeriesDetailPath } from "@/shared/lib/routes";
import { FallbackCover } from "@/shared/ui";

interface SeriesCardProps {
  series: SeriesSummary;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const thumbnail = series.thumbnail
    ? toPublicAssetUrl(series.thumbnail)
    : null;
  const seriesPath = getSeriesDetailPath(series.slug);
  const seriesCountLabel = `${series.count} post${series.count === 1 ? "" : "s"}`;
  const updatedLabel = `Updated ${formatDate(series.latestUpdatedAt)}`;

  return (
    <Card
      bg="var(--app-surface-1)"
      p="xs"
      shadow="sm"
      style={{
        border: "1px solid var(--app-muted-border)",
        overflow: "hidden",
      }}
    >
      <Stack gap={0} justify="center">
        <Group
          h={{ base: 220, md: 250 }}
          w="100%"
          // pr={{ base: 0, md: "xs" }}
          style={{ flexShrink: 0, overflow: "hidden" }}
          renderRoot={(props) => <Link {...props} to={seriesPath} />}
          mb="lg"
        >
          {thumbnail ? (
            <Image
              alt={series.label}
              fit="cover"
              h="100%"
              radius="xl"
              src={thumbnail}
              w="100%"
            />
          ) : (
            <FallbackCover
              aside={seriesCountLabel}
              compact
              eyebrow="Series"
              meta={updatedLabel}
              radius="xl"
              title={series.label}
            />
          )}
        </Group>
        <Group px="lg" justify="space-between">
          <Stack gap="xs">
            <Title
              order={4}
              renderRoot={(props) => <Link {...props} to={seriesPath} />}
            >
              {series.label}
            </Title>
            <Group gap="md" wrap="wrap">
              <Group gap={6}>
                <IconRefresh size={16} stroke={1.8} />
                <Text size="sm">{updatedLabel}</Text>
              </Group>
              <Group gap={6}>
                <IconBooks size={16} stroke={1.8} />
                <Text size="sm">{seriesCountLabel}</Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Stack>

      {
        // <Flex direction={{ base: "column", md: "row" }} h="100%">
        //   <Group
        //     h={180}
        //     w={{ base: "100%", md: 280 }}
        //     pr={{ base: 0, md: "xs" }}
        //     style={{ flexShrink: 0, overflow: "hidden" }}
        //     renderRoot={(props) => <Link {...props} to={seriesPath} />}
        //   >
        //     {thumbnail ? (
        //       <Image
        //         alt={series.label}
        //         fit="cover"
        //         h="100%"
        //         radius="xl"
        //         src={thumbnail}
        //         w="100%"
        //       />
        //     ) : (
        //       <FallbackCover
        //         aside={seriesCountLabel}
        //         compact
        //         eyebrow="Series"
        //         meta={updatedLabel}
        //         radius="xl"
        //         title={series.label}
        //       />
        //     )}
        //   </Group>
        //
        //   <Stack
        //     gap="md"
        //     p="xs"
        //     justify="center"
        //   // style={{ flex: 1, justifyContent: "space-between" }}
        //   >
        //     <Stack gap={8}>
        //       <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
        //         Series
        //       </Text>
        //       <Title
        //         order={4}
        //         renderRoot={(props) => <Link {...props} to={seriesPath} />}
        //       >
        //         {series.label}
        //       </Title>
        //     </Stack>
        //
        //     <Group c="var(--app-muted)" gap="xs" wrap="wrap" mt="auto">
        //       <Group gap={6}>
        //         <IconRefresh size={16} stroke={1.8} />
        //         <Text size="sm">{updatedLabel}</Text>
        //       </Group>
        //
        //       <Group gap={6}>
        //         <IconBooks size={16} stroke={1.8} />
        //         <Text size="sm">{seriesCountLabel}</Text>
        //       </Group>
        //     </Group>
        //   </Stack>
        // </Flex>
      }
    </Card>
  );
}
