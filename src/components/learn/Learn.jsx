import { useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "../user_interface/search_bar/SearchBar";
import { Dropdown } from "../user_interface/dropdown/Dropdown";
import { PostDataManager } from "../util/PostDataManager";
import classes from "./Learn.module.css";

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

export function Learn({ scrollDivQuery }) {
  const location = useLocation();
  let postDataManager = new PostDataManager();

  useEffect(() => {
    scrollDivQuery.current = `.${classes["learn-bg"]}`;
  }, [location.pathname]);

  return (
    <div className={classes["learn-bg"]}>
      <div className={classes["sidebar-container"]}>
        <SearchBar
          initialSearchKeyword="Test"
          onSearchButtonClick={(searchKeyword) => console.log(searchKeyword)}
        />
        <div className={classes["dropdown-container"]}>
          <Dropdown item={postDataManager.getPostTree()} />
        </div>
      </div>
      <div className={classes["post-container"]}>
        <Outlet />
      </div>
    </div>
  );
}

// <Outlet key={location.pathname} />
