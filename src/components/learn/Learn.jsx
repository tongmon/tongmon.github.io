import { Link } from "react-router-dom";

import classes from "../learn/Learn.module.css";
import { SearchBar } from "../user_interface/searchbar/SearchBar";
import { DropDown } from "../user_interface/dropdown/DropDown";

function CreateLearnDropDowns() {
  function toDropdownFormat(obj) {
    return Object.entries(obj).map(([key, value]) => {
      if (value === null) {
        return { label: key };
      } else {
        return { label: key, children: toDropdownFormat(value) };
      }
    });
  }

  basePath = "/src/assets/Learn";
  paths = Object.keys(import.meta.glob(`${basePath}/**/*`, { eager: true }));
  for (const fullPath of paths) {
    const parts = fullPath.replace(`${basePath}/`, "").split("/");
    let current = root;

    for (const [index, part] of parts.entries()) {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {};
      }
      current = current[part];
    }
  }

  dropdownItems = toDropdownFormat(root);

  return dropdownItems.map((item, index) => (
    <DropDown key={index} item={item} />
  ));
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
