import { useLocation } from "react-router-dom";
import { PostGridView } from "../post_grid_view/PostGridView";
import { PostView } from "../post_view/PostView";
import { PostDataManager } from "../../util/PostDataManager";

export function LearnPostViewRenderer() {
  const postDataManager = new PostDataManager();
  const location = useLocation();
  // const pathParts = location.pathname
  //   .replace(/^\/(Learn|learn)\/?/, "")
  //   .split("/")
  //   .map(decodeURIComponent);
  // const pathKey = decodeURIComponent(
  //   location.pathname.replace(/^\/(Learn|learn)\/?/, "")
  // );

  // console.log("Path Key: ", pathKey);

  // let categorizedPosts = postDataManager.getCategorizedPosts().get(pathKey);

  let categorizedPosts = postDataManager
    .getCategorizedPosts()
    .get(decodeURIComponent(location.pathname));

  // console.log("Post data manager: ", postDataManager);
  // console.log("LearnPostViewRenderer categorizedPosts: ", categorizedPosts);

  // All case
  // if (pathParts.length === 1 && pathParts[0] === "All") {
  //   return <PostGridView node={currentNode} />;
  // }

  //for (const part of pathParts) {
  //  currentNode = currentNode.children.find((child) => child.label === part);
  // }

  // if (!currentNode) {
  //   return <div>404 Not Found</div>; // or Navigate to error page
  // }

  return categorizedPosts[0] === true ? (
    <PostView node={categorizedPosts[1]} />
  ) : (
    <PostGridView postList={categorizedPosts} />
  );
}
