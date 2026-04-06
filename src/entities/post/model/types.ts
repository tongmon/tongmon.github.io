export interface PostManifestEntry {
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

export interface PostHeading {
  depth: number;
  id: string;
  value: string;
}

export interface LoadedPost extends PostManifestEntry {
  content: string;
  headings: PostHeading[];
}

export interface TagSummary {
  count: number;
  label: string;
  slug: string;
}

export interface SeriesSummary {
  count: number;
  label: string;
  slug: string;
}
