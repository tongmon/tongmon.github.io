import classes from "./PostGridView.module.css";
import { GridView } from "../../user_interface/grid_view/GridView";

export function PostGridView({ node }) {
  console.log("PostGridView", node);

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
    });

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
