import type { MouseEvent } from "react";
import { Anchor, Paper, Stack, Text } from "@mantine/core";
import { useReducedMotion } from "@mantine/hooks";
import type { PostHeading } from "@/entities/post";
import { useIsMobileViewport } from "@/shared/lib/useIsMobileViewport";
import { navigateToHashAnchor } from "@/shared/lib/useHashAnchorNavigation";

interface PostTableOfContentsProps {
  headings: PostHeading[];
}

const TOC_STICKY_TOP =
  "calc(var(--app-shell-header-offset, 0rem) + var(--mantine-spacing-md))";
const TOC_MAX_HEIGHT =
  "calc(100dvh - var(--app-shell-header-offset, 0rem) - var(--mantine-spacing-md) - var(--mantine-spacing-md))";

export default function PostTableOfContents({
  headings,
}: PostTableOfContentsProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const gap = isMobileViewport ? "xs" : "sm";

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
