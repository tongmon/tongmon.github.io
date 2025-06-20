import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import classes from "./GridView.module.css";
import { SkeletonCard } from "./skeleton_card/SkeletonCard";

export function GridView({ fetchPosts, pageSize = 9 }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.5 });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const newPosts = await fetchPosts(page, pageSize);
    setPosts((prev) => [...prev, ...newPosts]);
    if (newPosts.length < pageSize) setHasMore(false);
    setLoading(false);
  }, [page, fetchPosts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    if (page === 0 || hasMore) loadPosts();
  }, [page, loadPosts]);

  return (
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
        Array.from({ length: pageSize }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}

      {hasMore && <div ref={ref} style={{ height: "1px" }} />}
    </div>
  );
}
