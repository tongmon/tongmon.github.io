import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { BlogShell } from "@/widgets/blog-shell";

// const HomePage = lazy(() =>
//   import("@/pages/home").then((module) => ({ default: module.HomePage })),
// );
const PostListPage = lazy(() =>
  import("@/pages/post-list").then((module) => ({
    default: module.PostListPage,
  })),
);
const SeriesPage = lazy(() =>
  import("@/pages/series").then((module) => ({ default: module.SeriesPage })),
);
const SeriesDetailPage = lazy(() =>
  import("@/pages/series-detail").then((module) => ({
    default: module.SeriesDetailPage,
  })),
);
const PostDetailPage = lazy(() =>
  import("@/pages/post-detail").then((module) => ({
    default: module.PostDetailPage,
  })),
);
const TagPage = lazy(() =>
  import("@/pages/tag").then((module) => ({ default: module.TagPage })),
);
const AboutPage = lazy(() =>
  import("@/pages/about").then((module) => ({ default: module.AboutPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((module) => ({
    default: module.NotFoundPage,
  })),
);

const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <BlogShell />,
      children: [
        {
          index: true,
          element: <PostListPage />,
        },
        {
          path: "posts",
          element: <PostListPage />,
        },
        {
          path: "series",
          element: <SeriesPage />,
        },
        {
          path: "series/:series",
          element: <SeriesDetailPage />,
        },
        {
          path: "posts/:slug",
          element: <PostDetailPage />,
        },
        {
          path: "tags/:tag",
          element: <TagPage />,
        },
        {
          path: "about",
          element: <AboutPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default appRouter;
