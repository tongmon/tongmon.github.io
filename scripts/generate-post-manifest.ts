import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { z } from "zod";
import { estimateReadingTime } from "./lib/estimate-reading-time";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(__dirname, "..");
const postsDirectory = path.join(rootDirectory, "content", "posts");
const publicPostsDirectory = path.join(
  rootDirectory,
  "public",
  "content",
  "posts",
);
const generatedDirectory = path.join(
  rootDirectory,
  "src",
  "shared",
  "generated",
);
const generatedManifestFile = path.join(
  generatedDirectory,
  "posts-manifest.ts",
);
const includeDrafts = process.argv.includes("--include-drafts");
const descriptionExcerptMaxLength = 180;

const isoDateWithTimezone = z.preprocess(
  (value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  },
  z
    .string()
    .refine(
      (value) =>
        Number.isNaN(Date.parse(value)) === false &&
        /(Z|[+-]\d{2}:\d{2})$/.test(value),
      "Expected an ISO datetime with timezone",
    ),
);

const optionalDescription = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    return value;
  },
  z.string().trim().min(1).optional(),
);

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: optionalDescription,
  publishedAt: isoDateWithTimezone,
  updatedAt: isoDateWithTimezone.optional(),
  tags: z.array(z.string().min(1)).min(1),
  thumbnail: z.string().min(1).optional(),
  draft: z.boolean().optional().default(false),
  series: z.string().min(1).optional(),
  seriesOrder: z.number().int().positive().optional(),
  slug: z.string().min(1).optional(),
});

type Frontmatter = z.infer<typeof frontmatterSchema>;

interface PostManifestRecord {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  thumbnail?: string;
  draft: boolean;
  series?: string;
  seriesOrder?: number;
  readingTime: number;
  contentPath: string;
}

interface CollectedPost {
  postDirectory: string;
  record: PostManifestRecord;
}

interface MarkdownTextNode {
  children?: MarkdownTextNode[];
  type: string;
  value?: unknown;
}

function ensureDirectory(directoryPath: string) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function toPosixRelativePath(targetPath: string) {
  return path.relative(rootDirectory, targetPath).split(path.sep).join("/");
}

function normalizeRelativeAssetPath(assetPath: string) {
  const normalizedPath = assetPath.replace(/\\/g, "/");
  const cleanedPath = path.posix.normalize(normalizedPath);

  if (
    cleanedPath.startsWith("/") ||
    cleanedPath.startsWith("../") ||
    cleanedPath.includes("/../")
  ) {
    throw new Error(`Asset path "${assetPath}" escapes the post directory`);
  }

  return cleanedPath;
}

function normalizeSlug(slug: string) {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new Error("Post slug cannot be empty");
  }

  if (/[\\/]/.test(normalizedSlug)) {
    throw new Error(
      `Post slug "${slug}" must stay flat and cannot contain path separators`,
    );
  }

  return normalizedSlug;
}

function normalizeDescriptionText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function truncateDescriptionText(text: string) {
  if (text.length <= descriptionExcerptMaxLength) {
    return text;
  }

  const roughExcerpt = text.slice(0, descriptionExcerptMaxLength).trimEnd();
  const lastWhitespaceIndex = roughExcerpt.lastIndexOf(" ");
  const minimumWordBoundaryIndex = Math.floor(descriptionExcerptMaxLength * 0.6);
  const excerpt =
    lastWhitespaceIndex >= minimumWordBoundaryIndex
      ? roughExcerpt.slice(0, lastWhitespaceIndex)
      : roughExcerpt;

  return `${excerpt.replace(/[.,;:!?]+$/, "")}...`;
}

function getReadableInlineText(node: MarkdownTextNode): string {
  if (node.type === "text" || node.type === "inlineCode") {
    return typeof node.value === "string" ? node.value : "";
  }

  if (node.type === "image" || node.type === "imageReference") {
    return "";
  }

  if (node.type === "break") {
    return " ";
  }

  return node.children?.map(getReadableInlineText).join("") ?? "";
}

function createDescriptionExcerpt(markdown: string, postDirectory: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  let excerpt = "";

  visit(tree, "paragraph", (node) => {
    if (excerpt) {
      return;
    }

    const paragraphText = normalizeDescriptionText(
      getReadableInlineText(node as MarkdownTextNode),
    );

    if (paragraphText) {
      excerpt = truncateDescriptionText(paragraphText);
    }
  });

  if (!excerpt) {
    throw new Error(
      `Missing description in ${toPosixRelativePath(
        postDirectory,
      )} and no body paragraph was found to use as an excerpt`,
    );
  }

  return excerpt;
}

