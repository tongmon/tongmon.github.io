import { Link } from "react-router-dom";

import classes from "../learn/Learn.module.css";
import { SearchBar } from "../user_interface/searchbar/SearchBar";
import { Dropdown } from "../user_interface/dropdown/Dropdown";
import { label } from "framer-motion/client";
import { GetBlogContentTree } from "../util/GetBlogContentTree";

export function Learn() {
  function CreateLearnDropDowns() {
    let blogContentTree = GetBlogContentTree();
    let learnContentTree = undefined;
    for (
      var i = 0;
      i < blogContentTree.children.length && learnContentTree == undefined;
      i++
    ) {
      if ((learnContentTree = blogContentTree.children[i].label === "Learn")) {
        learnContentTree = blogContentTree.children[i];
      }
    }
    function RemoveLeaf(node) {
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].isLeaf) {
          node.children.splice(i, 1);
          i--;
        } else {
          RemoveLeaf(node.children[i]);
        }
      }
    }

    RemoveLeaf(learnContentTree);

    return <Dropdown item={learnContentTree} />;
  }

  return (
    <div className={classes["learn-bg"]}>
      <div className={classes["category-menu"]}>
        <SearchBar
          initialSearchKeyword="Test"
          onSearchButtonClick={(searchKeyword) => console.log(searchKeyword)}
        />
        {CreateLearnDropDowns()}
      </div>
      <div className={classes["content-grid"]}>2</div>
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
