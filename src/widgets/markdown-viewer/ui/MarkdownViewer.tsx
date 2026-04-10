import {
  Anchor,
  Code,
  Typography,
  useComputedColorScheme,
} from "@mantine/core";
import { useReducedMotion } from "@mantine/hooks";
import type { MouseEvent } from "react";
import ReactMarkdown, {
  type Components,
  type UrlTransform,
} from "react-markdown";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  navigateToHashAnchor,
  useHashAnchorNavigation,
} from "@/shared/lib/useHashAnchorNavigation";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import classes from "./MarkdownViewer.module.css";

interface MarkdownViewerProps {
  markdown: string;
  postSlug: string;
}

const EXTERNAL_URL_PATTERN = /^(?:[a-z]+:|#|mailto:|tel:|data:)/i;

export default function MarkdownViewer({
  markdown,
  postSlug,
}: MarkdownViewerProps) {
  const colorScheme = useComputedColorScheme("light");
  const prefersReducedMotion = useReducedMotion();
  const syntaxTheme = colorScheme === "dark" ? oneDark : oneLight;
  const syntaxStyle = {
    ...syntaxTheme,
    ['code[class*="language-"]']: {
      ...syntaxTheme['code[class*="language-"]'],
      background: "transparent",
      fontFamily: "var(--mantine-font-family-monospace)",
    },
    ['pre[class*="language-"]']: {
      ...syntaxTheme['pre[class*="language-"]'],
      background: "var(--app-code-bg)",
      borderRadius: "1rem",
      fontSize: "0.92rem",
      margin: 0,
      padding: 0,
    },
  };

  const markdownComponents: Components = {
    a({ href, children, onClick, ...props }) {
      const isExternalLink = href?.startsWith("http");
      const isHashLink = href?.startsWith("#");

      const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || !isHashLink || !href) {
          return;
        }

        event.preventDefault();
        navigateToHashAnchor(href, {
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      };

      return (
        <Anchor
          {...props}
          href={href}
          onClick={handleClick}
          rel={isExternalLink ? "noreferrer" : undefined}
          target={isExternalLink ? "_blank" : undefined}
        >
          {children}
        </Anchor>
      );
    },
    pre({ children }) {
      return <>{children}</>;
    },
    code({ children, className, ...props }) {
      const match = /language-(\w+)/.exec(className ?? "");
      const language = match?.[1];
      const rawContent = String(children).replace(/\n$/, "");

      if (!language) {
        return (
          <Code {...props} color="brand.0">
            {rawContent}
          </Code>
        );
      }

      return (
        <SyntaxHighlighter
          className={classes.codeBlock}
          codeTagProps={{
            style: {
              background: "transparent",
              fontFamily: "var(--mantine-font-family-monospace)",
            },
          }}
          customStyle={{
            background: "var(--app-code-bg)",
            border: "1px solid var(--app-code-border)",
            borderRadius: "1rem",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
            fontSize: "0.92rem",
            margin: "1.5rem 0",
            padding: "1rem",
          }}
          language={language}
          style={syntaxStyle}
        >
          {rawContent}
        </SyntaxHighlighter>
      );
    },
  };

  const urlTransform: UrlTransform = (url) => {
    if (EXTERNAL_URL_PATTERN.test(url)) {
      return url;
    }

    const normalizedUrl = url.replace(/^\.?\//, "");

    return `${import.meta.env.BASE_URL}content/posts/${postSlug}/${normalizedUrl}`;
  };

  useHashAnchorNavigation(markdown);

  return (
    <Typography className={classes.prose}>
      <ReactMarkdown
        components={markdownComponents}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              content: {
                type: "text",
                value: "#",
              },
              properties: {
                ariaHidden: "true",
                style: "margin-left: 0.4rem; font-weight: 600;",
              },
            },
          ],
        ]}
        remarkPlugins={[remarkGfm]}
        urlTransform={urlTransform}
      >
        {markdown}
      </ReactMarkdown>
    </Typography>
  );
}