function assertAssetExists(postDirectory: string, assetPath: string) {
  const filePath = path.join(postDirectory, assetPath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing asset "${assetPath}" in ${postDirectory}`);
  }
}

function copyPostContentDirectory(sourceDirectory: string, slug: string) {
  const targetDirectory = path.join(publicPostsDirectory, slug);

  fs.cpSync(sourceDirectory, targetDirectory, {
    recursive: true,
    force: true,
  });
}

function collectPostDirectories() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  function visit(directoryPath: string): string[] {
    const entries = fs
      .readdirSync(directoryPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    const nestedDirectories = entries
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => visit(path.join(directoryPath, entry.name)));
    const markdownFile = path.join(directoryPath, "index.md");

    if (fs.existsSync(markdownFile)) {
      return [directoryPath, ...nestedDirectories];
    }

    return nestedDirectories;
  }

  return visit(postsDirectory);
}

function getPostManifestRecord(postDirectory: string): PostManifestRecord {
  const markdownFile = path.join(postDirectory, "index.md");

  if (!fs.existsSync(markdownFile)) {
    throw new Error(
      `Missing index.md for post "${toPosixRelativePath(postDirectory)}"`,
    );
  }

  const rawMarkdown = fs.readFileSync(markdownFile, "utf8");
  const { data, content } = matter(rawMarkdown);
  const frontmatter = frontmatterSchema.parse(data) satisfies Frontmatter;
  const slug = normalizeSlug(frontmatter.slug ?? path.basename(postDirectory));
  const description =
    frontmatter.description ?? createDescriptionExcerpt(content, postDirectory);

  if (frontmatter.thumbnail) {
    assertAssetExists(
      postDirectory,
      normalizeRelativeAssetPath(frontmatter.thumbnail),
    );
  }

  return {
    slug,
    title: frontmatter.title,
    description,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    tags: frontmatter.tags,
    thumbnail: frontmatter.thumbnail
      ? path.posix.join(
          "content",
          "posts",
          slug,
          normalizeRelativeAssetPath(frontmatter.thumbnail),
        )
      : undefined,
    draft: frontmatter.draft,
    series: frontmatter.series,
    seriesOrder: frontmatter.seriesOrder,
    readingTime: estimateReadingTime(content),
    contentPath: path.posix.join("content", "posts", slug, "index.md"),
  };
}

function assertUniqueSlugs(posts: CollectedPost[]) {
  const postsBySlug = new Map<string, CollectedPost>();

  for (const post of posts) {
    const existingPost = postsBySlug.get(post.record.slug);

    if (existingPost) {
      throw new Error(
        [
          `Duplicate post slug "${post.record.slug}" detected.`,
          `- ${toPosixRelativePath(existingPost.postDirectory)}`,
          `- ${toPosixRelativePath(post.postDirectory)}`,
          'Use a unique frontmatter "slug" for one of these posts.',
        ].join("\n"),
      );
    }

    postsBySlug.set(post.record.slug, post);
  }
}

function writeGeneratedManifest(records: PostManifestRecord[]) {
  const fileContents = `import type { PostManifestEntry } from "@/entities/post";

export const postsManifest: PostManifestEntry[] = ${JSON.stringify(records, null, 2)};
`;

  ensureDirectory(generatedDirectory);
  fs.writeFileSync(generatedManifestFile, fileContents);
}

function main() {
  const postDirectories = collectPostDirectories();
  const collectedPosts = postDirectories.map((postDirectory) => ({
    postDirectory,
    record: getPostManifestRecord(postDirectory),
  }));

  assertUniqueSlugs(collectedPosts);

  ensureDirectory(publicPostsDirectory);
  fs.rmSync(publicPostsDirectory, { recursive: true, force: true });
  ensureDirectory(publicPostsDirectory);

  for (const post of collectedPosts) {
    copyPostContentDirectory(post.postDirectory, post.record.slug);
  }

  const manifestRecords = collectedPosts.map((post) => post.record);

  const filteredRecords = manifestRecords
    .filter((record) => includeDrafts || record.draft === false)
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    );

  writeGeneratedManifest(filteredRecords);
}

main();
