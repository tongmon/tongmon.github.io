import { toKebabCase } from "@/shared/lib/text/toKebabCase";

export function getPostPath(slug: string) {
  return `/posts/${slug}`;
}

export function getPostsPath() {
  return "/posts";
}

export function getSeriesPath() {
  return "/series";
}

export function getSeriesDetailPath(series: string) {
  return `/series/${encodeURIComponent(toKebabCase(series))}`;
}

export function getTagPath(tag: string) {
  return `/tags/${encodeURIComponent(toKebabCase(tag))}`;
}

export function getAboutPath() {
  return "/about";
}
