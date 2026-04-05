import {
  AppShell,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowUpRight, IconHash } from "@tabler/icons-react";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { getTagSummaries } from "@/entities/post";
import { ThemeToggle } from "@/features/theme-toggle";
import { siteConfig } from "@/shared/config/site";
import { getTagPath } from "@/shared/lib/routes";

function isNavigationItemActive(currentPath: string, href: string) {
  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function BlogShell() {
  const [opened, { close, toggle }] = useDisclosure(false);
  const location = useLocation();
  const topTags = getTagSummaries().slice(0, 8);

  return (
    <AppShell
      header={{ height: 76 }}
      navbar={{ breakpoint: "md", width: 300, collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header bg="transparent" style={{ backdropFilter: "blur(18px)" }}>
        <Container
          h="100%"
          maw="var(--app-shell-max-width)"
          px={{ base: "md", md: "xl" }}
          size="100%"
        >
          <Group h="100%" justify="space-between">
            <Group gap="md">
              <Burger
                hiddenFrom="md"
                onClick={toggle}
                opened={opened}
                size="sm"
              />
              <Stack gap={0}>
                <Title
                  order={3}
                  renderRoot={(props) => <Link {...props} to="/" />}
                >
                  {siteConfig.title}
                </Title>
                <Text c="var(--app-muted)" size="sm" visibleFrom="sm">
                  Quietly polished frontend notes.
                </Text>
              </Stack>
            </Group>

            <Group gap="xs" visibleFrom="md">
              {siteConfig.navigation.map((item) => (
                <Button
                  component={Link}
                  key={item.href}
                  size="sm"
                  to={item.href}
                  variant={
                    isNavigationItemActive(location.pathname, item.href)
                      ? "filled"
                      : "subtle"
                  }
                >
                  {item.label}
                </Button>
              ))}
            </Group>

            <ThemeToggle />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar bg="var(--app-surface-2)" p="md">
        <AppShell.Section>
          <Stack gap="xs">
            {siteConfig.navigation.map((item) => (
              <NavLink
                active={isNavigationItemActive(location.pathname, item.href)}
                component={Link}
                key={item.href}
                label={item.label}
                onClick={close}
                to={item.href}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <Divider my="lg" />

        <AppShell.Section grow>
          <Stack gap="sm">
            <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
              Popular tags
            </Text>
            {topTags.map((tag) => (
              <NavLink
                component={Link}
                key={tag.slug}
                label={`${tag.label} (${tag.count})`}
                leftSection={<IconHash size={14} />}
                onClick={close}
                to={getTagPath(tag.label)}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <Divider my="lg" />

        <AppShell.Section>
          <Text c="var(--app-muted)" size="sm">
            Static-first writing workflow, Markdown ownership per post folder, and
            GitHub Pages deployment.
          </Text>
          <Button
            component="a"
            href="https://github.com/tongm/tongmon.github.io"
            leftSection={<IconArrowUpRight size={16} />}
            mt="md"
            rel="noreferrer"
            target="_blank"
            variant="light"
          >
            View repository
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main pb="xl">
        <Container
          maw="var(--app-shell-max-width)"
          px={{ base: "md", md: "xl" }}
          size="100%"
        >
          <Outlet />
        </Container>
        <ScrollRestoration />
      </AppShell.Main>
    </AppShell>
  );
}
