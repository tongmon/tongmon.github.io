import { useState } from "react";

import classes from "../../user_interface/dropdown/DropDown.module.css";

export function Dropdown({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={classes["dropdown-container"]}>
      <div className={classes["dropdown-button"]} onClick={toggleDropdown}>
        {item.label} {hasChildren && (isOpen ? "▲" : "▼")}
      </div>

      {hasChildren && isOpen && (
        <div className={classes["dropdown-content"]}>
          {item.children.map((child, idx) => (
            <Dropdown key={idx} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

// export function DropDown() {
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
