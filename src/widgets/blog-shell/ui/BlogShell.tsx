import { useEffect } from "react";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  Image,
  NavLink,
  RemoveScroll,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useElementSize, useViewportSize } from "@mantine/hooks";
import { openSpotlight } from "@mantine/spotlight";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconHash,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { getAllPosts, getTagSummaries } from "@/entities/post";
import { PostSpotlight } from "@/features/post-search";
import { ThemeToggle } from "@/features/theme-toggle";
import { siteConfig } from "@/shared/config/site";
import { getPostsPath, getTagPath } from "@/shared/lib/routes";
import pixelateProfile from "@/assets/images/pictures/profile_pixelate.png";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";

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

export function useScrollbarWidth() {
  useEffect(() => {
    const measure = () => {
      const outer = document.createElement("div");
      outer.style.visibility = "hidden";
      outer.style.overflow = "scroll";

      document.body.appendChild(outer);

      const inner = document.createElement("div");
      outer.appendChild(inner);

      const w = outer.offsetWidth - inner.offsetWidth;

      outer.remove();

      document.documentElement.style.setProperty(
        "--app-scrollbar-width",
        `${w}px`,
      );
    };

    measure();
  }, []);
}

function useBodyScrollbarRequirementState(isScrollable: boolean) {
  useEffect(() => {
    const { documentElement } = document;
    const attributeName = "data-body-scrollable";

    documentElement.setAttribute(
      attributeName,
      isScrollable ? "true" : "false",
    );

    return () => {
      documentElement.removeAttribute(attributeName);
    };
  }, [isScrollable]);
}

const contactLinkIcons = {
  email: IconMail,
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
} as const;

