import { Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { siteConfig } from "@/shared/config/site";
import { PageIntro } from "@/shared/ui";

export default function AboutPage() {
  return (
    <Stack gap="xl" py="xl">
      <PageIntro
        description={siteConfig.about}
        eyebrow="About"
        title="About this blog"
      />

      <Grid gap="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            bg="var(--app-surface-1)"
            p="xl"
            shadow="sm"
            style={{ border: "1px solid var(--app-muted-border)" }}
          >
            <Stack gap="sm">
              <Title order={3}>What I write about</Title>
              <Text c="var(--app-muted)">
                Frontend architecture, design systems, documentation, delivery
                workflows, and the practical edge between product polish and
                maintainable code.
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            bg="var(--app-surface-1)"
            p="xl"
            shadow="sm"
            style={{ border: "1px solid var(--app-muted-border)" }}
          >
            <Stack gap="sm">
              <Title order={3}>How the blog works</Title>
              <Text c="var(--app-muted)">
                Each post lives in its own folder with Markdown, a cover image,
                and optional supporting assets. A build-time script validates
                frontmatter, estimates reading time, and generates the manifest
                the app consumes.
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
