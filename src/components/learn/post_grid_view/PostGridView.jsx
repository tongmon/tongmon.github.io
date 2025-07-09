import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { GridView } from "../../user_interface/grid_view/GridView";
import { SkeletonCard } from "./skeleton_card/SkeletonCard";
import classes from "./PostGridView.module.css";
import { a } from "framer-motion/client";

// url, {posts, page, hasMore}
var postGridCache = new Map();

export function PostGridView({ postList }) {
  const location = useLocation();
  const gridTitle = location.pathname.split("/").map(decodeURIComponent).at(-1);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadSize, setLoadSize] = useState(12);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const maximumLoadSize = 12; // Maximum number of posts to load at once

  if (!postGridCache.has(location.pathname)) {
    postGridCache.set(location.pathname, {
      posts: [],
      page: 0,
      hasMore: true,
      loading: false,
      loadSize:
        postList.length < maximumLoadSize ? postList.length : maximumLoadSize,
    });
  }

  const loadPosts = async () => {
    setLoading(true);
    const start =
      postGridCache.get(location.pathname).page *
      postGridCache.get(location.pathname).loadSize;
    const end = Math.min(
      start + postGridCache.get(location.pathname).loadSize,
      postList.length
    );
    console.log("Loading posts from", start, "to", end);
    for (let i = start; i < end; i++) {
      let postNode = postList[i];
      let postInfo = { date: postNode.date };
      for (const child of postNode.children) {
        if (child.label.includes("post_info")) {
          const jsonInfo = await child.module().then((m) => m.default);
          postInfo = { ...postInfo, ...jsonInfo };
        } else if (child.label.includes("thumbnail")) {
          const thumbnailImg = await child.module().then((m) => m.default);
          postInfo["thumbnail"] = thumbnailImg;
        }
      }
      postGridCache.get(location.pathname).posts.push(postInfo);
    }
    setPosts(postGridCache.get(location.pathname).posts); // could be the timing problem
    if (end - start < maximumLoadSize) {
      setHasMore(() => {
        postGridCache.get(location.pathname).hasMore = false;
        return false;
      });
      setLoadSize(() => {
        postGridCache.get(location.pathname).loadSize = end - start;
        return postGridCache.get(location.pathname).loadSize;
      });
    }
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await sleep(1000); // Simulate network delay
    setLoading(false);
  };

  useEffect(() => {
    console.log("PostGridView cache:", postGridCache);
    setPosts(postGridCache.get(location.pathname).posts);
    setHasMore(postGridCache.get(location.pathname).hasMore);
    setLoadSize(postGridCache.get(location.pathname).loadSize);
  }, [location.pathname]);

  //useEffect(() => {
  //  if (!postGridCache.has(location.pathname)) {
  //    postGridCache.set(location.pathname, {
  //      posts: [],
  //      page: 0,
  //      hasMore: true,
  //    });
  //  }

  //  setPosts(postGridCache.get(location.pathname).posts);
  //  setPage(postGridCache.get(location.pathname).page);
  //  setHasMore(postGridCache.get(location.pathname).hasMore);

  //  console.log("PostGridView cache:", postGridCache);
  //}, [location.pathname]);

  // 처음 로딩이 되는 시점에
  // hasmore true -> useEffect triggered -> loadposts called -> setloading false -> loadposts called
  useEffect(() => {
    console.log(
      "Inview",
      inView,
      "hasMore",
      hasMore,
      "loading",
      loading,
      postGridCache
    );
    if (inView && hasMore && !loading) {
      loadPosts();
      postGridCache.get(location.pathname).page += 1;
    }
  }, [inView, hasMore, loading]);

  // useEffect(() => {
  //   if ((page === 0 || hasMore) && posts.length < (page + 1) * loadSize) {
  //     console.log("Loading posts for page:", page);
  //     loadPosts();
  //   }
  // }, [page]);

  return (
    <>
      <p className={classes["post-grid-view-title"]}>{gridTitle}</p>
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
              <p className={classes["card-date"]}>
                {post.date.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        ))}

        {loading &&
          Array.from({ length: loadSize }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {hasMore && <div ref={ref} style={{ height: "1px" }} />}
      </div>
    </>
  );
}

/*
export function PostGridView({ postList }) {
  console.log("test PostGridView log");

  const location = useLocation();
  const gridTitle = location.pathname.split("/").map(decodeURIComponent).at(-1);
  const loadSize = 12; // Number of posts to load per page
  let skeletonCount = loadSize;
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
        page: 0,
        hasMore: true,
      });
    }
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
    setLoading(true);
    const start = page * loadSize;
    const end = Math.min(start + loadSize, postList.length);
    for (let i = start; i < end; i++) {
      let postNode = postList[i];
      let postInfo = { date: postNode.date };
      for (const child of postNode.children) {
        if (child.label.includes("post_info")) {
          const jsonInfo = await child.module().then((m) => m.default);
          postInfo = { ...postInfo, ...jsonInfo };
        } else if (child.label.includes("thumbnail")) {
          const thumbnailImg = await child.module().then((m) => m.default);
          postInfo["thumbnail"] = thumbnailImg;
        }
      }
      postGridCache.get(location.pathname).posts.push(postInfo);
    }
    setPosts(postGridCache.get(location.pathname).posts);
    if (end - start < loadSize) {
      setHasMore(() => {
        postGridCache.get(location.pathname).hasMore = false;
        return false;
      });
      skeletonCount = end - start;
    }
    setLoading(false);
  }, [page, location.pathname]);

  useEffect(() => {
    if (page === 0 || hasMore) loadPosts();
  }, [page, loadPosts]);

  return (
    <>
      <p className={classes["post-grid-view-title"]}>{gridTitle}</p>
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
              <p className={classes["card-date"]}>
                {post.date.toLocaleString("en-US")}
              </p>
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
*/
