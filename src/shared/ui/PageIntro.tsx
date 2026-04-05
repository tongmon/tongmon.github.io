import { Stack, Text, Title } from "@mantine/core";

interface PageIntroProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export default function PageIntro({
  title,
  description,
  eyebrow,
}: PageIntroProps) {
  return (
    <Stack gap="sm">
      {eyebrow ? (
        <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
          {eyebrow}
        </Text>
      ) : null}
      <Title order={1}>{title}</Title>
      <Text c="var(--app-muted)" maw={760} size="lg">
        {description}
      </Text>
    </Stack>
  );
}
