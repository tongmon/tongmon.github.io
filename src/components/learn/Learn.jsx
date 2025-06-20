import { Link, Outlet } from "react-router-dom";

import classes from "./Learn.module.css";
import { SearchBar } from "../user_interface/search_bar/SearchBar";
import { Dropdown } from "../user_interface/dropdown/Dropdown";
import { GetBlogContentTree } from "../util/GetBlogContentTree";
// import { PostGrid } from "../user_interface/postgrid/PostGrid";

// const dummyData = Array.from({ length: 100 }, (_, i) => ({
//   title: `Post ${i + 1}`,
//   summary: "요약 내용입니다.",
//   date: "2025.06.10",
//   thumbnail:
//     "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/game-characters/MC-About_Key-Art_Gather_Resources_600x800.png",
// }));

// const fetchPosts = (page, size) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const start = page * size;
//       const end = start + size;
//       resolve(dummyData.slice(start, end));
//     }, 500); // simulate delay
//   });
// };

export function Learn() {
  return (
    <div className={classes["learn-bg"]}>
      <div className={classes["sidebar-container"]}>
        <SearchBar
          initialSearchKeyword="Test"
          onSearchButtonClick={(searchKeyword) => console.log(searchKeyword)}
        />
        <div className={classes["dropdown-container"]}>
          <Dropdown
            item={GetBlogContentTree().children.find(
              (item) => item.label == "Learn"
            )}
          />
        </div>
      </div>
      <div className={classes["post-container"]}>
        <Outlet />
        {
          // <p className={classes["posts-title"]}>Test Posts</p>
          // <PostGrid fetchPosts={fetchPosts} pageSize={9} />
        }
      </div>
    </div>
  );
}
