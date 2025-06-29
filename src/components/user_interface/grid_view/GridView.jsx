import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import classes from "./GridView.module.css";
import { SkeletonCard } from "./skeleton_card/SkeletonCard";

export function GridView({ fetchPosts, totalCount, pageSize = 9 }) {
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

  // Reset posts and pagination when fetchPosts changes
  // !Need to write the cache logic to avoid unnecessary re-fetching
  // useEffect는 Outlet 컴포넌트가 마운트될 때마다 실행되는 것 확인함 (Outlet에 key를 주던 안주던)
  useEffect(() => {
    // setPosts([]);
    // setPage(0);
    // setHasMore(true);
  }, [fetchPosts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    if (page === 0 || hasMore) loadPosts();
  }, [page, loadPosts]);

  const remainingCount = totalCount ? totalCount - posts.length : pageSize;
  const skeletonCount = Math.min(remainingCount, pageSize);

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
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}

      {hasMore && <div ref={ref} style={{ height: "1px" }} />}
    </div>
  );
}

/*
export function GridView({ fetchPosts, totalCount, pageSize = 9 }) {
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

  // Reset posts and pagination when fetchPosts changes
  // !Need to write the cache logic to avoid unnecessary re-fetching
  // useEffect는 Outlet 컴포넌트가 마운트될 때마다 실행되는 것 확인함 (Outlet에 key를 주던 안주던)
  useEffect(() => {
    // setPosts([]);
    // setPage(0);
    // setHasMore(true);
  }, [fetchPosts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    if (page === 0 || hasMore) loadPosts();
  }, [page, loadPosts]);

  const remainingCount = totalCount ? totalCount - posts.length : pageSize;
  const skeletonCount = Math.min(remainingCount, pageSize);

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
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}

      {hasMore && <div ref={ref} style={{ height: "1px" }} />}
    </div>
  );
}
*/
