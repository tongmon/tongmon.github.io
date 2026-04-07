import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { z } from "zod";

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

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: isoDateWithTimezone,
  updatedAt: isoDateWithTimezone.optional(),
  tags: z.array(z.string().min(1)).min(1),
  category: z.string().min(1).optional(),
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
  category?: string;
  thumbnail?: string;
  draft: boolean;
  series?: string;
  seriesOrder?: number;
  readingTime: number;
  contentPath: string;
}

function ensureDirectory(directoryPath: string) {
  fs.mkdirSync(directoryPath, { recursive: true });
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

function estimateReadingTime(markdown: string) {
  const textOnly = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_\-\n]/g, " ");
  const words = textOnly
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return Math.max(1, Math.round(words.length / 220));
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

  return fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(postsDirectory, entry.name));
}

function getPostManifestRecord(postDirectory: string): PostManifestRecord {
  const slug = path.basename(postDirectory);
  const markdownFile = path.join(postDirectory, "index.md");

  if (!fs.existsSync(markdownFile)) {
    throw new Error(`Missing index.md for post "${slug}"`);
  }

  const rawMarkdown = fs.readFileSync(markdownFile, "utf8");
  const { data, content } = matter(rawMarkdown);
  const frontmatter = frontmatterSchema.parse(data) satisfies Frontmatter;

  if (frontmatter.slug && frontmatter.slug !== slug) {
    throw new Error(
      `Frontmatter slug "${frontmatter.slug}" does not match folder slug "${slug}"`,
    );
  }

  if (frontmatter.thumbnail) {
    assertAssetExists(
      postDirectory,
      normalizeRelativeAssetPath(frontmatter.thumbnail),
    );
  }

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    tags: frontmatter.tags,
    category: frontmatter.category,
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

function writeGeneratedManifest(records: PostManifestRecord[]) {
  const fileContents = `import type { PostManifestEntry } from "@/entities/post";

export const postsManifest: PostManifestEntry[] = ${JSON.stringify(records, null, 2)};
`;

  ensureDirectory(generatedDirectory);
  fs.writeFileSync(generatedManifestFile, fileContents);
}

function main() {
  const postDirectories = collectPostDirectories();
  const manifestRecords = postDirectories.map(getPostManifestRecord);

  ensureDirectory(publicPostsDirectory);
  fs.rmSync(publicPostsDirectory, { recursive: true, force: true });
  ensureDirectory(publicPostsDirectory);

  for (const postDirectory of postDirectories) {
    copyPostContentDirectory(postDirectory, path.basename(postDirectory));
  }

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
