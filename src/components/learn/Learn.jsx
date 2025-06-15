import { Link } from "react-router-dom";

import classes from "../learn/Learn.module.css";
import { SearchBar } from "../user_interface/searchbar/SearchBar";
import { Dropdown } from "../user_interface/dropdown/Dropdown";
import { label } from "framer-motion/client";
import { GetBlogContentTree } from "../util/GetBlogContentTree";
import { PostGrid } from "../user_interface/postgrid/PostGrid";

const dummyData = Array.from({ length: 100 }, (_, i) => ({
  title: `Post ${i + 1}`,
  summary: "요약 내용입니다.",
  date: "2025.06.10",
  thumbnail:
    "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/game-characters/MC-About_Key-Art_Gather_Resources_600x800.png",
}));

const fetchPosts = (page, size) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * size;
      const end = start + size;
      resolve(dummyData.slice(start, end));
    }, 500); // simulate delay
  });
};

let learnContentTree = null;

export function Learn() {
  function GetLearnContentTree() {
    if (learnContentTree) return learnContentTree;

    let blogContentTree = GetBlogContentTree();
    for (
      var i = 0;
      i < blogContentTree.children.length && learnContentTree == null;
      i++
    ) {
      if (blogContentTree.children[i].label === "Learn") {
        learnContentTree = blogContentTree.children[i];
      }
    }
    learnContentTree.parent = null;

    function ShiftLeaf(node, isTopSide = true) {
      if (node.isLeaf) {
        if (isTopSide && node.parent != null) {
          node.parent.isLeaf = true;
          node.isLeaf = false;
        } else if (!isTopSide && node.children.length > 0) {
          node.isLeaf = false;
          for (let i = 0; i < node.children.length; i++) {
            node.children;
            [i].isLeaf = true;
          }
        }
        return;
      }
      for (let i = 0; i < node.children.length; i++) {
        ShiftLeaf(node.children[i], isTopSide);
      }
    }

    ShiftLeaf(learnContentTree, true);

    return learnContentTree;
  }

  return (
    <div className={classes["learn-bg"]}>
      <div className={classes["sidebar-container"]}>
        <SearchBar
          initialSearchKeyword="Test"
          onSearchButtonClick={(searchKeyword) => console.log(searchKeyword)}
        />
        <div className={classes["dropdown-container"]}>
          <Dropdown item={GetLearnContentTree()} />
        </div>
      </div>
      <div className={classes["post-container"]}>
        <p className={classes["posts-title"]}>Test Posts</p>
        <PostGrid fetchPosts={fetchPosts} pageSize={9} />
      </div>
    </div>
  );
}
