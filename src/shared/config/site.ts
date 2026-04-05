export const siteConfig = {
  title: "Tongmon Notes",
  description:
    "A static personal blog about frontend systems, product-minded engineering, and the small decisions that make interfaces feel finished.",
  author: "Tongmon",
  about:
    "I design and ship frontend systems with a bias for clarity, resilient architecture, and calm interfaces that still have a point of view.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    { label: "About", href: "/about" },
  ],
} as const;
