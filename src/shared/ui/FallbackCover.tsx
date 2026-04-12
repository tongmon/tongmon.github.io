import { Group, Stack, Text } from "@mantine/core";

interface FallbackCoverProps {
  eyebrow: string;
  title: string;
  meta?: string;
  aside?: string;
  compact?: boolean;
  radius?: "md" | "lg" | "xl";
}

export default function FallbackCover({
  eyebrow,
  title,
  meta,
  aside,
  compact = false,
  radius,
}: FallbackCoverProps) {
  return (
    <Stack
      gap="xl"
      h="100%"
      justify="space-between"
      p={compact ? "md" : "lg"}
      style={{
        background:
          "radial-gradient(circle at top right, rgba(84, 188, 146, 0.42), transparent 30%), linear-gradient(155deg, rgba(84, 188, 146, 0.22), rgba(31, 106, 80, 0.08)), var(--app-surface-0)",
        borderRadius: radius ? `var(--mantine-radius-${radius})` : undefined,
        boxShadow: "inset 0 0 0 1px var(--app-muted-border)",
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
          {eyebrow}
        </Text>
        {aside ? (
          <Text c="var(--app-muted)" size="xs">
            {aside}
          </Text>
        ) : null}
      </Group>

      <Stack gap={6}>
        <Text
          fw={800}
          size={compact ? "xl" : "2rem"}
          style={{ letterSpacing: "-0.04em", lineHeight: 0.92 }}
        >
          {title}
        </Text>
        {meta ? (
          <Text c="var(--app-muted)" size="sm">
            {meta}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}
