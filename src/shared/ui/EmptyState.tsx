import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <Paper
      bg="var(--app-surface-1)"
      p={{ base: "xl", md: "2rem" }}
      shadow="sm"
      style={{ border: "1px solid var(--app-muted-border)" }}
    >
      <Stack align="flex-start" gap="sm">
        <Title order={2}>{title}</Title>
        <Text c="var(--app-muted)" maw={520}>
          {description}
        </Text>
        {actionHref && actionLabel ? (
          <Button component={Link} mt="sm" to={actionHref} variant="filled">
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