export default function BlogShell() {
  const [opened, { close, toggle }] = useDisclosure(false);
  const { ref: shellRef, height: shellHeight } =
    useElementSize<HTMLDivElement>();
  const { height: viewportHeight } = useViewportSize();
  const isMobileViewport = useIsMobileViewport();
  const location = useLocation();
  const allPostsHref = getPostsPath();
  const allPostsCount = getAllPosts().length;
  const topTags = getTagSummaries().slice(0, 8);
  const isMobileNavbarOpened = opened && isMobileViewport;
  const isBodyScrollable = shellHeight > viewportHeight + 1;

  useBodyScrollbarRequirementState(isBodyScrollable);
  useScrollbarWidth();

  return (
    <AppShell
      ref={shellRef}
      header={{ height: 76 }}
      navbar={{
        breakpoint: "md",
        width: 300,
        collapsed: { mobile: !opened },
      }}
      padding="md"
      transitionDuration={150}
    >
      <ScrollRestoration />
      <PostSpotlight />
      <RemoveScroll enabled={isMobileNavbarOpened} removeScrollBar={false}>
        <AppShell.Header
          // bg="transparent"
          style={{
            backdropFilter: "blur(18px)",
          }}
        >
          <Container
            h="100%"
            // maw="var(--app-shell-max-width)"
            //             ? "md"
            //   : "calc(var(--mantine-spacing-md) - var(--app-scrollbar-width))"
            // : "md",
            pl={{ base: "md", md: "xl" }}
            pr={{
              base: isBodyScrollable
                ? "md"
                : "calc(var(--mantine-spacing-md) + var(--app-scrollbar-width))",
              md: isBodyScrollable
                ? "xl"
                : "calc(var(--mantine-spacing-xl) + var(--app-scrollbar-width))",
            }}
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
                  <Text
                    renderRoot={(props) => <Link {...props} to="/" />}
                    fw={600}
                  >
                    Tongstar
                  </Text>
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

              <Group gap="xs">
                <ActionIcon
                  aria-label="Search posts"
                  onClick={openSpotlight}
                  radius="xl"
                  size="lg"
                  variant="default"
                >
                  <IconSearch size={18} />
                </ActionIcon>
                <ThemeToggle visibleFrom="md" />
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Navbar
          bg="var(--app-surface-2)"
          p="md"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <AppShell.Section grow style={{ display: "flex", minHeight: 0 }}>
            <ScrollArea
              offsetScrollbars="present"
              overscrollBehavior="contain"
              scrollbars="y"
              style={{ flex: 1, minHeight: 0 }}
              viewportProps={{
                style: {
                  touchAction: "pan-y",
                  WebkitOverflowScrolling: "touch",
                },
              }}
              type="never"
            >
              <Stack gap="xs" mb="xs" hiddenFrom="md">
                <Stack gap={0} align="center" mb="xs">
                  <Avatar
                    src={pixelateProfile}
                    alt="it's me"
                    size="xl"
                    mb="xs"
                  />
                  <Text
                    renderRoot={(props) => <Link {...props} to="/" />}
                    fw={600}
                  >
                    Tongstar
                  </Text>
                  <Text c="var(--app-muted)" size="sm">
                    Focus on what you can control.
                  </Text>
                </Stack>
                <Text c="var(--app-muted)" fw={700} size="xs" tt="uppercase">
                  Sections
                </Text>
                {siteConfig.navigation.map((item) => (
                  <NavLink
                    active={isHeaderNavigationItemActive(
                      location.pathname,
                      item.href,
                    )}
                    component={Link}
                    key={item.href}
                    label={item.label}
                    onClick={close}
                    to={item.href}
                  />
                ))}
              </Stack>
              <Stack gap="sm" pr="xs">
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
                        location.pathname === allPostsHref
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
            </ScrollArea>
          </AppShell.Section>

          <Divider my="lg" />

          <AppShell.Section>
            <Group gap="md" justify="center" wrap="wrap">
              <ThemeToggle hiddenFrom="md" />
              {siteConfig.contactLinks.map((item) => {
                const Icon = contactLinkIcons[item.kind];
                const isExternal = item.href.startsWith("http");

                return (
                  <Tooltip key={item.kind} label={item.label}>
                    <ActionIcon
                      aria-label={item.label}
                      component="a"
                      href={item.href}
                      onClick={close}
                      radius="xl"
                      rel={isExternal ? "noreferrer" : undefined}
                      size="lg"
                      target={isExternal ? "_blank" : undefined}
                      title={item.label}
                      variant="default"
                    >
                      <Icon size={18} />
                    </ActionIcon>
                  </Tooltip>
                );
              })}
            </Group>
          </AppShell.Section>

          {
            // <AppShell.Section h="10%">
            //   {
            //     //   <Text c="var(--app-muted)" size="sm">
            //     //   Static-first writing workflow, Markdown ownership per post
            //     //   folder, and GitHub Pages deployment.
            //     // </Text>
            //     // <Button
            //     //   component="a"
            //     //   href="https://github.com/tongm/tongmon.github.io"
            //     //   leftSection={<IconArrowUpRight size={16} />}
            //     //   mt="md"
            //     //   rel="noreferrer"
            //     //   target="_blank"
            //     //   variant="light"
            //     // >
            //     //   View repository
            //     // </Button>
            //   }
            //   <Group gap="md" h="100%">
            //     <Box
            //       h="100%"
            //       style={{ aspectRatio: "1 / 1", flex: "0 0 auto" }}
            //     >
            //       <Image
            //         src={pixelateProfile}
            //         fit="cover"
            //         radius="md"
            //         h="100%"
            //         w="100%"
            //       />
            //     </Box>
            //     <Stack gap={0}>
            //       <Text
            //         renderRoot={(props) => <Link {...props} to="/" />}
            //         fw={600}
            //       >
            //         Tongstar
            //       </Text>
            //       <Text c="var(--app-muted)" size="sm">
            //         Focus on what you can control.
            //       </Text>
            //     </Stack>
            //   </Group>
            // </AppShell.Section>
          }
        </AppShell.Navbar>
      </RemoveScroll>

      <AppShell.Main pb="xl">
        <Container
          maw="var(--app-shell-max-width)"
          px={{ base: "0", md: "xl" }}
          size="100%"
        >
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
