import { useEffect, useRef } from "react";
import { Box, useComputedColorScheme } from "@mantine/core";
import { siteConfig } from "@/shared/config/site";

const GISCUS_ORIGIN = "https://giscus.app";
const GISCUS_CLIENT_URL = `${GISCUS_ORIGIN}/client.js`;

interface GiscusCommentsProps {
  onCommentCountChange?: (count: number) => void;
  pageKey: string;
}

function postGiscusMessage(message: Record<string, unknown>) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );

  iframe?.contentWindow?.postMessage({ giscus: message }, GISCUS_ORIGIN);
}

interface GiscusMessageEventData {
  giscus?: {
    discussion?: {
      totalCommentCount?: number;
    };
  };
}

export default function GiscusComments({
  onCommentCountChange,
  pageKey,
}: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorScheme = useComputedColorScheme("light");
  const themeRef = useRef<string>(siteConfig.giscus.lightTheme);
  const giscus = siteConfig.giscus;

  themeRef.current =
    colorScheme === "dark" ? giscus.darkTheme : giscus.lightTheme;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    onCommentCountChange?.(0);
    container.innerHTML = "";

    const script = document.createElement("script");

    script.src = GISCUS_CLIENT_URL;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", giscus.repo);
    script.setAttribute("data-repo-id", giscus.repoId);
    script.setAttribute("data-category", giscus.category);
    script.setAttribute("data-category-id", giscus.categoryId);
    script.setAttribute("data-mapping", giscus.mapping);
    script.setAttribute("data-strict", giscus.strict);
    script.setAttribute("data-reactions-enabled", giscus.reactionsEnabled);
    script.setAttribute("data-emit-metadata", giscus.emitMetadata);
    script.setAttribute("data-input-position", giscus.inputPosition);
    script.setAttribute("data-theme", themeRef.current);
    script.setAttribute("data-lang", giscus.lang);
    script.setAttribute("data-loading", giscus.loading);

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [giscus, onCommentCountChange, pageKey]);

  useEffect(() => {
    postGiscusMessage({
      setConfig: {
        theme: themeRef.current,
      },
    });
  }, [colorScheme]);

  useEffect(() => {
    if (!onCommentCountChange) {
      return;
    }

    const handleMessage = (event: MessageEvent<GiscusMessageEventData>) => {
      if (event.origin !== GISCUS_ORIGIN) {
        return;
      }

      const totalCommentCount =
        event.data?.giscus?.discussion?.totalCommentCount;

      if (typeof totalCommentCount === "number") {
        onCommentCountChange(totalCommentCount);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onCommentCountChange]);

  return (
    <Box
      className="giscus"
      ref={containerRef}
      style={{ minHeight: 200, width: "100%" }}
    />
  );
}
