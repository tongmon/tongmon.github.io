import { Group, Text } from "@mantine/core";
import { IconCalendar, IconClock, IconRefresh } from "@tabler/icons-react";
import { formatDate } from "@/shared/lib/date/formatDate";

interface PostMetaProps {
  publishedAt: string;
  readingTime: number;
  updatedAt?: string;
}

export default function PostMeta({
  publishedAt,
  readingTime,
  updatedAt,
}: PostMetaProps) {
  return (
    <Group c="var(--app-muted)" gap="md" wrap="wrap">
      <Group gap={6}>
        <IconCalendar size={16} stroke={1.8} />
        <Text size="sm">{formatDate(publishedAt)}</Text>
      </Group>

      <Group gap={6}>
        <IconClock size={16} stroke={1.8} />
        <Text size="sm">{readingTime} min read</Text>
      </Group>

      {updatedAt ? (
        <Group gap={6}>
          <IconRefresh size={16} stroke={1.8} />
          <Text size="sm">Updated {formatDate(updatedAt)}</Text>
        </Group>
      ) : null}
    </Group>
  );
}
