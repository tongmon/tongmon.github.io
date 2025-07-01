import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { GridView } from "../../user_interface/grid_view/GridView";
import { SkeletonCard } from "./skeleton_card/SkeletonCard";
import classes from "./PostGridView.module.css";

// url, {posts, page, hasMore}
var postGridCache = new Map();

export function PostGridView({ node }) {
  const location = useLocation();
  const [posts, setPosts] = useState(
    postGridCache.has(location.pathname)
      ? postGridCache.get(location.pathname).posts
      : []
  );
  const [page, setPage] = useState(
    postGridCache.has(location.pathname)
      ? postGridCache.get(location.pathname).page
      : 0
  );
  const [hasMore, setHasMore] = useState(
    postGridCache.has(location.pathname)
      ? postGridCache.get(location.pathname).hasMore
      : true
  );
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.5 });

  // init
  useEffect(() => {
    if (!postGridCache.has(location.pathname)) {
      postGridCache.set(location.pathname, {
        posts: [],
        viewPosts: [],
        page: 0,
        hasMore: true,
      });
    }
    setPosts(postGridCache.get(location.pathname).posts);
    setPage(postGridCache.get(location.pathname).page);
    setHasMore(postGridCache.get(location.pathname).hasMore);
  }, [location.pathname]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => {
        postGridCache.get(location.pathname).page = prev + 1;
        return prev + 1;
      });
    }
  }, [inView, hasMore, loading]);

  const loadPosts = useCallback(async () => {
    // async function SetPostList(node, postList) {
    //   if (node.isLeaf) {
    //     let postInfo = null;
    //     let postThunbnail = null;
    //     for (const child of node.children) {
    //       if (child.label.includes("post_info")) {
    //         postInfo = await child.module().then((m) => m.default);
    //       } else if (child.label.includes("thumbnail")) {
    //         const thumbnailModule = await child.module();
    //         postThunbnail = thumbnailModule.default;
    //       }
    //     }
    //     if (postInfo) {
    //       postInfo["node"] = node;
    //       if (postThunbnail) {
    //         postInfo["thumbnail"] = postThunbnail;
    //       }
    //       postList.push(postInfo);
    //     }
    //     return;
    //   }
    //   for (const child of node.children) {
    //     await SetPostList(child, postList);
    //   }
    // }
    // setLoading(true);
    // const newPosts = await fetchPosts(page, pageSize);
    // setPosts((prev) => [...prev, ...newPosts]);
    // if (newPosts.length < pageSize) setHasMore(false);
    // setLoading(false);
  }, [page, location.pathname]);

  useEffect(() => {
    if (page === 0 || hasMore) loadPosts();
  }, [page, loadPosts]);

  /* 
  var postList = [];

  function fetchPosts(page, size) {
    async function SetPostList(node, postList) {
      if (node.isLeaf) {
        let postInfo = null;
        let postThunbnail = null;
        for (const child of node.children) {
          if (child.label === "post_info.json") {
            postInfo = await child.module().then((m) => m.default);
          } else if (child.label.includes("thumbnail")) {
            const thumbnailModule = await child.module();
            postThunbnail = thumbnailModule.default;
          }
        }
        if (postInfo) {
          postInfo["node"] = node;
          if (postThunbnail) {
            postInfo["thumbnail"] = postThunbnail;
          }
          postList.push(postInfo);
        }
        return;
      }

      for (const child of node.children) {
        await SetPostList(child, postList);
      }
    }

    postList.length = 0;
    SetPostList(node, postList).then(() => {
      postList.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("postList: ", postList);
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        const start = page * size;
        const end = start + size;
        resolve(postList.slice(start, end));
      }, 500); // simulate delay
    });
  }
  */

  const fetchPosts = useCallback(() => {
    async function SetPostList(node, postList) {
      if (node.isLeaf) {
        let postInfo = null;
        let postThunbnail = null;
        for (const child of node.children) {
          if (child.label === "post_info.json") {
            postInfo = await child.module().then((m) => m.default);
          } else if (child.label.includes("thumbnail")) {
            const thumbnailModule = await child.module();
            postThunbnail = thumbnailModule.default;
          }
        }
        if (postInfo) {
          postInfo["node"] = node;
          if (postThunbnail) {
            postInfo["thumbnail"] = postThunbnail;
          }
          postList.push(postInfo);
        }
        return;
      }

      for (const child of node.children) {
        await SetPostList(child, postList);
      }
    }

    return new Promise((resolve) => {
      if (postGridCache.get(location.pathname).posts.length === 0) {
        SetPostList(node, postGridCache.get(location.pathname).posts).then(
          () => {
            postGridCache
              .get(location.pathname)
              .posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            resolve(postGridCache.get(location.pathname).posts);
          }
        );
      } else {
        // If posts are already fetched, resolve immediately
        resolve(postGridCache.get(location.pathname).posts);
      }
    });
  }, [node]);

  /*
  const fetchPosts = useCallback(
    (page, size) => {
      const postList = [];

      async function SetPostList(node) {
        if (node.isLeaf) {
          let postInfo = null;
          let postThunbnail = null;
          for (const child of node.children) {
            if (child.label === "post_info.json") {
              postInfo = await child.module().then((m) => m.default);
            } else if (child.label.includes("thumbnail")) {
              const thumbnailModule = await child.module();
              postThunbnail = thumbnailModule.default;
            }
          }
          if (postInfo) {
            postInfo["node"] = node;
            if (postThunbnail) {
              postInfo["thumbnail"] = postThunbnail;
            }
            postList.push(postInfo);
          }
          return;
        }

        for (const child of node.children) {
          await SetPostList(child, postList);
        }
      }

      return new Promise((resolve) => {
        SetPostList(node).then(() => {
          postList.sort((a, b) => new Date(b.date) - new Date(a.date));
          const start = page * size;
          const end = start + size;
          resolve(postList.slice(start, end));
        });
      });
    },
    [node]
  );
  */

  return (
    <>
      <p className={classes["post-grid-view-title"]}>{node.label}</p>
      <div className={classes["grid-container"]}>
        {posts.map((post, idx) => (
          <div className={classes["card"]} key={idx}>
            <img
              src={post.thumbnail}
              alt="thumbnail"
              className={classes["card-thumbnail"]}
              loading="lazy"
            />
            <div className={classes["card-content"]}>
              <h3 className={classes["card-title"]}>{post.title}</h3>
              <p className={classes["card-summary"]}>{post.summary}</p>
              <p className={classes["card-date"]}>{post.date}</p>
            </div>
          </div>
        ))}

        {loading &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {hasMore && <div ref={ref} style={{ height: "1px" }} />}
      </div>
    </>
  );
}
