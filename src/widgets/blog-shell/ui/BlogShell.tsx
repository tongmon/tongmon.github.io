import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  Image,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowUpRight,
  IconHash,
  IconSearch,
  IconSearchFilled,
} from "@tabler/icons-react";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { getAllPosts, getTagSummaries } from "@/entities/post";
import { ThemeToggle } from "@/features/theme-toggle";
import { siteConfig } from "@/shared/config/site";
import { getPostsPath, getTagPath } from "@/shared/lib/routes";
import pixelateProfile from "@/assets/images/pictures/profile_pixelate.png";

function isNavigationItemActive(currentPath: string, href: string) {
  // if (href === "/") {
  //   return currentPath === "/";
  // }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function isHeaderNavigationItemActive(currentPath: string, href: string) {
  return (
    isNavigationItemActive(currentPath, href) ||
    (href === getPostsPath() && currentPath.startsWith("/tags/")) ||
    (currentPath === "/" && href === "/posts")
  );
}

export default function BlogShell() {
  const [opened, { close, toggle }] = useDisclosure(false);
  const location = useLocation();
  const allPostsHref = getPostsPath();
  const allPostsCount = getAllPosts().length;
  const topTags = getTagSummaries().slice(0, 8);

  return (
    <AppShell
      header={{ height: 76 }}
      navbar={{ breakpoint: "md", width: 300, collapsed: { mobile: !opened } }}
      padding="md"
    >
      <ScrollRestoration />
      <AppShell.Header
        bg="transparent"
        style={{ backdropFilter: "blur(18px)" }}
      >
        <Container
          h="100%"
          maw="var(--app-shell-max-width)"
          px={{ base: "md", md: "xl" }}
          size="100%"
        >
          <Group h="100%" justify="space-between">
            <Group gap="md" h="100%">
              <Burger
                hiddenFrom="md"
                onClick={toggle}
                opened={opened}
                size="sm"
              />
              <Box h="60%" style={{ aspectRatio: "1 / 1", flex: "0 0 auto" }}>
                <Image
                  src={pixelateProfile}
                  fit="cover"
                  radius="md"
                  h="100%"
                  w="100%"
                />
              </Box>
              <Stack gap={0}>
                <Title
                  order={3}
                  renderRoot={(props) => <Link {...props} to="/" />}
                >
                  Tongstar Notes
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
                    isHeaderNavigationItemActive(location.pathname, item.href)
                      ? "filled"
                      : "subtle"
                  }
                >
                  {item.label}
                </Button>
              ))}
            </Group>

            <Group gap="xs" visibleFrom="md">
              <ActionIcon
                radius="xl"
                size="lg"
                variant="default"
                aria-label="post-search"
              >
                <IconSearch size={18} />
              </ActionIcon>
              <ThemeToggle />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar bg="var(--app-surface-2)" p="md">
        {
          // <AppShell.Section>
          //   <Stack gap="xs">
          //     {siteConfig.navigation.map((item) => (
          //       <NavLink
          //         active={isNavigationItemActive(location.pathname, item.href)}
          //         component={Link}
          //         key={item.href}
          //         label={item.label}
          //         onClick={close}
          //         to={item.href}
          //       />
          //     ))}
          //   </Stack>
          // </AppShell.Section>
          // <Divider my="lg" />
        }

        <AppShell.Section grow>
          <Stack gap="sm">
            <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
              Tag List
            </Text>
            {[
              {
                count: allPostsCount,
                href: allPostsHref,
                key: "all-posts",
                label: "All",
              },
              ...topTags.map((tag) => ({
                count: tag.count,
                href: getTagPath(tag.label),
                key: tag.slug,
                label: tag.label,
              })),
            ].map((item) => {
              const isActive =
                item.href === allPostsHref
                  ? location.pathname === "/" ||
                    isNavigationItemActive(location.pathname, item.href)
                  : isNavigationItemActive(location.pathname, item.href);

              return (
                <NavLink
                  active={isActive}
                  color="brand"
                  component={Link}
                  key={item.key}
                  label={`${item.label} (${item.count})`}
                  leftSection={<IconHash size={14} />}
                  onClick={close}
                  style={{
                    backgroundColor: isActive
                      ? "var(--app-nav-active-bg)"
                      : undefined,
                    border: `1px solid ${isActive ? "var(--app-nav-active-border)" : "transparent"}`,
                    transition:
                      "background-color 150ms ease, border-color 150ms ease",
                  }}
                  to={item.href}
                  variant="light"
                />
              );
            })}
          </Stack>
        </AppShell.Section>

        <Divider my="lg" />

        <AppShell.Section>
          <Text c="var(--app-muted)" size="sm">
            Static-first writing workflow, Markdown ownership per post folder,
            and GitHub Pages deployment.
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
      </AppShell.Main>
    </AppShell>
  );
}
