import { useEffect } from "react";

interface NavigateToHashAnchorOptions {
  behavior?: ScrollBehavior;
  updateHistory?: boolean;
}

const ANCHOR_VIEWPORT_GAP_PX = 8;

function getHashAnchorOffset() {
  const probe = document.createElement("div");

  probe.style.position = "fixed";
  probe.style.top = `calc(var(--app-shell-header-offset, 0rem) + var(--mantine-spacing-md) + ${ANCHOR_VIEWPORT_GAP_PX}px)`;
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";

  document.body.appendChild(probe);

  const offset = Number.parseFloat(window.getComputedStyle(probe).top);

  probe.remove();

  return Number.isFinite(offset) ? offset : ANCHOR_VIEWPORT_GAP_PX;
}

export function getHashAnchorId(href?: string | null) {
  if (!href?.startsWith("#")) {
    return null;
  }

  const rawId = href.slice(1);

  if (!rawId) {
    return null;
  }

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

export function navigateToHashAnchor(
  href: string,
  options: NavigateToHashAnchorOptions = {},
) {
  const anchorId = getHashAnchorId(href);

  if (!anchorId) {
    return false;
  }

  const targetElement = document.getElementById(anchorId);

  if (!targetElement) {
    return false;
  }

  const { behavior = "smooth", updateHistory = true } = options;
  const offset = getHashAnchorOffset();
  const top =
    window.scrollY + targetElement.getBoundingClientRect().top - offset;

  if (updateHistory) {
    window.history.replaceState(null, "", `#${encodeURIComponent(anchorId)}`);
  }

  window.scrollTo({
    behavior,
    top: Math.max(top, 0),
  });

  return true;
}

export function useHashAnchorNavigation(trigger: string | null | undefined) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) {
      return;
    }

    let frameId = 0;
    let nestedFrameId = 0;
    let timeoutId = 0;

    const scrollToCurrentHash = () =>
      navigateToHashAnchor(window.location.hash, {
        behavior: "auto",
        updateHistory: false,
      });

    const scheduleScroll = () => {
      frameId = window.requestAnimationFrame(() => {
        nestedFrameId = window.requestAnimationFrame(() => {
          if (!scrollToCurrentHash()) {
            timeoutId = window.setTimeout(() => {
              scrollToCurrentHash();
            }, 120);
          }
        });
      });
    };

    const handleHashChange = () => {
      scheduleScroll();
    };

    scheduleScroll();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(nestedFrameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [trigger]);
}
