import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import type { TagSummary } from "@/entities/post";
import {
  usePostFiltersStore,
  type PostListViewMode,
} from "@/features/post-filters/model/usePostFiltersStore";

interface PostFiltersProps {
  availableTags: TagSummary[];
}

export default function PostFilters({ availableTags }: PostFiltersProps) {
  const {
    resetFilters,
    searchQuery,
    selectedTag,
    setSearchQuery,
    setSelectedTag,
    setViewMode,
    viewMode,
  } = usePostFiltersStore();

  return (
    <Paper
      bg="var(--app-surface-1)"
      p="lg"
      shadow="sm"
      style={{ border: "1px solid var(--app-muted-border)" }}
    >
      <Stack gap="md">
        <Group align="flex-end" justify="space-between">
          <TextInput
            leftSection={<IconSearch size={16} />}
            onChange={(event) => {
              setSearchQuery(event.currentTarget.value);
            }}
            placeholder="Search by title, description, or tag"
            radius="xl"
            style={{ flex: "1 1 360px" }}
            value={searchQuery}
          />

          <Group gap="sm">
            <SegmentedControl
              data={[
                { label: "Grid", value: "grid" },
                { label: "Compact", value: "compact" },
              ]}
              onChange={(value) => {
                setViewMode(value as PostListViewMode);
              }}
              radius="xl"
              value={viewMode}
            />
            <ActionIcon
              aria-label="Reset post filters"
              onClick={resetFilters}
              radius="xl"
              size="lg"
              variant="default"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Group gap="xs">
          {availableTags.map((tag) => {
            const isActive = tag.slug === selectedTag;

            return (
              <Badge
                key={tag.slug}
                onClick={() => {
                  setSelectedTag(isActive ? null : tag.slug);
                }}
                style={{ cursor: "pointer" }}
                variant={isActive ? "filled" : "light"}
              >
                {tag.label} ({tag.count})
              </Badge>
            );
          })}
        </Group>
      </Stack>
    </Paper>
  );
}
