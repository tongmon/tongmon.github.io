import { useState } from "react";
import { useNavigate, useLocation, replace } from "react-router-dom";
import { PostDataManager } from "../../util/PostDataManager";
import classes from "./Dropdown.module.css";

export function Dropdown({ item }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(item.isOpen);
  const postDataManager = new PostDataManager();
  const hasNoVisibleChildren =
    !item.children.length || item.children.every((child) => !child.isVisible);
  const toggleDropdown = () => {
    if (!item.parent || hasNoVisibleChildren) {
      var path = "";
      var node = item;
      do {
        path = "/" + node.label + path;
        node = node.parent;
      } while (node && node.parent);
      path = `/${postDataManager.getPostTree().rootPrefix}` + path;
      const navOpt =
        path === decodeURIComponent(location.pathname)
          ? { replace: true, state: "test" }
          : {};
      navigate(path, navOpt);
      return;
    }
    setIsOpen((prev) => {
      prev = !prev;
      item.isOpen = prev;
      return prev;
    });
  };

  return (
    <div className={classes["dropdown-container"]}>
      <div className={classes["dropdown-button-container"]}>
        <div className={classes["dropdown-button"]} onClick={toggleDropdown}>
          {`${item.label} (${item.childPostCnt})`}
        </div>
        <div className={classes["dropdown-flag-text"]}>
          {!hasNoVisibleChildren && item.parent && (isOpen ? "^" : "]")}
        </div>
      </div>
      {!hasNoVisibleChildren && isOpen && (
        <div className={classes["dropdown-content"]}>
          {item.children.map((child, idx) => (
            <Dropdown key={idx} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

/* 
export function Dropdown({ item }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(item.isOpen);
  const isRootChild = item.parent && !item.parent.parent;
  const hasNoVisibleChildren =
    !item.children.length || item.children.every((child) => !child.isVisible);
  const toggleDropdown = () => {
    if (hasNoVisibleChildren || isRootChild) {
      var linkStr = item.parent && item.parent.parent ? "" : "/All";
      do {
        linkStr = "/" + item.label + linkStr;
        item = item.parent;
      } while (item.parent);
      navigate(linkStr);
      return;
    }
    setIsOpen((prev) => {
      prev = !prev;
      item.isOpen = prev;
      return prev;
    });
  };

  return (
    <div className={classes["dropdown-container"]}>
      <div className={classes["dropdown-button-container"]}>
        <div className={classes["dropdown-button"]} onClick={toggleDropdown}>
          {`${item.label} (${item.childContentCnt})`}
        </div>
        <div className={classes["dropdown-flag-text"]}>
          {!hasNoVisibleChildren && !isRootChild && (isOpen ? "^" : "]")}
        </div>
      </div>
      {!hasNoVisibleChildren && isOpen && (
        <div className={classes["dropdown-content"]}>
          {item.children.map((child, idx) => (
            <Dropdown key={idx} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}
*/
