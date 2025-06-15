// import React from "react";
// import classes from "../../user_interface/postgrid/PostGrid.module.css";

// import React, { useEffect, useState, useCallback } from "react";
// import { useInView } from "react-intersection-observer";
// import classes from "./PostGrid.module.css";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import classes from "./PostGrid.module.css";
import { SkeletonCard } from "./skeletoncard/SkeletonCard";

/* 
export function PostGrid({ posts }) {
  return (
    <div className={classes["grid-container"]}>
      {posts.map((post, idx) => (
        <div className={classes["card"]} key={idx}>
          <img
            src={post.thumbnail}
            alt="thumbnail"
            className={classes["card-thumbnail"]}
          />
          <div className={classes["card-content"]}>
            <h3 className={classes["card-title"]}>{post.title}</h3>
            <p className={classes["card-summary"]}>{post.summary}</p>
            <p className={classes["card-date"]}>{post.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
*/

export function PostGrid({ fetchPosts, pageSize = 9 }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // 추가

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

/* 
export function PostGrid({ fetchPosts, pageSize }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const pageRef = useRef(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newPosts = await fetchPosts(pageRef.current, pageSize);
    setPosts((prev) => [...prev, ...newPosts]);
    pageRef.current += 1;
    setHasMore(newPosts.length === pageSize);
    setLoading(false);
  }, [fetchPosts, pageSize, loading, hasMore]);

  const observerCallback = useCallback(
    ([entry]) => {
      if (entry.isIntersecting && !loading) {
        loadMore();
      }
    },
    [loadMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1.0,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div className="grid-container">
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
      <div ref={loaderRef} />
    </div>
  );
}
*/
