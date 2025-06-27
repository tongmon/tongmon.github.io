import { useLocation } from "react-router-dom";
import { PostGridView } from "../post_grid_view/PostGridView";
import { PostView } from "../post_view/PostView";
import { GetBlogContentTree } from "../../util/GetBlogContentTree";

export function LearnPostViewRenderer() {
  console.log("LearnPostViewRenderer Called");

  const location = useLocation();
  const pathParts = location.pathname
    .replace(/^\/(Learn|learn)\/?/, "") // /Learn/ 생략
    .split("/")
    .map(decodeURIComponent);

  let currentNode = GetBlogContentTree().children.find(
    (item) => item.label === "Learn"
  );

  // All case
  if (pathParts.length === 1 && pathParts[0] === "All") {
    return <PostGridView node={currentNode} />;
  }

  for (const part of pathParts) {
    currentNode = currentNode.children.find((child) => child.label === part);
  }

  // if (!currentNode) {
  //   return <div>404 Not Found</div>; // or Navigate to error page
  // }

  return currentNode.isLeaf ? (
    <PostView node={currentNode} />
  ) : (
    <PostGridView node={currentNode} />
  );
}
