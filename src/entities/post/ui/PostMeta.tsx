import { Group, Text, type GroupProps } from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconMessageCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { formatDate } from "@/shared/lib/date/formatDate";

interface PostMetaProps extends Omit<GroupProps, "children"> {
  commentCount?: number;
  publishedAt: string;
  readingTime: number;
  updatedAt?: string;
}

export default function PostMeta({
  commentCount,
  c = "var(--app-muted)",
  gap = "md",
  publishedAt,
  readingTime,
  updatedAt,
  wrap = "wrap",
  ...others
}: PostMetaProps) {
  return (
    <Group c={c} gap={gap} wrap={wrap} {...others}>
      <Group gap={6}>
        <IconCalendar size={16} stroke={1.8} />
        <Text size="sm">{formatDate(publishedAt)}</Text>
      </Group>

      <Group gap={6}>
        <IconClock size={16} stroke={1.8} />
        <Text size="sm">{readingTime} min read</Text>
      </Group>

      {typeof commentCount === "number" ? (
        <Group gap={6}>
          <IconMessageCircle size={16} stroke={1.8} />
          <Text size="sm">
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </Text>
        </Group>
      ) : null}

      {updatedAt ? (
        <Group gap={6}>
          <IconRefresh size={16} stroke={1.8} />
          <Text size="sm">Updated {formatDate(updatedAt)}</Text>
        </Group>
      ) : null}
    </Group>
  );
}
