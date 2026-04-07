const FRONTMATTER_PATTERN =
  /^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

export function stripMarkdownFrontmatter(markdown: string) {
  return markdown.replace(FRONTMATTER_PATTERN, "");
}
