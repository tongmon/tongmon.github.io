import { getAboutPath, getPostsPath, getSeriesPath } from "@/shared/lib/routes";

export const siteConfig = {
  title: "Tongstar Notes",
  description:
    "A static personal blog about frontend systems, product-minded engineering, and the small decisions that make interfaces feel finished.",
  author: "Tongmon",
  about:
    "I design and ship frontend systems with a bias for clarity, resilient architecture, and calm interfaces that still have a point of view.",
  contactLinks: [
    {
      kind: "linkedin",
      label: "Open LinkedIn profile",
      href: "https://www.linkedin.com/in/kjl19970309",
    },
    {
      kind: "github",
      label: "Open GitHub profile",
      href: "https://github.com/tongmon",
    },
    {
      kind: "email",
      label: "Send email",
      href: "mailto:tongmon@hanmail.net",
    },
  ],
  navigation: [
    { label: "Posts", href: getPostsPath() },
    { label: "Series", href: getSeriesPath() },
    { label: "About", href: getAboutPath() },
  ],
} as const;
