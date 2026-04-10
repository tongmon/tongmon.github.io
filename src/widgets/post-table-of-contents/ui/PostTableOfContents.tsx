import { useEffect, type MouseEvent } from "react";
import { Anchor, Paper, Stack, Text } from "@mantine/core";
import {
  useReducedMotion,
  useScrollSpy,
  useWindowScroll,
} from "@mantine/hooks";
import type { PostHeading } from "@/entities/post";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";
import {
  getHashAnchorOffset,
  navigateToHashAnchor,
} from "@/shared/lib/useHashAnchorNavigation";

interface PostTableOfContentsProps {
  headings: PostHeading[];
}

const TOC_STICKY_TOP =
  "calc(var(--app-shell-header-offset, 0rem) + var(--mantine-spacing-md))";
const TOC_MAX_HEIGHT =
  "calc(100dvh - var(--app-shell-header-offset, 0rem) - var(--mantine-spacing-md) - var(--mantine-spacing-md))";
const TOC_ACTIVE_TOP_TOLERANCE_PX = 12;

export default function PostTableOfContents({
  headings,
}: PostTableOfContentsProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const [{ y: scrollY }] = useWindowScroll();
  const gap = isMobileViewport ? "xs" : "sm";
  const headingSelector =
    headings.map((heading) => `#${heading.id}`).join(", ") ||
    "[data-post-content-root]";
  const scrollSpy = useScrollSpy({
    offset: getHashAnchorOffset(),
    selector: headingSelector,
  });

  useEffect(() => {
    scrollSpy.reinitialize();
  }, [headingSelector]);

  if (headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (
    event: MouseEvent<HTMLAnchorElement>,
    headingId: string,
  ) => {
    event.preventDefault();
    navigateToHashAnchor(`#${headingId}`, {
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const contentRoot = document.querySelector<HTMLElement>(
    "[data-post-content-root]",
  );
  const firstHeadingElement = document.getElementById(headings[0]?.id);
  const scrollThreshold = scrollY + getHashAnchorOffset();
  const contentTop = firstHeadingElement
    ? window.scrollY + firstHeadingElement.getBoundingClientRect().top
    : Number.POSITIVE_INFINITY;
  const contentBottom = contentRoot
    ? window.scrollY + contentRoot.getBoundingClientRect().bottom
    : Number.NEGATIVE_INFINITY;
  const isWithinContentRange =
    scrollThreshold >= contentTop - TOC_ACTIVE_TOP_TOLERANCE_PX &&
    scrollThreshold < contentBottom;
  const activeHeadingId =
    isWithinContentRange && scrollSpy.active >= 0
      ? (headings[scrollSpy.active]?.id ?? null)
      : null;

  return (
    <Paper
      bg="var(--app-surface-1)"
      p={{ base: "md", md: "lg" }}
      shadow="sm"
      style={{
        border: "1px solid var(--app-muted-border)",
        maxHeight: TOC_MAX_HEIGHT,
        overflowY: "auto",
        position: "sticky",
        top: TOC_STICKY_TOP,
      }}
    >
      <Stack gap={gap}>
        <Text fw={700}>On this page</Text>
        {headings.map((heading) => (
          <Anchor
            c="var(--app-muted)"
            aria-current={
              activeHeadingId === heading.id ? "location" : undefined
            }
            fw={activeHeadingId === heading.id ? 700 : 400}
            href={`#${heading.id}`}
            key={heading.id}
            onClick={(event) => handleHeadingClick(event, heading.id)}
            size="sm"
            style={{ paddingLeft: heading.depth === 3 ? "1rem" : undefined }}
            underline="never"
          >
            {heading.value}
          </Anchor>
        ))}
      </Stack>
    </Paper>
  );
}
