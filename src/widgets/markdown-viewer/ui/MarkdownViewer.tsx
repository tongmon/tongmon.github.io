import { Anchor, Code, Typography, useComputedColorScheme } from "@mantine/core";
import ReactMarkdown, { type Components, type UrlTransform } from "react-markdown";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
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

  const markdownComponents: Components = {
    a({ href, children, ...props }) {
      const isExternalLink = href?.startsWith("http");

      return (
        <Anchor
          {...props}
          href={href}
          rel={isExternalLink ? "noreferrer" : undefined}
          target={isExternalLink ? "_blank" : undefined}
        >
          {children}
        </Anchor>
      );
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
          customStyle={{
            background: "var(--app-code-bg)",
            borderRadius: "1rem",
            fontSize: "0.92rem",
            margin: "1.5rem 0",
            padding: "1rem",
          }}
          language={language}
          PreTag="div"
          style={colorScheme === "dark" ? oneDark : oneLight}
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
