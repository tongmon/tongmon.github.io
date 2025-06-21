import classes from "./PostGridView.module.css";
import { GridView } from "../../user_interface/grid_view/GridView";

export function PostGridView({ node }) {
  var postList = [];
  console.log("PostGridView node: ", node);

  function fetchPosts(page, size) {
    if (!postList.length) {
      async function SetPostList(node, postList) {
        if (node.isLeaf) {
          let postInfo = null;
          let postThunbnail = null;
          for (const child in node.children) {
            if (child.label === "post_info.json") {
              postInfo = await child.module();
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

      SetPostList(node, postList);
      // Sort posts by date, latest will be first
      postList.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const start = page * size;
        const end = start + size;
        resolve(postList.slice(start, end));
      }, 500); // simulate delay
    });
  }

  return (
    <>
      <p className={classes["post-grid-view-title"]}>{node.label}</p>
      <GridView fetchPosts={fetchPosts} pageSize={9} />
    </>
  );
}
