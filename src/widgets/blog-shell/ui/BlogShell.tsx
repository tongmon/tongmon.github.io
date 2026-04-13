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
  Space,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useElementSize, useViewportSize } from "@mantine/hooks";
import { openSpotlight } from "@mantine/spotlight";
import {
  IconArrowBarRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconHash,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarLeftExpandFilled,
  IconMail,
  IconSearch,
  IconX,
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
  const currentSectionLabel = siteConfig.navigation.find((item) =>
    isHeaderNavigationItemActive(location.pathname, item.href),
  )?.label;

  useBodyScrollbarRequirementState(isBodyScrollable);
  useScrollbarWidth();

  return (
    <AppShell
      ref={shellRef}
      header={{ height: 76 }}
      navbar={{
        breakpoint: "md",
        width: "var(--app-nav-width)",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      transitionDuration={150}
      layout="alt"
    >
      <ScrollRestoration />
      <PostSpotlight />
      <RemoveScroll enabled={isMobileNavbarOpened} removeScrollBar={false}>
        <AppShell.Header
          // bg="transparent"
          style={{
            backdropFilter: "blur(18px)",
          }}
          pr={isBodyScrollable ? 0 : "var(--app-scrollbar-width)"}
        >
          <Container h="100%" size="100%">
            <Group h="100%" justify="space-between">
              <ActionIcon
                aria-label={"nav-close"}
                onClick={toggle}
                radius="xl"
                size="lg"
                variant="default"
                hiddenFrom="md"
              >
                <IconLayoutSidebarLeftExpandFilled size={18} />
              </ActionIcon>

              <Group
                gap="xs"
                visibleFrom="md"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                pr={isBodyScrollable ? 0 : "var(--app-scrollbar-width)"}
              >
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

              <Group hiddenFrom="md" justify="center">
                {currentSectionLabel ? (
                  <Text fw={700} size="xl" ta="center">
                    {currentSectionLabel}
                  </Text>
                ) : null}
              </Group>

              <Group gap="xs" visibleFrom="md" justify="flex-end" ml="auto">
                <ActionIcon
                  aria-label="Search posts"
                  onClick={openSpotlight}
                  radius="xl"
                  size="lg"
                  variant="default"
                >
                  <IconSearch size={18} />
                </ActionIcon>
                <ThemeToggle />
              </Group>

              <ActionIcon
                aria-label="Search posts"
                onClick={openSpotlight}
                radius="xl"
                size="lg"
                variant="default"
                hiddenFrom="md"
              >
                <IconSearch size={18} />
              </ActionIcon>
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
          bd={isMobileViewport ? "transparent" : undefined}
        >
          <AppShell.Section grow style={{ display: "flex", minHeight: 0 }}>
            <Stack p={0} w="100%">
              <Group gap="md" justify="flex-end" wrap="wrap" hiddenFrom="md">
                <ActionIcon
                  aria-label={"nav-close"}
                  onClick={toggle}
                  radius="xl"
                  size="lg"
                  variant="default"
                >
                  <IconX size={18} />
                </ActionIcon>
              </Group>
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
                <Stack gap={0} align="center" mb="xl">
                  <Avatar
                    src={pixelateProfile}
                    alt="it's me"
                    size="xl"
                    mb="xs"
                    renderRoot={(props) => <Link {...props} to="/" />}
                    onClick={close}
                  />
                  <Text fw={600}>Tongstar</Text>
                  <Text c="var(--app-muted)" size="sm">
                    Focus on what you can control.
                  </Text>
                </Stack>
                <Stack gap="xs" mb="xs" hiddenFrom="md">
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
            </Stack>
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
