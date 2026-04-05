import {
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowRight, IconNotebook, IconSparkles } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PostTagList, getLatestPosts, getTagSummaries } from "@/entities/post";
import { siteConfig } from "@/shared/config/site";
import { getPostsPath } from "@/shared/lib/routes";
import { PostCard } from "@/widgets/post-card";

export default function HomePage() {
  const [featuredPost, ...recentPosts] = getLatestPosts(4);
  const topTags = getTagSummaries().slice(0, 6);

  return (
    <Stack gap="2rem" py="xl">
      <Grid align="stretch" gap="xl">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Paper
            bg="var(--app-surface-1)"
            p={{ base: "xl", md: "2rem" }}
            shadow="sm"
            style={{
              border: "1px solid var(--app-muted-border)",
              boxShadow: "var(--app-soft-shadow)",
            }}
          >
            <Stack gap="xl">
              <Stack gap="md">
                <Group gap="sm">
                  <ThemeIcon color="brand" radius="xl" size="lg" variant="light">
                    <IconSparkles size={18} />
                  </ThemeIcon>
                  <Text fw={700} size="sm" tt="uppercase">
                    Static publishing, practical FSD
                  </Text>
                </Group>
                <Title order={1}>{siteConfig.title}</Title>
                <Text c="var(--app-muted)" maw={640} size="lg">
                  {siteConfig.description}
                </Text>
              </Stack>

              <Group>
                <Button
                  component={Link}
                  rightSection={<IconArrowRight size={16} />}
                  size="md"
                  to={getPostsPath()}
                >
                  Browse all posts
                </Button>
                <Button component={Link} size="md" to="/about" variant="default">
                  About this site
                </Button>
              </Group>

              <Group gap="xs">
                {topTags.map((tag) => (
                  <Text
                    c="var(--app-muted)"
                    fw={600}
                    key={tag.slug}
                    size="sm"
                  >
                    #{tag.label}
                  </Text>
                ))}
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper
            bg="var(--app-surface-1)"
            h="100%"
            p={{ base: "xl", md: "2rem" }}
            shadow="sm"
            style={{ border: "1px solid var(--app-muted-border)" }}
          >
            {featuredPost ? (
              <Stack gap="md" h="100%" justify="space-between">
                <Stack gap="sm">
                  <Group gap="sm">
                    <ThemeIcon color="brand" radius="xl" size="lg" variant="light">
                      <IconNotebook size={18} />
                    </ThemeIcon>
                    <Text fw={700} size="sm" tt="uppercase">
                      Latest post
                    </Text>
                  </Group>
                  <Title
                    order={2}
                    renderRoot={(props) => (
                      <Link {...props} to={`/posts/${featuredPost.slug}`} />
                    )}
                  >
                    {featuredPost.title}
                  </Title>
                  <Text c="var(--app-muted)">{featuredPost.description}</Text>
                  <PostTagList tags={featuredPost.tags} />
                </Stack>

                <Button
                  component={Link}
                  rightSection={<IconArrowRight size={16} />}
                  to={`/posts/${featuredPost.slug}`}
                  variant="light"
                >
                  Read the latest entry
                </Button>
              </Stack>
            ) : null}
          </Paper>
        </Grid.Col>
      </Grid>

      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Recent writing</Title>
          <Button component={Link} to={getPostsPath()} variant="subtle">
            View archive
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
