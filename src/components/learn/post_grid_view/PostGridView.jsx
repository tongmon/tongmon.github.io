import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { SkeletonCard } from "./skeleton_card/SkeletonCard";
import { PostDataManager } from "../../util/PostDataManager";
import classes from "./PostGridView.module.css";

var postGridCache = new Map();

export function PostGridView({ postList }) {
  const location = useLocation();
  const navigate = useNavigate();
  const postDataManager = new PostDataManager();
  const gridTitle = location.pathname.split("/").map(decodeURIComponent).at(-1);
  const maximumLoadSize = useRef(12); // Maximum number of posts to load at once
  const [posts, setPosts] = useState([]);
  const [loadSize, setLoadSize] = useState(maximumLoadSize.current);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.5 });

  if (!postGridCache.has(location.pathname)) {
    postGridCache.set(location.pathname, {
      posts: [],
      page: 0,
      hasMore: true,
      loadSize: maximumLoadSize.current,
    });
  }

  const loadPosts = async () => {
    const start =
      postGridCache.get(location.pathname).page *
      postGridCache.get(location.pathname).loadSize;
    const end = Math.min(
      start + postGridCache.get(location.pathname).loadSize,
      postList.length
    );
    postGridCache.get(location.pathname).loadSize = end - start;
    setLoadSize(postGridCache.get(location.pathname).loadSize);
    setLoading(true);
    let appendPosts = [];
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
      appendPosts.push(postInfo);
    }
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await sleep(1000); // Simulate network delay
    setPosts((prev) => {
      postGridCache.get(location.pathname).posts.push(...appendPosts);
      return [...prev, ...appendPosts];
    });
    if (
      postGridCache.get(location.pathname).loadSize < maximumLoadSize.current
    ) {
      postGridCache.get(location.pathname).hasMore = false;
      setHasMore(postGridCache.get(location.pathname).hasMore);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPosts(postGridCache.get(location.pathname).posts.slice());
    setHasMore(postGridCache.get(location.pathname).hasMore);
    setLoadSize(postGridCache.get(location.pathname).loadSize);
  }, [location.pathname]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadPosts();
      postGridCache.get(location.pathname).page += 1;
    }
  }, [inView, hasMore, loading]);

  const onCardClick = (idx) => {
    var node = postList[idx];
    var path = "";
    do {
      path = "/" + node.label + path;
      node = node.parent;
    } while (node && node.parent);
    path = `/${postDataManager.getPostTree().rootPrefix}` + path;
    navigate(path);
  };

  return (
    <>
      <p className={classes["post-grid-view-title"]}>{gridTitle}</p>
      <div className={classes["grid-container"]}>
        {posts.map((post, idx) => (
          <div
            className={classes["card"]}
            onClick={() => {
              onCardClick(idx);
            }}
            key={idx}
          >
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

        {hasMore && !loading && <div ref={ref} style={{ height: "1px" }} />}
      </div>
    </>
  );
}
