import { useState } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./Dropdown.module.css";

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

// export function Dropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//
//   const toggleDropdown = () => {
//     setIsOpen((prev) => !prev);
//   };
//
//   return (
//     <div className="dropdown-container">
//       <button className="dropdown-button" onClick={toggleDropdown}>
//         {isOpen ? "닫기 ▲" : "열기 ▼"}
//       </button>
//
//       {isOpen && (
//         <div className="dropdown-content">
//           <ul>
//             <li>항목 1</li>
//             <li>항목 2</li>
//             <li>항목 3</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
