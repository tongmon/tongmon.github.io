import { useState } from "react";

import classes from "../../user_interface/searchbar/SearchBar.module.css";

export function SearchBar({ initialSearchKeyword, onSearchButtonClick }) {
    const [searchKeyword, setSearchKeyword] = useState(initialSearchKeyword);

    function handleChange(event) {
        setSearchKeyword(event.target.value);
    }

    return (
        <div className={classes["searchbar-box"]}>
            <input type="text" required value={searchKeyword} onChange={handleChange} />
            <button onClick={() => onSearchButtonClick(searchKeyword)}>Test</button>
        </div>
    );
}


/*
        <li className={isActive ? "active" : undefined}>
            <span className="player">
                {editablePlayerName}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
        </li>
*/