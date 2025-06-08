import { Link } from "react-router-dom";

import classes from "../learn/Learn.module.css";
import { SearchBar } from "../user_interface/searchbar/SearchBar";
import { Dropdown } from "../user_interface/dropdown/Dropdown";
import { label } from "framer-motion/client";
import { GetBlogContentTree } from "../util/GetBlogContentTree";

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

  return <Dropdown item={learnContentTree} />;

  //function toDropdownFormat(obj) {
  //  return Object.entries(obj).map(([key, value]) => {
  //    if (value === null) {
  //      return { label: key };
  //    } else {
  //      return { label: key, children: toDropdownFormat(value) };
  //    }
  //  });
  //}

  //let dropDownTree = {
  //  label: "Learn",
  //  count: 0,
  //  spread: true,
  //  children: [],
  //};

  //// basePath = "/src/assets/Learn";
  //let paths = Object.keys(
  //  import.meta.glob("/src/assets/Learn/**/*", { eager: true })
  //);

  //for (const fullPath of paths) {
  //  const parts = fullPath.replace("/src/assets/Learn/", "").split("/");
  //  let root = dropDownTree.children;
  //  for (let i = 0; i < parts.length; i++) {}

  //  dropDownTree.children.push({
  //    label: parts[0],
  //    count: 0,
  //    spread: true,
  //    children: [],
  //  });
  //}

  //for (const fullPath of paths) {
  //  const parts = fullPath.replace("/src/assets/Learn/", "").split("/");
  //  let current = root;

  //  for (const [index, part] of parts.entries()) {
  //    if (!current[part]) {
  //      current[part] = index === parts.length - 1 ? null : {};
  //    }
  //    current = current[part];
  //  }
  //}

  //let dropdownItems = toDropdownFormat(root);

  //return dropdownItems.map((item, index) => (
  //  <Dropdown key={index} item={item} />
  //));
}

export function Learn() {
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
