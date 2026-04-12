import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { PostHeading } from "@/entities/post";

interface MarkdownHeadingNode {
  depth: number;
  children: Array<Record<string, unknown>>;
}

export function extractMarkdownHeadings(markdown: string): PostHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];

  visit(tree, "heading", (node) => {
    const headingNode = node as unknown as MarkdownHeadingNode;

    // if (headingNode.depth < 2 || headingNode.depth > 3) {
    //   return;
    // }

    const value = toString({
      children: headingNode.children,
      type: "root",
    }).trim();

    if (!value) {
      return;
    }

    headings.push({
      depth: headingNode.depth,
      id: slugger.slug(value),
      value,
    });
  });

  return headings;
}
