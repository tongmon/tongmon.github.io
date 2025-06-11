import { Link } from "react-router-dom";

import classes from "../learn/Learn.module.css";
import { SearchBar } from "../user_interface/searchbar/SearchBar";
import { Dropdown } from "../user_interface/dropdown/Dropdown";
import { label } from "framer-motion/client";
import { GetBlogContentTree } from "../util/GetBlogContentTree";
import { PostGrid } from "../user_interface/postgrid/PostGrid";

const dummyPosts = [
  {
    title: "React로 Velog 스타일 만들기",
    summary: "그리드 레이아웃과 카드 디자인 구현 방법을 알아봅니다.",
    date: "2025.06.10",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  {
    title: "JavaScript debounce 정리",
    summary: "짧은 시간 내 이벤트를 제어하는 방법",
    date: "2025.06.08",
    thumbnail: "https://via.placeholder.com/400x200",
  },
  // ... 더 많은 포스트
];

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
      <div className={classes["category-menu"]}>
        <SearchBar
          initialSearchKeyword="Test"
          onSearchButtonClick={(searchKeyword) => console.log(searchKeyword)}
        />
        <Dropdown item={GetLearnContentTree()} />
      </div>
      <div className={classes["content-grid"]}>
        <p>Test Posts</p>
        <PostGrid posts={dummyPosts} />
      </div>
    </div>
  );
}

/*
                <div className={classes["dropdown"]}>
                    <button className={classes["dropbtn"]}>Programming</button>
                    <div className={classes["dropdown-content"]}>
                        <li><Link to="/learn/menu2/text1">text1</Link></li>
                        <li><Link to="/learn/menu2/text2">text2</Link></li>
                        <li><Link to="/learn/menu2/text3">text3</Link></li>
                    </div>
                </div>
                <ul>
                    <li>
                        <Link to="/learn/menu2">menu2</Link>
                        <ul>
                            <li><Link to="/learn/menu2/text1">text1</Link></li>
                            <li><Link to="/learn/menu2/text2">text2</Link></li>
                            <li><Link to="/learn/menu2/text3">text3</Link></li>
                        </ul>
                    </li>
                </ul>
*/
