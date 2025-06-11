import React from "react";
import classes from "../../user_interface/postgrid/PostGrid.module.css";

export function PostGrid({ posts }) {
  return (
    <div className={classes["grid-container"]}>
      {posts.map((post, idx) => (
        <div className={classes["card"]} key={idx}>
          <img
            src={post.thumbnail}
            alt="thumbnail"
            className="card-thumbnail"
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
